export type AssignmentDifficulty = "beginner" | "intermediate" | "advanced";

export type AssignmentType =
  | "HTML Build"
  | "CSS Styling"
  | "JavaScript Logic"
  | "Git Practice"
  | "Terminal Commands"
  | "Backend APIs"
  | "Database Design"
  | "Debugging"
  | "System Design"
  | "UI Clone"
  | "Mini Projects"
  | "Capstone Projects"
  | "Problem Solving"
  | "Developer Mindset";

export type AssignmentCardStatus =
  | "locked"
  | "available"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "reviewed"
  | "completed";

export type AssignmentSubmissionStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "pending_review"
  | "revision_requested"
  | "reviewed"
  | "approved"
  | "completed";

export type AssignmentStarterFile = {
  filename: string;
  language: string;
  code: string;
};

export type AssignmentRequirementSection = {
  title: string;
  items: string[];
  note?: string;
};

export type AssignmentEvalCriterion = {
  criteria: string;
  marks: number;
};

/** Company / academy style take-home brief */
export type AssignmentTeachContent = {
  objective: string;
  instructions: string;
  notes: string[];
  projectStructure: {
    folderName: string;
    files: string[];
  };
  requirementSections: AssignmentRequirementSection[];
  submissionRequirements: string[];
  evaluationCriteria: AssignmentEvalCriterion[];
  submissionChecklist: string[];
};

export type ModuleAssignmentDef = {
  id: string;
  number: number;
  slug: string;
  title: string;
  description: string;
  difficulty: AssignmentDifficulty;
  type: AssignmentType;
  estimatedTime: string;
  skills: string[];
  xp: number;
  teach: AssignmentTeachContent;
  starterFiles: AssignmentStarterFile[];
};

export type RoadmapModuleAssignments = {
  moduleNumber: number;
  slug: string;
  title: string;
  displayTitle: string;
  assignments: ModuleAssignmentDef[];
};

export type AssignmentListingItem = ModuleAssignmentDef & {
  moduleNumber: number;
  moduleSlug: string;
  moduleTitle: string;
  displayModuleTitle: string;
  href: string;
};
