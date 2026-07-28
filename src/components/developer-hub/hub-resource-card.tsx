"use client";

import Link from "next/link";
import { Bookmark, Clock, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HubResource } from "@/features/developer-hub/types";
import { getHubCoverStyle } from "@/features/developer-hub/data/cover-images";
import { HubResourceCover } from "@/components/developer-hub/hub-resource-cover";

export function HubResourceCard({
  resource,
  bookmarked,
  onToggleBookmark,
}: {
  resource: HubResource;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  featured?: boolean;
}) {
  const cover = getHubCoverStyle(resource);

  const share = async () => {
    const url = `${window.location.origin}/resources/${resource.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: resource.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card",
        "shadow-[0_1px_0_rgba(0,0,0,0.03)]",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-foreground/12 hover:shadow-[0_18px_40px_-28px_rgba(30,40,50,0.35)]"
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 420px" }}
    >
      <Link
        href={`/resources/${resource.slug}`}
        className="block"
        aria-label={resource.title}
      >
        <HubResourceCover style={cover} className="aspect-[16/9]" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start gap-2">
          <Link
            href={`/resources/${resource.slug}`}
            className="min-w-0 flex-1 text-[15px] font-semibold tracking-tight text-foreground transition hover:opacity-80"
          >
            {resource.title}
          </Link>
          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            <button
              type="button"
              aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
              onClick={() => onToggleBookmark?.()}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                bookmarked && "text-amber-600"
              )}
            >
              <Bookmark
                className={cn("h-3.5 w-3.5", bookmarked && "fill-current")}
              />
            </button>
            <button
              type="button"
              aria-label="Share"
              onClick={() => void share()}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition",
                "hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {resource.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {resource.readingMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {resource.rating.toFixed(1)}
          </span>
          <span>Updated {resource.updatedAt}</span>
        </div>

        <Link
          href={`/resources/${resource.slug}`}
          className={cn(
            "mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl",
            "bg-foreground text-[13px] font-semibold text-background",
            "transition-all duration-200 ease-out",
            "hover:-translate-y-0.5 hover:opacity-90"
          )}
        >
          Start Learning
        </Link>
      </div>
    </article>
  );
}
