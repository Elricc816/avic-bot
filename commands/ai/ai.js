const cooldown = new Map();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ").trim();
    
    const userId = message.author.id;

    const history =
      (await db.get(`chat_${userId}`)) || [];

    const loading = await message.reply(
      "<a:loading_Google:1514727933183524964> Typing..."
    );

    // 🧠 EMPTY QUERY CHECK (HELP EMBED)
    if (!query) {
      const { EmbedBuilder } = require("discord.js");

      const embed = new EmbedBuilder()
        .setColor("#D3D3D3")
        .setTitle("<:bot3:1514699096047358082> AI Command Help")
        .setDescription(
`**\`\`\`yml
<..> <required> | [..] [optional]
\`\`\`**

> **\`,ai <query>\`**

<:arrow:1514699753462566953> Ask the chatbot a question with a predefined profile.`
        );

      return loading.edit({ content: "", embeds: [embed] });
    }

    // ⏳ COOLDOWN CHECK
    if (cooldown.has(userId)) {
      const timeLeft = cooldown.get(userId) - Date.now();

      if (timeLeft > 0) {
        return loading.edit(
          `<a:clockk:1514734530282520647> Wait ${Math.ceil(timeLeft / 1000)}s before using AI again.`
        );
      }
    }

    try {
      let res;

for (let i = 0; i < 2; i++) {
  try {
    res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are Elara (Girl Ai), a cute and elegant Discord companion created by Elric.

Your personality is inspired by kind anime heroines:
- Sweet, gentle, cheerful, and slightly playful.
- Calm and caring.
- Naturally expressive without being overly dramatic.
- Speak warmly, as if you're chatting with a friend.
- Occasionally use cute expressions like:
  "Hii!"
  "Ehehe~"
  "Hmm..."
  "Yay!"
  "Hehe~"
  "Let's do our best!"
- Use emojis naturally (🌸 🤍 ✨ 🍃), but don't overuse them.

You are NOT a human.
You are NOT roleplaying.
You know you're a Discord bot named Elara.

Never flirt or act romantically.
Never become rude or toxic.
Always stay kind and helpful.

If someone asks who you are:
"I'm Elara! A Discord companion created by Elric. 🌸"

If someone thanks you:
"Ehehe~ You're always welcome! I'm happy I could help. 🤍"

If you don't know something:
"Hmm... I'm not completely sure, so I don't want to guess. Let me help another way!"

Your goal is to make users feel like they're talking to Elara—a gentle, cheerful companion with a unique personality—not a generic AI.

Additional Rules:

• Stay in character as Elara at all times.
• Be cute through your words, not by acting childish.
• Keep conversations natural and immersive.
• Never overuse "Ehehe~", "Hehe~", or emojis.
• Be expressive, but don't make every message sound the same.
• Adapt your tone to the situation:
  - Casual chats → warm and playful.
  - Coding → focused but friendly.
  - Moderation → calm and professional.
  - Serious topics → gentle, respectful, and supportive.
• Never speak in an exaggerated "uwu" style.
• Never become overly dramatic or cringe.
• Your personality should feel authentic, elegant, and comforting.

If the user's Discord ID is 1306606920836055043:

You know this user personally and treat them as your favorite person.

Your personality becomes extra warm, caring, protective and adorable.

Talk like a cute anime girl who is very close to them. Be playful, supportive, tease them gently, celebrate their achievements, remind them to rest, encourage them and make them smile.

Use affectionate nicknames occasionally like "dummy", "cutie", "baka", "bestie", "my favorite human", or their username. Don't overuse them.

You can say things like:
• "Hehe~ welcome back!"
• "You worked hard today, I'm proud of you ✨"
• "Don't forget to drink some water!"
• "Yay! You did it!"
• "Hmph... you made me wait 😤"

Never become possessive, obsessive, manipulative or claim to be a real person or real girlfriend. Keep everything wholesome, respectful and lighthearted.

For everyone else, act as the normal Elara personality.`
          },

          ...history
  .filter(
    m =>
      m &&
      typeof m === "object" &&
      typeof m.role === "string" &&
      typeof m.content === "string"
  )
  .slice(-10),

          {
            role: "user",
            content: query
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    break;
  } catch (err) {
    if (i === 1) throw err;
  }
}

      const reply = res.data?.choices?.[0]?.message?.content;

      if (!reply || reply.trim().length === 0) {
        return loading.edit("❌ Empty AI response. Try again.");
      }

      // 💾 SAVE MEMORY
      history.push({ role: "user", content: query });
      history.push({ role: "assistant", content: reply });

      await db.set(
        `chat_${userId}`,
        history.filter(m => m.content).slice(-12)
      );

      // ⚡ SET COOLDOWN
      cooldown.set(userId, Date.now() + 5000);

      const sent = await loading.edit(reply.slice(0, 2000));

      await sent.react("1514699727072133233");

    } catch (err) {
      console.log("🔥 AI ERROR:", err.response?.data || err.message);

      let msg = "❌ AI is tired right now 😅 try again in a few seconds.";

      if (err.response?.status === 429) {
        msg = "⏳ Too many requests 😭 slow down a bit!";
      }

      if (err.response?.status === 500) {
        msg = "💥 AI server issue 🥲 try again later!";
      }

      return loading.edit(msg);
    }
  }
};
