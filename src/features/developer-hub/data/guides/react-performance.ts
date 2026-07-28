import type { HubSection } from "../../types";
import { sec } from "./_helpers";

export const reactPerformanceMeta = {
  overviewBody: `React performance work that skips measurement is guesswork that usually adds complexity and bugs. The job is to find the actual commit or render that hurts users, fix the root cause — state placement, list size, waterfall fetch — and ignore memoization theater.

This guide covers profiling workflow, list virtualization, where state should live, when memo/useMemo/useCallback help vs hurt, and concurrent features (Suspense, transitions, defer) used for real UX wins — not resume keywords.`,
  objectives: [
    "Profile with React DevTools Profiler and browser Performance tab before optimizing",
    "Fix list and re-render problems with virtualization and state colocation",
    "Apply memoization only when Profiler shows expensive child re-renders",
    "Use useTransition and useDeferredValue for intentional UI prioritization",
  ],
  prerequisites: [
    "Built interactive React apps with hooks",
    "Basic understanding of component re-renders and props",
    "Chrome or Firefox devtools familiarity",
  ],
  takeaways: [
    "Measure first — Profiler flamegraph shows who re-rendered and why",
    "Lift state down — colocate state with consumers; context splits by update frequency",
    "Virtualize lists > few hundred DOM nodes; pagination beats memo on 10k rows",
    "memo/useMemo/useCallback are tools, not defaults — stale closure risk is real",
  ],
};

