module.exports = (client) => {
  const player = client.player;

  player.events.on("error", (queue, error) => {
    console.error(
      "MUSIC PLAYER ERROR:",
      error?.message || String(error)
    );
  });

  player.events.on("playerError", (queue, error) => {
    console.error(
      "MUSIC STREAM ERROR:",
      error?.message || String(error)
    );
  });
};
