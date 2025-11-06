"use client";

import { useState } from "react";

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "video"; url: string; title?: string };

export default function BlockEditor({
  value,
  onChange,
}: {
  value: Block[];
  onChange: (blocks: Block[]) => void;
}) {
  const [uploading, setUploading] = useState(false);

  function addParagraph() {
    onChange([...(value || []), { type: "paragraph", text: "" }]);
  }
  function addImage(url: string) {
    onChange([...(value || []), { type: "image", url }]);
  }
  function addVideo(url: string) {
    onChange([...(value || []), { type: "video", url }]);
  }
  function move(index: number, dir: -1 | 1) {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function remove(index: number) {
    const next = value.slice();
    next.splice(index, 1);
    onChange(next);
  }

  async function uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/uploads", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok || !data?.success) throw new Error(data?.message || "Upload failed");
    return data.url as string;
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      addImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.currentTarget.value = "";
    }
  }

  async function handleVideoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      addVideo(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.currentTarget.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button type="button" className="border px-3 py-1 rounded" onClick={addParagraph}>
          + Paragraph
        </button>
        <label className="border px-3 py-1 rounded cursor-pointer">
          + Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        </label>
        <label className="border px-3 py-1 rounded cursor-pointer">
          + Video
          <input type="file" accept="video/*" className="hidden" onChange={handleVideoPick} />
        </label>
        {uploading ? <span className="text-xs text-gray-500">Uploading...</span> : null}
      </div>

      <div className="space-y-4">
        {value?.map((block, i) => (
          <div key={i} className="border rounded p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs uppercase tracking-wide text-gray-500">{block.type}</div>
              <div className="flex gap-2">
                <button type="button" className="text-xs underline" onClick={() => move(i, -1)}>
                  Up
                </button>
                <button type="button" className="text-xs underline" onClick={() => move(i, 1)}>
                  Down
                </button>
                <button type="button" className="text-xs text-red-600 underline" onClick={() => remove(i)}>
                  Remove
                </button>
              </div>
            </div>
            {block.type === "paragraph" ? (
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[120px]"
                value={block.text}
                onChange={(e) => {
                  const next = [...value];
                  (next[i] as any).text = e.target.value;
                  onChange(next);
                }}
                placeholder="Write text..."
              />
            ) : null}
            {block.type === "image" ? (
              <div className="space-y-2">
                <img src={block.url} alt={block.alt || ""} className="max-h-64 rounded" />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Alt text"
                  value={block.alt || ""}
                  onChange={(e) => {
                    const next = [...value];
                    (next[i] as any).alt = e.target.value;
                    onChange(next);
                  }}
                />
              </div>
            ) : null}
            {block.type === "video" ? (
              <div className="space-y-2">
                <video src={block.url} controls className="w-full max-h-80 rounded" />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Title (optional)"
                  value={block.title || ""}
                  onChange={(e) => {
                    const next = [...value];
                    (next[i] as any).title = e.target.value;
                    onChange(next);
                  }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
