import React, { useState, useEffect } from 'react';
import { playGentleBell } from '../utils/audioSynth';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (minutes: number) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [studySubject, setStudySubject] = useState('Chemistry Midterm Reading');

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          playGentleBell('complete');
          if (mode === 'focus') {
            onSessionComplete(durationMinutes);
            setMode('break');
            return 5 * 60;
          } else {
            setMode('focus');
            return durationMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, durationMinutes, onSessionComplete]);

  if (!isOpen) return null;

  const handleModeSwitch = (newMode: 'focus' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'focus') {
      setSecondsLeft(durationMinutes * 60);
    } else {
      setSecondsLeft(5 * 60);
    }
  };

  const handleDurationChange = (mins: number) => {
    setDurationMinutes(mins);
    if (mode === 'focus') {
      setSecondsLeft(mins * 60);
      setIsRunning(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent =
    mode === 'focus'
      ? ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100
      : ((5 * 60 - secondsLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfdf6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white flex flex-col items-center text-center relative overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#43483e] hover:bg-[#e8f5e9] transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Top Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">psychology</span>
          <span>Gentle Focus Sanctuary</span>
        </div>

        <h2 className="font-heading text-xl md:text-2xl font-bold text-[#1b5e20] mb-1">
          {mode === 'focus' ? 'Gentle Study Focus' : 'Calm Breathing Break'}
        </h2>
        <p className="text-xs text-[#52634f] mb-4">
          Low-pressure intervals designed to prevent cognitive burnout.
        </p>

        {/* Mode Selector */}
        <div className="flex bg-[#f0f2eb] p-1 rounded-full mb-6 border border-[#dee5d8]">
          <button
            onClick={() => handleModeSwitch('focus')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'focus'
                ? 'bg-[#386a20] text-white shadow-xs'
                : 'text-[#43483e] hover:text-[#1a1c19]'
            }`}
          >
            Study Focus ({durationMinutes}m)
          </button>
          <button
            onClick={() => handleModeSwitch('break')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              mode === 'break'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-[#43483e] hover:text-[#1a1c19]'
            }`}
          >
            Recharge Break (5m)
          </button>
        </div>

        {/* Subject Label Input */}
        <div className="w-full mb-6">
          <input
            type="text"
            value={studySubject}
            onChange={(e) => setStudySubject(e.target.value)}
            placeholder="Focus objective (e.g. Bio Chapter 3)"
            className="w-full bg-white border border-[#c2c8bd] focus:border-[#2e7d32] rounded-xl px-3.5 py-2 text-xs font-body text-center text-[#1a1c19] outline-none shadow-2xs"
          />
        </div>

        {/* Timer Circular Display */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-[#f0f2eb]"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={mode === 'focus' ? 'text-[#386a20]' : 'text-[#0284c7]'}
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl md:text-5xl font-bold text-[#1b5e20] tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#52634f] mt-1">
              {isRunning ? (mode === 'focus' ? 'In Focus' : 'In Break') : 'Paused'}
            </span>
          </div>
        </div>

        {/* Duration Selectors for Focus */}
        {mode === 'focus' && !isRunning && (
          <div className="flex gap-2 mb-6">
            {[15, 25, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  durationMinutes === mins
                    ? 'bg-[#b7f397] text-[#042100] border border-[#2e7d32]'
                    : 'bg-white text-[#43483e] border border-[#dee5d8]'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              playGentleBell(isRunning ? 'click' : 'inhale');
            }}
            className={`px-8 py-3 rounded-full text-white text-xs font-semibold shadow-md transition-all active:scale-95 flex items-center gap-2 ${
              mode === 'focus' ? 'bg-[#386a20] hover:bg-[#2e7d32]' : 'bg-[#0284c7] hover:bg-[#0369a1]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(mode === 'focus' ? durationMinutes * 60 : 5 * 60);
            }}
            className="px-4 py-3 rounded-full border border-[#c2c8bd] text-[#43483e] hover:bg-[#f0f2eb] text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
