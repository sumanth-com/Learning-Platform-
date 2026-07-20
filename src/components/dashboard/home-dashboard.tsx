"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useProgressStore } from "@/store/use-progress-store";
import { useCurriculum } from "@/hooks/use-curriculum";
import { WEEK_ROADMAP_CURRICULUM } from "@/curriculum/java-roadmap/curriculum";
import {
  COMMUNICATION_WEEKS,
  getCommunicationWeekProgress,
} from "@/curriculum/communication-skills";
import { getLearningWeek } from "@/learning-engine/loader";
import { ContinueLearningCard } from "@/components/shared/continue-learning-card";
import { weekProgress } from "@/learning-engine/labels";
import { buildContinueLearningTarget } from "@/lib/continue-learning";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, getGreeting } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type ChartPeriod = "this-week" | "this-month" | "previous-months";

interface ChartPoint {
  label: string;
  tooltipLabel: string;
  hours: number;
}

const CHART_PERIOD_OPTIONS: { value: ChartPeriod; label: string }[] = [
  { value: "this-week", label: "This Week" },
  { value: "this-month", label: "This Month" },
  { value: "previous-months", label: "Previous Months" },
];

function getOverallCommunicationProgress(isDone: (id: string) => boolean): number {
  if (!COMMUNICATION_WEEKS.length) return 0;
  const total = COMMUNICATION_WEEKS.reduce(
    (sum, week) => sum + getCommunicationWeekProgress(week.skill, isDone),
    0
  );
  return Math.round(total / COMMUNICATION_WEEKS.length);
}

function getSkillLabel(title: string): string {
  if (title.startsWith("Control")) return "Communication";
  if (title.includes("Object-Oriented")) return "Object-O";
  if (title.startsWith("Advanced OOP")) return "Advanced";
  if (title.startsWith("Java Collections")) return "Collect";
  if (title.startsWith("JDBC")) return "JDBC";
  if (title.startsWith("Spring Boot")) return "Spring";
  if (title.startsWith("Spring Security")) return "Security";
  if (title.startsWith("REST API")) return "REST";
  if (title.startsWith("Advanced Database")) return "Database";
  if (title.startsWith("Projects")) return "Projects";
  return title.split(/[\s+]/)[0].slice(0, 9);
}

function formatStudyTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function computeBestStreak(dates: string[], current: number): number {
  if (dates.length === 0) return current;
  const sorted = [...new Set(dates)].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);
    if (diffDays === 1) {
      run++;
      best = Math.max(best, run);
    } else if (diffDays > 1) {
      run = 1;
    }
  }
  return Math.max(best, current);
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hoursOnDate(sessions: { date: string; hours: number }[], iso: string): number {
  const hours = sessions.filter((s) => s.date === iso).reduce((sum, s) => sum + s.hours, 0);
  return Math.round(hours * 10) / 10;
}

function getChartData(sessions: { date: string; hours: number }[], period: ChartPeriod): ChartPoint[] {
  const today = new Date();

  if (period === "this-week") {
    const dayIndex = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayIndex);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const iso = toIsoDate(d);
      return {
        label: `${DAY_LABELS[i]} ${d.getDate()}`,
        tooltipLabel: d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
        hours: hoursOnDate(sessions, iso),
      };
    });
  }

  if (period === "this-month") {
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const d = new Date(year, month, day);
      const iso = toIsoDate(d);
      const dayName = DAY_LABELS[(d.getDay() + 6) % 7];
      return {
        label: `${dayName} ${day}`,
        tooltipLabel: d.toLocaleDateString(undefined, {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
        hours: hoursOnDate(sessions, iso),
      };
    });
  }

  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (i + 1), 1);
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const hours = sessions
      .filter((s) => s.date.startsWith(prefix))
      .reduce((sum, s) => sum + s.hours, 0);
    return {
      label: d.toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
      tooltipLabel: d.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      hours: Math.round(hours * 10) / 10,
    };
  }).reverse();
}

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  progress?: number;
}

function MetricCard({ title, value, subtitle, icon, accent, progress }: MetricCardProps) {
  return (
    <div className="flex h-full items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] text-zinc-500">{title}</p>
        <p className="text-xl font-bold tabular-nums text-zinc-50">{value}</p>
        <p className="truncate text-[10px] text-zinc-500">{subtitle}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-1.5 h-1 max-w-[100px] bg-zinc-800" />
        )}
      </div>
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1", accent)}>
        {icon}
      </div>
    </div>
  );
}

