import {
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
} from "../builders.mjs";
import { enrichProblem } from "../lib/rich-fields.mjs";
import { getQuotasForTopic, estimatedMinutes as estMinutes } from "../lib/problem-type-spec.mjs";
import { generateCuratedProblems } from "../lib/curated-engine.mjs";

const LEVELS = ["easy", "medium", "hard"];

const SQL_SCHEMA_DDL = `
CREATE TABLE departments (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  dept_id INT NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  created_at DATE NOT NULL,
  FOREIGN KEY (dept_id) REFERENCES departments(id)
);
`;

const SQL_SCHEMA = [
  {
    table: "departments",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR(100)" },
    ],
  },
  {
    table: "employees",
    columns: [
      { name: "id", type: "INT" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "dept_id", type: "INT" },
      { name: "salary", type: "DECIMAL(10,2)" },
      { name: "created_at", type: "DATE" },
    ],
  },
];

const SQL_SAMPLE_DATA = [
  {
    table: "departments",
    rows: [
      ["10", "Engineering"],
      ["20", "Sales"],
      ["30", "Support"],
    ],
  },
  {
    table: "employees",
    rows: [
      ["1", "Asha", "10", "90000", "2025-01-10"],
      ["2", "Bharat", "10", "78000", "2025-02-11"],
      ["3", "Chinmay", "20", "65000", "2025-03-15"],
      ["4", "Divya", "20", "72000", "2025-03-17"],
      ["5", "Eshan", "30", "56000", "2025-04-01"],
    ],
  },
];

const TOPIC_TITLES = {
  "sql-select": "SQL Select",
  "sql-joins": "SQL Joins",
  "sql-aggregations": "SQL Aggregations",
  transactions: "Transactions",
  normalization: "Normalization",
  indexes: "Indexes",
  jdbc: "JDBC",
  mongodb: "MongoDB",
  "spring-core": "Spring Core",
  "spring-boot": "Spring Boot",
  "capstone-backend": "Capstone Backend",
  "jpa-hibernate": "JPA Hibernate",
  "rest-design": "REST Design",
  "validation-pagination": "Validation and Pagination",
  swagger: "Swagger and OpenAPI",
  "spring-security": "Spring Security",
  "jwt-auth": "JWT Authentication",
  oauth: "OAuth",
  rbac: "RBAC",
  "git-workflow": "Git Workflow",
  "github-portfolio": "GitHub Portfolio",
  "mock-interview": "Mock Interview",
  "ai-coding": "AI Coding",
};

function richFor(topicSlug, difficulty, index, description, expectedOutput) {
  const n = index + 1;
  return {
    problemStatement: `${TOPIC_TITLES[topicSlug]} challenge ${n} (${difficulty}). ${description}`,
    constraints: [
      "Use production-style naming and clean structure.",
      "Handle edge cases and explain trade-offs.",
      "Keep response shape stable for API consumers.",
    ],
    exampleInput: `input_${topicSlug}_${difficulty}_${n}`,
    exampleOutput: String(expectedOutput ?? `output_${topicSlug}_${difficulty}_${n}`),
    stepByStepExplanation: `Start with input validation, apply ${TOPIC_TITLES[topicSlug]} logic, then verify final output for challenge ${n}.`,
    approaches: [
      {
        name: "Baseline",
        description: "Implement a direct and readable version first.",
        timeComplexity: "Varies by operation",
        spaceComplexity: "O(1) to O(n)",
      },
      {
        name: "Optimized",
        description: "Refine query/implementation with indexing or better flow.",
        timeComplexity: "Improved from baseline",
        spaceComplexity: "O(1) typical",
      },
    ],
    dryRun: `Dry run ${n}: validate input -> execute core step -> verify expected output.`,
    visualization: `Flow: Input -> ${TOPIC_TITLES[topicSlug]} Processor -> Output`,
    companyTags: ["Amazon", "Microsoft", "Google"],
    interviewTips: [
      "Explain why this approach is chosen over alternatives.",
      "Mention one optimization and one edge case.",
    ],
    alternativeSolutions: [
      "Use a more declarative style for readability.",
      "Use a performance-oriented variant for large datasets.",
    ],
    followUpQuestions: [
      "How would this behave at 10x scale?",
      "How would you test this in integration tests?",
    ],
    practiceVariations: [
      `Variation A for ${topicSlug}`,
      `Variation B for ${topicSlug}`,
    ],
  };
}

function withRich(topicSlug, category, difficulty, index, problem) {
  const seeded = {
    ...problem,
    ...richFor(topicSlug, difficulty, index, problem.description, problem.expectedOutput ?? problem.expectedResult),
  };
  const enriched = enrichProblem(seeded, { slug: topicSlug, category, difficulty, index });
  return {
    ...seeded,
    ...enriched,
    explanation: seeded.explanation ?? seeded.stepByStepExplanation ?? enriched.stepByStepExplanation,
  };
}

function buildTieredWithRich(topicSlug, category, tieredProblems) {
  return {
    easy: tieredProblems.easy.map((p, i) => withRich(topicSlug, category, "easy", i, p)),
    medium: tieredProblems.medium.map((p, i) => withRich(topicSlug, category, "medium", i, p)),
    hard: tieredProblems.hard.map((p, i) => withRich(topicSlug, category, "hard", i, p)),
  };
}

function normalizeSqlExpectedResult(raw) {
  if (!raw) return { columns: ["result"], rows: [] };
  if (Array.isArray(raw.rows) && Array.isArray(raw.columns)) return raw;
  if (Array.isArray(raw)) {
    const colCount = raw.reduce((max, row) => Math.max(max, row?.length ?? 0), 0);
    const columns =
      colCount > 0 ? Array.from({ length: colCount }, (_, i) => `col${i + 1}`) : ["result"];
    return { columns, rows: raw };
  }
  return { columns: ["result"], rows: [] };
}

