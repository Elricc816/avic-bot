const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const cooldown = new Set();

// TODO: replace these two with real Discord CDN links —
// send each image in a channel, right-click (or long-press) it,
// tap "Copy Link", and paste the URL here.
const BANNER_URL = 'https://cdn.discordapp.com/attachments/1432767818075738242/1543490165790736565/banner.jpg?ex=6a950ebc&is=6a93bd3c&hm=8edf0d2eca004f4a4c25c46e899946134302e6d06b9ed55411ef82c9fbb03864&';
const ICON_URL = 'https://cdn.discordapp.com/attachments/1432767818075738242/1543490396494233680/icon.jpg?ex=6a950ef3&is=6a93bd73&hm=b22a32ec6cfd186e86ff52e286889a080b0e21a893053a13fa866e696906c69d&';

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

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setImage(BANNER_URL)
      .setThumbnail(ICON_URL)
      .setTitle('Fare help')
      .setDescription(
        'A powerful, multi-purpose Discord bot built for **server security**, **moderation**, **high-fidelity utility tools** and much more.'
      )
      .addFields(
        {
          name: '<:shield:1514699900225323108> Security',
          value: '`antinuke` `mainrole` `panicmode`',
        },
        {
          name: '<:admin:1514699907103985664> Automod',
          value: 'Coming soon',
        },
        {
          name: '<:mod1:1514699913919991839> Moderation',
          value: '`ban` `unban` `kick` `mute` `unmute` `purge` `pb`',
        },
        {
          name: '<:member1:1514699741282304061> General',
          value: '`ping` `help` `botinfo` `userinfo`',
        },
        {
          name: '<:brush:1514699282152685759> Embed System',
          value: 'Coming soon',
        },
        {
          name: '<:server:1514699921914331136> Utility',
          value: 'Coming soon',
        },
        {
          name: '<:dnd:1514699559094190220> Autoresponders',
          value: 'Coming soon',
        },
        {
          name: '<:timerr:1514699712681218094> Timer',
          value: 'Coming soon',
        },
        {
          name: '<:gwy2:1514699519244243107> Giveaway',
          value: '`gcreate` `gend` `greroll` `glist` `gdelete`',
        },
        {
          name: '<:general:1514699942181081261> Music',
          value: 'Coming soon',
        },
        {
          name: '<:bug:1514699948480790608> Fun Commands',
          value: 'Coming soon',
        },
        {
          name: '<:pin:1514699935264673902> Sticky',
          value: 'Coming soon',
        },
        {
          name: '<:ticket:1514699959847616573> Tickets',
          value: 'Coming soon',
        },
        {
          name: '<:CodeXFolder:1514708745756872845> Logging',
          value: 'Coming soon',
        },
        {
          name: '<:bot1:1514699532686852227> Bot Settings',
          value: '`botbanner` `boticon`',
        },
        {
          name: '<:vip:1514699727072133233> AI',
          value: 'Coming soon',
        },
        {
          name: '<:cart:1514699759250575472> Premium',
          value: 'Coming soon',
        }
      )
      .addFields({
        name: '\u200b',
        value:
          `<:info:1514699288674828310> Select a category from the dropdown menu below to view available commands.\n\n` +
          `**<:link:1514699706788221120> Links**\n` +
          `[Invite me](https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&integration_type=0&scope=bot+applications.commands) <:dot:1514706694079254730> [Support](https://discord.gg/ZnTDxjc5Zb) <:devv:1514699301144756234>`,
      })
      .setFooter({
        text: `Use ,help <command> for details on a specific command`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('Select a category')
          .addOptions(
            {
              label: 'Security',
              description: 'View security commands',
              value: 'security',
              emoji: { id: '1514699900225323108' }
            },
            {
              label: 'Automod',
              description: 'View automod commands',
              value: 'automod',
              emoji: { id: '1514699907103985664' }
            },
            {
              label: 'Moderation',
              description: 'View moderation commands',
              value: 'moderation',
              emoji: { id: '1514699913919991839' }
            }
          )
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
      embeds: [embed],
      components: [row]
    });

    const collector = loadingMsg.createMessageComponentCollector({
      filter: i => i.customId === 'help_menu',
      time: 300000
    });

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

      if (interaction.isStringSelectMenu() && interaction.values[0] === 'security') {

        const securityEmbed = new EmbedBuilder()
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

-# Powered By Elric`
          )
          .setFooter({
            text: `Executed by ${message.author.username}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
          })
          .setTimestamp();

        return interaction.reply({
          embeds: [securityEmbed],
          ephemeral: true
        });
      }

      if (interaction.isStringSelectMenu() && interaction.values[0] === 'moderation') {

        const modEmbed = new EmbedBuilder()
          .setColor('#D3D3D3')
          .setTitle('<:mod1:1514699913919991839> Moderation Commands')
          .setDescription(
            '` ,ban `\n' +
            '` ,unban `\n' +
            '` ,kick `\n' +
            '` ,mute `\n' +
            '` ,unmute `\n' +
            '` ,purge `\n' +
            '` ,pb `'
          );

        return interaction.reply({
          embeds: [modEmbed],
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
