/** Category-specific lesson builders — never reuse Java templates for SQL/Spring/etc. */

export const DIFFICULTIES = ["easy", "medium", "hard"];

/** Pass through LeetCode-style rich fields from problem definitions */
export function richFields(p) {
  return {
    problemType: p.problemType,
    estimatedMinutes: p.estimatedMinutes,
    hints: p.hints,
    executionTrace: p.executionTrace,
    patternPreview: p.patternPreview,
    problemStatement: p.problemStatement,
    companyTags: p.companyTags,
    constraints: p.constraints,
    exampleInput: p.exampleInput,
    exampleOutput: p.exampleOutput,
    stepByStepExplanation: p.stepByStepExplanation ?? p.explanation,
    approaches: p.approaches,
    dryRun: p.dryRun,
    visualization: p.visualization,
    alternativeSolutions: p.alternativeSolutions,
    followUpQuestions: p.followUpQuestions,
    practiceVariations: p.practiceVariations,
  };
}

export function javaLesson(base, extra) {
  return { ...base, ...extra, editorLanguage: "java" };
}

export function sqlLesson(base, extra) {
  return { ...base, ...extra, category: "sql", editorLanguage: "sql" };
}

export function buildJavaLessons(weekId, topicSlug, topicTitle, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "java",
          description: p.description,
        },
        {
          explanation: p.explanation,
          syntax: p.syntax,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          memoryDiagram: p.memoryDiagram,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          hiddenSolution: p.hiddenSolution,
          ...richFields(p),
        }
      )
    )
  );
}

export function buildOopLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "oop",
          description: p.description,
        },
        {
          explanation: p.explanation,
          syntax: p.syntax,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          memoryDiagram: p.memoryDiagram,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          hiddenSolution: p.hiddenSolution,
          ...richFields(p),
        }
      )
    )
  );
}

export function buildCollectionsLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "collections",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          hiddenSolution: p.hiddenSolution,
          ...richFields(p),
        }
      )
    )
  );
}

export function buildDsaLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "dsa",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          hiddenSolution: p.hiddenSolution,
          ...richFields(p),
        }
      )
    )
  );
}

export function buildSqlLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      sqlLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          description: p.description,
        },
        {
          schema: p.schema,
          sampleData: p.sampleData,
          query: p.query,
          expectedResult: p.expectedResult,
          executionExplanation: p.executionExplanation,
          optimizationTip: p.optimizationTip,
          alternativeQuery: p.alternativeQuery,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          ...richFields(p),
        }
      )
    )
  );
}

export function buildJdbcLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "jdbc",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          ...richFields(p),
        }
      )
    )
  );
}

export function buildRestLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "rest-api",
      description: p.description,
      endpoint: p.endpoint,
      method: p.method,
      headers: p.headers,
      requestBody: p.requestBody,
      responseBody: p.responseBody,
      statusCode: p.statusCode,
      postmanExample: p.postmanExample,
      curlExample: p.curlExample,
      apiDiagram: p.apiDiagram,
      commonMistakes: p.commonMistakes ?? [],
      interviewTips: p.interviewTips ?? [],
      editorLanguage: "json",
      ...richFields(p),
    }))
  );
}

export function buildSecurityLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "security",
      description: p.description,
      authFlow: p.authFlow,
      jwtDiagram: p.jwtDiagram,
      requestFlow: p.requestFlow,
      tokenExample: p.tokenExample,
      headers: p.headers,
      roles: p.roles,
      permissions: p.permissions,
      exampleApi: p.exampleApi,
      code: p.code,
      filename: p.filename,
      commonMistakes: p.commonMistakes ?? [],
      editorLanguage: p.editorLanguage ?? "json",
      interviewTips: p.interviewTips ?? [],
      ...richFields(p),
    }))
  );
}

export function buildMongoLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "mongodb",
      description: p.description,
      document: p.document,
      collection: p.collection,
      query: p.query,
      aggregation: p.aggregation,
      expectedOutput: p.expectedOutput,
      sqlComparison: p.sqlComparison,
      commonMistakes: p.commonMistakes ?? [],
      editorLanguage: "json",
      interviewTips: p.interviewTips ?? [],
      ...richFields(p),
    }))
  );
}

export function buildDbDesignLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "database-design",
      description: p.description,
      erDiagram: p.erDiagram,
      tables: p.tables,
      relationships: p.relationships,
      normalization: p.normalization,
      indexes: p.indexes,
      realWorldExample: p.realWorldExample,
      commonMistakes: p.commonMistakes ?? [],
      editorLanguage: "text",
      interviewTips: p.interviewTips ?? [],
      ...richFields(p),
    }))
  );
}

export function buildGitLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "git",
      description: p.description,
      command: p.command,
      terminalOutput: p.terminalOutput,
      workflowDiagram: p.workflowDiagram,
      explanation: p.explanation,
      commonMistakes: p.commonMistakes ?? [],
      editorLanguage: "bash",
      interviewTips: p.interviewTips ?? [],
      ...richFields(p),
    }))
  );
}

export function buildAiLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) => ({
      id: `${topicSlug}-${difficulty}-${i + 1}`,
      topicSlug,
      weekId,
      title: p.title,
      difficulty,
      category: "ai",
      description: p.description,
      concept: p.concept,
      prompt: p.prompt,
      goodPrompt: p.goodPrompt,
      badPrompt: p.badPrompt,
      aiOutput: p.aiOutput,
      whyAiResponded: p.whyAiResponded,
      exercise: p.exercise,
      editorLanguage: "prompt",
      interviewTips: p.interviewTips ?? [],
      ...richFields(p),
    }))
  );
}

export function buildSpringLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "spring-boot",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          ...richFields(p),
        }
      )
    )
  );
}

export function buildHibernateLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "hibernate",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          ...richFields(p),
        }
      )
    )
  );
}

export function buildMultithreadingLessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "multithreading",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          ...richFields(p),
        }
      )
    )
  );
}

export function buildJava8Lessons(weekId, topicSlug, problems) {
  return DIFFICULTIES.flatMap((difficulty) =>
    problems[difficulty].map((p, i) =>
      javaLesson(
        {
          id: p.id ?? `${topicSlug}-${difficulty}-${p.problemType ?? "logic"}-${i + 1}`,
          topicSlug,
          weekId,
          title: p.title,
          difficulty,
          category: "java8",
          description: p.description,
        },
        {
          explanation: p.explanation,
          code: p.code,
          filename: p.filename,
          expectedOutput: p.expectedOutput,
          commonMistakes: p.commonMistakes ?? [],
          interviewTips: p.interviewTips ?? [],
          practiceQuestions: p.practiceQuestions ?? [],
          ...richFields(p),
        }
      )
    )
  );
}
