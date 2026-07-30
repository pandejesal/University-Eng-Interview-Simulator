import type { QuestionCategory, University } from '../types';
import { countFillerWords, calculateWPM } from './analytics';

interface PromptInput {
  question: string;
  focus: string;
  category: QuestionCategory;
  transcript: string;
  recordingDuration: number;
  university?: University;
}

export function buildGradingPrompt(input: PromptInput): string {
  const fillerWords = countFillerWords(input.transcript);
  const wpm = calculateWPM(input.transcript, input.recordingDuration);
  const wordCount = input.transcript ? input.transcript.trim().split(/\s+/).length : 0;

  const admissionsOfficer = input.university
    ? `a ruthless ${input.university === 'waterloo' ? 'University of Waterloo' : 'University of Toronto'} Engineering Admissions Officer`
    : 'a ruthless University of Toronto and Waterloo Engineering Admissions Officer';

  return `You are ${admissionsOfficer} evaluating a video interview response. Watch the video carefully — do NOT rely solely on the transcript below.

══════════════════════════════════════════════════════
                   TASK
══════════════════════════════════════════════════════

You have TWO inputs:
  1. A VIDEO file of the candidate answering an interview question
  2. A Web Speech API transcript of their speech (below)

Your job is to:
  - WATCH the video to assess delivery, body language, tone, confidence, and pacing
  - LISTEN to the video audio to catch what the transcript may have missed (technical terms, filler words, hesitations)
  - USE the transcript as a REFERENCE (it may be incomplete or inaccurate for engineering terms)
  - SCORE the response across 6 dimensions using the strict rubric below
  - FLAG specific weaknesses with brutal honesty — no encouragement, no sugarcoating
  - OUTPUT your evaluation in the exact structured format specified

══════════════════════════════════════════════════════
                  REFERENCE DATA
══════════════════════════════════════════════════════

Category: ${formatCategory(input.category)}
Focus Area: ${input.focus}
Allotted Prep Time: Based on question type
Actual Recording Duration: ${formatDuration(input.recordingDuration)}

Question Asked:
"""
${input.question}
"""

Web Speech Transcript (IMPORTANT — may contain errors, especially for technical terms):
"""
${input.transcript || '(No transcript captured — rely entirely on video audio)'}
"""

Client-Side Metrics (verify against the video — do not take these as ground truth):
  - Words spoken (per transcript): ${wordCount}
  - Speaking pace (from transcript): ${wpm} WPM
  - Filler words detected (from transcript): ${fillerWords}
  - Target WPM for engineering interviews: 140-170 WPM (below = too slow/uncertain, above = rushed/nervous)

══════════════════════════════════════════════════════
              CATEGORY-SPECIFIC RUBRIC
══════════════════════════════════════════════════════

${getCategoryRubric(input.category)}

══════════════════════════════════════════════════════
          SCORING DIMENSIONS (1-10 scale)
══════════════════════════════════════════════════════

Use this strict scale for ALL dimensions:
  Score 1-2: Gibberish, incoherent, completely off-topic, or empty
  Score 3-4: Very weak — vague, generic, no substance, does not address the question
  Score 5-6: Mediocre — partially addresses question but lacks depth, specifics, or structure
  Score 7-8: Good — clear, relevant, has specific examples, reasonable depth
  Score 9-10: Excellent — compelling structure, concrete examples, deep insight, memorable

${getScoringWeights(input.category)}

1. SUBSTANCE & CONTENT [weight: ${getWeight(input.category, 'substance')}]
   - Does the answer have real substance, or is it fluff?
   - Are claims backed by specific examples?
   - Is the answer authentic or does it sound rehearsed?

2. STRUCTURE & LOGIC [weight: ${getWeight(input.category, 'structure')}]
   - Does the response follow a clear organizational structure?
   - Is the reasoning easy to follow?
   - For behavioral: does it use STAR (Situation, Task, Action, Result)?
   - For problem-solving: is the logical chain coherent?

3. RELEVANCE [weight: ${getWeight(input.category, 'relevance')}]
   - Does the answer DIRECTLY address the question?
   - Or does it deflect, pivot to a rehearsed answer, or avoid the hard part?

4. ENGINEERING ALIGNMENT [weight: ${getWeight(input.category, 'engineering')}]
   - Does the candidate demonstrate engineering thinking (systems, constraints, trade-offs)?
   - Are technical terms used correctly?
   - Is there evidence of hands-on experience vs. textbook recitation?

5. DELIVERY & CLARITY [weight: 1.0] — ASSESS FROM VIDEO
   - Is the speech clear, well-paced, and easy to understand?
   - Does the candidate use pauses effectively or do they rush?
   - Watch for: mumbling, monotone voice, excessive filler words ("um"/"uh")
   - CROSS-REFERENCE: compare transcript filler count to what you actually hear

6. CONFIDENCE & POISE [weight: 1.0] — ASSESS FROM VIDEO
   - Does the candidate appear confident and composed?
   - Watch for: eye contact with camera, posture, hand gestures, facial expressions
   - Watch for: nervous habits (fidgeting, looking away, touching face, shifting)
   - Do they appear to be reading a script? (watch eye movement)

══════════════════════════════════════════════════════
                FLUFF & JARGON PENALTY
══════════════════════════════════════════════════════

Actively scan the response for these generic/cliché terms and PENALIZE each occurrence:
  ❌ "think outside the box"        ❌ "synergy"
  ❌ "leverage" (as a verb)         ❌ "circle back"
  ❌ "paradigm shift"               ❌ "deep dive"
  ❌ "moving forward"               ❌ "at the end of the day"
  ❌ "it is what it is"             ❌ "touch base"
  ❌ "I'm passionate about"         ❌ "game changer"
  ❌ "bleeding edge"                ❌ "rockstar" / "ninja"

Also penalize:
  - Sentences that sound copy-pasted from a personal statement
  - Overly generic statements that could apply to any candidate
  - Namedropping without substance ("I used Python" → what did you BUILD with it?)

For each offense, note it in your evaluation. Deduct from the relevant dimension scores.

══════════════════════════════════════════════════════
           WHAT TO WATCH FOR IN THE VIDEO
══════════════════════════════════════════════════════

Pay close attention to these visual/audio cues and incorporate them into your scores:

  VOCAL DELIVERY:
    - Pace: too fast (nervous/ rushing) vs. too slow (uncertain/ unprepared)
    - Volume: confident and steady or trailing off at sentence ends?
    - Tone: natural/conversational vs. monotone/robotic?
    - Pauses: are they strategic (thinking) or because they lost their train of thought?

  BODY LANGUAGE:
    - Eye contact: are they looking at the camera or looking away/reading?
    - Posture: upright and engaged or slouched/closed off?
    - Hands: natural gestures or frozen/stiff?
    - Face: appropriate expressions or blank/stone-faced?

  SIGNS OF REHEARSAL VS. AUTHENTICITY:
    - Eyes shifting off-camera = reading a script
    - Overly polished sentences = memorized
    - Natural hesitations combined with recovery = authentic and adaptive

══════════════════════════════════════════════════════
           EXACT OUTPUT FORMAT
══════════════════════════════════════════════════════

You MUST output your evaluation in this exact format (keep the headings and structure):

=== OVERALL ===
Overall Score: X/10
Summary: (1-2 sentences on overall impression)

=== DIMENSION SCORES ===
1. Substance & Content: X/10 — (1-sentence justification)
2. Structure & Logic: X/10 — (1-sentence justification)
3. Relevance: X/10 — (1-sentence justification)
4. Engineering Alignment: X/10 — (1-sentence justification)
5. Delivery & Clarity: X/10 — (1-sentence justification referencing video observations)
6. Confidence & Poise: X/10 — (1-sentence justification referencing video observations)

=== CATEGORY ANALYSIS ===
${getCategoryOutputSection(input.category)}

=== DELIVERY NOTES (from video) ===
- Pace: [assess]
- Eye Contact: [assess]
- Body Language: [assess]
- Vocal Tone: [assess]
- Key Observation: [most notable thing from the video]

=== FLUFF FLAGGED ===
[List each cliché or generic phrase detected, or "None detected"]

=== 3 BRUTAL IMPROVEMENT POINTS ===
1. [Specific, actionable critique referencing their actual answer — no encouragement]
2. [Specific, actionable critique referencing their actual answer — no encouragement]
3. [Specific, actionable critique referencing their actual answer — no encouragement]

=== WHAT WORKED ===
[1-2 sentences on what was effective, framed as what they should CONTINUE doing]`;
}

