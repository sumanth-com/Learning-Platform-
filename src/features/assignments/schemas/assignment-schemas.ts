import { z } from "zod";

export const createAssignmentSchema = z.object({
  lessonId: z.string().uuid(),
  title: z.string().trim().min(3, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  instructions: z.string().trim().min(1, "Instructions are required"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedTime: z.string().trim().min(1, "Estimated time is required"),
  totalMarks: z.number().int().positive().max(1000),
  dueDays: z.number().int().positive().max(365),
  isPublished: z.boolean().optional(),
});

export const updateAssignmentSchema = createAssignmentSchema
  .omit({ lessonId: true })
  .partial();

export const submitAssignmentSchema = z.object({
  githubUrl: z
    .string()
    .trim()
    .url("Enter a valid GitHub URL")
    .refine(
      (url) => /github\.com/i.test(url),
      "URL must be a GitHub repository link"
    ),
  demoUrl: z
    .string()
    .trim()
    .url("Enter a valid demo URL")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(2000).optional(),
});

export const reviewSubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["under_review", "revision_requested", "approved"]),
  marks: z.number().int().min(0).max(1000).nullable().optional(),
  feedback: z.string().trim().max(5000).nullable().optional(),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;
export type SubmitAssignmentFormValues = z.infer<typeof submitAssignmentSchema>;
export type ReviewSubmissionFormValues = z.infer<typeof reviewSubmissionSchema>;
