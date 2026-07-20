import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { AdminStudentsRepository } from "@/features/admin/repositories/students.repository";
import type { AdminListQuery } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

export class AdminStudentsService {
  private repo: AdminStudentsRepository;

  constructor(client: Client) {
    this.repo = new AdminStudentsRepository(client);
  }

  list(query?: AdminListQuery) {
    return this.repo.listStudents(query);
  }

  getById(id: string) {
    return this.repo.findById(id);
  }

  getProgress(profileId: string) {
    return this.repo.listProgress(profileId);
  }

  getSubmissions(profileId: string) {
    return this.repo.listSubmissions(profileId);
  }

  getSummary(profileId: string) {
    return this.repo.getProgressSummary(profileId);
  }
}
