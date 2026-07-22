export type ModelingDifficulty = "beginner" | "intermediate" | "advanced";

export type ModelingTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ModelingDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** Data modeling concepts and notation for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ModelingSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ModelingTopicDef[];
};

function t(partial: ModelingTopicDef): ModelingTopicDef {
  return partial;
}

export const MODELING_ACADEMY_SECTIONS: ModelingSectionDef[] = [
  {
    slug: "modeling-intro",
    title: "Modeling Intro",
    description:
      "Foundations of data modeling: what it is, the three schema levels, entities, attributes, and relationships.",
    topics: [
      t({
        slug: "what-is-data-modeling",
        title: "What is Data Modeling?",
        summary:
          "Data modeling is the process of defining how information is structured, stored, and related in a database.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["data modeling", "schema", "database", "design"],
        challengeWeight: 4,
        explanation:
          "Data modeling translates business requirements into a clear structure that a database can enforce. You identify what entities exist, what attributes they have, and how they connect. A good model balances correctness, performance, and maintainability. Data modeling happens before or alongside application design so teams agree on names, rules, and ownership of data. The output is usually diagrams, table definitions, and documented constraints that guide migrations and queries.",
        a11yNotes: [],
        commonMistakes: [
          "Jumping straight to SQL tables without understanding business rules first",
          "Treating the application object model and the database schema as identical without question",
          "Skipping documentation because the first developer knows the schema by heart",
        ],
        bestPractices: [
          "Start from user stories and domain language before choosing column types",
          "Review models with product and engineering stakeholders early",
          "Keep a glossary of entity and attribute names shared across teams",
        ],
        interviewQuestions: [
          "What is data modeling and why does it matter?",
          "Who should be involved in creating a data model?",
          "What artifacts does data modeling produce?",
        ],
        cheatSheet: [
          { tag: "Entity", desc: "A thing the business stores data about" },
          { tag: "Schema", desc: "The structure of tables, columns, and constraints" },
          { tag: "Domain", desc: "The business area the model represents" },
        ],
      }),
      t({
        slug: "conceptual-logical-physical",
        title: "Conceptual, Logical, and Physical Models",
        summary:
          "Models progress from business concepts to technology-independent structure to database-specific implementation.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["conceptual", "logical", "physical", "levels"],
        challengeWeight: 4,
        explanation:
          "Conceptual models show entities and relationships at a high level for stakeholders who may not know SQL. Logical models add attributes, keys, and cardinality without binding to a specific database engine. Physical models map the logical design to tables, indexes, partitions, and storage types in PostgreSQL, MySQL, or another system. You can skip formal diagrams on small projects, but separating levels prevents premature decisions about indexes or vendor features before the domain is understood.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing index and partition decisions into the first whiteboard sketch",
          "Creating a physical schema copy that never updates when the logical model changes",
          "Over-investing in conceptual diagrams for a single-table prototype",
        ],
        bestPractices: [
          "Align entity names across conceptual, logical, and physical artifacts",
          "Document which level a diagram represents in its title or legend",
          "Revisit the logical model when physical performance work reveals missing entities",
        ],
        interviewQuestions: [
          "What is the difference between conceptual, logical, and physical data models?",
          "When would you stop at a logical model without a full physical design?",
          "How do physical models differ by database vendor?",
        ],
        cheatSheet: [
          { tag: "Conceptual", desc: "High-level entities and relationships for stakeholders" },
          { tag: "Logical", desc: "Detailed structure independent of a DB engine" },
          { tag: "Physical", desc: "Tables, indexes, and types as implemented in a database" },
        ],
      }),
      t({
        slug: "entities-and-attributes",
        title: "Entities and Attributes",
        summary:
          "Entities are the nouns of your domain; attributes are the properties that describe each entity.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["entity", "attribute", "column", "property"],
        challengeWeight: 4,
        explanation:
          "An entity represents a distinct type of record: Customer, Order, or Article. Attributes are the fields on that entity: email, order_date, or title. Each attribute should have a clear name, data type, nullability, and business meaning. Strong entities exist on their own; weak entities depend on another entity for identity. When modeling, ask whether a concept is its own table or just a value on another table. Prefer separate entities when the concept has its own lifecycle or many related records.",
        a11yNotes: [],
        commonMistakes: [
          "Storing repeating values in a single column instead of a related entity",
          "Using vague attribute names like data or value across many tables",
          "Creating an entity for every screen field without checking domain boundaries",
        ],
        bestPractices: [
          "Name attributes after domain terms, not UI labels alone",
          "Define units and time zones for numeric and datetime attributes",
          "Document optional versus required attributes with business justification",
        ],
        interviewQuestions: [
          "What is the difference between an entity and an attribute?",
          "When should a concept become its own entity instead of an attribute?",
          "What is a weak entity?",
        ],
        cheatSheet: [
          { tag: "Entity", desc: "Table or object type representing a domain noun" },
          { tag: "Attribute", desc: "Column or property describing an entity" },
          { tag: "PK", desc: "Primary key uniquely identifying entity rows" },
        ],
      }),
      t({
        slug: "relationships-overview",
        title: "Relationships Overview",
        summary:
          "Relationships describe how entities connect through keys and cardinality rules.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["relationship", "cardinality", "association", "link"],
        challengeWeight: 4,
        explanation:
          "Relationships model how entities reference each other. A Customer places many Orders; an Order belongs to one Customer. Cardinality states how many instances on each side may participate: one-to-one, one-to-many, or many-to-many. Relationships are implemented with foreign keys, junction tables, or sometimes embedded references depending on the database. Clear relationship rules prevent orphaned rows, duplicate associations, and ambiguous joins in application queries.",
        a11yNotes: [],
        commonMistakes: [
          "Drawing relationships without deciding ownership and delete behavior",
          "Implementing many-to-many links as comma-separated lists in one column",
          "Assuming every relationship must be bidirectional in the schema",
        ],
        bestPractices: [
          "Label each relationship with verb phrases both directions understand",
          "Decide cascade or restrict rules before writing migrations",
          "Use junction tables for many-to-many associations with extra attributes",
        ],
        interviewQuestions: [
          "What is a relationship in data modeling?",
          "How is cardinality expressed in an ER diagram?",
          "How are relationships typically implemented in relational databases?",
        ],
        cheatSheet: [
          { tag: "1:1", desc: "One row on each side links to at most one on the other" },
          { tag: "1:N", desc: "One parent row links to many child rows" },
          { tag: "FK", desc: "Foreign key column referencing another table primary key" },
        ],
      }),
    ],
  },
  {
    slug: "er-basics",
    title: "ER Basics",
    description:
      "Entity-relationship fundamentals: entity types, cardinality notation, and common relationship patterns.",
    topics: [
      t({
        slug: "entity-types",
        title: "Entity Types",
        summary:
          "Entity types classify records that share the same attributes and relationships in the model.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["entity type", "strong", "weak", "subtype"],
        challengeWeight: 3,
        explanation:
          "An entity type is the template for rows in a table: all User rows share id, email, and created_at. Strong entity types have their own primary key. Weak entity types depend on a parent key, such as OrderLine depending on Order. Subtypes represent specializations: Employee and Contractor may share Person attributes with different optional fields. Generalization can be modeled as separate tables, single-table inheritance, or class-table inheritance depending on query patterns and null density.",
        a11yNotes: [],
        commonMistakes: [
          "Merging unrelated entity types into one wide table with many nullable columns",
          "Creating separate entity types that always appear together and never alone",
          "Using polymorphic associations without documenting allowed target types",
        ],
        bestPractices: [
          "Split entity types when lifecycles or constraints differ materially",
          "Prefer explicit subtype tables when subsets have many unique attributes",
          "Keep shared attributes on a base table when queries usually need the full set",
        ],
        interviewQuestions: [
          "What is an entity type?",
          "How do strong and weak entity types differ?",
          "What are common ways to model subtypes?",
        ],
        cheatSheet: [
          { tag: "Strong entity", desc: "Has its own primary key independent of others" },
          { tag: "Weak entity", desc: "Identity depends on a parent entity key" },
          { tag: "Subtype", desc: "Specialized variant of a more general entity type" },
        ],
      }),
      t({
        slug: "relationship-cardinality",
        title: "Relationship Cardinality",
        summary:
          "Cardinality specifies the minimum and maximum number of related instances on each side of a link.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["cardinality", "optional", "mandatory", "crow's foot"],
        challengeWeight: 4,
        explanation:
          "Cardinality combines participation and count. Optional participation means a row may exist without a related row on the other side. Mandatory participation requires a related row. Maximum cardinality is often one or many. Crow's foot notation marks the many side on ER diagrams. Modeling optional one-to-one relationships may use a nullable foreign key or a separate table when both sides are large. Document cardinality so application validation and database constraints stay aligned.",
        a11yNotes: [],
        commonMistakes: [
          "Allowing many related rows when the business rule allows only one",
          "Forgetting optional side nullability on foreign key columns",
          "Confusing minimum cardinality with maximum cardinality in diagrams",
        ],
        bestPractices: [
          "Write business rules in plain language before drawing notation",
          "Enforce mandatory relationships with NOT NULL foreign keys where appropriate",
          "Review cardinality with domain experts for edge cases like cancellations",
        ],
        interviewQuestions: [
          "What does cardinality describe in an ER model?",
          "What is optional versus mandatory participation?",
          "How is cardinality shown in crow's foot notation?",
        ],
        cheatSheet: [
          { tag: "(0,1)", desc: "Zero or one related instance allowed" },
          { tag: "(1,N)", desc: "One or many related instances required or allowed" },
          { tag: "Crow's foot", desc: "ER notation marking the many side of a relationship" },
        ],
      }),
      t({
        slug: "one-to-many",
        title: "One-to-Many Relationships",
        summary:
          "One-to-many links store the foreign key on the many side pointing to the one side primary key.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["one-to-many", "parent", "child", "foreign key"],
        challengeWeight: 4,
        explanation:
          "One-to-many is the most common relationship pattern. A Department has many Employees; each Employee belongs to one Department. Place department_id on the employees table as a foreign key to departments.id. The one side does not store a list of child ids. Indexes on foreign key columns speed joins and enforce referential checks efficiently. Decide whether deleting a parent should cascade to children, set null, or be blocked based on business rules.",
        a11yNotes: [],
        commonMistakes: [
          "Storing multiple child ids in an array column on the parent row",
          "Putting the foreign key on the wrong side of the relationship",
          "Omitting an index on a heavily joined foreign key column",
        ],
        bestPractices: [
          "Name foreign keys after the referenced table: user_id, order_id",
          "Define ON DELETE behavior explicitly in schema migrations",
          "Use 1:N diagrams in reviews so new team members grasp ownership quickly",
        ],
        interviewQuestions: [
          "How do you implement a one-to-many relationship in a relational database?",
          "Where does the foreign key go in a 1:N relationship?",
          "What delete behaviors are common for parent-child rows?",
        ],
        cheatSheet: [
          { tag: "1:N", desc: "One parent row associated with many child rows" },
          { tag: "FK on many side", desc: "Child table holds the referencing column" },
          { tag: "ON DELETE", desc: "Action when parent row is removed" },
        ],
      }),
      t({
        slug: "many-to-many",
        title: "Many-to-Many Relationships",
        summary:
          "Many-to-many associations use a junction table with foreign keys to both participating entities.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["many-to-many", "junction", "associative", "link"],
        challengeWeight: 5,
        explanation:
          "When both sides can relate to multiple rows, a junction table breaks the M:N into two 1:N links. Students enroll in many Courses; Courses have many Students. Create enrollments with student_id and course_id, often with a composite primary key or surrogate id plus a unique pair constraint. Junction tables may carry extra attributes like enrolled_at or grade. Name junction tables clearly: user_roles, product_tags, order_coupons. Avoid duplicating junction rows with weak uniqueness rules.",
        a11yNotes: [],
        commonMistakes: [
          "Modeling M:N without a junction table in relational schemas",
          "Forgetting a unique constraint on the pair of foreign keys",
          "Putting junction-specific attributes on one of the main entity tables",
        ],
        bestPractices: [
          "Add composite unique indexes on junction foreign key pairs",
          "Use surrogate keys on junction tables when the link has a rich lifecycle",
          "Document whether the association itself is a first-class domain concept",
        ],
        interviewQuestions: [
          "How do you model a many-to-many relationship in SQL?",
          "What is a junction or associative table?",
          "When should a junction table have its own surrogate primary key?",
        ],
        cheatSheet: [
          { tag: "M:N", desc: "Many rows on each side may link to multiple on the other" },
          { tag: "Junction table", desc: "Resolves M:N into two 1:N relationships" },
          { tag: "UNIQUE(a,b)", desc: "Prevents duplicate pairs in a junction table" },
        ],
      }),
    ],
  },
  {
    slug: "keys-and-integrity",
    title: "Keys and Integrity",
    description:
      "Primary and foreign keys, candidate keys, referential integrity, and surrogate versus natural identifiers.",
    topics: [
      t({
        slug: "candidate-keys",
        title: "Candidate Keys",
        summary:
          "Candidate keys are minimal sets of attributes that uniquely identify an entity row.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["candidate key", "primary key", "unique", "identifier"],
        challengeWeight: 4,
        explanation:
          "A candidate key uniquely identifies each row and cannot be reduced without losing uniqueness. A User might have candidate keys on id, email, and external_sso_id. Choose one candidate key as the primary key; others become alternate keys with UNIQUE constraints. Composite candidate keys combine columns, such as country_code plus national_id. Identifying all candidate keys early prevents duplicate business records and guides normalization decisions about dependency on partial keys.",
        a11yNotes: [],
        commonMistakes: [
          "Assuming an auto-increment id is the only key worth defining",
          "Creating a primary key that includes redundant columns",
          "Allowing duplicate natural identifiers because only surrogate id is constrained",
        ],
        bestPractices: [
          "List natural identifiers from the business before picking a primary key",
          "Enforce alternate keys with UNIQUE constraints, not application checks alone",
          "Document why the primary key was chosen among candidates",
        ],
        interviewQuestions: [
          "What is a candidate key?",
          "How does a candidate key differ from a primary key?",
          "Give an example of a composite candidate key.",
        ],
        cheatSheet: [
          { tag: "Candidate key", desc: "Minimal attribute set that uniquely identifies a row" },
          { tag: "PK", desc: "Primary key selected among candidate keys" },
          { tag: "Alternate key", desc: "Non-primary candidate key enforced with UNIQUE" },
        ],
      }),
      t({
        slug: "foreign-keys-modeling",
        title: "Foreign Keys in Modeling",
        summary:
          "Foreign keys express relationships and let the database enforce valid references between tables.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["foreign key", "reference", "constraint", "join"],
        challengeWeight: 5,
        explanation:
          "A foreign key column references a primary or unique key in another table. Foreign keys document intent in the schema itself, not only in ORM mappings. They enable referential integrity checks on insert and update. Composite foreign keys mirror composite primary keys on parent tables. Nullable foreign keys model optional relationships. When modeling polymorphic references, prefer separate nullable foreign keys per target type or a typed discriminator with strict check constraints instead of untyped id columns.",
        a11yNotes: [],
        commonMistakes: [
          "Using application-only references without database foreign key constraints",
          "Mismatching foreign key column types with referenced primary key types",
          "Creating polymorphic commentable_id without type safety or integrity rules",
        ],
        bestPractices: [
          "Declare foreign keys in migrations for core domain relationships",
          "Match column types and collations between FK and referenced PK columns",
          "Index foreign key columns used in joins and cascading operations",
        ],
        interviewQuestions: [
          "What does a foreign key enforce?",
          "When might a foreign key column be nullable?",
          "What are trade-offs of skipping foreign key constraints?",
        ],
        cheatSheet: [
          { tag: "FK", desc: "Column referencing another table unique key" },
          { tag: "REFERENCES", desc: "SQL clause defining a foreign key target" },
          { tag: "Composite FK", desc: "Multi-column foreign key matching composite PK" },
        ],
      }),
      t({
        slug: "referential-integrity",
        title: "Referential Integrity",
        summary:
          "Referential integrity ensures child rows always point to existing parents unless explicitly optional.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["referential integrity", "cascade", "restrict", "orphan"],
        challengeWeight: 5,
        explanation:
          "Referential integrity prevents orphan rows that reference missing parents. On insert or update, the database verifies the foreign key value exists. On delete or update of the parent key, behavior is defined by ON DELETE and ON UPDATE actions: RESTRICT blocks the change, CASCADE propagates it, SET NULL clears optional references. Deferred constraints allow multi-step transactions that temporarily violate rules until commit. Integrity rules should mirror business policies, not default blindly to CASCADE.",
        a11yNotes: [],
        commonMistakes: [
          "Using CASCADE everywhere and accidentally deleting large subgraphs",
          "Leaving orphan rows after manual data fixes outside migrations",
          "Assuming soft deletes remove the need for integrity planning",
        ],
        bestPractices: [
          "Choose delete actions per relationship with explicit business approval",
          "Audit tables with RESTRICT deletes when history must be preserved",
          "Test migration scripts against integrity rules on staging copies",
        ],
        interviewQuestions: [
          "What is referential integrity?",
          "Explain ON DELETE CASCADE versus RESTRICT.",
          "What are orphan rows and how do foreign keys prevent them?",
        ],
        cheatSheet: [
          { tag: "RESTRICT", desc: "Block parent delete when children exist" },
          { tag: "CASCADE", desc: "Delete or update child rows with parent" },
          { tag: "SET NULL", desc: "Clear optional FK when parent is deleted" },
        ],
      }),
      t({
        slug: "surrogates-vs-natural",
        title: "Surrogate vs Natural Keys",
        summary:
          "Surrogate keys are system-generated identifiers; natural keys come from real-world business data.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["surrogate", "natural key", "uuid", "identity"],
        challengeWeight: 4,
        explanation:
          "Natural keys use business meaning: country ISO code, email, or order number from an external system. Surrogate keys use opaque ids generated by the database or application, such as bigint identity or UUID. Surrogates stay stable when natural values change and simplify foreign keys when natural keys are composite or long. Natural keys can reduce joins when they are truly immutable and unique. Many models use surrogate primary keys plus unique constraints on natural identifiers.",
        a11yNotes: [],
        commonMistakes: [
          "Using mutable fields like email as the sole primary key",
          "Choosing UUID everywhere without considering index fragmentation and sort cost",
          "Exposing internal surrogate ids as public business identifiers without thought",
        ],
        bestPractices: [
          "Prefer surrogates when natural keys may change or span multiple columns",
          "Keep natural business identifiers as alternate unique keys when needed",
          "Use time-ordered UUIDs when global uniqueness and sortability both matter",
        ],
        interviewQuestions: [
          "What is the difference between surrogate and natural keys?",
          "When would you choose a natural key as the primary key?",
          "What are pros and cons of UUID primary keys?",
        ],
        cheatSheet: [
          { tag: "Surrogate key", desc: "System-generated identifier with no business meaning" },
          { tag: "Natural key", desc: "Business identifier such as SKU or email" },
          { tag: "UUID", desc: "Universally unique surrogate key type" },
        ],
      }),
    ],
  },
  {
    slug: "normalization",
    title: "Normalization",
    description:
      "Normal forms reduce redundancy and update anomalies; learn when controlled denormalization is justified.",
    topics: [
      t({
        slug: "1nf",
        title: "First Normal Form (1NF)",
        summary:
          "First normal form requires atomic column values and a unique row identifier.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["1nf", "atomic", "normalization", "repeating group"],
        challengeWeight: 4,
        explanation:
          "A table is in first normal form when each column holds a single atomic value and each row is uniquely identifiable. Repeating groups violate 1NF: storing phone1, phone2, phone3 or a comma-separated tag list in one column. Fix repeating groups by moving values to a related table with one row per value. 1NF is the baseline for relational design; without it, filtering, sorting, and updating individual values becomes unreliable and non-standard.",
        a11yNotes: [],
        commonMistakes: [
          "Storing JSON blobs in a column to avoid related tables when values are queried independently",
          "Using wide sparse columns for unbounded repeating data",
          "Treating a delimited string as a normalized multi-value field",
        ],
        bestPractices: [
          "Split multi-valued attributes into child tables with foreign keys",
          "Define a primary key before declaring a table normalized",
          "Review imports and legacy spreadsheets for hidden repeating groups",
        ],
        interviewQuestions: [
          "What does first normal form require?",
          "Give an example of a 1NF violation.",
          "How do you fix repeating groups in a schema?",
        ],
        cheatSheet: [
          { tag: "1NF", desc: "Atomic values and unique rows per table" },
          { tag: "Atomic", desc: "Column value is indivisible for the domain" },
          { tag: "Repeating group", desc: "Multiple values of same kind in one row" },
        ],
      }),
      t({
        slug: "2nf",
        title: "Second Normal Form (2NF)",
        summary:
          "Second normal form removes partial dependencies on part of a composite primary key.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["2nf", "partial dependency", "composite key", "normalization"],
        challengeWeight: 4,
        explanation:
          "2NF applies when a table has a composite primary key. A partial dependency exists when a non-key attribute depends on only part of that composite key. In order_lines with primary key (order_id, product_id), storing product_name depends only on product_id, not the full key. Move product_name to a products table keyed by product_id. Tables with single-column primary keys are automatically in 2NF if they are already in 1NF. Fixing 2NF issues reduces redundant updates across rows.",
        a11yNotes: [],
        commonMistakes: [
          "Ignoring partial dependencies because the composite key feels convenient",
          "Duplicating descriptive columns on junction tables without need",
          "Assuming 2NF matters only for academic exercises, not production schemas",
        ],
        bestPractices: [
          "Extract entities referenced by part of a composite key into their own tables",
          "Keep junction tables narrow unless attributes depend on the full composite key",
          "Verify dependencies when migrating from composite keys to surrogate ids",
        ],
        interviewQuestions: [
          "What is a partial dependency?",
          "When does second normal form apply?",
          "How do you resolve a 2NF violation?",
        ],
        cheatSheet: [
          { tag: "2NF", desc: "No partial dependency on part of a composite PK" },
          { tag: "Partial dependency", desc: "Non-key attribute depends on subset of composite PK" },
          { tag: "Composite PK", desc: "Primary key spanning multiple columns" },
        ],
      }),
      t({
        slug: "3nf",
        title: "Third Normal Form (3NF)",
        summary:
          "Third normal form removes transitive dependencies where non-key attributes depend on other non-key attributes.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["3nf", "transitive dependency", "normalization", "anomaly"],
        challengeWeight: 5,
        explanation:
          "A table is in third normal form when it is in 2NF and no non-key attribute depends transitively on the primary key through another non-key attribute. If employees store department_id and department_name, department_name depends on department_id, not directly on employee id. Move department_name to a departments table. 3NF reduces update anomalies: changing a department name updates one row instead of many employee rows. Higher normal forms exist but 3NF is a practical target for most OLTP schemas.",
        a11yNotes: [],
        commonMistakes: [
          "Duplicating lookup labels on fact tables for convenience without a plan",
          "Normalizing so aggressively that every query requires many joins",
          "Confusing 3NF with eliminating all redundancy including computed caches",
        ],
        bestPractices: [
          "Move descriptively dependent data to reference tables keyed by the determinant",
          "Check denormalized copies for drift during code review",
          "Target 3NF for transactional cores; denormalize read models deliberately later",
        ],
        interviewQuestions: [
          "What is a transitive dependency?",
          "What problem does third normal form solve?",
          "Give an example of a 3NF violation and its fix.",
        ],
        cheatSheet: [
          { tag: "3NF", desc: "No transitive dependency on non-key attributes" },
          { tag: "Transitive dep", desc: "Non-key attribute depends on another non-key attribute" },
          { tag: "Update anomaly", desc: "Redundant data causes inconsistent updates" },
        ],
      }),
      t({
        slug: "when-to-denormalize",
        title: "When to Denormalize",
        summary:
          "Controlled denormalization trades storage and consistency work for read performance and simpler queries.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["denormalization", "performance", "trade-off", "read model"],
        challengeWeight: 5,
        explanation:
          "Denormalization intentionally duplicates data that a normalized schema would store once. Common cases include cached counts, denormalized labels on reporting tables, and materialized aggregates for dashboards. Accept denormalization when read latency or join cost dominates and you have a clear strategy to keep copies consistent through triggers, application writes, or batch rebuilds. Never denormalize by accident through unchecked copy-paste in migrations. Document every redundant column and its refresh rule.",
        a11yNotes: [],
        commonMistakes: [
          "Denormalizing before measuring join performance on realistic data volumes",
          "Duplicating data without a defined update path when source rows change",
          "Treating denormalized analytics tables as sources of truth for writes",
        ],
        bestPractices: [
          "Start normalized; denormalize only with measured bottlenecks",
          "Use materialized views or read replicas for heavy reporting when possible",
          "Name denormalized columns clearly, such as cached_total or snapshot_title",
        ],
        interviewQuestions: [
          "Why would you denormalize a schema?",
          "What risks does denormalization introduce?",
          "How do teams keep denormalized data consistent?",
        ],
        cheatSheet: [
          { tag: "Denormalize", desc: "Duplicate data to optimize reads" },
          { tag: "Materialized view", desc: "Stored query result refreshed on schedule or event" },
          { tag: "Cache column", desc: "Redundant column maintained by application logic" },
        ],
      }),
    ],
  },
  {
    slug: "patterns",
    title: "Patterns",
    description:
      "Reusable modeling patterns: lookup tables, junction tables, soft deletes, and audit columns.",
    topics: [
      t({
        slug: "lookup-tables",
        title: "Lookup Tables",
        summary:
          "Lookup tables store reference values such as statuses and types instead of hard-coded strings in many columns.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["lookup", "reference", "enum", "status"],
        challengeWeight: 3,
        explanation:
          "Lookup tables centralize allowed values: order_statuses, countries, or role_types. Rows usually have a stable code, a display label, and maybe sort order. Application code references lookup ids or codes through foreign keys. Compared to database enums, lookup tables change without migrations and carry metadata like descriptions. Seed lookup data in migrations or fixtures. Avoid duplicating the same lookup in multiple schemas without a shared source of truth.",
        a11yNotes: [],
        commonMistakes: [
          "Storing display labels in fact tables instead of referencing lookup ids",
          "Creating a lookup table for two static values that never change",
          "Deleting lookup rows that are still referenced by historical records",
        ],
        bestPractices: [
          "Use stable codes for lookups and translate labels in the application layer",
          "Restrict deletion of lookup values referenced by historical data",
          "Version or archive lookup changes when reporting depends on old labels",
        ],
        interviewQuestions: [
          "What is a lookup table?",
          "When are lookup tables preferred over enum columns?",
          "How should applications reference lookup values?",
        ],
        cheatSheet: [
          { tag: "Lookup table", desc: "Reference table for statuses, types, or codes" },
          { tag: "code", desc: "Stable machine-readable lookup identifier" },
          { tag: "FK to lookup", desc: "Fact table column referencing lookup row" },
        ],
      }),
      t({
        slug: "junction-tables",
        title: "Junction Tables as a Pattern",
        summary:
          "Junction tables model associations and can carry metadata about the link itself.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["junction", "associative", "link table", "M:N"],
        challengeWeight: 4,
        explanation:
          "Beyond resolving many-to-many links, junction tables represent membership, tagging, and permissions. A user_roles table links users and roles and may include granted_at or granted_by. Treat the junction as part of the domain when the association has lifecycle events. Use composite unique constraints to prevent duplicate links. Consider whether queries need the junction id as a handle for updates to link metadata without touching either side entity.",
        a11yNotes: [],
        commonMistakes: [
          "Naming junction tables ambiguously so their purpose is unclear in SQL logs",
          "Omitting indexes on both foreign key columns used in bidirectional lookups",
          "Modeling time-bounded associations without valid_from and valid_to columns",
        ],
        bestPractices: [
          "Name junction tables with both entity names: product_category_map",
          "Add timestamps when the association can start or end over time",
          "Expose junction ids when APIs update link attributes independently",
        ],
        interviewQuestions: [
          "What beyond M:N resolution can junction tables represent?",
          "What columns commonly appear on junction tables?",
          "How do you prevent duplicate associations?",
        ],
        cheatSheet: [
          { tag: "Junction", desc: "Table linking two entities in M:N or rich associations" },
          { tag: "M:N", desc: "Many-to-many resolved via junction table" },
          { tag: "Link metadata", desc: "Attributes that describe the association row" },
        ],
      }),
      t({
        slug: "soft-deletes",
        title: "Soft Deletes",
        summary:
          "Soft deletes mark rows as removed with a flag or timestamp instead of physically deleting them.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["soft delete", "deleted_at", "archive", "recover"],
        challengeWeight: 4,
        explanation:
          "Soft deletion sets deleted_at or is_deleted instead of running DELETE. Applications filter active rows in queries: WHERE deleted_at IS NULL. Soft deletes support undo, audit trails, and foreign key preservation. Unique constraints must account for soft-deleted rows, often with partial unique indexes that ignore deleted records. Soft deletes increase table size and complicate every query unless views or ORM scopes enforce filters consistently.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting soft-delete filters in ad hoc reports and background jobs",
          "Blocking re-registration because a unique email still exists on a soft-deleted row",
          "Soft deleting rows that regulations require to be hard deleted",
        ],
        bestPractices: [
          "Standardize deleted_at timestamps and global query scopes",
          "Use partial unique indexes for business keys among active rows only",
          "Define retention jobs that hard delete or archive after a legal period",
        ],
        interviewQuestions: [
          "What is a soft delete?",
          "How do soft deletes affect unique constraints?",
          "When should you avoid soft deletes?",
        ],
        cheatSheet: [
          { tag: "deleted_at", desc: "Timestamp marking row as logically removed" },
          { tag: "Partial UNIQUE", desc: "Unique index excluding soft-deleted rows" },
          { tag: "Hard delete", desc: "Physical row removal from the table" },
        ],
      }),
      t({
        slug: "audit-columns",
        title: "Audit Columns",
        summary:
          "Audit columns record who created or changed a row and when for traceability and debugging.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["audit", "created_at", "updated_at", "traceability"],
        challengeWeight: 3,
        explanation:
          "Common audit columns include created_at, updated_at, created_by, and updated_by. They help support teams trace data changes without a full event log. Use consistent timezone-aware timestamps stored in UTC. Application middleware or database triggers can populate audit fields automatically. Audit columns are not a substitute for a dedicated audit log when compliance requires before and after values for every change.",
        a11yNotes: [],
        commonMistakes: [
          "Letting clients set created_at instead of the server",
          "Omitting updated_at maintenance on partial column updates",
          "Assuming audit columns satisfy regulatory audit requirements alone",
        ],
        bestPractices: [
          "Apply audit columns consistently across core business tables",
          "Set timestamps in UTC and display in user locale in the application",
          "Pair lightweight audit columns with event tables for sensitive domains",
        ],
        interviewQuestions: [
          "What are typical audit columns?",
          "How should created_at and updated_at be maintained?",
          "When do audit columns need a separate audit log table?",
        ],
        cheatSheet: [
          { tag: "created_at", desc: "When the row was first inserted" },
          { tag: "updated_at", desc: "When the row last changed" },
          { tag: "created_by", desc: "User or service that inserted the row" },
        ],
      }),
    ],
  },
  {
    slug: "scaling-design",
    title: "Scaling Design",
    description:
      "Design choices that affect scale: indexes aligned to access paths, partitioning basics, and read versus write models.",
    topics: [
      t({
        slug: "indexing-for-access-paths",
        title: "Indexing for Access Paths",
        summary:
          "Model indexes around how applications actually query data, not every column individually.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["index", "access path", "query", "performance"],
        challengeWeight: 5,
        explanation:
          "An access path is the typical route queries take to find rows: by user_id and created_at descending, or by slug for public pages. Composite indexes should lead with equality filters and end with range or sort columns. Foreign keys used in joins usually deserve indexes. Over-indexing slows writes and migration time. Index design is part of data modeling because it influences whether you split tables, add summary columns, or archive history. Review slow query logs against the model regularly.",
        a11yNotes: [],
        commonMistakes: [
          "Adding single-column indexes without analyzing composite query filters",
          "Indexing low-cardinality columns alone that never appear in selective predicates",
          "Duplicating the same column order in multiple redundant indexes",
        ],
        bestPractices: [
          "Design indexes from documented access paths and EXPLAIN plans",
          "Co-locate hot query columns in composite indexes following left-prefix rules",
          "Revisit indexes when data volume or query patterns shift materially",
        ],
        interviewQuestions: [
          "What is an access path in database design?",
          "How do composite index column orders affect queries?",
          "Why should indexing be considered during data modeling?",
        ],
        cheatSheet: [
          { tag: "Composite index", desc: "Index spanning multiple columns in defined order" },
          { tag: "Access path", desc: "Common query route through tables and filters" },
          { tag: "EXPLAIN", desc: "Tool output showing how a query uses indexes" },
        ],
      }),
      t({
        slug: "partitioning-intro",
        title: "Partitioning Introduction",
        summary:
          "Partitioning splits large tables into smaller physical pieces while keeping one logical table.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["partition", "shard", "range", "scale"],
        challengeWeight: 5,
        explanation:
          "Partitioning helps manage very large tables by range, list, or hash keys. Time-series events often partition by month so old partitions detach for archive. Tenant id hash partitioning spreads load in multi-tenant systems. The partition key must appear in queries for pruning to help performance. Partitioning affects primary keys, unique constraints, and foreign keys depending on the database. Model partitioning early when you expect billions of rows or strict retention policies.",
        a11yNotes: [],
        commonMistakes: [
          "Choosing a partition key that queries rarely filter on",
          "Assuming partitioning removes the need for indexes on hot columns",
          "Creating too many small partitions that overwhelm the planner",
        ],
        bestPractices: [
          "Align partition keys with retention and purge workflows",
          "Test query plans with representative partition counts",
          "Document partition maintenance jobs in runbooks",
        ],
        interviewQuestions: [
          "Why partition a table?",
          "What is partition pruning?",
          "What are common partition key strategies?",
        ],
        cheatSheet: [
          { tag: "Range partition", desc: "Split rows by contiguous key ranges such as dates" },
          { tag: "Hash partition", desc: "Distribute rows by hash of a key such as tenant_id" },
          { tag: "Pruning", desc: "Skipping irrelevant partitions during query planning" },
        ],
      }),
      t({
        slug: "read-vs-write-models",
        title: "Read vs Write Models",
        summary:
          "Write models stay normalized for integrity; read models optimize queries even when data is duplicated.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["read model", "write model", "CQRS", "projection"],
        challengeWeight: 5,
        explanation:
          "The write model enforces business rules and referential integrity in normalized tables. Read models denormalize or aggregate data for screens, search, and analytics. CQRS separates command and query schemas explicitly. Projections rebuild read tables from events or change streams. This split lets you evolve query performance without destabilizing transactional cores. The cost is synchronization complexity and eventual consistency on read paths. Choose separate read models when join-heavy dashboards dominate load.",
        a11yNotes: [],
        commonMistakes: [
          "Using denormalized read tables as the only source for writes",
          "Building read models without monitoring lag between write and read sides",
          "Introducing CQRS complexity before a single database becomes a bottleneck",
        ],
        bestPractices: [
          "Keep the normalized schema authoritative for transactional updates",
          "Name read models clearly: order_summary_view or search_product_doc",
          "Measure replication or projection lag and alert on thresholds",
        ],
        interviewQuestions: [
          "What is the difference between read and write models?",
          "What is CQRS at a high level?",
          "When is a separate read model justified?",
        ],
        cheatSheet: [
          { tag: "Write model", desc: "Normalized schema for transactional integrity" },
          { tag: "Read model", desc: "Query-optimized schema often denormalized" },
          { tag: "Projection", desc: "Derived read data built from write-side changes" },
        ],
      }),
    ],
  },
  {
    slug: "domains",
    title: "Domains",
    description:
      "Apply modeling patterns to common domains: users and authorization, e-commerce orders, and CMS content.",
    topics: [
      t({
        slug: "modeling-users-authz",
        title: "Modeling Users and Authorization",
        summary:
          "User models separate identity from roles and permissions using junction tables and scoped grants.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["users", "roles", "permissions", "authz"],
        challengeWeight: 5,
        explanation:
          "A users table stores identity: id, email, password hash or external subject id. Roles and permissions rarely belong as wide columns on users. Use roles, permissions, and user_roles or role_permissions junction tables. Resource-scoped authorization adds tables like resource_grants linking users or roles to specific records. Separate authentication sessions or tokens from the core user profile. Model soft-deleted users carefully when historical actions must remain attributed.",
        a11yNotes: [],
        commonMistakes: [
          "Storing comma-separated role names on the user row",
          "Duplicating permission strings in application code and unenforced columns",
          "Deleting user rows that own audit history without retention strategy",
        ],
        bestPractices: [
          "Normalize roles and permissions with junction tables",
          "Use stable user ids in audit and foreign keys even if email changes",
          "Document global versus resource-scoped permission evaluation order",
        ],
        interviewQuestions: [
          "How do you model users, roles, and permissions relationally?",
          "Why avoid storing roles as a single text column?",
          "How should deleted users appear in historical records?",
        ],
        cheatSheet: [
          { tag: "users", desc: "Core identity table for authenticated accounts" },
          { tag: "user_roles", desc: "Junction linking users to roles" },
          { tag: "RBAC", desc: "Role-based access control via role assignments" },
        ],
      }),
      t({
        slug: "modeling-orders-ecommerce",
        title: "Modeling Orders and E-commerce",
        summary:
          "Order models capture header totals, line items, payments, and inventory snapshots with clear lifecycles.",
        estimatedMinutes: 18,
        difficulty: "intermediate",
        keywords: ["orders", "ecommerce", "line items", "checkout"],
        challengeWeight: 5,
        explanation:
          "Orders split into orders header and order_lines detail. Headers store customer reference, status, currency, and placed_at. Lines store product reference, quantity, unit price snapshot, and tax at time of purchase. Snapshot product names and prices on lines so historical orders stay accurate if catalog prices change. Payments and shipments may be separate entities linked to orders. Carts can be ephemeral tables or session state promoted to orders on checkout. Status transitions belong in lookup tables with documented allowed flows.",
        a11yNotes: [],
        commonMistakes: [
          "Joining live product prices when displaying old orders",
          "Storing order lines without quantity or price snapshot fields",
          "Mixing cart and order rows in one table without a clear status discriminator",
        ],
        bestPractices: [
          "Snapshot commercial terms on order_lines at purchase time",
          "Model payments and refunds as separate linked records",
          "Use status lookup tables and document valid transitions",
        ],
        interviewQuestions: [
          "How do you structure orders and order line items?",
          "Why snapshot product price on order lines?",
          "How are carts related to orders in the schema?",
        ],
        cheatSheet: [
          { tag: "orders", desc: "Header row for a purchase event" },
          { tag: "order_lines", desc: "Line items with quantity and price snapshot" },
          { tag: "1:N", desc: "One order has many order line rows" },
        ],
      }),
      t({
        slug: "modeling-content-cms",
        title: "Modeling Content for a CMS",
        summary:
          "CMS schemas version content, support drafts, and separate authors, media, and published slugs.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["cms", "content", "draft", "publish"],
        challengeWeight: 4,
        explanation:
          "Content models include articles or pages with title, body, slug, and publish state. Separate drafts from published versions using status columns or version tables. Authors link through user foreign keys. Media assets live in an assets table referenced by content rows. Taxonomies use categories and content_categories junction tables. Slugs need unique constraints among published content, sometimes with partial indexes excluding drafts. Scheduled publishing adds publish_at timestamps and background jobs to flip status.",
        a11yNotes: [],
        commonMistakes: [
          "Overwriting published content in place without version history",
          "Storing large binary files inline in content body columns",
          "Allowing slug collisions between draft and published rows unintentionally",
        ],
        bestPractices: [
          "Version content or keep revision rows for rollback",
          "Reference media assets by id instead of embedding URLs that change",
          "Index slug and publish status for public page lookups",
        ],
        interviewQuestions: [
          "How do you model drafts versus published content?",
          "How are categories attached to CMS content?",
          "What indexing supports public slug lookups?",
        ],
        cheatSheet: [
          { tag: "slug", desc: "URL-safe unique identifier for published content" },
          { tag: "draft", desc: "Unpublished content state separate from live pages" },
          { tag: "Junction", desc: "Links content to categories or tags" },
        ],
      }),
    ],
  },
  {
    slug: "docs-and-collaboration",
    title: "Docs and Collaboration",
    description:
      "Communicate models with ER diagrams, consistent naming, and a migration-first mindset.",
    topics: [
      t({
        slug: "er-diagrams",
        title: "ER Diagrams",
        summary:
          "ER diagrams visualize entities, attributes, keys, and relationships for shared understanding.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["ERD", "diagram", "notation", "documentation"],
        challengeWeight: 3,
        explanation:
          "Entity-relationship diagrams show boxes for entities, lines for relationships, and symbols for cardinality. Crow's foot notation marks many sides; circles or bars mark optional versus mandatory participation. Diagrams live in design docs, wiki pages, or tools like dbdiagram.io and draw.io. Keep diagrams updated when migrations land or mark them with dates and schema versions. ERDs help onboarding and catch missing relationships before code review focuses on syntax.",
        a11yNotes: [
          "Provide text descriptions or table lists alongside visual ER diagrams for teammates who cannot rely on graphics alone.",
        ],
        commonMistakes: [
          "Publishing diagrams that no longer match production schema",
          "Crowding diagrams with every column when a logical view should stay high level",
          "Using inconsistent notation within the same document set",
        ],
        bestPractices: [
          "Maintain a logical ERD and link to migration history for physical details",
          "Label relationship verbs on both ends of each line",
          "Review ERD changes in the same pull request as schema migrations when possible",
        ],
        interviewQuestions: [
          "What do ER diagrams communicate?",
          "What is crow's foot notation?",
          "How should teams keep ERDs accurate over time?",
        ],
        cheatSheet: [
          { tag: "ERD", desc: "Entity-relationship diagram of schema structure" },
          { tag: "Crow's foot", desc: "Notation marking many cardinality on ER lines" },
          { tag: "Cardinality", desc: "Count rules shown on relationship connectors" },
        ],
      }),
      t({
        slug: "naming-conventions",
        title: "Naming Conventions",
        summary:
          "Consistent table and column names reduce confusion across SQL, ORMs, and documentation.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["naming", "conventions", "snake_case", "consistency"],
        challengeWeight: 3,
        explanation:
          "Pick one case style and stick to it: snake_case is common in SQL, camelCase in some ORM layers. Table names are usually plural nouns: users, order_lines. Foreign keys mirror table names: user_id references users.id. Boolean columns read as questions: is_active, has_verified_email. Avoid reserved words and ambiguous abbreviations. Prefix junction tables with both entity names or a clear domain prefix. Document conventions in CONTRIBUTING or a data standards page.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing singular and plural table names in the same schema",
          "Using generic names like data, value, or type on many unrelated columns",
          "Renaming columns in production without a coordinated migration and code deploy",
        ],
        bestPractices: [
          "Publish naming rules before the schema grows large",
          "Use _at suffix for timestamps and _id suffix for foreign keys",
          "Run automated linting or migration reviews for naming drift",
        ],
        interviewQuestions: [
          "Why do naming conventions matter in data modeling?",
          "How should foreign key columns be named?",
          "What are common table naming patterns?",
        ],
        cheatSheet: [
          { tag: "snake_case", desc: "Lowercase words separated by underscores in SQL" },
          { tag: "user_id", desc: "Foreign key column referencing users.id" },
          { tag: "Plural table", desc: "Table name representing many rows: orders" },
        ],
      }),
      t({
        slug: "migration-mindset",
        title: "Migration Mindset",
        summary:
          "Treat schema changes as versioned, reversible steps planned with data backfill and rollout safety.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["migration", "evolution", "deploy", "backfill"],
        challengeWeight: 5,
        explanation:
          "Schema evolution uses migration files applied in order across environments. Safe migrations add nullable columns first, backfill data, then enforce NOT NULL and constraints. Breaking changes may require expand-contract patterns: add new column, dual-write, switch reads, remove old column. Model changes should note downtime risk, lock behavior, and rollback steps. Collaborate with application teams on deploy order: migration before code or feature flags when semantics change.",
        a11yNotes: [],
        commonMistakes: [
          "Adding NOT NULL columns without defaults on large live tables in one step",
          "Editing old migration files after they ran in shared environments",
          "Dropping columns before all application instances stop reading them",
        ],
        bestPractices: [
          "Write forward-only migrations and fix mistakes with new migrations",
          "Backfill in batches on large tables to avoid long locks",
          "Document expand-contract phases in pull request descriptions",
        ],
        interviewQuestions: [
          "How do you safely add a required column to a large table?",
          "What is the expand-contract pattern?",
          "Why should applied migrations not be rewritten?",
        ],
        cheatSheet: [
          { tag: "Migration", desc: "Versioned script applying schema change" },
          { tag: "Backfill", desc: "Populate new columns for existing rows" },
          { tag: "Expand-contract", desc: "Phased rollout for breaking schema changes" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description:
      "Practical modeling habits: avoid god tables, choose stable identifiers, and evolve schemas safely.",
    topics: [
      t({
        slug: "avoid-god-tables",
        title: "Avoid God Tables",
        summary:
          "God tables cram unrelated attributes and roles into one wide table that becomes hard to change.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["god table", "wide table", "smell", "decompose"],
        challengeWeight: 4,
        explanation:
          "A god table stores too many concepts in one place: user profile, billing, preferences, and audit fields with dozens of nullable columns. It slows comprehension, encourages inconsistent null usage, and makes migrations risky. Decompose by subdomain: users, user_profiles, billing_accounts. Use vertical partitioning when access patterns split clearly. Not every wide table is wrong, but unexplained null clusters and unrelated lifecycles signal decomposition. Prefer clarity over minimizing join count in transactional cores.",
        a11yNotes: [],
        commonMistakes: [
          "Adding another nullable column whenever a new feature needs storage",
          "Fearing joins more than unmaintainable 80-column tables",
          "Sharing one table between admin-only and public-facing fields without separation",
        ],
        bestPractices: [
          "Split tables when attributes belong to different lifecycles or security zones",
          "Review table width during schema design reviews",
          "Document why related data stays together when you choose not to split",
        ],
        interviewQuestions: [
          "What is a god table?",
          "What problems do wide tables cause?",
          "How do you decide when to split a table?",
        ],
        cheatSheet: [
          { tag: "God table", desc: "Overloaded table mixing many unrelated concerns" },
          { tag: "Decompose", desc: "Split into focused tables by subdomain" },
          { tag: "Vertical split", desc: "Separate rarely used columns into another table" },
        ],
      }),
      t({
        slug: "stable-identifiers",
        title: "Stable Identifiers",
        summary:
          "Public and internal identifiers should stay constant even when display names or natural keys change.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["identifier", "stable", "uuid", "immutable"],
        challengeWeight: 4,
        explanation:
          "Stable identifiers survive email changes, rebrands, and mergers. Surrogate primary keys provide internal stability. External-facing ids may use UUIDs or opaque tokens instead of sequential integers that leak volume. Never reuse identifiers across deleted and new rows if clients cache references. Document which identifiers appear in URLs, webhooks, and integrations. Changing identifiers requires migration plans for downstream consumers.",
        a11yNotes: [],
        commonMistakes: [
          "Using email as the only join key across services",
          "Recycling primary key values after hard deletes",
          "Exposing sequential ids in public APIs without business need",
        ],
        bestPractices: [
          "Treat primary keys as immutable once assigned",
          "Expose stable public ids separate from internal sequential keys when needed",
          "Coordinate identifier changes with integration partners",
        ],
        interviewQuestions: [
          "Why are stable identifiers important?",
          "What makes a good public-facing id?",
          "What goes wrong when identifiers are reused?",
        ],
        cheatSheet: [
          { tag: "Stable id", desc: "Identifier that does not change when labels change" },
          { tag: "UUID", desc: "Opaque globally unique public identifier option" },
          { tag: "Immutable", desc: "Value must not change after creation" },
        ],
      }),
      t({
        slug: "evolve-schemas-safely",
        title: "Evolve Schemas Safely",
        summary:
          "Safe schema evolution combines backward-compatible migrations, feature flags, and clear ownership.",
        estimatedMinutes: 16,
        difficulty: "advanced",
        keywords: ["evolution", "compatibility", "rollback", "ownership"],
        challengeWeight: 5,
        explanation:
          "Production schemas change continuously without downtime. Prefer additive changes: new tables, nullable columns, new indexes built concurrently when supported. Deprecate old paths explicitly before removal. Pair database changes with application deploys and monitoring. Maintain schema ownership in team docs so reviewers know who approves breaking changes. Test migrations against copies with production-like volume. Rollback plans may restore code before schema when backward compatibility was preserved.",
        a11yNotes: [],
        commonMistakes: [
          "Renaming columns in place without a transition period for running code",
          "Shipping destructive migrations on Friday without rollback rehearsal",
          "Letting undocumented schema drift accumulate in staging environments",
        ],
        bestPractices: [
          "Default to backward-compatible migrations unless downtime is scheduled",
          "Automate migration tests in continuous integration",
          "Track deprecated columns until all readers and writers migrate",
        ],
        interviewQuestions: [
          "How do you evolve schemas without downtime?",
          "What is a backward-compatible schema change?",
          "Who should own schema review in a team?",
        ],
        cheatSheet: [
          { tag: "Additive change", desc: "New schema element that old code ignores" },
          { tag: "Deprecate", desc: "Mark old column or table for future removal" },
          { tag: "CI migration test", desc: "Automated check applying migrations on sample DB" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description:
      "Hands-on schema design projects: a blog database and a multi-tenant SaaS model.",
    topics: [
      t({
        slug: "project-blog-schema",
        title: "Project: Blog Schema",
        summary:
          "Design a normalized blog schema with users, posts, comments, tags, and publish states.",
        estimatedMinutes: 45,
        difficulty: "intermediate",
        keywords: ["project", "blog", "schema", "posts"],
        challengeWeight: 5,
        explanation:
          "Build tables for users, posts, comments, tags, and post_tags junction. Posts reference authors through user_id foreign keys. Comments reference posts and optionally parent comments for threading. Tags attach through post_tags with a unique pair constraint. Include status lookup, slug with partial unique index for published posts, and audit columns. Draft posts may omit public slug uniqueness until published. Write migrations, seed sample data, and sketch an ERD before implementing queries for listing posts by tag and author.",
        a11yNotes: [],
        commonMistakes: [
          "Storing comma-separated tags on posts instead of a junction table",
          "Deleting posts without a strategy for orphaned comments",
          "Omitting indexes on foreign keys used in common list queries",
        ],
        bestPractices: [
          "Normalize tags and categories with junction tables",
          "Use soft deletes or restrict deletes when comments must remain for moderation",
          "Document publish workflow states in a lookup table",
        ],
        interviewQuestions: [
          "How would you model posts, comments, and tags?",
          "Where do foreign keys go in a blog comment thread?",
          "How do you enforce unique slugs only for published posts?",
        ],
        cheatSheet: [
          { tag: "post_tags", desc: "Junction table linking posts and tags" },
          { tag: "1:N", desc: "One user authors many posts" },
          { tag: "ERD", desc: "Diagram showing blog entities and relationships" },
        ],
      }),
      t({
        slug: "project-saas-tenancy",
        title: "Project: SaaS Tenancy Schema",
        summary:
          "Model multi-tenant SaaS data with tenant isolation, memberships, and scoped resources.",
        estimatedMinutes: 50,
        difficulty: "advanced",
        keywords: ["project", "saas", "tenant", "multi-tenant"],
        challengeWeight: 5,
        explanation:
          "Create tenants, users, and tenant_memberships junction with roles. Every business table includes tenant_id as part of keys or filters. Choose shared-schema row-level tenancy with tenant_id on each row for this project. Enforce isolation with composite unique constraints scoped by tenant_id and application query guards. Consider partition or index strategies on tenant_id for large datasets. Model invitations, subscription status lookup, and audit columns. Document how you prevent cross-tenant leaks in joins and APIs.",
        a11yNotes: [],
        commonMistakes: [
          "Forgetting tenant_id filters in shared-table queries",
          "Using global unique constraints where uniqueness should be per tenant",
          "Mixing tenants in junction tables without tenant_id on link rows",
        ],
        bestPractices: [
          "Include tenant_id on all tenant-owned tables and index it",
          "Use composite unique keys such as UNIQUE(tenant_id, slug)",
          "Test queries with two tenants to verify isolation in development",
        ],
        interviewQuestions: [
          "How do you model multi-tenant data in a shared database?",
          "Why add tenant_id to junction tables?",
          "What indexing supports tenant-scoped queries?",
        ],
        cheatSheet: [
          { tag: "tenant_id", desc: "Column scoping rows to a SaaS customer" },
          { tag: "RLS", desc: "Row-level security enforcing tenant filters in the database" },
          { tag: "M:N", desc: "Users belong to many tenants via memberships junction" },
        ],
      }),
    ],
  },
];

export function flattenModelingTopics(): ModelingTopicDef[] {
  return MODELING_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
