import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SubmissionStatus } from "@/types/database";
import { SubmissionsRepository } from "@/features/assignments/repositories/submissions.repository";
import { AssignmentsRepository } from "@/features/assignments/repositories/assignments.repository";
import {
  canStudentEditSubmission,
  type ReviewSubmissionInput,
  type SubmitAssignmentInput,
} from "@/features/assignments/types";

type Client = SupabaseClient<Database>;

export class SubmissionService {
  private readonly submissions: SubmissionsRepository;
  private readonly assignments: AssignmentsRepository;

  constructor(client: Client) {
    this.submissions = new SubmissionsRepository(client);
    this.assignments = new AssignmentsRepository(client);
  }

  async submit(
    assignmentId: string,
    profileId: string,
    input: SubmitAssignmentInput
  ) {
    const assignment = await this.assignments.findById(assignmentId);
    if (!assignment || !assignment.is_published) {
      throw new Error("Assignment is not available.");
    }

    const existing = await this.submissions.findByAssignmentAndProfile(
      assignmentId,
      profileId
    );

    if (existing && !canStudentEditSubmission(existing.status)) {
      throw new Error(
        "This submission is locked while under review or after approval."
      );
    }

    const status: SubmissionStatus =
      existing?.status === "revision_requested" ? "submitted" : "submitted";

    return this.submissions.upsert({
      assignment_id: assignmentId,
      profile_id: profileId,
      github_url: input.githubUrl,
      demo_url: input.demoUrl?.trim() ? input.demoUrl.trim() : null,
      notes: input.notes?.trim() ?? "",
      status,
      submitted_at: new Date().toISOString(),
      // Preserve prior review fields when resubmitting after revision
      marks: existing?.status === "revision_requested" ? null : existing?.marks,
      feedback:
        existing?.status === "revision_requested" ? null : existing?.feedback,
      reviewed_at:
        existing?.status === "revision_requested"
          ? null
          : existing?.reviewed_at,
    });
  }

  async review(input: ReviewSubmissionInput, totalMarks: number) {
    const submission = await this.submissions.findById(input.submissionId);
    if (!submission) {
      throw new Error("Submission not found.");
    }

    if (
      input.marks != null &&
      (input.marks < 0 || input.marks > totalMarks)
    ) {
      throw new Error(`Marks must be between 0 and ${totalMarks}.`);
    }

    return this.submissions.update(input.submissionId, {
      status: input.status,
      marks: input.marks ?? submission.marks,
      feedback: input.feedback ?? submission.feedback,
      reviewed_at: new Date().toISOString(),
    });
  }

  async listForAssignment(assignmentId: string) {
    return this.submissions.listByAssignmentId(assignmentId);
  }
}
