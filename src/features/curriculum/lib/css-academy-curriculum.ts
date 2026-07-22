export type CssDifficulty = "beginner" | "intermediate" | "advanced";

export type CssTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: CssDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** CSS properties / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type CssSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: CssTopicDef[];
};

function t(partial: CssTopicDef): CssTopicDef {
  return partial;
}

export const CSS_ACADEMY_SECTIONS: CssSectionDef[] = [
  {
    slug: "css-introduction",
    title: "CSS Introduction",
    description: "What CSS is, how it attaches to HTML, and the cascade.",
    topics: [
      t({
        slug: "what-is-css",
        title: "What is CSS?",
        summary: "CSS is the presentation language of the web — how HTML looks.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["css", "presentation", "style"],
        challengeWeight: 4,
        explanation:
          "CSS (Cascading Style Sheets) controls colors, spacing, typography, and layout. HTML provides structure; CSS paints and arranges it. Cascading means multiple rules can apply, and the browser resolves conflicts with specificity and source order.",
        a11yNotes: ["Never convey meaning with color alone."],
        commonMistakes: ["Styling with HTML attributes instead of CSS", "Inline styles everywhere"],
        bestPractices: ["External stylesheets for reuse", "Classes over element spam"],
        interviewQuestions: ["What does cascading mean in CSS?", "HTML vs CSS responsibility?"],
        cheatSheet: [
          { tag: "color", desc: "Text color" },
          { tag: "background-color", desc: "Element background" },
          { tag: "font-size", desc: "Text size" },
        ],
      }),
      t({
        slug: "ways-to-add-css",
        title: "Ways to Add CSS",
        summary: "Inline, internal <style>, and external stylesheets.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["link", "style", "inline"],
        challengeWeight: 3,
        explanation:
          "You can style with style attributes, a <style> block in the head, or a .css file linked with rel=\"stylesheet\". External sheets scale best: cacheable, shareable, and easier to maintain.",
        a11yNotes: [],
        commonMistakes: ["Mixing all three without a plan", "Forgetting the link tag"],
        bestPractices: ["Prefer external CSS", "Keep inline styles rare"],
        interviewQuestions: ["Which way to include CSS is preferred and why?"],
        cheatSheet: [
          { tag: "link[rel=stylesheet]", desc: "Attach external CSS" },
          { tag: "<style>", desc: "Page-level CSS" },
          { tag: "style=\"\"", desc: "Inline on one element" },
        ],
      }),
      t({
        slug: "css-syntax",
        title: "CSS Syntax",
        summary: "Selectors, declarations, properties, and values.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["syntax", "declaration", "property"],
        challengeWeight: 3,
        explanation:
          "A rule is selector { property: value; }. Multiple declarations go inside the braces. Missing semicolons or braces break later rules. Comments use /* */.",
        a11yNotes: [],
        commonMistakes: ["Forgetting semicolons", "Typos in property names"],
        bestPractices: ["One declaration per line", "Consistent indentation"],
        interviewQuestions: ["Parts of a CSS rule?"],
        cheatSheet: [
          { tag: "selector", desc: "Targets elements" },
          { tag: "property", desc: "What to change" },
          { tag: "value", desc: "How to change it" },
        ],
      }),
      t({
        slug: "cascade-specificity",
        title: "Cascade and Specificity",
        summary: "How browsers decide which rule wins.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["cascade", "specificity", "!important"],
        challengeWeight: 4,
        explanation:
          "When rules conflict, the browser uses origin, specificity (inline > id > class > element), then source order. !important overrides but creates maintenance pain — use sparingly.",
        a11yNotes: [],
        commonMistakes: ["Sprinkling !important", "Overusing IDs for styling"],
        bestPractices: ["Low-specificity class styles", "Avoid !important except utilities"],
        interviewQuestions: ["How is specificity calculated?", "When is !important acceptable?"],
        cheatSheet: [
          { tag: "specificity", desc: "Weight of a selector" },
          { tag: "!important", desc: "Force a declaration" },
          { tag: "source order", desc: "Later rules win ties" },
        ],
      }),
    ],
  },
  {
    slug: "selectors",
    title: "Selectors",
    description: "Target the right elements cleanly.",
    topics: [
      t({
        slug: "type-class-id",
        title: "Type, Class, and ID",
        summary: "Element, .class, and #id selectors.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["class", "id", "element"],
        challengeWeight: 4,
        explanation:
          "Type selectors style all tags of a kind (p). Classes (.card) are reusable and preferred. IDs (#hero) are unique and high specificity — fine for landmarks, less ideal for styling systems.",
        a11yNotes: ["IDs are also used for label for= pairing."],
        commonMistakes: ["Styling everything with IDs", "Vague class names"],
        bestPractices: ["Meaningful class names", "Reuse classes"],
        interviewQuestions: ["Class vs ID for CSS?"],
        cheatSheet: [
          { tag: "p", desc: "Type selector" },
          { tag: ".card", desc: "Class selector" },
          { tag: "#hero", desc: "ID selector" },
        ],
      }),
      t({
        slug: "combinators",
        title: "Combinators",
        summary: "Descendant, child, sibling, and adjacent selectors.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["descendant", "child", "sibling"],
        challengeWeight: 3,
        explanation:
          "Space means descendant, > means direct child, + adjacent sibling, ~ general siblings. Combinators keep styles scoped without extra classes when structure is stable.",
        a11yNotes: [],
        commonMistakes: ["Over-nesting long descendant chains"],
        bestPractices: ["Prefer shallow combinators", "Don't couple to deep DOM"],
        interviewQuestions: ["Difference between space and > ?"],
        cheatSheet: [
          { tag: "A B", desc: "Descendant" },
          { tag: "A > B", desc: "Direct child" },
          { tag: "A + B", desc: "Next sibling" },
        ],
      }),
      t({
        slug: "pseudo-classes-elements",
        title: "Pseudo-classes and Pseudo-elements",
        summary: ":hover, :focus, ::before, ::after, and friends.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["hover", "focus", "before", "after"],
        challengeWeight: 4,
        explanation:
          "Pseudo-classes style states (:hover, :focus-visible, :nth-child). Pseudo-elements style parts (::before, ::first-line). Always provide visible focus styles for keyboard users.",
        a11yNotes: ["Never remove outline without a visible focus replacement."],
        commonMistakes: ["outline: none with no focus style"],
        bestPractices: [":focus-visible for keyboards", "Decorative ::before content empty for a11y"],
        interviewQuestions: ["Pseudo-class vs pseudo-element?"],
        cheatSheet: [
          { tag: ":hover", desc: "Pointer over element" },
          { tag: ":focus-visible", desc: "Keyboard focus" },
          { tag: "::before", desc: "Generated content before" },
        ],
      }),
      t({
        slug: "attribute-selectors",
        title: "Attribute Selectors",
        summary: "Match elements by attributes and values.",
        estimatedMinutes: 10,
        difficulty: "intermediate",
        keywords: ["attribute", "href", "type"],
        challengeWeight: 2,
        explanation:
          "[attr], [attr=value], [attr^=], [attr$=], [attr*=] target elements by attributes. Useful for links, inputs, and data attributes without extra classes.",
        a11yNotes: [],
        commonMistakes: ["Overly broad [class*=] matching"],
        bestPractices: ["Prefer classes for design systems", "Attributes for behavior hooks"],
        interviewQuestions: ["How do you select links that open externally?"],
        cheatSheet: [
          { tag: "[type=email]", desc: "Exact attribute" },
          { tag: "[href^=https]", desc: "Starts with" },
          { tag: "[class*=card]", desc: "Contains" },
        ],
      }),
    ],
  },
  {
    slug: "box-model",
    title: "Box Model & Layout Basics",
    description: "Size, space, and how boxes are measured.",
    topics: [
      t({
        slug: "box-model",
        title: "The Box Model",
        summary: "Content, padding, border, and margin.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["padding", "margin", "border", "width"],
        challengeWeight: 5,
        explanation:
          "Every element is a box: content + padding + border + margin. Default content-box means width excludes padding/border. box-sizing: border-box makes sizing intuitive for layouts.",
        a11yNotes: [],
        commonMistakes: ["Unexpected overflow from content-box", "Collapsing margins surprises"],
        bestPractices: ["Global border-box", "Use gap in flex/grid instead of margin hacks"],
        interviewQuestions: ["What is box-sizing: border-box?", "Margin collapsing?"],
        cheatSheet: [
          { tag: "padding", desc: "Inner space" },
          { tag: "margin", desc: "Outer space" },
          { tag: "box-sizing", desc: "How width is calculated" },
        ],
      }),
      t({
        slug: "display-flow",
        title: "Display and Normal Flow",
        summary: "block, inline, inline-block, and none.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["display", "block", "inline"],
        challengeWeight: 3,
        explanation:
          "Block elements stack vertically and take full width. Inline sits in text flow. inline-block allows width/height while staying inline. display: none removes from layout and accessibility tree.",
        a11yNotes: ["Prefer hidden attribute or visually-hidden patterns carefully."],
        commonMistakes: ["Using floats for modern layout"],
        bestPractices: ["Flex/grid for layout", "Understand flow before positioning"],
        interviewQuestions: ["block vs inline vs inline-block?"],
        cheatSheet: [
          { tag: "display: block", desc: "Full-width stack" },
          { tag: "display: inline", desc: "Text flow" },
          { tag: "display: none", desc: "Remove from layout" },
        ],
      }),
      t({
        slug: "units",
        title: "Units: px, rem, %, vh",
        summary: "Absolute and relative sizing.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["rem", "em", "px", "vh", "%"],
        challengeWeight: 3,
        explanation:
          "px is absolute. rem scales with root font size — great for accessible type. % is relative to parent. vh/vw relate to viewport. Prefer rem for typography and spacing systems.",
        a11yNotes: ["rem respects user font-size preferences."],
        commonMistakes: ["Everything in px only", "em nesting surprises"],
        bestPractices: ["rem for type and spacing", "px for hairline borders if needed"],
        interviewQuestions: ["rem vs em?", "When use % vs vw?"],
        cheatSheet: [
          { tag: "rem", desc: "Root-relative" },
          { tag: "em", desc: "Parent font-relative" },
          { tag: "vh", desc: "Viewport height" },
        ],
      }),
      t({
        slug: "overflow",
        title: "Overflow and Sizing",
        summary: "min/max width, overflow, and scrolling.",
        estimatedMinutes: 10,
        difficulty: "intermediate",
        keywords: ["overflow", "min-width", "max-width"],
        challengeWeight: 2,
        explanation:
          "max-width keeps content readable. overflow controls clipping and scroll. min-width: 0 often fixes flex children that refuse to shrink.",
        a11yNotes: ["Ensure scrollable regions are keyboard reachable."],
        commonMistakes: ["Horizontal scroll from fixed widths"],
        bestPractices: ["max-width on text columns", "overflow: auto when needed"],
        interviewQuestions: ["How do you prevent flex item overflow?"],
        cheatSheet: [
          { tag: "max-width", desc: "Cap size" },
          { tag: "overflow: auto", desc: "Scroll if needed" },
          { tag: "min-width: 0", desc: "Allow flex shrink" },
        ],
      }),
    ],
  },
  {
    slug: "visual-design",
    title: "Colors, Typography & Visual Design",
    description: "Make interfaces readable and polished.",
    topics: [
      t({
        slug: "colors-backgrounds",
        title: "Colors and Backgrounds",
        summary: "color, backgrounds, gradients, and opacity.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["color", "background", "gradient"],
        challengeWeight: 3,
        explanation:
          "Use color and background-color for text and surfaces. Gradients and images set via background. Prefer CSS variables for themes. Contrast matters for accessibility.",
        a11yNotes: ["Aim for WCAG contrast on text."],
        commonMistakes: ["Low-contrast gray on gray"],
        bestPractices: ["Design tokens / CSS variables", "Test contrast"],
        interviewQuestions: ["How do you theme with CSS variables?"],
        cheatSheet: [
          { tag: "color", desc: "Foreground text" },
          { tag: "background", desc: "Surface fill" },
          { tag: "--token", desc: "Custom property" },
        ],
      }),
      t({
        slug: "typography",
        title: "Typography",
        summary: "Fonts, line-height, weight, and readable text.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["font", "line-height", "letter-spacing"],
        challengeWeight: 4,
        explanation:
          "font-family, font-size, font-weight, and line-height shape reading comfort. System font stacks load fast; web fonts need font-display. Line-height ~1.4–1.6 for body copy.",
        a11yNotes: ["Don't lock font-size to tiny px that ignore user settings."],
        commonMistakes: ["line-height: 1 for body text"],
        bestPractices: ["rem type scale", "Generous line-height for paragraphs"],
        interviewQuestions: ["What is a type scale?"],
        cheatSheet: [
          { tag: "font-family", desc: "Typeface stack" },
          { tag: "line-height", desc: "Vertical rhythm" },
          { tag: "font-weight", desc: "Boldness" },
        ],
      }),
      t({
        slug: "borders-shadows-radius",
        title: "Borders, Radius, Shadows",
        summary: "Shape and depth without heavy assets.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["border", "radius", "box-shadow"],
        challengeWeight: 3,
        explanation:
          "border, border-radius, and box-shadow create cards and controls. Soft shadows beat heavy drop shadows. Prefer subtle elevation.",
        a11yNotes: [],
        commonMistakes: ["Huge multi-layer shadows everywhere"],
        bestPractices: ["Consistent radius scale", "Soft elevation tokens"],
        interviewQuestions: ["box-shadow vs filter: drop-shadow?"],
        cheatSheet: [
          { tag: "border-radius", desc: "Rounded corners" },
          { tag: "box-shadow", desc: "Elevation" },
          { tag: "border", desc: "Edge stroke" },
        ],
      }),
    ],
  },
  {
    slug: "flexbox",
    title: "Flexbox",
    description: "One-dimensional layout for rows and columns.",
    topics: [
      t({
        slug: "flex-basics",
        title: "Flexbox Basics",
        summary: "display: flex, direction, and wrapping.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["flex", "row", "column", "wrap"],
        challengeWeight: 5,
        explanation:
          "Flexbox lays out items along a main axis. Set display: flex on the container. flex-direction switches row/column. flex-wrap allows multi-line layouts.",
        a11yNotes: ["DOM order still matters for screen readers."],
        commonMistakes: ["Putting flex on every child instead of the parent"],
        bestPractices: ["Flex the container", "Use gap for spacing"],
        interviewQuestions: ["Main axis vs cross axis?"],
        cheatSheet: [
          { tag: "display: flex", desc: "Flex container" },
          { tag: "flex-direction", desc: "Row or column" },
          { tag: "gap", desc: "Space between items" },
        ],
      }),
      t({
        slug: "flex-alignment",
        title: "Flex Alignment",
        summary: "justify-content, align-items, and align-self.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["justify", "align", "center"],
        challengeWeight: 4,
        explanation:
          "justify-content distributes along the main axis. align-items aligns on the cross axis. align-self overrides per item. Centering a box is often justify + align center.",
        a11yNotes: [],
        commonMistakes: ["Confusing justify with align"],
        bestPractices: ["Name axes before aligning", "Prefer gap over margins"],
        interviewQuestions: ["Center a div with flexbox?"],
        cheatSheet: [
          { tag: "justify-content", desc: "Main-axis distribution" },
          { tag: "align-items", desc: "Cross-axis alignment" },
          { tag: "align-self", desc: "Per-item override" },
        ],
      }),
      t({
        slug: "flex-grow-shrink",
        title: "Flex Grow, Shrink, Basis",
        summary: "How items share free space.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["flex-grow", "flex-shrink", "flex-basis"],
        challengeWeight: 3,
        explanation:
          "flex-basis is the starting size. grow absorbs free space. shrink gives space back when constrained. The flex shorthand (grow shrink basis) is the professional default.",
        a11yNotes: [],
        commonMistakes: ["flex: 1 without understanding basis"],
        bestPractices: ["Use flex shorthand intentionally", "min-width: 0 for truncating text"],
        interviewQuestions: ["What does flex: 1 mean?"],
        cheatSheet: [
          { tag: "flex-grow", desc: "Take free space" },
          { tag: "flex-shrink", desc: "Give up space" },
          { tag: "flex-basis", desc: "Initial size" },
        ],
      }),
    ],
  },
  {
    slug: "grid",
    title: "CSS Grid",
    description: "Two-dimensional layout for pages and components.",
    topics: [
      t({
        slug: "grid-basics",
        title: "Grid Basics",
        summary: "display: grid, tracks, and gaps.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["grid", "columns", "rows", "gap"],
        challengeWeight: 5,
        explanation:
          "Grid creates rows and columns. grid-template-columns defines tracks (e.g. 1fr 1fr, repeat(3, 1fr)). gap spaces tracks. Ideal for page shells and card galleries.",
        a11yNotes: ["Visual order vs source order — keep them aligned when possible."],
        commonMistakes: ["Using grid when flex is simpler for a single row"],
        bestPractices: ["fr units for flexible tracks", "gap instead of margins"],
        interviewQuestions: ["When flex vs grid?"],
        cheatSheet: [
          { tag: "display: grid", desc: "Grid container" },
          { tag: "grid-template-columns", desc: "Column tracks" },
          { tag: "gap", desc: "Track spacing" },
        ],
      }),
      t({
        slug: "grid-placement",
        title: "Grid Placement",
        summary: "Spanning cells and naming areas.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["span", "area", "line"],
        challengeWeight: 3,
        explanation:
          "Items can span columns/rows with grid-column and grid-row. grid-template-areas names regions for readable layouts (header, main, sidebar).",
        a11yNotes: [],
        commonMistakes: ["Off-by-one line numbers"],
        bestPractices: ["Named areas for page layouts", "Explicit spans for featured cards"],
        interviewQuestions: ["What are grid lines?"],
        cheatSheet: [
          { tag: "grid-column", desc: "Horizontal placement" },
          { tag: "grid-row", desc: "Vertical placement" },
          { tag: "grid-template-areas", desc: "Named regions" },
        ],
      }),
      t({
        slug: "auto-fit-minmax",
        title: "auto-fit and minmax",
        summary: "Responsive grids without many media queries.",
        estimatedMinutes: 12,
        difficulty: "advanced",
        keywords: ["minmax", "auto-fit", "auto-fill"],
        challengeWeight: 3,
        explanation:
          "repeat(auto-fit, minmax(16rem, 1fr)) builds responsive card grids that wrap naturally. minmax sets a flexible track range.",
        a11yNotes: [],
        commonMistakes: ["Fixed pixel columns that break on mobile"],
        bestPractices: ["minmax for fluid cards", "Test narrow viewports"],
        interviewQuestions: ["auto-fit vs auto-fill?"],
        cheatSheet: [
          { tag: "minmax()", desc: "Flexible track size" },
          { tag: "auto-fit", desc: "Collapse empty tracks" },
          { tag: "repeat()", desc: "Repeat track list" },
        ],
      }),
    ],
  },
  {
    slug: "positioning-responsive",
    title: "Positioning & Responsive CSS",
    description: "Layers, sticky UI, and screen adaptability.",
    topics: [
      t({
        slug: "position",
        title: "Positioning",
        summary: "static, relative, absolute, fixed, sticky.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["absolute", "relative", "fixed", "sticky"],
        challengeWeight: 4,
        explanation:
          "relative offsets from normal flow. absolute positions against the nearest positioned ancestor. fixed is viewport-relative. sticky toggles between relative and fixed at a threshold.",
        a11yNotes: ["Fixed headers must not hide focused content."],
        commonMistakes: ["absolute without a positioned parent"],
        bestPractices: ["Position sparingly", "Prefer flex/grid for layout"],
        interviewQuestions: ["relative vs absolute containing block?"],
        cheatSheet: [
          { tag: "position: relative", desc: "Offset + containing block" },
          { tag: "position: absolute", desc: "Out of flow" },
          { tag: "position: sticky", desc: "Scroll-aware stick" },
        ],
      }),
      t({
        slug: "z-index-stacking",
        title: "z-index and Stacking",
        summary: "Painting order and stacking contexts.",
        estimatedMinutes: 10,
        difficulty: "advanced",
        keywords: ["z-index", "stacking"],
        challengeWeight: 2,
        explanation:
          "z-index only works on positioned or flex/grid items within a stacking context. New contexts come from opacity, transform, and more — which is why z-index wars happen.",
        a11yNotes: [],
        commonMistakes: ["Huge z-index values fighting each other"],
        bestPractices: ["Layer tokens (dropdown, modal)", "Minimize new stacking contexts"],
        interviewQuestions: ["What creates a stacking context?"],
        cheatSheet: [
          { tag: "z-index", desc: "Stack level" },
          { tag: "opacity < 1", desc: "New stacking context" },
          { tag: "transform", desc: "Often new context" },
        ],
      }),
      t({
        slug: "media-queries",
        title: "Media Queries",
        summary: "Adapt styles to viewport and preferences.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["media", "responsive", "breakpoint"],
        challengeWeight: 4,
        explanation:
          "@media (min-width: …) layers responsive rules. Mobile-first means base styles for small screens, then enhance. Also respect prefers-reduced-motion and prefers-color-scheme.",
        a11yNotes: ["Honor prefers-reduced-motion."],
        commonMistakes: ["Desktop-first only", "Too many breakpoints"],
        bestPractices: ["Mobile-first min-width", "Few meaningful breakpoints"],
        interviewQuestions: ["What is mobile-first CSS?"],
        cheatSheet: [
          { tag: "@media", desc: "Conditional styles" },
          { tag: "min-width", desc: "Mobile-first query" },
          { tag: "prefers-reduced-motion", desc: "Motion preference" },
        ],
      }),
      t({
        slug: "responsive-images-fluid",
        title: "Fluid Layouts",
        summary: "Fluid widths, clamp(), and responsive type.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["fluid", "clamp", "max-width"],
        challengeWeight: 3,
        explanation:
          "Width percentages, max-width, and clamp() create fluid type and spacing. Avoid fixed layouts that force horizontal scroll on phones.",
        a11yNotes: [],
        commonMistakes: ["Fixed 1200px wrappers without max-width"],
        bestPractices: ["width: 100%; max-width", "clamp for fluid type"],
        interviewQuestions: ["What does clamp() do?"],
        cheatSheet: [
          { tag: "clamp()", desc: "Min / preferred / max" },
          { tag: "max-width: 100%", desc: "Prevent overflow" },
          { tag: "width: min()", desc: "Modern fluid sizing" },
        ],
      }),
    ],
  },
  {
    slug: "effects-quality",
    title: "Effects, Transitions & Quality",
    description: "Motion, polish, and professional habits.",
    topics: [
      t({
        slug: "transitions-transforms",
        title: "Transitions and Transforms",
        summary: "Smooth state changes and 2D transforms.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["transition", "transform", "hover"],
        challengeWeight: 3,
        explanation:
          "transition animates property changes. transform (translate, scale, rotate) is GPU-friendly. Prefer transforming/opacity over layout properties for performance.",
        a11yNotes: ["Wrap motion in prefers-reduced-motion queries."],
        commonMistakes: ["Animating width/height heavily"],
        bestPractices: ["Transform + opacity", "Short, purposeful transitions"],
        interviewQuestions: ["Why prefer transform over top/left?"],
        cheatSheet: [
          { tag: "transition", desc: "Animate changes" },
          { tag: "transform", desc: "Move/scale/rotate" },
          { tag: "opacity", desc: "Fade without reflow" },
        ],
      }),
      t({
        slug: "css-variables",
        title: "CSS Variables",
        summary: "Custom properties for themes and tokens.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["variables", "custom properties", "theme"],
        challengeWeight: 3,
        explanation:
          "--token: value on :root, use with var(--token). Variables unlock theming, dark mode, and consistent design tokens without preprocessors.",
        a11yNotes: [],
        commonMistakes: ["Undefined fallbacks causing invalid values"],
        bestPractices: ["Token naming system", "Fallbacks in var(--x, fallback)"],
        interviewQuestions: ["CSS variables vs SASS variables?"],
        cheatSheet: [
          { tag: "--color-bg", desc: "Define token" },
          { tag: "var(--color-bg)", desc: "Use token" },
          { tag: ":root", desc: "Global scope" },
        ],
      }),
      t({
        slug: "css-best-practices",
        title: "CSS Best Practices",
        summary: "Organization, naming, and maintainable styles.",
        estimatedMinutes: 10,
        difficulty: "intermediate",
        keywords: ["bem", "architecture", "maintainability"],
        challengeWeight: 2,
        explanation:
          "Keep specificity low, name classes by purpose, group related rules, and delete dead CSS. Methodologies like BEM reduce collisions in large codebases.",
        a11yNotes: [],
        commonMistakes: ["Giant unscoped stylesheets", "Copy-paste rule blocks"],
        bestPractices: ["Component-scoped classes", "Delete unused CSS"],
        interviewQuestions: ["How do you structure CSS in a large app?"],
        cheatSheet: [
          { tag: ".block__element", desc: "BEM-style naming" },
          { tag: "low specificity", desc: "Easier overrides" },
          { tag: "layer", desc: "@layer for cascades" },
        ],
      }),
      t({
        slug: "css-mini-project",
        title: "Mini Project: Card UI",
        summary: "Combine layout, type, and color into a card.",
        estimatedMinutes: 20,
        difficulty: "intermediate",
        keywords: ["project", "card", "ui"],
        challengeWeight: 3,
        explanation:
          "Build a product or profile card using semantic HTML plus Flexbox or Grid, typography, spacing, and a subtle shadow. This stitches the academy skills together.",
        a11yNotes: ["Ensure text contrast on the card surface."],
        commonMistakes: ["Div-only markup for a card"],
        bestPractices: ["Semantic article/section", "Consistent spacing scale"],
        interviewQuestions: ["Walk through styling a card from scratch."],
        cheatSheet: [
          { tag: "display: flex", desc: "Card internals" },
          { tag: "border-radius", desc: "Rounded card" },
          { tag: "box-shadow", desc: "Elevation" },
        ],
      }),
    ],
  },
];

export function flattenCssTopics(): CssTopicDef[] {
  return CSS_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
