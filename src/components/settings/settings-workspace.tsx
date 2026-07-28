"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import {
  ChevronDown,
  KeyRound,
  Loader2,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useTheme,
  type ThemePreference,
} from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { ProgressSettings } from "@/components/shared/progress-settings";
import { forgotPasswordAction } from "@/features/auth/actions/auth-actions";
import { playNotificationTone } from "@/lib/game-sounds";
import {
  DEFAULT_USER_SETTINGS,
  NOTIFICATION_SOUNDS,
  readUserSettings,
  updateUserSettings,
  type NotificationSoundId,
  type UserSettings,
} from "@/lib/user-settings";
import { cn } from "@/lib/utils";

type Props = {
  email: string;
  fullName?: string;
};

function SettingsCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card px-5 py-5 shadow-sm sm:px-6 sm:py-5",
        className
      )}
    >
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function SettingsWorkspace({ email, fullName }: Props) {
  const { preference, setTheme } = useTheme();
  const [prefs, setPrefs] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [ready, setReady] = useState(false);
  const [resetLinkPending, startResetLink] = useTransition();
  const [resetLinkSent, setResetLinkSent] = useState(false);

  useEffect(() => {
    setPrefs(readUserSettings());
    setReady(true);
  }, []);

  const patchPrefs = (patch: Partial<UserSettings>) => {
    const next = updateUserSettings(patch);
    setPrefs(next);
  };

  const handleSendResetLink = () => {
    if (!email) {
      toast.error("No email on this account");
      return;
    }
    startResetLink(async () => {
      const result = await forgotPasswordAction({ email });
      if (!result.success) {
        toast.error(result.error ?? "Could not send reset link");
        return;
      }
      setResetLinkSent(true);
      toast.success(
        `Reset link sent to ${email}. Open it, set a new password, then sign in.`
      );
    });
  };

  const selectSound = (sound: NotificationSoundId) => {
    patchPrefs({ notificationSound: sound });
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-8">
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <SettingsCard
          className="h-full"
          title="Appearance"
          description="Choose how the portal looks. Changes apply instantly."
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-medium text-foreground">Theme</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                System, light, or dark
              </p>
            </div>
            <div className="relative w-[8.75rem] shrink-0">
              <select
                aria-label="Theme"
                value={preference}
                onChange={(e) =>
                  setTheme(e.target.value as ThemePreference)
                }
                className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background py-0 pl-3.5 pr-9 text-[13px] font-medium text-foreground outline-none transition hover:border-foreground/30 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
              >
                {THEME_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </SettingsCard>

        <SettingsCard className="h-full" title="Account & security">
          <div className="flex h-full flex-col gap-4">
            <div className="min-w-0">
              <p className="truncate text-[14px] text-foreground">
                Signed in as{" "}
                <span className="font-semibold">
                  {email || fullName?.trim() || "your account"}
                </span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Keep your account secure by using a strong, unique password.
              </p>
              {resetLinkSent ? (
                <p className="mt-2 text-[12px] font-medium text-emerald-700 dark:text-emerald-400">
                  Link sent — check your inbox (and spam folder).
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full shrink-0 border-border text-foreground hover:bg-muted sm:w-auto sm:self-start"
              disabled={resetLinkPending || !email}
              onClick={handleSendResetLink}
            >
              {resetLinkPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {resetLinkSent ? "Resend link" : "Reset password"}
            </Button>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Notifications"
        description="Choose the tone for real in-app alerts — like when you earn a certificate."
      >
        {!ready ? (
          <p className="text-sm text-muted-foreground">Loading preferences…</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
              <h3 className="text-[14px] font-semibold text-foreground">
                Notification Sound
              </h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                Choose the tone played when a new in-app notification arrives —
                or turn sound off.
              </p>

              <div className="mt-3 divide-y divide-border/70 overflow-hidden rounded-xl border border-border/80 bg-card">
                {NOTIFICATION_SOUNDS.map((sound) => {
                  const selected = prefs.notificationSound === sound.id;
                  return (
                    <div
                      key={sound.id}
                      className="flex items-center gap-3 px-3.5 py-3"
                    >
                      <button
                        type="button"
                        onClick={() => selectSound(sound.id)}
                        className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            selected
                              ? "border-foreground"
                              : "border-muted-foreground/50"
                          )}
                        >
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-foreground" />
                          ) : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-semibold text-foreground">
                            {sound.label}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-muted-foreground">
                            {sound.description}
                          </span>
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          playNotificationTone(sound.id, { force: true })
                        }
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[12px] font-medium text-foreground transition hover:bg-muted"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        Preview
                      </button>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 px-3.5 py-3">
                  <button
                    type="button"
                    onClick={() => selectSound("off")}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        prefs.notificationSound === "off"
                          ? "border-foreground"
                          : "border-muted-foreground/50"
                      )}
                    >
                      {prefs.notificationSound === "off" ? (
                        <span className="h-2 w-2 rounded-full bg-foreground" />
                      ) : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-foreground">
                        Off
                      </span>
                      <span className="mt-0.5 block text-[12px] text-muted-foreground">
                        Mute notification sounds. Inbox can still show updates.
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Reset modules"
        description="Clear progress for a module without affecting the rest."
      >
        <ProgressSettings />
      </SettingsCard>
    </div>
  );
}
