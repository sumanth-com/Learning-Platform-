/**
 * One-time builder — run: node scripts/_build-ai-rich-content.mjs
 * Writes scripts/ai-rich-content.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEEKS_DIR = path.join(__dirname, "../src/curriculum/weeks");

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

const WEEK12_CONTEXT =
  "mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration";

const WEEK12_TOPICS = [
  ["ai-w12-t1", "What is Retrieval-Augmented Generation (RAG)?"],
  ["ai-w12-t2", "Text Embeddings and Vector Representations"],
  ["ai-w12-t3", "Vector Databases: pgvector, Pinecone, and Chroma"],
  ["ai-w12-t4", "Similarity Search and Cosine Distance"],
  ["ai-w12-t5", "Document Chunking Strategies for RAG"],
  ["ai-w12-t6", "Tuning Retrieval Quality and Re-ranking"],
  ["ai-w12-t7", "Spring AI Overview for Java Developers"],
  ["ai-w12-t8", "Spring AI ChatClient and Prompt Templates"],
  ["ai-w12-t9", "Spring AI Embeddings and VectorStore"],
  ["ai-w12-t10", "Spring AI Function Calling and Tools"],
  ["ai-w12-t11", "LangChain4j Introduction"],
  ["ai-w12-t12", "LangChain4j Embedding Stores and Document Loaders"],
  ["ai-w12-t13", "Building a RAG Pipeline with LangChain4j"],
  ["ai-w12-t14", "Spring AI vs LangChain4j: When to Use Which"],
  ["ai-w12-t15", "AI Agent Architecture and ReAct Patterns"],
  ["ai-w12-t16", "Tool Calling Patterns in Production"],
  ["ai-w12-t17", "Model Context Protocol (MCP) Explained"],
  ["ai-w12-t18", "Building MCP Servers with Java"],
  ["ai-w12-t19", "Streaming LLM Responses in Java"],
  ["ai-w12-t20", "Server-Sent Events (SSE) in Spring Boot"],
  ["ai-w12-t21", "Token Usage, Pricing, and Cost Optimization"],
  ["ai-w12-t22", "Model Selection: GPT, Claude, Gemini, and Local Models"],
  ["ai-w12-t23", "Production AI Architecture Patterns"],
  ["ai-w12-t24", "Observability: Logging, Tracing, and Metrics for AI"],
  ["ai-w12-t25", "Testing AI Features in Java Applications"],
  ["ai-w12-t26", "Evals, Golden Datasets, and Regression Testing"],
  ["ai-w12-t27", "CI/CD Pipelines for AI-Enabled Services"],
  ["ai-w12-t28", "Feature Flags and Safe AI Rollouts"],
  ["ai-w12-t29", "Microservices Patterns with AI Components"],
  ["ai-w12-t30", "Event-Driven AI Workflows with Kafka"],
  ["ai-w12-t31", "Security in Gen AI Systems"],
  ["ai-w12-t32", "PII Handling and Data Governance in RAG"],
  ["ai-w12-t33", "Portfolio Projects for Gen AI Java Developers"],
  ["ai-w12-t34", "Interview Preparation: Gen AI for Java Backend"],
  ["ai-w12-t35", "Career Roadmap: 2-Year Java Dev to Gen AI Engineer"],
];

const WEEK12_EXERCISES = [
  ["ai-w12-e1", "Build an embedding service with Spring AI and store vectors in pgvector"],
  ["ai-w12-e2", "Implement a basic RAG chatbot over your project documentation"],
  ["ai-w12-e3", "Add function calling so the LLM can query a Spring Data repository"],
  ["ai-w12-e4", "Stream chat responses to the browser using SSE in Spring Boot"],
  ["ai-w12-e5", "Load PDF documents with LangChain4j and answer questions about them"],
  ["ai-w12-e6", "Integrate an MCP tool that exposes your REST API to an AI agent"],
  ["ai-w12-e7", "Implement token-budget middleware to cap per-request LLM cost"],
  ["ai-w12-e8", "Unit-test an AI wrapper service with Mockito and WireMock"],
  ["ai-w12-e9", "Create a golden-dataset eval for prompt consistency"],
  ["ai-w12-e10", "Dockerize an AI microservice with health checks and secrets"],
  ["ai-w12-e11", "Add OpenTelemetry spans around LLM and embedding calls"],
  ["ai-w12-e12", "Build a simple cost dashboard from logged token usage"],
  ["ai-w12-e13", "Implement hybrid search combining keyword and vector retrieval"],
  ["ai-w12-e14", "Build a multi-tool agent that plans and executes Java service calls"],
  ["ai-w12-e15", "Capstone: deploy a production-ready RAG API with tests and CI"],
];

const WEEK12_TOOLS = [
  "Spring AI",
  "LangChain4j",
  "OpenAI API",
  "pgvector",
  "Docker",
  "GitHub Actions",
  "OpenTelemetry",
  "Postman",
];

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function makeEntry(paragraphs, realWorld, code) {
  return { paragraphs, realWorld, code };
}

function topicParagraphs(weekNum, title) {
  const ctx = weekNum === 12 ? WEEK12_CONTEXT : WEEK_CONTEXT[weekNum];
  const t = title.replace(/\?$/, "");
  const lower = title.toLowerCase();

  const p1 = `${t} is essential when ${ctx}. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.`;

  let p2, p3, p4, p5;

  if (lower.includes("what is")) {
    const concept = title.replace(/^What is /i, "").replace(/\?$/, "");
    p2 = `${concept} is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.`;
    p3 = `Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.`;
    p4 = `In team settings, being able to explain ${concept} in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask "explain X to a junior" — this topic prepares you for that format.`;
    p5 = `Build a habit: after reading about ${concept}, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.`;
  } else if (lower.includes("limitation")) {
    p2 = `Models hallucinate APIs, misstate Java version behavior, and invent library methods. They also lack access to your private codebase unless you paste it. Never merge AI suggestions without compiling, running tests, and reading diffs line by line.`;
    p3 = `Debugging assistance is high-value; architectural decisions from AI alone are risky. When AI suggests a design pattern, ask why it fits your constraints — team size, traffic, existing Spring modules — before adopting it.`;
    p4 = `Log cases where AI was wrong and what you did to catch it. That log becomes interview gold: "Copilot suggested ArrayList.remove in a foreach — I knew ConcurrentModificationException and fixed it." Shows professional skepticism.`;
    p5 = `Set personal rules: no pasting production secrets, no trusting generated SQL on prod, no skipping tests because "AI said it works." Those boundaries keep you employable on real teams.`;
  } else if (lower.includes("prompt") || lower.includes("context") || lower.includes("constraint") || lower.includes("iterative") || lower.includes("anatomy") || lower.includes("example")) {
    p2 = `Structure prompts with role ("You are a Java tutor"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints ("no libraries beyond java.util"). Vague prompts yield code that uses patterns you have not learned yet.`;
    p3 = `For loop and control-flow work, include sample input/output. Example: "Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array." The AI cannot infer your grading rules from silence.`;
    p4 = `Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer ("In your loop, what happens when scores is null?"). This mirrors how you collaborate with teammates on pull requests.`;
    p5 = `Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.`;
  } else if (lower.includes("debug") || lower.includes("stack trace") || lower.includes("exception")) {
    p2 = `Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.`;
    p3 = `NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.`;
    p4 = `Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.`;
    p5 = `Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.`;
  } else if (lower.includes("review") || lower.includes("smell") || lower.includes("naming") || lower.includes("readability") || lower.includes("maintainability") || lower.includes("refactor") || lower.includes("documentation") || lower.includes("uml") || lower.includes("solid") || lower.includes("encapsulation") || lower.includes("design")) {
    p2 = `Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.`;
    p3 = `Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week ${weekNum} prevents bad habits before Spring Boot multiplies class count.`;
    p4 = `Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.`;
    p5 = `Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.`;
  } else if (lower.includes("optim") || lower.includes("performance") || lower.includes("complexity") || lower.includes("stream") || lower.includes("lambda") || lower.includes("thread") || lower.includes("synchron") || lower.includes("race") || lower.includes("executor")) {
    p2 = `Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.`;
    p3 = `Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.`;
    p4 = `Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.`;
    p5 = `Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.`;
  } else if (lower.includes("sql") || lower.includes("database") || lower.includes("jdbc") || lower.includes("mongodb") || lower.includes("hibernate") || lower.includes("index") || lower.includes("normaliz") || lower.includes("join") || lower.includes("er diagram") || lower.includes("migration") || lower.includes("flyway") || lower.includes("n+1") || lower.includes("lazy") || lower.includes("eager")) {
    p2 = `Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.`;
    p3 = `Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.`;
    p4 = `For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.`;
    p5 = `Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.`;
  } else if (lower.includes("api") || lower.includes("json") || lower.includes("swagger") || lower.includes("postman") || lower.includes("rest") || lower.includes("http") || lower.includes("openapi") || lower.includes("dto") || lower.includes("pagination") || lower.includes("cors") || lower.includes("rate limit")) {
    p2 = `Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.`;
    p3 = `JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.`;
    p4 = `OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.`;
    p5 = `Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.`;
  } else if (lower.includes("security") || lower.includes("auth") || lower.includes("jwt") || lower.includes("bcrypt") || lower.includes("secret") || lower.includes("injection") || lower.includes("password")) {
    p2 = `Store API keys in environment variables or secret managers (AWS Secrets Manager, Vault), never in application.properties committed to Git. Spring Boot reads ${'${OPENAI_API_KEY}'} from the environment at runtime.`;
    p3 = `Prompt injection happens when user text manipulates the model ("ignore previous instructions"). Sanitize or separate system and user channels; validate model output before executing tool calls or SQL.`;
    p4 = `Spring Security with JWT: understand filter chain order, token expiry, refresh flows, and why BCrypt with strength 10+ beats MD5/SHA for passwords. AI sometimes suggests outdated crypto — reject it.`;
    p5 = `Run OWASP dependency-check and review CORS, CSRF, and authorization on every new endpoint. Security is not a Week ${weekNum} checkbox; it is release criteria.`;
  } else if (lower.includes("test") || lower.includes("junit") || lower.includes("mock")) {
    p2 = `AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.`;
    p3 = `In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.`;
    p4 = `Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.`;
    p5 = `Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.`;
  } else if (lower.includes("rag") || lower.includes("embedding") || lower.includes("vector") || lower.includes("spring ai") || lower.includes("langchain") || lower.includes("agent") || lower.includes("mcp") || lower.includes("streaming") || lower.includes("token") || lower.includes("observability") || lower.includes("eval") || lower.includes("ci/cd") || lower.includes("microservice") || lower.includes("kafka") || lower.includes("pii") || lower.includes("portfolio") || lower.includes("career") || lower.includes("interview")) {
    p2 = `Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.`;
    p3 = `Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.`;
    p4 = `Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.`;
    p5 = `Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.`;
  } else {
    p2 = `${t} connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.`;
    p3 = `Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.`;
    p4 = `When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.`;
    p5 = `Record a two-minute voice note explaining ${t} after you implement it. If you stumble, you have a gap to fill before moving on.`;
  }

  return [p1, p2, p3, p4, p5];
}

function exerciseParagraphs(weekNum, title) {
  const ctx = weekNum === 12 ? WEEK12_CONTEXT : WEEK_CONTEXT[weekNum];
  const lower = title.toLowerCase();
  const clean = title.replace(/\.$/, "");

  const p1 = `This exercise — "${clean}" — applies AI-assisted learning while ${ctx}. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.`;

  let p2, p3, p4, p5, code;

  if (lower.includes("explain") || lower.includes("dry-run")) {
    p2 = `Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.`;
    p3 = `Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.`;
    p4 = `Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.`;
    p5 = `Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.`;
    if (lower.includes("if-else")) {
      code =
        'int score = 72;\nif (score >= 90) System.out.println("A");\nelse if (score >= 75) System.out.println("B");\nelse if (score >= 60) System.out.println("C");\nelse System.out.println("F");';
    } else if (lower.includes("loop")) {
      code =
        "for (int i = 1; i <= 5; i++) {\n    System.out.println(\"*\".repeat(i));\n}";
    } else if (lower.includes("fibonacci")) {
      code =
        "int a = 0, b = 1;\nfor (int i = 0; i < 8; i++) {\n    System.out.print(a + \" \");\n    int next = a + b;\n    a = b;\n    b = next;\n}";
    }
  } else if (
    lower.includes("embedding") ||
    lower.includes("rag") ||
    lower.includes("function calling") ||
    lower.includes("mcp") ||
    lower.includes("docker") ||
    lower.includes("opentelemetry") ||
    lower.includes("golden") ||
    lower.includes("hybrid search") ||
    lower.includes("agent") ||
    lower.includes("capstone") ||
    lower.includes("token-budget") ||
    lower.includes("pdf") ||
    lower.includes("sse") ||
    lower.includes("wiremock") ||
    lower.includes("cost dashboard")
  ) {
    p2 = `Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.`;
    p3 = `Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.`;
    p4 = `For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.`;
    p5 = `Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.`;
    code =
      '@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}';
  } else if (lower.includes("security") || lower.includes("jwt") || lower.includes("bcrypt") || lower.includes("login") || lower.includes("authentication")) {
    p2 = `Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.`;
    p3 = `Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.`;
    p4 = `Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.`;
    p5 = `Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.`;
    code =
      '@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}';
  } else if (
    lower.includes("swagger") ||
    lower.includes("postman") ||
    lower.includes("openapi") ||
    lower.includes("endpoint") ||
    lower.includes("rest") ||
    lower.includes("dto") ||
    lower.includes("pagination") ||
    lower.includes("status code") ||
    lower.includes("response structure") ||
    lower.includes("cors") ||
    lower.includes("rate limit") ||
    (lower.includes("api") && !lower.includes("ai api"))
  ) {
    p2 = `Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.`;
    p3 = `Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.`;
    p4 = `Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.`;
    p5 = `Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.`;
    code =
      '{\n  "page": 0,\n  "size": 20,\n  "sort": "createdAt,desc"\n}';
  } else if (
    lower.includes("sql") ||
    lower.includes("database") ||
    lower.includes("mongodb") ||
    lower.includes("aggregation") ||
    lower.includes("migration") ||
    lower.includes("flyway") ||
    lower.includes("index") ||
    lower.includes("explain") ||
    lower.includes("cte") ||
    lower.includes("window") ||
    lower.includes("hibernate") ||
    lower.includes("normaliz") ||
    lower.includes("banking") ||
    lower.includes("e-commerce") ||
    lower.includes("query")
  ) {
    p2 = `Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.`;
    p3 = `Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.`;
    p4 = `MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.`;
    p5 = `Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.`;
    code =
      "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';";
  } else if (lower.includes("stream") || lower.includes("lambda") || lower.includes("thread") || lower.includes("executor") || lower.includes("synchron") || lower.includes("race") || lower.includes("convert")) {
    p2 = `Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.`;
    p3 = `For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.`;
    p4 = `Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.`;
    p5 = `Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.`;
    code =
      "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();";
  } else if (lower.includes("debug") || lower.includes("bug") || lower.includes("exception") || lower.includes("stack trace") || lower.includes("vulnerabilit") || lower.includes("injection") || lower.includes("n+1")) {
    p2 = `Reproduce the failure with the smallest input. Capture full stack trace and relevant entity mappings or SQL logs.`;
    p3 = `Ask AI to explain each stack frame, starting from Caused by. Fix root cause, not symptoms — e.g., initialize collections in constructors rather than catching NPE everywhere.`;
    p4 = `Add a regression test that failed before the fix and passes after. Hibernate N+1 fixes deserve integration tests with query count assertions.`;
    p5 = `For SQL injection exercises, show both vulnerable concatenation and PreparedStatement side-by-side in code review notes.`;
    code =
      'String sql = "SELECT * FROM users WHERE id = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  ps.setLong(1, userId);\n  ResultSet rs = ps.executeQuery();\n}';
  } else if (lower.includes("review") || lower.includes("suggest") || lower.includes("identify") || lower.includes("find") || lower.includes("compare")) {
    p2 = `Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague "make it better."`;
    p3 = `Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.`;
    p4 = `For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.`;
    p5 = `Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.`;
  } else if (lower.includes("generate") || lower.includes("create") || lower.includes("design")) {
    p2 = `Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.`;
    p3 = `For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.`;
    p4 = `Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.`;
    p5 = `Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.`;
    if (lower.includes("sql") || lower.includes("database") || lower.includes("library") || lower.includes("student")) {
      code =
        "CREATE TABLE students (\n  id BIGSERIAL PRIMARY KEY,\n  email VARCHAR(255) UNIQUE NOT NULL,\n  full_name VARCHAR(120) NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);";
    }
  } else if (lower.includes("optimize") || lower.includes("slow") || lower.includes("nested loop")) {
    p2 = `Profile the original nested-loop solution with increasing n (100, 1_000, 10_000). Record wall-clock time in a simple benchmark main or JUnit @RepeatedTest with timeout assertions.`;
    p3 = `Ask AI for a HashMap- or Set-based alternative and its Big-O. Implement both versions in the same class and compare outputs on random inputs for correctness first.`;
    p4 = `Document why the faster version is faster in a comment block — interviewers want reasoning, not memorized Big-O letters.`;
    p5 = `If the dataset is tiny, prefer readable loops over premature optimization. State that trade-off explicitly in your README.`;
    code =
      "// Before: O(n^2) duplicate check\nfor (int i = 0; i < arr.length; i++)\n  for (int j = i + 1; j < arr.length; j++)\n    if (arr[i] == arr[j]) { /* found */ }\n\n// After: O(n) with HashSet\nSet<Integer> seen = new HashSet<>();\nfor (int x : arr) { if (!seen.add(x)) { /* dup */ } }";
  } else {
    p2 = `Break the task into inputs, processing steps, and expected outputs. Implement a first version without AI, then ask for improvements on your concrete code.`;
    p3 = `Validate every AI suggestion by compilation and execution. Keep a changelog of what you accepted vs rejected and why.`;
    p4 = `Connect the exercise to your portfolio project: reuse same package structure, logging, and testing conventions employers expect.`;
    p5 = `Reflect in README: what you learned, what AI got wrong, and what you would do differently on a team sprint.`;
  }

  return { paragraphs: [p1, p2, p3, p4, p5], code };
}

