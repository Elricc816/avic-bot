const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
    name: "gend",
    aliases: ["giveawayend"],

    async execute(message, args) {

        if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> You need **Manage Server** permission to end giveaways.")
                ]
            });
        }

        const messageId = args[0];

        if (!messageId) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#D3D3D3")
                        .setTitle("<:gift:1514705355412865136> Giveaway Usage")
                        .setDescription("`,gend <message id>`")
                ]
            });
        }

        const giveaway = await db.get(`giveaway_${messageId}`);

        if (!giveaway || giveaway.ended) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> No active giveaway found with that message ID.")
                ]
            });
        }

        const channel = await message.guild.channels.fetch(giveaway.channelId).catch(() => null);
        if (!channel) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> Couldn't find the giveaway channel.")
                ]
            });
        }

        const giveawayMessage = await channel.messages.fetch(giveaway.messageId).catch(() => null);
        if (!giveawayMessage) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> Couldn't find the giveaway message.")
                ]
            });
        }

        const reaction = giveawayMessage.reactions.cache.get("booper:1535203898485112862");
        const users = reaction ? await reaction.users.fetch() : new Map();
        const entrants = [...users.values()].filter(u => !u.bot);

        await db.set(`giveaway_${messageId}.ended`, true);

        if (entrants.length === 0) {
            const endedEmbed = new EmbedBuilder()
                .setColor("#FF7F7F")
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
                .setTitle(`<a:giftt:1535203788913119272> ${giveaway.prize} <a:giftt:1535203788913119272>`)
                .setDescription(
`<a:BlackDot:1514727923175657654> **Hosted by:** <@${giveaway.hostId}>
<a:BlackDot:1514727923175657654> **Winner(s):** No valid entries

<a:BlackDot:1514727923175657654> This giveaway has ended.`
                )
                .setFooter({ text: "Developed by Elric" })
                .setTimestamp();

            await giveawayMessage.edit({
                content: "<a:gwyy:1534265842248847422> **Giveaway Ended** <a:gwyy:1534265842248847422>",
                embeds: [endedEmbed]
            });

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#D3D3D3")
                        .setDescription("<a:BlackDot:1514727923175657654> Giveaway ended — no valid entries.")
                ]
            });
        }

        const shuffled = entrants.sort(() => 0.5 - Math.random());
        const winners = shuffled.slice(0, giveaway.winnerCount);

        await db.set(`giveaway_${messageId}.winners`, winners.map(w => w.id));

        const endedEmbed = new EmbedBuilder()
            .setColor("#2FD6D6")
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTitle(`<a:giftt:1535203788913119272> ${giveaway.prize} <a:giftt:1535203788913119272>`)
            .setDescription(
`<a:BlackDot:1514727923175657654> **Hosted by:** <@${giveaway.hostId}>
<a:BlackDot:1514727923175657654> **Winner(s):** ${winners.map(w => `${w}`).join(", ")}

<a:BlackDot:1514727923175657654> This giveaway has ended.`
            )
            .setFooter({ text: "Developed by Elric" })
            .setTimestamp();

        await giveawayMessage.edit({
            content: "<a:gwyy:1534265842248847422> **Giveaway Ended** <a:gwyy:1534265842248847422>",
            embeds: [endedEmbed]
        });

        await channel.send({
            content: `<a:gwyy:1534265842248847422> Congratulations ${winners.map(w => `${w}`).join(", ")}! You won **${giveaway.prize}**!`
        });

        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setDescription("<a:BlackDot:1514727923175657654> Giveaway ended successfully.")
            ]
        });
    }
};
