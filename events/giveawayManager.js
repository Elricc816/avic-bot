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
.setColor("#2fd6d6")
.setTitle("<:gwy3:1514705349859606548> Giveaway Ended <:gwy3:1514705349859606548>")
.setDescription(
`## <:gift:1514705355412865136> ${g.prize} <:gift:1514705355412865136>

<a:BlackDot:1514727923175657654> **Hosted by:** <@${g.hostId}>
<a:BlackDot:1514727923175657654> **Total participant(s):** ${g.entries.length}

<a:BlackDot:1514727923175657654> **Winner:**

${winners.length ? winners.map(x => `<@${x}>`).join("\n") : "No valid entries."}

Ended | <t:${Math.floor(Date.now()/1000)}:f>`
);

            const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId("giveaway_ended")
.setEmoji("<:timerr:1514699712681218094>")
.setLabel(`${g.entries.length}`)
.setDisabled(true)
.setStyle(ButtonStyle.Secondary)
);
            await msg.edit({
                embeds: [endedEmbed],
                components: [row]
            });

            if (winners.length) {
                channel.send(
                    `<a:giveaway:1514859685826793504> Congratulations ${winners.map(x => `<@${x}>`).join(", ")}! You won **${g.prize}**!`
                );
            }

        }

    }, 5000);

};
