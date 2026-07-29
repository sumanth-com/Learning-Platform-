import Link from "next/link";
import { ArrowRight, Brain, Route, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/features/auth/constants";

export const metadata = {
  title: "Learn Full Stack & AI",
  description:
    "SupraBase helps students become Full Stack and AI developers through structured paths, projects, and AI mentoring.",
};

export default function PublicPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_color-mix(in_srgb,var(--color-primary)_22%,transparent),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_color-mix(in_srgb,var(--color-primary)_10%,transparent),_transparent_45%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href={AUTH_ROUTES.public}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            S
          </span>
          <span className="gradient-text">SupraBase</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href={AUTH_ROUTES.login}>
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href={AUTH_ROUTES.signup}>
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-24 pt-16 sm:pt-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300/80">
          Enterprise learning platform
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-zinc-50 sm:text-5xl lg:text-6xl">
          Become a Full Stack &amp; AI developer with structure that scales.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          SupraBase combines learning paths, assignments, projects, AI mentoring,
          and progress tracking — built as a production SaaS, not a course site.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={AUTH_ROUTES.signup}>
            <Button size="lg" className="gap-2">
              Start learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={AUTH_ROUTES.login}>
            <Button size="lg" variant="outline">
              I already have an account
            </Button>
          </Link>
        </div>

        <section className="mt-24 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Route,
              title: "Structured paths",
              body: "Guided curricula from fundamentals to production systems.",
            },
            {
              icon: Brain,
              title: "AI mentoring",
              body: "On-demand guidance that adapts to how you learn.",
            },
            {
              icon: Shield,
              title: "Enterprise-ready",
              body: "Auth, roles, and progress designed for real teams.",
            },
          ].map((item) => (
            <div key={item.title} className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-indigo-400">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-semibold text-zinc-100">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-500">{item.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
