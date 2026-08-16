const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = (client) => {

    async function checkGiveaways() {
        const all = await db.all();
        const giveaways = all.filter(entry => entry.id.startsWith("giveaway_"));

        for (const entry of giveaways) {
            const giveaway = entry.value;

            if (giveaway.ended) continue;
            if (Date.now() < giveaway.endTime) continue;

            try {
                const channel = await client.channels.fetch(giveaway.channelId).catch(() => null);
                if (!channel) {
                    await db.set(`${entry.id}.ended`, true);
                    continue;
                }

                const giveawayMessage = await channel.messages.fetch(giveaway.messageId).catch(() => null);
                if (!giveawayMessage) {
                    await db.set(`${entry.id}.ended`, true);
                    continue;
                }

                const reaction = giveawayMessage.reactions.cache.get("booper:1535203898485112862");
                const users = reaction ? await reaction.users.fetch() : new Map();
                const entrants = [...users.values()].filter(u => !u.bot);

                await db.set(`${entry.id}.ended`, true);

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
                    continue;
                }

                const shuffled = entrants.sort(() => 0.5 - Math.random());
                const winners = shuffled.slice(0, giveaway.winnerCount);

                await db.set(`${entry.id}.winners`, winners.map(w => w.id));

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

            } catch (err) {
                console.error(`Failed to auto-end giveaway ${entry.id}:`, err);
            }
        }
    }

    setInterval(checkGiveaways, 15000);
    checkGiveaways();
};
