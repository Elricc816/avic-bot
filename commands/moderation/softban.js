const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'softban',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to softban members.');
    }

    const target = message.mentions.members.first();
    if (!target) return message.reply('<:WarningIcon:1514708751385497721> Mention a user to softban.');

    if (!target.bannable) {
      return message.reply('<:WarningIcon:1514708751385497721> I can\'t softban this user (role too high or missing permissions).');
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const dmEmbed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> You have been softbanned')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n\n` +
        `You can rejoin the server, but your recent messages have been deleted.`
      );

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      // DMs closed — continue anyway
    }

    // Ban with 1 day of message deletion, then immediately unban
    await target.ban({ reason, deleteMessageSeconds: 60 * 60 * 24 });
    await message.guild.members.unban(target.id, 'Softban - auto unban');

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> Member Softbanned')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${target.user.tag}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
