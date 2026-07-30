"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Mail,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type HelpArticle = {
  id: string;
  category: string;
  title: string;
  answer: string;
};

const ARTICLES: HelpArticle[] = [
  {
    id: "start",
    category: "Getting started",
    title: "Start learning on SupraBase",
    answer:
      "Open Roadmap and continue from the highlighted module. Complete lessons in order, then use the related assignments and projects to apply what you learned. Dashboard always shows the best place to continue.",
  },
  {
    id: "navigation",
    category: "Getting started",
    title: "Find your way around the workspace",
    answer:
      "Use the left sidebar to move between Dashboard, Roadmap, Projects, Assignments, AI Mentor, Dev Forge, Notes, Certifications, Notifications, Profile, and Settings. The top bar shows the current area and gives quick access to notifications and your account menu.",
  },
  {
    id: "progress",
    category: "Learning",
    title: "Understand progress tracking",
    answer:
      "Progress updates when you complete lessons and learning activities. Dashboard shows your current position, Roadmap shows module completion, and Profile summarizes completed work and earned credentials.",
  },
  {
    id: "projects",
    category: "Learning",
    title: "Complete projects and assignments",
    answer:
      "Open a project or assignment from its module, read the requirements and acceptance criteria, then complete the work in your development environment. Use the provided resources and AI Mentor when you need clarification.",
  },
  {
    id: "notes",
    category: "Learning",
    title: "Organize learning notes",
    answer:
      "Use Notes to capture explanations, code snippets, and reminders while learning. Give each note a clear title and keep one topic per note so it is easy to find later.",
  },
  {
    id: "mentor-modes",
    category: "AI Mentor",
    title: "Choose the right AI Mentor mode",
    answer:
      "Explore gives a balanced answer. Explain teaches concepts step by step. Debug identifies likely causes, checks, and fixes. Build focuses on implementation plans and production-ready code. Review examines quality, risk, accessibility, security, and possible improvements.",
  },
  {
    id: "mentor-files",
    category: "AI Mentor",
    title: "Attach files to a conversation",
    answer:
      "Select the + button in the composer and choose Document, Image, or Markdown. Keep each attachment under 10 MB. Add a clear question describing what you want reviewed. GitHub repository import will become available when the option is no longer marked Soon.",
  },
  {
    id: "mentor-quality",
    category: "AI Mentor",
    title: "Get a more useful answer",
    answer:
      "Include your goal, relevant code, the exact error, what you expected, and what happened instead. For debugging, mention recent changes and steps that reproduce the problem. Never include passwords, private keys, access tokens, or sensitive personal data.",
  },
  {
    id: "cert-start",
    category: "Certifications",
    title: "Take a certification assessment",
    answer:
      "Choose a technology and level, review the test brief, confirm your name, accept the honor rules, and start the timer. Solve each challenge from the lobby and submit before time expires. Hidden test cases are included in the final score.",
  },
  {
    id: "cert-download",
    category: "Certifications",
    title: "Generate and download a certificate",
    answer:
      "Certificate generation is available only after a passing result. Confirm the name that should appear on the credential, generate it, then choose Download PDF. Earned certificates also remain available under My certifications on your Profile.",
  },
  {
    id: "cert-retest",
    category: "Certifications",
    title: "Retake a failed assessment",
    answer:
      "A failed attempt enters a cooldown period. The certification card displays the remaining wait. When the cooldown ends, start a fresh attempt from Get Certified. Previous answers are not reused.",
  },
  {
    id: "cert-verify",
    category: "Certifications",
    title: "Share and verify a credential",
    answer:
      "Open an earned certificate and copy its verification link. Share that link with employers or add it to your profile. The credential page displays the recipient, technology, level, issue date, score, and credential ID.",
  },
  {
    id: "theme",
    category: "Account & settings",
    title: "Change light or dark mode",
    answer:
      "Open the profile menu in the top-right corner and select Dark mode or Light mode. Additional appearance preferences are available in Settings.",
  },
  {
    id: "password",
    category: "Account & settings",
    title: "Reset your password",
    answer:
      "Open Settings and request a password reset for your account email. Use the secure link sent to your inbox before it expires. If the email does not arrive, check spam and confirm that the displayed address is correct.",
  },
  {
    id: "notifications",
    category: "Account & settings",
    title: "Manage notifications",
    answer:
      "Notifications contain important learning and certification updates. Open Settings to control notification preferences and sounds. You can mark messages as read or remove them from the Notifications inbox.",
  },
  {
    id: "profile",
    category: "Account & settings",
    title: "Update your profile information",
    answer:
      "Open Profile to review your learner information, progress, projects, and certifications. Use Settings for account-level preferences. Make sure your full name is correct before generating a certificate.",
  },
  {
    id: "page-refresh",
    category: "Troubleshooting",
    title: "A page is not updating correctly",
    answer:
      "Refresh the page once and wait for the current action to finish. If the issue remains, return to Dashboard and reopen the feature. Avoid opening the same timed assessment or streaming AI conversation in multiple tabs.",
  },
  {
    id: "upload-failed",
    category: "Troubleshooting",
    title: "A file upload failed",
    answer:
      "Confirm that the file type is supported and the file is under 10 MB. Remove the failed attachment, try again, and keep the browser tab open until upload completes. For code, text, PDF, or archive files, use Upload Document.",
  },
  {
    id: "certificate-missing",
    category: "Troubleshooting",
    title: "An earned certificate is missing",
    answer:
      "Open Certifications and confirm the card shows Passed or Certified. If it shows Passed, choose Create certificate to issue the credential. If it already shows Certified, open Profile and check My certifications.",
  },
  {
    id: "sign-in",
    category: "Troubleshooting",
    title: "You were signed out unexpectedly",
    answer:
      "Sign in again using the same account. If your session repeatedly expires, reset your password and restart the browser. Do not continue a timed assessment until the account remains signed in.",
  },
];

