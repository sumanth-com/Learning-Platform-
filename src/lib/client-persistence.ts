/**
 * Client-only cache helpers.
 *
 * Authoritative learner state lives in Supabase (profile_id scoped).
 * IndexedDB / localStorage keys are short-lived caches keyed by auth user id.
 */

export const IDB_DATABASE = "prathyu-academy";
export const IDB_STORE = "persist";
export const PERSIST_KEY = "prathyu-academy-v3";
export const SETTINGS_STORAGE_KEY = "SupraBase-settings";

export const EXPORT_APP_ID = "SupraBase" as const;
