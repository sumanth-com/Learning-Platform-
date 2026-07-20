import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ModuleRow } from "@/types/database";

type Client = SupabaseClient<Database>;

export class ModulesRepository {
  constructor(private readonly client: Client) {}

  async listByPhaseIds(phaseIds: string[]): Promise<ModuleRow[]> {
    if (phaseIds.length === 0) return [];

    const { data, error } = await this.client
      .from("modules")
      .select("*")
      .in("phase_id", phaseIds)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async findById(moduleId: string): Promise<ModuleRow | null> {
    const { data, error } = await this.client
      .from("modules")
      .select("*")
      .eq("id", moduleId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async findBySlug(slug: string): Promise<ModuleRow | null> {
    const { data, error } = await this.client
      .from("modules")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
