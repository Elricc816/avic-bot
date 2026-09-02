const { useMainPlayer } = require("discord-player");

module.exports = {
  name: "play",
  aliases: ["p"],

  async execute(message, args) {
    if (!args.length) {
      return message.reply("❌ Give me a song name or URL.");
    }

    const voiceChannel = message.member?.voice?.channel;

    if (!voiceChannel) {
      return message.reply("❌ Join a voice channel first.");
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

      message.reply(`🎵 Added **${track.title}** to the queue.`);
    } catch (error) {
      console.error(error);
      message.reply("❌ I couldn't play that song.");
    }
  }
};
