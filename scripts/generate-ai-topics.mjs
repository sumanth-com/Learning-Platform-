import fs from "fs";
import path from "path";

const WEEKS_DIR = "src/curriculum/weeks";
const OUT_DIR = "src/curriculum/ai-topics";

const WEEK_CONTEXT = {
  1: "learning Java fundamentals and how to use AI as a study partner",
  2: "writing better prompts while practicing control flow and loops in Java",
  3: "using AI to review OOP code quality, naming, and class design",
  4: "debugging Java exceptions and stack traces with AI assistance",
  5: "optimizing Java code and understanding time/space complexity with AI",
  6: "working with Java Streams, lambdas, and functional-style code with AI",
  7: "generating and optimizing SQL queries and JDBC code with AI",
  8: "calling AI APIs from Java and handling JSON request/response structures",
  9: "securing AI integrations with API keys, env vars, and prompt injection awareness",
  10: "building production AI API integrations with Swagger, Postman, and testing",
  11: "designing databases, MongoDB queries, and Hibernate with AI assistance",
};

function buildDetail(weekNum, title) {
  const ctx = WEEK_CONTEXT[weekNum] ?? "using AI effectively in your Java backend journey";
  const lower = title.toLowerCase();

  let answer = `${title} is a core concept for ${ctx}. `;
  let realWorld = "";

  if (lower.includes("what is")) {
    answer += `Understanding this definition helps you use AI tools intentionally instead of treating them as magic. When you know exactly what ${title.replace(/^What is /i, "").replace(/\?$/, "")} means, you can ask clearer questions, spot incorrect AI output, and explain your workflow in interviews.`;
    realWorld = `While working on Week ${weekNum} assignments, read the matching Practice Exercise on this page, then write a small Java example in your IDE that demonstrates "${title.replace("?", "")}". Compare your output with the explanation here — that is how you verify understanding.`;
  } else if (lower.includes("limitation")) {
    answer += `AI is powerful but not infallible. Knowing where it struggles — outdated knowledge, invented APIs, or shallow reasoning — prevents you from shipping broken code. Always treat AI output as a draft that you must compile, run, and review yourself.`;
    realWorld = `Ask AI to fix a bug in your Week ${weekNum} project, then deliberately introduce a wrong suggestion (e.g., a non-existent Java method). Notice how confidently it can be wrong — that is why you always run tests before committing.`;
  } else if (lower.includes("debug") || lower.includes("stack trace") || lower.includes("exception")) {
    answer += `When Java throws an error, AI can help translate stack traces into plain English and suggest fixes — but only if you paste the full error, relevant code, and what you expected. This skill saves hours during real development and interviews where you must explain failures calmly.`;
    realWorld = `Use the debugging exercise on this page for your Week ${weekNum} project. When your program throws an error, read the stack trace bottom-up, find your line number, apply the fix from the lesson, and re-run until it passes.`;
  } else if (lower.includes("prompt") || lower.includes("context") || lower.includes("constraint")) {
    answer += `Effective prompts include role, context, task, format, and constraints. Vague prompts produce vague code. As a Java developer, structure prompts like mini specifications: input types, edge cases, expected output, and style rules (e.g., use meaningful variable names, no static abuse).`;
    realWorld = `Instead of "write a Java program," try: "Write a Java method that takes an int[] and returns the second-largest element. Handle duplicates and empty arrays. Include 3 JUnit test ideas." Use this in Week ${weekNum} exercises and save the prompt in your notes.`;
  } else if (lower.includes("sql") || lower.includes("database") || lower.includes("jdbc") || lower.includes("mongodb") || lower.includes("hibernate")) {
    answer += `AI can draft queries and schema ideas quickly, but you must validate them against your actual tables, indexes, and ORM mappings. Never run AI-generated SQL on production without reviewing execution plans and parameter binding.`;
    realWorld = `Describe your Week ${weekNum} ER diagram to AI and ask for a JOIN query with parameterized placeholders. Run it in your local DB, check EXPLAIN output, and fix any full table scans the AI missed.`;
  } else if (lower.includes("api") || lower.includes("json") || lower.includes("swagger") || lower.includes("postman")) {
    answer += `Integrating AI into Java backends means handling HTTP, JSON serialization, timeouts, and error responses like any external service. Treat AI APIs as third-party dependencies: version them, log failures, and never expose keys in source code.`;
    realWorld = `Build a small Java class that calls an AI API using HttpClient or RestTemplate. Log the raw JSON response, map it to a POJO with Jackson, and handle 429 rate-limit errors — exactly what Week ${weekNum} prepares you for.`;
  } else if (lower.includes("security") || lower.includes("authentication") || lower.includes("secret") || lower.includes("injection")) {
    answer += `Security with AI means protecting credentials, sanitizing user input before it reaches prompts, and validating model output before it reaches users or databases. Prompt injection can trick models into ignoring your instructions — design defenses at the application layer.`;
    realWorld = `Store your API key in an environment variable, never commit it to GitHub. In Week ${weekNum}, test what happens when user input contains "ignore previous instructions" — and document how your app should strip or reject such patterns.`;
  } else if (lower.includes("test") || lower.includes("review") || lower.includes("refactor") || lower.includes("documentation")) {
    answer += `AI accelerates repetitive engineering tasks: generating test cases, suggesting refactors, and drafting Javadoc. The engineer still owns correctness — review every suggestion against requirements, coding standards, and existing tests before merging.`;
    realWorld = `Paste a 30-line Java method from your Week ${weekNum} project and ask AI for edge-case unit tests and a cleaner refactor. Run the tests locally; keep changes only if they pass and improve readability without changing behavior.`;
  } else if (lower.includes("optim") || lower.includes("performance") || lower.includes("complexity") || lower.includes("stream") || lower.includes("lambda")) {
    answer += `Performance work starts with measurement, not guesses. AI can suggest algorithmic improvements or Stream pipelines, but you should verify with profiling and Big-O reasoning. Faster code that is wrong is still wrong.`;
    realWorld = `Share a nested-loop solution from Week ${weekNum} with AI and ask for a Stream-based or HashMap-based alternative with time complexity notes. Benchmark both on a large input in your IDE and record which is actually faster.`;
  } else {
    answer += `Mastering "${title}" makes you a stronger Java developer who uses AI as a multiplier, not a crutch. Connect every concept to code you write, compile, and test — that is how knowledge sticks for interviews and real jobs.`;
    realWorld = `During Week ${weekNum}, pick the related Practice Exercise on this page, implement the solution in your IDE, and mark the topic complete only after you can explain it aloud in your own words.`;
  }

  return { answer, realWorld };
}

