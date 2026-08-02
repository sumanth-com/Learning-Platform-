import type { StateStorage } from "zustand/middleware";

const DB_NAME = "prathyu-academy";
const STORE_NAME = "persist";

/** Active auth user for scoped persist keys — set by client-workspace. */
let persistUserId: string | null = null;

export function setIdbPersistUserId(userId: string | null) {
  persistUserId = userId;
}

export function getIdbPersistUserId() {
  return persistUserId;
}

function scopedKey(name: string): string | null {
  if (!persistUserId) return null;
  return `${name}:${persistUserId}`;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve((req.result as string | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbRemove(key: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Delete exact keys (legacy unscoped) from IndexedDB + localStorage. */
export async function purgePersistKeys(keys: readonly string[]): Promise<void> {
  if (typeof window === "undefined") return;
  for (const key of keys) {
    try {
      await idbRemove(key);
    } catch {
      /* ignore */
    }
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

/**
 * IndexedDB persist storage scoped to the active authenticated user.
 * Never reads or writes unscoped keys (prevents cross-account leakage).
 */
export function createIdbPersistStorage(): StateStorage {
  return {
    getItem: async (name) => {
      const key = scopedKey(name);
      if (!key) return null;
      try {
        return await idbGet(key);
      } catch {
        try {
          return localStorage.getItem(key);
        } catch {
          return null;
        }
      }
    },
    setItem: async (name, value) => {
      const key = scopedKey(name);
      if (!key) return;
      try {
        await idbSet(key, value);
      } catch {
        try {
          localStorage.setItem(key, value);
        } catch {
          /* ignore quota errors */
        }
      }
    },
    removeItem: async (name) => {
      const key = scopedKey(name);
      if (!key) return;
      try {
        await idbRemove(key);
      } catch {
        /* ignore */
      }
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}
