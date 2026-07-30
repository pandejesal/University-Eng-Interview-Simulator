export type University = 'waterloo' | 'uoft' | 'ubc';

export type Priority = 'high' | 'low';

export interface Question {
  question: string;
  focus: string;
  prepTime: number;
  responseTime: number;
  university?: University;
  priority?: Priority;
}

export interface QuestionsData {
  behavioral: Question[];
  problem_solving: Question[];
  personal_engineering: Question[];
}

export type QuestionCategory = keyof QuestionsData;

export type Screen = 'start' | 'device_check' | 'recording' | 'evaluation';

export type InterviewMode = 'practice' | 'simulation' | 'writing';

export interface SessionResult {
  question: Question;
  category: QuestionCategory;
  transcript: string;
  blob: Blob | null;
  recordedAt: number;
}

export interface StoredSession {
  id: string;
  date: string;
  mode: InterviewMode;
  results: {
    question: string;
    focus: string;
    category: QuestionCategory;
    transcript: string;
    fillerWords: number;
    wpm: number;
  }[];
}
