export default function Loading() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_28px_rgba(27,39,94,0.06)]">
      {/* Thumbnail */}
      <div className="skeleton h-48 w-full" style={{ borderRadius: 0 }} />

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <div className="skeleton h-5 w-4/5 rounded-md" />
        <div className="skeleton mt-2 h-5 w-3/5 rounded-md" />

        {/* Excerpt */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>

        {/* Footer strip */}
        <div className="mt-auto flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
