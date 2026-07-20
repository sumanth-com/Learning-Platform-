import { createClient } from "@/lib/supabase/server";
import { CurriculumService } from "@/features/curriculum/services/curriculum.service";
import { ProgressService } from "@/features/curriculum/services/progress.service";

export async function createCurriculumService() {
  const client = await createClient();
  return new CurriculumService(client);
}

export async function createProgressService() {
  const client = await createClient();
  return new ProgressService(client);
}
