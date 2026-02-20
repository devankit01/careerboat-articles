"use client";

import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontSize from "@/components/tiptap/FontSize";


import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Video from "@/components/tiptap/Video";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import Placeholder from "@tiptap/extension-placeholder";

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  header?: string | null;
  content: any;
  tags?: string | null;
  thumbnail?: string | null;
  media?: { url: string }[];
  status?: "Draft" | "Published";
};

export default function AdminArticleForm({
  mode,
  initialArticle,
}: {
  mode: "create" | "edit";
  initialArticle?: AdminArticle;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialArticle?.title ?? "");
  const [header, setHeader] = useState(initialArticle?.header ?? "");

  function blocksToHtml(blocks: any[]): string {
    if (!Array.isArray(blocks)) return "";
    return blocks
      .map((b) => {
        if (!b || typeof b !== "object") return "";
        switch (b.type) {
          case "paragraph":
            return `<p>${(b.text || "").toString()}</p>`;
          case "image":
            return `<p></p><img src="${b.url || ""}" alt="${(
              b.alt || ""
            ).toString()}"><p></p>`;
          case "video":
            return `<p></p><video src="${b.url || ""
              }" controls></video><p></p>`;
          default:
            return "";
        }
      })
      .join("");
  }

  async function handlePickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file || !editor) return;
    if (file.size > 50 * 1024 * 1024) {
      setError("Video must be less than 50MB");
      return;
    }
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.url)
        throw new Error(data?.message || "Upload failed");
      editor
        .chain()
        .focus()
        .insertContent([
          { type: "paragraph" },
          { type: "video", attrs: { src: data.url, controls: true } },
          { type: "paragraph" },
        ])
        .run();
    } catch (err: any) {
      setError(err?.message || "Failed to upload video");
    }
  }

  const [html, setHtml] = useState<string>(() => {
    if (typeof initialArticle?.content === "string")
      return initialArticle.content;
    if (Array.isArray(initialArticle?.content))
      return blocksToHtml(initialArticle!.content as any[]);
    return "";
  });
  const [tags, setTags] = useState(initialArticle?.tags ?? "");
  const [status, setStatus] = useState<"Draft" | "Published">(
    (initialArticle?.status as any) === "Published" ? "Published" : "Draft"
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),


      TextStyle,
      FontSize,               // 🔹 font-size + color base
      Color,                     // 🔹 text color
      Highlight.configure({ multicolor: true }),

      Image.configure({ inline: false, allowBase64: false }),
      Video.configure({
        HTMLAttributes: { controls: true },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your article content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: html || "",
    immediatelyRender: false,
    autofocus: "end",
    editable: true,
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (initialArticle?.id) {
      setTitle(initialArticle?.title ?? "");
      setHeader(initialArticle?.header ?? "");
      const content =
        typeof initialArticle?.content === "string"
          ? (initialArticle.content as string)
          : Array.isArray(initialArticle?.content)
            ? blocksToHtml(initialArticle.content as any[])
            : "";
      setHtml(content);
      setStatus(
        (initialArticle?.status as any) === "Published" ? "Published" : "Draft"
      );
    }
  }, [initialArticle?.id]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(true);
    if (html && editor.getHTML() !== html) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
    editor.commands.focus("end");
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    if (typeof html === "string" && html !== editor.getHTML()) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [html, editor]);

  async function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.currentTarget.value = "";
    if (!file || !editor) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/uploads", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data?.success || !data?.url)
        throw new Error(data?.message || "Upload failed");
      editor
        .chain()
        .focus()
        .insertContent([
          { type: "paragraph" },
          { type: "image", attrs: { src: data.url } },
          { type: "paragraph" },
        ])
        .run();
    } catch (err: any) {
      setError(err?.message || "Failed to upload image");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (!title.trim()) throw new Error("Title is required");
      if (!html || html === "<p></p>")
        throw new Error("Content cannot be empty");
      const form = new FormData();
      form.append("title", title);
      form.append("header", header || "");
      form.append("content", html);
      form.append("tags", tags || "");
      form.append("status", status);
      if (thumbnailFile) form.append("thumbnail", thumbnailFile);
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/admin/articles", {
          method: "POST",
          body: form,
        });
      } else {
        if (!initialArticle?.id) throw new Error("Missing article id");
        res = await fetch(`/api/admin/articles/${initialArticle.id}`, {
          method: "PUT",
          body: form,
        });
      }
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to submit");
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-3">


      <form onSubmit={onSubmit} className="max- space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold mb-8">
            {mode === "create" ? "Create Blog" : "Edit Blog"}
          </h1>
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold">Title</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Subtitle</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Brief description or subtitle"
            value={header ?? ""}
            onChange={(e) => setHeader(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
        </div>

        <div className="space-y-2 relative">
          <label className="block text-base font-semibold h-2 ">Content</label>
          {/* <div className="flex items-center gap-2 pb-2 absolute top right"> */}
          <div className="
    sticky
    top-0 
    right-0 
    flex 
    items-center 
    gap-2 
    bg-white 
    z-10 
    p-2    
  ">
            <button
              type="button"
              className="border rounded px-2 py-1 text-sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <select
              className="border rounded px-2 py-1 text-sm"
              onChange={(e) =>
                editor?.chain().focus().setMark("textStyle", {
                  fontSize: e.target.value,
                }).run()
              }
            >
              <option value="">Size</option>
              <option value="12px">10</option>
              <option value="12px">11</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="24px">28</option>
            </select>
            <input
              type="color"
              title="Text Color"
              onChange={(e) =>
                editor?.chain().focus().setColor(e.target.value).run()
              }
            />

            <button
              type="button"
              className="border rounded px-2 py-1 text-sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <label
              className="border rounded flex justify-center items-center px-2 py-1 text-sm cursor-pointer"
              title="Insert Image"
            >
              <div className="inline-flex items-center gap-1">
                <ImageIcon className="h-4 w-4" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePickImage}
              />
            </label>
            <label
              className="border rounded flex justify-center items-center px-2 py-1 text-sm cursor-pointer"
              title="Insert Video"
            >
              <div className="inline-flex items-center gap-1">
                <VideoIcon className="h-4 w-4" />
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handlePickVideo}
              />
            </label>
          </div>
          <div className="border rounded-md">
            {editor ? (
              <EditorContent
                editor={editor}
                className="tiptap prose max-w-none p-3 min-h-[440px] 
                  focus:outline-none 
    focus-visible:outline-none"
              />
            ) : (
              <div className="p-3 text-sm text-gray-500">Loading editor…</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold">
            Tags (comma separated, max 5)
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
            value={tags ?? ""}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-base font-semibold">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black"
          />
          {thumbnailFile && (
            <p className="text-sm text-gray-600">✓ {thumbnailFile.name}</p>
          )}
        </div>

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-10">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-[#4F47E5] text-white text-sm cursor-pointer rounded-lg font-semibold disabled:cursor-not-allowed disabled:opacity-80 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : mode === "create" ? (
              "Create Blog"
            ) : (
              "Update Blog"
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 cursor-pointer text-black text-sm rounded-lg font-semibold hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </form>

    </div>
  );
}
