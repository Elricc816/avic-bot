const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'mute',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to mute members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('<:WarningIcon:1514708751385497721> Mention a user to mute.');

    if (!target.moderatable) {
      return message.reply('<:WarningIcon:1514708751385497721> I can\'t mute this user (role too high or missing permissions).');
    }

    const durationArg = args[1];
    const duration = durationArg ? ms(durationArg) : ms('10m');

    if (!duration || duration > ms('28d')) {
      return message.reply('<:WarningIcon:1514708751385497721> Invalid duration (e.g. 10m, 1h, 1d) — max 28 days.');
    }

    const reason = args.slice(2).join(' ') || 'No reason provided';

    const dmEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> You have been muted')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}\n` +
        `<:arrow:1514699753462566953> **Duration** • ${durationArg || '10m'}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}`
      );

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      // DMs closed — continue anyway
    }

    await target.timeout(duration, reason);

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Member Muted')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${target.user.tag}\n` +
        `<:arrow:1514699753462566953> **Duration** • ${durationArg || '10m'}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
