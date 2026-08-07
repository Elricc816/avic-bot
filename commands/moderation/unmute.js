const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unmute',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to unmute members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('<:WarningIcon:1514708751385497721> Mention a user to unmute.');

    if (!target.isCommunicationDisabled()) {
      return message.reply('<:WarningIcon:1514708751385497721> This user isn\'t muted.');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await target.timeout(null, reason);

    const dmEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> You have been unmuted')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}`
      );

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      // DMs closed — continue anyway
    }

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Member Unmuted')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${target.user.tag}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
