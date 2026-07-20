"use client";

import { create } from "zustand";

export interface WeekCelebrationPayload {
  completedWeekId: number;
  nextWeekId: number | null;
  weekTitle: string;
  weekEmoji?: string;
}

interface CelebrationStore {
  active: WeekCelebrationPayload | null;
  showWeekComplete: (payload: WeekCelebrationPayload) => void;
  dismiss: () => void;
}

export const useCelebrationStore = create<CelebrationStore>((set) => ({
  active: null,
  showWeekComplete: (payload) => set({ active: payload }),
  dismiss: () => set({ active: null }),
}));
