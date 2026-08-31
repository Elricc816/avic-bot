const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "banner",
    aliases: ["bnr"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = await message.client.users.fetch(member.id, {
            force: true
        });

        const globalAvatar = user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        const serverAvatar = member.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        const banner = user.bannerURL({
            dynamic: true,
            size: 4096
        });

        const serverBanner = member.bannerURL
            ? member.bannerURL({
                dynamic: true,
                size: 4096
            })
            : null;

        function bannerEmbed() {

            const isAnimated = user.banner && user.banner.startsWith("a_");

            let formatLinks =
`> [PNG](${user.bannerURL({ extension: "png", size: 4096 })})
> [JPG](${user.bannerURL({ extension: "jpg", size: 4096 })})
> [WEBP](${user.bannerURL({ extension: "webp", size: 4096 })})`;

            if (isAnimated) {
                formatLinks += `\n> [GIF](${user.bannerURL({ extension: "gif", size: 4096 })})`;
            }

            return new EmbedBuilder()
                .setColor("#D3D3D3")
                .setAuthor({
                    name: `${user.username}'s Banner`,
                    iconURL: globalAvatar
                })
                .setImage(banner)
                .setDescription(
`<:member1:1514699741282304061> **User:** ${member}

<:search:1523258723974381580> **Banner Links**
${formatLinks}
> [Banner URL](${banner})`
                )
                .setFooter({
                    text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}`,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                });

        }

        if (!banner) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription(
                            "<a:spider_cross:1514728338701287640> This user does not have a banner."
                        )
                ]
            });
        }

        const bannerButtons = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("avatar")
                .setLabel("Avatar")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("serverbanner")
                .setLabel("Server Banner")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [bannerEmbed()],
            components: [bannerButtons]
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

            // =========================
            // GLOBAL AVATAR
            // =========================

            if (interaction.customId === "avatar") {

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Avatar`,
                        iconURL: globalAvatar
                    })
                    .setImage(globalAvatar)
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    });

                const row = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("serveravatar")
                        .setLabel("Server Avatar")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("banner")
                        .setLabel("Banner")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });

            }

            // =========================
            // SERVER AVATAR
            // =========================

            if (interaction.customId === "serveravatar") {

                if (!member.avatar) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This user does not have a server avatar."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Server Avatar`,
                        iconURL: serverAvatar
                    })
                    .setImage(serverAvatar)
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    });

                const row = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("avatar")
                        .setLabel("Avatar")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("banner")
                        .setLabel("Banner")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });

            }

            // =========================
            // GLOBAL BANNER
            // =========================

            if (interaction.customId === "banner") {

                return interaction.update({
                    embeds: [bannerEmbed()],
                    components: [bannerButtons]
                });

            }

            // =========================
            // SERVER BANNER
            // =========================

            if (interaction.customId === "serverbanner") {

                if (!serverBanner) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This user does not have a server banner."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Server Banner`,
                        iconURL: user.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setImage(serverBanner)
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({
                            dynamic: true
                        })
                    });

                const row = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("avatar")
                        .setLabel("Avatar")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("banner")
                        .setLabel("Banner")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });

            }

        });

    collector.on("end", async () => {

            const disabledRow = new ActionRowBuilder().addComponents(

                ButtonBuilder.from(bannerButtons.components[0])
                    .setDisabled(true),

                ButtonBuilder.from(bannerButtons.components[1])
                    .setDisabled(true)

            );

            await msg.edit({
                components: [disabledRow]
            }).catch(() => {});

        });

    }

};
