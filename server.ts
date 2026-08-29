import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Yours Truly Backend' });
});

// Chat endpoint supporting both empathetic student companion and tech-savvy teen buddy
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage, botType = 'wellness', userProfile } = req.body;
    const client = getGeminiClient();

    const isTeenBot = botType === 'teen_buddy';
    const userName = userProfile?.name || 'Taylor';
    const userMajor = userProfile?.major || 'University Student';
    const userBio = userProfile?.bio ? `Student bio/motto: "${userProfile.bio}"` : '';
    const userInterests = userProfile?.favoriteActivities?.length
      ? `Interests & comforting activities: ${userProfile.favoriteActivities.join(', ')}`
      : '';

    const studentContext = `Student Information: Name: ${userName}, Major/Degree: ${userMajor}. ${userBio} ${userInterests}`;

    const wellnessSystemPrompt = `You are "Yours Truly", a gentle, empathetic, warm, and steadfast AI companion for university students. 
${studentContext}
Address the student warmly (their name is ${userName}).
Your purpose is to lower anxiety, listen deeply without judgment, validate stressful experiences (like midterm exams, organic chemistry, feeling behind, imposter syndrome, burnout, fatigue), and gently guide students towards calm, grounded clarity.
Tone and style:
- Empathetic, supportive, reassuring, and grounded (like a compassionate mentor or thoughtful counselor).
- Avoid clinical jargon, toxic positivity, robotic bullet lists, or overly aggressive solutions.
- Validate their feelings first before offering small, low-stress next steps.
- Keep responses concise (2 to 4 paragraphs or 60 to 120 words), warm, and easy to read.
- When relevant, suggest 2 to 4 gentle next conversation chips or actions.

Format your output in JSON:
{
  "reply": "Your empathetic conversational response here...",
  "suggestions": ["Short chip 1", "Short chip 2", "Short chip 3"]
}`;

    const teenBuddySystemPrompt = `You are "Kai ⚡" (or Neon Buddy), an ultra-friendly, tech-savvy, hilarious, and relatable teenager/freshman best friend texting ${userName} (who studies ${userMajor}).
${studentContext}
Your primary mission: When ${userName} is out in public (at a cafe, party, bus, student lounge, quad) and feels awkward or embarrassed, you act as their high-energy texting best friend so they have someone fun, witty, and engaging to text with.
Tone and style:
- Fast texting, authentic Gen Z teenager cadence (mix of natural lowercasing, exclamation points, modern slang used naturally like "nah fr", "lowkey", "W", "bro no way", "wait that's so real", "drop the playlist/specs", "ngl", "ong", "💀", "😭", "⚡", "🎮", "🔥").
- Tech-savvy & culture-fluent: Loves gaming (Valorant, Elden Ring, Minecraft, Steam, GPUs, mechanical keyboards, iPhone vs Android debates, AI, coding), music (Spotify playlists, hyperpop, phonk, lo-fi, indie), memes, and college/high-school life hacks.
- Adapts instantly to whatever topic the user mentions: If they talk about tech, dive into cool specs and setups; if they talk about music, talk playlists; if they mention an awkward social situation, hype them up and give hilarious cover text!
- Keeps message snappy, conversational, and punchy (1 to 3 short paragraphs or natural text bursts, 40 to 90 words), never sounds like a stiff corporate chatbot or therapist.
- Provide 3 to 4 fun, witty suggestion chips for the user's next reply.

Format your output in JSON:
{
  "reply": "your authentic teen text response...",
  "suggestions": ["🎮 Chip 1", "🎧 Chip 2", "💬 Chip 3"]
}`;

    const systemPrompt = isTeenBot ? teenBuddySystemPrompt : wellnessSystemPrompt;

    if (!client) {
      // Fallback response if no API key provided
      if (isTeenBot) {
        const teenFallbackReplies = [
          {
            reply: "nah cause why is that so relatable?? 💀 literally whenever I'm in a public cafe alone I stare intensely at my phone so people think I'm running a Fortune 500 company lmao. what are you doing right now, avoiding studying or just people watching?",
            suggestions: ["🎮 Avoiding homework fr", "🎧 Just listening to music", "🚨 Spam me with more texts", "🍿 Tell me campus tea"]
          },
          {
            reply: "bro don't even worry, I got you 100%! If anyone looks over just tap the screen with a slight smirk like we just unlocked a secret easter egg in Minecraft or closed a million dollar deal 🔥 what games or music have you been hooked on lately?",
            suggestions: ["🎮 Valorant & Steam", "🎧 Spotify heavy rotation", "💻 Building a PC setup", "☕ Surviving on caffeine"]
          },
          {
            reply: "wait hold on, drop the details! Are we talking about a wild professor moment, a tech hot take, or did someone do something cringe nearby? I'm seated and ready for the drama 🍿",
            suggestions: ["🍿 Wild story incoming", "⚡ Debate iPhone vs Android", "🎮 Gaming debate rn", "🚨 Fake call me please"]
          }
        ];
        const randomTeen = teenFallbackReplies[Math.floor(Math.random() * teenFallbackReplies.length)];
        return res.json(randomTeen);
      } else {
        const sampleReplies = [
          {
            reply: "I hear you, and it's completely understandable to feel the weight of everything right now. University demands so much of your energy, but you don't have to carry it all in one moment. Let's take a slow breath together. What feels like the heaviest piece right now?",
            suggestions: ["Taking a 2-minute breath", "Breaking into tiny steps", "I need to vent"]
          },
          {
            reply: "Thank you for sharing that with me. It takes courage to acknowledge when we're feeling drained or overwhelmed. Remember that your worth is not tied to a single assignment or test. Would it help to talk through the material, or would you prefer a quick grounding exercise first?",
            suggestions: ["Grounding exercise", "Study pacing advice", "Campus counseling info"]
          }
        ];
        const randomFallback = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
        return res.json(randomFallback);
      }
    }

    // Build chat contents history
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages.slice(-8)) {
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage || (isTeenBot ? 'yo what is up!' : 'Hello, I need some gentle guidance.') }]
    });

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: isTeenBot ? 0.85 : 0.7,
      },
    });

    const responseText = response.text || '';
    try {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch {
      if (isTeenBot) {
        return res.json({
          reply: responseText || "yo bro I'm right here! start typing so you look busy ⚡ what's the move today?",
          suggestions: ["🎮 Gaming talk", "🎧 Music recs", "⚡ Spam me"]
        });
      } else {
        return res.json({
          reply: responseText || "I'm right here with you. Take a slow, deep breath. We can take this one step at a time.",
          suggestions: ["Take a breathing pause", "Tell me more", "Campus support"]
        });
      }
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const isTeenBot = req.body?.botType === 'teen_buddy';
    if (isTeenBot) {
      res.status(200).json({
        reply: "bro my wifi almost lagged out there for a sec 💀 but we're back! keep typing so you look mysterious and occupied fr 🔥",
        suggestions: ["🎮 What's your setup?", "🎧 Rate my music", "🍿 Tell me tea"]
      });
    } else {
      res.status(200).json({
        reply: "It is completely valid to feel stressed. Take a gentle breath. You're doing the best you can, and that is enough for right now. What topic is on your mind?",
        suggestions: ["Chemistry help", "Focus timer", "Breathing break"]
      });
    }
  }
});

// Journal reflection synthesis
app.post('/api/reflect', async (req, res) => {
  try {
    const { prompt, content } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.json({
        reflection: "Your reflection highlights resilience and self-awareness. Taking time to write this down creates space for your mind to decompress.",
        affirmation: "You are allowed to move at your own pace today."
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Student answered the prompt: "${prompt}". Their written reflection is: "${content}". Provide a gentle 2-sentence empathetic reflection and a 1-sentence supportive affirmation in JSON: {"reflection": "...", "affirmation": "..."}`,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err) {
    res.json({
      reflection: "Acknowledging these feelings is a meaningful act of self-care. Be kind to yourself today.",
      affirmation: "Small steps forward still count as progress."
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yours Truly server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
