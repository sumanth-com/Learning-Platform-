"use client";

import { useTransition } from "react";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          toast.success(AUTH_MESSAGES.logoutSuccess);
          await logoutAction();
        });
      }}
      {...props}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
