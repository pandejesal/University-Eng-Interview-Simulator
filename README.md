# Kira Talent Interview Simulator

A browser-based interview simulator for University of Waterloo Engineering, University of Toronto Engineering, and UBC Engineering Personal Profile applicants. Record video responses to real admissions interview questions or practise written Personal Profile prompts, review your performance, and generate grading prompts for AI analysis.

**100% client-side — no external API calls.** Your recordings never leave your machine.

## Features

**133 Interview Questions**
- 93 general practice questions across behavioral, problem-solving, and personal engineering categories
- 13 University of Waterloo Engineering–specific questions with exact Kira timings
- 20 University of Toronto Engineering–specific questions with official OSP timings
- 6 University of British Columbia Personal Profile **official** questions (written format)
- All questions tagged by university and priority (core vs. supplementary)

**Kira-Accurate Timings** — Each question carries its own `prepTime` and `responseTime` in seconds, matching the real platform's limits.

**Simulation Mode** — Timed prep + timed recording with auto-stop. A countdown shows remaining prep/recording time. Double beep signals recording start, single beep signals end. Camera preview visible during prep.

**Practice Mode** — Untimed. Record at your own pace, stop when ready.

**Writing Mode (UBC Personal Profile)** — Textarea with 2,100-character limit, word counter, plagiarism reminder. No camera or microphone needed. Submit written responses for evaluation.

**Device Check Screen** — Before video sessions, a screen verifies camera and microphone with a live feed and mic level indicator bars. Skipped for writing mode.

**University Filter** — Filter by All Universities, University of Waterloo, or University of Toronto. UBC (Personal Profile) is a separate standalone toggle below.

**UBC Individual Question Selection** — When UBC (Personal Profile) is active, all 6 official questions are shown with individual checkboxes. Select specific questions to practise or use Select All.

**Core / All Toggle** — Narrow to the most frequently asked ("high priority") questions for each school (hidden for UBC).

**Question Text Hidden During Recording** — Matches Kira Talent behavior: the prompt is visible during prep and disappears once recording begins.

**Page Transitions** — Each screen fades in with a smooth animation.

**Mobile Responsive** — Grids, padding, font sizes, and mic bars adapt to small screens.

**Live Speech-to-Text** — Web Speech API provides a real-time transcript during recording (browser dependent).

**Filler Word Counter** — Detects "um", "uh", "like", "actually", "basically", etc.

**WPM Calculator** — Tracks your speaking pace against the 140–170 WPM engineering interview target.

**Session History** — Past sessions stored in localStorage with date, mode, WPM, and filler word counts per question.

**Grading Prompt Generator** — Produces a structured evaluation prompt tailored to the question's university, category, and response duration. Completely different prompts for video interviews vs. written UBC Personal Profile.

**Video Download** — Recordings saved as `.webm` files. Bulk download all recordings from a session.

**Copy All Prompts** — Copy grading prompts for all questions in a session at once for batch evaluation.

> **⚠ UBC Personal Profile AI Warning:** Do NOT use AI to write or rewrite your Personal Profile. The evaluation prompt will only help you identify what to improve — it will not write or rewrite for you. UBC actively uses AI detectors and submitting AI-generated content can result in immediate rejection or blacklisting.

## Question Sources

- **Waterloo Engineering:** Official AIF questions, Engineering Video Interview prompt, Systems Design Engineering interview question, Software Engineering programming question
- **UofT Engineering:** Official OSP Personal Profile written and video questions (confirmed from discover.engineering.utoronto.ca and student reports)
- **UBC Engineering:** Official Personal Profile questions from the UBC application portal (applicable to ALL UBC programs including Engineering). UBC Engineering does NOT have a video interview component — these are for practising written essay structure only.
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

### Video Interview (Waterloo / UofT / General)

1. **Select target university** — All Universities, University of Waterloo, or University of Toronto
2. **Choose priority** — Core Questions (most likely to be asked at your selected school) or All Questions
3. **Pick categories** — Behavioral (teamwork & ethics), Problem Solving (Fermi estimates, logic puzzles), Personal Engineering (motivations & experience)
4. **Choose mode** — Simulation (timed with auto-stop) or Practice (untimed)
5. **Device check** — Camera and microphone preview before the interview starts
6. **Answer 3 questions** — Read the prompt during prep time, then record your video response. The question hides once recording starts.
7. **Review** — After each answer, review your recording, transcript, WPM, and filler words
8. **Download** — Save recordings locally as `.webm`
9. **Get graded** — Copy the grading prompt and paste it alongside your video into any AI that accepts file + text prompts (Gemini, Claude, ChatGPT, etc.)

### Written Practice (UBC Personal Profile)

1. **Toggle UBC (Personal Profile)** — activates writing mode, hides video/camera features
2. **Select questions** — Check individual UBC questions or Select All
3. **Write your response** — Use the textarea (2,100 character limit) — be authentic and specific
4. **Submit** — Your response is saved for evaluation
5. **Get feedback** — Copy the grading prompt and paste it into any AI. The prompt acts as a **coach** — it gives advice on what to improve without rewriting your answer.
6. **Revise** — Use the feedback to strengthen your own writing. Do NOT use AI to rewrite.

## Grading Prompts

The app generates **two completely different** prompts depending on the mode:

### Video Interview Prompt (Waterloo / UofT / General)

A "ruthless admissions officer" persona evaluates across 6 dimensions (Substance, Structure, Relevance, Engineering Alignment, Delivery, Confidence), watching the video and reading the transcript. Includes STAR breakdown, fluff penalty, and delivery notes from video observation.

### UBC Personal Profile Prompt (Written)

A "coach/mentor" persona evaluates across UBC's 4 criteria (Engagement & Accomplishment, Structure, Substance, Voice & Authenticity). Provides **structured how-to-improve advice** across specificity, structure, authenticity, and cutting fluff. The prompt explicitly **forbids** the AI from rewriting the candidate's answers — only advice, no generated content.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Web Speech API (live transcription)
- MediaRecorder API (video capture)
