export type ApisDifficulty = "beginner" | "intermediate" | "advanced";

export type ApisTopicDef = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  difficulty: ApisDifficulty;
  keywords: string[];
  challengeWeight: number;
  explanation: string;
  a11yNotes: string[];
  commonMistakes: string[];
  bestPractices: string[];
  interviewQuestions: string[];
  /** HTTP APIs and client patterns for the reference panel */
  cheatSheet: Array<{ tag: string; desc: string }>;
};

export type ApisSectionDef = {
  slug: string;
  title: string;
  description: string;
  topics: ApisTopicDef[];
};

function t(partial: ApisTopicDef): ApisTopicDef {
  return partial;
}

export const APIS_ACADEMY_SECTIONS: ApisSectionDef[] = [
  {
    slug: "http-basics",
    title: "HTTP Basics",
    description: "How HTTP works, common methods, status codes, and the structure of requests and responses.",
    topics: [
      t({
        slug: "what-is-http",
        title: "What is HTTP?",
        summary: "HTTP is the request-response protocol browsers and clients use to exchange data with servers.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["http", "protocol", "request", "response"],
        challengeWeight: 4,
        explanation:
          "Hypertext Transfer Protocol (HTTP) defines how clients and servers communicate over the network. A client sends an HTTP request with a method, URL, headers, and optional body. The server returns a response with a status code, headers, and optional body. HTTP is stateless: each request is independent unless you add cookies, tokens, or server-side sessions. Modern web apps use HTTPS, which wraps HTTP in TLS encryption.",
        a11yNotes: [
          "Loading states and error messages for API-driven UI should be announced to screen readers.",
        ],
        commonMistakes: [
          "Confusing HTTP with HTML or assuming HTTP only serves web pages",
          "Treating HTTP as always synchronous when browsers use async APIs",
          "Ignoring HTTPS requirements for production APIs that handle user data",
        ],
        bestPractices: [
          "Use HTTPS for all production API traffic",
          "Understand request and response as separate messages with headers and body",
          "Log request IDs on the server to trace stateless flows",
        ],
        interviewQuestions: [
          "What is HTTP and why is it stateless?",
          "What are the main parts of an HTTP request?",
          "How does HTTPS differ from HTTP?",
        ],
        cheatSheet: [
          { tag: "HTTP", desc: "Request-response application protocol for the web" },
          { tag: "HTTPS", desc: "HTTP encrypted with TLS" },
          { tag: "stateless", desc: "Each request carries its own context" },
        ],
      }),
      t({
        slug: "methods-get-post-put-patch-delete",
        title: "HTTP Methods: GET, POST, PUT, PATCH, DELETE",
        summary: "HTTP methods express intent: read, create, replace, partial update, or delete resources.",
        estimatedMinutes: 16,
        difficulty: "beginner",
        keywords: ["get", "post", "put", "patch", "delete", "methods"],
        challengeWeight: 5,
        explanation:
          "GET retrieves a resource and should not change server state. POST creates a resource or triggers an action. PUT replaces an entire resource at a known URL. PATCH applies a partial update to a resource. DELETE removes a resource. HEAD and OPTIONS are used for metadata and capability discovery. REST APIs map CRUD operations to these methods, but the method alone does not guarantee safe or idempotent behavior; server design must enforce semantics.",
        a11yNotes: [],
        commonMistakes: [
          "Using GET for actions that modify data such as deleting a record",
          "Using POST for every operation instead of choosing the right method",
          "Assuming PUT and PATCH are interchangeable without checking API docs",
        ],
        bestPractices: [
          "Use GET only for safe read operations",
          "Use PATCH for partial updates and PUT for full replacement",
          "Document non-standard method usage when legacy constraints apply",
        ],
        interviewQuestions: [
          "What is the difference between PUT and PATCH?",
          "Which HTTP methods are considered safe or idempotent?",
          "When should you use POST instead of PUT?",
        ],
        cheatSheet: [
          { tag: "GET", desc: "Retrieve a resource without changing server state" },
          { tag: "POST", desc: "Create a resource or submit an action" },
          { tag: "PUT", desc: "Replace a resource at a known URL" },
          { tag: "PATCH", desc: "Apply a partial update to a resource" },
          { tag: "DELETE", desc: "Remove a resource" },
        ],
      }),
      t({
        slug: "status-codes",
        title: "HTTP Status Codes",
        summary: "Status codes tell clients whether a request succeeded, failed, or needs follow-up action.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["status", "codes", "2xx", "4xx", "5xx"],
        challengeWeight: 4,
        explanation:
          "HTTP status codes are three-digit numbers grouped by class. 2xx means success (200 OK, 201 Created, 204 No Content). 3xx means redirection (301 Moved Permanently, 304 Not Modified). 4xx means client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity). 5xx means server error (500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable). APIs should return precise codes so clients can branch on them instead of parsing error message text.",
        a11yNotes: [
          "Surface API errors in UI with clear text, not status codes alone, for assistive technology users.",
        ],
        commonMistakes: [
          "Returning 200 OK with an error object in the body",
          "Using 404 when 403 is correct and leaking resource existence",
          "Returning 500 for validation errors that are client mistakes",
        ],
        bestPractices: [
          "Use 201 Created with a Location header after successful POST",
          "Use 422 or 400 for validation failures with structured error details",
          "Reserve 5xx codes for unexpected server failures",
        ],
        interviewQuestions: [
          "What is the difference between 401 and 403?",
          "When should you return 204 instead of 200?",
          "Why should APIs avoid always returning 200?",
        ],
        cheatSheet: [
          { tag: "200", desc: "OK - request succeeded" },
          { tag: "201", desc: "Created - resource was created" },
          { tag: "404", desc: "Not Found - resource does not exist" },
          { tag: "500", desc: "Internal Server Error - unexpected failure" },
        ],
      }),
      t({
        slug: "headers-and-body",
        title: "Headers and Body",
        summary: "Headers carry metadata; the body carries payloads such as JSON, form data, or files.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["headers", "body", "content-type", "metadata"],
        challengeWeight: 4,
        explanation:
          "HTTP messages split into a start line, headers, and an optional body. Request headers include Accept, Content-Type, Authorization, and User-Agent. Response headers include Content-Type, Cache-Control, Set-Cookie, and ETag. The body holds the payload when present. Content-Type tells the receiver how to parse the body. Content-Length or Transfer-Encoding describes size and framing. Custom headers often use X- prefixes or vendor-specific names, though many teams prefer standard headers when available.",
        a11yNotes: [],
        commonMistakes: [
          "Sending JSON without Content-Type: application/json",
          "Putting sensitive tokens in URLs instead of Authorization headers",
          "Assuming all responses have a body when 204 and 304 do not",
        ],
        bestPractices: [
          "Set Content-Type explicitly on requests with a body",
          "Use Accept to declare preferred response formats",
          "Keep headers small and avoid duplicating data already in the body",
        ],
        interviewQuestions: [
          "What is the role of HTTP headers?",
          "What does Content-Type do?",
          "Which responses typically have no body?",
        ],
        cheatSheet: [
          { tag: "Content-Type", desc: "Media type of the request or response body" },
          { tag: "Accept", desc: "Preferred response media types" },
          { tag: "Authorization", desc: "Credentials or token for authenticated requests" },
        ],
      }),
    ],
  },
  {
    slug: "rest-design",
    title: "REST Design",
    description: "Model resources, design URLs, and apply idempotency and versioning in RESTful APIs.",
    topics: [
      t({
        slug: "rest-resources",
        title: "REST Resources",
        summary: "REST APIs expose resources as nouns identified by URLs rather than action names in paths.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["rest", "resources", "nouns", "crud"],
        challengeWeight: 4,
        explanation:
          "Representational State Transfer (REST) treats server data as resources with stable identities. A resource might be /users/42 or /orders/abc123. Clients use HTTP methods on those URLs to read or change state. Representations are usually JSON but can be XML or other formats negotiated via Accept. Collections use plural nouns: GET /users lists users, POST /users creates one. Sub-resources express relationships: GET /users/42/orders. Good REST design keeps URLs predictable and maps cleanly to domain entities.",
        a11yNotes: [],
        commonMistakes: [
          "Encoding verbs in URLs such as /getUser or /deleteOrder",
          "Exposing internal database IDs without access control checks",
          "Returning different resource shapes from the same endpoint over time without versioning",
        ],
        bestPractices: [
          "Name resources with nouns and plural collection paths",
          "Keep resource representations consistent across endpoints",
          "Use nested paths only when the relationship is strong and clear",
        ],
        interviewQuestions: [
          "What is a resource in REST?",
          "How do HTTP methods relate to CRUD?",
          "Why use plural nouns for collections?",
        ],
        cheatSheet: [
          { tag: "/users", desc: "Collection resource for users" },
          { tag: "/users/{id}", desc: "Single user resource by identifier" },
          { tag: "representation", desc: "Serialized form of a resource such as JSON" },
        ],
      }),
      t({
        slug: "url-design",
        title: "URL Design",
        summary: "Clear URL hierarchies and consistent naming make APIs easier to learn and maintain.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["url", "paths", "naming", "hierarchy"],
        challengeWeight: 3,
        explanation:
          "API URLs should be readable and stable. Use lowercase paths and kebab-case or snake_case consistently. Avoid file extensions in paths unless required. Query strings filter, sort, and paginate collections: /users?role=admin&page=2. Path parameters identify resources: /products/:id. Avoid deep nesting beyond two or three levels; flatten when relationships are optional. Trailing slashes should be handled consistently because some servers treat /users and /users/ differently.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing camelCase and kebab-case in the same API surface",
          "Creating overly deep paths like /a/b/c/d/e/f",
          "Changing URL shapes without a version or migration plan",
        ],
        bestPractices: [
          "Document canonical URL patterns in your API reference",
          "Use query parameters for filtering rather than new path segments",
          "Keep URLs stable and version breaking path changes",
        ],
        interviewQuestions: [
          "How do you design URLs for nested resources?",
          "When should filters be query params vs path segments?",
          "Why does trailing slash consistency matter?",
        ],
        cheatSheet: [
          { tag: "path param", desc: "Variable segment identifying a resource" },
          { tag: "query string", desc: "Optional key-value filters after ?" },
          { tag: "kebab-case", desc: "Lowercase words separated by hyphens in paths" },
        ],
      }),
      t({
        slug: "idempotency",
        title: "Idempotency",
        summary: "Idempotent operations produce the same server state when repeated with the same input.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["idempotent", "retry", "safe", "duplicate"],
        challengeWeight: 4,
        explanation:
          "An HTTP method is idempotent if multiple identical requests have the same effect as one. GET, PUT, and DELETE are idempotent by convention. POST is not idempotent because repeating it may create duplicate resources. Clients retry on network failures; without idempotency, retries can double-charge or duplicate records. Servers implement idempotency keys on POST, deduplicate by request ID, or use natural keys. Understanding idempotency is essential for reliable distributed systems and payment flows.",
        a11yNotes: [],
        commonMistakes: [
          "Retrying POST requests blindly without an idempotency strategy",
          "Assuming PUT is idempotent when side effects break that guarantee",
          "Treating GET as safe for mutations when query params trigger actions",
        ],
        bestPractices: [
          "Design write endpoints to tolerate at-least-once delivery",
          "Document which operations are safe to retry",
          "Use idempotency keys for non-idempotent POST operations",
        ],
        interviewQuestions: [
          "Which HTTP methods are idempotent?",
          "Why does idempotency matter for retries?",
          "How can POST become idempotent?",
        ],
        cheatSheet: [
          { tag: "idempotent", desc: "Repeated identical requests same effect as one" },
          { tag: "safe", desc: "Method should not change server state" },
          { tag: "at-least-once", desc: "Delivery pattern where duplicates may occur" },
        ],
      }),
      t({
        slug: "versioning-apis",
        title: "Versioning APIs",
        summary: "Versioning lets you evolve APIs without breaking existing clients.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["versioning", "breaking", "compatibility", "migration"],
        challengeWeight: 4,
        explanation:
          "APIs change as products grow. Common versioning strategies include URL prefix (/v1/users), header (Accept: application/vnd.company.v2+json), or query parameter. URL versioning is easiest for developers to see and test. Semantic versioning applies to contract changes: additive fields are usually safe; removing or renaming fields is breaking. Deprecate old versions with sunset headers and documentation. Maintain backward compatibility for a defined period and communicate migration timelines clearly.",
        a11yNotes: [],
        commonMistakes: [
          "Breaking clients silently by changing response shapes without a version bump",
          "Maintaining too many active versions indefinitely",
          "Versioning every tiny change instead of using additive evolution",
        ],
        bestPractices: [
          "Prefer additive changes within a major version when possible",
          "Publish deprecation notices and sunset dates",
          "Test client SDKs against all supported versions in CI",
        ],
        interviewQuestions: [
          "What are common API versioning strategies?",
          "What changes are considered breaking?",
          "How do you deprecate an old API version?",
        ],
        cheatSheet: [
          { tag: "/v1", desc: "URL path major version prefix" },
          { tag: "Accept header", desc: "Content negotiation including vendor media types" },
          { tag: "sunset", desc: "Header or doc note for planned version retirement" },
        ],
      }),
    ],
  },
  {
    slug: "request-response",
    title: "Request and Response",
    description: "JSON payloads, parameter styles, content types, and list pagination patterns.",
    topics: [
      t({
        slug: "json-payloads",
        title: "JSON Payloads",
        summary: "JSON is the dominant format for API request and response bodies on the web.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["json", "payload", "serialize", "parse"],
        challengeWeight: 4,
        explanation:
          "JavaScript Object Notation (JSON) encodes objects, arrays, strings, numbers, booleans, and null. APIs serialize domain objects to JSON strings for transmission and parse them on receipt. Use consistent field naming (camelCase or snake_case) across an API. Dates are often ISO 8601 strings. Avoid sending functions, undefined, or circular references. Validate JSON shape on the server before business logic runs. Pretty-print JSON only in development; production responses stay compact.",
        a11yNotes: [],
        commonMistakes: [
          "Mixing camelCase and snake_case field names in the same API",
          "Sending numbers as strings and breaking client type expectations",
          "Omitting null vs missing field semantics without documentation",
        ],
        bestPractices: [
          "Pick one naming convention and enforce it",
          "Use ISO 8601 strings for timestamps",
          "Document required and optional fields in your API schema",
        ],
        interviewQuestions: [
          "Why is JSON common for REST APIs?",
          "How should dates be represented in JSON APIs?",
          "What JSON values are not valid in standard JSON?",
        ],
        cheatSheet: [
          { tag: "JSON.stringify", desc: "Serialize a JavaScript value to JSON text" },
          { tag: "JSON.parse", desc: "Parse JSON text into a JavaScript value" },
          { tag: "application/json", desc: "Media type for JSON bodies" },
        ],
      }),
      t({
        slug: "query-vs-path-params",
        title: "Query vs Path Parameters",
        summary: "Path parameters identify resources; query parameters filter, sort, and configure requests.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["query", "path", "params", "filter"],
        challengeWeight: 3,
        explanation:
          "Path parameters are required segments in the URL template: GET /users/:userId/posts/:postId. They identify which resource to operate on. Query parameters are optional: ?status=active&sort=-createdAt. Use path params for resource identity and query params for search, pagination, and optional modifiers. Arrays may repeat keys (?tag=a&tag=b) or use comma-separated values depending on API convention. Encode special characters with standard URL encoding.",
        a11yNotes: [],
        commonMistakes: [
          "Putting optional filters in the path instead of the query string",
          "Using query params for required resource identity",
          "Forgetting to encode user input in query values",
        ],
        bestPractices: [
          "Keep path templates stable and resource-oriented",
          "Document supported query parameters and defaults",
          "Validate and sanitize all parameter inputs on the server",
        ],
        interviewQuestions: [
          "When should you use path parameters vs query parameters?",
          "How do you pass multiple values for one query key?",
          "Why must query values be URL-encoded?",
        ],
        cheatSheet: [
          { tag: ":id", desc: "Path parameter placeholder in route templates" },
          { tag: "?key=value", desc: "Query parameter syntax" },
          { tag: "encodeURIComponent", desc: "Encode user input for safe query values" },
        ],
      }),
      t({
        slug: "content-types",
        title: "Content Types",
        summary: "Content-Type and Accept headers declare how bodies are formatted and which formats are supported.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["content-type", "accept", "media", "format"],
        challengeWeight: 3,
        explanation:
          "Media types describe payload formats. application/json is standard for APIs. application/x-www-form-urlencoded and multipart/form-data are common for HTML forms and file uploads. text/plain and text/html appear in simpler endpoints. Clients send Content-Type on requests with bodies and Accept to prefer certain response formats. Servers respond with Content-Type on responses. Mismatched Content-Type causes parsers to fail or misinterpret data.",
        a11yNotes: [],
        commonMistakes: [
          "Uploading files as raw JSON instead of multipart/form-data",
          "Omitting charset=utf-8 when non-ASCII text is present",
          "Ignoring Accept and always returning JSON when clients need other formats",
        ],
        bestPractices: [
          "Return 415 Unsupported Media Type for unknown request Content-Type",
          "Document supported media types in API docs",
          "Use multipart only when files or mixed fields are required",
        ],
        interviewQuestions: [
          "What does Content-Type tell the receiver?",
          "When do you use multipart/form-data?",
          "What is content negotiation with Accept?",
        ],
        cheatSheet: [
          { tag: "application/json", desc: "JSON request or response body" },
          { tag: "multipart/form-data", desc: "Form uploads and mixed field payloads" },
          { tag: "415", desc: "Unsupported Media Type status code" },
        ],
      }),
      t({
        slug: "pagination-filtering",
        title: "Pagination and Filtering",
        summary: "List endpoints use pagination and filters so clients can retrieve large datasets efficiently.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["pagination", "filter", "cursor", "offset"],
        challengeWeight: 4,
        explanation:
          "Offset pagination uses page and limit or offset and limit query params. It is simple but can skip or duplicate rows when data changes during paging. Cursor pagination uses an opaque cursor from the previous response and scales better for live feeds. Filtering applies query params such as status=open or createdAfter=2024-01-01. Sorting uses sort=field or sort=-field for descending. Responses often wrap lists with metadata: { data: [], page: 1, total: 100 } or Link headers for next and prev URLs.",
        a11yNotes: [
          "Paginated UI should expose current page and total to assistive tech via live regions or labels.",
        ],
        commonMistakes: [
          "Returning unbounded lists that time out or exhaust memory",
          "Using offset pagination on rapidly changing datasets without documenting caveats",
          "Changing sort defaults without warning and breaking client assumptions",
        ],
        bestPractices: [
          "Set sensible default page sizes with a maximum cap",
          "Include total count or hasMore when it helps clients",
          "Prefer cursor pagination for high-churn feeds",
        ],
        interviewQuestions: [
          "What are trade-offs of offset vs cursor pagination?",
          "How do you design filter query parameters?",
          "What metadata should paginated responses include?",
        ],
        cheatSheet: [
          { tag: "page", desc: "Page number query param for offset pagination" },
          { tag: "cursor", desc: "Opaque token pointing to next result set" },
          { tag: "Link header", desc: "RFC 5988 links for next and prev pages" },
        ],
      }),
    ],
  },
  {
    slug: "clients",
    title: "Clients",
    description: "Call APIs from the browser or Node with fetch, handle errors, timeouts, and retries.",
    topics: [
      t({
        slug: "fetch-basics",
        title: "fetch Basics",
        summary: "The fetch API sends HTTP requests and returns Promises that resolve to Response objects.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["fetch", "promise", "response", "browser"],
        challengeWeight: 4,
        explanation:
          "fetch(url, options) is built into modern browsers and Node (undici). Options include method, headers, body, credentials, and signal for abort. fetch resolves even on HTTP error status codes; you must check response.ok or response.status. Parse bodies with response.json(), response.text(), or response.blob(). POST JSON by setting Content-Type and body: JSON.stringify(data). Always handle network failures in catch blocks because fetch rejects on network errors, not 4xx or 5xx responses.",
        a11yNotes: [
          "Show loading and error states in UI while fetch requests are in flight.",
        ],
        commonMistakes: [
          "Assuming fetch throws on 404 or 500 responses",
          "Forgetting to await response.json() before using data",
          "Sending objects directly as body without JSON.stringify",
        ],
        bestPractices: [
          "Check response.ok before parsing success payloads",
          "Use AbortController to cancel in-flight requests",
          "Centralize fetch wrappers for auth headers and error mapping",
        ],
        interviewQuestions: [
          "Does fetch reject on HTTP 404?",
          "How do you POST JSON with fetch?",
          "How do you cancel a fetch request?",
        ],
        cheatSheet: [
          { tag: "fetch", desc: "Browser and Node API for HTTP requests" },
          { tag: "response.ok", desc: "True when status is 200-299" },
          { tag: "response.json()", desc: "Parse response body as JSON" },
        ],
      }),
      t({
        slug: "axios-or-fetch-patterns",
        title: "axios or fetch Patterns",
        summary: "Teams choose fetch for zero dependencies or axios for interceptors and convenience defaults.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["axios", "fetch", "client", "interceptor"],
        challengeWeight: 4,
        explanation:
          "fetch is native and lightweight. axios is a popular library that throws on status >= 400 by default, transforms JSON automatically, supports request and response interceptors, and can cancel requests. Common patterns include a shared apiClient instance with baseURL, default headers, and auth injection. Interceptors attach tokens, refresh sessions, or normalize errors. Either tool works well when wrapped in a small module that exposes get, post, put, patch, and delete helpers typed for your domain.",
        a11yNotes: [],
        commonMistakes: [
          "Scattering raw fetch calls across components without shared error handling",
          "Adding axios when fetch plus a thin wrapper would suffice",
          "Duplicating base URL and header logic in every request",
        ],
        bestPractices: [
          "Create one API client module per backend service",
          "Use interceptors for auth and global error translation",
          "Type request and response shapes at the client boundary",
        ],
        interviewQuestions: [
          "What advantages does axios offer over fetch?",
          "What is an HTTP interceptor?",
          "Where should API client configuration live in a frontend app?",
        ],
        cheatSheet: [
          { tag: "axios.create", desc: "Factory for configured axios instance" },
          { tag: "interceptors", desc: "Hooks to transform requests and responses globally" },
          { tag: "baseURL", desc: "Shared origin prefix for client requests" },
        ],
      }),
      t({
        slug: "error-handling-http",
        title: "Error Handling for HTTP",
        summary: "Map HTTP failures and network errors into consistent errors your application can handle.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["errors", "handling", "4xx", "5xx"],
        challengeWeight: 5,
        explanation:
          "HTTP client errors fall into network errors (offline, DNS, timeout), HTTP error responses (4xx, 5xx), and parse errors (invalid JSON). Distinguish user-fixable validation errors from auth failures and server outages. Parse error bodies into a stable shape: { code, message, details }. Surface friendly messages in UI while logging technical details server-side. Retry only idempotent requests or those with idempotency keys. Global handlers can redirect to login on 401 and show maintenance UI on 503.",
        a11yNotes: [
          "Announce form and API validation errors with aria-live regions.",
        ],
        commonMistakes: [
          "Showing raw status codes or stack traces to end users",
          "Retrying every failed request including 400 validation errors",
          "Swallowing errors silently without logging or user feedback",
        ],
        bestPractices: [
          "Define a typed ApiError class with status, code, and message",
          "Handle 401 with token refresh or re-login flow",
          "Log correlation IDs from error responses for support",
        ],
        interviewQuestions: [
          "How do network errors differ from HTTP 4xx errors in fetch?",
          "Which status codes should never be retried automatically?",
          "How should APIs structure error response bodies?",
        ],
        cheatSheet: [
          { tag: "ApiError", desc: "Application error type wrapping HTTP failure details" },
          { tag: "401", desc: "Unauthorized - authentication required or failed" },
          { tag: "422", desc: "Validation failed - client should fix input" },
        ],
      }),
      t({
        slug: "timeouts-retries",
        title: "Timeouts and Retries",
        summary: "Timeouts prevent hung requests; retries recover from transient failures with backoff.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["timeout", "retry", "backoff", "abort"],
        challengeWeight: 4,
        explanation:
          "Set timeouts so clients do not wait forever. fetch supports AbortSignal.timeout(ms) or AbortController with setTimeout. Retries help with transient network blips and 502/503 responses. Use exponential backoff with jitter between attempts. Cap max retries and total wait time. Retry GET and idempotent PUT/DELETE; avoid blind POST retries unless idempotency keys protect against duplicates. Circuit breakers stop hammering failing services. Document client timeout expectations to match server gateway limits.",
        a11yNotes: [],
        commonMistakes: [
          "Retrying POST payments without idempotency keys",
          "Using fixed immediate retries that amplify load during outages",
          "Setting timeouts shorter than normal server processing time",
        ],
        bestPractices: [
          "Retry only idempotent operations or keyed writes",
          "Use exponential backoff with jitter",
          "Expose timeout and retry policy in client configuration",
        ],
        interviewQuestions: [
          "How do you implement request timeouts with fetch?",
          "When is retrying an HTTP request safe?",
          "What is exponential backoff with jitter?",
        ],
        cheatSheet: [
          { tag: "AbortSignal.timeout", desc: "Built-in fetch timeout signal" },
          { tag: "exponential backoff", desc: "Increase delay between retry attempts" },
          { tag: "jitter", desc: "Randomize retry delay to spread load" },
        ],
      }),
    ],
  },
  {
    slug: "auth-for-apis",
    title: "Auth for APIs (Intro)",
    description: "Introductory patterns for API keys, bearer tokens, and cross-origin access with CORS.",
    topics: [
      t({
        slug: "api-keys-intro",
        title: "API Keys Introduction",
        summary: "API keys identify the calling application and are simple to use but must be protected.",
        estimatedMinutes: 12,
        difficulty: "beginner",
        keywords: ["api-key", "authentication", "header", "quota"],
        challengeWeight: 3,
        explanation:
          "API keys are opaque strings issued to developers or applications. They often travel in headers such as X-API-Key or query parameters (less secure due to logging). Keys identify the client for rate limiting and billing. They are not a substitute for user authentication when acting on behalf of a person. Never embed secret keys in public frontend code; use them server-side or with restricted public keys. Rotate keys on compromise and scope keys to minimum permissions.",
        a11yNotes: [],
        commonMistakes: [
          "Committing API keys to public Git repositories",
          "Using the same key for development and production",
          "Placing secret keys in browser JavaScript bundles",
        ],
        bestPractices: [
          "Store keys in environment variables on the server",
          "Use separate keys per environment and client",
          "Revoke and rotate keys on suspected leakage",
        ],
        interviewQuestions: [
          "What are API keys used for?",
          "Why should secret keys not live in frontend code?",
          "Where should API keys be sent in HTTP requests?",
        ],
        cheatSheet: [
          { tag: "X-API-Key", desc: "Common header name for API key credentials" },
          { tag: "rotate", desc: "Replace a compromised or expired key" },
          { tag: "rate limit", desc: "Cap requests per key or account" },
        ],
      }),
      t({
        slug: "bearer-tokens-intro",
        title: "Bearer Tokens Introduction",
        summary: "Bearer tokens are presented in the Authorization header to access protected resources.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["bearer", "token", "jwt", "authorization"],
        challengeWeight: 4,
        explanation:
          "The Authorization header carries credentials. Bearer token format is Authorization: Bearer <token>. Tokens often come from OAuth 2.0 or OpenID Connect flows. JSON Web Tokens (JWT) are a common bearer token format containing signed claims. The server validates the token signature and expiry on each request. Short-lived access tokens plus refresh tokens reduce exposure. Treat bearer tokens like passwords in transit: HTTPS only, no logging, and secure storage on clients.",
        a11yNotes: [],
        commonMistakes: [
          "Storing access tokens in localStorage without understanding XSS risk",
          "Sending tokens in URL query strings where they appear in logs",
          "Trusting JWT payload claims without verifying the signature",
        ],
        bestPractices: [
          "Use HTTPS for all token transmission",
          "Prefer httpOnly cookies for browser sessions when appropriate",
          "Validate token expiry and issuer on every protected route",
        ],
        interviewQuestions: [
          "What does Authorization: Bearer mean?",
          "What is a JWT and what parts does it contain?",
          "Why use short-lived access tokens?",
        ],
        cheatSheet: [
          { tag: "Authorization", desc: "Header carrying bearer or other auth schemes" },
          { tag: "Bearer", desc: "Token scheme where possession grants access" },
          { tag: "JWT", desc: "Signed JSON token with claims and expiry" },
        ],
      }),
      t({
        slug: "cors-basics",
        title: "CORS Basics",
        summary: "Cross-Origin Resource Sharing controls which web origins may call your API from a browser.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["cors", "origin", "preflight", "browser"],
        challengeWeight: 5,
        explanation:
          "Browsers enforce the same-origin policy. When JavaScript on https://app.example.com calls https://api.example.com, the request is cross-origin. The server must respond with Access-Control-Allow-Origin and related headers. Preflight OPTIONS requests happen before non-simple methods or custom headers. CORS is a browser security feature, not protection against non-browser clients. Misconfigured CORS causes confusing browser errors while curl works fine. Allow specific origins instead of * when credentials are used.",
        a11yNotes: [],
        commonMistakes: [
          "Setting Access-Control-Allow-Origin: * while also sending credentials",
          "Forgetting to handle OPTIONS preflight on the server",
          "Assuming CORS blocks server-side or mobile clients",
        ],
        bestPractices: [
          "Whitelist trusted origins explicitly in production",
          "Respond correctly to OPTIONS preflight requests",
          "Keep CORS configuration close to API gateway or framework middleware",
        ],
        interviewQuestions: [
          "What problem does CORS solve?",
          "When does the browser send a preflight request?",
          "Why does curl succeed when the browser blocks a request?",
        ],
        cheatSheet: [
          { tag: "CORS", desc: "Browser rules for cross-origin HTTP requests" },
          { tag: "Access-Control-Allow-Origin", desc: "Permitted requesting origin" },
          { tag: "OPTIONS", desc: "Preflight method checking allowed cross-origin request" },
        ],
      }),
    ],
  },
  {
    slug: "service-design",
    title: "Service Design",
    description: "Sync vs async patterns, webhooks, rate limits, and idempotency keys in service APIs.",
    topics: [
      t({
        slug: "sync-vs-async",
        title: "Sync vs Async",
        summary: "Synchronous APIs return results immediately; asynchronous APIs accept work and finish later.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["sync", "async", "polling", "job"],
        challengeWeight: 4,
        explanation:
          "Synchronous endpoints process the request and return the final result in one response. They suit fast operations under a few seconds. Asynchronous patterns return 202 Accepted with a job ID when work takes longer. Clients poll GET /jobs/:id or receive a webhook when complete. Long-running exports, video processing, and payment settlement often use async APIs. Choose async when latency is unpredictable or work exceeds gateway timeouts. Document status transitions: queued, running, succeeded, failed.",
        a11yNotes: [
          "Long-running async UI should report progress and completion to assistive technology.",
        ],
        commonMistakes: [
          "Blocking HTTP requests for minutes until slow work finishes",
          "Returning 200 before work actually completed",
          "Omitting a stable job status endpoint for async operations",
        ],
        bestPractices: [
          "Use 202 Accepted with a status URL for long tasks",
          "Set client timeouts below expected sync processing limits",
          "Expose estimated completion or progress when available",
        ],
        interviewQuestions: [
          "When should an API be asynchronous?",
          "What status code indicates accepted but incomplete work?",
          "How do clients learn async job results?",
        ],
        cheatSheet: [
          { tag: "202 Accepted", desc: "Request accepted for async processing" },
          { tag: "job ID", desc: "Identifier to poll or correlate async work" },
          { tag: "polling", desc: "Repeated status checks until job completes" },
        ],
      }),
      t({
        slug: "webhooks-intro",
        title: "Webhooks Introduction",
        summary: "Webhooks push event notifications to your server when something happens in another system.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["webhook", "callback", "events", "push"],
        challengeWeight: 4,
        explanation:
          "Instead of polling, a provider POSTs to your registered URL when an event occurs: payment succeeded, deploy finished, or message received. Your endpoint must respond quickly with 2xx and process the payload asynchronously if needed. Verify webhook signatures with a shared secret to prevent spoofing. Handle duplicate deliveries idempotently using event IDs. Retry policies on the sender side mean your handler may see the same event more than once.",
        a11yNotes: [],
        commonMistakes: [
          "Doing heavy work synchronously before returning 200 to the webhook caller",
          "Skipping signature verification on incoming webhooks",
          "Assuming webhooks deliver exactly once",
        ],
        bestPractices: [
          "Verify HMAC or provider-specific signatures on every delivery",
          "Acknowledge fast and queue processing internally",
          "Store processed event IDs to deduplicate retries",
        ],
        interviewQuestions: [
          "How do webhooks differ from polling?",
          "Why must webhook handlers respond quickly?",
          "How do you secure webhook endpoints?",
        ],
        cheatSheet: [
          { tag: "webhook", desc: "HTTP callback delivering event payloads" },
          { tag: "HMAC signature", desc: "Verify webhook payload authenticity" },
          { tag: "event ID", desc: "Unique id for idempotent webhook processing" },
        ],
      }),
      t({
        slug: "rate-limiting-intro",
        title: "Rate Limiting Introduction",
        summary: "Rate limits protect APIs from abuse and ensure fair usage across clients.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["rate-limit", "throttle", "quota", "429"],
        challengeWeight: 3,
        explanation:
          "Rate limiting caps requests per time window per API key, IP, or user. Exceeding limits returns 429 Too Many Requests. Response headers often include Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, and X-RateLimit-Reset. Clients should back off and respect Retry-After. Token bucket and sliding window are common algorithms. Public APIs document limits clearly. Internal services also rate limit to prevent cascade failures.",
        a11yNotes: [],
        commonMistakes: [
          "Hammering the API after receiving 429 without backoff",
          "Ignoring rate limit headers when implementing client retries",
          "Setting limits so low that legitimate traffic fails",
        ],
        bestPractices: [
          "Document limits and header semantics in API docs",
          "Implement exponential backoff on 429 in clients",
          "Return consistent 429 bodies explaining the limit",
        ],
        interviewQuestions: [
          "What HTTP status indicates rate limiting?",
          "What is the Retry-After header?",
          "Why do APIs rate limit clients?",
        ],
        cheatSheet: [
          { tag: "429", desc: "Too Many Requests - rate limit exceeded" },
          { tag: "Retry-After", desc: "Seconds or date to wait before retrying" },
          { tag: "X-RateLimit-Remaining", desc: "Requests left in current window" },
        ],
      }),
      t({
        slug: "idempotency-keys",
        title: "Idempotency Keys",
        summary: "Clients send idempotency keys so repeated POST requests do not create duplicate side effects.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["idempotency-key", "duplicate", "post", "payments"],
        challengeWeight: 5,
        explanation:
          "Idempotency keys are unique client-generated values sent in a header such as Idempotency-Key on POST. The server stores the key with the first successful result. Duplicate requests with the same key return the original response instead of creating a second resource. This pattern is common in payment and order APIs. Keys should be UUIDs or similarly unique strings. Servers expire old keys after a TTL. Combine with proper HTTP status codes so clients know whether to retry.",
        a11yNotes: [],
        commonMistakes: [
          "Reusing the same idempotency key for different operations",
          "Generating a new key on every retry instead of reusing one per logical attempt",
          "Storing idempotency records forever without expiration",
        ],
        bestPractices: [
          "Generate one idempotency key per user action and reuse on retries",
          "Return the stored response for duplicate keys within the TTL",
          "Document header name and key format requirements",
        ],
        interviewQuestions: [
          "What problem do idempotency keys solve?",
          "Should retries reuse or regenerate the idempotency key?",
          "Which HTTP methods benefit most from idempotency keys?",
        ],
        cheatSheet: [
          { tag: "Idempotency-Key", desc: "Header value deduplicating POST requests" },
          { tag: "UUID", desc: "Common format for unique idempotency keys" },
          { tag: "dedupe", desc: "Return original result for duplicate key" },
        ],
      }),
    ],
  },
  {
    slug: "contracts-and-docs",
    title: "Contracts and Docs",
    description: "OpenAPI specifications, consistent error shapes, and request validation at the boundary.",
    topics: [
      t({
        slug: "openapi-basics",
        title: "OpenAPI Basics",
        summary: "OpenAPI describes HTTP APIs in a machine-readable YAML or JSON specification.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["openapi", "swagger", "spec", "schema"],
        challengeWeight: 4,
        explanation:
          "OpenAPI (formerly Swagger) documents paths, methods, parameters, request bodies, responses, and security schemes. Tools generate interactive docs, client SDKs, and mock servers from the spec. A spec might define GET /users with query params, 200 response schema, and 401 error schema. Keep the spec close to the implementation or generate it from code annotations. Version 3.x is standard today. Contract-first teams design the spec before coding; code-first teams export specs from frameworks.",
        a11yNotes: [],
        commonMistakes: [
          "Letting the live API drift from the published OpenAPI document",
          "Omitting error response schemas from the spec",
          "Hand-maintaining huge specs without automation",
        ],
        bestPractices: [
          "Treat the OpenAPI spec as the public contract",
          "Validate requests and responses against schemas in tests",
          "Publish docs from the same spec source as codegen",
        ],
        interviewQuestions: [
          "What is OpenAPI used for?",
          "What is the difference between contract-first and code-first?",
          "What tools consume OpenAPI specifications?",
        ],
        cheatSheet: [
          { tag: "OpenAPI", desc: "Standard format for describing HTTP APIs" },
          { tag: "paths", desc: "Spec section listing routes and operations" },
          { tag: "components.schemas", desc: "Reusable model definitions in the spec" },
        ],
      }),
      t({
        slug: "status-error-shapes",
        title: "Status and Error Shapes",
        summary: "Consistent error JSON helps clients and humans understand failures without parsing free text.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["errors", "shape", "code", "details"],
        challengeWeight: 4,
        explanation:
          "Standard error bodies include a machine-readable code, human message, and optional details array for field errors. Example: { error: { code: \"VALIDATION_FAILED\", message: \"Invalid input\", details: [{ field: \"email\", message: \"Invalid format\" }] } }. Align HTTP status with error category. RFC 7807 Problem Details (application/problem+json) is a formal standard for HTTP API errors. Avoid exposing internal stack traces or SQL in production responses.",
        a11yNotes: [
          "Map field-level API errors to form inputs with aria-describedby.",
        ],
        commonMistakes: [
          "Returning different error JSON shapes from different endpoints",
          "Leaking stack traces or database errors to clients",
          "Using only a generic message string with no error code",
        ],
        bestPractices: [
          "Define one error envelope for the entire API",
          "Include field paths in validation detail objects",
          "Log internal error IDs separately from public messages",
        ],
        interviewQuestions: [
          "What fields should a good API error body include?",
          "What is RFC 7807 Problem Details?",
          "Why use stable error codes instead of messages alone?",
        ],
        cheatSheet: [
          { tag: "problem+json", desc: "RFC 7807 standard error media type" },
          { tag: "error.code", desc: "Stable machine-readable error identifier" },
          { tag: "details[]", desc: "Array of field-level validation errors" },
        ],
      }),
      t({
        slug: "validating-requests",
        title: "Validating Requests",
        summary: "Validate incoming data at the API boundary before business logic runs.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["validation", "schema", "zod", "middleware"],
        challengeWeight: 4,
        explanation:
          "Request validation checks path params, query strings, headers, and bodies against schemas. Libraries such as Zod, Joi, or JSON Schema integrate with Express, Fastify, and other frameworks. Reject invalid input early with 400 or 422 and structured errors. Validation prevents injection, type confusion, and impossible states reaching the database. Share schemas between server validation and client forms when possible. Do not trust client-side validation alone.",
        a11yNotes: [],
        commonMistakes: [
          "Skipping query and path validation and only checking JSON bodies",
          "Coercing invalid types silently instead of rejecting them",
          "Duplicating validation rules in many handlers without shared schemas",
        ],
        bestPractices: [
          "Validate all inputs at the edge of the application",
          "Return field-specific errors for form-like payloads",
          "Keep validation schemas as the single source of truth",
        ],
        interviewQuestions: [
          "Why validate at the API boundary?",
          "What status code fits schema validation failures?",
          "How can client and server share validation rules?",
        ],
        cheatSheet: [
          { tag: "Zod", desc: "TypeScript-first schema validation library" },
          { tag: "422", desc: "Unprocessable Entity for semantic validation errors" },
          { tag: "middleware", desc: "Shared layer validating before route handlers" },
        ],
      }),
    ],
  },
  {
    slug: "testing-apis",
    title: "Testing APIs",
    description: "Manual testing with curl or Postman, contract tests, and mocking dependencies.",
    topics: [
      t({
        slug: "postman-or-curl-basics",
        title: "Postman or curl Basics",
        summary: "curl and Postman let you send HTTP requests manually to explore and debug APIs.",
        estimatedMinutes: 14,
        difficulty: "beginner",
        keywords: ["curl", "postman", "manual", "debug"],
        challengeWeight: 3,
        explanation:
          "curl is a command-line tool for HTTP: curl -X GET https://api.example.com/users -H \"Authorization: Bearer TOKEN\". Postman provides a GUI for collections, environments, and saved requests. Both support headers, bodies, and auth helpers. Use them to reproduce bugs, test new endpoints before client integration, and share example requests with teammates. Export Postman collections or document curl examples in README files. Manual tests complement automated tests but do not replace them.",
        a11yNotes: [],
        commonMistakes: [
          "Testing only in Postman and never verifying browser CORS behavior",
          "Forgetting -H \"Content-Type: application/json\" on curl POST bodies",
          "Sharing collections with live production secrets embedded",
        ],
        bestPractices: [
          "Use environment variables for tokens in Postman",
          "Keep curl examples in API documentation up to date",
          "Verify critical flows with both CLI and automated tests",
        ],
        interviewQuestions: [
          "How do you send a JSON POST with curl?",
          "What advantages does Postman offer over curl?",
          "Why keep example requests in documentation?",
        ],
        cheatSheet: [
          { tag: "curl -X POST", desc: "Send POST request from the command line" },
          { tag: "Postman collection", desc: "Grouped saved API requests with variables" },
          { tag: "-H", desc: "curl flag to set a request header" },
        ],
      }),
      t({
        slug: "contract-tests-intro",
        title: "Contract Tests Introduction",
        summary: "Contract tests verify that API providers and consumers agree on request and response shapes.",
        estimatedMinutes: 16,
        difficulty: "intermediate",
        keywords: ["contract", "tests", "pact", "schema"],
        challengeWeight: 4,
        explanation:
          "Contract testing checks that an API meets the expectations of its clients without full end-to-end tests. Consumer-driven contracts record expected interactions; providers verify they still satisfy those contracts. OpenAPI can drive schema validation tests that every response matches the documented model. Contract tests catch breaking changes in CI before deployment. They complement unit tests and a smaller set of integration tests across real services.",
        a11yNotes: [],
        commonMistakes: [
          "Relying only on E2E tests that are slow and flaky",
          "Updating the API without updating contract specs",
          "Testing happy paths only and missing error contract coverage",
        ],
        bestPractices: [
          "Run contract validation in CI on every pull request",
          "Version contracts when making intentional breaking changes",
          "Combine OpenAPI schema tests with consumer-driven contracts for critical flows",
        ],
        interviewQuestions: [
          "What is contract testing?",
          "How does OpenAPI support automated contract checks?",
          "How is contract testing different from E2E testing?",
        ],
        cheatSheet: [
          { tag: "contract test", desc: "Verify API matches agreed request/response shape" },
          { tag: "Pact", desc: "Popular consumer-driven contract testing tool" },
          { tag: "schema assert", desc: "Validate response against OpenAPI model" },
        ],
      }),
      t({
        slug: "mocking-services",
        title: "Mocking Services",
        summary: "Mocks simulate external APIs so you can develop and test without live dependencies.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["mock", "stub", "msw", "fake"],
        challengeWeight: 4,
        explanation:
          "Service mocks return canned responses for defined routes. Tools include Mock Service Worker (MSW) in frontend tests, WireMock or Prism for OpenAPI-based mocks, and simple Express stub servers. Mocks enable parallel development when backend teams lag frontend work. Keep mock responses aligned with the real API contract. Switch between mock and real base URLs via environment config. Over-mocking hides integration issues, so run some tests against real or staging APIs.",
        a11yNotes: [],
        commonMistakes: [
          "Mocks that diverge from production response shapes",
          "Mocking so much that integration bugs appear only in production",
          "Hardcoding mock data inside every component instead of a shared layer",
        ],
        bestPractices: [
          "Generate mocks from OpenAPI when possible",
          "Centralize mock handlers in one test setup module",
          "Run smoke tests against staging before release",
        ],
        interviewQuestions: [
          "Why mock external APIs during development?",
          "What is MSW and where is it used?",
          "How do you prevent mocks from drifting from reality?",
        ],
        cheatSheet: [
          { tag: "MSW", desc: "Mock Service Worker intercepts HTTP in tests" },
          { tag: "stub server", desc: "Local server returning fake API responses" },
          { tag: "Prism", desc: "Mock server generated from OpenAPI spec" },
        ],
      }),
    ],
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    description: "RESTful habits, secure HTTP defaults, and basic observability for production APIs.",
    topics: [
      t({
        slug: "restful-habits",
        title: "RESTful Habits",
        summary: "Consistent REST conventions make APIs predictable for consumers and easier to evolve.",
        estimatedMinutes: 12,
        difficulty: "intermediate",
        keywords: ["rest", "conventions", "predictable", "design"],
        challengeWeight: 3,
        explanation:
          "RESTful habits include noun-based URLs, correct HTTP verbs, meaningful status codes, and consistent JSON field naming. Use hypermedia or clear link objects when helpful. Avoid chatty APIs that require many round trips for one user action when a tailored endpoint is justified and documented. Prefer standard patterns over bespoke RPC names unless constraints require otherwise. Good APIs read like a coherent product surface, not a dump of internal database procedures.",
        a11yNotes: [],
        commonMistakes: [
          "Inconsistent pluralization and naming across resources",
          "Overusing POST for reads because GET caching seems inconvenient",
          "Exposing leaky internal implementation details in public JSON",
        ],
        bestPractices: [
          "Publish a style guide for URL, field, and error conventions",
          "Design collections and items with symmetric patterns",
          "Review new endpoints for REST consistency in code review",
        ],
        interviewQuestions: [
          "What makes an API RESTful in practice?",
          "When is a non-REST RPC endpoint acceptable?",
          "How do naming conventions affect API usability?",
        ],
        cheatSheet: [
          { tag: "style guide", desc: "Documented rules for API naming and behavior" },
          { tag: "nouns", desc: "Resource names in URLs, not verbs" },
          { tag: "consistent", desc: "Same patterns for all resources in an API" },
        ],
      }),
      t({
        slug: "secure-defaults-http",
        title: "Secure Defaults for HTTP",
        summary: "HTTPS, minimal exposure, and careful auth protect APIs and their users.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["security", "https", "auth", "headers"],
        challengeWeight: 4,
        explanation:
          "Secure HTTP defaults start with TLS everywhere, HSTS on public domains, and rejecting plain HTTP in production. Authenticate and authorize every protected route. Validate and sanitize all inputs. Set security headers on responses where applicable. Rate limit and monitor abuse. Never log passwords, tokens, or full payment data. Use least-privilege scopes on API keys and tokens. Keep dependencies patched. Security is not only CORS and auth; it includes safe error messages and audit logging for sensitive actions.",
        a11yNotes: [],
        commonMistakes: [
          "Terminating TLS only at the client and sending HTTP internally without protection",
          "Logging Authorization headers in access logs",
          "Returning detailed internal errors to unauthenticated callers",
        ],
        bestPractices: [
          "Enforce HTTPS redirects and HSTS for public APIs",
          "Redact secrets from logs and error reports",
          "Apply authorization checks close to data access layers",
        ],
        interviewQuestions: [
          "What are baseline security requirements for public APIs?",
          "Why should tokens not appear in logs?",
          "How does least privilege apply to API keys?",
        ],
        cheatSheet: [
          { tag: "TLS", desc: "Encrypt HTTP traffic in transit" },
          { tag: "HSTS", desc: "Tell browsers to use HTTPS only" },
          { tag: "least privilege", desc: "Grant minimum permissions required" },
        ],
      }),
      t({
        slug: "observability-basics",
        title: "Observability Basics",
        summary: "Logs, metrics, and tracing help you understand API health and debug failures in production.",
        estimatedMinutes: 14,
        difficulty: "intermediate",
        keywords: ["observability", "logging", "metrics", "tracing"],
        challengeWeight: 4,
        explanation:
          "Observability means understanding system behavior from external outputs. Structured logs include request ID, method, path, status, duration, and user or tenant ID where safe. Metrics track request rate, error rate, and latency percentiles. Distributed tracing follows a request across services with trace and span IDs propagated in headers. Health endpoints (/health, /ready) support load balancers. Alert on SLO breaches such as elevated 5xx rate or p99 latency. Good observability shortens incident response and supports capacity planning.",
        a11yNotes: [],
        commonMistakes: [
          "Logging unstructured printf strings that are hard to query",
          "Missing correlation IDs across microservice calls",
          "Alerting on every 404 instead of actionable error spikes",
        ],
        bestPractices: [
          "Use structured JSON logs in production",
          "Propagate X-Request-ID or trace context headers",
          "Define RED metrics: rate, errors, duration per endpoint",
        ],
        interviewQuestions: [
          "What are logs, metrics, and traces?",
          "Why propagate request IDs across services?",
          "What should a health check endpoint return?",
        ],
        cheatSheet: [
          { tag: "X-Request-ID", desc: "Correlation id tracing a single request" },
          { tag: "/health", desc: "Liveness endpoint for load balancers" },
          { tag: "p99 latency", desc: "99th percentile response time metric" },
        ],
      }),
    ],
  },
  {
    slug: "mini-projects",
    title: "Mini Projects",
    description: "Apply API concepts by building a small todo REST API and a weather client.",
    topics: [
      t({
        slug: "project-todo-api",
        title: "Project: Todo API",
        summary: "Build a REST API for todos with CRUD routes, JSON bodies, validation, and consistent errors.",
        estimatedMinutes: 50,
        difficulty: "intermediate",
        keywords: ["project", "todo", "rest", "crud"],
        challengeWeight: 5,
        explanation:
          "Create resources /todos with GET (list), POST (create), GET /todos/:id (read), PATCH /todos/:id (update), and DELETE /todos/:id (remove). Store todos in memory or a simple database. Each todo has id, title, completed, and createdAt. Return 201 with Location on create, 404 when missing, and 422 for invalid title. Use JSON throughout with application/json. Add optional query filter ?completed=true. This project reinforces HTTP methods, status codes, URL design, validation, and error shapes in one cohesive service.",
        a11yNotes: [],
        commonMistakes: [
          "Using GET to delete todos via query params",
          "Returning 200 with null instead of 404 for missing ids",
          "Accepting any JSON shape without validating required fields",
        ],
        bestPractices: [
          "Use UUID or auto-increment ids consistently",
          "Return uniform error JSON for validation failures",
          "Document endpoints with curl examples or OpenAPI",
        ],
        interviewQuestions: [
          "How would you design CRUD routes for a todo resource?",
          "Which status codes belong on create, update, and delete?",
          "How do you validate a todo title on POST?",
        ],
        cheatSheet: [
          { tag: "GET /todos", desc: "List todo resources" },
          { tag: "POST /todos", desc: "Create a new todo item" },
          { tag: "PATCH /todos/:id", desc: "Partially update one todo" },
        ],
      }),
      t({
        slug: "project-weather-client",
        title: "Project: Weather Client",
        summary: "Build a frontend client that fetches weather data from a public API and handles loading and errors.",
        estimatedMinutes: 45,
        difficulty: "intermediate",
        keywords: ["project", "weather", "client", "fetch"],
        challengeWeight: 5,
        explanation:
          "Consume a public weather API with fetch or axios. Accept a city query, call the API with an API key from environment variables (server proxy or secure config), and display temperature, conditions, and icon. Handle loading, empty search, 404 city not found, network errors, and rate limits. Parse JSON into typed interfaces. Optional: debounce search input and cache recent results. This project practices fetch, query parameters, error handling, API keys, and user-facing states for real HTTP integration.",
        a11yNotes: [
          "Announce loading and error states for weather results with aria-live.",
          "Provide text labels for weather icons, not icons alone.",
        ],
        commonMistakes: [
          "Embedding secret API keys directly in client-side bundle code",
          "Not handling fetch network failures separately from 404 responses",
          "Showing raw JSON error blobs to users",
        ],
        bestPractices: [
          "Proxy third-party API calls through your backend when keys must stay secret",
          "Type the weather response interface explicitly",
          "Map API errors to friendly user messages",
        ],
        interviewQuestions: [
          "How do you safely use API keys in a frontend weather app?",
          "How does fetch behavior differ for network vs 404 errors?",
          "What UI states should an API-driven widget handle?",
        ],
        cheatSheet: [
          { tag: "fetch(url)", desc: "Request weather data from remote API" },
          { tag: "?q=city", desc: "Query param passing city name to API" },
          { tag: "loading state", desc: "UI flag while awaiting HTTP response" },
        ],
      }),
    ],
  },
];

export function flattenApisTopics(): ApisTopicDef[] {
  return APIS_ACADEMY_SECTIONS.flatMap((section) => section.topics);
}
