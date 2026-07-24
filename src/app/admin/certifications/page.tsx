import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  CERT_CATEGORIES,
  CERTIFICATIONS,
  LEVEL_META,
} from "@/features/certifications/data/catalog";

export const metadata = {
  title: "Certifications CMS",
};

export default function AdminCertificationsPage() {
  const published = CERTIFICATIONS.length;
  const categories = CERT_CATEGORIES.length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Certifications"
        description="Create assessments, manage questions, set passing scores, publish or archive certifications, and review analytics."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Published certifications
          </p>
          <p className="mt-1 text-2xl font-semibold">{published}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Categories
          </p>
          <p className="mt-1 text-2xl font-semibold">{categories}</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Levels per tech
          </p>
          <p className="mt-1 text-2xl font-semibold">2</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5">
        <h2 className="text-[15px] font-semibold">Catalog overview</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Full create/edit question CMS can connect to Supabase next. Current
          catalog is generated from the certifications feature module.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="py-2 pr-3 font-medium">Technology</th>
                <th className="py-2 pr-3 font-medium">Levels</th>
                <th className="py-2 pr-3 font-medium">Passing</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {CERT_CATEGORIES.map((cat) => (
                <tr key={cat.id} className="border-b border-border/40">
                  <td className="py-2.5 pr-3 font-medium">{cat.label}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">
                    Basic → Intermediate
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground">
                    {LEVEL_META.basic.passing}% –{" "}
                    {LEVEL_META.intermediate.passing}%
                  </td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400">
                    Published
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-foreground px-4 py-2 text-[12px] font-semibold text-background"
          >
            Create certification
          </button>
          <button
            type="button"
            className="rounded-xl border border-border/70 px-4 py-2 text-[12px] font-medium"
          >
            Download report
          </button>
          <Link
            href="/certifications"
            className="rounded-xl border border-border/70 px-4 py-2 text-[12px] font-medium"
          >
            Open student view
          </Link>
        </div>
      </div>
    </div>
  );
}
