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

const STORAGE_KEY = "SupraBase.theme";
const LEGACY_THEME_KEYS = ["supralearn.theme"];

const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}')||localStorage.getItem('supralearn.theme');var theme=t==='light'?'light':'dark';var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(theme);root.style.colorScheme=theme;}catch(e){document.documentElement.classList.add('dark');}})();`;

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: AppTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

function readStoredTheme(): AppTheme {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      LEGACY_THEME_KEYS.map((k) => window.localStorage.getItem(k)).find(
        Boolean
      );
    return raw === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("dark");

  // Inject outside the React client tree so React 19 does not warn about <script>.
  useServerInsertedHTML(() => (
    <script
      id="SupraBase-theme-boot"
      dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
    />
  ));

  useEffect(() => {
    const next = readStoredTheme();
    setThemeState(next);
    applyThemeClass(next);
  }, []);

  const setTheme = useCallback((next: AppTheme) => {
    setThemeState(next);
    applyThemeClass(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: AppTheme = prev === "dark" ? "light" : "dark";
      applyThemeClass(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Safe theme reader for components that may sit outside ThemeProvider during SSR. */
export function useThemeOptional(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  return (
    ctx ?? {
      theme: "dark",
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
