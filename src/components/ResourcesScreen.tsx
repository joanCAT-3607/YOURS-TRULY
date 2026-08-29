import React from 'react';
import { ASSETS } from '../data/mockData';

interface ResourcesScreenProps {
  onOpenBreathing: () => void;
  onOpenCampusLinks: () => void;
  onOpenJournal: () => void;
  onOpenSleepAudio: () => void;
  onOpenFocusTimer: () => void;
  onOpenStressGames: () => void;
}

export const ResourcesScreen: React.FC<ResourcesScreenProps> = ({
  onOpenBreathing,
  onOpenCampusLinks,
  onOpenJournal,
  onOpenSleepAudio,
  onOpenFocusTimer,
  onOpenStressGames,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-28 md:pb-12">
      {/* Header Section */}
      <header className="w-full max-w-3xl mx-auto flex flex-col items-center text-center mb-8 md:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="w-2 h-2 rounded-full bg-[#347d39]"></span>
          Resource Hub
        </div>
        <h1 className="font-heading text-2xl md:text-4xl font-bold text-[#347d39] mb-3 tracking-tight">
          Sort Things Out
        </h1>
        <p className="font-body text-[#424940] text-sm md:text-base max-w-2xl leading-relaxed">
          A curated collection of gentle resources to help you find your center, lower stress, and navigate university life with a bit more ease.
        </p>
      </header>

      {/* Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Card 1: Quick Breathing */}
        <article
          id="resource-card-breathing"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50"
        >
          <div className="h-36 w-full rounded-xl mb-4 relative overflow-hidden bg-gradient-to-br from-[#e8f5e9] to-[#dcedc8] flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-[#347d39] opacity-80 animate-pulse">
              air
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#347d39] text-xl fill-icon">
              self_improvement
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Quick Breathing Exercise
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-5 flex-grow leading-relaxed">
            A gentle 2-minute guided breathing session to reset your nervous system before a big lecture or exam.
          </p>

          <button
            id="start-breathing-btn"
            onClick={onOpenBreathing}
            className="self-start px-4 py-2 bg-[#b4f7b6] text-[#002103] rounded-full text-xs font-semibold hover:bg-[#98d99b] active:scale-95 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Start Session</span>
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
          </button>
        </article>

        {/* Card 2: Campus Mental Health Links (Spans 2 columns on lg) */}
        <article
          id="resource-card-campus"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50 lg:col-span-2"
        >
          <div
            className="h-36 w-full rounded-xl mb-4 relative overflow-hidden bg-cover bg-center"
            style={{ backgroundImage: `url('${ASSETS.campusCourtyard}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
              <span className="text-white text-xs font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
                Campus Sanctuary Support
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#52634f] text-xl fill-icon">
              health_and_safety
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Campus Mental Health Links
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-4 flex-grow leading-relaxed">
            Direct, confidential access to university counseling services, peer support groups, and 24/7 crisis hotlines.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-auto">
            <button
              onClick={onOpenCampusLinks}
              className="px-3.5 py-1.5 bg-[#eaede6] hover:bg-[#dcedc8] text-[#1b5e20] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">phone</span>
              <span>Counseling Center</span>
            </button>
            <button
              onClick={onOpenCampusLinks}
              className="px-3.5 py-1.5 bg-[#eaede6] hover:bg-[#dcedc8] text-[#1b5e20] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">groups</span>
              <span>Peer Support</span>
            </button>
            <button
              onClick={onOpenCampusLinks}
              className="px-3.5 py-1.5 bg-[#ffdad6] text-[#93000a] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto"
            >
              <span className="material-symbols-outlined text-[16px]">emergency</span>
              <span>Crisis Hotline (988)</span>
            </button>
          </div>
        </article>

        {/* Card 3: Journaling Prompts */}
        <article
          id="resource-card-journal"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50"
        >
          <div className="h-32 w-full rounded-xl mb-4 bg-[#d5e8ce]/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-[#52634f]">
              edit_note
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#52634f] text-xl fill-icon">
              book
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Journaling Prompts
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-5 flex-grow leading-relaxed">
            Thoughtful, low-pressure prompts to help untangle your thoughts and process the week's events.
          </p>

          <button
            id="view-journal-prompts-btn"
            onClick={onOpenJournal}
            className="w-full px-4 py-2.5 bg-[#fcfdf6] text-[#347d39] border border-[#347d39]/30 rounded-full text-xs font-semibold hover:bg-[#e8f5e9] transition-all flex justify-center items-center gap-1.5"
          >
            <span>View Prompts & Write</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </article>

        {/* Card 4: Sleep Better */}
        <article
          id="resource-card-sleep"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50"
        >
          <div className="h-32 w-full rounded-xl mb-4 bg-[#bbeceb]/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-5xl text-[#386666]">
              bedtime
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#386666] text-xl fill-icon">
              nightlight
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Sleep Better
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-5 flex-grow leading-relaxed">
            Simple routines and ambient soundscapes (rain, forest breeze, brown noise) to help you wind down.
          </p>

          <button
            id="explore-audio-btn"
            onClick={onOpenSleepAudio}
            className="w-full px-4 py-2.5 bg-[#fcfdf6] text-[#347d39] border border-[#347d39]/30 rounded-full text-xs font-semibold hover:bg-[#e8f5e9] transition-all flex justify-center items-center gap-1.5"
          >
            <span>Explore Audio Soundscapes</span>
            <span className="material-symbols-outlined text-[16px]">volume_up</span>
          </button>
        </article>

        {/* Card 5: Gentle Focus */}
        <article
          id="resource-card-focus"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50"
        >
          <div className="h-32 w-full rounded-xl mb-4 relative overflow-hidden bg-gradient-to-tr from-[#98d99b] to-[#b4f7b6] flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-[#002103] opacity-40">
              timer
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#347d39] text-xl fill-icon">
              psychology
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Gentle Focus
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-5 flex-grow leading-relaxed">
            A low-stress Pomodoro timer designed for reading heavy assignments without feeling rushed.
          </p>

          <button
            id="set-focus-timer-btn"
            onClick={onOpenFocusTimer}
            className="w-full px-4 py-2.5 bg-[#fcfdf6] text-[#347d39] border border-[#347d39]/30 rounded-full text-xs font-semibold hover:bg-[#e8f5e9] transition-all flex justify-center items-center gap-1.5"
          >
            <span>Open Focus Timer</span>
            <span className="material-symbols-outlined text-[16px]">schedule</span>
          </button>
        </article>

        {/* Card 6: Stress Relief Mini-Games */}
        <article
          id="resource-card-games"
          className="bg-white rounded-2xl p-5 soft-shadow card-shadow flex flex-col h-full border border-[#dee5d8]/50"
        >
          <div className="h-32 w-full rounded-xl mb-4 relative overflow-hidden bg-gradient-to-tr from-[#fef08a] via-[#bbf7d0] to-[#bae6fd] flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-[#15803d] opacity-70">
              sports_esports
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[#0284c7] text-xl fill-icon">
              radio_button_checked
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold text-[#1a1c19]">
              Tactile Stress Relief Games
            </h2>
          </div>

          <p className="font-body text-sm text-[#424940] mb-5 flex-grow leading-relaxed">
            Interactive sensory pop-it bubble wrap, Zen sand garden raking, and harmonic kalimba ripple soundscapes.
          </p>

          <button
            id="open-stress-games-btn"
            onClick={onOpenStressGames}
            className="w-full px-4 py-2.5 bg-[#dcfce7] text-[#15803d] border border-[#86efac] rounded-full text-xs font-semibold hover:bg-[#bbf7d0] transition-all flex justify-center items-center gap-1.5 shadow-2xs"
          >
            <span>Play Stress Relief Games</span>
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
          </button>
        </article>
      </main>
    </div>
  );
};