function sqlProblems(topicSlug) {
  const sets = {
    "sql-select": {
      easy: [
        { title: "Select all employee rows", description: "Read all rows from employees table.", query: "SELECT * FROM employees;", expectedResult: [["1", "Asha"], ["2", "Bharat"]], executionExplanation: "Simple full scan SELECT.", optimizationTip: "Project only needed columns in production.", alternativeQuery: "SELECT id, name FROM employees;" },
        { title: "Filter by salary threshold", description: "Return employees with salary >= 75000.", query: "SELECT id, name, salary FROM employees WHERE salary >= 75000 ORDER BY salary DESC;", expectedResult: [["1", "Asha", "90000.00"], ["2", "Bharat", "78000.00"]], executionExplanation: "Filter first, then order by salary.", optimizationTip: "Index salary for frequent filters.", alternativeQuery: "SELECT * FROM employees WHERE salary BETWEEN 75000 AND 999999;" },
        { title: "Date-based selection", description: "Return employees created after 2025-02-01.", query: "SELECT id, name FROM employees WHERE created_at > '2025-02-01';", expectedResult: [["2", "Bharat"], ["3", "Chinmay"], ["4", "Divya"], ["5", "Eshan"]], executionExplanation: "Date predicate narrows scan range.", optimizationTip: "Index created_at for time-window dashboards.", alternativeQuery: "SELECT id, name FROM employees WHERE created_at BETWEEN '2025-02-02' AND CURRENT_DATE;" },
      ],
      medium: [
        { title: "Distinct department ids", description: "List unique department ids from employees.", query: "SELECT DISTINCT dept_id FROM employees ORDER BY dept_id;", expectedResult: [["10"], ["20"], ["30"]], executionExplanation: "DISTINCT removes duplicates.", optimizationTip: "Composite index on (dept_id, id) helps certain scans.", alternativeQuery: "SELECT dept_id FROM employees GROUP BY dept_id;" },
        { title: "Select with CASE banding", description: "Classify salary into LOW/MID/HIGH bands.", query: "SELECT name, CASE WHEN salary < 65000 THEN 'LOW' WHEN salary < 80000 THEN 'MID' ELSE 'HIGH' END AS band FROM employees ORDER BY name;", expectedResult: [["Asha", "HIGH"], ["Bharat", "MID"]], executionExplanation: "CASE executes per row after filtering.", optimizationTip: "Materialize salary band only if repeatedly queried.", alternativeQuery: "Use a lookup table for salary ranges and join it." },
        { title: "Window row numbering", description: "Assign row numbers by salary descending.", query: "SELECT id, name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn FROM employees;", expectedResult: [["1", "Asha", "90000.00", "1"]], executionExplanation: "Window function computes ranking without collapsing rows.", optimizationTip: "Index on salary reduces sort cost.", alternativeQuery: "Use RANK() if ties should share rank." },
      ],
      hard: [
        { title: "Window running total", description: "Compute cumulative salary ordered by created_at.", query: "SELECT id, name, salary, SUM(salary) OVER (ORDER BY created_at ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_salary FROM employees;", expectedResult: [["1", "Asha", "90000.00", "90000.00"]], executionExplanation: "Window frame builds running aggregate per row.", optimizationTip: "Index created_at to reduce sort spill.", alternativeQuery: "Use a correlated subquery for older SQL engines." },
        { title: "Top 2 salaries per department", description: "Pick top earners per department using window function.", query: "SELECT * FROM (SELECT dept_id, name, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees) x WHERE rnk <= 2 ORDER BY dept_id, rnk;", expectedResult: [["10", "Asha", "90000.00", "1"]], executionExplanation: "Partition by department then filter ranked rows.", optimizationTip: "Index (dept_id, salary DESC).", alternativeQuery: "Use self-join on salary comparison counts." },
        { title: "Correlated scalar select", description: "Return employees above their department average.", query: "SELECT e.id, e.name FROM employees e WHERE e.salary > (SELECT AVG(x.salary) FROM employees x WHERE x.dept_id = e.dept_id);", expectedResult: [["1", "Asha"], ["4", "Divya"]], executionExplanation: "Correlated subquery compares row against partition aggregate.", optimizationTip: "Pre-aggregate in CTE for large datasets.", alternativeQuery: "WITH dept_avg AS (...) SELECT ... JOIN dept_avg ...;" },
      ],
    },
    "sql-joins": {
      easy: [
        { title: "Inner join employees and departments", description: "Return employee name with department name.", query: "SELECT e.name, d.name AS dept_name FROM employees e JOIN departments d ON e.dept_id = d.id;", expectedResult: [["Asha", "Engineering"], ["Chinmay", "Sales"]], executionExplanation: "INNER JOIN keeps only matched keys.", optimizationTip: "Index foreign key employees.dept_id.", alternativeQuery: "SELECT ... FROM departments d JOIN employees e ON d.id = e.dept_id;" },
        { title: "Left join with all employees", description: "Keep all employees even if department missing.", query: "SELECT e.name, d.name AS dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.id;", expectedResult: [["Asha", "Engineering"]], executionExplanation: "LEFT JOIN preserves left table cardinality.", optimizationTip: "Avoid selecting wide columns in joined scans.", alternativeQuery: "Use INNER JOIN when null-side rows are not needed." },
        { title: "Join with department filter", description: "Fetch only engineering employees with join.", query: "SELECT e.name FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.name = 'Engineering';", expectedResult: [["Asha"], ["Bharat"]], executionExplanation: "Filter pushed into join pipeline.", optimizationTip: "Index departments(name) for dimension filter.", alternativeQuery: "Use EXISTS subquery against departments." },
      ],
      medium: [
        { title: "Join + group headcount", description: "Count employees per department.", query: "SELECT d.name, COUNT(e.id) AS headcount FROM departments d LEFT JOIN employees e ON d.id = e.dept_id GROUP BY d.name ORDER BY d.name;", expectedResult: [["Engineering", "2"], ["Sales", "2"], ["Support", "1"]], executionExplanation: "JOIN then GROUP BY on dimension label.", optimizationTip: "Group on ids, project names if engine prefers.", alternativeQuery: "Aggregate employees first then join dimensions." },
        { title: "Self join manager mapping", description: "Map employee to manager in same table.", query: "SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.dept_id = m.dept_id AND m.salary > e.salary;", expectedResult: [["Bharat", "Asha"]], executionExplanation: "Self join compares rows within same table.", optimizationTip: "Composite index on (dept_id, salary).", alternativeQuery: "Use window functions for top manager per partition." },
        { title: "Join with window rank", description: "Rank salaries after joining department labels.", query: "SELECT d.name AS dept_name, e.name, e.salary, RANK() OVER (PARTITION BY d.name ORDER BY e.salary DESC) AS salary_rank FROM employees e JOIN departments d ON d.id = e.dept_id;", expectedResult: [["Engineering", "Asha", "90000.00", "1"]], executionExplanation: "Join enriches rows, window ranks within each department.", optimizationTip: "Keep partition keys narrow and indexed.", alternativeQuery: "Use DENSE_RANK if no gaps wanted." },
      ],
      hard: [
        { title: "Anti-join for empty departments", description: "Find departments that have zero employees.", query: "SELECT d.id, d.name FROM departments d LEFT JOIN employees e ON d.id = e.dept_id WHERE e.id IS NULL;", expectedResult: [], executionExplanation: "Anti-join pattern identifies non-matching dimension rows.", optimizationTip: "Ensure join key has index on fact table.", alternativeQuery: "Use NOT EXISTS with correlated subquery." },
        { title: "Top salary join report", description: "Highest paid employee by department.", query: "WITH ranked AS (SELECT e.*, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn FROM employees e) SELECT d.name, r.name, r.salary FROM ranked r JOIN departments d ON d.id = r.dept_id WHERE r.rn = 1;", expectedResult: [["Engineering", "Asha", "90000.00"]], executionExplanation: "Window in CTE followed by join for dimension labels.", optimizationTip: "Index (dept_id, salary DESC) for ranking.", alternativeQuery: "Use MAX(salary) + join back on salary and dept." },
        { title: "Join with HAVING filter", description: "Departments whose average salary is above 70000.", query: "SELECT d.name, AVG(e.salary) AS avg_salary FROM departments d JOIN employees e ON d.id = e.dept_id GROUP BY d.name HAVING AVG(e.salary) > 70000;", expectedResult: [["Engineering", "84000.00"]], executionExplanation: "HAVING filters aggregated groups after GROUP BY.", optimizationTip: "Pre-filter fact rows when possible.", alternativeQuery: "Use subquery on grouped averages then filter in outer WHERE." },
      ],
    },
    "sql-aggregations": {
      easy: [
        { title: "Count employees", description: "Count all employees in table.", query: "SELECT COUNT(*) AS total_employees FROM employees;", expectedResult: [["5"]], executionExplanation: "COUNT(*) scans row count.", optimizationTip: "Use metadata table only if exact count is not required.", alternativeQuery: "SELECT COUNT(id) FROM employees;" },
        { title: "Average salary", description: "Compute average salary across all employees.", query: "SELECT ROUND(AVG(salary), 2) AS avg_salary FROM employees;", expectedResult: [["72200.00"]], executionExplanation: "AVG aggregates numeric column into scalar output.", optimizationTip: "Avoid casting inside aggregate repeatedly.", alternativeQuery: "SELECT SUM(salary)/COUNT(*) FROM employees;" },
        { title: "Min and max salary", description: "Get minimum and maximum salary values.", query: "SELECT MIN(salary) AS min_salary, MAX(salary) AS max_salary FROM employees;", expectedResult: [["56000.00", "90000.00"]], executionExplanation: "Single pass computes min/max aggregates.", optimizationTip: "Index on salary can optimize min/max in some engines.", alternativeQuery: "ORDER BY salary LIMIT 1 for each bound." },
      ],
      medium: [
        { title: "Department-wise averages", description: "Aggregate average salary per department.", query: "SELECT dept_id, ROUND(AVG(salary),2) AS avg_salary FROM employees GROUP BY dept_id ORDER BY dept_id;", expectedResult: [["10", "84000.00"], ["20", "68500.00"], ["30", "56000.00"]], executionExplanation: "GROUP BY partitions rows by department.", optimizationTip: "Index on dept_id improves grouping phase.", alternativeQuery: "Join departments for labels after grouping." },
        { title: "Group + having threshold", description: "Keep departments with count >= 2.", query: "SELECT dept_id, COUNT(*) AS cnt FROM employees GROUP BY dept_id HAVING COUNT(*) >= 2;", expectedResult: [["10", "2"], ["20", "2"]], executionExplanation: "HAVING applies filter to grouped rows.", optimizationTip: "Push raw-row filters into WHERE before grouping.", alternativeQuery: "Wrap grouped query in CTE then filter in outer WHERE." },
        { title: "Window aggregate by department", description: "Show each employee with department average salary.", query: "SELECT id, name, dept_id, salary, AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg FROM employees;", expectedResult: [["1", "Asha", "10", "90000.00", "84000.00"]], executionExplanation: "Window keeps row-level detail while exposing group aggregate.", optimizationTip: "Use partition key indexes.", alternativeQuery: "Join employees with grouped dept average subquery." },
      ],
      hard: [
        { title: "Percent of department total", description: "Calculate employee salary as percentage of department sum.", query: "SELECT name, dept_id, ROUND(100 * salary / SUM(salary) OVER (PARTITION BY dept_id), 2) AS pct_of_dept FROM employees;", expectedResult: [["Asha", "10", "51.14"]], executionExplanation: "Window SUM gives denominator without collapsing rows.", optimizationTip: "Avoid repeated subqueries by using windows.", alternativeQuery: "Join against department SUM CTE and divide." },
        { title: "Rolling monthly hires", description: "Compute rolling 2-row count by created_at order.", query: "SELECT id, created_at, COUNT(*) OVER (ORDER BY created_at ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS rolling_count FROM employees;", expectedResult: [["1", "2025-01-10", "1"]], executionExplanation: "Window frame gives rolling window metrics.", optimizationTip: "Index created_at for ordered windows.", alternativeQuery: "Self-join on date ranges for old engines." },
        { title: "Top department by payroll", description: "Find department with highest total salary.", query: "SELECT dept_id, SUM(salary) AS payroll FROM employees GROUP BY dept_id ORDER BY payroll DESC LIMIT 1;", expectedResult: [["10", "168000.00"]], executionExplanation: "Aggregate then order descending and pick top row.", optimizationTip: "Materialized aggregate table for frequent reporting.", alternativeQuery: "Use window rank on grouped payroll and filter rank=1." },
      ],
    },
    transactions: {
      easy: [
        { title: "Single transfer transaction", description: "Debit and credit in one ACID transaction.", query: "START TRANSACTION;\nUPDATE employees SET salary = salary - 1000 WHERE id = 1;\nUPDATE employees SET salary = salary + 1000 WHERE id = 2;\nCOMMIT;", expectedResult: [["COMMIT"]], executionExplanation: "Either both updates persist or none persist.", optimizationTip: "Keep transactions short to reduce lock time.", alternativeQuery: "Use stored procedure wrapping both updates." },
        { title: "Rollback on error", description: "Demonstrate rollback after failed update.", query: "START TRANSACTION;\nUPDATE employees SET salary = salary - 500 WHERE id = 3;\n-- simulate failure\nROLLBACK;", expectedResult: [["ROLLBACK"]], executionExplanation: "Rollback returns table to pre-transaction state.", optimizationTip: "Validate constraints before opening transaction.", alternativeQuery: "Use savepoints for partial rollback." },
        { title: "Read committed demo", description: "Run a transaction with explicit isolation level.", query: "SET TRANSACTION ISOLATION LEVEL READ COMMITTED;\nSTART TRANSACTION;\nSELECT * FROM employees WHERE id = 1;\nCOMMIT;", expectedResult: [["1", "Asha"]], executionExplanation: "READ COMMITTED prevents dirty reads.", optimizationTip: "Pick isolation level based on anomaly tolerance.", alternativeQuery: "Repeat with REPEATABLE READ and compare behavior." },
      ],
      medium: [
        { title: "Savepoint usage", description: "Use savepoint and rollback to savepoint.", query: "START TRANSACTION;\nUPDATE employees SET salary = salary + 1000 WHERE id = 4;\nSAVEPOINT s1;\nUPDATE employees SET salary = salary + 1000 WHERE id = 5;\nROLLBACK TO s1;\nCOMMIT;", expectedResult: [["id=4 updated, id=5 reverted"]], executionExplanation: "Savepoints enable partial rollback in long transactions.", optimizationTip: "Use savepoints sparingly for critical checkpoints.", alternativeQuery: "Split independent steps into separate transactions." },
        { title: "Detect lock contention", description: "Select rows FOR UPDATE before update.", query: "START TRANSACTION;\nSELECT * FROM employees WHERE dept_id = 10 FOR UPDATE;\nUPDATE employees SET salary = salary + 200 WHERE dept_id = 10;\nCOMMIT;", expectedResult: [["2 rows updated"]], executionExplanation: "FOR UPDATE acquires row locks for safe concurrent updates.", optimizationTip: "Lock smallest row set possible.", alternativeQuery: "Use optimistic locking version columns in application layer." },
        { title: "Transactional running ledger", description: "Compute running salary ledger in transaction report.", query: "START TRANSACTION;\nSELECT id, salary, SUM(salary) OVER (ORDER BY id) AS running_total FROM employees;\nCOMMIT;", expectedResult: [["1", "90000.00", "90000.00"]], executionExplanation: "Window function supports deterministic in-transaction reports.", optimizationTip: "Prefer snapshot-consistent reads for reporting.", alternativeQuery: "Use materialized ledger table updated periodically." },
      ],
      hard: [
        { title: "Serializable conflict handling", description: "Run serializable transaction and retry on conflict.", query: "SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;\nSTART TRANSACTION;\nUPDATE employees SET salary = salary * 1.02 WHERE dept_id = 20;\nCOMMIT;", expectedResult: [["retry may be required on serialization failure"]], executionExplanation: "Highest isolation may abort transactions; retry loop required.", optimizationTip: "Use exponential backoff retries.", alternativeQuery: "Use REPEATABLE READ with explicit row locks if acceptable." },
        { title: "Idempotent compensation flow", description: "Transfer with compensation and transaction id checks.", query: "START TRANSACTION;\n-- check transfer_log for txn_id\n-- apply debit/credit if absent\n-- insert transfer_log\nCOMMIT;", expectedResult: [["exactly-once semantic via transaction log"]], executionExplanation: "Idempotency key avoids double debit on retries.", optimizationTip: "Unique index on txn_id in transfer_log.", alternativeQuery: "Outbox pattern with async settlement worker." },
        { title: "Window anomaly audit", description: "Audit suspicious jumps in salaries after transaction batches.", query: "SELECT id, salary, LAG(salary) OVER (ORDER BY id) AS prev_salary FROM employees;", expectedResult: [["2", "78000.00", "90000.00"]], executionExplanation: "LAG window helps detect anomalies between adjacent states.", optimizationTip: "Persist historical snapshots for robust audit.", alternativeQuery: "Join current rows against previous snapshot table." },
      ],
    },
  };

  const selected = sets[topicSlug];
  return buildTieredWithRich(topicSlug, "sql", {
    easy: selected.easy.map((p) => ({
      ...p,
      expectedResult: normalizeSqlExpectedResult(p.expectedResult),
      schema: SQL_SCHEMA,
      sampleData: SQL_SAMPLE_DATA,
      commonMistakes: p.commonMistakes ?? ["Missing WHERE in mutating queries."],
    })),
    medium: selected.medium.map((p) => ({
      ...p,
      expectedResult: normalizeSqlExpectedResult(p.expectedResult),
      schema: SQL_SCHEMA,
      sampleData: SQL_SAMPLE_DATA,
      commonMistakes: p.commonMistakes ?? ["Incorrect grouping or alias usage."],
    })),
    hard: selected.hard.map((p) => ({
      ...p,
      expectedResult: normalizeSqlExpectedResult(p.expectedResult),
      schema: SQL_SCHEMA,
      sampleData: SQL_SAMPLE_DATA,
      commonMistakes: p.commonMistakes ?? ["Ignoring transaction/isolation edge cases."],
    })),
  });
}

