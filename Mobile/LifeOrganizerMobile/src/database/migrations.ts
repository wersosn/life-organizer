import { db } from "./database";
/*export async function initializeDatabase() {
    db.execSync(`
      PRAGMA foreign_keys = ON;
    `);
}*/

export async function initializeDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS Test (
      Id INTEGER PRIMARY KEY NOT NULL,
      Name TEXT NOT NULL
    );
  `);

  db.runSync(
    "INSERT INTO Test (Name) VALUES (?)",
    "działa"
  );

  const result = db.getAllSync(
    "SELECT * FROM Test"
  );

  console.log(result);
}