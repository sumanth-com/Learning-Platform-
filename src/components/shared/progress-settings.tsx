"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import { useProgressStore } from "@/store/use-progress-store";
import { useTotalWeeks } from "@/hooks/use-curriculum";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/shared/filter-pills";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  RESET_SECTIONS,
  resetScopeLabel,
  type ResetScope,
  type ResetSectionId,
} from "@/lib/reset-sections";

type PendingReset = { section: ResetSectionId; scope: ResetScope } | null;

export function ProgressSettings() {
  const totalWeeks = useTotalWeeks();
  const resetSectionProgress = useProgressStore((s) => s.resetSectionProgress);

  const [sectionScopes, setSectionScopes] = useState<
    Record<ResetSectionId, ResetScope>
  >(() =>
    Object.fromEntries(RESET_SECTIONS.map((s) => [s.id, "all"])) as Record<
      ResetSectionId,
      ResetScope
    >
  );
  const [pending, setPending] = useState<PendingReset>(null);
  const [message, setMessage] = useState<string | null>(null);

  const weekOptions = useMemo(
    () =>
      Array.from({ length: totalWeeks }, (_, i) => ({
        value: i + 1,
        label: `Week ${i + 1}`,
      })),
    [totalWeeks]
  );

  const scopeOptions = useMemo(
    () => [{ value: "all" as const, label: "All weeks" }, ...weekOptions],
    [weekOptions]
  );

  const showSuccess = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleConfirm = () => {
    if (!pending) return;
    resetSectionProgress(pending.section, pending.scope);
    const meta = RESET_SECTIONS.find((s) => s.id === pending.section);
    const scopeText = meta?.supportsWeekScope
      ? resetScopeLabel(pending.scope)
      : "";
    showSuccess(
      `${meta?.label ?? "Section"} reset${scopeText ? ` (${scopeText})` : ""}.`
    );
    setPending(null);
  };

  const confirmCopy = useMemo(() => {
    if (!pending) return null;
    const meta = RESET_SECTIONS.find((s) => s.id === pending.section);
    const scope = meta?.supportsWeekScope
      ? resetScopeLabel(pending.scope)
      : "";
    return {
      title: `${meta?.label ?? "Reset"}?`,
      description: `${meta?.description ?? ""}${scope ? ` (${scope})` : ""} This cannot be undone.`,
      confirmLabel: "Reset",
      variant: "warning" as const,
    };
  }, [pending]);

  return (
    <div className="space-y-4">
      {message ? (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-[13px] text-emerald-700 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {message}
        </motion.div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {RESET_SECTIONS.map((section) => {
          const label = section.label.replace(/^Reset\s+/i, "");
          return (
            <div
              key={section.id}
              className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/25 p-4"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-semibold tracking-tight text-foreground">
                  {label}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2">
                {section.supportsWeekScope ? (
                  <FilterSelect
                    label="Scope"
                    value={sectionScopes[section.id]}
                    onChange={(scope) =>
                      setSectionScopes((prev) => ({
                        ...prev,
                        [section.id]: scope,
                      }))
                    }
                    options={scopeOptions}
                    className="min-w-0 flex-1"
                  />
                ) : (
                  <span className="min-w-0 flex-1 text-[12px] text-muted-foreground">
                    {section.id === "notes"
                      ? "Clears everything in Notes"
                      : "Clears all saved data"}
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-1.5 border-border px-3 text-foreground hover:bg-muted"
                  onClick={() =>
                    setPending({
                      section: section.id,
                      scope: sectionScopes[section.id],
                    })
                  }
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {confirmCopy ? (
        <ConfirmDialog
          open={pending !== null}
          title={confirmCopy.title}
          description={confirmCopy.description}
          confirmLabel={confirmCopy.confirmLabel}
          variant={confirmCopy.variant}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      ) : null}
    </div>
  );
}
