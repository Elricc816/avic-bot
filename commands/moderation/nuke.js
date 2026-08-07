const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  name: 'nuke',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply('<:WarningIcon:1514708751385497721> You don\'t have permission to nuke channels.');
    }

    const channel = message.mentions.channels.first() || message.channel;

    if (channel.type !== ChannelType.GuildText) {
      return message.reply('<:WarningIcon:1514708751385497721> I can only nuke text channels.');
    }

    const position = channel.position;

    const cloned = await channel.clone();
    await cloned.setPosition(position);
    await channel.delete();

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> Channel Nuked')
      .setDescription(
        `<:arrow:1514699753462566953> This channel has been nuked — all previous messages are gone.\n` +
        `<:arrow:1514699753462566953> **Moderator** • ${message.author.tag}`
      );

    cloned.send({ embeds: [embed] });
  },
};
