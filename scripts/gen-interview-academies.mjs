import fs from "fs";
import path from "path";

const root = process.cwd();

function section(slug, title, description, topics) {
  return { slug, title, description, topics };
}

function topic(
  slug,
  title,
  summary,
  estimatedMinutes,
  difficulty,
  keywords,
  challengeWeight,
  explanation,
  commonMistakes,
  bestPractices,
  interviewQuestions,
  cheatSheet
) {
  return {
    slug,
    title,
    summary,
    estimatedMinutes,
    difficulty,
    keywords,
    challengeWeight,
    explanation,
    a11yNotes: [],
    commonMistakes,
    bestPractices,
    interviewQuestions,
    cheatSheet,
  };
}

function renderCurriculum(typeName, constName, flattenName, sections) {
  return `export type ${typeName}Difficulty = "beginner" | "intermediate" | "advanced";

export type ${typeName}TopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ${typeName}Difficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ${typeName}SectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ${typeName}TopicDef[];
};

export const ${constName}: ${typeName}SectionDef[] = ${JSON.stringify(sections, null, 2)};

export function ${flattenName}(): ${typeName}TopicDef[] {
  return ${constName}.flatMap((section) => section.topics);
}
`;
}

const interviewSections = [
  section("interview-foundations", "Interview Foundations", "How coding interviews work and how to communicate under pressure.", [
    topic("interview-overview", "Interview Overview", "Coding interviews test problem solving, communication, and code quality under time pressure.", 12, "beginner", ["interview", "communication", "process"], 4,
      "A technical interview is a collaborative problem-solving session. Interviewers watch how you clarify requirements, choose approaches, write correct code, and discuss complexity. Communication matters as much as the final answer. Practice a repeatable process so stress does not erase your skills.",
      ["Silent coding with no narration", "Jumping into code before clarifying", "Ignoring time and never finishing"],
      ["Use a clear interview process", "Think out loud", "Leave time to test"],
      ["What do interviewers evaluate?", "Why communicate while coding?", "What is a repeatable process?"],
      [{ tag: "clarify", desc: "Ask about inputs, constraints, and examples" }, { tag: "approach", desc: "State plan before coding" }, { tag: "verify", desc: "Dry-run with examples" }]),
    topic("clarify-requirements", "Clarify Requirements", "Ask about inputs, outputs, constraints, and edge cases before coding.", 12, "beginner", ["clarify", "constraints", "edges"], 4,
      "Clarifying prevents solving the wrong problem. Ask about empty inputs, duplicates, sortedness, integer ranges, and expected return format. Restate the problem in your own words. Write a quick example on the board.",
      ["Assuming sorted input", "Missing empty-array behavior", "Coding before confirming the return type"],
      ["Restate the problem", "Ask about constraints and edges", "Confirm with an example"],
      ["What questions should you ask first?", "Why restate the problem?", "Name three common edge cases"],
      [{ tag: "constraints", desc: "Limits on size, time, and memory" }, { tag: "edge case", desc: "Boundary input that often breaks code" }, { tag: "restate", desc: "Repeat the problem in your words" }]),
    topic("think-out-loud", "Think Out Loud", "Narrate trade-offs so interviewers can follow your reasoning.", 10, "beginner", ["communication", "narrate", "trade-offs"], 3,
      "Thinking out loud turns an interview into a conversation. Explain why you discard a brute force, what invariant you maintain, and where bugs might hide. Pause to check understanding. Silence makes strong candidates look stuck.",
      ["Long silent pauses", "Narrating every keystroke with no structure", "Hiding uncertainty instead of asking"],
      ["Narrate approach and trade-offs", "Invite feedback", "Signal when you are stuck and what you will try"],
      ["Why narrate?", "What should you narrate?", "How do you handle being stuck?"],
      [{ tag: "trade-off", desc: "Pros and cons of an approach" }, { tag: "invariant", desc: "Property that stays true during the algorithm" }, { tag: "checkpoint", desc: "Pause to confirm with the interviewer" }]),
    topic("time-boxing", "Time Boxing", "Budget time for clarify, approach, code, and tests.", 12, "intermediate", ["time", "pacing", "plan"], 4,
      "A common split is clarify, approach, implement, then test. If a perfect solution is too slow to write, ship a correct simpler solution first. Say when you are moving to the next phase. Pacing shows seniority.",
      ["Spending all time optimizing before any code", "No tests at the end", "Overbuilding helpers you do not need"],
      ["Announce your time plan", "Prefer correct then optimize", "Reserve minutes to dry-run"],
      ["How do you split interview time?", "When ship a simpler solution?", "Why reserve test time?"],
      [{ tag: "pacing", desc: "Managing time across interview phases" }, { tag: "MVP solution", desc: "Correct first version you can finish" }, { tag: "dry-run", desc: "Trace the code on an example" }]),
  ]),
  section("core-patterns", "Core Patterns", "Patterns that show up constantly in coding rounds.", [
    topic("two-pointers", "Two Pointers", "Two pointers scan from ends or at different speeds on arrays and strings.", 12, "beginner", ["two-pointers", "arrays", "strings"], 4,
      "Two pointers reduce nested loops when order or meeting conditions matter. Classic uses include pair sums on sorted arrays, palindrome checks, and in-place compaction. State the invariant for each pointer. Watch off-by-one errors at boundaries.",
      ["Using two pointers on unsorted pair-sum without a plan", "Moving the wrong pointer", "Forgetting equal-pointer termination"],
      ["State pointer meaning", "Move based on a clear condition", "Test boundaries"],
      ["When use two pointers?", "What is a pointer invariant?", "Name a classic problem"],
      [{ tag: "left/right", desc: "Pointers from both ends" }, { tag: "fast/slow", desc: "Pointers at different speeds" }, { tag: "invariant", desc: "What each pointer guarantees" }]),
    topic("sliding-window", "Sliding Window", "Windows maintain a contiguous range while expanding and shrinking.", 12, "intermediate", ["window", "subarray", "substring"], 4,
      "Sliding windows track counts or sums over a contiguous segment. Expand to include new elements, shrink when constraints break. Useful for longest substring with conditions and minimum subarray length. Keep window state updated in O(1) per move when possible.",
      ["Recalculating the whole window from scratch each time", "Shrinking incorrectly", "Off-by-one on inclusive bounds"],
      ["Maintain running state", "Define expand/shrink rules", "Test with tiny inputs"],
      ["When use sliding window?", "What state do you maintain?", "Expand vs shrink?"],
      [{ tag: "expand", desc: "Grow the window to the right" }, { tag: "shrink", desc: "Move left forward to restore validity" }, { tag: "window state", desc: "Counts/sums for the current range" }]),
    topic("hash-maps-sets", "Hash Maps and Sets", "Hashing gives average O(1) lookups for frequency and membership.", 12, "beginner", ["hashmap", "set", "frequency"], 4,
      "Maps and sets unlock two-sum variants, anagram checks, and duplicate detection. State what the key represents. Discuss average vs worst-case behavior if asked. Prefer clear key design over clever tricks.",
      ["Unclear key meaning", "Mutating map while iterating carelessly", "Using maps when sorting would be simpler and fine"],
      ["Define key and value meaning", "Update frequencies carefully", "Mention complexity honestly"],
      ["When choose a hash map?", "What should the key represent?", "Average vs worst case?"],
      [{ tag: "frequency map", desc: "Count occurrences of values" }, { tag: "membership", desc: "Check if a value was seen" }, { tag: "key design", desc: "What uniquely identifies an entry" }]),
    topic("binary-search", "Binary Search", "Binary search finds boundaries on sorted spaces and answer spaces.", 14, "intermediate", ["binary-search", "bounds", "sorted"], 5,
      "Beyond arrays, binary search works on monotonic answer spaces. Define the predicate clearly: is mid feasible? Watch infinite loops from bad mid updates. Practice lower-bound and upper-bound templates.",
      ["Unclear predicate", "Updating lo/hi incorrectly", "Assuming the array is sorted when it is not"],
      ["Write the predicate first", "Use a trusted template", "Test with empty and single-element arrays"],
      ["What makes a problem binary-searchable?", "What is a predicate?", "Lower vs upper bound?"],
      [{ tag: "predicate", desc: "Boolean test on mid" }, { tag: "monotonic", desc: "Feasibility never flips twice" }, { tag: "bound", desc: "First or last valid index/answer" }]),
    topic("bfs-dfs", "BFS and DFS", "Graph and tree traversal patterns for search and connectivity.", 14, "intermediate", ["bfs", "dfs", "graph"], 5,
      "BFS explores level by level and fits shortest paths in unweighted graphs. DFS fits path existence, components, and backtracking. Track visited nodes. Clarify directed vs undirected edges.",
      ["Forgetting visited marks", "Using DFS for unweighted shortest path casually", "Confusing stack vs queue"],
      ["Choose BFS or DFS intentionally", "Mark visited correctly", "State graph assumptions"],
      ["When prefer BFS?", "When prefer DFS?", "Why mark visited?"],
      [{ tag: "BFS", desc: "Queue-based level order search" }, { tag: "DFS", desc: "Stack/recursion depth-first search" }, { tag: "visited", desc: "Set of explored nodes" }]),
  ]),
  section("coding-habits", "Coding Habits", "Write interview code that is correct, tested, and discussable.", [
    topic("brute-force-first", "Brute Force First", "Start with a correct brute force, then optimize with reasoning.", 12, "beginner", ["brute-force", "optimize", "complexity"], 4,
      "A correct brute force proves understanding and buys time. Then identify bottlenecks and apply a pattern. Interviewers often want to hear the improvement path. Do not optimize a wrong idea.",
      ["Optimizing before a correct baseline", "Cannot explain why the faster approach works", "Skipping complexity discussion"],
      ["State brute force complexity", "Identify the bottleneck", "Upgrade with a named pattern"],
      ["Why start brute force?", "How do you justify an optimization?", "What is a bottleneck?"],
      [{ tag: "baseline", desc: "Correct initial approach" }, { tag: "bottleneck", desc: "Step that dominates cost" }, { tag: "upgrade", desc: "Faster approach with rationale" }]),
    topic("complexity-talk", "Complexity Talk", "Explain time and space clearly with big-O and reasoning.", 10, "beginner", ["complexity", "big-o", "space"], 3,
      "Say time and space in big-O and point to the loops or data structures that cause it. Mention average vs worst case for hashes. Compare approaches briefly. Avoid memorized numbers without reasoning.",
      ["Stating O(n) with nested loops", "Ignoring auxiliary space", "No comparison between approaches"],
      ["Tie complexity to code structure", "Include space", "Compare alternatives"],
      ["How do you justify big-O?", "Why mention space?", "Average vs worst case for maps?"],
      [{ tag: "time", desc: "How runtime grows with input" }, { tag: "space", desc: "Extra memory beyond input" }, { tag: "tight bound", desc: "Most precise honest big-O you can defend" }]),
    topic("dry-run-tests", "Dry Run and Tests", "Trace examples and list edge cases before claiming done.", 12, "intermediate", ["testing", "dry-run", "edges"], 4,
      "Dry-run your code on the sample. Then try empty, single element, duplicates, and large values. Fix bugs you find out loud. Testing shows craftsmanship under pressure.",
      ["No tests after coding", "Only happy-path example", "Quietly patching without explaining"],
      ["Dry-run the sample", "List edge cases", "Narrate bug fixes"],
      ["What is a dry run?", "Which edges should you try?", "Why narrate fixes?"],
      [{ tag: "dry-run", desc: "Manual execution trace" }, { tag: "edge list", desc: "Boundary cases to check" }, { tag: "regression", desc: "Bug introduced while fixing another" }]),
    topic("clean-interview-code", "Clean Interview Code", "Prefer readable names, small helpers, and honest comments.", 12, "intermediate", ["readability", "helpers", "style"], 4,
      "Interview code should be readable more than clever. Use meaningful names, extract a helper if it clarifies, and avoid dense one-liners. Mention what you would refactor with more time.",
      ["Single-letter names everywhere", "Clever code you cannot explain", "Giant functions with no structure"],
      ["Name intents clearly", "Extract helpers for clarity", "Keep control flow obvious"],
      ["What makes interview code clean?", "When extract a helper?", "What would you refactor later?"],
      [{ tag: "intent", desc: "What a variable or function means" }, { tag: "helper", desc: "Small function that clarifies a step" }, { tag: "readability", desc: "How easily another engineer follows the code" }]),
  ]),
  section("pressure-skills", "Pressure Skills", "Stay effective when stuck, hint-driven, or timed out.", [
    topic("getting-unstuck", "Getting Unstuck", "Use structured recovery when you blank or stall.", 12, "intermediate", ["stuck", "hints", "recovery"], 4,
      "When stuck, restate constraints, try a smaller example, or switch to brute force. Ask for a hint if allowed after showing effort. Interviewers care how you recover. Panic looping wastes the round.",
      ["Repeating the same failing idea silently", "Giving up immediately", "Rejecting hints defensively"],
      ["Change the example size", "Fall back to brute force", "Use hints productively"],
      ["What do you do first when stuck?", "How do you use a hint?", "Why restate constraints?"],
      [{ tag: "smaller example", desc: "Simplify the input to regain insight" }, { tag: "hint", desc: "Interviewer nudge after effort" }, { tag: "reset", desc: "Return to clarify/approach phases" }]),
    topic("follow-up-questions", "Follow-Up Questions", "Expect variants: optimize, stream, parallelize, or change constraints.", 12, "advanced", ["follow-up", "variants", "optimize"], 4,
      "Follow-ups probe depth. Practice answering what changes if n is huge, if input is sorted, or if you need online processing. Relate answers to patterns you already know. Stay calm and structured.",
      ["Blank stare on follow-ups", "Random new approach with no link to prior solution", "Ignoring the changed constraint"],
      ["Reuse prior reasoning", "Name the new constraint", "Outline the delta clearly"],
      ["What are common follow-ups?", "How do you structure an answer?", "Why reuse prior reasoning?"],
      [{ tag: "delta", desc: "What changes from the prior solution" }, { tag: "online", desc: "Process input as it arrives" }, { tag: "scale-up", desc: "Handle much larger n" }]),
    topic("language-fluency", "Language Fluency", "Know your interview language APIs well enough to avoid syntax stalls.", 10, "beginner", ["language", "apis", "fluency"], 3,
      "Pick one interview language and know arrays, maps, queues, and string basics cold. Syntax stalls burn time and confidence. It is fine to ask about a rarely used API, but not core loops.",
      ["Switching languages mid-prep constantly", "Forgetting how to iterate a map", "Spending minutes on syntax"],
      ["Practice core APIs daily", "Keep a personal cheatsheet while studying", "Prefer familiarity over novelty in interviews"],
      ["Which APIs must you know cold?", "Why stick to one language?", "What is acceptable to ask?"],
      [{ tag: "core API", desc: "Everyday collection and string operations" }, { tag: "cheatsheet", desc: "Study aid for common methods" }, { tag: "fluency", desc: "Low-friction coding in your language" }]),
    topic("mock-interviews", "Mock Interviews", "Mocks build pacing, communication, and feedback loops.", 12, "intermediate", ["mock", "practice", "feedback"], 4,
      "Mock interviews reveal blind spots that solo LeetCode misses. Record yourself or practice with a peer. Review communication and pacing, not only correctness. Increase difficulty gradually.",
      ["Only solo grinding", "No feedback review", "Mocks without timing"],
      ["Schedule regular mocks", "Review recordings or notes", "Track pacing and clarity metrics"],
      ["What do mocks teach that solo practice misses?", "How do you review a mock?", "What metrics help?"],
      [{ tag: "mock", desc: "Simulated interview practice" }, { tag: "feedback", desc: "Notes on communication and code" }, { tag: "pacing metric", desc: "Whether phases finished on time" }]),
  ]),
  section("problem-families", "Problem Families", "Recognize families quickly so you pick a pattern faster.", [
    topic("arrays-strings-family", "Arrays and Strings Family", "Many problems reduce to scanning, windows, or two pointers on sequences.", 12, "beginner", ["arrays", "strings", "scan"], 4,
      "Sequence problems often need a single pass, two pointers, or a window. Identify whether order matters, whether indices matter, and whether frequencies help. Translate words into constraints before coding.",
      ["Jumping to DP for simple scans", "Ignoring index vs value distinctions", "Mutating while iterating without care"],
      ["Classify the scan pattern", "Decide if extra memory helps", "Confirm in-place requirements"],
      ["How do you classify sequence problems?", "When use extra memory?", "Index vs value?"],
      [{ tag: "single pass", desc: "One left-to-right scan" }, { tag: "in-place", desc: "Modify input with limited extra memory" }, { tag: "frequency", desc: "Counting occurrences to decide" }]),
    topic("trees-graphs-family", "Trees and Graphs Family", "Clarify representation, cycles, and what success means.", 12, "intermediate", ["trees", "graphs", "traversal"], 4,
      "Ask whether the graph is directed, weighted, or may contain cycles. Confirm input representation: adjacency list, matrix, or edge list. Choose BFS/DFS/union-find accordingly. Draw a tiny example.",
      ["Assuming no cycles", "Wrong representation assumptions", "Forgetting base cases on trees"],
      ["Clarify graph properties", "Draw a small example", "Pick traversal intentionally"],
      ["What properties must you clarify?", "When use union-find?", "Why draw examples?"],
      [{ tag: "adjacency list", desc: "Map from node to neighbors" }, { tag: "cycle", desc: "Path that revisits a node" }, { tag: "base case", desc: "Null/empty leaf handling" }]),
    topic("dp-family", "DP Family", "Dynamic programming needs state, transition, and base cases.", 14, "advanced", ["dp", "state", "transition"], 5,
      "DP problems ask for optimal counts or decisions over overlapping subproblems. Define state meaning, transitions, and bases before coding. Start with recursion + memo if helpful, then bottom-up. Explain why greed fails if asked.",
      ["Coding DP without defining state", "Wrong base cases", "Forcing DP onto non-overlapping problems"],
      ["Write state in words", "List transitions", "Verify bases on tiny inputs"],
      ["What three parts define DP?", "Memo vs bottom-up?", "When is greed not enough?"],
      [{ tag: "state", desc: "What a DP cell represents" }, { tag: "transition", desc: "How states derive from others" }, { tag: "base case", desc: "Smallest solved subproblems" }]),
    topic("intervals-heaps", "Intervals and Heaps", "Sorting plus heaps often solve scheduling and top-k patterns.", 12, "advanced", ["intervals", "heap", "topk"], 4,
      "Interval problems usually sort by start or end, then scan with careful merging. Top-k and streaming medians lean on heaps. State comparator direction explicitly to avoid bugs.",
      ["Forgetting to sort intervals", "Wrong heap polarity", "Off-by-one on inclusive ends"],
      ["Sort with an explicit key", "Say min-heap vs max-heap out loud", "Test overlapping edges"],
      ["How do you approach intervals?", "When use a heap?", "What is heap polarity?"],
      [{ tag: "sort key", desc: "Field used to order intervals" }, { tag: "min-heap", desc: "Smallest element at top" }, { tag: "top-k", desc: "Keep the k best elements efficiently" }]),
  ]),
];

