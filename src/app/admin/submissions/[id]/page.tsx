import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { JourneyReviewForm } from "@/components/admin/journey-review-form";
import { Button } from "@/components/ui/button";
import { getAdminContext } from "@/features/admin/lib/require-admin";
import { JourneySubmissionService } from "@/features/assignments/services/journey-submission.service";
import { ADMIN_ROUTES } from "@/features/admin/types";

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ctx = await getAdminContext();
  if (!ctx.ok) return null;

  const { id } = await params;
  const submission = await new JourneySubmissionService(ctx.supabase).findById(
    id
  );
  if (!submission) notFound();

  return (
    <div>
      <div className="mb-4">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href={ADMIN_ROUTES.submissions}>
            <ArrowLeft className="h-4 w-4" />
            Back to submissions
          </Link>
        </Button>
      </div>
      <AdminPageHeader
        title={`A${submission.assignment_number}: ${submission.assignment_title}`}
        description={`${submission.student_name} · ${submission.module_title}`}
      />
      <JourneyReviewForm submission={submission} />
    </div>
  );
}
