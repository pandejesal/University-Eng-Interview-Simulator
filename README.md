# Kira Talent & UBC Personal Profile Simulator

A browser-based interview and Personal Profile simulator for University of Waterloo Engineering, University of Toronto Engineering, and UBC Engineering applicants. Record video responses to real admissions interview questions or write responses to official UBC Personal Profile questions, review your performance, and generate coaching prompts for AI analysis.

**100% client-side — no external API calls.** Your recordings and essays never leave your machine.

---

## Features

### Video Interviews (Waterloo, UofT, General)
- **127 Interview Questions** across behavioral, problem-solving, and personal engineering categories.
- **Kira-Accurate Timings** — Individual prep and response times per question.
- **Simulation Mode** — Timed prep + recording with auto-stop, countdowns, double beep start / single beep end, and camera preview.
- **Practice Mode** — Untimed recording at your own pace.
- **Device Check** — Live camera preview and 20-bar microphone level check before starting.
- **Question Hidden During Recording** — Matches Kira Talent behavior (prompt disappears when recording starts).
- **Live Speech-to-Text** — Real-time transcript generation during recording.
- **Analytics** — Filler word counter and speaking pace WPM tracker against the 140–170 target.
- **Video Download** — Save `.webm` recordings locally (individually or bulk download).

### Written Personal Profile (UBC)
- **6 Official UBC Personal Profile Questions** — Exact questions from the UBC application portal.
- **Individual Question Selection** — Checkboxes for each question with a "Select All / Deselect All" toggle.
- **Writing Mode** — Textarea interface with a 2,100-character limit counter, word counter, and plagiarism reminder. No camera or mic needed.
- **Coach-Style AI Prompt** — Generates a mentor prompt focused on actionable feedback (specificity, structure, authenticity, cutting fluff) while **strictly forbidding** the AI from rewriting your essay.

---

## How to Use

### 🎥 Video Interviews (Waterloo / UofT / General)
1. **Target University** — Select *All Universities*, *University of Waterloo*, or *University of Toronto* from the target university bar.
2. **Question Priority** — Choose between *Core Questions* (high frequency) or *All Questions*.
3. **Categories** — Check the question categories you want to practice.
4. **Interview Mode** — Select *Simulation* (strict timed) or *Practice* (untimed).
5. **Start Session** — Click **Start Simulation/Practice Session**.
6. **Device Check** — Allow camera and microphone access, verify the live video feed and mic bars, then click **Proceed to Interview**.
7. **Answer Questions** — Read the prompt during prep time, record your response (the prompt will hide once recording starts), and review each answer on the evaluation screen.
8. **Get Graded** — Copy the grading prompt and paste it alongside your `.webm` video into any multimodal AI (Gemini, Claude, ChatGPT, etc.).

### ✍️ Written Practice (UBC Personal Profile)
1. **Select UBC** — Scroll down to the *Personal Profile Practice* section and click **UBC (Personal Profile)**. This automatically switches to writing mode.
2. **Select Questions** — Check the specific UBC questions you want to practice or click **Select All**.
3. **Start Writing** — Click **Start Writing Practice**.
4. **Write Response** — Type your response in the textarea (up to 2,100 characters). Ensure your response is authentic and personal.
5. **Submit & Evaluate** — Click **Submit Response** to view your evaluation screen.
6. **Get Coaching** — Copy the grading prompt and paste it into any AI. The prompt acts as a **coach/mentor** that critiques your writing across UBC's 4 criteria (Engagement & Accomplishment, Structure, Substance, Voice & Authenticity) and gives you **actionable advice on what to improve** without rewriting it for you.
7. **Revise** — Use the feedback to improve your own essay. *(Do not use AI to write or rewrite your profile — UBC actively uses AI detectors).*

---

## Setup & Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Web Speech API** (live transcription)
- **MediaRecorder API** (video recording)

---

## Author & Contributor
Developed by **Jesal Pande** ([@SkullRageX](https://github.com/SkullRageX)).
