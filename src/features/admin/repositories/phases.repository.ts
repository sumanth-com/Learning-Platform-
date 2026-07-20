import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  PhaseInsert,
  PhaseRow,
  PhaseUpdate,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type PhaseWithCourse = PhaseRow & {
  courses: { title: string; slug: string } | null;
};

export class AdminPhasesRepository {
  constructor(private readonly client: Client) {}

  async list(
    query: AdminListQuery & { courseId?: string } = {}
  ): Promise<PaginatedResult<PhaseWithCourse>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 50));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = this.client
      .from("phases")
      .select("*, courses(title, slug)", { count: "exact" })
      .order("sort_order", { ascending: true });

    if (query.courseId) q = q.eq("course_id", query.courseId);
    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.or(`title.ilike.${term},slug.ilike.${term}`);
    }

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return {
      items: (data ?? []) as PhaseWithCourse[],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async findById(id: string): Promise<PhaseRow | null> {
    const { data, error } = await this.client
      .from("phases")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as PhaseRow | null;
  }

  async listByCourseId(courseId: string): Promise<PhaseRow[]> {
    const { data, error } = await this.client
      .from("phases")
      .select("*")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PhaseRow[];
  }

  async listAll(): Promise<PhaseRow[]> {
    const { data, error } = await this.client
      .from("phases")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as PhaseRow[];
  }

  async create(payload: PhaseInsert): Promise<PhaseRow> {
    const { data, error } = await this.client
      .from("phases")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as PhaseRow;
  }

  async update(id: string, payload: PhaseUpdate): Promise<PhaseRow> {
    const { data, error } = await this.client
      .from("phases")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as PhaseRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("phases").delete().eq("id", id);
    if (error) throw error;
  }

  async reorder(orderedIds: string[]): Promise<void> {
    await Promise.all(
      orderedIds.map((id, index) =>
        this.client
          .from("phases")
          .update({ sort_order: index } as never)
          .eq("id", id)
      )
    );
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("phases")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async nextSortOrder(courseId: string): Promise<number> {
    const { data, error } = await this.client
      .from("phases")
      .select("sort_order")
      .eq("course_id", courseId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return ((data as { sort_order?: number } | null)?.sort_order ?? -1) + 1;
  }
}
