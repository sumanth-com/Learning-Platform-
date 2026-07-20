"use client";

import { useSyncExternalStore } from "react";
import { useProgressStore } from "@/store/use-progress-store";

function subscribeHydrated(onStoreChange: () => void) {
  return useProgressStore.persist.onFinishHydration(onStoreChange);
}

function getHydratedSnapshot() {
  return useProgressStore.persist.hasHydrated();
}

function getServerSnapshot() {
  return false;
}

/** True after Zustand persist has rehydrated from IndexedDB (client-only). */
export function useStoreHydrated() {
  return useSyncExternalStore(subscribeHydrated, getHydratedSnapshot, getServerSnapshot);
}