const CATEGORIES = [
  "All",
  "Getting started",
  "Learning",
  "AI Mentor",
  "Certifications",
  "Account & settings",
  "Troubleshooting",
] as const;

function ArticleRow({ item }: { item: HelpArticle }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/70 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-5 py-5 text-left"
      >
        <span className="min-w-0">
          <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {item.category}
          </span>
          <span className="mt-1.5 block text-[15px] font-medium leading-snug text-foreground">
            {item.title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? (
        <p className="max-w-3xl pb-5 pr-10 text-[14px] leading-7 text-muted-foreground">
          {item.answer}
        </p>
      ) : null}
    </div>
  );
}

export function HelpWorkspace({
  userName,
  supportEmail,
}: {
  userName: string;
  userEmail?: string;
  supportEmail: string;
}) {
  const firstName = userName.split(" ")[0] || "there";
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("All");

  const articles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ARTICLES.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      return (
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [category, query]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="border-b border-border/70 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center justify-center gap-2 text-[12px] font-medium text-muted-foreground">
            <CircleHelp className="h-3.5 w-3.5" />
            SupraBase Help
          </p>
          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-foreground sm:text-[38px]">
            Hi {firstName}, how can we help?
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Search the documentation or browse a topic below.
          </p>

          <label className="mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-left shadow-sm focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-ring/10">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Describe your issue"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside>
          <nav aria-label="Help topics" className="lg:sticky lg:top-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Browse topics
            </p>
            <div className="space-y-0.5">
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition",
                    category === item
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {item}
                  <span className="text-[11px] font-normal opacity-65">
                    {item === "All"
                      ? ARTICLES.length
                      : ARTICLES.filter((article) => article.category === item)
                          .length}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-7 border-t border-border/70 pt-5">
              <a
                href="#contact"
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium text-foreground transition hover:bg-muted/60"
              >
                Contact support
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h2 className="text-[22px] font-semibold tracking-tight text-foreground">
                {query.trim()
                  ? "Search results"
                  : category === "All"
                    ? "All help articles"
                    : category}
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
                {query.trim() ? ` matching “${query.trim()}”` : ""}
              </p>
            </div>
            {query || category !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="shrink-0 text-[13px] font-medium text-foreground underline underline-offset-4"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          {articles.length > 0 ? (
            articles.map((item) => <ArticleRow key={item.id} item={item} />)
          ) : (
            <div className="py-14">
              <p className="text-[15px] font-medium text-foreground">
                No help articles found
              </p>
              <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                Try a shorter search, choose another topic, or email support
                below.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-foreground underline underline-offset-4"
              >
                Contact support
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <section
            id="contact"
            className="mt-10 rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/80">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[18px] font-semibold tracking-tight text-foreground">
                    Contact support
                  </h2>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    Need more help? Email us and we’ll get back to you.
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-[13px] font-medium text-foreground transition hover:bg-muted"
              >
                <Mail className="h-4 w-4" />
                {supportEmail}
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
