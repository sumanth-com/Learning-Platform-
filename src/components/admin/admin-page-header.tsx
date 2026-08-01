import Link from "next/link";
import { Button } from "@/components/ui/button";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

/**
 * Page title block used under the admin topbar breadcrumbs.
 */
export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-zinc-800 pb-5 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-sans text-[1.65rem] font-semibold leading-tight tracking-[-0.03em] text-zinc-50 sm:text-[1.85rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[14px] font-medium leading-relaxed text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Button asChild size="sm" className="shrink-0 font-semibold">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
