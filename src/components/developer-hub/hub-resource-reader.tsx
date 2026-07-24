"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Copy,
  Download,
  Heart,
  MessageSquare,
  NotebookPen,
  Printer,
  Share2,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { PortalChrome } from "@/components/portal/portal-chrome";
import { HubResourceCard } from "@/components/developer-hub/hub-resource-card";
import { categoryMeta } from "@/features/developer-hub/data/categories";
import {
  getHubResource,
  HUB_CATALOG,
} from "@/features/developer-hub/data/catalog";
import { getHubCoverImage } from "@/features/developer-hub/data/cover-images";
import {
  hubAskAiHref,
  useHubLibrary,
} from "@/features/developer-hub/hooks/use-hub-library";
import type { HubResource } from "@/features/developer-hub/types";
import { cn } from "@/lib/utils";

function AiAction({
  href,
  icon,
  label,
  onClick,
}: {
  href?: string;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const className = cn(
    "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1.5",
    "text-[12px] font-medium text-foreground transition hover:bg-muted"
  );
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {label}
    </button>
  );
}

export function HubResourceReader({ resource }: { resource: HubResource }) {
  const library = useHubLibrary();
  const [activeSection, setActiveSection] = useState(resource.sections[0]?.id);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cat = categoryMeta(resource.category);

  const related = useMemo(() => {
    const fromSlugs = (resource.relatedSlugs ?? [])
      .map((s) => getHubResource(s))
      .filter(Boolean) as HubResource[];
    if (fromSlugs.length >= 2) return fromSlugs;
    return HUB_CATALOG.filter(
      (r) => r.category === resource.category && r.slug !== resource.slug
    ).slice(0, 3);
  }, [resource]);

  const index = HUB_CATALOG.findIndex((r) => r.slug === resource.slug);
  const prev = index > 0 ? HUB_CATALOG[index - 1] : null;
  const next =
    index >= 0 && index < HUB_CATALOG.length - 1 ? HUB_CATALOG[index + 1] : null;

  useEffect(() => {
    library.trackView(resource.slug, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- track once per guide
  }, [resource.slug]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      const pct = Math.round(
        (Math.min(scroller.scrollTop, Math.max(max, 1)) / Math.max(max, 1)) * 100
      );
      setProgress(pct);
      library.setProgress(resource.slug, pct);

      for (const section of [...resource.sections].reverse()) {
        const node = document.getElementById(section.id);
        if (!node) continue;
        const top = node.getBoundingClientRect().top;
        if (top <= 140) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable setProgress from hook
  }, [resource.slug, resource.sections, library.setProgress]);

  const copySection = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: resource.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    }
  };

  const askHref = hubAskAiHref(resource.title, resource.description);
  const summarizeHref = hubAskAiHref(
    resource.title,
    `Summarize this guide in 8 bullet points for a busy engineer:\n${resource.sections.map((s) => s.title).join(", ")}`
  );
  const quizHref = hubAskAiHref(
    resource.title,
    `Quiz me on "${resource.title}" with 5 progressive questions. Wait for my answers.`
  );
  const projectHref = hubAskAiHref(
    resource.title,
    `Propose a weekend project that applies "${resource.title}". Include milestones and acceptance criteria.`
  );

  return (
    <>
      <PortalChrome title={resource.title} fillViewport />
      <div
        ref={scrollRef}
        className="relative h-full min-h-0 overflow-y-auto overscroll-y-contain"
      >
        <div
          className="pointer-events-none sticky top-0 z-30 h-0.5 bg-muted"
          aria-hidden
        >
          <div
            className="h-full bg-[#5B6CFF] transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative overflow-hidden border-b border-border/50 px-4 py-12 sm:px-6 sm:py-14">
          <Image
            src={getHubCoverImage(resource)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35" />
          <div className="relative mx-auto max-w-5xl text-white">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-[12px] text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Developer Hub
            </Link>
            <h1 className="mt-5 max-w-3xl text-[28px] font-semibold tracking-[-0.03em] sm:text-[36px]">
              {resource.title}
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] text-white/85">
              {resource.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/90">
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                {resource.difficulty}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                {resource.readingMinutes} min read
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                {cat.label}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                Updated {resource.updatedAt}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 backdrop-blur">
                ★ {resource.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                On this page
              </p>
              <nav className="space-y-1">
                {resource.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={cn(
                      "block rounded-lg px-2 py-1.5 text-[12px] transition",
                      activeSection === section.id
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="pt-2 text-[11px] text-muted-foreground">
                {progress}% complete
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <AiAction
                href={askHref}
                icon={<MessageSquare className="h-3.5 w-3.5" />}
                label="Ask AI About This"
              />
              <AiAction
                href={summarizeHref}
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Summarize"
              />
              <AiAction
                href={quizHref}
                icon={<Check className="h-3.5 w-3.5" />}
                label="Quiz Me"
              />
              <AiAction
                href={projectHref}
                icon={<Target className="h-3.5 w-3.5" />}
                label="Build a Project"
              />
              <AiAction
                icon={<NotebookPen className="h-3.5 w-3.5" />}
                label="Save to Notes"
                onClick={() => toast.message("Saved to Notes — coming soon")}
              />
              <AiAction
                icon={<Sparkles className="h-3.5 w-3.5" />}
                label="Add to Learning Plan"
                onClick={() =>
                  toast.message("Learning plan — coming soon")
                }
              />
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => library.toggleBookmark(resource.slug)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-[12px] font-medium transition",
                  library.isBookmarked(resource.slug)
                    ? "border-amber-500/40 bg-amber-500/10 text-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-3.5 w-3.5",
                    library.isBookmarked(resource.slug) && "fill-current"
                  )}
                />
                Bookmark
              </button>
              <button
                type="button"
                onClick={() => library.toggleLike(resource.slug)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    library.isLiked(resource.slug) && "fill-rose-500 text-rose-500"
                  )}
                />
                Like
              </button>
              <button
                type="button"
                onClick={() => void share()}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button
                type="button"
                onClick={() =>
                  toast.message("PDF export — coming soon in admin CMS")
                }
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-[12px] font-medium transition hover:bg-muted"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </button>
            </div>

            <article ref={articleRef} className="space-y-8">
              {resource.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/50 p-5 sm:p-6"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-[18px] font-semibold tracking-tight">
                      {section.title}
                    </h2>
                    <button
                      type="button"
                      aria-label="Copy section"
                      onClick={() => void copySection(section.body)}
                      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground/90">
                    {section.body}
                  </div>
                </section>
              ))}
            </article>

            {resource.githubUrl ? (
              <a
                href={resource.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-muted/40 px-4 py-3 text-[13px] transition hover:bg-muted"
              >
                <span>Explore related GitHub repositories</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : null}

            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-border/60 pt-6">
              {prev ? (
                <Link
                  href={`/resources/${prev.slug}`}
                  className="group max-w-[46%] rounded-xl border border-border px-3 py-3 transition hover:bg-muted/50"
                >
                  <p className="text-[11px] text-muted-foreground">Previous</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium group-hover:underline">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/resources/${next.slug}`}
                  className="group max-w-[46%] rounded-xl border border-border px-3 py-3 text-right transition hover:bg-muted/50"
                >
                  <p className="text-[11px] text-muted-foreground">Next</p>
                  <p className="mt-0.5 truncate text-[13px] font-medium group-hover:underline">
                    {next.title}
                  </p>
                </Link>
              ) : null}
            </div>

            {related.length > 0 ? (
              <section className="mt-12">
                <h3 className="text-[16px] font-semibold tracking-tight">
                  Related resources
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {related.slice(0, 2).map((r) => (
                    <HubResourceCard
                      key={r.id}
                      resource={r}
                      bookmarked={library.isBookmarked(r.slug)}
                      onToggleBookmark={() => library.toggleBookmark(r.slug)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
