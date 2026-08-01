import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import {
  CERT_CATEGORIES,
  CERTIFICATIONS,
  LEVEL_META,
} from "@/features/certifications/data/catalog";
import { ADMIN_ROUTES } from "@/features/admin/types";

export const metadata = {
  title: "Certifications",
};

export default async function AdminCertificationsPage() {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const issuedRes = await ctx.supabase
    .from("certificates")
    .select("*", { count: "exact", head: true });

  const recentRes = await ctx.supabase
    .from("certificates")
    .select(
      "id, recipient_name, title, technology, level, issued_at, certification_id"
    )
    .order("issued_at", { ascending: false })
    .limit(20);

  const issuedCount = issuedRes.count ?? 0;
  const recent = (recentRes.data ?? []) as Array<{
    id: string;
    recipient_name: string;
    title: string;
    technology: string;
    level: string;
    issued_at: string;
    certification_id: string;
  }>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Certifications"
        description="View generated certificates, verify credentials, download PDFs, and regenerate when needed."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Catalog items
          </p>
          <p className="mt-1 font-display text-2xl text-zinc-50">
            {CERTIFICATIONS.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Categories
          </p>
          <p className="mt-1 font-display text-2xl text-zinc-50">
            {CERT_CATEGORIES.length}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">
            Certificates issued
          </p>
          <p className="mt-1 font-display text-2xl text-zinc-50">
            {issuedCount}
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg text-zinc-100">
              Generated certificates
            </h2>
            <p className="text-sm text-zinc-500">
              Issued credentials with verification IDs.
            </p>
          </div>
          <Link
            href="/verify"
            className="text-xs text-[#f3aaa0] hover:underline"
          >
            Certificate verification
          </Link>
        </div>

        {!recent.length ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No certificates issued yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-zinc-500">
                <tr className="border-b border-zinc-800">
                  <th className="py-2 pr-3 font-medium">Student</th>
                  <th className="py-2 pr-3 font-medium">Certificate</th>
                  <th className="py-2 pr-3 font-medium">Issued</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((cert) => (
                  <tr key={cert.id} className="border-b border-zinc-800/60">
                    <td className="py-3 pr-3 font-medium text-zinc-200">
                      {cert.recipient_name}
                    </td>
                    <td className="py-3 pr-3 text-zinc-400">
                      {cert.title || cert.technology} · {cert.level}
                    </td>
                    <td className="py-3 pr-3 text-zinc-500">
                      {cert.issued_at
                        ? new Date(cert.issued_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Link
                          href={`/verify/${cert.certification_id ?? cert.id}`}
                          className="text-[#f3aaa0] hover:underline"
                        >
                          Verify
                        </Link>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-600">Download PDF</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-600">Regenerate</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <h2 className="font-display text-lg text-zinc-100">Catalog</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Assessment catalog powering issued credentials.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wide text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-3 font-medium">Technology</th>
                <th className="py-2 pr-3 font-medium">Levels</th>
                <th className="py-2 pr-3 font-medium">Passing</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CERT_CATEGORIES.map((cat) => (
                <tr key={cat.id} className="border-b border-zinc-800/50">
                  <td className="py-2.5 pr-3 font-medium text-zinc-200">
                    {cat.label}
                  </td>
                  <td className="py-2.5 pr-3 text-zinc-500">
                    Basic → Intermediate
                  </td>
                  <td className="py-2.5 pr-3 text-zinc-500">
                    {LEVEL_META.basic.passing}% –{" "}
                    {LEVEL_META.intermediate.passing}%
                  </td>
                  <td className="py-2.5 text-emerald-400">Published</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link
            href={ADMIN_ROUTES.analytics}
            className="text-xs text-[#f3aaa0] hover:underline"
          >
            View certificate analytics →
          </Link>
        </div>
      </section>
    </div>
  );
}
