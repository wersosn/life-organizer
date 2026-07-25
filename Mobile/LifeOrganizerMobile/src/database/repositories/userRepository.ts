import { db } from "../database";
import { User } from "@/types/user";

export async function saveUserProfile(user: User) {
  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile (id, email, name) VALUES (?, ?, ?)`,
    [user.id, user.email, user.name]
  );
}

export async function getCachedUserProfile(): Promise<User | null> {
  const row = await db.getFirstAsync<User>("SELECT id, email, name FROM user_profile LIMIT 1");
  return row ?? null;
}

export async function clearUserProfile() {
  await db.runAsync("DELETE FROM user_profile");
}