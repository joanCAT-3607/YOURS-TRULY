export type MoodType = 'calm' | 'happy' | 'tired' | 'anxious' | 'overwhelmed';

export interface MoodConfig {
  type: MoodType;
  label: string;
  icon: string;
  bgLight: string;
  bgActive: string;
  textColor: string;
  iconColor: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  energy: number; // 1 to 5
  note?: string;
  timestamp: number;
  dateStr: string;
}

export type BotType = 'wellness' | 'teen_buddy';

export type NeonThemeColor = 'cyan' | 'magenta' | 'green' | 'purple';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
  suggestions?: string[];
  botType?: BotType;
}

export interface BuddyProfile {
  name: string;
  handle: string;
  statusText: string;
  avatarIcon: string;
  avatarColor: string;
  interests: string[];
}

export interface JournalPrompt {
  id: string;
  category: 'Academics' | 'Reflection' | 'Anxiety' | 'Self-Care';
  prompt: string;
}

export interface JournalEntry {
  id: string;
  promptId?: string;
  promptText: string;
  content: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  pronouns: string;
  avatarUrl: string;
  avatarPresetId?: string;
  bio: string;
  major: string;
  year: string;
  campus?: string;
  comfortVibe: string;
  favoriteActivities: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactNote?: string;
}

export type StressGameType = 'popit' | 'zensand' | 'ripples';

export interface FeedbackEntry {
  id: string;
  rating: number; // 1 to 5
  category: 'suggestion' | 'wellness' | 'teen_buddy' | 'games' | 'issue' | 'other';
  message: string;
  authorName?: string;
  timestamp: number;
}

export interface SoundTrack {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  type: 'rain' | 'forest' | 'waves' | 'cafe' | 'whitenoise';
}

export type ActiveTab = 'home' | 'chat' | 'insights' | 'resources';

export interface CampusResource {
  id: string;
  title: string;
  subtitle: string;
  contact: string;
  type: 'phone' | 'link' | 'hours';
  actionLabel: string;
  icon: string;
  urgent?: boolean;
}

