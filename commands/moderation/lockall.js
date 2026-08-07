const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  name: 'lockall',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to lock channels.');
    }

    const everyone = message.guild.roles.everyone;
    const textChannels = message.guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildText
    );

    let count = 0;
    for (const channel of textChannels.values()) {
      try {
        await channel.permissionOverwrites.edit(everyone, { SendMessages: false });
        count++;
      } catch (err) {
        console.error(`Failed to lock ${channel.name}:`, err);
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> Server Locked')
      .setDescription(
        `<:arrow:1514699753462566953> **Channels Locked** • ${count}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.channel.send({ embeds: [embed] });
  },
};
