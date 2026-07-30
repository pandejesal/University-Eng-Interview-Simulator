# Kira Talent Interview Simulator

A browser-based interview simulator for University of Waterloo Engineering and University of Toronto Engineering applicants. Record video responses to real admissions interview questions, review your performance, and generate grading prompts for AI analysis.

**100% client-side — no external API calls.** Your recordings never leave your machine.

## Features

**126 Interview Questions**
- 93 general practice questions across behavioral, problem-solving, and personal engineering categories
- 13 University of Waterloo Engineering–specific questions with exact Kira timings (30s prep / 90s response)
- 20 University of Toronto Engineering–specific questions with official OSP timings (varies by question)
- All questions tagged by university and priority (core vs. supplementary)

**Kira-Accurate Timings** — Each question carries its own `prepTime` and `responseTime` in seconds, matching the real platform's limits.

**Simulation Mode** — Timed prep + timed recording with auto-stop. A countdown shows remaining prep/recording time. Double beep signals recording start, single beep signals end.

**Practice Mode** — Untimed. Record at your own pace, stop when ready.

**Device Check Screen** — Before starting, a screen verifies camera and microphone with a live feed and mic level indicator bars.

**University Filter** — Practice only your target school's questions (Waterloo, UofT, or all).

**Core / All Toggle** — Narrow to the most frequently asked ("high priority") questions for each school, or see everything.

**Question Text Hidden During Recording** — Matches Kira Talent behavior: the prompt is visible during prep and disappears once recording begins.

**Page Transitions** — Each screen fades in with a smooth animation.

**Mobile Responsive** — Grids, padding, font sizes, and mic bars adapt to small screens.

**Live Speech-to-Text** — Web Speech API provides a real-time transcript during recording (browser dependent).

**Filler Word Counter** — Detects "um", "uh", "like", "actually", "basically", etc.

**WPM Calculator** — Tracks your speaking pace against the 140–170 WPM engineering interview target.

**Session History** — Past sessions stored in localStorage with date, mode, WPM, and filler word counts per question.

**Grading Prompt Generator** — Produces a structured evaluation prompt tailored to the question's university, category, and response duration. Works with any multimodal AI.

**Video Download** — Recordings saved as `.webm` files. Bulk download all recordings from a session.

**Copy All Prompts** — Copy grading prompts for all questions in a session at once for batch evaluation.

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

1. **Select target university** — All Universities, University of Waterloo, or University of Toronto
2. **Choose priority** — Core Questions (most likely to be asked at your selected school) or All Questions
3. **Pick categories** — Behavioral (teamwork & ethics), Problem Solving (Fermi estimates, logic puzzles), Personal Engineering (motivations & experience)
4. **Choose mode** — Simulation (timed with auto-stop) or Practice (untimed)
5. **Device check** — Camera and microphone preview before the interview starts
6. **Answer questions** — For each of 3 questions: read the prompt during prep time, then record your video response. The question hides once recording starts.
7. **Review** — After each answer, review your recording, transcript, WPM, and filler words
8. **Download** — Save recordings locally as `.webm`
9. **Get graded** — Copy the grading prompt and paste it alongside your video into any AI that accepts file + text prompts (Gemini, Claude, ChatGPT, etc.)

## Grading Prompt

The generated prompt turns any AI into a ruthless admissions evaluator with:

- **University-specific context** — adapts to Waterloo or UofT admissions officer persona
- **Reference data** — the exact question asked, your transcript, WPM, filler words, and actual recording duration
- **Category-specific rubric** — behavioral (STAR method), problem-solving (logical reasoning), or personal engineering (technical depth)
- **6 scoring dimensions** (1–10, weighted per category):
  1. Substance & Content
  2. Structure & Logic
  3. Relevance
  4. Engineering Alignment
  5. Delivery & Clarity (video-assessed)
  6. Confidence & Poise (video-assessed)
- **Fluff & jargon penalty** — flags clichés like "think outside the box", "leverage", "synergy"
- **Video observation checklist** — pace, eye contact, body language, vocal tone
- **Structured output format** — Overall Score, Dimension Scores, STAR/Logical/Tech Breakdown, Delivery Notes, Fluff Flagged, Brutal Improvement Points, What Worked

Works with any multimodal AI: Gemini (Google AI Studio), Claude, ChatGPT, etc.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Web Speech API (live transcription)
- MediaRecorder API (video capture)
