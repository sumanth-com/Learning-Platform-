"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { SITE_ROUTES } from "@/lib/site-routes";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: SITE_ROUTES.mentor, label: "AI Mentor" },
  { href: SITE_ROUTES.platform, label: "Platform" },
  { href: SITE_ROUTES.certifications, label: "Certifications" },
  { href: SITE_ROUTES.stack, label: "Stack" },
  { href: SITE_ROUTES.faq, label: "FAQ" },
] as const;

export function LandingHeader({ showNav = true }: { showNav?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-[#db5b65] via-[#f1a379] to-[#f5b8a8]"
      />

      <div
        className={cn(
          "transition-colors duration-300",
          scrolled
            ? "bg-[#0c0d0e]/72 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href={AUTH_ROUTES.public}
            className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          >
            <SupraBaseMark className="h-8 w-8 sm:h-9 sm:w-9" />
            <span className="text-[15px] font-semibold tracking-[-0.02em] sm:text-[16px]">
              Suprabase
            </span>
          </Link>

          {showNav ? (
            <nav
              aria-label="Primary"
              className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/[0.04] p-1 md:flex"
            >
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[12px] font-medium transition",
                      active
                        ? "bg-white/[0.1] text-white"
                        : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            <Link
              href={AUTH_ROUTES.login}
              className={cn(
                "rounded-full px-4 py-2 text-[12.5px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white",
                showNav ? "hidden sm:inline-flex" : "inline-flex"
              )}
            >
              Sign in
            </Link>
            <Link
              href={AUTH_ROUTES.signup}
              className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[12.5px] font-semibold text-[#181719] shadow-[0_0_0_8px_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4]"
            >
              Get started
            </Link>
            {showNav ? (
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-white/75 transition hover:bg-white/10 md:hidden"
              >
                {menuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            ) : null}
          </div>
        </div>

        {showNav && menuOpen ? (
          <nav
            aria-label="Primary"
            className="bg-[#0c0d0e]/95 px-5 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl md:hidden"
          >
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-[13.5px] transition",
                    active
                      ? "bg-white/[0.08] font-medium text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={AUTH_ROUTES.login}
              className="block rounded-xl px-3 py-2.5 text-[13.5px] text-white/70 transition hover:bg-white/5 hover:text-white sm:hidden"
            >
              Sign in
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
