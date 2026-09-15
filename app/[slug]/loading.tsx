export default function Loading() {
  return (
    <main className="mx-auto w-[min(1120px,92vw)] py-10 lg:py-12">
      <section className="rounded-2xl border border-line bg-white p-6 md:p-10">
        <div className="skeleton h-10 w-4/5 rounded-md md:h-14" />
        <div className="mt-5 flex gap-4">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-4 w-40 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="skeleton mt-4 h-[160px] w-full rounded-2xl md:h-[420px]" />
      </section>
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_290px]">
        <div className="rounded-2xl border border-line bg-white p-5 md:p-7">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton mt-3 h-4 w-full rounded" />
          <div className="skeleton mt-3 h-4 w-5/6 rounded" />
          <div className="skeleton mt-3 h-4 w-2/3 rounded" />
        </div>
        <div className="hidden h-fit rounded-2xl border border-line bg-white p-5 lg:block">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton mt-4 h-4 w-full rounded" />
          <div className="skeleton mt-3 h-4 w-5/6 rounded" />
          <div className="skeleton mt-3 h-4 w-2/3 rounded" />
        </div>
      </section>
    </main>
  );
}
