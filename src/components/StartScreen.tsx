import { useState, useMemo } from 'react';
import type { QuestionCategory, QuestionsData, InterviewMode, University, Priority } from '../types';
import SessionHistory from './SessionHistory';

interface StartScreenProps {
  questionsData: QuestionsData;
  onStart: (categories: QuestionCategory[], mode: InterviewMode, university?: University, onlyCore?: boolean) => void;
}

const categories: { key: QuestionCategory; label: string; description: string }[] = [
  { key: 'behavioral', label: 'Behavioral', description: 'Teamwork, conflict, ethics & resilience' },
  { key: 'problem_solving', label: 'Problem Solving', description: 'Fermi estimates, logic puzzles & experimental design' },
  { key: 'personal_engineering', label: 'Personal Engineering', description: 'Motivations, hardware/software & career goals' },
];

const universityOptions: { key: 'all' | University; label: string }[] = [
  { key: 'all', label: 'All Universities' },
  { key: 'waterloo', label: 'University of Waterloo' },
  { key: 'uoft', label: 'University of Toronto' },
];

export default function StartScreen({ questionsData, onStart }: StartScreenProps) {
  const [selected, setSelected] = useState<Set<QuestionCategory>>(new Set(['behavioral', 'problem_solving', 'personal_engineering']));
  const [mode, setMode] = useState<InterviewMode>('simulation');
  const [university, setUniversity] = useState<'all' | University>('all');
  const [onlyCore, setOnlyCore] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const toggleCategory = (cat: QuestionCategory) => {
    const next = new Set(selected);
    if (next.has(cat)) {
      if (next.size > 1) next.delete(cat);
    } else {
      next.add(cat);
    }
    setSelected(next);
  };

  const filteredCounts = useMemo(() => {
    const counts: Record<QuestionCategory, number> = { behavioral: 0, problem_solving: 0, personal_engineering: 0 };
    for (const cat of Object.keys(questionsData) as QuestionCategory[]) {
      const qs = questionsData[cat];
      if (qs) {
        counts[cat] = qs.filter(q => {
          if (university !== 'all' && q.university && q.university !== university) return false;
          if (onlyCore && q.university && q.priority !== 'high') return false;
          return true;
        }).length;
      }
    }
    return counts;
  }, [questionsData, university, onlyCore]);

  const isUniversitySelected = university !== 'all';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-3">
            Kira Talent Interview Simulator
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            University of Toronto · Waterloo Engineering
          </p>
          <div className="mt-6 h-px bg-gray-200 mx-auto max-w-xs" />
        </div>

        {/* Mode toggle */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
            Interview Mode
          </h2>
          <div className="flex border border-gray-200 divide-x divide-gray-200">
            <button
              onClick={() => setMode('simulation')}
              className={`flex-1 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                mode === 'simulation'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => setMode('practice')}
              className={`flex-1 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                mode === 'practice'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 hover:text-gray-700'
              }`}
            >
              Practice
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {mode === 'simulation'
              ? 'Strict timed prep + recording with auto-stop'
              : 'Untimed. Record at your own pace, stop when ready.'}
          </p>
        </div>

        {/* University filter */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
            Target University
          </h2>
          <div className="flex border border-gray-200 divide-x divide-gray-200">
            {universityOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setUniversity(opt.key)}
                className={`flex-1 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                  university === opt.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            {university === 'all'
              ? 'All questions including university-specific ones'
              : `Only ${university === 'waterloo' ? 'Waterloo' : 'UofT'} Engineering interview questions`}
          </p>
        </div>

        {/* Core toggle — only visible when a specific university is selected */}
        {isUniversitySelected && (
          <div className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
              Question Priority
            </h2>
            <div className="flex border border-gray-200 divide-x divide-gray-200">
              <button
                onClick={() => setOnlyCore(true)}
                className={`flex-1 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                  onlyCore
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                Core Questions
              </button>
              <button
                onClick={() => setOnlyCore(false)}
                className={`flex-1 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                  !onlyCore
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 hover:text-gray-700'
                }`}
              >
                All Questions
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {onlyCore
                ? 'Most frequently asked / highest priority questions'
                : 'All questions including less common ones'}
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-5 text-center">
            Select Question Categories
          </h2>
          <div className="space-y-3">
            {categories.map((cat) => {
              const count = filteredCounts[cat.key];
              return (
                <button
                  key={cat.key}
                  onClick={() => toggleCategory(cat.key)}
                  className={`w-full text-left p-4 border transition-colors ${
                    selected.has(cat.key)
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-sm font-medium ${selected.has(cat.key) ? 'text-gray-900' : 'text-gray-500'}`}>
                        {cat.label}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 tabular-nums">{count} questions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => onStart(Array.from(selected), mode, university === 'all' ? undefined : university, onlyCore)}
          className="w-full py-3.5 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
        >
          Start {mode === 'simulation' ? 'Simulation' : 'Practice'} Session
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          3 questions per session. Camera and microphone access will be requested.
        </p>

        <button
          onClick={() => setShowHistory(true)}
          className="w-full mt-4 py-2 border border-gray-200 text-gray-400 text-xs uppercase tracking-[0.15em] hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          View Past Sessions
        </button>

        {showHistory && <SessionHistory onClose={() => setShowHistory(false)} />}
      </div>
    </div>
  );
}
