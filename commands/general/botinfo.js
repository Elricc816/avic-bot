const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  name: "botinfo",

  async execute(message, args, client) {

    const uptime = process.uptime();

    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const mins = Math.floor((uptime % 3600) / 60);

    const users = client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );

    const channels = client.channels.cache.size;

    const guilds = client.guilds.cache.size;

    const commands = client.commands.size;

    const latency = client.ws.ping;

    const memory = (
      process.memoryUsage().heapUsed /
      1024 /
      1024
    ).toFixed(1);

    const embed = new EmbedBuilder()
      .setColor("#D3D3D3")
      .setAuthor({
        name: "Avic#5361",
        iconURL: client.user.displayAvatarURL()
      })
      .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
      .setDescription(`### It's AVIC <:devs:1514699513271685360>
      
      A powerful, multi-purpose Discord bot built for **server security, moderation, utility** and much more.
Trusted by **${guilds.toLocaleString()}** servers and **${users.toLocaleString()}** users worldwide.

Currently running with a websocket latency of **${latency}ms** and has been online for **${days}d ${hours}h ${mins}m**.

Managing **${channels.toLocaleString()}** channels across all servers with **${commands}** commands loaded.

Built with **Node.js ${process.version}** and **discord.js v14**.

Using **${memory} MB** of memory.

Read the **documentation** for detailed guides & commands, visit our **website** for updates, or join the **support server** for help.`
      )
      .setFooter({
        text: `Requested by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&scope=bot%20applications.commands"),

      new ButtonBuilder()
        .setLabel("Website")
        .setStyle(ButtonStyle.Link)
        .setURL("https://avicbot.vercel.app")
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Docs")
        .setStyle(ButtonStyle.Link)
        .setURL("https://avicbot.vercel.app/"),

      new ButtonBuilder()
        .setLabel("Support")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/HRE4N4zJHK")
    );return message.reply({
      embeds: [embed],
      components: [row1, row2]
    });
  }
};