function dbDesignProblems(topicSlug) {
  const focus = topicSlug === "normalization" ? "normal forms and decomposition" : "index strategy and query acceleration";
  const base = {
    easy: [
      { title: `${TOPIC_TITLES[topicSlug]} basics 1`, description: `Design a simple ecommerce schema focused on ${focus}.`, erDiagram: "User 1..N Order, Order 1..N OrderItem", tables: ["users(id PK, email UNIQUE)", "orders(id PK, user_id FK)"], relationships: ["users.id -> orders.user_id"], normalization: "Keep atomic columns and remove repeating groups.", indexes: ["PK on id", "UNIQUE on users.email"], realWorldExample: "User placing first order." },
      { title: `${TOPIC_TITLES[topicSlug]} basics 2`, description: "Map one-to-many and many-to-many relations cleanly.", erDiagram: "Post N..N Tag via post_tags", tables: ["posts(id PK)", "tags(id PK)", "post_tags(post_id FK, tag_id FK)"], relationships: ["posts.id -> post_tags.post_id", "tags.id -> post_tags.tag_id"], normalization: "Use bridge tables for many-to-many.", indexes: ["INDEX(post_tags.post_id, post_tags.tag_id)"], realWorldExample: "Blog tags system." },
      { title: `${TOPIC_TITLES[topicSlug]} basics 3`, description: "Model inventory with stock transactions and snapshots.", erDiagram: "Product 1..N StockTxn", tables: ["products(id PK, sku UNIQUE)", "stock_txn(id PK, product_id FK, delta)"], relationships: ["products.id -> stock_txn.product_id"], normalization: "Store immutable movement rows instead of overwriting counters.", indexes: ["INDEX(stock_txn.product_id, created_at)"], realWorldExample: "Warehouse stock movement." },
    ],
    medium: [
      { title: `${TOPIC_TITLES[topicSlug]} medium 1`, description: "Normalize a denormalized customer-order CSV dump.", erDiagram: "Customer 1..N Order 1..N Item", tables: ["customers", "orders", "order_items"], relationships: ["customers.id -> orders.customer_id"], normalization: "Decompose into 3NF and isolate transitive dependencies.", indexes: ["INDEX(orders.customer_id, created_at)"], realWorldExample: "Migration from spreadsheet to RDBMS." },
      { title: `${TOPIC_TITLES[topicSlug]} medium 2`, description: "Choose candidate keys and surrogate keys for auditability.", erDiagram: "Invoice N..1 Customer", tables: ["invoices(id PK, invoice_no UNIQUE, customer_id FK)"], relationships: ["customers.id -> invoices.customer_id"], normalization: "Business key unique constraints + surrogate PK.", indexes: ["UNIQUE(invoice_no)", "INDEX(customer_id)"], realWorldExample: "Billing system." },
      { title: `${TOPIC_TITLES[topicSlug]} medium 3`, description: "Design partition-friendly event schema with tenant isolation.", erDiagram: "Tenant 1..N Event", tables: ["tenants(id PK)", "events(id PK, tenant_id FK, payload JSON)"], relationships: ["tenants.id -> events.tenant_id"], normalization: "Keep tenant key in all child tables.", indexes: ["INDEX(events.tenant_id, created_at)"], realWorldExample: "Multi-tenant SaaS activity feed." },
    ],
    hard: [
      { title: `${TOPIC_TITLES[topicSlug]} hard 1`, description: "Balance OLTP writes with OLAP reporting needs.", erDiagram: "Operational tables + summary tables", tables: ["orders", "order_items", "daily_sales_summary"], relationships: ["daily summary derived from transactional facts"], normalization: "Maintain normalized write model and denormalized read model.", indexes: ["Covering indexes for reporting filters"], realWorldExample: "Executive dashboard queries." },
      { title: `${TOPIC_TITLES[topicSlug]} hard 2`, description: "Prevent hot indexes and write amplification under heavy load.", erDiagram: "Time-series write stream", tables: ["events(id, shard_key, ts, payload)"], relationships: ["logical relation by shard_key"], normalization: "Optimize key distribution while preserving relational integrity.", indexes: ["Composite index (shard_key, ts DESC)"], realWorldExample: "10k writes/sec ingestion service." },
      { title: `${TOPIC_TITLES[topicSlug]} hard 3`, description: "Evolve schema with zero-downtime migration strategy.", erDiagram: "Old + new columns with backfill job", tables: ["users(old_col, new_col_nullable)"], relationships: ["dual-write period before cutover"], normalization: "Temporary redundancy during migration, then cleanup.", indexes: ["New index built concurrently before switch"], realWorldExample: "Large production migration." },
    ],
  };
  return buildTieredWithRich(topicSlug, "database-design", base);
}

