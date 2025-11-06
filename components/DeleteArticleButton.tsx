"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function DeleteArticleButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Failed");
        throw new Error(text || "Delete failed");
      }

      window.location.reload();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the article.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex cursor-pointer items-center justify-center rounded-md border px-2.5 py-1.5 hover:bg-gray-50 text-red-600 border-red-500"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <ConfirmDeleteModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Delete rticle"
        message="Are you sure you want to delete this article? This action cannot be undone."
      />
    </>
  );
}
