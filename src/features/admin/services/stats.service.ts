import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  AdminStats,
  BusinessOverview,
} from "@/features/admin/types";
import { AdminCoursesRepository } from "@/features/admin/repositories/courses.repository";
import { AdminPhasesRepository } from "@/features/admin/repositories/phases.repository";
import { AdminModulesRepository } from "@/features/admin/repositories/modules.repository";
import { AdminLessonsRepository } from "@/features/admin/repositories/lessons.repository";
import { AdminAssignmentsRepository } from "@/features/admin/repositories/assignments.repository";
import { AdminStudentsRepository } from "@/features/admin/repositories/students.repository";

type Client = SupabaseClient<Database>;

function daysAgoIso(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export class AdminStatsService {
  private courses: AdminCoursesRepository;
  private phases: AdminPhasesRepository;
  private modules: AdminModulesRepository;
  private lessons: AdminLessonsRepository;
  private assignments: AdminAssignmentsRepository;
  private students: AdminStudentsRepository;

  constructor(private readonly client: Client) {
    this.courses = new AdminCoursesRepository(client);
    this.phases = new AdminPhasesRepository(client);
    this.modules = new AdminModulesRepository(client);
    this.lessons = new AdminLessonsRepository(client);
    this.assignments = new AdminAssignmentsRepository(client);
    this.students = new AdminStudentsRepository(client);
  }

  async getStats(): Promise<AdminStats> {
    const [
      courses,
      phases,
      modules,
      lessons,
      assignments,
      students,
      submissions,
    ] = await Promise.all([
      this.courses.count(),
      this.phases.count(),
      this.modules.count(),
      this.lessons.count(),
      this.assignments.count(),
      this.students.countStudents(),
      this.students.countSubmissions(),
    ]);

    return {
      courses,
      phases,
      modules,
      lessons,
      assignments,
      students,
      submissions,
    };
  }

  async getBusinessOverview(): Promise<BusinessOverview> {
    const weekAgo = daysAgoIso(7);
    const monthAgo = daysAgoIso(30);

    const [
      totalStudents,
      pendingRequests,
      approvedThisWeek,
      rejectedRequests,
      certificatesIssued,
      recentSignupsRes,
      progressAll,
      progressWeek,
      progressMonth,
      completedProgress,
    ] = await Promise.all([
      this.students.countStudents(),
      this.client
        .from("seat_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      this.client
        .from("seat_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .gte("approved_at", weekAgo),
      this.client
        .from("seat_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected"),
      this.client
        .from("certificates")
        .select("*", { count: "exact", head: true }),
      this.client
        .from("profiles")
        .select("id, full_name, email, created_at, avatar_url")
        .eq("role", "student")
        .order("created_at", { ascending: false })
        .limit(8),
      this.client
        .from("lesson_progress")
        .select("profile_id", { count: "exact" }),
      this.client
        .from("lesson_progress")
        .select("profile_id")
        .gte("created_at", weekAgo),
      this.client
        .from("lesson_progress")
        .select("profile_id")
        .gte("created_at", monthAgo),
      this.client
        .from("lesson_progress")
        .select("*", { count: "exact", head: true })
        .eq("completed", true),
    ]);

    const unique = (rows: Array<{ profile_id: string }> | null) =>
      new Set((rows ?? []).map((r) => r.profile_id)).size;

    const weeklyActiveUsers = unique(
      progressWeek.data as Array<{ profile_id: string }> | null
    );
    const monthlyActiveUsers = unique(
      progressMonth.data as Array<{ profile_id: string }> | null
    );

    const totalProgressRows = progressAll.count ?? 0;
    const completedLessons = completedProgress.count ?? 0;
    const completionRate =
      totalProgressRows === 0
        ? 0
        : Math.round((completedLessons / totalProgressRows) * 100);

    return {
      totalStudents,
      activeStudents: monthlyActiveUsers,
      pendingRequests: pendingRequests.count ?? 0,
      approvedThisWeek: approvedThisWeek.count ?? 0,
      rejectedRequests: rejectedRequests.count ?? 0,
      certificatesIssued: certificatesIssued.error
        ? 0
        : (certificatesIssued.count ?? 0),
      weeklyActiveUsers,
      monthlyActiveUsers,
      completionRate,
      revenue: null,
      recentSignups: (recentSignupsRes.data ?? []) as BusinessOverview["recentSignups"],
      learningProgress: {
        completedLessons,
        totalProgressRows,
      },
    };
  }
}
