import { useRef, useState, useEffect } from 'react';
import type { Question, QuestionCategory } from '../types';
import { buildGradingPrompt } from '../utils/gradingPrompt';
import { countFillerWords, calculateWPM } from '../utils/analytics';

interface EvaluationScreenProps {
  question: Question;
  category: QuestionCategory;
  recordedBlob: Blob | null;
  transcript: string;
  recordingDuration: number;
  questionIndex: number;
  totalQuestions: number;
  onDownloadAll: () => void;
  onNextQuestion: () => void;
  onFinish: () => void;
  onRestart: () => void;
}

export default function EvaluationScreen({
  question,
  category,
  recordedBlob,
  transcript,
  recordingDuration,
  questionIndex,
  totalQuestions,
  onDownloadAll,
  onNextQuestion,
  onFinish,
  onRestart,
}: EvaluationScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const isLast = questionIndex >= totalQuestions - 1;

  const fillerWords = countFillerWords(transcript);
  const wpm = calculateWPM(transcript, recordingDuration);

  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [recordedBlob]);

  const handleDownload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kira-q${questionIndex + 1}-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadDone(true);
  };

  const handleCopyPrompt = () => {
    const text = buildGradingPrompt({
      question: question.question,
      focus: question.focus,
      category,
      transcript,
      recordingDuration,
      university: question.university,
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h1 className="text-xs uppercase tracking-[0.2em] text-gray-500">
          Question {questionIndex + 1} of {totalQuestions}
        </h1>
        <span className="text-xs text-gray-400">
          {isLast ? 'Final question' : `${totalQuestions - questionIndex - 1} remaining`}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center p-8">
        <div className="max-w-2xl w-full space-y-6">

          {/* Question recap */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Prompt — {formatCategory(category)}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">{wpm}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                WPM
              </p>
            </div>
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">{fillerWords}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                Filler Words
              </p>
            </div>
            <div className="border border-gray-200 p-4 text-center">
              <p className="text-2xl font-mono text-gray-900">
                {formatDuration(recordingDuration)}
              </p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                Duration
              </p>
            </div>
          </div>

          {/* Video playback */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
              Your Recording
            </p>
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full aspect-video border border-gray-200 bg-black"
              />
            ) : (
              <div className="w-full aspect-video border border-gray-200 bg-gray-50 flex items-center justify-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  No recording available
                </p>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
              Transcript
            </p>
            <div className="border border-gray-200 p-4 max-h-32 overflow-y-auto">
              {transcript ? (
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-xs text-gray-400 italic">No speech was detected.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={!recordedBlob}
              className="w-full py-3 border border-gray-900 text-gray-900 text-sm uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {downloadDone ? 'Downloaded' : 'Download Recording (.webm)'}
            </button>

            <button
              onClick={handleCopyPrompt}
              className="w-full py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
            >
              {copied ? 'Copied to Clipboard' : 'Copy Grading Prompt for Gemini'}
            </button>
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-6 space-y-3">
            {!isLast ? (
              <button
                onClick={onNextQuestion}
                className="w-full py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
              >
                Next Question
              </button>
            ) : (
              <>
                <button
                  onClick={onFinish}
                  className="w-full py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                >
                  View Session Summary
                </button>
                <button
                  onClick={onDownloadAll}
                  className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
                >
                  Download All Recordings
                </button>
              </>
            )}
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

function formatCategory(cat: QuestionCategory): string {
  switch (cat) {
    case 'behavioral': return 'Behavioral';
    case 'problem_solving': return 'Problem Solving';
    case 'personal_engineering': return 'Personal Engineering';
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
