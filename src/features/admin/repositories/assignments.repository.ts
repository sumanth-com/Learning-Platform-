import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentInsert,
  AssignmentRow,
  AssignmentUpdate,
  Database,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type AssignmentWithLesson = AssignmentRow & {
  lessons: { title: string; slug: string } | null;
};

export class AdminAssignmentsRepository {
  constructor(private readonly client: Client) {}

  async list(
    query: AdminListQuery & { lessonId?: string } = {}
  ): Promise<PaginatedResult<AssignmentWithLesson>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = this.client
      .from("assignments")
      .select("*, lessons(title, slug)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (query.lessonId) q = q.eq("lesson_id", query.lessonId);
    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.ilike("title", term);
    }
    if (query.filter === "published") q = q.eq("is_published", true);
    if (query.filter === "draft") q = q.eq("is_published", false);

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return {
      items: (data ?? []) as AssignmentWithLesson[],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async findById(id: string): Promise<AssignmentRow | null> {
    const { data, error } = await this.client
      .from("assignments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as AssignmentRow | null;
  }

  async create(payload: AssignmentInsert): Promise<AssignmentRow> {
    const { data, error } = await this.client
      .from("assignments")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AssignmentRow;
  }

  async update(id: string, payload: AssignmentUpdate): Promise<AssignmentRow> {
    const { data, error } = await this.client
      .from("assignments")
      .update({ ...payload, updated_at: new Date().toISOString() } as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as AssignmentRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from("assignments")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("assignments")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }
}
