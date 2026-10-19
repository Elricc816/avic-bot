const { EmbedBuilder } = require("discord.js");
const { formatDuration, parseTimeToMilliseconds, shuffleTracks } = require("../../utils/music");
const { playNext, sendNowPlaying } = require("../../events/musicPanel");
const { getQueueForMessage, getOrCreateMusicQueue } = require("./_utils");

const FILTER_PRESETS = {
    bassboost: {
        label: "Bass boost",
        options: {
            equalizer: [
                { band: 0, gain: 0.18 },
                { band: 1, gain: 0.16 },
                { band: 2, gain: 0.13 },
                { band: 3, gain: 0.1 },
                { band: 4, gain: 0.06 }
            ]
        }
    },
    nightcore: {
        label: "Nightcore",
        options: { timescale: { speed: 1.2, pitch: 1.2, rate: 1 } }
    },
    vaporwave: {
        label: "Vaporwave",
        options: { timescale: { speed: 0.85, pitch: 0.8, rate: 1 } }
    },
    "8d": {
        label: "8D",
        options: { rotation: { rotationHz: 0.2 } }
    },
    karaoke: {
        label: "Karaoke",
        options: { karaoke: {} }
    },
    tremolo: {
        label: "Tremolo",
        options: { tremolo: { frequency: 4, depth: 0.75 } }
    },
    vibrato: {
        label: "Vibrato",
        options: { vibrato: { frequency: 4, depth: 0.75 } }
    },
    lowpass: {
        label: "Low-pass",
        options: { lowPass: { smoothing: 20 } }
    }
};

async function applyFilterPreset(queue, name) {
    await queue.player.clearFilters();
    await queue.player.setFilters(FILTER_PRESETS[name].options);
}

function getQueue(message, client) {
    const result = getQueueForMessage(message, client);
    if (result.error) {
        message.reply(result.error);
        return null;
    }
    return result.queue;
}

function requireTrack(message, queue) {
    if (queue.current) return true;
    message.reply("Nothing is playing right now.");
    return false;
}

function getLyricsText(entry) {
    if (entry.plainLyrics) return entry.plainLyrics;
    if (!entry.syncedLyrics) return "";

    return entry.syncedLyrics
        .replace(/^\[[^\]]+\]\s*/gm, "")
        .split("\n")
        .filter(Boolean)
        .join("\n");
}

async function nowPlaying(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;

    const track = queue.current;
    const requestedBy = track.requestedBy || "Unknown";
    const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle("Now Playing")
        .setDescription(
            `<:youtube:1545131580090097725> **${track.info?.title || "Unknown track"}**\n\n` +
            `Duration: \`${formatDuration(track.info?.length)}\`\n` +
            `Requested by ${requestedBy}`
        )
        .setFooter({ text: "Fare Music" });

    if (track.info?.artworkUrl) embed.setThumbnail(track.info.artworkUrl);
    if (queue.nowPlayingMessage?.url) {
        embed.addFields({ name: "Music panel", value: `[Open controls](${queue.nowPlayingMessage.url})` });
    }
    return message.reply({ embeds: [embed] });
}

async function autoplay(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    queue.autoplay = !queue.autoplay;
    return message.reply(`Autoplay ${queue.autoplay ? "enabled" : "disabled"}.`);
}

async function history(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    const recent = queue.history.slice(-10).reverse();
    if (!recent.length) return message.reply("There are no recently played tracks yet.");

    const lines = recent.map((track, index) =>
        `${index + 1}. **${track.info?.title || "Unknown track"}** — \`${formatDuration(track.info?.length)}\``
    );
    return message.reply({ embeds: [
        new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle("Recently Played")
            .setDescription(lines.join("\n"))
    ] });
}

async function queueStatus(message, args, client) {
    if (!client.shoukaku) return message.reply("The music service is not initialized.");

    const nodes = [...client.shoukaku.nodes.values()];
    if (!nodes.length) return message.reply("No Lavalink nodes are configured.");

    const stateNames = ["connecting", "connected", "disconnecting", "disconnected"];
    const lines = nodes.map((node) => {
        const state = stateNames[node.state] || "unknown";
        const stats = node.stats;
        const playing = stats ? `${stats.playingPlayers}/${stats.players} players` : "stats unavailable";
        const version = node.info?.version?.semver ? `Lavalink ${node.info.version.semver}` : "version unknown";
        return `**${node.name}** — ${state} · ${playing} · ${version}`;
    });

    return message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#FFFFFF")
                .setTitle("Lavalink Status")
                .setDescription(lines.join("\n"))
        ]
    });
}

