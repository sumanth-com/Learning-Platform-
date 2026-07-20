import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CourseInsert,
  CourseRow,
  CourseUpdate,
  Database,
} from "@/types/database";
import type { AdminListQuery, PaginatedResult } from "@/features/admin/types";

type Client = SupabaseClient<Database>;

function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export class AdminCoursesRepository {
  constructor(private readonly client: Client) {}

  async list(query: AdminListQuery = {}): Promise<PaginatedResult<CourseRow>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, query.pageSize ?? 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const sort = query.sort === "title" ? "title" : "created_at";
    const ascending = query.order === "asc";

    let q = this.client
      .from("courses")
      .select("*", { count: "exact" })
      .order(sort, { ascending });

    if (query.q?.trim()) {
      const term = `%${query.q.trim()}%`;
      q = q.or(`title.ilike.${term},slug.ilike.${term}`);
    }
    if (query.filter === "published") q = q.eq("is_published", true);
    if (query.filter === "draft") q = q.eq("is_published", false);

    const { data, error, count } = await q.range(from, to);
    if (error) throw error;
    return paginate((data ?? []) as CourseRow[], count ?? 0, page, pageSize);
  }

  async findById(id: string): Promise<CourseRow | null> {
    const { data, error } = await this.client
      .from("courses")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as CourseRow | null;
  }

  async listAll(): Promise<CourseRow[]> {
    const { data, error } = await this.client
      .from("courses")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []) as CourseRow[];
  }

  async create(payload: CourseInsert): Promise<CourseRow> {
    const { data, error } = await this.client
      .from("courses")
      .insert(payload as never)
      .select("*")
      .single();
    if (error) throw error;
    return data as CourseRow;
  }

  async update(id: string, payload: CourseUpdate): Promise<CourseRow> {
    const { data, error } = await this.client
      .from("courses")
      .update({ ...payload, updated_at: new Date().toISOString() } as never)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as CourseRow;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from("courses").delete().eq("id", id);
    if (error) throw error;
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from("courses")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  }
}
