/**
 * Client-only persistence — no backend.
 *
 * Primary store: IndexedDB (`prathyu-academy` database) via Zustand persist.
 * Lightweight settings: localStorage key `supracodez-settings` only.
 */

export const IDB_DATABASE = "prathyu-academy";
export const IDB_STORE = "persist";
export const PERSIST_KEY = "prathyu-academy-v3";
export const SETTINGS_STORAGE_KEY = "supracodez-settings";

export const EXPORT_APP_ID = "supracodez" as const;