async function join(message, args, client) {
    const result = await getOrCreateMusicQueue(message, client);
    if (result.error) return message.reply(result.error);
    return message.reply("Joined your voice channel. Use `play <song or URL>` to start music.");
}

async function forceFix(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;

    await queue.player.setPaused(false);
    await queue.player.playTrack({ track: { encoded: queue.current.encoded } });
    queue.playing = true;
    queue.paused = false;
    await sendNowPlaying(client, message.guild.id, queue.current);
    return message.reply("Restarted the current track and refreshed playback.");
}

async function volume(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    if (!args[0]) return message.reply(`Current volume: **${queue.volume ?? 100}/1000**.`);

    const value = Number(args[0]);
    if (!Number.isInteger(value) || value < 0 || value > 1000) {
        return message.reply("Set volume to a whole number from 0 to 1000.");
    }

    await queue.player.setGlobalVolume(value);
    queue.volume = value;
    return message.reply(`Volume set to **${value}/1000**.`);
}

async function replay(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;
    if (queue.current.info?.isStream) return message.reply("Live streams cannot be replayed from the beginning.");

    await queue.player.seekTo(0);
    return message.reply("Restarted the current track.");
}

async function seek(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;
    if (queue.current.info?.isStream) return message.reply("Live streams cannot be seeked.");
    if (!args[0]) return message.reply("Usage: `seek <seconds or mm:ss>`.");

    const position = parseTimeToMilliseconds(args[0]);
    const length = Number(queue.current.info?.length);
    if (position === null || !Number.isFinite(length) || length <= 0 || position >= length) {
        return message.reply("Enter a valid time before the end of the current track.");
    }

    await queue.player.seekTo(position);
    return message.reply(`Seeked to **${formatDuration(position)}**.`);
}

async function jumpBy(message, args, client, direction) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;
    if (queue.current.info?.isStream) return message.reply("Live streams cannot be seeked.");

    const amount = args[0] ? parseTimeToMilliseconds(args[0]) : 10000;
    if (amount === null || amount <= 0) {
        return message.reply("Enter a positive number of seconds or a time such as `1:30`.");
    }

    const length = Number(queue.current.info?.length);
    const currentPosition = Number(queue.player.position) || 0;
    const nextPosition = Math.max(0, Math.min(length - 1000, currentPosition + amount * direction));
    if (!Number.isFinite(length) || length <= 0) return message.reply("The track duration is unavailable.");

    await queue.player.seekTo(nextPosition);
    return message.reply(`${direction > 0 ? "Forwarded" : "Rewound"} to **${formatDuration(nextPosition)}**.`);
}

async function loop(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    queue.loop = !queue.loop;
    return message.reply(`Track loop ${queue.loop ? "enabled" : "disabled"}.`);
}

async function twentyFourSeven(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    queue.twentyFourSeven = !queue.twentyFourSeven;
    if (!queue.twentyFourSeven && !queue.current && !queue.tracks.length) {
        client.queues.delete(message.guild.id);
        try {
            await client.shoukaku.leaveVoiceChannel(message.guild.id);
        } catch (error) {
            console.warn("Could not disconnect idle music player:", error?.message || String(error));
        }
    }
    return message.reply(`24/7 mode ${queue.twentyFourSeven ? "enabled" : "disabled"}.`);
}

async function shuffle(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;
    if (queue.tracks.length < 2) return message.reply("Add at least two queued tracks before shuffling.");

    shuffleTracks(queue.tracks);
    return message.reply("The queue has been shuffled.");
}

async function clearQueue(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;
    if (!queue.tracks.length) return message.reply("There are no upcoming tracks to clear.");

    const removed = queue.tracks.length;
    queue.tracks.length = 0;
    return message.reply(`Removed **${removed}** upcoming track${removed === 1 ? "" : "s"}.`);
}

async function remove(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    const position = Number(args[0]);
    if (!Number.isInteger(position) || position < 1 || position > queue.tracks.length) {
        return message.reply(`Choose an upcoming track number from 1 to ${queue.tracks.length}.`);
    }

    const [track] = queue.tracks.splice(position - 1, 1);
    return message.reply(`Removed **${track.info?.title || "Unknown track"}** from the queue.`);
}

async function move(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    const from = Number(args[0]);
    const to = Number(args[1]);
    if (
        !Number.isInteger(from) ||
        !Number.isInteger(to) ||
        from < 1 ||
        to < 1 ||
        from > queue.tracks.length ||
        to > queue.tracks.length
    ) {
        return message.reply(`Usage: \`move <from> <to>\` (upcoming track numbers 1-${queue.tracks.length}).`);
    }

    const [track] = queue.tracks.splice(from - 1, 1);
    queue.tracks.splice(to - 1, 0, track);
    return message.reply(`Moved **${track.info?.title || "Unknown track"}** to queue position **${to}**.`);
}

