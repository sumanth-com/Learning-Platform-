import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  ModuleInsert,
  ModuleRow,
  ModuleUpdate,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export type ModuleWithPhase = ModuleRow & {
  phases: { title: string; slug: string; course_id: string } | null;
};

export class AdminModulesRepository {
  constructor(private readonly client: Client) {}

  async list(
    query: AdminListQuery & { phaseId?: string } = {}
  ): Promise<PaginatedResult<ModuleWithPhase>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = this.client
      .from("modules")
      .select("*, phases(title, slug, course_id)", { count: "exact" })
      .order("sort_order", { ascending: true });

    if (query.phaseId) q = q.eq("phase_id", query.phaseId);
    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.or(`title.ilike.${term},slug.ilike.${term}`);
    }

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return {
      items: (data ?? []) as ModuleWithPhase[],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    };
  }

  async findById(id: string): Promise<ModuleRow | null> {
    const { data, error } = await this.client
      .from("modules")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as ModuleRow | null;
  }

  async listAll(): Promise<ModuleRow[]> {
    const { data, error } = await this.client
      .from("modules")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ModuleRow[];
  }

  async create(payload: ModuleInsert): Promise<ModuleRow> {
    const { data, error } = await this.client
      .from("modules")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as ModuleRow;
  }

  async update(id: string, payload: ModuleUpdate): Promise<ModuleRow> {
    const { data, error } = await this.client
      .from("modules")
      .update(payload as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as ModuleRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("modules").delete().eq("id", id);
    if (error) throw error;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("modules")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }

  async nextSortOrder(phaseId: string): Promise<number> {
    const { data, error } = await this.client
      .from("modules")
      .select("sort_order")
      .eq("phase_id", phaseId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return ((data as { sort_order?: number } | null)?.sort_order ?? -1) + 1;
  }
}
