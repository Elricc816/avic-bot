module.exports = {
  name: 'queue',
  execute(message, args, client) {
    const queue = client.distube.getQueue(message.guildId);
    if (!queue) return message.reply('<:error:1533894397219831889> Nothing is playing.');
    const list = queue.songs.map((s, i) => `${i === 0 ? '<:play:1533532009450831945>' : '<:bulletlist:1533894017710817546>'} ${s.name} - \`${s.formattedDuration}\``).join('\n');
    message.reply(list);
  },
};