function formatCategory(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral': return 'Behavioral / Teamwork & Ethics';
    case 'problem_solving': return 'Problem Solving / Technical Reasoning';
    case 'personal_engineering': return 'Personal Engineering / Motivation & Experience';
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getCategoryRubric(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral':
      return `BEHAVIORAL RUBRIC — STAR Method Assessment Required:

  The candidate must describe a SPECIFIC personal experience. Evaluate whether they:
    S — Set the scene: Did they describe a specific situation with enough context?
    T — Defined their role: Was their personal task or responsibility clear?
    A — Explained their actions: What did THEY specifically do (not "we did")?
    R — Showed the outcome: Was the result concrete, measurable, or significant?

  Critical checks:
    - Is the example REAL or does it sound fabricated?
    - Do they show self-awareness about what went wrong and what they learned?
    - Is there genuine reflection or just a story?
    - Penalize generic answers that could apply to anyone ("I worked hard and it paid off")`;
    case 'problem_solving':
      return `PROBLEM-SOLVING RUBRIC — Structured Thinking Assessment Required:

  The candidate must demonstrate logical reasoning. Evaluate whether they:
    1. Defined the problem clearly before jumping to a solution
    2. Stated assumptions explicitly
    3. Broke the problem into manageable components
    4. Showed their reasoning step-by-step (not just the final answer)
    5. Considered edge cases, limitations, or alternative approaches
    6. Reached a reasonable conclusion or estimate

  For Fermi/estimation questions:
    - Did they pick reasonable reference points?
    - Did they show their math clearly?
    - Did they sanity-check their final number?

  Critical checks:
    - Do they think aloud or just give a final answer?
    - Is their logic internally consistent?
    - Do they acknowledge uncertainty appropriately?`;
    case 'personal_engineering':
      return `PERSONAL ENGINEERING RUBRIC — Technical Depth Assessment Required:

  The candidate must demonstrate genuine engineering interest and experience. Evaluate whether they:
    1. Show hands-on experience (projects, labs, builds) vs. just coursework
    2. Mention specific technologies, tools, or methodologies
    3. Demonstrate understanding of hardware-software integration
    4. Connect personal motivation to real engineering problems
    5. Show awareness of engineering as a discipline (constraints, trade-offs, systems thinking)

  Critical checks:
    - Is their motivation genuine or generic ("I like building things")?
    - Can they speak technically about what they built?
    - Do they understand what engineers actually do vs. a caricature?
    - Do they show curiosity and self-directed learning outside school?`;
  }
}

