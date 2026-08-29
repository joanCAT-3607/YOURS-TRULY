import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, BotType, BuddyProfile, UserProfile } from '../types';
import { NeonChatScreen } from './NeonChatScreen';

interface ChatScreenProps {
  messages: ChatMessage[];
  teenMessages: ChatMessage[];
  onSendMessage: (text: string, botType?: BotType) => Promise<void>;
  isLoading: boolean;
  onOpenBreathing: () => void;
  onOpenJournal: () => void;
  onOpenStressGames?: () => void;
  userProfile?: UserProfile;
  activeBotType: BotType;
  setActiveBotType: (type: BotType) => void;
  buddyProfile: BuddyProfile;
  onUpdateBuddyProfile: (profile: BuddyProfile) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  teenMessages,
  onSendMessage,
  isLoading,
  onOpenBreathing,
  onOpenJournal,
  onOpenStressGames,
  userProfile,
  activeBotType,
  setActiveBotType,
  buddyProfile,
  onUpdateBuddyProfile,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If Neon Teen Buddy is active, render the dark mode neon screen
  if (activeBotType === 'teen_buddy') {
    return (
      <div className="flex-1 flex flex-col w-full">
        {/* Quick Switch Bar at top */}
        <div className="bg-[#080c14] border-b border-white/10 px-4 py-2 flex items-center justify-center">
          <div className="flex bg-[#111927] p-1 rounded-full border border-white/10 shadow-inner">
            <button
              id="switch-to-wellness-tab-btn"
              onClick={() => setActiveBotType('wellness')}
              className="px-3.5 py-1 rounded-full text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[15px] text-green-400">spa</span>
              <span>Yours Truly (Sanctuary)</span>
            </button>
            <button
              id="switch-to-teen-tab-btn"
              onClick={() => setActiveBotType('teen_buddy')}
              className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)] flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              <span>{buddyProfile.name} (Neon Mode)</span>
            </button>
          </div>
        </div>

