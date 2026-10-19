const { PermissionsBitField } = require("discord.js");
const { getQueueForMessage } = require("../../utils/music");
const { deleteNowPlaying, playNext } = require("../../events/musicPanel");

function initializePlayerEvents(client, guildId, queue) {
    const { player } = queue;

    player.on("end", (event) => {
        if (event?.reason === "replaced" || event?.reason === "cleanup") return;
        void playNext(client, guildId);
    });
    player.on("exception", (error) => {
        console.error("MUSIC STREAM ERROR:", error?.message || String(error));
        void playNext(client, guildId);
    });
    player.on("stuck", () => {
        void playNext(client, guildId);
    });
    player.on("closed", async () => {
        if (client.queues.get(guildId) !== queue) return;

        client.queues.delete(guildId);
        await deleteNowPlaying(queue);
    });
}

async function getOrCreateMusicQueue(message, client) {
    if (!message.guild) {
        return { error: "Music can only be used in a server." };
    }

    const voiceChannel = message.member?.voice?.channel;
    if (!voiceChannel) {
        return { error: "Join a voice channel first." };
    }

    if (!client.shoukaku) {
        return { error: "The music service is not initialized. Please contact a bot admin." };
    }

    const botMember = message.guild.members.me;
    const permissions = botMember ? voiceChannel.permissionsFor(botMember) : null;

    if (
        !permissions?.has(PermissionsBitField.Flags.Connect) ||
        !permissions?.has(PermissionsBitField.Flags.Speak)
    ) {
        return { error: "I need permission to connect and speak in that voice channel." };
    }

    const existingQueue = client.queues.get(message.guild.id);
    if (existingQueue && existingQueue.voiceChannelId !== voiceChannel.id) {
        return { error: "Join the same voice channel as the bot to control playback." };
    }

    if (existingQueue) {
        existingQueue.textChannel = message.channel;
        return { queue: existingQueue };
    }

    try {
        const player = await client.shoukaku.joinVoiceChannel({
            guildId: message.guild.id,
            channelId: voiceChannel.id,
            shardId: message.guild.shardId
        });

        const queue = {
            player,
            tracks: [],
            history: [],
            textChannel: message.channel,
            voiceChannelId: voiceChannel.id,
            playing: false,
            paused: false,
            current: null,
            loop: false,
            autoplay: false,
            twentyFourSeven: false,
            volume: 100,
            filterPreset: null,
            filterEnabled: false,
            advancing: false,
            nowPlayingMessage: null
        };

        client.queues.set(message.guild.id, queue);
        initializePlayerEvents(client, message.guild.id, queue);
        return { queue };
    } catch (error) {
        console.error("MUSIC JOIN ERROR:", error?.message || String(error));
        return { error: "I couldn't join the voice channel. Check the Lavalink connection and try again." };
    }
}

module.exports = {
    getQueueForMessage,
    getOrCreateMusicQueue
};
