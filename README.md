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

## Step-by-Step Usage Guide

### 🎥 Video Interviews (Waterloo / UofT / General)
1. **Target University**: Under *Target University*, select **All Universities**, **University of Waterloo**, or **University of Toronto**.
2. **Question Priority**: Select **Core Questions** (high-frequency) or **All Questions**.
3. **Question Categories**: Check or uncheck **Behavioral**, **Problem Solving**, or **Personal Engineering**. You can also click category cards to preview questions.
4. **Interview Mode**: Select **Simulation** (timed prep + timed auto-stop recording) or **Practice** (untimed).
5. **Start**: Click **Start Simulation Session** (or **Start Practice Session**).
6. **Device Check**: Allow browser access to your camera and microphone. Verify your live video feed and microphone level bars, then click **Proceed to Interview**.
7. **Recording**: Read the question during the prep countdown. Once recording starts, the question hides (Kira Talent style). Speak clearly into your mic.
8. **Evaluation & Grading**: After finishing your questions, review your session summary, download your `.webm` video recordings, and click **Copy Grading Prompt** to paste into any AI (Gemini, Claude, ChatGPT, etc.) alongside your video.

### ✍️ Written Practice (UBC Personal Profile)
1. **Select UBC**: Scroll down to *Personal Profile Practice* and click **UBC (Personal Profile)**. (This automatically selects writing mode).
2. **Select Questions**: Check/uncheck the specific UBC questions you want to practice, or click **Select All / Deselect All**.
3. **Start**: Click **Start Writing Practice**.
4. **Write Response**: Type your response in the textarea (up to 2,100 characters). The character and word counters update in real time.
5. **Submit**: Click **Submit Response** when finished.
6. **Coaching & Grading**: Review your written response and click **Copy Grading Prompt**. Paste it into any AI to receive mentor/coach-style feedback on your writing (covering Engagement & Accomplishment, Structure, Substance, Voice & Authenticity, plus concrete tips on how to improve). *(Note: Do not use AI to write or rewrite your profile — UBC actively uses AI detectors).*

---

## Setup & Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/pandejesal/Univeristy-Eng-Interview-Simulator.git

# 2. Navigate into the project directory
cd Univeristy-Eng-Interview-Simulator

# 3. Install dependencies
npm install

# 4. Start development server
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
