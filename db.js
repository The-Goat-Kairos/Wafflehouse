const Database = require("better-sqlite3");
const db = new Database("wafflehouse-db.db");

db.prepare(
    `CREATE TABLE IF NOT EXISTS players (
        user_id TEXT PRIMARY KEY,
        credits INTEGER DEFAULT 0,
        inventory TEXT DEFAULT '[]',
        disabled INTEGER DEFAULT 0
    )`
).run();

module.exports = db;
