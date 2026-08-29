import React from 'react';
import { MoodEntry } from '../types';
import { MOODS } from '../data/mockData';

interface InsightsScreenProps {
  entries: MoodEntry[];
  breathingCount: number;
  focusMinutes: number;
  onOpenBreathing: () => void;
  onOpenChat: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  entries,
  breathingCount,
  focusMinutes,
  onOpenBreathing,
  onOpenChat,
}) => {
  // Compute mood stats
  const moodCounts: Record<string, number> = {
    calm: 0,
    happy: 0,
    tired: 0,
    anxious: 0,
    overwhelmed: 0,
  };

  let totalEnergy = 0;
  entries.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    totalEnergy += e.energy;
  });

  const totalEntries = entries.length || 1;
  const avgEnergy = entries.length ? (totalEnergy / entries.length).toFixed(1) : '3.2';

  // Determine predominant emotional state
  let predominantMood = 'calm';
  let maxCount = -1;
  Object.entries(moodCounts).forEach(([mood, count]) => {
    if (count > maxCount) {
      maxCount = count;
      predominantMood = mood;
    }
  });

  const getInsightsSummary = () => {
    if (entries.length === 0) {
      return {
        title: 'Begin Your Reflection Journey',
        body: 'Log your first mood check-in to unlock personalized energy trends and compassionate university balance suggestions.',
        tip: 'Taking just 30 seconds to check in helps ground your nervous system before studying.',
      };
    }

    if (moodCounts.anxious > 0 || moodCounts.overwhelmed > 0) {
      return {
        title: 'Pacing Through Course Pressure',
        body: `You've logged feelings of stress or anxiety ${moodCounts.anxious + moodCounts.overwhelmed} time(s). Notice that you are continuing to show up despite heavy workloads. Remember that taking a 2-minute pause doesn't take away study time—it sharpens cognitive focus.`,
        tip: 'Try the 2-minute box breathing or brown noise ambient soundscape before beginning chemistry or math sets.',
      };
    }

    return {
      title: 'Grounded & Centered Momentum',
      body: `Your recent check-ins reflect steady emotional resilience with an average energy level of ${avgEnergy}/5. Continuing this self-check habit maintains clarity during exam cycles.`,
      tip: 'Celebrate small victories today—even finishing one lecture review is a win.',
    };
  };

  const summary = getInsightsSummary();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-12 animate-fadeIn">
      {/* Header */}
      <header className="text-center mb-8 md:mb-10 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-[#347d39]"></span>
          Mindful Analytics
        </div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1b5e20] mb-2 tracking-tight">
          Your Wellness Reflections
        </h1>
        <p className="font-body text-[#43483e] text-sm md:text-base">
          Gentle patterns and emotional weather over your university journey.
        </p>
      </header>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white p-4.5 rounded-2xl border border-[#dee5d8] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#52634f] uppercase tracking-wider">
            Total Check-ins
          </span>
          <div className="text-2xl md:text-3xl font-heading font-bold text-[#1b5e20] mt-2">
            {entries.length}
          </div>
          <span className="text-[11px] text-[#74796d] mt-1">Logged in sanctuary</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#dee5d8] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#52634f] uppercase tracking-wider">
            Avg Energy Level
          </span>
          <div className="text-2xl md:text-3xl font-heading font-bold text-[#ca8a04] mt-2 flex items-center gap-1">
            <span>{avgEnergy}</span>
            <span className="text-sm text-[#74796d] font-normal">/ 5</span>
          </div>
          <span className="text-[11px] text-[#74796d] mt-1">Daily stamina index</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#dee5d8] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#52634f] uppercase tracking-wider">
            Breathing Resets
          </span>
          <div className="text-2xl md:text-3xl font-heading font-bold text-[#347d39] mt-2">
            {breathingCount}
          </div>
          <span className="text-[11px] text-[#74796d] mt-1">Nervous resets</span>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-[#dee5d8] shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-[#52634f] uppercase tracking-wider">
            Gentle Focus
          </span>
          <div className="text-2xl md:text-3xl font-heading font-bold text-[#674bb5] mt-2">
            {focusMinutes}m
          </div>
          <span className="text-[11px] text-[#74796d] mt-1">Deep study duration</span>
        </div>
      </div>

      {/* Bento Grid: Care Summary & Mood Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Care Summary (2 cols) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-[#dee5d8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#347d39] text-xl fill-icon">
                auto_awesome
              </span>
              <h3 className="font-heading text-lg md:text-xl font-bold text-[#1b5e20]">
                {summary.title}
              </h3>
            </div>
            <p className="font-body text-sm md:text-base text-[#424940] leading-relaxed mb-4">
              {summary.body}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#e8f5e9]/70 border border-[#c8e6c9] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#2e7d32] text-[20px] shrink-0 mt-0.5">
              lightbulb
            </span>
            <div className="text-xs md:text-sm text-[#1b5e20] leading-relaxed">
              <strong className="font-semibold">Sanctuary Insight:</strong> {summary.tip}
            </div>
          </div>
        </div>

        {/* Action Suggestion Card */}
        <div className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] rounded-2xl p-6 border border-[#bae6fd] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0369a1] mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[22px]">spa</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#0c4a6e] mb-1">
              Need a quick pause?
            </h3>
            <p className="font-body text-xs md:text-sm text-[#0369a1] leading-relaxed mb-4">
              A 2-minute rhythmic breathing cycle lowers cortisol and improves concentration.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={onOpenBreathing}
              className="w-full py-2.5 px-4 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">air</span>
              <span>Start 2-min Breath</span>
            </button>
            <button
              onClick={onOpenChat}
              className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#f0f9ff] text-[#0284c7] border border-[#7dd3fc] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Talk with Yours Truly</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mood Distribution Visual Bar Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-[#dee5d8] shadow-xs">
        <h3 className="font-heading text-lg font-bold text-[#1b5e20] mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#347d39] text-[20px]">
            pie_chart
          </span>
          Emotional State Distribution
        </h3>

        <div className="space-y-3">
          {MOODS.map((m) => {
            const count = moodCounts[m.type] || 0;
            const percentage = entries.length ? Math.round((count / entries.length) * 100) : 0;

            return (
              <div key={m.type} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-[#1a1c19]">
                    <span className={`material-symbols-outlined text-[16px] ${m.iconColor}`}>
                      {m.icon}
                    </span>
                    {m.label}
                  </span>
                  <span className="text-[#52634f]">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-[#f0f2eb] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      m.type === 'calm'
                        ? 'bg-[#347d39]'
                        : m.type === 'happy'
                        ? 'bg-[#eab308]'
                        : m.type === 'tired'
                        ? 'bg-[#84cc16]'
                        : m.type === 'anxious'
                        ? 'bg-[#ef4444]'
                        : 'bg-[#0284c7]'
                    }`}
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
