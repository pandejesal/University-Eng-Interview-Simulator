import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, InterviewMode } from '../types';
import { parseTimeToSeconds } from '../utils/parseTime';

interface RecordingModuleProps {
  question: Question;
  mode: InterviewMode;
  questionIndex: number;
  totalQuestions: number;
  onComplete: (blob: Blob, transcript: string) => void;
  onCancel: () => void;
}

type Phase = 'prep' | 'recording' | 'stopped';

export default function RecordingModule({
  question,
  mode,
  questionIndex,
  totalQuestions,
  onComplete,
  onCancel,
}: RecordingModuleProps) {
  const totalTime = parseTimeToSeconds(question.time);
  const prepTime = Math.min(30, Math.floor(totalTime / 3));
  const recordTimeSeconds = totalTime - prepTime;

  const [phase, setPhase] = useState<Phase>('prep');
  const [countdown, setCountdown] = useState(mode === 'simulation' ? prepTime : 0);
  const [recordCountdown, setRecordCountdown] = useState(recordTimeSeconds);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');
  const recordTimeRef = useRef(recordTimeSeconds);
  recordTimeRef.current = recordTimeSeconds;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanupMedia = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    chunksRef.current = [];
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    setPhase('stopped');
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onCompleteRef.current(blob, transcriptRef.current);
        cleanupMedia();
      };

      recorder.start();

      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            final += event.results[i][0].transcript;
          }
          transcriptRef.current = final;
          setTranscript(final);
        };

        recognition.onerror = () => {};

        recognition.start();
        recognitionRef.current = recognition;
      }

      setPhase('recording');
      setRecordCountdown(recordTimeRef.current);
    } catch {
      setError('Camera/microphone access denied or unavailable.');
    }
  }, [cleanupMedia]);

  // Simulation mode: auto-recording timer
  useEffect(() => {
    if (mode !== 'simulation' || phase !== 'recording') return;

    const interval = setInterval(() => {
      setRecordCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, phase, stopRecording]);

  // Simulation mode: prep timer
  useEffect(() => {
    if (mode !== 'simulation') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, startRecording]);

  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, [cleanupMedia]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <p className="text-gray-900 text-sm mb-6">{error}</p>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header bar */}
      <div className={`px-6 py-3 border-b flex items-center justify-between ${
        phase === 'recording' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 tabular-nums">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            {phase === 'recording' && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            )}
            <span className={`text-xs uppercase tracking-[0.15em] ${
              phase === 'recording' ? 'text-red-700' : 'text-gray-500'
            }`}>
              {phase === 'prep'
                ? mode === 'simulation' ? 'Prepare' : 'Ready'
                : phase === 'recording' ? 'Recording' : 'Completed'}
            </span>
          </div>
        </div>
        {mode === 'simulation' && (
          <span className={`text-lg tabular-nums font-mono ${
            phase === 'recording'
              ? 'text-red-700'
              : countdown <= 5 && phase === 'prep'
                ? 'text-red-600'
                : 'text-gray-700'
          }`}>
            {phase === 'prep' ? formatTime(countdown) : formatTime(recordCountdown)}
          </span>
        )}
        {mode === 'practice' && phase === 'recording' && (
          <span className="text-lg tabular-nums font-mono text-gray-400">
            LIVE
          </span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {/* Question */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
              Question {questionIndex + 1} of {totalQuestions}
            </p>
            <p className="text-lg text-gray-900 leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Focus tag */}
          <div className="mb-8">
            <span className="inline-block text-xs bg-gray-100 text-gray-500 px-3 py-1 uppercase tracking-wider">
              {question.focus}
            </span>
          </div>

          {/* Webcam preview or placeholder */}
          {phase !== 'prep' ? (
            <div className="border border-gray-200 bg-gray-50 overflow-hidden mb-6">
              <video
                ref={(el) => {
                  if (el && streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
            </div>
          ) : (
            <div className="border border-gray-200 bg-gray-50 flex items-center justify-center aspect-video mb-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">
                  Camera will activate when recording begins
                </p>
                {mode === 'practice' && (
                  <button
                    onClick={startRecording}
                    className="mt-4 px-8 py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                  >
                    Start Recording
                  </button>
                )}
                {mode === 'simulation' && (
                  <p className="text-5xl font-mono text-gray-300 tabular-nums mt-3">
                    {formatTime(countdown)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Live transcript */}
          {phase === 'recording' && transcript && (
            <div className="border border-gray-200 p-4 max-h-32 overflow-y-auto mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Live Transcript
              </p>
              <p className="text-sm text-gray-600 italic">{transcript}</p>
            </div>
          )}

          {/* Practice mode: stop button */}
          {mode === 'practice' && phase === 'recording' && (
            <div className="mt-4 text-center">
              <button
                onClick={stopRecording}
                className="px-8 py-3 border-2 border-red-600 text-red-600 text-sm uppercase tracking-[0.15em] hover:bg-red-50 transition-colors"
              >
                Stop Recording
              </button>
            </div>
          )}

          {/* Cancel button */}
          {phase !== 'recording' && (
            <div className="mt-6 text-center">
              <button
                onClick={onCancel}
                className="text-xs text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors"
              >
                Cancel &amp; Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
