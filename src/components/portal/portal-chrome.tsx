"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type PortalChromeState = {
  title?: string;
  subtitle?: string;
  fillViewport: boolean;
  setChrome: (next: {
    title?: string;
    subtitle?: string;
    fillViewport?: boolean;
  }) => void;
  resetChrome: () => void;
};

const PortalChromeContext = createContext<PortalChromeState | null>(null);

export function PortalChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState<string | undefined>();
  const [subtitle, setSubtitle] = useState<string | undefined>();
  const [fillViewport, setFillViewport] = useState(false);

  const setChrome = useCallback(
    (next: { title?: string; subtitle?: string; fillViewport?: boolean }) => {
      if ("title" in next) setTitle(next.title);
      if ("subtitle" in next) setSubtitle(next.subtitle);
      if ("fillViewport" in next) setFillViewport(Boolean(next.fillViewport));
    },
    []
  );

  const resetChrome = useCallback(() => {
    setTitle(undefined);
    setSubtitle(undefined);
    setFillViewport(false);
  }, []);

  const value = useMemo(
    () => ({ title, subtitle, fillViewport, setChrome, resetChrome }),
    [title, subtitle, fillViewport, setChrome, resetChrome]
  );

  return (
    <PortalChromeContext.Provider value={value}>
      {children}
    </PortalChromeContext.Provider>
  );
}

export function usePortalChrome() {
  const ctx = useContext(PortalChromeContext);
  if (!ctx) {
    throw new Error("usePortalChrome must be used within PortalChromeProvider");
  }
  return ctx;
}

/** Declare page chrome (title / fill) from any portal page. */
export function PortalChrome({
  title,
  subtitle,
  fillViewport = false,
}: {
  title?: string;
  subtitle?: string;
  fillViewport?: boolean;
}) {
  const { setChrome, resetChrome } = usePortalChrome();

  useEffect(() => {
    setChrome({ title, subtitle, fillViewport });
    return () => resetChrome();
  }, [title, subtitle, fillViewport, setChrome, resetChrome]);

  return null;
}