const systemsSections = [
  section("system-design-basics", "System Design Basics", "Structure design interviews with requirements, APIs, and trade-offs.", [
    topic("design-interview-overview", "Design Interview Overview", "System design interviews evaluate scoping, architecture judgment, and communication.", 12, "beginner", ["system-design", "scoping", "trade-offs"], 4,
      "A design interview is an open-ended collaboration. You clarify goals, propose an architecture, deepen critical paths, and discuss trade-offs. There is rarely one right diagram. Strong candidates drive the conversation with structure.",
      ["Drawing boxes with no requirements", "Jumping to microservices immediately", "Ignoring bottlenecks"],
      ["Start with requirements", "Propose a simple core design", "Deepen the riskiest parts"],
      ["What are interviewers evaluating?", "Why start simple?", "What does deepen mean?"],
      [{ tag: "requirements", desc: "Functional and non-functional goals" }, { tag: "core design", desc: "Simple architecture that could work" }, { tag: "deep dive", desc: "Detailed discussion of a risky area" }]),
    topic("functional-vs-nonfunctional", "Functional vs Non-Functional", "Separate what the system does from how well it must do it.", 12, "beginner", ["functional", "latency", "availability"], 4,
      "Functional requirements are features. Non-functional requirements include latency, availability, consistency, and cost. Ask for rough scale: QPS, storage, and read/write mix. These numbers drive design choices.",
      ["No scale assumptions", "Treating every system as needing global consistency", "Ignoring cost"],
      ["List functional goals", "Ask for NFRs and scale", "Use numbers to justify choices"],
      ["Give examples of NFRs", "Why ask for QPS?", "How do numbers change design?"],
      [{ tag: "QPS", desc: "Queries per second estimate" }, { tag: "availability", desc: "Uptime target for the service" }, { tag: "latency", desc: "Response time goals" }]),
    topic("api-and-data-model", "API and Data Model", "Define interfaces and core entities before diving into infrastructure.", 12, "intermediate", ["api", "entities", "schema"], 4,
      "Sketch key endpoints or events and the main entities. This anchors the design and reveals access patterns. Keep the first model simple. Note which queries must be fast.",
      ["Infrastructure first with no API", "Over-normalized models too early", "No idea which queries matter"],
      ["Draft core APIs", "List entities and access patterns", "Mark hot queries"],
      ["Why define APIs early?", "What is an access pattern?", "What is a hot query?"],
      [{ tag: "endpoint", desc: "API operation clients call" }, { tag: "entity", desc: "Core noun stored by the system" }, { tag: "access pattern", desc: "How data is read and written" }]),
    topic("high-level-design", "High-Level Design", "Propose clients, services, storage, and major data flows.", 14, "intermediate", ["architecture", "services", "storage"], 5,
      "A high-level design names major components and how requests flow. Start with a modular monolith or few services unless scale demands more. Show read/write paths. Call out caches, queues, and external dependencies.",
      ["Premature microservices", "Missing the write path", "No failure discussion"],
      ["Draw the request path", "Start simple", "Name critical dependencies"],
      ["What belongs in an HLD?", "When split services?", "Why show read and write paths?"],
      [{ tag: "HLD", desc: "High-level design diagram" }, { tag: "read path", desc: "How queries are served" }, { tag: "write path", desc: "How updates are persisted" }]),
  ]),
  section("building-blocks", "Building Blocks", "Caches, queues, databases, and load balancing trade-offs.", [
    topic("caching", "Caching", "Caches reduce load and latency but introduce invalidation complexity.", 12, "intermediate", ["cache", "ttl", "invalidation"], 4,
      "Use caches for read-heavy hot data. Choose TTL, write-through, or invalidate-on-write based on freshness needs. Discuss stampede risks. Measure hit rate goals.",
      ["Caching without an invalidation story", "Caching user-specific sensitive data carelessly", "Assuming cache always hits"],
      ["State what is cached", "Explain invalidation", "Mention failure if cache is down"],
      ["When add a cache?", "What is invalidation?", "What is a stampede?"],
      [{ tag: "TTL", desc: "Time-to-live before expiry" }, { tag: "hit rate", desc: "Share of reads served by cache" }, { tag: "invalidation", desc: "Removing stale cached entries" }]),
    topic("queues-async", "Queues and Async", "Queues absorb spikes and decouple producers from consumers.", 12, "intermediate", ["queue", "async", "backpressure"], 4,
      "Asynchronous processing helps uploads, notifications, and fan-out work. Discuss at-least-once delivery, idempotency, and dead-letter queues. Not everything should be async if the user needs an immediate answer.",
      ["Making user-critical reads async without a status model", "No idempotency", "Infinite retries without backoff"],
      ["Use queues for spike absorption", "Design idempotent consumers", "Plan dead letters"],
      ["When use a queue?", "What is idempotency?", "What is a dead-letter queue?"],
      [{ tag: "at-least-once", desc: "Messages may be delivered more than once" }, { tag: "idempotent", desc: "Safe to process duplicates" }, { tag: "DLQ", desc: "Dead-letter queue for failed messages" }]),
    topic("sql-vs-nosql", "SQL vs NoSQL", "Choose storage based on access patterns and consistency needs.", 12, "intermediate", ["sql", "nosql", "consistency"], 4,
      "Relational databases fit relational data and strong transactions. NoSQL options can help specific access patterns and scale, with different consistency trade-offs. In interviews, justify from queries and consistency, not hype.",
      ["Defaulting to NoSQL for resume points", "Ignoring transactions when they matter", "No backup/migration thought"],
      ["Start from access patterns", "Prefer boring defaults", "Call out consistency needs"],
      ["When prefer SQL?", "When consider NoSQL?", "What consistency questions matter?"],
      [{ tag: "transaction", desc: "Atomic multi-row update needs" }, { tag: "access pattern", desc: "Primary query shapes" }, { tag: "consistency", desc: "How up-to-date reads must be" }]),
    topic("load-balancing", "Load Balancing", "Balancers distribute traffic and enable rolling deploys.", 10, "beginner", ["load-balancer", "health", "tls"], 3,
      "Load balancers spread requests across instances and often terminate TLS. Discuss health checks and sticky sessions sparingly. They are foundational for horizontal scale.",
      ["Sticky sessions as a default without need", "No health checks", "Single instance pretending to be highly available"],
      ["Put a balancer in front of app tiers", "Use health checks", "Avoid unnecessary session affinity"],
      ["What does a load balancer do?", "Why health checks?", "When are sticky sessions needed?"],
      [{ tag: "health check", desc: "Probe that removes bad instances" }, { tag: "horizontal scale", desc: "Add more instances" }, { tag: "TLS terminate", desc: "Decrypt HTTPS at the edge/balancer" }]),
  ]),
  section("reliability-scale", "Reliability and Scale", "Talk through failure, consistency, and growth.", [
    topic("single-points-of-failure", "Single Points of Failure", "Identify components whose outage takes down the system.", 12, "intermediate", ["spof", "redundancy", "failover"], 4,
      "Call out SPOFs and how you would add redundancy: multiple app instances, replica databases, multi-AZ thinking at a high level. Discuss failover behavior. Perfect HA is expensive; match it to requirements.",
      ["Ignoring the database as a SPOF", "Promising five nines with one region casually", "No failover story"],
      ["Name SPOFs explicitly", "Add redundancy where required", "Describe failover briefly"],
      ["What is a SPOF?", "How do you mitigate one?", "Why match HA to requirements?"],
      [{ tag: "SPOF", desc: "Single point of failure" }, { tag: "redundancy", desc: "Extra capacity to survive loss" }, { tag: "failover", desc: "Switch to a healthy replica/path" }]),
    topic("consistency-availability", "Consistency and Availability", "CAP-style trade-offs appear when networks partition.", 14, "advanced", ["consistency", "availability", "partition"], 5,
      "Under partition, systems often trade stricter consistency for availability or vice versa. Explain user-visible effects: stale reads vs errors. Pick a stance for the product scenario. Avoid buzzwords without examples.",
      ["Saying we will be CAP theorem compliant as a design", "No user-visible explanation", "Forcing strong consistency everywhere"],
      ["Explain the user impact", "Choose per use case", "Use examples like feeds vs payments"],
      ["What happens during a partition?", "Stale read vs error?", "When is strong consistency worth it?"],
      [{ tag: "stale read", desc: "Seeing older data temporarily" }, { tag: "strong consistency", desc: "Reads reflect the latest write" }, { tag: "partition", desc: "Network split between nodes" }]),
    topic("rate-limiting", "Rate Limiting", "Protect systems from abuse and noisy neighbors.", 12, "intermediate", ["rate-limit", "throttle", "quota"], 4,
      "Rate limits protect availability and cost. Discuss token buckets or fixed windows at a high level, where limits are enforced, and what clients see (429). Include fair use across tenants.",
      ["No abuse story for public APIs", "Limits only in the client", "Unclear error behavior"],
      ["Enforce limits server-side", "Return clear 429s", "Set per-user and global limits"],
      ["Why rate limit?", "Where enforce?", "What does the client observe?"],
      [{ tag: "429", desc: "Too Many Requests response" }, { tag: "token bucket", desc: "Common limiting algorithm" }, { tag: "noisy neighbor", desc: "One client hurting others" }]),
    topic("observability-design", "Observability in Design", "Metrics, logs, and traces prove the system is healthy.", 12, "intermediate", ["metrics", "logs", "traces"], 4,
      "Design interviews should mention how you detect pain: latency metrics, error rates, and traces across services. Logs need redaction. Alerts should map to user symptoms. Observability is part of the architecture.",
      ["No monitoring in the design", "Alerting only on CPU", "Logging secrets"],
      ["Define golden signals", "Plan redaction", "Alert on user-facing symptoms"],
      ["What golden signals matter?", "Why traces?", "What should you not log?"],
      [{ tag: "golden signals", desc: "Latency, traffic, errors, saturation" }, { tag: "trace", desc: "Request path across services" }, { tag: "alert", desc: "Notification on symptom thresholds" }]),
  ]),
  section("behavioral", "Behavioral Interviews", "Tell clear stories with STAR and ownership.", [
    topic("star-method", "STAR Method", "Structure stories as Situation, Task, Action, Result.", 12, "beginner", ["star", "behavioral", "stories"], 4,
      "STAR keeps behavioral answers concrete. Focus most time on your actions and measurable results. Prepare stories for conflict, failure, leadership, and ambiguity. Practice out loud with timing.",
      ["Rambling without a result", "We did everything with no personal actions", "Stories with no stakes"],
      ["Use STAR", "Emphasize your actions", "End with a result and learning"],
      ["What does STAR stand for?", "Where should most time go?", "Which stories should you prepare?"],
      [{ tag: "Situation", desc: "Context and stakes" }, { tag: "Action", desc: "What you personally did" }, { tag: "Result", desc: "Outcome and evidence" }]),
    topic("ownership-stories", "Ownership Stories", "Show end-to-end responsibility and judgment.", 12, "intermediate", ["ownership", "leadership", "impact"], 4,
      "Ownership stories highlight when you drove an outcome across ambiguity. Mention decisions, trade-offs, and follow-through. Quantify impact when possible. Avoid taking credit for others' work.",
      ["Vague we language", "No decision points", "Inflated claims"],
      ["Use I for your actions", "Show decisions and trade-offs", "Quantify outcomes honestly"],
      ["What makes an ownership story strong?", "Why say I carefully?", "How do you quantify impact?"],
      [{ tag: "decision", desc: "Choice you made under uncertainty" }, { tag: "follow-through", desc: "Seeing work to completion" }, { tag: "impact", desc: "Measured outcome of your work" }]),
    topic("conflict-and-feedback", "Conflict and Feedback", "Describe disagreement professionally with learning.", 12, "intermediate", ["conflict", "feedback", "collaboration"], 4,
      "Conflict stories should show listening, data, and respectful disagreement. Avoid villain narratives. Explain how you reached a resolution and what changed afterward. Interviewers probe maturity here.",
      ["Blaming teammates", "No resolution", "Pretending conflict never happens"],
      ["State perspectives fairly", "Show how you used data/listening", "End with resolution and learning"],
      ["How do you frame conflict?", "What should you avoid?", "Why include learning?"],
      [{ tag: "perspective", desc: "Other person's goals and concerns" }, { tag: "resolution", desc: "How the team moved forward" }, { tag: "learning", desc: "What you changed afterward" }]),
    topic("failure-stories", "Failure Stories", "Own a real failure, focusing on response and prevention.", 12, "intermediate", ["failure", "postmortem", "growth"], 4,
      "Strong failure stories are specific and blameless toward others while owning your part. Cover detection, mitigation, and prevention. Shallow fake failures hurt credibility. Pick a real one with stakes.",
      ["Fake tiny failures", "No prevention steps", "Hiding your responsibility"],
      ["Pick a real failure", "Own your part", "Describe prevention changes"],
      ["What makes a failure story credible?", "What is prevention?", "Why avoid fake failures?"],
      [{ tag: "mitigation", desc: "Immediate steps to reduce damage" }, { tag: "prevention", desc: "Changes that stop repeats" }, { tag: "ownership", desc: "Clear acceptance of your role" }]),
    topic("why-this-company", "Why This Company", "Connect your goals to the company's problems and products.", 10, "beginner", ["motivation", "company", "fit"], 3,
      "Why-us answers should be specific: product, users, technical challenges, or mission. Tie your experience to how you will help. Avoid generic prestige-only answers. Research enough to be concrete.",
      ["Generic I love innovation answers", "Only talking about compensation", "No link to your experience"],
      ["Mention specific products or challenges", "Link your skills to their needs", "Be honest about growth goals"],
      ["What makes a why-us answer strong?", "What should you research?", "How do you link your background?"],
      [{ tag: "specifics", desc: "Concrete product or problem details" }, { tag: "fit", desc: "Overlap between your skills and their needs" }, { tag: "growth", desc: "What you want to learn there" }]),
  ]),
  section("integration", "Putting It Together", "Combine design depth with behavioral clarity.", [
    topic("deep-dives", "Deep Dives", "Pick one risky area and go deep with trade-offs.", 12, "advanced", ["deep-dive", "bottleneck", "trade-offs"], 5,
      "After the high-level design, propose a deep dive: the hottest read path, the write consistency model, or the notification pipeline. Compare alternatives. Mentions of metrics and failure modes show maturity.",
      ["Staying shallow the whole time", "Deep diving an unimportant box", "No alternatives considered"],
      ["Choose a high-risk area", "Compare 2-3 options", "Include failure and metrics"],
      ["How do you choose a deep dive?", "What should it include?", "Why compare options?"],
      [{ tag: "bottleneck", desc: "Likely limiting component" }, { tag: "alternative", desc: "Other design option considered" }, { tag: "failure mode", desc: "How that component can break" }]),
    topic("back-of-envelope", "Back-of-Envelope Estimates", "Rough capacity math justifies sharding, caching, and cost.", 12, "advanced", ["estimation", "capacity", "qps"], 4,
      "Estimate QPS, storage, and bandwidth with round numbers. Show your assumptions. The goal is judgment, not perfect arithmetic. Use estimates to decide whether a single DB is plausible.",
      ["Fake precision", "No assumptions stated", "Estimates that never affect the design"],
      ["State assumptions", "Use round numbers", "Let estimates drive choices"],
      ["Why do envelope math?", "What quantities matter?", "How precise should you be?"],
      [{ tag: "assumption", desc: "Rounded input you make explicit" }, { tag: "capacity", desc: "Load the system must handle" }, { tag: "justification", desc: "Design choice backed by estimates" }]),
    topic("wrap-up-questions", "Wrap-Up Questions", "Ask thoughtful questions that show product and engineering curiosity.", 10, "beginner", ["questions", "curiosity", "close"], 3,
      "Prepare questions about team workflows, on-call, design review culture, and current technical challenges. Avoid only asking about perks. Good questions leave a strong final impression.",
      ["No questions at all", "Only salary timing questions in the first chat", "Generic questions you could ask any company"],
      ["Prepare 3 specific questions", "Ask about engineering culture", "Tie a question to something discussed"],
      ["What questions work well?", "What should you avoid?", "Why ask about on-call/design review?"],
      [{ tag: "on-call", desc: "How production ownership works" }, { tag: "design review", desc: "How the team critiques architecture" }, { tag: "challenge", desc: "Current hard problem the team faces" }]),
    topic("signal-balance", "Signal Balance", "Balance correctness, communication, and collaboration signals.", 12, "intermediate", ["signal", "collaboration", "hire"], 4,
      "Interview loops look for multiple signals: technical depth, clarity, humility, and teamwork. One brilliant silent round rarely wins. Practice recovering politely and incorporating feedback live.",
      ["Optimizing only for puzzles", "Arguing with interviewers", "Ignoring collaboration cues"],
      ["Treat interviews as collaboration", "Incorporate feedback", "Show humility with confidence"],
      ["What signals do loops look for?", "How do you show collaboration?", "What hurts otherwise strong candidates?"],
      [{ tag: "signal", desc: "Evidence of a hiring attribute" }, { tag: "collaboration", desc: "Working with the interviewer" }, { tag: "humility", desc: "Confidence without arrogance" }]),
  ]),
];

