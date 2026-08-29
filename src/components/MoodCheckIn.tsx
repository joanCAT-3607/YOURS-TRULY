import React, { useState } from 'react';
import { MOODS, ASSETS } from '../data/mockData';
import { MoodType, MoodEntry, UserProfile } from '../types';

interface MoodCheckInProps {
  entries: MoodEntry[];
  onSaveEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp' | 'dateStr'>) => void;
  onTalkAboutMood: (mood: MoodType, note: string) => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
  onOpenStressGames?: () => void;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  entries,
  onSaveEntry,
  onTalkAboutMood,
  userProfile,
  onOpenProfile,
  onOpenStressGames,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [justLogged, setJustLogged] = useState<boolean>(false);

  const currentAvatar = userProfile?.avatarUrl || ASSETS.studentAvatar;
  const userName = userProfile?.name || 'Taylor';
  const userMajor = userProfile?.major || 'Campus Sanctuary Member';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEntry({
      mood: selectedMood,
      energy: energyLevel,
      note: note.trim() || undefined,
    });
    setJustLogged(true);
    setTimeout(() => {
      setJustLogged(false);
      setNote('');
    }, 2800);
  };

  const getEnergyLabel = (val: number) => {
    switch (val) {
      case 1:
        return '1 - Drained & Depleted';
      case 2:
        return '2 - Low / Sluggish';
      case 3:
        return '3 - Steady & Balanced';
      case 4:
        return '4 - Energized & Active';
      case 5:
        return '5 - Highly Vibrant';
      default:
        return `${val}`;
    }
  };

  const currentMoodConfig = MOODS.find((m) => m.type === selectedMood) || MOODS[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-12">
      {/* Student Sanctuary Header Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#dee5d8] shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="relative group cursor-pointer" onClick={onOpenProfile}>
            <img
              src={currentAvatar}
              alt={userName}
              className="w-13 h-13 sm:w-15 sm:h-15 rounded-full object-cover border-2 border-[#b7f397] shadow-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSETS.studentAvatar;
              }}
            />
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#1a1c19]">
                {userName}'s Sanctuary
              </h3>
              {userProfile?.pronouns && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d]">
                  {userProfile.pronouns}
                </span>
              )}
            </div>
            <p className="text-xs text-[#52634f]">{userMajor}</p>
            {userProfile?.bio && (
              <p className="text-[11px] text-[#72796f] italic line-clamp-1 mt-0.5">
                "{userProfile.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenStressGames && (
            <button
              onClick={onOpenStressGames}
              className="px-3.5 py-2 rounded-full bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">sports_esports</span>
              <span>Stress Relief Play</span>
            </button>
          )}

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-3.5 py-2 rounded-full bg-[#f0f2eb] hover:bg-[#dcedc8] text-[#1b5e20] text-xs font-semibold flex items-center gap-1.5 transition-all border border-[#dee5d8]"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8 md:mb-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-[#347d39]"></span>
          Daily Sanctuary Check-in
        </div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1b5e20] mb-2 tracking-tight">
          Check in with yourself.
        </h2>
        <p className="font-body text-[#43483e] text-sm md:text-base">
          Take a moment. How are you feeling right now?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        {/* Mood Selection Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.type;
            return (
              <button
                key={m.type}
                type="button"
                id={`mood-select-${m.type}`}
                onClick={() => setSelectedMood(m.type)}
                className={`group rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-center relative ${
                  isSelected
                    ? 'bg-white border-2 border-[#2e7d32] shadow-md shadow-[#2e7d32]/10 -translate-y-1'
                    : 'bg-white/80 hover:bg-white border border-[#dee5d8] hover:border-[#b7f397] shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#386a20] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2e7d32]"></span>
                  </span>
                )}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected ? m.bgActive : m.bgLight
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[32px] ${m.iconColor} ${
                      isSelected ? 'fill-icon scale-110' : ''
                    } transition-transform`}
                  >
                    {m.icon}
                  </span>
                </div>
                <span
                  className={`font-heading text-sm md:text-base font-semibold ${
                    isSelected ? 'text-[#1b5e20]' : 'text-[#43483e]'
                  }`}
                >
                  {m.label}
                </span>
                <span className="text-[11px] text-[#74796d] mt-0.5 hidden sm:block">
                  {m.description.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Energy Level Slider */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-[#dee5d8] max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-heading text-base md:text-lg font-bold text-[#1b5e20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#347d39] text-[20px]">
                bolt
              </span>
              Energy Level
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32]">
              {getEnergyLabel(energyLevel)}
            </span>
          </div>

          <div className="px-2 pt-2 pb-1">
            <input
              id="energy-slider"
              type="range"
              min="1"
              max="5"
              step="1"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
              className="w-full accent-[#2e7d32] cursor-pointer h-2 bg-[#dcedc8] rounded-lg"
            />
            <div className="flex justify-between mt-2 text-xs font-semibold text-[#52634f]">
              <span>Low (1)</span>
              <span>Steady (3)</span>
              <span>High (5)</span>
            </div>
          </div>
        </div>

        {/* Reflection Note Input */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-[#dee5d8] max-w-2xl mx-auto">
          <label
            htmlFor="mood-note"
            className="block font-heading text-sm md:text-base font-bold text-[#1b5e20] mb-2 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[#347d39] text-[20px]">
              edit_note
            </span>
            Add a note (optional)
          </label>
          <textarea
            id="mood-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? (e.g., studying for chemistry midterm, tired from late lab, nervous about group project...)"
            className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl p-3.5 text-sm font-body text-[#1a1c19] placeholder-[#72796f] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all resize-none"
          />
        </div>

        {/* Submit & Action Buttons */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="submit"
            id="log-mood-btn"
            disabled={justLogged}
            className={`w-full sm:w-auto min-w-[200px] py-3.5 px-8 rounded-full font-heading font-semibold text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
              justLogged
                ? 'bg-[#2e7d32] text-white'
                : 'bg-[#386a20] hover:bg-[#2e7d32] text-white hover:shadow-lg hover:shadow-[#386a20]/20 hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {justLogged ? (
              <>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                <span>Check-in Recorded!</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">check</span>
                <span>Log Entry</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="talk-about-checkin-btn"
            onClick={() => onTalkAboutMood(selectedMood, note)}
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#e8f5e9] hover:bg-[#dcedc8] text-[#1b5e20] border border-[#c8e6c9] font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            <span>Talk with Yours Truly about this</span>
          </button>
        </div>
      </form>

      {/* Recent Entries History Preview */}
      {entries.length > 0 && (
        <div className="mt-12 max-w-2xl mx-auto pt-6 border-t border-[#dee5d8]/70">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-heading text-base font-bold text-[#1b5e20] flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#386a20]">
                history
              </span>
              Recent Mood Log
            </h4>
            <span className="text-xs text-[#52634f] font-medium">
              {entries.length} check-in{entries.length > 1 ? 's' : ''} saved
            </span>
          </div>

          <div className="space-y-2.5">
            {entries.slice(0, 3).map((item) => {
              const config = MOODS.find((m) => m.type === item.mood) || MOODS[0];
              return (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-[#dee5d8] shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${config.bgLight} flex items-center justify-center shrink-0`}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${config.iconColor}`}>
                        {config.icon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-semibold text-[#1a1c19]">
                          {config.label}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f0f2eb] text-[#52634f]">
                          Energy {item.energy}/5
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-xs text-[#52634f] mt-0.5 line-clamp-1 italic">
                          "{item.note}"
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#74796d] whitespace-nowrap">
                    {item.dateStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
