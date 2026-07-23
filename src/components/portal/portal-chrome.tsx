"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type PortalBreadcrumb = {
  label: string;
  href?: string;
};

type PortalChromeState = {
  title?: string;
  subtitle?: string;
  breadcrumbs?: PortalBreadcrumb[];
  headerAside?: ReactNode;
  fillViewport: boolean;
  setChrome: (next: {
    title?: string;
    subtitle?: string;
    breadcrumbs?: PortalBreadcrumb[];
    headerAside?: ReactNode;
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
  const [breadcrumbs, setBreadcrumbs] = useState<PortalBreadcrumb[] | undefined>();
  const [headerAside, setHeaderAside] = useState<ReactNode>();
  const [fillViewport, setFillViewport] = useState(false);

  const setChrome = useCallback(
    (next: {
      title?: string;
      subtitle?: string;
      breadcrumbs?: PortalBreadcrumb[];
      headerAside?: ReactNode;
      fillViewport?: boolean;
    }) => {
      if ("title" in next) setTitle(next.title);
      if ("subtitle" in next) setSubtitle(next.subtitle);
      if ("breadcrumbs" in next) setBreadcrumbs(next.breadcrumbs);
      if ("headerAside" in next) setHeaderAside(next.headerAside);
      if ("fillViewport" in next) setFillViewport(Boolean(next.fillViewport));
    },
    []
  );

  const resetChrome = useCallback(() => {
    setTitle(undefined);
    setSubtitle(undefined);
    setBreadcrumbs(undefined);
    setHeaderAside(undefined);
    setFillViewport(false);
  }, []);

  const value = useMemo(
    () => ({
      title,
      subtitle,
      breadcrumbs,
      headerAside,
      fillViewport,
      setChrome,
      resetChrome,
    }),
    [
      title,
      subtitle,
      breadcrumbs,
      headerAside,
      fillViewport,
      setChrome,
      resetChrome,
    ]
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
  breadcrumbs,
  headerAside,
  fillViewport = false,
}: {
  title?: string;
  subtitle?: string;
  breadcrumbs?: PortalBreadcrumb[];
  headerAside?: ReactNode;
  fillViewport?: boolean;
}) {
  const { setChrome, resetChrome } = usePortalChrome();

  useEffect(() => {
    setChrome({ title, subtitle, breadcrumbs, headerAside, fillViewport });
    return () => resetChrome();
  }, [title, subtitle, breadcrumbs, headerAside, fillViewport, setChrome, resetChrome]);

  return null;
}
