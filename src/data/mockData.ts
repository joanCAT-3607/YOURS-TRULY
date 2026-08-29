import { MoodConfig, CampusResource, JournalPrompt, SoundTrack, UserProfile } from '../types';

export const ASSETS = {
  // Brand Logo heart from the uploaded reference
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1AjICq_eXLkbQ2rhuc-LO3VU6b63Osm4QCvfAAkEf3stwXDEvVSXWbLsmc2K8Buu5Y-5ru8nGNSxn8ASJPzyrJgdSTI8qPyId04CezyrzRgrAnJyz_QDDLua95pCJmKFGxOc1LBB5zON2u_xoa2U57mzv0PYQ3XhvZN_u_FiAS-7lAiKb5i10m1idc2bppbgWHSNAsZ9FGnkqRZ_kVM7Htz376RxkUuIo7FJtt7gC9jg1jjn83kTkA',
  // Student user avatar from the uploaded reference
  studentAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhvTLbXxYvsfD6Z0eCaZFNtPbOG7-R4IsxnejTZwcAKwKl-4WGAAP1LKGdxnL5tvAY4EbZRV3Dx_T-7hGkkcCINQaxDeVx9KSZR9zfvaa_0_PPcFs_UmXZ8c4v_hSGq7Jcj5kT3Irq4NpUDDQSGHuCN2aAG9R9rSsLf6pCYSpApUxV3HLzCZPiYH4Oix7Cey5yLRNr_6nLalbM1SWIgYKy-i2IYyGqgt_dRx9Vku37u6W0VusHgqaGgA',
  // Alternate student portrait
  studentAvatarAlt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC97QH-kJ4FHoiNfMIyvy6VQ_l3abUGLVNWfeKpIPCto953798XNP4LYuJdDjz_3V7xgk_8UhzwVUBBGzTdVKwOFXS5AADUi7y90YNbX00gek8XqSe2Kkg3dIYdzm3FCXE_f4y8tFhKxmA1qxeWkspWNUTA2SygMmygwJugQbi5vabWOXb7K9fPjbjJnMZAUaDHw27a_ByPIw58EkD-Vy9FUCB_Ozn7qJgKRBCQbUwh1G8k2nCFK2p_ig',
  // University courtyard scenic backdrop
  campusCourtyard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2hf5kAtU9uEXVYSBaALJi__P4TxhMjKmo3DO5pFanMEFsWtBLRxs7CroS6e70vpDPNqUVqGPx7hR7VeWR4aAxZms2dlLP0dnOf97n4kFWCW7gRd7dXXWIl2W9HkUJ3-ce1rjs80GL5AgBbWjRjSoTI8yr-j1ES6u_E5YnqUMd6abUuD33kVcF0yQ-ri9Vj_m_uWdaASDpv4CygGO8y9PIBogqbQpXVsDVohZrKxDFIWQRAmGKCMM9gA'
};

export const MOODS: MoodConfig[] = [
  {
    type: 'calm',
    label: 'Calm',
    icon: 'spa',
    bgLight: 'bg-[#e8f5e9]',
    bgActive: 'bg-[#c8e6c9]',
    textColor: 'text-[#1b5e20]',
    iconColor: 'text-[#2e7d32]',
    description: 'Centered, peaceful, and grounded'
  },
  {
    type: 'happy',
    label: 'Happy',
    icon: 'sentiment_satisfied',
    bgLight: 'bg-[#fef9c3]',
    bgActive: 'bg-[#fef08a]',
    textColor: 'text-[#854d0e]',
    iconColor: 'text-[#ca8a04]',
    description: 'Joyful, uplifted, or content'
  },
  {
    type: 'tired',
    label: 'Tired',
    icon: 'bedtime',
    bgLight: 'bg-[#dcedc8]',
    bgActive: 'bg-[#c5e1a5]',
    textColor: 'text-[#33691e]',
    iconColor: 'text-[#558b2f]',
    description: 'Low energy, sleepy, needing rest'
  },
  {
    type: 'anxious',
    label: 'Anxious',
    icon: 'storm',
    bgLight: 'bg-[#ffdad6]/60',
    bgActive: 'bg-[#ffdad6]',
    textColor: 'text-[#93000a]',
    iconColor: 'text-[#ba1a1a]',
    description: 'Nervous, tense, or worried'
  },
  {
    type: 'overwhelmed',
    label: 'Overwhelmed',
    icon: 'waves',
    bgLight: 'bg-[#e0f2fe]',
    bgActive: 'bg-[#bae6fd]',
    textColor: 'text-[#0369a1]',
    iconColor: 'text-[#0284c7]',
    description: 'Too much to process or carry'
  }
];

