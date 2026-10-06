import Database from 'better-sqlite3';
import path from 'path';
import { env } from '$env/dynamic/private';

// Resolve against the working directory (repo root under PM2 and `vite dev`),
// not the module location: bundled code lives in build/, which is wiped on every build.
const dbPath = env.DATABASE_PATH || path.resolve(process.cwd(), 'landscape.db');
const db = new Database(dbPath);

// Initialize tiles table
db.exec(`
  CREATE TABLE IF NOT EXISTS tiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    position INTEGER UNIQUE NOT NULL,
    image_url TEXT,
    prompt TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Prepare statements for better performance
const getTilesStmt = db.prepare('SELECT * FROM tiles');
const getTileByPositionStmt = db.prepare('SELECT * FROM tiles WHERE position = ?');
const upsertTileStmt = db.prepare(`
  INSERT INTO tiles (position, image_url, prompt) 
  VALUES (?, ?, ?)
  ON CONFLICT(position) 
  DO UPDATE SET 
    image_url = excluded.image_url,
    prompt = excluded.prompt,
    created_at = CURRENT_TIMESTAMP
`);
const deleteTileStmt = db.prepare('DELETE FROM tiles WHERE position = ?');

export const getTiles = () => getTilesStmt.all();
export const getTileByPosition = (position) => getTileByPositionStmt.get(position);
export const upsertTile = (position, imageUrl, prompt) => {
	return upsertTileStmt.run(position, imageUrl, prompt);
};
export const deleteTile = (position) => deleteTileStmt.run(position);

export default db;
