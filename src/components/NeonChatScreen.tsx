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

  // Color mappings
  const themeStyles = {
    cyan: {
      accent: '#00f0ff',
      glowClass: 'neon-glow-cyan',
      borderClass: 'neon-border-cyan',
      textClass: 'text-[#00f0ff]',
      bgBadge: 'bg-[#00f0ff]/15 text-[#00f0ff] border-[#00f0ff]/30',
      bubbleAi: 'bg-[#0d1527] border-[#00f0ff]/40 text-cyan-50 shadow-[0_0_15px_rgba(0,240,255,0.15)]',
      userBubble: 'bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white shadow-[0_0_15px_rgba(0,180,216,0.3)]',
      inputRing: 'focus-within:border-[#00f0ff] focus-within:ring-2 focus-within:ring-[#00f0ff]/40',
      sendBtn: 'bg-[#00f0ff] hover:bg-[#38bdf8] text-[#050811] shadow-[0_0_15px_rgba(0,240,255,0.4)]',
    },
    magenta: {
      accent: '#ff007f',
      glowClass: 'neon-glow-magenta',
      borderClass: 'neon-border-magenta',
      textClass: 'text-[#ff007f]',
      bgBadge: 'bg-[#ff007f]/15 text-[#ff007f] border-[#ff007f]/30',
      bubbleAi: 'bg-[#1a0f24] border-[#ff007f]/40 text-pink-50 shadow-[0_0_15px_rgba(255,0,127,0.15)]',
      userBubble: 'bg-gradient-to-r from-[#ff007f] to-[#b026ff] text-white shadow-[0_0_15px_rgba(255,0,127,0.35)]',
      inputRing: 'focus-within:border-[#ff007f] focus-within:ring-2 focus-within:ring-[#ff007f]/40',
      sendBtn: 'bg-[#ff007f] hover:bg-[#ff409f] text-white shadow-[0_0_15px_rgba(255,0,127,0.4)]',
    },
    green: {
      accent: '#39ff14',
      glowClass: 'neon-glow-green',
      borderClass: 'neon-border-green',
      textClass: 'text-[#39ff14]',
      bgBadge: 'bg-[#39ff14]/15 text-[#39ff14] border-[#39ff14]/30',
      bubbleAi: 'bg-[#0a180f] border-[#39ff14]/40 text-emerald-50 shadow-[0_0_15px_rgba(57,255,20,0.15)]',
      userBubble: 'bg-gradient-to-r from-[#10b981] to-[#047857] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      inputRing: 'focus-within:border-[#39ff14] focus-within:ring-2 focus-within:ring-[#39ff14]/40',
      sendBtn: 'bg-[#39ff14] hover:bg-[#4ade80] text-[#050811] shadow-[0_0_15px_rgba(57,255,20,0.4)]',
    },
    purple: {
      accent: '#a855f7',
      glowClass: 'neon-glow-purple',
      borderClass: 'neon-border-purple',
      textClass: 'text-[#c084fc]',
      bgBadge: 'bg-[#a855f7]/15 text-[#c084fc] border-[#a855f7]/30',
      bubbleAi: 'bg-[#150d24] border-[#a855f7]/40 text-purple-50 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
      userBubble: 'bg-gradient-to-r from-[#9333ea] to-[#6366f1] text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]',
      inputRing: 'focus-within:border-[#a855f7] focus-within:ring-2 focus-within:ring-[#a855f7]/40',
      sendBtn: 'bg-[#a855f7] hover:bg-[#c084fc] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    },
  };

  const currentTheme = themeStyles[neonTheme];

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
    <div className="w-full flex-1 flex flex-col bg-[#050811] text-gray-100 relative min-h-[calc(100vh-4rem)] cyber-grid-bg selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Subtle Scanline Animation */}
      <div className="scanline-effect"></div>

      {/* Top Cyberpunk Neon Control Header */}
      <div className="w-full max-w-4xl mx-auto px-3 md:px-6 pt-3 pb-2 flex flex-col gap-2.5 z-20">
        {/* Main Companion Bar */}
        <div className="flex items-center justify-between bg-[#0a0f1d]/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          {/* Buddy Profile & Online status */}
          <div className="flex items-center gap-3">
            <button
              id="neon-edit-avatar-btn"
              onClick={() => setIsEditProfileOpen(true)}
              className="relative p-0.5 rounded-full transition-transform active:scale-95 group"
              title="Customize Friend Name & Persona"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 text-white font-bold transition-all group-hover:scale-105"
                style={{ borderColor: currentTheme.accent, backgroundColor: '#111927' }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: currentTheme.accent }}
                >
                  {buddyProfile.avatarIcon || 'bolt'}
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-[#050811] animate-pulse"></span>
            </button>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm md:text-base text-white tracking-wide flex items-center gap-1.5">
                  {buddyProfile.name}
                  {!isStealthMode && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono uppercase bg-white/10 text-gray-300">
                      BOT
                    </span>
                  )}
                </span>
              </div>
              <span className="text-[11px] text-gray-400 truncate max-w-[180px] md:max-w-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {buddyProfile.statusText}
              </span>
            </div>
          </div>

          {/* Right Action Tools: Rescue Call, Stealth Mode, & Switch to Wellness */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Rescue Call Button */}
            <button
              id="neon-rescue-call-btn"
              onClick={() => setIsRescueCallOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
              title="Simulate Fake Incoming Phone Call for public escape"
            >
              <span className="material-symbols-outlined text-[16px] animate-bounce">
                phone_in_talk
              </span>
              <span className="hidden sm:inline">Rescue Call</span>
            </button>

            {/* Stealth Cover Mode Toggle */}
            <button
              id="neon-stealth-toggle-btn"
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                isStealthMode
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-xs'
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
              className={`p-2 rounded-xl text-xs font-medium border transition-all ${
                soundEnabled
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-white/5 text-gray-500 border-white/10'
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
              className="px-3 py-1.5 rounded-xl bg-[#2e7d32]/30 hover:bg-[#2e7d32]/50 text-[#b7f397] border border-[#b7f397]/40 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="Switch to gentle Yours Truly sanctuary mode"
            >
              <span className="material-symbols-outlined text-[16px]">spa</span>
              <span className="hidden md:inline">Sanctuary</span>
            </button>
          </div>
        </div>

        {/* Neon Theme Selector & Quick Cover Utilities (Hidden in Stealth Mode) */}
        {!isStealthMode && (
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            {/* Color Scheme Picker */}
            <div className="flex items-center gap-1.5 bg-[#0a0f1d]/80 px-2.5 py-1 rounded-xl border border-white/10 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1">
                Neon:
              </span>
              <button
                onClick={() => setNeonTheme('cyan')}
                className={`w-4 h-4 rounded-full transition-transform ${
                  neonTheme === 'cyan' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-60'
                }`}
                style={{ backgroundColor: '#00f0ff' }}
                title="Cyber Cyan"
              />
              <button
                onClick={() => setNeonTheme('magenta')}
                className={`w-4 h-4 rounded-full transition-transform ${
                  neonTheme === 'magenta' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-60'
                }`}
                style={{ backgroundColor: '#ff007f' }}
                title="Neon Magenta"
              />
              <button
                onClick={() => setNeonTheme('green')}
                className={`w-4 h-4 rounded-full transition-transform ${
                  neonTheme === 'green' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-60'
                }`}
                style={{ backgroundColor: '#39ff14' }}
                title="Acid Lime"
              />
              <button
                onClick={() => setNeonTheme('purple')}
                className={`w-4 h-4 rounded-full transition-transform ${
                  neonTheme === 'purple' ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-black' : 'opacity-60'
                }`}
                style={{ backgroundColor: '#a855f7' }}
                title="Synthwave Purple"
              />
            </div>

            {/* Quick Public Cover Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={handleTriggerSpamBurst}
                disabled={isSpamming || isLoading}
                className="px-2.5 py-1 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/30 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Spam Me ⚡ (Look Busy)</span>
              </button>

              {onOpenStressGames && (
                <button
                  onClick={onOpenStressGames}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-400/30 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[14px]">sports_esports</span>
                  <span>🫧 Fidget Games</span>
                </button>
              )}

              <button
                onClick={() => handleChipClick("Pretend we're having an intense debate about iPhone vs Android so I look focused")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-medium shrink-0 transition-all"
              >
                📱 Tech Debate
              </button>

              <button
                onClick={() => handleChipClick("Rate my Spotify playlist taste and roast my favorite artists")}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] font-medium shrink-0 transition-all"
              >
                🎧 Aux Check
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Scroll Area */}
      <main className="flex-1 overflow-y-auto px-3 md:px-8 pt-2 pb-36 no-scrollbar space-y-3.5 max-w-4xl mx-auto w-full">
        {/* Stealth Mode Notice or Public Space Tag */}
        <div className="flex justify-center my-1">
          <div className="bg-[#0e1626]/80 px-3.5 py-1 rounded-full text-gray-400 text-[11px] font-mono flex items-center gap-1.5 border border-white/5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: currentTheme.accent }}
            ></span>
            <span>
              {isStealthMode
                ? 'Direct Message • Active'
                : 'Tech-Savvy Teen Buddy • Public Texting Cover Active'}
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
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 border"
                      style={{
                        borderColor: currentTheme.accent,
                        backgroundColor: '#0c1322',
                      }}
                    >
                      <span
                        className="material-symbols-outlined text-[15px]"
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
                        ? `${currentTheme.bubbleAi} rounded-bl-xs border`
                        : `${currentTheme.userBubble} rounded-br-xs`
                    }`}
                  >
                    <p className="font-body text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <div className="mt-1 flex items-center justify-end text-[10px] text-gray-400/80">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Suggestion Chips */}
                {isAI && msg.suggestions && msg.suggestions.length > 0 && !isStealthMode && (
                  <div className="flex gap-1.5 self-start ml-9 mt-1.5 flex-wrap">
                    {msg.suggestions.map((chip, idx) => (
                      <button
                        key={idx}
                        id={`neon-suggestion-${idx}`}
                        onClick={() => handleChipClick(chip)}
                        className="bg-[#0e172a] hover:bg-[#1e293b] text-gray-200 px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:border-cyan-400 shadow-2xs hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all active:scale-95"
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
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-1 border"
                style={{
                  borderColor: currentTheme.accent,
                  backgroundColor: '#0c1322',
                }}
              >
                <span
                  className="material-symbols-outlined text-[15px]"
                  style={{ color: currentTheme.accent }}
                >
                  {buddyProfile.avatarIcon || 'bolt'}
                </span>
              </div>
              <div className="bg-[#0d1527] border border-white/10 p-3.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-lg">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span
                  className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]"
                  style={{ backgroundColor: currentTheme.accent }}
                ></span>
                <span className="text-xs text-gray-400 ml-1.5">
                  {buddyProfile.name} is typing...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area (Pinned above bottom nav on mobile, at bottom on desktop) */}
      <div className="fixed bottom-[68px] md:bottom-3 left-0 w-full z-40 bg-gradient-to-t from-[#050811] via-[#050811]/95 to-transparent pt-3 pb-2">
        <div className="max-w-4xl mx-auto px-3 md:px-8">
          {/* Quick topic starters carousel */}
          {!isStealthMode && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-1">
              {TEEN_VIBE_STARTERS.map((vibe) => (
                <button
                  key={vibe.id}
                  onClick={() => handleChipClick(vibe.prompt)}
                  className="bg-[#0b1322]/90 hover:bg-[#142036] text-gray-300 px-3 py-1 rounded-full text-xs font-medium border border-white/10 hover:border-cyan-400 shrink-0 transition-all active:scale-95"
                >
                  {vibe.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`relative flex items-center bg-[#0d1527] rounded-full p-1.5 md:p-2 border border-white/15 ${currentTheme.inputRing} shadow-2xl transition-all`}
          >
            {/* Quick Rescue Phone Button in input */}
            <button
              type="button"
              id="neon-input-call-btn"
              onClick={() => setIsRescueCallOpen(true)}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors rounded-full flex items-center justify-center"
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
              className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-body text-sm md:text-base text-white placeholder-gray-500 px-2 h-10"
            />

            <button
              type="submit"
              id="neon-chat-send-btn"
              disabled={!inputValue.trim() || isLoading || isSpamming}
              className={`${currentTheme.sendBtn} disabled:bg-gray-800 disabled:text-gray-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 shrink-0`}
              title="Send text"
            >
              <span className="material-symbols-outlined text-[18px] fill-icon">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Customize Buddy Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1322] border border-cyan-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-400">tune</span>
                <span>Customize AI Friend</span>
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Friend / Contact Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Alex ⚡, Jordan 🎮, Sarah 🎧"
                  className="w-full bg-[#111c30] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Set this to a friend's name to disguise the chat completely in public.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">
                  Status Message
                </label>
                <input
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  placeholder="e.g. at the library 📚, playing valorant 🎮"
                  className="w-full bg-[#111c30] border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-gray-300 font-medium py-2.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-cyan-400/30"
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
