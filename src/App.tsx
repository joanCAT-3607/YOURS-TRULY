import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MoodCheckIn } from './components/MoodCheckIn';
import { ChatScreen } from './components/ChatScreen';
import { ResourcesScreen } from './components/ResourcesScreen';
import { InsightsScreen } from './components/InsightsScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { PageTransition } from './components/PageTransition';

import { BreathingModal } from './components/BreathingModal';
import { CampusLinksModal } from './components/CampusLinksModal';
import { JournalModal } from './components/JournalModal';
import { SleepAudioModal } from './components/SleepAudioModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { ProfileModal } from './components/ProfileModal';
import { StressReliefGamesModal } from './components/StressReliefGamesModal';

import {
  INITIAL_CHAT,
  INITIAL_TEEN_CHAT,
  DEFAULT_BUDDY_PROFILE,
  DEFAULT_USER_PROFILE,
  DEFAULT_FEEDBACK,
} from './data/mockData';
import {
  MoodType,
  MoodEntry,
  ChatMessage,
  JournalEntry,
  ActiveTab,
  BotType,
  BuddyProfile,
  UserProfile,
  FeedbackEntry,
} from './types';
import { generateOfflineResponse } from './utils/offlineChatEngine';

const STORAGE_KEYS = {
  MOODS: 'yours_truly_moods',
  CHATS: 'yours_truly_chats',
  TEEN_CHATS: 'yours_truly_teen_chats',
  BUDDY_PROFILE: 'yours_truly_buddy_profile',
  USER_PROFILE: 'yours_truly_user_profile',
  BOT_TYPE: 'yours_truly_bot_type',
  JOURNALS: 'yours_truly_journals',
  STATS: 'yours_truly_stats',
  FEEDBACK: 'yours_truly_feedback',
  FORCE_OFFLINE: 'yours_truly_force_offline',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab | 'welcome' | 'privacy'>('welcome');
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isForceOffline, setIsForceOffline] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.FORCE_OFFLINE) === 'true';
    } catch {
      return false;
    }
  });

  const [activeBotType, setActiveBotType] = useState<BotType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOT_TYPE);
      if (saved === 'teen_buddy' || saved === 'wellness') return saved;
    } catch {
      // fallback
    }
    return 'wellness';
  });

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_USER_PROFILE;
  });

  // Student Feedback list state
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_FEEDBACK;
  });

  // Stored state with fallbacks
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOODS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'entry-1',
        mood: 'anxious',
        energy: 2,
        note: 'Stressed about chemistry midterm exam pacing and lab reports',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        dateStr: 'Today, 4:15 PM',
      },
      {
        id: 'entry-2',
        mood: 'calm',
        energy: 4,
        note: 'Took a walk across the campus quad after study group',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
        dateStr: 'Yesterday',
      },
    ];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CHAT;
  });

  const [teenChatMessages, setTeenChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEEN_CHATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TEEN_CHAT;
  });

  const [buddyProfile, setBuddyProfile] = useState<BuddyProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDDY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_BUDDY_PROFILE;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [breathingCount, setBreathingCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return JSON.parse(saved).breathingCount || 2;
    } catch {
      // fallback
    }
    return 2;
  });

  const [focusMinutes, setFocusMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      if (saved) return JSON.parse(saved).focusMinutes || 50;
    } catch {
      // fallback
    }
    return 50;
  });

  // Modal visibility states
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isCampusLinksOpen, setIsCampusLinksOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isSleepAudioOpen, setIsSleepAudioOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStressGamesOpen, setIsStressGamesOpen] = useState(false);

  // Chat loading indicator
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Network offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moodEntries));
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chatMessages));
      localStorage.setItem(STORAGE_KEYS.TEEN_CHATS, JSON.stringify(teenChatMessages));
      localStorage.setItem(STORAGE_KEYS.BUDDY_PROFILE, JSON.stringify(buddyProfile));
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
      localStorage.setItem(STORAGE_KEYS.FORCE_OFFLINE, String(isForceOffline));
      localStorage.setItem(STORAGE_KEYS.BOT_TYPE, activeBotType);
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journalEntries));
      localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify({ breathingCount, focusMinutes })
      );
    } catch {
      // ignore
    }
  }, [
    moodEntries,
    chatMessages,
    teenChatMessages,
    buddyProfile,
    userProfile,
    feedbackList,
    isForceOffline,
    activeBotType,
    journalEntries,
    breathingCount,
    focusMinutes,
  ]);

  // Handle Feedback Submission
  const handleSaveFeedback = (feedbackData: Omit<FeedbackEntry, 'id' | 'timestamp'>) => {
    const newFeedback: FeedbackEntry = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      timestamp: Date.now(),
    };
    setFeedbackList((prev) => [newFeedback, ...prev]);
  };

  // Toggle Force Offline Mode
  const handleToggleForceOffline = () => {
    setIsForceOffline((prev) => !prev);
  };

  // Handle Mood Save
  const handleSaveMoodEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp' | 'dateStr'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood-${Date.now()}`,
      timestamp: Date.now(),
      dateStr: `Today, ${timeStr}`,
    };
    setMoodEntries((prev) => [newEntry, ...prev]);
  };

  // Quick Action from Mood Checkin: "Talk about this with Yours Truly"
  const handleTalkAboutMood = async (mood: MoodType, note: string) => {
    setActiveBotType('wellness');
    setActiveTab('chat');
    const moodPrompts: Record<MoodType, string> = {
      calm: "I'm feeling calm right now. I'd love some gentle thoughts on maintaining this balance through the rest of the week.",
      happy: "I'm feeling happy and energized today! How can I make the most of this momentum?",
      tired: "I'm feeling really drained and tired from classes. How can I study without burning out?",
      anxious: `I'm feeling quite anxious right now${note ? ` about: ${note}` : ''}. Could we talk through this?`,
      overwhelmed: `I'm feeling overwhelmed with university assignments${note ? `: ${note}` : ''}. Can you help me untangle things?`,
    };

    const text = moodPrompts[mood];
    await handleSendMessage(text, 'wellness');
  };

  // Handle Chat Message submission (supports both online Gemini API and 100% offline client engine)
  const handleSendMessage = async (text: string, botType: BotType = activeBotType) => {
    const isTeen = botType === 'teen_buddy';
    const currentMessages = isTeen ? teenChatMessages : chatMessages;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
      botType,
    };

    if (isTeen) {
      setTeenChatMessages((prev) => [...prev, userMsg]);
    } else {
      setChatMessages((prev) => [...prev, userMsg]);
    }

    setIsChatLoading(true);

    const shouldRunOffline = !isOnline || isForceOffline;

    if (shouldRunOffline) {
      // 100% Client-side Offline Engine processing with a pleasant natural cadence
      setTimeout(() => {
        const offlineResult = generateOfflineResponse(
          text,
          botType,
          userProfile,
          buddyProfile,
          currentMessages
        );

        const aiMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: offlineResult.text,
          timestamp: Date.now(),
          suggestions: offlineResult.suggestions,
          botType,
        };

        if (isTeen) {
          setTeenChatMessages((prev) => [...prev, aiMsg]);
        } else {
          setChatMessages((prev) => [...prev, aiMsg]);
        }
        setIsChatLoading(false);
      }, 450);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7500);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [...currentMessages, userMsg],
          userMessage: text,
          botType,
          userProfile,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const aiReply = isTeen
        ? data.reply || "bro that's wild 💀 tell me everything what happened next??"
        : data.reply || "I'm here with you. Take a slow breath. We will take this one step at a time.";
      
      const suggestions = data.suggestions || (isTeen ? [
        "Spam me with texts so I look busy!",
        "Rate my music taste",
        "Fake emergency call"
      ] : [
        "Take a 2-minute breath",
        "Break it into small steps",
        "Tell me more"
      ]);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiReply,
        timestamp: Date.now(),
        suggestions,
        botType,
      };

      if (isTeen) {
        setTeenChatMessages((prev) => [...prev, aiMsg]);
      } else {
        setChatMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      // Seamless intelligent offline fallback if server is unreachable or Wi-Fi drops
      const offlineResult = generateOfflineResponse(
        text,
        botType,
        userProfile,
        buddyProfile,
        currentMessages
      );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: offlineResult.text,
        timestamp: Date.now(),
        suggestions: offlineResult.suggestions,
        botType,
      };

      if (isTeen) {
        setTeenChatMessages((prev) => [...prev, aiMsg]);
      } else {
        setChatMessages((prev) => [...prev, aiMsg]);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  // Clear all data
  const handleClearAllData = () => {
    localStorage.clear();
    setMoodEntries([]);
    setChatMessages(INITIAL_CHAT);
    setTeenChatMessages(INITIAL_TEEN_CHAT);
    setBuddyProfile(DEFAULT_BUDDY_PROFILE);
    setUserProfile(DEFAULT_USER_PROFILE);
    setFeedbackList(DEFAULT_FEEDBACK);
    setJournalEntries([]);
    setBreathingCount(0);
    setFocusMinutes(0);
  };

  return (
    <div className="min-h-screen bg-[#fdfdf5] text-[#1a1c18] flex flex-col font-body selection:bg-[#c8e6c9] selection:text-[#003300]">
      {/* Top App Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacy={() => setActiveTab('privacy')}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenStressGames={() => setIsStressGamesOpen(true)}
        activeBotType={activeBotType}
        setActiveBotType={setActiveBotType}
        isOffline={!isOnline}
        isForceOffline={isForceOffline}
        onToggleForceOffline={handleToggleForceOffline}
      />

      {/* Main Content Area with Cool Smooth Animated Page Transitions */}
      <div className="pt-20 flex-1 flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'welcome' && (
            <PageTransition key="page-welcome" pageKey="welcome" variant="sanctuary">
              <WelcomeScreen
                onStartTalking={() => {
                  setActiveBotType('wellness');
                  setActiveTab('chat');
                }}
                onStartNeonBuddy={() => {
                  setActiveBotType('teen_buddy');
                  setActiveTab('chat');
                }}
                onGoToHome={() => setActiveTab('home')}
                userProfile={userProfile}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenStressGames={() => setIsStressGamesOpen(true)}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onOpenSleepAudio={() => setIsSleepAudioOpen(true)}
                onOpenJournal={() => setIsJournalOpen(true)}
                onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
                onOpenCampusLinks={() => setIsCampusLinksOpen(true)}
                breathingCount={breathingCount}
                focusMinutes={focusMinutes}
                feedbackList={feedbackList}
                onSaveFeedback={handleSaveFeedback}
                onQuickMoodSelect={(mood) => {
                  handleSaveMoodEntry({ mood, energy: 3 });
                  handleTalkAboutMood(mood, '');
                }}
              />
            </PageTransition>
          )}

          {activeTab === 'home' && (
            <PageTransition key="page-home" pageKey="home" variant="sanctuary">
              <MoodCheckIn
                entries={moodEntries}
                onSaveEntry={handleSaveMoodEntry}
                onTalkAboutMood={handleTalkAboutMood}
                userProfile={userProfile}
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenStressGames={() => setIsStressGamesOpen(true)}
              />
            </PageTransition>
          )}

          {activeTab === 'chat' && (
            <PageTransition
              key={`page-chat-${activeBotType}`}
              pageKey={`chat-${activeBotType}`}
              variant={activeBotType === 'teen_buddy' ? 'neon' : 'sanctuary'}
            >
              <ChatScreen
                messages={chatMessages}
                teenMessages={teenChatMessages}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onOpenJournal={() => setIsJournalOpen(true)}
                onOpenStressGames={() => setIsStressGamesOpen(true)}
                userProfile={userProfile}
                activeBotType={activeBotType}
                setActiveBotType={setActiveBotType}
                buddyProfile={buddyProfile}
                onUpdateBuddyProfile={setBuddyProfile}
              />
            </PageTransition>
          )}

          {activeTab === 'resources' && (
            <PageTransition key="page-resources" pageKey="resources" variant="sanctuary">
              <ResourcesScreen
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onOpenCampusLinks={() => setIsCampusLinksOpen(true)}
                onOpenJournal={() => setIsJournalOpen(true)}
                onOpenSleepAudio={() => setIsSleepAudioOpen(true)}
                onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
                onOpenStressGames={() => setIsStressGamesOpen(true)}
              />
            </PageTransition>
          )}

          {activeTab === 'insights' && (
            <PageTransition key="page-insights" pageKey="insights" variant="sanctuary">
              <InsightsScreen
                entries={moodEntries}
                breathingCount={breathingCount}
                focusMinutes={focusMinutes}
                onOpenBreathing={() => setIsBreathingOpen(true)}
                onOpenChat={() => setActiveTab('chat')}
              />
            </PageTransition>
          )}

          {activeTab === 'privacy' && (
            <PageTransition key="page-privacy" pageKey="privacy" variant="sanctuary">
              <PrivacyScreen
                onClearAllData={handleClearAllData}
                onBack={() => setActiveTab('home')}
              />
            </PageTransition>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar on Mobile */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab)}
      />

      {/* Interactive Feature Modals */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
        onSessionComplete={() => setBreathingCount((prev) => prev + 1)}
      />

      <CampusLinksModal
        isOpen={isCampusLinksOpen}
        onClose={() => setIsCampusLinksOpen(false)}
      />

      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        onSaveJournal={(entry) => setJournalEntries((prev) => [entry, ...prev])}
      />

      <SleepAudioModal
        isOpen={isSleepAudioOpen}
        onClose={() => setIsSleepAudioOpen(false)}
      />

      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onSessionComplete={(mins) => setFocusMinutes((prev) => prev + mins)}
      />

      {/* Profile & Biodata Editor Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => setUserProfile(updated)}
      />

      {/* Stress Relief Mini-Games Modal (Pop-It, Zen Sand, Calming Ripples) */}
      <StressReliefGamesModal
        isOpen={isStressGamesOpen}
        onClose={() => setIsStressGamesOpen(false)}
      />
    </div>
  );
}

