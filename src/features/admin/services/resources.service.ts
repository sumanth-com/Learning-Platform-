import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentResourceType,
  Database,
  ResourceType,
} from "@/types/database";
import { AdminResourcesRepository } from "@/features/admin/repositories/resources.repository";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminResourcesService {
  private repo: AdminResourcesRepository;

  constructor(client: Client) {
    this.repo = new AdminResourcesRepository(client);
  }

  list(
    query?: AdminListQuery & { scope?: "lesson" | "assignment" | "all" }
  ) {
    return this.repo.listUnified(query);
  }

  getLessonResource(id: string) {
    return this.repo.findLessonResource(id);
  }

  getAssignmentResource(id: string) {
    return this.repo.findAssignmentResource(id);
  }

  createLessonResource(input: {
    lessonId: string;
    title: string;
    type: ResourceType;
    url: string;
  }) {
    return this.repo.createLessonResource({
      lesson_id: input.lessonId,
      title: input.title,
      type: input.type,
      url: input.url,
    });
  }

  updateLessonResource(
    id: string,
    input: { title?: string; type?: ResourceType; url?: string }
  ) {
    return this.repo.updateLessonResource(id, input);
  }

  deleteLessonResource(id: string) {
    return this.repo.deleteLessonResource(id);
  }

  createAssignmentResource(input: {
    assignmentId: string;
    title: string;
    type: AssignmentResourceType;
    url: string;
  }) {
    return this.repo.createAssignmentResource({
      assignment_id: input.assignmentId,
      title: input.title,
      type: input.type,
      url: input.url,
    });
  }

  updateAssignmentResource(
    id: string,
    input: { title?: string; type?: AssignmentResourceType; url?: string }
  ) {
    return this.repo.updateAssignmentResource(id, input);
  }

  deleteAssignmentResource(id: string) {
    return this.repo.deleteAssignmentResource(id);
  }
}
