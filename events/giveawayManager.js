const { QuickDB } = require("quick.db");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const db = new QuickDB();

module.exports = (client) => {

    setInterval(async () => {

        const data = await db.all();

        const giveaways = data.filter(
            x => x.id.startsWith("giveaway_")
        );

        for (const giveaway of giveaways) {

            const g = giveaway.value;

            if (g.ended) continue;

            if (Date.now() < g.ends) continue;

            g.ended = true;

            await db.set(giveaway.id, g);

            const channel = await client.channels
                .fetch(g.channel)
                .catch(() => null);

            if (!channel) continue;

            const msg = await channel.messages
                .fetch(g.message)
                .catch(() => null);

            if (!msg) continue;

            const disabled = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("giveaway_ended")
                        .setLabel("Giveaway Ended")
                        .setEmoji("<:power:1520340458767646821>")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                );

            // Winner picking will be added next
        }

    }, 5000);

};
