"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Clock, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HubResource } from "@/features/developer-hub/types";
import { categoryMeta } from "@/features/developer-hub/data/categories";
import { getHubCoverImage } from "@/features/developer-hub/data/cover-images";

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
  const cat = categoryMeta(resource.category);
  const cover = getHubCoverImage(resource);

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
        "transition-[border-color,box-shadow] duration-200 hover:border-foreground/15"
      )}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 420px" }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={cover}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            type="button"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark?.();
            }}
            className={cn(
              "rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/55",
              bookmarked && "bg-amber-400/95 text-zinc-900"
            )}
          >
            <Bookmark
              className={cn("h-3.5 w-3.5", bookmarked && "fill-current")}
            />
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={(e) => {
              e.preventDefault();
              void share();
            }}
            className="rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/55"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
            {resource.difficulty}
          </span>
          <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium text-white">
            {cat.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/resources/${resource.slug}`}
          className="text-[15px] font-semibold tracking-tight text-foreground transition hover:opacity-80"
        >
          {resource.title}
        </Link>
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
        <div className="flex flex-wrap gap-1.5 pt-1">
          {resource.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
        <Link
          href={`/resources/${resource.slug}`}
          className={cn(
            "group/cta mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl",
            "bg-foreground text-[13px] font-semibold text-background",
            "transition-all duration-200 ease-out",
            "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-10px_rgba(91,108,255,0.65)]",
            "hover:ring-2 hover:ring-[#5B6CFF]/35"
          )}
        >
          Start Learning
        </Link>
      </div>
    </article>
  );
}
