import {
  Flame,
  Flag,
  GitBranch,
  Rocket,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type AuthPanelCopy = {
  title: string;
  points: { icon: LucideIcon; title: string; body: string }[];
};

/** Signup — invite users to start the run. */
export const SIGNUP_PANEL: AuthPanelCopy = {
  title: "Press start. Level up as an engineer.",
  points: [
    {
      icon: Rocket,
      title: "Unlock your first quests",
      body: "Jump into real builds that feel like missions — clear stages, ship features, and feel progress every session.",
    },
    {
      icon: GitBranch,
      title: "Choose your skill path",
      body: "Full stack, AI, system design, DevOps — pick a track and level the stack companies actually hire for.",
    },
    {
      icon: Trophy,
      title: "Win proof you can show",
      body: "Beat timed challenges and earn verifiable certs with public IDs — every clear counts outside the game too.",
    },
  ],
};

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
