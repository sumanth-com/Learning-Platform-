import { createClient } from "@/lib/supabase/server";
import { AssignmentService } from "@/features/assignments/services/assignment.service";
import { SubmissionService } from "@/features/assignments/services/submission.service";

export async function createAssignmentService() {
  const client = await createClient();
  return new AssignmentService(client);
}

export async function createSubmissionService() {
  const client = await createClient();
  return new SubmissionService(client);
}
