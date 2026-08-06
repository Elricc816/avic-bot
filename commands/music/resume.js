module.exports = {
  name: 'resume',
  execute(message, args, client) {
    const queue = client.distube.getQueue(message.guildId);
    if (!queue) return message.reply('<:error:1533894397219831889> Nothing is playing.');
    queue.resume();
    message.reply('<:play:1533532009450831945> Resumed.');
  },
};
