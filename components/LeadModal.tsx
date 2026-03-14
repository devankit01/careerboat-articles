'use client';

import { FormEvent, useState } from 'react';

type LeadModalProps = {
  buttonLabel: string;
  className?: string;
};

export default function LeadModal({ buttonLabel, className }: LeadModalProps) {
  const [open, setOpen] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <button
        className={className ?? 'rounded-lg bg-ember px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:bg-[#4338ca]'}
        onClick={() => setOpen(true)}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto mt-[10vh] w-[min(540px,92vw)] rounded-2xl border border-line bg-white p-6 shadow-2xl">
            <button className="absolute right-4 top-3 text-2xl text-clay" onClick={() => setOpen(false)}>
              ×
            </button>
            <h3 className="text-2xl font-bold">Get the Free Career Checklist</h3>
            <p className="mt-2 text-clay">Share your details and we will send the checklist to your email.</p>
            <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
              <input
                required
                placeholder="Your name"
                className="rounded-lg border border-line bg-[#f8faff] px-3 py-2 outline-none focus:ring-2 focus:ring-ember/30"
              />
              <input
                required
                type="email"
                placeholder="you@example.com"
                className="rounded-lg border border-line bg-[#f8faff] px-3 py-2 outline-none focus:ring-2 focus:ring-ember/30"
              />
              <button className="rounded-lg bg-ember px-5 py-3 font-semibold text-white shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:bg-[#4338ca]" type="submit">
                Send me the checklist
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