// Hand-crafted Week 1 — richer intro content
const WEEK1_OVERRIDES = {
  "ai-t1": {
    answer:
      "Artificial Intelligence (AI) is the field of building systems that perform tasks requiring human-like intelligence — recognizing patterns, making decisions, understanding language, or generating content. Modern AI in software development mostly means machine learning models trained on huge datasets, not rule-based if-else programs. For you as a Java learner, AI is a tool that can explain concepts, suggest code, and review your work — but it does not replace understanding fundamentals.",
    realWorld:
      "When learning variables and loops in Java, read the for-loop explanation on this page — like counting items in a shopping cart. Then type and run the example in your IDE yourself. Understanding sticks when you write the code, not just read it.",
  },
  "ai-t2": {
    answer:
      "Generative AI creates new content — text, code, images — from patterns learned during training. ChatGPT, Claude, and Gemini are generative models: you send a prompt, they generate a response token by token. Unlike a search engine that finds existing pages, generative AI produces novel output that may be correct, partially correct, or completely fabricated.",
    realWorld:
      "The Practice Exercises section here shows a Java grade calculator example. Study it, run it in your IDE, and fix edge cases like empty input. You learn more by debugging than by only reading the answer.",
  },
  "ai-t3": {
    answer:
      "A Large Language Model (LLM) is a neural network trained on massive text/code datasets to predict the next token in a sequence. That simple mechanism, scaled up, produces fluent answers, code, and explanations. LLMs don't 'know' facts like a database — they estimate statistically likely continuations based on training data, which is why verification matters.",
    realWorld:
      "When you ask Copilot to autocomplete a Java method, it is an LLM predicting likely code based on your file context and millions of open-source examples. Sometimes it nails your style; sometimes it hallucinates a method that doesn't exist on String.",
  },
  "ai-t4": {
    answer:
      "A prompt is the input you give an AI model — your question, instruction, or context. The quality of the prompt directly shapes the quality of the response. Prompts can be one line ('What is polymorphism?') or structured briefs with role, constraints, and examples. Think of a prompt as a specification document for the AI.",
    realWorld:
      "Bad prompt: 'Java arrays.' Good prompt: 'Explain Java arrays to a beginner who knows variables. Include declaration, initialization, and a loop example. Keep it under 150 words.' The second prompt gives you a focused lesson you can use while studying Week 1 topics.",
  },
  "ai-t5": {
    answer:
      "A good prompt is specific, contextual, and constrained. Include: (1) your goal, (2) relevant background, (3) desired format, (4) boundaries ('don't use advanced topics I haven't learned'), and (5) examples if needed. Good prompts reduce vague or overly advanced answers and make AI feel like a patient tutor instead of a random search result.",
    realWorld:
      "While learning if-else, prompt: 'I'm a Week 1 Java student. Write one if-else example for grading (A/B/C/F) using only int scores and println. Add comments explaining each branch.' You get teachable code aligned with your level.",
  },
  "ai-t6": {
    answer:
      "Hallucination is when an AI confidently states false information — fake citations, invented Java methods, or incorrect syntax presented as fact. LLMs optimize for plausible text, not verified truth. Hallucinations are more common for niche APIs, recent events, or precise numeric facts.",
    realWorld:
      "You ask AI for the signature of a Java 21 method it doesn't know well. It might invent `String.reverse()` (which doesn't exist on String). Always check the official JDK docs or compile the code — never trust generated APIs blindly.",
  },
  "ai-t7": {
    answer:
      "AI gives wrong answers because: (1) training data has errors or gaps, (2) the model generalizes incorrectly, (3) your prompt was ambiguous, (4) the question needs real-time or private data the model lacks, or (5) it optimizes for sounding confident over being correct. Understanding this keeps you skeptical and professional.",
    realWorld:
      "AI suggests using `==` to compare two String names in Java. You remember from class that `equals()` is correct for content comparison. You fix the suggestion, add a test, and learn why — the AI mistake actually reinforced your understanding.",
  },
  "ai-t8": {
    answer:
      "AI ethics covers responsible use: privacy (don't paste confidential code or PII into public tools), bias (models reflect biased training data), attribution (know when AI-generated work needs disclosure), environmental cost, and job impact. As a developer, ethics means choosing when AI helps users vs. when it could harm them.",
    realWorld:
      "Before sharing code online for help, ask: is this allowed by policy? Could customer data leak? Ethical developers protect sensitive data and only use approved learning platforms like this one for coursework.",
  },
  "ai-t9": {
    answer:
      "Trust AI when: the task is explanatory (concepts, analogies), the output is easy to verify (small code snippets you can compile), you're brainstorming alternatives, or you need a first draft to refine. Cross-check important facts with docs, textbooks, or your mentor. Trust but verify.",
    realWorld:
      "You trust AI to explain the difference between `int` and `double` because you can confirm it against your Week 1 notes and a quick main() experiment. You don't trust it blindly for your final exam answers without studying yourself.",
  },
  "ai-t10": {
    answer:
      "Do not trust AI alone for: production security decisions, legal/compliance advice, unverified medical or financial guidance, copying homework without understanding, or deploying code you haven't tested. Also be cautious with rare libraries, exact version-specific APIs, and math-heavy proofs — error rates rise.",
    realWorld:
      "AI generates a password-storage snippet using MD5. You know (or look up) that bcrypt or Argon2 is required for real apps. You reject the suggestion — that's professional judgment AI cannot replace.",
  },
};

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const allContent = {};

for (let i = 1; i <= 11; i++) {
  const week = JSON.parse(fs.readFileSync(path.join(WEEKS_DIR, `week-${i}.json`), "utf8"));
  const topics = week.aiSkill.learningTopics;
  const weekContent = {};

  for (const t of topics) {
    const override = i === 1 ? WEEK1_OVERRIDES[t.id] : null;
    weekContent[t.id] = override ?? buildDetail(i, t.title);
    allContent[t.id] = { title: t.title, ...weekContent[t.id] };
  }

  fs.writeFileSync(
    path.join(OUT_DIR, `week-${i}.json`),
    JSON.stringify(weekContent, null, 2) + "\n"
  );
}

fs.writeFileSync(path.join(OUT_DIR, "all.json"), JSON.stringify(allContent, null, 2) + "\n");
console.log(`Generated ${Object.keys(allContent).length} AI topic entries`);
