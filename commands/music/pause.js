const { getQueueForMessage } = require("./_utils");

module.exports = {
    name: "pause",

    async execute(message, args, client) {
        const result = getQueueForMessage(message, client);
        if (result.error) return message.reply(result.error);

        const { queue } = result;

        if (!queue.current) return message.reply("Nothing is playing right now.");
        if (queue.paused) return message.reply("Playback is already paused.");

        await queue.player.setPaused(true);
        queue.paused = true;
        return message.reply("Playback paused.");
    }
};
