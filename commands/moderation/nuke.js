const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function errorEmbed(text) {
  return new EmbedBuilder()
    .setColor('#ED4245')
    .setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

module.exports = {
  name: 'nuke',
  async execute(message, args, client) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return message.reply({ embeds: [errorEmbed("You don't have permission to nuke channels.")] });
    }

    const channel = message.mentions.channels.first() || message.channel;

    if (channel.type !== ChannelType.GuildText) {
      return message.reply({ embeds: [errorEmbed('I can only nuke text channels.')] });
    }

    const confirmEmbed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('<:WarningIcon:1514708751385497721> Confirm Nuke')
      .setDescription(
        `<:arrow:1514699753462566953> This will delete **all messages** in ${channel} by recreating it.\n` +
        `<:arrow:1514699753462566953> This action **cannot be undone**. Confirm?`
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('nuke_confirm').setLabel('Yes').setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId('nuke_cancel').setLabel('No').setStyle(ButtonStyle.Secondary)
    );

    const confirmMsg = await message.reply({ embeds: [confirmEmbed], components: [row] });

    const collector = confirmMsg.createMessageComponentCollector({ time: 15000, max: 1 });

    collector.on('collect', async (interaction) => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: "This isn't your confirmation to respond to.", ephemeral: true });
      }

      if (interaction.customId === 'nuke_cancel') {
        return interaction.update({
          embeds: [new EmbedBuilder().setColor('#D3D3D3').setDescription('<:WarningIcon:1514708751385497721> Nuke cancelled.')],
          components: [],
        });
      }

      await interaction.update({
        embeds: [new EmbedBuilder().setColor('#ED4245').setDescription('<:WarningIcon:1514708751385497721> Nuking channel...')],
        components: [],
      });

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
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        confirmMsg.edit({
          embeds: [new EmbedBuilder().setColor('#D3D3D3').setDescription('<:WarningIcon:1514708751385497721> Confirmation timed out.')],
          components: [],
        }).catch(() => {});
      }
    });
  },
};
