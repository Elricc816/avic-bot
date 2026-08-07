const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  name: 'clone',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to clone channels.');
    }

    const channel = message.mentions.channels.first() || message.channel;

    if (channel.type !== ChannelType.GuildText) {
      return message.reply('<:WarningIcon:1514708751385497721> I can only clone text channels.');
    }

    const position = channel.position;

    const cloned = await channel.clone();
    await cloned.setPosition(position);
    await channel.delete();

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Channel Cloned')
      .setDescription(
        `<:arrow:1514699753462566953> **Channel** • ${cloned}\n` +
        `<:info:1514699288674828310> Old channel deleted, new one created with the same settings.\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    cloned.send({ embeds: [embed] });
  },
};
