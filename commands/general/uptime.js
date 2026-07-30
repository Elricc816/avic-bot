const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "uptime",
    aliases: ["up"],

    async execute(message) {

        const uptime = process.uptime();

        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setDescription(
`### **Avic's Uptime !**
<:arrow:1514699753462566953> I have been online for **__${days}d ${hours}h ${minutes}m ${seconds}s__**`
            );

        return message.reply({
            embeds: [embed]
        });

    }
};
