const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const ffmpeg = require('ffmpeg-static');

module.exports = (client) => {
  client.distube = new DisTube(client, {
    plugins: [new YouTubePlugin()],
    ffmpeg: {
      path: ffmpeg,
    },
  });

  client.distube.on('playSong', (queue, song) => {
    queue.textChannel?.send(
      `<:play:1533532009450831945> Now playing: **${song.name}** - \`${song.formattedDuration}\``
    );
  });

  client.distube.on('addSong', (queue, song) => {
    queue.textChannel?.send(
      `<:yes:1533858344341602365> Added **${song.name}** to the queue.`
    );
  });

  client.distube.on('error', (channel, error) => {
    console.error('DISTUBE ERROR:', error);
    channel?.send('<:error:1533894397219831889> An error occurred while playing music.');
  });

  client.distube.on('finish', (queue) => {
    queue.textChannel?.send('<:yes:1533858344341602365> Queue finished.');
  });

  client.distube.on('empty', (queue) => {
    queue.textChannel?.send('<:power:1520340458767646821> Voice channel is empty, leaving.');
  });

  client.distube.on('disconnect', (queue) => {
    queue.textChannel?.send('<:power:1520340458767646821> Disconnected from the voice channel.');
  });
};
