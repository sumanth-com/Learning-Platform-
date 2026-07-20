# Prathyu Academy

Premium SaaS-level learning platform for Java Backend + AI career roadmap.

## Architecture

**Data-driven curriculum engine** — all learning content lives in JSON files. UI pages are generic renderers that never hardcode week data.

```
src/curriculum/
├── weeks/week-1.json    ← Add week content here
├── manifest.json        ← Register week slug
├── registry.ts          ← Import new week (1 line)
├── types.ts             ← Schema definitions
└── entities.ts          ← Progress tracking IDs

src/store/
└── use-progress-store.ts  ← User progress only (localStorage)

src/lib/
└── progress-engine.ts     ← Computes all stats from curriculum + progress
```

## Adding Week 2

1. Copy `src/curriculum/weeks/week-1.json` → `week-2.json` and edit content
2. Add `"week-2"` to `manifest.json`
3. Import in `registry.ts`:

```typescript
import week2 from "./weeks/week-2.json";
// Add to WEEK_MODULES: "week-2": week2 as CurriculumWeekDefinition,
```

No UI changes required. Roadmap, Dashboard, and all 12 pages update automatically.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages (all data-driven)

| Page | Source Section |
|------|----------------|
| Dashboard | Aggregated progress |
| Roadmap | All weeks from registry |
| Week Details | All sections for one week |
| Topics | `topics[]` |
| Practice | `programmingQuestions[]` |
| Projects | `projects[]` |
| AI Skills | `aiSkill` |
| GitHub Tasks | `githubTasks` |
| Interview | `interviewQuestions[]` |
| Deliverables | `deliverables[]` |
| Analytics | Computed from progress engine |

## Tech Stack

Next.js · TypeScript · Tailwind · shadcn/ui · Framer Motion · Recharts · Zustand · TanStack Query

## Keyboard Shortcuts

`Cmd/Ctrl + 1-0` — Navigate pages
