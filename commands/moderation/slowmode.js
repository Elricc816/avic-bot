 const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'slowmode',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to set slowmode.');
    }

    const input = args[0];
    if (!input) return message.reply('<:WarningIcon:1514708751385497721> Give a duration (e.g. 5s, 10s, 1m). Max is 6h.');

    let seconds;
    if (/^\d+$/.test(input)) {
      // Plain number = treat as seconds
      seconds = parseInt(input, 10);
    } else {
      const parsed = ms(input);
      if (!parsed) return message.reply('<:WarningIcon:1514708751385497721> Invalid duration (e.g. 5s, 10s, 1m).');
      seconds = Math.floor(parsed / 1000);
    }

    if (seconds < 0 || seconds > 21600) {
      return message.reply('<:WarningIcon:1514708751385497721> Slowmode must be between 0s and 6h.');
    }

    await message.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Slowmode Set')
      .setDescription(
        `<:arrow:1514699753462566953> **Channel** • ${message.channel}\n` +
        `<:arrow:1514699753462566953> **Delay** • ${seconds}s\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.channel.send({ embeds: [embed] });
  },
};
