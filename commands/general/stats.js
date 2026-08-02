const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const discord = require("discord.js");

module.exports = {
    name: "stats",

    async execute(message, args, client) {

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const servers = client.guilds.cache.size;

        const users = client.guilds.cache.reduce(
            (total, guild) => total + guild.memberCount,
            0
        );

        const channels = client.channels.cache.size;

        const commands = client.commands.size;

        const ping = client.ws.ping;

        const ram = (
            process.memoryUsage().rss /
            1024 /
            1024
        ).toFixed(2);

        const node = process.version;

        const djs = discord.version;

        const shard = client.shard
            ? client.shard.ids[0]
            : 0;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("🟢 AVIC's Statistics")
            .setDescription(
`Comprehensive real-time overview of AVIC's operational status, resource usage, and shard distribution across the network.

The bot is currently serving **${users.toLocaleString()}** users across **${servers.toLocaleString()}** servers, managing a total of **${channels.toLocaleString()}** channels. It has been running continuously for **${uptimeString}** with a websocket latency of **${ping}ms**.

Running on **1** shard, this server is routed through **Shard ${shard}**. The bot is consuming **${ram} MB** of memory, powered by **Node.js ${node}** and **discord.js v${djs}**. A total of **${commands}** commands are loaded and operational.`
            );
embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

        embed.setFooter({
            text: `Requested by ${message.author.username} • ${new Date().toLocaleString()}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

        const row1 = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setLabel("Status")
                .setStyle(ButtonStyle.Link)
                .setURL("https://status.avicbot.xyz"),

            new ButtonBuilder()
                .setLabel("Website")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app")
        );

        const row2 = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setLabel("Docs")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/HRE4N4zJHK")
        );
      const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Status")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Website")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app")
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Docs")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/HRE4N4zJHK")
        );

        return message.reply({
            embeds: [embed],
            components: [row1, row2]
        });

    }
};