export const INITIAL_CHAT = [
  {
    id: 'msg-1',
    sender: 'ai' as const,
    text: "Hello! I'm Yours Truly. I know midterms are coming up and things can feel overwhelming. How are you holding up today?",
    timestamp: Date.now() - 1000 * 60 * 12,
  },
  {
    id: 'msg-2',
    sender: 'user' as const,
    text: "Honestly, I'm feeling really stressed about my chemistry exam. I feel like I'm falling behind.",
    timestamp: Date.now() - 1000 * 60 * 8,
  },
  {
    id: 'msg-3',
    sender: 'ai' as const,
    text: "It is completely valid to feel stressed about chemistry, it's a tough subject. Take a deep breath. We can break this down into smaller, manageable pieces. What specific topic is making you feel the most stuck?",
    timestamp: Date.now() - 1000 * 60 * 4,
    suggestions: [
      'Organic Reactions',
      'Stoichiometry',
      "I don't know where to start",
      'Exam Anxiety & Pacing',
      'Take a 2-min breath'
    ]
  }
];

export const DEFAULT_BUDDY_PROFILE = {
  name: 'Kai ⚡',
  handle: '@kai_overclocked',
  statusText: 'typing fast / pretending to study 🎮',
  avatarIcon: 'bolt',
  avatarColor: '#00f0ff',
  interests: ['Gaming', 'PC Setups', 'Spotify', 'Anime', 'Memes', 'Dorm Hacks']
};

export const INITIAL_TEEN_CHAT = [
  {
    id: 'teen-1',
    sender: 'ai' as const,
    text: "yo! what's good? if you're chilling in public pretending to text someone so nobody bothers you, I 100% got your back 🤝",
    timestamp: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'teen-2',
    sender: 'user' as const,
    text: "lmao thanks, sitting alone at the campus cafe and didn't wanna look like an NPC 😭",
    timestamp: Date.now() - 1000 * 60 * 10,
  },
  {
    id: 'teen-3',
    sender: 'ai' as const,
    text: "nah cause sitting alone with zero phone action is lowkey stressful fr 💀 start typing furiously like we just discovered the wildest glitch or drama. what are we pretending to argue about: gaming setups, terrible professors, or why iced coffee costs $8 now??",
    timestamp: Date.now() - 1000 * 60 * 5,
    suggestions: [
      "🎮 Rate my favorite games",
      "🎧 Spotify aux check",
      "☕ $8 iced coffee is robbery",
      "🚨 Fake emergency call rn",
      "⚡ Spam me with texts"
    ]
  }
];

export const TEEN_VIBE_STARTERS = [
  {
    id: 'vibe-gaming',
    label: '🎮 Gaming & PC Builds',
    prompt: "Bro what games are you playing lately? Be honest, are you grinding Valorant, Minecraft, or getting destroyed in Elden Ring?",
  },
  {
    id: 'vibe-music',
    label: '🎧 Spotify & Music Taste',
    prompt: "Pass the aux cord! What song is on heavy rotation for you right now that you lowkey gatekeep?",
  },
  {
    id: 'vibe-stealth',
    label: '🤫 Public Social Cover',
    prompt: "Quick! Someone is looking near me. Send me 3 rapid fire messages so I look completely booked and busy!",
  },
  {
    id: 'vibe-tech',
    label: '💻 Tech Hot Takes',
    prompt: "Drop your most unhinged tech or smartphone hot take right now. I'm ready to debate.",
  },
  {
    id: 'vibe-drama',
    label: '🍿 Campus Drama Cover',
    prompt: "Pretend you're telling me the wildest campus tea so I look visibly shocked looking at my screen.",
  },
  {
    id: 'vibe-roast',
    label: '⚡ Hype Me Up',
    prompt: "I need an urgent confidence boost before I walk into this room, give me a top-tier pep talk!",
  }
];

export const RESCUE_CALL_MESSAGES = [
  "Bro where are you?? We're literally waiting at the student union for you, hurry up!",
  "Hey! Did you see the Discord? Professor just moved the lab deadline to tonight, you gotta jump on!",
  "Yo, the Uber is pulling up in 2 minutes, grab your bag and meet us outside!",
  "Emergency squad update: we got the last booth at the food hall, come over right now!"
];


export const CAMPUS_RESOURCES: CampusResource[] = [
  {
    id: 'counseling',
    title: 'University Counseling Center',
    subtitle: 'Free, 100% confidential one-on-one sessions and same-day triage.',
    contact: '(555) 019-4832',
    type: 'phone',
    actionLabel: 'Call Center',
    icon: 'call'
  },
  {
    id: 'crisis',
    title: '24/7 Student Crisis Line & 988',
    subtitle: 'Immediate empathetic support anytime, day or night via call or text.',
    contact: 'Call/Text 988 or text HOME to 741741',
    type: 'phone',
    actionLabel: 'Dial 988',
    icon: 'emergency',
    urgent: true
  },
  {
    id: 'peer',
    title: 'Peer Wellness Drop-In',
    subtitle: 'Talk with trained upperclassman students who understand course pressure.',
    contact: 'Student Union, Rm 304 | Mon-Fri 10am-6pm',
    type: 'hours',
    actionLabel: 'View Schedule',
    icon: 'groups'
  },
  {
    id: 'academic',
    title: 'Dean of Students & Accommodations',
    subtitle: 'Extensions, medical absence notices, and testing accommodations.',
    contact: 'wellness-support@campus.edu',
    type: 'link',
    actionLabel: 'Email Support',
    icon: 'school'
  }
];

