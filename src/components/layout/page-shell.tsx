"use client";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  /** When false, page fills viewport and only inner panels scroll */
  scroll?: boolean;
}

export function PageShell({
  title,
  subtitle,
  children,
  headerRight,
  scroll = true,
}: PageShellProps) {
  if (!scroll) {
    return (
      <div className="-mx-4 -my-5 flex h-[calc(100dvh-2.5rem)] max-h-[calc(100dvh-2.5rem)] flex-col overflow-hidden sm:-mx-6 lg:-mx-8">
        <header className="flex shrink-0 items-center justify-between gap-6 px-4 pb-4 pt-1 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </header>
        <div className="mx-4 mb-1 h-px shrink-0 bg-zinc-800/60 sm:mx-6 lg:mx-8" />
        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-4 sm:px-6 lg:px-8">{children}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-zinc-400">{subtitle}</p>}
        </div>
        {headerRight && <div className="shrink-0">{headerRight}</div>}
      </div>
      {children}
    </div>
  );
}
