const { EmbedBuilder } = require("discord.js");
const { formatDuration } = require("../../utils/music");
const { getQueueForMessage } = require("./_utils");

module.exports = {
    name: "queue",

    async execute(message, args, client) {
        const result = getQueueForMessage(message, client);
        if (result.error) return message.reply(result.error);

        const { queue } = result;
        if (!queue.current && !queue.tracks.length) {
            return message.reply("Nothing is playing and the queue is empty.");
        }

        const current = queue.current
            ? `**Now playing:** ${queue.current.info.title || "Unknown track"} — \`${formatDuration(queue.current.info.length)}\``
            : "**Now playing:** Nothing";
        const upcoming = queue.tracks
            .slice(0, 10)
            .map((track, index) =>
                `${index + 1}. **${track.info?.title || "Unknown track"}** — \`${formatDuration(track.info?.length)}\``
            );
        const remaining = Math.max(0, queue.tracks.length - upcoming.length);
        const description = [
            current,
            "",
            upcoming.length ? "**Up next:**" : "**Up next:** Nothing",
            ...upcoming,
            ...(remaining ? [`…and ${remaining} more track${remaining === 1 ? "" : "s"}.`] : [])
        ].join("\n");

        const embed = new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle("Music Queue")
            .setDescription(description)
            .setFooter({ text: `${queue.tracks.length} track${queue.tracks.length === 1 ? "" : "s"} queued` });

        return message.reply({ embeds: [embed] });
    }
};