export const reactPerformanceSections: HubSection[] = [
  sec(
    "measure-first",
    "1. Measure first — Profiler and metrics",
    `User-perceived performance:
• INP / interaction latency — click to paint
• LCP — largest contentful paint
• TTI — time to interactive (less emphasized with modern hydration)

React DevTools Profiler:
• Record interaction → see which components committed, duration, why (props/state/context changed)
• "Ranked" view — find slowest components
• "Highlight updates" — visual flash on re-render (great for debugging unnecessary renders)

Browser Performance tab:
• Long tasks >50ms block main thread
• Layout thrashing — read/write DOM interleaved

Before optimizing, answer:
1. Which interaction is slow?
2. Is it render, layout, network, or JS parse?
3. How many components re-rendered on that interaction?

Set budget: e.g., filter dropdown must open <100ms on mid-tier mobile.`,
    {
      checklist: [
        "Profiler recording for reported slow interaction",
        "Root cause categorized: render vs network vs layout",
        "Baseline metric captured before change",
      ],
    }
  ),
  sec(
    "state-placement",
    "2. State placement — colocation and splitting",
    `Most re-render problems are state living too high.

Colocate: if only Modal uses isOpen, state in Modal — not in App root.

Lift down (reverse of lift up): move state to leaf that needs it; pass callbacks up only if required.

Context pitfalls:
• One AuthContext with user + theme + cart → any update re-renders all consumers
• Split: UserContext (rare updates), ThemeContext, CartContext
• Or use selector libraries (useSyncExternalStore, Zustand selectors, Jotai atoms)

URL as state: filters, pagination, tabs in searchParams — shareable and avoids prop drilling.

Derived state anti-pattern: storing filteredList in state when filter + list suffice — double source of truth.

Key rule: when Profiler shows 200 components on a keystroke, find the shared ancestor state — that's your bug.`,
    {
      bullets: [
        "State in lowest component that needs it",
        "Split context by update frequency",
        "Derive during render; don't duplicate in useState",
      ],
    }
  ),
  sec(
    "lists",
    "3. Lists and virtualization",
    `Rendering 5,000 DOM rows kills scroll and memory — memo won't fix 5,000 nodes.

Virtualization (@tanstack/react-virtual, react-window):
• Render only visible rows + overscan buffer
• Fixed or measured row heights — variable height needs measure pass

Pagination / infinite scroll:
• Server cursor pagination for data volume
• Client virtualizes current window

Keys: stable unique id — never array index on reorderable/filtered lists.

Expensive row: isolate Row component; if Profiler shows row re-renders on unrelated parent state, memo(Row) with stable props.

Avoid inline object/array props to memoized children:
<Row style={{ color: 'red' }} /> — new object every render defeats memo.`,
    {
      checklist: [
        "Lists >500 visible items virtualized or paginated",
        "Stable key={item.id} on list items",
        "Row component profiled independently",
      ],
    }
  ),
  sec(
    "memo-myths",
    "4. memo, useMemo, useCallback — myths and real uses",
    `memo(Component) — skips re-render if props shallow-equal. Use when:
• Profiler shows child re-renders expensive AND props often unchanged
• Child is large subtree under frequently updating parent

useMemo — cache expensive computation. Use when:
• Computation measurably >1ms and inputs change rarely
• Referential equality needed for downstream memo/deps

useCallback — stable function reference. Use when:
• Passed to memoized child or dependency of useEffect that should not fire every render

When NOT to use:
• Cheap components — memo comparison costs more than render
• Default on everything — noise, stale bugs, harder reads
• "Fix" context re-renders — fix context split instead

React Compiler (when enabled): auto-memoization — manual memo less needed; still measure.

Stale closure: useCallback with empty deps capturing old state — classic bug.`,
    {
      bullets: [
        "Memo applied only after Profiler proof",
        "Stable callbacks only where deps require it",
        "Fix context/state before blanket memo",
      ],
    }
  ),
  sec(
    "data-fetching",
    "5. Render waterfalls and data fetching",
    `Waterfall: Parent fetch → render child → child fetch → serial latency.

Fixes:
• Fetch in parallel at route level (Next.js Server Component awaits Promise.all)
• Lift data requirements to loader; pass data down
• TanStack Query prefetchQuery on hover/route intent

Client fetching:
• useQuery with staleTime avoids refetch storm
• Defer non-critical queries until after first paint

Suspense boundaries (React 18+ / RSC):
• Stream sections independently
• Don't Suspense-wrap entire app — granular boundaries

Avoid: useEffect chain fetch A then fetch B — rewrite parallel or single endpoint.`,
    {
      checklist: [
        "Independent fetches parallelized",
        "No useEffect fetch waterfalls on critical path",
        "Query staleTime tuned to freshness needs",
      ],
    }
  ),
  sec(
    "concurrent",
    "6. Concurrent features — when they help",
    `useTransition — mark state updates non-urgent (filtering large list, tab switch):
const [isPending, startTransition] = useTransition()
startTransition(() => setFilter(q))
UI stays responsive; show pending indicator on stale results.

useDeferredValue — defer rendering expensive derived output:
const deferredQuery = useDeferredValue(query)
Pass deferredQuery to heavy list — types during fast input.

Suspense — async component trees; pair with error boundaries.

Not magic:
• Doesn't reduce total work — reprioritizes
• Useless if problem is 5000 DOM nodes — virtualize first

Server Components — zero client JS for static sections; biggest win for dashboard shells.`,
    {
      bullets: [
        "useTransition for heavy filter/sort updates",
        "Virtualize before transition on huge lists",
        "RSC for data-heavy static regions",
      ],
    }
  ),
  sec(
    "bundle",
    "7. Bundle and hydration cost",
    `Performance is not only render — parse and hydration matter.

• Dynamic import(): const Chart = lazy(() => import('./Chart'))
• Defer below-fold widgets
• Analyze bundle: @next/bundle-analyzer, source-map-explorer
• Tree-shake: import { debounce } from 'lodash-es/debounce' not whole lodash

Next.js:
• Server Components default — client only for interactivity
• next/dynamic with ssr: false for client-only charts/maps

Third-party scripts: lazyOnload, Partytown for analytics if needed.

Hydration mismatch forces client rework — fix before optimizing memo.`,
  ),
  sec(
    "workflow",
    "8. Performance fix workflow",
    `1. Reproduce on target device/network throttling
2. Profiler record → identify commit duration and component count
3. Classify: state placement | list size | fetch waterfall | bundle | layout
4. Apply smallest fix; re-profile
5. Add regression guard if possible (Lighthouse CI, React scan in dev)

Red flags in PR review:
• memo added without Profiler note
• useMemo around trivial filter
• Context value={{ user, setUser }} new object every render

Ship performance fixes with before/after numbers — "filter interaction 340ms → 45ms" — or don't claim improvement.`,
    {
      checklist: [
        "Before/after Profiler or metric in PR description",
        "Fix addresses root cause class",
        "No memo/useMemo without justification",
      ],
    }
  ),
];
