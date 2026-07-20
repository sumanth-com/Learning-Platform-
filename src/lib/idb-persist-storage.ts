import type { StateStorage } from "zustand/middleware";

const DB_NAME = "prathyu-academy";
const STORE_NAME = "persist";
const LEGACY_KEYS = ["prathyu-academy-v3", "prathyu-academy-v2"];

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

function readLegacyLocalStorage(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Migrate legacy localStorage saves into IndexedDB once. */
async function migrateLegacyStorage(activeKey: string): Promise<string | null> {
  const existing = await idbGet(activeKey);
  if (existing) return existing;

  for (const legacyKey of LEGACY_KEYS) {
    const legacy = readLegacyLocalStorage(legacyKey);
    if (!legacy) continue;
    await idbSet(activeKey, legacy);
    if (legacyKey !== activeKey) {
      try {
        localStorage.removeItem(legacyKey);
      } catch {
        /* ignore */
      }
    }
    return legacy;
  }

  return null;
}

export function createIdbPersistStorage(): StateStorage {
  return {
    getItem: async (name) => {
      try {
        return await migrateLegacyStorage(name);
      } catch {
        return readLegacyLocalStorage(name);
      }
    },
    setItem: async (name, value) => {
      try {
        await idbSet(name, value);
      } catch {
        try {
          localStorage.setItem(name, value);
        } catch {
          /* ignore quota errors */
        }
      }
    },
    removeItem: async (name) => {
      try {
        await idbRemove(name);
      } catch {
        /* ignore */
      }
      try {
        localStorage.removeItem(name);
      } catch {
        /* ignore */
      }
    },
  };
}
