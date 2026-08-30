process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

console.log("Node Version:", process.version);

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

setInterval(() => {
  const mem = process.memoryUsage();
  console.log(
    "RAM:",
    Math.round(mem.rss / 1024 / 1024) + "MB"
  );
}, 60000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();
const cooldowns = new Collection();

// =========================
// EVENT LOADER (ADD THIS)
// =========================
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);

  if (typeof event === "function") {
    event(client);
  }
}

const prefix = ',';

// Load all commands from folders
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.name) {
      client.commands.set(command.name, command);
    }
  }
}

client.once('ready', () => {
    console.log(`🤖 Avic Bot logged in as ${client.user.tag}`);

  require("./events/giveawayManager")(client);

    const updateStatus = () => {
    const servers = client.guilds.cache.size;
    const users = client.guilds.cache.reduce(
        (total, guild) => total + guild.memberCount,
        0
    );

    client.user.setPresence({
        status: "dnd",
        activities: [
            {
                name:`.gg/farehq | Watching ${servers} servers.`,
                type: 2
            }
        ]
    });
};

updateStatus();
setInterval(updateStatus, 30000);
});

client.on('messageCreate', async message => {

  const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

// =========================
// REMOVE GLOBAL AFK
// =========================
const globalAfk = await db.get(`afk_${message.author.id}`);

if (globalAfk) {
    await db.delete(`afk_${message.author.id}`);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#57F287")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `<:Tick:1514714190500335677> Welcome back ${message.author} from Global AFK\n\n` +
                    `<:arrow:1514699753462566953> You have been AFK since <t:${Math.floor(globalAfk.since / 1000)}:R>\n` +
                    `<:info:1514699288674828310> Reason • ${globalAfk.reason}\n` +
                    `<:dot:1514706694079254730> Mentions • **${globalAfk.mentions || 0}**`
                )
        ]
    });
}

// =========================
// REMOVE SERVER AFK
// =========================
const serverAfk = await db.get(`afk_${message.guild.id}_${message.author.id}`);

if (serverAfk) {
    await db.delete(`afk_${message.guild.id}_${message.author.id}`);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#A9C7FF")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `<:Tick:1514714190500335677> Welcome back ${message.author} from Server AFK\n\n` +
                    `<:arrow:1514699753462566953> You have been AFK since <t:${Math.floor(serverAfk.since / 1000)}:R>\n` +
                    `<:info:1514699288674828310> Reason • ${serverAfk.reason}\n` +
                    `<:dot:1514706694079254730> Mentions • **${serverAfk.mentions || 0}**`
                )
        ]
    });
}

// =========================
// AFK MENTION SYSTEM
// =========================
for (const user of message.mentions.users.values()) {

    const globalKey = `afk_${user.id}`;
    const serverKey = `afk_${message.guild.id}_${user.id}`;

    let data = await db.get(globalKey);
    let key = globalKey;

    if (!data) {
        data = await db.get(serverKey);
        key = serverKey;
    }

    if (!data) continue;

    // Increase mention count
    data.mentions = (data.mentions || 0) + 1;
    await db.set(key, data);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#FFCC66")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `<:WarningIcon:1514708751385497721> **${user.username} is currently AFK**\n\n` +
                    `<:arrow:1514699753462566953> Reason • ${data.reason}\n` +
                    `<:timerr:1514699712681218094> Since • <t:${Math.floor(data.since / 1000)}:R>`
                )
        ]
    });
                     }
  
  if (message.author.bot) return;

  await db.add(`stats.${message.author.id}.messages`, 1);
await db.add(`stats.${message.author.id}.xp`, 5);

if (message.reference) {
  try {
    const replied = await message.channel.messages.fetch(
      message.reference.messageId
    );

    const isAiMessage =
      replied.reactions.cache.some(
        r => r.emoji.id === "1514699727072133233"
      );

    if (isAiMessage) {
      const aiCommand = client.commands.get("ai");

      return aiCommand.execute(
        message,
        message.content.split(" ")
      );
    }
  } catch (err) {
    console.log(err);
  }
}
  
  if (message.author.bot) return;
  db.push(`chat_${message.author.id}`, message.content);

  const afkData = await db.get(`afk_${message.author.id}`);

if (afkData) {
    await db.delete(`afk_${message.author.id}`);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#D3D3D3")
                .setDescription(`<:Tick:1514714190500335677> Welcome back ${message.author}`)
        ]
    }).then(m => {
        setTimeout(() => m.delete().catch(() => {}), 5000);
    });
}

for (const user of message.mentions.users.values()) {

    const globalKey = `afk_${user.id}`;
    const serverKey = `afk_${message.guild.id}_${user.id}`;

    let data = await db.get(globalKey);
    let key = globalKey;

    if (!data) {
        data = await db.get(serverKey);
        key = serverKey;
    }

    if (!data) continue;

    data.mentions = (data.mentions || 0) + 1;
    await db.set(key, data);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#FFCC66")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `<:WarningIcon:1514708751385497721> **${user.username} is currently AFK**\n\n` +
                    `<:arrow:1514699753462566953> Reason • ${data.reason}\n` +
                    `<:timerr:1514699712681218094> Since • <t:${Math.floor(data.since / 1000)}:R>`
                )
        ]
    });
}
  

  if (
    message.content === `<@${client.user.id}>` ||
    message.content === `<@!${client.user.id}>`
  ) {

    const { EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:bot1:1514699532686852227> | Prefix Info')
      .setDescription(
`<:dot:1514706694079254730> **Prefix Help**
Hey ${message.author}! Here are my current prefixes:

<:dot:1514706694079254730> **Details**

> <:arrow:1514699753462566953> **Global Prefix** : \`,\`
> <:arrow:1514699753462566953> **Server Prefix** : \`,\`

> ***Tip***: *Use \`,help\` to see all my commands.*`
      );

    const pingMsg = await message.reply({
  embeds: [embed]
});

setTimeout(() => {
  pingMsg.delete().catch(() => {});
}, 5000);

return;
  }

 const isNoPrefix =
    message.author.id === "1530872106399567941" ||
    await db.get(`noprefix_${message.author.id}`);

let args;
let commandName;

if (message.content.startsWith(prefix)) {
    args = message.content.slice(prefix.length).trim().split(/ +/);
    commandName = args.shift().toLowerCase();
} else if (isNoPrefix) {
    args = message.content.trim().split(/ +/);
    commandName = args.shift().toLowerCase();
} else {
    return;
}

const command = client.commands.get(commandName);

  if (!command) return;
  
  const cooldown = 5000;

if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);

if (timestamps.has(message.author.id)) {

    const expirationTime = timestamps.get(message.author.id) + cooldown;

    if (now < expirationTime) {

        const timeLeft = ((expirationTime - now) / 1000).toFixed(2);

        const cooldownEmbed = new EmbedBuilder()
            .setColor("#FF7F7F")
            .setTitle("You can't use this command!")
            .setDescription(
`<a:spider_cross:1514728338701287640> You are under cooldown to this command!

<:arrow:1514699753462566953> Cooldown ~ \`${timeLeft} s\``
            );

        const msg = await message.reply({
            embeds: [cooldownEmbed]
        });

        setTimeout(() => {
            msg.delete().catch(() => {});
        }, 10000);

        return;
    }
}

timestamps.set(message.author.id, now);

setTimeout(() => timestamps.delete(message.author.id), cooldown);

try {
    await command.execute(message, args, client);
} catch (err) {
    console.error("PLAY ERROR:", err);

    message.reply(
        "<:WarningIcon:1514708751385497721> Error running command!"
    );
}
});

client.login(process.env.TOKEN);
