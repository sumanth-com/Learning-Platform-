import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { HUB_CATALOG } from "@/features/developer-hub/data/catalog";
import { categoryMeta } from "@/features/developer-hub/data/categories";

export const metadata = {
  title: "Developer Hub CMS",
};

export default async function AdminDeveloperHubPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Developer Hub"
        description="Curated production guides shown in the student Developer Hub. Full create/edit/upload CMS (images, PDFs, scheduling) can extend this catalog into Supabase next."
        actionHref="/resources"
        actionLabel="Open Hub"
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 text-sm text-zinc-400">
        Catalog source: <code className="text-zinc-200">features/developer-hub/data/catalog.ts</code>
        {" · "}
        {HUB_CATALOG.length} published guides · Featured{" "}
        {HUB_CATALOG.filter((r) => r.featured).length} · Trending{" "}
        {HUB_CATALOG.filter((r) => r.trending).length}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/80 text-[11px] uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Guide</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium">Flags</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {HUB_CATALOG.map((r) => {
              const cat = categoryMeta(r.category);
              return (
                <tr
                  key={r.id}
                  className="border-t border-zinc-800/80 hover:bg-zinc-900/40"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-100">
                      {r.emoji} {r.title}
                    </div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                      {r.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{cat.label}</td>
                  <td className="px-4 py-3 capitalize text-zinc-400">
                    {r.difficulty}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.featured ? <Badge>Featured</Badge> : null}
                      {r.trending ? (
                        <Badge variant="secondary">Trending</Badge>
                      ) : null}
                      {r.pinned ? <Badge variant="warning">Pinned</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{r.updatedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/resources/${r.slug}`} target="_blank">
                        Preview
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
