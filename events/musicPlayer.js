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

      // Delete old control panel
      if (queue.metadata?.nowPlayingMessage) {
        try {
          await queue.metadata.nowPlayingMessage.delete();
        } catch {}

        queue.metadata.nowPlayingMessage = null;
      }

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

      const msg = await channel.send({
        embeds: [nowPlayingEmbed],
        components: [row1, row2]
      });

      queue.metadata.nowPlayingMessage = msg;

    } catch (error) {
      console.error(
        "PLAYER START ERROR:",
        error?.message || String(error)
      );
    }
  });


  // =========================
  // QUEUE ENDED
  // =========================

  player.events.on("emptyQueue", async (queue) => {
    try {

      if (queue.metadata?.nowPlayingMessage) {
        try {
          await queue.metadata.nowPlayingMessage.delete();
        } catch {}

        queue.metadata.nowPlayingMessage = null;
      }

    } catch (error) {
      console.error(
        "QUEUE END ERROR:",
        error?.message || String(error)
      );
    }
  });


  // =========================
  // QUEUE DELETED / STOPPED
  // =========================

  player.events.on("playerError", async (queue, error) => {
    console.error(
      "MUSIC PLAYER ERROR:",
      error?.message || String(error)
    );
  });


  // =========================
  // BOT LEAVES VOICE CHANNEL
  // =========================

  client.on("voiceStateUpdate", async (oldState, newState) => {

    // Only care about Fare
    if (oldState.id !== client.user.id) return;

    // Bot was in VC and is now disconnected
    if (oldState.channelId && !newState.channelId) {

      const queue = player.nodes.get(oldState.guild.id);

      if (!queue) return;

      if (queue.metadata?.nowPlayingMessage) {
        try {
          await queue.metadata.nowPlayingMessage.delete();
        } catch {}

        queue.metadata.nowPlayingMessage = null;
      }
    }
  });

};
