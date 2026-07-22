export type ReactDifficulty = "beginner" | "intermediate" | "advanced";

export type ReactTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ReactDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** React APIs / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ReactSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ReactTopicDef[];
};

function t(partial: ReactTopicDef): ReactTopicDef {
  return partial;
}

export const REACT_ACADEMY_SECTIONS: ReactSectionDef[] = [
  {
    slug: "react-introduction",
    title: "React Introduction",
    description: "What React is, how SPAs differ from MPAs, tooling, and JSX fundamentals.",
    topics: [
      t({
        slug: "what-is-react",
        title: "What is React?",
        summary: "React is a library for building user interfaces with reusable components.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["react", "components", "ui", "library"],
        challengeWeight: 4,
        explanation:
          "React is a JavaScript library created by Meta for building interactive UIs. You describe what the UI should look like for a given state, and React efficiently updates the DOM when state changes. React is component-based: small, reusable pieces (buttons, cards, pages) compose into full applications. It is not a full framework — routing, data fetching, and global state are added via libraries.",
        a11yNotes: [
          "React renders HTML — semantic elements and ARIA still apply.",
          "Do not rely on React alone for accessibility; use proper markup.",
        ],
        commonMistakes: [
          "Calling React a framework when it is a UI library",
          "Assuming React replaces HTML and CSS entirely",
          "Thinking you must use JSX — it is optional syntax sugar",
        ],
        bestPractices: [
          "Think in components: UI = f(state)",
          "Keep components small and focused on one responsibility",
          "Learn the React docs and official patterns before third-party abstractions",
        ],
        interviewQuestions: [
          "What problem does React solve?",
          "How is React different from vanilla JavaScript DOM manipulation?",
          "Is React a framework or a library?",
        ],
        cheatSheet: [
          { tag: "React", desc: "UI library for component-based interfaces" },
          { tag: "component", desc: "Reusable UI unit that returns JSX" },
          { tag: "virtual DOM", desc: "In-memory representation React diffs against the real DOM" },
        ],
      }),
      t({
        slug: "spa-vs-mpa",
        title: "SPA vs MPA",
        summary: "Single-page apps load once and swap views client-side; multi-page apps reload per navigation.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["spa", "mpa", "routing", "navigation"],
        challengeWeight: 3,
        explanation:
          "A Single-Page Application (SPA) loads one HTML shell and uses JavaScript (React + a router) to swap views without full page reloads. Navigation feels instant; data is fetched via APIs. A Multi-Page Application (MPA) requests a new HTML document on each navigation — traditional server-rendered sites. SPAs excel at rich interactivity; MPAs excel at SEO simplicity and first paint on content-heavy sites. Modern React apps often use hybrid approaches (SSR/SSG with Next.js).",
        a11yNotes: [
          "SPAs must manage focus on route changes — screen readers need announcement of new content.",
          "Ensure browser back/forward works with client-side routing.",
        ],
        commonMistakes: [
          "Assuming SPAs are always faster on first load",
          "Breaking the back button by not using a proper router",
          "Forgetting to update document title on route change",
        ],
        bestPractices: [
          "Use React Router (or framework routing) for client navigation",
          "Consider SSR/SSG when SEO and initial load matter",
          "Prefetch data for likely next routes when appropriate",
        ],
        interviewQuestions: [
          "What is the difference between an SPA and an MPA?",
          "What are trade-offs of building an SPA with React?",
          "How does client-side routing differ from server navigation?",
        ],
        cheatSheet: [
          { tag: "SPA", desc: "One HTML page, JS swaps views" },
          { tag: "MPA", desc: "Full page reload per navigation" },
          { tag: "client-side routing", desc: "Router updates URL and view without reload" },
        ],
      }),
      t({
        slug: "create-react-app-vite",
        title: "Create React App & Vite",
        summary: "Bootstrap React projects with Vite (recommended) or legacy CRA tooling.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["vite", "create-react-app", "tooling", "dev-server"],
        challengeWeight: 3,
        explanation:
          "Vite is the modern default for new React projects: npm create vite@latest my-app -- --template react. Vite uses native ES modules in dev for instant server start and fast HMR (Hot Module Replacement). Create React App (CRA) was the older standard (npx create-react-app) but is largely unmaintained — avoid it for new projects. Both provide a dev server, build pipeline, and JSX support out of the box.",
        a11yNotes: [],
        commonMistakes: [
          "Starting new projects with CRA instead of Vite",
          "Confusing npm create vite with npx create-react-app flags",
          "Editing files inside node_modules instead of src/",
        ],
        bestPractices: [
          "Use Vite for new React + TypeScript projects",
          "Keep environment variables in .env with VITE_ prefix",
          "Run npm run dev for development, npm run build for production",
        ],
        interviewQuestions: [
          "Why is Vite preferred over Create React App today?",
          "What is Hot Module Replacement?",
          "Where does a Vite React app entry point live?",
        ],
        cheatSheet: [
          { tag: "npm create vite", desc: "Scaffold a new Vite + React project" },
          { tag: "HMR", desc: "Update modules in browser without full reload" },
          { tag: "main.jsx", desc: "Typical Vite React entry that mounts App" },
        ],
      }),
      t({
        slug: "jsx-basics",
        title: "JSX Basics",
        summary: "JSX is syntax that looks like HTML but compiles to React.createElement calls.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["jsx", "syntax", "elements", "expressions"],
        challengeWeight: 5,
        explanation:
          "JSX lets you write markup inside JavaScript. A JSX expression like <h1>Hello</h1> compiles to React.createElement('h1', null, 'Hello'). Embed JavaScript with curly braces: {user.name}. JSX must have one root element (or use a Fragment <>...</>). Use className instead of class, htmlFor instead of for. Self-closing tags need a slash: <img />. JSX is not HTML — it is transformed at build time.",
        a11yNotes: [
          "Use semantic JSX elements: <button>, <nav>, <main>, not div soup.",
          "Include alt on <img> and labels on form controls in JSX.",
        ],
        commonMistakes: [
          "Using class instead of className",
          "Returning multiple sibling elements without a Fragment wrapper",
          "Putting if/else statements directly inside JSX without ternary or &&",
          "Forgetting to close self-closing tags",
        ],
        bestPractices: [
          "Wrap adjacent elements in <> Fragment when no extra DOM node is needed",
          "Extract complex JSX into smaller components",
          "Use parentheses for multi-line return statements",
        ],
        interviewQuestions: [
          "What does JSX compile to?",
          "Why use className instead of class in JSX?",
          "How do you embed JavaScript expressions in JSX?",
        ],
        cheatSheet: [
          { tag: "JSX", desc: "HTML-like syntax compiled to React elements" },
          { tag: "{expression}", desc: "Embed JavaScript inside JSX" },
          { tag: "<></>", desc: "Fragment — group without extra DOM node" },
        ],
      }),
    ],
  },
  {
    slug: "components",
    title: "Components",
    description: "Build UI from function components, props, children, and composition.",
    topics: [
      t({
        slug: "function-components",
        title: "Function Components",
        summary: "Modern React components are functions that return JSX.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["function", "component", "return", "jsx"],
        challengeWeight: 5,
        explanation:
          "A function component is a JavaScript function (often arrow function) whose name starts with a capital letter and returns JSX. Example: function Greeting() { return <h1>Hello</h1>; }. React calls your function, gets the JSX, and renders it. Class components exist but are legacy — use functions with hooks for all new code. Components can be defined in the same file or exported from separate files.",
        a11yNotes: [
          "Component names are PascalCase — this distinguishes them from HTML tags.",
        ],
        commonMistakes: [
          "Naming components with lowercase (React treats them as HTML tags)",
          "Forgetting to return JSX (implicit return only with arrow parens)",
          "Defining components inside other components (recreates them every render)",
        ],
        bestPractices: [
          "One component per file for anything non-trivial",
          "Use PascalCase for component names",
          "Define components at module scope, not nested inside render",
        ],
        interviewQuestions: [
          "What is a function component?",
          "Why must component names be capitalized?",
          "Why define components outside other components?",
        ],
        cheatSheet: [
          { tag: "function App()", desc: "Function component declaration" },
          { tag: "return <div />", desc: "Component returns JSX tree" },
          { tag: "export default App", desc: "Default export for use in other files" },
        ],
      }),
      t({
        slug: "props-basics",
        title: "Props Basics",
        summary: "Props pass read-only data from parent to child components.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["props", "parent", "child", "readonly"],
        challengeWeight: 5,
        explanation:
          "Props (properties) are arguments passed to components like HTML attributes. <UserCard name=\"Ada\" age={42} /> — the child receives them as the first parameter: function UserCard({ name, age }) { ... }. Props flow one way: parent → child. They are immutable inside the child — never mutate props directly. Default values can be set with default parameters or defaultProps (legacy).",
        a11yNotes: [
          "Pass aria-* and role props through to DOM elements when wrapping native controls.",
        ],
        commonMistakes: [
          "Mutating props inside the child component",
          "Spreading unknown props without filtering (can pass invalid DOM attrs)",
          "Passing objects/arrays inline causing unnecessary re-renders",
        ],
        bestPractices: [
          "Destructure props in the function signature for clarity",
          "Use TypeScript or PropTypes for documentation in larger apps",
          "Keep prop lists focused — prefer composition over mega-prop objects",
        ],
        interviewQuestions: [
          "Are props mutable inside a child component?",
          "How do you pass a number vs a string as a prop?",
          "What is one-way data flow in React?",
        ],
        cheatSheet: [
          { tag: "props", desc: "Read-only inputs passed to a component" },
          { tag: "{ name, age }", desc: "Destructure props in parameter" },
          { tag: "<Comp x={1} />", desc: "Curly braces for non-string values" },
        ],
      }),
      t({
        slug: "children-prop",
        title: "The children Prop",
        summary: "Nest content inside components via the special children prop.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["children", "composition", "slot", "nest"],
        challengeWeight: 4,
        explanation:
          "Content placed between opening and closing tags becomes props.children. <Card><p>Body</p></Card> — Card receives the <p> as children. Use children for layout wrappers, modals, and generic containers. children can be a single element, multiple elements, text, or even a function (render props pattern). Access it as props.children or destructure { children }.",
        a11yNotes: [
          "Ensure wrapper components do not break heading hierarchy or landmark structure.",
        ],
        commonMistakes: [
          "Forgetting that self-closing tags have no children",
          "Assuming children is always an array (may be a single node)",
          "Overusing children when named props are clearer",
        ],
        bestPractices: [
          "Use children for layout shells: Page, Card, Modal",
          "Use React.Children utilities sparingly — prefer explicit props when complex",
          "Document whether a component expects one child or many",
        ],
        interviewQuestions: [
          "What is props.children?",
          "How is children different from a regular prop?",
          "When would you use a named prop instead of children?",
        ],
        cheatSheet: [
          { tag: "children", desc: "Nested JSX passed between component tags" },
          { tag: "{ children }", desc: "Destructure the children prop" },
          { tag: "<Layout>{content}</Layout>", desc: "Composition via children" },
        ],
      }),
      t({
        slug: "composing-components",
        title: "Composing Components",
        summary: "Build complex UIs by nesting and combining small components.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["composition", "nest", "reuse", "structure"],
        challengeWeight: 4,
        explanation:
          "Composition means assembling larger UIs from smaller components rather than inheritance. A Page contains Header, Sidebar, and Main; Main contains ArticleList and ArticleCard. Each piece owns its markup and logic. Pass data down via props; lift shared state up to the nearest common ancestor. This mirrors how HTML nests elements — React components are the building blocks.",
        a11yNotes: [
          "Compose semantic structure: header, nav, main, footer as separate components.",
        ],
        commonMistakes: [
          "Creating one giant component instead of splitting by responsibility",
          "Prop drilling too deep before considering context",
          "Duplicating markup instead of extracting a shared component",
        ],
        bestPractices: [
          "Split when a section has its own state or is reused",
          "Colocate styles and logic with the component that uses them",
          "Favor composition over prop-heavy configuration objects",
        ],
        interviewQuestions: [
          "How does React favor composition over inheritance?",
          "When should you extract a new component?",
          "What is component composition?",
        ],
        cheatSheet: [
          { tag: "composition", desc: "Nest components to build complex UI" },
          { tag: "<App><Header /><Main /></App>", desc: "Sibling composition in parent" },
          { tag: "single responsibility", desc: "Each component does one thing well" },
        ],
      }),
    ],
  },
  {
    slug: "state",
    title: "State",
    description: "Local component state with useState, updates, derived values, and lifting state.",
    topics: [
      t({
        slug: "useState-basics",
        title: "useState Basics",
        summary: "useState adds local, reactive state to function components.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["useState", "state", "hook", "re-render"],
        challengeWeight: 5,
        explanation:
          "const [count, setCount] = useState(0) returns the current state value and a setter function. Calling setCount(1) schedules a re-render with the new value. State is private to the component instance — each mount gets its own copy. Initial value is used only on first render; pass a function useState(() => expensive()) for lazy initialization. Hooks must be called at the top level, not inside conditions or loops.",
        a11yNotes: [
          "State changes that show/hide content should move focus appropriately.",
        ],
        commonMistakes: [
          "Calling useState conditionally (breaks Rules of Hooks)",
          "Mutating state directly: count++ instead of setCount(c => c + 1)",
          "Expecting setState to update count immediately in the same function",
        ],
        bestPractices: [
          "Name state and setter in pairs: [value, setValue]",
          "Use functional updates when new state depends on previous state",
          "Split unrelated state into separate useState calls",
        ],
        interviewQuestions: [
          "What does useState return?",
          "Why cannot you call hooks inside an if statement?",
          "Is setState synchronous?",
        ],
        cheatSheet: [
          { tag: "useState(initial)", desc: "Declare state; returns [value, setter]" },
          { tag: "setCount(n)", desc: "Update state and trigger re-render" },
          { tag: "setCount(c => c + 1)", desc: "Functional update from previous state" },
        ],
      }),
      t({
        slug: "updating-state",
        title: "Updating State",
        summary: "State updates are asynchronous; use functional form when depending on prior value.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["setState", "functional", "batch", "async"],
        challengeWeight: 5,
        explanation:
          "setCount(count + 1) replaces state with a new value. React batches multiple setState calls in event handlers for performance. Because updates are asynchronous, reading count right after setCount may still show the old value — use useEffect to react to changes, or functional updates: setCount(prev => prev + 1). For objects and arrays, always create new references: setUser({ ...user, name: 'Ada' }).",
        a11yNotes: [],
        commonMistakes: [
          "Mutating state objects: user.name = 'x' then setUser(user)",
          "Calling setState multiple times with the same stale closure value",
          "Replacing entire object when only one field changed unnecessarily (sometimes OK for clarity)",
        ],
        bestPractices: [
          "Spread or copy objects/arrays when updating nested state",
          "Use functional updates for increments and toggles",
          "Colocate state as close as possible to where it is used",
        ],
        interviewQuestions: [
          "Why use the functional form of setState?",
          "What is state batching?",
          "How do you update a property in a state object?",
        ],
        cheatSheet: [
          { tag: "setState(newValue)", desc: "Replace state with new value" },
          { tag: "setState(prev => ...)", desc: "Update based on previous state" },
          { tag: "{ ...obj, key: val }", desc: "Immutable object update pattern" },
        ],
      }),
      t({
        slug: "derived-state",
        title: "Derived State",
        summary: "Compute values from state during render instead of storing duplicates.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["derived", "compute", "render", "memo"],
        challengeWeight: 4,
        explanation:
          "Derived state is calculated from existing state or props during render — e.g. const fullName = first + ' ' + last. Do not store in useState what you can compute. Storing filteredLists in state when you have items and filterText causes sync bugs. Derive: const visible = items.filter(i => i.includes(filter)). Use useMemo only when the computation is expensive, not by default.",
        a11yNotes: [],
        commonMistakes: [
          "Duplicating props into state (syncing props to state anti-pattern)",
          "Using useEffect to set derived values that could be computed in render",
          "Overusing useMemo for trivial calculations",
        ],
        bestPractices: [
          "Derive during render whenever possible",
          "If a value can be computed from props + state, do not store it in state",
          "Use useMemo when profiling shows a real performance cost",
        ],
        interviewQuestions: [
          "What is derived state?",
          "When should you avoid storing a value in useState?",
          "What is wrong with syncing props to state in useEffect?",
        ],
        cheatSheet: [
          { tag: "const derived = f(state)", desc: "Compute during render" },
          { tag: "useMemo", desc: "Cache expensive derived values between renders" },
          { tag: "single source of truth", desc: "Store minimal state; derive the rest" },
        ],
      }),
      t({
        slug: "lifting-state-up",
        title: "Lifting State Up",
        summary: "Move shared state to the closest common parent component.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["lifting", "shared", "parent", "siblings"],
        challengeWeight: 5,
        explanation:
          "When two sibling components need the same data, lift state to their parent. Parent holds state and passes value + setter down as props. Example: TemperatureInput in Celsius and Fahrenheit — parent stores value in one unit, children convert for display. This preserves a single source of truth. If drilling becomes painful across many levels, consider Context (later topic).",
        a11yNotes: [],
        commonMistakes: [
          "Duplicating state in siblings and trying to sync with useEffect",
          "Lifting too high too early (global state for local UI)",
          "Passing setState directly without wrapping when validation is needed",
        ],
        bestPractices: [
          "Identify the lowest common ancestor for shared state",
          "Pass both value and onChange callback to controlled children",
          "Refactor incrementally when siblings need to stay in sync",
        ],
        interviewQuestions: [
          "What does lifting state up mean?",
          "When do sibling components need a shared parent for state?",
          "How do you share state between two child components?",
        ],
        cheatSheet: [
          { tag: "lifting state up", desc: "Move shared state to common parent" },
          { tag: "value + onChange", desc: "Controlled child pattern from parent" },
          { tag: "single source of truth", desc: "One owner holds authoritative state" },
        ],
      }),
    ],
  },
  {
    slug: "events-and-forms",
    title: "Events & Forms",
    description: "Handle user events and build controlled forms in React.",
    topics: [
      t({
        slug: "handling-events",
        title: "Handling Events",
        summary: "React uses camelCase synthetic events and function references for handlers.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["events", "onClick", "handler", "synthetic"],
        challengeWeight: 4,
        explanation:
          "Attach handlers with camelCase props: onClick, onChange, onSubmit. Pass a function reference, not a call: onClick={handleClick} not onClick={handleClick()} (unless wrapping). React wraps native events in SyntheticEvent for cross-browser consistency. event.preventDefault() stops form submit or link navigation. Inline arrows are fine for simple cases: onClick={() => setOpen(true)}.",
        a11yNotes: [
          "Prefer native interactive elements (button, a) over div onClick.",
          "Support keyboard activation — buttons handle Enter/Space by default.",
        ],
        commonMistakes: [
          "Calling the handler immediately: onClick={fn()} instead of onClick={fn}",
          "Using onclick lowercase (ignored in JSX)",
          "Forgetting preventDefault on form submit when handling manually",
        ],
        bestPractices: [
          "Name handlers handle* or on*: handleSubmit, onClose",
          "Use event.currentTarget for the element with the listener",
          "Extract inline handlers when logic grows beyond one line",
        ],
        interviewQuestions: [
          "Why are event props camelCase in React?",
          "What is a SyntheticEvent?",
          "What is the difference between onClick={fn} and onClick={fn()}?",
        ],
        cheatSheet: [
          { tag: "onClick={handler}", desc: "Pass function reference as handler" },
          { tag: "e.preventDefault()", desc: "Prevent default browser behavior" },
          { tag: "SyntheticEvent", desc: "React's cross-browser event wrapper" },
        ],
      }),
      t({
        slug: "controlled-inputs",
        title: "Controlled Inputs",
        summary: "Input value is driven by React state; onChange updates that state.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["controlled", "input", "value", "onChange"],
        challengeWeight: 5,
        explanation:
          "A controlled input's value comes from state: <input value={text} onChange={e => setText(e.target.value)} />. React is the source of truth — the DOM reflects state. For checkboxes use checked={bool}; for select use value on <select>. Textareas use value like inputs. Uncontrolled inputs use refs and defaultValue — prefer controlled for forms you validate or submit from state.",
        a11yNotes: [
          "Pair inputs with <label htmlFor={id}> or wrap input inside label.",
          "Announce validation errors with aria-invalid and aria-describedby.",
        ],
        commonMistakes: [
          "Setting value without onChange (read-only field warning)",
          "Using value on checkbox instead of checked",
          "Forgetting to convert input value types (numbers from e.target.value are strings)",
        ],
        bestPractices: [
          "One piece of state per field or a single form object for larger forms",
          "Use name attribute and a handler factory for many fields",
          "Debounce expensive validation on text inputs",
        ],
        interviewQuestions: [
          "What is a controlled component?",
          "What is the difference between controlled and uncontrolled inputs?",
          "Why must you provide onChange with value?",
        ],
        cheatSheet: [
          { tag: "value={state}", desc: "Controlled input bound to state" },
          { tag: "onChange={e => set...}", desc: "Update state from input event" },
          { tag: "checked={bool}", desc: "Controlled checkbox/radio" },
        ],
      }),
      t({
        slug: "forms-submit",
        title: "Form Submit",
        summary: "Handle onSubmit, prevent default reload, and read form state.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["form", "submit", "preventDefault", "validation"],
        challengeWeight: 4,
        explanation:
          "Put onSubmit on <form>, not on the button: <form onSubmit={handleSubmit}>. Call e.preventDefault() to stop the browser from reloading the page. Read values from controlled state or from new FormData(e.target) for mixed approaches. Disable submit button while submitting: disabled={isSubmitting}. Reset with setState or form.reset() for uncontrolled fields.",
        a11yNotes: [
          "Use type=\"submit\" on the primary button inside a form.",
          "Expose submission errors in a live region (role=\"alert\").",
        ],
        commonMistakes: [
          "Using onClick on submit button without preventing form default",
          "Omitting preventDefault and getting a full page refresh",
          "Not handling async submit errors or loading state",
        ],
        bestPractices: [
          "Validate before submit; show inline field errors",
          "Keep submit logic in one handleSubmit function",
          "Consider form libraries (React Hook Form) for large forms",
        ],
        interviewQuestions: [
          "Where should onSubmit be attached?",
          "Why call preventDefault on form submit?",
          "How do you disable double submission?",
        ],
        cheatSheet: [
          { tag: "onSubmit={fn}", desc: "Handle form submission on <form>" },
          { tag: "e.preventDefault()", desc: "Stop page reload on submit" },
          { tag: "FormData(form)", desc: "Read field values from form element" },
        ],
      }),
    ],
  },
  {
    slug: "lists-and-keys",
    title: "Lists & Keys",
    description: "Render arrays with map, assign stable keys, and show UI conditionally.",
    topics: [
      t({
        slug: "rendering-lists",
        title: "Rendering Lists",
        summary: "Use array.map to transform data into a list of JSX elements.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["map", "list", "array", "render"],
        challengeWeight: 5,
        explanation:
          "Render lists by mapping data to elements: items.map(item => <li key={item.id}>{item.name}</li>). map returns a new array of JSX nodes React renders as siblings. Extract a list item component when markup grows: items.map(item => <TodoItem key={item.id} todo={item} />). Empty lists: show a fallback with conditional rendering. Never use index as key when list order can change.",
        a11yNotes: [
          "Use ul/ol with li for lists — not divs — unless design system requires otherwise.",
          "Announce dynamic list changes when content is critical (live regions).",
        ],
        commonMistakes: [
          "Forgetting key on mapped elements",
          "Using map without returning JSX (missing return in curly form)",
          "Mutating the source array during render",
        ],
        bestPractices: [
          "Extract ItemRow components for readability",
          "Keep list data in state or props, not duplicated",
          "Sort and filter before map, not inside JSX when complex",
        ],
        interviewQuestions: [
          "How do you render a list in React?",
          "Why does each list item need a key?",
          "Can you use map inside JSX?",
        ],
        cheatSheet: [
          { tag: "array.map()", desc: "Transform items to JSX elements" },
          { tag: "key={item.id}", desc: "Stable identity for list items" },
          { tag: "<ul>{items.map(...)}</ul>", desc: "Semantic list rendering" },
        ],
      }),
      t({
        slug: "keys-explained",
        title: "Keys Explained",
        summary: "Keys help React identify which items changed, were added, or removed.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["key", "reconciliation", "identity", "list"],
        challengeWeight: 5,
        explanation:
          "key is a special prop (not passed to the component) used during reconciliation. Stable unique ids (database id, uuid) are best. Index as key is OK only for static lists that never reorder. Wrong keys cause bugs: inputs keep wrong values, state attaches to wrong row. Keys must be unique among siblings, not globally.",
        a11yNotes: [],
        commonMistakes: [
          "Using array index as key for sortable or deletable lists",
          "Generating random keys with Math.random() on each render",
          "Duplicating keys across siblings",
        ],
        bestPractices: [
          "Use persistent ids from your data model",
          "Generate ids when creating items, not at render time",
          "Move key to the outermost element in the map callback",
        ],
        interviewQuestions: [
          "What are keys used for in React?",
          "When is index as key acceptable?",
          "What happens if keys are not unique?",
        ],
        cheatSheet: [
          { tag: "key={id}", desc: "Sibling-unique stable identifier" },
          { tag: "reconciliation", desc: "React diff algorithm for lists" },
          { tag: "avoid index key", desc: "Don't use index when list mutates order" },
        ],
      }),
      t({
        slug: "conditional-rendering",
        title: "Conditional Rendering",
        summary: "Show different UI with if/else, ternary, &&, and early returns.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["conditional", "ternary", "&&", "loading"],
        challengeWeight: 4,
        explanation:
          "Return different JSX based on state: early return if (loading) return <Spinner />; ternary {error ? <Error /> : <Content />}; short-circuit {isLoggedIn && <Dashboard />}. && treats 0 as renderable — use Boolean() or explicit ternary when count can be zero. Switch on status enums for multi-way UI. Keep conditions readable — extract subcomponents for heavy branches.",
        a11yNotes: [
          "Do not rely on color alone for conditional status — use text or icons with labels.",
          "Loading states should be announced (aria-busy, live region).",
        ],
        commonMistakes: [
          "Using {count && <List />} when count can be 0 (renders '0')",
          "Deeply nested ternaries that are hard to read",
          "Rendering nothing without considering screen reader feedback",
        ],
        bestPractices: [
          "Early return for loading/error at top of component",
          "Extract StatusView component for complex branching",
          "Use explicit null return when nothing should render",
        ],
        interviewQuestions: [
          "What are ways to conditionally render in JSX?",
          "What is the pitfall of && with numeric zero?",
          "When use early return vs ternary?",
        ],
        cheatSheet: [
          { tag: "condition ? A : B", desc: "Ternary in JSX expression" },
          { tag: "condition && <Comp />", desc: "Render when truthy" },
          { tag: "if (...) return", desc: "Early return before main JSX" },
        ],
      }),
    ],
  },
  {
    slug: "effects",
    title: "Effects",
    description: "Side effects with useEffect: dependencies, cleanup, and data fetching.",
    topics: [
      t({
        slug: "useEffect-basics",
        title: "useEffect Basics",
        summary: "useEffect runs side effects after render — DOM sync, subscriptions, timers.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["useEffect", "side-effect", "mount", "render"],
        challengeWeight: 5,
        explanation:
          "useEffect(() => { ... }, [deps]) runs after paint. Omitting deps runs every render; empty [] runs once on mount. Side effects belong here: fetching data, subscriptions, manual DOM APIs, logging. Not for deriving state from props (compute in render). The effect function can return a cleanup function called before re-run and on unmount.",
        a11yNotes: [
          "Focus management on mount/unmount is a valid effect use case.",
        ],
        commonMistakes: [
          "Using useEffect for calculations that belong in render",
          "Missing dependency array entirely and causing infinite loops",
          "Forgetting cleanup for intervals, listeners, or subscriptions",
        ],
        bestPractices: [
          "Name effects by what they do: sync document title, subscribe to socket",
          "Keep effects focused — split unrelated logic into separate useEffects",
          "Prefer event handlers over effects for user-triggered updates",
        ],
        interviewQuestions: [
          "When does useEffect run?",
          "What is the difference between no deps and [] deps?",
          "What belongs in useEffect vs event handlers?",
        ],
        cheatSheet: [
          { tag: "useEffect(fn, deps)", desc: "Run side effect after render" },
          { tag: "[]", desc: "Run once on mount (and cleanup on unmount)" },
          { tag: "return () => {}", desc: "Cleanup function before re-run/unmount" },
        ],
      }),
      t({
        slug: "effect-dependencies",
        title: "Effect Dependencies",
        summary: "The dependency array tells React when to re-run an effect.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["dependencies", "deps", "eslint", "stale"],
        challengeWeight: 5,
        explanation:
          "Include every reactive value from the component scope that the effect reads: props, state, functions. When deps change, React re-runs the effect. Stale closures happen when deps are omitted — effect sees old values. react-hooks/exhaustive-deps ESLint rule warns about missing deps. Stable functions can be wrapped in useCallback or defined inside the effect.",
        a11yNotes: [],
        commonMistakes: [
          "Disabling exhaustive-deps without understanding the risk",
          "Putting objects/arrays in deps without memoization (re-runs every render)",
          "Omitting deps to 'run once' while reading changing props inside",
        ],
        bestPractices: [
          "Trust exhaustive-deps; fix deps rather than suppress warnings",
          "Move primitive deps only; derive stable ids from objects",
          "Define helper functions inside the effect when they are not reused",
        ],
        interviewQuestions: [
          "What goes in the useEffect dependency array?",
          "What is a stale closure in effects?",
          "Why might an effect run on every render?",
        ],
        cheatSheet: [
          { tag: "[dep1, dep2]", desc: "Re-run when any dep changes" },
          { tag: "exhaustive-deps", desc: "ESLint rule for effect dependencies" },
          { tag: "stale closure", desc: "Effect captures outdated state/props" },
        ],
      }),
      t({
        slug: "cleanup-effects",
        title: "Cleanup Effects",
        summary: "Return a cleanup function to tear down subscriptions, timers, and listeners.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["cleanup", "unmount", "subscription", "timer"],
        challengeWeight: 4,
        explanation:
          "useEffect(() => { const id = setInterval(tick, 1000); return () => clearInterval(id); }, []). Cleanup runs before the effect re-executes and when the component unmounts. Required for addEventListener, WebSocket, fetch abort controllers, and DOM mutations. Without cleanup, leaks and duplicate handlers accumulate in SPAs.",
        a11yNotes: [],
        commonMistakes: [
          "Adding window listeners without removeEventListener in cleanup",
          "Clearing intervals only on unmount when deps change also need cleanup",
          "Async effects that set state after unmount (use aborted flag or AbortController)",
        ],
        bestPractices: [
          "Always pair subscribe/add with cleanup remove/clear",
          "Use AbortController for fetch in effects",
          "Track mounted state or ignore stale async results",
        ],
        interviewQuestions: [
          "When does the useEffect cleanup function run?",
          "Why is cleanup important in SPAs?",
          "How do you cancel fetch in a cleanup?",
        ],
        cheatSheet: [
          { tag: "return () => cleanup()", desc: "Register effect teardown" },
          { tag: "clearInterval(id)", desc: "Stop timer on cleanup" },
          { tag: "AbortController", desc: "Cancel in-flight fetch on unmount" },
        ],
      }),
      t({
        slug: "data-fetching-effect",
        title: "Data Fetching in Effects",
        summary: "Fetch remote data on mount or when ids change; handle loading and errors.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["fetch", "api", "loading", "async"],
        challengeWeight: 5,
        explanation:
          "Pattern: const [data, setData] = useState(null); useEffect(() => { let cancelled = false; fetch(url).then(r => r.json()).then(d => { if (!cancelled) setData(d); }); return () => { cancelled = true; }; }, [url]). Track loading and error state separately. For production, consider React Query or SWR. Server Components (Next.js) may fetch on server instead.",
        a11yNotes: [
          "Announce loading completion for critical content with aria-live.",
          "Ensure error messages are readable and associated with the region.",
        ],
        commonMistakes: [
          "Calling async function directly as effect callback (use inner async IIFE)",
          "Not handling race conditions when id changes quickly",
          "Setting state after unmount without guard or abort",
        ],
        bestPractices: [
          "Use loading, error, and data states explicitly",
          "Abort fetch on cleanup or use ignore flag",
          "Consider dedicated data-fetching libraries for caching and retries",
        ],
        interviewQuestions: [
          "How do you fetch data in a function component?",
          "How do you prevent setting state on unmounted components?",
          "What are alternatives to fetch-in-useEffect?",
        ],
        cheatSheet: [
          { tag: "fetch(url)", desc: "HTTP request in effect" },
          { tag: "loading / error / data", desc: "Standard async UI states" },
          { tag: "cancelled flag", desc: "Ignore stale responses after unmount" },
        ],
      }),
    ],
  },
  {
    slug: "hooks-deeper",
    title: "Hooks Deeper",
    description: "useRef, performance hooks, and extracting custom hooks.",
    topics: [
      t({
        slug: "useRef-basics",
        title: "useRef Basics",
        summary: "useRef holds a mutable value that persists across renders without causing re-renders.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["useRef", "dom", "mutable", "persist"],
        challengeWeight: 4,
        explanation:
          "const ref = useRef(initial) returns { current: initial }. Updating ref.current does not trigger re-render. Common uses: DOM access via ref={inputRef} and inputRef.current.focus(); storing previous values; holding timer ids. Do not read or write ref.current during render (except initialization). Refs are escape hatches — prefer state for UI that should update the screen.",
        a11yNotes: [
          "Use ref.focus() to move keyboard focus into modals on open.",
        ],
        commonMistakes: [
          "Expecting ref changes to re-render the component",
          "Accessing ref.current before the element mounts (null on first render)",
          "Overusing refs instead of state for values shown in UI",
        ],
        bestPractices: [
          "Use refs for DOM measurements and imperative APIs",
          "Combine with useEffect when acting on mounted DOM nodes",
          "Name refs by purpose: inputRef, dialogRef",
        ],
        interviewQuestions: [
          "What is useRef used for?",
          "Does changing ref.current cause a re-render?",
          "When is a ref null?",
        ],
        cheatSheet: [
          { tag: "useRef(initial)", desc: "Mutable box with .current property" },
          { tag: "ref={myRef}", desc: "Attach ref to DOM element" },
          { tag: "myRef.current", desc: "Read/write without re-render" },
        ],
      }),
      t({
        slug: "useMemo-useCallback-intro",
        title: "useMemo & useCallback Intro",
        summary: "Memoize expensive calculations and stable function references.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["useMemo", "useCallback", "memoization", "performance"],
        challengeWeight: 4,
        explanation:
          "useMemo(() => compute(a, b), [a, b]) caches a computed value between renders when deps unchanged. useCallback(fn, deps) caches the function reference itself — useful when passing callbacks to memoized children. Do not memoize everything; measure first. React Compiler (future) may auto-memoize. Default: write clear code, optimize when profiling shows bottlenecks.",
        a11yNotes: [],
        commonMistakes: [
          "Wrapping every value in useMemo (added complexity, little gain)",
          "Missing deps causing stale memoized values",
          "Thinking useCallback makes the function faster to execute (it only stabilizes reference)",
        ],
        bestPractices: [
          "Profile before memoizing",
          "useMemo for expensive filters/sorts on large lists",
          "useCallback when passing to React.memo children or as effect deps",
        ],
        interviewQuestions: [
          "What is the difference between useMemo and useCallback?",
          "When should you not use useMemo?",
          "Does useCallback improve function execution speed?",
        ],
        cheatSheet: [
          { tag: "useMemo(fn, deps)", desc: "Cache computed value" },
          { tag: "useCallback(fn, deps)", desc: "Cache stable function reference" },
          { tag: "React.memo", desc: "Skip re-render if props shallow-equal" },
        ],
      }),
      t({
        slug: "custom-hooks-intro",
        title: "Custom Hooks Intro",
        summary: "Extract reusable stateful logic into functions named useSomething.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["custom-hook", "reuse", "logic", "use"],
        challengeWeight: 4,
        explanation:
          "Custom hooks are functions that call other hooks and share logic: function useCounter(initial) { const [n, set] = useState(initial); const inc = () => set(c => c + 1); return { n, inc }; }. Name must start with use. Each component calling the hook gets isolated state. Examples: useFetch, useLocalStorage, useDebounce. They do not share state unless you use context or external store.",
        a11yNotes: [],
        commonMistakes: [
          "Naming without use prefix (breaks Rules of Hooks linting)",
          "Returning inconsistent tuple vs object shapes across similar hooks",
          "Putting JSX inside custom hooks (extract components instead)",
        ],
        bestPractices: [
          "Return arrays for 2-tuples (useState style) or objects for many values",
          "Keep hooks focused on one concern",
          "Colocate hook with feature or put in hooks/ directory",
        ],
        interviewQuestions: [
          "What is a custom hook?",
          "Do two components sharing a custom hook share state?",
          "What naming convention must custom hooks follow?",
        ],
        cheatSheet: [
          { tag: "function useX()", desc: "Custom hook — calls other hooks" },
          { tag: "use prefix", desc: "Required naming for hook functions" },
          { tag: "return { state, actions }", desc: "Expose hook API to components" },
        ],
      }),
    ],
  },
  {
    slug: "routing-and-structure",
    title: "Routing & Structure",
    description: "Client-side routes, layouts, and folder organization for React apps.",
    topics: [
      t({
        slug: "react-router-basics",
        title: "React Router Basics",
        summary: "Map URLs to components with React Router's declarative routing.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["router", "route", "link", "spa"],
        challengeWeight: 5,
        explanation:
          "React Router (react-router-dom) syncs UI with the URL. Wrap app in <BrowserRouter>, define <Routes><Route path=\"/\" element={<Home />} /><Route path=\"/about\" element={<About />} /></Routes>. Navigate with <Link to=\"/about\"> — not <a href> for internal links (avoids full reload). useParams() reads :id segments; useNavigate() programmatic navigation.",
        a11yNotes: [
          "Use Link for in-app navigation; ensure focus moves to main on route change.",
          "Set page title per route for screen reader context.",
        ],
        commonMistakes: [
          "Using <a href> for internal routes causing full page reload",
          "Forgetting BrowserRouter wrapper",
          "Not handling 404 with path=\"*\" catch-all route",
        ],
        bestPractices: [
          "Centralize route definitions in a routes module",
          "Use nested routes for shared layouts",
          "Lazy-load route components with React.lazy for code splitting",
        ],
        interviewQuestions: [
          "How does client-side routing work in React?",
          "What is the difference between Link and anchor tags?",
          "How do you read URL parameters?",
        ],
        cheatSheet: [
          { tag: "<Route path element>", desc: "Map path to component" },
          { tag: "<Link to>", desc: "Client-side navigation" },
          { tag: "useParams()", desc: "Read dynamic route segments" },
        ],
      }),
      t({
        slug: "layout-routes",
        title: "Layout Routes",
        summary: "Nested routes share a layout wrapper via Outlet.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["layout", "outlet", "nested", "shell"],
        challengeWeight: 4,
        explanation:
          "Layout routes wrap child routes without remounting shared chrome. <Route element={<AppLayout />}><Route path=\"/\" element={<Home />} /><Route path=\"/settings\" element={<Settings />} /></Route>. AppLayout renders <header>, <nav>, and <Outlet /> where child route element appears. Index routes render at parent path. Layouts preserve state in header/sidebar while main content swaps.",
        a11yNotes: [
          "Wrap Outlet content in <main> for landmark navigation.",
          "Skip links help keyboard users bypass repeated layout chrome.",
        ],
        commonMistakes: [
          "Duplicating header in every page instead of layout route",
          "Putting Outlet in wrong nesting level",
          "Confusing index route with path=\"/\" on child",
        ],
        bestPractices: [
          "One AppLayout for authenticated shell, another for marketing pages",
          "Use Outlet context sparingly for layout-to-child data",
          "Match layout boundaries to UX regions",
        ],
        interviewQuestions: [
          "What is an Outlet in React Router?",
          "Why use nested layout routes?",
          "What is an index route?",
        ],
        cheatSheet: [
          { tag: "<Outlet />", desc: "Render child route element in layout" },
          { tag: "nested <Route>", desc: "Child routes under layout parent" },
          { tag: "index route", desc: "Default child at parent URL" },
        ],
      }),
      t({
        slug: "organizing-folders",
        title: "Organizing Folders",
        summary: "Structure React projects by feature or type for maintainability.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["folders", "structure", "features", "components"],
        challengeWeight: 3,
        explanation:
          "Common layouts: src/components (shared UI), src/pages or src/routes (route-level views), src/hooks, src/utils, src/features/<name> (colocated components, hooks, api for a domain). Feature folders scale well: features/todos/TodoList.tsx, useTodos.ts. Avoid deep nesting early. Co-locate tests and styles with components when team prefers.",
        a11yNotes: [],
        commonMistakes: [
          "Giant components/ folder with hundreds of unrelated files",
          "Premature micro-folder structure for tiny apps",
          "Circular imports between features",
        ],
        bestPractices: [
          "Start simple; refactor to features as app grows",
          "Barrel exports (index.ts) sparingly — can hurt tree-shaking",
          "Keep shared UI dumb and reusable; feature logic in features/",
        ],
        interviewQuestions: [
          "How would you structure a medium-sized React app?",
          "Feature-based vs type-based folders — trade-offs?",
          "Where do custom hooks live?",
        ],
        cheatSheet: [
          { tag: "src/features/", desc: "Domain-colocated modules" },
          { tag: "src/components/", desc: "Shared presentational UI" },
          { tag: "src/hooks/", desc: "Shared custom hooks" },
        ],
      }),
    ],
  },
  {
    slug: "patterns",
    title: "Patterns",
    description: "Context, prop drilling trade-offs, and error boundaries.",
    topics: [
      t({
        slug: "context-basics",
        title: "Context Basics",
        summary: "Context passes data through the tree without prop drilling every level.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["context", "provider", "consumer", "global"],
        challengeWeight: 5,
        explanation:
          "createContext(default) returns Context. Provider wraps subtree: <ThemeContext.Provider value={theme}>. Consumers read with useContext(ThemeContext). Good for theme, locale, auth user — data many components need but not changing every second. Split contexts to avoid unnecessary re-renders. Not a replacement for all global state libraries.",
        a11yNotes: [],
        commonMistakes: [
          "Putting fast-changing values in one big context (re-renders entire subtree)",
          "Using context for every piece of shared state",
          "Forgetting Provider wrapper (gets default value silently)",
        ],
        bestPractices: [
          "Split ThemeContext from UserContext",
          "Memoize provider value object when it is an object literal",
          "Export a custom hook useTheme() that wraps useContext",
        ],
        interviewQuestions: [
          "What problem does React Context solve?",
          "How do you create and consume context?",
          "When should you avoid context?",
        ],
        cheatSheet: [
          { tag: "createContext()", desc: "Create context object" },
          { tag: "<Provider value>", desc: "Supply value to descendants" },
          { tag: "useContext(Ctx)", desc: "Read nearest provider value" },
        ],
      }),
      t({
        slug: "prop-drilling-vs-context",
        title: "Prop Drilling vs Context",
        summary: "Choose between explicit props and context based on depth and update frequency.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["prop-drilling", "context", "trade-off", "state"],
        challengeWeight: 4,
        explanation:
          "Prop drilling passes props through intermediate components that do not use them. It is explicit and easy to trace — fine for 1–2 levels. Context avoids drilling but hides data flow and can broaden re-render scope. Component composition (children) can also avoid drilling: <Page user={user}><Profile /></Page> where Page clones child with user. State libraries (Zustand, Redux) for complex global state.",
        a11yNotes: [],
        commonMistakes: [
          "Jumping to context for props passed only two levels",
          "Using context for form field values that change every keystroke",
          "Intermediate components passing 10+ unrelated props",
        ],
        bestPractices: [
          "Prefer colocation and lifting before context",
          "Use composition to inject props without middlemen",
          "Reach for context when 3+ levels need the same stable data",
        ],
        interviewQuestions: [
          "What is prop drilling?",
          "When is context better than drilling?",
          "What are downsides of context?",
        ],
        cheatSheet: [
          { tag: "prop drilling", desc: "Pass props through unused intermediates" },
          { tag: "composition", desc: "Children pattern to skip middle props" },
          { tag: "context", desc: "Broadcast value to deep subtree" },
        ],
      }),
      t({
        slug: "error-boundaries-intro",
        title: "Error Boundaries Intro",
        summary: "Error boundaries catch render errors in children and show fallback UI.",
        estimatedMinutes: 14,
        difficulty: "advanced",
        keywords: ["error-boundary", "fallback", "crash", "class"],
        challengeWeight: 4,
        explanation:
          "Error boundaries catch JavaScript errors in child component trees during render. Currently implemented as class components with static getDerivedStateFromError and componentDidCatch — or use react-error-boundary library. They do not catch event handler errors, async code, or SSR errors. Wrap risky widgets (charts, third-party) to isolate failures.",
        a11yNotes: [
          "Fallback UI should explain the error and offer recovery (retry, go home).",
          "Do not trap focus inside error message without escape path.",
        ],
        commonMistakes: [
          "Expecting error boundaries to catch onClick handler throws",
          "One boundary at root with unhelpful generic message",
          "Not logging errors in componentDidCatch",
        ],
        bestPractices: [
          "Place boundaries around independent UI regions",
          "Provide resetKeys or retry to recover without full reload",
          "Log to monitoring service in componentDidCatch",
        ],
        interviewQuestions: [
          "What errors do error boundaries catch?",
          "Why are error boundaries class components?",
          "How do you recover from a caught render error?",
        ],
        cheatSheet: [
          { tag: "ErrorBoundary", desc: "Catch child render errors" },
          { tag: "fallback UI", desc: "Replace crashed subtree" },
          { tag: "componentDidCatch", desc: "Log error info (class API)" },
        ],
      }),
    ],
  },
  {
    slug: "styling",
    title: "Styling",
    description: "CSS Modules, conditional classes, and common React styling patterns.",
    topics: [
      t({
        slug: "css-modules-react",
        title: "CSS Modules in React",
        summary: "Import scoped class names from .module.css files.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["css-modules", "scope", "import", "className"],
        challengeWeight: 4,
        explanation:
          "Button.module.css exports hashed class names. import styles from './Button.module.css'; then className={styles.primary}. Scoping prevents global collisions. Compose with styles.base + ' ' + styles.active or template literals. Vite and CRA support CSS Modules out of the box. Global styles go in index.css without .module.",
        a11yNotes: [
          "Scoped styles still need focus-visible and contrast checks.",
        ],
        commonMistakes: [
          "Using styles.primary as string without importing module",
          "Expecting global element selectors inside modules to style children without :global",
          "Duplicating class names across many module files inconsistently",
        ],
        bestPractices: [
          "One module per component for colocation",
          "Use camelCase class names in CSS modules",
          "Keep design tokens in global CSS variables",
        ],
        interviewQuestions: [
          "What are CSS Modules?",
          "How do you apply a CSS Module class in JSX?",
          "How do CSS Modules avoid naming collisions?",
        ],
        cheatSheet: [
          { tag: "import styles from './X.module.css'", desc: "Load scoped classes" },
          { tag: "className={styles.btn}", desc: "Apply hashed class name" },
          { tag: ":global(.class)", desc: "Opt out of scoping in module" },
        ],
      }),
      t({
        slug: "conditional-classnames",
        title: "Conditional Class Names",
        summary: "Toggle CSS classes based on state with templates or clsx.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["className", "conditional", "clsx", "active"],
        challengeWeight: 4,
        explanation:
          "Combine static and dynamic classes: className={`btn ${isActive ? 'active' : ''}`}. Libraries like clsx/classnames simplify: clsx('btn', { active: isActive, disabled }). With CSS Modules: clsx(styles.btn, isActive && styles.active). Avoid long template strings — extract to a variable or helper for readability.",
        a11yNotes: [
          "Reflect state in attributes too: aria-pressed, aria-expanded, not only classes.",
        ],
        commonMistakes: [
          "Extra spaces or 'undefined' strings in className templates",
          "Using class instead of className",
          "Relying only on color class changes without ARIA for toggle state",
        ],
        bestPractices: [
          "Use clsx for more than two conditional classes",
          "Mirror visual state with appropriate aria-* attributes",
          "Keep class logic near the component return",
        ],
        interviewQuestions: [
          "How do you apply conditional classes in React?",
          "What does clsx do?",
          "class vs className in JSX?",
        ],
        cheatSheet: [
          { tag: "className={`a ${cond ? 'b' : ''}`}", desc: "Template literal classes" },
          { tag: "clsx('a', { b: cond })", desc: "Conditional class utility" },
          { tag: "styles.active", desc: "CSS Module class when active" },
        ],
      }),
      t({
        slug: "styling-patterns",
        title: "Styling Patterns",
        summary: "Compare CSS Modules, Tailwind, CSS-in-JS, and global utilities.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["tailwind", "css-in-js", "styled", "patterns"],
        challengeWeight: 3,
        explanation:
          "Teams pick one primary approach: CSS Modules (scoped files), Tailwind (utility classes in JSX), CSS-in-JS (styled-components, Emotion — runtime or compile-time), or plain global CSS for small apps. Tailwind example: className=\"flex gap-2 p-4 rounded-lg\". CSS-in-JS colocates styles as JS templates. Consistency matters more than the specific tool.",
        a11yNotes: [
          "Utility frameworks still require you to add focus and sr-only classes explicitly.",
        ],
        commonMistakes: [
          "Mixing three styling systems in one codebase without convention",
          "Huge inline style objects recreated every render",
          "Tailwind class strings so long they harm readability untracked",
        ],
        bestPractices: [
          "Document team styling choice in README or ADR",
          "Extract repeated utility combos into components",
          "Use design tokens for colors and spacing",
        ],
        interviewQuestions: [
          "What styling options exist for React?",
          "Trade-offs of CSS-in-JS vs CSS Modules?",
          "When might Tailwind fit a React project?",
        ],
        cheatSheet: [
          { tag: "CSS Modules", desc: "Scoped .module.css imports" },
          { tag: "Tailwind", desc: "Utility classes in className" },
          { tag: "styled-components", desc: "CSS-in-JS tagged templates" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Immutable updates, reconciliation, and accessibility in React apps.",
    topics: [
      t({
        slug: "immutable-updates",
        title: "Immutable Updates",
        summary: "Treat state as immutable — copy and replace, never mutate in place.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["immutable", "spread", "copy", "state"],
        challengeWeight: 5,
        explanation:
          "React compares state by reference for bail-out optimizations. Mutating arrays/objects in place may skip re-renders or cause subtle bugs. Update array: setItems([...items, newItem]), remove: items.filter, update one: items.map(i => i.id === id ? { ...i, done: true } : i). Nested updates need spread at each level or libraries like Immer (useImmer).",
        a11yNotes: [],
        commonMistakes: [
          "items.push(x); setItems(items) — same reference",
          "Mutating nested object without copying parent levels",
          "Sorting arrays in place with .sort() on state array",
        ],
        bestPractices: [
          "Use map/filter/spread instead of push/splice on state",
          "Copy nested paths: { ...state, user: { ...state.user, name } }",
          "Consider useReducer for complex nested state transitions",
        ],
        interviewQuestions: [
          "Why must React state updates be immutable?",
          "How do you add/remove/update array items immutably?",
          "What happens if you mutate state directly?",
        ],
        cheatSheet: [
          { tag: "[...arr, item]", desc: "Immutable array append" },
          { tag: "arr.filter(...)", desc: "Immutable remove" },
          { tag: "{ ...obj, key: val }", desc: "Immutable object patch" },
        ],
      }),
      t({
        slug: "keys-and-reconciliation",
        title: "Keys & Reconciliation",
        summary: "React diffs virtual trees using keys and element type to update the DOM efficiently.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["reconciliation", "virtual-dom", "diff", "keys"],
        challengeWeight: 5,
        explanation:
          "Reconciliation is React's process of comparing the new element tree with the previous one. Same type + same key → update props in place. Different type → unmount old, mount new. Keys identify list items across moves. Understanding this explains why index keys break controlled inputs in reordered lists and why component state resets when key changes intentionally.",
        a11yNotes: [],
        commonMistakes: [
          "Changing key to reset state without understanding unmount/remount cost",
          "Assuming React updates DOM node-by-node without diffing",
          "Reusing keys after deleting items (key collision with new items)",
        ],
        bestPractices: [
          "Use stable keys tied to entity identity",
          "Use key prop to force remount when switching entirely different entities",
          "Read React docs on reconciliation when debugging list state bugs",
        ],
        interviewQuestions: [
          "What is reconciliation?",
          "How do keys affect list updates?",
          "When would you intentionally change a component's key?",
        ],
        cheatSheet: [
          { tag: "reconciliation", desc: "Diff old vs new element trees" },
          { tag: "key", desc: "Identity for siblings in a list" },
          { tag: "same type → update", desc: "Different type → replace node" },
        ],
      }),
      t({
        slug: "a11y-in-react",
        title: "Accessibility in React",
        summary: "Semantic JSX, ARIA, focus management, and keyboard support in components.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["a11y", "aria", "semantic", "keyboard"],
        challengeWeight: 4,
        explanation:
          "React renders real DOM — HTML accessibility rules apply. Use button for actions, a for navigation. Pass aria-label, aria-expanded, role when building widgets. Manage focus in modals (trap focus, restore on close). eslint-plugin-jsx-a11y catches common issues. Headless libraries (Radix, React Aria) provide accessible primitives. Test with keyboard-only and screen readers.",
        a11yNotes: [
          "Every interactive control needs an accessible name.",
          "Route changes should move focus to h1 or main.",
          "Use aria-live for dynamic toast and error announcements.",
        ],
        commonMistakes: [
          "div with onClick instead of button",
          "Missing alt on images or empty alt on meaningful images",
          "Creating custom widgets without keyboard support",
        ],
        bestPractices: [
          "Install and fix jsx-a11y ESLint rules",
          "Use semantic HTML first; ARIA only when necessary",
          "Test modals and dialogs with Tab and Escape",
        ],
        interviewQuestions: [
          "How do you make a React modal accessible?",
          "When should you use aria-label?",
          "Does React guarantee accessibility automatically?",
        ],
        cheatSheet: [
          { tag: "aria-label", desc: "Accessible name when visible label absent" },
          { tag: "role=\"dialog\"", desc: "Mark modal dialog region" },
          { tag: "eslint-plugin-jsx-a11y", desc: "Lint a11y issues in JSX" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply React fundamentals with a counter and todo list project.",
    topics: [
      t({
        slug: "project-counter-react",
        title: "Project: Counter in React",
        summary: "Build a counter with useState, increment/decrement, and optional step size.",
        estimatedMinutes: 25,
        difficulty: "beginner",
        keywords: ["project", "counter", "useState", "practice"],
        challengeWeight: 4,
        explanation:
          "Create Counter component with count state and buttons calling setCount(c => c + 1) and setCount(c => c - 1). Add reset and step input (controlled number). Display count in output element for screen readers. Stretch: min/max bounds, hold-to-repeat, extract useCounter hook. This project reinforces state updates, events, and conditional disable at limits.",
        a11yNotes: [
          "Use <button type=\"button\"> for increment/decrement.",
          "Expose current count in aria-live=\"polite\" region when it changes.",
        ],
        commonMistakes: [
          "Mutating count with count++ instead of setCount",
          "Using div onClick for buttons",
          "Not disabling decrement at minimum if required",
        ],
        bestPractices: [
          "Functional updates for increment/decrement",
          "Extract button handlers with clear names",
          "Optional: useReducer if adding undo history",
        ],
        interviewQuestions: [
          "How would you build a counter component in React?",
          "Why use functional setState for increment?",
          "How would you extract this into a custom hook?",
        ],
        cheatSheet: [
          { tag: "useState(0)", desc: "Counter initial state" },
          { tag: "setCount(c => c + 1)", desc: "Safe increment update" },
          { tag: "aria-live=\"polite\"", desc: "Announce count changes" },
        ],
      }),
      t({
        slug: "project-todo-react",
        title: "Project: Todo List in React",
        summary: "Manage a list of todos with add, toggle, delete, and filter using state.",
        estimatedMinutes: 35,
        difficulty: "intermediate",
        keywords: ["project", "todo", "list", "state"],
        challengeWeight: 5,
        explanation:
          "State: todos array of { id, text, done }. Controlled input + form submit adds todo with crypto.randomUUID(). Map to list with key={id}. Toggle with immutable map; delete with filter. Filter tabs: all/active/done derive from todos — do not store filtered list separately. Optional: localStorage sync in useEffect, edit-in-place, empty state message.",
        a11yNotes: [
          "Use ul/li for todo list.",
          "Label input; use checkbox or button with aria-pressed for toggle.",
          "Announce item added/removed with live region if helpful.",
        ],
        commonMistakes: [
          "Index as key when deleting reorders causes wrong item removal",
          "Storing filteredTodos in separate state synced via useEffect",
          "Mutating todo objects in place on toggle",
        ],
        bestPractices: [
          "Single todos state; derive filtered view",
          "Immutable updates for toggle and delete",
          "Split TodoForm, TodoList, TodoItem components",
        ],
        interviewQuestions: [
          "How would you structure state for a todo app?",
          "How do you toggle one item immutably?",
          "Why derive filtered lists instead of storing them?",
        ],
        cheatSheet: [
          { tag: "todos.map(t => ...)", desc: "Render todo list" },
          { tag: "key={todo.id}", desc: "Stable key per todo" },
          { tag: "todos.filter(t => !t.done)", desc: "Derived active todos" },
        ],
      }),
    ],
  },
];

export function flattenReactTopics(): ReactTopicDef[] {
  return REACT_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
