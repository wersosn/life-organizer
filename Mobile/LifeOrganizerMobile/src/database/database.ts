import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("lifeorganizer.db");

export function initDatabase() {
  console.log("[DB] Initializing database...");
    db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      server_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      is_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      completed_at TEXT,
      updated_at INTEGER NOT NULL,
      is_deleted INTEGER NOT NULL DEFAULT 0,
      is_synced INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      name TEXT NOT NULL
    );
  `);
}