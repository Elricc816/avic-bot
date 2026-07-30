const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const cooldown = new Set();

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

    const heartbeat = Date.now() - message.createdTimestamp;
    const api = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor('#808080')
      .setDescription(
`### Hey , This is **Avic**

<:white_arrow:1514714190231769219> A powerful, multi-purpose Discord bot built for **server security**, **moderation**, **high-fidelity utility tools** and much more.

<a:BlackDot:1514727923175657654> **Current Prefix:** \`,\`
<a:BlackDot:1514727923175657654> **Use \`,help <category>\` to view commands.**

**<:rocket:1514699262527541490> Quick Stats -
          <:arrow:1514699753462566953> Heartbeat: ${heartbeat} ms
          <:arrow:1514699753462566953> API: ${api} ms
          <:arrow:1514699753462566953> Commands: ${client.commands.size}**

> **<:shield:1514699900225323108>  \`»\` Security**
> **<:admin:1514699907103985664>  \`»\` Automod**
> **<:mod1:1514699913919991839>  \`»\` Moderation**
> **<:member1:1514699741282304061>  \`»\` General**
> **<:brush:1514699282152685759>  \`»\` Embed System**
> **<:server:1514699921914331136>  \`»\` Utility**
> **<:dnd:1514699559094190220>  \`»\` Autoresponders**
> **<:timerr:1514699712681218094>  \`»\` Timer**
> **<:gwy2:1514699519244243107>  \`»\` Giveaway**
> **<:general:1514699942181081261>  \`»\` Music**
> **<:bug:1514699948480790608>  \`»\` Fun Commands**
> **<:pin:1514699935264673902>  \`»\` Sticky**
> **<a:loading_Google:1514727933183524964>  \`»\` Voice Commands**
> **<:ticket:1514699959847616573>  \`»\` Tickets**
> **<:CodeXFolder:1514708745756872845>  \`»\` Logging**
> **<:hat:1514699954264998041> \`»\` Voice Master**
> **<:bot1:1514699532686852227>  \`»\` Bot Settings**
> **<:visual:1514699307754721491>  \`»\` Invite Tracker**
> **<:vip:1514699727072133233>  \`»\` AI**
> **<:cart:1514699759250575472>  \`»\` Premium**

<:white_arrow:1514714190231769219> Select a category from the dropdown menu below to view available commands.

**<:info:1514699288674828310>  __Pro Tip__**
Upgrade to Avic Premium for exclusive features ! <:diamond:1514699495768592635>

**<:link:1514699706788221120>  __Links__**
[Invite me](https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&integration_type=0&scope=bot+applications.commands) <:dot:1514706694079254730> [Support](https://discord.gg/ZnTDxjc5Zb) <:devv:1514699301144756234>

-# Developed by <@1306606920836055043> <:dev:1514699929199706143>
-# <:heartt:1514699719400755432> Thanks For Using Avic!`
)

      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setImage('https://cdn.discordapp.com/attachments/1525384165426598030/1532413355837620377/Screenshot_20260730-204448_Gallery.jpg?ex=6a6cc2a6&is=6a6b7126&hm=7507abf741eae1e3515bf709f5113ac8d65b8dbbfce6bad7c22b284e4ece01b3&')

      .setFooter({
        text: `Executed by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })

      .setTimestamp();

    const row = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('Select a category')
      .addOptions({
  label: 'Security',
  description: 'View security commands',
  value: 'security',
  emoji: {
    id: '1514699900225323108'
  }
},
{
  label: 'Automod',
  description: 'View automod commands',
  value: 'automod',
  emoji: {
    id: '1514699907103985664'
  }
},
{
  label: 'Moderation',
  description: 'View moderation commands',
  value: 'moderation',
  emoji: {
    id: '1514699913919991839'
  }
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
    .setColor('#d3d3d3')
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
    .setColor('#D3D3D3')
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
      .setColor('#d3d3d3')
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

