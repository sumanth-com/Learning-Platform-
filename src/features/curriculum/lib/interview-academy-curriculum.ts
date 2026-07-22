export type InterviewDifficulty = "beginner" | "intermediate" | "advanced";

export type InterviewTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: InterviewDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type InterviewSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: InterviewTopicDef[];
};

export const INTERVIEW_ACADEMY_SECTIONS: InterviewSectionDef[] = [
  {
    "slug": "interview-foundations",
    "title": "Interview Foundations",
    "description": "How coding interviews work and how to communicate under pressure.",
    "topics": [
      {
        "slug": "interview-overview",
        "title": "Interview Overview",
        "summary": "Coding interviews test problem solving, communication, and code quality under time pressure.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "interview",
          "communication",
          "process"
        ],
        "challengeWeight": 4,
        "explanation": "A technical interview is a collaborative problem-solving session. Interviewers watch how you clarify requirements, choose approaches, write correct code, and discuss complexity. Communication matters as much as the final answer. Practice a repeatable process so stress does not erase your skills.",
        "a11yNotes": [],
        "commonMistakes": [
          "Silent coding with no narration",
          "Jumping into code before clarifying",
          "Ignoring time and never finishing"
        ],
        "bestPractices": [
          "Use a clear interview process",
          "Think out loud",
          "Leave time to test"
        ],
        "interviewQuestions": [
          "What do interviewers evaluate?",
          "Why communicate while coding?",
          "What is a repeatable process?"
        ],
        "cheatSheet": [
          {
            "tag": "clarify",
            "desc": "Ask about inputs, constraints, and examples"
          },
          {
            "tag": "approach",
            "desc": "State plan before coding"
          },
          {
            "tag": "verify",
            "desc": "Dry-run with examples"
          }
        ]
      },
      {
        "slug": "clarify-requirements",
        "title": "Clarify Requirements",
        "summary": "Ask about inputs, outputs, constraints, and edge cases before coding.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "clarify",
          "constraints",
          "edges"
        ],
        "challengeWeight": 4,
        "explanation": "Clarifying prevents solving the wrong problem. Ask about empty inputs, duplicates, sortedness, integer ranges, and expected return format. Restate the problem in your own words. Write a quick example on the board.",
        "a11yNotes": [],
        "commonMistakes": [
          "Assuming sorted input",
          "Missing empty-array behavior",
          "Coding before confirming the return type"
        ],
        "bestPractices": [
          "Restate the problem",
          "Ask about constraints and edges",
          "Confirm with an example"
        ],
        "interviewQuestions": [
          "What questions should you ask first?",
          "Why restate the problem?",
          "Name three common edge cases"
        ],
        "cheatSheet": [
          {
            "tag": "constraints",
            "desc": "Limits on size, time, and memory"
          },
          {
            "tag": "edge case",
            "desc": "Boundary input that often breaks code"
          },
          {
            "tag": "restate",
            "desc": "Repeat the problem in your words"
          }
        ]
      },
      {
        "slug": "think-out-loud",
        "title": "Think Out Loud",
        "summary": "Narrate trade-offs so interviewers can follow your reasoning.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "communication",
          "narrate",
          "trade-offs"
        ],
        "challengeWeight": 3,
        "explanation": "Thinking out loud turns an interview into a conversation. Explain why you discard a brute force, what invariant you maintain, and where bugs might hide. Pause to check understanding. Silence makes strong candidates look stuck.",
        "a11yNotes": [],
        "commonMistakes": [
          "Long silent pauses",
          "Narrating every keystroke with no structure",
          "Hiding uncertainty instead of asking"
        ],
        "bestPractices": [
          "Narrate approach and trade-offs",
          "Invite feedback",
          "Signal when you are stuck and what you will try"
        ],
        "interviewQuestions": [
          "Why narrate?",
          "What should you narrate?",
          "How do you handle being stuck?"
        ],
        "cheatSheet": [
          {
            "tag": "trade-off",
            "desc": "Pros and cons of an approach"
          },
          {
            "tag": "invariant",
            "desc": "Property that stays true during the algorithm"
          },
          {
            "tag": "checkpoint",
            "desc": "Pause to confirm with the interviewer"
          }
        ]
      },
      {
        "slug": "time-boxing",
        "title": "Time Boxing",
        "summary": "Budget time for clarify, approach, code, and tests.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "time",
          "pacing",
          "plan"
        ],
        "challengeWeight": 4,
        "explanation": "A common split is clarify, approach, implement, then test. If a perfect solution is too slow to write, ship a correct simpler solution first. Say when you are moving to the next phase. Pacing shows seniority.",
        "a11yNotes": [],
        "commonMistakes": [
          "Spending all time optimizing before any code",
          "No tests at the end",
          "Overbuilding helpers you do not need"
        ],
        "bestPractices": [
          "Announce your time plan",
          "Prefer correct then optimize",
          "Reserve minutes to dry-run"
        ],
        "interviewQuestions": [
          "How do you split interview time?",
          "When ship a simpler solution?",
          "Why reserve test time?"
        ],
        "cheatSheet": [
          {
            "tag": "pacing",
            "desc": "Managing time across interview phases"
          },
          {
            "tag": "MVP solution",
            "desc": "Correct first version you can finish"
          },
          {
            "tag": "dry-run",
            "desc": "Trace the code on an example"
          }
        ]
      }
    ]
  },
  {
    "slug": "core-patterns",
    "title": "Core Patterns",
    "description": "Patterns that show up constantly in coding rounds.",
    "topics": [
      {
        "slug": "two-pointers",
        "title": "Two Pointers",
        "summary": "Two pointers scan from ends or at different speeds on arrays and strings.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "two-pointers",
          "arrays",
          "strings"
        ],
        "challengeWeight": 4,
        "explanation": "Two pointers reduce nested loops when order or meeting conditions matter. Classic uses include pair sums on sorted arrays, palindrome checks, and in-place compaction. State the invariant for each pointer. Watch off-by-one errors at boundaries.",
        "a11yNotes": [],
        "commonMistakes": [
          "Using two pointers on unsorted pair-sum without a plan",
          "Moving the wrong pointer",
          "Forgetting equal-pointer termination"
        ],
        "bestPractices": [
          "State pointer meaning",
          "Move based on a clear condition",
          "Test boundaries"
        ],
        "interviewQuestions": [
          "When use two pointers?",
          "What is a pointer invariant?",
          "Name a classic problem"
        ],
        "cheatSheet": [
          {
            "tag": "left/right",
            "desc": "Pointers from both ends"
          },
          {
            "tag": "fast/slow",
            "desc": "Pointers at different speeds"
          },
          {
            "tag": "invariant",
            "desc": "What each pointer guarantees"
          }
        ]
      },
      {
        "slug": "sliding-window",
        "title": "Sliding Window",
        "summary": "Windows maintain a contiguous range while expanding and shrinking.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "window",
          "subarray",
          "substring"
        ],
        "challengeWeight": 4,
        "explanation": "Sliding windows track counts or sums over a contiguous segment. Expand to include new elements, shrink when constraints break. Useful for longest substring with conditions and minimum subarray length. Keep window state updated in O(1) per move when possible.",
        "a11yNotes": [],
        "commonMistakes": [
          "Recalculating the whole window from scratch each time",
          "Shrinking incorrectly",
          "Off-by-one on inclusive bounds"
        ],
        "bestPractices": [
          "Maintain running state",
          "Define expand/shrink rules",
          "Test with tiny inputs"
        ],
        "interviewQuestions": [
          "When use sliding window?",
          "What state do you maintain?",
          "Expand vs shrink?"
        ],
        "cheatSheet": [
          {
            "tag": "expand",
            "desc": "Grow the window to the right"
          },
          {
            "tag": "shrink",
            "desc": "Move left forward to restore validity"
          },
          {
            "tag": "window state",
            "desc": "Counts/sums for the current range"
          }
        ]
      },
      {
        "slug": "hash-maps-sets",
        "title": "Hash Maps and Sets",
        "summary": "Hashing gives average O(1) lookups for frequency and membership.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "hashmap",
          "set",
          "frequency"
        ],
        "challengeWeight": 4,
        "explanation": "Maps and sets unlock two-sum variants, anagram checks, and duplicate detection. State what the key represents. Discuss average vs worst-case behavior if asked. Prefer clear key design over clever tricks.",
        "a11yNotes": [],
        "commonMistakes": [
          "Unclear key meaning",
          "Mutating map while iterating carelessly",
          "Using maps when sorting would be simpler and fine"
        ],
        "bestPractices": [
          "Define key and value meaning",
          "Update frequencies carefully",
          "Mention complexity honestly"
        ],
        "interviewQuestions": [
          "When choose a hash map?",
          "What should the key represent?",
          "Average vs worst case?"
        ],
        "cheatSheet": [
          {
            "tag": "frequency map",
            "desc": "Count occurrences of values"
          },
          {
            "tag": "membership",
            "desc": "Check if a value was seen"
          },
          {
            "tag": "key design",
            "desc": "What uniquely identifies an entry"
          }
        ]
      },
      {
        "slug": "binary-search",
        "title": "Binary Search",
        "summary": "Binary search finds boundaries on sorted spaces and answer spaces.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "binary-search",
          "bounds",
          "sorted"
        ],
        "challengeWeight": 5,
        "explanation": "Beyond arrays, binary search works on monotonic answer spaces. Define the predicate clearly: is mid feasible? Watch infinite loops from bad mid updates. Practice lower-bound and upper-bound templates.",
        "a11yNotes": [],
        "commonMistakes": [
          "Unclear predicate",
          "Updating lo/hi incorrectly",
          "Assuming the array is sorted when it is not"
        ],
        "bestPractices": [
          "Write the predicate first",
          "Use a trusted template",
          "Test with empty and single-element arrays"
        ],
        "interviewQuestions": [
          "What makes a problem binary-searchable?",
          "What is a predicate?",
          "Lower vs upper bound?"
        ],
        "cheatSheet": [
          {
            "tag": "predicate",
            "desc": "Boolean test on mid"
          },
          {
            "tag": "monotonic",
            "desc": "Feasibility never flips twice"
          },
          {
            "tag": "bound",
            "desc": "First or last valid index/answer"
          }
        ]
      },
      {
        "slug": "bfs-dfs",
        "title": "BFS and DFS",
        "summary": "Graph and tree traversal patterns for search and connectivity.",
        "estimatedMinutes": 14,
        "difficulty": "intermediate",
        "keywords": [
          "bfs",
          "dfs",
          "graph"
        ],
        "challengeWeight": 5,
        "explanation": "BFS explores level by level and fits shortest paths in unweighted graphs. DFS fits path existence, components, and backtracking. Track visited nodes. Clarify directed vs undirected edges.",
        "a11yNotes": [],
        "commonMistakes": [
          "Forgetting visited marks",
          "Using DFS for unweighted shortest path casually",
          "Confusing stack vs queue"
        ],
        "bestPractices": [
          "Choose BFS or DFS intentionally",
          "Mark visited correctly",
          "State graph assumptions"
        ],
        "interviewQuestions": [
          "When prefer BFS?",
          "When prefer DFS?",
          "Why mark visited?"
        ],
        "cheatSheet": [
          {
            "tag": "BFS",
            "desc": "Queue-based level order search"
          },
          {
            "tag": "DFS",
            "desc": "Stack/recursion depth-first search"
          },
          {
            "tag": "visited",
            "desc": "Set of explored nodes"
          }
        ]
      }
    ]
  },
  {
    "slug": "coding-habits",
    "title": "Coding Habits",
    "description": "Write interview code that is correct, tested, and discussable.",
    "topics": [
      {
        "slug": "brute-force-first",
        "title": "Brute Force First",
        "summary": "Start with a correct brute force, then optimize with reasoning.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "brute-force",
          "optimize",
          "complexity"
        ],
        "challengeWeight": 4,
        "explanation": "A correct brute force proves understanding and buys time. Then identify bottlenecks and apply a pattern. Interviewers often want to hear the improvement path. Do not optimize a wrong idea.",
        "a11yNotes": [],
        "commonMistakes": [
          "Optimizing before a correct baseline",
          "Cannot explain why the faster approach works",
          "Skipping complexity discussion"
        ],
        "bestPractices": [
          "State brute force complexity",
          "Identify the bottleneck",
          "Upgrade with a named pattern"
        ],
        "interviewQuestions": [
          "Why start brute force?",
          "How do you justify an optimization?",
          "What is a bottleneck?"
        ],
        "cheatSheet": [
          {
            "tag": "baseline",
            "desc": "Correct initial approach"
          },
          {
            "tag": "bottleneck",
            "desc": "Step that dominates cost"
          },
          {
            "tag": "upgrade",
            "desc": "Faster approach with rationale"
          }
        ]
      },
      {
        "slug": "complexity-talk",
        "title": "Complexity Talk",
        "summary": "Explain time and space clearly with big-O and reasoning.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "complexity",
          "big-o",
          "space"
        ],
        "challengeWeight": 3,
        "explanation": "Say time and space in big-O and point to the loops or data structures that cause it. Mention average vs worst case for hashes. Compare approaches briefly. Avoid memorized numbers without reasoning.",
        "a11yNotes": [],
        "commonMistakes": [
          "Stating O(n) with nested loops",
          "Ignoring auxiliary space",
          "No comparison between approaches"
        ],
        "bestPractices": [
          "Tie complexity to code structure",
          "Include space",
          "Compare alternatives"
        ],
        "interviewQuestions": [
          "How do you justify big-O?",
          "Why mention space?",
          "Average vs worst case for maps?"
        ],
        "cheatSheet": [
          {
            "tag": "time",
            "desc": "How runtime grows with input"
          },
          {
            "tag": "space",
            "desc": "Extra memory beyond input"
          },
          {
            "tag": "tight bound",
            "desc": "Most precise honest big-O you can defend"
          }
        ]
      },
      {
        "slug": "dry-run-tests",
        "title": "Dry Run and Tests",
        "summary": "Trace examples and list edge cases before claiming done.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "testing",
          "dry-run",
          "edges"
        ],
        "challengeWeight": 4,
        "explanation": "Dry-run your code on the sample. Then try empty, single element, duplicates, and large values. Fix bugs you find out loud. Testing shows craftsmanship under pressure.",
        "a11yNotes": [],
        "commonMistakes": [
          "No tests after coding",
          "Only happy-path example",
          "Quietly patching without explaining"
        ],
        "bestPractices": [
          "Dry-run the sample",
          "List edge cases",
          "Narrate bug fixes"
        ],
        "interviewQuestions": [
          "What is a dry run?",
          "Which edges should you try?",
          "Why narrate fixes?"
        ],
        "cheatSheet": [
          {
            "tag": "dry-run",
            "desc": "Manual execution trace"
          },
          {
            "tag": "edge list",
            "desc": "Boundary cases to check"
          },
          {
            "tag": "regression",
            "desc": "Bug introduced while fixing another"
          }
        ]
      },
      {
        "slug": "clean-interview-code",
        "title": "Clean Interview Code",
        "summary": "Prefer readable names, small helpers, and honest comments.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "readability",
          "helpers",
          "style"
        ],
        "challengeWeight": 4,
        "explanation": "Interview code should be readable more than clever. Use meaningful names, extract a helper if it clarifies, and avoid dense one-liners. Mention what you would refactor with more time.",
        "a11yNotes": [],
        "commonMistakes": [
          "Single-letter names everywhere",
          "Clever code you cannot explain",
          "Giant functions with no structure"
        ],
        "bestPractices": [
          "Name intents clearly",
          "Extract helpers for clarity",
          "Keep control flow obvious"
        ],
        "interviewQuestions": [
          "What makes interview code clean?",
          "When extract a helper?",
          "What would you refactor later?"
        ],
        "cheatSheet": [
          {
            "tag": "intent",
            "desc": "What a variable or function means"
          },
          {
            "tag": "helper",
            "desc": "Small function that clarifies a step"
          },
          {
            "tag": "readability",
            "desc": "How easily another engineer follows the code"
          }
        ]
      }
    ]
  },
  {
    "slug": "pressure-skills",
    "title": "Pressure Skills",
    "description": "Stay effective when stuck, hint-driven, or timed out.",
    "topics": [
      {
        "slug": "getting-unstuck",
        "title": "Getting Unstuck",
        "summary": "Use structured recovery when you blank or stall.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "stuck",
          "hints",
          "recovery"
        ],
        "challengeWeight": 4,
        "explanation": "When stuck, restate constraints, try a smaller example, or switch to brute force. Ask for a hint if allowed after showing effort. Interviewers care how you recover. Panic looping wastes the round.",
        "a11yNotes": [],
        "commonMistakes": [
          "Repeating the same failing idea silently",
          "Giving up immediately",
          "Rejecting hints defensively"
        ],
        "bestPractices": [
          "Change the example size",
          "Fall back to brute force",
          "Use hints productively"
        ],
        "interviewQuestions": [
          "What do you do first when stuck?",
          "How do you use a hint?",
          "Why restate constraints?"
        ],
        "cheatSheet": [
          {
            "tag": "smaller example",
            "desc": "Simplify the input to regain insight"
          },
          {
            "tag": "hint",
            "desc": "Interviewer nudge after effort"
          },
          {
            "tag": "reset",
            "desc": "Return to clarify/approach phases"
          }
        ]
      },
      {
        "slug": "follow-up-questions",
        "title": "Follow-Up Questions",
        "summary": "Expect variants: optimize, stream, parallelize, or change constraints.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "follow-up",
          "variants",
          "optimize"
        ],
        "challengeWeight": 4,
        "explanation": "Follow-ups probe depth. Practice answering what changes if n is huge, if input is sorted, or if you need online processing. Relate answers to patterns you already know. Stay calm and structured.",
        "a11yNotes": [],
        "commonMistakes": [
          "Blank stare on follow-ups",
          "Random new approach with no link to prior solution",
          "Ignoring the changed constraint"
        ],
        "bestPractices": [
          "Reuse prior reasoning",
          "Name the new constraint",
          "Outline the delta clearly"
        ],
        "interviewQuestions": [
          "What are common follow-ups?",
          "How do you structure an answer?",
          "Why reuse prior reasoning?"
        ],
        "cheatSheet": [
          {
            "tag": "delta",
            "desc": "What changes from the prior solution"
          },
          {
            "tag": "online",
            "desc": "Process input as it arrives"
          },
          {
            "tag": "scale-up",
            "desc": "Handle much larger n"
          }
        ]
      },
      {
        "slug": "language-fluency",
        "title": "Language Fluency",
        "summary": "Know your interview language APIs well enough to avoid syntax stalls.",
        "estimatedMinutes": 10,
        "difficulty": "beginner",
        "keywords": [
          "language",
          "apis",
          "fluency"
        ],
        "challengeWeight": 3,
        "explanation": "Pick one interview language and know arrays, maps, queues, and string basics cold. Syntax stalls burn time and confidence. It is fine to ask about a rarely used API, but not core loops.",
        "a11yNotes": [],
        "commonMistakes": [
          "Switching languages mid-prep constantly",
          "Forgetting how to iterate a map",
          "Spending minutes on syntax"
        ],
        "bestPractices": [
          "Practice core APIs daily",
          "Keep a personal cheatsheet while studying",
          "Prefer familiarity over novelty in interviews"
        ],
        "interviewQuestions": [
          "Which APIs must you know cold?",
          "Why stick to one language?",
          "What is acceptable to ask?"
        ],
        "cheatSheet": [
          {
            "tag": "core API",
            "desc": "Everyday collection and string operations"
          },
          {
            "tag": "cheatsheet",
            "desc": "Study aid for common methods"
          },
          {
            "tag": "fluency",
            "desc": "Low-friction coding in your language"
          }
        ]
      },
      {
        "slug": "mock-interviews",
        "title": "Mock Interviews",
        "summary": "Mocks build pacing, communication, and feedback loops.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "mock",
          "practice",
          "feedback"
        ],
        "challengeWeight": 4,
        "explanation": "Mock interviews reveal blind spots that solo LeetCode misses. Record yourself or practice with a peer. Review communication and pacing, not only correctness. Increase difficulty gradually.",
        "a11yNotes": [],
        "commonMistakes": [
          "Only solo grinding",
          "No feedback review",
          "Mocks without timing"
        ],
        "bestPractices": [
          "Schedule regular mocks",
          "Review recordings or notes",
          "Track pacing and clarity metrics"
        ],
        "interviewQuestions": [
          "What do mocks teach that solo practice misses?",
          "How do you review a mock?",
          "What metrics help?"
        ],
        "cheatSheet": [
          {
            "tag": "mock",
            "desc": "Simulated interview practice"
          },
          {
            "tag": "feedback",
            "desc": "Notes on communication and code"
          },
          {
            "tag": "pacing metric",
            "desc": "Whether phases finished on time"
          }
        ]
      }
    ]
  },
  {
    "slug": "problem-families",
    "title": "Problem Families",
    "description": "Recognize families quickly so you pick a pattern faster.",
    "topics": [
      {
        "slug": "arrays-strings-family",
        "title": "Arrays and Strings Family",
        "summary": "Many problems reduce to scanning, windows, or two pointers on sequences.",
        "estimatedMinutes": 12,
        "difficulty": "beginner",
        "keywords": [
          "arrays",
          "strings",
          "scan"
        ],
        "challengeWeight": 4,
        "explanation": "Sequence problems often need a single pass, two pointers, or a window. Identify whether order matters, whether indices matter, and whether frequencies help. Translate words into constraints before coding.",
        "a11yNotes": [],
        "commonMistakes": [
          "Jumping to DP for simple scans",
          "Ignoring index vs value distinctions",
          "Mutating while iterating without care"
        ],
        "bestPractices": [
          "Classify the scan pattern",
          "Decide if extra memory helps",
          "Confirm in-place requirements"
        ],
        "interviewQuestions": [
          "How do you classify sequence problems?",
          "When use extra memory?",
          "Index vs value?"
        ],
        "cheatSheet": [
          {
            "tag": "single pass",
            "desc": "One left-to-right scan"
          },
          {
            "tag": "in-place",
            "desc": "Modify input with limited extra memory"
          },
          {
            "tag": "frequency",
            "desc": "Counting occurrences to decide"
          }
        ]
      },
      {
        "slug": "trees-graphs-family",
        "title": "Trees and Graphs Family",
        "summary": "Clarify representation, cycles, and what success means.",
        "estimatedMinutes": 12,
        "difficulty": "intermediate",
        "keywords": [
          "trees",
          "graphs",
          "traversal"
        ],
        "challengeWeight": 4,
        "explanation": "Ask whether the graph is directed, weighted, or may contain cycles. Confirm input representation: adjacency list, matrix, or edge list. Choose BFS/DFS/union-find accordingly. Draw a tiny example.",
        "a11yNotes": [],
        "commonMistakes": [
          "Assuming no cycles",
          "Wrong representation assumptions",
          "Forgetting base cases on trees"
        ],
        "bestPractices": [
          "Clarify graph properties",
          "Draw a small example",
          "Pick traversal intentionally"
        ],
        "interviewQuestions": [
          "What properties must you clarify?",
          "When use union-find?",
          "Why draw examples?"
        ],
        "cheatSheet": [
          {
            "tag": "adjacency list",
            "desc": "Map from node to neighbors"
          },
          {
            "tag": "cycle",
            "desc": "Path that revisits a node"
          },
          {
            "tag": "base case",
            "desc": "Null/empty leaf handling"
          }
        ]
      },
      {
        "slug": "dp-family",
        "title": "DP Family",
        "summary": "Dynamic programming needs state, transition, and base cases.",
        "estimatedMinutes": 14,
        "difficulty": "advanced",
        "keywords": [
          "dp",
          "state",
          "transition"
        ],
        "challengeWeight": 5,
        "explanation": "DP problems ask for optimal counts or decisions over overlapping subproblems. Define state meaning, transitions, and bases before coding. Start with recursion + memo if helpful, then bottom-up. Explain why greed fails if asked.",
        "a11yNotes": [],
        "commonMistakes": [
          "Coding DP without defining state",
          "Wrong base cases",
          "Forcing DP onto non-overlapping problems"
        ],
        "bestPractices": [
          "Write state in words",
          "List transitions",
          "Verify bases on tiny inputs"
        ],
        "interviewQuestions": [
          "What three parts define DP?",
          "Memo vs bottom-up?",
          "When is greed not enough?"
        ],
        "cheatSheet": [
          {
            "tag": "state",
            "desc": "What a DP cell represents"
          },
          {
            "tag": "transition",
            "desc": "How states derive from others"
          },
          {
            "tag": "base case",
            "desc": "Smallest solved subproblems"
          }
        ]
      },
      {
        "slug": "intervals-heaps",
        "title": "Intervals and Heaps",
        "summary": "Sorting plus heaps often solve scheduling and top-k patterns.",
        "estimatedMinutes": 12,
        "difficulty": "advanced",
        "keywords": [
          "intervals",
          "heap",
          "topk"
        ],
        "challengeWeight": 4,
        "explanation": "Interval problems usually sort by start or end, then scan with careful merging. Top-k and streaming medians lean on heaps. State comparator direction explicitly to avoid bugs.",
        "a11yNotes": [],
        "commonMistakes": [
          "Forgetting to sort intervals",
          "Wrong heap polarity",
          "Off-by-one on inclusive ends"
        ],
        "bestPractices": [
          "Sort with an explicit key",
          "Say min-heap vs max-heap out loud",
          "Test overlapping edges"
        ],
        "interviewQuestions": [
          "How do you approach intervals?",
          "When use a heap?",
          "What is heap polarity?"
        ],
        "cheatSheet": [
          {
            "tag": "sort key",
            "desc": "Field used to order intervals"
          },
          {
            "tag": "min-heap",
            "desc": "Smallest element at top"
          },
          {
            "tag": "top-k",
            "desc": "Keep the k best elements efficiently"
          }
        ]
      }
    ]
  }
];

export function flattenInterviewTopics(): InterviewTopicDef[] {
  return INTERVIEW_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
