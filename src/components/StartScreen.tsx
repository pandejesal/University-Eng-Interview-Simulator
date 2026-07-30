import { useState, useMemo, useEffect } from 'react';
import type { Question, QuestionCategory, QuestionsData, InterviewMode, University, Priority } from '../types';
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

function filterQuestions(qs: Question[], university: 'all' | University, onlyCore: boolean): Question[] {
  return qs.filter(q => {
    if (university === 'ubc') return q.university === 'ubc';
    if (university !== 'all' && q.university && q.university !== university) return false;
    if (onlyCore && q.university && q.priority !== 'high') return false;
    return true;
  });
}

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
  const [expandedCat, setExpandedCat] = useState<QuestionCategory | null>(null);

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
      if (qs) counts[cat] = filterQuestions(qs, university, onlyCore).length;
    }
    return counts;
  }, [questionsData, university, onlyCore]);

  // Auto-switch to writing mode when UBC is selected
  useEffect(() => {
    if (university === 'ubc') {
      setMode('writing');
    }
  }, [university]);

  const isUniversitySelected = university !== 'all';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-gray-900 mb-3">
            Kira Talent Interview Simulator
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            Waterloo Engineering · University of Toronto · UBC
          </p>
          <div className="mt-6 h-px bg-gray-200 mx-auto max-w-xs" />
        </div>

        {/* Mode toggle */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
            {university === 'ubc' ? 'Response Format' : 'Interview Mode'}
          </h2>
          {university === 'ubc' ? (
            <div className="border border-gray-200 bg-gray-50 py-3 text-center">
              <span className="text-sm uppercase tracking-[0.15em] text-gray-700">Writing</span>
            </div>
          ) : (
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
          )}
          <p className="text-xs text-gray-400 text-center mt-2">
            {mode === 'simulation'
              ? 'Strict timed prep + recording with auto-stop'
              : mode === 'practice'
              ? 'Untimed. Record at your own pace, stop when ready.'
              : 'Write your response. No camera or microphone needed.'}
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
              : university === 'waterloo'
              ? 'Only Waterloo Engineering interview questions'
              : 'Only UofT Engineering interview questions'}
          </p>
        </div>

        {/* UBC Personal Profile toggle — separate section */}
        <div className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">
            Personal Profile Practice
          </h2>
          <button
            onClick={() => {
              if (university === 'ubc') {
                setUniversity('all');
                setMode('simulation');
              } else {
                setUniversity('ubc');
                setMode('writing');
              }
            }}
            className={`w-full py-3 text-sm uppercase tracking-[0.15em] transition-colors border ${
              university === 'ubc'
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            UBC (Personal Profile)
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            {university === 'ubc'
              ? 'Practise written Personal Profile prompts. No camera needed.'
              : 'Write and evaluate responses to UBC\'s actual Personal Profile questions'}
          </p>
        </div>

        {/* UBC disclaimer — only when UBC is selected */}
        {university === 'ubc' && (
          <div className="mb-6 p-4 border border-red-200 bg-red-50">
            <p className="text-xs font-medium text-red-700 uppercase tracking-wider mb-1">Plagiarism Warning</p>
            <p className="text-xs text-red-600 leading-relaxed">
              UBC Engineering does NOT use video interviews. These are <strong>written Personal Profile</strong> prompts
              for practising your essay structure and ideas. The sample responses generated by AI are for reference only.
              <strong> Do NOT copy them into your actual application.</strong> UBC reviews all Personal Profiles for
              authenticity — submitting plagiarised content can result in immediate rejection or blacklisting.
            </p>
          </div>
        )}

        {/* Core toggle — only visible when a specific university is selected */}
        {isUniversitySelected && university !== 'ubc' && (
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
          <div className="space-y-2">
            {categories.map((cat) => {
              const count = filteredCounts[cat.key];
              const isSelected = selected.has(cat.key);
              const isExpanded = expandedCat === cat.key;
              const qs = filterQuestions(questionsData[cat.key] || [], university, onlyCore);
              return (
                <div key={cat.key} className="border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => {
                      if (isExpanded) { setExpandedCat(null); } else { setExpandedCat(cat.key); }
                    }}
                    className={`w-full text-left p-4 transition-colors hover:bg-gray-50 ${
                      isSelected ? 'border-l-4 border-l-gray-900' : 'border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={(e) => { e.stopPropagation(); toggleCategory(cat.key); }}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                            isSelected ? 'bg-gray-900 border-gray-900' : 'border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {isSelected && <span className="text-white text-xs">&#10003;</span>}
                        </div>
                        <div>
                          <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                            {cat.label}
                          </span>
                          <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 tabular-nums">{count} questions</span>
                        <span className={`text-gray-300 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>&#9660;</span>
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 max-h-64 overflow-y-auto">
                      {qs.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">No questions match the current filters.</p>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {qs.map((q, i) => (
                            <div key={i} className="px-4 py-3 hover:bg-white transition-colors">
                              <p className="text-xs leading-relaxed text-gray-700">{q.question}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase tracking-wider bg-gray-200 text-gray-500 px-1.5 py-0.5">{q.focus}</span>
                                <span className="text-[10px] text-gray-400">{q.prepTime}s prep / {q.responseTime}s response</span>
                                {q.university && (
                                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 ${
                                    q.university === 'waterloo' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {q.university === 'waterloo' ? 'UW' : 'UofT'}
                                    {q.priority === 'high' ? ' ★' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