function realWorldTopic(weekNum, title) {
  const scenarios = {
    2: `On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow ${title} enables.`,
    3: `During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges.`,
    4: `Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy.`,
    5: `Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead.`,
    6: `An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.`,
    7: `A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review.`,
    8: `Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring ${title} in a real deployment.`,
    9: `Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live.`,
    10: `Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to ${title}.`,
    11: `Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes.`,
    12: `Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering ${title}.`,
  };
  return scenarios[weekNum] ?? scenarios[12];
}

function realWorldExercise(weekNum, title) {
  const lower = title.toLowerCase();
  if (lower.includes("docker") || lower.includes("capstone") || lower.includes("ci"))
    return `Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain.`;
  if (lower.includes("security") || lower.includes("jwt") || lower.includes("injection"))
    return `A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.`;
  if (lower.includes("sql") || lower.includes("database") || lower.includes("mongodb") || lower.includes("hibernate"))
    return `The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.`;
  if (lower.includes("swagger") || lower.includes("postman") || lower.includes("api"))
    return `Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.`;
  if (lower.includes("rag") || lower.includes("embedding") || lower.includes("agent") || lower.includes("mcp"))
    return `HR wants new hires to query internal Java coding standards via chat. You build RAG over markdown in git, expose MCP tools read-only to ticket systems, and monitor token spend — a realistic Gen AI feature request for a mid-size product company.`;
  return realWorldTopic(weekNum, title);
}

