"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmDeleteModal({
  open,
  title = "Delete Blog",
  message = "Are you sure you want to delete this Blog? This action cannot be undone.",
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm mx-2 overflow-hidden border border-[#006b6a]"
      >
        <div className="flex justify-between items-center bg-[#006b6a] text-white px-4 py-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-1.5 rounded-md cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-4 py-5">
          <p className="text-sm text-gray-700 mb-6">{message}</p>

          <div className="flex justify-start gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-semibold rounded-md border border-[#006b6a] text-[#006b6a] hover:bg-[#f0fdfa] cursor-pointer transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                await onConfirm();
              }}
              className="px-4 py-1.5 text-sm rounded-md font-semibold bg-[#006b6a] text-white hover:bg-[#005f5f] cursor-pointer transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