function getWeight(cat: QuestionCategory, dimension: string): string {
  const weights: Record<QuestionCategory, Record<string, string>> = {
    behavioral: {
      substance: '1.5x',
      structure: '1.5x (STAR method is critical)',
      relevance: '1.0x',
      engineering: '0.5x',
    },
    problem_solving: {
      substance: '1.0x',
      structure: '2.0x (logical reasoning is the PRIMARY metric)',
      relevance: '1.0x',
      engineering: '1.0x',
    },
    personal_engineering: {
      substance: '1.0x',
      structure: '0.5x',
      relevance: '1.0x',
      engineering: '2.0x (technical depth is the PRIMARY metric)',
    },
  };
  return weights[cat]?.[dimension] || '1.0x';
}

function getScoringWeights(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral':
      return `Dimension Weights (how much each dimension counts toward the overall score):
  - Structure & Logic: HIGHEST priority — STAR compliance is the primary criterion
  - Substance & Content: HIGH priority — must be a real, specific example
  - Relevance: MEDIUM priority
  - Engineering Alignment: LOWEST priority (this is a behavioral question)
  - Delivery & Clarity: MEDIUM priority
  - Confidence & Poise: MEDIUM priority`;
    case 'problem_solving':
      return `Dimension Weights (how much each dimension counts toward the overall score):
  - Structure & Logic: HIGHEST priority — logical reasoning is THE primary metric
  - Substance & Content: HIGH priority
  - Relevance: HIGH priority
  - Engineering Alignment: MEDIUM priority
  - Delivery & Clarity: MEDIUM priority
  - Confidence & Poise: LOW priority (nervousness is acceptable for hard problems)`;
    case 'personal_engineering':
      return `Dimension Weights (how much each dimension counts toward the overall score):
  - Engineering Alignment: HIGHEST priority — technical depth is the primary criterion
  - Substance & Content: HIGH priority
  - Relevance: HIGH priority
  - Structure & Logic: MEDIUM priority
  - Delivery & Clarity: MEDIUM priority
  - Confidence & Poise: MEDIUM priority`;
  }
}

function getCategoryOutputSection(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral':
      return `STAR BREAKDOWN:
  Situation: [assess — was the context well established?]
  Task: [assess — was their role clear?]
  Action: [assess — what specifically did THEY do?]
  Result: [assess — was the outcome concrete?]

  Authenticity Check: [does this sound like a real experience or a fabricated/rehearsed answer?]
  Self-Reflection: [did they show genuine learning or just describe events?]`;
    case 'problem_solving':
      return `LOGICAL REASONING BREAKDOWN:
  Problem Definition: [did they restate/define the problem clearly?]
  Assumptions Stated: [list the key assumptions they made]
  Reasoning Chain: [evaluate step-by-step logic]
  Final Answer: [is it reasonable? did they sanity-check it?]
  Alternative Thinking: [did they consider other approaches?]`;
    case 'personal_engineering':
      return `TECHNICAL DEPTH BREAKDOWN:
  Hands-On Experience: [assess — do they have real project experience?]
  Technical Vocabulary: [do they use terms correctly or just drop buzzwords?]
  Engineering Mindset: [do they think in terms of constraints, trade-offs, systems?]
  Motivation Authenticity: [is their "why engineering" genuine or generic?]
  Self-Directed Learning: [do they learn outside of class? how?]`;
  }
}
