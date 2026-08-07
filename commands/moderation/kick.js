const { PermissionsBitField, EmbedBuilder } = require('discord.js');

function errorEmbed(text) {
  return new EmbedBuilder()
    .setColor('#FAA61A')
    .setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

module.exports = {
  name: 'kick',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return message.reply({ embeds: [errorEmbed("You don't have permission to kick members.")] });
    }

    const target = message.mentions.members.first();
    if (!target) {
      return message.reply({ embeds: [errorEmbed('Mention a user to kick.')] });
    }

    if (!target.kickable) {
      return message.reply({ embeds: [errorEmbed("I can't kick this user (role too high or missing permissions).")] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    const dmEmbed = new EmbedBuilder()
      .setColor('#FAA61A')
      .setTitle('<:WarningIcon:1514708751385497721> You have been kicked')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n\n` +
        `You are free to rejoin the server.`
      );

    try {
      await target.send({ embeds: [dmEmbed] });
    } catch (err) {
      // DMs closed — continue anyway
    }

    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor('#FAA61A')
      .setTitle('<:WarningIcon:1514708751385497721> Member Kicked')
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${target.user.tag}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
