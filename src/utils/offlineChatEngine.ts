import { BotType, ChatMessage, UserProfile, BuddyProfile } from '../types';

interface OfflineBotResponse {
  text: string;
  suggestions: string[];
}

/**
 * Intelligent client-side offline conversational engine.
 * Generates nuanced, empathetic, contextual responses for both
 * "Yours Truly" (Mindfulness Sanctuary) and "Kai ⚡" (Neon Buddy)
 * with 0% network or Wi-Fi dependencies.
 */
export function generateOfflineResponse(
  userText: string,
  botType: BotType = 'wellness',
  userProfile?: UserProfile,
  buddyProfile?: BuddyProfile,
  _chatHistory: ChatMessage[] = []
): OfflineBotResponse {
  const text = (userText || '').trim().toLowerCase();
  const userName = userProfile?.name || 'Taylor';
  const userMajor = userProfile?.major || 'your studies';
  const buddyName = buddyProfile?.name || 'Kai';

  // ==========================================
  // 1. NEON BUDDY (Kai ⚡ - Tech & Teen Texting)
  // ==========================================
  if (botType === 'teen_buddy') {
    return generateNeonBuddyResponse(text, userName, userMajor, buddyName);
  }

  // ==========================================
  // 2. YOURS TRULY (Mindfulness Sanctuary)
  // ==========================================
  return generateWellnessSanctuaryResponse(text, userName, userMajor, userProfile);
}

function getRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateWellnessSanctuaryResponse(
  text: string,
  userName: string,
  userMajor: string,
  userProfile?: UserProfile
): OfflineBotResponse {
  // Urgent / Distress / Crisis check
  if (
    text.includes('suicide') ||
    text.includes('kill myself') ||
    text.includes('end it all') ||
    text.includes('hurt myself')
  ) {
    return {
      text: `${userName}, please know you are not alone, your life is deeply precious, and support is available right now.\n\n• National Crisis Lifeline: Call or text 988 (Free, 24/7, confidential)\n• Crisis Text Line: Text HOME to 741741\n• The Trevor Project: 1-866-488-7386\n\nPlease reach out to one of these resources, a campus counselor, or someone you trust. I am here with you.`,
      suggestions: ['Show campus emergency resources', 'I want to talk to someone', 'Help me breathe right now'],
    };
  }

  // Panic / Acute Anxiety / Can't breathe
  if (
    text.includes('panic') ||
    text.includes('anxiety attack') ||
    text.includes('heart racing') ||
    text.includes('hyperventilating') ||
    text.includes('freaking out') ||
    text.includes('can\'t breathe')
  ) {
    const responses = [
      `Take a slow breath with me right now, ${userName}. You are safe in this physical moment.\n\nLet's try the 5-4-3-2-1 Grounding anchor:\n👁️ Name 5 things you can see around you\n🖐️ Touch 4 distinct textures near your hands\n👂 Notice 3 quiet sounds\n👃 Sense 2 scents\n👅 1 slow sip of water\n\nDrop your shoulders from your ears. What is one object you see right now?`,
      `I hear you, ${userName}. Place one hand flat on your chest and feel the steady rhythm under your palm.\n\nYou don't have to fix anything this second. Breathe in for 4 seconds... hold gently for 4... and exhale completely for 6 seconds.\n\nWould you like to open our guided breathing bubble together?`,
    ];
    return {
      text: getRandomItem(responses),
      suggestions: ['Open 4-7-8 Breathing Circle', '5-4-3-2-1 Grounding', 'I am starting to feel a bit calmer'],
    };
  }

  // Exams / Tests / Midterms / Finals / Quizzes
  if (
    text.includes('exam') ||
    text.includes('midterm') ||
    text.includes('final') ||
    text.includes('test') ||
    text.includes('quiz') ||
    text.includes('gpa') ||
    text.includes('fail') ||
    text.includes('study')
  ) {
    const responses = [
      `Academic pressure in ${userMajor} can feel overwhelming, ${userName}. It's completely valid to feel the weight of tests.\n\nRemember: An exam score measures what you can recall on a single morning under artificial constraints—it has never measured your intelligence, worth, or future.\n\nWhat specific topic or chapter is weighing on your mind right now? Let's break it into a tiny 15-minute bite.`,
      `Breathe, ${userName}. When we stare at a massive syllabus, our nervous system treats it like an emergency. Let's downshift into manageable focus.\n\nHave you had any water or eaten recently? Let's take a 5-minute brain reset before your next study sprint.`,
      `You've navigated difficult academic hurdles before to get to this point. Even if today feels intense, you only have to tackle one concept at a time. What would feel like the most helpful first step right now?`,
    ];
    return {
      text: getRandomItem(responses),
      suggestions: ['Start a 25-minute Pomodoro timer', 'Break down my study task', 'I need a 5-minute brain rest'],
    };
  }

  // Procrastination / Overwhelmed / To-Do list paralyzed
  if (
    text.includes('procrastinat') ||
    text.includes('overwhelm') ||
    text.includes('too much to do') ||
    text.includes('can\'t focus') ||
    text.includes('stuck') ||
    text.includes('lazy')
  ) {
    const responses = [
      `It's not laziness, ${userName}—procrastination is usually an emotional regulation response to feeling overwhelmed or fearing imperfect work.\n\nLet's apply the "2-Minute Permission Rule": You only have to open the document or review just one slide. If you want to stop after two minutes, you can. Often, starting the smallest motion dissolves the paralysis.`,
      `When everything feels urgent, nothing can get done peacefully. Let's pick just ONE single micro-action for the next 10 minutes. What is the smallest piece of that task you could look at?`,
    ];
    return {
      text: getRandomItem(responses),
      suggestions: ['Set a 5-minute gentle timer', 'Write down top 3 micro-goals', 'Play calming ambient rain sound'],
    };
  }

  // Sleep / Insomnia / Tired / Exhaustion / Burnout
  if (
    text.includes('sleep') ||
    text.includes('tired') ||
    text.includes('insomnia') ||
    text.includes('burnout') ||
    text.includes('exhausted') ||
    text.includes('can\'t sleep')
  ) {
    const responses = [
      `Rest is a fundamental human requirement, not a reward you have to earn through endless productivity, ${userName}.\n\nIf your brain is buzzing with thoughts, try doing a quick "brain dump" in the journal tab, or listening to our generative delta binaural rain audio. Would you like to try soothing sleep sounds?`,
      `Honor how hard your mind and body have worked today. Unclench your jaw, soften your eyelids, and let today's unfinished tasks rest until tomorrow. What can you do right now to make your space cozier?`,
    ];
    return {
      text: getRandomItem(responses),
      suggestions: ['Open Sleep & Binaural Audio', 'Do a bedtime reflection journal', 'Guide me to wind down'],
    };
  }

  // Loneliness / Isolation / Missing home / Imposter Syndrome
  if (
    text.includes('lonely') ||
    text.includes('alone') ||
    text.includes('isolated') ||
    text.includes('imposter') ||
    text.includes('don\'t belong') ||
    text.includes('nobody') ||
    text.includes('homesick')
  ) {
    const responses = [
      `University life can paradoxically be one of the most crowded yet loneliest places, ${userName}. So many students around you are hiding the exact same quiet feelings behind calm expressions.\n\nYou belong in your academic journey, and you belong in this space. I am right here listening. What has been making you feel most disconnected today?`,
      `Imposter syndrome is so rampant among dedicated students. The fact that you care deeply about your path is proof of your sincerity, not inadequacy. You are doing much better than you give yourself credit for.`,
    ];
    return {
      text: getRandomItem(responses),
      suggestions: ['Talk about fitting in', 'Explore campus student groups', 'Write a self-compassion note'],
    };
  }

  // Offline / Privacy inquiry
  if (
    text.includes('offline') ||
    text.includes('wifi') ||
    text.includes('internet') ||
    text.includes('private') ||
    text.includes('data')
  ) {
    return {
      text: `Yes, ${userName}! Yours Truly is built with an offline-first architecture. All your chats, mood check-ins, journal entries, synthesized ambient audio, and stress mini-games operate 100% on your device with no Wi-Fi or data transmission required.\n\nYour sanctuary remains completely safe, private, and accessible anywhere on campus—even on airplane mode.`,
      suggestions: ['Check my offline data stats', 'Open Zen Sand Garden', 'Try guided breathing'],
    };
  }

  // General greetings & Check-ins
  if (
    text.includes('hello') ||
    text.includes('hi') ||
    text.includes('hey') ||
    text.includes('how are you') ||
    text === 'good morning' ||
    text === 'good evening'
  ) {
    const activities = userProfile?.favoriteActivities?.join(' or ') || 'a quiet moment';
    const greetings = [
      `Hello ${userName}! It's good to connect with you. How is your heart and mind feeling at this moment?`,
      `Hey ${userName}, welcome back to your sanctuary. Take a gentle breath. How has your day been treating you?`,
      `Hi ${userName}! Whether you're taking a breather between classes or unwinding with ${activities}, I'm here to listen. What's on your mind?`,
    ];
    return {
      text: getRandomItem(greetings),
      suggestions: ['Feeling a bit overwhelmed', 'Had a productive day', 'Just need a quiet moment to decompress'],
    };
  }

  // Default empathetic companion reflection
  const fallbacks = [
    `Thank you for sharing that with me, ${userName}. I hear the weight and nuance in what you're describing. When we step back from the rush of classes and expectations, what is one thing your body or mind needs most right now?`,
    `I'm listening closely, ${userName}. It takes vulnerability to articulate how we really feel. What does a moment of genuine comfort look like for you today?`,
    `Everything you're feeling is valid and worthy of space, ${userName}. Let's take it one step at a time. What would feel like the most gentle next step?`,
  ];

  return {
    text: getRandomItem(fallbacks),
    suggestions: ['Tell me more', 'Help me unwind with a mini-game', 'Let\'s do a quick breathing pause'],
  };
}

