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

        const reaction = giveawayMessage.reactions.cache.get("1535203898485112862");
        const users = reaction ? await reaction.users.fetch() : new Map();
        const entrants = [...users.values()].filter(u => !u.bot);

        await db.set(`giveaway_${messageId}.ended`, true);

        const originalEmbed = giveawayMessage.embeds[0];

        if (entrants.length === 0) {
            const endedEmbed = EmbedBuilder.from(originalEmbed)
                .setDescription(
`<a:BlackDot:1514727923175657654> **Hosted by:** <@${giveaway.hostId}>
<a:BlackDot:1514727923175657654> **Winner(s):** ${giveaway.winnerCount}
<a:BlackDot:1514727923175657654> No valid entries — no winner could be selected.`
                );

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

        const endedEmbed = EmbedBuilder.from(originalEmbed)
            .setDescription(
`<a:BlackDot:1514727923175657654> **Hosted by:** <@${giveaway.hostId}>
<a:BlackDot:1514727923175657654> **Winner(s):** ${winners.map(w => `${w}`).join(", ")}
<a:BlackDot:1514727923175657654> Congratulations ${winners.map(w => `${w}`).join(", ")}! You won **${giveaway.prize}**!`
            );

        await giveawayMessage.edit({
            content: "<a:gwyy:1534265842248847422> **Giveaway Ended** <a:gwyy:1534265842248847422>",
            embeds: [endedEmbed]
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