function jdbcCode(resource, operation) {
  return `import java.sql.*;
import java.util.*;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

public class ${resource}${operation}Jdbc {
  private final HikariDataSource dataSource;

  public ${resource}${operation}Jdbc() {
    HikariConfig cfg = new HikariConfig();
    cfg.setJdbcUrl("jdbc:mysql://localhost:3306/appdb");
    cfg.setUsername("app_user");
    cfg.setPassword("app_pass");
    cfg.setMaximumPoolSize(8);
    dataSource = new HikariDataSource(cfg);
  }

  public List<Map<String, Object>> execute() throws SQLException {
    String sql = "SELECT id, name FROM ${resource.toLowerCase()}s ORDER BY id";
    try (Connection conn = dataSource.getConnection();
         PreparedStatement ps = conn.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {
      List<Map<String, Object>> rows = new ArrayList<>();
      while (rs.next()) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", rs.getLong("id"));
        row.put("name", rs.getString("name"));
        rows.add(row);
      }
      return rows;
    }
  }
}
`;
}

function springCode(resource) {
  const lc = resource.toLowerCase();
  const cap = resource;
  return `import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Entity
@Table(name = "${lc}s")
class ${cap} {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @NotBlank
  private String name;
  public Long getId() { return id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
}

interface ${cap}Repository extends JpaRepository<${cap}, Long> {}

@Service
class ${cap}Service {
  private final ${cap}Repository repository;
  ${cap}Service(${cap}Repository repository) { this.repository = repository; }
  List<${cap}> list() { return repository.findAll(); }
  ${cap} create(${cap} entity) { return repository.save(entity); }
}

@RestController
@RequestMapping("/api/${lc}s")
class ${cap}Controller {
  private final ${cap}Service service;
  ${cap}Controller(${cap}Service service) { this.service = service; }

  @GetMapping
  List<${cap}> getAll() { return service.list(); }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  ${cap} create(@RequestBody ${cap} payload) {
    return service.create(payload);
  }
}
`;
}

function hibernateCode(resource) {
  return `import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "${resource.toLowerCase()}_orders")
class ${resource}Order {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private LocalDateTime createdAt = LocalDateTime.now();
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
  private List<${resource}OrderItem> items;
}

@Entity
@Table(name = "${resource.toLowerCase()}_order_items")
class ${resource}OrderItem {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String sku;
  private Integer qty;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "order_id", nullable = false)
  private ${resource}Order order;
}
`;
}

function restProblems(topicSlug) {
  const title = TOPIC_TITLES[topicSlug];
  const basePath = topicSlug === "swagger" ? "/api/v1/docs" : "/api/v1/users";
  const base = {
    easy: [
      { title: `${title} easy 1`, description: "Design read endpoint with clean response schema.", endpoint: `${basePath}`, method: "GET", headers: { Accept: "application/json" }, requestBody: "", responseBody: '{"data":[{"id":1,"name":"Asha"}]}', statusCode: 200, postmanExample: `GET http://localhost:8080${basePath}`, curlExample: `curl -X GET http://localhost:8080${basePath}`, apiDiagram: "Client -> Controller -> Service -> Repository -> DB" },
      { title: `${title} easy 2`, description: "Create resource endpoint with HTTP 201.", endpoint: `${basePath}`, method: "POST", headers: { "Content-Type": "application/json" }, requestBody: '{"name":"Ravi"}', responseBody: '{"id":42,"name":"Ravi"}', statusCode: 201, postmanExample: `POST ${basePath} with JSON body`, curlExample: `curl -X POST http://localhost:8080${basePath} -H "Content-Type: application/json" -d '{"name":"Ravi"}'`, apiDiagram: "Validate -> Persist -> Return Created + Location" },
      { title: `${title} easy 3`, description: "Fetch by id and handle not-found semantics.", endpoint: `${basePath}/42`, method: "GET", headers: { Accept: "application/json" }, requestBody: "", responseBody: '{"id":42,"name":"Ravi"}', statusCode: 200, postmanExample: `GET ${basePath}/42`, curlExample: `curl -i http://localhost:8080${basePath}/42`, apiDiagram: "Path param -> lookup -> 200 or 404" },
    ],
    medium: [
      { title: `${title} medium 1`, description: "Validation failure model with field errors.", endpoint: `${basePath}`, method: "POST", headers: { "Content-Type": "application/json" }, requestBody: '{"name":"","email":"bad"}', responseBody: '{"status":400,"errors":[{"field":"name","message":"must not be blank"}]}', statusCode: 400, postmanExample: "Assert 400 error schema in tests", curlExample: `curl -X POST http://localhost:8080${basePath} -d '{"name":"","email":"bad"}'`, apiDiagram: "@Valid -> ConstraintViolation -> ControllerAdvice" },
      { title: `${title} medium 2`, description: "Paginated list endpoint with metadata.", endpoint: `${basePath}?page=0&size=20&sort=name,asc`, method: "GET", headers: { Accept: "application/json" }, requestBody: "", responseBody: '{"content":[...],"page":0,"size":20,"totalElements":133}', statusCode: 200, postmanExample: "GET with page/size/sort params", curlExample: `curl "http://localhost:8080${basePath}?page=0&size=20"`, apiDiagram: "Controller -> Pageable -> Page<T> serializer" },
      { title: `${title} medium 3`, description: "Update endpoint with idempotent semantics.", endpoint: `${basePath}/42`, method: "PUT", headers: { "Content-Type": "application/json" }, requestBody: '{"name":"Ravi Updated"}', responseBody: '{"id":42,"name":"Ravi Updated"}', statusCode: 200, postmanExample: "Repeat same PUT and verify same state", curlExample: `curl -X PUT http://localhost:8080${basePath}/42 -d '{"name":"Ravi Updated"}'`, apiDiagram: "PUT replace -> save -> 200" },
    ],
    hard: [
      { title: `${title} hard 1`, description: "Document endpoint with OpenAPI and contract-first flow.", endpoint: "/v3/api-docs", method: "GET", headers: { Accept: "application/json" }, requestBody: "", responseBody: '{"openapi":"3.0.1","paths":{...}}', statusCode: 200, postmanExample: "Import OpenAPI spec in Postman", curlExample: "curl http://localhost:8080/v3/api-docs", apiDiagram: "Code annotations -> OpenAPI generator -> Client SDK" },
      { title: `${title} hard 2`, description: "Design resilient API error envelope with trace id.", endpoint: `${basePath}`, method: "POST", headers: { "Content-Type": "application/json", "X-Correlation-Id": "cid-123" }, requestBody: '{"name":"duplicate"}', responseBody: '{"status":409,"code":"USER_EXISTS","traceId":"cid-123"}', statusCode: 409, postmanExample: "Assert conflict response includes traceId", curlExample: `curl -X POST http://localhost:8080${basePath} -H "X-Correlation-Id: cid-123"`, apiDiagram: "Controller -> Service -> Exception map -> standardized envelope" },
      { title: `${title} hard 3`, description: "Rate-limited endpoint contract and retry headers.", endpoint: `${basePath}`, method: "GET", headers: { Accept: "application/json" }, requestBody: "", responseBody: '{"error":"RATE_LIMIT_EXCEEDED"}', statusCode: 429, postmanExample: "Burst requests and verify Retry-After header", curlExample: `curl -i http://localhost:8080${basePath}`, apiDiagram: "Gateway limiter -> service -> 429 + Retry-After" },
    ],
  };
  return buildTieredWithRich(topicSlug, "rest-api", base);
}

