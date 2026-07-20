"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Map, FolderGit2, Brain, Languages,
  MessageSquare, StickyNote, User, Menu, X, ArrowUpRight,
} from "lucide-react";
import { SupraLearnLogo } from "@/components/brand/supra-learn-logo";
import { cn } from "@/lib/utils";
import { getAskCurdriceWhatsAppUrl } from "@/lib/ask-curdrice";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/ai-skills", label: "AI Skills", icon: Brain },
  { href: "/communication", label: "Communication", icon: Languages },
  { href: "/interview", label: "Interview", icon: MessageSquare },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const whatsAppUrl = getAskCurdriceWhatsAppUrl(pathname);

  const NavContent = () => (
    <>
      <div className="px-3 py-5">
        <Link href="/" className="inline-flex rounded-lg px-3 py-1 transition-opacity hover:opacity-90">
          <SupraLearnLogo size="sm" tagline="Learn. Build. Ship." />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-indigo-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 p-4">
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/50 via-zinc-900/90 to-zinc-950 p-3.5 transition-all hover:border-emerald-400/40 hover:shadow-[0_0_28px_-6px_rgba(16,185,129,0.35)]"
        >
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Ask Curdrice</p>
              <p className="text-[11px] text-zinc-500 transition-colors group-hover:text-zinc-400">
                Stuck on a topic? WhatsApp me
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-emerald-500/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-400" />
          </div>
        </a>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-zinc-900 p-2 border border-zinc-800 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <NavContent />
      </aside>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="absolute inset-y-0 left-0 w-64 flex flex-col border-r border-zinc-800 bg-zinc-950"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-4" aria-label="Close menu">
              <X className="h-5 w-5 text-zinc-400" />
            </button>
            <NavContent />
          </motion.aside>
        </motion.div>
      )}
    </>
  );
}
