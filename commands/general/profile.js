const profileDB = require("../../database/profile");

const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "profile",
    aliases: ["pf"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = member.user;
        const profile = await profileDB.get(user.id);

        await user.fetch().catch(() => {});

        const avatar = user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        const banner = user.bannerURL({
            dynamic: true,
            size: 4096
        });

        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => r.toString())
            .slice(0, 8)
            .join(", ") || "None";

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setThumbnail(avatar)
        .setDescription(
`## ${user.username}'s Profile

<:search:1523258723974381580> __**General**__
> **Username :** ${user.username}
> **Display Name :** ${member.displayName}
> **User ID :** ${user.id}
> **Bot :** ${user.bot ? "Yes" : "No"}

📝 __**Profile**__
> **Bio :** ${profile.bio || "Not set"}
> **Birthday :** ${profile.birthday || "Not set"}
> **Theme :** ${profile.theme || "Default"}

🌐 __**Socials**__
> **Website :** ${profile.website || "Not set"}
> **Instagram :** ${profile.instagram || "Not set"}
> **YouTube :** ${profile.youtube || "Not set"}

<:bluetick:1523423666585604106> __**Dates**__
> **Created :** <t:${Math.floor(user.createdTimestamp / 1000)}:R>
> **Joined :** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>

<:mod1:1514699913919991839> __**Server**__
> **Top Role :** ${member.roles.highest}
> **Boosting :** ${member.premiumSince ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : "No"}
> **Roles :** ${roles}`
);
            
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

            if (interaction.customId === "avatar") {

                const avatarEmbed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setDescription(
`### ${user.username}'s Avatar

-# Requested by ${message.author}`
                    )
                    .setImage(avatar);

                return interaction.reply({
                    embeds: [avatarEmbed],
                    ephemeral: true
                });

            }

            if (interaction.customId === "banner") {

                if (!banner) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This user does not have a banner."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const bannerEmbed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setDescription(
`### ${user.username}'s Banner

-# Requested by ${message.author}`
                    )
                    .setImage(banner);

                return interaction.reply({
                    embeds: [bannerEmbed],
                    ephemeral: true
                });

            }

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
