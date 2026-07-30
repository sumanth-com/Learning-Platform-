import { BarChart3, BookOpen, Boxes, Medal } from "lucide-react";
import { CountUp, RevealGroup, RevealItem } from "./reveal";

const ICONS = [BookOpen, Boxes, Medal, BarChart3] as const;

export type LandingStat = {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
};

export function LandingStats({ stats }: { stats: LandingStat[] }) {
  return (
    <section className="relative mx-auto max-w-6xl px-5 sm:px-8">
      <RevealGroup className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = ICONS[index];
          return (
            <RevealItem
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/[0.065] to-white/[0.018] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e56b68]/10 blur-3xl transition-opacity group-hover:opacity-80"
              />
              <div className="relative flex items-start justify-between">
                <p className="text-[2.35rem] font-medium leading-none tracking-[-0.05em] text-white">
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.055] text-[#f3aaa0] shadow-inner shadow-white/[0.03]">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="relative mt-7 text-[12.5px] font-medium text-white/80">
                {stat.label}
              </p>
              <p className="relative mt-1 text-[11.5px] leading-5 text-white/38">
                {stat.detail}
              </p>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