function mongoProblems(topicSlug) {
  const title = TOPIC_TITLES[topicSlug];
  const base = {
    easy: [
      { title: `${title} easy 1`, description: "Insert and query user documents.", document: '{ "_id":"u1", "name":"Asha", "skills":["java","sql"] }', collection: "users", query: 'db.users.find({ "skills": "sql" })', aggregation: "N/A", expectedOutput: '[{ "_id":"u1", "name":"Asha" }]', sqlComparison: "SELECT * FROM users JOIN user_skills ON ... WHERE skill='sql'" },
      { title: `${title} easy 2`, description: "Filter by nested field and projection.", document: '{ "_id":"u2", "profile": { "city":"Hyderabad" } }', collection: "users", query: 'db.users.find({ "profile.city":"Hyderabad" }, { name:1, _id:0 })', aggregation: "N/A", expectedOutput: '[{ "name":"Asha" }]', sqlComparison: "SELECT name FROM users WHERE city='Hyderabad'" },
      { title: `${title} easy 3`, description: "Count documents by status.", document: '{ "orderId":"o1", "status":"PAID" }', collection: "orders", query: 'db.orders.countDocuments({ "status":"PAID" })', aggregation: "N/A", expectedOutput: "3", sqlComparison: "SELECT COUNT(*) FROM orders WHERE status='PAID'" },
    ],
    medium: [
      { title: `${title} medium 1`, description: "Aggregate revenue per customer.", document: '{ "customerId":"c1", "amount":250 }', collection: "orders", query: 'db.orders.aggregate([{ $group: { _id:"$customerId", total:{ $sum:"$amount" } } }])', aggregation: "$group by customerId and sum amount", expectedOutput: '[{ "_id":"c1", "total":900 }]', sqlComparison: "SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id" },
      { title: `${title} medium 2`, description: "Lookup customer names in orders report.", document: '{ "_id":"c1", "name":"Asha" }', collection: "orders", query: 'db.orders.aggregate([{ $lookup: { from:"customers", localField:"customerId", foreignField:"_id", as:"customer" } }])', aggregation: "$lookup join-like behavior", expectedOutput: '[{ "customerId":"c1", "customer":[{"name":"Asha"}] }]', sqlComparison: "SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id" },
      { title: `${title} medium 3`, description: "Top N orders with sort and limit.", document: '{ "orderId":"o9", "amount":1200 }', collection: "orders", query: 'db.orders.find({}, { orderId:1, amount:1, _id:0 }).sort({ amount:-1 }).limit(3)', aggregation: "sort + limit pipeline equivalent", expectedOutput: '[{ "orderId":"o9","amount":1200 }]', sqlComparison: "SELECT order_id, amount FROM orders ORDER BY amount DESC LIMIT 3" },
    ],
    hard: [
      { title: `${title} hard 1`, description: "Windowed analytics in aggregation pipeline.", document: '{ "customerId":"c1", "month":"2026-01", "amount":100 }', collection: "monthly_spend", query: 'db.monthly_spend.aggregate([{ $setWindowFields: { partitionBy:"$customerId", sortBy:{ month:1 }, output:{ runningTotal:{ $sum:"$amount", window:{ documents:["unbounded","current"] } } } } }])', aggregation: "$setWindowFields running total per customer", expectedOutput: '[{ "customerId":"c1","runningTotal":100 }]', sqlComparison: "SUM(amount) OVER (PARTITION BY customer_id ORDER BY month)" },
      { title: `${title} hard 2`, description: "Schema design trade-off for product catalog.", document: '{ "_id":"p1", "variants":[...] }', collection: "products", query: "Design: embedded variants vs separate collection refs", aggregation: "N/A", expectedOutput: "Decision document with consistency and query trade-offs", sqlComparison: "3NF product + product_variants tables with joins" },
      { title: `${title} hard 3`, description: "Transactional stock reservation in MongoDB.", document: '{ "_id":"sku1", "available":12 }', collection: "inventory", query: "Use session.withTransaction() to reserve stock and create order atomically", aggregation: "N/A", expectedOutput: "Reservation succeeds or rolls back fully", sqlComparison: "BEGIN; UPDATE inventory; INSERT order; COMMIT;" },
    ],
  };
  return buildTieredWithRich(topicSlug, "mongodb", base);
}

function gitProblems(topicSlug) {
  const title = TOPIC_TITLES[topicSlug];
  const base = {
    easy: [
      { title: `${title} easy 1`, description: "Initialize repository and inspect state.", command: "git init\ngit status", terminalOutput: "Initialized empty Git repository\nOn branch main\nnothing to commit", workflowDiagram: "Working directory -> Staging -> Commit", explanation: "Initialize local repo before first commit." },
      { title: `${title} easy 2`, description: "Commit a clean logical change.", command: "git add src/UserService.java\ngit commit -m \"Add user listing endpoint\"", terminalOutput: "[main abc123] Add user listing endpoint\n1 file changed, 38 insertions(+)", workflowDiagram: "Edit -> Add -> Commit", explanation: "One commit should represent one logical unit." },
      { title: `${title} easy 3`, description: "View concise commit history.", command: "git log --oneline -5", terminalOutput: "ab12cd3 Add pagination\n98ef321 Add validation advice", workflowDiagram: "DAG of commits", explanation: "Use oneline format for quick review." },
    ],
    medium: [
      { title: `${title} medium 1`, description: "Create feature branch and push upstream.", command: "git checkout -b feature/rbac-audit\ngit push -u origin feature/rbac-audit", terminalOutput: "Switched to a new branch 'feature/rbac-audit'\nBranch set up to track remote", workflowDiagram: "main -> feature branch -> PR", explanation: "Branch isolation keeps main stable." },
      { title: `${title} medium 2`, description: "Rebase feature branch on latest main.", command: "git fetch origin\ngit rebase origin/main", terminalOutput: "Successfully rebased and updated refs/heads/feature/rbac-audit", workflowDiagram: "Linear history after rebase", explanation: "Rebase reduces noisy merge commits in PRs." },
      { title: `${title} medium 3`, description: "Resolve merge conflict safely.", command: "git merge feature/rbac-audit\n# resolve conflicts\ngit add .\ngit commit", terminalOutput: "CONFLICT (content): Merge conflict in UserController.java\nAutomatic merge failed; fix conflicts and commit", workflowDiagram: "Conflict markers -> resolution -> merge commit", explanation: "Review both sides before removing conflict markers." },
    ],
    hard: [
      { title: `${title} hard 1`, description: "Recover accidentally lost commit with reflog.", command: "git reflog\ngit checkout <lost-sha>\ngit cherry-pick <lost-sha>", terminalOutput: "HEAD@{2}: commit: RBAC rules fix\n[main ef4521] RBAC rules fix", workflowDiagram: "Reflog timeline -> restore commit", explanation: "Reflog tracks HEAD movements and helps recovery." },
      { title: `${title} hard 2`, description: "Prepare polished PR history with interactive rebase.", command: "git rebase -i origin/main", terminalOutput: "pick a1b2c3 add endpoint\nsquash d4e5f6 fix tests", workflowDiagram: "Many WIP commits -> squashed clean history", explanation: "Clean history improves review readability." },
      { title: `${title} hard 3`, description: "Tag and release workflow for backend deployment.", command: "git checkout main\ngit pull\ngit tag -a v1.4.0 -m \"Release 1.4.0\"\ngit push origin v1.4.0", terminalOutput: "Tagged v1.4.0\n* [new tag] v1.4.0 -> v1.4.0", workflowDiagram: "Main -> Tag -> CI Release", explanation: "Signed, versioned tags anchor release artifacts." },
    ],
  };
  return buildTieredWithRich(topicSlug, "git", base);
}

