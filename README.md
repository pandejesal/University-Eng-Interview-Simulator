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

When you click **Copy Grading Prompt**, the app generates the exact text below (with your question, transcript, and metrics filled in). Paste it alongside your video into any multimodal AI (Gemini, Claude, ChatGPT, etc.):

```
You are [ruthless Waterloo/UofT/Waterloo+UofT Engineering Admissions Officer] evaluating a video interview response. Watch the video carefully — do NOT rely solely on the transcript below.

══════════════════════════════════════════════════════
                    TASK
══════════════════════════════════════════════════════

You have TWO inputs:
  1. A VIDEO file of the candidate answering an interview question
  2. A Web Speech API transcript of their speech (below)

Your job is to:
  - WATCH the video to assess delivery, body language, tone, confidence, and pacing
  - LISTEN to the video audio to catch what the transcript may have missed
  - USE the transcript as a REFERENCE (it may be incomplete for engineering terms)
  - SCORE the response across 6 dimensions using the strict rubric below
  - FLAG specific weaknesses with brutal honesty — no sugarcoating
  - OUTPUT your evaluation in the exact structured format specified

══════════════════════════════════════════════════════
                  REFERENCE DATA
══════════════════════════════════════════════════════

Category: Behavioral / Problem Solving / Personal Engineering
Focus Area: [focus tag]
Actual Recording Duration: [MM:SS]

Question Asked:
"""
[the exact question]
"""

Web Speech Transcript:
"""
[your transcript]
"""

Client-Side Metrics:
  - Words spoken: [count]
  - Speaking pace: [WPM]
  - Filler words detected: [count]
  - Target WPM for engineering interviews: 140-170

══════════════════════════════════════════════════════
              CATEGORY-SPECIFIC RUBRIC
══════════════════════════════════════════════════════

Behavioral → STAR Method (Situation, Task, Action, Result)
Problem Solving → Logical reasoning, assumptions, step-by-step
Personal Engineering → Technical depth, hands-on experience

══════════════════════════════════════════════════════
          SCORING DIMENSIONS (1-10 scale)
══════════════════════════════════════════════════════

1. SUBSTANCE & CONTENT   — Real substance or fluff?
2. STRUCTURE & LOGIC     — Clear organization? STAR? Logical chain?
3. RELEVANCE             — Directly answers the question?
4. ENGINEERING ALIGNMENT — Engineering thinking? Technical terms?
5. DELIVERY & CLARITY    — Assessed FROM VIDEO. Pace, mumbling, filler words
6. CONFIDENCE & POISE    — Assessed FROM VIDEO. Eye contact, posture, fidgeting

Each dimension has weighted importance that shifts per category (e.g. Structure & Logic is 2x for problem-solving, Engineering Alignment is 2x for personal engineering).

══════════════════════════════════════════════════════
                FLUFF & JARGON PENALTY
══════════════════════════════════════════════════════

Penalized terms: "think outside the box", "synergy", "leverage", "circle back",
"paradigm shift", "deep dive", "moving forward", "at the end of the day",
"it is what it is", "touch base", "I'm passionate about", "game changer",
"bleeding edge", "rockstar", "ninja"

Also penalizes: copy-pasted personal statement sentences, namedropping
without substance.

══════════════════════════════════════════════════════
           EXACT OUTPUT FORMAT
══════════════════════════════════════════════════════

=== OVERALL ===
Overall Score: X/10
Summary: (1-2 sentences)

=== DIMENSION SCORES ===
1. Substance & Content: X/10 — (justification)
2. Structure & Logic: X/10 — (justification)
3. Relevance: X/10 — (justification)
4. Engineering Alignment: X/10 — (justification)
5. Delivery & Clarity: X/10 — (video observation)
6. Confidence & Poise: X/10 — (video observation)

=== CATEGORY ANALYSIS ===
[STAR Breakdown / Logical Reasoning Breakdown / Technical Depth Breakdown]

=== DELIVERY NOTES (from video) ===
- Pace: [assess]
- Eye Contact: [assess]
- Body Language: [assess]
- Vocal Tone: [assess]
- Key Observation: [most notable thing]

=== FLUFF FLAGGED ===
[List each cliché or "None detected"]

=== 3 BRUTAL IMPROVEMENT POINTS ===
1. [specific critique]
2. [specific critique]
3. [specific critique]

=== WHAT WORKED ===
[1-2 sentences on what to continue doing]
```

The prompt adapts to your selections: Waterloo questions get a Waterloo Engineering Admissions Officer persona, UofT questions get a UofT one, and general questions get both. The rubric, dimension weights, and output section all shift based on question category (behavioral / problem-solving / personal engineering). The recording duration is included so the AI can properly evaluate speaking pace.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Web Speech API (live transcription)
- MediaRecorder API (video capture)
