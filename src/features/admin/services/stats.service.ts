import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { AdminStats } from "@/features/admin/types";
import { AdminCoursesRepository } from "@/features/admin/repositories/courses.repository";
import { AdminPhasesRepository } from "@/features/admin/repositories/phases.repository";
import { AdminModulesRepository } from "@/features/admin/repositories/modules.repository";
import { AdminLessonsRepository } from "@/features/admin/repositories/lessons.repository";
import { AdminAssignmentsRepository } from "@/features/admin/repositories/assignments.repository";
import { AdminStudentsRepository } from "@/features/admin/repositories/students.repository";

type Client = SupabaseClient<Database>;

export class AdminStatsService {
  private courses: AdminCoursesRepository;
  private phases: AdminPhasesRepository;
  private modules: AdminModulesRepository;
  private lessons: AdminLessonsRepository;
  private assignments: AdminAssignmentsRepository;
  private students: AdminStudentsRepository;

  constructor(client: Client) {
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
}
