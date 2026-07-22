export type NextjsDifficulty = "beginner" | "intermediate" | "advanced";

export type NextjsTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: NextjsDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** Next.js APIs / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type NextjsSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: NextjsTopicDef[];
};

function t(partial: NextjsTopicDef): NextjsTopicDef {
  return partial;
}

export const NEXTJS_ACADEMY_SECTIONS: NextjsSectionDef[] = [
  {
    slug: "nextjs-introduction",
    title: "Next.js Introduction",
    description: "What Next.js is, how it extends React, scaffolding projects, and understanding the default folder layout.",
    topics: [
      t({
        slug: "what-is-nextjs",
        title: "What is Next.js?",
        summary: "Next.js is a React framework for production apps with routing, rendering, and data-fetching built in.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["nextjs", "framework", "react", "full-stack"],
        challengeWeight: 4,
        explanation:
          "Next.js is a React framework maintained by Vercel that adds file-based routing, server rendering, static generation, API routes, image optimization, and deployment tooling on top of React. You still write React components, but Next.js decides how and where they render — on the server, at build time, or in the browser. It removes the need to manually configure webpack, routing, and SSR yourself. Next.js is opinionated about project structure (the app/ directory) but flexible about rendering strategies per route.",
        a11yNotes: [
          "Next.js does not replace semantic HTML — use proper landmarks and ARIA in your components.",
          "Server-rendered HTML improves first paint for screen readers compared to blank SPA shells.",
        ],
        commonMistakes: [
          "Treating Next.js as a replacement for React instead of a layer on top of it",
          "Assuming every Next.js page must be server-rendered",
          "Confusing Next.js with Node.js — Next.js runs on Node (or Edge) but is a frontend framework",
        ],
        bestPractices: [
          "Start with the App Router (app/) for new projects",
          "Learn React fundamentals first — Next.js builds on them",
          "Read the official Next.js docs for version-specific APIs",
        ],
        interviewQuestions: [
          "What problems does Next.js solve that plain React does not?",
          "How does Next.js differ from Create React App or Vite?",
          "What rendering strategies does Next.js support?",
        ],
        cheatSheet: [
          { tag: "Next.js", desc: "React framework with routing, SSR, and built-in optimizations" },
          { tag: "App Router", desc: "File-system routing via the app/ directory" },
          { tag: "RSC", desc: "React Server Components — render on server by default" },
        ],
      }),
      t({
        slug: "next-vs-react",
        title: "Next.js vs React",
        summary: "React is a UI library; Next.js is a full framework that adds routing, rendering modes, and server features.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["nextjs", "react", "comparison", "framework"],
        challengeWeight: 3,
        explanation:
          "React alone handles component rendering and state. You add React Router for navigation, fetch data in useEffect, and configure a bundler yourself. Next.js bundles these concerns: file-based routes replace React Router, Server Components fetch data on the server without useEffect, and next/image and next/font handle asset optimization. You can deploy a React SPA to any static host; Next.js apps typically need a Node-compatible or serverless platform (Vercel, Docker, etc.) to leverage SSR and API routes. Both use JSX and the same component model.",
        a11yNotes: [
          "Hybrid rendering in Next.js can improve time-to-content for assistive technology users.",
          "Client-side navigation still requires focus management on route changes.",
        ],
        commonMistakes: [
          "Rewriting all React knowledge — most React patterns still apply in Next.js",
          "Using react-router-dom inside a Next.js app instead of the built-in router",
          "Assuming you cannot use npm packages that work in React",
        ],
        bestPractices: [
          "Use Next.js Link and useRouter instead of react-router-dom",
          "Leverage server features (fetch in Server Components) instead of client-only patterns",
          "Keep shared UI logic in reusable React components usable in any React project",
        ],
        interviewQuestions: [
          "When would you choose plain React over Next.js?",
          "What does Next.js add on top of React?",
          "Can you use third-party React libraries in Next.js?",
        ],
        cheatSheet: [
          { tag: "React", desc: "UI library — components, hooks, state" },
          { tag: "Next.js", desc: "Framework — routing, SSR, API routes, optimizations" },
          { tag: "use client", desc: "Directive to opt a component into client-side React" },
        ],
      }),
      t({
        slug: "create-next-app",
        title: "Create Next App",
        summary: "Scaffold a new Next.js project with create-next-app and choose TypeScript, ESLint, Tailwind, and App Router options.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["create-next-app", "scaffold", "typescript", "tailwind"],
        challengeWeight: 3,
        explanation:
          "Run npx create-next-app@latest to bootstrap a project. The CLI prompts for TypeScript, ESLint, Tailwind CSS, src/ directory, App Router, and import alias (@/*). The result includes app/layout.tsx (root layout), app/page.tsx (home route), next.config.ts, and package.json scripts: dev (next dev), build (next build), start (next start). Turbopack is available as next dev --turbopack for faster local development. Node.js 18.18+ is required for current Next.js versions.",
        a11yNotes: [],
        commonMistakes: [
          "Choosing the Pages Router for new projects when App Router is the recommended default",
          "Skipping TypeScript and later struggling with untyped props and fetch responses",
          "Running next start without running next build first",
        ],
        bestPractices: [
          "Enable TypeScript and ESLint for new projects",
          "Use the App Router option unless maintaining a legacy Pages Router codebase",
          "Commit the generated project before making large structural changes",
        ],
        interviewQuestions: [
          "What does create-next-app set up out of the box?",
          "What is the difference between next dev and next start?",
          "Why choose the App Router over the Pages Router?",
        ],
        cheatSheet: [
          { tag: "npx create-next-app@latest", desc: "Scaffold a new Next.js project" },
          { tag: "next dev", desc: "Start the development server on port 3000" },
          { tag: "next build", desc: "Create an optimized production build" },
        ],
      }),
      t({
        slug: "project-structure",
        title: "Project Structure",
        summary: "Understand app/, public/, next.config, and how files in the app directory map to routes and layouts.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["structure", "app-directory", "layout", "config"],
        challengeWeight: 4,
        explanation:
          "A typical App Router project has app/ (routes and layouts), public/ (static files served at /), next.config.ts (framework configuration), and optionally src/app/ if using the src directory. Inside app/, page.tsx defines a route UI, layout.tsx wraps child routes, loading.tsx shows a loading skeleton, and error.tsx handles errors. Route segments mirror URL paths: app/blog/[slug]/page.tsx maps to /blog/:slug. Colocated components can live in app/ or a separate components/ folder. node_modules/ and .next/ are generated and should not be edited.",
        a11yNotes: [
          "Place skip-navigation links in the root layout so they appear on every page.",
          "Keep public/ assets descriptive — use meaningful alt text when referencing images in components.",
        ],
        commonMistakes: [
          "Putting page components outside app/ without a route file pointing to them",
          "Editing files inside .next/ or expecting changes there to persist",
          "Naming a route file Page.tsx instead of page.tsx (routing is case-sensitive on Linux)",
        ],
        bestPractices: [
          "Use src/app/ if you prefer separating source from config at the root",
          "Colocate route-specific components near their page or in components/",
          "Keep next.config changes minimal and document non-default settings",
        ],
        interviewQuestions: [
          "What is the purpose of app/layout.tsx?",
          "How does a folder name in app/ relate to the URL?",
          "Where do static assets like favicons belong?",
        ],
        cheatSheet: [
          { tag: "app/page.tsx", desc: "UI for the / route" },
          { tag: "app/layout.tsx", desc: "Shared wrapper for a route segment and its children" },
          { tag: "public/", desc: "Static files served from the site root" },
        ],
      }),
    ],
  },
  {
    slug: "app-router",
    title: "App Router",
    description: "File-system routing with the app directory, layouts, templates, pages, and client-side navigation.",
    topics: [
      t({
        slug: "app-directory",
        title: "The app Directory",
        summary: "The app directory uses folders and special files to define routes, layouts, and UI boundaries.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["app-router", "routing", "file-system", "segments"],
        challengeWeight: 4,
        explanation:
          "The App Router (introduced in Next.js 13) uses the app/ folder for routing. Each folder is a route segment. Special files define UI: page.tsx (unique UI for a route), layout.tsx (shared UI that persists across navigations), template.tsx (re-mounted layout on navigation), loading.tsx, error.tsx, not-found.tsx, and route.ts (API route handler). Nested folders create nested URLs: app/dashboard/settings/page.tsx → /dashboard/settings. Route groups use parentheses — app/(marketing)/about/page.tsx → /about without adding a URL segment.",
        a11yNotes: [
          "Each page.tsx should render a single main landmark or be wrapped by one in a parent layout.",
          "Use not-found.tsx with clear heading text for missing routes.",
        ],
        commonMistakes: [
          "Forgetting that only page.tsx makes a route publicly accessible",
          "Using route groups incorrectly and expecting them to appear in the URL",
          "Mixing Pages Router (pages/) and App Router (app/) without understanding precedence",
        ],
        bestPractices: [
          "Use route groups (folders) to organize layouts without affecting URLs",
          "Colocate loading.tsx and error.tsx with the routes they serve",
          "Prefer one layout.tsx per segment for shared chrome (nav, footer)",
        ],
        interviewQuestions: [
          "What special files can exist inside an app/ route segment?",
          "How do route groups work in the App Router?",
          "What is the difference between layout.tsx and template.tsx?",
        ],
        cheatSheet: [
          { tag: "page.tsx", desc: "Required file to expose a route publicly" },
          { tag: "(group)", desc: "Route group folder — organizes without URL segment" },
          { tag: "route.ts", desc: "API endpoint for the segment path" },
        ],
      }),
      t({
        slug: "layouts-and-templates",
        title: "Layouts and Templates",
        summary: "Layouts persist state across navigations; templates remount on every route change within the segment.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["layout", "template", "nested", "persistent"],
        challengeWeight: 4,
        explanation:
          "layout.tsx wraps child routes and preserves state when navigating between sibling pages — ideal for nav bars, sidebars, and providers that should not reset. Layouts can nest: app/layout.tsx wraps everything, app/dashboard/layout.tsx wraps dashboard routes. template.tsx is like a layout but creates a new instance on navigation, useful for enter animations or resetting form state. Both receive { children } and optional params. The root layout must include <html> and <body> tags.",
        a11yNotes: [
          "Put persistent skip links and site navigation in the root layout.",
          "Ensure focus is not trapped inside a layout region after client navigation.",
        ],
        commonMistakes: [
          "Putting useState that should reset on navigation inside a layout instead of a template or page",
          "Omitting html and body from the root layout",
          "Fetching data in every nested layout when one parent fetch would suffice",
        ],
        bestPractices: [
          "Use layouts for persistent UI chrome and shared providers",
          "Use templates when you need remount behavior on navigation",
          "Keep root layout minimal — fonts, metadata, global styles only",
        ],
        interviewQuestions: [
          "When does a layout re-render versus remount?",
          "Why must the root layout include html and body?",
          "Give a use case for template.tsx over layout.tsx.",
        ],
        cheatSheet: [
          { tag: "layout.tsx", desc: "Persistent wrapper — state survives navigation" },
          { tag: "template.tsx", desc: "Remounts on navigation within the segment" },
          { tag: "{ children }", desc: "Slot where child layouts or pages render" },
        ],
      }),
      t({
        slug: "pages-and-routing",
        title: "Pages and Routing",
        summary: "Each page.tsx file maps to a URL segment and can be static, dynamic, or generated at request time.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["pages", "routing", "segments", "dynamic"],
        challengeWeight: 4,
        explanation:
          "A page is the leaf UI of a route, exported as a default function from page.tsx. URLs are built from folder names: app/products/page.tsx → /products. Dynamic segments use brackets: app/products/[id]/page.tsx → /products/123. Pages are Server Components by default — they can async fetch data directly. Optional exports configure rendering: export const dynamic = 'force-static' or revalidate for caching behavior. Parallel routes (@modal) and intercepting routes ((..)photo) enable advanced UI patterns like modals over existing pages.",
        a11yNotes: [
          "Set a unique page title via metadata or a heading h1 per page.",
          "Dynamic route pages should handle loading and not-found states accessibly.",
        ],
        commonMistakes: [
          "Exporting a named component instead of default from page.tsx",
          "Using useRouter from next/navigation in a Server Component",
          "Creating page.tsx in every folder when some folders are layout-only segments",
        ],
        bestPractices: [
          "Default export an async function for data-fetching pages",
          "Use generateStaticParams for known dynamic paths at build time",
          "Colocate route-specific types and helpers near the page file",
        ],
        interviewQuestions: [
          "How do you create a dynamic route in the App Router?",
          "Can a page.tsx be an async function?",
          "What is the difference between dynamic and revalidate exports?",
        ],
        cheatSheet: [
          { tag: "[slug]", desc: "Dynamic segment folder — e.g. app/blog/[slug]/" },
          { tag: "page.tsx", desc: "Default export defines the route UI" },
          { tag: "generateStaticParams", desc: "Pre-render dynamic paths at build time" },
        ],
      }),
      t({
        slug: "linking-and-navigation",
        title: "Linking and Navigation",
        summary: "Use Link for prefetching client navigations and navigation hooks for programmatic routing.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["link", "navigation", "router", "prefetch"],
        challengeWeight: 3,
        explanation:
          "Import Link from next/link for declarative navigation: <Link href=\"/about\">About</Link>. Link prefetches routes in the viewport by default in production, making navigations feel instant. For programmatic navigation in Client Components, use useRouter from next/navigation: router.push('/dashboard'), router.replace('/login'), router.back(). usePathname() returns the current path; useSearchParams() reads query strings. Scroll behavior is handled automatically; pass scroll={false} to Link to disable scroll-to-top.",
        a11yNotes: [
          "Link renders an anchor — ensure link text is descriptive.",
          "After programmatic navigation, move focus to main content for screen reader users.",
        ],
        commonMistakes: [
          "Using <a> instead of Link for internal routes, causing full page reloads",
          "Importing useRouter from next/router (Pages Router) instead of next/navigation",
          "Calling useSearchParams in a Server Component without wrapping in Suspense",
        ],
        bestPractices: [
          "Use Link for all internal navigation",
          "Use router.replace for redirects that should not add history entries",
          "Wrap components using useSearchParams in Suspense boundaries",
        ],
        interviewQuestions: [
          "How does Next.js Link prefetching work?",
          "What is the difference between router.push and router.replace?",
          "Why must useSearchParams be used inside Suspense in some cases?",
        ],
        cheatSheet: [
          { tag: "next/link", desc: "Client-side navigation with prefetch" },
          { tag: "useRouter()", desc: "Programmatic navigation in Client Components" },
          { tag: "usePathname()", desc: "Returns the current URL pathname" },
        ],
      }),
    ],
  },
  {
    slug: "rendering",
    title: "Rendering",
    description: "Server Components, Client Components, when to opt into the client, and streaming with Suspense.",
    topics: [
      t({
        slug: "server-components",
        title: "React Server Components",
        summary: "Server Components render on the server, send HTML to the client, and never ship their JavaScript bundle.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["rsc", "server-components", "rendering", "async"],
        challengeWeight: 5,
        explanation:
          "In the App Router, components are Server Components by default. They run only on the server, can be async, and can directly access databases, file systems, and secrets without exposing them to the browser. They do not support useState, useEffect, or browser APIs. Server Components render to a special payload that the client merges into the tree. They can import Client Components (which become boundaries) but not vice versa. This reduces JavaScript sent to the browser and keeps data fetching colocated with UI.",
        a11yNotes: [
          "Server-rendered HTML is available on first paint — good for SEO and assistive tech.",
          "Interactive widgets still need Client Components with proper keyboard support.",
        ],
        commonMistakes: [
          "Adding 'use client' to every file unnecessarily, losing RSC benefits",
          "Trying to use useState or useEffect in a Server Component",
          "Importing a Server Component into a Client Component directly",
        ],
        bestPractices: [
          "Keep components as Server Components unless they need interactivity or browser APIs",
          "Fetch data in Server Components close to where it is displayed",
          "Pass serializable props from Server to Client Components",
        ],
        interviewQuestions: [
          "What are the benefits of React Server Components?",
          "What hooks and APIs are unavailable in Server Components?",
          "How do Server and Client Components compose together?",
        ],
        cheatSheet: [
          { tag: "Server Component", desc: "Default — renders on server, zero client JS" },
          { tag: "async page", desc: "Server Component page can await fetch directly" },
          { tag: "RSC payload", desc: "Streamed render output merged on the client" },
        ],
      }),
      t({
        slug: "client-components",
        title: "Client Components",
        summary: "Add the use client directive to components that need state, effects, event handlers, or browser APIs.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["client-components", "use-client", "interactivity", "hooks"],
        challengeWeight: 4,
        explanation:
          "Client Components are marked with 'use client' at the top of the file. They behave like traditional React components: useState, useEffect, onClick, and browser APIs work. The directive applies to the module and its imports (unless those imports are Server Components passed as children). Client Components are still pre-rendered on the server for HTML, then hydrated in the browser. Place 'use client' as low in the tree as possible — wrap only the interactive leaf, not the entire page.",
        a11yNotes: [
          "Client Components with forms need labels, error announcements, and keyboard support.",
          "Do not rely on mouse-only interactions in hydrated components.",
        ],
        commonMistakes: [
          "Placing 'use client' in layout.tsx and forcing the entire app client-side",
          "Importing server-only modules like fs into a Client Component",
          "Assuming Client Components skip server rendering entirely",
        ],
        bestPractices: [
          "Push 'use client' to the smallest subtree that needs interactivity",
          "Pass Server Component output as children to Client Components",
          "Extract static markup into Server Components above the client boundary",
        ],
        interviewQuestions: [
          "What does the use client directive do?",
          "Are Client Components still server-rendered?",
          "Can a Client Component import a Server Component?",
        ],
        cheatSheet: [
          { tag: "'use client'", desc: "Marks a module as a Client Component boundary" },
          { tag: "hydration", desc: "Attaching event listeners to server-rendered HTML" },
          { tag: "children prop", desc: "Pattern to slot Server Components into Client wrappers" },
        ],
      }),
      t({
        slug: "when-to-use-client",
        title: "When to Use Client Components",
        summary: "Opt into the client only for interactivity, browser APIs, and hooks — keep everything else on the server.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["boundaries", "interactivity", "composition", "patterns"],
        challengeWeight: 4,
        explanation:
          "Use Client Components when you need: event listeners (onClick, onChange), React state (useState, useReducer), lifecycle effects (useEffect, useLayoutEffect), browser-only APIs (localStorage, geolocation, window), or custom hooks that depend on the above. Keep data fetching, static markup, and heavy libraries that only run on the server in Server Components. A common pattern: Server Component page fetches data and passes it as props to a small Client Component for the interactive widget. Third-party UI libraries that use hooks often need a thin 'use client' wrapper.",
        a11yNotes: [
          "Server-render static content; hydrate only interactive controls.",
          "Ensure client-only widgets degrade gracefully if JavaScript fails.",
        ],
        commonMistakes: [
          "Making a whole page client-side because one button needs onClick",
          "Fetching data in useEffect when a Server Component could fetch on the server",
          "Wrapping every third-party component at the page level instead of a dedicated wrapper",
        ],
        bestPractices: [
          "Default to Server Components; add client boundaries surgically",
          "Create small Client Component wrappers for libraries that need hooks",
          "Fetch on the server, interact on the client",
        ],
        interviewQuestions: [
          "List scenarios that require a Client Component.",
          "How do you minimize client JavaScript in a Next.js app?",
          "Describe the server wrapper + client leaf pattern.",
        ],
        cheatSheet: [
          { tag: "onClick", desc: "Event handlers require Client Components" },
          { tag: "useEffect fetch", desc: "Often replaceable with server-side fetch" },
          { tag: "client wrapper", desc: "Thin use client file around a library component" },
        ],
      }),
      t({
        slug: "streaming-suspense-intro",
        title: "Streaming and Suspense",
        summary: "Stream UI progressively with Suspense boundaries so slow data does not block the entire page.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["streaming", "suspense", "loading", "ssr"],
        challengeWeight: 5,
        explanation:
          "Next.js streams Server Component output as it resolves. Wrap slow async components in <Suspense fallback={<Skeleton />}> to show fallback UI immediately while data loads. app/loading.tsx automatically wraps a page in Suspense. Streaming improves Time to First Byte and perceived performance — users see shell and nav before heavy queries finish. Nested Suspense boundaries let independent sections load in parallel. React 19 improves Suspense for data fetching; in Next.js, async Server Components inside Suspense trigger streaming naturally.",
        a11yNotes: [
          "Loading fallbacks should not look like final content — use aria-busy on loading regions.",
          "Announce significant async content updates if they replace placeholder text.",
        ],
        commonMistakes: [
          "Awaiting all data at the page top level, blocking the entire stream",
          "Using a blank fallback instead of a meaningful skeleton",
          "Forgetting that loading.tsx only applies to its route segment",
        ],
        bestPractices: [
          "Split pages into independent async sections with Suspense",
          "Use loading.tsx for route-level fallbacks and inline Suspense for sections",
          "Keep fallbacks visually similar to final content to reduce layout shift",
        ],
        interviewQuestions: [
          "How does streaming SSR work in Next.js?",
          "What is the role of Suspense in the App Router?",
          "When should you use loading.tsx versus inline Suspense?",
        ],
        cheatSheet: [
          { tag: "<Suspense>", desc: "Shows fallback while async children resolve" },
          { tag: "loading.tsx", desc: "Route-level Suspense fallback file" },
          { tag: "streaming", desc: "Send HTML chunks as server work completes" },
        ],
      }),
    ],
  },
  {
    slug: "data",
    title: "Data",
    description: "Fetching in Server Components, caching and revalidation, Route Handlers, and Server Actions.",
    topics: [
      t({
        slug: "fetching-in-server-components",
        title: "Fetching in Server Components",
        summary: "Server Components can await fetch or database calls directly without useEffect or loading state boilerplate.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["fetch", "data-fetching", "async", "server"],
        challengeWeight: 5,
        explanation:
          "In an async Server Component, await fetch('https://api.example.com/posts') or await db.query(...) directly in the component body. No useEffect, no isLoading flag — Suspense or loading.tsx handles the waiting UI. fetch in Server Components is extended by Next.js with caching options: { cache: 'force-cache' } (default static), { cache: 'no-store' } (always fresh), or next: { revalidate: 60 }. You can parallelize with Promise.all across components or queries. Errors can be caught with try/catch or error.tsx boundaries.",
        a11yNotes: [
          "Show accessible loading and error states via loading.tsx and error.tsx.",
          "Do not expose sensitive API keys — they stay on the server in Server Components.",
        ],
        commonMistakes: [
          "Using useEffect to fetch in a page that could be a Server Component",
          "Assuming fetch always hits the network — default caching may return stale data",
          "Sequential awaits when parallel fetches would be faster",
        ],
        bestPractices: [
          "Colocate fetch with the component that displays the data",
          "Use Promise.all for independent parallel requests",
          "Choose cache options intentionally per request",
        ],
        interviewQuestions: [
          "How do you fetch data in the App Router without useEffect?",
          "What caching options does Next.js add to fetch?",
          "How do you handle fetch errors in Server Components?",
        ],
        cheatSheet: [
          { tag: "await fetch()", desc: "Direct async fetch in Server Components" },
          { tag: "cache: 'no-store'", desc: "Opt out of caching for dynamic data" },
          { tag: "Promise.all", desc: "Parallelize independent server fetches" },
        ],
      }),
      t({
        slug: "caching-and-revalidate",
        title: "Caching and Revalidation",
        summary: "Control static, dynamic, and time-based revalidation with fetch options, route config, and revalidatePath.",
        estimatedMinutes: 20,
        difficulty: "advanced",
        keywords: ["cache", "revalidate", "isr", "static"],
        challengeWeight: 5,
        explanation:
          "Next.js caches fetch results and full route renders by default in production. Use fetch(url, { next: { revalidate: 3600 } }) for Incremental Static Regeneration — rebuild at most every hour. export const revalidate = 60 on a page sets segment-level revalidation. { cache: 'no-store' } or export const dynamic = 'force-dynamic' makes a route always dynamic. After mutations, call revalidatePath('/posts') or revalidateTag('posts') from Server Actions or Route Handlers to purge cached data. Understanding the Data Cache, Full Route Cache, and Router Cache layers prevents surprising stale UI.",
        a11yNotes: [],
        commonMistakes: [
          "Expecting development mode caching to match production behavior",
          "Forgetting to revalidate after a Server Action mutation",
          "Setting revalidate: 0 when cache: 'no-store' is clearer for always-fresh data",
        ],
        bestPractices: [
          "Tag fetches with next: { tags: ['posts'] } for granular revalidation",
          "Use revalidatePath after form submissions that change displayed data",
          "Document caching strategy per route in team conventions",
        ],
        interviewQuestions: [
          "Explain ISR and how revalidate works in Next.js.",
          "What is the difference between revalidatePath and revalidateTag?",
          "When would you use dynamic = 'force-dynamic'?",
        ],
        cheatSheet: [
          { tag: "revalidate: 60", desc: "Time-based revalidation in seconds" },
          { tag: "revalidatePath()", desc: "Invalidate cached data for a path" },
          { tag: "revalidateTag()", desc: "Invalidate fetches tagged with a cache tag" },
        ],
      }),
      t({
        slug: "route-handlers",
        title: "Route Handlers",
        summary: "Define API endpoints with route.ts files that export GET, POST, and other HTTP method handlers.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["route-handlers", "api", "rest", "http"],
        challengeWeight: 4,
        explanation:
          "Create app/api/users/route.ts and export async function GET(request: Request) { return Response.json({ users: [] }) }. Supported exports: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. Route Handlers run on the server and replace Pages Router API routes. They receive the Web Request API and return Response. Dynamic route handlers live at app/api/posts/[id]/route.ts. Use them for webhooks, mobile app backends, or when you need REST endpoints outside of Server Actions. They can access cookies via cookies() from next/headers.",
        a11yNotes: [],
        commonMistakes: [
          "Creating route.ts in a folder that also has page.tsx (conflicts at same segment)",
          "Forgetting to return a Response object from the handler",
          "Using Route Handlers for form submissions when Server Actions are simpler",
        ],
        bestPractices: [
          "Prefer Server Actions for form mutations from your own UI",
          "Use Route Handlers for external consumers and webhooks",
          "Validate input and return proper HTTP status codes",
        ],
        interviewQuestions: [
          "How do Route Handlers differ from Pages Router API routes?",
          "When should you use a Route Handler versus a Server Action?",
          "How do you read request body JSON in a POST handler?",
        ],
        cheatSheet: [
          { tag: "route.ts", desc: "File defining HTTP method handlers for a path" },
          { tag: "Response.json()", desc: "Return JSON from a Route Handler" },
          { tag: "Request", desc: "Web standard request object passed to handlers" },
        ],
      }),
      t({
        slug: "server-actions-intro",
        title: "Server Actions Introduction",
        summary: "Server Actions are async functions that run on the server and can be invoked from forms and Client Components.",
        estimatedMinutes: 20,
        difficulty: "intermediate",
        keywords: ["server-actions", "forms", "mutations", "use-server"],
        challengeWeight: 5,
        explanation:
          "Add 'use server' at the top of a file or inline on an async function to create a Server Action. In a form: <form action={createPost}> where createPost is a Server Action that receives FormData. Server Actions run on the server, can mutate databases, and call revalidatePath. From Client Components, pass the action to form action or invoke with useTransition for pending UI. Next.js provides secure action IDs so actions are not arbitrary endpoints. Validate and authorize inside every Server Action — they are public entry points.",
        a11yNotes: [
          "Forms using Server Actions work without JavaScript — progressive enhancement.",
          "Show pending state with aria-busy when using useTransition on submit.",
        ],
        commonMistakes: [
          "Skipping server-side validation because the action is server-only",
          "Not calling revalidatePath after mutating cached data",
          "Exposing sensitive logic without authentication checks in the action",
        ],
        bestPractices: [
          "Validate FormData with zod or similar inside Server Actions",
          "Use revalidatePath or revalidateTag after mutations",
          "Return structured errors for display in the UI",
        ],
        interviewQuestions: [
          "What is a Server Action and how is it invoked?",
          "How do Server Actions relate to traditional API routes?",
          "Why must you validate input inside Server Actions?",
        ],
        cheatSheet: [
          { tag: "'use server'", desc: "Marks a function as a Server Action" },
          { tag: "form action={fn}", desc: "Bind a Server Action to a form submit" },
          { tag: "revalidatePath()", desc: "Refresh cached pages after a mutation" },
        ],
      }),
    ],
  },
  {
    slug: "styling-and-assets",
    title: "Styling and Assets",
    description: "CSS Modules, global styles, the Image component, and font optimization in Next.js.",
    topics: [
      t({
        slug: "css-modules-next",
        title: "CSS Modules in Next.js",
        summary: "Import scoped CSS files as modules so class names do not collide across components.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["css-modules", "styling", "scoped", "classes"],
        challengeWeight: 3,
        explanation:
          "Name a file Component.module.css and import it: import styles from './Card.module.css'. Use className={styles.card} — Next.js generates unique class names at build time. CSS Modules work in both Server and Client Components. You can compose classes with styles.primary + ' ' + styles.large or use clsx. Global selectors (:global) escape scoping when needed. CSS Modules ship with zero config in the App Router and are the recommended approach for component-scoped styles without a CSS-in-JS runtime.",
        a11yNotes: [
          "Do not rely on color alone — pair CSS Module styles with semantic markup.",
          "Ensure focus styles are visible and not removed in module CSS.",
        ],
        commonMistakes: [
          "Using kebab-case keys in JS without bracket notation: styles['my-class']",
          "Importing .module.css into the wrong component and expecting global scope",
          "Mixing Tailwind and CSS Modules inconsistently without team conventions",
        ],
        bestPractices: [
          "Colocate .module.css files next to their component",
          "Use CSS variables in modules for theming shared with global.css",
          "Prefer CSS Modules or Tailwind over runtime CSS-in-JS for Server Components",
        ],
        interviewQuestions: [
          "How do CSS Modules prevent class name collisions?",
          "Can Server Components import CSS Modules?",
          "How do CSS Modules compare to Tailwind in Next.js?",
        ],
        cheatSheet: [
          { tag: "*.module.css", desc: "Scoped styles imported as an object" },
          { tag: "styles.card", desc: "Apply a locally scoped class name" },
          { tag: ":global(.foo)", desc: "Escape module scope for a selector" },
        ],
      }),
      t({
        slug: "global-styles",
        title: "Global Styles",
        summary: "Import global CSS once in the root layout for resets, typography, and CSS variables.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["global-css", "layout", "variables", "reset"],
        challengeWeight: 3,
        explanation:
          "Import global styles in app/layout.tsx: import './globals.css'. Global CSS applies site-wide — use it for CSS resets, body typography, :root variables, and utility classes. Only import global CSS from the root layout (or it will apply to every route that imports it). Tailwind's @tailwind directives live in globals.css when using the Tailwind plugin. Avoid importing global CSS from individual components — it can cause duplication and ordering bugs. Use @layer in Tailwind for organized cascade.",
        a11yNotes: [
          "Set a readable base font size and line height in global styles.",
          "Respect prefers-reduced-motion in global CSS for animations.",
        ],
        commonMistakes: [
          "Importing globals.css in multiple layouts, causing duplicate rules",
          "Putting component-specific styles in globals.css instead of modules",
          "Forgetting that global CSS order matters for conflicting rules",
        ],
        bestPractices: [
          "Define design tokens as CSS variables in :root in globals.css",
          "Keep globals.css limited to resets, typography, and tokens",
          "Use CSS Modules or Tailwind for component-level styling",
        ],
        interviewQuestions: [
          "Where should global CSS be imported in the App Router?",
          "Why should you avoid importing global CSS in every component?",
          "How do you share theme variables across CSS Modules?",
        ],
        cheatSheet: [
          { tag: "globals.css", desc: "Site-wide styles imported in root layout" },
          { tag: ":root", desc: "Define CSS custom properties for theming" },
          { tag: "app/layout.tsx", desc: "Correct place to import global CSS" },
        ],
      }),
      t({
        slug: "image-component",
        title: "The Image Component",
        summary: "next/image optimizes images with lazy loading, responsive sizes, and automatic format conversion.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["next/image", "optimization", "lazy-load", "responsive"],
        challengeWeight: 4,
        explanation:
          "Import Image from 'next/image'. Required props: src, alt, width, and height (or fill with a sized parent). Next.js serves WebP/AVIF, generates srcset for responsive sizes, and lazy-loads by default. For remote images, configure domains or remotePatterns in next.config.ts. Use priority on above-the-fold hero images. fill layout sizes the image to its position:relative parent. Static imports (import hero from './hero.png') auto-set dimensions and blur placeholder.",
        a11yNotes: [
          "Always provide meaningful alt text — decorative images use alt=\"\".",
          "Do not use Image for text-heavy graphics that should be HTML.",
        ],
        commonMistakes: [
          "Using fill without position: relative on the parent container",
          "Omitting remotePatterns for external URLs, causing build errors",
          "Using width and height that do not match aspect ratio, causing layout shift",
        ],
        bestPractices: [
          "Configure remotePatterns instead of deprecated domains",
          "Use priority for LCP hero images",
          "Specify sizes prop for responsive fill images in grids",
        ],
        interviewQuestions: [
          "What optimizations does next/image provide over img?",
          "When should you use fill versus width and height?",
          "How do you allow images from an external CDN?",
        ],
        cheatSheet: [
          { tag: "next/image", desc: "Optimized image component with lazy loading" },
          { tag: "remotePatterns", desc: "Allowlisted remote image hosts in config" },
          { tag: "priority", desc: "Preload critical above-the-fold images" },
        ],
      }),
      t({
        slug: "font-optimization",
        title: "Font Optimization",
        summary: "next/font loads Google and local fonts with zero layout shift and no external network requests.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["next/font", "google-fonts", "cls", "typography"],
        challengeWeight: 3,
        explanation:
          "Import from next/font/google: const inter = Inter({ subsets: ['latin'] }) or from next/font/local for self-hosted files. Apply inter.className on html or body in layout.tsx, or use inter.variable with CSS var(--font-inter). Next.js downloads fonts at build time and self-hosts them — no Google Fonts CDN request, no FOUT/FOIT. The size-adjust fallback minimizes cumulative layout shift. You can combine multiple fonts and expose CSS variables for font-family in Tailwind config.",
        a11yNotes: [
          "Choose fonts with readable x-height and sufficient weight variants.",
          "Ensure fallback system fonts in the stack are similar size to reduce CLS.",
        ],
        commonMistakes: [
          "Loading the same Google Font via link tag and next/font, duplicating requests",
          "Forgetting subsets, bloating the font file with unused glyphs",
          "Not applying the font className on the element that sets font-family",
        ],
        bestPractices: [
          "Define fonts once in the root layout",
          "Use variable fonts and subset to latin (or needed scripts) only",
          "Expose font CSS variables for use with Tailwind fontFamily",
        ],
        interviewQuestions: [
          "How does next/font improve performance over a link tag?",
          "What is the difference between className and variable options?",
          "How do you use a local font file with next/font?",
        ],
        cheatSheet: [
          { tag: "next/font/google", desc: "Self-host Google Fonts at build time" },
          { tag: "subsets: ['latin']", desc: "Limit glyph subset to reduce file size" },
          { tag: "font.variable", desc: "CSS variable class for custom font-family" },
        ],
      }),
    ],
  },
  {
    slug: "metadata-and-seo",
    title: "Metadata and SEO",
    description: "Configure page metadata, Open Graph tags, and sitemap and robots files for search engines.",
    topics: [
      t({
        slug: "metadata-api",
        title: "The Metadata API",
        summary: "Export a static metadata object or generateMetadata function to set title, description, and icons per route.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["metadata", "seo", "title", "generateMetadata"],
        challengeWeight: 4,
        explanation:
          "In layout.tsx or page.tsx, export const metadata: Metadata = { title: 'About', description: '...' } for static metadata. For dynamic routes, export async function generateMetadata({ params }): Promise<Metadata> that fetches data and returns { title: post.title }. Metadata merges down the tree — child routes override parent fields. Supported fields include title (string or template), description, keywords, icons, viewport (via export const viewport), and alternates. The Metadata API replaces manual head tags from the Pages Router.",
        a11yNotes: [
          "Page title in metadata helps screen reader users identify the current page.",
          "Keep title templates concise — avoid duplicating site name excessively.",
        ],
        commonMistakes: [
          "Using next/head in the App Router instead of the Metadata API",
          "Forgetting that generateMetadata runs separately from the page — duplicate fetches if not cached",
          "Setting viewport in metadata object instead of the viewport export in Next.js 14+",
        ],
        bestPractices: [
          "Define a title template in root layout: { template: '%s | Site', default: 'Site' }",
          "Reuse fetch cache between generateMetadata and the page component",
          "Set meaningful descriptions unique to each route",
        ],
        interviewQuestions: [
          "How do static and dynamic metadata differ in Next.js?",
          "How does metadata inheritance work across nested layouts?",
          "What replaces next/head in the App Router?",
        ],
        cheatSheet: [
          { tag: "export const metadata", desc: "Static SEO metadata for a route" },
          { tag: "generateMetadata()", desc: "Async metadata from dynamic route params" },
          { tag: "title.template", desc: "Pattern for child page titles" },
        ],
      }),
      t({
        slug: "open-graph",
        title: "Open Graph and Social Cards",
        summary: "Add openGraph and twitter fields to metadata so links render rich previews on social platforms.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["open-graph", "twitter", "social", "og-image"],
        challengeWeight: 3,
        explanation:
          "Extend metadata with openGraph: { title, description, url, siteName, images: [{ url: '/og.png', width: 1200, height: 630 }] } and twitter: { card: 'summary_large_image', title, description, images }. Use absolute URLs for images in production. Next.js can generate OG images dynamically with opengraph-image.tsx or twitter-image.tsx colocated in a route segment — export default function Image() returning ImageResponse from next/og. Test previews with Facebook Sharing Debugger and Twitter Card Validator.",
        a11yNotes: [
          "OG images are decorative for social previews — ensure page content stands alone.",
          "Alt text in openGraph images is supported via alt on the images array.",
        ],
        commonMistakes: [
          "Using relative image URLs that break on social crawlers",
          "OG image dimensions outside recommended 1200×630 aspect ratio",
          "Duplicating title/description inconsistently between openGraph and root metadata",
        ],
        bestPractices: [
          "Colocate opengraph-image.tsx for dynamic per-route social images",
          "Use metadataBase in root layout for resolving relative OG URLs",
          "Keep OG title/description aligned with page metadata",
        ],
        interviewQuestions: [
          "What Open Graph fields does Next.js metadata support?",
          "How do you generate dynamic OG images in Next.js?",
          "Why is metadataBase important for relative URLs?",
        ],
        cheatSheet: [
          { tag: "openGraph.images", desc: "Social preview image URLs and dimensions" },
          { tag: "opengraph-image.tsx", desc: "File-based dynamic OG image generation" },
          { tag: "metadataBase", desc: "Base URL for resolving relative metadata paths" },
        ],
      }),
      t({
        slug: "sitemap-robots",
        title: "Sitemap and Robots",
        summary: "Export sitemap.ts and robots.ts to guide search engine crawlers through your site structure.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["sitemap", "robots", "seo", "crawlers"],
        challengeWeight: 3,
        explanation:
          "Add app/sitemap.ts exporting default async function sitemap(): MetadataRoute.Sitemap returning [{ url: 'https://example.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]. Add app/robots.ts exporting default function robots(): MetadataRoute.Robots returning { rules: { userAgent: '*', allow: '/', disallow: '/private/' }, sitemap: 'https://example.com/sitemap.xml' }. Next.js serves these at /sitemap.xml and /robots.txt automatically. Generate entries dynamically from your CMS or database for large sites.",
        a11yNotes: [],
        commonMistakes: [
          "Hardcoding URLs without metadataBase or environment-aware base URL",
          "Blocking / in robots.txt accidentally with an overly broad disallow",
          "Forgetting to update sitemap when adding new dynamic routes",
        ],
        bestPractices: [
          "Generate sitemap entries from the same data source as your routes",
          "Use environment variables for the production base URL",
          "Disallow admin and API paths in robots.txt",
        ],
        interviewQuestions: [
          "How do you add a sitemap in the App Router?",
          "What does robots.ts control?",
          "How can sitemap generation be dynamic?",
        ],
        cheatSheet: [
          { tag: "app/sitemap.ts", desc: "Generates /sitemap.xml at build or request time" },
          { tag: "app/robots.ts", desc: "Generates /robots.txt crawl rules" },
          { tag: "MetadataRoute.Sitemap", desc: "Typed return shape for sitemap entries" },
        ],
      }),
    ],
  },
  {
    slug: "dynamic-routes",
    title: "Dynamic Routes",
    description: "Dynamic segments, catch-all routes, and pre-rendering paths with generateStaticParams.",
    topics: [
      t({
        slug: "dynamic-segments",
        title: "Dynamic Segments",
        summary: "Bracket folder names like [id] capture URL parameters accessible via the params prop.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["dynamic", "params", "segments", "slug"],
        challengeWeight: 4,
        explanation:
          "Create app/products/[id]/page.tsx for routes like /products/42. The page receives params: export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; ... }. In Next.js 15+, params and searchParams are Promises and must be awaited. Optional catch-all uses [[...slug]] for zero or more segments; required catch-all uses [...slug] for one or more. Use generateStaticParams to pre-build known param values at build time.",
        a11yNotes: [
          "Dynamic pages should still expose a clear h1 derived from the resource title.",
          "Handle not-found for invalid IDs with notFound() from next/navigation.",
        ],
        commonMistakes: [
          "Forgetting to await params in Next.js 15 App Router pages",
          "Using useParams in Server Components instead of the params prop",
          "Not validating param shape before using it in database queries",
        ],
        bestPractices: [
          "Validate and sanitize dynamic params before data access",
          "Call notFound() when a resource does not exist",
          "Type params with explicit interfaces per route",
        ],
        interviewQuestions: [
          "How do you access dynamic route parameters in a Server Component page?",
          "What is the difference between [slug] and [[...slug]]?",
          "When must params be awaited in Next.js 15?",
        ],
        cheatSheet: [
          { tag: "[id]", desc: "Dynamic segment capturing one URL path part" },
          { tag: "params prop", desc: "Route parameters passed to page and layout" },
          { tag: "notFound()", desc: "Trigger the not-found UI for invalid params" },
        ],
      }),
      t({
        slug: "catch-all-routes",
        title: "Catch-All Routes",
        summary: "Catch-all segments with [...slug] match multiple path parts; optional [[...slug]] also matches the base path.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["catch-all", "optional", "docs", "nested-paths"],
        challengeWeight: 4,
        explanation:
          "app/docs/[...slug]/page.tsx matches /docs/a, /docs/a/b, and /docs/a/b/c — params.slug is a string array ['a', 'b', 'c']. Optional catch-all app/docs/[[...slug]]/page.tsx also matches /docs with slug undefined or []. Useful for documentation sites, file browsers, or CMS-driven hierarchies. Map slug segments to content: const path = params.slug?.join('/') ?? ''. Combine with generateStaticParams to pre-render all doc paths from a file tree or CMS.",
        a11yNotes: [
          "Multi-level doc routes need breadcrumbs for orientation.",
          "Ensure 404 handling when slug path does not resolve to content.",
        ],
        commonMistakes: [
          "Using [...slug] when the base /docs path should work — need [[...slug]]",
          "Treating params.slug as a string instead of string[]",
          "Not handling empty slug array edge cases in optional catch-alls",
        ],
        bestPractices: [
          "Use optional catch-all for section roots that may have zero extra segments",
          "Join slug array consistently when looking up content keys",
          "Generate static params from your content index at build time",
        ],
        interviewQuestions: [
          "What URL paths does [...slug] match versus [[...slug]]?",
          "What type is params.slug in a catch-all route?",
          "Give a real use case for catch-all routing.",
        ],
        cheatSheet: [
          { tag: "[...slug]", desc: "Required catch-all — one or more segments" },
          { tag: "[[...slug]]", desc: "Optional catch-all — zero or more segments" },
          { tag: "params.slug.join('/')", desc: "Rebuild path string from segment array" },
        ],
      }),
      t({
        slug: "generating-static-params",
        title: "Generating Static Params",
        summary: "Export generateStaticParams to pre-render dynamic routes at build time for static export or ISR.",
        estimatedMinutes: 18,
        difficulty: "advanced",
        keywords: ["generateStaticParams", "ssg", "build", "pre-render"],
        challengeWeight: 5,
        explanation:
          "In a dynamic page, export async function generateStaticParams() { const posts = await getPosts(); return posts.map(p => ({ slug: p.slug })); } — return objects whose keys match dynamic segment names. Next.js pre-renders those paths at build time. Unlisted params can still be generated on first request if dynamicParams is true (default). Set export const dynamicParams = false to 404 unknown paths. generateStaticParams replaces getStaticPaths from the Pages Router. Works with catch-all routes by returning { slug: ['a', 'b'] }.",
        a11yNotes: [],
        commonMistakes: [
          "Returning wrong key names that do not match folder segment names",
          "Assuming all infinite param combinations are pre-built at build time",
          "Fetching without cache in generateStaticParams causing slow builds",
        ],
        bestPractices: [
          "Pre-build high-traffic paths; let long tail generate on demand",
          "Share data fetching between generateStaticParams and the page via cached fetch",
          "Use dynamicParams = false for strictly controlled route sets",
        ],
        interviewQuestions: [
          "What does generateStaticParams return?",
          "How does it relate to getStaticPaths in the Pages Router?",
          "What happens when a user visits a path not returned by generateStaticParams?",
        ],
        cheatSheet: [
          { tag: "generateStaticParams", desc: "Pre-render dynamic routes at build time" },
          { tag: "dynamicParams", desc: "Control behavior for unlisted param values" },
          { tag: "{ slug: 'hello' }", desc: "Param object keys match segment names" },
        ],
      }),
    ],
  },
  {
    slug: "middleware-and-auth",
    title: "Middleware and Auth Patterns",
    description: "Edge middleware for request interception, matcher configuration, and introductory route protection.",
    topics: [
      t({
        slug: "middleware-basics",
        title: "Middleware Basics",
        summary: "middleware.ts runs on the Edge before a request completes to rewrite, redirect, or modify headers.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["middleware", "edge", "redirect", "rewrite"],
        challengeWeight: 4,
        explanation:
          "Create middleware.ts at the project root (or src/) exporting function middleware(request: NextRequest) { return NextResponse.next() }. Run logic before routes render: redirect unauthenticated users, rewrite locale prefixes, set security headers, or A/B test buckets. Return NextResponse.redirect(url) or NextResponse.rewrite(url). Middleware runs on the Edge runtime — no Node.js APIs like fs. It executes before cached content and Route Handlers. Use cookies(), headers(), and request.nextUrl for inspection.",
        a11yNotes: [
          "Redirects should land on accessible pages with proper status codes.",
          "Avoid middleware loops that trap users between redirecting routes.",
        ],
        commonMistakes: [
          "Putting heavy database logic in middleware — Edge has limits",
          "Forgetting to return a Response from every middleware branch",
          "Expecting middleware to run for static files excluded by matcher",
        ],
        bestPractices: [
          "Keep middleware fast — auth token check and redirect only",
          "Use matcher config to limit which paths run middleware",
          "Prefer NextResponse.next() with header mutations when no redirect needed",
        ],
        interviewQuestions: [
          "What runs first — middleware or a Route Handler?",
          "What runtime does Next.js middleware use?",
          "How do you redirect from middleware?",
        ],
        cheatSheet: [
          { tag: "middleware.ts", desc: "Root file intercepting requests before routes" },
          { tag: "NextResponse.redirect()", desc: "Send a redirect response from middleware" },
          { tag: "NextRequest", desc: "Extended Request with nextUrl and geo helpers" },
        ],
      }),
      t({
        slug: "matchers",
        title: "Middleware Matchers",
        summary: "Configure the matcher export to run middleware only on specific paths and exclude static assets.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["matcher", "config", "paths", "exclude"],
        challengeWeight: 3,
        explanation:
          "Export const config = { matcher: ['/dashboard/:path*', '/api/:path*'] } to scope middleware. Negative lookahead excludes _next/static and public files: matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']. Matchers use path-to-regexp syntax. Without a matcher, middleware runs on all routes including static assets — bad for performance. Multiple matchers can be an array. The matcher determines which requests invoke middleware; logic inside decides redirect versus next.",
        a11yNotes: [],
        commonMistakes: [
          "Omitting matcher and slowing every static asset request",
          "Incorrect regex excluding API routes that need auth",
          "Duplicating path checks in middleware that matcher already handles",
        ],
        bestPractices: [
          "Use the documented default matcher pattern excluding static files",
          "Scope auth middleware to protected route prefixes only",
          "Test matcher patterns against expected URLs in unit tests",
        ],
        interviewQuestions: [
          "Why should you configure a middleware matcher?",
          "How do you exclude _next/static from middleware?",
          "What syntax does the matcher use?",
        ],
        cheatSheet: [
          { tag: "export const config", desc: "Middleware configuration including matcher" },
          { tag: "matcher: [...]", desc: "Array of path patterns to intercept" },
          { tag: ":path*", desc: "Match zero or more path segments" },
        ],
      }),
      t({
        slug: "protecting-routes-intro",
        title: "Protecting Routes Introduction",
        summary: "Combine middleware, cookies, and server-side session checks to gate authenticated routes.",
        estimatedMinutes: 20,
        difficulty: "advanced",
        keywords: ["auth", "protection", "session", "cookies"],
        challengeWeight: 5,
        explanation:
          "A common pattern: set an HTTP-only session cookie on login; middleware reads it and redirects to /login if missing on /dashboard routes. Middleware does coarse checks (cookie exists); Server Components or Server Actions do fine-grained authorization (user owns resource). Libraries like NextAuth.js (Auth.js) integrate with middleware via getToken. Never trust client-side redirects alone — always verify on the server. For API Route Handlers, return 401 without a valid session. Role checks belong in Server Actions and data access layers.",
        a11yNotes: [
          "Login redirects should preserve the intended destination and announce errors.",
          "Auth error pages need clear messaging and a path back to login.",
        ],
        commonMistakes: [
          "Checking localStorage in middleware — not available on the server",
          "Only protecting routes in client useEffect, allowing flash of protected content",
          "Storing JWT in localStorage instead of HTTP-only cookies",
        ],
        bestPractices: [
          "Use HTTP-only, Secure, SameSite cookies for session tokens",
          "Verify authorization in Server Components and actions, not just middleware",
          "Redirect unauthenticated users with callbackUrl query param",
        ],
        interviewQuestions: [
          "Why is middleware alone insufficient for authorization?",
          "How do you protect a dashboard route in Next.js?",
          "Where should role-based access checks run?",
        ],
        cheatSheet: [
          { tag: "cookies().get()", desc: "Read session cookie in middleware or server code" },
          { tag: "callbackUrl", desc: "Return user to intended page after login" },
          { tag: "HTTP-only cookie", desc: "Session token not accessible to client JS" },
        ],
      }),
    ],
  },
  {
    slug: "deployment",
    title: "Deployment",
    description: "Production builds, environment variables, and deploying to Vercel or compatible platforms.",
    topics: [
      t({
        slug: "build-and-output",
        title: "Build and Output",
        summary: "next build compiles the app; output mode standalone or static determines deployment target.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["build", "output", "standalone", "production"],
        challengeWeight: 4,
        explanation:
          "Run next build to compile Server and Client Components, optimize images, and generate static pages. next start serves the production build locally. output: 'standalone' in next.config.ts creates a minimal server bundle for Docker. output: 'export' produces static HTML (no Server Components or Route Handlers at runtime). The .next/ folder contains build artifacts — deploy it with node_modules or standalone output. Analyze bundle size with @next/bundle-analyzer. Fix build errors before deploy — TypeScript and ESLint can block builds if configured.",
        a11yNotes: [],
        commonMistakes: [
          "Deploying next dev output instead of running next build",
          "Using static export for an app that needs Server Actions at runtime",
          "Committing .next/ to version control",
        ],
        bestPractices: [
          "Run next build in CI and fail on errors",
          "Use standalone output for self-hosted Docker deployments",
          "Enable bundle analyzer periodically to catch client bloat",
        ],
        interviewQuestions: [
          "What does next build produce?",
          "When would you use output standalone versus export?",
          "How do you test a production build locally?",
        ],
        cheatSheet: [
          { tag: "next build", desc: "Create optimized production output" },
          { tag: "output: 'standalone'", desc: "Self-contained server for Docker" },
          { tag: "next start", desc: "Serve the production build locally" },
        ],
      }),
      t({
        slug: "env-variables",
        title: "Environment Variables",
        summary: "Use .env files for secrets and public config; prefix NEXT_PUBLIC_ for client-exposed values.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["env", "secrets", "NEXT_PUBLIC", "configuration"],
        challengeWeight: 3,
        explanation:
          "Store secrets in .env.local (gitignored): DATABASE_URL=..., API_SECRET=.... Access server-only vars via process.env.API_SECRET in Server Components, Route Handlers, and Server Actions. Prefix with NEXT_PUBLIC_ to expose to the browser: NEXT_PUBLIC_ANALYTICS_ID — inlined at build time. .env, .env.development, and .env.production load by environment. Never put secrets in NEXT_PUBLIC_ vars. On Vercel, set env vars in the project dashboard for preview and production. Restart dev server after changing .env files.",
        a11yNotes: [],
        commonMistakes: [
          "Exposing API keys with NEXT_PUBLIC_ prefix",
          "Expecting .env changes without restarting next dev",
          "Accessing server env vars in Client Components",
        ],
        bestPractices: [
          "Keep .env.local in .gitignore; document required vars in .env.example",
          "Validate env vars at startup with zod or t3-env",
          "Use separate values for development, preview, and production",
        ],
        interviewQuestions: [
          "How do you expose an env var to the client in Next.js?",
          "Where can you safely use process.env.DATABASE_URL?",
          "What is the difference between .env and .env.local?",
        ],
        cheatSheet: [
          { tag: "NEXT_PUBLIC_*", desc: "Env vars inlined into client bundle" },
          { tag: ".env.local", desc: "Local overrides — never commit secrets" },
          { tag: "process.env", desc: "Access env vars in server runtime code" },
        ],
      }),
      t({
        slug: "vercel-deploy-basics",
        title: "Vercel Deployment Basics",
        summary: "Deploy Next.js to Vercel with git integration, preview URLs, and zero-config App Router support.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["vercel", "deploy", "preview", "hosting"],
        challengeWeight: 3,
        explanation:
          "Push your repo to GitHub and import it on vercel.com. Vercel detects Next.js and sets build command (next build) and output automatically. Each pull request gets a preview deployment URL. Production deploys from the main branch. Vercel supports Edge Middleware, Serverless Functions for Route Handlers, and ISR out of the box. Set environment variables in the Vercel dashboard per environment. Custom domains add DNS records Vercel provides. Alternatives: Netlify, AWS Amplify, Docker on any VPS using standalone output.",
        a11yNotes: [],
        commonMistakes: [
          "Missing production env vars that exist only in .env.local locally",
          "Assuming preview deployments share production database credentials",
          "Not setting NEXT_PUBLIC_APP_URL for absolute URLs in previews",
        ],
        bestPractices: [
          "Use preview deployments to QA before merging to main",
          "Configure production env vars separately from preview",
          "Enable deployment protection for production if needed",
        ],
        interviewQuestions: [
          "How does Vercel handle Next.js App Router features?",
          "What is a preview deployment?",
          "How do you deploy Next.js outside Vercel?",
        ],
        cheatSheet: [
          { tag: "vercel deploy", desc: "CLI deploy from local project" },
          { tag: "Preview URL", desc: "Per-branch deployment for PR review" },
          { tag: "Environment Variables", desc: "Dashboard settings per deployment target" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Folder conventions, error and loading UI, and performance habits for maintainable Next.js apps.",
    topics: [
      t({
        slug: "folder-conventions",
        title: "Folder Conventions",
        summary: "Organize app routes, shared components, lib utilities, and types with consistent team conventions.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["conventions", "structure", "colocation", "organization"],
        challengeWeight: 3,
        explanation:
          "Common layout: app/ for routes only; components/ for shared UI; lib/ for utilities, db clients, and validators; types/ for shared TypeScript types; hooks/ for client hooks. Colocate route-specific components in app/dashboard/_components/ (underscore excludes from routing) or beside the page. Use (route-groups) for marketing versus app shells. Keep business logic out of page.tsx — extract to lib/ or features/ modules. Private folders prefix with _ to opt out of routing. Consistency matters more than the exact folder names.",
        a11yNotes: [],
        commonMistakes: [
          "Putting non-route files in app/ without _ prefix, accidentally creating routes",
          "Deep nesting components inside app/ making imports fragile",
          "Mixing Pages Router pages/ with App Router app/ without a migration plan",
        ],
        bestPractices: [
          "Use _folder or (group) to organize without affecting URLs",
          "Extract data access to lib/db or repositories",
          "Document folder conventions in the project README",
        ],
        interviewQuestions: [
          "How do you prevent a folder in app/ from becoming a route?",
          "Where should shared utilities live?",
          "What are route groups used for organizationally?",
        ],
        cheatSheet: [
          { tag: "_components", desc: "Private folder excluded from URL routing" },
          { tag: "lib/", desc: "Shared server-safe utilities and clients" },
          { tag: "(marketing)", desc: "Route group for layout organization" },
        ],
      }),
      t({
        slug: "error-and-loading-ui",
        title: "Error and Loading UI",
        summary: "Use error.tsx, loading.tsx, and not-found.tsx for resilient route-level UI boundaries.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["error", "loading", "not-found", "boundaries"],
        challengeWeight: 4,
        explanation:
          "error.tsx must be a Client Component — it receives { error, reset } to show a message and retry. loading.tsx wraps the segment in Suspense automatically. not-found.tsx renders when notFound() is called. Global errors use app/global-error.tsx (must include html and body). Errors bubble to the nearest error boundary; more granular error.tsx files isolate failures. Combine with try/catch in Server Components for expected errors versus unexpected throws. logging in error.tsx helps observability.",
        a11yNotes: [
          "Error UI needs a clear heading and actionable retry button with accessible name.",
          "Loading skeletons should use aria-busy and not trap focus.",
        ],
        commonMistakes: [
          "Making error.tsx a Server Component — it must be use client",
          "Catching all errors silently without user feedback",
          "Using error.tsx for 404 cases instead of notFound()",
        ],
        bestPractices: [
          "Place error.tsx at meaningful segment boundaries",
          "Provide reset button wired to the reset prop",
          "Log errors to monitoring (Sentry, etc.) in error boundaries",
        ],
        interviewQuestions: [
          "Why must error.tsx be a Client Component?",
          "What triggers not-found.tsx versus error.tsx?",
          "How does loading.tsx relate to Suspense?",
        ],
        cheatSheet: [
          { tag: "error.tsx", desc: "Client error boundary for a route segment" },
          { tag: "notFound()", desc: "Render not-found.tsx for missing resources" },
          { tag: "global-error.tsx", desc: "Root-level error boundary with html/body" },
        ],
      }),
      t({
        slug: "performance-habits",
        title: "Performance Habits",
        summary: "Reduce client JS, optimize images and fonts, cache intentionally, and measure with Core Web Vitals.",
        estimatedMinutes: 18,
        difficulty: "advanced",
        keywords: ["performance", "lcp", "bundle", "vitals"],
        challengeWeight: 5,
        explanation:
          "Keep Server Components default to minimize client JavaScript. Dynamic import heavy Client Components with next/dynamic and ssr: false only when necessary. Use next/image and next/font. Set fetch cache and revalidate appropriately — not everything needs force-dynamic. Analyze bundles with @next/bundle-analyzer. Measure LCP, INP, and CLS in production with Vercel Analytics or web-vitals. Prefetch Link routes judiciously. Avoid large dependencies in Client Component trees. Stream with Suspense to improve TTFB and LCP.",
        a11yNotes: [
          "Performance improvements help users on slow devices and assistive tech.",
          "Do not sacrifice focus management for animation performance.",
        ],
        commonMistakes: [
          "Importing entire lodash or icon packs into Client Components",
          "Disabling caching globally to avoid thinking about revalidation",
          "Optimizing development mode metrics instead of production builds",
        ],
        bestPractices: [
          "Audit client boundaries regularly with bundle analyzer",
          "Lazy load below-the-fold interactive widgets",
          "Track Core Web Vitals in production, not just locally",
        ],
        interviewQuestions: [
          "How do Server Components improve performance?",
          "What tools measure Next.js production performance?",
          "When is next/dynamic appropriate?",
        ],
        cheatSheet: [
          { tag: "next/dynamic", desc: "Lazy load Client Components on demand" },
          { tag: "Core Web Vitals", desc: "LCP, INP, CLS — Google UX metrics" },
          { tag: "@next/bundle-analyzer", desc: "Visualize client bundle composition" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply Next.js patterns by building a marketing landing page and a dashboard shell with routing and layouts.",
    topics: [
      t({
        slug: "project-marketing-landing",
        title: "Project: Marketing Landing Page",
        summary: "Build a static marketing site with hero, features, metadata, optimized images, and responsive layout.",
        estimatedMinutes: 45,
        difficulty: "intermediate",
        keywords: ["project", "marketing", "landing", "static"],
        challengeWeight: 5,
        explanation:
          "Create app/(marketing)/page.tsx with Server Components for hero, features grid, and footer. Use next/image for hero and feature illustrations with priority on the hero. Set metadata and openGraph in the marketing layout. Style with Tailwind or CSS Modules. Add app/(marketing)/layout.tsx with shared nav and footer. Use Link for internal anchors. Optional: opengraph-image.tsx for branded social cards. Deploy as mostly static with ISR or force-static. Practice semantic HTML sections: header, main, section, footer.",
        a11yNotes: [
          "One h1 per page; feature sections use h2.",
          "Nav links need visible focus styles; hero CTA is a real button or link.",
          "Images require descriptive alt text except decorative backgrounds.",
        ],
        commonMistakes: [
          "Making the entire landing page use client for a single mobile menu toggle",
          "Omitting metadata and OG tags on the main marketing route",
          "Using unoptimized img tags for large hero assets",
        ],
        bestPractices: [
          "Server-render all static sections; client-only for mobile nav toggle",
          "Colocate marketing components under app/(marketing)/",
          "Set metadataBase and full openGraph images for sharing",
        ],
        interviewQuestions: [
          "How would you structure a marketing site in the App Router?",
          "What rendering strategy fits a mostly static landing page?",
          "How do you optimize LCP for a hero image?",
        ],
        cheatSheet: [
          { tag: "(marketing)/layout.tsx", desc: "Shared shell for marketing pages" },
          { tag: "generateMetadata", desc: "SEO title and description for landing" },
          { tag: "priority", desc: "Preload hero image for faster LCP" },
        ],
      }),
      t({
        slug: "project-dashboard-shell",
        title: "Project: Dashboard Shell",
        summary: "Build an authenticated dashboard with nested layout, sidebar navigation, loading states, and protected routes.",
        estimatedMinutes: 50,
        difficulty: "advanced",
        keywords: ["project", "dashboard", "layout", "auth"],
        challengeWeight: 5,
        explanation:
          "Create app/dashboard/layout.tsx with sidebar and header wrapping { children }. Routes: app/dashboard/page.tsx (overview), app/dashboard/settings/page.tsx. Use loading.tsx for skeleton UI while overview data fetches. Middleware protects /dashboard/* — redirect to /login without session cookie. Overview page async fetches stats in a Server Component; settings page uses a Client Component form with a Server Action. error.tsx on dashboard segment catches data failures. Practice nested layouts that persist sidebar state across navigations.",
        a11yNotes: [
          "Sidebar nav uses nav with ul/li and aria-current on active link.",
          "Main content area is a main landmark; skip link jumps past sidebar.",
          "Loading skeletons use aria-busy until data renders.",
        ],
        commonMistakes: [
          "Putting sidebar in each page instead of dashboard layout",
          "Client-side auth check only, showing dashboard flash before redirect",
          "Fetching the same user profile in every nested page independently",
        ],
        bestPractices: [
          "Protect with middleware plus server-side session validation",
          "Share user context from layout via cached fetch or auth helper",
          "Use loading.tsx per slow dashboard section",
        ],
        interviewQuestions: [
          "How do nested layouts help a dashboard app?",
          "Where do auth checks belong for dashboard routes?",
          "How would you add a settings form with a Server Action?",
        ],
        cheatSheet: [
          { tag: "dashboard/layout.tsx", desc: "Persistent sidebar and header shell" },
          { tag: "middleware redirect", desc: "Gate /dashboard before render" },
          { tag: "loading.tsx", desc: "Skeleton while dashboard data loads" },
        ],
      }),
    ],
  },
];

export function flattenNextjsTopics(): NextjsTopicDef[] {
  return NEXTJS_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
