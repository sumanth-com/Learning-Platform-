/**
 * Category-specific fallbacks — still unique per topic, never cross-category reuse.
 */
import {
  buildJavaLessons,
  buildOopLessons,
  buildCollectionsLessons,
  buildJava8Lessons,
  buildMultithreadingLessons,
  buildDsaLessons,
  buildSqlLessons,
  buildDbDesignLessons,
  buildJdbcLessons,
  buildRestLessons,
  buildSpringLessons,
  buildHibernateLessons,
  buildSecurityLessons,
  buildMongoLessons,
  buildGitLessons,
  buildAiLessons,
} from "./builders.mjs";

function javaCode(cls, body) {
  return `public class ${cls} {\n    public static void main(String[] args) {\n${body}\n    }\n}`;
}

function clsFrom(slug, tier, i) {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("") + tier[0].toUpperCase() + i;
}

function javaFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildJavaLessons(weekId, slug, title, {
    easy: [
      { title: `${title} — Syntax Basics`, description: `Learn core syntax for ${title}.`, explanation: `Foundation concept: ${title}.`, syntax: `// ${title} basic syntax`, code: javaCode(clsFrom(slug, "easy", 1), `        System.out.println("${title}: basic syntax");\n        int demo = 42;\n        System.out.println("demo = " + demo);`), filename: `${clsFrom(slug, "easy", 1)}.java`, expectedOutput: `${title}: basic syntax\ndemo = 42`, commonMistakes: ["Skipping semicolons", "Wrong variable scope"], interviewTips: [`Explain ${title} in 30 seconds`], practiceQuestions: [`Write minimal ${title} example`] },
      { title: `${title} — Worked Example`, description: `Step-by-step ${title} walkthrough.`, explanation: "Trace each line before running.", code: javaCode(clsFrom(slug, "easy", 2), `        System.out.println("Step 1: declare");\n        System.out.println("Step 2: ${title}");\n        System.out.println("Step 3: output");`), filename: `${clsFrom(slug, "easy", 2)}.java`, expectedOutput: "Step 1: declare\nStep 2: ...\nStep 3: output", commonMistakes: ["Not reading error messages"], interviewTips: ["Dry-run on paper"], practiceQuestions: ["Modify output format"] },
      { title: `${title} — Quick Practice`, description: `Short exercise on ${title}.`, explanation: "Apply concept immediately.", code: javaCode(clsFrom(slug, "easy", 3), `        // TODO: practice ${title}\n        System.out.println("Practice: ${title} complete");`), filename: `${clsFrom(slug, "easy", 3)}.java`, expectedOutput: `Practice: ${title} complete`, commonMistakes: ["Copy-pasting without understanding"], interviewTips: ["Explain your approach aloud"], practiceQuestions: ["Change one variable and predict output"] },
    ],
    medium: [
      { title: `${title} — Interview Scenario`, description: `Common interview question on ${title}.`, explanation: "Combine two sub-concepts.", code: javaCode(clsFrom(slug, "med", 1), `        System.out.println("Interview: ${title}");\n        System.out.println("Explain trade-offs and edge cases");`), filename: `${clsFrom(slug, "med", 1)}.java`, expectedOutput: `Interview: ${title}\nExplain trade-offs and edge cases`, commonMistakes: ["Ignoring edge cases"], interviewTips: ["State time/space complexity if applicable"], practiceQuestions: ["List 3 edge cases"] },
      { title: `${title} — Real-World Use`, description: `Where ${title} appears in backend systems.`, explanation: "Connect to Spring/API/database layers.", code: javaCode(clsFrom(slug, "med", 2), `        System.out.println("Production: ${title}");\n        System.out.println("Used in: service layer validation");`), filename: `${clsFrom(slug, "med", 2)}.java`, expectedOutput: `Production: ${title}\nUsed in: service layer validation`, commonMistakes: ["Over-engineering simple cases"], interviewTips: ["Give a real project example"], practiceQuestions: ["Map to your capstone project"] },
      { title: `${title} — Debug Exercise`, description: `Find and fix bug related to ${title}.`, explanation: "Debugging is daily backend work.", code: javaCode(clsFrom(slug, "med", 3), `        int x = 5;\n        // Bug: should print 10\n        System.out.println("Result: " + (x + x));`), filename: `${clsFrom(slug, "med", 3)}.java`, expectedOutput: "Result: 10", commonMistakes: ["Not using debugger breakpoints"], interviewTips: ["Explain your debug process"], practiceQuestions: ["Introduce bug, then fix"] },
    ],
    hard: [
      { title: `${title} — LeetCode Style`, description: `Algorithm challenge using ${title}.`, explanation: "Optimize for time and space.", code: javaCode(clsFrom(slug, "hard", 1), `        // Hard: optimize ${title}\n        System.out.println("Target: O(n) solution");\n        System.out.println("Pattern: ${title}");`), filename: `${clsFrom(slug, "hard", 1)}.java`, expectedOutput: `Target: O(n) solution\nPattern: ${title}`, commonMistakes: ["Brute force when pattern exists"], interviewTips: ["Identify pattern first (two-pointer, hash, etc.)"], practiceQuestions: ["Solve on paper before coding"], hiddenSolution: "See pattern hint in explanation panel." },
      { title: `${title} — HackerRank Challenge`, description: `Timed coding challenge.`, explanation: "10-minute constraint — plan first.", code: javaCode(clsFrom(slug, "hard", 2), `        System.out.println("HackerRank: ${title}");\n        System.out.println("Handle constraints: n up to 10^5");`), filename: `${clsFrom(slug, "hard", 2)}.java`, expectedOutput: `HackerRank: ${title}\nHandle constraints: n up to 10^5`, commonMistakes: ["TLE from O(n²) nested loops"], interviewTips: ["Clarify constraints with interviewer"], practiceQuestions: ["Test with max input size"] },
      { title: `${title} — Production Refactor`, description: `Refactor messy code using ${title} correctly.`, explanation: "Clean code for maintainability.", code: javaCode(clsFrom(slug, "hard", 3), `        System.out.println("Refactor: extract methods");\n        System.out.println("Apply ${title} best practices");`), filename: `${clsFrom(slug, "hard", 3)}.java`, expectedOutput: "Refactor: extract methods\nApply ... best practices", commonMistakes: ["God methods over 50 lines"], interviewTips: ["SOLID principles apply"], practiceQuestions: ["Code review your own solution"] },
    ],
  });
}

function oopFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildOopLessons(weekId, slug, {
    easy: [
      { title: `${title} — Class Blueprint`, description: `Define a class demonstrating ${title}.`, explanation: "OOP models real entities.", syntax: "class Employee { private String name; }", code: javaCode("EmployeeBasic", `        System.out.println("${title}: class blueprint");\n        System.out.println("Fields + methods = object behavior");`), filename: "EmployeeBasic.java", expectedOutput: `${title}: class blueprint\nFields + methods = object behavior`, commonMistakes: ["Public fields instead of encapsulation"], interviewTips: ["Explain IS-A vs HAS-A"], practiceQuestions: ["Draw class diagram"] },
      { title: `${title} — Create Object`, description: "Instantiate and call methods.", explanation: "new keyword allocates heap object.", code: javaCode("CreateObject", `        System.out.println("new ClassName() → heap object");\n        System.out.println("Reference on stack points to heap");`), filename: "CreateObject.java", expectedOutput: "new ClassName() → heap object\nReference on stack points to heap", memoryDiagram: "Stack: ref → Heap: Object instance", commonMistakes: ["Null reference before new"], interviewTips: ["Stack vs heap for objects"], practiceQuestions: ["Create 2 objects, compare references"] },
      { title: `${title} — Mini Example`, description: "Minimal working OOP demo.", explanation: "Start small, then extend.", code: javaCode("OopMini", `        System.out.println("Mini ${title} demo ready");`), filename: "OopMini.java", expectedOutput: `Mini ${title} demo ready`, commonMistakes: ["Missing default constructor when needed"], interviewTips: ["When to use static"], practiceQuestions: ["Add one method to class"] },
    ],
    medium: [
      { title: `${title} — Design Exercise`, description: "Design class hierarchy.", explanation: "Apply SOLID — single responsibility.", code: javaCode("OopDesign", `        System.out.println("Design: ${title}");\n        System.out.println("Extract interfaces for flexibility");`), filename: "OopDesign.java", expectedOutput: `Design: ${title}\nExtract interfaces for flexibility`, commonMistakes: ["Deep inheritance trees"], interviewTips: ["Favor composition over inheritance"], practiceQuestions: ["Refactor to interface"] },
      { title: `${title} — Interview Question`, description: "Explain with example.", explanation: "30-second answer structure.", code: javaCode("OopInterview", `        System.out.println("Q: Explain ${title}?");\n        System.out.println("A: Definition + example + when to use");`), filename: "OopInterview.java", expectedOutput: `Q: Explain ${title}?\nA: Definition + example + when to use`, commonMistakes: ["Vague definitions without example"], interviewTips: ["Draw UML if whiteboard"], practiceQuestions: ["Compare with related OOP concept"] },
      { title: `${title} — Code Review`, description: "Review OOP design flaws.", explanation: "Spot encapsulation violations.", code: javaCode("OopReview", `        System.out.println("Review: ${title}");\n        System.out.println("Check: access modifiers, coupling");`), filename: "OopReview.java", expectedOutput: `Review: ${title}\nCheck: access modifiers, coupling`, commonMistakes: ["Tight coupling between classes"], interviewTips: ["Loose coupling via interfaces"], practiceQuestions: ["List 3 improvements"] },
    ],
    hard: [
      { title: `${title} — System Design OOP`, description: "Model domain for e-commerce.", explanation: "Entities: Order, Product, Customer, Payment.", code: javaCode("OopSystem", `        System.out.println("Model: ${title} in e-commerce");\n        System.out.println("Order HAS-A List<Product>");`), filename: "OopSystem.java", expectedOutput: `Model: ${title} in e-commerce\nOrder HAS-A List<Product>`, commonMistakes: ["Anemic domain model — logic in services only"], interviewTips: ["DDD bounded contexts"], practiceQuestions: ["Draw ER + class diagram"], hiddenSolution: "Use factory pattern for Payment types." },
      { title: `${title} — Polymorphism Challenge`, description: "Extensible design without if-else chains.", explanation: "Strategy pattern application.", code: javaCode("OopPoly", `        System.out.println("Replace switch with polymorphism");\n        System.out.println("Topic: ${title}");`), filename: "OopPoly.java", expectedOutput: "Replace switch with polymorphism\nTopic: ...", commonMistakes: ["instanceof chains"], interviewTips: ["Open/closed principle"], practiceQuestions: ["Add new type without modifying existing"] },
      { title: `${title} — Production Pattern`, description: "Apply design pattern.", explanation: "Factory, Builder, or Observer as fits.", code: javaCode("OopPattern", `        System.out.println("Pattern for ${title}");\n        System.out.println("Document why you chose it");`), filename: "OopPattern.java", expectedOutput: `Pattern for ${title}\nDocument why you chose it`, commonMistakes: ["Pattern for pattern's sake"], interviewTips: ["YAGNI — don't over-pattern"], practiceQuestions: ["When NOT to use this pattern"] },
    ],
  });
}

function sqlFallback(weekId, topic) {
  const { slug, title } = topic;
  const schema = [{ table: "users", columns: [{ name: "id", type: "INT" }, { name: "name", type: "VARCHAR" }, { name: "email", type: "VARCHAR" }] }];
  const data = [{ table: "users", rows: [["1", "Alice", "a@x.com"], ["2", "Bob", "b@x.com"]] }];
  return buildSqlLessons(weekId, slug, {
    easy: [
      { title: `${title} — SELECT Basics`, description: `Basic query for ${title}.`, schema, sampleData: data, query: "SELECT id, name FROM users;", expectedResult: { columns: ["id", "name"], rows: [["1", "Alice"], ["2", "Bob"]] }, executionExplanation: `Introduction to ${title} — reads from users table.`, commonMistakes: ["SELECT * in production APIs"] },
      { title: `${title} — WHERE Filter`, description: "Filter rows.", schema, sampleData: data, query: "SELECT * FROM users WHERE id = 1;", expectedResult: { columns: ["id", "name", "email"], rows: [["1", "Alice", "a@x.com"]] }, executionExplanation: "WHERE reduces rows before returning.", commonMistakes: ["String vs int in WHERE id = '1'"] },
      { title: `${title} — INSERT Row`, description: "Add data.", schema, sampleData: data, query: "INSERT INTO users (name, email) VALUES ('Carol', 'c@x.com');", expectedResult: { columns: ["result"], rows: [["1 row inserted"]] }, executionExplanation: "INSERT adds new row. Auto-increment handles id.", commonMistakes: ["Forgetting required NOT NULL columns"] },
    ],
    medium: [
      { title: `${title} — UPDATE & DELETE`, description: "Modify and remove.", schema, sampleData: data, query: "UPDATE users SET email = 'new@x.com' WHERE id = 2;\nDELETE FROM users WHERE id = 1;", expectedResult: { columns: ["operation"], rows: [["UPDATE 1 row, DELETE 1 row"]] }, executionExplanation: "Always use WHERE on UPDATE/DELETE!", commonMistakes: ["UPDATE without WHERE — disaster"] },
      { title: `${title} — GROUP BY`, description: "Aggregation.", schema, sampleData: data, query: "SELECT COUNT(*) AS total FROM users;", expectedResult: { columns: ["total"], rows: [["2"]] }, executionExplanation: "Aggregates collapse rows.", commonMistakes: ["SELECT non-aggregated columns without GROUP BY"] },
      { title: `${title} — JOIN Intro`, description: "Combine tables.", schema: [...schema, { table: "orders", columns: [{ name: "id", type: "INT" }, { name: "user_id", type: "INT" }] }], sampleData: [...data, { table: "orders", rows: [["1", "1"]] }], query: "SELECT u.name, o.id FROM users u JOIN orders o ON u.id = o.user_id;", expectedResult: { columns: ["name", "id"], rows: [["Alice", "1"]] }, executionExplanation: "JOIN links related tables.", commonMistakes: ["Cartesian product"] },
    ],
    hard: [
      { title: `${title} — Window Function`, description: "ROW_NUMBER ranking.", schema, sampleData: data, query: "SELECT name, ROW_NUMBER() OVER (ORDER BY name) AS rn FROM users;", expectedResult: { columns: ["name", "rn"], rows: [["Alice", "1"], ["Bob", "2"]] }, executionExplanation: "Window functions — no GROUP BY collapse.", commonMistakes: ["Confusing with GROUP BY"] },
      { title: `${title} — Query Optimization`, description: "EXPLAIN plan reading.", schema, sampleData: data, query: "EXPLAIN SELECT * FROM users WHERE email = 'a@x.com';", expectedResult: { columns: ["type", "key"], rows: [["index", "idx_email"]] }, executionExplanation: "Index seek vs full scan.", optimizationTip: "CREATE INDEX idx_email ON users(email);", commonMistakes: ["No index on WHERE/JOIN columns"] },
      { title: `${title} — Transaction`, description: "ACID demo.", schema, sampleData: data, query: "START TRANSACTION;\nUPDATE users SET name = 'Alice B' WHERE id = 1;\nCOMMIT;", expectedResult: { columns: ["status"], rows: [["committed"]] }, executionExplanation: "ROLLBACK on error.", commonMistakes: ["Long-running transactions lock tables"] },
    ],
  });
}

function restFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildRestLessons(weekId, slug, {
    easy: [
      { title: `${title} — GET Endpoint`, description: "Read resource.", endpoint: `/api/${slug}`, method: "GET", headers: { Accept: "application/json" }, responseBody: `{"topic": "${title}", "status": "ok"}`, statusCode: 200, postmanExample: `GET /api/${slug}`, curlExample: `curl /api/${slug}`, apiDiagram: "Client → API Gateway → Controller", commonMistakes: ["Verb in URL"] },
      { title: `${title} — POST Create`, description: "Create resource.", endpoint: `/api/${slug}`, method: "POST", headers: { "Content-Type": "application/json" }, requestBody: '{"name": "example"}', responseBody: '{"id": 1, "name": "example"}', statusCode: 201, postmanExample: "POST with JSON body", curlExample: "curl -X POST -d '{}'", apiDiagram: "Validate → Service → Repository", commonMistakes: ["201 vs 200"] },
      { title: `${title} — Status Codes`, description: "HTTP semantics.", endpoint: `/api/${slug}/1`, method: "GET", headers: {}, responseBody: "404 if not found, 200 if found", statusCode: 200, postmanExample: "Test 404 case", curlExample: "curl -i for headers", apiDiagram: "2xx success | 4xx client | 5xx server", commonMistakes: ["500 for validation errors"] },
    ],
    medium: [
      { title: `${title} — Error Handling`, description: "@ControllerAdvice.", endpoint: `/api/${slug}`, method: "POST", headers: {}, requestBody: "{}", responseBody: '{"errors":[{"field":"name","msg":"required"}]}', statusCode: 400, postmanExample: "Structured validation errors", curlExample: "curl -X POST", apiDiagram: "Exception → GlobalHandler → JSON error", commonMistakes: ["Stack trace in response"] },
      { title: `${title} — Pagination`, description: "Pageable results.", endpoint: `/api/${slug}?page=0&size=10`, method: "GET", headers: {}, responseBody: '{"content":[],"totalElements":0}', statusCode: 200, postmanExample: "Pageable param", curlExample: "curl with query params", apiDiagram: "Page<T> in Spring", commonMistakes: ["Unbounded list endpoints"] },
      { title: `${title} — HATEOAS`, description: "Hypermedia links.", endpoint: `/api/${slug}/1`, method: "GET", headers: {}, responseBody: '{"id":1,"_links":{"self":{"href":"/api/..."}}}', statusCode: 200, postmanExample: "Spring HATEOAS", curlExample: "curl", apiDiagram: "Links guide client navigation", commonMistakes: ["Breaking links on version change"] },
    ],
    hard: [
      { title: `${title} — Design API`, description: "Design from requirements.", endpoint: `/api/v1/${slug}`, method: "POST", headers: {}, requestBody: "Full OpenAPI spec", responseBody: "OpenAPI 3.0 YAML", statusCode: 201, postmanExample: "Design first, code second", curlExample: "Import OpenAPI to Postman", apiDiagram: "Requirements → OpenAPI → Implementation", commonMistakes: ["Code-first without contract"] },
      { title: `${title} — Idempotency`, description: "PUT/DELETE semantics.", endpoint: `/api/${slug}/1`, method: "PUT", headers: { "Idempotency-Key": "uuid" }, requestBody: "{}", responseBody: "Same result on retry", statusCode: 200, postmanExample: "Retry safe PUT", curlExample: "curl -X PUT", apiDiagram: "Idempotent: 1 call = N calls same effect", commonMistakes: ["POST for updates"] },
      { title: `${title} — Rate Limiting`, description: "429 Too Many Requests.", endpoint: `/api/${slug}`, method: "GET", headers: { "X-RateLimit-Remaining": "0" }, responseBody: '{"error":"rate limit exceeded"}', statusCode: 429, postmanExample: "Bucket4j / Redis limiter", curlExample: "curl -i see 429", apiDiagram: "Gateway → rate limiter → service", commonMistakes: ["No rate limit on auth endpoints"] },
    ],
  });
}

function gitFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildGitLessons(weekId, slug, {
    easy: [
      { title: `${title} — Basic Command`, description: "Essential git command.", command: `git ${slug.includes("branch") ? "branch" : "status"}`, terminalOutput: `On branch main\n${title}: ready`, workflowDiagram: "Working tree → stage → commit", explanation: `Learn ${title} fundamentals.`, commonMistakes: ["Committing secrets"] },
      { title: `${title} — First Steps`, description: "Common workflow.", command: "git add .\ngit commit -m \"msg\"", terminalOutput: "[main abc123] msg\n 2 files changed", workflowDiagram: "add → commit → push", explanation: "Stage before commit.", commonMistakes: ["git add . without review"] },
      { title: `${title} — Check Log`, description: "View history.", command: "git log --oneline -3", terminalOutput: "abc123 Latest\n def456 Previous", workflowDiagram: "Commit DAG", explanation: "History is immutable.", commonMistakes: ["Force push to shared branch"] },
    ],
    medium: [
      { title: `${title} — Branch Workflow`, description: "Feature branch.", command: "git checkout -b feature/x", terminalOutput: "Switched to branch 'feature/x'", workflowDiagram: "main ── feature/x", explanation: "Isolate work.", commonMistakes: ["Stale branch"] },
      { title: `${title} — Pull Request`, description: "Push and open PR.", command: "git push -u origin feature/x", terminalOutput: "Create PR on GitHub", workflowDiagram: "Push → PR → Review → Merge", explanation: "PR = code review gate.", commonMistakes: ["Huge PRs hard to review"] },
      { title: `${title} — Merge`, description: "Integrate branch.", command: "git merge feature/x", terminalOutput: "Merge made by ort", workflowDiagram: "Fast-forward vs merge commit", explanation: "Resolve conflicts first.", commonMistakes: ["Merge without CI green"] },
    ],
    hard: [
      { title: `${title} — Advanced Workflow`, description: "Rebase vs merge.", command: "git rebase main", terminalOutput: "Successfully rebased", workflowDiagram: "Linear history via rebase", explanation: "Never rebase shared history.", commonMistakes: ["Rebase after push"] },
      { title: `${title} — Recovery`, description: "reflog rescue.", command: "git reflog\ngit reset --hard HEAD@{1}", terminalOutput: "HEAD is now at ...", workflowDiagram: "reflog safety net", explanation: "Recover lost commits.", commonMistakes: ["reset --hard without reflog check"] },
      { title: `${title} — Team Policy`, description: "GitFlow/trunk.", command: "git flow feature start x", terminalOutput: "Feature branch created", workflowDiagram: "GitFlow diagram", explanation: "Agree on team workflow.", commonMistakes: ["No branch protection on main"] },
    ],
  });
}

function aiFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildAiLessons(weekId, slug, {
    easy: [
      { title: `${title} — Concept`, description: "Core AI concept.", concept: title, prompt: `Explain ${title} simply.`, goodPrompt: `Explain ${title} for a Java backend student. 3 paragraphs max with example.`, badPrompt: "explain", aiOutput: `${title} helps you learn faster when used correctly...`, whyAiResponded: "Specific audience + format requested.", exercise: `Write your own prompt for ${title}.` },
      { title: `${title} — Good vs Bad Prompt`, description: "Prompt quality.", concept: "Prompt engineering", prompt: "Help me learn", goodPrompt: `I'm on Week 12 learning ${title}. Give me one practice exercise with solution outline.`, badPrompt: "help", aiOutput: "Good prompts get actionable answers.", whyAiResponded: "Context + constraint = quality.", exercise: "Rewrite a bad prompt." },
      { title: `${title} — Practice`, description: "Hands-on exercise.", concept: title, prompt: `Practice ${title}`, goodPrompt: `Give me a 5-minute exercise for ${title}. Don't give full answer — hints only.`, badPrompt: "do it for me", aiOutput: "Hint 1: Start with...", whyAiResponded: "Hints build learning, not dependency.", exercise: "Complete exercise without full answer." },
    ],
    medium: [
      { title: `${title} — Interview Prep`, description: "Mock question.", concept: "Interview", prompt: `Mock interview ${title}`, goodPrompt: `Ask one ${title} interview question. Wait for my answer. Then critique.`, badPrompt: "interview questions list", aiOutput: "Q: Tell me about...", whyAiResponded: "Interactive > passive list.", exercise: "Record yourself answering." },
      { title: `${title} — Resume Help`, description: "Bullet points.", concept: "Resume", prompt: "Improve resume", goodPrompt: `Rewrite this project bullet for backend role emphasizing ${title}: [paste]`, badPrompt: "resume", aiOutput: "• Built REST API serving 10k req/day...", whyAiResponded: "Paste + role target = tailored output.", exercise: "Update your resume." },
      { title: `${title} — Project Idea`, description: "Portfolio project.", concept: "Projects", prompt: "project idea", goodPrompt: `Suggest capstone project demonstrating ${title} for junior backend portfolio.`, badPrompt: "ideas", aiOutput: "Build order management API with...", whyAiResponded: "Skill-specific project suggestion.", exercise: "Pick one idea, scope MVP." },
    ],
    hard: [
      { title: `${title} — System Design`, description: "Architecture with AI.", concept: "System design", prompt: "design system", goodPrompt: `Design ${title} component for URL shortener at 10k QPS. Trade-offs.`, badPrompt: "design", aiOutput: "Component diagram + scaling...", whyAiResponded: "Constraints drive design.", exercise: "Draw diagram yourself first." },
      { title: `${title} — Ethics & Limits`, description: "When not to use AI.", concept: "Responsible AI", prompt: "AI limits", goodPrompt: `What ${title} tasks should I NOT use AI for while learning?`, badPrompt: "is ai bad", aiOutput: "Don't use AI for: basic syntax drills...", whyAiResponded: "Learning vs productivity balance.", exercise: "One hour no-AI coding." },
      { title: `${title} — Capstone Review`, description: "Full project review.", concept: "Capstone", prompt: "review project", goodPrompt: `Review my capstone architecture for ${title}: security, scaling, testing gaps.`, badPrompt: "check my code", aiOutput: "Gap 1: No integration tests...", whyAiResponded: "Structured review checklist.", exercise: "Fix top 3 gaps." },
    ],
  });
}

function dsaFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildDsaLessons(weekId, slug, {
    easy: [
      { title: `${title} — O(n) Basics`, description: "Linear scan pattern.", explanation: "Single pass through array.", code: javaCode("DsaEasy1", `        int[] a = {3, 1, 4};\n        int max = a[0];\n        for (int v : a) if (v > max) max = v;\n        System.out.println("max = " + max);`), filename: "DsaEasy1.java", expectedOutput: "max = 4", commonMistakes: ["Empty array edge case"], interviewTips: ["State complexity aloud"], practiceQuestions: ["Find min element"] },
      { title: `${title} — Two Sum Intro`, description: "Brute force pair search.", explanation: "Nested loops O(n²).", code: javaCode("TwoSumBF", `        int[] a = {2, 7, 11, 15}; int t = 9;\n        for (int i = 0; i < a.length; i++)\n          for (int j = i+1; j < a.length; j++)\n            if (a[i]+a[j]==t) System.out.println(i+","+j);`), filename: "TwoSumBF.java", expectedOutput: "0,1", commonMistakes: ["Same element twice"], interviewTips: ["Can you do O(n)? HashMap"], practiceQuestions: ["LeetCode #1"] },
      { title: `${title} — String Reverse`, description: "Two pointer on string.", explanation: "Swap chars from both ends.", code: javaCode("StrRev", `        char[] c = "hello".toCharArray();\n        for (int i=0,j=c.length-1;i<j;i++,j--) { char t=c[i]; c[i]=c[j]; c[j]=t; }\n        System.out.println(new String(c));`), filename: "StrRev.java", expectedOutput: "olleh", commonMistakes: ["String immutability"], interviewTips: ["char[] vs StringBuilder"], practiceQuestions: ["Palindrome check"] },
    ],
    medium: [
      { title: `${title} — Binary Search`, description: "Search sorted array.", explanation: "Halve search space each step.", code: javaCode("BinSearch", `        int[] a = {1,3,5,7}; int t=5, l=0,r=a.length-1;\n        while(l<=r){int m=(l+r)/2; if(a[m]==t){System.out.println(m);break;} if(a[m]<t)l=m+1;else r=m-1;}`), filename: "BinSearch.java", expectedOutput: "2", commonMistakes: ["l+r overflow — use l+(r-l)/2"], interviewTips: ["Template: while l<=r"], practiceQuestions: ["Search insert position"] },
      { title: `${title} — Sliding Window`, description: "Subarray sum ≤ k.", explanation: "Expand/shrink window.", code: javaCode("SlideWin", `        System.out.println("Sliding window: ${title}");\n        System.out.println("Expand right, shrink left");`), filename: "SlideWin.java", expectedOutput: "Sliding window: ...\nExpand right, shrink left", commonMistakes: ["Wrong window bounds"], interviewTips: ["Fixed vs variable window"], practiceQuestions: ["Longest substring k distinct"] },
      { title: `${title} — BFS Template`, description: "Graph traversal.", explanation: "Queue-based level order.", code: javaCode("BfsTemplate", `        System.out.println("BFS: queue + visited set");\n        System.out.println("Topic: ${title}");`), filename: "BfsTemplate.java", expectedOutput: "BFS: queue + visited set\nTopic: ...", commonMistakes: ["Forgetting visited"], interviewTips: ["Draw graph first"], practiceQuestions: ["Number of islands"] },
    ],
    hard: [
      { title: `${title} — DP Pattern`, description: "Memoization vs tabulation.", explanation: "Optimal substructure.", code: javaCode("DpPattern", `        System.out.println("DP: ${title}");\n        System.out.println("Define state, transition, base case");`), filename: "DpPattern.java", expectedOutput: "DP: ...\nDefine state, transition, base case", commonMistakes: ["Wrong base case"], interviewTips: ["Start with recursion tree"], practiceQuestions: ["Climbing stairs", "Coin change"], hiddenSolution: "dp[i] = dp[i-1] + dp[i-2]" },
      { title: `${title} — Graph Hard`, description: "Dijkstra / topo sort.", explanation: "Weighted shortest path.", code: javaCode("GraphHard", `        System.out.println("Graph: ${title}");\n        System.out.println("PriorityQueue for Dijkstra");`), filename: "GraphHard.java", expectedOutput: "Graph: ...\nPriorityQueue for Dijkstra", commonMistakes: ["Dijkstra on negative weights"], interviewTips: ["When BFS vs Dijkstra"], practiceQuestions: ["Course schedule II"] },
      { title: `${title} — LeetCode Hard`, description: "Combined patterns.", explanation: "Multiple techniques required.", code: javaCode("LcHard", `        System.out.println("Hard: ${title}");\n        System.out.println("Combine: hash + heap / DP + binary search");`), filename: "LcHard.java", expectedOutput: "Hard: ...\nCombine: hash + heap / DP + binary search", commonMistakes: ["Jumping to code without plan"], interviewTips: ["45 min: 10 plan, 25 code, 10 test"], practiceQuestions: ["Median of two sorted arrays"] },
    ],
  });
}

function jdbcFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildJdbcLessons(weekId, slug, {
    easy: [
      { title: `${title} — Load Driver`, description: "Class.forName + Connection.", explanation: "JDBC connects Java to MySQL.", code: javaCode("JdbcConnect", '        System.out.println("jdbc:mysql://localhost:3306/app");\n        System.out.println("DriverManager.getConnection(url, user, pass)");'), filename: "JdbcConnect.java", expectedOutput: "jdbc:mysql://localhost:3306/app\nDriverManager.getConnection(url, user, pass)", commonMistakes: ["Forgetting to close Connection"], interviewTips: ["Use try-with-resources"], practiceQuestions: ["Read application.properties URL"] },
      { title: `${title} — Simple SELECT`, description: "Statement.executeQuery.", explanation: "ResultSet iteration.", code: javaCode("JdbcSelect", '        System.out.println("ResultSet rs = stmt.executeQuery(\\"SELECT * FROM users\\");");\n        System.out.println("while(rs.next()) rs.getString(\\"name\\")");'), filename: "JdbcSelect.java", expectedOutput: "ResultSet rs = ...\nwhile(rs.next()) rs.getString(\"name\")", commonMistakes: ["SQL injection with string concat"], interviewTips: ["Always PreparedStatement"], practiceQuestions: ["Map ResultSet to POJO"] },
      { title: `${title} — INSERT Row`, description: "executeUpdate for DML.", explanation: "Returns affected row count.", code: javaCode("JdbcInsert", '        System.out.println("INSERT with PreparedStatement");\n        System.out.println("ps.setString(1, name); ps.executeUpdate();");'), filename: "JdbcInsert.java", expectedOutput: "INSERT with PreparedStatement\nps.setString(1, name); ps.executeUpdate();", commonMistakes: ["Not calling setX for each ?"], practiceQuestions: ["Return generated keys"] },
    ],
    medium: [
      { title: `${title} — PreparedStatement`, description: "Parameterized queries.", explanation: "Prevents SQL injection.", code: javaCode("JdbcPrep", '        System.out.println("PreparedStatement ps = conn.prepareStatement(\\"SELECT * FROM users WHERE id=?\\");");\n        System.out.println("ps.setInt(1, userId);");'), filename: "JdbcPrep.java", expectedOutput: "PreparedStatement ...\nps.setInt(1, userId);", commonMistakes: ["Building SQL with + concat"], interviewTips: ["Explain SQL injection attack"], practiceQuestions: ["Batch insert"] },
      { title: `${title} — Transaction`, description: "conn.setAutoCommit(false).", explanation: "commit/rollback.", code: javaCode("JdbcTx", '        System.out.println("setAutoCommit(false) → operations → commit()");\n        System.out.println("catch: rollback()");'), filename: "JdbcTx.java", expectedOutput: "setAutoCommit(false) → operations → commit()\ncatch: rollback()", commonMistakes: ["Forgetting rollback on error"], interviewTips: ["ACID properties"], practiceQuestions: ["Transfer money demo"] },
      { title: `${title} — Connection Pool`, description: "HikariCP setup.", explanation: "Reuse connections.", code: javaCode("JdbcPool", '        System.out.println("HikariDataSource ds = new HikariDataSource();");\n        System.out.println("try (Connection c = ds.getConnection()) { ... }");'), filename: "JdbcPool.java", expectedOutput: "HikariDataSource ...\ntry (Connection c = ds.getConnection())", commonMistakes: ["Creating connection per request"], interviewTips: ["Pool sizing formula"], practiceQuestions: ["Spring Boot auto-config"] },
    ],
    hard: [
      { title: `${title} — DAO Pattern`, description: "Repository layer design.", explanation: "Separate SQL from business logic.", code: javaCode("JdbcDao", '        System.out.println("interface UserDao { Optional<User> findById(long id); }");\n        System.out.println("JdbcUserDao implements UserDao");'), filename: "JdbcDao.java", expectedOutput: "interface UserDao ...\nJdbcUserDao implements UserDao", commonMistakes: ["SQL in controller"], interviewTips: ["DAO vs JPA Repository"], practiceQuestions: ["Migrate DAO to Spring Data"] },
      { title: `${title} — Batch Performance`, description: "addBatch / executeBatch.", explanation: "Bulk operations.", code: javaCode("JdbcBatch", '        System.out.println("for (User u : users) { ps.set...; ps.addBatch(); }");\n        System.out.println("ps.executeBatch();");'), filename: "JdbcBatch.java", expectedOutput: "for (User u : users) ...\nps.executeBatch();", commonMistakes: ["Single insert in loop"], interviewTips: ["Batch size tuning"], practiceQuestions: ["Compare with JPA saveAll"] },
      { title: `${title} — JDBC → JPA Migration`, description: "When to switch.", explanation: "ORM trade-offs.", code: javaCode("JdbcJpa", '        System.out.println("JDBC: full control, verbose");\n        System.out.println("JPA: productivity, N+1 risk");'), filename: "JdbcJpa.java", expectedOutput: "JDBC: full control, verbose\nJPA: productivity, N+1 risk", commonMistakes: ["N+1 query problem"], interviewTips: ["Explain N+1 and fix"], practiceQuestions: ["Write same query in JPQL"] },
    ],
  });
}

function springFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildSpringLessons(weekId, slug, {
    easy: [
      { title: `${title} — @Component`, description: "Spring bean basics.", explanation: "IoC container manages lifecycle.", code: javaCode("SpringBean", `@Component\nclass HelloService {\n  public String greet() { return "Hello from ${title}"; }\n}`), filename: "SpringBean.java", expectedOutput: "Hello from ...", commonMistakes: ["Missing @ComponentScan"], interviewTips: ["Explain IoC/DI"], practiceQuestions: ["@Service vs @Component"] },
      { title: `${title} — @Autowired`, description: "Dependency injection.", explanation: "Constructor injection preferred.", code: javaCode("Autowired", `@RestController\nclass Api {\n  private final UserService svc;\n  Api(UserService svc) { this.svc = svc; }\n}`), filename: "Autowired.java", expectedOutput: "Bean injected via constructor", commonMistakes: ["Field injection in production"], interviewTips: ["Why constructor injection"], practiceQuestions: ["Wire 2 beans"] },
      { title: `${title} — application.properties`, description: "External config.", explanation: "spring.datasource.url=...", code: javaCode("AppProps", '@Value("${app.name}")\nString appName;'), filename: "AppProps.java", expectedOutput: "Config injected from properties", commonMistakes: ["Hardcoding secrets"], interviewTips: ["12-factor config"], practiceQuestions: ["Profile-specific props"] },
    ],
    medium: [
      { title: `${title} — @RestController`, description: "REST endpoint.", explanation: "@GetMapping, @PostMapping.", code: javaCode("RestCtrl", `@GetMapping("/api/users")\nList<User> all() { return service.findAll(); }`), filename: "RestCtrl.java", expectedOutput: "JSON array of users", commonMistakes: ["Missing @ResponseBody on non-REST"], interviewTips: ["DispatcherServlet flow"], practiceQuestions: ["Add POST endpoint"] },
      { title: `${title} — @Service Layer`, description: "Business logic separation.", explanation: "Controller thin, service fat.", code: javaCode("ServiceLayer", `@Service\nclass OrderService {\n  public Order create(OrderRequest req) { /* validate + save */ }\n}`), filename: "ServiceLayer.java", expectedOutput: "Business logic in service", commonMistakes: ["Logic in controller"], interviewTips: ["Layered architecture"], practiceQuestions: ["Extract validation"] },
      { title: `${title} — Exception Handling`, description: "@ControllerAdvice.", explanation: "Global exception mapper.", code: javaCode("Advice", `@ExceptionHandler(NotFoundException.class)\nResponseEntity<?> handle(NotFoundException e) { return ResponseEntity.status(404).body(...); }`), filename: "Advice.java", expectedOutput: "404 JSON error body", commonMistakes: ["try-catch in every method"], interviewTips: ["ProblemDetail RFC 7807"], practiceQuestions: ["Handle validation errors"] },
    ],
    hard: [
      { title: `${title} — Full Stack Flow`, description: "Controller→Service→Repo.", explanation: "Request lifecycle.", code: javaCode("FullStack", `// ${title}: HTTP → Controller → Service → JPA → DB → JSON response`), filename: "FullStack.java", expectedOutput: "End-to-end request flow", commonMistakes: ["Skipping service layer"], interviewTips: ["Draw sequence diagram"], practiceQuestions: ["Add caching layer"] },
      { title: `${title} — @Transactional`, description: "Transaction boundaries.", explanation: "Rollback on RuntimeException.", code: javaCode("Transactional", `@Transactional\npublic void transfer(...) { debit(); credit(); }`), filename: "Transactional.java", expectedOutput: "Atomic transfer", commonMistakes: ["Self-invocation bypasses proxy"], interviewTips: ["Propagation levels"], practiceQuestions: ["When rollback fails"] },
      { title: `${title} — Production Config`, description: "Profiles, actuator, health.", explanation: "spring.profiles.active=prod", code: javaCode("ProdConfig", `@Profile("prod")\n@Configuration\nclass ProdConfig { /* Hikari, logging */ }`), filename: "ProdConfig.java", expectedOutput: "Profile-specific beans", commonMistakes: ["dev config in prod"], interviewTips: ["Actuator /health /metrics"], practiceQuestions: ["Docker + Spring Boot"] },
    ],
  });
}

function mongoFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildMongoLessons(weekId, slug, {
    easy: [
      { title: `${title} — Find Documents`, description: "db.collection.find()", document: '{ "_id": ObjectId("..."), "name": "Alice", "age": 30 }', collection: "users", query: 'db.users.find({ "age": { "$gte": 18 } })', expectedOutput: '[{"name":"Alice","age":30}]', sqlComparison: "SQL: SELECT * FROM users WHERE age >= 18", commonMistakes: ["Treating Mongo like relational"] },
      { title: `${title} — Insert Document`, description: "insertOne.", document: '{ "name": "Bob", "email": "b@x.com" }', collection: "users", query: 'db.users.insertOne({ "name": "Bob", "email": "b@x.com" })', expectedOutput: '{ "acknowledged": true, "insertedId": "..." }', sqlComparison: "SQL: INSERT INTO users ...", commonMistakes: ["Missing _id strategy"] },
      { title: `${title} — Query Operators`, description: "$in, $gt, $regex.", document: "Flexible schema document", collection: "products", query: 'db.products.find({ "price": { "$lt": 100 }, "category": { "$in": ["A","B"] } })', expectedOutput: "Matching product documents", sqlComparison: "SQL WHERE price < 100 AND category IN (...)", commonMistakes: ["Dot notation for nested fields"] },
    ],
    medium: [
      { title: `${title} — Aggregation Pipeline`, description: "$match, $group, $sort.", document: "Order documents with items array", collection: "orders", query: 'db.orders.aggregate([{ "$match": { "status": "paid" } }, { "$group": { "_id": "$customerId", "total": { "$sum": "$amount" } } }])', aggregation: "$match → $group → $sort", expectedOutput: '[{"_id":"cust1","total":500}]', sqlComparison: "SQL GROUP BY with WHERE", commonMistakes: ["$lookup performance"] },
      { title: `${title} — Embedded vs Reference`, description: "Schema design.", document: '{ "user": { "name": "..." }, "orders": [...] } vs ObjectId ref', collection: "users", query: "Design choice: embed orders or reference?", expectedOutput: "Embed: read fast, reference: update easy", sqlComparison: "No JOIN — design upfront", commonMistakes: ["16MB document limit"] },
      { title: `${title} — Indexing`, description: "createIndex.", document: "users collection", collection: "users", query: 'db.users.createIndex({ "email": 1 }, { unique: true })', expectedOutput: "Index created on email", sqlComparison: "Same as SQL CREATE INDEX", commonMistakes: ["No index on query fields"] },
    ],
    hard: [
      { title: `${title} — Transaction (Multi-doc)`, description: "Replica set required.", document: "Multi-document ACID", collection: "accounts", query: "session.startTransaction(); transfer(); session.commitTransaction();", expectedOutput: "Atomic multi-doc update", sqlComparison: "SQL transactions native; Mongo needs replica set", commonMistakes: ["Transactions on standalone"] },
      { title: `${title} — SQL vs Mongo Decision`, description: "When to use which.", document: "Comparison matrix", collection: "N/A", query: "Evaluate: fixed schema + JOINs → SQL | flexible docs + scale-out → Mongo", expectedOutput: "Decision framework", sqlComparison: "Polyglot persistence common", commonMistakes: ["Mongo for heavy relational queries"] },
      { title: `${title} — Spring Data MongoDB`, description: "MongoRepository.", document: "User document entity", collection: "users", query: "interface UserRepo extends MongoRepository<User, String> {}", expectedOutput: "CRUD without SQL", sqlComparison: "Like JPA but document-based", commonMistakes: ["Mapping _id incorrectly"] },
    ],
  });
}

function dbDesignFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildDbDesignLessons(weekId, slug, {
    easy: [
      { title: `${title} — ER Basics`, description: "Entities and relationships.", erDiagram: "[Customer]──< places >──[Order]──< contains >──[Product]", tables: [{ name: "customers", columns: ["id PK", "name"], primaryKey: "id" }], relationships: ["Customer 1:N Order"], normalization: "Identify entities before tables", indexes: ["PK on id"], realWorldExample: "Amazon: Customer → Order → OrderItem", commonMistakes: ["Skipping ER diagram"] },
      { title: `${title} — Primary Keys`, description: "Natural vs surrogate.", erDiagram: "[User(id PK)]", tables: [{ name: "users", columns: ["id INT PK AUTO_INCREMENT", "email UNIQUE"], primaryKey: "id" }], relationships: [], normalization: "Every table needs PK", indexes: ["UNIQUE on email"], realWorldExample: "Surrogate id + unique business key", commonMistakes: ["Composite PK when surrogate better"] },
      { title: `${title} — Foreign Keys`, description: "Referential integrity.", erDiagram: "[Order]──FK user_id──>[User]", tables: [{ name: "orders", columns: ["id PK", "user_id FK"], primaryKey: "id" }], relationships: ["Order N:1 User"], normalization: "FK enforces valid references", indexes: ["INDEX on user_id"], realWorldExample: "ON DELETE CASCADE vs RESTRICT", commonMistakes: ["Orphan rows without FK"] },
    ],
    medium: [
      { title: `${title} — 1NF`, description: "Atomic columns.", erDiagram: "Bad: phone1, phone2 → Good: phone table", tables: [{ name: "user_phones", columns: ["user_id FK", "phone"] }], relationships: ["User 1:N Phone"], normalization: "1NF: no repeating groups", indexes: [], realWorldExample: "Split multi-value columns", commonMistakes: ["CSV in single column"] },
      { title: `${title} — 2NF & 3NF`, description: "Remove partial/transitive deps.", erDiagram: "[Order] separate [Product] attrs", tables: [{ name: "products", columns: ["id", "name", "price"] }], relationships: ["Order references Product by id only"], normalization: "3NF: non-key depends only on key", indexes: [], realWorldExample: "Product price in products table not orders", commonMistakes: ["Denormalizing too early"] },
      { title: `${title} — Index Strategy`, description: "When to index.", erDiagram: "users(email) INDEX", tables: [{ name: "users", columns: ["id PK", "email INDEX"] }], relationships: [], normalization: "N/A", indexes: ["B-tree on WHERE/JOIN columns", "Avoid over-indexing writes"], realWorldExample: "Stripe indexes customer_id on charges", commonMistakes: ["Index every column"] },
    ],
    hard: [
      { title: `${title} — E-commerce Schema`, description: "Full design exercise.", erDiagram: "Customer-Order-Product-Payment-Inventory", tables: [{ name: "orders", columns: ["id", "customer_id", "status", "total"] }, { name: "order_items", columns: ["order_id FK", "product_id FK", "qty", "price"] }], relationships: ["Full 3NF schema"], normalization: "3NF with denormalized read models optional", indexes: ["Composite (customer_id, created_at)"], realWorldExample: "Flipkart/Amazon order schema", commonMistakes: ["Storing calculated total without trigger"] },
      { title: `${title} — Sharding Ready Design`, description: "Partition keys.", erDiagram: "Shard by tenant_id or user_id", tables: [{ name: "events", columns: ["id", "user_id SHARD KEY", "payload"] }], relationships: [], normalization: "Design for horizontal scale", indexes: ["Shard key in every query"], realWorldExample: "Multi-tenant SaaS", commonMistakes: ["Cross-shard JOINs"] },
      { title: `${title} — Read vs Write Model`, description: "CQRS intro.", erDiagram: "Write DB (3NF) → Event → Read DB (denormalized)", tables: [{ name: "order_read_model", columns: ["order_id", "customer_name", "product_names"] }], relationships: ["Eventual consistency"], normalization: "Denormalize read side intentionally", indexes: ["Read model optimized for queries"], realWorldExample: "Netflix viewing history", commonMistakes: ["Same schema for reads and writes at scale"] },
    ],
  });
}

function securityFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildSecurityLessons(weekId, slug, {
    easy: [
      { title: `${title} — Auth vs Authz`, description: "Authentication vs Authorization.", authFlow: "AuthN: who are you? | AuthZ: what can you do?", requestFlow: "Login → AuthN → Token → AuthZ check on each request", headers: {}, roles: ["USER", "ADMIN"], permissions: ["read:*", "write:own"], exampleApi: "401 = not authenticated | 403 = not authorized", commonMistakes: ["Confusing 401 and 403"] },
      { title: `${title} — Password Hashing`, description: "BCrypt never plain text.", authFlow: "Register → BCrypt.hash → store hash | Login → BCrypt.matches", requestFlow: "Never log passwords", headers: {}, roles: [], permissions: [], exampleApi: "new BCryptPasswordEncoder(12)", code: "passwordEncoder.encode(rawPassword)", commonMistakes: ["MD5/SHA1 for passwords"], editorLanguage: "java" },
      { title: `${title} — HTTPS`, description: "TLS in transit.", authFlow: "Client ←TLS→ Server", requestFlow: "Certificate validation", headers: { "Strict-Transport-Security": "max-age=31536000" }, roles: [], permissions: [], exampleApi: "Always HTTPS in production", commonMistakes: ["HTTP in production"] },
    ],
    medium: [
      { title: `${title} — Spring Security Config`, description: "SecurityFilterChain.", authFlow: "Filter chain order matters", requestFlow: "Cors → Jwt → Auth → Controller", headers: { Authorization: "Bearer ..." }, roles: ["USER"], permissions: ["read:orders"], exampleApi: "http.authorizeHttpRequests().requestMatchers(\"/public/**\").permitAll()", code: "@Bean SecurityFilterChain filterChain(HttpSecurity http)", editorLanguage: "java", commonMistakes: ["permitAll() on /**"] },
      { title: `${title} — CORS`, description: "Cross-origin requests.", authFlow: "Browser preflight OPTIONS", requestFlow: "Access-Control-Allow-Origin", headers: { "Access-Control-Allow-Origin": "https://app.example.com" }, roles: [], permissions: [], exampleApi: "Don't use * with credentials", commonMistakes: ["CORS != auth"] },
      { title: `${title} — CSRF`, description: "Token for cookie auth.", authFlow: "CSRF token in form/header", requestFlow: "Disabled for stateless JWT APIs", headers: { "X-CSRF-TOKEN": "..." }, roles: [], permissions: [], exampleApi: "csrf.disable() for REST + JWT", commonMistakes: ["CSRF on JWT APIs unnecessarily"] },
    ],
    hard: [
      { title: `${title} — RBAC Implementation`, description: "@PreAuthorize hasRole.", authFlow: "User → Role → Permission → Resource", requestFlow: "@PreAuthorize(\"hasRole('ADMIN')\")", headers: { Authorization: "Bearer ..." }, roles: ["ADMIN", "MANAGER", "USER"], permissions: ["users:write", "orders:read"], exampleApi: "@EnableMethodSecurity", code: "@PreAuthorize(\"hasAuthority('orders:refund')\")", editorLanguage: "java", commonMistakes: ["Role check in controller if/else"] },
      { title: `${title} — OAuth2 Resource Server`, description: "Validate external tokens.", authFlow: "Google token → your API validates JWT", requestFlow: "spring.security.oauth2.resourceserver.jwt.issuer-uri", headers: { Authorization: "Bearer ..." }, roles: [], permissions: [], exampleApi: "JwtDecoder bean from issuer", commonMistakes: ["Trusting any JWT without signature verify"] },
      { title: `${title} — Security Audit`, description: "OWASP Top 10 review.", authFlow: "Checklist: injection, auth, XSS, CSRF...", requestFlow: "Pen test before launch", headers: {}, roles: [], permissions: [], exampleApi: "SQL injection test on all inputs", commonMistakes: ["Security as afterthought"] },
    ],
  });
}

function hibernateFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildHibernateLessons(weekId, slug, {
    easy: [
      { title: `${title} — @Entity`, description: "JPA entity mapping.", explanation: "Maps class to table.", code: javaCode("UserEntity", `@Entity\n@Table(name="users")\nclass User {\n  @Id @GeneratedValue Long id;\n  String email;\n}`), filename: "UserEntity.java", expectedOutput: "Entity mapped to users table", commonMistakes: ["Missing @Entity"], interviewTips: ["JPA vs Hibernate"], practiceQuestions: ["Add @Column constraints"] },
      { title: `${title} — @Repository`, description: "Spring Data JPA.", explanation: "extends JpaRepository<User, Long>", code: javaCode("UserRepo", `interface UserRepository extends JpaRepository<User, Long> {\n  Optional<User> findByEmail(String email);\n}`), filename: "UserRepo.java", expectedOutput: "Query method auto-implemented", commonMistakes: ["Wrong return type for findBy"], interviewTips: ["Derived query naming"], practiceQuestions: ["Custom @Query"] },
      { title: `${title} — Save & Find`, description: "CRUD basics.", explanation: "repo.save(user); repo.findById(1L);", code: javaCode("CrudDemo", `        System.out.println("save → persist to DB");\n        System.out.println("findById → SELECT by PK");`), filename: "CrudDemo.java", expectedOutput: "save → persist to DB\nfindById → SELECT by PK", commonMistakes: ["Persist detached entity"], interviewTips: ["Entity states: transient, managed, detached"], practiceQuestions: ["deleteById vs delete"] },
    ],
    medium: [
      { title: `${title} — @OneToMany`, description: "Relationship mapping.", explanation: "Order has many OrderItems.", code: javaCode("OneToMany", `@OneToMany(mappedBy="order", cascade=CascadeType.ALL)\nList<OrderItem> items;`), filename: "OneToMany.java", expectedOutput: "Bidirectional association", commonMistakes: ["N+1 without fetch join"], interviewTips: ["Lazy vs Eager"], practiceQuestions: ["Fix N+1 with @EntityGraph"] },
      { title: `${title} — JPQL Query`, description: "@Query annotation.", explanation: "Object-oriented query language.", code: javaCode("Jpql", `@Query("SELECT u FROM User u WHERE u.active = true")\nList<User> findActive();`), filename: "Jpql.java", expectedOutput: "JPQL → SQL translation", commonMistakes: ["Native SQL when JPQL suffices"], interviewTips: ["JPQL uses entity names"], practiceQuestions: ["Pagination with Pageable"] },
      { title: `${title} — Lazy Loading`, description: "FetchType.LAZY.", explanation: "Load on access — session must be open.", code: javaCode("Lazy", `@ManyToOne(fetch=FetchType.LAZY)\nCustomer customer;`), filename: "Lazy.java", expectedOutput: "Proxy until accessed", commonMistakes: ["LazyInitializationException"], interviewTips: ["@Transactional on service"], practiceQuestions: ["DTO projection"] },
    ],
    hard: [
      { title: `${title} — N+1 Fix`, description: "JOIN FETCH / EntityGraph.", explanation: "One query instead of N+1.", code: javaCode("NPlusOne", `@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")`), filename: "NPlusOne.java", expectedOutput: "Single query with join", commonMistakes: ["Eager everywhere"], interviewTips: ["Enable SQL logging to detect"], practiceQuestions: ["Batch fetching"] },
      { title: `${title} — Cascade & OrphanRemoval`, description: "Lifecycle management.", explanation: "cascade=ALL, orphanRemoval=true", code: javaCode("Cascade", `@OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)`), filename: "Cascade.java", expectedOutput: "Child lifecycle tied to parent", commonMistakes: ["CascadeType.ALL on ManyToMany"], interviewTips: ["When to use orphanRemoval"], practiceQuestions: ["Soft delete pattern"] },
      { title: `${title} — Migration to Production`, description: "Flyway + indexes.", explanation: "Schema versioning.", code: javaCode("Flyway", `-- V1__create_users.sql\nCREATE TABLE users (...);`), filename: "V1__create_users.sql", expectedOutput: "Versioned migrations", commonMistakes: ["ddl-auto=update in prod"], interviewTips: ["Never auto-ddl in prod"], practiceQuestions: ["Rollback strategy"] },
    ],
  });
}

function multithreadingFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildMultithreadingLessons(weekId, slug, {
    easy: [
      { title: `${title} — Thread Creation`, description: "extends Thread vs Runnable.", explanation: "Prefer Runnable — composition over inheritance.", code: javaCode("ThreadDemo", `        Thread t = new Thread(() -> System.out.println("Running: ${title}"));\n        t.start();\n        t.join();`), filename: "ThreadDemo.java", expectedOutput: "Running: ...", commonMistakes: ["Calling run() instead of start()"], interviewTips: ["Thread vs Runnable vs Callable"], practiceQuestions: ["Create 3 threads printing IDs"] },
      { title: `${title} — Thread Lifecycle`, description: "NEW → RUNNABLE → TERMINATED.", explanation: "BLOCKED/WAITING states.", code: javaCode("Lifecycle", `        System.out.println("States: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED");`), filename: "Lifecycle.java", expectedOutput: "States: NEW, RUNNABLE...", commonMistakes: ["Assuming start() is instant"], interviewTips: ["Draw state diagram"], practiceQuestions: ["Thread.sleep effect on state"] },
      { title: `${title} — sleep & join`, description: "Basic coordination.", explanation: "join waits for thread completion.", code: javaCode("JoinDemo", `        Thread worker = new Thread(() -> { try { Thread.sleep(100); System.out.println("done"); } catch(InterruptedException e){} });\n        worker.start(); worker.join();\n        System.out.println("main continues");`), filename: "JoinDemo.java", expectedOutput: "done\nmain continues", commonMistakes: ["InterruptedException ignored"], interviewTips: ["Always restore interrupt flag"], practiceQuestions: ["join with timeout"] },
    ],
    medium: [
      { title: `${title} — synchronized`, description: "Mutual exclusion.", explanation: "Only one thread in synchronized block.", code: javaCode("Sync", `        Object lock = new Object();\n        synchronized(lock) { /* critical section */ }`), filename: "Sync.java", expectedOutput: "Thread-safe counter increment", commonMistakes: ["Locking on wrong object"], interviewTips: ["synchronized vs ReentrantLock"], practiceQuestions: ["Fix race condition"] },
      { title: `${title} — Producer Consumer`, description: "wait/notify pattern.", explanation: "Classic concurrency pattern.", code: javaCode("ProdCons", `        System.out.println("Producer fills buffer, consumer empties");\n        System.out.println("Use BlockingQueue in production");`), filename: "ProdCons.java", expectedOutput: "Producer fills buffer...", commonMistakes: ["Spurious wakeup without loop"], interviewTips: ["Prefer BlockingQueue"], practiceQuestions: ["Implement with ArrayBlockingQueue"] },
      { title: `${title} — volatile`, description: "Visibility guarantee.", explanation: "Not atomic for compound ops.", code: javaCode("Volatile", `        volatile boolean running = true;\n        // writer sets false, reader sees immediately`), filename: "Volatile.java", expectedOutput: "Visibility across threads", commonMistakes: ["volatile for counter++"], interviewTips: ["volatile vs atomic"], practiceQuestions: ["When volatile is enough"] },
    ],
    hard: [
      { title: `${title} — Deadlock`, description: "Circular wait detection.", explanation: "Lock ordering prevents deadlock.", code: javaCode("Deadlock", `        System.out.println("Thread1: lockA→lockB | Thread2: lockB→lockA = DEADLOCK");\n        System.out.println("Fix: always acquire in same order");`), filename: "Deadlock.java", expectedOutput: "Fix: always acquire in same order", commonMistakes: ["Nested locks different order"], interviewTips: ["Bank transfer deadlock classic"], practiceQuestions: ["Detect with jstack"] },
      { title: `${title} — Thread Pool`, description: "ExecutorService.", explanation: "Fixed pool reuses threads.", code: javaCode("ThreadPool", `        ExecutorService pool = Executors.newFixedThreadPool(4);\n        pool.submit(() -> System.out.println("task"));\n        pool.shutdown();`), filename: "ThreadPool.java", expectedOutput: "task", commonMistakes: ["Unbounded CachedThreadPool under load"], interviewTips: ["Pool sizing: CPU-bound vs IO-bound"], practiceQuestions: ["Future.get timeout"] },
      { title: `${title} — CompletableFuture`, description: "Async composition.", explanation: "thenApply, thenCombine, exceptionally.", code: javaCode("Completable", `        CompletableFuture.supplyAsync(() -> fetchUser())\n          .thenApply(u -> enrich(u))\n          .thenAccept(System.out::println);`), filename: "Completable.java", expectedOutput: "Async pipeline output", commonMistakes: ["Blocking get() on async chain"], interviewTips: ["Parallel vs sequential composition"], practiceQuestions: ["Combine 2 async calls"] },
    ],
  });
}

