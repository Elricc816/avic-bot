const { PermissionsBitField, EmbedBuilder } = require('discord.js');

function errorEmbed(text) {
  return new EmbedBuilder()
    .setColor('#D3D3D3')
    .setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

module.exports = {
  name: 'unban',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ embeds: [errorEmbed("You don't have permission to unban members.")] });
    }

    const userId = args[0];
    if (!userId) {
      return message.reply({ embeds: [errorEmbed('Provide the user ID to unban.')] });
    }

    const bans = await message.guild.bans.fetch();
    const bannedUser = bans.get(userId);

    if (!bannedUser) {
      return message.reply({ embeds: [errorEmbed("This user isn't banned.")] });
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';

    await message.guild.members.unban(userId, reason);

    const dmEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> You have been unbanned')
      .setDescription(
        `<:arrow:1514699753462566953> **Server** • ${message.guild.name}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n\n` +
        `You are free to rejoin the server.`
      );

    try {
      await bannedUser.user.send({ embeds: [dmEmbed] });
    } catch (err) {
      // No open DM channel or DMs closed — ignore
    }

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Member Unbanned')
      .setThumbnail(bannedUser.user.displayAvatarURL({ dynamic: true }))
      .setDescription(
        `<:arrow:1514699753462566953> **User** • ${bannedUser.user.tag}\n` +
        `<:info:1514699288674828310> **Reason** • ${reason}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.reply({ embeds: [embed] });
  },
};
