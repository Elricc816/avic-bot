const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function msToTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

async function deleteNowPlaying(queue) {
    const msg = queue.nowPlayingMessage;
    if (!msg) return;

    try {
        await msg.delete();
    } catch {}

    queue.nowPlayingMessage = null;
}

async function sendNowPlaying(client, guildId, track) {
    const queue = client.queues.get(guildId);
    if (!queue) return;

    await deleteNowPlaying(queue);

    const nowPlayingEmbed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle("Now Playing")
        .setThumbnail(track.info.artworkUrl || null)
        .setDescription(
            `<:youtube:1545131580090097725> **${track.info.title}**\n\n` +
            `Duration: \`${msToTime(track.info.length)}\`\n` +
            `Requested by ${track.requestedBy || "Unknown"}`
        )
        .setFooter({ text: "Fare Music" });

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("music_previous").setEmoji("<:music_previous:1533525855530258442>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_play").setEmoji("<:pause1:1533532040102674652>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_skip").setEmoji("<:music_next:1533525838337802250>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_queue").setEmoji("<:queue:1545136690790797332>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_stop").setEmoji("<:stop:1545135614117019699>").setStyle(ButtonStyle.Danger)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("music_loop").setLabel("Loop").setEmoji("<:loop:1533527395246538964>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_shuffle").setLabel("Shuffle").setEmoji("<:shuffle:1545131552504025132>").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("music_autoplay").setLabel("Autoplay").setEmoji("<:autoplay:1545133559113580616>").setStyle(ButtonStyle.Secondary)
    );

    const msg = await queue.textChannel.send({
        embeds: [nowPlayingEmbed],
        components: [row1, row2]
    });

    queue.nowPlayingMessage = msg;
}

async function playNext(client, guildId) {
    const queue = client.queues.get(guildId);
    if (!queue) return;

    // If looping, replay the same track instead of advancing
    if (queue.loop && queue.current) {
        queue.player.playTrack({ track: { encoded: queue.current.encoded } });
        return;
    }

    if (queue.current) {
        queue.history.push(queue.current);
        if (queue.history.length > 20) queue.history.shift();
    }

    const track = queue.tracks.shift();

    if (!track) {
        queue.playing = false;
        queue.current = null;
        await deleteNowPlaying(queue);
        return;
    }

    queue.playing = true;
    queue.current = track;
    await queue.player.playTrack({ track: { encoded: track.encoded } });
    await sendNowPlaying(client, guildId, track);
}

module.exports = { sendNowPlaying, deleteNowPlaying, playNext };