function WelcomeBanner({
  name,
  greeting,
  weekId,
  progressPct,
  completed,
  total,
  resumeHref,
  bannerLine,
  mounted,
}: {
  name: string;
  greeting: string;
  weekId: number;
  progressPct: number;
  completed: number;
  total: number;
  resumeHref?: string;
  bannerLine: string;
  mounted: boolean;
}) {
  const dayLine = mounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    : "\u00a0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative shrink-0 overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-zinc-900/90 to-violet-950/40 p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-1/3 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-24 top-1/2 hidden h-px w-32 -translate-y-1/2 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent sm:block" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-medium text-indigo-300">
              <Sparkles className="h-3 w-3" />
              {dayLine}
            </span>
            <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300">
              Current Active Week {weekId}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">
            {greeting},{" "}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">
              {name}
            </span>
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400 sm:text-sm">
            {bannerLine}
          </p>
          <div className="mt-3 flex max-w-md items-center gap-2.5">
            <Progress value={progressPct} className="h-1.5 flex-1 bg-zinc-800/80" />
            <span className="shrink-0 text-[10px] tabular-nums text-zinc-500">
              {completed}/{total} · {progressPct}%
            </span>
          </div>
        </div>

        {resumeHref && (
          <Link href={resumeHref} className="shrink-0">
            <Button variant="gradient" size="sm" className="h-9 w-full gap-2 px-4 sm:w-auto">
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export function HomeDashboard() {
  const profile = useProgressStore((s) => s.profile);
  const studySessions = useProgressStore((s) => s.studySessions);
  const progress = useProgressStore((s) => s.progress);
  const isDone = useProgressStore((s) => s.isDone);
  const resumePosition = useProgressStore((s) => s.resumePosition);
  const todayGoal = useProgressStore((s) => s.todayGoal);
  const todayGoalCompleted = useProgressStore((s) => s.todayGoalCompleted);
  const toggleTodayGoal = useProgressStore((s) => s.toggleTodayGoal);
  const getStats = useProgressStore((s) => s.getStats);
  const getWeekProgress = useProgressStore((s) => s.getWeekProgress);
  const getModuleWeekProgress = useProgressStore((s) => s.getModuleWeekProgress);

  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("this-week");
  const [chartsReady, setChartsReady] = useState(false);
  const hydrated = useStoreHydrated();

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const weeks = useCurriculum();
  const practiceWeekId = useProgressStore((s) => s.getModuleCurrentWeek("practice"));
  const stats = getStats();
  const overallWeekPct = hydrated ? stats.overallProgress : 0;
  const activeWeekId = hydrated ? practiceWeekId : 1;
  const weekMeta = WEEK_ROADMAP_CURRICULUM.find((w) => w.weekId === activeWeekId);

  const monthPrefix = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const thisMonthHours = studySessions
    .filter((s) => s.date.startsWith(monthPrefix))
    .reduce((sum, s) => sum + s.hours, 0);

  const bestStreak = computeBestStreak(
    studySessions.map((s) => s.date),
    profile.streak
  );

  const chartData = useMemo(
    () => getChartData(studySessions, chartPeriod),
    [studySessions, chartPeriod]
  );

  const chartBarSize = useMemo(() => {
    if (chartPeriod === "this-week") return 18;
    if (chartPeriod === "previous-months") return 28;
    return Math.max(6, Math.min(14, Math.floor(320 / chartData.length)));
  }, [chartPeriod, chartData.length]);

  const continueTarget = useMemo(
    () => buildContinueLearningTarget(activeWeekId, isDone, resumePosition, weekMeta?.title),
    [activeWeekId, isDone, resumePosition, progress.completed, weekMeta?.title]
  );

  const skillData = useMemo(() => {
    const communicationProgress = getOverallCommunicationProgress(isDone);
    return weeks.map((week) => ({
      skill: getSkillLabel(week.title),
      value: week.title.startsWith("Control")
        ? communicationProgress
        : getWeekProgress(week.id).overall.percentage,
    }));
  }, [weeks, getWeekProgress, isDone, progress.completed]);

  const currentLearnWeek = getLearningWeek(activeWeekId);
  const currentChallengeProgress = hydrated && currentLearnWeek
    ? weekProgress(currentLearnWeek, isDone)
    : { completed: 0, total: 0, percent: 0 };
  const weekChallengePct = hydrated ? getModuleWeekProgress("practice", activeWeekId).percentage : 0;

  const chartTooltipStyle = {
    cursor: false as const,
    contentStyle: {
      background: "#18181b",
      border: "1px solid #3f3f46",
      borderRadius: "8px",
      color: "#fafafa",
      fontSize: "11px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    },
    labelStyle: { color: "#a1a1aa", fontSize: "10px", marginBottom: "2px" },
    itemStyle: { color: "#818cf8", fontSize: "11px", padding: 0 },
  };

  const radarTooltipStyle = {
    cursor: false as const,
    contentStyle: {
      background: "#18181b",
      border: "1px solid #27272a",
      borderRadius: "8px",
      color: "#fafafa",
      fontSize: "11px",
    },
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-2.5rem)] max-w-6xl flex-col gap-3 overflow-hidden">
      {!hydrated ? (
        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-indigo-500/20 bg-zinc-900/50 p-5 animate-pulse">
          <div className="h-4 w-32 rounded bg-zinc-800" />
          <div className="mt-3 h-7 w-64 max-w-full rounded bg-zinc-800" />
          <div className="mt-2 h-4 w-full max-w-md rounded bg-zinc-800/80" />
          <div className="mt-4 h-1.5 max-w-md rounded bg-zinc-800" />
        </div>
      ) : (
        <WelcomeBanner
          name={profile.name}
          greeting={getGreeting()}
          weekId={activeWeekId}
          progressPct={weekChallengePct}
          completed={currentChallengeProgress.completed}
          total={currentChallengeProgress.total}
          resumeHref={continueTarget.href}
          bannerLine={continueTarget.bannerLine}
          mounted
        />
      )}

      <ContinueLearningCard className="shrink-0" />

      {/* Stats */}
      <div className="grid shrink-0 grid-cols-2 gap-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={toggleTodayGoal}
          className="text-left"
        >
          <MetricCard
            title="Today's Goal"
            value={todayGoalCompleted ? "Done" : "In progress"}
            subtitle={todayGoal}
            icon={<CheckCircle2 className={cn("h-4 w-4", todayGoalCompleted ? "text-emerald-400" : "text-amber-400")} />}
            accent={
              todayGoalCompleted
                ? "bg-emerald-500/10 ring-emerald-500/25 text-emerald-400"
                : "bg-amber-500/10 ring-amber-500/25 text-amber-400"
            }
          />
        </button>
        <MetricCard
          title="Overall Progress"
          value={`${overallWeekPct}%`}
          subtitle={`Active practice week ${activeWeekId}`}
          progress={overallWeekPct}
          icon={<TrendingUp className="h-4 w-4 text-indigo-400" />}
          accent="bg-indigo-500/10 ring-indigo-500/25 text-indigo-400"
        />
        <MetricCard
          title="Study Streak"
          value={`${profile.streak} days`}
          subtitle={`Best: ${bestStreak} days`}
          icon={<Flame className="h-4 w-4 text-orange-400" />}
          accent="bg-orange-500/10 ring-orange-500/25 text-orange-400"
        />
        <MetricCard
          title="Study Time"
          value={formatStudyTime(profile.totalStudyHours)}
          subtitle={`Month: ${formatStudyTime(thisMonthHours)}`}
          icon={<Clock className="h-4 w-4 text-sky-400" />}
          accent="bg-sky-500/10 ring-sky-500/25 text-sky-400"
        />
      </div>

      {/* Weekly progress + skill progress */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 xl:grid-cols-2">
        <div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <div className="mb-1 flex shrink-0 items-center justify-between gap-2">
            <h2 className="text-xs font-semibold text-zinc-100">Weekly Progress</h2>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value as ChartPeriod)}
              className="h-7 cursor-pointer rounded-md border border-zinc-800 bg-zinc-950/80 px-2 text-[10px] text-zinc-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {CHART_PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-h-[140px] flex-1">
            {chartsReady ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={140}>
              <BarChart
                key={chartPeriod}
                data={chartData}
                barSize={chartBarSize}
                margin={{ top: 4, right: 4, left: 0, bottom: chartPeriod === "this-month" ? 8 : 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="#71717a"
                  fontSize={chartPeriod === "this-month" ? 7 : 9}
                  tickLine={false}
                  axisLine={false}
                  interval={chartPeriod === "this-month" ? 2 : 0}
                  angle={chartPeriod === "this-month" ? -35 : 0}
                  textAnchor={chartPeriod === "this-month" ? "end" : "middle"}
                  height={chartPeriod === "this-month" ? 36 : 24}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  {...chartTooltipStyle}
                  labelFormatter={(_, payload) =>
                    (payload?.[0]?.payload as ChartPoint | undefined)?.tooltipLabel ?? ""
                  }
                  formatter={(value) => [`${value ?? 0}h`, "Study"]}
                />
                <Bar
                  dataKey="hours"
                  radius={[4, 4, 0, 0]}
                  fill="#6366f1"
                  animationDuration={500}
                  animationEasing="ease-out"
                  activeBar={{
                    fill: "#818cf8",
                    stroke: "#a5b4fc",
                    strokeWidth: 1,
                    style: { filter: "drop-shadow(0 0 8px rgba(129, 140, 248, 0.45))" },
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full min-h-[140px] animate-pulse rounded-lg bg-zinc-800/40" />
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3">
          <h2 className="mb-1 shrink-0 text-xs font-semibold text-zinc-100">Skill Progress</h2>
          <div className="min-h-[140px] flex-1">
            {chartsReady ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={140}>
              <RadarChart data={skillData} cx="50%" cy="50%" outerRadius="72%">
                <PolarGrid stroke="#6366f1" strokeOpacity={0.35} />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#c4b5fd", fontSize: 9 }}
                  tickLine={false}
                />
                <Radar
                  name="Progress"
                  dataKey="value"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.55}
                  dot={{ r: 3, fill: "#c4b5fd", stroke: "#a78bfa", strokeWidth: 1 }}
                  animationDuration={600}
                  animationEasing="ease-out"
                />
                <Tooltip
                  {...radarTooltipStyle}
                  formatter={(value, _name, item) => [
                    `${value ?? 0}%`,
                    (item?.payload as { skill?: string })?.skill ?? "Progress",
                  ]}
                />
              </RadarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full min-h-[140px] animate-pulse rounded-lg bg-zinc-800/40" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
