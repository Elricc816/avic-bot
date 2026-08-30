const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const cooldown = new Set();

// TODO: replace with permanent imgur (or GitHub raw) links —
// the current Discord CDN links expire.
const BANNER_URL = 'https://cdn.discordapp.com/attachments/1535172200951316500/1543492999626104852/banner.jpg?ex=6a95115f&is=6a93bfdf&hm=6a1c42a3b2edb9bcbd6ec1cf79ef42f58f75756dc159206c65465a18a662f668&';
const ICON_URL = 'https://cdn.discordapp.com/attachments/1535172200951316500/1543492889475153961/icon.jpg?ex=6a951145&is=6a93bfc5&hm=9c118bc6b4dc4b177ad0665531a2bd975511f8b53015c5b08cd443ea941195dd&';

const OWNER_ID = '1530872106399567941';

// TODO: replace with your real support server invite and website URL
const SUPPORT_URL = 'https://discord.gg/ZnTDxjc5Zb';
const WEBSITE_URL = 'https://your-fare-website.com';

module.exports = {
  name: "help",
  async execute(message, args, client) {

    if (cooldown.has(message.author.id)) {

      const cooldownMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF7F7F')
            .setDescription(
`<:WarningIcon:1514708751385497721> You are under cooldown to this command!

<:arrow:1514699753462566953> Cooldown ~ \`5s\``
            )
        ]
      });

      setTimeout(() => {
        cooldownMsg.delete().catch(() => {});
      }, 2000);

      return;
    }

    cooldown.add(message.author.id);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, 5000);

    const bannerEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setImage(BANNER_URL);

    const infoEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setThumbnail(ICON_URL)
      .setTitle('Fare Help')
      .setDescription(
        '-# Experience the ultimate Discord bot designed for seamless management and community engagement.'
      )
      .addFields({
        name: ' ‎',
        value: `<:slash:1514699274917511248> **Prefix:** \`,\`\n<:dev:1514699929199706143> **Commands:** \`${client.commands.size}\`\n<:general:1514699942181081261> **Modules:** \`19\`\n<:crown:1514699539657920592> **Bot Owner:** <@${OWNER_ID}>\n\n-# **Thanks for using Fare!**`,
      })
      .setFooter({
        text: `Command Executed by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    const selectRow = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('⤷Select a module to see')
          .addOptions(
            { label: 'General', description: 'View general commands', value: 'general', emoji: { id: '1514699741282304061' } },
            { label: 'Security', description: 'View security commands', value: 'security', emoji: { id: '1514699900225323108' } },
            { label: 'Automod', description: 'View automod commands', value: 'automod', emoji: { id: '1514699907103985664' } },
            { label: 'Moderation', description: 'View moderation commands', value: 'moderation', emoji: { id: '1514699913919991839' } },
            { label: 'Embed System', description: 'View embed commands', value: 'embedsystem', emoji: { id: '1514699282152685759' } },
            { label: 'Utility', description: 'View utility commands', value: 'utility', emoji: { id: '1514699921914331136' } },
            { label: 'Autoresponders', description: 'View autoresponder commands', value: 'autoresponders', emoji: { id: '1514699559094190220' } },
            { label: 'Timer', description: 'View timer commands', value: 'timer', emoji: { id: '1514699712681218094' } },
            { label: 'Giveaway', description: 'View giveaway commands', value: 'giveaway', emoji: { id: '1514705355412865136' } },
            { label: 'Music', description: 'View music commands', value: 'music', emoji: { id: '1514699942181081261' } },
            { label: 'Fun Commands', description: 'View fun commands', value: 'funcommands', emoji: { id: '1514699948480790608' } },
            { label: 'Sticky', description: 'View sticky commands', value: 'sticky', emoji: { id: '1514699935264673902' } },
            { label: 'Tickets', description: 'View ticket commands', value: 'tickets', emoji: { id: '1514699959847616573' } },
            { label: 'Logging', description: 'View logging commands', value: 'logging', emoji: { id: '1514708745756872845' } },
            { label: 'Voice Master', description: 'View voice master commands', value: 'voicemaster', emoji: { id: '1514699954264998041' } },
            { label: 'Bot Settings', description: 'View bot settings commands', value: 'botsettings', emoji: { id: '1514699532686852227' } },
            { label: 'Invite Tracker', description: 'View invite tracker commands', value: 'invitetracker', emoji: { id: '1514699307754721491' } },
            { label: 'AI', description: 'View AI commands', value: 'ai', emoji: { id: '1514699727072133233' } },
            { label: 'Premium', description: 'View premium commands', value: 'premium', emoji: { id: '1514699759250575472' } }
          )
      );

    const linkRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Support')
          .setStyle(ButtonStyle.Link)
          .setURL(https://discord.gg/46Vn9pdtPF),
        new ButtonBuilder()
          .setLabel('Website')
          .setStyle(ButtonStyle.Link)
          .setURL()
      );

    const loadingMsg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#D3D3D3')
          .setDescription(
            '<a:clockk:1514734530282520647> **Just A Moment.**'
          )
      ]
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await loadingMsg.edit({
      embeds: [bannerEmbed, infoEmbed],
      components: [selectRow, linkRow]
    });

    const collector = loadingMsg.createMessageComponentCollector({
      filter: i => i.customId === 'help_menu',
      time: 300000
    });

    const categoryEmbeds = {
      general: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:member1:1514699741282304061> General Commands')
        .setDescription('` ,ping `\n` ,help `\n` ,botinfo `\n` ,userinfo `'),

      security: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle('<:shield:1514699900225323108> Security Modules')
        .setDescription(
`### Security Modules

**__Antinuke__**
\`antinuke\` , \`antinuke whitelist\` , \`antinuke zplus\` , \`antinuke betrayalguard\` , \`antinuke logdisable\` , \`antinuke limit\` , \`antinuke disable\` , \`antinuke trustlimit\` , \`antinuke reset\` , \`antinuke wallon\` , \`antinuke autorecovery\` , \`antinuke enable\` , \`antinuke walloff\` , \`antinuke manage\` , \`antinuke wizard\` , \`antinuke logging\`

**__Mainrole__**
\`mainrole\` , \`mainrole reset\` , \`mainrole add\` , \`mainrole remove\` , \`mainrole show\`

**__Panicmode__**
\`panicmode\` , \`panicmode disable\` , \`panicmode enable\` , \`panicmode setup\` , \`panicmode reset\` , \`panicmode show\`

-# Powered By Fare`
        ),

      moderation: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:mod1:1514699913919991839> Moderation Commands')
        .setDescription(
          '` ,ban `\n` ,softban `\n` ,kick `\n` ,mute `\n` ,unmute `\n` ,unban `\n' +
          '` ,nick `\n` ,clone `\n` ,nuke `\n` ,hideall `\n` ,unhideall `\n' +
          '` ,lockall `\n` ,unlockall `\n` ,unbanall `\n` ,lock `\n` ,unlock `\n' +
          '` ,hide `\n` ,unhide `\n` ,slowmode `\n` ,unslowmode `\n` ,channel `'
        ),

      giveaway: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:gwy2:1514699519244243107> Giveaway Commands')
        .setDescription('` ,gcreate `\n` ,gend `\n` ,greroll `\n` ,glist `\n` ,gdelete `'),

      botsettings: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:bot1:1514699532686852227> Bot Settings Commands')
        .setDescription('` ,botbanner `\n` ,boticon `'),
    };

    collector.on('collect', async interaction => {

      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF7F7F')
              .setDescription(
                "<a:spider_cross:1514728338701287640> This help menu isn't yours."
              )
          ],
          ephemeral: true
        });
      }

      const selected = interaction.values[0];
      const categoryEmbed = categoryEmbeds[selected];

      if (categoryEmbed) {
        const replyEmbed = EmbedBuilder.from(categoryEmbed)
          .setFooter({
            text: `Executed by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
          .setTimestamp();

        return interaction.reply({
          embeds: [replyEmbed],
          ephemeral: true
        });
      }

      return interaction.reply({
        content: 'Category under development.',
        ephemeral: true
      });

    });
  }
};
