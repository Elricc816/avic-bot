const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: "ping",
  async execute(message) {

    const createEmbed = () => {
      const heartbeat = Date.now() - message.createdTimestamp;
      const api = Math.round(message.client.ws.ping);

      return new EmbedBuilder()
        .setAuthor({
          name: message.client.user.username,
          iconURL: message.client.user.displayAvatarURL()
        })
        .setDescription(
          `<:heartt:1514699719400755432> Heartbeat: **${heartbeat} ms**\n<:timerr:1514699712681218094> API: **${api} ms**`
        )
        .setColor('#fff18d')
        .setFooter({
          text: 'Cluster: 0 | Shard: 0'
        });
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('refresh_ping')
        .setLabel('Refresh')
        .setEmoji('<:pin:1514699935264673902>')
        .setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.reply({
      embeds: [createEmbed()],
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      time: 300000 // 5 min
    });

    collector.on('collect', async interaction => {

      if (interaction.customId !== 'refresh_ping') return;

      const heartbeat = Date.now() - interaction.createdTimestamp;
      const api = Math.round(message.client.ws.ping);

      const updatedEmbed = new EmbedBuilder()
        .setAuthor({
          name: message.client.user.username,
          iconURL: message.client.user.displayAvatarURL()
        })
        .setDescription(
          `<:heartt:1514699719400755432> Heartbeat: **${heartbeat} ms**\n<:timerr:1514699712681218094> API: **${api} ms**`
        )
        .setColor('#fff18d')
        .setFooter({
          text: 'Cluster: 0 | Shard: 0'
        });

      await interaction.update({
        embeds: [updatedEmbed],
        components: [row]
      });
    });
  }
};
