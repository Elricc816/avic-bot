const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unhide',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to unhide channels.');
    }

    const channel = message.mentions.channels.first() || message.channel;
    const everyone = message.guild.roles.everyone;

    await channel.permissionOverwrites.edit(everyone, { ViewChannel: null });

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Channel Unhidden')
      .setDescription(
        `<:arrow:1514699753462566953> **Channel** • ${channel}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    channel.send({ embeds: [embed] });
  },
};