        <NeonChatScreen
          messages={teenMessages}
          onSendMessage={(text) => onSendMessage(text, 'teen_buddy')}
          isLoading={isLoading}
          onSwitchToWellness={() => setActiveBotType('wellness')}
          buddyProfile={buddyProfile}
          onUpdateBuddyProfile={onUpdateBuddyProfile}
          userProfile={userProfile}
          onOpenStressGames={onOpenStressGames}
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue('');
    setIsMenuOpen(false);
    await onSendMessage(text, 'wellness');
  };

  const handleChipClick = async (suggestion: string) => {
    if (isLoading) return;
    if (suggestion.toLowerCase().includes('breath') || suggestion.toLowerCase().includes('2-min')) {
      onOpenBreathing();
      return;
    }
    await onSendMessage(suggestion, 'wellness');
  };

  // Text to speech for empathetic AI voice playback
  const handleSpeak = (messageId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower, calm soothing pace
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingId(null);
    };
    utterance.onerror = () => {
      setSpeakingId(null);
    };

    setSpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Bot Mode Switcher Header */}
      <div className="bg-[#f4f7ee] border-b border-[#dee5d8] px-4 py-2 flex items-center justify-center">
        <div className="flex bg-[#e4e8dc] p-1 rounded-full border border-[#d2d8c9] shadow-inner">
          <button
            id="switch-to-wellness-tab-btn"
            onClick={() => setActiveBotType('wellness')}
            className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#1b5e20] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#2e7d32]">spa</span>
            <span>Yours Truly (Sanctuary)</span>
          </button>
          <button
            id="switch-to-teen-tab-btn"
            onClick={() => setActiveBotType('teen_buddy')}
            className="px-3.5 py-1 rounded-full text-xs font-semibold text-[#52634f] hover:text-[#000] flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-cyan-600">bolt</span>
            <span>{buddyProfile.name} (Neon Mode)</span>
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-6.5rem)] relative">
        {/* Scrollable Chat Area */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 pb-36 no-scrollbar space-y-4">
          {/* Mood / Context Tag */}
          <div className="flex justify-center my-1">
            <div className="bg-[#eef0e6] px-4 py-1.5 rounded-full text-[#43483e] text-xs font-semibold tracking-wider uppercase shadow-2xs border border-[#dfe4d7] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#347d39]"></span>
              <span>Safe Sanctuary Established</span>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex flex-col gap-4 w-full">
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} w-full`}
                >
                  <div
                    className={`flex items-end gap-2.5 max-w-[88%] md:max-w-[80%] ${
                      isAI ? 'self-start' : 'self-end flex-row-reverse'
                    }`}
                  >
                    {/* Avatar for AI */}
                    {isAI ? (
                      <div className="w-8 h-8 rounded-full bg-[#b7f397] flex items-center justify-center shadow-xs shrink-0 mb-1">
                        <span className="material-symbols-outlined text-[#042100] text-[18px]">
                          auto_awesome
                        </span>
                      </div>
                    ) : null}

                    {/* Message Bubble */}
                    <div
                      className={`p-4 md:p-4.5 ${
                        isAI
                          ? 'glass-panel text-[#1a1c18] rounded-3xl rounded-bl-xs chat-bubble-shadow border border-white/80'
                          : 'bg-[#386a20] text-white rounded-3xl rounded-br-xs shadow-xs'
                      }`}
                    >
                      <p className="font-body text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      {/* AI Speech helper button */}
                      {isAI && (
                        <div className="mt-2.5 pt-2 border-t border-[#dee5d8]/40 flex items-center justify-between text-xs text-[#55624c]">
                          <span className="text-[11px] opacity-70">Yours Truly</span>
                          <button
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className="hover:text-[#1b5e20] p-1 rounded-full hover:bg-white/60 transition-colors flex items-center gap-1 text-[11px] font-medium"
                            title="Listen with soothing voice"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {speakingId === msg.id ? 'stop_circle' : 'volume_up'}
                            </span>
                            <span>{speakingId === msg.id ? 'Pause' : 'Listen'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Suggestion Chips */}
                  {isAI && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex gap-2 self-start ml-10 mt-2 flex-wrap">
                      {msg.suggestions.map((chip, idx) => (
                        <button
                          key={idx}
                          id={`chat-suggestion-${idx}`}
                          onClick={() => handleChipClick(chip)}
                          className="bg-white/90 hover:bg-[#e8f5e9] text-[#33691e] px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#c2c8bd]/60 shadow-2xs hover:border-[#386a20] hover:shadow-xs transition-all active:scale-95"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-end gap-2.5 self-start max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-[#b7f397] flex items-center justify-center shadow-xs shrink-0 mb-1">
                  <span className="material-symbols-outlined text-[#042100] text-[18px] animate-spin">
                    progress_activity
                  </span>
                </div>
                <div className="glass-panel p-4 rounded-3xl rounded-bl-xs chat-bubble-shadow flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#386a20] animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-[#386a20] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-[#386a20] animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-xs text-[#52634f] ml-1">Yours Truly is listening...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </main>

        {/* Floating Action Menu Popover */}
        {isMenuOpen && (
          <div className="absolute bottom-28 left-4 md:left-8 bg-white rounded-2xl p-3 shadow-xl border border-[#dee5d8] z-30 space-y-1.5 animate-fadeIn">
            <div className="text-[11px] font-bold text-[#55624c] px-3 py-1 uppercase tracking-wider">
              Quick Sanctuary Tools
            </div>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenBreathing();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1b5e20] hover:bg-[#e8f5e9] flex items-center gap-2.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2e7d32]">air</span>
              <span>2-Minute Guided Breathing</span>
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenJournal();
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1b5e20] hover:bg-[#e8f5e9] flex items-center gap-2.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2e7d32]">edit_note</span>
              <span>Journaling Reflection</span>
            </button>
            {onOpenStressGames && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onOpenStressGames();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#0369a1] hover:bg-[#e0f2fe] flex items-center gap-2.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#0284c7]">sports_esports</span>
                <span>🫧 Stress Relief Mini-Games</span>
              </button>
            )}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onSendMessage("I'm having a hard time focusing on study materials right now.", 'wellness');
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-[#1b5e20] hover:bg-[#e8f5e9] flex items-center gap-2.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-[#2e7d32]">psychology</span>
              <span>Help me break down heavy reading</span>
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="fixed bottom-[68px] md:bottom-3 left-0 w-full z-40 bg-gradient-to-t from-[#fdfdf5] via-[#fdfdf5]/95 to-transparent pt-4 pb-2">
          <div className="max-w-3xl mx-auto px-4 md:px-8">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center bg-white rounded-full p-1.5 md:p-2 chat-bubble-shadow border border-[#c2c8bd]/60 focus-within:border-[#386a20] focus-within:ring-2 focus-within:ring-[#b7f397]/50 transition-all"
            >
              <button
                type="button"
                id="chat-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-[#72796f] hover:text-[#386a20] hover:bg-[#e8f5e9] transition-colors rounded-full flex items-center justify-center"
                title="Add mindful tool"
              >
                <span className="material-symbols-outlined text-[22px]">add_circle</span>
              </button>

              <input
                id="chat-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Talk to Yours Truly..."
                disabled={isLoading}
                className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-body text-sm md:text-base text-[#1a1c18] placeholder-[#72796f] px-2 h-10"
              />

              <button
                type="submit"
                id="chat-send-btn"
                disabled={!inputValue.trim() || isLoading}
                className="bg-[#386a20] disabled:bg-[#c2c8bd] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2e7d32] shadow-xs transition-all active:scale-95 shrink-0"
                title="Send message"
              >
                <span className="material-symbols-outlined text-[18px] fill-icon">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

