const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const cooldown = new Set();

const BANNER_URL = 'https://cdn.discordapp.com/attachments/1535172200951316500/1543492999626104852/banner.jpg?ex=6a95115f&is=6a93bfdf&hm=6a1c42a3b2edb9bcbd6ec1cf79ef42f58f75756dc159206c65465a18a662f668&';
const ICON_URL = 'https://cdn.discordapp.com/attachments/1535172200951316500/1543492889475153961/icon.jpg?ex=6a951145&is=6a93bfc5&hm=9c118bc6b4dc4b177ad0665531a2bd975511f8b53015c5b08cd443ea941195dd&';

const OWNER_ID = '1530872106399567941';

const SUPPORT_URL = 'https://discord.gg/46Vn9pdtPF';
const WEBSITE_URL = 'https://farebot.vercel.app/';

module.exports = {
  name: "help",

  async execute(message, args, client) {

    // =========================
    // COOLDOWN
    // =========================

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


    // =========================
    // BANNER EMBED
    // =========================

    const bannerEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setImage(BANNER_URL);


    // =========================
    // MAIN HELP EMBED
    // =========================

    const infoEmbed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setThumbnail(ICON_URL)
      .setTitle('Fare Help')
      .setDescription(
        '-# Experience the ultimate Discord bot designed for seamless management and community engagement.'
      )
      .addFields({
        name: ' ‎',
        value:
`<:slash:1514699274917511248> **Prefix:** \`,\`
<:dev:1514699929199706143> **Commands:** \`${client.commands.size}\`
<:general:1514699942181081261> **Modules:** \`19\`
<:crown:1514699539657920592> **Bot Owner:** <@${OWNER_ID}>

-# **Thanks for using [Fare](https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&integration_type=0&scope=bot+applications.commands)!**`
      })
      .setFooter({
        text: `Command Executed by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();


    // =========================
    // DROPDOWN
    // =========================

    const selectRow = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('⤷Select a module to see')
          .addOptions(

            {
              label: 'General',
              description: 'View general commands',
              value: 'general',
              emoji: { id: '1514699741282304061' }
            },

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
            },

            {
              label: 'Embed System',
              description: 'View embed commands',
              value: 'embedsystem',
              emoji: { id: '1514699282152685759' }
            },

            {
              label: 'Utility',
              description: 'View utility commands',
              value: 'utility',
              emoji: { id: '1514699921914331136' }
            },

            {
              label: 'Autoresponders',
              description: 'View autoresponder commands',
              value: 'autoresponders',
              emoji: { id: '1514699559094190220' }
            },

            {
              label: 'Timer',
              description: 'View timer commands',
              value: 'timer',
              emoji: { id: '1514699712681218094' }
            },

            {
              label: 'Giveaway',
              description: 'View giveaway commands',
              value: 'giveaway',
              emoji: { id: '1514705355412865136' }
            },

            {
              label: 'Music',
              description: 'View music commands',
              value: 'music',
              emoji: { id: '1514699942181081261' }
            },

            {
              label: 'Fun Commands',
              description: 'View fun commands',
              value: 'funcommands',
              emoji: { id: '1514699948480790608' }
            },

            {
              label: 'Sticky',
              description: 'View sticky commands',
              value: 'sticky',
              emoji: { id: '1514699935264673902' }
            },

            {
              label: 'Tickets',
              description: 'View ticket commands',
              value: 'tickets',
              emoji: { id: '1514699959847616573' }
            },

            {
              label: 'Logging',
              description: 'View logging commands',
              value: 'logging',
              emoji: { id: '1514708745756872845' }
            },

            {
              label: 'Voice Commands',
              description: 'View voice commands',
              value: 'voicecommands',
              emoji: { id: '1514699954264998041' }
            },

            {
              label: 'Bot Settings',
              description: 'View bot settings commands',
              value: 'botsettings',
              emoji: { id: '1514699532686852227' }
            },

            {
              label: 'Invite Tracker',
              description: 'View invite tracker commands',
              value: 'invitetracker',
              emoji: { id: '1514699307754721491' }
            },

            {
              label: 'AI',
              description: 'View AI commands',
              value: 'ai',
              emoji: { id: '1514699727072133233' }
            },

            {
              label: 'Premium',
              description: 'View premium commands',
              value: 'premium',
              emoji: { id: '1514699759250575472' }
            }

          )
      );


    // =========================
    // BUTTONS
    // =========================

    const linkRow = new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setLabel('Support')
          .setStyle(ButtonStyle.Link)
          .setURL(SUPPORT_URL),

        new ButtonBuilder()
          .setLabel('Website')
          .setStyle(ButtonStyle.Link)
          .setURL(WEBSITE_URL)

      );


    // =========================
    // LOADING MESSAGE
    // =========================

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


    // =========================
    // EDIT INTO HELP MENU
    // =========================

    await loadingMsg.edit({
      embeds: [bannerEmbed, infoEmbed],
      components: [selectRow, linkRow]
    });


    // =========================
    // COLLECTOR
    // =========================

    const collector = loadingMsg.createMessageComponentCollector({
      filter: i => i.customId === 'help_menu',
      time: 300000
    });


    // =========================
    // CATEGORY EMBEDS
    // =========================

    const categoryEmbeds = {

      // =========================
      // GENERAL
      // =========================

      general: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:member1:1514699741282304061> General')
        .setDescription(
`### General

**__Basic Commands__**
\`afk\` , \`membercount\` , \`boostcount\` , \`joinedat\` , \`serverinfo\` , \`userinfo\` , \`channelinfo\` , \`roleinfo\` , \`avatar\` , \`banner\` , \`servericon\` , \`serverbanner\` , \`profile\` , \`vote\`

**__Bot Information__**
\`invite\` , \`stats\` , \`botinfo\` , \`ping\` , \`uptime\` , \`users\` , \`documentation\` , \`website\` , \`variables\` , \`purchase\`

**__List Commands__**
\`list\` , \`list bots\` , \`list admins\` , \`list mods\` , \`list roles\` , \`list inrole\` , \`list early\` , \`list createdat\` , \`list bans\` , \`list invoice\` , \`list activedeveloper\` , \`list bughunters\` , \`list hypesquad\` , \`list pending\` , \`list channels\` , \`list users\` , \`list timeouts\` , \`list joinedat\` , \`list hasperms\` , \`list boosters\` , \`list emojis\``),


      // =========================
      // SECURITY
      // =========================

      security: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setTitle('<:shield:1514699900225323108> Security Modules')
        .setDescription(
`### Security Modules

**__Antinuke__**
\`antinuke\` , \`antinuke disable\` , \`antinuke logging\` , \`antinuke autorecovery\` , \`antinuke whitelist\` , \`antinuke manage\` , \`antinuke betrayalguard\` , \`antinuke enable\` , \`antinuke whitelisted\` , \`antinuke limit\` , \`antinuke owneronly\` , \`antinuke config\` , \`antinuke wizard\`

**__Mainrole__**
\`mainrole\` , \`mainrole remove\` , \`mainrole add\` , \`mainrole show\` , \`mainrole reset\`

**__Panicmode__**
\`panicmode\` , \`panicmode enable\` , \`panicmode reset\` , \`panicmode setup\` , \`panicmode deactivate\` , \`panicmode activate\` , \`panicmode disable\` , \`panicmode show\``),


      // =========================
      // AUTOMOD
      // =========================

      automod: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:shield:1514699907103985664> Automod')
        .setDescription(
`### Automod

**__Automod__**
\`automod\` , \`automod reset\` , \`automod settings\` , \`automod whitelist\` , \`automod disable\` , \`automod enable\` , \`automod wlshow\` , \`automod logging\` , \`automod manage\`

**__Word Blacklist__**
\`blword\` , \`blword reset\` , \`blword add\` , \`blword remove\` , \`blword show\` , \`blword guide\``),


      // =========================
      // MODERATION
      // =========================

      moderation: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:mod1:1514699913919991839> Moderation')
        .setDescription(
`### Moderation

**__Basic Commands__**
\`ban\` , \`softban\` , \`kick\` , \`mute\` , \`unmute\` , \`unban\` , \`nick\` , \`clone\` , \`nuke\` , \`hideall\` , \`unhideall\` , \`lockall\` , \`unlockall\` , \`unbanall\` , \`lock\` , \`unlock\` , \`hide\` , \`unhide\` , \`slowmode\` , \`unslowmode\` , \`channel\` , \`channel create\` , \`channel deleteafter\` , \`channel rename\` , \`channel transfer\` , \`channel delete\` , \`enlarge\` , \`steal\` , \`deleteemoji\` , \`deletesticker\` , \`snipe\`

**__Role Commands__**
\`role\` , \`role delete\` , \`role remove\` , \`role icon\` , \`role add\` , \`role bots\` , \`role colour\` , \`role taskcancel\` , \`role rename\` , \`role all\` , \`role create\` , \`role humans\` , \`rrole\` , \`rrole bots\` , \`rrole humans\` , \`rrole all\`

**__Purge Commands__**
\`clear\` , \`clear user\` , \`clear bots\` , \`clear image\` , \`clear reactions\` , \`clear contain\` , \`clear embed\` , \`clear all\` , \`clear emoji\` , \`clear files\` , \`clear mentions\` , \`purgeuser\` , \`purgebots\`

**__Quarantine Commands__**
\`quarantine\` , \`quarantine show\` , \`quarantine config\` , \`quarantine add\` , \`quarantine setup\` , \`quarantine remove\` , \`quarantine reset\` , \`unquarantine\``),


      // =========================
      // EMBED SYSTEM
      // =========================

      embedsystem: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:embed:1514699282152685759> Embed System')
        .setDescription(
`### Embed System

**__Embed Commands__**
\`embed\` , \`embed save\` , \`embed edit\` , \`embed create\` , \`embed import\` , \`embed export\` , \`embed send\` , \`embed rename\` , \`embed delete\` , \`embed show\`

**__Variable Command__**
\`variables [module] [category]\``),


      // =========================
      // UTILITY
      // =========================

      utility: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:utility:1514699921914331136> Utility')
        .setDescription(
`### Utility

**__Media Commands__**
\`media\` , \`media show\` , \`media add\` , \`media reset\` , \`media bypass\` , \`media bypass remove\` , \`media bypass add\` , \`media bypass reset\` , \`media bypass show\` , \`media remove\`

**__Reaction Role__**
\`reactionrole\` , \`reactionrole remove\` , \`reactionrole add\` , \`reactionrole format\` , \`reactionrole addmany\` , \`reactionrole maxroles\` , \`reactionrole edit\` , \`reactionrole clear\` , \`reactionrole show\` , \`reactionrole clone\` , \`reactionrole info\``),


      // =========================
      // AUTORESPONDERS
      // =========================

      autoresponders: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:autoresponder:1514699559094190220> Autoresponders')
        .setDescription(
`### Autoresponders

**__Auto Responders__**
\`autoresponder\` , \`autoresponder reset\` , \`autoresponder add\` , \`autoresponder editreply\` , \`autoresponder remove\` , \`autoresponder rename\` , \`autoresponder show\`

**__Auto Reactors__**
\`autoreact\` , \`autoreact reset\` , \`autoreact rename\` , \`autoreact remove\` , \`autoreact editemojis\` , \`autoreact add\` , \`autoreact show\``),


      // =========================
      // TIMER
      // =========================

      timer: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:timer:1514699712681218094> Timer')
        .setDescription(
`**__Timer__**
\`tstart\` , \`tpause\` , \`tresume\` , \`tend\``),


      // =========================
      // GIVEAWAY
      // =========================

      giveaway: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:gwy3:1514705349859606548> **__Giveaway__**')
        .setDescription(
`**__Giveaways__**
\`gcreate\` , \`gend\` , \`greroll\` , \`glist\` , \`gdelete\``),


      // =========================
      // MUSIC
      // =========================

      music: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:music:1514699942181081261> Music')
        .setDescription(
`### Music

**__Music Commands__**
\`play\` , \`nowplaying\` , \`autoplay\` , \`history\` , \`queue\` , \`lavalink\` , \`join\` , \`leave\` , \`forcefix\` , \`pause\` , \`resume\` , \`volume\` , \`replay\` , \`seek\` , \`forward\` , \`rewind\` , \`loop\` , \`247\` , \`shuffle\` , \`clearqueue\` , \`remove\` , \`move\` , \`skip\` , \`skipinto\` , \`lyrics\`

**__Filter Commands__**
\`filter\` , \`filter toggle\` , \`filter reset\``),


      // =========================
      // FUN
      // =========================

      funcommands: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:fun:1514699948480790608> Fun Commands')
        .setDescription(
`### Fun Commands

**__Fun Commands__**
\`airkiss\` , \`angrystare\` , \`bite\` , \`bonk\` , \`brofist\` , \`cuddle\` , \`handhold\` , \`hug\` , \`kiss\` , \`lick\` , \`nom\` , \`nuzzle\` , \`pat\` , \`pinch\` , \`poke\` , \`punch\` , \`slap\` , \`smack\` , \`stare\` , \`tickle\` , \`wave\` , \`bleh\` , \`blush\` , \`celebrate\` , \`cheers\` , \`clap\` , \`confused\` , \`cool\` , \`cry\` , \`dance\` , \`drool\` , \`evillaugh\` , \`facepalm\` , \`happy\` , \`headbang\` , \`huh\` , \`laugh\` , \`love\` , \`mad\` , \`nervous\` , \`no\` , \`nosebleed\` , \`nyah\` , \`peek\` , \`pout\` , \`roll\` , \`run\` , \`sad\` , \`scared\` , \`shout\` , \`shrug\` , \`shy\` , \`sigh\` , \`sing\` , \`sip\` , \`sleep\` , \`slowclap\` , \`smile\` , \`smug\` , \`sneeze\` , \`sorry\` , \`stop\` , \`surprised\` , \`sweat\` , \`thumbsup\` , \`tired\` , \`wink\` , \`yawn\` , \`yay\` , \`yes\`

\`eightball\` , \`reverse\` , \`mock\` , \`doublestruck\` , \`emojipasta\` , \`morse\` , \`biden\` , \`pikachu\` , \`oogway\` , \`drake\` , \`pooh\` , \`sadcat\` , \`factsmeme\` , \`unforgivable\` , \`caution\` , \`opinion\` , \`gun\` , \`drip\` , \`blur\` , \`invert\` , \`greyscale\` , \`advertise\` , \`mnm\` , \`pickup\` , \`showerthought\` , \`clown\` , \`jailed\` , \`wanted\` , \`pet\` , \`alert\` , \`supreme\` , \`whowouldwin\` , \`nokia\` , \`uncover\` , \`jokeoverhead\` , \`huerotate\` , \`quote\` , \`couldread\` , \`caption\` , \`colorify\` , \`cat\` , \`joke\` , \`fact\` , \`truth\` , \`dare\` , \`hack\` , \`token\``),


      // =========================
      // STICKY
      // =========================

      sticky: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:sticky:1514699935264673902> Sticky')
        .setDescription(
`**__Sticky Message__**
\`sticky\` , \`sticky show\` , \`sticky channel\` , \`sticky channel remove\` , \`sticky channel add\` , \`sticky remove\` , \`sticky bump\` , \`sticky reset\` , \`sticky add\``),


      // =========================
      // TICKETS
      // =========================

      tickets: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:ticket:1514699959847616573> Ticket Commands')
        .setDescription(
`### Ticket Commands

**__Ticket Commands__**
\`ticket\` , \`ticket transcript\` , \`ticket delete\` , \`ticket add\` , \`ticket greetmsg\` , \`ticket maxtickets\` , \`ticket remove\` , \`ticket autotranscript\` , \`ticket category\` , \`ticket logging\` , \`ticket rename\` , \`ticket reopen\` , \`ticket list\` , \`ticket support\` , \`ticket support reset\` , \`ticket support remove\` , \`ticket support show\` , \`ticket support add\` , \`ticket panel\` , \`ticket type\` , \`ticket type create\` , \`ticket type delete\` , \`ticket type edit\` , \`ticket close\``),


      // =========================
      // LOGGING
      // =========================

      logging: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:logging:1514708745756872845> Logging Commands')
        .setDescription(
`### Logging Commands

**__Logging Commands__**
\`logging\` , \`logging setup\` , \`logging setup channel\` , \`logging setup auto\` , \`logging setup clear\` , \`logging disable\` , \`logging enable\` , \`logging wizard\` , \`logging config\` , \`logging remove\` , \`logging ignore\` , \`logging ignore remove\` , \`logging ignore add\` , \`logging ignore voice\` , \`logging ignore embed\``),


      // =========================
      // VOICE COMMANDS
      // =========================

      voicecommands: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:voice:1514699954264998041> Voice Commands')
        .setDescription(
`### Voice Commands

**__Voice Commands__**
\`voice\` , \`voice unlock\` , \`voice mute\` , \`voice unprivate\` , \`voice undeafenall\` , \`voice deafen\` , \`voice muteall\` , \`voice moveall\` , \`voice pullall\` , \`voice private\` , \`voice deafenall\` , \`voice move\` , \`voice unmute\` , \`voice kick\` , \`voice lock\` , \`voice kickall\` , \`voice unmuteall\` , \`voice pull\` , \`voice undeafen\`

**__VC Roles__**
\`vcrole\` , \`vcrole set\` , \`vcrole disable\` , \`vcrole enable\` , \`vcrole show\` , \`vcrole reset\``),


      // =========================
      // BOT SETTINGS
      // =========================

      botsettings: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:bot1:1514699532686852227> Bot Settings')
        .setDescription(
`### Bot Settings

**__Profile__**
\`profile\` , \`bio\` , \`bio clear\` , \`bio set\` , \`badge\` , \`badge list\` , \`badge remove\` , \`badge add\`

**__Branding__**
\`customize\` , \`customize bio\` , \`customize avatar\` , \`customize reset\` , \`customize banner\` , \`customize nick\`

**__Prefix__**
\`prefix\` , \`prefix show\` , \`prefix set\` , \`prefix add\` , \`prefix reset\` , \`prefix remove\``),


      // =========================
      // INVITE TRACKER
      // =========================

      invitetracker: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:invite:1514699307754721491> Invite Tracker')
        .setDescription(
`### Invite Tracker

**__Invite Commands__**
\`invites\` , \`invite\` , \`inviter\` , \`invites leaderboard\` , \`invites info\`

**__Management__**
\`invites reset\` , \`invites add\` , \`invites remove\` , \`invites fake\`

**__Tracking__**
\`invites joins\` , \`invites leaves\`

**__Configuration__**
\`invites setup\` , \`invites config\``),


      // =========================
      // AI
      // =========================

      ai: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:ai:1514699727072133233> AI')
        .setDescription(
`**__AI__**
\`ai\``),


      // =========================
      // PREMIUM
      // =========================

      premium: new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:premium:1514699759250575472> Premium')
        .setDescription(
`**__Premium__**
\`premium\``)

    };


    // =========================
    // INTERACTION COLLECTOR
    // =========================

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