// Build CONTENT map
const CONTENT = {};

for (let w = 2; w <= 11; w++) {
  const week = JSON.parse(fs.readFileSync(path.join(WEEKS_DIR, `week-${w}.json`), "utf8"));
  for (const t of week.aiSkill.learningTopics) {
    CONTENT[t.id] = makeEntry(topicParagraphs(w, t.title), realWorldTopic(w, t.title));
  }
  for (const e of week.aiSkill.exercises) {
    const ex = exerciseParagraphs(w, e.title);
    CONTENT[e.id] = makeEntry(ex.paragraphs, realWorldExercise(w, e.title), ex.code);
  }
}

for (const [id, title] of WEEK12_TOPICS) {
  CONTENT[id] = makeEntry(topicParagraphs(12, title), realWorldTopic(12, title));
}
for (const [id, title] of WEEK12_EXERCISES) {
  const ex = exerciseParagraphs(12, title);
  CONTENT[id] = makeEntry(ex.paragraphs, realWorldExercise(12, title), ex.code);
}

// Serialize CONTENT to JS source
function serializeEntry(id, entry) {
  const paras = entry.paragraphs.map((p) => `"${esc(p)}"`).join(",\n      ");
  let s = `  "${id}": makeEntry(\n    [\n      ${paras},\n    ],\n    "${esc(entry.realWorld)}"`;
  if (entry.code) s += `,\n    "${esc(entry.code)}"`;
  s += "\n  )";
  return s;
}

