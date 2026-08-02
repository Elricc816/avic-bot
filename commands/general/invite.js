const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "invite",
    aliases: ["inv"],

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setDescription(
`**Invite Avic !**

<:arrow:1514699753462566953> Thank you for your interest in using Avic! Invite me to your server and join our **Support Server** if you ever need any **help**.`
            );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setLabel("Invite Me")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&integration_type=0&scope=bot+applications.commands"),

            new ButtonBuilder()
                .setLabel("Support Server")
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.gg/bQMYVZEtZb")

        );

        return message.reply({
            embeds: [embed],
            components: [row]
        });

    }
};
