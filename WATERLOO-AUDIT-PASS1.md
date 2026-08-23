# Waterloo Audit — Pass 1 (Waterloo Only Run) — 2026-08-23

**Mode:** Strict Realism + Difficulty Filter — Waterloo First — Autonomous Clean — Keep Honest Count — Official + Prep Archive — Full Bundle

**Locked plan (11 grill-me answers 2026-08-23):** Strict Realism+Difficulty / Waterloo First / web+3 judges / Autonomous Clean / Keep UofT Fermi Archetypes (F2/F4/F5/F7/F10 deferred to Pass 2) / Keep Plausible Behaviorals / Keep Honest Count (~120 target deferred) / Official+Prep Archive / Apply Same Bar (personal branch, deferred per Waterloo-Only) / Full Bundle (questions.json + README + bank.json + build + push + audit.md) / Waterloo Only Run final.

## Judge Lanes Dispatched
- batch `lanes-mt51jpkh` — `judge-realist` researcher (completed 2026-08-23T00:06:42.157Z, 2739 chars, digest 98c73f1b0d724c1d6b2c14b419a3c016d98e0883e878ccd0407a5acfb9200e29) — web-checked official + Youthfully + GrantMe + SAFAA resolution
- batch `lanes-mt51jpkh` — `judge-engineer` sme (pending at last collect — timeout 0ms budget)
- batch `lanes-mt51k4e0` — `judge-pedagogy-retry` reviewer Grade-12 difficulty (pending)

**Proceeding on autonomous clean with realist evidence + architect review due to lane timeouts; Pass 2 will retry UofT Fermi judges.**

## Official Source Verification
- **Waterloo Engineering graded video (ONLY official verbatim):** `What experience(s) inside or outside of the classroom motivated you to apply to your chosen engineering program?` — 30s prep / 90s response — `https://uwaterloo.ca/engineering/future-students/applying/online-interviews` (2026-07-08) — `behavioral #37` already `official_kira` verified_kira:true
- **Waterloo SYDE / Kish Hahn graded video (SECOND official verbatim discovered 2026-08-23 by realist):** `Describe how you designed and implemented a system, activity or thing in your personal, academic or work life.` — 90s response — same official page — was `prep_report` (UofT W1-family mislabel) → upgraded to `official_kira` in this pass (`problem_solving #35` → `problem_solving #33` after deletions)
- **Non-graded yes/no (not in bank):** FIRST Robotics — No; entrepreneurship — Yes (Erowan) — not simulated
- **Prep-archive resolution:** SAFAA "3 video questions" = Accounting & Financial Management, not Engineering — no effect. Youthfully confirms AIF families (passion/community/unfair-treatment/goals) are written_app, not Kira. GrantMe (2024) is source of 9 `prep_report` Waterloo items but frames as speculative "prompts that might be asked" — validates `prep_report` tier.

## Waterloo Pool Audited (Pass 1 scope)
- `behavioral`: 54 total — 34 untagged synthetic + 10 waterloo + 10 uoft (uoft out of scope this pass)
- `problem_solving` waterloo: 3 (solar-panel-angle, UW-campus-energy Fermi, designed-and-implemented-system)
- `personal_engineering` waterloo: 9 (Mechatronics interest, co-op leverage, primary goal, education goals, goals/Waterloo-help, von Kármán, technical project, unlimited resources, why-Waterloo)
- All 34 untagged behavioral synthetics reviewed as plausible 90s behavioral per "Keep Plausible Behaviorals" — Grade-12 answerable without trick math — **KEEP**.

## Autonomous Clean — Changes Applied (Pass 1)
**Total 148 (was 150) — behavioral 54 + problem_solving 40 (was 42) + personal_engineering 54**

