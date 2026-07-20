"use client";

import { useOptimistic, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { ADMIN_ROUTES } from "@/features/admin/types";
import {
  deletePhaseAction,
  reorderPhasesAction,
} from "@/features/admin/actions/phase-actions";

export type SortablePhase = {
  id: string;
  title: string;
  slug: string;
  sort_order: number;
  courseTitle?: string;
};

function SortableRow({
  phase,
  dragDisabled,
}: {
  phase: SortablePhase;
  dragDisabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: phase.id, disabled: dragDisabled });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-3 ${
        isDragging ? "opacity-70 ring-1 ring-indigo-500" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-zinc-500 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={dragDisabled}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">
          {phase.title}
        </p>
        <p className="truncate text-xs text-zinc-500">
          {phase.courseTitle ? `${phase.courseTitle} · ` : ""}
          {phase.slug}
        </p>
      </div>
      <span className="text-xs text-zinc-600">#{phase.sort_order + 1}</span>
      <Button asChild size="sm" variant="ghost">
        <Link href={ADMIN_ROUTES.phaseEdit(phase.id)}>Edit</Link>
      </Button>
      <DeleteButton
        id={phase.id}
        confirmMessage="Delete this phase and its modules/lessons?"
        action={deletePhaseAction}
      />
    </div>
  );
}

export function PhaseSortableList({
  phases,
  disabled = false,
}: {
  phases: SortablePhase[];
  disabled?: boolean;
}) {
  const [items, setItems] = useOptimistic(phases);
  const [, startTransition] = useTransition();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function onDragEnd(event: DragEndEvent) {
    if (disabled) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex).map((p, index) => ({
      ...p,
      sort_order: index,
    }));

    startTransition(async () => {
      setItems(next);
      const result = await reorderPhasesAction({
        orderedIds: next.map((p) => p.id),
      });
      if (!result.success) {
        setItems(phases);
        toast.error(result.error ?? "Reorder failed");
        return;
      }
      toast.success("Order saved");
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-12 text-center text-sm text-zinc-500">
        No phases yet.
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext
        items={items.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={`space-y-2 ${disabled ? "opacity-80" : ""}`}>
          {items.map((phase) => (
            <SortableRow key={phase.id} phase={phase} dragDisabled={disabled} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
