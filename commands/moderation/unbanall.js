const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'unbanall',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to unban members.');
    }

    const bans = await message.guild.bans.fetch();

    if (bans.size === 0) {
      return message.reply('<:WarningIcon:1514708751385497721> There are no banned users.');
    }

    let count = 0;
    for (const ban of bans.values()) {
      try {
        await message.guild.members.unban(ban.user.id, 'Mass unban');
        count++;

        // Try to DM — only works if bot already had a DM channel open with them
        const dmEmbed = new EmbedBuilder()
          .setColor('#D3D3D3')
          .setTitle('<:WarningIcon:1514708751385497721> You have been unbanned')
          .setDescription(`<:arrow:1514699753462566953> **Server** • ${message.guild.name}`);

        try {
          await ban.user.send({ embeds: [dmEmbed] });
        } catch (err) {
          // No open DM or DMs closed — ignore
        }
      } catch (err) {
        console.error(`Failed to unban ${ban.user.tag}:`, err);
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Mass Unban Complete')
      .setDescription(
        `<:arrow:1514699753462566953> **Users Unbanned** • ${count}\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    message.channel.send({ embeds: [embed] });
  },
};
