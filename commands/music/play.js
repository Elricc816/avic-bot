const { EmbedBuilder } = require("discord.js");
const { extractTracks, formatDuration } = require("../../utils/music");
const { playNext } = require("../../events/musicPanel");
const { getOrCreateMusicQueue } = require("./_utils");

module.exports = {
    name: "play",
    aliases: ["p"],

    async execute(message, args) {
        const client = message.client;

        if (!args.length) {
            return message.reply("Give me a song name or URL.");
        }

        const query = args.join(" ").trim();

        try {
            if (!message.guild) {
                return message.reply("Music can only be used in a server.");
            }

            if (!message.member?.voice?.channel) {
                return message.reply("Join a voice channel first.");
            }

            if (!client.shoukaku) {
                return message.reply("The music service is not initialized. Please contact a bot admin.");
            }

            const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);

            if (!node) {
                return message.reply("The music service is currently unavailable.");
            }

            const isUrl = /^https?:\/\//i.test(query);
            const result = await node.rest.resolve(isUrl ? query : `ytsearch:${query}`);
            const resolvedTracks = extractTracks(result)
                .filter((track) => track?.encoded && track?.info);

            if (!resolvedTracks.length) {
                return message.reply("I couldn't find a playable track for that search.");
            }

            const isPlaylist = result?.loadType === "playlist" ||
                Boolean(result?.data?.info?.name && Array.isArray(result?.data?.tracks));
            const tracks = (isPlaylist ? resolvedTracks : resolvedTracks.slice(0, 1))
                .slice(0, 100);

            const queueResult = await getOrCreateMusicQueue(message, client);
            if (queueResult.error) return message.reply(queueResult.error);
            const { queue } = queueResult;

            queue.textChannel = message.channel;
            tracks.forEach((track) => {
                track.requestedBy = message.author;
            });
            queue.tracks.push(...tracks);

            const shouldStart = !queue.current && !queue.playing;

            if (shouldStart) {
                const started = await playNext(client, message.guild.id);

                if (!started) {
                    return message.reply("I found the track but couldn't start playback. Check the Lavalink connection.");
                }

                return;
            }

            const playlistName = result?.data?.info?.name;
            const firstTrack = tracks[0];
            const description = [
                playlistName
                    ? `Added **${playlistName}** (${tracks.length} tracks) to the queue.`
                    : `Added **${firstTrack.info.title || "Track"}** to the queue.`,
                `Duration: \`${formatDuration(firstTrack.info.length)}\``,
                `Requested by ${message.author}`
            ].join("\n");

            const embed = new EmbedBuilder()
                .setColor("#FFFFFF")
                .setTitle("Added to Queue")
                .setDescription(description)
                .setFooter({ text: "Fare Music" });

            if (firstTrack.info.artworkUrl) {
                embed.setThumbnail(firstTrack.info.artworkUrl);
            }

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("MUSIC ERROR:", error?.message || String(error));
            return message.reply("I couldn't play that song. Check the Lavalink connection and try again.");
        }
    }
};