function aiProblems(topicSlug) {
  const title = TOPIC_TITLES[topicSlug];
  const base = {
    easy: [
      { title: `${title} easy 1`, description: "Craft a precise prompt for backend bug triage.", concept: "Prompt specificity", prompt: "Debug my API issue.", goodPrompt: "I get HTTP 500 on POST /api/v1/orders with payload {...}. Stack trace: ... Suggest root cause and fix.", badPrompt: "api broken help", aiOutput: "Likely validation mapping issue in OrderRequest; add @Valid and handle MethodArgumentNotValidException.", whyAiResponded: "Good prompt includes endpoint, payload, error, and expectation.", exercise: "Refine one vague prompt into a debuggable prompt." },
      { title: `${title} easy 2`, description: "Use AI to explain SQL query behavior.", concept: "Query explanation", prompt: "Explain this query.", goodPrompt: "Explain how this SQL with GROUP BY and HAVING executes and where indexes help.", badPrompt: "what does this do", aiOutput: "Query groups rows by dept_id then filters groups where count >= 2.", whyAiResponded: "Includes target concepts and expected depth.", exercise: "Ask AI for execution plan interpretation and verify manually." },
      { title: `${title} easy 3`, description: "Generate interview flashcards for Spring annotations.", concept: "Study acceleration", prompt: "Give spring questions.", goodPrompt: "Create 10 flashcards for @RestController, @Service, @Transactional with one practical example each.", badPrompt: "spring cards", aiOutput: "Q: Why constructor injection over field injection? A: testability and immutability.", whyAiResponded: "Scope and format constraints improve output quality.", exercise: "Convert output into daily review deck." },
    ],
    medium: [
      { title: `${title} medium 1`, description: "Run AI mock interview loop with grading rubric.", concept: "Interview simulation", prompt: "Take my interview.", goodPrompt: "Act as backend interviewer. Ask one JDBC question at a time, wait for my answer, then score on correctness and clarity.", badPrompt: "interview me now", aiOutput: "Question 1: Explain PreparedStatement benefits over Statement.", whyAiResponded: "Interaction style and rubric are explicitly requested.", exercise: "Do a 5-question session and capture weak areas." },
      { title: `${title} medium 2`, description: "Compare two API designs with AI critique.", concept: "Design review", prompt: "Which API is better?", goodPrompt: "Compare API A vs B for pagination, error envelope, and backward compatibility. Provide pros/cons table in bullets.", badPrompt: "better one pls", aiOutput: "API B is superior for explicit pagination metadata and versioning.", whyAiResponded: "Evaluation criteria are well-defined.", exercise: "Adopt one recommendation in your current project." },
      { title: `${title} medium 3`, description: "Improve prompt to avoid hallucinated libraries.", concept: "Grounding constraints", prompt: "Write complete code quickly.", goodPrompt: "Use only Spring Boot 3, Jakarta annotations, and Java 21. Do not invent libraries. Mention assumptions.", badPrompt: "just do complete backend", aiOutput: "Provides Spring Boot-compatible code and lists assumptions.", whyAiResponded: "Environment constraints reduce invalid outputs.", exercise: "Add test constraints and rerun prompt." },
    ],
    hard: [
      { title: `${title} hard 1`, description: "Design AI-assisted coding workflow with human checkpoints.", concept: "Human-in-the-loop", prompt: "How to use AI daily?", goodPrompt: "Propose an AI workflow for backend development including prompt templates, code review gates, and security checklist.", badPrompt: "daily ai plan", aiOutput: "Plan includes ideation, implementation draft, verification, and manual review gates.", whyAiResponded: "Structured workflow request drives actionable plan.", exercise: "Pilot this workflow for one sprint." },
      { title: `${title} hard 2`, description: "Analyze why AI output was wrong and repair prompt.", concept: "Failure analysis", prompt: "AI gave wrong answer.", goodPrompt: "This JWT filter answer failed because it ignored token expiration handling. Diagnose gap and rewrite prompt.", badPrompt: "wrong answer fix", aiOutput: "Root cause: insufficient constraints and missing failure examples.", whyAiResponded: "Prompt includes failure context and expected correction path.", exercise: "Record two prompt failure patterns and fixes." },
      { title: `${title} hard 3`, description: "Create a reusable prompt library for backend tasks.", concept: "Prompt systems", prompt: "Give reusable prompts.", goodPrompt: "Create reusable templates for SQL optimization, Spring API design, security review, and incident RCA.", badPrompt: "templates", aiOutput: "Returns categorized prompt templates with placeholders.", whyAiResponded: "Task taxonomy and deliverable format are explicit.", exercise: "Integrate templates into your project README." },
    ],
  };
  return buildTieredWithRich(topicSlug, "ai", base);
}

function jdbcProblems(topicSlug) {
  const base = {
    easy: [
      { title: "JDBC easy 1", description: "Read users with PreparedStatement and ResultSet mapping.", code: jdbcCode("User", "Read"), filename: "UserReadJdbc.java", expectedOutput: "Returns ordered user rows from database." },
      { title: "JDBC easy 2", description: "Insert user with generated key retrieval.", code: jdbcCode("User", "Insert"), filename: "UserInsertJdbc.java", expectedOutput: "Returns inserted id and user payload." },
      { title: "JDBC easy 3", description: "Update user safely with parameterized query.", code: jdbcCode("User", "Update"), filename: "UserUpdateJdbc.java", expectedOutput: "Returns affected row count after update." },
    ],
    medium: [
      { title: "JDBC medium 1", description: "Transaction-safe transfer using commit and rollback.", code: jdbcCode("Payment", "Transfer"), filename: "PaymentTransferJdbc.java", expectedOutput: "Debit and credit either both commit or rollback." },
      { title: "JDBC medium 2", description: "Batch insert orders using executeBatch for throughput.", code: jdbcCode("Order", "Batch"), filename: "OrderBatchJdbc.java", expectedOutput: "Bulk inserts complete with reduced round trips." },
      { title: "JDBC medium 3", description: "Repository class with pagination query and total count.", code: jdbcCode("Order", "Page"), filename: "OrderPageJdbc.java", expectedOutput: "Returns page rows plus total row count." },
    ],
    hard: [
      { title: "JDBC hard 1", description: "Build REST endpoint backed by plain JDBC repository.", code: jdbcCode("Invoice", "Api"), filename: "InvoiceApiJdbc.java", expectedOutput: "REST layer serves JDBC-backed invoice resources." },
      { title: "JDBC hard 2", description: "Implement optimistic locking using version column checks.", code: jdbcCode("Ticket", "Optimistic"), filename: "TicketOptimisticJdbc.java", expectedOutput: "Update fails when version mismatch occurs." },
      { title: "JDBC hard 3", description: "Run idempotent payment operation with transaction log table.", code: jdbcCode("Ledger", "Idempotent"), filename: "LedgerIdempotentJdbc.java", expectedOutput: "Duplicate request replays return prior success state." },
    ],
  };
  return buildTieredWithRich(topicSlug, "jdbc", base);
}

