module.exports = {
  name: 'skip',
  async execute(message, args, client) {
    const queue = client.distube.getQueue(message.guildId);
    if (!queue) return message.reply('<:error:1533894397219831889> Nothing is playing.');
    await queue.skip();
    message.reply('<:music_next:1533525838337802250> Skipped.');
  },
};
