import { useState, useRef, useEffect } from 'react';
import type { Question, QuestionCategory } from '../types';

interface WritingModuleProps {
  question: Question;
  category: QuestionCategory;
  questionIndex: number;
  totalQuestions: number;
  onComplete: (text: string) => void;
  onCancel: () => void;
}

const MAX_CHARS = 2100;

export default function WritingModule({
  question,
  category,
  questionIndex,
  totalQuestions,
  onComplete,
  onCancel,
}: WritingModuleProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const charsLeft = MAX_CHARS - text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fadeIn">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-400 tabular-nums">
          {questionIndex + 1} / {totalQuestions}
        </span>
        <span className="text-xs uppercase tracking-[0.15em] text-gray-500">
          UBC Personal Profile — Written
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 sm:p-8">
        <div className="max-w-2xl w-full space-y-6">

          {/* Question */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              {formatCategory(category)}
            </p>
            <p className="text-lg sm:text-xl text-gray-900 leading-relaxed font-medium">
              {question.question}
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">
              Max {MAX_CHARS.toLocaleString()} characters (UBC limit)
            </p>
          </div>

          {/* Textarea */}
          <div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setText(e.target.value);
                }
              }}
              placeholder="Write your response here..."
              className="w-full h-64 sm:h-80 p-4 border border-gray-200 text-sm text-gray-700 leading-relaxed resize-none focus:outline-none focus:border-gray-400 transition-colors"
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className={`tabular-nums ${charsLeft < 100 ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                {charsLeft} characters remaining
              </span>
              <span className="text-gray-400">
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Plagiarism reminder */}
          <div className="p-3 border border-red-200 bg-red-50">
            <p className="text-xs text-red-600 leading-relaxed">
              <strong>Reminder:</strong> This is a practice tool. Do NOT copy AI-generated or pre-written responses
              into your actual UBC application. Your Personal Profile must be your own original work.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => onComplete(text)}
              disabled={!text.trim()}
              className="w-full py-3.5 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {text.trim() ? 'Submit Response' : 'Write something before submitting'}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
            >
              Cancel &amp; Return
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function formatCategory(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral': return 'Behavioral / Teamwork & Ethics';
    case 'problem_solving': return 'Problem Solving / Technical Reasoning';
    case 'personal_engineering': return 'Personal Engineering / Motivation & Experience';
  }
}