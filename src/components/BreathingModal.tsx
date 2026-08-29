import React, { useState, useEffect } from 'react';
import { playGentleBell } from '../utils/audioSynth';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: () => void;
}

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale' | 'Rest';

export const BreathingModal: React.FC<BreathingModalProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [secondsRemaining, setSecondsRemaining] = useState(120); // 2 minutes total
  const [phaseSeconds, setPhaseSeconds] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setSecondsRemaining(120);
      setPhase('Inhale');
      setPhaseSeconds(4);
      return;
    }
    // Auto start on open
    setIsActive(true);
    playGentleBell('inhale');
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || !isOpen) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          playGentleBell('complete');
          onSessionComplete();
          return 0;
        }
        return prev - 1;
      });

      setPhaseSeconds((prev) => {
        if (prev <= 1) {
          // Switch phase: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Rest (4s)
          setPhase((currentPhase) => {
            if (currentPhase === 'Inhale') {
              playGentleBell('click');
              return 'Hold';
            }
            if (currentPhase === 'Hold') {
              playGentleBell('exhale');
              return 'Exhale';
            }
            if (currentPhase === 'Exhale') {
              playGentleBell('click');
              return 'Rest';
            }
            // Rest -> Next cycle Inhale
            setCompletedCycles((c) => c + 1);
            playGentleBell('inhale');
            return 'Inhale';
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isOpen, onSessionComplete]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Breathe in slowly through your nose...';
      case 'Hold':
        return 'Hold gently, soft shoulders...';
      case 'Exhale':
        return 'Release slowly through your mouth...';
      case 'Rest':
        return 'Rest comfortably in stillness...';
    }
  };

  const getOrbScale = () => {
    switch (phase) {
      case 'Inhale':
        return 'scale-125 md:scale-140 bg-[#b7f397]';
      case 'Hold':
        return 'scale-125 md:scale-140 bg-[#81c784]';
      case 'Exhale':
        return 'scale-90 bg-[#c8e6c9]';
      case 'Rest':
        return 'scale-90 bg-[#e8f5e9]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfdf6] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-white flex flex-col items-center text-center relative overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#43483e] hover:bg-[#e8f5e9] transition-colors"
          aria-label="Close breathing session"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Top Phase Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[16px]">air</span>
          <span>Box Breathing 4-4-4-4</span>
        </div>

        <h2 className="font-heading text-2xl font-bold text-[#1b5e20] mb-1">
          Quick Breathing Reset
        </h2>
        <p className="text-xs text-[#52634f] mb-6">
          Time remaining: <span className="font-semibold text-[#1b5e20]">{formatTime(secondsRemaining)}</span>
        </p>

        {/* Visual Breathing Circle */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center my-4">
          {/* Ambient Outer Rings */}
          <div className="absolute inset-0 rounded-full border border-[#2e7d32]/20 scale-110 pointer-events-none"></div>
          <div className="absolute inset-0 rounded-full border border-[#2e7d32]/10 scale-130 pointer-events-none"></div>

          {/* Animated Core Orb */}
          <div
            className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center shadow-lg shadow-[#386a20]/15 transition-all duration-4000 ease-in-out ${getOrbScale()}`}
          >
            <span className="font-heading text-xl md:text-2xl font-bold text-[#042100]">
              {phase}
            </span>
            <span className="font-body text-xs font-semibold text-[#1b5e20] mt-1">
              {phaseSeconds}s
            </span>
          </div>
        </div>

        {/* Phase Instruction Text */}
        <p className="font-body text-sm font-medium text-[#1b5e20] h-6 mb-6 transition-all duration-300">
          {getPhaseInstruction()}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-2.5 rounded-full bg-[#386a20] hover:bg-[#2e7d32] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isActive ? 'pause' : 'play_arrow'}
            </span>
            <span>{isActive ? 'Pause Session' : 'Resume'}</span>
          </button>

          <button
            onClick={() => {
              setSecondsRemaining(120);
              setPhase('Inhale');
              setPhaseSeconds(4);
              setIsActive(true);
            }}
            className="px-4 py-2.5 rounded-full border border-[#c2c8bd] text-[#43483e] hover:bg-[#f0f2eb] text-xs font-semibold transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset</span>
          </button>
        </div>

        {/* Cycles Footer */}
        <div className="mt-6 text-[11px] text-[#74796d]">
          Cycles completed: <span className="font-bold text-[#1b5e20]">{completedCycles}</span>
        </div>
      </div>
    </div>
  );
};
