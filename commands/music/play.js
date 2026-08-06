module.exports = {
  name: 'play',
  async execute(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('<:error:1533894397219831889> Join a voice channel first.');

    const query = args.join(' ');
    if (!query) return message.reply('<:error:1533894397219831889> Give me a song name or URL.');

    await client.distube.play(voiceChannel, query, {
      textChannel: message.channel,
      member: message.member,
    });
  },
};
