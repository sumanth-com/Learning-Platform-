import {
  Flame,
  Flag,
  GitBranch,
  KeyRound,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type AuthPanelCopy = {
  title: string;
  points: { icon: LucideIcon; title: string; body: string }[];
};

/** Request access — invite-only lobby copy. */
export const RESERVE_PANEL: AuthPanelCopy = {
  title: "Access is curated. The run is not.",
  points: [
    {
      icon: KeyRound,
      title: "Invite-only lobby",
      body: "No open signup queue. Request access, get reviewed by Super Admin, and walk in when approved — clean, calm, intentional.",
    },
    {
      icon: Rocket,
      title: "Quests that feel like work",
      body: "Real builds staged like missions. Clear objectives, ship features, and feel the level-up every session — not another tutorial loop.",
    },
    {
      icon: Sparkles,
      title: "Paths companies hire for",
      body: "Full stack, AI, system design, DevOps. Pick a track, stack the skills that show up in interviews, and leave with proof that travels.",
    },
  ],
};

/** @deprecated Prefer RESERVE_PANEL — public signup is closed. */
export const SIGNUP_PANEL: AuthPanelCopy = RESERVE_PANEL;

/** Sign-in — pull returning players back into the run. */
export const LOGIN_PANEL: AuthPanelCopy = {
  title: "Back in the game. Keep climbing.",
  points: [
    {
      icon: Flag,
      title: "Continue your run",
      body: "Pick up open quests, mentor threads, and unfinished builds exactly where you left the lobby.",
    },
    {
      icon: Flame,
      title: "Protect your streak",
      body: "One more session beats a restart. Stay sharp, clear the next stage, and keep momentum compounding.",
    },
    {
      icon: Target,
      title: "Chase the next boss clear",
      body: "Review progress, crush the hard challenges, and stack proof that you’re shipping — not just studying.",
    },
  ],
};
