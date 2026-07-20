"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type PublishToggleProps = {
  id: string;
  isPublished: boolean;
  action: (id: string, isPublished: boolean) => Promise<{
    success: boolean;
    error?: string;
    message?: string;
  }>;
};

export function PublishToggle({
  id,
  isPublished,
  action,
}: PublishToggleProps) {
  const [optimistic, setOptimistic] = useOptimistic(isPublished);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant={optimistic ? "secondary" : "outline"}
      disabled={pending}
      onClick={() => {
        const next = !optimistic;
        startTransition(async () => {
          setOptimistic(next);
          const result = await action(id, next);
          if (!result.success) {
            setOptimistic(!next);
            toast.error(result.error ?? "Update failed");
            return;
          }
          toast.success(result.message ?? "Updated");
        });
      }}
    >
      {optimistic ? "Unpublish" : "Publish"}
    </Button>
  );
}