export const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    id: 'p1',
    category: 'Academics',
    prompt: 'What is one small, manageable task you can do today rather than trying to conquer the whole syllabus?'
  },
  {
    id: 'p2',
    category: 'Anxiety',
    prompt: 'Name 3 things right now in your immediate physical surroundings that make you feel safe and anchored.'
  },
  {
    id: 'p3',
    category: 'Reflection',
    prompt: 'What is something you handled in the past that you once thought you couldn’t survive?'
  },
  {
    id: 'p4',
    category: 'Self-Care',
    prompt: 'If a close friend came to you with the exact same stress you are carrying right now, what gentle words would you tell them?'
  },
  {
    id: 'p5',
    category: 'Academics',
    prompt: 'What expectations are you placing on yourself that might be unnecessarily harsh?'
  }
];

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Taylor',
  pronouns: 'they/them',
  avatarUrl: ASSETS.studentAvatar,
  avatarPresetId: 'preset-botanical',
  bio: 'Biochemistry sophomore navigating exam seasons with iced matcha lattes, lo-fi beats, and quiet sanctuary pauses 🌿',
  major: 'Biochemistry & Molecular Biology',
  year: 'Sophomore (2nd Year)',
  campus: 'North Campus Quad',
  comfortVibe: 'Rain on the windowpane & warm herbal tea 🌧️',
  favoriteActivities: [
    'Guided 2-Min Breathing',
    'Iced Matcha Tasting',
    'Lo-Fi Study Beats',
    'Journal Reflections',
    'Cozy Night Walks',
    'Casual Gaming'
  ],
  emergencyContactName: 'Alex (Campus Roommate)',
  emergencyContactPhone: '(555) 392-8819',
  emergencyContactNote: 'Has spare dorm room key & knows my course schedule'
};

export const PRESET_AVATARS = [
  {
    id: 'preset-botanical',
    label: 'Mindful Green',
    url: ASSETS.studentAvatar,
    tag: 'Sanctuary'
  },
  {
    id: 'preset-student-alt',
    label: 'Campus Study',
    url: ASSETS.studentAvatarAlt,
    tag: 'Focus'
  },
  {
    id: 'preset-lotus',
    label: 'Lotus Bloom',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80',
    tag: 'Zen'
  },
  {
    id: 'preset-cozy-cat',
    label: 'Lo-Fi Sleep Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
    tag: 'Cozy'
  },
  {
    id: 'preset-matcha',
    label: 'Matcha Aesthetic',
    url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80',
    tag: 'Calm'
  },
  {
    id: 'preset-synthwave',
    label: 'Neon Sunset',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    tag: 'Neon'
  },
  {
    id: 'preset-forest',
    label: 'Forest Canopy',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80',
    tag: 'Nature'
  },
  {
    id: 'preset-cyber-art',
    label: 'Cyber Chill',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    tag: 'Cyber'
  }
];

export const AVAILABLE_INTEREST_TAGS = [
  'Guided 2-Min Breathing',
  'Iced Matcha Tasting',
  'Lo-Fi Study Beats',
  'Journal Reflections',
  'Cozy Night Walks',
  'Casual Gaming',
  'Organic Chemistry',
  'Campus Coffee Crawl',
  'Indie Rock Playlists',
  'Dorm Cooking Hacks',
  'Stargazing',
  'Mindful Yoga',
  'Digital Illustration',
  'Cat Cuddles',
  'Deep Brown Noise'
];

export const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    title: 'Rain on Library Window',
    subtitle: 'Gentle steady rain to soothe anxious thoughts',
    icon: 'water_drop',
    color: 'from-blue-100 to-indigo-100 text-blue-800',
    type: 'rain'
  },
  {
    id: 'forest',
    title: 'Campus Oak Grove',
    subtitle: 'Soft breeze rustling through autumn leaves',
    icon: 'forest',
    color: 'from-emerald-100 to-green-100 text-green-800',
    type: 'forest'
  },
  {
    id: 'waves',
    title: 'Slow Tidal Rhythms',
    subtitle: 'Calm ocean waves matching 4-7-8 breathing',
    icon: 'waves',
    color: 'from-teal-100 to-cyan-100 text-teal-800',
    type: 'waves'
  },
  {
    id: 'whitenoise',
    title: 'Warm Brown Noise',
    subtitle: 'Deep low-frequency rumble to block out exam chatter',
    icon: 'graphic_eq',
    color: 'from-amber-100 to-orange-100 text-amber-800',
    type: 'whitenoise'
  }
];

export const DEFAULT_FEEDBACK: import('../types').FeedbackEntry[] = [
  {
    id: 'fb-1',
    rating: 5,
    category: 'wellness',
    message: 'The 4-7-8 breathing circle before my biology midterm genuinely slowed my heart rate down. Thank you so much for this peaceful space.',
    authorName: 'Alex M. (Pre-Med)',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: 'fb-2',
    rating: 5,
    category: 'teen_buddy',
    message: 'Kai pretending to argue with me about mechanical keyboards when I was sitting alone at the campus cafeteria saved me from feeling super awkward haha! ⚡',
    authorName: 'Jordan K.',
    timestamp: Date.now() - 86400000,
  },
];



