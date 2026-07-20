import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, LessonDifficulty, LessonRow } from "@/types/database";
import { AdminLessonsRepository } from "@/features/admin/repositories/lessons.repository";
import { slugify } from "@/features/admin/lib/slugify";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminLessonsService {
  private repo: AdminLessonsRepository;

  constructor(client: Client) {
    this.repo = new AdminLessonsRepository(client);
  }

  list(query?: AdminListQuery & { moduleId?: string }) {
    return this.repo.list(query);
  }

  listAll() {
    return this.repo.listAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  async create(input: {
    moduleId: string;
    title: string;
    slug?: string;
    description?: string;
    content?: string;
    durationMinutes?: number;
    difficulty?: LessonDifficulty;
    videoUrl?: string | null;
    isPreview?: boolean;
    learningObjectives?: string[];
  }): Promise<LessonRow> {
    const sortOrder = await this.repo.nextSortOrder(input.moduleId);
    return this.repo.create({
      module_id: input.moduleId,
      title: input.title,
      slug: input.slug?.trim() || slugify(input.title),
      description: input.description ?? "",
      content: input.content ?? "",
      duration_minutes: input.durationMinutes ?? 15,
      difficulty: input.difficulty ?? "beginner",
      video_url: input.videoUrl ?? null,
      is_preview: input.isPreview ?? false,
      learning_objectives: input.learningObjectives ?? [],
      sort_order: sortOrder,
    });
  }

  update(
    id: string,
    input: {
      moduleId?: string;
      title?: string;
      slug?: string;
      description?: string;
      content?: string;
      durationMinutes?: number;
      difficulty?: LessonDifficulty;
      videoUrl?: string | null;
      isPreview?: boolean;
      learningObjectives?: string[];
    }
  ) {
    return this.repo.update(id, {
      ...(input.moduleId !== undefined ? { module_id: input.moduleId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.durationMinutes !== undefined
        ? { duration_minutes: input.durationMinutes }
        : {}),
      ...(input.difficulty !== undefined
        ? { difficulty: input.difficulty }
        : {}),
      ...(input.videoUrl !== undefined ? { video_url: input.videoUrl } : {}),
      ...(input.isPreview !== undefined ? { is_preview: input.isPreview } : {}),
      ...(input.learningObjectives !== undefined
        ? { learning_objectives: input.learningObjectives }
        : {}),
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
