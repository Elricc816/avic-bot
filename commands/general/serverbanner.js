const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "serverbanner",
    aliases: ["guildbanner"],

    async execute(message) {

        const guild = message.guild;

        const banner = guild.bannerURL({
            dynamic: true,
            size: 4096
        });

        const icon = guild.iconURL({
            dynamic: true,
            size: 4096
        });

        if (!banner) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription(
                            "<a:spider_cross:1514728338701287640> This server does not have a banner."
                        )
                ]
            });
        }

        const bannerAnimated = guild.banner?.startsWith("a_");

        function bannerEmbed() {

            return new EmbedBuilder()
                .setColor("#D3D3D3")
                .setDescription(
`###  ${guild.name}'s Banner

[\`PNG\`](${guild.bannerURL({ extension: "png", size: 4096 })}) | [\`JPG\`](${guild.bannerURL({ extension: "jpg", size: 4096 })}) | [\`WEBP\`](${guild.bannerURL({ extension: "webp", size: 4096 })})${bannerAnimated ? ` | [\`GIF\`](${guild.bannerURL({ extension: "gif", size: 4096 })})` : ""}

> Requested by ${message.author}`
                )
                .setImage(banner);

        }

        function iconEmbed() {

            const iconAnimated = guild.icon?.startsWith("a_");

            return new EmbedBuilder()
                .setColor("#D3D3D3")
                .setDescription(
`###  ${guild.name}'s Icon

[\`PNG\`](${guild.iconURL({ extension: "png", size: 4096 })}) | [\`JPG\`](${guild.iconURL({ extension: "jpg", size: 4096 })}) | [\`WEBP\`](${guild.iconURL({ extension: "webp", size: 4096 })})${iconAnimated ? ` | [\`GIF\`](${guild.iconURL({ extension: "gif", size: 4096 })})` : ""}

> Requested by ${message.author}`
                )
                .setImage(icon);

        }

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("icon")
                .setLabel("Server Icon")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [bannerEmbed()],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 300000
        });

        collector.on("collect", async interaction => {

            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF7F7F")
                            .setDescription(
                                "<a:spider_cross:1514728338701287640> This interaction isn't yours."
                            )
                    ],
                    ephemeral: true
                });
          }
          if (interaction.customId === "icon") {

                if (!icon) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This server does not have an icon."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const iconRow = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("banner")
                        .setLabel("Server Banner")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [iconEmbed()],
                    components: [iconRow]
                });

            }

            if (interaction.customId === "banner") {

                return interaction.update({
                    embeds: [bannerEmbed()],
                    components: [row]
                });

            }

        });

        collector.on("end", async () => {

            try {

                const disabledRow = new ActionRowBuilder();

                for (const button of msg.components[0].components) {
                    disabledRow.addComponents(
                        ButtonBuilder.from(button).setDisabled(true)
                    );
                }

                await msg.edit({
                    components: [disabledRow]
                });

            } catch {}

        });

    }

};
