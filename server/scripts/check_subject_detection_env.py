"""Verify the Python environment used for subject detection."""
import json
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = PROJECT_ROOT / "models"
DEFAULT_MODEL_CANDIDATES = (
    "blaze_face_short_range.tflite",
    "blaze_face_full_range.tflite",
    "blaze_face_full_range_sparse.tflite",
)


def main() -> int:
    report = {
        "python": sys.executable,
        "python_version": sys.version.split()[0],
        "opencv": None,
        "mediapipe": None,
        "mediapipe_solutions": False,
        "mediapipe_tasks": False,
        "face_models_found": [],
    }

    try:
        import cv2  # type: ignore

        report["opencv"] = getattr(cv2, "__version__", "unknown")
    except Exception as error:  # pragma: no cover - runtime diagnostic
        report["error"] = f"opencv import failed: {type(error).__name__}: {error}"
        print(json.dumps(report, ensure_ascii=True, indent=2))
        return 1

    try:
        import mediapipe as mp  # type: ignore

        report["mediapipe"] = getattr(mp, "__version__", "unknown")
        report["mediapipe_solutions"] = hasattr(mp, "solutions")
        tasks = getattr(mp, "tasks", None)
        report["mediapipe_tasks"] = bool(
            tasks and (
                (hasattr(tasks, "BaseOptions") and hasattr(tasks, "vision"))
                or (
                    hasattr(tasks, "python")
                    and hasattr(tasks.python, "BaseOptions")
                    and hasattr(tasks.python, "vision")
                )
            )
        )
    except Exception as error:  # pragma: no cover - runtime diagnostic
        report["error"] = f"mediapipe import failed: {type(error).__name__}: {error}"
        print(json.dumps(report, ensure_ascii=True, indent=2))
        return 1

    report["face_models_found"] = [
        str((MODEL_DIR / name).resolve())
        for name in DEFAULT_MODEL_CANDIDATES
        if (MODEL_DIR / name).exists()
    ]
    print(json.dumps(report, ensure_ascii=True, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
