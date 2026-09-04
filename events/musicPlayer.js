const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const {
  useMainPlayer
} = require("discord-player");

module.exports = (client) => {

  const player = useMainPlayer();

  // =========================
  // SONG STARTED
  // =========================

  player.events.on("playerStart", async (queue, track) => {

    try {

      const channel = queue.metadata?.channel;

      if (!channel) return;

      const nowPlayingEmbed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle("Now Playing")
        .setThumbnail(track.thumbnail || null)
        .setDescription(
          `<:youtube:1545131580090097725> **${track.title}**\n\n` +
          `Duration: \`${track.duration || "Unknown"}\`\n` +
          `Requested by ${track.requestedBy || "Unknown"}`
        )
        .setFooter({
          text: "Fare Music"
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

      const components = [row1, row2];

      // =========================
      // UPDATE EXISTING MESSAGE
      // =========================

      if (queue.metadata?.nowPlayingMessage) {

        try {

          const msg = queue.metadata.nowPlayingMessage;

          await msg.edit({
            embeds: [nowPlayingEmbed],
            components
          });

          return;

        } catch {
          // Message no longer exists
          queue.metadata.nowPlayingMessage = null;
        }
      }

      // =========================
      // CREATE FIRST MESSAGE
      // =========================

      const msg = await channel.send({
        embeds: [nowPlayingEmbed],
        components
      });

      queue.metadata.nowPlayingMessage = msg;

    } catch (error) {

      console.error(
        "PLAYER START ERROR:",
        error?.message || String(error)
      );

    }

  });

};
