const { EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "play",
  aliases: ["p"],

  async execute(message, args) {
    if (!args.length) {
      return message.reply(
        "<a:spider_cross:1514728338701287640> **__Give me a song name or URL.__**"
      );
    }

    const voiceChannel = message.member?.voice?.channel;

    if (!voiceChannel) {
      return message.reply(
        "<a:spider_cross:1514728338701287640> **__Join a voice channel first.__**"
      );
    }

    const player = useMainPlayer();

    try {
      const { track } = await player.play(
        voiceChannel,
        args.join(" "),
        {
          nodeOptions: {
            metadata: {
              channel: message.channel
            }
          },
          requestedBy: message.author
        }
      );

      // =========================
      // ADDED TO QUEUE
      // =========================

      const queueEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("Added to Queue")
        .setThumbnail(track.thumbnail || null)
        .setDescription(
          `<:youtube:1545131580090097725> **${track.title}**\n\n` +
          `Duration: \`${track.duration || "Unknown"}\`\n` +
          `Requested by ${message.author}`
        )
        .setFooter({
          text: "Fare Music"
        });

      await message.channel.send({
        embeds: [queueEmbed]
      });

    } catch (error) {
      console.error(
        "MUSIC ERROR:",
        error?.message || String(error)
      );

      return message.reply(
        "<a:spider_cross:1514728338701287640> **__I couldn't play that song.__**"
      );
    }
  }
};
