const { Shoukaku, Connectors } = require("shoukaku");

const Nodes = [
    {
        name: "main",
        url: "lavalink.heavencloud.in:443",
        auth: "heavencloud",
        secure: true
    }
];

module.exports = (client) => {

    const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), Nodes);

    shoukaku.on("ready", (name) => console.log(`Lavalink node "${name}" is ready.`));
    shoukaku.on("error", (name, error) => console.error(`Lavalink node "${name}" error:`, error?.message || String(error)));
    shoukaku.on("close", (name, code, reason) => console.log(`Lavalink node "${name}" closed: ${code} ${reason}`));
    shoukaku.on("disconnect", (name) => console.log(`Lavalink node "${name}" disconnected.`));

    client.shoukaku = shoukaku;
};
