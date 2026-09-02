import { db } from "../database";

export type LocalUserProfile = {
    id: string;
    email: string;
    name: string;
};

export function saveUserProfileLocally(user: LocalUserProfile) {
    db.runSync(`DELETE FROM user_profile`);
    db.runSync(
        `INSERT INTO user_profile (id, email, name) VALUES (?, ?, ?)`,
        [user.id, user.email, user.name]
    );
}

export function getLocalUserId(): string | null {
    const row = db.getFirstSync<{ id: string }>(`SELECT id FROM user_profile LIMIT 1`);
    return row?.id ?? null;
}

export function clearUserProfileLocally() {
    db.runSync(`DELETE FROM user_profile`);
}