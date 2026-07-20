import { db } from "./database";
export async function initializeDatabase() {
    db.execSync(`PRAGMA foreign_keys = ON;`);
}