"use client";
import { Dialog } from "@ark-ui/react";
import { AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const t = useTranslations("notes");
  const locale = useLocale();

  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(d) => !d.open && onClose()}
    >
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Content 
          dir={dir}
          className="w-full max-w-sm rounded-xl bg-surface p-6 shadow-xl border border-border"
        >
          <div className="flex items-center gap-3 mb-4 text-danger">
            <div className="p-2 bg-danger/10 rounded-full">
              <AlertCircle size={20} />
            </div>
            <Dialog.Title className="text-base font-bold text-text">
              {t("deleteTitle")}
            </Dialog.Title>
          </div>

          <Dialog.Description 
      dir={dir}
           className="text-sm text-text-muted mb-6 leading-relaxed">
            {t("deleteDescription")}
          </Dialog.Description>

          <div className="flex justify-end gap-3">
            <Dialog.CloseTrigger className="px-4 py-2 text-xs font-bold text-text-muted hover:bg-surface-muted rounded-lg transition-colors">
              {t("cancel")}
            </Dialog.CloseTrigger>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-xs font-bold bg-danger text-white hover:bg-danger/90 rounded-lg transition-colors"
            >
              {t("deleteConfirm")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
