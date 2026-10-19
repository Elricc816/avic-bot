const { getQueueForMessage } = require("./_utils");
const { deleteNowPlaying } = require("../../events/musicPanel");

module.exports = {
    name: "leave",

    async execute(message, args, client) {
        const result = getQueueForMessage(message, client);
        if (result.error) return message.reply(result.error);

        const { queue } = result;
        client.queues.delete(message.guild.id);
        await deleteNowPlaying(queue);

        try {
            await client.shoukaku.leaveVoiceChannel(message.guild.id);
        } catch (error) {
            console.warn("Could not disconnect music player:", error?.message || String(error));
        }

        return message.reply("Stopped playback and left the voice channel.");
    }
};
