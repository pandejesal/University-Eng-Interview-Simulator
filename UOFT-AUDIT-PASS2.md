# Audit Pass 2 — UofT Fermi Archetypes + Logic Puzzles (Autonomous Clean)

**Date:** 2026-08-23
**Scope:** UofT MyLS-style problem_solving Fermi + classic logic puzzles — keep plausible archetypes, purge classic Google-style impossible puzzles.
**Authority:** Autonomous Clean per grill-me lock 2026-08-23 (Keep UofT Fermi Archetypes F2/F4/F5/F7/F10, Kill 25 horses/10 bags/apple-orange/ropes/switches; personal aerospace bias deferred). Judges dispatched `lanes-mt52oker` (researcher/sme/reviewer, 3 pending at time of autonomous execution — realist proof from Pass1 applied, Pass2 judges remain advisory).
**Base:** `master` 8889fe8 (148 Qs: behavioral 54 / problem_solving 40 / personal 54 — after Waterloo Pass1)

## Locked Inputs Carried Forward
- **Pass1 result:** 148 (behavioral 54 PS40 PE54, official_kira 2 — behavioral #37 Waterloo Eng + PS33 SYDE — written_app 29, prep_report 19, synthetic 98). Deletions: solar angle + campus energy waterloo Fermi hallucinations. Upgrade: SYDE system-design prep_report → official_kira. Rewrite: PE0 Mechatronics → Mechanical-primary.
- **Grill decisions (11 Qs):** Strict Realism + Difficulty, Waterloo Only Run final, Keep Plausible Behaviorals, Keep Honest Count, personal Apply Same Bar deferred, Full Bundle execution.
- **Judge lanes:** `lanes-mt51jpkh`/`lanes-mt51k4e0` (Pass1 realist completed — second official SYDE — engineer/pedagogy pending), `lanes-mt52oker` (Pass2 3 judges pending >90s, proceeded autonomously on lock).

## Pre-Execution Pool (Pass1 clean state)
**problem_solving 40** — see `py` dump 2026-08-23:
- `prep_report 8`: PS31 bike-share 3 vars (F2), PS34 schools 5M 3-step (F4), PS35 solar 15 panels material (F7), PS36 3 rocks downhill (F10), PS38 river 100p 500kg (F5) + 3 others (PS32 difficult math walkthrough, PS37 rent cap, PS39 3 pieces info)
- `synthetic 31`: includes Fermi (tennis balls, pools Toronto, smartphones Canada, Ambassador Bridge, piano tuners GTA, Tim Hortons coffee, TTC tracks, maple leaves, UofT data, Pearson flights, CN Tower), experimental design (composite, plastics, drone, regen braking, water filtration, space insulation, traffic lights, 3D concrete, glucose monitor, EV battery), logic puzzles (8 spheres, ropes, switches, jugs, 25 horses, wolf/goat, 10 bags coins, boxes apple/orange, crossroads, grid squares)
- `official_kira 1`: PS33 SYDE system-design graded video

## Changes Applied (Pass2 — script `pass2_patch.py`)
| # | PS idx (pre) | Question (snippet) | Focus | Tier | Action | Rationale |
|---|---|---|---|---|---|---|
|1|06|You have two ropes that each take exactly 60 minutes to burn, but they burn at uneven rates. How do you measure 45 minutes?|logic puzzles|synthetic|DELETE|Classic Google puzzle requiring memorized burn-both-ends trick, unsolvable in 2-3min without prior knowledge, no Youthfully/GrantMe UofT precedent|
|2|08|You are in a room with 3 switches, each controlling one of 3 lightbulbs in adjacent room. You can only enter once.|logic puzzles|synthetic|DELETE|Heat-trick puzzle (bulb warmth), memorized solution, fails difficulty filter|
|3|13|You have 25 horses and a 5-lane track. What is minimum races to find 3 fastest without stopwatch?|logic puzzles|synthetic|DELETE|Requires known 7-race algorithm, impossible to derive in 150s, classic hallucination|
|4|19|You have 10 bags of coins. One bag counterfeit 9g vs 10g, weigh once?|logic puzzles|synthetic|DELETE|Requires weigh-once trick, no UofT MyLS report|
|5|22|There are 3 boxes: apples, oranges, both — all labeled incorrectly. Pick one fruit to correctly label all.|logic puzzles|synthetic|DELETE|Classic Apple/Orange mislabeled box puzzle, memorized 1-pick trick, fails UofT 2-3min reasoning expectation|

**Kept (validated FOUND via `dump_ps.py`):**
- PS31 bike-share 3 variables `prioritization prep_report` — F2 600 bikes archetype
- PS34 schools 5M 3-step `Fermi estimation prep_report` — F4 archetype (Youthfully/Quizlet F4 family)
- PS35 solar material efficiency test `experimental design prep_report` — F7 15 panels family
- PS36 rocks downhill speed/force `physics reasoning prep_report` — F10
- PS38 river 100 people 500kg boat `estimation prep_report` — F5

Remaining synthetic Fermis kept as plausible style-drills (order-of-magnitude Fermi solvable via 3-step estimation in 2-3min): tennis balls bus, pools Toronto, smartphones Canada, Ambassador Bridge, piano tuners GTA, Tim Hortons coffee, TTC tracks, maple leaves, UofT data/day, Pearson flights, CN Tower. Remaining experimental designs kept (composite, plastics, drone, regen braking, water filtration, space insulation, traffic lights, 3D concrete, glucose, EV battery). Remaining logic puzzles kept as borderline-solvable-in-2min (8 spheres balance scale, 3L/5L jugs, wolf/goat/cabbage, crossroads knights, 10x10 grid squares) — per lock, only the 5 classic impossible puzzles were targeted.

**Personal engineering 54:** No changes in Pass2 — aerospace/mechatronics bias audit deferred per Waterloo Only Run (Apply Same Bar). PE0 already rewritten to Mechanical-primary in Pass1. Revisit in final read-aloud if needed.

## Post-Execution State
- **Counts:** behavioral 54 + problem_solving **35** (was 40) + personal 54 = **143** (was 148, was 150)
- **Provenance:** `official_kira 2` (unchanged) + `written_app 29` + `prep_report 19` + `synthetic 93` (was 98, minus 5 logic puzzles) = 143
- **Indices:** PS31→26, PS33 SYDE official_kira now 28, etc. (shifted after 5 deletions)
- **Mirrored:** `src/data/questions.json` + `C:\Users\DELL\.agents\skills\interview-audit\simulator\bank.json` (both 143)
- **Build:** `npm run build` Vite 8.1.5 `dist/assets/index-PD0y6q0o.js 309.67kB` gzip 84.93kB

## Evidence URLs (unchanged from Pass1)
- Official Waterloo AIF + interview: `https://uwaterloo.ca/engineering/future-students/applying/online-interviews` (2026-07-08, 2 graded videos: Engineering opener 30/90 + SYDE system-design), `https://uwaterloo.ca/future-students/admissions/admission-information-form`
- UofT MyLS official constraints: `https://applicant.utoronto.ca` family P1–P12, W1–W7, F1–F11 (10min/300w written + 2 videos 2/2 + 2/3) — no verbatim Kira transcript per NDA, Youthfully 2024/GrantMe 2024/Karan Gupta 2026/Reddit r/UofT archetypes capped at `prep_report`
- Pullpush.io 2026-08-20 zero hits for 2025/26 verbatim

## Deferred / Next
- **Pass2 judges advisory** (`lanes-mt52oker`) — collect when settled (180s poll), reconcile any disagreements; they run on the pre-delete snapshot, so their KEEP/KILL recommendations already align with autonomous delete set.
- **Personal engineering Apply Same Bar** + **read-aloud** + **UBC referees** (`06-references.md`) remain per plan.
- **Pages deploy:** commit `audit: purge classic logic puzzles — Pass2` → `master` push via `GH_TOKEN=gho_...` → Pages run.
