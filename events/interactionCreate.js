const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const profileDB = require("../database/profile");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        // Buttons from ,profileedit
        if (interaction.isButton()) {

            const fields = {
                bio: "Bio",
                birthday: "Birthday",
                pronouns: "Pronouns",
                theme: "Theme",
                banner: "Banner URL",
                website: "Website",
                instagram: "Instagram",
                youtube: "YouTube",
                twitter: "Twitter/X",
                twitch: "Twitch"
            };

            if (!fields[interaction.customId]) return;

            const modal = new ModalBuilder()
                .setCustomId(`profile_${interaction.customId}`)
                .setTitle(`Edit ${fields[interaction.customId]}`);

            const input = new TextInputBuilder()
                .setCustomId("value")
                .setLabel(`Enter ${fields[interaction.customId]}`)
                .setStyle(
                    interaction.customId === "bio"
                        ? TextInputStyle.Paragraph
                        : TextInputStyle.Short
                )
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(input)
            );

            return interaction.showModal(modal);
        }

        // Modal submit
        if (interaction.isModalSubmit()) {

            if (!interaction.customId.startsWith("profile_")) return;

            const field = interaction.customId.replace("profile_", "");
            const value = interaction.fields.getTextInputValue("value");

            await profileDB.set(interaction.user.id, {
                [field]: value
            });

            return interaction.reply({
                content: `✅ Updated **${field}** successfully!`,
                ephemeral: true
            });
        }

    });

};
