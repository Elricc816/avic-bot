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

                if (entrants.length === 0) {
                    const noWinnerEmbed = new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setTitle(`<a:giftt:1535203788913119272> ${giveaway.prize} <a:giftt:1535203788913119272>`)
                        .setDescription("<a:BlackDot:1514727923175657654> No valid entries — no winner could be selected.")
                        .setFooter({ text: "Developed by Elric" })
                        .setTimestamp();

                    await channel.send({ embeds: [noWinnerEmbed] });
                    continue;
                }

                const shuffled = entrants.sort(() => 0.5 - Math.random());
                const winners = shuffled.slice(0, giveaway.winnerCount);

                await db.set(`${entry.id}.winners`, winners.map(w => w.id));

                const winnerEmbed = new EmbedBuilder()
                    .setColor("#2FD6D6")
                    .setTitle(`<a:giftt:1535203788913119272> ${giveaway.prize} <a:giftt:1535203788913119272>`)
                    .setDescription(
`<a:BlackDot:1514727923175657654> **Winner(s):** ${winners.map(w => `${w}`).join(", ")}
<a:BlackDot:1514727923175657654> **Hosted by:** <@${giveaway.hostId}>`
                    )
                    .setFooter({ text: "Developed by Elric" })
                    .setTimestamp();

                await channel.send({
                    content: `<a:gwyy:1534265842248847422> Congratulations ${winners.map(w => `${w}`).join(", ")}! You won **${giveaway.prize}**!`,
                    embeds: [winnerEmbed]
                });

            } catch (err) {
                console.error(`Failed to auto-end giveaway ${entry.id}:`, err);
            }
        }
    }

    // Check every 15 seconds for giveaways that have expired
    setInterval(checkGiveaways, 15000);

    // Also run once immediately on startup, in case the bot was offline when a giveaway ended
    checkGiveaways();
};
