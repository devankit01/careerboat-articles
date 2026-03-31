'use client';

import { useEffect, useRef, useState } from 'react';
import { Share2 } from "lucide-react";

type ShareMenuProps = {
  shareUrl: string;
  shareText: string;
};

const shareOptions = [
  {
    name: 'Copy URL',
    kind: 'copy' as const,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 stroke-current" fill="none" strokeWidth="1.8">
        <path d="M9 9.5a3.5 3.5 0 0 1 3.5-3.5h4A3.5 3.5 0 0 1 20 9.5v4a3.5 3.5 0 0 1-3.5 3.5h-4A3.5 3.5 0 0 1 9 13.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 14.5A3.5 3.5 0 0 1 11.5 18h-4A3.5 3.5 0 0 1 4 14.5v-4A3.5 3.5 0 0 1 7.5 7h4A3.5 3.5 0 0 1 15 10.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Facebook',
    kind: 'link' as const,
    href: (shareUrl: string) => `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.1c0-.9.3-1.6 1.7-1.6H16V4.8c-.3 0-.9-.1-1.8-.1-2.7 0-4.5 1.7-4.5 4.7V11H7v3h2.9v7h3.6Z" />
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    kind: 'link' as const,
    href: (shareUrl: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M6.8 8.4A1.9 1.9 0 1 1 6.8 4.6a1.9 1.9 0 0 1 0 3.8ZM5.1 19.5V9.9h3.4v9.6H5.1Zm5.5 0V9.9h3.2v1.3h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.9v5.1h-3.4V15c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5v4.6h-3.5Z" />
      </svg>
    )
  },
  {
    name: 'X',
    kind: 'link' as const,
    href: (shareUrl: string, shareText: string) => `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M18.9 3H21l-4.6 5.3L21.8 21h-4.2l-3.3-4.8L10.1 21H8l4.9-5.7L2.6 3h4.3l3 4.4L13.7 3h2.1l-4.8 5.5 3.8 5.5L18.9 3Z" />
      </svg>
    )
  },
  {
    name: 'Reddit',
    kind: 'link' as const,
    href: (shareUrl: string, shareText: string) => `https://www.reddit.com/submit?url=${shareUrl}&title=${shareText}`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M14.6 8.1 15.4 4l2.9.6a1.7 1.7 0 1 0 .3-1.4l-3.9-.8a.7.7 0 0 0-.8.6l-.9 4.5a8.5 8.5 0 0 0-4.9.8 2.2 2.2 0 1 0-1.8 3.6v.2c0 3.1 3.1 5.6 6.9 5.6s6.9-2.5 6.9-5.6v-.2a2.2 2.2 0 1 0-1.9-3.6 8.4 8.4 0 0 0-3.6-.9ZM9.4 11.8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm5.3-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-5 4.1a.7.7 0 0 1 1 0c.5.5 1.3.7 2.2.7.9 0 1.7-.2 2.2-.7a.7.7 0 1 1 1 1c-.8.8-2 .9-3.2.9s-2.4-.1-3.2-.9a.7.7 0 0 1 0-1Z" />
      </svg>
    )
  },
  {
    name: 'YouTube',
    kind: 'copy' as const,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8ZM10.3 15.1V8.9l5.4 3.1-5.4 3.1Z" />
      </svg>
    )
  }
];

export default function ShareMenu({ shareUrl, shareText }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const copyToClipboard = async (label: string) => {
    try {
      await navigator.clipboard.writeText(decodeURIComponent(shareUrl));
      setCopiedLabel(label);
      window.setTimeout(() => setCopiedLabel(null), 1800);
      setOpen(false);
    } catch {
      setCopiedLabel(null);
    }
  };

  return (
    <div ref={containerRef} className="relative ml-auto">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#e7bc38] bg-[#ffd152] px-3 py-2 text-sm font-semibold text-ink shadow-[0_8px_18px_rgba(186,154,32,0.18)] transition hover:bg-[#f3c640]"
      >
 <Share2 size={16} className="text-[#1E1E1E]" />
        Share
      </button>
      {copiedLabel ? <p className="mt-2 text-right text-xs font-medium text-[#7b5b00]">{copiedLabel} copied</p> : null}

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-52 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_40px_rgba(27,39,94,0.14)]">
          <p className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-clay">Share this post</p>
          <div className="grid gap-1">
            {shareOptions.map((option) => (
              option.kind === 'link' ? (
                <a
                  key={option.name}
                  href={option.href(shareUrl, shareText)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-ink transition hover:bg-[#f6f7ff]"
                  onClick={() => setOpen(false)}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff] text-[#3f36c4]">
                    {option.icon}
                  </span>
                  <span>{option.name}</span>
                </a>
              ) : (
                <button
                  key={option.name}
                  type="button"
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-[#f6f7ff]"
                  onClick={() => copyToClipboard(option.name)}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff6d9] text-[#a46d00]">
                    {option.icon}
                  </span>
                  <span>{option.name}</span>
                </button>
              )
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
