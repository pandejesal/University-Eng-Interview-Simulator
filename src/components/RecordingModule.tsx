import { useState, useEffect, useRef, useCallback } from 'react';
import type { Question, InterviewMode } from '../types';

interface RecordingModuleProps {
  question: Question;
  mode: InterviewMode;
  questionIndex: number;
  totalQuestions: number;
  onComplete: (blob: Blob, transcript: string) => void;
  onCancel: () => void;
}

type Phase = 'prep' | 'recording' | 'stopped';

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch { }
}

function playDoubleBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 880;
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.25);
    }, 200);
  } catch { }
}

export default function RecordingModule({
  question,
  mode,
  questionIndex,
  totalQuestions,
  onComplete,
  onCancel,
}: RecordingModuleProps) {
  const [phase, setPhase] = useState<Phase>('prep');
  const [countdown, setCountdown] = useState(mode === 'simulation' ? question.prepTime : 0);
  const [recordCountdown, setRecordCountdown] = useState(question.responseTime);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef('');
  const prepVideoRef = useRef<HTMLVideoElement>(null);
  const recordVideoRef = useRef<HTMLVideoElement>(null);
  const responseTimeRef = useRef(question.responseTime);
  responseTimeRef.current = question.responseTime;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cleanupMedia = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch { }
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
      try { recognitionRef.current.stop(); } catch { }
      recognitionRef.current = null;
    }
    setPhase('stopped');
  }, []);

  const startStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (prepVideoRef.current) {
        prepVideoRef.current.srcObject = stream;
        prepVideoRef.current.play().catch(() => {});
      }
      setCameraReady(true);
      return stream;
    } catch {
      setError('Camera/microphone access denied or unavailable.');
      return null;
    }
  }, []);

  const beginRecording = useCallback(async () => {
    const stream = streamRef.current;
    if (!stream) return;

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

    // Switch video to recording preview
    if (recordVideoRef.current && streamRef.current) {
      recordVideoRef.current.srcObject = streamRef.current;
      recordVideoRef.current.play().catch(() => {});
    }

    setPhase('recording');
    setRecordCountdown(responseTimeRef.current);
  }, [cleanupMedia]);

  // Start camera stream on mount
  useEffect(() => {
    startStream();
    return () => { cleanupMedia(); };
  }, [startStream, cleanupMedia]);

  // Prep countdown
  useEffect(() => {
    if (mode !== 'simulation') return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playDoubleBeep();
          setTimeout(() => beginRecording(), 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, beginRecording]);

  // Recording countdown
  useEffect(() => {
    if (mode !== 'simulation' || phase !== 'recording') return;
    const interval = setInterval(() => {
      setRecordCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playBeep();
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, phase, stopRecording]);

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
          <button onClick={onCancel} className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fadeIn">
      {/* Header bar */}
      <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between ${
        phase === 'recording' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 tabular-nums">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            {phase === 'recording' && <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />}
            <span className={`text-xs uppercase tracking-[0.15em] ${phase === 'recording' ? 'text-red-700' : 'text-gray-500'}`}>
              {phase === 'prep' ? (mode === 'simulation' ? 'Prepare' : 'Ready') : phase === 'recording' ? 'Recording' : 'Completed'}
            </span>
          </div>
        </div>
        {mode === 'simulation' && (
          <span className={`text-lg tabular-nums font-mono ${phase === 'recording' ? 'text-red-700' : countdown <= 5 && phase === 'prep' ? 'text-red-600' : 'text-gray-700'}`}>
            {phase === 'prep' ? formatTime(countdown) : formatTime(recordCountdown)}
          </span>
        )}
        {mode === 'practice' && phase === 'recording' && (
          <span className="text-lg tabular-nums font-mono text-gray-400">LIVE</span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-3xl w-full">
          {/* Question — hidden during recording (Kira behavior) */}
          {phase !== 'recording' && (
            <div className="mb-6 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
                Question {questionIndex + 1} of {totalQuestions}
              </p>
              <p className="text-lg sm:text-xl text-gray-900 leading-relaxed font-medium">
                {question.question}
              </p>
            </div>
          )}

          {/* Focus tag + timing info — hidden during recording */}
          {phase !== 'recording' && (
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="inline-block text-xs bg-gray-100 text-gray-500 px-3 py-1 uppercase tracking-wider">
              {question.focus}
            </span>
            {mode === 'simulation' && (
              <span className="text-xs text-gray-400">
                {formatTime(question.prepTime)} prep · {formatTime(question.responseTime)} recording
              </span>
            )}
          </div>
          )}

          {/* Camera area */}
          {phase === 'prep' && (
            <div className="border border-gray-200 bg-gray-50 overflow-hidden mb-6">
              <video
                ref={prepVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
              {/* Countdown overlay */}
              {mode === 'simulation' && cameraReady && (
                <div className="flex items-center justify-center py-6 bg-gray-900 text-white">
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Prepare your answer</p>
                    <p className="text-6xl font-mono tabular-nums tracking-tight">{formatTime(countdown)}</p>
                  </div>
                </div>
              )}
              {mode === 'practice' && cameraReady && (
                <div className="flex items-center justify-center py-6">
                  <button
                    onClick={() => { playDoubleBeep(); setTimeout(() => beginRecording(), 400); }}
                    className="px-8 py-3 bg-gray-900 text-white text-sm uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                  >
                    Start Recording
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === 'recording' && (
            <div className="border border-gray-200 bg-gray-50 overflow-hidden mb-6 relative">
              <video
                ref={recordVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-2 bg-red-600 text-white text-xs px-3 py-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {formatTime(recordCountdown)}
                </span>
              </div>
            </div>
          )}

          {phase === 'stopped' && streamRef.current && (
            <div className="border border-gray-200 bg-gray-50 overflow-hidden mb-6">
              <video
                ref={recordVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full aspect-video object-cover bg-black"
              />
            </div>
          )}

          {/* Live transcript */}
          {phase === 'recording' && transcript && (
            <div className="border border-gray-200 p-4 max-h-24 overflow-y-auto mb-4">
              <p className="text-xs text-gray-400 italic">{transcript}</p>
            </div>
          )}

          {/* Practice mode: stop button */}
          {mode === 'practice' && phase === 'recording' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => { playBeep(); stopRecording(); }}
                className="px-8 py-3 border-2 border-red-600 text-red-600 text-sm uppercase tracking-[0.15em] hover:bg-red-50 transition-colors"
              >
                Stop Recording
              </button>
            </div>
          )}

          {phase !== 'recording' && (
            <div className="mt-6 text-center">
              <button onClick={onCancel} className="text-xs text-gray-400 underline underline-offset-4 hover:text-gray-600 transition-colors">
                Cancel &amp; Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}