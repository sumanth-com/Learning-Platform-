/** Tiny label helper — keep out of lesson-renderer so hubs don't pull the workspace graph. */
export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    java: "Java",
    oop: "OOP",
    collections: "Collections",
    java8: "Java 8",
    multithreading: "Multithreading",
    dsa: "DSA",
    sql: "SQL",
    "database-design": "Database Design",
    jdbc: "JDBC",
    "spring-boot": "Spring Boot",
    hibernate: "Hibernate/JPA",
    "rest-api": "REST API",
    security: "Security",
    mongodb: "MongoDB",
    git: "Git",
    ai: "AI Skills",
  };
  return labels[category] ?? category;
}
