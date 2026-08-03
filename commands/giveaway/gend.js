const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");

const db = new QuickDB();

module.exports = {
    name: "gend",

    async execute(message, args) {

        if (!message.member.permissions.has("ManageGuild")) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription("<a:spider_cross:1514728338701287640> You need **Manage Server** permission.")
                ]
            });
        }

        const messageId = args[0];

        if (!messageId) {
            return message.reply("Usage: `,gend <messageID>`");
        }

        const giveaway = await db.get(`giveaway_${messageId}`);

        if (!giveaway)
            return message.reply("❌ Giveaway not found.");

        if (giveaway.ended)
            return message.reply("❌ Giveaway already ended.");

        giveaway.endTime = Date.now() - 1000;

        await db.set(`giveaway_${messageId}`, giveaway);

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#57F287")
                    .setDescription("<:Tick:1514714190500335677> Giveaway will end within **5 seconds**.")
            ]
        });

    }
};
