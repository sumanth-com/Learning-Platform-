import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  LessonInsert,
  LessonRow,
  LessonUpdate,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type LessonWithModule = LessonRow & {
  modules: { title: string; slug: string; phase_id: string } | null;
};

export class AdminLessonsRepository {
  constructor(private readonly client: Client) {}

  async list(
    query: AdminListQuery & { moduleId?: string } = {}
  ): Promise<PaginatedResult<LessonWithModule>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const sort =
      query.sort === "title"
        ? "title"
        : query.sort === "difficulty"
          ? "difficulty"
          : "sort_order";
    const ascending = query.order !== "desc";

    let q = this.client
      .from("lessons")
      .select("*, modules(title, slug, phase_id)", { count: "exact" })
      .order(sort, { ascending });

    if (query.moduleId) q = q.eq("module_id", query.moduleId);
    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.or(`title.ilike.${term},slug.ilike.${term}`);
    }
    if (query.filter === "preview") q = q.eq("is_preview", true);

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return {
      items: (data ?? []) as LessonWithModule[],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async findById(id: string): Promise<LessonRow | null> {
    const { data, error } = await this.client
      .from("lessons")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as LessonRow | null;
  }

  async listAll(): Promise<LessonRow[]> {
    const { data, error } = await this.client
      .from("lessons")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []) as LessonRow[];
  }

  async create(payload: LessonInsert): Promise<LessonRow> {
    const { data, error } = await this.client
      .from("lessons")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as LessonRow;
  }

  async update(id: string, payload: LessonUpdate): Promise<LessonRow> {
    const { data, error } = await this.client
      .from("lessons")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as LessonRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("lessons").delete().eq("id", id);
    if (error) throw error;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("lessons")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async nextSortOrder(moduleId: string): Promise<number> {
    const { data, error } = await this.client
      .from("lessons")
      .select("sort_order")
      .eq("module_id", moduleId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return ((data as { sort_order?: number } | null)?.sort_order ?? -1) + 1;
  }
}
