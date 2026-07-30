import { useState, useEffect, useRef } from 'react';
import type { InterviewMode } from '../types';

interface DeviceCheckScreenProps {
  mode: InterviewMode;
  onProceed: () => void;
  onBack: () => void;
}

export default function DeviceCheckScreen({ mode, onProceed, onBack }: DeviceCheckScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let animId: number;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setPermissionGranted(true);

        const audioCtx = new AudioContext();
        const src = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(dataArray);
          const avg = Array.from(dataArray).reduce((a, b) => a + b, 0) / dataArray.length;
          setMicLevel(Math.min(1, avg / 128));
          animId = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        setError('Camera and microphone access are required to proceed. Please allow permissions in your browser settings.');
      });

    return () => {
      cancelAnimationFrame(animId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">!</span>
          </div>
          <p className="text-gray-900 text-sm mb-6">{error}</p>
          <button onClick={onBack} className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 transition-colors">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-light text-gray-900 mb-2">Device Check</h1>
            <p className="text-sm text-gray-500">Make sure your camera and microphone are working properly</p>
          </div>

          <div className="border border-gray-200 bg-gray-50 overflow-hidden mb-6">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full aspect-video object-cover bg-black"
            />
          </div>

          {/* Mic indicator */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 text-center">Microphone</p>
            <div className="flex items-center justify-center gap-0.5 sm:gap-1">
              {Array.from({ length: 20 }).map((_, i) => {
                const threshold = (i + 1) / 20;
                const active = micLevel > threshold;
                return (
                  <div
                    key={i}
                    className={`w-2 sm:w-3 h-5 sm:h-6 rounded-sm transition-colors duration-75 ${
                      active ? 'bg-gray-900' : 'bg-gray-100'
                    }`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Speak to test — bars should move with your voice</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onProceed}
              disabled={!permissionGranted}
              className="w-full py-3.5 bg-gray-900 text-white text-sm uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Start {mode === 'simulation' ? 'Simulation' : 'Practice'} Interview
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 border border-gray-300 text-gray-500 text-sm uppercase tracking-[0.2em] hover:bg-gray-50 transition-colors"
            >
              Back to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}