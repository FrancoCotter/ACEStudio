"""Detect a face and print normalized focus coordinates as JSON.

Image bytes are read from stdin so uploaded files never need to be written to disk.
MediaPipe is used when available; OpenCV's built-in face detector is the fallback.
"""
import json
import sys


def result(kind="center", confidence=0.0, box=None, detector="unavailable"):
    if box is None:
        box = (0.25, 0.15, 0.5, 0.7)
    x, y, w, h = box
    # For a person/upper-body box the face is normally near the upper sixth.
    focus_y = y + h * (0.48 if kind == "face" else 0.16 if kind == "person" else 0.5)
    return {
        "kind": kind,
        "confidence": round(float(confidence), 4),
        "detector": detector,
        "box": {"x": x, "y": y, "width": w, "height": h},
        "focus": {"x": min(1.0, max(0.0, x + w / 2)), "y": min(1.0, max(0.0, focus_y))},
    }


def main():
    try:
        import cv2
        import numpy as np

        data = np.frombuffer(sys.stdin.buffer.read(), dtype=np.uint8)
        image = cv2.imdecode(data, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("unsupported image")
        height, width = image.shape[:2]

        # MediaPipe's detector is more robust for angled and partially visible faces.
        try:
            import mediapipe as mp
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            with mp.solutions.face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.42) as detector:
                detections = detector.process(rgb).detections or []
            if detections:
                detection = max(detections, key=lambda item: item.score[0])
                box = detection.location_data.relative_bounding_box
                normalized = (
                    max(0.0, box.xmin), max(0.0, box.ymin),
                    min(1.0 - max(0.0, box.xmin), box.width),
                    min(1.0 - max(0.0, box.ymin), box.height),
                )
                print(json.dumps(result("face", detection.score[0], normalized, "mediapipe")))
                return
        except Exception:
            pass

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        # Try several cascades: occluded eyes often defeat a single frontal model.
        face_candidates = []
        for cascade_name in ("haarcascade_frontalface_alt2.xml", "haarcascade_frontalface_default.xml"):
            cascade = cv2.CascadeClassifier(cv2.data.haarcascades + cascade_name)
            face_candidates.extend(cascade.detectMultiScale(
                gray, scaleFactor=1.06, minNeighbors=3, minSize=(28, 28)
            ))

        profile = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")
        face_candidates.extend(profile.detectMultiScale(
            gray, scaleFactor=1.06, minNeighbors=3, minSize=(28, 28)
        ))
        flipped_faces = profile.detectMultiScale(
            cv2.flip(gray, 1), scaleFactor=1.06, minNeighbors=3, minSize=(28, 28)
        )
        face_candidates.extend((width - x - w, y, w, h) for x, y, w, h in flipped_faces)

        # Reject common false positives such as feet, phones and fabric patterns.
        # A hero portrait's useful face should be in the upper ~65% of the source.
        face_candidates = [
            (x, y, w, h) for x, y, w, h in face_candidates
            if 0.68 <= (w / max(h, 1)) <= 1.45
            and 0.0007 <= ((w * h) / (width * height)) <= 0.18
            and ((y + h * 0.5) / height) <= 0.65
        ]

        if face_candidates:
            # Prefer a substantial face near the upper part of the image.
            x, y, w, h = max(
                face_candidates,
                key=lambda item: (item[2] * item[3]) * (1.35 - (item[1] + item[3] * 0.5) / height)
            )
            print(json.dumps(result("face", 0.72, (x / width, y / height, w / width, h / height), "opencv")))
            return

        # If facial features are covered, use the upper-body box to estimate the head.
        upper_body = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_upperbody.xml")
        bodies = upper_body.detectMultiScale(
            gray, scaleFactor=1.05, minNeighbors=3,
            minSize=(max(40, width // 12), max(40, height // 12))
        )
        if len(bodies):
            x, y, w, h = max(bodies, key=lambda item: int(item[2]) * int(item[3]))
            print(json.dumps(result("person", 0.55, (x / width, y / height, w / width, h / height), "opencv")))
            return

        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())
        scale = min(1.0, 1000.0 / max(width, height))
        scan = cv2.resize(image, None, fx=scale, fy=scale) if scale < 1 else image
        bodies, weights = hog.detectMultiScale(scan, winStride=(8, 8), padding=(8, 8), scale=1.05)
        if len(bodies):
            index = max(range(len(bodies)), key=lambda i: float(weights[i]))
            x, y, w, h = bodies[index]
            x, y, w, h = x / scale, y / scale, w / scale, h / scale
            print(json.dumps(result("person", float(weights[index]), (x / width, y / height, w / width, h / height), "opencv")))
            return

        print(json.dumps(result(detector="opencv")))
        return

    except Exception:
        pass

    print(json.dumps(result()))


if __name__ == "__main__":
    main()
