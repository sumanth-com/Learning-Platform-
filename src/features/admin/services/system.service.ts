import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getAppUrl } from "@/lib/supabase/env";
import { getEmailEnv } from "@/lib/email/env";

type Client = SupabaseClient<Database>;

export type TableHealth = {
  table: string;
  label: string;
  ok: boolean;
  count: number;
  error?: string;
};

export type SystemHealth = {
  ok: boolean;
  latencyMs: number;
  checkedAt: string;
  tables: TableHealth[];
  integrations: {
    supabaseUrl: boolean;
    serviceRole: boolean;
    resend: boolean;
    emailFrom: boolean;
    appUrl: string;
  };
};

const HEALTH_TABLES: Array<{ table: string; label: string }> = [
  { table: "profiles", label: "Profiles" },
  { table: "seat_requests", label: "Access requests" },
  { table: "courses", label: "Courses" },
  { table: "modules", label: "Modules" },
  { table: "lessons", label: "Lessons" },
  { table: "certificates", label: "Certificates" },
  { table: "lesson_progress", label: "Lesson progress" },
  { table: "assignment_submissions", label: "Submissions" },
];

export class AdminSystemService {
  constructor(private readonly client: Client) {}

  async getSystemHealth(): Promise<SystemHealth> {
    const started = Date.now();

    const tables = await Promise.all(
      HEALTH_TABLES.map(async ({ table, label }) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { count, error } = await (this.client as any)
            .from(table)
            .select("*", { count: "exact", head: true });

          if (error) {
            return {
              table,
              label,
              ok: false,
              count: 0,
              error: error.message,
            } satisfies TableHealth;
          }

          return {
            table,
            label,
            ok: true,
            count: count ?? 0,
          } satisfies TableHealth;
        } catch (err) {
          return {
            table,
            label,
            ok: false,
            count: 0,
            error: err instanceof Error ? err.message : "Query failed",
          } satisfies TableHealth;
        }
      })
    );

    const email = getEmailEnv();
    let appUrl = "";
    try {
      appUrl = getAppUrl();
    } catch {
      appUrl = "";
    }

    return {
      ok: tables.every((t) => t.ok),
      latencyMs: Date.now() - started,
      checkedAt: new Date().toISOString(),
      tables,
      integrations: {
        supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
        serviceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
        resend: Boolean(email.apiKey),
        emailFrom: Boolean(process.env.EMAIL_FROM?.trim()),
        appUrl,
      },
    };
  }
}
