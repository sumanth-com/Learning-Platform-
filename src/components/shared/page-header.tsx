"use client";

export function PageHeader({
  title,
  description,
  children,
  compact,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${compact ? "mb-0" : "mb-8"}`}
    >
      <div>
        <h1 className={`font-bold tracking-tight ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
          {title}
        </h1>
        {description && (
          <p className={`text-zinc-400 ${compact ? "mt-0.5 text-sm" : "mt-1"}`}>{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
