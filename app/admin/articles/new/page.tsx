"use client";

import { figtree } from "@/lib/fonts";
import AdminArticleForm from "@/components/AdminArticleForm";

export default function NewAdminArticlePage() {
  return (
    <div className={`${figtree.className} max-w-6xl mx-auto px-4 py-8`}>
      <AdminArticleForm mode="create" />
    </div>
  );
}
