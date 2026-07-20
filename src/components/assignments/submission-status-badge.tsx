import { Badge } from "@/components/ui/badge";
import type { SubmissionStatus } from "@/types/database";

const VARIANT: Record<
  SubmissionStatus,
  "secondary" | "default" | "warning" | "destructive" | "success"
> = {
  pending: "secondary",
  submitted: "default",
  under_review: "warning",
  revision_requested: "destructive",
  approved: "success",
};

const LABEL: Record<SubmissionStatus, string> = {
  pending: "Pending",
  submitted: "Submitted",
  under_review: "Under review",
  revision_requested: "Revision requested",
  approved: "Approved",
};

export function SubmissionStatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  return (
    <Badge variant={VARIANT[status]} className="capitalize">
      {LABEL[status]}
    </Badge>
  );
}
