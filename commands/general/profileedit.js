const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "profileedit",
    aliases: ["profile edit", "editprofile"],

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("Profile Editor")
            .setDescription(
`Choose what you'd like to edit:

<:member2:1514699734038876343> **About** — bio, birthday, pronouns, theme colour, banner

<:link:1514699706788221120> **Socials** — Instagram, YouTube, Twitter/X, Twitch, website`
            );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("about_edit")
                .setLabel("About")
                .setEmoji("<:member2:1514699734038876343>")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("social_edit")
                .setLabel("Socials")
                .setEmoji("<:link:1514699706788221120>")
                .setStyle(ButtonStyle.Secondary)

        );

        await message.reply({
            embeds: [embed],
            components: [row]
        });

    }

};
