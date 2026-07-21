"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Search,
  Terminal,
} from "lucide-react";
import { TerminalSimulator } from "@/components/tooling/terminal-simulator";
import { Button } from "@/components/ui/button";
import { CURRICULUM_ROUTES } from "@/features/curriculum/lib/curriculum-routes";
import {
  DEVELOPER_TOOLING_SECTIONS,
  findToolingTopic,
  flattenToolingTopics,
} from "@/features/curriculum/lib/developer-tooling-curriculum";
import { developerToolingSearchIndex } from "@/features/curriculum/lib/developer-tooling";
import { listDeveloperToolingChallenges } from "@/features/curriculum/lib/developer-tooling-challenges";
import { curriculumChallengeEntityId } from "@/features/curriculum/lib/topic-challenges";
import { useProgressStore } from "@/store/use-progress-store";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { cn } from "@/lib/utils";

function Markdownish({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
      {blocks.map((block, i) => {
        if (block.startsWith("| ")) {
          const rows = block.split("\n").filter((r) => r.trim() && !r.includes("---"));
          return (
            <div key={i} className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-left text-xs">
                <tbody>
                  {rows.map((row) => (
                    <tr key={row} className="border-b border-zinc-800/80">
                      {row
                        .split("|")
                        .map((c) => c.trim())
                        .filter(Boolean)
                        .map((cell) => (
                          <td key={cell} className="px-2.5 py-1.5 text-zinc-400">
                            {cell}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("1. ") || /^\d+\./.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l) => (
                <li key={l}>{l.replace(/^(- |\d+\.\s*)/, "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>
              ))}
            </ul>
          );
        }
        const html = block
          .replace(/\*\*(.*?)\*\*/g, "<strong class='text-zinc-100'>$1</strong>")
          .replace(/`([^`]+)`/g, "<code class='rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-emerald-300'>$1</code>");
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-sm font-semibold text-zinc-100">
              {block.replace(/^### /, "")}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-base font-semibold text-zinc-50">
              {block.replace(/^## /, "")}
            </h2>
          );
        }
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
        );
      })}
    </div>
  );
}

export function ToolingAcademy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useStoreHydrated();
  const isDoneFn = useProgressStore((s) => s.isDone);
  const firstSlug = flattenToolingTopics()[0]!.slug;
  const topicSlug = searchParams.get("topic") || firstSlug;
  const found = findToolingTopic(topicSlug) ?? findToolingTopic(firstSlug)!;
  const { section, topic } = found;

  const [query, setQuery] = useState("");
  const [practiceDone, setPracticeDone] = useState<Record<string, boolean>>({});
  const [hintsOpen, setHintsOpen] = useState(false);

  const searchIndex = useMemo(() => developerToolingSearchIndex(), []);
  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((item) => item.keywords.some((k) => k.includes(q)) || item.title.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, searchIndex]);

  const challenges = listDeveloperToolingChallenges(topic.slug);
  const topics = flattenToolingTopics();
  const topicIndex = topics.findIndex((t) => t.slug === topic.slug);
  const nextTopic = topics[topicIndex + 1];
  const prevTopic = topics[topicIndex - 1];

  const selectTopic = (slug: string) => {
    setPracticeDone({});
    setHintsOpen(false);
    router.replace(CURRICULUM_ROUTES.moduleHub("developer-tooling", slug), {
      scroll: false,
    });
  };

  const completedTopics = hydrated
    ? topics.filter((t) => {
        const cs = listDeveloperToolingChallenges(t.slug);
        if (!cs.length) return false;
        return cs.every((c) =>
          isDoneFn(
            curriculumChallengeEntityId("developer-tooling", {
              weekId: 0,
              topicSlug: t.slug,
              lesson: c.lesson,
            })
          )
        );
      }).length
    : 0;
  const progressPct = Math.round((completedTopics / topics.length) * 100);

  return (
    <div className="flex h-full min-h-0 gap-0 overflow-hidden">
      <aside className="flex w-[280px] shrink-0 flex-col border-r border-zinc-800 bg-[#0a0a0b]">
        <div className="border-b border-zinc-800 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500/80">
            Developer Tooling Academy
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-100">
            {completedTopics}/{topics.length} topics · {progressPct}%
          </p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-900">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute top-2.5 left-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search git push, stash…"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pr-2 pl-8 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
            />
            {searchHits.length > 0 ? (
              <div className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl">
                {searchHits.map((hit) => (
                  <button
                    key={hit.id}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-zinc-900"
                    onClick={() => {
                      setQuery("");
                      selectTopic(hit.topicSlug);
                    }}
                  >
                    <span className="text-zinc-200">{hit.title}</span>
                    <span className="mt-0.5 block text-[10px] text-zinc-500">
                      {hit.sectionTitle}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto p-2">
          {DEVELOPER_TOOLING_SECTIONS.map((sec) => (
            <div key={sec.slug} className="mb-3">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                {sec.title}
              </p>
              <ul className="space-y-0.5">
                {sec.topics.map((t) => {
                  const active = t.slug === topic.slug;
                  return (
                    <li key={t.slug}>
                      <button
                        type="button"
                        onClick={() => selectTopic(t.slug)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition",
                          active
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        )}
                      >
                        <Terminal className="h-3 w-3 shrink-0 opacity-70" />
                        <span className="min-w-0 flex-1 truncate">{t.title}</span>
                        {active ? <ChevronRight className="h-3 w-3" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              {section.title}
            </p>
            <h1 className="truncate text-lg font-semibold text-zinc-50">
              {topic.title}
            </h1>
          </div>
          <span className="rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
            {topic.estimatedMinutes} min · {topic.difficulty}
          </span>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-2">
          <div className="min-h-0 space-y-6 overflow-y-auto border-r border-zinc-800/80 px-4 py-5 sm:px-5">
            <section>
              <h2 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                <BookOpen className="h-3.5 w-3.5" /> Explanation
              </h2>
              <Markdownish text={topic.explanation} />
            </section>

            {topic.examples.length ? (
              <section>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Real examples
                </h2>
                <div className="space-y-2">
                  {topic.examples.map((ex) => (
                    <div
                      key={ex.title}
                      className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3"
                    >
                      <p className="text-xs font-medium text-zinc-300">{ex.title}</p>
                      <pre className="mt-1 overflow-x-auto font-mono text-[12px] text-emerald-400">
                        $ {ex.command}
                      </pre>
                      {ex.output ? (
                        <pre className="mt-1 overflow-x-auto font-mono text-[11px] text-zinc-500">
                          {ex.output}
                        </pre>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-rose-400/80">
                  Common mistakes
                </h2>
                <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-400">
                  {topic.commonMistakes.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80">
                  Best practices
                </h2>
                <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-400">
                  {topic.bestPractices.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Cheat sheet
              </h2>
              <p className="mt-1 text-xs text-zinc-400">{topic.cheatSheet.summary}</p>
              <ul className="mt-3 space-y-1.5">
                {topic.cheatSheet.commands.map((c) => (
                  <li
                    key={c.cmd}
                    className="flex gap-2 font-mono text-[12px]"
                  >
                    <span className="shrink-0 text-emerald-400">{c.cmd}</span>
                    <span className="text-zinc-500">{c.desc}</span>
                  </li>
                ))}
              </ul>
              {topic.cheatSheet.recovery?.length ? (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold uppercase text-amber-500/80">
                    Recovery
                  </p>
                  <ul className="mt-1 list-disc pl-4 text-xs text-zinc-500">
                    {topic.cheatSheet.recovery.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Practice tasks
              </h2>
              <ul className="space-y-2">
                {topic.practiceTasks.map((task) => {
                  const done = practiceDone[task.id];
                  return (
                    <li
                      key={task.id}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        done
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                          : "border-zinc-800 bg-zinc-950/40 text-zinc-300"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {done ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border border-zinc-600" />
                        )}
                        <div>
                          <p>{task.prompt}</p>
                          {done ? (
                            <p className="mt-1 text-xs text-emerald-400/90">
                              {task.successMessage}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-2 text-[11px] text-zinc-600">
                Complete tasks in the live terminal on the right.
              </p>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Challenges
                </h2>
                <span className="text-[11px] text-zinc-600">
                  {challenges.length} in this topic
                </span>
              </div>
              <div className="space-y-2">
                {challenges.map((c) => {
                  const entityId = curriculumChallengeEntityId(
                    "developer-tooling",
                    {
                      weekId: 0,
                      topicSlug: c.topicSlug,
                      lesson: c.lesson,
                    }
                  );
                  const done = hydrated && isDoneFn(entityId);
                  return (
                    <Link
                      key={c.id}
                      href={CURRICULUM_ROUTES.moduleChallenge(
                        "developer-tooling",
                        topic.slug,
                        c.id
                      )}
                      className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2.5 transition hover:border-zinc-700"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-200">
                          {c.title}
                        </p>
                        <p className="text-[11px] capitalize text-zinc-500">
                          {c.difficulty} · {c.kind} · {c.minutes} min
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 text-xs font-medium",
                          done ? "text-emerald-400" : "text-zinc-500"
                        )}
                      >
                        {done ? "Solved" : "Open"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <div className="flex flex-wrap gap-2 border-t border-zinc-800 pt-4 pb-8">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevTopic}
                onClick={() => prevTopic && selectTopic(prevTopic.slug)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500"
                disabled={!nextTopic}
                onClick={() => nextTopic && selectTopic(nextTopic.slug)}
              >
                Next topic
              </Button>
            </div>
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-hidden bg-[#0d0d0d] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Interactive terminal
              </p>
              <button
                type="button"
                className="text-[11px] text-zinc-500 hover:text-zinc-300"
                onClick={() => setHintsOpen((v) => !v)}
              >
                {hintsOpen ? "Hide hints" : "Show hints"}
              </button>
            </div>
            {hintsOpen ? (
              <ul className="list-disc rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-2 text-xs text-zinc-500">
                {topic.practiceTasks.flatMap((t) =>
                  t.expectCommandIncludes.map((h) => (
                    <li key={`${t.id}-${h}`}>Try including: {h}</li>
                  ))
                )}
              </ul>
            ) : null}
            <TerminalSimulator
              className="min-h-0 flex-1"
              onCommand={(command) => {
                for (const task of topic.practiceTasks) {
                  if (
                    task.expectCommandIncludes.every((frag) =>
                      command.toLowerCase().includes(frag.toLowerCase())
                    )
                  ) {
                    setPracticeDone((prev) => ({ ...prev, [task.id]: true }));
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
