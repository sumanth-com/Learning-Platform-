"use client";

import { useState, useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { logoutAction } from "@/features/auth/actions/auth-actions";
import { AUTH_MESSAGES } from "@/features/auth/constants";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
}

export function LogoutButton({
  label = "Sign out",
  variant = "secondary",
  size = "default",
  className,
  ...props
}: LogoutButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        disabled={isPending}
        onClick={() => setConfirmOpen(true)}
        {...props}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        {label}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out?"
        description="You’ll need to sign in again to get back to your dashboard and learning progress."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
        onConfirm={() => {
          setConfirmOpen(false);
          startTransition(async () => {
            toast.success(AUTH_MESSAGES.logoutSuccess);
            await logoutAction();
          });
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
