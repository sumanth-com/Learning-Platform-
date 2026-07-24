"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "SupraBase.portal.sidebarCollapsed";

type PortalShellContextValue = {
  collapsed: boolean;
  mobileOpen: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  setMobileOpen: (v: boolean) => void;
  toggleMobile: () => void;
  closeMobile: () => void;
};

const PortalShellContext = createContext<PortalShellContextValue | null>(null);

export function PortalShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsedState] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsedState(true);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      collapsed: hydrated ? collapsed : false,
      mobileOpen,
      setCollapsed,
      toggleCollapsed: () => setCollapsed(!collapsed),
      setMobileOpen,
      toggleMobile: () => setMobileOpen((v) => !v),
      closeMobile: () => setMobileOpen(false),
    }),
    [collapsed, hydrated, mobileOpen, setCollapsed]
  );

  return (
    <PortalShellContext.Provider value={value}>
      {children}
    </PortalShellContext.Provider>
  );
}

export function usePortalShell() {
  const ctx = useContext(PortalShellContext);
  if (!ctx) {
    throw new Error("usePortalShell must be used within PortalShellProvider");
  }
  return ctx;
}