const contentLines = Object.keys(CONTENT)
  .sort()
  .map((id) => serializeEntry(id, CONTENT[id]));

const week12TopicsJson = WEEK12_TOPICS.map(([id, title]) => `      { "id": "${id}", "title": ${JSON.stringify(title)} }`).join(",\n");
const week12ExJson = WEEK12_EXERCISES.map(([id, title]) => `      { "id": "${id}", "title": ${JSON.stringify(title)} }`).join(",\n");
const week12ToolsJson = WEEK12_TOOLS.map((t) => JSON.stringify(t)).join(",\n      ");

const weekContextLines = Object.entries(WEEK_CONTEXT)
  .map(([k, v]) => `  ${k}: ${JSON.stringify(v)},`)
  .join("\n");

const out = `/** Rich AI curriculum content for weeks 2–12 (topics, exercises, Week 12 skill definition). */
export const WEEK_CONTEXT = {
${weekContextLines}
};

export const WEEK12_SKILL = {
  id: "ai-week-12",
  title: "Professional Gen AI Mastery for Java Developers",
  description: "RAG, embeddings, vector databases, Spring AI, LangChain4j, agents, MCP, streaming, cost optimization, production patterns, testing, CI/CD, and career skills for Java backend engineers.",
  learningTopics: [
${week12TopicsJson}
  ],
  tools: [
      ${week12ToolsJson}
  ],
  exercises: [
${week12ExJson}
  ],
};

function makeEntry(paragraphs, realWorld, code) {
  const entry = { answer: paragraphs.join("\\n\\n"), realWorld };
  if (code !== undefined) entry.code = code;
  return entry;
}

const CONTENT = {
${contentLines.join(",\n")}
};

function fallbackTopic(weekNum, id, title) {
  const ctx = WEEK_CONTEXT[weekNum] ?? "building production Java backends with AI assistance";
  return {
    answer: [
      \`\${title} supports \${ctx}.\`,
      "Structure your AI requests with concrete Java context: class names, method signatures, JDK version, and expected behavior.",
      "Verify every suggestion by compiling and running code in your IDE before trusting it for assignments or production.",
      "Save effective prompts and outcomes in your learning repository to build reusable patterns for debugging and design reviews.",
    ].join("\\n\\n"),
    realWorld: \`A mid-size product company hires Java developers who can explain \${title} while shipping tested Spring Boot features — not developers who copy AI output without validation.\`,
  };
}

function fallbackExercise(weekNum, id, title) {
  const base = fallbackTopic(weekNum, id, title);
  return { ...base };
}

export function buildRichTopic(weekNum, id, title) {
  const entry = CONTENT[id];
  if (entry) return { answer: entry.answer, realWorld: entry.realWorld };
  return fallbackTopic(weekNum, id, title);
}

export function buildRichExercise(weekNum, id, title) {
  const entry = CONTENT[id];
  if (entry) {
    const result = { answer: entry.answer, realWorld: entry.realWorld };
    if (entry.code) result.code = entry.code;
    return result;
  }
  return fallbackExercise(weekNum, id, title);
}

export function buildWeek12Topic(id, title) {
  return buildRichTopic(12, id, title);
}

export function buildWeek12Exercise(id, title) {
  return buildRichExercise(12, id, title);
}
`;

