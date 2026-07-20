import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { ProgressRepository } from "@/features/curriculum/repositories/progress.repository";

type Client = SupabaseClient<Database>;

export class ProgressService {
  private readonly progress: ProgressRepository;

  constructor(client: Client) {
    this.progress = new ProgressRepository(client);
  }

  async markComplete(profileId: string, lessonId: string) {
    return this.progress.upsertCompletion(profileId, lessonId, true);
  }

  async markIncomplete(profileId: string, lessonId: string) {
    return this.progress.upsertCompletion(profileId, lessonId, false);
  }
}
