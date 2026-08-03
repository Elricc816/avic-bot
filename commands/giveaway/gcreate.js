const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

const { QuickDB } = require("quick.db");
const ms = require("ms");

const db = new QuickDB();

module.exports = {
    name: "gcreate",

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
                        .setTitle("🎉 Giveaway Usage")
                        .setDescription(
                            "` ,gcreate <duration> <winners> <prize> `\n\n" +
                            "**Example:**\n" +
                            "`,gcreate 1h 1 Discord Nitro`"
                        )
                ]
            });
        }

        const duration = args[0];
        const winners = parseInt(args[1]);
        const prize = args.slice(2).join(" ");

        if (!ms(duration)) {
            return message.reply("❌ Invalid duration.");
        }

        if (isNaN(winners) || winners < 1) {
            return message.reply("❌ Winners must be at least 1.");
        }

        const endTime = Date.now() + ms(duration);

              const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("🎉 Giveaway")
            .setDescription(
`## 🎁 ${prize}

> 👑 **Host:** ${message.author}
> 👥 **Winners:** **${winners}**
> 🎟️ **Entries:** **0**
> ⏰ **Ends:** <t:${Math.floor(endTime / 1000)}:R>

Click the **🎉 Join Giveaway** button below to enter.

Good luck everyone! 🍀`
            )
            .setFooter({
                text: `AVIC Giveaway System`,
                iconURL: message.client.user.displayAvatarURL()
            })
            .setTimestamp(endTime);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("giveaway_join")
                    .setEmoji("🎉")
                    .setLabel("Join Giveaway")
                    .setStyle(ButtonStyle.Success)
            );

        const giveawayMessage = await message.channel.send({
            embeds: [embed],
            components: [row]
        });

        await db.set(`giveaway_${giveawayMessage.id}`, {
            guildId: message.guild.id,
            channelId: message.channel.id,
            messageId: giveawayMessage.id,
            hostId: message.author.id,
            prize,
            winners,
            endTime,
            ended: false,
            entries: []
        });

              return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#57F287")
                    .setDescription(
                        `<:Tick:1514714190500335677> Giveaway created successfully!\n\n` +
                        `> 🎁 **Prize:** ${prize}\n` +
                        `> 👥 **Winners:** ${winners}\n` +
                        `> ⏰ **Ends:** <t:${Math.floor(endTime / 1000)}:R>\n` +
                        `> 📍 **Message:** ${giveawayMessage.url}`
                    )
            ]
        });

    }
};
