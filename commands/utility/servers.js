const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "servers",
    aliases: [],

    async execute(message, args, client) {

        // ONLY BOT OWNER CAN USE THIS COMMAND
        const OWNER_ID = "1530872106399567941";

        if (message.author.id !== OWNER_ID) {
            return;
        }

        const servers = [];

        for (const guild of client.guilds.cache.values()) {

            let invite = null;

            try {
                const channel = guild.channels.cache.find(channel => {
                    if (!channel.isTextBased()) return false;

                    const permissions = channel.permissionsFor(guild.members.me);

                    return permissions &&
                        permissions.has(PermissionFlagsBits.CreateInstantInvite);
                });

                if (channel) {
                    const createdInvite = await channel.createInvite({
                        maxAge: 0,
                        maxUses: 0,
                        unique: true
                    });

                    invite = createdInvite.url;
                }
            } catch (err) {
                invite = null;
            }

            servers.push({
                name: guild.name,
                id: guild.id,
                invite: invite
            });
        }

        // Discord embeds have a 4096-character description limit,
        // so split the results into multiple embeds if necessary.
        const chunks = [];
        let current = "";

        for (const server of servers) {

            const text =
                `**${server.name}**\n` +
                `ID: \`${server.id}\`\n` +
                `${server.invite
                    ? `Invite: ${server.invite}`
                    : `Invite: Could not create invite link`}\n\n`;

            if ((current + text).length > 3800) {
                chunks.push(current);
                current = "";
            }

            current += text;
        }

        if (current) {
            chunks.push(current);
        }

        if (!chunks.length) {
            return message.reply("The bot isn't in any servers.");
        }

        for (let i = 0; i < chunks.length; i++) {

            const embed = new EmbedBuilder()
                .setColor("#D3D3D3")
                .setTitle(`🤖 Fare Bot — Servers`)
                .setDescription(chunks[i])
                .setFooter({
                    text: `Total Servers: ${servers.length} • Page ${i + 1}/${chunks.length}`
                });

            await message.author.send({
                embeds: [embed]
            });
        }

        // Optional confirmation in the channel
        const confirmation = await message.reply(
            "<:Tick:1514714190500335677> Server list sent to your DMs."
        );

        setTimeout(() => {
            confirmation.delete().catch(() => {});
        }, 5000);
    }
};
