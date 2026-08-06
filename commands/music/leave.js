module.exports = {
  name: 'leave',
  execute(message, args, client) {
    const queue = client.distube.getQueue(message.guildId);
    if (!queue) return message.reply('<:error:1533894397219831889> Not connected.');
    queue.voice.leave();
    message.reply('<:power:1520340458767646821> Left the voice channel.');
  },
};
