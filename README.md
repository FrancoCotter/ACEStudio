<p align="center">
  <img src="https://img.shields.io/badge/%E2%99%AB-ACEStudio-b6d6c6?style=for-the-badge&labelColor=1a1a1a" alt="ACEStudio" height="54">
</p>

<h1 align="center">ACEStudio</h1>

<p align="center">
  <strong>A local-first AI music studio for ACE-Step 1.5</strong><br>
  <em>Generation, synced lyrics, visualizers, library playback, and local workflow tuning.</em>
</p>

<p align="center">
  <a href="https://github.com/FrancoCotter/ace-step-ui">
    <img src="https://img.shields.io/badge/Studio-Repo-1a1a1a?style=for-the-badge&logo=github" alt="Studio repo">
  </a>
  <a href="https://x.com/Mariano_arti">
    <img src="https://img.shields.io/badge/Follow-@Mariano__arti-b6d6c6?style=for-the-badge&logo=x&logoColor=111111" alt="Follow Mariano on X">
  </a>
  <a href="https://github.com/fspecii/ace-step-ui">
    <img src="https://img.shields.io/badge/Based_on-ACE--Step_UI-4b5563?style=for-the-badge&logo=github" alt="Original ACE-Step UI">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-Local-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/SQLite-Local_First-003B57?style=flat-square&logo=sqlite" alt="SQLite">
  <img src="https://img.shields.io/badge/ACE--Step-1.5-8fb68f?style=flat-square" alt="ACE-Step 1.5">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-what-changed">What Changed</a> •
  <a href="#-features">Features</a> •
  <a href="#-setup">Setup</a> •
  <a href="#-running">Running</a> •
  <a href="#-local-data">Local Data</a> •
  <a href="#-credits--links">Credits & Links</a>
</p>

---

## 🎧 About

ACEStudio is a local-first music generation studio customized around
[ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5).

