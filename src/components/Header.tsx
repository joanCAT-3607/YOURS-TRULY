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
          ? 'bg-white/95 border-cyan-300 shadow-md shadow-cyan-500/15 text-slate-800'
          : 'bg-[#fdfdf5]/90 border-[#e8eae0]/80 shadow-sm text-[#1a1c19]'
      }`}
    >
      <div className="flex justify-between items-center px-3 sm:px-5 md:px-8 h-20 w-full max-w-7xl mx-auto">
        {/* Left: Back button or Prominent Professional Logo */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {isPrivacy ? (
            <button
              id="header-back-btn"
              onClick={() => setActiveTab('home')}
              className="p-2.5 rounded-2xl text-[#1b5e20] bg-white hover:bg-[#e8f5e9] border border-[#dee5d8] shadow-xs active:scale-95 transition-all cursor-pointer"
              aria-label="Back to Home"
            >
              <span className="material-symbols-outlined text-[26px]">arrow_back</span>
            </button>
          ) : (
            <button
              id="header-logo-btn"
              onClick={() => setActiveTab('welcome')}
              className="group flex items-center justify-center p-1 rounded-2xl active:scale-95 transition-all duration-200 cursor-pointer"
              title="Yours Truly Home Sanctuary"
            >
              {isTeenChat ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-300 to-cyan-100 text-slate-950 flex items-center justify-center font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] border-2 border-cyan-300 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[30px] sm:text-[34px]">bolt</span>
                </div>
              ) : (
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 sm:p-2 shadow-md shadow-[#2e7d32]/20 border-2 border-[#b7f397] flex items-center justify-center group-hover:scale-105 group-hover:shadow-lg group-hover:border-[#2e7d32] transition-all">
                  <img
                    src={ASSETS.logo}
                    alt="Yours Truly Logo"
                    className="w-full h-full object-contain drop-shadow-sm rounded-lg"
                  />
                  {/* Subtle pulsing green sanctuary dot */}
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-white shadow-[0_0_8px_#22c55e] animate-pulse"></span>
                </div>
              )}
            </button>
          )}

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h1
                className={`font-heading text-xl sm:text-2xl md:text-[25px] font-black tracking-tight leading-none ${
                  isTeenChat ? 'text-cyan-900' : 'text-[#1b5e20]'
                }`}
              >
                {isChat
                  ? isTeenChat
                    ? 'Neon Buddy'
                    : 'Yours Truly'
                  : isPrivacy
                  ? 'Privacy'
                  : 'Yours Truly'}
              </h1>
              {!isChat && !isPrivacy && (
                <span className="hidden sm:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] tracking-wider">
                  Sanctuary
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              {isChat ? (
                <span
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isTeenChat ? 'text-cyan-700' : 'text-[#52634f]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isTeenChat ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : 'bg-[#22c55e]'
                    } animate-pulse`}
                  ></span>
                  {isTeenChat ? 'Active Stealth Texting Cover' : 'Empathetic Student Sanctuary'}
                </span>
              ) : isPrivacy ? (
                <span className="text-[11px] font-medium text-[#52634f]">
                  100% Confidential & Secure
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs font-medium text-[#52634f] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                  Confidential Student Wellness
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border transition-colors ${
            isTeenChat
              ? 'bg-cyan-50/80 border-cyan-200 shadow-2xs'
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
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                  : 'bg-[#b7f397] text-[#042100] font-semibold shadow-xs'
                : isTeenChat
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
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
                    ? 'bg-purple-100 text-purple-900 border-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.2)]'
                    : 'bg-[#e8f5e9] text-[#1b5e20] border-[#a5d6a7]'
                  : isTeenChat
                  ? 'bg-cyan-100/70 text-cyan-900 border-cyan-300'
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
                ? 'bg-purple-100 text-purple-800 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)] hover:bg-purple-200'
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
                  ? 'bg-cyan-100 text-cyan-900 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:bg-cyan-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
              title="Toggle between Sanctuary and Neon Teen Friend"
            >
              <span className="material-symbols-outlined text-[16px]">
                {activeBotType === 'teen_buddy' ? 'bolt' : 'chat_bubble'}
              </span>
              <span>{activeBotType === 'teen_buddy' ? '⚡ Light Neon' : '🌿 Sanctuary'}</span>
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