const outPath = path.join(__dirname, "ai-rich-content.mjs");
fs.writeFileSync(outPath, out, "utf8");

// Verify
const ids = Object.keys(CONTENT).sort();
const expected = [];
for (let w = 2; w <= 11; w++) {
  const week = JSON.parse(fs.readFileSync(path.join(WEEKS_DIR, `week-${w}.json`), "utf8"));
  week.aiSkill.learningTopics.forEach((t) => expected.push(t.id));
  week.aiSkill.exercises.forEach((e) => expected.push(e.id));
}
WEEK12_TOPICS.forEach(([id]) => expected.push(id));
WEEK12_EXERCISES.forEach(([id]) => expected.push(id));

const missing = expected.filter((id) => !ids.includes(id));
const extra = ids.filter((id) => !expected.includes(id));
console.log(`Wrote ${outPath}`);
console.log(`Entries: ${ids.length}, expected: ${expected.length}`);
if (missing.length) console.error("Missing:", missing);
if (extra.length) console.error("Extra:", extra);

// Validate module loads and paragraph counts
const mod = await import(outPath + "?t=" + Date.now());
const sample = mod.buildRichTopic(2, "ai-w2-t1", "What is Prompt Engineering?");
const paras = sample.answer.split("\\n\\n");
if (paras.length < 3) console.error("Sample topic has fewer than 3 paragraphs");
const bad = sample.answer.match(/core concept for|During Week \\d+ pick/i);
if (bad) console.error("Forbidden generic text found");
console.log("Validation OK — paragraphs:", paras.length);
