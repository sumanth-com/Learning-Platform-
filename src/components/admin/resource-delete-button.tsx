"use client";

import { DeleteButton } from "@/components/admin/delete-button";
import { deleteResourceAction } from "@/features/admin/actions/resource-actions";

export function ResourceDeleteButton({
  id,
  scope,
}: {
  id: string;
  scope: "lesson" | "assignment";
}) {
  return (
    <DeleteButton
      id={id}
      action={(resourceId) => deleteResourceAction(resourceId, scope)}
    />
  );
}
