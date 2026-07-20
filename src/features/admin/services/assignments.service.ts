import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentDifficulty,
  AssignmentRow,
  Database,
} from "@/types/database";
import { AdminAssignmentsRepository } from "@/features/admin/repositories/assignments.repository";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminAssignmentsService {
  private repo: AdminAssignmentsRepository;

  constructor(client: Client) {
    this.repo = new AdminAssignmentsRepository(client);
  }

  list(query?: AdminListQuery & { lessonId?: string }) {
    return this.repo.list(query);
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  create(input: {
    lessonId: string;
    title: string;
    description?: string;
    instructions?: string;
    difficulty?: AssignmentDifficulty;
    estimatedTime?: string;
    totalMarks?: number;
    dueDays?: number;
    isPublished?: boolean;
  }): Promise<AssignmentRow> {
    return this.repo.create({
      lesson_id: input.lessonId,
      title: input.title,
      description: input.description ?? "",
      instructions: input.instructions ?? "",
      difficulty: input.difficulty ?? "beginner",
      estimated_time: input.estimatedTime ?? "",
      total_marks: input.totalMarks ?? 100,
      due_days: input.dueDays ?? 7,
      is_published: input.isPublished ?? false,
    });
  }

  update(
    id: string,
    input: {
      lessonId?: string;
      title?: string;
      description?: string;
      instructions?: string;
      difficulty?: AssignmentDifficulty;
      estimatedTime?: string;
      totalMarks?: number;
      dueDays?: number;
      isPublished?: boolean;
    }
  ) {
    return this.repo.update(id, {
      ...(input.lessonId !== undefined ? { lesson_id: input.lessonId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.instructions !== undefined
        ? { instructions: input.instructions }
        : {}),
      ...(input.difficulty !== undefined
        ? { difficulty: input.difficulty }
        : {}),
      ...(input.estimatedTime !== undefined
        ? { estimated_time: input.estimatedTime }
        : {}),
      ...(input.totalMarks !== undefined
        ? { total_marks: input.totalMarks }
        : {}),
      ...(input.dueDays !== undefined ? { due_days: input.dueDays } : {}),
      ...(input.isPublished !== undefined
        ? { is_published: input.isPublished }
        : {}),
    });
  }

  setPublished(id: string, isPublished: boolean) {
    return this.repo.update(id, { is_published: isPublished });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
