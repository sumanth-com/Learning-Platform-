"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
};

export function AdminPagination({
  page,
  totalPages,
  total,
}: AdminPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(p: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(p));
    return `${pathname}?${next.toString()}`;
  }

  if (totalPages <= 1) {
    return (
      <p className="mt-4 text-xs text-zinc-500">
        {total} {total === 1 ? "result" : "results"}
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-zinc-500">
        Page {page} of {totalPages} · {total} results
      </p>
      <div className="flex gap-2">
        {page <= 1 ? (
          <Button size="sm" variant="outline" disabled>
            Previous
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href={hrefFor(page - 1)}>Previous</Link>
          </Button>
        )}
        {page >= totalPages ? (
          <Button size="sm" variant="outline" disabled>
            Next
          </Button>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href={hrefFor(page + 1)}>Next</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