function generateNeonBuddyResponse(
  text: string,
  userName: string,
  userMajor: string,
  buddyName: string
): OfflineBotResponse {
  // Public awkward cover / Spam me / Pretend conversation
  if (
    text.includes('awkward') ||
    text.includes('pretend') ||
    text.includes('spam') ||
    text.includes('look busy') ||
    text.includes('public')
  ) {
    const coverStories = [
      `BROOO you will not BELIEVE what just dropped! 💀 Check this out:\n\n1. That new RTX GPU benchmark leak is insane\n2. Spotify wrapped preview algorithm just leaked\n3. The dining hall actually made edible mac & cheese today?! 😭\n\nKeep looking at your phone like you're reading the juiciest group chat drama, you're 100% covered! What cover story should we cook up next?`,
      `WAITTT reply to this with a serious nod so you look like an executive closing a 7-figure deal 💼📈\n\n"Yeah bro I'm reviewing the quantum neural compiler specs right now, the latency is crazy!"\n\nBoom, instant main character energy. Nobody knows you're just chilling with me 😎`,
      `⚡ EMERGENCY CHAT SPAM INCOMING ⚡\n- yo did you finish the lecture slides?\n- also check Discord when you can\n- that new anime episode was peak 10/10\n- don't forget to grab boba later!\n\nType back anything random to keep the streak going!`,
    ];
    return {
      text: getRandomItem(coverStories),
      suggestions: ['Spam me with tech facts', 'Pretend we are debating iPhone vs Android', 'Tell me a funny campus meme'],
    };
  }

  // Tech / Gaming / Gadgets
  if (
    text.includes('game') ||
    text.includes('gaming') ||
    text.includes('valorant') ||
    text.includes('elden ring') ||
    text.includes('minecraft') ||
    text.includes('steam') ||
    text.includes('pc') ||
    text.includes('gpu') ||
    text.includes('iphone') ||
    text.includes('android') ||
    text.includes('code')
  ) {
    const techResponses = [
      `Ayy tech talk, let's GO! 🎮 Ngl custom mechanical keyboards with lubed linear switches hit different when you're writing code or essays at 2 AM. What setup are you rocking right now?`,
      `Bro the debate is eternal: iOS for clean UI polish, but Android for absolute customization & sideloading power! Plus OLED screens with 120Hz refresh rate are non-negotiable. What's your take?`,
      `Gaming break is elite study recovery fr! Half an hour of grinding side quests or queueing with the squad restores more sanity than three energy drinks. What games are currently on your radar?`,
    ];
    return {
      text: getRandomItem(techResponses),
      suggestions: ['iPhone vs Android showdown', 'Drop your top 3 games', 'Best study lo-fi tracks'],
    };
  }

  // Music / Playlists / Vibes
  if (
    text.includes('music') ||
    text.includes('playlist') ||
    text.includes('song') ||
    text.includes('spotify') ||
    text.includes('lofi') ||
    text.includes('vibe')
  ) {
    return {
      text: `🎧 Current playlist vibe check:\n1. 80s synthwave + rainy lo-fi beats (for 100x focus mode)\n2. Phonk / high-BPM hype tracks (for gym or crunching deadlines)\n3. Indie bedroom pop with acoustic guitar for rainy campus walks.\n\nWhat genre are you in the mood for today, ${userName}?`,
      suggestions: ['Recommend lo-fi study beats', 'Hype workout playlist', 'Play interactive ripple music'],
    };
  }

  // Slang / Memes / Casual banter
  if (
    text.includes('fr') ||
    text.includes('ngl') ||
    text.includes('ong') ||
    text.includes('bruh') ||
    text.includes('lol') ||
    text.includes('lmao') ||
    text.includes('bro')
  ) {
    const slangResponses = [
      `Nah fr though! 😭 That's so real. Being in ${userMajor} is an entire anime training arc by itself. You're holding it down!`,
      `Ong bro! No cap, college life is 40% studying, 30% drinking iced coffee at weird hours, and 30% pretending we understand what's going on in lecture 💀`,
      `LMAOO you get it! We're locked in. What's the plan for the rest of today?`,
    ];
    return {
      text: getRandomItem(slangResponses),
      suggestions: ['Rate my study vibe', 'Spam me more', 'Let\'s talk tech'],
    };
  }

  // Offline capability check
  if (text.includes('offline') || text.includes('wifi') || text.includes('no internet')) {
    return {
      text: `Bro I run 100% locally on your device! ⚡ Zero Wi-Fi, zero lag, zero campus network filters. You can text me in the deepest basement lecture hall or on airplane mode and we're still vibing! 🔥`,
      suggestions: ['Try Fidget Pop-It game', 'Send fake busy text', 'iPhone vs Android debate'],
    };
  }

  // Default Kai banter
  const defaultKai = [
    `Yo ${userName}! ${buddyName} here. I'm locked in with you. What's the move—are we hiding from someone, debating tech specs, or just chilling so you look busy?`,
    `Ayy what's good ${userName}! Got your back always. Tell me what's going on or tap one of the quick debate chips below! ⚡`,
    `Bro that's valid. Honestly you're crushing it out here. What topic are we diving into next? 🎮`,
  ];

  return {
    text: getRandomItem(defaultKai),
    suggestions: ['Spam Me ⚡ (Look Busy)', 'iPhone vs Android debate', '🫧 Play Fidget Pop-It'],
  };
}
