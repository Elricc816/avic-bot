const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "website",
    aliases: ["web"],

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: "Fare Website",
                iconURL: message.client.user.displayAvatarURL()
            })
            .setThumbnail(message.client.user.displayAvatarURL({ size: 1024 }))
            .setDescription(
`<:link:1514699706788221120> **Official Website**

Visit Fare's official website for information, updates, documentation and more.

> <:arrow:1514699753462566953> **Website:** https://farebot.vercel.app
> <:arrow:1514699753462566953> **Documentation:** Coming Soon
> <:arrow:1514699753462566953> **Status Page:** Coming Soon`
            )
            .setFooter({
                text: `Requested by ${message.author.username}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Website")
                .setStyle(ButtonStyle.Link)
                .setURL("https://farebot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Documentation")
                .setStyle(ButtonStyle.Link)
                .setURL("https://farebot.vercel.app/docs"),

            new ButtonBuilder()
                .setLabel("Status")
                .setStyle(ButtonStyle.Link)
                .setURL("https://farebot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Support")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/HRE4N4zJHK")
        );

        return message.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
