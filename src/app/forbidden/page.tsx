import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/features/auth/constants";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
        403
      </p>
      <h1 className="mt-3 font-display text-3xl text-zinc-50">Access denied</h1>
      <p className="mt-3 max-w-md text-sm text-zinc-500">
        This area is restricted to administrators and instructors. Students
        cannot access the Admin CMS.
      </p>
      <Button asChild className="mt-8">
        <Link href={AUTH_ROUTES.dashboard}>Back to dashboard</Link>
      </Button>
    </div>
  );
}
