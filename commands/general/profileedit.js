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

👤 **About** — bio, birthday, pronouns, theme colour, banner

🔗 **Socials** — Instagram, YouTube, Twitter/X, Twitch, website`
            );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("about_edit")
                .setLabel("About")
                .setEmoji("👤")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("social_edit")
                .setLabel("Socials")
                .setEmoji("🔗")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [embed],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 300000
        });

        collector.on("collect", async interaction => {

            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    content: "This menu isn't yours.",
                    ephemeral: true
                });
            }

            // interactionCreate.js will handle opening the modals
            await interaction.deferUpdate();

        });

        collector.on("end", async () => {

            try {

                const disabledRow = new ActionRowBuilder().addComponents(

                    ButtonBuilder.from(row.components[0]).setDisabled(true),

                    ButtonBuilder.from(row.components[1]).setDisabled(true)

                );

                await msg.edit({
                    components: [disabledRow]
                });

            } catch {}

        });

    }
};
