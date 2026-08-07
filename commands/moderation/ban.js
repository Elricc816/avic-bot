const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ban',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to ban members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('<:WarningIcon:1514708751385497721> Mention a user to ban.');

    if (!target.bannable) {
      return message.reply('<:WarningIcon:1514708751385497721> I can\'t ban this user (role too high or missing permissions).');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const dmEmbed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> You have been banned')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}`
      );

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      // User has DMs closed — ignore and continue with the ban
    }

    await target.ban({ reason });

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> Member Banned')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${target.user.tag}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
