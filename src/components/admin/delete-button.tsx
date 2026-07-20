"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type DeleteButtonProps = {
  id: string;
  label?: string;
  confirmMessage?: string;
  action: (id: string) => Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }>;
};

export function DeleteButton({
  id,
  label = "Delete",
  confirmMessage = "Delete this item permanently?",
  action,
}: DeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="border-rose-900/60 text-rose-400 hover:bg-rose-950/40"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          const result = await action(id);
          if (!result.success) {
            toast.error(result.error ?? "Delete failed");
            return;
          }
          toast.success(result.message ?? "Deleted");
          router.refresh();
        });
      }}
    >
      {label}
    </Button>
  );
}
