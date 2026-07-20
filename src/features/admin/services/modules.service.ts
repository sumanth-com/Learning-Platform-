import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, ModuleRow } from "@/types/database";
import { AdminModulesRepository } from "@/features/admin/repositories/modules.repository";
import { slugify } from "@/features/admin/lib/slugify";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminModulesService {
  private repo: AdminModulesRepository;

  constructor(client: Client) {
    this.repo = new AdminModulesRepository(client);
  }

  list(query?: AdminListQuery & { phaseId?: string }) {
    return this.repo.list(query);
  }

  listAll() {
    return this.repo.listAll();
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  async create(input: {
    phaseId: string;
    title: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    estimatedDuration?: string;
  }): Promise<ModuleRow> {
    const sortOrder = await this.repo.nextSortOrder(input.phaseId);
    return this.repo.create({
      phase_id: input.phaseId,
      title: input.title,
      slug: input.slug?.trim() || slugify(input.title),
      description: input.description ?? "",
      icon: input.icon ?? "book-open",
      color: input.color ?? "indigo",
      estimated_duration: input.estimatedDuration ?? "",
      sort_order: sortOrder,
    });
  }

  update(
    id: string,
    input: {
      phaseId?: string;
      title?: string;
      slug?: string;
      description?: string;
      icon?: string;
      color?: string;
      estimatedDuration?: string;
    }
  ) {
    return this.repo.update(id, {
      ...(input.phaseId !== undefined ? { phase_id: input.phaseId } : {}),
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.color !== undefined ? { color: input.color } : {}),
      ...(input.estimatedDuration !== undefined
        ? { estimated_duration: input.estimatedDuration }
        : {}),
    });
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
