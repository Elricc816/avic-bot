const { QuickDB } = require("quick.db");
const path = require("path");

const dbPath = process.env.RAILWAY_VOLUME_MOUNT_PATH
    ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "database.sqlite")
    : path.join(__dirname, "database.sqlite");

const db = new QuickDB({ filePath: dbPath });

module.exports = db;
