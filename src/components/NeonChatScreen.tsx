import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BuddyProfile, NeonThemeColor, UserProfile } from '../types';
import { TEEN_VIBE_STARTERS } from '../data/mockData';
import { playNeonSound } from '../utils/audioSynth';
import { RescueCallModal } from './RescueCallModal';

interface NeonChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onSwitchToWellness: () => void;
  buddyProfile: BuddyProfile;
  onUpdateBuddyProfile: (profile: BuddyProfile) => void;
  userProfile?: UserProfile;
  onOpenStressGames?: () => void;
}

export const NeonChatScreen: React.FC<NeonChatScreenProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onSwitchToWellness,
  buddyProfile,
  onUpdateBuddyProfile,
  userProfile,
  onOpenStressGames,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [neonTheme, setNeonTheme] = useState<NeonThemeColor>('cyan');
  const [isLightMode, setIsLightMode] = useState(true); // Default to light neon colour
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isRescueCallOpen, setIsRescueCallOpen] = useState(false);
  const [isSpamming, setIsSpamming] = useState(false);
  const [editName, setEditName] = useState(buddyProfile.name);
  const [editStatus, setEditStatus] = useState(buddyProfile.statusText);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isSpamming]);

  // Comprehensive Light & Dark Neon Themes with Glowing Neon Lights
  const themeStyles = {
    cyan: {
      accent: '#06b6d4',
      accentGlow: 'rgba(6, 182, 212, 0.45)',
      glowClass: 'neon-glow-cyan',
      borderClass: 'neon-border-cyan',
      textClass: 'text-cyan-700',
      badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
      bubbleAiLight: 'bg-white/95 border-2 border-cyan-400 text-slate-800 shadow-[0_0_16px_rgba(6,182,212,0.25)]',
      bubbleAiDark: 'bg-[#0d1527] border-2 border-cyan-400 text-cyan-50 shadow-[0_0_16px_rgba(6,182,212,0.35)]',
      userBubble: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_18px_rgba(6,182,212,0.45)]',
      inputRing: 'focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/50',
      sendBtn: 'bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold shadow-[0_0_16px_rgba(6,182,212,0.5)]',
      cardBorder: 'border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    },
    magenta: {
      accent: '#f43f5e',
      accentGlow: 'rgba(244, 63, 94, 0.45)',
      glowClass: 'neon-glow-magenta',
      borderClass: 'neon-border-magenta',
      textClass: 'text-rose-700',
      badgeClass: 'bg-pink-50 text-rose-800 border-pink-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
      bubbleAiLight: 'bg-white/95 border-2 border-pink-400 text-slate-800 shadow-[0_0_16px_rgba(244,63,94,0.25)]',
      bubbleAiDark: 'bg-[#1c0e24] border-2 border-pink-400 text-pink-50 shadow-[0_0_16px_rgba(244,63,94,0.35)]',
      userBubble: 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white shadow-[0_0_18px_rgba(244,63,94,0.45)]',
      inputRing: 'focus-within:border-pink-400 focus-within:ring-2 focus-within:ring-pink-400/50',
      sendBtn: 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-300 hover:to-rose-400 text-white font-bold shadow-[0_0_16px_rgba(244,63,94,0.5)]',
      cardBorder: 'border-pink-400/80 shadow-[0_0_15px_rgba(244,63,94,0.25)]',
    },
    green: {
      accent: '#10b981',
      accentGlow: 'rgba(16, 185, 129, 0.45)',
      glowClass: 'neon-glow-green',
      borderClass: 'neon-border-green',
      textClass: 'text-emerald-700',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
      bubbleAiLight: 'bg-white/95 border-2 border-emerald-400 text-slate-800 shadow-[0_0_16px_rgba(16,185,129,0.25)]',
      bubbleAiDark: 'bg-[#0a1b14] border-2 border-emerald-400 text-emerald-50 shadow-[0_0_16px_rgba(16,185,129,0.35)]',
      userBubble: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)]',
      inputRing: 'focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/50',
      sendBtn: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold shadow-[0_0_16px_rgba(16,185,129,0.5)]',
      cardBorder: 'border-emerald-400/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    },
    purple: {
      accent: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.45)',
      glowClass: 'neon-glow-purple',
      borderClass: 'neon-border-purple',
      textClass: 'text-purple-700',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]',
      bubbleAiLight: 'bg-white/95 border-2 border-purple-400 text-slate-800 shadow-[0_0_16px_rgba(168,85,247,0.25)]',
      bubbleAiDark: 'bg-[#170e28] border-2 border-purple-400 text-purple-50 shadow-[0_0_16px_rgba(168,85,247,0.35)]',
      userBubble: 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.45)]',
      inputRing: 'focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-400/50',
      sendBtn: 'bg-gradient-to-r from-purple-400 to-violet-500 hover:from-purple-300 hover:to-violet-400 text-white font-bold shadow-[0_0_16px_rgba(168,85,247,0.5)]',
      cardBorder: 'border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    },
  };

  const currentTheme = themeStyles[neonTheme] || themeStyles.cyan;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (soundEnabled && e.target.value.length % 3 === 0) {
      playNeonSound('tap');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    if (soundEnabled) playNeonSound('message_out');
    await onSendMessage(text);
    if (soundEnabled) playNeonSound('message_in');
  };

  const handleChipClick = async (promptText: string) => {
    if (isLoading) return;
    if (promptText.includes('Fake emergency call') || promptText.includes('Fake call')) {
      setIsRescueCallOpen(true);
      return;
    }
    if (promptText.includes('Spam me')) {
      handleTriggerSpamBurst();
      return;
    }
    if (soundEnabled) playNeonSound('tap');
    await onSendMessage(promptText);
    if (soundEnabled) playNeonSound('message_in');
  };

  // Trigger rapid burst of incoming texts to make the user look super busy in public
  const handleTriggerSpamBurst = async () => {
    if (isSpamming || isLoading) return;
    setIsSpamming(true);
    if (soundEnabled) playNeonSound('message_out');

    const spamSequence = [
      "BRO NO WAY 💀",
      "did you just see what happened??",
      "check discord right this second or I'm deleting your steam account 😭",
      "tell me you're not still sitting in that cafe alone lmao"
    ];

    for (let i = 0; i < spamSequence.length; i++) {
      await new Promise((res) => setTimeout(res, 700));
      if (soundEnabled) playNeonSound('message_in');
      await onSendMessage(i === 0 ? "Spam me with texts so I look busy!" : "");
    }
    setIsSpamming(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBuddyProfile({
      ...buddyProfile,
      name: editName.trim() || 'Kai ⚡',
      statusText: editStatus.trim() || 'typing fast 🎮',
    });
    setIsEditProfileOpen(false);
    if (soundEnabled) playNeonSound('tap');
  };

  return (
    <div
      className={`w-full flex-1 flex flex-col relative min-h-[calc(100vh-4rem)] transition-colors duration-500 selection:bg-cyan-500/30 ${
        isLightMode
          ? 'bg-gradient-to-b from-[#f3faf8] via-[#edf7f9] to-[#f4f6fa] text-slate-800 cyber-grid-light'
          : 'bg-[#070b14] text-gray-100 cyber-grid-bg'
      }`}
    >
      {/* Ambient Neon Light Orbs in Background */}
      <div
        className="absolute top-10 left-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 animate-pulse"
        style={{ backgroundColor: currentTheme.accentGlow }}
      ></div>
      <div
        className="absolute bottom-20 right-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-30 animate-pulse"
        style={{ backgroundColor: currentTheme.accentGlow }}
      ></div>

      {/* Subtle Scanline Animation */}
      <div className="scanline-effect opacity-40"></div>

      {/* Top Cyberpunk Neon Control Header */}
      <div className="w-full max-w-4xl mx-auto px-3 md:px-6 pt-3 pb-2 flex flex-col gap-2.5 z-20">
        {/* Main Companion Bar */}
        <div
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 transition-all backdrop-blur-md ${
            isLightMode
              ? 'bg-white/90 border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.15)] text-slate-900'
              : 'bg-[#0d1424]/90 border-cyan-500/40 shadow-lg text-white'
          }`}
          style={{ borderColor: currentTheme.accent }}
        >
          {/* Buddy Profile & Online status */}
          <div className="flex items-center gap-3">
            <button
              id="neon-edit-avatar-btn"
              onClick={() => setIsEditProfileOpen(true)}
              className="relative p-0.5 rounded-full transition-transform active:scale-95 group cursor-pointer"
              title="Customize Friend Name & Persona"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 text-white font-bold transition-all group-hover:scale-105 shadow-md"
                style={{
                  borderColor: currentTheme.accent,
                  backgroundColor: isLightMode ? '#e0f7fa' : '#111927',
                  boxShadow: `0 0 12px ${currentTheme.accentGlow}`,
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: currentTheme.accent }}
                >
                  {buddyProfile.avatarIcon || 'bolt'}
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_6px_#10b981] animate-pulse"></span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`font-heading font-bold text-sm md:text-base tracking-wide flex items-center gap-1.5 ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {buddyProfile.name}
                  {!isStealthMode && (
                    <span
                      className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase font-bold border shadow-2xs"
                      style={{
                        backgroundColor: isLightMode ? '#e0f7fa' : 'rgba(255,255,255,0.1)',
                        color: currentTheme.accent,
                        borderColor: currentTheme.accent,
                      }}
                    >
                      NEON BUDDY
                    </span>
                  )}
                </span>
              </div>
              <span
                className={`text-[11px] truncate max-w-[180px] md:max-w-xs flex items-center gap-1 font-medium ${
                  isLightMode ? 'text-slate-600' : 'text-gray-400'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                {buddyProfile.statusText}
              </span>
            </div>
          </div>

          {/* Right Action Tools: Light/Dark Neon Mode, Rescue Call, Stealth Mode, & Switch to Wellness */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Toggle Light / Dark Neon Atmosphere */}
            <button
              id="neon-light-dark-toggle-btn"
              onClick={() => setIsLightMode(!isLightMode)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                isLightMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)] hover:bg-amber-100'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.3)] hover:bg-cyan-900/60'
              }`}
              title={isLightMode ? 'Switch to Midnight Dark Neon' : 'Switch to Luminous Light Neon'}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isLightMode ? 'light_mode' : 'dark_mode'}
              </span>
              <span className="hidden sm:inline font-bold">
                {isLightMode ? 'Light Neon' : 'Dark Neon'}
              </span>
            </button>

            {/* Rescue Call Button */}
            <button
              id="neon-rescue-call-btn"
              onClick={() => setIsRescueCallOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-400/60 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.25)] active:scale-95 transition-all cursor-pointer"
              title="Simulate Fake Incoming Phone Call for public escape"
            >
              <span className="material-symbols-outlined text-[16px] text-red-500 animate-bounce">
                phone_in_talk
              </span>
              <span className="hidden sm:inline">Rescue Call</span>
            </button>

            {/* Stealth Cover Mode Toggle */}
            <button
              id="neon-stealth-toggle-btn"
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isStealthMode
                  ? 'bg-cyan-100 text-cyan-900 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : isLightMode
                  ? 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-900'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title="Stealth Incognito Mode (looks like normal iMessage/Discord)"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isStealthMode ? 'visibility_off' : 'visibility'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              id="neon-sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                soundEnabled
                  ? isLightMode
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-2xs'
                    : 'bg-white/10 text-white border-white/20'
                  : 'bg-white/5 text-gray-400 border-slate-200'
              }`}
              title="Toggle Typing & Audio SFX"
            >
              <span className="material-symbols-outlined text-[18px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Switch to Sanctuary Mode (Yours Truly) */}
            <button
              id="neon-switch-wellness-btn"
              onClick={onSwitchToWellness}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.25)] active:scale-95 cursor-pointer"
              title="Switch to gentle Yours Truly sanctuary mode"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">spa</span>
              <span className="hidden md:inline">Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Neon Light Scheme Picker & Quick Cover Utilities (Hidden in Stealth Mode) */}
        {!isStealthMode && (
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Color Scheme Picker with glowing rings */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-xl border shadow-xs shrink-0 ${
                isLightMode ? 'bg-white/90 border-slate-200' : 'bg-[#0d1424]/90 border-white/10'
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mr-1 flex items-center gap-1 ${
                  isLightMode ? 'text-slate-600' : 'text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-[13px] text-cyan-500">flare</span>
                <span>Neon Lights:</span>
              </span>
              <button
                onClick={() => setNeonTheme('cyan')}
                className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                  neonTheme === 'cyan'
                    ? 'scale-125 ring-2 ring-cyan-500 shadow-[0_0_10px_#06b6d4]'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: '#06b6d4' }}
                title="Electric Cyan Lights"
              />
              <button
                onClick={() => setNeonTheme('magenta')}
                className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                  neonTheme === 'magenta'
                    ? 'scale-125 ring-2 ring-pink-500 shadow-[0_0_10px_#f43f5e]'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: '#f43f5e' }}
                title="Neon Magenta Lights"
              />
              <button
                onClick={() => setNeonTheme('green')}
                className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                  neonTheme === 'green'
                    ? 'scale-125 ring-2 ring-emerald-500 shadow-[0_0_10px_#10b981]'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: '#10b981' }}
                title="Radiant Lime Lights"
              />
              <button
                onClick={() => setNeonTheme('purple')}
                className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
                  neonTheme === 'purple'
                    ? 'scale-125 ring-2 ring-purple-500 shadow-[0_0_10px_#a855f7]'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: '#a855f7' }}
                title="Ultraviolet Lights"
              />
            </div>

            {/* Quick Public Cover Action Chips with Neon outlines */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={handleTriggerSpamBurst}
                disabled={isSpamming || isLoading}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all shadow-[0_0_8px_rgba(245,158,11,0.2)] active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-amber-600">bolt</span>
                <span>Spam Me ⚡ (Look Busy)</span>
              </button>

              {onOpenStressGames && (
                <button
                  onClick={onOpenStressGames}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all shadow-[0_0_8px_rgba(168,85,247,0.2)] active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px] text-purple-600">sports_esports</span>
                  <span>🫧 Fidget Games</span>
                </button>
              )}

              <button
                onClick={() =>
                  handleChipClick("Pretend we're having an intense debate about iPhone vs Android so I look focused")
                }
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                  isLightMode
                    ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 shadow-2xs'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                }`}
              >
                📱 Tech Debate
              </button>

              <button
                onClick={() =>
                  handleChipClick("Rate my Spotify playlist taste and roast my favorite artists")
                }
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                  isLightMode
                    ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 shadow-2xs'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                }`}
              >
                🎧 Aux Check
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Scroll Area */}
      <main className="flex-1 overflow-y-auto px-3 md:px-8 pt-2 pb-36 no-scrollbar space-y-3.5 max-w-4xl mx-auto w-full z-10">
        {/* Stealth Mode Notice or Public Space Tag */}
        <div className="flex justify-center my-1">
          <div
            className={`px-3.5 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 border shadow-xs backdrop-blur-sm ${
              isLightMode
                ? 'bg-white/90 text-slate-700 border-cyan-200'
                : 'bg-[#0e1626]/80 text-gray-300 border-white/10'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentTheme.accent }}
            ></span>
            <span>
              {isStealthMode
                ? 'Direct Message • Active'
                : 'Light Neon Companion • Stealth Texting Cover Active'}
            </span>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex flex-col gap-3.5 w-full">
          {messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} w-full`}
              >
                <div
                  className={`flex items-end gap-2 max-w-[88%] md:max-w-[78%] ${
                    isAI ? 'self-start' : 'self-end flex-row-reverse'
                  }`}
                >
                  {/* AI Avatar */}
                  {isAI && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 border-2 shadow-md"
                      style={{
                        borderColor: currentTheme.accent,
                        backgroundColor: isLightMode ? '#e0f7fa' : '#0c1322',
                        boxShadow: `0 0 10px ${currentTheme.accentGlow}`,
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: currentTheme.accent }}
                      >
                        {buddyProfile.avatarIcon || 'bolt'}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 md:p-4 rounded-2xl ${
                      isAI
                        ? isLightMode
                          ? `${currentTheme.bubbleAiLight} rounded-bl-xs`
                          : `${currentTheme.bubbleAiDark} rounded-bl-xs`
                        : `${currentTheme.userBubble} rounded-br-xs`
                    }`}
                  >
                    <p className="font-body text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </p>
                    <div
                      className={`mt-1 flex items-center justify-end text-[10px] ${
                        isAI
                          ? isLightMode
                            ? 'text-slate-400'
                            : 'text-gray-400'
                          : 'text-white/80'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Suggestion Chips */}
                {isAI && msg.suggestions && msg.suggestions.length > 0 && !isStealthMode && (
                  <div className="flex gap-1.5 self-start ml-10 mt-1.5 flex-wrap">
                    {msg.suggestions.map((chip, idx) => (
                      <button
                        key={idx}
                        id={`neon-suggestion-${idx}`}
                        onClick={() => handleChipClick(chip)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                          isLightMode
                            ? 'bg-white hover:bg-cyan-50 text-slate-800 border-cyan-300 shadow-2xs hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-[#0e172a] hover:bg-[#1e293b] text-gray-200 border-white/10 hover:border-cyan-400 shadow-2xs hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {(isLoading || isSpamming) && (
            <div className="flex items-end gap-2 self-start max-w-[80%]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 border-2 shadow-md"
                style={{
                  borderColor: currentTheme.accent,
                  backgroundColor: isLightMode ? '#e0f7fa' : '#0c1322',
                  boxShadow: `0 0 10px ${currentTheme.accentGlow}`,
                }}
              >
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ color: currentTheme.accent }}
                >
                  {buddyProfile.avatarIcon || 'bolt'}
                </span>
              </div>
              <div
                className={`border-2 p-3.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-md ${
                  isLightMode
                    ? 'bg-white/95 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'bg-[#0d1527] border-cyan-400/40 shadow-lg'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full animate-bounce"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span
                  className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:0.2s]"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span
                  className="w-2.5 h-2.5 rounded-full animate-bounce [animation-delay:0.4s]"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span
                  className={`text-xs ml-1.5 font-bold ${
                    isLightMode ? 'text-slate-600' : 'text-gray-400'
                  }`}
                >
                  {buddyProfile.name} is typing...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area (Pinned above bottom nav on mobile, at bottom on desktop) */}
      <div
        className={`fixed bottom-[68px] md:bottom-3 left-0 w-full z-40 pt-3 pb-2 transition-colors ${
          isLightMode
            ? 'bg-gradient-to-t from-[#f3faf8] via-[#f3faf8]/95 to-transparent'
            : 'bg-gradient-to-t from-[#070b14] via-[#070b14]/95 to-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto px-3 md:px-8">
          {/* Quick topic starters carousel */}
          {!isStealthMode && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-1">
              {TEEN_VIBE_STARTERS.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => handleChipClick(vibe.prompt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border shrink-0 transition-all active:scale-95 cursor-pointer ${
                    isLightMode
                      ? 'bg-white/95 hover:bg-cyan-50 text-slate-800 border-cyan-200 shadow-2xs hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'bg-[#0b1322]/90 hover:bg-[#142036] text-gray-300 border-white/10 hover:border-cyan-400'
                  }`}
                >
                  {vibe.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`relative flex items-center rounded-full p-1.5 md:p-2 border-2 ${currentTheme.inputRing} transition-all ${
              isLightMode
                ? 'bg-white/95 border-cyan-300 shadow-[0_4px_25px_rgba(6,182,212,0.2)]'
                : 'bg-[#0d1527] border-white/15 shadow-2xl'
            }`}
          >
            {/* Quick Rescue Phone Button in input */}
            <button
              type="button"
              id="neon-input-call-btn"
              onClick={() => setIsRescueCallOpen(true)}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-full flex items-center justify-center cursor-pointer"
              title="Trigger Emergency Rescue Call"
            >
              <span className="material-symbols-outlined text-[20px]">phone</span>
            </button>

            <input
              id="neon-chat-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                isStealthMode
                  ? 'iMessage...'
                  : `Text ${buddyProfile.name}... (talk about games, music, drama)`
              }
              disabled={isLoading || isSpamming}
              className={`flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-body text-sm md:text-base px-2 h-10 ${
                isLightMode
                  ? 'text-slate-900 placeholder-slate-400'
                  : 'text-white placeholder-gray-500'
              }`}
            />

            <button
              type="submit"
              id="neon-chat-send-btn"
              disabled={!inputValue.trim() || isLoading || isSpamming}
              className={`${currentTheme.sendBtn} disabled:bg-gray-300 disabled:text-gray-500 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 cursor-pointer`}
              title="Send text"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Customize Buddy Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border-2 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-fadeIn ${
              isLightMode ? 'bg-white border-cyan-400' : 'bg-[#0b1322] border-cyan-500/40'
            }`}
          >
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3
                className={`font-heading font-bold text-lg flex items-center gap-2 ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`}
              >
                <span className="material-symbols-outlined text-cyan-500">tune</span>
                <span>Customize AI Friend</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Friend / Contact Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Alex ⚡, Jordan 🎮, Sarah 🎧"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-500 ${
                    isLightMode
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-[#111c30] border-white/20 text-white'
                  }`}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Set this to a friend's name to disguise the chat completely in public.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Status Message
                </label>
                <input
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  placeholder="e.g. at the library 📚, playing valorant 🎮"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-cyan-500 ${
                    isLightMode
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-[#111c30] border-white/20 text-white'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-400/30 cursor-pointer"
                >
                  Save Friend Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rescue Call Modal */}
      <RescueCallModal
        isOpen={isRescueCallOpen}
        onClose={() => setIsRescueCallOpen(false)}
        callerName={buddyProfile.name}
        avatarColor={currentTheme.accent}
      />
    </div>
  );
};

