"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  BadgeCheck,
  Camera,
  Check,
  FileText,
  Loader2,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ProfileCertificates } from "@/components/certifications/profile-certificates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/types/database";

const MAX_BYTES = 10 * 1024 * 1024;
const HEADLINE_KEY = (userId: string) => `suprabase:profile-headline:${userId}`;
const AVATAR_KEY = (userId: string) => `suprabase:avatar:${userId}`;

type Props = {
  userId: string;
  email: string;
  initialProfile: ProfileRow | null;
  initialHeadline?: string;
};

function buildCardId(userId: string): string {
  const clean = userId.replace(/-/g, "").toUpperCase();
  const a = clean.slice(0, 4);
  const b = clean.slice(4, 8);
  const c = clean.slice(-4);
  return `SB-${a}-${b}-${c}`;
}

async function fileToCompressedBlob(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 960;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.88)
  );
  if (!blob) throw new Error("Could not process image.");
  return blob;
}

export function ProfileWorkspace({
  userId,
  email,
  initialProfile,
  initialHeadline,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [headline, setHeadline] = useState(
    initialHeadline?.trim() || "Upcoming Developer"
  );
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const cardId = useMemo(() => buildCardId(userId), [userId]);
  const role = initialProfile?.role ?? "student";
  const memberSince = initialProfile?.created_at
    ? new Date(initialProfile.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const initials = (fullName.trim() || email || "U").charAt(0).toUpperCase();
  const hasPhoto = Boolean(avatarUrl);

  useEffect(() => {
    try {
      const local = localStorage.getItem(HEADLINE_KEY(userId));
      if (local?.trim() && !initialHeadline?.trim()) {
        setHeadline(local.trim());
      }
    } catch {
      /* ignore */
    }
  }, [initialHeadline, userId]);

  useEffect(() => {
    if (avatarUrl) return;
    try {
      const local = localStorage.getItem(AVATAR_KEY(userId));
      if (local) setAvatarUrl(local);
    } catch {
      /* ignore */
    }
  }, [avatarUrl, userId]);

  const persistHeadline = useCallback(
    (value: string) => {
      try {
        localStorage.setItem(HEADLINE_KEY(userId), value);
      } catch {
        /* ignore */
      }
    },
    [userId]
  );

  const handleSave = useCallback(async () => {
    const name = fullName.trim();
    if (!name) {
      toast.error("Full name is required.");
      return;
    }
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name } as never)
        .eq("id", userId);
      if (error) throw error;

      await supabase.auth.updateUser({
        data: {
          full_name: name,
          headline: headline.trim() || "Upcoming Developer",
        },
      });

      persistHeadline(headline.trim() || "Upcoming Developer");
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1600);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save profile."
      );
    } finally {
      setSaving(false);
    }
  }, [fullName, headline, persistHeadline, userId]);

  const handleAvatarPick = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file.");
        return;
      }
      if (file.size > MAX_BYTES) {
        toast.error("Image must be 10MB or smaller.");
        return;
      }

      setUploading(true);
      try {
        const blob = await fileToCompressedBlob(file);
        const supabase = createClient();
        const path = `${userId}/avatar.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, blob, {
            upsert: true,
            contentType: "image/jpeg",
            cacheControl: "3600",
          });

        if (uploadError) {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(new Error("Could not read image."));
            reader.readAsDataURL(blob);
          });
          setAvatarUrl(dataUrl);
          try {
            localStorage.setItem(AVATAR_KEY(userId), dataUrl);
          } catch {
            /* ignore quota */
          }
          toast.message("Photo updated locally", {
            description:
              "Cloud upload isn’t available yet — photo is saved on this device.",
          });
          return;
        }

        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: publicUrl } as never)
          .eq("id", userId);
        if (updateError) throw updateError;

        setAvatarUrl(publicUrl);
        try {
          localStorage.removeItem(AVATAR_KEY(userId));
        } catch {
          /* ignore */
        }
        toast.success("Profile photo updated");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not upload photo."
        );
      } finally {
        setUploading(false);
      }
    },
    [userId]
  );

  const handleDeletePhoto = useCallback(async () => {
    if (!hasPhoto) return;
    if (!window.confirm("Remove your profile photo?")) return;

    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`]);

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null } as never)
        .eq("id", userId);
      if (error) throw error;

      setAvatarUrl("");
      try {
        localStorage.removeItem(AVATAR_KEY(userId));
      } catch {
        /* ignore */
      }
      toast.success("Profile photo removed");
    } catch (err) {
      // Still clear local state if cloud delete fails partially
      setAvatarUrl("");
      try {
        localStorage.removeItem(AVATAR_KEY(userId));
      } catch {
        /* ignore */
      }
      toast.message("Photo removed", {
        description:
          err instanceof Error
            ? err.message
            : "Photo cleared on this device.",
      });
    } finally {
      setDeleting(false);
    }
  }, [hasPhoto, userId]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-1 pb-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] lg:items-stretch lg:gap-8">
        {/* Candidate Information */}
        <section className="flex h-full min-h-0 flex-col rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] sm:p-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Candidate Information
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Update your name and photo. Account details are managed by
              SupraBase.
            </p>
          </div>

          <div className="mt-7 flex flex-1 flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="h-11 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline" className="text-foreground">
                Title
              </Label>
              <Input
                id="headline"
                value={headline}
                readOnly
                aria-readonly="true"
                className="h-11 cursor-default rounded-xl border-border bg-muted/40 text-foreground"
              />
              <p className="text-[11px] text-muted-foreground">
                Assigned from your learner profile.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  value={email}
                  readOnly
                  className="h-11 rounded-xl border-border bg-muted/40 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Role</Label>
                <Input
                  value={role}
                  readOnly
                  aria-readonly="true"
                  className="h-11 cursor-default rounded-xl border-border bg-muted/40 capitalize text-foreground"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-foreground">Member since</Label>
                <Input
                  value={memberSince}
                  readOnly
                  className="h-11 rounded-xl border-border bg-muted/40 text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">ID number</Label>
                <Input
                  value={cardId}
                  readOnly
                  className="h-11 rounded-xl border-border bg-muted/40 font-mono text-[13px] tracking-wide text-foreground"
                />
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="h-11 rounded-xl px-5"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : savedFlash ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {saving ? "Saving…" : savedFlash ? "Saved" : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || deleting}
                className="h-11 rounded-xl border-border text-foreground"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {uploading
                  ? "Uploading…"
                  : hasPhoto
                    ? "Replace photo"
                    : "Upload photo"}
              </Button>
              {hasPhoto ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeletePhoto}
                  disabled={uploading || deleting}
                  className="h-11 rounded-xl border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400"
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {deleting ? "Removing…" : "Delete photo"}
                </Button>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarPick}
              />
              <p className="w-full text-[12px] text-muted-foreground">
                Profile photo · JPG, PNG, WebP · max 10MB · upload, replace, or
                delete anytime
              </p>
            </div>
          </div>
        </section>

        {/* Neon glass ID card — narrower, no black frame */}
        <div className="relative mx-auto flex h-full min-h-[520px] w-full max-w-[300px] flex-col lg:mx-0 lg:ml-auto lg:min-h-0 lg:max-w-none">
          <motion.div
            className="relative z-10 flex h-full w-full flex-1 flex-col overflow-hidden rounded-[1.6rem]"
            style={{
              background:
                "linear-gradient(180deg, #222328 0%, #29282d 58%, #5f3435 84%, #a7423d 100%)",
              boxShadow:
                "0 0 0 1px rgba(217,74,65,0.34), 0 0 18px rgba(217,74,65,0.12), 0 22px 48px -22px rgba(24,24,27,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
            animate={{
              boxShadow: [
                "0 0 0 1px rgba(217,74,65,0.3), 0 0 14px rgba(217,74,65,0.1), 0 22px 48px -22px rgba(24,24,27,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                "0 0 0 1px rgba(220,163,154,0.5), 0 0 22px rgba(217,74,65,0.18), 0 22px 48px -22px rgba(24,24,27,0.4), inset 0 1px 0 rgba(255,255,255,0.26)",
                "0 0 0 1px rgba(217,74,65,0.3), 0 0 14px rgba(217,74,65,0.1), 0 22px 48px -22px rgba(24,24,27,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              ],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Soft glass highlight */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-white/35 to-transparent"
            />

            {/* Right-side waterfall light */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-3 right-3 z-20 w-[3px] overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 bg-primary/20" />
              <motion.div
                className="absolute left-0 right-0 h-[38%] rounded-full"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgba(220,163,154,0.72), rgba(217,74,65,0.72), rgba(95,52,53,0.6), transparent)",
                  boxShadow:
                    "0 0 8px 1px rgba(217,74,65,0.35), 0 0 16px 3px rgba(217,74,65,0.16)",
                }}
                animate={{ top: ["-40%", "105%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-[#fcb49c]/50 blur-md"
                animate={{ top: ["-10%", "110%"], opacity: [0.2, 0.85, 0.2] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>

            <div className="relative min-h-0 flex-[1.35] overflow-hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={fullName || "Profile"}
                  className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 52%, transparent 96%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 52%, transparent 96%)",
                  }}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#24252a] via-[#2f2d32] to-[#74403f] text-7xl font-semibold text-white/90"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 52%, transparent 96%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 52%, transparent 96%)",
                  }}
                >
                  {initials}
                </div>
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#3f292b] via-[#5f3435]/75 to-transparent"
              />
            </div>

            <div className="relative z-10 mt-auto shrink-0 px-5 pb-5 pt-1 text-white">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-[1.35rem] font-bold tracking-tight drop-shadow-sm">
                  {fullName.trim() || "Your name"}
                </h3>
                <BadgeCheck className="h-[18px] w-[18px] shrink-0 fill-white text-[#d96b61]" />
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-white/85">
                {headline.trim() || "Upcoming Developer"} · SupraBase learner
                identity
              </p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3.5 text-[12px] font-medium text-white/90">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 opacity-90" />
                    <span className="capitalize">{role}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 opacity-90" />
                    <span className="font-mono text-[11px] tracking-wide">
                      {cardId.slice(-8)}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading || deleting}
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-white px-3 text-[12px] font-semibold text-slate-900 shadow-md transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Camera className="h-3.5 w-3.5" />
                  )}
                  Photo +
                </button>
              </div>

              <p className="mt-3 truncate font-mono text-[10px] tracking-[0.14em] text-white/65">
                ID {cardId}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <ProfileCertificates />
    </div>
  );
}
