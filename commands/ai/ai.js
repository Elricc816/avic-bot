const { EmbedBuilder } = require("discord.js");
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: "https://api.navy/v1",
});

function errorEmbed(text) {
    return new EmbedBuilder().setColor("#ED4245").setDescription(`<:WarningIcon:1514708751385497721> ${text}`);
}

module.exports = {
    name: "ai",

    async execute(message, args) {

        const prompt = args.join(" ");
        if (!prompt) {
            return message.reply({ embeds: [errorEmbed("Ask me something — e.g. `,ai what's the capital of France?`")] });
        }

        const thinking = await message.reply({
            embeds: [new EmbedBuilder().setColor("#D3D3D3").setDescription("<a:clockk:1514734530282520647> **Thinking...**")]
        });

        try {
            const response = await client.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
            });

            const answer = response.choices?.[0]?.message?.content || "I didn't get a response — try again.";

            const embed = new EmbedBuilder()
                .setColor("#D3D3D3")
                .setAuthor({ name: "Fare AI", iconURL: message.client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(answer)
                .setFooter({ text: `Asked by ${message.author.username} • Reply to this message to continue the conversation` });

            const sent = await thinking.edit({ embeds: [embed] });

            // React with the marker emoji so index.js's reply-detection picks up follow-ups
            await sent.react("<:vip:1514699727072133233>").catch(() => {});

        } catch (err) {
            console.error("AI ERROR:", err?.message || String(err));
            await thinking.edit({ embeds: [errorEmbed("Something went wrong talking to the AI — try again in a moment.")] });
        }
    }
};
