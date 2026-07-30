"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type PhasePoint = {
  id: string;
  label: string;
  short: string;
  percent: number;
  completed: number;
  total: number;
};

const AXIS_TICK = { fontSize: 11, fill: "var(--color-muted-foreground)" };

function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-popover px-2.5 py-1.5 text-[11.5px] shadow-[0_8px_24px_-12px_rgba(20,20,25,0.35)]">
      {children}
    </div>
  );
}

/** Completion percentage for each phase of the roadmap. */
export function PhaseCompletionChart({ data }: { data: PhasePoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center text-[12.5px] text-muted-foreground">
        Phase progress appears once your roadmap loads.
      </div>
    );
  }

  return (
    <div className="h-full min-h-[12rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--color-border)"
            strokeDasharray="3 4"
          />
          <XAxis
            dataKey="short"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={AXIS_TICK}
            tickMargin={8}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 50, 100]}
            tickFormatter={(value: number) => `${value}%`}
            tickLine={false}
            axisLine={false}
            tick={AXIS_TICK}
            width={48}
            tickMargin={6}
          />
          <Tooltip
            cursor={{ fill: "var(--color-border)", opacity: 0.35 }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0]?.payload as PhasePoint | undefined;
              if (!point) return null;
              return (
                <TipBox>
                  <p className="font-medium text-foreground">{point.label}</p>
                  <p className="mt-0.5 tabular-nums text-muted-foreground">
                    {point.completed}/{point.total} lessons · {point.percent}%
                  </p>
                </TipBox>
              );
            }}
          />
          <Bar
            dataKey="percent"
            fill="var(--color-brand)"
            radius={[6, 6, 6, 6]}
            maxBarSize={44}
            isAnimationActive={false}
            background={{ fill: "var(--color-border)", radius: 6 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Donut splitting time already invested from time still ahead. */
export function TimeSplitChart({
  investedMinutes,
  remainingMinutes,
  percent,
}: {
  investedMinutes: number;
  remainingMinutes: number;
  percent: number;
}) {
  const empty = investedMinutes + remainingMinutes === 0;
  const data = [
    {
      key: "invested",
      name: "Invested",
      value: empty ? 0 : investedMinutes,
      color: "var(--color-brand)",
    },
    {
      key: "remaining",
      name: "Remaining",
      value: empty ? 1 : remainingMinutes,
      color: "var(--color-border)",
    },
  ];

  return (
    <div className="relative h-full min-h-[12rem] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="66%"
            outerRadius="94%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={data[0].value > 0 ? 2 : 0}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((slice) => (
              <Cell key={slice.key} fill={slice.color} />
            ))}
          </Pie>
          {!empty ? (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const slice = payload[0]?.payload as
                  | { name: string; value: number }
                  | undefined;
                if (!slice) return null;
                return (
                  <TipBox>
                    <p className="font-medium text-foreground">{slice.name}</p>
                    <p className="mt-0.5 tabular-nums text-muted-foreground">
                      {formatMinutes(slice.value)}
                    </p>
                  </TipBox>
                );
              }}
            />
          ) : null}
        </PieChart>
      </ResponsiveContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-semibold tabular-nums leading-none text-foreground">
          {percent}%
        </span>
        <span className="mt-1 text-[10.5px] text-muted-foreground">
          of the path
        </span>
      </div>
    </div>
  );
}

function formatMinutes(total: number) {
  if (total <= 0) return "0m";
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
