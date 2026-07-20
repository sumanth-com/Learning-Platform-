import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AssignmentResourceInsert,
  AssignmentResourceRow,
  AssignmentResourceUpdate,
  Database,
  LessonResourceInsert,
  LessonResourceRow,
  LessonResourceUpdate,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type UnifiedResource = {
  id: string;
  scope: "lesson" | "assignment";
  parentId: string;
  parentTitle: string;
  title: string;
  type: string;
  url: string;
  created_at: string;
};

export class AdminResourcesRepository {
  constructor(private readonly client: Client) {}

  async listUnified(
    query: AdminListQuery & { scope?: "lesson" | "assignment" | "all" } = {}
  ): Promise<PaginatedResult<UnifiedResource>> {
    const scope = query.scope ?? "all";
    const items: UnifiedResource[] = [];

    if (scope === "all" || scope === "lesson") {
      const { data, error } = await this.client
        .from("lesson_resources")
        .select("*, lessons(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      for (const row of (data ?? []) as Array<
        LessonResourceRow & { lessons: { title: string } | null }
      >) {
        items.push({
          id: row.id,
          scope: "lesson",
          parentId: row.lesson_id,
          parentTitle: row.lessons?.title ?? "Lesson",
          title: row.title,
          type: row.type,
          url: row.url,
          created_at: row.created_at,
        });
      }
    }

    if (scope === "all" || scope === "assignment") {
      const { data, error } = await this.client
        .from("assignment_resources")
        .select("*, assignments(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      for (const row of (data ?? []) as Array<
        AssignmentResourceRow & { assignments: { title: string } | null }
      >) {
        items.push({
          id: row.id,
          scope: "assignment",
          parentId: row.assignment_id,
          parentTitle: row.assignments?.title ?? "Assignment",
          title: row.title,
          type: row.type,
          url: row.url,
          created_at: row.created_at,
        });
      }
    }

    let filtered = items;
    if (query.q?.trim()) {
      const term = query.q.trim().toLowerCase();
      filtered = items.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          r.parentTitle.toLowerCase().includes(term) ||
          r.type.toLowerCase().includes(term)
      );
    }
    if (query.filter && query.filter !== "all") {
      filtered = filtered.filter((r) => r.type === query.filter);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const slice = filtered.slice(from, from + pageSize);

    return {
      items: slice,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    };
  }

  async findLessonResource(id: string): Promise<LessonResourceRow | null> {
    const { data, error } = await this.client
      .from("lesson_resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as LessonResourceRow | null;
  }

  async findAssignmentResource(
    id: string
  ): Promise<AssignmentResourceRow | null> {
    const { data, error } = await this.client
      .from("assignment_resources")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as AssignmentResourceRow | null;
  }

  async createLessonResource(
    payload: LessonResourceInsert
  ): Promise<LessonResourceRow> {
    const { data, error } = await this.client
      .from("lesson_resources")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as LessonResourceRow;
  }

  async updateLessonResource(
    id: string,
    payload: LessonResourceUpdate
  ): Promise<LessonResourceRow> {
    const { data, error } = await this.client
      .from("lesson_resources")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as LessonResourceRow;
  }

  async deleteLessonResource(id: string): Promise<void> {
    const { error } = await this.client
      .from("lesson_resources")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }

  async createAssignmentResource(
    payload: AssignmentResourceInsert
  ): Promise<AssignmentResourceRow> {
    const { data, error } = await this.client
      .from("assignment_resources")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as AssignmentResourceRow;
  }

  async updateAssignmentResource(
    id: string,
    payload: AssignmentResourceUpdate
  ): Promise<AssignmentResourceRow> {
    const { data, error } = await this.client
      .from("assignment_resources")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as AssignmentResourceRow;
  }

  async deleteAssignmentResource(id: string): Promise<void> {
    const { error } = await this.client
      .from("assignment_resources")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
}
