import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { AssignmentsRepository } from "@/features/assignments/repositories/assignments.repository";
import { AssignmentResourcesRepository } from "@/features/assignments/repositories/resources.repository";
import { SubmissionsRepository } from "@/features/assignments/repositories/submissions.repository";
import {
  computeDeadline,
  type AssignmentDetail,
  type AssignmentSummary,
  type CreateAssignmentInput,
  type UpdateAssignmentInput,
} from "@/features/assignments/types";

type Client = SupabaseClient<Database>;

export class AssignmentService {
  private readonly client: Client;
  private readonly assignments: AssignmentsRepository;
  private readonly resources: AssignmentResourcesRepository;
  private readonly submissions: SubmissionsRepository;

  constructor(client: Client) {
    this.client = client;
    this.assignments = new AssignmentsRepository(client);
    this.resources = new AssignmentResourcesRepository(client);
    this.submissions = new SubmissionsRepository(client);
  }

  async create(input: CreateAssignmentInput) {
    return this.assignments.create({
      lesson_id: input.lessonId,
      title: input.title,
      description: input.description,
      instructions: input.instructions,
      difficulty: input.difficulty,
      estimated_time: input.estimatedTime,
      total_marks: input.totalMarks,
      due_days: input.dueDays,
      is_published: input.isPublished ?? false,
    });
  }

  async update(id: string, input: UpdateAssignmentInput) {
    return this.assignments.update(id, {
      title: input.title,
      description: input.description,
      instructions: input.instructions,
      difficulty: input.difficulty,
      estimated_time: input.estimatedTime,
      total_marks: input.totalMarks,
      due_days: input.dueDays,
      is_published: input.isPublished,
    });
  }

  async delete(id: string) {
    return this.assignments.delete(id);
  }

  async publish(id: string) {
    return this.assignments.setPublished(id, true);
  }

  async unpublish(id: string) {
    return this.assignments.setPublished(id, false);
  }

  async listForLesson(
    lessonId: string,
    profileId: string,
    options?: { includeUnpublished?: boolean }
  ): Promise<AssignmentSummary[]> {
    const rows = await this.assignments.listByLessonId(lessonId, {
      publishedOnly: !options?.includeUnpublished,
    });

    const summaries: AssignmentSummary[] = [];
    for (const row of rows) {
      const submission = await this.submissions.findByAssignmentAndProfile(
        row.id,
        profileId
      );
      summaries.push({
        id: row.id,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty,
        estimatedTime: row.estimated_time,
        totalMarks: row.total_marks,
        dueDays: row.due_days,
        isPublished: row.is_published,
        submissionStatus: submission?.status ?? null,
      });
    }
    return summaries;
  }

  async getDetail(
    assignmentId: string,
    profileId: string,
    options?: { isMentor?: boolean }
  ): Promise<AssignmentDetail | null> {
    const assignment = await this.assignments.findById(assignmentId);
    if (!assignment) return null;
    if (!assignment.is_published && !options?.isMentor) return null;

    const resources = await this.resources.listByAssignmentId(assignmentId);
    const submission = await this.submissions.findByAssignmentAndProfile(
      assignmentId,
      profileId
    );
    const submissions = options?.isMentor
      ? await this.submissions.listByAssignmentId(assignmentId)
      : [];

    const { data: lesson, error } = await this.client
      .from("lessons")
      .select("id, title, slug")
      .eq("id", assignment.lesson_id)
      .maybeSingle();

    if (error) throw error;
    if (!lesson) return null;

    return {
      assignment,
      resources,
      lesson: lesson as { id: string; title: string; slug: string },
      deadline: computeDeadline(assignment.created_at, assignment.due_days),
      submission,
      submissions,
    };
  }
}
