# Curriculum Engine

Prathyu Academy loads all learning content from structured JSON files. **No week data is hardcoded in UI code.**

## Adding a New Week

1. Create `src/curriculum/weeks/week-N.json` following the schema in `week-1.json`
2. Add `"week-N"` to `src/curriculum/manifest.json`
3. Import and register in `src/curriculum/registry.ts`:

```typescript
import weekN from "./weeks/week-N.json";

const WEEK_MODULES = {
  // ...
  "week-N": weekN as CurriculumWeekDefinition,
};
```

The app automatically:
- Creates a roadmap card
- Populates Day Planner, Topics, Programming Questions, Projects, AI Skills, GitHub Tasks, Interview Questions, and Deliverables pages
- Updates Dashboard stats and Analytics charts

## JSON Schema Sections

| Section | Pages |
|---------|-------|
| `days` | Week Details → Day Planner |
| `topics` | Topics page |
| `programmingQuestions` | Practice page (grouped by category) |
| `projects` | Projects page |
| `aiSkill` | AI Skills page |
| `githubTasks` | GitHub Tasks page |
| `interviewQuestions` | Interview page |
| `deliverables` | Deliverables page + Dashboard |

## Progress

User progress is stored separately in localStorage (`prathyu-academy-v2`) keyed by entity IDs from the JSON files. Checkbox completion instantly updates Dashboard, Roadmap, Week progress, and Analytics.

## Unlimited Weeks

There is no hardcoded week limit. The roadmap, dashboard, and all pages iterate over `getCurriculumWeeks()`.
