# Kira Talent Interview Simulator

A browser-based interview simulator for University of Waterloo Engineering and University of Toronto Engineering applicants. Record video responses to real admissions interview questions, review your performance, and generate grading prompts for AI analysis.

**No external API calls.** Everything runs client-side. You download your recordings and optionally paste them + the grading prompt into Google AI Studio (Gemini) for evaluation.

## Features

- **126 interview questions** — 93 general practice + 13 Waterloo-specific + 20 UofT-specific, tagged by priority (core vs. supplementary)
- **Simulation mode** — timed prep + recording with auto-stop (mimics Kira Talent)
- **Practice mode** — untimed, record at your own pace
- **University filter** — practice only your target school's real questions
- **Core/All toggle** — narrow to the most frequently asked questions for each school
- **Filler word counter** — detects "um", "uh", "like", etc.
- **WPM calculator** — tracks your speaking pace
- **Session history** — stored in localStorage
- **Grading prompt** — generates a structured prompt for Gemini with weighted scoring rubrics
- **Video download** — save recordings as .webm files

## Question Sources

- **Waterloo Engineering:** Official AIF questions, Engineering Video Interview prompt, Systems Design Engineering interview question, Software Engineering programming question
- **UofT Engineering:** Official OSP Personal Profile written and video questions (confirmed from discover.engineering.utoronto.ca and student reports)
- **General:** Common engineering interview questions across all categories

## Setup

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Usage

1. Select your target university (or "All" for general practice)
2. Choose Core Questions (most likely to be asked) or All Questions
3. Pick question categories (Behavioral, Problem Solving, Personal Engineering)
4. Select Simulation (timed) or Practice (untimed) mode
5. Record your video response — camera and microphone access required
6. Review metrics (WPM, filler words) and watch your recording
7. **Copy the Grading Prompt →** paste into Google AI Studio (Gemini) with your video for evaluation

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Web Speech API (transcription)
- MediaRecorder API (video capture)
