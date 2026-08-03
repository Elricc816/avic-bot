const { QuickDB } = require("quick.db");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const db = new QuickDB();

module.exports = (client) => {

    setInterval(async () => {

        const data = await db.all();

        const giveaways = data.filter(x =>
            x.id.startsWith("giveaway_")
        );

        for (const giveaway of giveaways) {

            const g = giveaway.value;

            if (g.ended) continue;

            if (Date.now() < g.endTime) continue;

            g.ended = true;

            await db.set(giveaway.id, g);

            const channel = await client.channels.fetch(g.channelId).catch(() => null);

            if (!channel) continue;

            const msg = await channel.messages.fetch(g.messageId).catch(() => null);

            if (!msg) continue;

            const winners = [];

            const entries = [...g.entries];

            while (
                winners.length < g.winners &&
                entries.length > 0
            ) {

                const random = Math.floor(
                    Math.random() * entries.length
                );

                winners.push(entries[random]);

                entries.splice(random, 1);
            }

            const endedEmbed = new EmbedBuilder()
                .setColor("#D3D3D3")
                .setTitle("🎉 Giveaway Ended")
                .setDescription(
`## 🎁 ${g.prize}

👑 Host: <@${g.hostId}>

🏆 Winner(s):
${winners.length ? winners.map(x => `<@${x}>`).join("\n") : "No valid entries."}`
                );

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("giveaway_ended")
                        .setLabel("Giveaway Ended")
                        .setEmoji("🔒")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                );

            await msg.edit({
                embeds: [endedEmbed],
                components: [row]
            });

            if (winners.length) {
                channel.send(
                    `🎉 Congratulations ${winners.map(x => `<@${x}>`).join(", ")}! You won **${g.prize}**!`
                );
            }

        }

    }, 5000);

};
