import React, { useEffect, useState } from 'react';
import { ASSETS, MOODS } from '../data/mockData';
import { MoodType, UserProfile, FeedbackEntry } from '../types';
import { FeedbackBox } from './FeedbackBox';
import { NatureBackground, NATURE_SCENES, NatureScene } from './NatureBackground';

interface WelcomeScreenProps {
  onStartTalking: () => void;
  onStartNeonBuddy: () => void;
  onQuickMoodSelect: (mood: MoodType) => void;
  onGoToHome: () => void;
  userProfile?: UserProfile;
  onOpenProfile: () => void;
  onOpenStressGames: () => void;
  onOpenBreathing?: () => void;
  onOpenSleepAudio?: () => void;
  onOpenJournal?: () => void;
  onOpenFocusTimer?: () => void;
  onOpenCampusLinks?: () => void;
  breathingCount?: number;
  focusMinutes?: number;
  feedbackList?: FeedbackEntry[];
  onSaveFeedback?: (feedback: Omit<FeedbackEntry, 'id' | 'timestamp'>) => void;
}

const UPLIFTING_GREETING_QUOTES = [
  {
    quote: "You don't have to carry the whole semester today. Just take this next single breath.",
    author: "Mindful Reminder",
    icon: "spa",
  },
  {
    quote: "Rest is productive. Your nervous system deserves a gentle moment of stillness.",
    author: "Sanctuary Reflection",
    icon: "self_improvement",
  },
  {
    quote: "You are far more than your grades, your deadlines, or your productivity.",
    author: "Compassion Note",
    icon: "favorite",
  },
  {
    quote: "One step, one page, one breath. You are doing much better than you realize.",
    author: "Daily Encouragement",
    icon: "nature_people",
  },
  {
    quote: "It is okay to pause and acknowledge how much you're holding right now.",
    author: "Gentle Space",
    icon: "psychology",
  },
  {
    quote: "Give yourself permission to slow down and let your shoulders drop.",
    author: "Body Grounding",
    icon: "air",
  },
  {
    quote: "Small moments of calm create steady foundations for everything you do.",
    author: "Inner Peace",
    icon: "filter_vintage",
  },
  {
    quote: "Every storm passes, and every difficult assignment gets submitted eventually.",
    author: "Student Resilience",
    icon: "wb_sunny",
  },
  {
    quote: "Be proud of showing up today, even in subtle and quiet ways.",
    author: "Sanctuary Voice",
    icon: "local_florist",
  },
  {
    quote: "Honor your energy levels today without guilt or comparison to others.",
    author: "Gentle Guidance",
    icon: "yard",
  },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartTalking,
  onStartNeonBuddy,
  onQuickMoodSelect,
  onGoToHome,
  userProfile,
  onOpenProfile,
  onOpenStressGames,
  onOpenBreathing,
  onOpenSleepAudio,
  onOpenJournal,
  onOpenFocusTimer,
  onOpenCampusLinks,
  breathingCount = 0,
  focusMinutes = 0,
  feedbackList = [],
  onSaveFeedback = () => {},
}) => {
  const userName = userProfile?.name || 'Taylor';
  const avatarUrl = userProfile?.avatarUrl || ASSETS.studentAvatar;
  const major = userProfile?.major || 'Undergraduate Student';
  const college = userProfile?.college || 'Campus Sanctuary';

  // Dynamic Nature Scenes & Ambient Transitions
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  const currentScene = NATURE_SCENES[currentSceneIndex];

  // Dynamic Time-of-Day greeting with subtitle
  const [greeting, setGreeting] = useState<{ text: string; icon: string; subtext: string }>({
    text: 'Welcome back',
    icon: 'wb_sunny',
    subtext: 'Wishing you a peaceful, steady moment of calm',
  });

  // Dynamic Uplifting Quote state
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [isQuoteFading, setIsQuoteFading] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({
        text: 'Good morning',
        icon: 'wb_sunny',
        subtext: 'A fresh, quiet start for your mind and body',
      });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({
        text: 'Good afternoon',
        icon: 'light_mode',
        subtext: 'Take a gentle pause amidst your midday hustle',
      });
    } else if (hour >= 17 && hour < 22) {
      setGreeting({
        text: 'Good evening',
        icon: 'wb_twilight',
        subtext: 'Unwind your mind and release today’s tension',
      });
    } else {
      setGreeting({
        text: 'Peaceful night',
        icon: 'bedtime',
        subtext: 'Rest deeply, you’ve done enough for today',
      });
    }
  }, []);

  // Ambient Nature Transition Cycle
  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setCurrentSceneIndex((prev) => (prev + 1) % NATURE_SCENES.length);
    }, 28000); // Smooth transition every 28 seconds

    return () => clearInterval(interval);
  }, [isAutoCycling]);

  // Dynamic quote auto-refresh every 12 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setIsQuoteFading(true);
      setTimeout(() => {
        setQuoteIdx((prev) => (prev + 1) % UPLIFTING_GREETING_QUOTES.length);
        setIsQuoteFading(false);
      }, 300);
    }, 12000);

    return () => clearInterval(quoteInterval);
  }, []);

  const handleSelectScene = (scene: NatureScene) => {
    const idx = NATURE_SCENES.findIndex((s) => s.id === scene.id);
    if (idx !== -1) {
      setCurrentSceneIndex(idx);
    }
  };

  const handleToggleAutoCycle = () => {
    setIsAutoCycling((prev) => !prev);
  };

  const handleNextQuote = () => {
    setIsQuoteFading(true);
    setTimeout(() => {
      setQuoteIdx((prev) => (prev + 1) % UPLIFTING_GREETING_QUOTES.length);
      setIsQuoteFading(false);
    }, 200);
  };

  const currentQuote = UPLIFTING_GREETING_QUOTES[quoteIdx];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start overflow-hidden px-4 py-6 sm:py-10 transition-colors duration-1000">
      
      {/* Dynamic Multi-Layered Nature Background Canvas with Particle Physics & Smooth Transitions */}
      <NatureBackground
        currentScene={currentScene}
        isAutoCycling={isAutoCycling}
        onSelectScene={handleSelectScene}
        onToggleAutoCycle={handleToggleAutoCycle}
        showControls={false}
      />

      {/* Main Container Over Nature Canvas */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Top Header Row: Persona Pill & Privacy Shield */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-4 animate-fadeIn">
          <button
            onClick={onOpenProfile}
            id="welcome-profile-badge"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#dee5d8] shadow-2xs hover:border-[#b7f397] hover:shadow-xs transition-all cursor-pointer group text-xs text-[#52634f]"
            title="Edit your student persona & comfort vibe"
          >
            <img
              src={avatarUrl}
              alt={userName}
              className="w-5 h-5 rounded-full object-cover border border-[#c8e6c9]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSETS.studentAvatar;
              }}
            />
            <span className="font-medium text-[#1a241e] group-hover:text-[#2e7d32]">
              {major} • {college}
            </span>
            <span className="material-symbols-outlined text-[14px] text-[#72796f] group-hover:text-[#2e7d32]">
              edit
            </span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f5e9]/90 backdrop-blur-md border border-[#c8e6c9] text-[#1b5e20] text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span>100% Confidential & On-Device</span>
          </div>
        </div>

        {/* Big Prominent Time-of-Day Greeting Wishes with Dynamic Uplifting Quote */}
        <div className="w-full max-w-2xl text-center mb-7 animate-fadeIn">
          
          {/* Big Greeting Headline */}
          <div className="inline-flex items-center justify-center gap-2.5 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border-2 border-[#b7f397] shadow-sm mb-3.5">
            <span className="material-symbols-outlined text-[26px] sm:text-[30px] text-[#2e7d32] animate-bounce">
              {greeting.icon}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a241e] tracking-tight">
              {greeting.text}, <span className="text-[#2e7d32]">{userName}</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm md:text-base font-medium text-[#414942] mb-3">
            {greeting.subtext}
          </p>

          {/* Dynamic Uplifting Quote Card that auto-refreshes and can be clicked to refresh */}
          <div
            onClick={handleNextQuote}
            className="group relative max-w-xl mx-auto p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-md border-2 border-[#dee5d8] hover:border-[#a5d6a7] shadow-sm hover:shadow-md transition-all cursor-pointer text-left"
            title="Click to refresh inspiring quote"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] text-[#2e7d32] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[22px]">
                  {currentQuote.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`transition-all duration-300 ${isQuoteFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
                  <p className="text-sm sm:text-base font-semibold text-[#1a241e] italic leading-snug mb-1">
                    "{currentQuote.quote}"
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#2e7d32] font-bold">
                      — {currentQuote.author}
                    </span>
                    <span className="text-[10px] text-[#72796f] group-hover:text-[#2e7d32] flex items-center gap-0.5 font-medium">
                      <span className="material-symbols-outlined text-[13px] group-hover:rotate-180 transition-transform duration-500">
                        cached
                      </span>
                      <span>Tap to refresh</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section: Zen Aura & Sanctuary Emblem Logo */}
        <div className="w-full max-w-2xl text-center space-y-3 mb-8">
          {/* Layered Animated Logo Sphere */}
          <div className="relative inline-flex items-center justify-center mb-1">
            {/* Breathing outer halo rings */}
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#b7f397]/40 blur-xl animate-pulse"></div>
            <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#a5d6a7]/40 animate-ping opacity-25"></div>

            {/* Glass Card Container with Logo */}
            <div className="relative w-28 h-28 sm:w-34 sm:h-34 rounded-3xl bg-white/95 p-4 sm:p-5 shadow-xl shadow-[#386a20]/15 border-2 border-white flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <img
                src={ASSETS.logo}
                alt="Yours Truly Logo"
                className="w-full h-full object-contain drop-shadow-sm"
              />
              <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#386a20] text-white flex items-center justify-center text-xs shadow-md">
                🌿
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a241e] tracking-tight">
              Yours Truly
            </h1>
            <p className="font-body text-[#414942] text-sm sm:text-base md:text-lg max-w-lg mx-auto leading-relaxed">
              Your confidential student sanctuary to decompress, express emotion, and find calm amidst academic pressure.
            </p>
          </div>
        </div>

        {/* Bento Mode Showcase (Attractive Feature Cards) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          
          {/* Card 1: Mindful Sanctuary Chat (Featured Card - 7 cols on desktop) */}
          <div className="md:col-span-7 bg-gradient-to-br from-[#ffffff] via-[#f7faf4] to-[#edf7e8] rounded-3xl p-6 border-2 border-[#c8e6c9] shadow-md shadow-[#2e7d32]/10 hover:shadow-xl hover:border-[#a5d6a7] transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#b7f397]/25 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b5e20] text-xs font-bold border border-[#a5d6a7]">
                  <span className="material-symbols-outlined text-[16px] text-[#2e7d32]">spa</span>
                  <span>Mindful AI Sanctuary</span>
                </div>
                <span className="text-[11px] text-[#52634f] font-semibold bg-white/80 px-2.5 py-0.5 rounded-full border border-[#dee5d8]">
                  Empathetic & Gentle
                </span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#1a241e] mb-1.5">
                Talk with Yours Truly
              </h2>
              <p className="text-xs sm:text-sm text-[#414942] leading-relaxed mb-4">
                A non-judgmental space for emotional processing, study overwhelm, midterm exhaustion, and thoughtful listening.
              </p>

              {/* Instant discussion starters */}
              <div className="space-y-1.5 mb-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#52634f] block">
                  Quick conversation prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={onStartTalking}
                    className="text-[11px] px-3 py-1 rounded-full bg-white text-[#2e7d32] border border-[#c8e6c9] hover:bg-[#e8f5e9] transition-all cursor-pointer"
                  >
                    "Feeling drained by deadlines"
                  </button>
                  <button
                    onClick={onStartTalking}
                    className="text-[11px] px-3 py-1 rounded-full bg-white text-[#2e7d32] border border-[#c8e6c9] hover:bg-[#e8f5e9] transition-all cursor-pointer"
                  >
                    "Struggling with social energy"
                  </button>
                  <button
                    onClick={onStartTalking}
                    className="text-[11px] px-3 py-1 rounded-full bg-white text-[#2e7d32] border border-[#c8e6c9] hover:bg-[#e8f5e9] transition-all cursor-pointer"
                  >
                    "Need a 5-min mental pause"
                  </button>
                </div>
              </div>
            </div>

            <button
              id="welcome-start-talking-card-btn"
              onClick={onStartTalking}
              className="w-full bg-[#386a20] hover:bg-[#2e7d32] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md shadow-[#386a20]/20 hover:shadow-lg hover:shadow-[#386a20]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            >
              <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
              <span className="text-sm sm:text-base font-bold">Open Sanctuary Chat</span>
              <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform ml-auto">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 2: Neon Tech Buddy - Kai ⚡ (Light aesthetic with glowing neon lights) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#ffffff] via-[#f0fdfa] to-[#e0f2fe] text-slate-900 rounded-3xl p-6 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 hover:border-cyan-300 hover:shadow-cyan-500/35 transition-all flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Neon Glow Light Orbs */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/25 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-fuchsia-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-bold border border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)]">
                  <span className="material-symbols-outlined text-[16px] text-cyan-600 animate-neon-pulse">bolt</span>
                  <span>Public Stealth Cover</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 border border-cyan-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-ping"></span>
                  <span className="text-[10px] font-mono font-bold text-cyan-700">NEON ON</span>
                </div>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <span>Kai ⚡ Neon Buddy</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-100/80 text-cyan-800 font-mono border border-cyan-300 font-semibold shadow-2xs">
                  LIGHT NEON
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Chat casually in crowded lecture halls, cafeterias, or campus libraries. Looks like a sleek tech chat with glowing neon accents.
              </p>

              <div className="p-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-cyan-300/80 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-[11px] text-slate-700 mb-5 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-700">
                  <span className="material-symbols-outlined text-[15px] text-cyan-500">shield</span>
                  <span>Anti-Shoulder Surfing & Light Neon Glow</span>
                </div>
                <p className="text-slate-500">
                  Tech banter, meme debates, fake phone calls & fast-text study gossip.
                </p>
              </div>
            </div>

            <button
              id="welcome-start-neon-card-btn"
              onClick={onStartNeonBuddy}
              className="w-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/45 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
            >
              <span className="material-symbols-outlined text-[20px]">terminal</span>
              <span className="text-sm sm:text-base font-extrabold tracking-wide">Launch Light Neon Mode</span>
              <span className="material-symbols-outlined text-[18px] group-hover/btn:translate-x-1 transition-transform ml-auto">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Card 3: Tactile Stress Relief Mini-Games (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#ffffff] to-[#e0f2fe]/60 rounded-3xl p-5 border border-[#bae6fd] shadow-sm hover:shadow-md hover:border-[#7dd3fc] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center mb-3 border border-[#bae6fd]">
                <span className="material-symbols-outlined text-[22px]">sports_esports</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a241e] mb-1">
                Stress Relief Games
              </h3>
              <p className="text-xs text-[#52634f] leading-relaxed mb-3">
                Sensory Bubble Pop-It, Zen Kinetic Sand, and Calming Rain Pond ripples.
              </p>
            </div>

            <button
              id="welcome-games-bento-btn"
              onClick={onOpenStressGames}
              className="w-full bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#0369a1] border border-[#7dd3fc] font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">bubble_chart</span>
              <span>Play Mini-Games</span>
            </button>
          </div>

          {/* Card 4: 4-7-8 Breathing & Soundscapes (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#ffffff] to-[#f3e8ff]/60 rounded-3xl p-5 border border-[#e9d5ff] shadow-sm hover:shadow-md hover:border-[#d8b4fe] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center mb-3 border border-[#e9d5ff]">
                <span className="material-symbols-outlined text-[22px]">air</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a241e] mb-1">
                Breathing & Audio
              </h3>
              <p className="text-xs text-[#52634f] leading-relaxed mb-3">
                4-7-8 parasympathetic rhythm & soothing library rain / brown noise.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                id="welcome-breathing-bento-btn"
                onClick={onOpenBreathing || onStartTalking}
                className="flex-1 bg-[#f3e8ff] hover:bg-[#e9d5ff] text-[#7e22ce] border border-[#d8b4fe] font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                <span>Breathe</span>
              </button>
              <button
                id="welcome-audio-bento-btn"
                onClick={onOpenSleepAudio || onStartTalking}
                className="flex-1 bg-white hover:bg-[#f3e8ff]/50 text-[#7e22ce] border border-[#e9d5ff] font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">headphones</span>
                <span>Audio</span>
              </button>
            </div>
          </div>

          {/* Card 5: Daily Mood Tracking & Journal (4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-[#ffffff] to-[#ecfdf5]/60 rounded-3xl p-5 border border-[#a7f3d0] shadow-sm hover:shadow-md hover:border-[#6ee7b7] transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center mb-3 border border-[#a7f3d0]">
                <span className="material-symbols-outlined text-[22px]">insights</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-[#1a241e] mb-1">
                Mood Check-in & Journal
              </h3>
              <p className="text-xs text-[#52634f] leading-relaxed mb-3">
                Record your emotional energy logs and write reflections in privacy.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                id="welcome-checkin-bento-btn"
                onClick={onGoToHome}
                className="flex-1 bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] border border-[#a7f3d0] font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
                <span>Check-in</span>
              </button>
              {onOpenJournal && (
                <button
                  id="welcome-journal-bento-btn"
                  onClick={onOpenJournal}
                  className="flex-1 bg-white hover:bg-[#ecfdf5]/50 text-[#047857] border border-[#a7f3d0] font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">book</span>
                  <span>Journal</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Quick Feeling Selector Strip */}
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-[#dee5d8] shadow-sm mb-8 text-center">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2e7d32] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">mood</span>
              <span>How are you feeling in this moment?</span>
            </span>
            <span className="text-[11px] text-[#72796f]">Tap to start instant reflection</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.type}
                id={`welcome-quick-mood-${m.type}`}
                onClick={() => onQuickMoodSelect(m.type)}
                className="p-2.5 rounded-2xl bg-[#fdfdf7] hover:bg-white text-[#33691e] border border-[#dee5d8] hover:border-[#a5d6a7] shadow-2xs hover:shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
              >
                <span className="material-symbols-outlined text-[24px] text-[#386a20] group-hover:scale-110 transition-transform">
                  {m.icon}
                </span>
                <span className="text-xs font-bold text-[#1a241e]">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Student Privacy & Campus Trust Shield */}
        <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-10 text-center">
          <div className="p-3 rounded-2xl bg-white/80 border border-[#dee5d8] shadow-2xs">
            <span className="material-symbols-outlined text-[18px] text-[#2e7d32] mb-1">lock</span>
            <h4 className="text-[11px] font-bold text-[#1a241e]">100% On-Device</h4>
            <p className="text-[10px] text-[#52634f]">Saved locally in browser</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-[#dee5d8] shadow-2xs">
            <span className="material-symbols-outlined text-[18px] text-[#2e7d32] mb-1">wifi_off</span>
            <h4 className="text-[11px] font-bold text-[#1a241e]">Offline Ready</h4>
            <p className="text-[10px] text-[#52634f]">Works without Wi-Fi</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-[#dee5d8] shadow-2xs">
            <span className="material-symbols-outlined text-[18px] text-[#2e7d32] mb-1">visibility_off</span>
            <h4 className="text-[11px] font-bold text-[#1a241e]">Zero Tracking</h4>
            <p className="text-[10px] text-[#52634f]">No accounts or ads</p>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-[#dee5d8] shadow-2xs">
            <span className="material-symbols-outlined text-[18px] text-[#2e7d32] mb-1">health_and_safety</span>
            <h4 className="text-[11px] font-bold text-[#1a241e]">Campus Safe</h4>
            <p className="text-[10px] text-[#52634f]">Emergency links ready</p>
          </div>
        </div>

        {/* Student Feedback & Suggestion Box at the Bottom */}
        <FeedbackBox
          userProfile={userProfile}
          feedbackList={feedbackList}
          onSaveFeedback={onSaveFeedback}
        />
      </div>
    </div>
  );
};
