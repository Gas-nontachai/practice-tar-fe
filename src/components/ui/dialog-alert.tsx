import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

type DialogAlertProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  mode?: "confirm" | "alert";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

function DialogAlert({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmVariant,
  mode = "confirm",
  onConfirm,
  onCancel,
  loading = false,
}: DialogAlertProps) {
  const titleId = useId();
  const descriptionId = useId();
  const resolvedConfirmLabel =
    confirmLabel ?? (mode === "alert" ? "OK" : "Confirm");
  const resolvedConfirmVariant =
    confirmVariant ?? (mode === "alert" ? "default" : "destructive");

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={loading ? undefined : onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-lg"
      >
        <div className="space-y-2">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {mode === "confirm" ? (
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button
            variant={resolvedConfirmVariant}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Please wait..." : resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export { DialogAlert };
