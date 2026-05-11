import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "championship.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initDb(db);
  }
  return db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      playerId TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      teamName TEXT NOT NULL,
      teamLogo TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING_USER',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      logo TEXT NOT NULL,
      ownerPlayerId TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (ownerPlayerId) REFERENCES players(id)
    );

    CREATE TABLE IF NOT EXISTS championships (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'UPCOMING',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS championship_inscriptions (
      id TEXT PRIMARY KEY,
      championshipId TEXT NOT NULL,
      playerId TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING_CHAMPIONSHIP',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (championshipId) REFERENCES championships(id),
      FOREIGN KEY (playerId) REFERENCES players(id),
      UNIQUE(championshipId, playerId)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      championshipId TEXT NOT NULL,
      teamAId TEXT NOT NULL,
      teamBId TEXT NOT NULL,
      scoreA INTEGER,
      scoreB INTEGER,
      status TEXT NOT NULL DEFAULT 'SCHEDULED',
      matchDay INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (championshipId) REFERENCES championships(id),
      FOREIGN KEY (teamAId) REFERENCES teams(id),
      FOREIGN KEY (teamBId) REFERENCES teams(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      playerId TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (playerId) REFERENCES players(id)
    );
  `);
}
