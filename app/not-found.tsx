import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto w-[min(1120px,92vw)] py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-clay">That article may have been moved or unpublished.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-ember px-5 py-3 font-semibold text-white">
        Back to articles
      </Link>
    </main>
  );
}