function springProblems(topicSlug) {
  const resource = topicSlug === "capstone-backend" ? "CapstoneTask" : topicSlug === "spring-core" ? "CoreItem" : "BootUser";
  const base = {
    easy: [
      { title: `${TOPIC_TITLES[topicSlug]} easy 1`, description: "Create minimal REST resource with service and repository layers.", code: springCode(resource), filename: `${resource}Controller.java`, expectedOutput: "GET and POST endpoints work with JPA persistence." },
      { title: `${TOPIC_TITLES[topicSlug]} easy 2`, description: "Wire dependency injection and persistence annotations correctly.", code: springCode(resource), filename: `${resource}Service.java`, expectedOutput: "Bean wiring succeeds with constructor injection." },
      { title: `${TOPIC_TITLES[topicSlug]} easy 3`, description: "Return HTTP 201 for create endpoint.", code: springCode(resource), filename: `${resource}CreateApi.java`, expectedOutput: "Create call returns persisted entity and status 201." },
    ],
    medium: [
      { title: `${TOPIC_TITLES[topicSlug]} medium 1`, description: "Add validation and global exception handling strategy.", code: springCode(resource), filename: `${resource}ValidationApi.java`, expectedOutput: "Invalid payloads return structured 400 responses." },
      { title: `${TOPIC_TITLES[topicSlug]} medium 2`, description: "Implement pagination endpoint using Spring Pageable.", code: springCode(resource), filename: `${resource}PageApi.java`, expectedOutput: "Client receives paginated list with metadata." },
      { title: `${TOPIC_TITLES[topicSlug]} medium 3`, description: "Add update and delete endpoints with proper status codes.", code: springCode(resource), filename: `${resource}MutationsApi.java`, expectedOutput: "PUT and DELETE semantics are correctly implemented." },
    ],
    hard: [
      { title: `${TOPIC_TITLES[topicSlug]} hard 1`, description: "Compose capstone-ready module with layered architecture.", code: springCode(resource), filename: `${resource}CapstoneModule.java`, expectedOutput: "Feature module supports clean extension and testing." },
      { title: `${TOPIC_TITLES[topicSlug]} hard 2`, description: "Apply transactional boundaries across service methods.", code: springCode(resource), filename: `${resource}TransactionalService.java`, expectedOutput: "Multi-step operations commit atomically." },
      { title: `${TOPIC_TITLES[topicSlug]} hard 3`, description: "Expose secure admin endpoint with role checks.", code: springCode(resource), filename: `${resource}AdminController.java`, expectedOutput: "Only authorized roles can access admin actions." },
    ],
  };
  return buildTieredWithRich(topicSlug, "spring-boot", base);
}

function hibernateProblems(topicSlug) {
  const base = {
    easy: [
      { title: "JPA Hibernate easy 1", description: "Map entity and repository for order domain.", code: hibernateCode("Sales"), filename: "SalesOrderEntities.java", expectedOutput: "Entity mappings compile with proper relations." },
      { title: "JPA Hibernate easy 2", description: "Persist parent-child graph with cascade settings.", code: hibernateCode("Billing"), filename: "BillingOrderEntities.java", expectedOutput: "Persisting parent writes child rows automatically." },
      { title: "JPA Hibernate easy 3", description: "Fetch entity by id and map lazy relation safely.", code: hibernateCode("Catalog"), filename: "CatalogOrderEntities.java", expectedOutput: "Lazy relation accessed within transaction without exception." },
    ],
    medium: [
      { title: "JPA Hibernate medium 1", description: "Create JPQL query for active orders with pagination.", code: hibernateCode("Ops"), filename: "OpsOrderQueries.java", expectedOutput: "JPQL query returns paginated active orders." },
      { title: "JPA Hibernate medium 2", description: "Prevent N+1 issue using fetch join strategy.", code: hibernateCode("Retail"), filename: "RetailFetchJoin.java", expectedOutput: "Single query fetches orders and items." },
      { title: "JPA Hibernate medium 3", description: "Apply optimistic locking with @Version field.", code: hibernateCode("Hr"), filename: "HrVersionedEntity.java", expectedOutput: "Concurrent updates detect stale writes." },
    ],
    hard: [
      { title: "JPA Hibernate hard 1", description: "Design aggregate boundaries with orphanRemoval semantics.", code: hibernateCode("Fulfillment"), filename: "FulfillmentAggregate.java", expectedOutput: "Removing child from aggregate deletes orphan row." },
      { title: "JPA Hibernate hard 2", description: "Tune fetch plans for high-throughput API endpoint.", code: hibernateCode("Analytics"), filename: "AnalyticsFetchPlan.java", expectedOutput: "Read API reduces SQL count and latency." },
      { title: "JPA Hibernate hard 3", description: "Write migration-safe entity evolution strategy.", code: hibernateCode("Platform"), filename: "PlatformSchemaEvolution.java", expectedOutput: "Entity changes roll out without downtime." },
    ],
  };
  return buildTieredWithRich(topicSlug, "hibernate", base);
}

function securityProblems(topicSlug) {
  const base = {
    easy: [
      { title: `${TOPIC_TITLES[topicSlug]} easy 1`, description: "Explain auth and authorization flow for protected API.", authFlow: "User login -> token issue -> bearer token on protected calls", requestFlow: "Request -> Security filter -> token validation -> role check -> controller", roles: ["USER"], permissions: ["orders:read"], code: "", headers: { Authorization: "Bearer <token>" } },
      { title: `${TOPIC_TITLES[topicSlug]} easy 2`, description: "Model role to permission mapping for backend routes.", authFlow: "Role assignment at login, permission check at endpoint", requestFlow: "JWT claims -> authorities -> @PreAuthorize evaluation", roles: ["USER", "ADMIN"], permissions: ["users:read", "users:write"], code: "", headers: { Authorization: "Bearer <token>" } },
      { title: `${TOPIC_TITLES[topicSlug]} easy 3`, description: "Protect create endpoint and return 401/403 correctly.", authFlow: "Unauthenticated -> 401, unauthorized -> 403", requestFlow: "Bearer parse -> auth context -> access decision", roles: ["EDITOR"], permissions: ["posts:create"], code: "", headers: { Authorization: "Bearer <token>" } },
    ],
    medium: [
      { title: `${TOPIC_TITLES[topicSlug]} medium 1`, description: "Add JWT filter integration in Spring Security chain.", authFlow: "OncePerRequestFilter extracts and validates JWT", requestFlow: "Request -> JwtFilter -> UsernamePasswordAuthenticationFilter", roles: ["USER"], permissions: ["profile:read"], code: "http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);", headers: { Authorization: "Bearer <jwt>" } },
      { title: `${TOPIC_TITLES[topicSlug]} medium 2`, description: "Configure OAuth2 login callback and token exchange.", authFlow: "OAuth code -> backend callback -> app JWT issuance", requestFlow: "Browser redirect -> oauth callback -> profile mapping -> JWT response", roles: ["USER"], permissions: ["profile:read"], code: "oauth2Login(o -> o.userInfoEndpoint(c -> c.userService(customUserService)));", headers: { Authorization: "Bearer <jwt>" } },
      { title: `${TOPIC_TITLES[topicSlug]} medium 3`, description: "Implement method-level RBAC for admin APIs.", authFlow: "Authorities loaded from JWT claim set", requestFlow: "@PreAuthorize guard executes before method body", roles: ["ADMIN", "SUPPORT"], permissions: ["tickets:close"], code: "@PreAuthorize(\"hasAuthority('tickets:close')\")", headers: { Authorization: "Bearer <jwt>" } },
    ],
    hard: [
      { title: `${TOPIC_TITLES[topicSlug]} hard 1`, description: "Design full auth architecture with refresh token rotation.", authFlow: "Login -> access+refresh tokens -> refresh endpoint rotates refresh token", requestFlow: "API calls with access token, refresh on 401, revoke compromised refresh token", roles: ["USER", "ADMIN"], permissions: ["*"], code: "Refresh token stored hashed in DB with jti and expiry.", headers: { Authorization: "Bearer <access>", "X-Refresh-Token": "<refresh>" } },
      { title: `${TOPIC_TITLES[topicSlug]} hard 2`, description: "Implement fine-grained RBAC plus tenant boundary checks.", authFlow: "Token contains tenant_id and roles", requestFlow: "Filter validates tenant claim before service execution", roles: ["TENANT_ADMIN", "TENANT_USER"], permissions: ["tenant:users:read", "tenant:users:write"], code: "if (!requestTenant.equals(claimTenant)) { throw new AccessDeniedException(...); }", headers: { Authorization: "Bearer <tenant-jwt>" } },
      { title: `${TOPIC_TITLES[topicSlug]} hard 3`, description: "Add security audit trail for privileged operations.", authFlow: "Authenticated user performs privileged action with signed request context", requestFlow: "Security interceptor logs actor, resource, action, decision", roles: ["ADMIN"], permissions: ["audit:read", "audit:write"], code: "auditRepository.save(new AuditEvent(actor, action, resource, decision));", headers: { Authorization: "Bearer <admin-jwt>" } },
    ],
  };
  return buildTieredWithRich(topicSlug, "security", base);
}

