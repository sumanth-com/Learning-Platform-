import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PhaseRow } from "@/types/database";
import { AdminPhasesRepository } from "@/features/admin/repositories/phases.repository";
import { slugify } from "@/features/admin/lib/slugify";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminPhasesService {
  private repo: AdminPhasesRepository;

  constructor(client: Client) {
    this.repo = new AdminPhasesRepository(client);
  }

  list(query?: AdminListQuery & { courseId?: string }) {
    return this.repo.list(query);
  }

  listAll() {
    return this.repo.listAll();
  }

  listByCourseId(courseId: string) {
    return this.repo.listByCourseId(courseId);
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  async create(input: {
    courseId: string;
    title: string;
    slug?: string;
    description?: string;
  }): Promise<PhaseRow> {
    const sortOrder = await this.repo.nextSortOrder(input.courseId);
    return this.repo.create({
      course_id: input.courseId,
      title: input.title,
      slug: input.slug?.trim() || slugify(input.title),
      description: input.description ?? "",
      sort_order: sortOrder,
    });
  }

  update(
    id: string,
    input: {
      courseId?: string;
      title?: string;
      slug?: string;
      description?: string;
      sortOrder?: number;
    }
  ) {
    return this.repo.update(id, {
      ...(input.courseId !== undefined ? { course_id: input.courseId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
    });
  }

  reorder(orderedIds: string[]) {
    return this.repo.reorder(orderedIds);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
