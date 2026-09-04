const {
  useQueue,
  useHistory,
  QueueRepeatMode
} = require("discord-player");

module.exports = (client) => {

  client.on("interactionCreate", async (interaction) => {

    // Only handle buttons
    if (!interaction.isButton()) return;

    // Make sure button is one of our music buttons
    const musicButtons = [
      "music_previous",
      "music_pause",
      "music_skip",
      "music_queue",
      "music_stop",
      "music_loop",
      "music_shuffle",
      "music_autoplay"
    ];

    if (!musicButtons.includes(interaction.customId)) return;

    // Buttons only work inside a server
    if (!interaction.guild) {
      return interaction.reply({
        content: "<a:spider_cross:1514728338701287640> **__This button can only be used in a server.__**",
        ephemeral: true
      });
    }

    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: "<a:spider_cross:1514728338701287640> **__Nothing is playing right now.__**",
        ephemeral: true
      });
    }

    try {

      // =========================
      // PREVIOUS
      // =========================

      if (interaction.customId === "music_previous") {

        const history = useHistory(interaction.guild.id);

        if (!history.previousTrack) {
          return interaction.reply({
            content: "<a:spider_cross:1514728338701287640> **__No previous song.__**",
            ephemeral: true
          });
        }

        await history.previous();

        return interaction.reply({
          content: "<:music_previous:1533525855530258442> Playing previous song.",
          ephemeral: true
        });
      }


      // =========================
// PAUSE / RESUME
// =========================

if (interaction.customId === "music_pause") {

  const paused = queue.node.isPaused();

  queue.node.setPaused(!paused);

  const updatedComponents = interaction.message.components.map(row => {
    const rowData = row.toJSON();

    rowData.components = rowData.components.map(component => {

      if (component.custom_id === "music_pause") {
        return {
          ...component,
          emoji: paused
            ? {
                id: "1533532086399533106",
                name: "pause"
              }
            : {
                id: "1533532009450831945",
                name: "play"
              }
        };
      }

      return component;
    });

    return rowData;
  });

  return interaction.update({
    components: updatedComponents
  });
}


      // =========================
      // SKIP
      // =========================

      if (interaction.customId === "music_skip") {

        queue.node.skip();

        return interaction.reply({
          content: "<:music_next:1533525838337802250> **__Skipped.__**",
          ephemeral: true
        });
      }


      // =========================
      // QUEUE
      // =========================

      if (interaction.customId === "music_queue") {

        const tracks = queue.tracks.toArray();

        if (!tracks.length) {
          return interaction.reply({
            content: "<:queue:1545136690790797332> **__Queue is empty.__**",
            ephemeral: true
          });
        }

        const list = tracks
          .slice(0, 10)
          .map(
            (track, index) =>
              `${index + 1}. **${track.title}**`
          )
          .join("\n");

        return interaction.reply({
          content: `<:queue:1545136690790797332> **Queue**\n\n${list}`,
          ephemeral: true
        });
      }


      // =========================
      // STOP
      // =========================

      if (interaction.customId === "music_stop") {

        queue.delete();

        return interaction.update({
          components: []
        });
      }


      // =========================
      // LOOP
      // =========================

      if (interaction.customId === "music_loop") {

        const isLooping =
          queue.repeatMode === QueueRepeatMode.TRACK;

        queue.setRepeatMode(
          isLooping
            ? QueueRepeatMode.OFF
            : QueueRepeatMode.TRACK
        );

        return interaction.reply({
          content: isLooping
            ? "<:loop:1533527395246538964> **__Loop disabled.__**"
            : "<:loop:1533527395246538964> **__Track loop enabled.__**",
          ephemeral: true
        });
      }


      // =========================
      // SHUFFLE
      // =========================

      if (interaction.customId === "music_shuffle") {

        if (queue.tracks.size < 2) {
          return interaction.reply({
            content: "<a:spider_cross:1514728338701287640> **__Not enough songs to shuffle.__**",
            ephemeral: true
          });
        }

        queue.tracks.shuffle();

        return interaction.reply({
          content: "<:shuffle:1545131552504025132> **__Queue shuffled.__**",
          ephemeral: true
        });
      }


      // =========================
      // AUTOPLAY
      // =========================

      if (interaction.customId === "music_autoplay") {

        const isAutoplay =
          queue.repeatMode === QueueRepeatMode.AUTOPLAY;

        queue.setRepeatMode(
          isAutoplay
            ? QueueRepeatMode.OFF
            : QueueRepeatMode.AUTOPLAY
        );

        return interaction.reply({
          content: isAutoplay
            ? "<:autoplay:1545133559113580616> **__Autoplay disabled.__**"
            : "<:autoplay:1545133559113580616> **__Autoplay enabled.__**",
          ephemeral: true
        });
      }

    } catch (error) {

      console.error(
        "MUSIC BUTTON ERROR:",
        error?.message || String(error)
      );

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "<a:spider_cross:1514728338701287640> **__Something went wrong.__**",
          ephemeral: true
        });
      }
    }

  });

};
