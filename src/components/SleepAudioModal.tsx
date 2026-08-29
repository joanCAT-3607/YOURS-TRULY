import React, { useState, useEffect, useRef } from 'react';
import { SOUND_TRACKS } from '../data/mockData';
import { SoundTrack } from '../types';
import { AmbientSoundGenerator } from '../utils/audioSynth';

interface SleepAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepAudioModal: React.FC<SleepAudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<SoundTrack>(SOUND_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const synthRef = useRef<AmbientSoundGenerator | null>(null);

  useEffect(() => {
    synthRef.current = new AmbientSoundGenerator();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (isPlaying) {
        synthRef.current?.stop();
        setIsPlaying(false);
      }
      setTimeLeft(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isPlaying || timeLeft === null) return;
    if (timeLeft <= 0) {
      synthRef.current?.stop();
      setIsPlaying(false);
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  if (!isOpen) return null;

  const handleTogglePlay = (track: SoundTrack) => {
    if (selectedTrack.id === track.id && isPlaying) {
      synthRef.current?.stop();
      setIsPlaying(false);
    } else {
      setSelectedTrack(track);
      synthRef.current?.start(track.type, volume);
      setIsPlaying(true);
      if (timerMinutes) {
        setTimeLeft(timerMinutes * 60);
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    synthRef.current?.setVolume(newVol);
  };

  const handleSetTimer = (mins: number | null) => {
    setTimerMinutes(mins);
    if (mins) {
      setTimeLeft(mins * 60);
    } else {
      setTimeLeft(null);
    }
  };

  const formatTimeLeft = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1c2e]/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fcfdf6] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-white flex flex-col no-scrollbar animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bbeceb] text-[#1f4e4e] text-xs font-semibold uppercase tracking-wider mb-1.5">
              <span className="material-symbols-outlined text-[16px]">nightlight</span>
              <span>Sleep & Calm Audio</span>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-[#0d1c2e]">
              Sleep Better Soundscapes
            </h2>
            <p className="text-xs text-[#545d62]">
              Synthesized natural frequencies to wind down and quiet racing thoughts.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#43483e] hover:bg-[#e8f5e9] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Soundtrack Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {SOUND_TRACKS.map((track) => {
            const isThisPlaying = isPlaying && selectedTrack.id === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleTogglePlay(track)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isThisPlaying
                    ? 'bg-white border-[#386a20] shadow-md ring-2 ring-[#b7f397]'
                    : 'bg-white/80 hover:bg-white border-[#dee5d8]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${track.color}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {track.icon}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[24px] ${
                      isThisPlaying ? 'text-[#386a20]' : 'text-[#72796f]'
                    }`}
                  >
                    {isThisPlaying ? 'pause_circle' : 'play_circle'}
                  </span>
                </div>

                <div>
                  <h4 className="font-heading text-sm font-bold text-[#1a1c19]">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-[#52634f] mt-0.5 line-clamp-1">
                    {track.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Playing Status & Controls */}
        <div className="bg-white rounded-2xl p-4 border border-[#dee5d8] shadow-xs mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#386a20] animate-ping' : 'bg-[#c2c8bd]'}`} />
              <span className="text-xs font-semibold text-[#1a1c19]">
                {isPlaying ? `Playing: ${selectedTrack.title}` : 'Select a soundscape to begin'}
              </span>
            </div>
            {timeLeft !== null && (
              <span className="text-xs font-bold text-[#386a20] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
                ⏳ {formatTimeLeft(timeLeft)} left
              </span>
            )}
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-[#52634f]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">volume_down</span>
                Volume
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-[#386a20] h-2 bg-[#e8f5e9] rounded-lg cursor-pointer"
            />
          </div>

          {/* Sleep Timer Options */}
          <div>
            <span className="text-[11px] font-semibold text-[#52634f] block mb-1.5">
              Auto-off Sleep Timer
            </span>
            <div className="flex gap-2">
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetTimer(timerMinutes === mins ? null : mins)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    timerMinutes === mins
                      ? 'bg-[#386a20] text-white'
                      : 'bg-[#f0f2eb] text-[#43483e] hover:bg-[#e8f5e9]'
                  }`}
                >
                  {mins} min
                </button>
              ))}
              {timerMinutes && (
                <button
                  onClick={() => handleSetTimer(null)}
                  className="px-2 text-xs text-[#ba1a1a] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#386a20] text-white text-xs font-semibold shadow-xs hover:bg-[#2e7d32] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