async function skip(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;

    const count = args[0] === undefined ? 1 : Number(args[0]);
    const available = queue.tracks.length + 1;
    if (!Number.isInteger(count) || count < 1 || count > available) {
        return message.reply(`Choose how many tracks to skip (1-${available}).`);
    }

    if (count > 1) queue.tracks.splice(0, count - 1);
    await queue.player.stopTrack();
    return message.reply(`Skipped **${count}** track${count === 1 ? "" : "s"}.`);
}

async function skipInto(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue || !requireTrack(message, queue)) return;

    const position = Number(args[0]);
    if (!Number.isInteger(position) || position < 1 || position > queue.tracks.length) {
        return message.reply(`Choose an upcoming queue position from 1 to ${queue.tracks.length}.`);
    }

    const target = queue.tracks[position - 1];
    queue.tracks.splice(0, position - 1);
    await queue.player.stopTrack();
    return message.reply(`Skipping to **${target.info?.title || "Unknown track"}**.`);
}

async function lyrics(message, args, client) {
    const queue = client.queues?.get(message.guildId);
    const current = queue?.current;
    const query = args.join(" ").trim() ||
        [current?.info?.author, current?.info?.title].filter(Boolean).join(" ");

    if (!query) return message.reply("Play a track or provide a song name: `lyrics <song>`.");

    try {
        const url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: { "User-Agent": "AvicBot music lyrics command" },
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new Error(`Lyrics service returned HTTP ${response.status}`);

        const results = await response.json();
        const entry = Array.isArray(results)
            ? results.find((item) => item.plainLyrics || item.syncedLyrics)
            : null;
        const text = entry ? getLyricsText(entry) : "";
        if (!text) return message.reply("I couldn't find lyrics for that track.");

        const truncated = text.length > 3900;
        const embed = new EmbedBuilder()
            .setColor("#FFFFFF")
            .setTitle(`Lyrics — ${entry.trackName || query}`.slice(0, 256))
            .setDescription(`${text.slice(0, 3900)}${truncated ? "\n\n…lyrics shortened to fit Discord." : ""}`)
            .setFooter({ text: "Lyrics provided by LRCLIB" });
        return message.reply({ embeds: [embed] });
    } catch (error) {
        console.warn("LYRICS LOOKUP ERROR:", error?.message || String(error));
        return message.reply("The lyrics service is unavailable right now. Try again later.");
    }
}

async function filter(message, args, client) {
    const queue = getQueue(message, client);
    if (!queue) return;

    const action = String(args[0] || "").toLowerCase();
    if (action === "reset") {
        await queue.player.clearFilters();
        queue.filterPreset = null;
        queue.filterEnabled = false;
        return message.reply("Music filters have been reset.");
    }

    if (action === "toggle") {
        if (!queue.filterPreset) queue.filterPreset = "bassboost";
        if (queue.filterEnabled) {
            await queue.player.clearFilters();
            queue.filterEnabled = false;
        } else {
            await applyFilterPreset(queue, queue.filterPreset);
            queue.filterEnabled = true;
        }
        return message.reply(
            `${FILTER_PRESETS[queue.filterPreset].label} ${queue.filterEnabled ? "enabled" : "disabled"}.`
        );
    }

    if (!action) {
        const presets = Object.keys(FILTER_PRESETS).join(", ");
        const active = queue.filterPreset
            ? `${FILTER_PRESETS[queue.filterPreset].label} (${queue.filterEnabled ? "on" : "off"})`
            : "none";
        return message.reply(`Current filter: **${active}**.\nPresets: \`${presets}\`.\nUse \`filter <preset>\`, \`filter toggle\`, or \`filter reset\`.`);
    }

    const preset = FILTER_PRESETS[action];
    if (!preset) {
        return message.reply(`Unknown filter. Choose one of: ${Object.keys(FILTER_PRESETS).join(", ")}.`);
    }

    await applyFilterPreset(queue, action);
    queue.filterPreset = action;
    queue.filterEnabled = true;
    return message.reply(`${preset.label} filter enabled.`);
}

module.exports = {
    nowPlaying,
    autoplay,
    history,
    queueStatus,
    join,
    forceFix,
    volume,
    replay,
    seek,
    forward: (message, args, client) => jumpBy(message, args, client, 1),
    rewind: (message, args, client) => jumpBy(message, args, client, -1),
    loop,
    twentyFourSeven,
    shuffle,
    clearQueue,
    remove,
    move,
    skip,
    skipInto,
    lyrics,
    filter
};
