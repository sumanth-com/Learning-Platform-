/** Rich AI curriculum content for weeks 2–12 (topics, exercises, Week 12 skill definition). */
export const WEEK_CONTEXT = {
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

export const WEEK12_SKILL = {
  id: "ai-week-12",
  title: "Professional Gen AI Mastery for Java Developers",
  description: "RAG, embeddings, vector databases, Spring AI, LangChain4j, agents, MCP, streaming, cost optimization, production patterns, testing, CI/CD, and career skills for Java backend engineers.",
  learningTopics: [
      { "id": "ai-w12-t1", "title": "What is Retrieval-Augmented Generation (RAG)?" },
      { "id": "ai-w12-t2", "title": "Text Embeddings and Vector Representations" },
      { "id": "ai-w12-t3", "title": "Vector Databases: pgvector, Pinecone, and Chroma" },
      { "id": "ai-w12-t4", "title": "Similarity Search and Cosine Distance" },
      { "id": "ai-w12-t5", "title": "Document Chunking Strategies for RAG" },
      { "id": "ai-w12-t6", "title": "Tuning Retrieval Quality and Re-ranking" },
      { "id": "ai-w12-t7", "title": "Spring AI Overview for Java Developers" },
      { "id": "ai-w12-t8", "title": "Spring AI ChatClient and Prompt Templates" },
      { "id": "ai-w12-t9", "title": "Spring AI Embeddings and VectorStore" },
      { "id": "ai-w12-t10", "title": "Spring AI Function Calling and Tools" },
      { "id": "ai-w12-t11", "title": "LangChain4j Introduction" },
      { "id": "ai-w12-t12", "title": "LangChain4j Embedding Stores and Document Loaders" },
      { "id": "ai-w12-t13", "title": "Building a RAG Pipeline with LangChain4j" },
      { "id": "ai-w12-t14", "title": "Spring AI vs LangChain4j: When to Use Which" },
      { "id": "ai-w12-t15", "title": "AI Agent Architecture and ReAct Patterns" },
      { "id": "ai-w12-t16", "title": "Tool Calling Patterns in Production" },
      { "id": "ai-w12-t17", "title": "Model Context Protocol (MCP) Explained" },
      { "id": "ai-w12-t18", "title": "Building MCP Servers with Java" },
      { "id": "ai-w12-t19", "title": "Streaming LLM Responses in Java" },
      { "id": "ai-w12-t20", "title": "Server-Sent Events (SSE) in Spring Boot" },
      { "id": "ai-w12-t21", "title": "Token Usage, Pricing, and Cost Optimization" },
      { "id": "ai-w12-t22", "title": "Model Selection: GPT, Claude, Gemini, and Local Models" },
      { "id": "ai-w12-t23", "title": "Production AI Architecture Patterns" },
      { "id": "ai-w12-t24", "title": "Observability: Logging, Tracing, and Metrics for AI" },
      { "id": "ai-w12-t25", "title": "Testing AI Features in Java Applications" },
      { "id": "ai-w12-t26", "title": "Evals, Golden Datasets, and Regression Testing" },
      { "id": "ai-w12-t27", "title": "CI/CD Pipelines for AI-Enabled Services" },
      { "id": "ai-w12-t28", "title": "Feature Flags and Safe AI Rollouts" },
      { "id": "ai-w12-t29", "title": "Microservices Patterns with AI Components" },
      { "id": "ai-w12-t30", "title": "Event-Driven AI Workflows with Kafka" },
      { "id": "ai-w12-t31", "title": "Security in Gen AI Systems" },
      { "id": "ai-w12-t32", "title": "PII Handling and Data Governance in RAG" },
      { "id": "ai-w12-t33", "title": "Portfolio Projects for Gen AI Java Developers" },
      { "id": "ai-w12-t34", "title": "Interview Preparation: Gen AI for Java Backend" },
      { "id": "ai-w12-t35", "title": "Career Roadmap: 2-Year Java Dev to Gen AI Engineer" }
  ],
  tools: [
      "Spring AI",
      "LangChain4j",
      "OpenAI API",
      "pgvector",
      "Docker",
      "GitHub Actions",
      "OpenTelemetry",
      "Postman"
  ],
  exercises: [
      { "id": "ai-w12-e1", "title": "Build an embedding service with Spring AI and store vectors in pgvector" },
      { "id": "ai-w12-e2", "title": "Implement a basic RAG chatbot over your project documentation" },
      { "id": "ai-w12-e3", "title": "Add function calling so the LLM can query a Spring Data repository" },
      { "id": "ai-w12-e4", "title": "Stream chat responses to the browser using SSE in Spring Boot" },
      { "id": "ai-w12-e5", "title": "Load PDF documents with LangChain4j and answer questions about them" },
      { "id": "ai-w12-e6", "title": "Integrate an MCP tool that exposes your REST API to an AI agent" },
      { "id": "ai-w12-e7", "title": "Implement token-budget middleware to cap per-request LLM cost" },
      { "id": "ai-w12-e8", "title": "Unit-test an AI wrapper service with Mockito and WireMock" },
      { "id": "ai-w12-e9", "title": "Create a golden-dataset eval for prompt consistency" },
      { "id": "ai-w12-e10", "title": "Dockerize an AI microservice with health checks and secrets" },
      { "id": "ai-w12-e11", "title": "Add OpenTelemetry spans around LLM and embedding calls" },
      { "id": "ai-w12-e12", "title": "Build a simple cost dashboard from logged token usage" },
      { "id": "ai-w12-e13", "title": "Implement hybrid search combining keyword and vector retrieval" },
      { "id": "ai-w12-e14", "title": "Build a multi-tool agent that plans and executes Java service calls" },
      { "id": "ai-w12-e15", "title": "Capstone: deploy a production-ready RAG API with tests and CI" }
  ],
};

function makeEntry(paragraphs, realWorld, code) {
  const entry = { answer: paragraphs.join("\n\n"), realWorld };
  if (code !== undefined) entry.code = code;
  return entry;
}

const CONTENT = {
  "ai-w10-e1": makeEntry(
    [
      "This exercise — \"Generate OpenAPI/Swagger documentation for your API\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e10": makeEntry(
    [
      "This exercise — \"Optimize your API response structure for production\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e2": makeEntry(
    [
      "This exercise — \"Create a Postman collection with test scripts\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e3": makeEntry(
    [
      "This exercise — \"Review your REST API endpoint naming and URI design\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e4": makeEntry(
    [
      "This exercise — \"Explain when to use 400 vs 422 vs 409 status codes\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to Explain when to use 400 vs 422 vs 409 status codes.."
  ),
  "ai-w10-e5": makeEntry(
    [
      "This exercise — \"Suggest pagination and filtering query parameters\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to Suggest pagination and filtering query parameters..",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e6": makeEntry(
    [
      "This exercise — \"Review your DTO and mapper pattern implementation\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to Review your DTO and mapper pattern implementation..",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e7": makeEntry(
    [
      "This exercise — \"Identify missing validation rules in your API\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e8": makeEntry(
    [
      "This exercise — \"Generate API test cases for edge cases\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-e9": makeEntry(
    [
      "This exercise — \"Suggest rate limiting and CORS configuration\" — applies AI-assisted learning while building production AI API integrations with Swagger, Postman, and testing. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to Suggest rate limiting and CORS configuration..",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w10-t1": makeEntry(
    [
      "AI API Integration is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI API Integration."
  ),
  "ai-w10-t10": makeEntry(
    [
      "AI API Optimization is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI API Optimization."
  ),
  "ai-w10-t2": makeEntry(
    [
      "AI-generated Swagger is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI-generated Swagger."
  ),
  "ai-w10-t3": makeEntry(
    [
      "AI-generated Postman Collections is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI-generated Postman Collections."
  ),
  "ai-w10-t4": makeEntry(
    [
      "AI API Documentation is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 10 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI API Documentation."
  ),
  "ai-w10-t5": makeEntry(
    [
      "AI API Testing is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI API Testing."
  ),
  "ai-w10-t6": makeEntry(
    [
      "AI API Review is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 10 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI API Review."
  ),
  "ai-w10-t7": makeEntry(
    [
      "AI Prompt APIs is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI Prompt APIs."
  ),
  "ai-w10-t8": makeEntry(
    [
      "AI Response Validation is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI Response Validation connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI Response Validation after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI Response Validation."
  ),
  "ai-w10-t9": makeEntry(
    [
      "AI Error Analysis is essential when building production AI API integrations with Swagger, Postman, and testing. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI Error Analysis connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI Error Analysis after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Release day requires updated OpenAPI docs and Postman regression suite. You generate spec from springdoc, export Newman run in CI, catch a breaking DTO rename before mobile clients ship — standard production API discipline tied to AI Error Analysis."
  ),
  "ai-w11-e1": makeEntry(
    [
      "This exercise — \"Generate an ER diagram for a banking system\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e10": makeEntry(
    [
      "This exercise — \"Review your database schema for normalization issues\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e2": makeEntry(
    [
      "This exercise — \"Design a normalized schema for an e-commerce platform\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e3": makeEntry(
    [
      "This exercise — \"Write a complex SQL query with CTEs and window functions\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e4": makeEntry(
    [
      "This exercise — \"Optimize a slow query using EXPLAIN plan analysis\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-e5": makeEntry(
    [
      "This exercise — \"Recommend indexes for your most-used queries\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e6": makeEntry(
    [
      "This exercise — \"Debug an N+1 query problem in Hibernate\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e7": makeEntry(
    [
      "This exercise — \"Generate MongoDB aggregation pipeline queries\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e8": makeEntry(
    [
      "This exercise — \"Create Flyway migration scripts for your schema\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w11-e9": makeEntry(
    [
      "This exercise — \"Explain lazy vs eager loading trade-offs for your entities\" — applies AI-assisted learning while designing databases, MongoDB queries, and Hibernate with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t1": makeEntry(
    [
      "AI ER Diagram Generation is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t10": makeEntry(
    [
      "AI Migration Scripts is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t2": makeEntry(
    [
      "AI Schema Design is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 11 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t3": makeEntry(
    [
      "AI SQL Generation is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t4": makeEntry(
    [
      "AI Query Optimization is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t5": makeEntry(
    [
      "AI Index Recommendations is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t6": makeEntry(
    [
      "AI Performance Analysis is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t7": makeEntry(
    [
      "AI MongoDB Queries is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t8": makeEntry(
    [
      "AI Hibernate Debugging is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.",
      "NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.",
      "Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.",
      "Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w11-t9": makeEntry(
    [
      "AI Database Documentation is essential when designing databases, MongoDB queries, and Hibernate with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 11 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Customer support search is slow on orders table. You analyze Hibernate SQL logs, fix N+1 with join fetch, add pg indexes AI recommended after validating column selectivity, and ship Flyway V12 with rollback notes."
  ),
  "ai-w12-e1": makeEntry(
    [
      "This exercise — \"Build an embedding service with Spring AI and store vectors in pgvector\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "HR wants new hires to query internal Java coding standards via chat. You build RAG over markdown in git, expose MCP tools read-only to ticket systems, and monitor token spend — a realistic Gen AI feature request for a mid-size product company.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e10": makeEntry(
    [
      "This exercise — \"Dockerize an AI microservice with health checks and secrets\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e11": makeEntry(
    [
      "This exercise — \"Add OpenTelemetry spans around LLM and embedding calls\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "HR wants new hires to query internal Java coding standards via chat. You build RAG over markdown in git, expose MCP tools read-only to ticket systems, and monitor token spend — a realistic Gen AI feature request for a mid-size product company.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e12": makeEntry(
    [
      "This exercise — \"Build a simple cost dashboard from logged token usage\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Build a simple cost dashboard from logged token usage.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e13": makeEntry(
    [
      "This exercise — \"Implement hybrid search combining keyword and vector retrieval\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Implement hybrid search combining keyword and vector retrieval.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e14": makeEntry(
    [
      "This exercise — \"Build a multi-tool agent that plans and executes Java service calls\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "HR wants new hires to query internal Java coding standards via chat. You build RAG over markdown in git, expose MCP tools read-only to ticket systems, and monitor token spend — a realistic Gen AI feature request for a mid-size product company.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e15": makeEntry(
    [
      "This exercise — \"Capstone: deploy a production-ready RAG API with tests and CI\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e2": makeEntry(
    [
      "This exercise — \"Implement a basic RAG chatbot over your project documentation\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "HR wants new hires to query internal Java coding standards via chat. You build RAG over markdown in git, expose MCP tools read-only to ticket systems, and monitor token spend — a realistic Gen AI feature request for a mid-size product company.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e3": makeEntry(
    [
      "This exercise — \"Add function calling so the LLM can query a Spring Data repository\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Add function calling so the LLM can query a Spring Data repository.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e4": makeEntry(
    [
      "This exercise — \"Stream chat responses to the browser using SSE in Spring Boot\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Stream chat responses to the browser using SSE in Spring Boot.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e5": makeEntry(
    [
      "This exercise — \"Load PDF documents with LangChain4j and answer questions about them\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Load PDF documents with LangChain4j and answer questions about them.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e6": makeEntry(
    [
      "This exercise — \"Integrate an MCP tool that exposes your REST API to an AI agent\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e7": makeEntry(
    [
      "This exercise — \"Implement token-budget middleware to cap per-request LLM cost\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Implement token-budget middleware to cap per-request LLM cost.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e8": makeEntry(
    [
      "This exercise — \"Unit-test an AI wrapper service with Mockito and WireMock\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Unit-test an AI wrapper service with Mockito and WireMock.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-e9": makeEntry(
    [
      "This exercise — \"Create a golden-dataset eval for prompt consistency\" — applies AI-assisted learning while mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Create a golden-dataset eval for prompt consistency.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w12-t1": makeEntry(
    [
      "What is Retrieval-Augmented Generation (RAG) is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Retrieval-Augmented Generation (RAG) is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain Retrieval-Augmented Generation (RAG) in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about Retrieval-Augmented Generation (RAG), write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering What is Retrieval-Augmented Generation (RAG)?."
  ),
  "ai-w12-t10": makeEntry(
    [
      "Spring AI Function Calling and Tools is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Spring AI Function Calling and Tools."
  ),
  "ai-w12-t11": makeEntry(
    [
      "LangChain4j Introduction is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering LangChain4j Introduction."
  ),
  "ai-w12-t12": makeEntry(
    [
      "LangChain4j Embedding Stores and Document Loaders is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering LangChain4j Embedding Stores and Document Loaders."
  ),
  "ai-w12-t13": makeEntry(
    [
      "Building a RAG Pipeline with LangChain4j is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Building a RAG Pipeline with LangChain4j."
  ),
  "ai-w12-t14": makeEntry(
    [
      "Spring AI vs LangChain4j: When to Use Which is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Spring AI vs LangChain4j: When to Use Which."
  ),
  "ai-w12-t15": makeEntry(
    [
      "AI Agent Architecture and ReAct Patterns is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering AI Agent Architecture and ReAct Patterns."
  ),
  "ai-w12-t16": makeEntry(
    [
      "Tool Calling Patterns in Production is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Tool Calling Patterns in Production connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Tool Calling Patterns in Production after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Tool Calling Patterns in Production."
  ),
  "ai-w12-t17": makeEntry(
    [
      "Model Context Protocol (MCP) Explained is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Model Context Protocol (MCP) Explained."
  ),
  "ai-w12-t18": makeEntry(
    [
      "Building MCP Servers with Java is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Building MCP Servers with Java."
  ),
  "ai-w12-t19": makeEntry(
    [
      "Streaming LLM Responses in Java is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Streaming LLM Responses in Java."
  ),
  "ai-w12-t2": makeEntry(
    [
      "Text Embeddings and Vector Representations is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Text Embeddings and Vector Representations."
  ),
  "ai-w12-t20": makeEntry(
    [
      "Server-Sent Events (SSE) in Spring Boot is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Server-Sent Events (SSE) in Spring Boot connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Server-Sent Events (SSE) in Spring Boot after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Server-Sent Events (SSE) in Spring Boot."
  ),
  "ai-w12-t21": makeEntry(
    [
      "Token Usage, Pricing, and Cost Optimization is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Token Usage, Pricing, and Cost Optimization."
  ),
  "ai-w12-t22": makeEntry(
    [
      "Model Selection: GPT, Claude, Gemini, and Local Models is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Model Selection: GPT, Claude, Gemini, and Local Models connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Model Selection: GPT, Claude, Gemini, and Local Models after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Model Selection: GPT, Claude, Gemini, and Local Models."
  ),
  "ai-w12-t23": makeEntry(
    [
      "Production AI Architecture Patterns is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Production AI Architecture Patterns connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Production AI Architecture Patterns after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Production AI Architecture Patterns."
  ),
  "ai-w12-t24": makeEntry(
    [
      "Observability: Logging, Tracing, and Metrics for AI is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Observability: Logging, Tracing, and Metrics for AI."
  ),
  "ai-w12-t25": makeEntry(
    [
      "Testing AI Features in Java Applications is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Testing AI Features in Java Applications."
  ),
  "ai-w12-t26": makeEntry(
    [
      "Evals, Golden Datasets, and Regression Testing is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Evals, Golden Datasets, and Regression Testing."
  ),
  "ai-w12-t27": makeEntry(
    [
      "CI/CD Pipelines for AI-Enabled Services is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering CI/CD Pipelines for AI-Enabled Services."
  ),
  "ai-w12-t28": makeEntry(
    [
      "Feature Flags and Safe AI Rollouts is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Feature Flags and Safe AI Rollouts connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Feature Flags and Safe AI Rollouts after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Feature Flags and Safe AI Rollouts."
  ),
  "ai-w12-t29": makeEntry(
    [
      "Microservices Patterns with AI Components is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Microservices Patterns with AI Components."
  ),
  "ai-w12-t3": makeEntry(
    [
      "Vector Databases: pgvector, Pinecone, and Chroma is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Vector Databases: pgvector, Pinecone, and Chroma."
  ),
  "ai-w12-t30": makeEntry(
    [
      "Event-Driven AI Workflows with Kafka is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Event-Driven AI Workflows with Kafka."
  ),
  "ai-w12-t31": makeEntry(
    [
      "Security in Gen AI Systems is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Store API keys in environment variables or secret managers (AWS Secrets Manager, Vault), never in application.properties committed to Git. Spring Boot reads ${OPENAI_API_KEY} from the environment at runtime.",
      "Prompt injection happens when user text manipulates the model (\"ignore previous instructions\"). Sanitize or separate system and user channels; validate model output before executing tool calls or SQL.",
      "Spring Security with JWT: understand filter chain order, token expiry, refresh flows, and why BCrypt with strength 10+ beats MD5/SHA for passwords. AI sometimes suggests outdated crypto — reject it.",
      "Run OWASP dependency-check and review CORS, CSRF, and authorization on every new endpoint. Security is not a Week 12 checkbox; it is release criteria.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Security in Gen AI Systems."
  ),
  "ai-w12-t32": makeEntry(
    [
      "PII Handling and Data Governance in RAG is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering PII Handling and Data Governance in RAG."
  ),
  "ai-w12-t33": makeEntry(
    [
      "Portfolio Projects for Gen AI Java Developers is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Portfolio Projects for Gen AI Java Developers."
  ),
  "ai-w12-t34": makeEntry(
    [
      "Interview Preparation: Gen AI for Java Backend is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Interview Preparation: Gen AI for Java Backend."
  ),
  "ai-w12-t35": makeEntry(
    [
      "Career Roadmap: 2-Year Java Dev to Gen AI Engineer is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Career Roadmap: 2-Year Java Dev to Gen AI Engineer."
  ),
  "ai-w12-t4": makeEntry(
    [
      "Similarity Search and Cosine Distance is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Similarity Search and Cosine Distance connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Similarity Search and Cosine Distance after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Similarity Search and Cosine Distance."
  ),
  "ai-w12-t5": makeEntry(
    [
      "Document Chunking Strategies for RAG is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Document Chunking Strategies for RAG."
  ),
  "ai-w12-t6": makeEntry(
    [
      "Tuning Retrieval Quality and Re-ranking is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Tuning Retrieval Quality and Re-ranking."
  ),
  "ai-w12-t7": makeEntry(
    [
      "Spring AI Overview for Java Developers is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Spring AI Overview for Java Developers."
  ),
  "ai-w12-t8": makeEntry(
    [
      "Spring AI ChatClient and Prompt Templates is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Spring AI ChatClient and Prompt Templates."
  ),
  "ai-w12-t9": makeEntry(
    [
      "Spring AI Embeddings and VectorStore is essential when mastering professional Gen AI — RAG, embeddings, Spring AI, LangChain4j, agents, and production Java integration. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Gen AI in Java backends typically combines Spring Boot services, embedding APIs, vector stores like pgvector, and orchestration via Spring AI or LangChain4j. You already know REST and JDBC — RAG adds retrieval before generation so answers cite your docs, not random training data.",
      "Production concerns include latency (embedding + LLM calls), cost per token, idempotency for retries, and tracing each step with OpenTelemetry. A two-year Java developer who ships a monitored RAG endpoint stands out in hiring pipelines.",
      "Start local with Docker Compose: Postgres + pgvector, Spring Boot app, API keys in .env ignored by git. Expand to CI running contract tests against WireMocked LLM responses so merges do not burn credits.",
      "Agents and MCP extend LLMs with tools — calling your existing Java services safely requires authentication, input validation, and audit logs for every tool invocation.",
    ],
    "Your company wants an internal docs chatbot over Confluence exports. As a two-year Java dev you deliver a Spring AI RAG microservice with pgvector, streamed SSE responses, token budgets, and Grafana dashboards — a hire-worthy Gen AI portfolio piece covering Spring AI Embeddings and VectorStore."
  ),
  "ai-w2-e1": makeEntry(
    [
      "This exercise — \"Explain if-else with real-life examples\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Explain if-else with real-life examples. enables.",
    "int score = 72;\nif (score >= 90) System.out.println(\"A\");\nelse if (score >= 75) System.out.println(\"B\");\nelse if (score >= 60) System.out.println(\"C\");\nelse System.out.println(\"F\");"
  ),
  "ai-w2-e10": makeEntry(
    [
      "This exercise — \"Explain why your program is slow\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Explain why your program is slow. enables."
  ),
  "ai-w2-e2": makeEntry(
    [
      "This exercise — \"Explain loops visually\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Explain loops visually. enables.",
    "for (int i = 1; i <= 5; i++) {\n    System.out.println(\"*\".repeat(i));\n}"
  ),
  "ai-w2-e3": makeEntry(
    [
      "This exercise — \"Dry-run a Fibonacci program\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain.",
    "int a = 0, b = 1;\nfor (int i = 0; i < 8; i++) {\n    System.out.print(a + \" \");\n    int next = a + b;\n    a = b;\n    b = next;\n}"
  ),
  "ai-w2-e4": makeEntry(
    [
      "This exercise — \"Explain recursion without code (preview only)\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Explain recursion without code (preview only). enables."
  ),
  "ai-w2-e5": makeEntry(
    [
      "This exercise — \"Optimize a nested loop\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Profile the original nested-loop solution with increasing n (100, 1_000, 10_000). Record wall-clock time in a simple benchmark main or JUnit @RepeatedTest with timeout assertions.",
      "Ask AI for a HashMap- or Set-based alternative and its Big-O. Implement both versions in the same class and compare outputs on random inputs for correctness first.",
      "Document why the faster version is faster in a comment block — interviewers want reasoning, not memorized Big-O letters.",
      "If the dataset is tiny, prefer readable loops over premature optimization. State that trade-off explicitly in your README.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Optimize a nested loop. enables.",
    "// Before: O(n^2) duplicate check\nfor (int i = 0; i < arr.length; i++)\n  for (int j = i + 1; j < arr.length; j++)\n    if (arr[i] == arr[j]) { /* found */ }\n\n// After: O(n) with HashSet\nSet<Integer> seen = new HashSet<>();\nfor (int x : arr) { if (!seen.add(x)) { /* dup */ } }"
  ),
  "ai-w2-e6": makeEntry(
    [
      "This exercise — \"A program with logical bugs and identify them yourself before checking its answer\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Reproduce the failure with the smallest input. Capture full stack trace and relevant entity mappings or SQL logs.",
      "Ask AI to explain each stack frame, starting from Caused by. Fix root cause, not symptoms — e.g., initialize collections in constructors rather than catching NPE everywhere.",
      "Add a regression test that failed before the fix and passes after. Hibernate N+1 fixes deserve integration tests with query count assertions.",
      "For SQL injection exercises, show both vulnerable concatenation and PreparedStatement side-by-side in code review notes.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow A program with logical bugs and identify them yourself before checking its answer. enables.",
    "String sql = \"SELECT * FROM users WHERE id = ?\";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  ps.setLong(1, userId);\n  ResultSet rs = ps.executeQuery();\n}"
  ),
  "ai-w2-e7": makeEntry(
    [
      "This exercise — \"Create five loop practice problems\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Create five loop practice problems. enables."
  ),
  "ai-w2-e8": makeEntry(
    [
      "This exercise — \"Generate edge cases for a calculator program\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Generate edge cases for a calculator program. enables."
  ),
  "ai-w2-e9": makeEntry(
    [
      "This exercise — \"Review your code for readability\" — applies AI-assisted learning while writing better prompts while practicing control flow and loops in Java. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Review your code for readability. enables."
  ),
  "ai-w2-t1": makeEntry(
    [
      "What is Prompt Engineering is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Prompt Engineering is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain Prompt Engineering in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about Prompt Engineering, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow What is Prompt Engineering? enables."
  ),
  "ai-w2-t10": makeEntry(
    [
      "Asking AI to Generate Test Cases is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Asking AI to Generate Test Cases enables."
  ),
  "ai-w2-t11": makeEntry(
    [
      "AI Limitations is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Models hallucinate APIs, misstate Java version behavior, and invent library methods. They also lack access to your private codebase unless you paste it. Never merge AI suggestions without compiling, running tests, and reading diffs line by line.",
      "Debugging assistance is high-value; architectural decisions from AI alone are risky. When AI suggests a design pattern, ask why it fits your constraints — team size, traffic, existing Spring modules — before adopting it.",
      "Log cases where AI was wrong and what you did to catch it. That log becomes interview gold: \"Copilot suggested ArrayList.remove in a foreach — I knew ConcurrentModificationException and fixed it.\" Shows professional skepticism.",
      "Set personal rules: no pasting production secrets, no trusting generated SQL on prod, no skipping tests because \"AI said it works.\" Those boundaries keep you employable on real teams.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow AI Limitations enables."
  ),
  "ai-w2-t2": makeEntry(
    [
      "Anatomy of a Good Prompt is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Anatomy of a Good Prompt enables."
  ),
  "ai-w2-t3": makeEntry(
    [
      "Context is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Context enables."
  ),
  "ai-w2-t4": makeEntry(
    [
      "Constraints is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Constraints enables."
  ),
  "ai-w2-t5": makeEntry(
    [
      "Examples is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Examples enables."
  ),
  "ai-w2-t6": makeEntry(
    [
      "Iterative Prompting is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Iterative Prompting enables."
  ),
  "ai-w2-t7": makeEntry(
    [
      "Asking AI to Explain Code is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Asking AI to Explain Code connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Asking AI to Explain Code after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Asking AI to Explain Code enables."
  ),
  "ai-w2-t8": makeEntry(
    [
      "Asking AI to Debug Code is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.",
      "NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.",
      "Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.",
      "Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Asking AI to Debug Code enables."
  ),
  "ai-w2-t9": makeEntry(
    [
      "Asking AI to Optimize Code is essential when writing better prompts while practicing control flow and loops in Java. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "On a fintech intern team, a senior asks you to fix a loan eligibility loop that mis-counts edge cases. You paste the method and failing input into AI with a structured prompt, verify the suggested guard clauses, and ship a PR with new JUnit tests — exactly the workflow Asking AI to Optimize Code enables."
  ),
  "ai-w3-e1": makeEntry(
    [
      "This exercise — \"Review your Student class\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e10": makeEntry(
    [
      "This exercise — \"Explain SOLID principles at a beginner level\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain."
  ),
  "ai-w3-e2": makeEntry(
    [
      "This exercise — \"Suggest better variable names\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e3": makeEntry(
    [
      "This exercise — \"Explain why encapsulation is useful\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e4": makeEntry(
    [
      "This exercise — \"Generate a UML diagram from your classes\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Scaffold a Spring Boot 3 module with spring-ai-openai or spring-ai-ollama starter. Externalize model name and temperature in application.yml with profiles for dev/prod.",
      "Implement retrieval: chunk markdown docs (~500 tokens), embed with EmbeddingModel bean, store in PgVectorStore, query top-k before ChatClient.call(). Log latency and token counts.",
      "For production capstone: add Dockerfile, health actuator, integration tests with Testcontainers Postgres, GitHub Actions pipeline that skips live LLM calls using @MockBean.",
      "Write a ADR (Architecture Decision Record) explaining why you chose Spring AI vs LangChain4j for this exercise — hiring managers love explicit trade-offs.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges.",
    "@Autowired ChatClient chatClient;\n\npublic String ask(String question) {\n  return chatClient.prompt()\n    .user(question)\n    .call()\n    .content();\n}"
  ),
  "ai-w3-e5": makeEntry(
    [
      "This exercise — \"Identify duplicate code\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e6": makeEntry(
    [
      "This exercise — \"Suggest improvements for constructors\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e7": makeEntry(
    [
      "This exercise — \"Create JavaDoc comments\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e8": makeEntry(
    [
      "This exercise — \"Find design mistakes\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-e9": makeEntry(
    [
      "This exercise — \"Compare: two class designs\" — applies AI-assisted learning while using AI to review OOP code quality, naming, and class design. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t1": makeEntry(
    [
      "What is AI Code Review is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI Code Review is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain AI Code Review in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about AI Code Review, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t10": makeEntry(
    [
      "AI for UML/Class Diagram Suggestions is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t2": makeEntry(
    [
      "Code Smells is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t3": makeEntry(
    [
      "Naming Conventions is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t4": makeEntry(
    [
      "Readability is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t5": makeEntry(
    [
      "Maintainability is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t6": makeEntry(
    [
      "AI vs Human Review is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t7": makeEntry(
    [
      "Asking AI to Improve Class Design is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t8": makeEntry(
    [
      "AI for Documentation is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w3-t9": makeEntry(
    [
      "AI for Refactoring is essential when using AI to review OOP code quality, naming, and class design. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 3 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "During code review of your Spring-less Student module, a teammate flags god-class smell. You use AI to propose extracted service methods, apply renames that match company camelCase rules, and push a refactor commit before the feature branch merges."
  ),
  "ai-w4-e1": makeEntry(
    [
      "This exercise — \"Explain a NullPointerException\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e10": makeEntry(
    [
      "This exercise — \"Review your complete mini project\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e2": makeEntry(
    [
      "This exercise — \"Ask AI why ArrayIndexOutOfBoundsException occurs\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w4-e3": makeEntry(
    [
      "This exercise — \"An exception stack trace and understand every line\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w4-e4": makeEntry(
    [
      "This exercise — \"Refactor duplicated code\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Break the task into inputs, processing steps, and expected outputs. Implement a first version without AI, then ask for improvements on your concrete code.",
      "Validate every AI suggestion by compilation and execution. Keep a changelog of what you accepted vs rejected and why.",
      "Connect the exercise to your portfolio project: reuse same package structure, logging, and testing conventions employers expect.",
      "Reflect in README: what you learned, what AI got wrong, and what you would do differently on a team sprint.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e5": makeEntry(
    [
      "This exercise — \"Improve inheritance design\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e6": makeEntry(
    [
      "This exercise — \"Compare: interface vs abstract class\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e7": makeEntry(
    [
      "This exercise — \"Generate JavaDoc comments\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-e8": makeEntry(
    [
      "This exercise — \"Explain SOLID principles with simple examples\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your startup deploys the RAG API to AWS ECS. You containerize the Spring Boot jar, inject OPENAI_API_KEY from Secrets Manager, run health checks on /actuator/health, and gate merges with GitHub Actions — the same pipeline pattern used for non-AI microservices you already maintain."
  ),
  "ai-w4-e9": makeEntry(
    [
      "This exercise — \"Suggest cleaner package structures\" — applies AI-assisted learning while debugging Java exceptions and stack traces with AI assistance. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t1": makeEntry(
    [
      "What is AI-assisted debugging is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-assisted debugging is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain AI-assisted debugging in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about AI-assisted debugging, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t2": makeEntry(
    [
      "Understanding Java stack traces is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.",
      "NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.",
      "Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.",
      "Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t3": makeEntry(
    [
      "Explaining exceptions with AI is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.",
      "NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.",
      "Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.",
      "Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t4": makeEntry(
    [
      "Refactoring using AI is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 4 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t5": makeEntry(
    [
      "AI-generated documentation is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 4 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t6": makeEntry(
    [
      "AI code review is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 4 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t7": makeEntry(
    [
      "AI for writing unit test ideas is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w4-t8": makeEntry(
    [
      "AI limitations in debugging is essential when debugging Java exceptions and stack traces with AI assistance. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Models hallucinate APIs, misstate Java version behavior, and invent library methods. They also lack access to your private codebase unless you paste it. Never merge AI suggestions without compiling, running tests, and reading diffs line by line.",
      "Debugging assistance is high-value; architectural decisions from AI alone are risky. When AI suggests a design pattern, ask why it fits your constraints — team size, traffic, existing Spring modules — before adopting it.",
      "Log cases where AI was wrong and what you did to catch it. That log becomes interview gold: \"Copilot suggested ArrayList.remove in a foreach — I knew ConcurrentModificationException and fixed it.\" Shows professional skepticism.",
      "Set personal rules: no pasting production secrets, no trusting generated SQL on prod, no skipping tests because \"AI said it works.\" Those boundaries keep you employable on real teams.",
    ],
    "Production logs show NullPointerException in order processing at 2 a.m. You paste the stack trace into AI for a plain-English walkthrough, set a breakpoint on the flagged line in IntelliJ, fix null-safe Optional handling, and add a regression test before the hotfix deploy."
  ),
  "ai-w5-e1": makeEntry(
    [
      "This exercise — \"Ask AI which collection should be used for different scenarios\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Break the task into inputs, processing steps, and expected outputs. Implement a first version without AI, then ask for improvements on your concrete code.",
      "Validate every AI suggestion by compilation and execution. Keep a changelog of what you accepted vs rejected and why.",
      "Connect the exercise to your portfolio project: reuse same package structure, logging, and testing conventions employers expect.",
      "Reflect in README: what you learned, what AI got wrong, and what you would do differently on a team sprint.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e10": makeEntry(
    [
      "This exercise — \"Explain memory usage of different collections\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e2": makeEntry(
    [
      "This exercise — \"Compare: ArrayList vs LinkedList using AI\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e3": makeEntry(
    [
      "This exercise — \"Compare: HashMap vs TreeMap\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e4": makeEntry(
    [
      "This exercise — \"Explain HashSet internally\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e5": makeEntry(
    [
      "This exercise — \"Review your Student Management System\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e6": makeEntry(
    [
      "This exercise — \"Optimize nested loops using collections\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Profile the original nested-loop solution with increasing n (100, 1_000, 10_000). Record wall-clock time in a simple benchmark main or JUnit @RepeatedTest with timeout assertions.",
      "Ask AI for a HashMap- or Set-based alternative and its Big-O. Implement both versions in the same class and compare outputs on random inputs for correctness first.",
      "Document why the faster version is faster in a comment block — interviewers want reasoning, not memorized Big-O letters.",
      "If the dataset is tiny, prefer readable loops over premature optimization. State that trade-off explicitly in your README.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead.",
    "// Before: O(n^2) duplicate check\nfor (int i = 0; i < arr.length; i++)\n  for (int j = i + 1; j < arr.length; j++)\n    if (arr[i] == arr[j]) { /* found */ }\n\n// After: O(n) with HashSet\nSet<Integer> seen = new HashSet<>();\nfor (int x : arr) { if (!seen.add(x)) { /* dup */ } }"
  ),
  "ai-w5-e7": makeEntry(
    [
      "This exercise — \"Explain Big O notation with examples\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e8": makeEntry(
    [
      "This exercise — \"Generate edge test cases\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-e9": makeEntry(
    [
      "This exercise — \"Suggest better collection choices\" — applies AI-assisted learning while optimizing Java code and understanding time/space complexity with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t1": makeEntry(
    [
      "What is code optimization is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "code optimization is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain code optimization in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about code optimization, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t2": makeEntry(
    [
      "Time Complexity (Introduction) is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t3": makeEntry(
    [
      "Space Complexity (Introduction) is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t4": makeEntry(
    [
      "AI-assisted performance analysis is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t5": makeEntry(
    [
      "AI-generated test cases is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t6": makeEntry(
    [
      "AI for choosing data structures is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI for choosing data structures connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI for choosing data structures after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t7": makeEntry(
    [
      "AI for code readability is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 5 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w5-t8": makeEntry(
    [
      "AI code review is essential when optimizing Java code and understanding time/space complexity with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 5 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Your batch job processing 50k CSV rows runs 40 minutes. AI suggests replacing nested ArrayList.contains with HashSet membership; you benchmark both in a JMH-style loop test, confirm O(n) improvement, and document results for the tech lead."
  ),
  "ai-w6-e1": makeEntry(
    [
      "This exercise — \"Convert a for loop into a Stream\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e10": makeEntry(
    [
      "This exercise — \"Generate test cases for multithreaded code\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e2": makeEntry(
    [
      "This exercise — \"Explain a complex Lambda Expression\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-e3": makeEntry(
    [
      "This exercise — \"Compare: Streams vs Loops\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e4": makeEntry(
    [
      "This exercise — \"Optimize collection processing\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Profile the original nested-loop solution with increasing n (100, 1_000, 10_000). Record wall-clock time in a simple benchmark main or JUnit @RepeatedTest with timeout assertions.",
      "Ask AI for a HashMap- or Set-based alternative and its Big-O. Implement both versions in the same class and compare outputs on random inputs for correctness first.",
      "Document why the faster version is faster in a comment block — interviewers want reasoning, not memorized Big-O letters.",
      "If the dataset is tiny, prefer readable loops over premature optimization. State that trade-off explicitly in your README.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "// Before: O(n^2) duplicate check\nfor (int i = 0; i < arr.length; i++)\n  for (int j = i + 1; j < arr.length; j++)\n    if (arr[i] == arr[j]) { /* found */ }\n\n// After: O(n) with HashSet\nSet<Integer> seen = new HashSet<>();\nfor (int x : arr) { if (!seen.add(x)) { /* dup */ } }"
  ),
  "ai-w6-e5": makeEntry(
    [
      "This exercise — \"Explain synchronization visually\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-e6": makeEntry(
    [
      "This exercise — \"Identify race conditions\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e7": makeEntry(
    [
      "This exercise — \"Improve thread performance\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e8": makeEntry(
    [
      "This exercise — \"Review Stream code readability\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Rewrite imperative loops as Stream pipelines only when readability improves. Use peek sparingly in production; prefer map/filter/collect with method references where clear.",
      "For concurrency labs, use ExecutorService with bounded pools. Demonstrate race condition with AtomicInteger vs int counter under thread stress.",
      "Ask AI to draw happens-before relationships; verify by running Thread.sleep-free tests that fail without synchronization.",
      "Review Stream code for boxing overhead and unnecessary collect(toList()) copies on large datasets.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro.",
    "List<String> active = users.stream()\n    .filter(User::isActive)\n    .map(User::getEmail)\n    .toList();"
  ),
  "ai-w6-e9": makeEntry(
    [
      "This exercise — \"Explain Executor Service with a real-world analogy\" — applies AI-assisted learning while working with Java Streams, lambdas, and functional-style code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t1": makeEntry(
    [
      "AI for converting traditional loops into Streams is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t2": makeEntry(
    [
      "AI for writing Lambda Expressions is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t3": makeEntry(
    [
      "AI for explaining complex Stream pipelines is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t4": makeEntry(
    [
      "AI for identifying inefficient code is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI for identifying inefficient code connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI for identifying inefficient code after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t5": makeEntry(
    [
      "AI for suggesting thread-safe implementations is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t6": makeEntry(
    [
      "AI for generating unit test ideas is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t7": makeEntry(
    [
      "AI for performance analysis is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w6-t8": makeEntry(
    [
      "AI limitations in optimization is essential when working with Java Streams, lambdas, and functional-style code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Models hallucinate APIs, misstate Java version behavior, and invent library methods. They also lack access to your private codebase unless you paste it. Never merge AI suggestions without compiling, running tests, and reading diffs line by line.",
      "Debugging assistance is high-value; architectural decisions from AI alone are risky. When AI suggests a design pattern, ask why it fits your constraints — team size, traffic, existing Spring modules — before adopting it.",
      "Log cases where AI was wrong and what you did to catch it. That log becomes interview gold: \"Copilot suggested ArrayList.remove in a foreach — I knew ConcurrentModificationException and fixed it.\" Shows professional skepticism.",
      "Set personal rules: no pasting production secrets, no trusting generated SQL on prod, no skipping tests because \"AI said it works.\" Those boundaries keep you employable on real teams.",
    ],
    "An e-commerce catalog service uses parallelStream on shared mutable state and throws sporadic exceptions. AI explains thread safety; you replace with synchronized collection or concurrent collector, load-test with JMeter, and present findings in sprint retro."
  ),
  "ai-w7-e1": makeEntry(
    [
      "This exercise — \"Design a Student database\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w7-e10": makeEntry(
    [
      "This exercise — \"Identify SQL injection vulnerabilities and show how PreparedStatement prevents them\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w7-e2": makeEntry(
    [
      "This exercise — \"Generate SQL tables for a Library system\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w7-e3": makeEntry(
    [
      "This exercise — \"Explain INNER JOIN with examples\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-e4": makeEntry(
    [
      "This exercise — \"Optimize a slow SQL query\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w7-e5": makeEntry(
    [
      "This exercise — \"Review your JDBC code\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Paste your code with a one-sentence class responsibility. Request specific feedback: naming, SOLID, duplication, error handling — not vague \"make it better.\"",
      "Apply one suggestion at a time, run tests or main after each change. Batch refactors without tests invite regressions.",
      "For comparisons (ArrayList vs LinkedList, JWT vs sessions), build a table: access pattern, memory, thread safety, Spring support. Pick a winner for your scenario with justification.",
      "Peer review: swap code with a classmate and see if they agree with AI suggestions. Human disagreement teaches judgment AI cannot.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-e6": makeEntry(
    [
      "This exercise — \"Generate JUnit test cases\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-e7": makeEntry(
    [
      "This exercise — \"Explain SQL normalization\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "The analytics team needs a reliable student enrollment report. You design normalized tables, optimize JOIN queries with verified indexes, and hand DBAs a Flyway script tested on a staging clone — standard backend ownership with AI accelerating drafts you still validate."
  ),
  "ai-w7-e8": makeEntry(
    [
      "This exercise — \"Create an ER diagram for your project\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-e9": makeEntry(
    [
      "This exercise — \"Suggest indexes for better performance\" — applies AI-assisted learning while generating and optimizing SQL queries and JDBC code with AI. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Model entities on paper first: entities, relationships, cardinality. Normalize to 3NF unless read patterns justify denormalization with documented trade-offs.",
      "Run EXPLAIN ANALYZE on slow queries; add composite indexes matching WHERE and JOIN columns leftmost prefix rules.",
      "MongoDB aggregations: build pipeline stage by stage in Compass, then export to Java MongoTemplate or Spring Data @Aggregation.",
      "Flyway scripts should be idempotent in spirit — one change per version, never edit applied migrations.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review.",
    "EXPLAIN ANALYZE\nSELECT o.id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'SHIPPED';"
  ),
  "ai-w7-t1": makeEntry(
    [
      "Using AI to generate SQL queries is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t10": makeEntry(
    [
      "AI limitations in SQL generation is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Models hallucinate APIs, misstate Java version behavior, and invent library methods. They also lack access to your private codebase unless you paste it. Never merge AI suggestions without compiling, running tests, and reading diffs line by line.",
      "Debugging assistance is high-value; architectural decisions from AI alone are risky. When AI suggests a design pattern, ask why it fits your constraints — team size, traffic, existing Spring modules — before adopting it.",
      "Log cases where AI was wrong and what you did to catch it. That log becomes interview gold: \"Copilot suggested ArrayList.remove in a foreach — I knew ConcurrentModificationException and fixed it.\" Shows professional skepticism.",
      "Set personal rules: no pasting production secrets, no trusting generated SQL on prod, no skipping tests because \"AI said it works.\" Those boundaries keep you employable on real teams.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t2": makeEntry(
    [
      "AI for database schema design is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 7 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t3": makeEntry(
    [
      "AI for ER diagram suggestions is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Describe tables with column types and relationships when asking for SQL. AI-generated JOINs often assume column names you do not have. Run EXPLAIN on PostgreSQL or MySQL before trusting performance advice.",
      "Always use PreparedStatement or JPA parameters — never concatenate user input. AI occasionally shows string-built SQL; reject those patterns immediately.",
      "For Hibernate N+1 issues, paste entity mappings and the service method triggering queries. AI can suggest @EntityGraph or fetch joins, but verify with Hibernate statistics or datasource-proxy logging.",
      "Schema changes belong in Flyway/Liquibase scripts reviewed like application code. AI-drafted migrations still need rollback plans and staging validation.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t4": makeEntry(
    [
      "AI for query optimization is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Measure before optimizing. AI may suggest parallelStream everywhere, but fork/join overhead hurts small collections. Profile with JFR or simple nanoTime loops on realistic data sizes from your app.",
      "Big-O intuition matters: nested loops on user lists become painful at 10k rows. HashMap lookups amortize to O(1) for many access patterns. Ask AI for complexity analysis, then validate with a quick benchmark class in src/test.",
      "Concurrency bugs are intermittent. AI can explain happens-before and synchronized blocks, but you must write stress tests that run threads in loops to reproduce race conditions.",
      "Prefer clarity over clever Streams in team code unless the pipeline is genuinely shorter and well-tested. Interviewers often ask you to read a Stream aloud — practice that skill.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t5": makeEntry(
    [
      "AI for explaining execution plans is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI for explaining execution plans connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI for explaining execution plans after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t6": makeEntry(
    [
      "AI for writing CRUD operations is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI for writing CRUD operations connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI for writing CRUD operations after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t7": makeEntry(
    [
      "AI for generating unit tests is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI-generated test ideas cover happy path well but miss null, boundary, and concurrent cases. Add tests for empty collections, max integer values, and invalid enum strings yourself.",
      "In Spring Boot use @WebMvcTest for controllers, @DataJpaTest for repositories, and @MockBean for external AI clients so tests do not hit paid APIs in CI.",
      "Name tests with Given_When_Then or shouldExpectedBehavior_whenCondition style so failures read like specifications.",
      "Golden-file tests for AI responses are flaky if you assert exact wording — assert structure, JSON schema, or semantic similarity thresholds instead.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t8": makeEntry(
    [
      "AI for JDBC debugging is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste the full stack trace, the smallest reproducible code, and what you expected. Read traces bottom-up: Caused by lines point to root exceptions; your code appears with file names and line numbers. AI helps translate jargon but you must verify the fix in your IDE.",
      "NullPointerException, ArrayIndexOutOfBoundsException, and NumberFormatException dominate beginner Java. Learn their typical causes so you spot AI mistakes — e.g., suggesting .length on a null array reference without a guard.",
      "Use the debugger: breakpoints beat println for multithreaded or loop-heavy bugs. Ask AI to explain what the debugger shows at a specific line, not to replace stepping through code yourself.",
      "Document each bug fix in commit messages. Future you (and interviewers reviewing GitHub) will see a trail of professional debugging, not random trial-and-error.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w7-t9": makeEntry(
    [
      "AI for code documentation is essential when generating and optimizing SQL queries and JDBC code with AI. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 7 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "A reporting query times out in staging. You share EXPLAIN output and schema with AI, add a composite index on (status, created_at), cut runtime from 12s to 200ms, and capture the migration in Flyway for DBA review."
  ),
  "ai-w8-e1": makeEntry(
    [
      "This exercise — \"Generate API documentation\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e10": makeEntry(
    [
      "This exercise — \"Explain REST architecture with real-world examples\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Explain REST architecture with real-world examples. in a real deployment."
  ),
  "ai-w8-e2": makeEntry(
    [
      "This exercise — \"Review your REST API design\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e3": makeEntry(
    [
      "This exercise — \"Suggest better endpoint names\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Suggest better endpoint names. in a real deployment.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e4": makeEntry(
    [
      "This exercise — \"Explain HTTP status codes\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Explain HTTP status codes. in a real deployment."
  ),
  "ai-w8-e5": makeEntry(
    [
      "This exercise — \"Generate Postman test cases\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e6": makeEntry(
    [
      "This exercise — \"Generate JSON request bodies\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Generate JSON request bodies. in a real deployment."
  ),
  "ai-w8-e7": makeEntry(
    [
      "This exercise — \"Create API validation rules\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e8": makeEntry(
    [
      "This exercise — \"Review REST best practices\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Review REST best practices. in a real deployment.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w8-e9": makeEntry(
    [
      "This exercise — \"Identify security issues in an API\" — applies AI-assisted learning while calling AI APIs from Java and handling JSON request/response structures. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w8-t1": makeEntry(
    [
      "What is an AI API is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "an AI API is not abstract theory — it directly affects how you write Java, design classes, or integrate APIs. Start with the official definition, then map it to a concrete artifact in your IDE: a method, a configuration class, or a failing test. When you can point to code that demonstrates the idea, you truly understand it.",
      "Common mistakes include treating AI output as documentation without verification. Always cross-check against JDK docs, Spring reference guides, or your running application. If the AI mentions a class or annotation, open the dependency source or Javadoc and confirm it exists in your version.",
      "In team settings, being able to explain an AI API in one minute signals maturity. Practice summarizing: what problem it solves, when to use it, and one Java example. Interviewers often ask \"explain X to a junior\" — this topic prepares you for that format.",
      "Build a habit: after reading about an AI API, write a 10-line Java snippet or Spring configuration that uses it. Commit it to your learning repo with a README note. Portfolio evidence beats memorized definitions.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring What is an AI API? in a real deployment."
  ),
  "ai-w8-t10": makeEntry(
    [
      "AI for API Testing is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring AI for API Testing in a real deployment."
  ),
  "ai-w8-t2": makeEntry(
    [
      "REST API vs AI API is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring REST API vs AI API in a real deployment."
  ),
  "ai-w8-t3": makeEntry(
    [
      "Calling AI APIs from Java is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Calling AI APIs from Java in a real deployment."
  ),
  "ai-w8-t4": makeEntry(
    [
      "Prompt Templates is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Prompt Templates in a real deployment."
  ),
  "ai-w8-t5": makeEntry(
    [
      "JSON Request Structure is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring JSON Request Structure in a real deployment."
  ),
  "ai-w8-t6": makeEntry(
    [
      "JSON Response Parsing is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring JSON Response Parsing in a real deployment."
  ),
  "ai-w8-t7": makeEntry(
    [
      "Error Handling is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Error Handling connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Error Handling after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring Error Handling in a real deployment."
  ),
  "ai-w8-t8": makeEntry(
    [
      "API Documentation with AI is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 8 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring API Documentation with AI in a real deployment."
  ),
  "ai-w8-t9": makeEntry(
    [
      "AI-assisted Swagger Documentation is essential when calling AI APIs from Java and handling JSON request/response structures. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Paste one class at a time with its responsibility stated. Ask AI for naming improvements, missing encapsulation, or Law of Demeter violations. Compare suggestions against your team's style guide — AI defaults to generic Java, not your company's conventions.",
      "Code smells like long methods, feature envy, and primitive obsession appear in student projects early. Fixing them in Week 8 prevents bad habits before Spring Boot multiplies class count.",
      "Human review catches domain mistakes AI misses — wrong business rule in a discount calculation, for example. Use AI for mechanical cleanup (extract method, rename) and humans for correctness.",
      "Generate Javadoc only for public APIs you expect others to call. Over-commenting private helpers adds noise. Good names plus small methods often need no comments.",
    ],
    "Your team integrates OpenAI summarization into a Spring Boot notification service. You implement RestClient with timeout, map JSON to records, handle 429 with RetryTemplate, and store the API key in Kubernetes secrets — mirroring AI-assisted Swagger Documentation in a real deployment."
  ),
  "ai-w9-e1": makeEntry(
    [
      "This exercise — \"Review your Spring Security configuration\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-e10": makeEntry(
    [
      "This exercise — \"Identify common authentication mistakes\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-e2": makeEntry(
    [
      "This exercise — \"Identify security vulnerabilities in your API\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-e3": makeEntry(
    [
      "This exercise — \"Explain JWT token flow step by step\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off."
  ),
  "ai-w9-e4": makeEntry(
    [
      "This exercise — \"Compare: JWT vs Sessions\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "A payment API you maintain must pass PCI-adjacent review. You demonstrate PreparedStatement usage, JWT validation filters, and blocked prompt-injection patterns in your AI wrapper before security sign-off.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-e5": makeEntry(
    [
      "This exercise — \"Generate secure password validation rules\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Use AI to draft schemas, UML, or test cases, then validate against requirements. ER diagrams need cardinalities and keys matching your actual Flyway scripts.",
      "For SQL generation, run CREATE TABLE in a local Docker Postgres instance. Fix type mismatches and missing FK constraints the model omitted.",
      "Version generated artifacts in git — prompts and outputs together — so you can reproduce or audit decisions later.",
      "Extend the generated baseline with one feature AI did not suggest (e.g., soft delete column, audit timestamps) to practice ownership.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-e6": makeEntry(
    [
      "This exercise — \"Review your login API\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-e7": makeEntry(
    [
      "This exercise — \"Explain BCrypt hashing\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Ask AI for a step-by-step trace with concrete variable values at each line. For loops, track iterator/index, condition result, and body execution. Rewrite the trace in your notebook without looking — that proves you understand control flow.",
      "Translate the explanation into a minimal Java class in src/main/java and run it. Change inputs to hit edge cases: zero, negative, empty array, single element.",
      "Compare AI's trace to your manual trace. Discrepancies reveal misunderstandings about break, continue, or off-by-one errors — common interview topics.",
      "Add a JUnit test for each edge case you discovered. Tests lock in understanding better than rereading paragraphs.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-e8": makeEntry(
    [
      "This exercise — \"Suggest secure REST API practices\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Document one resource end-to-end: path, verb, request schema, 200/400/404 responses, and example JSON. springdoc-openapi can generate from @Operation annotations — keep descriptions meaningful.",
      "Postman tests should assert status code, response time threshold, and JSON fields. Store collection in repo under /postman for CI Newman runs.",
      "Naming: plural nouns (/students/{id}), avoid verbs in URLs, use query params for filter/sort/page. Align error body shape across endpoints.",
      "Rate limiting and CORS belong in config reviewed with DevOps — document allowed origins and burst limits in README.",
    ],
    "Mobile developers consume your Spring REST API. You publish accurate OpenAPI, share a Postman collection with environment variables, and fix a 422 validation gap they reported — collaboration that depends on exercise-quality API docs, not tribal knowledge.",
    "{\n  \"page\": 0,\n  \"size\": 20,\n  \"sort\": \"createdAt,desc\"\n}"
  ),
  "ai-w9-e9": makeEntry(
    [
      "This exercise — \"Create authentication flow diagrams\" — applies AI-assisted learning while securing AI integrations with API keys, env vars, and prompt injection awareness. Do the thinking first: attempt the problem in Java or SQL yourself for at least 15 minutes, then use AI to compare approaches, not to skip the work entirely.",
      "Audit Spring Security config: CSRF rules, permitAll vs authenticated paths, password encoder bean, session vs stateless JWT. AI can list OWASP API Top 10 checks — walk through each against your codebase.",
      "Trace JWT flow on paper: login → token issue → Authorization header → filter validation → SecurityContext. Implement missing refresh or logout if your app needs it.",
      "Never log tokens or API keys. Use structured logs with request IDs for auth failures without leaking credentials.",
      "Test unauthorized access returns 401/403, not 500 with stack traces exposed to clients.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live.",
    "@Bean\nPasswordEncoder passwordEncoder() {\n  return new BCryptPasswordEncoder(12);\n}"
  ),
  "ai-w9-t1": makeEntry(
    [
      "AI API Authentication is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t10": makeEntry(
    [
      "Responsible AI Usage is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Responsible AI Usage connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Responsible AI Usage after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t2": makeEntry(
    [
      "API Keys is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Treat AI APIs like any third-party HTTP dependency: timeouts, retries with backoff, circuit breakers, and structured logging. In Spring Boot use RestClient or WebClient with connection pools sized for your traffic.",
      "JSON mapping with Jackson requires consistent field naming (@JsonProperty when external APIs differ). Ask AI for DTO examples, then write round-trip tests that serialize and deserialize sample payloads.",
      "OpenAPI documents are contracts. Generate them from annotations or write-first specs; keep Postman collections in sync so QA can regression-test without reading Java.",
      "Return appropriate HTTP status codes: 400 for malformed input, 404 for missing resources, 409 for conflicts, 422 for semantic validation failures. AI can draft error response schemas — align them with RFC 7807 Problem Details if your team uses them.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t3": makeEntry(
    [
      "Environment Variables is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Environment Variables connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining Environment Variables after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t4": makeEntry(
    [
      "Secret Management is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Store API keys in environment variables or secret managers (AWS Secrets Manager, Vault), never in application.properties committed to Git. Spring Boot reads ${OPENAI_API_KEY} from the environment at runtime.",
      "Prompt injection happens when user text manipulates the model (\"ignore previous instructions\"). Sanitize or separate system and user channels; validate model output before executing tool calls or SQL.",
      "Spring Security with JWT: understand filter chain order, token expiry, refresh flows, and why BCrypt with strength 10+ beats MD5/SHA for passwords. AI sometimes suggests outdated crypto — reject it.",
      "Run OWASP dependency-check and review CORS, CSRF, and authorization on every new endpoint. Security is not a Week 9 checkbox; it is release criteria.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t5": makeEntry(
    [
      "Prompt Injection Basics is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t6": makeEntry(
    [
      "AI Security Risks is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Store API keys in environment variables or secret managers (AWS Secrets Manager, Vault), never in application.properties committed to Git. Spring Boot reads ${OPENAI_API_KEY} from the environment at runtime.",
      "Prompt injection happens when user text manipulates the model (\"ignore previous instructions\"). Sanitize or separate system and user channels; validate model output before executing tool calls or SQL.",
      "Spring Security with JWT: understand filter chain order, token expiry, refresh flows, and why BCrypt with strength 10+ beats MD5/SHA for passwords. AI sometimes suggests outdated crypto — reject it.",
      "Run OWASP dependency-check and review CORS, CSRF, and authorization on every new endpoint. Security is not a Week 9 checkbox; it is release criteria.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t7": makeEntry(
    [
      "Secure Prompt Design is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "Structure prompts with role (\"You are a Java tutor\"), context (your JDK version, framework, error message), task (explain, refactor, generate tests), format (bullet list, code block only), and constraints (\"no libraries beyond java.util\"). Vague prompts yield code that uses patterns you have not learned yet.",
      "For loop and control-flow work, include sample input/output. Example: \"Given int[] scores, write a for-loop that counts passing grades >= 40. Handle empty array.\" The AI cannot infer your grading rules from silence.",
      "Iterative prompting means refining: first ask for explanation, then ask for edge cases, then ask for JUnit tests. Each round should reference the previous answer (\"In your loop, what happens when scores is null?\"). This mirrors how you collaborate with teammates on pull requests.",
      "Save effective prompts in a snippets file in your repo. Reusable prompt templates speed up debugging during hackathons and on-call incidents when stress makes you forget details.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t8": makeEntry(
    [
      "AI Output Validation is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI Output Validation connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI Output Validation after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  ),
  "ai-w9-t9": makeEntry(
    [
      "AI Response Filtering is essential when securing AI integrations with API keys, env vars, and prompt injection awareness. As a Java developer building backend services, you will use this skill to get accurate, actionable answers from AI instead of vague suggestions that do not compile. Treat every AI interaction like a code review request: give enough detail that a senior engineer could reproduce your intent without guessing.",
      "AI Response Filtering connects theory to the Java code you write this week. Open your IDE side-by-side with AI chat: ask focused questions, implement suggestions incrementally, and run after every small change.",
      "Relate the concept to patterns you already know — classes, interfaces, collections, or REST controllers — so new material attaches to existing mental models instead of floating as trivia.",
      "When stuck, narrow the question: include method signature, sample input, and actual vs expected output. That discipline transfers directly to Stack Overflow, Jira tickets, and pair programming.",
      "Record a two-minute voice note explaining AI Response Filtering after you implement it. If you stumble, you have a gap to fill before moving on.",
    ],
    "Security audit flags hardcoded test passwords and missing JWT expiry checks. You rotate credentials via env vars, enable BCrypt strength 12, add integration tests for expired tokens, and pass the pen-test checklist before go-live."
  )
};

function fallbackTopic(weekNum, id, title) {
  const ctx = WEEK_CONTEXT[weekNum] ?? "building production Java backends with AI assistance";
  return {
    answer: [
      `${title} supports ${ctx}.`,
      "Structure your AI requests with concrete Java context: class names, method signatures, JDK version, and expected behavior.",
      "Verify every suggestion by compiling and running code in your IDE before trusting it for assignments or production.",
      "Save effective prompts and outcomes in your learning repository to build reusable patterns for debugging and design reviews.",
    ].join("\n\n"),
    realWorld: `A mid-size product company hires Java developers who can explain ${title} while shipping tested Spring Boot features — not developers who copy AI output without validation.`,
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
