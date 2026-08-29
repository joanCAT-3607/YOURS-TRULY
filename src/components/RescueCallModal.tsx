import React, { useEffect, useState } from 'react';
import { playNeonSound } from '../utils/audioSynth';

interface RescueCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  avatarColor: string;
}

export const RescueCallModal: React.FC<RescueCallModalProps> = ({
  isOpen,
  onClose,
  callerName,
  avatarColor,
}) => {
  const [callState, setCallState] = useState<'incoming' | 'connected'>('incoming');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallState('incoming');
      setCallDuration(0);
      return;
    }

    // Play ringing sound periodically while incoming
    let ringInterval: number;
    if (callState === 'incoming') {
      playNeonSound('ring');
      ringInterval = window.setInterval(() => {
        playNeonSound('ring');
      }, 2500);
    }

    return () => {
      clearInterval(ringInterval);
    };
  }, [isOpen, callState]);

  useEffect(() => {
    let timer: number;
    if (callState === 'connected') {
      timer = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    setCallState('connected');
    playNeonSound('tap');
  };

  const handleDecline = () => {
    playNeonSound('tap');
    onClose();
  };

  return (
    <div
      id="rescue-call-modal"
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-8 text-white font-body animate-fadeIn"
    >
      {/* Top Status */}
      <div className="w-full flex justify-between items-center text-xs text-gray-400 max-w-sm pt-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>End-to-End Encrypted</span>
        </span>
        <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded">PUBLIC COVER</span>
      </div>

      {/* Center Caller Info */}
      <div className="flex flex-col items-center space-y-4 my-auto">
        <div
          className="relative w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl animate-neon-pulse"
          style={{ borderColor: avatarColor, backgroundColor: '#0d1322' }}
        >
          <span
            className="material-symbols-outlined text-[64px]"
            style={{ color: avatarColor }}
          >
            face
          </span>
          {callState === 'incoming' && (
            <div
              className="absolute -inset-2 rounded-full border-2 border-dashed animate-spin"
              style={{ borderColor: `${avatarColor}80` }}
            ></div>
          )}
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {callerName}
          </h2>
          <p className="text-sm font-medium text-gray-400">
            {callState === 'incoming' ? 'Incoming Voice Call...' : `In Call • ${formatDuration(callDuration)}`}
          </p>
        </div>

        {/* Live Call Rescue Script for the user */}
        <div className="bg-[#111927] border border-white/10 p-4 rounded-2xl max-w-xs text-center space-y-2 shadow-lg">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            <span>Your Rescue Script</span>
          </div>
          <p className="text-xs text-gray-300 italic leading-relaxed">
            {callState === 'incoming'
              ? 'Tap Answer and say: "Oh hey! Wait, you\'re outside right now? Okay let me grab my bag and meet you!"'
              : '"Yeah yeah I hear you, heading over to the lobby in like 30 seconds! See you there."'}
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-sm flex items-center justify-around pb-8">
        {callState === 'incoming' ? (
          <>
            <button
              id="rescue-call-decline-btn"
              onClick={handleDecline}
              className="w-18 h-18 rounded-full bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center text-white shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[32px]">call_end</span>
              <span className="text-[10px] font-semibold mt-0.5">Decline</span>
            </button>

            <button
              id="rescue-call-answer-btn"
              onClick={handleAnswer}
              className="w-18 h-18 rounded-full bg-green-500 hover:bg-green-600 flex flex-col items-center justify-center text-white shadow-lg shadow-green-500/40 active:scale-95 transition-all animate-bounce"
            >
              <span className="material-symbols-outlined text-[32px]">call</span>
              <span className="text-[10px] font-semibold mt-0.5">Answer</span>
            </button>
          </>
        ) : (
          <button
            id="rescue-call-hangup-btn"
            onClick={onClose}
            className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center text-white shadow-xl shadow-red-600/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[34px]">call_end</span>
            <span className="text-[11px] font-semibold mt-0.5">End Call</span>
          </button>
        )}
      </div>
    </div>
  );
};
