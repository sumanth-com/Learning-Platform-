import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => !v || /^https?:\/\//i.test(v), "Enter a valid URL")
  .default("");

export const submitJourneyAssignmentSchema = z
  .object({
    catalogId: z.string().trim().min(1),
    assignmentNumber: z.number().int().positive(),
    assignmentTitle: z.string().trim().min(1),
    moduleSlug: z.string().trim().min(1),
    moduleTitle: z.string().trim().min(1),
    githubUrl: optionalUrl,
    liveUrl: optionalUrl,
    screenshots: z.string().trim().max(4000).default(""),
    notes: z.string().trim().max(2000).default(""),
    reflection: z.string().trim().max(2000).default(""),
  })
  .superRefine((value, ctx) => {
    if (!value.githubUrl.trim() && !value.liveUrl.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Add a GitHub repository or live URL.",
        path: ["githubUrl"],
      });
    }
  });

export const reviewJourneySubmissionSchema = z.object({
  submissionId: z.string().uuid(),
  status: z.enum(["under_review", "revision_requested", "approved"]),
  marks: z.number().int().min(0).max(1000).nullable().optional(),
  feedback: z.string().trim().max(5000).nullable().optional(),
});

export type SubmitJourneyAssignmentValues = z.infer<
  typeof submitJourneyAssignmentSchema
>;