This repository started from the original
[ACE-Step UI](https://github.com/fspecii/ace-step-ui) by
[Ambsd](https://x.com/AmbsdOP), then evolved into a personal desktop workflow
for local music generation, lyric review, video creation, and library playback.

It is not an official ACE-Step project. It is a practical local fork/custom UI
for people who want to run ACE-Step on their own machine.

---

## ✨ What Changed

This fork is no longer only a small UI tweak. The current version changes the
generation flow, local fallback behavior, lyrics handling, playback UX, video
tools, and overall product direction.

### 🧠 Generation and ACE-Step Integration

- Updated parameter mapping for newer ACE-Step 1.5 payloads.
- Added stronger Python fallback support when Gradio is unavailable or too
  memory-heavy.
- Improved ACE-Step path resolution through `ACESTEP_PATH`, sibling-folder
  detection, and local environment configuration.
- Added support for newer DiT model labels such as `1.5T` and `1.5XL-T` in the
  library UI.
- Added safer handling for LLM / thinking mode options and user-facing VRAM
  hints.
- Added score parsing for ACE-Step scorer output, including global PMI quality
  and lyric alignment scores when available.

### 🎙️ Lyrics

- Added LRC / WebVTT loading, parsing, and conversion.
- Added static lyrics fallback when no synced lyrics are available.
- Cleaned section labels such as `[Verse]`, `[Chorus]`, `[Bridge]`, and
  instrumental-only tags from display output.
- Added dynamic lyrics in Song Profile and fullscreen playback.
- Added clickable synced lyric lines for seeking.
- Added persistent in-session lyrics visibility while navigating between songs.
- Added LRC badges in song lists only when a real synced lyric file exists.

### 🎛️ Playback and Library UX

- Reworked the bottom player and fullscreen player behavior.
- Added cover-color based fullscreen backgrounds.
- Improved cover caching and preloading for smoother next / previous switching.
- Improved view count / play count consistency between Song Profile and Song
  Details.
- Removed accidental play behavior from library rows so playback starts from
  explicit play controls.
- Added better selection and bulk-delete controls in the workspace list.
- Removed the old SaaS-like sign-out emphasis for a more local-tool feel.

### 🎬 Video Studio

- Expanded the video generator modal with more practical controls.
- Improved Pexels search behavior, paging, and search reset behavior.
- Preserved selected media while resetting the search modal state.
- Added random color preset generation with filtered palettes.
- Improved lyric rendering in exported videos.
- Preserved video motion instead of reducing selected video media to static
  imagery where possible.

### 🎨 Visual Direction

- Renamed the UI direction to ACEStudio.
- Forced the app into a dark, local-studio default.
- Reworked many active colors away from bright pink / purple toward muted green
  and Morandi-inspired tones.
- Updated the sidebar logo, badges, buttons, sliders, likes, and active states.
- Added desktop-only gating for touch/mobile layouts that are not yet designed.
- Reworked Settings / About to credit both the local customization and the
  original project.

---

## 🚀 Features

| Area | Highlights |
| --- | --- |
| **Music generation** | Custom lyrics, style prompts, metadata, BPM/key/time controls, batch and bulk workflows |
| **ACE-Step modes** | Gradio API path plus Python fallback path for local workflows |
| **Lyrics** | Static lyrics, dynamic LRC/VTT lyrics, clickable seek, fullscreen lyric stage |
| **Library** | Search, likes, playlists, song details, play counts, cached covers |
| **Video Studio** | Pexels search, visual presets, lyric rendering, random color palettes |
| **Scores** | ACE-Step diagnostic score display when scorer output is available |
| **Local-first data** | SQLite database, local audio files, local cover cache |

---

## 🖥️ Current Status

ACEStudio is currently a local personal fork rather than a polished upstream
release. It works best as a desktop app running on the same machine as your
ACE-Step environment.

Recommended use:

- Desktop browser.
- Local backend.
- ACE-Step 1.5 installed separately.
- Python fallback for lower-VRAM workflows.
- Gradio API when your machine has enough VRAM and the backend is stable.

---

## 📋 Requirements

| Requirement | Notes |
| --- | --- |
| **Node.js** | 18 or newer |
| **Python** | 3.10+ / 3.11 recommended |
| **ACE-Step 1.5** | Required for real generation |
| **FFmpeg** | Recommended for audio metadata and processing |
| **GPU** | NVIDIA CUDA recommended; lower VRAM works better with fallback / PT mode |
| **Pexels API key** | Optional, only needed for Pexels video/image search |

---

## ⚙️ Setup

ACEStudio keeps the original script-based setup flow. The scripts install
frontend dependencies, install backend dependencies, create `server/.env` when
needed, and prepare the local data folder.

### Windows

```batch
cd ace-step-ui
setup.bat
```

### macOS / Linux

```bash
cd ace-step-ui
chmod +x setup.sh start.sh start-all.sh stop-all.sh
./setup.sh
```

By default, the scripts look for ACE-Step 1.5 next to this folder:

```text
../ACE-Step-1.5
```

If your ACE-Step folder is somewhere else, set `ACESTEP_PATH` before running the
scripts.

Windows:

```batch
set ACESTEP_PATH=C:\path\to\ACE-Step-1.5
setup.bat
```

macOS / Linux:

```bash
export ACESTEP_PATH=/path/to/ACE-Step-1.5
./setup.sh
```

Important backend environment values live in `server/.env`:

```env
PORT=3001
FRONTEND_PORT=3000
DATABASE_PATH=./data/acestep.db
ACESTEP_API_URL=http://localhost:8001
ACESTEP_PATH=/path/to/ACE-Step-1.5
PYTHON_PATH=/path/to/python
PEXELS_API_KEY=optional_key_here
```

On macOS, `ACESTEP_PATH` can also point to a symlink created with `ln -s`, as
long as the resolved path contains the ACE-Step source and its Python
environment can run generation.

---

## ▶️ Running

There are two normal ways to run the app.

### Option A: Start Everything With One Script

Use this when you want the script to launch ACE-Step API, backend, and frontend
together.

Windows:

```batch
cd ace-step-ui
start-all.bat
```

macOS / Linux:

```bash
cd ace-step-ui
./start-all.sh
```

The all-in-one script starts:

| Service | URL |
| --- | --- |
| ACE-Step API | http://localhost:8001 |
| Backend | http://localhost:3001 |
| Frontend | http://localhost:3000 |

### Option B: Start ACE-Step Yourself, Then Start ACEStudio

Use this when you prefer to launch ACE-Step manually, or when you want more
control over backend, model, and VRAM settings.

Start ACE-Step API first.

Standard install:

```bash
cd /path/to/ACE-Step-1.5
uv run acestep --port 8001 --enable-api --backend pt --server-name 127.0.0.1
```

Windows portable ACE-Step build:

```batch
cd C:\ACE-Step-1.5
python_embeded\python -m acestep --port 8001 --enable-api --backend pt --server-name 127.0.0.1
```

Then start ACEStudio.

Windows:

```batch
cd ace-step-ui
start.bat
```

macOS / Linux:

```bash
cd ace-step-ui
./start.sh
```

Open:

```text
http://localhost:3000
```

To stop services launched by the macOS / Linux all-in-one script:

```bash
./stop-all.sh
```

---

## 🗂️ Local Data

Generated songs, cached covers, databases, and uploaded audio are local runtime
data. Before sharing this folder with someone else, usually remove:

- `node_modules/`
- `server/node_modules/`
- `dist/`
- `server/data/` if you do not want to share your library/database
- `server/public/audio/` if you do not want to share generated audio
- `server/public/covers/` if you do not want to share cached covers
- `server/.env` if it contains personal paths or API keys

Keep placeholder files such as `.gitkeep` when present so empty folders still
exist after cloning.

---

## 📈 Notes on Lyrics and Scores

Synced lyrics depend on whether ACE-Step returns or saves a real LRC / VTT file.
If no synced file exists, ACEStudio falls back to static lyrics display.

The score modal shows diagnostic values from ACE-Step when available. These
scores are useful for comparing takes, not for declaring whether a song is
"good" in a musical or artistic sense.

---

## 🙏 Credits & Links

| Project / Person | Role |
| --- | --- |
| [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) | Local AI music generation engine |
| [Ambsd](https://x.com/AmbsdOP) / [Original ACE-Step UI](https://github.com/fspecii/ace-step-ui) | Original UI project this fork/customization started from |
| [Mariano](https://x.com/Mariano_arti) / [ACEStudio repo](https://github.com/FrancoCotter/ace-step-ui) | Local studio customization and workflow direction |
| [AudioMass](https://github.com/pkalogiros/AudioMass) | Browser audio editor |
| [Demucs](https://github.com/facebookresearch/demucs) | Stem separation |
| [Pexels](https://www.pexels.com) | Optional stock image/video search |

---

## 📄 License

This project follows the license of the original repository. See
[LICENSE](LICENSE) for details.

<p align="center">
  <strong>ACEStudio is a local music workspace, shaped for hands-on ACE-Step experiments.</strong>
</p>
