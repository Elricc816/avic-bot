const { EmbedBuilder } = require('discord.js');

const OWNER_ID = '1530872106399567941';

function errorEmbed(text) {
  return new EmbedBuilder()
    .setColor('#ED4245')
    .setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

module.exports = {
  name: 'botbanner',
  async execute(message, args, client) {
    if (message.author.id !== OWNER_ID) {
      return message.reply({ embeds: [errorEmbed("Only the bot owner can use this command.")] });
    }

    const url = args[0];
    if (!url) {
      return message.reply({ embeds: [errorEmbed('Provide an image URL to set as the banner.')] });
    }

    if (!/^https?:\/\/.+\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(url)) {
      return message.reply({ embeds: [errorEmbed('That doesn\'t look like a valid direct image URL (png/jpg/gif/webp).')] });
    }

    try {
      await client.user.setBanner(url);
    } catch (err) {
      console.error('BOT BANNER ERROR:', err);
      return message.reply({ embeds: [errorEmbed('Failed to set banner. Note: this requires bot-level Nitro boost perks — not all bots can have a banner.')] });
    }

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:WarningIcon:1514708751385497721> Bot Banner Updated')
      .setImage(url)
      .setDescription(`<:arrow:1514699753462566953> **Updated by** • ${message.author.tag}`);

    message.reply({ embeds: [embed] });
  },
};
