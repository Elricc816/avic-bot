module.exports = {
  name: 'pause',
  execute(message, args, client) {
    const queue = client.distube.getQueue(message.guildId);
    if (!queue) return message.reply('<:error:1533894397219831889> Nothing is playing.');
    queue.pause();
    message.reply('<:pause1:1533532040102674652> Paused.');
  },
};
