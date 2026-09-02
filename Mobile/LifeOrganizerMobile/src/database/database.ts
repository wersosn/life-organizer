import * as SQLite from "expo-sqlite";
export const db = SQLite.openDatabaseSync("lifeorganizer.db");

export function initDatabase() {
    console.log("[DB] Initializing database...");

    db.execSync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;

        -- ==========================================
        -- USER PROFILE
        -- ==========================================
        CREATE TABLE IF NOT EXISTS user_profile (
            id TEXT PRIMARY KEY NOT NULL,
            email TEXT NOT NULL,
            name TEXT NOT NULL,
            habit_automation_enabled INTEGER NOT NULL DEFAULT 1,
            chore_automation_enabled INTEGER NOT NULL DEFAULT 1,
            push_notifications_enabled INTEGER NOT NULL DEFAULT 1,
            task_history_retention_days INTEGER NOT NULL DEFAULT 30
        );

        -- ==========================================
        -- TODOS
        -- ==========================================
        CREATE TABLE IF NOT EXISTS todos (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            is_completed INTEGER NOT NULL DEFAULT 0,
            source INTEGER NOT NULL DEFAULT 0,
            source_id TEXT,
            created_at TEXT NOT NULL,
            completed_at TEXT,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );

        -- ==========================================
        -- HABITS
        -- ==========================================
        CREATE TABLE IF NOT EXISTS habits (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            frequency INTEGER NOT NULL,
            scheduled_days TEXT NOT NULL DEFAULT '[]',
            completion_deadline TEXT,
            is_automation_enabled INTEGER NOT NULL DEFAULT 1,
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS habit_completions (
            id TEXT PRIMARY KEY NOT NULL,
            habit_id TEXT NOT NULL,
            date TEXT NOT NULL,
            status INTEGER NOT NULL,
            completed_at TEXT,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (habit_id) REFERENCES habits(id)
        );

        -- ==========================================
        -- CHORES
        -- ==========================================
        CREATE TABLE IF NOT EXISTS chore_categories (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            icon TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS chores (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            category_id TEXT NOT NULL,
            frequency_unit INTEGER NOT NULL,
            frequency_value INTEGER NOT NULL,
            last_completed_at TEXT,
            is_automation_enabled INTEGER NOT NULL DEFAULT 1,
            is_active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES chore_categories(id)
        );

        CREATE TABLE IF NOT EXISTS chore_completions (
            id TEXT PRIMARY KEY NOT NULL,
            chore_id TEXT NOT NULL,
            completed_at TEXT NOT NULL,
            notes TEXT,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (chore_id) REFERENCES chores(id)
        );

        -- ==========================================
        -- FINANCES
        -- ==========================================
        CREATE TABLE IF NOT EXISTS transaction_categories (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            icon TEXT,
            type INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS transactions (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            category_id TEXT NOT NULL,
            amount REAL NOT NULL,
            type INTEGER NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES transaction_categories(id)
        );

        CREATE TABLE IF NOT EXISTS budgets (
            id TEXT PRIMARY KEY NOT NULL,
            user_id TEXT NOT NULL,
            category_id TEXT NOT NULL,
            monthly_limit REAL NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES transaction_categories(id)
        );

        -- ==========================================
        -- SYNC QUEUE
        -- ==========================================
        CREATE TABLE IF NOT EXISTS sync_queue (
            id TEXT PRIMARY KEY NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
            payload TEXT,
            created_at TEXT NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            last_error TEXT
        );
    `);

    console.log("[DB] Database initialized");
}

export async function resetDatabase() {
    db.execSync(`
        DELETE FROM sync_queue;
        DELETE FROM budgets;
        DELETE FROM transactions;
        DELETE FROM transaction_categories;
        DELETE FROM chore_completions;
        DELETE FROM chores;
        DELETE FROM chore_categories;
        DELETE FROM habit_completions;
        DELETE FROM habits;
        DELETE FROM todos;
        DELETE FROM user_profile;
    `);
    console.log("[DB] Cleared all local data");
}