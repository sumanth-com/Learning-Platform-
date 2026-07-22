export type SqlDifficulty = "beginner" | "intermediate" | "advanced";

export type SqlTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: SqlDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** SQL keywords / concepts for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type SqlSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: SqlTopicDef[];
};

function t(partial: SqlTopicDef): SqlTopicDef {
  return partial;
}

export const SQL_ACADEMY_SECTIONS: SqlSectionDef[] = [
  {
    slug: "sql-introduction",
    title: "SQL Introduction",
    description: "What SQL is, how relational databases differ from spreadsheets, and core table concepts.",
    topics: [
      t({
        slug: "what-is-sql",
        title: "What is SQL?",
        summary: "SQL is the standard language for querying and managing data in relational databases.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["sql", "relational", "database", "query"],
        challengeWeight: 4,
        explanation:
          "SQL (Structured Query Language) lets you read, insert, update, and delete data stored in relational databases. You describe what data you want with declarative statements like SELECT and WHERE, and the database engine decides how to fetch it efficiently. SQL is used by PostgreSQL, MySQL, SQLite, SQL Server, and Oracle. Learning SQL is essential for backend development, data analysis, and understanding how applications persist information.",
        a11yNotes: [
          "When presenting query results in apps, use semantic HTML tables with proper headers for screen readers.",
        ],
        commonMistakes: [
          "Treating SQL as a general-purpose programming language instead of a data query language",
          "Assuming all databases implement every SQL feature identically",
          "Writing SQL without understanding the underlying table structure first",
        ],
        bestPractices: [
          "Learn the core statements SELECT, INSERT, UPDATE, and DELETE before advanced features",
          "Practice against a real database like PostgreSQL or SQLite rather than only reading syntax",
          "Think in sets of rows, not row-by-row loops like imperative code",
        ],
        interviewQuestions: [
          "What is SQL and what problems does it solve?",
          "Is SQL procedural or declarative?",
          "Name three popular relational database systems that use SQL.",
        ],
        cheatSheet: [
          { tag: "SQL", desc: "Structured Query Language for relational data" },
          { tag: "SELECT", desc: "Retrieve rows from one or more tables" },
          { tag: "RDBMS", desc: "Relational Database Management System" },
        ],
      }),
      t({
        slug: "databases-vs-spreadsheets",
        title: "Databases vs Spreadsheets",
        summary: "Relational databases enforce structure, scale, and concurrent access better than spreadsheets.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["spreadsheet", "database", "scale", "structure"],
        challengeWeight: 3,
        explanation:
          "Spreadsheets like Excel are great for small datasets and manual analysis, but they lack strict schemas, concurrent write safety, and efficient querying at scale. Relational databases store data in typed tables with constraints, support millions of rows, and allow many users and applications to read and write safely at the same time. Applications connect to databases through drivers and ORMs; spreadsheets are edited directly by people. When data grows or multiple services need shared access, a database is the right tool.",
        a11yNotes: [],
        commonMistakes: [
          "Using a spreadsheet as the production data store for a multi-user web application",
          "Assuming databases are only for huge companies and never needed in small projects",
          "Ignoring data types and validation because spreadsheets accept anything in a cell",
        ],
        bestPractices: [
          "Use spreadsheets for exploration and one-off reports, databases for application data",
          "Define schemas and constraints in the database rather than relying on app logic alone",
          "Choose SQLite or PostgreSQL early in learning projects instead of CSV files",
        ],
        interviewQuestions: [
          "When would you choose a database over a spreadsheet?",
          "What concurrency problems do spreadsheets have that databases solve?",
          "How do applications typically access database data?",
        ],
        cheatSheet: [
          { tag: "schema", desc: "Defined structure of tables, columns, and types" },
          { tag: "concurrency", desc: "Many users or processes accessing data safely" },
          { tag: "CSV", desc: "Flat file format; not a substitute for a real database" },
        ],
      }),
      t({
        slug: "tables-rows-columns",
        title: "Tables, Rows, and Columns",
        summary: "Relational data is organized into tables where each row is a record and each column is a field.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["table", "row", "column", "record"],
        challengeWeight: 4,
        explanation:
          "A table is a collection of related data, like users or orders. Each row (also called a record or tuple) represents one entity, such as a single user. Each column (field) holds one attribute, such as email or created_at. Tables have a fixed schema: column names and data types are defined upfront. You reference columns in queries by name. Multiple tables relate to each other through keys, which is the foundation of the relational model.",
        a11yNotes: [
          "In UI tables built from query results, associate header cells with data cells using scope or headers attributes.",
        ],
        commonMistakes: [
          "Storing multiple values in one column separated by commas instead of normalizing",
          "Using vague column names like data or value that do not describe the content",
          "Confusing rows and columns when writing INSERT statements",
        ],
        bestPractices: [
          "Name tables and columns in singular or plural consistently across your schema",
          "Use snake_case for column names in SQL-oriented databases",
          "Draw an entity-relationship diagram before creating many tables",
        ],
        interviewQuestions: [
          "What is the difference between a row and a column in a relational table?",
          "What is a schema in the context of a database table?",
          "Why do relational databases prefer structured columns over free-form documents?",
        ],
        cheatSheet: [
          { tag: "table", desc: "Collection of rows sharing the same column structure" },
          { tag: "row", desc: "One record in a table" },
          { tag: "column", desc: "Named field with a specific data type" },
        ],
      }),
      t({
        slug: "primary-keys",
        title: "Primary Keys",
        summary: "A primary key uniquely identifies each row in a table and enforces entity integrity.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["primary key", "unique", "identifier", "constraint"],
        challengeWeight: 4,
        explanation:
          "Every well-designed table should have a primary key: one or more columns whose values uniquely identify each row. Common choices are auto-incrementing integers (id) or UUIDs. Primary keys cannot be NULL and must be unique. They are the target of foreign keys in other tables. Without a primary key, you cannot reliably update or delete a specific row, and joins become ambiguous. Composite primary keys use multiple columns together, such as (order_id, line_item_number).",
        a11yNotes: [],
        commonMistakes: [
          "Using a non-unique column like email as primary key when it might change",
          "Omitting a primary key entirely on application tables",
          "Reusing the same primary key values across unrelated tables",
        ],
        bestPractices: [
          "Add an id column as primary key unless a natural composite key is clearly better",
          "Never change primary key values after they are referenced by foreign keys",
          "Use UUID primary keys when merging data from distributed systems",
        ],
        interviewQuestions: [
          "What is a primary key and why does every table need one?",
          "What is a composite primary key?",
          "Can a primary key column contain NULL values?",
        ],
        cheatSheet: [
          { tag: "PRIMARY KEY", desc: "Constraint enforcing unique, non-null row identity" },
          { tag: "id", desc: "Common surrogate primary key column name" },
          { tag: "UUID", desc: "Universally unique identifier used as a primary key" },
        ],
      }),
    ],
  },
  {
    slug: "query-basics",
    title: "Query Basics",
    description: "Read data with SELECT, filter with WHERE, sort with ORDER BY, and remove duplicates with DISTINCT.",
    topics: [
      t({
        slug: "select-from",
        title: "SELECT and FROM",
        summary: "SELECT chooses columns and FROM specifies which table to read.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["select", "from", "columns", "query"],
        challengeWeight: 4,
        explanation:
          "The most common SQL statement is SELECT column1, column2 FROM table_name. SELECT * returns all columns but is discouraged in production because it fetches unnecessary data. You can alias columns with AS for readable output: SELECT first_name AS name. FROM names the source table. Every read query needs at least SELECT and FROM. The database returns a result set: a virtual table of rows matching your request.",
        a11yNotes: [
          "When displaying SELECT results in a web app, expose column headers as accessible table captions or th elements.",
        ],
        commonMistakes: [
          "Using SELECT * in application code when only two columns are needed",
          "Forgetting the FROM clause and getting a syntax error",
          "Mixing up column order between SELECT list and application parsing logic",
        ],
        bestPractices: [
          "List only the columns you need explicitly in SELECT",
          "Use meaningful aliases for computed or joined columns",
          "Limit result sets during development to avoid accidentally scanning huge tables",
        ],
        interviewQuestions: [
          "What do SELECT and FROM do in a SQL query?",
          "Why do teams discourage SELECT * in production code?",
          "What is a result set?",
        ],
        cheatSheet: [
          { tag: "SELECT", desc: "List columns or expressions to return" },
          { tag: "FROM", desc: "Table or subquery source" },
          { tag: "AS", desc: "Column or table alias keyword" },
        ],
      }),
      t({
        slug: "where-filters",
        title: "WHERE Filters",
        summary: "WHERE restricts rows to those matching a condition before they appear in the result.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["where", "filter", "condition", "predicate"],
        challengeWeight: 5,
        explanation:
          "Add WHERE after FROM to filter rows: SELECT name, email FROM users WHERE status = 'active'. Only rows where the condition evaluates to true are returned. You can combine conditions with AND, OR, and NOT. WHERE is evaluated before SELECT projections, so you cannot reference SELECT aliases in WHERE on the same query level. Filtering early reduces data transfer and lets the database use indexes. Always parameterize user-supplied values to prevent SQL injection.",
        a11yNotes: [],
        commonMistakes: [
          "Concatenating user input directly into WHERE strings instead of using parameters",
          "Filtering in application code after fetching all rows from the database",
          "Using WHERE with aggregate functions instead of HAVING",
        ],
        bestPractices: [
          "Use parameterized queries or prepared statements for all dynamic filters",
          "Put the most selective conditions first when writing complex WHERE clauses",
          "Index columns that appear frequently in WHERE predicates",
        ],
        interviewQuestions: [
          "What does the WHERE clause do?",
          "Why should you avoid building WHERE clauses with string concatenation?",
          "Can you use a SELECT alias in the WHERE clause of the same query?",
        ],
        cheatSheet: [
          { tag: "WHERE", desc: "Row filter applied before grouping and projection" },
          { tag: "AND", desc: "Both conditions must be true" },
          { tag: "OR", desc: "Either condition may be true" },
        ],
      }),
      t({
        slug: "order-by-limit",
        title: "ORDER BY and LIMIT",
        summary: "ORDER BY sorts results and LIMIT caps how many rows are returned.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["order by", "limit", "sort", "pagination"],
        challengeWeight: 4,
        explanation:
          "ORDER BY column ASC or DESC sorts the result set. ASC is default ascending; DESC is descending. You can sort by multiple columns: ORDER BY last_name, first_name. LIMIT n returns at most n rows, often combined with OFFSET for pagination: LIMIT 10 OFFSET 20 skips 20 rows then returns 10. Without ORDER BY, row order is undefined and may change between queries. Always specify ORDER BY when order matters, such as showing the newest items first.",
        a11yNotes: [
          "If sorted data is shown in a UI list, communicate sort order in accessible labels when it affects meaning.",
        ],
        commonMistakes: [
          "Assuming rows come back in insertion order without ORDER BY",
          "Using LIMIT without ORDER BY and getting unpredictable pages",
          "Fetching all rows and sorting in application memory instead of in SQL",
        ],
        bestPractices: [
          "Always pair LIMIT with ORDER BY for paginated APIs",
          "Index columns used in ORDER BY for large tables",
          "Use keyset pagination instead of large OFFSET values on huge datasets",
        ],
        interviewQuestions: [
          "What is the difference between ORDER BY ASC and DESC?",
          "How do LIMIT and OFFSET work together for pagination?",
          "Is row order guaranteed without ORDER BY?",
        ],
        cheatSheet: [
          { tag: "ORDER BY", desc: "Sort result rows by one or more columns" },
          { tag: "LIMIT", desc: "Maximum number of rows to return" },
          { tag: "OFFSET", desc: "Number of rows to skip before returning results" },
        ],
      }),
      t({
        slug: "distinct",
        title: "DISTINCT",
        summary: "DISTINCT removes duplicate rows from the result set based on selected columns.",
        estimatedMinutes: 10,
        difficulty: "beginner",
        keywords: ["distinct", "duplicate", "unique", "values"],
        challengeWeight: 3,
        explanation:
          "SELECT DISTINCT column FROM table returns each unique value once. DISTINCT applies to the entire selected row: SELECT DISTINCT city, country returns unique city-country pairs. It can be slower than regular SELECT because the database must deduplicate. Sometimes GROUP BY achieves the same goal with more control. Use DISTINCT when you need a simple unique list, such as all countries where customers live.",
        a11yNotes: [],
        commonMistakes: [
          "Using DISTINCT to fix duplicate rows caused by incorrect JOINs instead of fixing the join",
          "Expecting DISTINCT to deduplicate only one column when multiple are selected",
          "Overusing DISTINCT on large tables when a GROUP BY or subquery is clearer",
        ],
        bestPractices: [
          "Investigate why duplicates appear before slapping DISTINCT on a query",
          "Prefer GROUP BY when you also need aggregates on the unique groups",
          "Use DISTINCT ON (PostgreSQL) or equivalent when you need one row per group",
        ],
        interviewQuestions: [
          "What does SELECT DISTINCT do?",
          "How is DISTINCT different from GROUP BY?",
          "Why might DISTINCT make a query slower?",
        ],
        cheatSheet: [
          { tag: "DISTINCT", desc: "Return unique combinations of selected columns" },
          { tag: "GROUP BY", desc: "Alternative for unique groups with aggregates" },
          { tag: "duplicate rows", desc: "Often caused by JOINs, not bad data" },
        ],
      }),
    ],
  },
  {
    slug: "filtering",
    title: "Filtering",
    description: "Comparison operators, logical combinations, NULL handling, and pattern or range filters.",
    topics: [
      t({
        slug: "comparison-operators",
        title: "Comparison Operators",
        summary: "Use =, <>, <, >, <=, and >= to compare column values in WHERE clauses.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["comparison", "operators", "equals", "greater than"],
        challengeWeight: 4,
        explanation:
          "SQL comparison operators test relations between values. = checks equality. <> or != checks inequality. <, >, <=, >= compare ordering for numbers, dates, and strings according to database collation rules. Comparisons return true, false, or unknown (when NULL is involved). You can compare columns to literals, parameters, or other columns: WHERE shipped_at > ordered_at. Use parentheses to make complex logic readable.",
        a11yNotes: [],
        commonMistakes: [
          "Using = to compare floating-point numbers that should use a tolerance range",
          "Confusing <> with NOT IN semantics when NULLs are present",
          "Comparing strings with wrong collation and getting unexpected sort or match results",
        ],
        bestPractices: [
          "Use parameterized placeholders instead of embedding literals in application queries",
          "Compare dates as date or timestamp types, not as strings",
          "Document timezone assumptions when comparing timestamp columns",
        ],
        interviewQuestions: [
          "List the basic SQL comparison operators.",
          "What is the difference between <> and !=?",
          "What happens when you compare a value to NULL with =?",
        ],
        cheatSheet: [
          { tag: "=", desc: "Equality comparison" },
          { tag: "<>", desc: "Not equal comparison" },
          { tag: ">=", desc: "Greater than or equal comparison" },
        ],
      }),
      t({
        slug: "and-or-not",
        title: "AND, OR, and NOT",
        summary: "Combine boolean conditions with AND, OR, and NOT to build precise filters.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["and", "or", "not", "logic"],
        challengeWeight: 4,
        explanation:
          "AND requires all conditions to be true. OR requires at least one to be true. NOT inverts a condition. Operator precedence matters: AND binds tighter than OR, so use parentheses for clarity: WHERE (status = 'active' OR status = 'trial') AND country = 'US'. De Morgan's laws apply: NOT (a AND b) is equivalent to (NOT a) OR (NOT b). Complex filters are easier to read when each parenthesized group represents one business rule.",
        a11yNotes: [],
        commonMistakes: [
          "Writing WHERE a OR b AND c without parentheses and getting unintended results",
          "Using OR when AND was intended, returning far too many rows",
          "Negating conditions incorrectly and excluding valid rows",
        ],
        bestPractices: [
          "Always parenthesize mixed AND/OR expressions explicitly",
          "Extract repeated filter logic into views or named query fragments",
          "Test edge cases where only one side of an OR should match",
        ],
        interviewQuestions: [
          "What is the precedence of AND versus OR in SQL?",
          "How do parentheses change filter logic?",
          "Write a WHERE clause for active US or Canadian users.",
        ],
        cheatSheet: [
          { tag: "AND", desc: "All grouped conditions must be true" },
          { tag: "OR", desc: "At least one condition must be true" },
          { tag: "NOT", desc: "Inverts a boolean condition" },
        ],
      }),
      t({
        slug: "null-handling",
        title: "NULL Handling",
        summary: "NULL means unknown or missing; use IS NULL and IS NOT NULL instead of = NULL.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["null", "is null", "coalesce", "unknown"],
        challengeWeight: 5,
        explanation:
          "NULL is not zero or an empty string; it represents the absence of a value. Any comparison with NULL using = or <> yields unknown, not true or false. Use IS NULL and IS NOT NULL to test for missing values. COALESCE(a, b) returns the first non-null argument. NULLIF(a, b) returns null when a equals b. Aggregate functions like COUNT(*) count rows; COUNT(column) ignores nulls in that column. Three-valued logic (true, false, unknown) affects WHERE filtering.",
        a11yNotes: [],
        commonMistakes: [
          "Writing WHERE column = NULL which never matches any row",
          "Assuming NULL equals NULL in SQL comparisons",
          "Forgetting that NULL in NOT IN subqueries can eliminate all results",
        ],
        bestPractices: [
          "Use IS NULL and IS NOT NULL exclusively for null checks",
          "Default nullable columns thoughtfully; prefer NOT NULL when a value is always required",
          "Use COALESCE for display defaults but not to hide missing data quality problems",
        ],
        interviewQuestions: [
          "Why does WHERE x = NULL return no rows?",
          "What does COALESCE do?",
          "How does COUNT(column) treat NULL values?",
        ],
        cheatSheet: [
          { tag: "IS NULL", desc: "Test whether a value is missing" },
          { tag: "COALESCE", desc: "Return first non-null argument" },
          { tag: "NULLIF", desc: "Return null when two values are equal" },
        ],
      }),
      t({
        slug: "between-in-like",
        title: "BETWEEN, IN, and LIKE",
        summary: "Filter ranges with BETWEEN, match lists with IN, and search patterns with LIKE.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["between", "in", "like", "pattern"],
        challengeWeight: 4,
        explanation:
          "BETWEEN low AND high selects values in an inclusive range, often used for dates and numbers. IN (val1, val2, val3) matches any value in the list and is shorthand for multiple OR equals checks. LIKE matches text patterns: % is any sequence of characters, _ is any single character. ILIKE (PostgreSQL) is case-insensitive. BETWEEN and IN are inclusive. For large IN lists, consider a temporary table or join instead of thousands of literals.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming BETWEEN excludes boundary values when it is inclusive on both ends",
          "Using LIKE without escaping user input that contains % or _",
          "Passing huge IN lists that hurt query planning and performance",
        ],
        bestPractices: [
          "Use half-open ranges (>= start AND < end) when boundary clarity matters for timestamps",
          "Prefer JOIN to a lookup table over very long IN clauses",
          "Index columns used with LIKE only for prefix patterns like 'foo%'",
        ],
        interviewQuestions: [
          "Is BETWEEN inclusive or exclusive of its endpoints?",
          "What wildcards does LIKE support?",
          "When might IN perform poorly?",
        ],
        cheatSheet: [
          { tag: "BETWEEN", desc: "Inclusive range filter on a column" },
          { tag: "IN", desc: "Match any value in a parenthesized list" },
          { tag: "LIKE", desc: "Pattern match with % and _ wildcards" },
        ],
      }),
    ],
  },
  {
    slug: "joins",
    title: "Joins",
    description: "Combine rows from multiple tables with INNER JOIN, LEFT JOIN, and multi-table patterns.",
    topics: [
      t({
        slug: "inner-join",
        title: "INNER JOIN",
        summary: "INNER JOIN returns rows where matching keys exist in both tables.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["inner join", "join", "foreign key", "relationship"],
        challengeWeight: 5,
        explanation:
          "JOINs combine columns from two or more tables based on a related column, usually a foreign key to a primary key. INNER JOIN keeps only rows with matches on both sides: SELECT o.id, c.name FROM orders o INNER JOIN customers c ON o.customer_id = c.id. Table aliases (o, c) shorten references. Without a matching row on either side, the row is excluded. INNER JOIN is the default when you only want related data, such as orders that have a valid customer.",
        a11yNotes: [],
        commonMistakes: [
          "Joining on the wrong columns and getting a Cartesian product or empty results",
          "Omitting the ON clause and producing a cross join by accident",
          "Using implicit comma joins without WHERE, creating accidental cross joins",
        ],
        bestPractices: [
          "Always specify JOIN type and ON condition explicitly",
          "Foreign keys should be indexed on the referencing column",
          "Verify join cardinality: one-to-many joins multiply rows on the many side",
        ],
        interviewQuestions: [
          "What rows does an INNER JOIN return?",
          "What is the purpose of the ON clause?",
          "How do table aliases help in multi-table queries?",
        ],
        cheatSheet: [
          { tag: "INNER JOIN", desc: "Return rows with matches in both tables" },
          { tag: "ON", desc: "Join condition linking related columns" },
          { tag: "FOREIGN KEY", desc: "Column referencing another table primary key" },
        ],
      }),
      t({
        slug: "left-join",
        title: "LEFT JOIN",
        summary: "LEFT JOIN keeps all rows from the left table and fills NULL when there is no right match.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["left join", "outer join", "null", "optional"],
        challengeWeight: 5,
        explanation:
          "LEFT JOIN (LEFT OUTER JOIN) returns every row from the left table. When no matching row exists on the right, right-side columns are NULL. Use it for optional relationships: list all customers and their latest order even if they never ordered. Filter on right-table columns in ON when you want to preserve left rows; putting filters in WHERE turns the LEFT JOIN into an INNER JOIN effectively. RIGHT JOIN and FULL OUTER JOIN exist but LEFT JOIN covers most cases.",
        a11yNotes: [],
        commonMistakes: [
          "Putting right-table predicates in WHERE and unintentionally filtering out unmatched left rows",
          "Using LEFT JOIN when INNER JOIN is correct and returning sparse NULL columns",
          "Confusing LEFT JOIN direction and putting the preserved table on the wrong side",
        ],
        bestPractices: [
          "Place the table you must keep all rows from on the left side of a LEFT JOIN",
          "Move optional match filters into the ON clause to preserve null-extended rows",
          "Use COUNT(right.id) instead of COUNT(*) to count only matched rows",
        ],
        interviewQuestions: [
          "What is the difference between INNER JOIN and LEFT JOIN?",
          "When do LEFT JOIN result columns contain NULL?",
          "Why can a WHERE filter on a right table break LEFT JOIN semantics?",
        ],
        cheatSheet: [
          { tag: "LEFT JOIN", desc: "Keep all left rows; null-fill unmatched right columns" },
          { tag: "OUTER JOIN", desc: "Join variant that preserves non-matching rows" },
          { tag: "NULL columns", desc: "Indicate no matching row on the optional side" },
        ],
      }),
      t({
        slug: "multiple-joins",
        title: "Multiple Joins",
        summary: "Chain several JOINs to traverse relationships across three or more tables.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["multiple joins", "chain", "relationship", "schema"],
        challengeWeight: 5,
        explanation:
          "Real queries often join many tables: orders JOIN customers ON ... JOIN products ON ... JOIN categories ON .... Each JOIN adds columns and must use the correct prior alias. Order matters for readability but not for INNER JOINs with proper ON clauses. Draw the relationship path from fact table to dimensions. When the same table appears twice, use distinct aliases: employees e1 and e2 for manager and report relationships (self-join).",
        a11yNotes: [],
        commonMistakes: [
          "Losing track of which alias owns a column in long SELECT lists",
          "Joining through the wrong intermediate table and duplicating rows",
          "Missing a join condition on one link and exploding row counts",
        ],
        bestPractices: [
          "Start from the central fact table and join outward to lookup tables",
          "Format one JOIN per line with aligned ON conditions",
          "Use consistent alias names across your team's queries",
        ],
        interviewQuestions: [
          "How do you join three or more tables in one query?",
          "What is a self-join and when is it used?",
          "How can a missing join condition affect result row count?",
        ],
        cheatSheet: [
          { tag: "JOIN chain", desc: "Sequence of joins linking related tables" },
          { tag: "alias", desc: "Short table name used in multi-join queries" },
          { tag: "self-join", desc: "Join a table to itself with different aliases" },
        ],
      }),
      t({
        slug: "join-pitfalls",
        title: "Join Pitfalls",
        summary: "Avoid duplicate rows, fan-out, and incorrect filters when joining tables.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["pitfalls", "duplicate", "fan-out", "cartesian"],
        challengeWeight: 4,
        explanation:
          "Join pitfalls cause wrong analytics and slow queries. Fan-out happens when joining one row to many related rows without aggregation, inflating counts and sums. A Cartesian product occurs when JOIN lacks a proper ON condition, multiplying every left row by every right row. Duplicate dimension rows from non-unique join keys double-count metrics. Fix fan-out by aggregating before join, using DISTINCT ON, or subqueries. Always sanity-check row counts before and after joins.",
        a11yNotes: [],
        commonMistakes: [
          "Summing revenue after a join that duplicates order rows",
          "Assuming DISTINCT fixes a broken join key",
          "Joining on non-unique columns like customer name instead of customer id",
        ],
        bestPractices: [
          "Aggregate at the correct grain before joining to a coarser table",
          "Validate join keys are unique on at least one side for one-to-many joins",
          "Compare COUNT(*) to COUNT(DISTINCT primary_key) after joins in debugging",
        ],
        interviewQuestions: [
          "What is join fan-out and how does it break aggregates?",
          "What causes a Cartesian product?",
          "How do you detect duplicate inflation after a join?",
        ],
        cheatSheet: [
          { tag: "fan-out", desc: "Row multiplication from one-to-many joins" },
          { tag: "CROSS JOIN", desc: "Cartesian product of two tables" },
          { tag: "join key", desc: "Column pair that must match for correct joins" },
        ],
      }),
    ],
  },
  {
    slug: "aggregates",
    title: "Aggregates",
    description: "Summarize data with COUNT, SUM, AVG, GROUP BY, and HAVING.",
    topics: [
      t({
        slug: "count-sum-avg",
        title: "COUNT, SUM, and AVG",
        summary: "Aggregate functions compute summary values across sets of rows.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["count", "sum", "avg", "aggregate"],
        challengeWeight: 4,
        explanation:
          "Aggregate functions collapse many rows into one value. COUNT(*) counts rows. COUNT(column) counts non-null values in that column. SUM(column) totals numeric values. AVG(column) computes the mean. MIN and MAX find extremes. Aggregates apply to the whole table unless combined with GROUP BY. SELECT columns must either be aggregated or listed in GROUP BY. Use ROUND or CAST for readable averages and currency totals.",
        a11yNotes: [
          "When showing aggregate summaries in dashboards, provide text alternatives for chart-only metrics.",
        ],
        commonMistakes: [
          "Mixing non-aggregated columns with aggregates without GROUP BY",
          "Using COUNT(column) when COUNT(*) was intended for total rows",
          "Summing columns that were duplicated by an earlier bad join",
        ],
        bestPractices: [
          "Use COUNT(*) for row counts and COUNT(column) when nulls should be excluded",
          "Cast or round AVG results for display consistency",
          "Validate aggregates against known small samples during development",
        ],
        interviewQuestions: [
          "What is the difference between COUNT(*) and COUNT(column)?",
          "What does AVG return when all values are NULL?",
          "Can you SELECT name and SUM(amount) without GROUP BY?",
        ],
        cheatSheet: [
          { tag: "COUNT", desc: "Count rows or non-null values" },
          { tag: "SUM", desc: "Total of numeric column values" },
          { tag: "AVG", desc: "Average of numeric column values" },
        ],
      }),
      t({
        slug: "group-by",
        title: "GROUP BY",
        summary: "GROUP BY splits rows into groups and applies aggregates per group.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["group by", "aggregate", "partition", "summary"],
        challengeWeight: 5,
        explanation:
          "GROUP BY column lists one row per unique combination of those columns with aggregates computed inside each group. Example: SELECT country, COUNT(*) FROM customers GROUP BY country returns customer count per country. Every non-aggregated SELECT column must appear in GROUP BY. GROUP BY runs after WHERE and before HAVING and ORDER BY. You can group by multiple columns for finer breakdowns. GROUP BY is the SQL equivalent of pivoting raw rows into summary buckets.",
        a11yNotes: [],
        commonMistakes: [
          "Selecting columns not in GROUP BY and not wrapped in aggregates",
          "Grouping by too many columns and getting unhelpful one-row groups",
          "Expecting GROUP BY to sort results; use ORDER BY explicitly",
        ],
        bestPractices: [
          "Group at the business grain you need: daily, per user, per category",
          "Use ORDER BY on aggregate aliases for top-N reports",
          "Consider GROUPING SETS or ROLLUP only after mastering basic GROUP BY",
        ],
        interviewQuestions: [
          "What does GROUP BY do?",
          "Which columns can appear in SELECT with GROUP BY?",
          "What is the execution order of WHERE, GROUP BY, and HAVING?",
        ],
        cheatSheet: [
          { tag: "GROUP BY", desc: "Define groups for aggregate calculations" },
          { tag: "aggregate", desc: "Function computed per group" },
          { tag: "ORDER BY", desc: "Sort grouped results after aggregation" },
        ],
      }),
      t({
        slug: "having",
        title: "HAVING",
        summary: "HAVING filters groups after aggregation, unlike WHERE which filters rows before.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["having", "filter", "aggregate", "group"],
        challengeWeight: 5,
        explanation:
          "HAVING restricts which groups appear in the result based on aggregate values: SELECT customer_id, SUM(total) AS spent FROM orders GROUP BY customer_id HAVING SUM(total) > 1000. WHERE cannot filter on aggregates because it runs before grouping. HAVING can reference grouped columns and aggregate expressions. For filtering non-aggregated columns, prefer WHERE for efficiency since it reduces rows before aggregation. Some databases allow HAVING on aliases; others require repeating the aggregate expression.",
        a11yNotes: [],
        commonMistakes: [
          "Using WHERE to filter on SUM or COUNT results",
          "Putting non-aggregated filters in HAVING instead of WHERE",
          "Forgetting that HAVING runs after GROUP BY and affects group visibility only",
        ],
        bestPractices: [
          "Filter raw rows with WHERE; filter group summaries with HAVING",
          "Repeat aggregate expressions in HAVING for maximum portability across databases",
          "Combine HAVING with ORDER BY LIMIT for top-spender style reports",
        ],
        interviewQuestions: [
          "What is the difference between WHERE and HAVING?",
          "Can HAVING reference columns not in GROUP BY?",
          "Write a query for countries with more than 100 customers.",
        ],
        cheatSheet: [
          { tag: "HAVING", desc: "Filter groups by aggregate conditions" },
          { tag: "WHERE", desc: "Filter rows before grouping" },
          { tag: "GROUP BY", desc: "Required before HAVING on grouped queries" },
        ],
      }),
      t({
        slug: "aggregate-pitfalls",
        title: "Aggregate Pitfalls",
        summary: "Duplicate rows, NULLs, and wrong grouping grain cause incorrect summary numbers.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["pitfalls", "duplicate", "grain", "null"],
        challengeWeight: 4,
        explanation:
          "Wrong aggregates silently produce bad business decisions. Join fan-out before SUM double-counts revenue. AVG of averages is not the global average unless groups are equal size. COUNT DISTINCT is needed when joins duplicate keys. NULL values are ignored by SUM and AVG but still count as rows in COUNT(*). Filtering with WHERE after a join differs from filtering before aggregation in subqueries. Always define the grain: per order, per line item, or per customer.",
        a11yNotes: [],
        commonMistakes: [
          "Averaging pre-averaged values from subreports",
          "Using SUM on a column that was duplicated by joins",
          "Confusing COUNT(*) with COUNT(DISTINCT id) after joins",
        ],
        bestPractices: [
          "Aggregate at the lowest correct grain in a subquery, then join outward",
          "Use COUNT(DISTINCT id) when join duplication is possible",
          "Document metric definitions so team members use consistent SQL",
        ],
        interviewQuestions: [
          "Why can a JOIN break SUM calculations?",
          "When do you need COUNT(DISTINCT column)?",
          "Why is averaging averages often wrong?",
        ],
        cheatSheet: [
          { tag: "COUNT(DISTINCT)", desc: "Count unique values despite duplicates" },
          { tag: "grain", desc: "Level at which one summary row represents one entity" },
          { tag: "subquery", desc: "Pre-aggregate before joining to avoid fan-out" },
        ],
      }),
    ],
  },
  {
    slug: "writing-data",
    title: "Writing Data",
    description: "Insert, update, and delete rows, and introduce transactions for safe multi-step changes.",
    topics: [
      t({
        slug: "insert",
        title: "INSERT",
        summary: "INSERT adds new rows to a table with explicit column values.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["insert", "create", "row", "values"],
        challengeWeight: 4,
        explanation:
          "INSERT INTO table (col1, col2) VALUES (val1, val2) adds one row. Multiple rows can be inserted in one statement with multiple value tuples. INSERT ... SELECT copies rows from a query into another table. Omitting columns uses defaults or NULL where allowed. RETURNING (PostgreSQL) returns inserted rows, useful for getting auto-generated ids. Always list columns explicitly rather than relying on column order. Validate data before insert in application code and enforce rules with database constraints.",
        a11yNotes: [],
        commonMistakes: [
          "Inserting without specifying columns when table schema changes later",
          "Forgetting NOT NULL columns and getting constraint errors",
          "Inserting duplicate primary keys without an upsert strategy",
        ],
        bestPractices: [
          "List target columns explicitly in every INSERT statement",
          "Use transactions when inserting related rows across multiple tables",
          "Use RETURNING or last_insert_rowid patterns to fetch generated keys",
        ],
        interviewQuestions: [
          "How do you insert multiple rows in one SQL statement?",
          "What does INSERT ... SELECT do?",
          "Why should you name columns explicitly in INSERT?",
        ],
        cheatSheet: [
          { tag: "INSERT INTO", desc: "Add new rows to a table" },
          { tag: "VALUES", desc: "Literal values for one or more new rows" },
          { tag: "RETURNING", desc: "Return inserted rows after INSERT (PostgreSQL)" },
        ],
      }),
      t({
        slug: "update",
        title: "UPDATE",
        summary: "UPDATE modifies existing rows that match a WHERE condition.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["update", "modify", "set", "where"],
        challengeWeight: 5,
        explanation:
          "UPDATE table SET column = value WHERE condition changes matching rows. Without WHERE, every row is updated, which is almost always a mistake. You can set multiple columns in one statement. UPDATE can reference other columns on the same row: SET total = quantity * price. Use RETURNING to see changed rows. Always test WHERE clauses with SELECT first. Row-level locks may apply during UPDATE in concurrent systems. Consider updated_at timestamps for audit trails.",
        a11yNotes: [],
        commonMistakes: [
          "Running UPDATE without WHERE and modifying the entire table",
          "Updating rows unintentionally because the WHERE clause was too broad",
          "Race conditions when read-modify-write happens outside a transaction",
        ],
        bestPractices: [
          "Run SELECT with the same WHERE before every UPDATE in production",
          "Use transactions for multi-step updates that must succeed or fail together",
          "Add updated_at columns maintained by application or trigger logic",
        ],
        interviewQuestions: [
          "What happens if you omit WHERE in an UPDATE statement?",
          "How can you preview rows affected by an UPDATE?",
          "Why use transactions with UPDATE operations?",
        ],
        cheatSheet: [
          { tag: "UPDATE", desc: "Modify existing rows in a table" },
          { tag: "SET", desc: "Assign new column values" },
          { tag: "WHERE", desc: "Restrict which rows are updated" },
        ],
      }),
      t({
        slug: "delete",
        title: "DELETE",
        summary: "DELETE removes rows that match a WHERE condition from a table.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["delete", "remove", "where", "truncate"],
        challengeWeight: 4,
        explanation:
          "DELETE FROM table WHERE condition removes matching rows permanently. Without WHERE, all rows are deleted while the table structure remains. TRUNCATE removes all rows faster by deallocating data pages but has different lock and rollback behavior depending on the database. DELETE respects foreign keys; you may need to delete child rows first or use ON DELETE CASCADE. Soft deletes set a deleted_at flag instead of physical DELETE, preserving history. Always backup or transaction-wrap destructive operations.",
        a11yNotes: [],
        commonMistakes: [
          "Deleting without WHERE and wiping an entire table",
          "Violating foreign key constraints by deleting parent rows first",
          "Assuming DELETE is always reversible without a transaction or backup",
        ],
        bestPractices: [
          "Prefer soft deletes for user-facing data when audit history matters",
          "Delete child rows before parents unless CASCADE is intentional and documented",
          "Use transactions and verify row counts before committing deletes",
        ],
        interviewQuestions: [
          "What is the difference between DELETE and TRUNCATE?",
          "How do foreign keys affect DELETE operations?",
          "What is a soft delete pattern?",
        ],
        cheatSheet: [
          { tag: "DELETE FROM", desc: "Remove rows matching a condition" },
          { tag: "TRUNCATE", desc: "Remove all rows quickly; table shell remains" },
          { tag: "CASCADE", desc: "Automatically delete dependent foreign key rows" },
        ],
      }),
      t({
        slug: "transactions-intro",
        title: "Transactions Intro",
        summary: "Transactions group SQL statements into atomic units that commit or roll back together.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["transaction", "commit", "rollback", "acid"],
        challengeWeight: 5,
        explanation:
          "A transaction is a sequence of operations treated as one unit. BEGIN or START TRANSACTION starts one; COMMIT makes changes permanent; ROLLBACK undoes them. ACID properties: Atomicity (all or nothing), Consistency (constraints hold), Isolation (concurrent sessions do not corrupt each other), Durability (committed data survives crashes). Transferring money between accounts requires debiting one row and crediting another in a single transaction. Application ORMs expose transaction APIs; in raw SQL, always handle errors with ROLLBACK.",
        a11yNotes: [],
        commonMistakes: [
          "Performing related writes without a transaction and leaving partial updates",
          "Holding transactions open too long and blocking other sessions",
          "Assuming autocommit behavior is the same across every database driver",
        ],
        bestPractices: [
          "Wrap multi-table writes that must stay consistent in explicit transactions",
          "Keep transactions short to reduce lock contention",
          "Use appropriate isolation levels when reads must see consistent snapshots",
        ],
        interviewQuestions: [
          "What does ACID stand for?",
          "When should you use a transaction?",
          "What is the difference between COMMIT and ROLLBACK?",
        ],
        cheatSheet: [
          { tag: "BEGIN", desc: "Start a transaction block" },
          { tag: "COMMIT", desc: "Persist all changes in the transaction" },
          { tag: "ROLLBACK", desc: "Undo all changes in the transaction" },
        ],
      }),
    ],
  },
  {
    slug: "schema",
    title: "Schema",
    description: "Define tables, choose data types, enforce constraints, and add indexes for performance.",
    topics: [
      t({
        slug: "create-table",
        title: "CREATE TABLE",
        summary: "CREATE TABLE defines a new table with column names, types, and constraints.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["create table", "schema", "ddl", "definition"],
        challengeWeight: 4,
        explanation:
          "CREATE TABLE users ( id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW() ) defines structure before any data exists. DDL (Data Definition Language) statements like CREATE, ALTER, and DROP change schema. Column definitions include name, type, nullability, defaults, and constraints. IF NOT EXISTS prevents errors on repeated migrations. Schema changes should be versioned with migration tools like Flyway, Liquibase, or framework migrations rather than edited manually in production.",
        a11yNotes: [],
        commonMistakes: [
          "Creating tables without primary keys or created_at audit columns",
          "Changing production schema manually without a migration record",
          "Using overly wide VARCHAR for every text field without considering types",
        ],
        bestPractices: [
          "Manage schema changes through versioned migration files",
          "Name tables and columns consistently with your application models",
          "Document each table purpose in migration comments or schema docs",
        ],
        interviewQuestions: [
          "What is the difference between DDL and DML?",
          "What belongs in a CREATE TABLE statement?",
          "Why use migration tools instead of manual schema edits?",
        ],
        cheatSheet: [
          { tag: "CREATE TABLE", desc: "Define a new table and its columns" },
          { tag: "NOT NULL", desc: "Column must always have a value" },
          { tag: "DEFAULT", desc: "Value used when INSERT omits the column" },
        ],
      }),
      t({
        slug: "data-types-sql",
        title: "SQL Data Types",
        summary: "Choose appropriate types for text, numbers, dates, booleans, and structured data.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["data types", "varchar", "integer", "timestamp"],
        challengeWeight: 4,
        explanation:
          "SQL columns have types that enforce valid data. Common types: INTEGER or BIGINT for whole numbers, NUMERIC or DECIMAL for exact money values, VARCHAR(n) or TEXT for strings, BOOLEAN for true/false, DATE for calendar dates, TIMESTAMP or TIMESTAMPTZ for moments in time. JSON or JSONB (PostgreSQL) stores semi-structured data. Pick the smallest type that fits to save space and clarify intent. Never store dates as strings if you need date arithmetic. Use TIMESTAMPTZ for event times that cross timezones.",
        a11yNotes: [],
        commonMistakes: [
          "Using FLOAT for currency and introducing rounding errors",
          "Storing booleans as strings like 'yes' and 'no'",
          "Using VARCHAR without length limits when the database requires one",
        ],
        bestPractices: [
          "Use NUMERIC for money and INTEGER for counts and foreign keys",
          "Prefer TIMESTAMPTZ over TIMESTAMP for application event times",
          "Match SQL types to application types in ORM mappings explicitly",
        ],
        interviewQuestions: [
          "What SQL type would you use for a product price?",
          "What is the difference between CHAR, VARCHAR, and TEXT?",
          "Why avoid storing dates as strings?",
        ],
        cheatSheet: [
          { tag: "INTEGER", desc: "Whole number type for counts and ids" },
          { tag: "NUMERIC", desc: "Exact decimal type for money" },
          { tag: "TIMESTAMPTZ", desc: "Timestamp with timezone awareness" },
        ],
      }),
      t({
        slug: "constraints-fk-unique",
        title: "Constraints, Foreign Keys, and UNIQUE",
        summary: "Constraints enforce data integrity at the database level beyond application checks.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["constraints", "foreign key", "unique", "check"],
        challengeWeight: 5,
        explanation:
          "Constraints guard data quality. PRIMARY KEY uniquely identifies rows. UNIQUE ensures no duplicate values in a column or column group, such as email. FOREIGN KEY (customer_id) REFERENCES customers(id) enforces referential integrity. ON DELETE CASCADE or SET NULL defines behavior when parent rows are removed. CHECK (price >= 0) validates row-level rules. NOT NULL rejects missing values. Database constraints survive application bugs and ad hoc SQL access, making them essential for reliable systems.",
        a11yNotes: [],
        commonMistakes: [
          "Relying only on application validation without database constraints",
          "Adding FOREIGN KEY without indexing the referencing column",
          "Using CASCADE delete without understanding downstream data loss",
        ],
        bestPractices: [
          "Define UNIQUE on natural identifiers like email when appropriate",
          "Index every foreign key column used in joins",
          "Use CHECK constraints for simple domain rules like non-negative quantities",
        ],
        interviewQuestions: [
          "What is the difference between PRIMARY KEY and UNIQUE?",
          "What does a FOREIGN KEY constraint enforce?",
          "What are ON DELETE CASCADE and SET NULL?",
        ],
        cheatSheet: [
          { tag: "FOREIGN KEY", desc: "Require referencing values to exist in parent table" },
          { tag: "UNIQUE", desc: "Disallow duplicate values in column or group" },
          { tag: "CHECK", desc: "Row-level boolean rule that must be true" },
        ],
      }),
      t({
        slug: "indexes-basics",
        title: "Indexes Basics",
        summary: "Indexes speed up lookups and joins but add write overhead and storage cost.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["index", "performance", "btree", "lookup"],
        challengeWeight: 5,
        explanation:
          "An index is a sorted data structure, usually B-tree, that lets the database find rows by column value without scanning the entire table. CREATE INDEX idx_users_email ON users(email) accelerates WHERE email = ? and JOIN on email. Primary keys and unique constraints create indexes automatically. Too many indexes slow INSERT, UPDATE, and DELETE because indexes must be maintained. Composite indexes (a, b) help queries filtering on a or both a and b. Use EXPLAIN to verify index usage.",
        a11yNotes: [],
        commonMistakes: [
          "Indexing every column without measuring query patterns",
          "Creating separate indexes when one composite index would serve common filters",
          "Assuming an index is used without checking EXPLAIN output",
        ],
        bestPractices: [
          "Index foreign keys and columns frequently used in WHERE and JOIN",
          "Use composite indexes with the most selective column first when appropriate",
          "Review slow query logs before adding new indexes",
        ],
        interviewQuestions: [
          "What does a database index do?",
          "What is the trade-off of adding indexes?",
          "When would you create a composite index?",
        ],
        cheatSheet: [
          { tag: "INDEX", desc: "Structure to accelerate lookups on column values" },
          { tag: "CREATE INDEX", desc: "Add an index to a table column or columns" },
          { tag: "B-tree", desc: "Default balanced tree index structure" },
        ],
      }),
    ],
  },
  {
    slug: "advanced-queries",
    title: "Advanced Queries",
    description: "Subqueries, common table expressions, and an introduction to window functions.",
    topics: [
      t({
        slug: "subqueries",
        title: "Subqueries",
        summary: "A subquery is a nested SELECT used inside WHERE, FROM, or SELECT clauses.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["subquery", "nested", "in", "scalar"],
        challengeWeight: 5,
        explanation:
          "Subqueries embed one query inside another. Scalar subqueries return one value: SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products). IN subqueries match against a set: WHERE id IN (SELECT customer_id FROM orders). Correlated subqueries reference outer query rows and run per outer row, which can be slow. EXISTS checks for matching rows efficiently. Subqueries in FROM create derived tables that must be aliased. Often a JOIN or CTE expresses the same logic more clearly.",
        a11yNotes: [],
        commonMistakes: [
          "Using a subquery that returns multiple rows where a scalar is expected",
          "Writing correlated subqueries that scan large tables repeatedly",
          "Forgetting to alias derived tables in the FROM clause",
        ],
        bestPractices: [
          "Prefer JOIN or CTE when readability beats nested subqueries",
          "Use EXISTS instead of IN for large subquery result sets when appropriate",
          "Test subqueries independently before embedding them",
        ],
        interviewQuestions: [
          "What is a correlated subquery?",
          "What is the difference between IN and EXISTS?",
          "Where can subqueries appear in a SQL statement?",
        ],
        cheatSheet: [
          { tag: "subquery", desc: "SELECT nested inside another query" },
          { tag: "EXISTS", desc: "True when subquery returns at least one row" },
          { tag: "IN", desc: "Match value against subquery result set" },
        ],
      }),
      t({
        slug: "ctes-intro",
        title: "Common Table Expressions (CTEs)",
        summary: "WITH clauses name temporary result sets that simplify complex readable queries.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["cte", "with", "readable", "common table expression"],
        challengeWeight: 5,
        explanation:
          "A CTE is defined with WITH name AS (SELECT ...) and referenced like a table in the main query. Multiple CTEs chain with commas: WITH a AS (...), b AS (...). CTEs improve readability by breaking complex logic into named steps. They can be recursive for hierarchical data like org charts. In PostgreSQL, CTEs can be optimization fences depending on version settings, but clarity is often worth it during development. Materialized CTEs are not standard; use temp tables for heavy reuse within a session.",
        a11yNotes: [],
        commonMistakes: [
          "Over-nesting CTEs when a simple subquery or view would suffice",
          "Assuming CTEs always cache results; behavior varies by database",
          "Forgetting that CTE scope is limited to the single statement",
        ],
        bestPractices: [
          "Name CTEs after the business concept they represent: active_users, order_totals",
          "Replace deeply nested subqueries with CTEs for maintainability",
          "Use recursive CTEs for tree or graph traversal problems",
        ],
        interviewQuestions: [
          "What problem do CTEs solve?",
          "How do you define and use a CTE?",
          "What is a recursive CTE used for?",
        ],
        cheatSheet: [
          { tag: "WITH", desc: "Introduce one or more named CTEs" },
          { tag: "CTE", desc: "Temporary named result set for one query" },
          { tag: "RECURSIVE", desc: "CTE variant for hierarchical data" },
        ],
      }),
      t({
        slug: "window-functions-intro",
        title: "Window Functions Intro",
        summary: "Window functions compute values across related rows without collapsing groups.",
        estimatedMinutes: 18,
        difficulty: "advanced",
        keywords: ["window function", "over", "partition by", "rank"],
        challengeWeight: 5,
        explanation:
          "Window functions use OVER to calculate across a window of rows while keeping each row in the output. ROW_NUMBER(), RANK(), and DENSE_RANK() assign ordering within partitions. PARTITION BY divides rows into groups like GROUP BY but without collapsing them. LAG and LEAD access previous and next rows. SUM(amount) OVER (PARTITION BY customer_id ORDER BY ordered_at) gives running totals. Window functions power analytics queries that are awkward with plain GROUP BY, such as top-N per category.",
        a11yNotes: [],
        commonMistakes: [
          "Confusing window functions with aggregates and expecting fewer output rows",
          "Omitting ORDER BY in OVER when row order matters for RANK or LAG",
          "Using GROUP BY when a window function would preserve detail rows",
        ],
        bestPractices: [
          "Use ROW_NUMBER for deduplication patterns like latest row per user",
          "Always specify ORDER BY inside OVER when sequence matters",
          "Combine window functions with CTEs for multi-step analytical queries",
        ],
        interviewQuestions: [
          "How are window functions different from GROUP BY aggregates?",
          "What do PARTITION BY and ORDER BY do in OVER?",
          "How would you find the latest order per customer with SQL?",
        ],
        cheatSheet: [
          { tag: "OVER", desc: "Define window partition and ordering" },
          { tag: "ROW_NUMBER", desc: "Assign sequential rank within partition" },
          { tag: "PARTITION BY", desc: "Split rows into window groups" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "Normalization trade-offs, reading query plans, and consistent SQL style.",
    topics: [
      t({
        slug: "normalize-vs-denormalize-lite",
        title: "Normalize vs Denormalize (Lite)",
        summary: "Normalization reduces redundancy; controlled denormalization can improve read performance.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["normalization", "denormalization", "redundancy", "design"],
        challengeWeight: 4,
        explanation:
          "Normalization organizes data into related tables to avoid update anomalies. First normal form removes repeating groups; higher forms address partial and transitive dependencies. Denormalization duplicates data intentionally, such as storing order_total on an orders row to avoid summing line items on every read. Start normalized for correctness, then denormalize hot read paths with measured need. Materialized views and caching are alternatives to permanent denormalization. Every duplicated column needs a clear update strategy.",
        a11yNotes: [],
        commonMistakes: [
          "Storing comma-separated tags in one column instead of a junction table",
          "Denormalizing prematurely before understanding read patterns",
          "Duplicating data without triggers or jobs to keep copies in sync",
        ],
        bestPractices: [
          "Default to third normal form for transactional schemas",
          "Denormalize only after profiling proves JOIN cost is a bottleneck",
          "Document denormalized columns and their synchronization rules",
        ],
        interviewQuestions: [
          "What problem does normalization solve?",
          "When might you denormalize a schema?",
          "What is a junction table?",
        ],
        cheatSheet: [
          { tag: "normalization", desc: "Split data to reduce redundancy" },
          { tag: "denormalization", desc: "Duplicate data to speed reads" },
          { tag: "junction table", desc: "Many-to-many link between two entities" },
        ],
      }),
      t({
        slug: "explain-basics",
        title: "EXPLAIN Basics",
        summary: "EXPLAIN shows how the database executes a query and whether indexes are used.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["explain", "query plan", "performance", "analyze"],
        challengeWeight: 4,
        explanation:
          "EXPLAIN before a SELECT displays the query plan: sequential scan, index scan, join methods, and estimated row counts. EXPLAIN ANALYZE (PostgreSQL) actually runs the query and shows real timings. Look for Seq Scan on large tables, nested loops with huge row estimates, and missing indexes on filter columns. Plans differ by database and statistics freshness. Run ANALYZE or equivalent to update planner statistics. EXPLAIN is the first tool for slow query investigation, not guesswork indexing.",
        a11yNotes: [],
        commonMistakes: [
          "Adding indexes without checking whether the planner uses them",
          "Misreading estimated rows versus actual rows in EXPLAIN ANALYZE output",
          "Optimizing queries in development with tiny datasets that hide full scans",
        ],
        bestPractices: [
          "Run EXPLAIN on slow production-like data volumes",
          "Compare plans before and after schema or index changes",
          "Learn your database-specific EXPLAIN output format and node types",
        ],
        interviewQuestions: [
          "What does EXPLAIN show?",
          "What is the difference between EXPLAIN and EXPLAIN ANALYZE?",
          "What does a sequential scan indicate?",
        ],
        cheatSheet: [
          { tag: "EXPLAIN", desc: "Show planned execution steps for a query" },
          { tag: "Seq Scan", desc: "Full table scan; may need an index" },
          { tag: "Index Scan", desc: "Lookup rows using an index" },
        ],
      }),
      t({
        slug: "sql-style",
        title: "SQL Style",
        summary: "Consistent formatting, naming, and query structure make SQL easier to review and maintain.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["style", "formatting", "naming", "readability"],
        challengeWeight: 3,
        explanation:
          "Readable SQL reduces bugs in code review. Use uppercase for SQL keywords (SELECT, FROM, WHERE) and lowercase or snake_case for identifiers depending on team convention. Put one clause per line: SELECT columns on separate lines, each JOIN on its own line, WHERE conditions indented. Avoid SELECT * in committed application queries. Name aliases after tables, not arbitrary letters, when queries are long. Store complex analytics SQL in version control with comments explaining business definitions.",
        a11yNotes: [],
        commonMistakes: [
          "Writing entire queries on one line so diffs are unreadable",
          "Inconsistent keyword casing across a codebase",
          "Using cryptic single-letter aliases in large team-maintained queries",
        ],
        bestPractices: [
          "Adopt a team SQL style guide and enforce it in review",
          "Format SQL with an auto-formatter in the IDE or CI",
          "Comment non-obvious business logic and metric definitions",
        ],
        interviewQuestions: [
          "Why does SQL formatting matter in team projects?",
          "What naming conventions help maintain large SQL codebases?",
          "How should JOINs be formatted for readability?",
        ],
        cheatSheet: [
          { tag: "UPPERCASE keywords", desc: "Common convention for SQL reserved words" },
          { tag: "snake_case", desc: "Typical column and table naming style" },
          { tag: "one clause per line", desc: "Formatting rule for readable queries" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply schema design and analytical querying to realistic library and analytics scenarios.",
    topics: [
      t({
        slug: "project-library-schema",
        title: "Project: Library Schema",
        summary: "Design a normalized library database with books, authors, members, and loans.",
        estimatedMinutes: 24,
        difficulty: "intermediate",
        keywords: ["project", "schema", "library", "design"],
        challengeWeight: 5,
        explanation:
          "Build a schema for a small library. Tables: authors (id, name), books (id, title, isbn, published_year), book_authors (book_id, author_id) for many-to-many, members (id, name, email, joined_at), loans (id, book_id, member_id, loaned_at, due_at, returned_at). Add PRIMARY KEY and FOREIGN KEY constraints, UNIQUE on isbn and email, and indexes on loan lookup columns. Write CREATE TABLE statements and sample INSERT data. Consider CHECK (returned_at IS NULL OR returned_at >= loaned_at). This project reinforces normalization and referential integrity.",
        a11yNotes: [
          "If building a library UI on this schema, ensure book lists and loan status are exposed to assistive tech with semantic markup.",
        ],
        commonMistakes: [
          "Storing multiple authors in a single books.authors text column",
          "Omitting a junction table for the many-to-many book-author relationship",
          "Forgetting indexes on loans(member_id) and loans(book_id) for common queries",
        ],
        bestPractices: [
          "Draw the entity-relationship diagram before writing CREATE TABLE statements",
          "Seed realistic sample data and test JOIN queries across all tables",
          "Add created_at timestamps on mutable entities for auditing",
        ],
        interviewQuestions: [
          "How would you model a many-to-many book-author relationship?",
          "What indexes would you add for a loan lookup by member?",
          "How do you enforce that returned_at is not before loaned_at?",
        ],
        cheatSheet: [
          { tag: "CREATE TABLE", desc: "Define authors, books, members, loans tables" },
          { tag: "FOREIGN KEY", desc: "Link loans to books and members" },
          { tag: "INDEX", desc: "Speed lookups on member_id and book_id" },
        ],
      }),
      t({
        slug: "project-analytics-queries",
        title: "Project: Analytics Queries",
        summary: "Write analytical SQL for reports: top books, overdue loans, and member activity.",
        estimatedMinutes: 26,
        difficulty: "advanced",
        keywords: ["project", "analytics", "report", "aggregate"],
        challengeWeight: 5,
        explanation:
          "Using the library schema, write queries: count active loans per member with GROUP BY; list overdue loans where returned_at IS NULL AND due_at < CURRENT_DATE; top 5 most loaned books using COUNT and ORDER BY LIMIT; authors with more than three books via GROUP BY and HAVING; monthly loan volume with DATE_TRUNC on loaned_at. Combine JOINs, aggregates, HAVING, and window functions like ROW_NUMBER for latest loan per book. Validate results against seed data. This project mirrors real reporting tasks data teams perform daily.",
        a11yNotes: [
          "Export or display analytics with accessible tables including captions describing the report purpose.",
        ],
        commonMistakes: [
          "Double-counting loans after joining books to authors without adjusting grain",
          "Forgetting to filter returned_at IS NULL when counting only active loans",
          "Using LIMIT without ORDER BY and getting arbitrary top-N results",
        ],
        bestPractices: [
          "Define each report metric in a comment before writing SQL",
          "Build queries incrementally: SELECT, then JOIN, then GROUP BY, then HAVING",
          "Run EXPLAIN on heavy reports and add indexes where scans dominate",
        ],
        interviewQuestions: [
          "How do you find the top N most loaned books?",
          "Write a query for overdue loans still not returned.",
          "How would you report monthly loan counts by month?",
        ],
        cheatSheet: [
          { tag: "GROUP BY", desc: "Aggregate loans per member or book" },
          { tag: "HAVING", desc: "Filter groups like authors with more than three books" },
          { tag: "ORDER BY LIMIT", desc: "Top-N most loaned books report" },
        ],
      }),
    ],
  },
];

export function flattenSqlTopics(): SqlTopicDef[] {
  return SQL_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