function ensureCount(problemsByDifficulty, slug) {
  for (const level of LEVELS) {
    if (!Array.isArray(problemsByDifficulty[level]) || problemsByDifficulty[level].length < 1) {
      throw new Error(`Expected at least 1 ${level} problem for ${slug}`);
    }
  }
}

const SCENARIO_CONTEXTS = [
  "e-commerce orders API",
  "hospital appointment system",
  "library book lending",
  "expense tracker app",
  "inventory warehouse",
  "student course portal",
  "ride-sharing backend",
  "food delivery platform",
  "ticket booking service",
  "fitness membership app",
  "real-estate listings",
  "banking transfer service",
  "weather alert service",
  "chat messaging API",
  "blog publishing platform",
];

function differentiateProblem(problem, seq, slug, level) {
  const context = SCENARIO_CONTEXTS[seq % SCENARIO_CONTEXTS.length];
  const tag = `Scenario ${seq + 1}: ${context}`;
  const copy = { ...problem };

  if (typeof copy.title === "string") {
    copy.title = `${copy.title} — ${tag}`;
  }
  if (typeof copy.description === "string") {
    copy.description = `Apply this in a ${context} backend. ${copy.description}`;
  }
  if (typeof copy.problemStatement === "string") {
    copy.problemStatement = `${TOPIC_TITLES[slug] ?? slug} (${level}) — ${tag}. ${copy.problemStatement}`;
  }
  if (typeof copy.command === "string") {
    copy.command = `${copy.command}\n# ${tag}`;
  }
  if (typeof copy.goodPrompt === "string") {
    copy.goodPrompt = `${copy.goodPrompt}\n\nDomain context: ${context}.`;
  }
  if (typeof copy.prompt === "string") {
    copy.prompt = `${copy.prompt} (context: ${context})`;
  }
  if (typeof copy.code === "string" && copy.code.trim().length > 0) {
    copy.code = `${copy.code}\n// ${tag}`;
  }
  if (typeof copy.query === "string" && copy.query.trim().length > 0) {
    copy.query = `${copy.query}\n-- ${tag}`;
  }
  return copy;
}

/** Expand base tiers to per-week quota (20 easy + 20 medium + 20 hard per week) */
function expandProblemBank(base, slug, category, mapFn, topicIndex = 0, topicCount = 1) {
  const quotas = getQuotasForTopic(slug, category, topicIndex, topicCount);
  const out = { easy: [], medium: [], hard: [] };
  let globalSeq = 0;

  for (const level of LEVELS) {
    const tier = base[level] ?? [];
    const quota = quotas[level] ?? [];
    for (const { type, count } of quota) {
      for (let i = 0; i < count; i++) {
        const pick = tier.length > 0 ? tier[globalSeq % tier.length] : {};
        const source = differentiateProblem({ ...pick }, globalSeq, slug, level);
        out[level].push(
          mapFn(source, {
            slug,
            level,
            type,
            index: i,
            seq: globalSeq,
            category,
          })
        );
        globalSeq++;
      }
    }
    if (out[level].length === 0) out[level] = tier;
  }
  return out;
}

function expandSql(base, ctx) {
  const { slug, level, type, index, seq } = ctx;
  const suffix = index > 0 ? ` (variant ${index + 1})` : "";
  const expectedResult = normalizeSqlExpectedResult(base.expectedResult);
  const payload = {
    ...base,
    id: `${slug}-${level}-${type}-${index + 1}`,
    title: `${base.title}${suffix}`,
    description: base.description ?? base.title,
    problemType: type,
    estimatedMinutes: estMinutes(level, type),
    problemStatement: base.description ?? base.title,
    exampleInput: `Query #${seq + 1} on employees schema`,
    exampleOutput: expectedResult.rows.map((r) => r.join(" | ")).join("\n"),
    stepByStepExplanation: base.executionExplanation,
    explanation: base.executionExplanation,
    dryRun: base.executionExplanation,
    visualization: "SQL Engine → Parser → Optimizer → Executor → Result Set",
    expectedResult,
    schema: base.schema ?? SQL_SCHEMA,
    sampleData: base.sampleData ?? SQL_SAMPLE_DATA,
    query: base.query ?? "SELECT 1;",
    executionExplanation: base.executionExplanation ?? "",
  };
  return {
    ...payload,
    ...enrichProblem(payload, { slug, difficulty: level, index, category: "sql" }),
  };
}

const TOPIC_HANDLERS = {
  "sql-select": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = sqlProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "sql", expandSql, topicIndex, topicCount);
    return buildSqlLessons(weekId, slug, p);
  },
  "sql-joins": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = sqlProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "sql", expandSql, topicIndex, topicCount);
    return buildSqlLessons(weekId, slug, p);
  },
  "sql-aggregations": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = sqlProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "sql", expandSql, topicIndex, topicCount);
    return buildSqlLessons(weekId, slug, p);
  },
  transactions: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = sqlProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "sql", expandSql, topicIndex, topicCount);
    return buildSqlLessons(weekId, slug, p);
  },
  normalization: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = dbDesignProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "database-design", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildDbDesignLessons(weekId, slug, p);
  },
  indexes: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = dbDesignProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "database-design", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildDbDesignLessons(weekId, slug, p);
  },
  jdbc: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const p = generateCuratedProblems(slug, TOPIC_TITLES[slug], "jdbc", topicIndex, topicCount);
    return buildJdbcLessons(weekId, slug, p);
  },
  mongodb: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = mongoProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "mongodb", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildMongoLessons(weekId, slug, p);
  },
  "spring-core": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const p = generateCuratedProblems(slug, TOPIC_TITLES[slug], "spring-boot", topicIndex, topicCount);
    return buildSpringLessons(weekId, slug, p);
  },
  "spring-boot": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const p = generateCuratedProblems(slug, TOPIC_TITLES[slug], "spring-boot", topicIndex, topicCount);
    return buildSpringLessons(weekId, slug, p);
  },
  "capstone-backend": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const p = generateCuratedProblems(slug, TOPIC_TITLES[slug], "spring-boot", topicIndex, topicCount);
    return buildSpringLessons(weekId, slug, p);
  },
  "jpa-hibernate": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const p = generateCuratedProblems(slug, TOPIC_TITLES[slug], "hibernate", topicIndex, topicCount);
    return buildHibernateLessons(weekId, slug, p);
  },
  "rest-design": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = restProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "rest-api", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildRestLessons(weekId, slug, p);
  },
  "validation-pagination": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = restProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "rest-api", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildRestLessons(weekId, slug, p);
  },
  swagger: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = restProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "rest-api", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildRestLessons(weekId, slug, p);
  },
  "spring-security": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = securityProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "security", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildSecurityLessons(weekId, slug, p);
  },
  "jwt-auth": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = securityProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "security", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildSecurityLessons(weekId, slug, p);
  },
  oauth: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = securityProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "security", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildSecurityLessons(weekId, slug, p);
  },
  rbac: (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = securityProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "security", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildSecurityLessons(weekId, slug, p);
  },
  "git-workflow": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = gitProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "git", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildGitLessons(weekId, slug, p);
  },
  "github-portfolio": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = gitProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "git", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildGitLessons(weekId, slug, p);
  },
  "mock-interview": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = aiProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "ai", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildAiLessons(weekId, slug, p);
  },
  "ai-coding": (weekId, slug, topicIndex = 0, topicCount = 1) => {
    const base = aiProblems(slug);
    ensureCount(base, slug);
    const p = expandProblemBank(base, slug, "ai", (b, ctx) => ({
      ...b,
      id: `${slug}-${ctx.level}-${ctx.type}-${ctx.index + 1}`,
      problemType: ctx.type,
      estimatedMinutes: estMinutes(ctx.level, ctx.type),
      title: `${b.title} (${ctx.type} #${ctx.index + 1})`,
    }), topicIndex, topicCount);
    return buildAiLessons(weekId, slug, p);
  },
};

export function getBackendProblems(weekId, topic) {
  const slug = typeof topic === "string" ? topic : topic?.slug;
  if (!slug) return [];
  const handler = TOPIC_HANDLERS[slug];
  if (!handler) return [];
  const topicIndex = topic?.topicIndex ?? 0;
  const topicCount = topic?.topicCount ?? 1;
  return handler(weekId, slug, topicIndex, topicCount);
}