function writeCurriculum(file, typeName, constName, flattenName, sections) {
  fs.writeFileSync(path.join(root, file), renderCurriculum(typeName, constName, flattenName, sections));
  console.log("wrote", file, "topics=", sections.reduce((n, s) => n + s.topics.length, 0));
}

writeCurriculum(
  "src/features/curriculum/lib/interview-academy-curriculum.ts",
  "Interview",
  "INTERVIEW_ACADEMY_SECTIONS",
  "flattenInterviewTopics",
  interviewSections
);
writeCurriculum(
  "src/features/curriculum/lib/systems-academy-curriculum.ts",
  "Systems",
  "SYSTEMS_ACADEMY_SECTIONS",
  "flattenSystemsTopics",
  systemsSections
);

function challengesSource(opts) {
  const {
    importPath,
    topicType,
    flattenName,
    challengeType,
    kindType,
    experience,
    idPrefix,
    listName,
    allName,
    findName,
    countName,
    theoryName,
    paneA,
    paneB,
    defaultA,
    defaultB,
  } = opts;
  const sA = `starter${paneA}`;
  const rA = `reference${paneA}`;
  const sB = `starter${paneB}`;
  const rB = `reference${paneB}`;
  const starterFallback =
    paneB === "Json"
      ? "`{\\n  \"todo\": true\\n}\\n`"
      : paneB === "Markdown"
        ? "`# Talk track\\n- Clarify\\n- Approach\\n- Code\\n- Test\\n`"
        : "`// todo\\n`";

  const blockA =
    paneA === "Js"
      ? `function blockA(title: string, body: string): string {
  return "// " + title + "\\n" + body + "\\n";
}`
      : `function blockA(title: string, body: string): string {
  return "# " + title + "\\n\\n" + body + "\\n";
}`;

  const blockB =
    paneB === "Json"
      ? `function blockB(title: string, body: string): string {
  return body.endsWith("\\n") ? body : body + "\\n";
}`
      : paneB === "Markdown"
        ? `function blockB(title: string, body: string): string {
  return "# " + title + "\\n\\n" + body + "\\n";
}`
        : `function blockB(title: string, body: string): string {
  return "// " + title + "\\n" + body + "\\n";
}`;

  return `import type { LearnDifficulty, LearnLesson } from "@/learning-engine/types";
import {
  ${flattenName},
  type ${topicType},
} from "@/features/curriculum/lib/${importPath}";

export type ${kindType} =
  | "build"
  | "fix"
  | "layout"
  | "responsive"
  | "interview"
  | "project";

export type ${challengeType} = {
  id: string;
  topicSlug: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}: string;
  ${rA}: string;
  ${sB}: string;
  ${rB}: string;
  acceptanceCriteria: string[];
  lesson: LearnLesson;
  experience: "${experience}";
  source: "synthetic";
  weekId: number;
};

type Spec = {
  key: string;
  title: string;
  difficulty: LearnDifficulty;
  minutes: number;
  kind: ${kindType};
  scenario: string;
  task: string;
  hints: string[];
  takeaways: string[];
  ${sA}?: string;
  ${rA}: string;
  ${sB}?: string;
  ${rB}: string;
  acceptanceCriteria: string[];
};

function clip(text: string): string {
  return text.replace(/\\s+/g, " ").trim();
}

function challengeLimit(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

${blockA}

${blockB}

function slugToken(topic: ${topicType}): string {
  const tag = topic.cheatSheet[0]?.tag ?? "demo";
  return (
    tag
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24) || "demo"
  );
}

function defaultA(topic: ${topicType}): string {
  return blockA(topic.title, ${defaultA});
}

function defaultB(topic: ${topicType}): string {
  return blockB(topic.title, ${defaultB});
}

function buildLesson(
  topicSlug: string,
  id: string,
  title: string,
  difficulty: LearnDifficulty,
  minutes: number,
  scenario: string,
  task: string,
  hints: string[],
  referenceCode: string
): LearnLesson {
  return {
    id,
    topicSlug,
    weekId: 0,
    title,
    difficulty,
    category: "git",
    description: task,
    problemStatement: \`## Scenario\\n\\n\${scenario}\\n\\n## Task\\n\\n\${task}\`,
    command: "bash",
    terminalOutput: referenceCode,
    workflowDiagram: scenario,
    explanation: task,
    commonMistakes: hints,
    editorLanguage: "bash",
    estimatedMinutes: minutes,
    problemType: "terminal",
    hints,
  };
}

function specsForTopic(topic: ${topicType}): Spec[] {
  const specs: Spec[] = [];
  const push = (spec: Spec) => specs.push(spec);
  const title = topic.title;
  const summary = topic.summary ?? title;
  const explanation = topic.explanation ?? summary;
  const commonMistakes = topic.commonMistakes ?? [];
  const bestPractices = topic.bestPractices ?? [];
  const interviewQuestions = topic.interviewQuestions ?? [];
  const cheatSheet = topic.cheatSheet ?? [];
  const primary = cheatSheet[0]?.tag ?? title;
  const toolList =
    cheatSheet.length > 0
      ? cheatSheet.slice(0, 4).map((c) => c.tag).join(", ")
      : primary;
  const baseA = defaultA(topic);
  const baseB = defaultB(topic);

  push({
    key: "concept",
    title: clip(String(summary).replace(/\\.$/, "")),
    difficulty: "easy",
    minutes: 8,
    kind: "build",
    scenario: String(explanation).split(/(?<=\\.)\\s+/).slice(0, 2).join(" "),
    task: \`Draft interview-ready references for "\${title}". Use ideas from: \${toolList}.\`,
    hints: [
      "Keep the talk track explicit.",
      \`Focus on \${primary}.\`,
      "Make the second pane concrete and reusable.",
    ],
    takeaways: [summary, "Clear structure beats improvisation under pressure"],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Demonstrates the topic idea",
      "Both panes work together",
      "Safe for a learning environment",
    ],
  });

  push({
    key: "build",
    title: cheatSheet[0] ? \`Practice \${cheatSheet[0].tag}\` : \`Practice \${clip(title)}\`,
    difficulty: "easy",
    minutes: 10,
    kind: "build",
    scenario: \`Practice the core tools for "\${title}": \${toolList}.\`,
    task: \`Produce practical references using \${toolList}. Prefer clarity over cleverness.\`,
    hints: cheatSheet.slice(0, 3).map((c) => \`Use \${c.tag}: \${c.desc}\`).concat(["Keep it short enough to review in one pass."]),
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Uses the topic's core concepts",
      "Readable structure",
      "Useful under interview pressure",
    ],
  });

  push({
    key: "fix",
    title: \`Fix a weak \${clip(title)} answer\`,
    difficulty: "medium",
    minutes: 12,
    kind: "fix",
    scenario: \`A candidate's "\${title}" answer is fragile. Common mistakes include: \${commonMistakes.slice(0, 2).join("; ") || "vague structure and missing trade-offs"}.\`,
    task: \`Repair the references so they follow stronger practices for \${title}.\`,
    hints: [
      commonMistakes[0] || "Make the structure explicit",
      bestPractices[0] || "Add concrete examples",
      \`Re-check \${primary}\`,
    ],
    takeaways: [
      commonMistakes[0] || "Avoid vague answers",
      bestPractices[0] || "Prefer structured communication",
    ],
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Identifies the failure mode",
      "Applies at least one best practice",
      "Leaves a stronger reference than before",
    ],
  });

  push({
    key: "practice",
    title: \`Practice \${clip(title)}\`,
    difficulty: "medium",
    minutes: 12,
    kind: "layout",
    scenario: \`Prepare a reusable interview reference for "\${title}" using: \${toolList}.\`,
    task: \`Create a clean reference you could reuse in a mock interview, including checkpoints.\`,
    hints: [
      "Keep steps checkable",
      \`Highlight \${primary}\`,
      bestPractices[1] || "Include a recovery move if you get stuck",
    ],
    takeaways: bestPractices.slice(0, 2),
    ${rA}: baseA,
    ${rB}: baseB,
    acceptanceCriteria: [
      "Includes checkpoints",
      "Uses topic terminology correctly",
      "Suitable as a personal interview sheet",
    ],
  });

  const hardKey = topic.challengeWeight >= 5 ? "project" : "interview";
  if (hardKey === "interview") {
    push({
      key: "interview",
      title: \`Interview: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 15,
      kind: "interview",
      scenario: interviewQuestions[0]
        ? \`Interview prompt: \${interviewQuestions[0]}\`
        : \`Explain "\${title}" as you would in a staffing interview.\`,
      task: \`Answer with concrete artifacts. Cover trade-offs for \${title}.\`,
      hints: [
        interviewQuestions[1] || "Compare alternatives",
        interviewQuestions[2] || "Describe how you verify success",
        bestPractices[0] || "Mention failure modes",
      ],
      takeaways: [summary, bestPractices[0] || "Structure beats improvisation"],
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Answers the interview angle",
        "Includes a concrete example",
        "Mentions at least one risk or trade-off",
      ],
    });
  } else {
    push({
      key: "project",
      title: \`Mini project: \${clip(title)}\`,
      difficulty: "hard",
      minutes: 18,
      kind: "project",
      scenario: \`Build a complete interview-ready pack for "\${title}" using \${toolList}.\`,
      task: \`Produce polished references with structure, examples, and a recovery plan.\`,
      hints: [
        bestPractices[0] || "Make structure explicit",
        bestPractices[1] || "Add a worked example",
        commonMistakes[0] || "Avoid vague ownership of the answer",
      ],
      takeaways: bestPractices.slice(0, 3),
      ${rA}: baseA,
      ${rB}: baseB,
      acceptanceCriteria: [
        "Looks like a real interview sheet",
        "Includes an example",
        "Includes a recovery note",
      ],
    });
  }

  const unique = [];
  const seen = new Set();
  for (const spec of specs) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    unique.push(spec);
  }
  return pickBalancedSpecs(unique, challengeLimit(topic.challengeWeight));
}

function pickBalancedSpecs(specs: Spec[], limit: number): Spec[] {
  const byKey = new Map(specs.map((s) => [s.key, s]));
  const prefer = (...keys: string[]) =>
    keys.map((k) => byKey.get(k)).filter((s): s is Spec => Boolean(s));
  const hardPreferred = [...prefer("project"), ...prefer("interview")];
  let ladder: Spec[];
  if (limit <= 3) {
    ladder = hardPreferred.length
      ? [...prefer("concept", "fix"), hardPreferred[0]!]
      : prefer("concept", "build", "fix");
  } else if (limit === 4) {
    ladder = [
      ...prefer("concept", "build", "fix"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : prefer("practice")),
    ];
  } else {
    ladder = [
      ...prefer("concept", "build", "fix", "practice"),
      ...(hardPreferred[0] ? [hardPreferred[0]] : []),
    ];
  }
  const seen = new Set<string>();
  const out: Spec[] = [];
  for (const spec of ladder) {
    if (seen.has(spec.key)) continue;
    seen.add(spec.key);
    out.push(spec);
    if (out.length >= limit) break;
  }
  return out.slice(0, limit);
}

function buildChallenge(topicSlug: string, spec: Spec): ${challengeType} {
  const id = \`${idPrefix}-\${topicSlug}-\${spec.key}\`;
  const ${sA} = spec.${sA} ?? spec.${rA};
  const ${sB} = spec.${sB} ?? ${starterFallback};
  const lesson = buildLesson(
    topicSlug,
    id,
    spec.title,
    spec.difficulty,
    spec.minutes,
    spec.scenario,
    spec.task,
    spec.hints,
    spec.${rB}
  );
  return {
    id,
    topicSlug,
    title: spec.title,
    difficulty: spec.difficulty,
    minutes: spec.minutes,
    kind: spec.kind,
    scenario: spec.scenario,
    task: spec.task,
    hints: spec.hints,
    takeaways: spec.takeaways,
    ${sA},
    ${rA}: spec.${rA},
    ${sB},
    ${rB}: spec.${rB},
    acceptanceCriteria: spec.acceptanceCriteria,
    lesson,
    experience: "${experience}",
    source: "synthetic",
    weekId: 0,
  };
}

const BANK: ${challengeType}[] = ${flattenName}().flatMap((topic) =>
  specsForTopic(topic).map((spec) => buildChallenge(topic.slug, spec))
);

const BY_TOPIC = new Map<string, ${challengeType}[]>();
for (const c of BANK) {
  const list = BY_TOPIC.get(c.topicSlug) ?? [];
  list.push(c);
  BY_TOPIC.set(c.topicSlug, list);
}

export function ${listName}(topicSlug: string): ${challengeType}[] {
  return BY_TOPIC.get(topicSlug) ?? [];
}

export function ${allName}(): ${challengeType}[] {
  return BANK;
}

export function ${findName}(
  topicSlug: string,
  challengeId: string
): ${challengeType} | null {
  const list = ${listName}(topicSlug);
  const decoded = decodeURIComponent(challengeId);
  return list.find((c) => c.id === decoded || c.lesson.id === decoded) ?? null;
}

export function ${countName}(topicSlug: string): number {
  return ${listName}(topicSlug).length;
}

export function ${theoryName}(challenge: ${challengeType}): boolean {
  return challenge.difficulty === "easy" && challenge.kind !== "project";
}
`;
}

