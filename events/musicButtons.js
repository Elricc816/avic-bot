const { playNext, sendNowPlaying, deleteNowPlaying } = require("./musicPanel");

module.exports = (client) => {

    client.on("interactionCreate", async (interaction) => {

        if (!interaction.isButton()) return;

        const musicButtons = [
            "music_previous",
            "music_play",
            "music_skip",
            "music_queue",
            "music_stop",
            "music_loop",
            "music_shuffle",
            "music_autoplay"
        ];

        if (!musicButtons.includes(interaction.customId)) return;

        if (!interaction.guild) {
            return interaction.reply({
                content: "<a:spider_cross:1514728338701287640> **__This button can only be used in a server.__**",
                ephemeral: true
            });
        }

        const queue = client.queues.get(interaction.guild.id);

        if (!queue) {
            return interaction.reply({
                content: "<a:spider_cross:1514728338701287640> **__Nothing is playing right now.__**",
                ephemeral: true
            });
        }

        try {

            // =========================
            // PREVIOUS
            // =========================
            if (interaction.customId === "music_previous") {

                const prev = queue.history.pop();

                if (!prev) {
                    return interaction.reply({
                        content: "<a:spider_cross:1514728338701287640> **__No previous song.__**",
                        ephemeral: true
                    });
                }

                if (queue.current) queue.tracks.unshift(queue.current);
                queue.current = prev;
                queue.playing = true;
                await queue.player.playTrack({ track: { encoded: prev.encoded } });
                await sendNowPlaying(client, interaction.guild.id, prev);

                return interaction.reply({
                    content: "<:music_previous:1533525855530258442> Playing previous song.",
                    ephemeral: true
                });
            }

            // =========================
            // PAUSE / RESUME
            // =========================
            if (interaction.customId === "music_play") {

                const paused = queue.paused || false;
                await queue.player.setPaused(!paused);
                queue.paused = !paused;

                const updatedComponents = interaction.message.components.map(row => {
                    const rowData = row.toJSON();

                    rowData.components = rowData.components.map(component => {
                        if (component.custom_id === "music_play") {
                            return {
                                ...component,
                                emoji: paused
                                    ? { id: "1533532040102674652", name: "pause1" }
                                    : { id: "1533532009450831945", name: "play" }
                            };
                        }
                        return component;
                    });

                    return rowData;
                });

                return interaction.update({ components: updatedComponents });
            }

            // =========================
            // SKIP
            // =========================
            if (interaction.customId === "music_skip") {
                await queue.player.stopTrack();

                return interaction.reply({
                    content: "<:music_next:1533525838337802250> **__Skipped.__**",
                    ephemeral: true
                });
            }

            // =========================
            // QUEUE
            // =========================
            if (interaction.customId === "music_queue") {

                if (!queue.tracks.length) {
                    return interaction.reply({
                        content: "<:queue:1545136690790797332> **__Queue is empty.__**",
                        ephemeral: true
                    });
                }

                const list = queue.tracks
                    .slice(0, 10)
                    .map((track, index) => `${index + 1}. **${track.info.title}**`)
                    .join("\n");

                return interaction.reply({
                    content: `<:queue:1545136690790797332> **Queue**\n\n${list}`,
                    ephemeral: true
                });
            }

            // =========================
            // STOP
            // =========================
            if (interaction.customId === "music_stop") {
                await interaction.message.delete().catch(() => {});

                await client.shoukaku.leaveVoiceChannel(interaction.guild.id);
                client.queues.delete(interaction.guild.id);

                return;
            }

            // =========================
            // LOOP
            // =========================
            if (interaction.customId === "music_loop") {

                queue.loop = !queue.loop;

                return interaction.reply({
                    content: queue.loop
                        ? "<:loop:1533527395246538964> **__Track loop enabled.__**"
                        : "<:loop:1533527395246538964> **__Loop disabled.__**",
                    ephemeral: true
                });
            }

            // =========================
            // SHUFFLE
            // =========================
            if (interaction.customId === "music_shuffle") {

                if (queue.tracks.length < 2) {
                    return interaction.reply({
                        content: "<a:spider_cross:1514728338701287640> **__Not enough songs to shuffle.__**",
                        ephemeral: true
                    });
                }

                for (let i = queue.tracks.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [queue.tracks[i], queue.tracks[j]] = [queue.tracks[j], queue.tracks[i]];
                }

                return interaction.reply({
                    content: "<:shuffle:1545131552504025132> **__Queue shuffled.__**",
                    ephemeral: true
                });
            }

            // =========================
            // AUTOPLAY
            // =========================
            if (interaction.customId === "music_autoplay") {

                queue.autoplay = !queue.autoplay;

                return interaction.reply({
                    content: queue.autoplay
                        ? "<:autoplay:1545133559113580616> **__Autoplay enabled.__**"
                        : "<:autoplay:1545133559113580616> **__Autoplay disabled.__**",
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error("MUSIC BUTTON ERROR:", error?.message || String(error));

            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "<a:spider_cross:1514728338701287640> **__Something went wrong.__**",
                    ephemeral: true
                });
            }
        }
    });
};
