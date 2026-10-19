const { Shoukaku, Connectors } = require("shoukaku");

const Nodes = [
    {
        name: process.env.LAVALINK_NAME || "main",
        url: process.env.LAVALINK_URL || "lavalink.heavencloud.in:443",
        auth: process.env.LAVALINK_PASSWORD || "heavencloud",
        secure: process.env.LAVALINK_SECURE === undefined
            ? true
            : /^(1|true|yes)$/i.test(process.env.LAVALINK_SECURE)
    }
];

module.exports = (client) => {
    if (client.shoukaku) return client.shoukaku;

    const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);

    shoukaku.on("ready", (name) => console.log(`Lavalink node "${name}" is ready.`));
    shoukaku.on("error", (name, error) => console.error(`Lavalink node "${name}" error:`, error?.message || String(error)));
    shoukaku.on("close", (name, code, reason) => console.log(`Lavalink node "${name}" closed: ${code} ${reason}`));
    shoukaku.on("disconnect", (name) => console.log(`Lavalink node "${name}" disconnected.`));

    client.shoukaku = shoukaku;
    return shoukaku;
};
