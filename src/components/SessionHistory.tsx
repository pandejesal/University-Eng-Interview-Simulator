import { useState, useEffect } from 'react';
import type { StoredSession } from '../types';

interface SessionHistoryProps {
  onClose: () => void;
}

export default function SessionHistory({ onClose }: SessionHistoryProps) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('kira-sessions') || '[]');
      setSessions(stored);
    } catch {
      setSessions([]);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-500">
            Session History
          </h2>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-4"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No sessions recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className="border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">
                      {new Date(s.date).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <span className={`text-xs uppercase tracking-wider px-2 py-0.5 ${
                      s.mode === 'simulation'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {s.mode}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {s.results.map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate mr-2">
                          Q{i + 1}. {r.question.slice(0, 50)}...
                        </span>
                        <span className="text-gray-400 whitespace-nowrap">
                          {r.wpm} WPM · {r.fillerWords} fillers
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem('kira-sessions');
              setSessions([]);
            }}
            className="text-xs text-gray-400 hover:text-red-600 underline underline-offset-4 transition-colors"
          >
            Clear All History
          </button>
        </div>
      </div>
    </div>
  );
}
