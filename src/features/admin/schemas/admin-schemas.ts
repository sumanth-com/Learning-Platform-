import { z } from "zod";

const difficulty = z.enum(["beginner", "intermediate", "advanced"]);

export const courseFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional().nullable(),
  difficulty,
  estimatedDuration: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const phaseFormSchema = z.object({
  courseId: z.string().uuid("Select a course"),
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const reorderPhasesSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
});

export const moduleFormSchema = z.object({
  phaseId: z.string().uuid("Select a phase"),
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().min(1),
  color: z.string().min(1),
  estimatedDuration: z.string().optional(),
});

export const lessonFormSchema = z.object({
  moduleId: z.string().uuid("Select a module"),
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  durationMinutes: z.coerce.number().int().positive(),
  difficulty,
  videoUrl: z.string().optional().nullable(),
  isPreview: z.boolean().optional(),
  learningObjectives: z.array(z.string()).optional(),
});

export const assignmentFormSchema = z.object({
  lessonId: z.string().uuid("Select a lesson"),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  instructions: z.string().optional(),
  difficulty,
  estimatedTime: z.string().optional(),
  totalMarks: z.coerce.number().int().positive(),
  dueDays: z.coerce.number().int().positive(),
  isPublished: z.boolean().optional(),
});

export const resourceFormSchema = z.object({
  scope: z.enum(["lesson", "assignment"]),
  parentId: z.string().uuid("Select a parent"),
  title: z.string().min(2, "Title is required"),
  type: z.string().min(1),
  url: z.string().url("Enter a valid URL"),
});

export type CourseFormInput = z.infer<typeof courseFormSchema>;
export type PhaseFormInput = z.infer<typeof phaseFormSchema>;
export type ModuleFormInput = z.infer<typeof moduleFormSchema>;
export type LessonFormInput = z.infer<typeof lessonFormSchema>;
export type AssignmentFormInput = z.infer<typeof assignmentFormSchema>;
export type ResourceFormInput = z.infer<typeof resourceFormSchema>;
