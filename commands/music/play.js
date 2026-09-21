const { EmbedBuilder } = require("discord.js");
const { sendNowPlaying, playNext } = require("../../events/musicPanel");

module.exports = {
    name: "play",
    aliases: ["p"],

    async execute(message, args) {
    const client = message.client;
        
        if (!args.length) {
            return message.reply(
                "<a:spider_cross:1514728338701287640> **__Give me a song name or URL.__**"
            );
        }

        const voiceChannel = message.member?.voice?.channel;

        if (!voiceChannel) {
            return message.reply(
                "<a:spider_cross:1514728338701287640> **__Join a voice channel first.__**"
            );
        }

        let queue = client.queues.get(message.guild.id);

        if (!queue) {
            const player = await client.shoukaku.joinVoiceChannel({
                guildId: message.guild.id,
                channelId: voiceChannel.id,
                shardId: 0
            });

            queue = {
                player,
                tracks: [],
                history: [],
                textChannel: message.channel,
                playing: false,
                current: null,
                loop: false,
                autoplay: false,
                nowPlayingMessage: null
            };
            client.queues.set(message.guild.id, queue);

            player.on("end", () => playNext(client, message.guild.id));
            player.on("exception", (err) => {
                console.error("MUSIC STREAM ERROR:", err?.message || String(err));
                playNext(client, message.guild.id);
            });
            player.on("stuck", () => playNext(client, message.guild.id));
        }

        const query = args.join(" ");

        try {
            const node = client.shoukaku.options.nodeResolver(client.shoukaku.nodes);
            const isUrl = /^https?:\/\//.test(query);
            const result = await node.rest.resolve(isUrl ? query : `ytsearch:${query}`);

            if (!result || !result.data || (Array.isArray(result.data) && result.data.length === 0)) {
                return message.reply(
                    "<a:spider_cross:1514728338701287640> **__I couldn't play that song.__**"
                );
            }

            const track = Array.isArray(result.data)
                ? result.data[0]
                : result.data.tracks?.[0] || result.data;

            track.requestedBy = message.author;

            queue.tracks.push(track);

            if (!queue.playing) {
                playNext(client, message.guild.id);
            } else {
                const queueEmbed = new EmbedBuilder()
                    .setColor("#FFFFFF")
                    .setTitle("Added to Queue")
                    .setThumbnail(track.info.artworkUrl || null)
                    .setDescription(
                        `<:youtube:1545131580090097725> **${track.info.title}**\n\n` +
                        `Duration: \`${msToTime(track.info.length)}\`\n` +
                        `Requested by ${message.author}`
                    )
                    .setFooter({ text: "Fare Music" });

                message.channel.send({ embeds: [queueEmbed] });
            }

        } catch (error) {
            console.error("MUSIC ERROR:", error?.message || String(error));
            return message.reply(
                "<a:spider_cross:1514728338701287640> **__I couldn't play that song.__**"
            );
        }
    }
};

function msToTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
}
