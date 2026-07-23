import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  JourneyAssignmentSubmissionRow,
  SubmissionStatus,
} from "@/types/database";
import { JourneySubmissionsRepository } from "@/features/assignments/repositories/journey-submissions.repository";
import { canStudentEditSubmission } from "@/features/assignments/types";
import type { SubmitJourneyAssignmentValues } from "@/features/assignments/schemas/journey-assignment-schemas";

type Client = SupabaseClient<Database>;

export class JourneySubmissionService {
  private readonly submissions: JourneySubmissionsRepository;

  constructor(client: Client) {
    this.submissions = new JourneySubmissionsRepository(client);
  }

  async submit(
    profileId: string,
    student: { name: string; email: string },
    input: SubmitJourneyAssignmentValues
  ): Promise<JourneyAssignmentSubmissionRow> {
    const existing = await this.submissions.findByCatalogAndProfile(
      input.catalogId,
      profileId
    );

    if (existing && !canStudentEditSubmission(existing.status)) {
      throw new Error(
        "This submission is locked while under review or after approval."
      );
    }

    const now = new Date().toISOString();
    const resubmit = existing?.status === "revision_requested";

    return this.submissions.upsert({
      catalog_id: input.catalogId,
      assignment_number: input.assignmentNumber,
      assignment_title: input.assignmentTitle,
      module_slug: input.moduleSlug,
      module_title: input.moduleTitle,
      profile_id: profileId,
      student_name: student.name,
      student_email: student.email,
      github_url: input.githubUrl?.trim() ?? "",
      live_url: input.liveUrl?.trim() ?? "",
      screenshots: input.screenshots?.trim() ?? "",
      notes: input.notes?.trim() ?? "",
      reflection: input.reflection?.trim() ?? "",
      status: "submitted",
      submitted_at: now,
      marks: resubmit ? null : existing?.marks ?? null,
      feedback: resubmit ? null : existing?.feedback ?? null,
      reviewed_at: resubmit ? null : existing?.reviewed_at ?? null,
    });
  }

  async review(input: {
    submissionId: string;
    status: Extract<
      SubmissionStatus,
      "under_review" | "revision_requested" | "approved"
    >;
    marks?: number | null;
    feedback?: string | null;
  }): Promise<JourneyAssignmentSubmissionRow> {
    const submission = await this.submissions.findById(input.submissionId);
    if (!submission) {
      throw new Error("Submission not found.");
    }

    if (input.marks != null && (input.marks < 0 || input.marks > 1000)) {
      throw new Error("Marks must be between 0 and 1000.");
    }

    return this.submissions.update(input.submissionId, {
      status: input.status,
      marks: input.marks ?? submission.marks,
      feedback: input.feedback ?? submission.feedback,
      reviewed_at: new Date().toISOString(),
    });
  }

  async listForAdmin(options?: { status?: string; q?: string }) {
    return this.submissions.listForAdmin(options);
  }

  async findMine(catalogId: string, profileId: string) {
    return this.submissions.findByCatalogAndProfile(catalogId, profileId);
  }

  async findById(id: string) {
    return this.submissions.findById(id);
  }
}
