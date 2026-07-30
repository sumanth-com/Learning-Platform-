"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SupraBaseMark } from "@/components/brand/supra-learn-logo";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#mentor", label: "AI Mentor" },
  { href: "#certifications", label: "Certifications" },
  { href: "#faq", label: "FAQ" },
];

export function LandingHeader() {
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
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-white transition-opacity hover:opacity-85"
          >
            <SupraBaseMark className="h-8 w-8" />
            <span>Suprabase</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-2 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={AUTH_ROUTES.login}
              className="hidden rounded-full px-4 py-2 text-[12px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href={AUTH_ROUTES.signup}
              className="inline-flex h-10 items-center rounded-full bg-white px-5 text-[12px] font-semibold text-[#181719] shadow-[0_0_0_8px_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#fff8f4]"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/75 transition hover:bg-white/5 md:hidden"
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav className="bg-[#0c0d0e]/95 px-5 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.3)] backdrop-blur-xl md:hidden">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-[13px] text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={AUTH_ROUTES.login}
              className="block rounded-xl px-3 py-2.5 text-[13px] text-white/70 transition hover:bg-white/5 hover:text-white sm:hidden"
            >
              Sign in
            </Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
