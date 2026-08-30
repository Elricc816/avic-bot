const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "say",

    async execute(message, args) {

        const text = args.join(" ");

        if (!text) {
            return message.reply("Please provide something to say.");
        }

        await message.delete().catch(() => {});

        return message.channel.send({
            content: text
        });
    }
};