function java8Fallback(weekId, topic) {
  const { slug, title } = topic;
  return buildJava8Lessons(weekId, slug, {
    easy: [
      { title: `${title} — Lambda Syntax`, description: "(params) -> expression.", explanation: "Functional interface target.", code: javaCode("Lambda", `        Runnable r = () -> System.out.println("${title} lambda");\n        r.run();`), filename: "Lambda.java", expectedOutput: `${title} lambda`, commonMistakes: ["Variable capture must be final/effectively final"], interviewTips: ["Lambda vs anonymous class"], practiceQuestions: ["Sort list with lambda"] },
      { title: `${title} — Functional Interface`, description: "@FunctionalInterface.", explanation: "Single abstract method.", code: javaCode("FuncInt", `@FunctionalInterface\ninterface Operation { int apply(int a, int b); }`), filename: "FuncInt.java", expectedOutput: "SAM interface", commonMistakes: ["Multiple abstract methods"], interviewTips: ["Built-in: Predicate, Function, Consumer"], practiceQuestions: ["Write custom SAM"] },
      { title: `${title} — Method Reference`, description: "Class::method.", explanation: "Shorthand for lambda.", code: javaCode("MethodRef", `        List<String> names = List.of("a","b");\n        names.forEach(System.out::println);`), filename: "MethodRef.java", expectedOutput: "a\nb", commonMistakes: ["Wrong signature match"], interviewTips: ["4 types of method refs"], practiceQuestions: ["Replace lambda with ::"] },
    ],
    medium: [
      { title: `${title} — Stream map/filter`, description: "Intermediate operations.", explanation: "Lazy until terminal.", code: javaCode("StreamOps", `        List<Integer> nums = List.of(1,2,3,4,5);\n        int sum = nums.stream().filter(n->n%2==0).mapToInt(Integer::intValue).sum();\n        System.out.println(sum);`), filename: "StreamOps.java", expectedOutput: "6", commonMistakes: ["Reusing consumed stream"], interviewTips: ["Intermediate vs terminal"], practiceQuestions: ["Collect to Map"] },
      { title: `${title} — Optional`, description: "Null-safe container.", explanation: "orElse, orElseThrow, map.", code: javaCode("Optional", `        Optional<String> opt = Optional.ofNullable(null);\n        System.out.println(opt.orElse("default"));`), filename: "Optional.java", expectedOutput: "default", commonMistakes: ["Optional.of(null) throws"], interviewTips: ["Don't use Optional as field"], practiceQuestions: ["Chain optional.map"] },
      { title: `${title} — Collectors`, description: "groupingBy, joining.", explanation: "Terminal collection.", code: javaCode("Collectors", `        Map<String, List<User>> byDept = users.stream().collect(Collectors.groupingBy(User::getDept));`), filename: "Collectors.java", expectedOutput: "Grouped map", commonMistakes: ["Mutable collector misuse"], interviewTips: ["toUnmodifiableList in Java 10+"], practiceQuestions: ["Partition by predicate"] },
    ],
    hard: [
      { title: `${title} — Parallel Stream`, description: "When to parallelize.", explanation: "ForkJoin common pool.", code: javaCode("Parallel", `        long count = hugeList.parallelStream().filter(x->x>0).count();`), filename: "Parallel.java", expectedOutput: "Count from parallel", commonMistakes: ["Parallel on small data / ordered ops"], interviewTips: ["Measure before parallelizing"], practiceQuestions: ["When NOT parallel"] },
      { title: `${title} — Custom Collector`, description: "Collector.of factory.", explanation: "Advanced aggregation.", code: javaCode("CustomColl", `        System.out.println("Collector.of(supplier, accumulator, combiner, finisher)");`), filename: "CustomColl.java", expectedOutput: "Custom aggregation", commonMistakes: ["Non-associative combiner"], interviewTips: ["Associativity required"], practiceQuestions: ["Implement averaging collector"] },
      { title: `${title} — Stream Performance`, description: "Primitive streams.", explanation: "mapToInt avoids boxing.", code: javaCode("StreamPerf", `        IntStream.range(1,1_000_000).sum(); // faster than Integer stream`), filename: "StreamPerf.java", expectedOutput: "Sum efficiently", commonMistakes: ["Boxing in hot loops"], interviewTips: ["Profile with JMH"], practiceQuestions: ["Compare boxed vs primitive"] },
    ],
  });
}

function collectionsFallback(weekId, topic) {
  const { slug, title } = topic;
  return buildCollectionsLessons(weekId, slug, {
    easy: [
      { title: `${title} — Create & Add`, description: "Basic collection ops.", explanation: "add, get, size.", code: javaCode("CollAdd", `        java.util.ArrayList<String> list = new java.util.ArrayList<>();\n        list.add("Java"); list.add("${title}");\n        System.out.println(list);`), filename: "CollAdd.java", expectedOutput: "[Java, ...]", commonMistakes: ["ArrayList vs LinkedList choice"], interviewTips: ["ArrayList for random access"], practiceQuestions: ["Remove by index"] },
      { title: `${title} — Iterate`, description: "for-each and Iterator.", explanation: "Enhanced for loop.", code: javaCode("CollIter", `        for (String s : list) System.out.println(s);`), filename: "CollIter.java", expectedOutput: "Each element printed", commonMistakes: ["ConcurrentModificationException"], interviewTips: ["Iterator.remove() safe"], practiceQuestions: ["Iterator vs forEach"] },
      { title: `${title} — Contains & Search`, description: "indexOf, contains.", explanation: "O(n) linear search on list.", code: javaCode("CollSearch", `        System.out.println(list.contains("Java"));`), filename: "CollSearch.java", expectedOutput: "true", commonMistakes: ["contains on HashMap key vs value"], interviewTips: ["HashMap O(1) lookup"], practiceQuestions: ["Find duplicate in list"] },
    ],
    medium: [
      { title: `${title} — Employee Map`, description: "HashMap id → Employee.", explanation: "Real-world HR lookup.", code: javaCode("EmpMap", `        java.util.HashMap<Integer,String> emp = new java.util.HashMap<>();\n        emp.put(1, "Alice"); emp.put(2, "Bob");\n        System.out.println(emp.get(1));`), filename: "EmpMap.java", expectedOutput: "Alice", commonMistakes: ["Mutable key objects"], interviewTips: ["hashCode/equals contract"], practiceQuestions: ["Count frequency with map"] },
      { title: `${title} — Sort with Comparator`, description: "Custom sort order.", explanation: "Comparator.comparing().", code: javaCode("SortComp", `        list.sort(java.util.Comparator.comparing(String::length));`), filename: "SortComp.java", expectedOutput: "Sorted by length", commonMistakes: ["Not implementing Comparable when needed"], interviewTips: ["Comparable vs Comparator"], practiceQuestions: ["Sort employees by salary"] },
      { title: `${title} — HashSet Uniqueness`, description: "Remove duplicates.", explanation: "Set enforces uniqueness.", code: javaCode("HashSet", `        java.util.Set<Integer> set = new java.util.HashSet<>(list);\n        System.out.println(set.size());`), filename: "HashSet.java", expectedOutput: "Unique count", commonMistakes: ["TreeSet requires Comparable"], interviewTips: ["HashSet vs TreeSet ordering"], practiceQuestions: ["Find intersection of 2 sets"] },
    ],
    hard: [
      { title: `${title} — LRU Cache`, description: "LinkedHashMap accessOrder.", explanation: "Classic design question.", code: javaCode("LruCache", `        System.out.println("LinkedHashMap(accessOrder=true) + removeEldestEntry");`), filename: "LruCache.java", expectedOutput: "LRU eviction", commonMistakes: ["Not synchronized for concurrent"], interviewTips: ["ConcurrentHashMap for threads"], practiceQuestions: ["Implement get/put O(1)"] },
      { title: `${title} — Concurrent Collections`, description: "ConcurrentHashMap.", explanation: "Thread-safe without full lock.", code: javaCode("Concurrent", `        java.util.concurrent.ConcurrentHashMap<String,Integer> map = new java.util.concurrent.ConcurrentHashMap<>();`), filename: "Concurrent.java", expectedOutput: "Thread-safe map ops", commonMistakes: ["Collections.synchronizedMap for high contention"], interviewTips: ["Segment locking internals"], practiceQuestions: ["CopyOnWriteArrayList use case"] },
      { title: `${title} — Custom Comparator Chain`, description: "thenComparing.", explanation: "Multi-field sort.", code: javaCode("CompChain", `        Comparator<Employee> c = Comparator.comparing(Employee::getDept).thenComparing(Employee::getSalary);`), filename: "CompChain.java", expectedOutput: "Multi-key sort", commonMistakes: ["Unstable sort assumptions"], interviewTips: ["Sort stability in Java"], practiceQuestions: ["Top K employees by dept"] },
    ],
  });
}

const CATEGORY_FALLBACKS = {
  java: javaFallback,
  oop: oopFallback,
  collections: collectionsFallback,
  java8: java8Fallback,
  multithreading: multithreadingFallback,
  dsa: dsaFallback,
  sql: sqlFallback,
  "database-design": dbDesignFallback,
  jdbc: jdbcFallback,
  "spring-boot": springFallback,
  hibernate: hibernateFallback,
  "rest-api": restFallback,
  security: securityFallback,
  mongodb: mongoFallback,
  git: gitFallback,
  ai: aiFallback,
};

export function getCategoryFallback(weekId, topic) {
  const fn = CATEGORY_FALLBACKS[topic.category] ?? javaFallback;
  return fn(weekId, topic);
}
