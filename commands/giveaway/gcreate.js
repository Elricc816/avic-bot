const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { QuickDB } = require("quick.db");
const ms = require("ms");

const db = new QuickDB();

module.exports = {
    name: "gcreate",
    aliases: ["giveawaycreate"],

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> You need **Manage Server** permission to create giveaways.")
                ]
            });
        }

        if (args.length < 3) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#D3D3D3")
                        .setTitle("<:gift:1514705368759144640> Giveaway Usage")
                        .setDescription(
"`,gcreate <duration> <winners> <prize>`"

**Example**
`,gcreate 1h 1 Discord Nitro`
                        )
                ]
            });
        }

        const duration = args[0];

        if (!ms(duration)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> Invalid duration.\nExample: `10m`, `1h`, `2d`, `1w`")
                ]
            });
        }

        const winnerCount = parseInt(args[1]);

        if (isNaN(winnerCount) || winnerCount < 1) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> Winners must be greater than **0**.")
                ]
            });
        }

        const prize = args.slice(2).join(" ");

        const endTimestamp = Math.floor(
            (Date.now() + ms(duration)) / 1000
        );

            const embed = new EmbedBuilder()
            .setColor("#2FD6D6")
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(
`## <:gwy3:1514705349859606548> ${prize} <:gwy3:1514705349859606548>

<a:BlackDot:1514727923175657654> **Hosted by:** ${message.author}
<a:BlackDot:1514727923175657654> **Winner(s):** ${winnerCount}
<a:BlackDot:1514727923175657654> **Ends:** <t:${endTimestamp}:F>

<a:BlackDot:1514727923175657654> React with **<a:giveaway:1514859685826793504>** below to participate.`
            )
            .setFooter({
                text: "Developed by Elric"
            })
            .setTimestamp();

        const giveawayMessage = await message.channel.send({
    content: "<a:Giveawaygift:1514859691170070609> Giveaway <a:Giveawaygift:1514859691170070609>",
    embeds: [embed]
});

       await giveawayMessage.react("<a:giveaway:1514859685826793504>");

        await db.set(`giveaway_${giveawayMessage.id}`, {
            guildId: message.guild.id,
            channelId: message.channel.id,
            messageId: giveawayMessage.id,
            hostId: message.author.id,
            prize: prize,
            winnerCount: winnerCount,
            endTime: Date.now() + ms(duration),
            ended: false
        });

            

    }
};
