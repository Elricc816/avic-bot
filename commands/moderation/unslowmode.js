const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unslowmode',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to remove slowmode.');
    }

    await message.channel.setRateLimitPerUser(0);

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Slowmode Removed')
      .setDescription(
        `<:arrow:1514699753462566953> **Channel** • ${message.channel}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.channel.send({ embeds: [embed] });
  },
};
