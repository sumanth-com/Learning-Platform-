import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/features/admin/types";

/** Legacy route — Access Requests is the canonical path. */
export default function AdminSeatRequestsRedirect() {
  redirect(ADMIN_ROUTES.accessRequests);
}