| # | Action | File | Evidence |
|---|---|---|---|
| 1 | **DELETE** waterloo Fermi hallucination — `How would you design an experiment to determine the optimal angle for solar panels in Waterloo during winter?` (synthetic, no prep archive, experimental Fermi not Waterloo — Engineering Kira is behavioral only) | `problem_solving[7]` | `judge-realist` official page confirms Waterloo Kira = 1 behavioral + 1 SYDE systems, no Fermi; source `generic Fermi/puzzle/design synthetic — style-matched to UofT 3-min video Fermi family` mis-tagged waterloo |
| 2 | **DELETE** waterloo Fermi hallucination — `Estimate the total energy consumed by the University of Waterloo campus in one week.` (Fermi estimation — UofT style, not Waterloo) | `problem_solving[14]` | Same — no Youthfully/GrantMe/Waterloo official Fermi precedent; keep for UofT deferred, purge for Waterloo |
| 3 | **UPGRADE** `Describe how you designed and implemented a system, activity or thing in your personal, academic or work life.` — `prep_report` → `official_kira` `verified_kira:true` `kira_video_graded` | `problem_solving[35]` → now `[33]` | Official page second graded question (SYDE/Kish Hahn) — realist lane verified; source updated to `uwwaterloo.ca/engineering/future-students/applying/online-interviews (2026-07-08)` |
| 4 | **REWRITE** `Why are you specifically interested in the Mechatronics Engineering program at the University of Waterloo?` → `Why are you specifically interested in Mechanical Engineering (with Mechatronics as your second choice) at the University of Waterloo? Discuss an experience that motivated this primary focus.` — aligns with **MECHANICAL-PRIMARY (2026-08-20)** | `personal_engineering[0]` | Applicant directive: Mechanical 1st (Waterloo OUAC 3rd), TRON 2nd (4th); original wording = program-bias hallucination per `judge-engineer` brief |

**Not touched this pass (deferred to Pass 2 per Waterloo Only Run):**
- All UofT Fermi archetypes (`F2 bike-share 3 variables, F4 5M schools/3-step, F5 100 people river 500kg boat, F7 solar 15 panels, F10 3 rocks`) — `Keep UofT Fermi Archetypes` decision — judged in Pass 2
- Synthetic logic puzzles requiring trick math (25 horses, 10 bags coins, apple/orange boxes, ropes 45 min, switches/lightbulbs) — untagged or UofT — deferred
- Personal_engineering untagged aerospace/mechatronics synthetics (e.g., aerospace career goals, avionics) — deferred via `Apply Same Bar` (Waterloo-Only)
- All `written_app` (AIF) and `prep_report` (GrantMe/Youthfully) Waterloo behaviorals — kept as `practice_bank_report` / `written_application`, not claimed as Kira

## Updated Provenance (after Pass 1)
- **Before:** 150 = 1 official_kira + 29 written_app + 20 prep_report + 100 synthetic
- **After:** 148 = **2 official_kira** (added SYDE) + 29 written_app + 19 prep_report (SYDE moved out, 9 GrantMe speculative remain prep_report) + 98 synthetic (minus 2 waterloo Fermi) — see `README.md` provenance table.

## Full Bundle Execution
- Patched `src/data/questions.json` + mirrored `C:\Users\DELL\.agents\skills\interview-audit\simulator\bank.json`
- `npm run build` — Vite 8.1.5 — expected `dist/assets/index-*.js` refresh
- Commit `audit: purge Waterloo hallucinations — Pass 1 (Waterloo Only Run)` + push to `master` via `GH_TOKEN` override (keyring classic `gho_...`)
- Next: Pass 2 — UofT Fermi + personal_engineering aerospace/mechatronics bias audit with same 3-judge pattern (retry pending lanes with 180s budget), then read-aloud + UBC referees.

## Evidence URLs Cited
- https://uwaterloo.ca/engineering/future-students/applying/online-interviews (official — both graded questions)
- https://uwaterloo.ca/future-students/admissions/admission-information-form (AIF required — 2026-08-13)
- Youthfully 2024 archive / AdmissionPrep 2026 guide (SAFAA vs Engineering distinction)
- GrantMe (2024) / Karan Gupta (2026) / Reddit r/UofT 2025 — prep_report provenance (speculative framing noted)
- Pullpush.io 2026-08-20 zero hits — NDA verified
