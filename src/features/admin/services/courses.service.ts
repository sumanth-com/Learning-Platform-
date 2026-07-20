import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CourseDifficulty,
  CourseRow,
  Database,
} from "@/types/database";
import { AdminCoursesRepository } from "@/features/admin/repositories/courses.repository";
import { slugify } from "@/features/admin/lib/slugify";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminCoursesService {
  private repo: AdminCoursesRepository;

  constructor(client: Client) {
    this.repo = new AdminCoursesRepository(client);
  }

  list(query?: AdminListQuery) {
    return this.repo.list(query);
  }

  listAll() {
    return this.repo.listAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  create(input: {
    title: string;
    slug?: string;
    description?: string;
    thumbnail?: string | null;
    difficulty?: CourseDifficulty;
    estimatedDuration?: string;
    isPublished?: boolean;
  }): Promise<CourseRow> {
    return this.repo.create({
      title: input.title,
      slug: input.slug?.trim() || slugify(input.title),
      description: input.description ?? "",
      thumbnail: input.thumbnail ?? null,
      difficulty: input.difficulty ?? "beginner",
      estimated_duration: input.estimatedDuration ?? "",
      is_published: input.isPublished ?? false,
    });
  }

  update(
    id: string,
    input: {
      title?: string;
      slug?: string;
      description?: string;
      thumbnail?: string | null;
      difficulty?: CourseDifficulty;
      estimatedDuration?: string;
      isPublished?: boolean;
    }
  ) {
    return this.repo.update(id, {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.thumbnail !== undefined ? { thumbnail: input.thumbnail } : {}),
      ...(input.difficulty !== undefined
        ? { difficulty: input.difficulty }
        : {}),
      ...(input.estimatedDuration !== undefined
        ? { estimated_duration: input.estimatedDuration }
        : {}),
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
