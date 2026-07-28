"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useServerInsertedHTML } from "next/navigation";

export type AppTheme = "dark" | "light";
export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "SupraBase.theme";
const LEGACY_THEME_KEYS = ["supralearn.theme"];

const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||localStorage.getItem('supralearn.theme');var pref=t==='light'||t==='dark'||t==='system'?t:'dark';var theme=pref==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):pref;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.style.colorScheme=theme;root.dataset.themePref=pref;}catch(e){document.documentElement.classList.add('dark');}})();`;

type ThemeContextValue = {
  /** Resolved light/dark currently applied to the document */
  theme: AppTheme;
  /** User preference including system */
  preference: ThemePreference;
  setTheme: (next: ThemePreference) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveTheme(preference: ThemePreference): AppTheme {
  if (preference === "light" || preference === "dark") return preference;
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeClass(theme: AppTheme, preference: ThemePreference) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
  root.dataset.themePref = preference;
}

function readStoredPreference(): ThemePreference {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      LEGACY_THEME_KEYS.map((k) => window.localStorage.getItem(k)).find(
        Boolean
      );
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    return "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>("dark");
  const [theme, setThemeState] = useState<AppTheme>("dark");

  useServerInsertedHTML(() => (
    <script
      id="SupraBase-theme-boot"
      dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
    />
  ));

  useEffect(() => {
    const pref = readStoredPreference();
    const resolved = resolveTheme(pref);
    setPreferenceState(pref);
    setThemeState(resolved);
    applyThemeClass(resolved, pref);
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const resolved = resolveTheme("system");
      setThemeState(resolved);
      applyThemeClass(resolved, "system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    const resolved = resolveTheme(next);
    setPreferenceState(next);
    setThemeState(resolved);
    applyThemeClass(resolved, next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: AppTheme = prev === "dark" ? "light" : "dark";
      setPreferenceState(next);
      applyThemeClass(next, next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, preference, setTheme, toggleTheme }),
    [theme, preference, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeOptional(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  return (
    ctx ?? {
      theme: "dark",
      preference: "dark",
      setTheme: () => undefined,
      toggleTheme: () => undefined,
    }
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
