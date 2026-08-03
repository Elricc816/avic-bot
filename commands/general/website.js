const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "website",

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: "AVIC Website",
                iconURL: message.client.user.displayAvatarURL()
            })
            .setThumbnail(message.client.user.displayAvatarURL({ size: 1024 }))
            .setDescription(
`<:website:1514699532686852227> **Official Website**

Visit AVIC's official website for information, updates, documentation and more.

> <:arrow:1514699753462566953> **Website:** https://avicbot.vercel.app
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
                .setURL("https://avicbot.vercel.app"),

            new ButtonBuilder()
                .setLabel("Documentation")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app/docs"),

            new ButtonBuilder()
                .setLabel("Status")
                .setStyle(ButtonStyle.Link)
                .setURL("https://avicbot.vercel.app"),

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
