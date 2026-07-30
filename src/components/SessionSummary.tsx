import { useMemo, useState } from 'react';
import type { SessionResult, InterviewMode, StoredSession } from '../types';
import { countFillerWords, calculateWPM, generateSessionId } from '../utils/analytics';
import { buildGradingPrompt } from '../utils/gradingPrompt';

interface SessionSummaryProps {
  results: SessionResult[];
  mode: InterviewMode;
  onRestart: () => void;
}

export default function SessionSummary({ results, mode, onRestart }: SessionSummaryProps) {
  const [copied, setCopied] = useState<number | 'all' | null>(null);

  const saved = useMemo(() => {
    const session: StoredSession = {
      id: generateSessionId(),
      date: new Date().toISOString(),
      mode,
      results: results.map((r) => ({
        question: r.question.question,
        focus: r.question.focus,
        category: r.category,
        transcript: r.transcript,
        fillerWords: countFillerWords(r.transcript),
        wpm: calculateWPM(r.transcript, 60),
      })),
    };
    try {
      const stored = JSON.parse(localStorage.getItem('kira-sessions') || '[]');
      stored.unshift(session);
      localStorage.setItem('kira-sessions', JSON.stringify(stored.slice(0, 20)));
    } catch { /* storage full or unavailable */ }
    return session;
  }, [results, mode]);

  const totalFillerWords = saved.results.reduce((s, r) => s + r.fillerWords, 0);
  const avgWpm = Math.round(
    saved.results.reduce((s, r) => s + r.wpm, 0) / saved.results.length
  );

  const handleCopyAll = () => {
    const combined = results.map((r, i) => {
      const prompt = buildGradingPrompt({
        question: r.question.question,
        focus: r.question.focus,
        category: r.category,
        transcript: r.transcript,
        recordingDuration: 60,
        university: r.question.university,
      });
      return `══════════════════════════════════════════\nQUESTION ${i + 1}\n══════════════════════════════════════════\n\n${prompt}`;
    }).join('\n\n');
    navigator.clipboard.writeText(combined).then(() => {
      setCopied('all');
      setTimeout(() => setCopied(null), 2500);
    }).catch(() => {});
  };

  const handleCopyOne = (index: number) => {
    const r = results[index];
    const text = buildGradingPrompt({
      question: r.question.question,
      focus: r.question.focus,
      category: r.category,
      transcript: r.transcript,
      recordingDuration: 60,
      university: r.question.university,
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 2500);
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <h1 className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Session Summary
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-2xl w-full space-y-8">

          {/* Header stats */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
              {mode === 'simulation' ? 'Simulation' : 'Practice'} Session
            </p>
            <p className="text-3xl font-light text-gray-900 mt-2">
              {results.length} Questions Completed
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">{avgWpm}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Avg WPM</p>
            </div>
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">{totalFillerWords}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Filler Words</p>
            </div>
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">{saved.results.length}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Questions</p>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">
              Per-Question Breakdown
            </p>
            <div className="space-y-4">
              {results.map((r, i) => {
                const fw = countFillerWords(r.transcript);
                const w = calculateWPM(r.transcript, 60);
                return (
                  <div key={i} className="border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-900 font-medium">
                          Q{i + 1}. {r.question.focus}
                        </p>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">
                          {formatCat(r.category)}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                        {fw} fillers · {w} WPM
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                      {r.transcript || '(no transcript)'}
                    </p>
                    <button
                      onClick={() => handleCopyOne(i)}
                      className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
                    >
                      {copied === i ? 'Copied!' : 'Copy Grading Prompt for Q' + (i + 1)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleCopyAll}
              className="w-full py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
            >
              {copied === 'all' ? 'Copied All Prompts!' : 'Copy All Grading Prompts for Gemini'}
            </button>

            <button
              onClick={() => {
                results.forEach((r, i) => {
                  if (!r.blob) return;
                  const url = URL.createObjectURL(r.blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `kira-q${i + 1}-${Date.now()}.webm`;
                  a.click();
                  URL.revokeObjectURL(url);
                });
              }}
              className="w-full py-3 border border-gray-900 text-gray-900 text-sm uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-colors"
            >
              Download All Recordings
            </button>

            <button
              onClick={onRestart}
              className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
            >
              Start New Session
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function formatCat(cat: string): string {
  switch (cat) {
    case 'behavioral': return 'Behavioral';
    case 'problem_solving': return 'Problem Solving';
    case 'personal_engineering': return 'Personal Engineering';
    default: return cat;
  }
}
