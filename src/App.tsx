import { useState, useCallback } from 'react';
import type { Screen, Question, QuestionCategory, QuestionsData, InterviewMode, University, SessionResult } from './types';
import StartScreen from './components/StartScreen';
import RecordingModule from './components/RecordingModule';
import EvaluationScreen from './components/EvaluationScreen';
import SessionSummary from './components/SessionSummary';
import questionsData from './data/questions.json';

interface QuestionWithCategory {
  question: Question;
  category: QuestionCategory;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_PER_SESSION = 3;

type EvalPhase = 'question' | 'summary';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [evalPhase, setEvalPhase] = useState<EvalPhase>('question');
  const [mode, setMode] = useState<InterviewMode>('simulation');
  const [sessionQuestions, setSessionQuestions] = useState<QuestionWithCategory[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);

  const handleStart = useCallback((categories: QuestionCategory[], selectedMode: InterviewMode, university?: University, onlyCore?: boolean) => {
    const pool: QuestionWithCategory[] = [];
    for (const cat of categories) {
      const qs = questionsData[cat];
      if (qs) {
        for (const q of qs) {
          if (university && q.university && q.university !== university) continue;
          if (onlyCore && q.university && q.priority !== 'high') continue;
          pool.push({ question: q, category: cat });
        }
      }
    }
    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, Math.min(QUESTIONS_PER_SESSION, pool.length));
    setMode(selectedMode);
    setSessionQuestions(selected);
    setCurrentQuestionIndex(0);
    setResults([]);
    setEvalPhase('question');
    setScreen('recording');
  }, []);

  const handleRecordingComplete = useCallback((blob: Blob, transcript: string) => {
    const currentQ = sessionQuestions[currentQuestionIndex];
    if (!currentQ) return;
    setResults((prev) => [...prev, {
      question: currentQ.question,
      category: currentQ.category,
      transcript,
      blob,
      recordedAt: Date.now(),
    }]);
    setEvalPhase('question');
    setScreen('evaluation');
  }, [sessionQuestions, currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < sessionQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setScreen('recording');
    }
  }, [currentQuestionIndex, sessionQuestions.length]);

  const handleShowSummary = useCallback(() => {
    setEvalPhase('summary');
  }, []);

  const handleRestart = useCallback(() => {
    setSessionQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setEvalPhase('question');
    setScreen('start');
  }, []);

  const recordingDuration = 60;

  if (screen === 'start') {
    return <StartScreen questionsData={questionsData} onStart={handleStart} />;
  }

  if (screen === 'recording' && sessionQuestions[currentQuestionIndex]) {
    const qwc = sessionQuestions[currentQuestionIndex];
    return (
      <RecordingModule
        key={currentQuestionIndex}
        question={qwc.question}
        mode={mode}
        questionIndex={currentQuestionIndex}
        totalQuestions={sessionQuestions.length}
        onComplete={handleRecordingComplete}
        onCancel={handleRestart}
      />
    );
  }

  if (screen === 'evaluation') {
    const result = results[currentQuestionIndex];

    if (evalPhase === 'summary' || !result) {
      return (
        <SessionSummary
          results={results}
          mode={mode}
          onRestart={handleRestart}
        />
      );
    }

    const qwc = sessionQuestions[currentQuestionIndex];
    const isLast = currentQuestionIndex >= sessionQuestions.length - 1;

    return (
      <EvaluationScreen
        key={currentQuestionIndex}
        question={qwc.question}
        category={qwc.category}
        recordedBlob={result.blob}
        transcript={result.transcript}
        recordingDuration={recordingDuration}
        questionIndex={currentQuestionIndex}
        totalQuestions={sessionQuestions.length}
        onDownloadAll={() => {
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
        onNextQuestion={isLast ? handleShowSummary : handleNextQuestion}
        onFinish={handleShowSummary}
        onRestart={handleRestart}
      />
    );
  }

  return null;
}
