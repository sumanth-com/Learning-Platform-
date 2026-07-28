import type { LearnDifficulty } from "@/learning-engine/types";
import type { InterviewTopicDef } from "@/features/curriculum/lib/interview-academy-curriculum";
import type { SystemsTopicDef } from "@/features/curriculum/lib/systems-academy-curriculum";

export type PrepPattern = { tag: string; desc: string };

export type PrepDrillGuide = {
  briefing: string;
  prompts: string[];
  patterns: PrepPattern[];
  dos: string[];
  donts: string[];
  talkTrack: string;
};

type TopicLike = {
  title: string;
  summary: string;
  explanation: string;
  estimatedMinutes: number;
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  cheatSheet: PrepPattern[];
  keywords: string[];
};

function clip(text: string, max = 90): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function pick<T>(arr: T[], i: number, fallback: T): T {
  return arr[i] ?? arr[0] ?? fallback;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function codingDrills(topic: TopicLike) {
  const title = topic.title;
  const sheet = topic.cheatSheet;
  const q = topic.interviewQuestions;
  const bp = topic.bestPractices;
  const miss = topic.commonMistakes;
  const sents = sentences(topic.explanation);
  const primary = pick(sheet, 0, { tag: title, desc: topic.summary });
  const secondary = pick(sheet, 1, {
    tag: "edge cases",
    desc: "Name inputs that break a naive solution",
  });
  const tertiary = pick(sheet, 2, {
    tag: "complexity",
    desc: "State time and space clearly",
  });

  return {
    concept: {
      title: `Understand ${title}`,
      difficulty: "easy" as LearnDifficulty,
      minutes: Math.min(10, Math.max(6, topic.estimatedMinutes - 2)),
      kind: "build" as const,
      scenario: sents.slice(0, 2).join(" ") || topic.summary,
      task: `Learn the mental model for ${title}. Be ready to teach it in 60 seconds.`,
      hints: [
        `Start from why ${title} shows up in interviews.`,
        `Connect it to ${primary.tag}.`,
        "Keep the explanation short enough to say out loud.",
      ],
      takeaways: [
        topic.summary,
        `${title} is a process skill as much as a coding skill.`,
      ],
      acceptanceCriteria: [
        `Can define ${title} without reading notes`,
        `Names why interviewers care about ${primary.tag}`,
        "Gives one concrete example from memory",
      ],
      prep: {
        briefing: `${sents[0] ?? topic.summary} For juniors: focus on the vocabulary (${sheet
          .map((c) => c.tag)
          .slice(0, 3)
          .join(", ") || "clarify / approach / verify"}). For seniors: also explain how this pattern changes under ambiguous product constraints.`,
        prompts: [
          q[0] ?? `What problem does ${title} solve in an interview?`,
          `How would you explain ${title} to a teammate in one minute?`,
          `Where do candidates usually go wrong on ${title}?`,
        ],
        patterns: [
          {
            tag: "mental model",
            desc: `Core idea of ${title} in plain language`,
          },
          { tag: primary.tag, desc: primary.desc },
          {
            tag: "signal",
            desc: "What a strong answer sounds like to the interviewer",
          },
        ],
        dos: [
          `Open with a one-sentence definition of ${title}`,
          `Tie the idea to ${primary.tag}: ${primary.desc}`,
          "Give a tiny example before diving into details",
        ],
        donts: [
          miss[0] ?? "Jumping into code with no framing",
          "Reciting buzzwords without an example",
          "Making the overview longer than 90 seconds",
        ],
        talkTrack: `“${title} matters because ${clip(topic.summary, 110)}. I use a simple loop: ${primary.tag} → ${secondary.tag} → ${tertiary.tag}. Example: … Then I check I’m still solving the asked problem.”`,
      } satisfies PrepDrillGuide,
    },
    build: {
      title: `Drill: ${primary.tag}`,
      difficulty: "easy" as LearnDifficulty,
      minutes: 10,
      kind: "build" as const,
      scenario: `This drill isolates one skill inside ${title}: ${primary.tag} — ${primary.desc}.`,
      task: `Practice only ${primary.tag} until you can do it cleanly under a 3-minute timer.`,
      hints: [
        `Repeat ${primary.tag} with a new example each attempt.`,
        secondary.desc,
        "Stop if you start solving the whole problem — stay on this skill.",
      ],
      takeaways: [
        `${primary.tag} should be automatic before you optimize.`,
        bp[0] ?? "Clarity beats cleverness under pressure.",
      ],
      acceptanceCriteria: [
        `Can demonstrate ${primary.tag} without prompting`,
        "Uses a fresh example, not memorized script only",
        "Finishes the drill within the time box",
      ],
      prep: {
        briefing: `Skill drill for ${title}. Ignore full problem solving. Your only job is excellence at “${primary.tag}”: ${primary.desc}. Students: narrate every step. Advanced: add what you’d ask a product manager and what you’d refuse to assume.`,
        prompts: [
          `Walk me through ${primary.tag} on a brand-new input.`,
          `What questions prove you did ${primary.tag} well?`,
          `How does skipping ${primary.tag} show up later in the interview?`,
        ],
        patterns: [
          { tag: primary.tag, desc: primary.desc },
          {
            tag: "timer",
            desc: "3 minutes: practice, then self-score clarity",
          },
          {
            tag: "example swap",
            desc: "Change the example each pass so it isn’t rote",
          },
        ],
        dos: [
          `Say the goal of ${primary.tag} before details`,
          `Use numbers/examples, not abstractions only`,
          bp[1] ?? "Leave a clear next step after the skill",
        ],
        donts: [
          `Skipping ${primary.tag} to “save time”`,
          miss[1] ?? "Mixing five skills in one breath",
          "Practicing silently — interviews are spoken",
        ],
        talkTrack: `“I’m going to practice ${primary.tag} only. For this input: … Constraints I confirm: … Example I will use: … Done. Next I’d move to ${secondary.tag}.”`,
      } satisfies PrepDrillGuide,
    },
    fix: {
      title: `Repair a weak ${title} answer`,
      difficulty: "medium" as LearnDifficulty,
      minutes: 12,
      kind: "fix" as const,
      scenario: `A candidate answered ${title} poorly. They fell into: ${(miss.slice(0, 2).join("; ") || "vague structure and missing checks")}.`,
      task: `Diagnose the failure, then deliver a repaired spoken answer that a hiring panel would trust.`,
      hints: [
        miss[0] ?? "Name the failure mode first",
        `Rewrite with ${primary.tag} visible`,
        bp[0] ?? "Add one concrete check or example",
      ],
      takeaways: [
        "Weak answers usually skip structure, not intelligence",
        bp[0] ?? "Repair by making the process audible",
      ],
      acceptanceCriteria: [
        "Names the specific failure in the weak answer",
        "Repaired answer includes structure + example",
        "Sounds different from the broken version",
      ],
      prep: {
        briefing: `Debug mode for ${title}. First identify what broke, then rebuild. Weak pattern to notice: ${miss[0] ?? "no structure"}${miss[1] ? `; also ${miss[1]}` : ""}. Students: rewrite line by line. Advanced: also explain how you’d coach a junior who made this mistake.`,
        prompts: [
          `What exactly made the original ${title} answer weak?`,
          `Which missing step (${primary.tag} / ${secondary.tag}) hurt most?`,
          "Say the repaired answer out loud in under two minutes.",
        ],
        patterns: [
          {
            tag: "diagnose",
            desc: "Point to the failure mode before rewriting",
          },
          {
            tag: "rebuild",
            desc: `Re-insert ${primary.tag} and ${secondary.tag}`,
          },
          {
            tag: "contrast",
            desc: "One sentence: weak vs strong version",
          },
        ],
        dos: [
          "Start with ‘Here’s what went wrong…’",
          `Rebuild around ${primary.tag}`,
          bp[0] ?? "End with a verification step",
        ],
        donts: [
          "Pretending the weak answer was ‘almost fine’",
          miss[0] ?? "Keeping the same structure and adding fluff",
          "Fixing tone without fixing content",
        ],
        talkTrack: `“The weak answer failed because ${miss[0] ?? "it had no structure"}. Strong version: I ${primary.tag} first (${primary.desc}), then ${secondary.tag}. Example: … I verify with ${tertiary.tag}.”`,
      } satisfies PrepDrillGuide,
    },
    practice: {
      title: `Mock run: ${title}`,
      difficulty: "medium" as LearnDifficulty,
      minutes: 14,
      kind: "layout" as const,
      scenario: `Full mock for ${title}. You will run a complete spoken pass with checkpoints you could reuse tomorrow.`,
      task: `Deliver a complete ${title} mock: open, work the pattern, verify, and close with complexity/trade-offs.`,
      hints: [
        "Use a timer and do not pause the narrative",
        `Hit ${primary.tag}, ${secondary.tag}, and ${tertiary.tag}`,
        bp[1] ?? "Keep a recovery line if you blank",
      ],
      takeaways: [
        "Mocks build muscle memory for pressure",
        "A reusable sheet beats improvising every time",
      ],
      acceptanceCriteria: [
        "Full spoken pass without reading a script word-for-word",
        "Hits clarify/approach/verify style checkpoints",
        "Ends with complexity or trade-off note",
      ],
      prep: {
        briefing: `End-to-end mock for ${title}. Treat this like a live loop: intro → work → verify → close. Students: follow the checkpoints in order. Advanced: inject a curveball mid-answer (new constraint) and recover without restarting from zero.`,
        prompts: [
          `Run a full ${title} answer as if the interviewer is silent.`,
          "Where will you check yourself mid-solution?",
          "What is your recovery line if you blank for 10 seconds?",
        ],
        patterns: [
          { tag: "open", desc: "Restate goal + constraints in ≤20 seconds" },
          {
            tag: "work",
            desc: `${primary.tag} → ${secondary.tag} while narrating`,
          },
          {
            tag: "close",
            desc: `${tertiary.tag} + what you’d do with more time`,
          },
        ],
        dos: [
          "Keep talking through uncertainty",
          `Checkpoint after ${primary.tag}`,
          bp[0] ?? "State complexity before stopping",
        ],
        donts: [
          "Silent stretches longer than a few seconds",
          miss[0] ?? "Skipping verification at the end",
          "Restarting from scratch when one detail changes",
        ],
        talkTrack: `“Goal: … Constraints: … Plan via ${primary.tag}. Working: … Checkpoint: still correct? Verify with example. Complexity: … If we had more time: …”`,
      } satisfies PrepDrillGuide,
    },
    interview: {
      title: `Hard prompt: ${clip(q[0] ?? title, 64)}`,
      difficulty: "hard" as LearnDifficulty,
      minutes: 16,
      kind: "interview" as const,
      scenario: q[0]
        ? `Staff interview prompt for ${title}: ${q[0]}`
        : `Defend ${title} like a staffing interview with trade-offs.`,
      task: `Answer at senior depth: alternatives, risks, and how you’d verify under time pressure.`,
      hints: [
        q[1] ?? "Compare at least two approaches",
        q[2] ?? "Name a failure mode and mitigation",
        "Close with how you’d measure success",
      ],
      takeaways: [
        "Hard interviews reward trade-off talk, not only the happy path",
        bp[0] ?? "Own risks explicitly",
      ],
      acceptanceCriteria: [
        "Answers the hard prompt directly",
        "Compares alternatives or trade-offs",
        "Mentions risk + verification",
      ],
      prep: {
        briefing: `Senior-depth prompt on ${title}. ${q[0] ? `Prompt: ${q[0]}.` : ""} Students: still use structure, but add one trade-off. Advanced: argue when you would NOT use the default approach, and what metric proves your choice.`,
        prompts: [
          q[0]
            ? `Answer at depth: ${q[0]} Include trade-offs.`
            : `How do you approach ${title} when requirements are fuzzy?`,
          q[1] ?? `What’s the alternative to the default ${title} approach?`,
          q[2] ?? "What risk would you call out to the interviewer?",
        ],
        patterns: [
          {
            tag: "trade-off",
            desc: "Name cost/benefit of two approaches",
          },
          {
            tag: "risk",
            desc: "Failure mode + how you’d detect it",
          },
          {
            tag: "bar raiser",
            desc: "What you’d do with 10 more minutes",
          },
        ],
        dos: [
          "Answer the asked question first, then deepen",
          `Use ${primary.tag} even under pressure`,
          "State a measurable success check",
        ],
        donts: [
          "Dodging the hard part of the prompt",
          miss[0] ?? "Only describing the happy path",
          "Claiming ‘it depends’ with no decision",
        ],
        talkTrack: `“Direct answer: … Why: … Alternative I’d reject because … Risk: … I’d verify by … With more time I’d …”`,
      } satisfies PrepDrillGuide,
    },
    project: {
      title: `Build your ${title} cheat card`,
      difficulty: "hard" as LearnDifficulty,
      minutes: 18,
      kind: "project" as const,
      scenario: `Create a personal one-page cheat card for ${title} you can review before any onsite.`,
      task: `Produce a durable interview sheet: triggers, steps, example, and recovery line.`,
      hints: [
        "Keep it scannable in 30 seconds",
        `Include ${primary.tag} and ${secondary.tag}`,
        "Add one recovery line for blanking",
      ],
      takeaways: [
        "Personal sheets beat generic blogs under stress",
        "Recovery lines save interviews",
      ],
      acceptanceCriteria: [
        "Fits on one mental page",
        "Includes example + recovery",
        "Uses topic terminology correctly",
      ],
      prep: {
        briefing: `Portfolio drill for ${title}: leave with a reusable card. Students: copy the structure below into your notes. Advanced: add company-specific variants (product vs platform interview) and a ‘smell test’ for when the pattern doesn’t apply.`,
        prompts: [
          `What triggers you to reach for ${title}?`,
          "What 4 steps belong on your card?",
          "What’s your one-line recovery if you freeze?",
        ],
        patterns: [
          { tag: "trigger", desc: `When ${title} is the right tool` },
          {
            tag: "steps",
            desc: sheet
              .slice(0, 3)
              .map((c) => c.tag)
              .join(" → ") || "clarify → approach → verify",
          },
          {
            tag: "recovery",
            desc: "One sentence to regain structure if you blank",
          },
        ],
        dos: [
          "Write triggers, not only solutions",
          "Keep an example you can redraw fast",
          bp[0] ?? "Include a complexity reminder",
        ],
        donts: [
          "Paste a novel — keep it scannable",
          "Omitting recovery language",
          miss[0] ?? "Generic advice with no topic hooks",
        ],
        talkTrack: `“My ${title} card: Trigger … Steps ${primary.tag} → ${secondary.tag} → ${tertiary.tag}. Example … If I blank: ‘Let me restate constraints and restart from ${primary.tag}.’”`,
      } satisfies PrepDrillGuide,
    },
  };
}

function systemsDrills(topic: TopicLike) {
  const title = topic.title;
  const sheet = topic.cheatSheet;
  const q = topic.interviewQuestions;
  const bp = topic.bestPractices;
  const miss = topic.commonMistakes;
  const sents = sentences(topic.explanation);
  const primary = pick(sheet, 0, { tag: "requirements", desc: topic.summary });
  const secondary = pick(sheet, 1, {
    tag: "trade-offs",
    desc: "Compare two designs explicitly",
  });
  const tertiary = pick(sheet, 2, {
    tag: "deep dive",
    desc: "Pick the riskiest component and go deep",
  });
  const isBehavioral = /behavior|star|story|leadership|conflict|failure/i.test(
    `${title} ${topic.keywords.join(" ")}`
  );

  if (isBehavioral) {
    return {
      concept: {
        title: `Frame ${title}`,
        difficulty: "easy" as LearnDifficulty,
        minutes: 8,
        kind: "build" as const,
        scenario: sents.slice(0, 2).join(" ") || topic.summary,
        task: `Learn how ${title} is evaluated and what a strong story sounds like.`,
        hints: ["Lead with outcome, then context", "Use ‘I’ ownership", "Keep stories under 2 minutes"],
        takeaways: [topic.summary, "Behavioral rounds reward ownership + results"],
        acceptanceCriteria: [
          "Can name what interviewers listen for",
          "Has one story outline ready",
          "Uses ownership language",
        ],
        prep: {
          briefing: `${sents[0] ?? topic.summary} Behavioral interviews test judgment under ambiguity. Students: memorize STAR labels. Advanced: prepare a story bank mapped to leadership principles, not one generic tale.`,
          prompts: [
            q[0] ?? `What is ${title} trying to measure?`,
            "What makes a story sound senior vs junior?",
            "How do you avoid ‘we did everything’ language?",
          ],
          patterns: [
            { tag: "S", desc: "Situation in 1–2 sentences" },
            { tag: "T/A", desc: "Your task and concrete actions" },
            { tag: "R", desc: "Result with a metric or clear outcome" },
          ],
          dos: ["Use I/my for actions", "Quantify results when possible", bp[0] ?? "End with a lesson"],
          donts: [miss[0] ?? "Vague ‘we shipped it’", "No conflict or decision in the story", "Rambling past two minutes"],
          talkTrack: `“Situation: … My task: … Actions I took: … Result: … What I’d repeat: …”`,
        } satisfies PrepDrillGuide,
      },
      build: {
        title: `STAR drill: ${primary.tag}`,
        difficulty: "easy" as LearnDifficulty,
        minutes: 10,
        kind: "build" as const,
        scenario: `Practice the ${primary.tag} beat of a ${title} story until it’s crisp.`,
        task: `Deliver only the ${primary.tag} portion with enough detail to be credible.`,
        hints: [`Keep ${primary.tag} tight`, secondary.desc, "No skipping to the ending yet"],
        takeaways: [`Strong ${primary.tag} sets up the rest of STAR`, bp[0] ?? "Specifics beat adjectives"],
        acceptanceCriteria: [
          `${primary.tag} is concrete`,
          "No team-wash language",
          "Sets up the next STAR beat",
        ],
        prep: {
          briefing: `Micro-drill on ${primary.tag} for ${title}. ${primary.desc}. Students: write 3 variants. Advanced: prepare a high-stakes and a low-stakes variant of the same skill.`,
          prompts: [
            `Give me only the ${primary.tag} for your best ${title} story.`,
            "What detail makes it believable?",
            "What would you cut if you had 15 seconds?",
          ],
          patterns: [
            { tag: primary.tag, desc: primary.desc },
            { tag: "specificity", desc: "Names, numbers, constraints" },
            { tag: "ownership", desc: "Your decisions, not the team’s vibe" },
          ],
          dos: ["Name your role", "Include a constraint or conflict seed", bp[1] ?? "Keep it vivid but short"],
          donts: [miss[0] ?? "Starting mid-action with no context", "Hiding behind ‘we’", "Over-explaining org charts"],
          talkTrack: `“For ${primary.tag}: … Constraint: … Why it mattered: …”`,
        } satisfies PrepDrillGuide,
      },
      fix: {
        title: `Fix a flat ${title} story`,
        difficulty: "medium" as LearnDifficulty,
        minutes: 12,
        kind: "fix" as const,
        scenario: `A flat story for ${title} has no stakes. Typical issues: ${miss.slice(0, 2).join("; ") || "no ownership and no result"}.`,
        task: `Rewrite the story so stakes, actions, and results are unmistakable.`,
        hints: [miss[0] ?? "Add conflict", "Insert your decisions", "End with a measurable result"],
        takeaways: ["Stakes make stories memorable", bp[0] ?? "Results close the loop"],
        acceptanceCriteria: [
          "Stakes are clear",
          "Actions are owned",
          "Result is concrete",
        ],
        prep: {
          briefing: `Story repair for ${title}. Flattened stories lose jobs. Diagnose missing stakes/actions/results, then rebuild. Advanced: also map the story to two different interview questions without lying.`,
          prompts: [
            "What stake was missing?",
            "Which action is uniquely yours?",
            "What’s the result in one number or clear outcome?",
          ],
          patterns: [
            { tag: "stakes", desc: "What breaks if you fail" },
            { tag: "decision", desc: "A choice you made under pressure" },
            { tag: "result", desc: "Metric or irreversible outcome" },
          ],
          dos: ["Put the conflict early", "List 2–3 concrete actions", "Close with result + lesson"],
          donts: [miss[0] ?? "Hero-team narrative with no ‘I’", "No ending", "Blaming others as the plot"],
          talkTrack: `“Stakes: … I decided … I did … Result: … Lesson: …”`,
        } satisfies PrepDrillGuide,
      },
      practice: {
        title: `Full behavioral mock: ${title}`,
        difficulty: "medium" as LearnDifficulty,
        minutes: 14,
        kind: "layout" as const,
        scenario: `Run a complete ${title} answer as a timed mock.`,
        task: `Speak a full STAR story and stop cleanly under two minutes.`,
        hints: ["Timer on", "No notes after the first 10 seconds", "End with lesson"],
        takeaways: ["Timing is part of the skill", "Clean endings matter"],
        acceptanceCriteria: [
          "Full STAR under ~2 minutes",
          "Owned actions",
          "Clear result",
        ],
        prep: {
          briefing: `Live mock for ${title}. Students: follow STAR in order. Advanced: answer a follow-up (‘What would you do differently?’) without collapsing the story.`,
          prompts: [
            q[0] ?? `Tell me about a time related to ${title}.`,
            "What would you do differently?",
            "What did you learn that you still use?",
          ],
          patterns: [
            { tag: "STAR", desc: "Situation → Task → Action → Result" },
            { tag: "follow-up", desc: "Prepare the ‘differently’ answer" },
            { tag: "signal", desc: "Judgment + ownership + impact" },
          ],
          dos: [bp[0] ?? "Lead with impact", "Keep actions concrete", "Invite a follow-up"],
          donts: [miss[0] ?? "Story with no decision", "Going over time", "Ending mid-thought"],
          talkTrack: `“Situation… Task… Actions… Result… If I did it again…”`,
        } satisfies PrepDrillGuide,
      },
      interview: {
        title: `Hard behavioral: ${clip(q[0] ?? title, 64)}`,
        difficulty: "hard" as LearnDifficulty,
        minutes: 16,
        kind: "interview" as const,
        scenario: q[0] ?? `Hard behavioral probe on ${title}.`,
        task: `Answer with seniority: ambiguity, trade-offs, and self-critique.`,
        hints: [q[1] ?? "Show judgment under incomplete data", q[2] ?? "Include a miss and recovery", "Close with lasting principle"],
        takeaways: ["Self-critique signals maturity", "Principles transfer across companies"],
        acceptanceCriteria: [
          "Handles the hard prompt",
          "Shows judgment + ownership",
          "Includes reflection",
        ],
        prep: {
          briefing: `Bar-raiser behavioral on ${title}. ${q[0] ?? ""}. Students: still use STAR. Advanced: explicitly discuss competing priorities and the principle you’d reuse.`,
          prompts: [
            q[0] ?? `Give your hardest ${title} story.`,
            q[1] ?? "What competing priority did you reject?",
            q[2] ?? "What principle did you take forward?",
          ],
          patterns: [
            { tag: "ambiguity", desc: "What you didn’t know yet" },
            { tag: "trade-off", desc: "What you sacrificed and why" },
            { tag: "principle", desc: "Reusable rule after the story" },
          ],
          dos: ["Name the hard choice", "Own a mistake or limit", "Extract a principle"],
          donts: [miss[0] ?? "Perfect-hero stories", "No trade-off", "Blaming the system only"],
          talkTrack: `“Hard part: … I chose … over … because … Result… Principle I still use…”`,
        } satisfies PrepDrillGuide,
      },
      project: {
        title: `Story bank for ${title}`,
        difficulty: "hard" as LearnDifficulty,
        minutes: 18,
        kind: "project" as const,
        scenario: `Build a mini story bank you can remap to multiple ${title} prompts.`,
        task: `Create 3 story seeds with stakes, actions, results, and remap tags.`,
        hints: ["Diversity of stakes", "One leadership, one conflict, one failure", "Tags for quick recall"],
        takeaways: ["Banks beat single stories", "Remapping is an interview skill"],
        acceptanceCriteria: [
          "3 distinct seeds",
          "Each has stakes/actions/result",
          "Tagged for reuse",
        ],
        prep: {
          briefing: `Build assets for ${title}. Students: 3 seeds is enough. Advanced: map each seed to 2+ question types (conflict, leadership, failure, influence).`,
          prompts: [
            "What are your 3 seed titles?",
            "Which seed covers failure recovery?",
            "Which prompt types can each seed answer?",
          ],
          patterns: [
            { tag: "seed", desc: "Title + stakes in one line" },
            { tag: "remap", desc: "Question types this seed can cover" },
            { tag: "proof", desc: "Metric or artifact you can cite" },
          ],
          dos: ["Diversify stakes", "Keep proof nearby", "Practice remapping out loud"],
          donts: ["Three near-identical stories", "No failure seed", "Seeds you can’t remember under stress"],
          talkTrack: `“Seed A: … covers … Seed B: … Seed C: … If asked X, I remap seed …”`,
        } satisfies PrepDrillGuide,
      },
    };
  }

  // System design (non-behavioral)
  return {
    concept: {
      title: `Understand ${title}`,
      difficulty: "easy" as LearnDifficulty,
      minutes: 8,
      kind: "build" as const,
      scenario: sents.slice(0, 2).join(" ") || topic.summary,
      task: `Explain ${title} as an architecture building block with when-to-use guidance.`,
      hints: [`Define ${title} simply`, `Say when you’d use ${primary.tag}`, "Name one misuse"],
      takeaways: [topic.summary, "Design vocabulary unlocks deeper interviews"],
      acceptanceCriteria: [
        "Clear definition",
        "When-to-use stated",
        "One misuse called out",
      ],
      prep: {
        briefing: `${sents[0] ?? topic.summary} Students: learn the definition and placement in a diagram. Advanced: explain failure modes and the operational cost of choosing this building block.`,
        prompts: [
          q[0] ?? `What is ${title} responsible for?`,
          `When is ${title} the wrong tool?`,
          `What breaks first if ${title} is mis-sized?`,
        ],
        patterns: [
          { tag: "role", desc: `What ${title} owns in a system` },
          { tag: primary.tag, desc: primary.desc },
          { tag: "misuse", desc: "Common over-application" },
        ],
        dos: [
          `Define ${title} in one sentence`,
          `Connect to ${primary.tag}`,
          "Mention a real product-shaped example",
        ],
        donts: [
          miss[0] ?? "Buzzwords with no diagram intent",
          "Claiming it solves every scale problem",
          "Ignoring operational cost",
        ],
        talkTrack: `“${title} is … We reach for it when … Example … I’d avoid it when … because …”`,
      } satisfies PrepDrillGuide,
    },
    build: {
      title: `Practice ${primary.tag}`,
      difficulty: "easy" as LearnDifficulty,
      minutes: 10,
      kind: "build" as const,
      scenario: `Skill focus inside ${title}: ${primary.tag} — ${primary.desc}.`,
      task: `Run a spoken drill that only exercises ${primary.tag} for a sample system.`,
      hints: [primary.desc, secondary.desc, "Stay scoped — don’t boil the ocean"],
      takeaways: [`${primary.tag} is a reusable interview move`, bp[0] ?? "Scope before scale"],
      acceptanceCriteria: [
        `${primary.tag} demonstrated`,
        "Scope stays tight",
        "Example is concrete",
      ],
      prep: {
        briefing: `Scoped drill on ${primary.tag} within ${title}. Students: practice the questions you’d ask. Advanced: quantify assumptions (QPS, payload size) even in this micro-drill.`,
        prompts: [
          `Show ${primary.tag} for a URL shortener / feed / chat (pick one).`,
          "Which numbers did you assume?",
          "What did you explicitly defer?",
        ],
        patterns: [
          { tag: primary.tag, desc: primary.desc },
          { tag: "assumptions", desc: "State numbers out loud" },
          { tag: "defer", desc: "What you’ll design later" },
        ],
        dos: ["Ask clarifying questions", "State assumptions", bp[1] ?? "Draw a simple boundary"],
        donts: [miss[0] ?? "Jumping to microservices", "Inventing requirements silently", "Designing five components at once"],
        talkTrack: `“For ${primary.tag}: requirements I confirm … Assumptions … Boundary … Deferred …”`,
      } satisfies PrepDrillGuide,
    },
    fix: {
      title: `Fix a vague ${title} design`,
      difficulty: "medium" as LearnDifficulty,
      minutes: 12,
      kind: "fix" as const,
      scenario: `A vague ${title} answer skipped structure. Issues: ${miss.slice(0, 2).join("; ") || "no requirements and no bottlenecks"}.`,
      task: `Repair the design narrative into something an interviewer can follow and stress-test.`,
      hints: [miss[0] ?? "Start from requirements", `Re-center on ${primary.tag}`, "Call out the bottleneck"],
      takeaways: ["Vague boxes fail interviews", bp[0] ?? "Bottlenecks prove depth"],
      acceptanceCriteria: [
        "Failure mode named",
        "Repaired structure is followable",
        "Bottleneck or trade-off included",
      ],
      prep: {
        briefing: `Design repair for ${title}. Vague diagrams hide weak thinking. Students: re-add requirements → API → data → scale. Advanced: also fix consistency and failure-domain talk.`,
        prompts: [
          "What made the original design un-reviewable?",
          "Which requirement was never stated?",
          "Where is the first bottleneck after repair?",
        ],
        patterns: [
          { tag: "requirements", desc: "Functional + non-functional" },
          { tag: "core path", desc: "Happy-path data flow" },
          { tag: "bottleneck", desc: "What melts first under load" },
        ],
        dos: ["Restate goals", `Apply ${primary.tag}`, "Name one bottleneck"],
        donts: [miss[0] ?? "Boxes with no arrows", "Scaling theater", "Ignoring data model"],
        talkTrack: `“Broken answer skipped … Repaired: requirements … core design … bottleneck … mitigation …”`,
      } satisfies PrepDrillGuide,
    },
    practice: {
      title: `Mock design: ${title}`,
      difficulty: "medium" as LearnDifficulty,
      minutes: 15,
      kind: "layout" as const,
      scenario: `Timed mock centered on ${title} in a larger system conversation.`,
      task: `Run a 10–12 minute design pass that features ${title} correctly and deeply.`,
      hints: ["Requirements first", "Simple core, then deepen", tertiary.desc],
      takeaways: ["Time-boxed design is a skill", "Depth beats breadth"],
      acceptanceCriteria: [
        "Requirements captured",
        `${title} placed correctly`,
        "One deep dive completed",
      ],
      prep: {
        briefing: `Mock loop for ${title}. Students: follow requirements → API → data → ${title} → deep dive. Advanced: drive the agenda; ask the interviewer which non-functional matters most.`,
        prompts: [
          `Design a system where ${title} is central.`,
          "Which component do you deep-dive and why?",
          "How do you handle the top failure mode?",
        ],
        patterns: [
          { tag: "agenda", desc: "Announce your plan for the next 10 minutes" },
          { tag: secondary.tag, desc: secondary.desc },
          { tag: tertiary.tag, desc: tertiary.desc },
        ],
        dos: [bp[0] ?? "Start simple", "Pick one deep dive", "Talk failure modes"],
        donts: [miss[0] ?? "Boiling the ocean", "No numbers", "Deep-diving a boring leaf node"],
        talkTrack: `“Agenda: … Requirements: … Core: … ${title} here because … Deep dive: … Failures: …”`,
      } satisfies PrepDrillGuide,
    },
    interview: {
      title: `Hard design: ${clip(q[0] ?? title, 64)}`,
      difficulty: "hard" as LearnDifficulty,
      minutes: 18,
      kind: "interview" as const,
      scenario: q[0] ?? `Hard system design prompt involving ${title}.`,
      task: `Defend choices with trade-offs, consistency, and rollout thinking.`,
      hints: [q[1] ?? "Compare alternatives", q[2] ?? "Discuss consistency/latency", "Include rollout/rollback"],
      takeaways: ["Trade-offs are the interview", "Operations are part of design"],
      acceptanceCriteria: [
        "Answers the hard prompt",
        "Trade-offs explicit",
        "Risk + rollout mentioned",
      ],
      prep: {
        briefing: `Senior design pressure on ${title}. ${q[0] ?? ""}. Students: still structure the answer. Advanced: discuss multi-region, consistency model, and how you’d ship safely.`,
        prompts: [
          q[0] ?? `How would you design around ${title} at 10× traffic?`,
          q[1] ?? "What alternative did you reject?",
          q[2] ?? "How do you roll this out without downtime?",
        ],
        patterns: [
          { tag: "trade-off", desc: "Latency vs consistency vs cost" },
          { tag: "scale", desc: "What changes at 10×" },
          { tag: "rollout", desc: "Canary / feature flag / rollback" },
        ],
        dos: ["Decide, don’t only list options", "Quantify when possible", "Own operational risk"],
        donts: [miss[0] ?? "Endless option soup", "No rollback story", "Ignoring data correctness"],
        talkTrack: `“Decision: … because … Rejected … Scale plan … Risk … Rollout/rollback …”`,
      } satisfies PrepDrillGuide,
    },
    project: {
      title: `Design one-pager: ${title}`,
      difficulty: "hard" as LearnDifficulty,
      minutes: 18,
      kind: "project" as const,
      scenario: `Produce a durable one-pager for ${title} you can reuse in mocks.`,
      task: `Capture triggers, default design, deep-dive targets, and failure checklist.`,
      hints: ["Keep it one page", "Include numbers templates", "Failure checklist"],
      takeaways: ["Reusable design notes compound", "Failure checklists win follow-ups"],
      acceptanceCriteria: [
        "One-pager structure complete",
        "Includes failure checklist",
        "Reusable in a new prompt",
      ],
      prep: {
        briefing: `Asset build for ${title}. Students: fill templates. Advanced: add SLOs and capacity formulas you can reuse across prompts.`,
        prompts: [
          `When do you reach for ${title}?`,
          "What’s your default diagram?",
          "What’s on your failure checklist?",
        ],
        patterns: [
          { tag: "trigger", desc: `When ${title} belongs in the design` },
          { tag: "default", desc: "Starter diagram + API/data notes" },
          { tag: "failures", desc: "Top 3 things that break" },
        ],
        dos: ["Write triggers", "Keep a default shape", "List failures + mitigations"],
        donts: ["Novel-length notes", "No numbers hooks", "Copying a blog without understanding"],
        talkTrack: `“Trigger… Default design… Deep dive candidates… Failures & mitigations…”`,
      } satisfies PrepDrillGuide,
    },
  };
}

export type CodingDrillKey =
  | "concept"
  | "build"
  | "fix"
  | "practice"
  | "interview"
  | "project";

export function buildInterviewPrepDrills(topic: InterviewTopicDef) {
  return codingDrills(topic);
}

export function buildSystemsPrepDrills(topic: SystemsTopicDef) {
  return systemsDrills(topic);
}

export function challengeLimitFromWeight(weight: number): number {
  return Math.min(5, Math.max(3, weight));
}

export function pickPrepDrillKeys(
  weight: number,
  preferProject: boolean
): CodingDrillKey[] {
  const limit = challengeLimitFromWeight(weight);
  const hard: CodingDrillKey = preferProject ? "project" : "interview";
  if (limit <= 3) return ["concept", "fix", hard];
  if (limit === 4) return ["concept", "build", "fix", hard];
  return ["concept", "build", "fix", "practice", hard];
}