const interviewDefaultA = `\`function solve(input) {
  // Pattern focus: \${slugToken(topic)}
  // 1) clarify  2) approach  3) code  4) test
  const result = input;
  return result;
}
\``;

const interviewDefaultB = `\`## Talk track: \${slugToken(topic)}
1. Clarify inputs, constraints, and examples
2. State brute force + complexity
3. Upgrade to the target pattern
4. Code while narrating invariants
5. Dry-run sample + edge cases
\``;

const systemsDefaultA = `\`## Design notes: \${slugToken(topic)}
### Requirements
- Functional:
- Non-functional:

### High-level
- Clients -> API -> Service -> Storage

### Deep dive
- Bottleneck:
- Trade-offs:
\``;

const systemsDefaultB = `\`{
  "topic": "\${slugToken(topic)}",
  "components": ["client", "api", "service", "db", "cache"],
  "hot_path": "read",
  "tradeoffs": ["latency", "consistency", "cost"],
  "deep_dive": "cache-invalidation"
}
\``;

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/interview-academy-challenges.ts"),
  challengesSource({
    importPath: "interview-academy-curriculum",
    topicType: "InterviewTopicDef",
    flattenName: "flattenInterviewTopics",
    challengeType: "InterviewChallenge",
    kindType: "InterviewChallengeKind",
    experience: "interview-lab",
    idPrefix: "interview",
    listName: "listInterviewAcademyChallenges",
    allName: "allInterviewAcademyChallenges",
    findName: "findInterviewAcademyChallenge",
    countName: "interviewAcademyTopicChallengeCount",
    theoryName: "isInterviewTheoryChallenge",
    paneA: "Js",
    paneB: "Markdown",
    defaultA: interviewDefaultA,
    defaultB: interviewDefaultB,
  })
);

fs.writeFileSync(
  path.join(root, "src/features/curriculum/lib/systems-academy-challenges.ts"),
  challengesSource({
    importPath: "systems-academy-curriculum",
    topicType: "SystemsTopicDef",
    flattenName: "flattenSystemsTopics",
    challengeType: "SystemsChallenge",
    kindType: "SystemsChallengeKind",
    experience: "systems-lab",
    idPrefix: "systems",
    listName: "listSystemsAcademyChallenges",
    allName: "allSystemsAcademyChallenges",
    findName: "findSystemsAcademyChallenge",
    countName: "systemsAcademyTopicChallengeCount",
    theoryName: "isSystemsTheoryChallenge",
    paneA: "Markdown",
    paneB: "Json",
    defaultA: systemsDefaultA,
    defaultB: systemsDefaultB,
  })
);

console.log("wrote challenge banks");
console.log("done");
