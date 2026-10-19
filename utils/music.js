function extractTracks(result) {
    if (Array.isArray(result)) return result;

    const data = result?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.tracks)) return data.tracks;
    if (data?.track) return [data.track];
    if (data?.encoded) return [data];

    return [];
}

function formatDuration(milliseconds) {
    const value = Number(milliseconds);

    if (!Number.isFinite(value) || value <= 0) return "Live";

    const totalSeconds = Math.floor(value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getQueueForMessage(message, client) {
    if (!message.guild) {
        return { error: "Music commands can only be used in a server." };
    }

    const queue = client.queues?.get(message.guild.id);

    if (!queue) {
        return { error: "Nothing is playing in this server." };
    }

    const voiceChannel = message.member?.voice?.channel;

    if (!voiceChannel) {
        return { error: "Join the bot's voice channel to control playback." };
    }

    if (voiceChannel.id !== queue.voiceChannelId) {
        return { error: "Join the same voice channel as the bot to control playback." };
    }

    return { queue };
}

function shuffleTracks(tracks) {
    for (let index = tracks.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [tracks[index], tracks[randomIndex]] = [tracks[randomIndex], tracks[index]];
    }

    return tracks;
}

function parseTimeToMilliseconds(input) {
    const value = String(input ?? "").trim();
    if (!value) return null;

    if (/^\d+(?::\d{1,2}){1,2}$/.test(value)) {
        const parts = value.split(":").map(Number);
        if (parts.slice(1).some((part) => part > 59)) return null;

        const seconds = parts.reduce((total, part) => total * 60 + part, 0);
        return seconds * 1000;
    }

    if (!/^\d+(?:\.\d+)?$/.test(value)) return null;
    return Math.floor(Number(value) * 1000);
}

module.exports = {
    extractTracks,
    formatDuration,
    getQueueForMessage,
    shuffleTracks,
    parseTimeToMilliseconds
};
