import Database from 'better-sqlite3';
import path from 'path';
import { seedProfiles } from './seed';

const DB_PATH = path.join(process.cwd(), 'coy.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      photo TEXT NOT NULL,
      bio TEXT NOT NULL,
      city TEXT NOT NULL,
      college TEXT NOT NULL,
      interests TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS swipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      swiper_id INTEGER NOT NULL,
      swiped_id INTEGER NOT NULL,
      action TEXT NOT NULL CHECK(action IN ('like', 'pass')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(swiper_id, swiped_id)
    );
  `);

  // Seed profiles if empty
  const count = db.prepare('SELECT COUNT(*) as cnt FROM profiles').get() as { cnt: number };
  if (count.cnt === 0) {
    const insert = db.prepare(
      'INSERT INTO profiles (id, name, age, photo, bio, city, college, interests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const insertSwipe = db.prepare(
      'INSERT OR IGNORE INTO swipes (swiper_id, swiped_id, action) VALUES (?, ?, ?)'
    );

    const insertMany = db.transaction(() => {
      for (const p of seedProfiles) {
        insert.run(p.id, p.name, p.age, p.photo, p.bio, p.city, p.college, JSON.stringify(p.interests));
      }
      // Some profiles have already liked the logged-in user (id=0)
      // This enables match demos when user swipes right on them
      const profilesWhoLikedUser = [1, 3, 5, 7, 10, 14, 18, 22, 26, 30];
      for (const pid of profilesWhoLikedUser) {
        insertSwipe.run(pid, 0, 'like');
      }
    });

    insertMany();
  }

  return db;
}

