import React from 'react';
import { ASSETS } from '../data/mockData';
import { ActiveTab, UserProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab | 'welcome' | 'privacy';
  setActiveTab: (tab: ActiveTab | 'welcome' | 'privacy') => void;
  onOpenPrivacy: () => void;
  userProfile?: UserProfile;
  onOpenProfile: () => void;
  onOpenStressGames: () => void;
  activeBotType?: 'wellness' | 'teen_buddy';
  setActiveBotType?: (type: 'wellness' | 'teen_buddy') => void;
  isOffline?: boolean;
  isForceOffline?: boolean;
  onToggleForceOffline?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacy,
  userProfile,
  onOpenProfile,
  onOpenStressGames,
  activeBotType = 'wellness',
  setActiveBotType,
  isOffline = false,
  isForceOffline = false,
  onToggleForceOffline,
}) => {
  const isChat = activeTab === 'chat';
  const isPrivacy = activeTab === 'privacy';
  const isTeenChat = isChat && activeBotType === 'teen_buddy';
  const currentAvatar = userProfile?.avatarUrl || ASSETS.studentAvatar;
  const userName = userProfile?.name || 'Taylor';

  return (
    <header
      id="app-header"
      className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isTeenChat
          ? 'bg-[#050811]/90 border-white/10 shadow-lg shadow-black/40 text-white'
          : 'bg-[#fdfdf5]/85 border-[#e8eae0]/60 shadow-sm text-[#1a1c19]'
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-3">
          {isPrivacy ? (
            <button
              id="header-back-btn"
              onClick={() => setActiveTab('home')}
              className="p-2 rounded-full text-[#1b5e20] hover:bg-[#e8f5e9] active:scale-95 transition-all"
              aria-label="Back to Home"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <button
              id="header-logo-btn"
              onClick={() => setActiveTab('welcome')}
              className="hover:opacity-90 transition-opacity flex items-center justify-center p-1 rounded-lg active:scale-95 duration-200"
              title="Yours Truly Home"
            >
              {isTeenChat ? (
                <div className="w-8 h-8 rounded-lg bg-cyan-400 text-black flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
              ) : (
                <img
                  src={ASSETS.logo}
                  alt="Yours Truly Logo"
                  className="w-8 h-8 object-contain rounded-md drop-shadow-sm"
                />
              )}
            </button>
          )}

          <div className="flex flex-col">
            <h1
              className={`font-heading text-lg md:text-xl font-bold tracking-tight ${
                isTeenChat ? 'text-cyan-300 neon-text-glow-cyan' : 'text-[#2e7d32]'
              }`}
            >
              {isChat
                ? isTeenChat
                  ? 'Neon Buddy • Texting Cover'
                  : 'Talking with Yours Truly'
                : isPrivacy
                ? 'Privacy & Security'
                : 'Yours Truly'}
            </h1>
            {isChat && (
              <span
                className={`text-[11px] font-medium flex items-center gap-1 -mt-0.5 ${
                  isTeenChat ? 'text-cyan-400/80' : 'text-[#52634f]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isTeenChat ? 'bg-cyan-400 shadow-[0_0_6px_#00f0ff]' : 'bg-[#347d39]'
                  } animate-pulse`}
                ></span>
                {isTeenChat ? 'Tech-Savvy Teen Companion' : 'Empathetic AI Companion'}
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border transition-colors ${
            isTeenChat
              ? 'bg-[#0d1527] border-white/10'
              : 'bg-[#f0f2eb]/70 border-[#dee5d8]'
          }`}
        >
          <button
            id="nav-desktop-home"
            onClick={() => setActiveTab('home')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-[#b7f397] text-[#042100] font-semibold shadow-xs'
                : isTeenChat
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-[#424940] hover:text-[#1a1c19] hover:bg-[#e4e8e0]'
            }`}
          >
            Home
          </button>
          <button
            id="nav-desktop-chat"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'chat'
                ? isTeenChat
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-[#b7f397] text-[#042100] font-semibold shadow-xs'
                : isTeenChat
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-[#424940] hover:text-[#1a1c19] hover:bg-[#e4e8e0]'
            }`}
          >
            Chat
          </button>
          <button
            id="nav-desktop-insights"
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-[#b7f397] text-[#042100] font-semibold shadow-xs'
                : isTeenChat
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-[#424940] hover:text-[#1a1c19] hover:bg-[#e4e8e0]'
            }`}
          >
            Insights
          </button>
          <button
            id="nav-desktop-resources"
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === 'resources'
                ? 'bg-[#b7f397] text-[#042100] font-semibold shadow-xs'
                : isTeenChat
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-[#424940] hover:text-[#1a1c19] hover:bg-[#e4e8e0]'
            }`}
          >
            Resources
          </button>
        </nav>

        {/* Right: Stress Relief Games, Offline Indicator, Quick Bot Switch Pill & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline / On-Device Indicator Pill */}
          {onToggleForceOffline && (
            <button
              id="header-offline-mode-btn"
              onClick={onToggleForceOffline}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border shadow-2xs cursor-pointer ${
                isOffline || isForceOffline
                  ? isTeenChat
                    ? 'bg-purple-950/70 text-purple-300 border-purple-400/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                    : 'bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]'
                  : isTeenChat
                  ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
                  : 'bg-[#f0f2eb] text-[#52634f] border-[#dee5d8]'
              }`}
              title={
                isForceOffline
                  ? 'Forced Offline Mode Active (100% On-Device)'
                  : isOffline
                  ? 'Offline Sanctuary Mode Active (No Wi-Fi Needed)'
                  : 'Online & Ready (Click to simulate pure offline mode)'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOffline || isForceOffline ? 'bg-[#22c55e]' : 'bg-[#10b981]'
                } animate-pulse`}
              ></span>
              <span className="material-symbols-outlined text-[13px]">
                {isOffline || isForceOffline ? 'cloud_off' : 'cloud_done'}
              </span>
              <span className="hidden lg:inline">
                {isOffline || isForceOffline ? 'Offline Ready' : 'On-Device Safe'}
              </span>
            </button>
          )}

          {/* Stress Relief Games Quick Button */}
          <button
            id="header-stress-games-btn"
            onClick={onOpenStressGames}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs active:scale-95 cursor-pointer ${
              isTeenChat
                ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 hover:bg-purple-500/30'
                : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd] hover:bg-[#bae6fd]'
            }`}
            title="Open Stress Relief Games (Pop-It, Zen Sand, Calming Ripples)"
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span className="hidden sm:inline">Play & Relax</span>
          </button>

          {setActiveBotType && (
            <button
              id="header-quick-bot-switch-btn"
              onClick={() => {
                const next = activeBotType === 'wellness' ? 'teen_buddy' : 'wellness';
                setActiveBotType(next);
                if (activeTab !== 'chat') setActiveTab('chat');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-xs active:scale-95 ${
                activeBotType === 'teen_buddy'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 hover:bg-cyan-500/30'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Toggle between Sanctuary and Neon Teen Friend"
            >
              <span className="material-symbols-outlined text-[16px]">
                {activeBotType === 'teen_buddy' ? 'bolt' : 'chat_bubble'}
              </span>
              <span>{activeBotType === 'teen_buddy' ? '⚡ Neon Mode' : '🌿 Sanctuary'}</span>
            </button>
          )}

          <button
            id="header-privacy-btn"
            onClick={onOpenPrivacy}
            className={`p-2 rounded-full transition-all ${
              activeTab === 'privacy'
                ? 'bg-[#b7f397] text-[#042100]'
                : isTeenChat
                ? 'text-gray-400 hover:bg-white/10 hover:text-white'
                : 'text-[#52634f] hover:bg-[#e8f5e9] hover:text-[#2e7d32]'
            }`}
            title="Privacy & Security Sanctuary"
            aria-label="Privacy and Security"
          >
            <span className="material-symbols-outlined text-[22px]">shield_lock</span>
          </button>

          {/* Edit Profile Trigger */}
          <button
            id="header-profile-btn"
            onClick={onOpenProfile}
            className={`hover:opacity-90 transition-opacity active:scale-95 p-0.5 rounded-full border-2 overflow-hidden flex items-center gap-2 pr-2.5 ${
              isTeenChat
                ? 'border-cyan-400 bg-white/10'
                : 'border-[#b7f397] bg-white/80'
            }`}
            title={`Edit Profile (${userName})`}
          >
            <img
              src={currentAvatar}
              alt={userName}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shadow-xs"
              onError={(e) => {
                (e.target as HTMLImageElement).src = ASSETS.studentAvatar;
              }}
            />
            <span className="hidden xl:inline text-xs font-semibold text-[#1a1c19] max-w-[80px] truncate">
              {userName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

