const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "play",
  aliases: ["p"],

  async execute(message, args) {
    if (!args.length) {
      return message.reply("<a:spider_cross:1514728338701287640> **__Give me a song name or URL.__**");
    }

    const voiceChannel = message.member?.voice?.channel;

    if (!voiceChannel) {
      return message.reply("<a:spider_cross:1514728338701287640> **__Join a voice channel first.__**");
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
          }
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

      // =========================
      // MUSIC BUTTONS
      // =========================

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("music_previous")
          .setEmoji("<:music_previous:1533525855530258442>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_play")
          .setEmoji("<:play:1533532009450831945>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_skip")
          .setEmoji("<:music_next:1533525838337802250>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_queue")
          .setEmoji("<:queue:1545136690790797332>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_stop")
          .setEmoji("<:stop:1545135614117019699>")
          .setStyle(ButtonStyle.Danger)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("music_loop")
          .setLabel("Loop")
          .setEmoji("<:loop:1533527395246538964>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_shuffle")
          .setLabel("Shuffle")
          .setEmoji("<:shuffle:1545131552504025132>")
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId("music_autoplay")
          .setLabel("Autoplay")
          .setEmoji("<:autoplay:1545133559113580616>")
          .setStyle(ButtonStyle.Secondary)
      );

      await message.channel.send({
        embeds: [nowPlayingEmbed],
        components: [row1, row2]
      });

    } catch (error) {
      console.error("MUSIC ERROR:", error?.message);
      console.error("MUSIC STACK:", error?.stack);

      return message.reply(
        "<a:spider_cross:1514728338701287640> **__I couldn't play that song.__**"
      );
    }
  }
};
