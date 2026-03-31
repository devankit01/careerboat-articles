'use client';

import { useEffect, useRef, useState } from 'react';

type Heading = {
  id: string;
  text: string;
};

type TableOfContentsProps = {
  headings: Heading[];
};

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? '');
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headingElements.length === 0) return;

    const updateActiveHeading = () => {
      const markerLine = 160;
      let nextActiveId = headingElements[0].id;

      for (const element of headingElements) {
        if (element.getBoundingClientRect().top <= markerLine) {
          nextActiveId = element.id;
        } else {
          break;
        }
      }

      setActiveId((currentId) => {
        if (currentId === nextActiveId) return currentId;
        return nextActiveId;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveHeading();
        ticking = false;
      });
    };

    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveId(hash);
      } else {
        setActiveId(headingElements[0].id);
      }
    };

    updateActiveHeading();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [headings]);

  useEffect(() => {
    if (!activeId) return;

    const activeLink = linkRefs.current[activeId];
    if (!activeLink) return;

    activeLink.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth'
    });
  }, [activeId]);

  if (headings.length === 0) {
    return <p className="mt-3 text-sm text-clay">No H2 sections found.</p>;
  }

  return (
    <nav className="mt-3 flex max-h-[min(60vh,24rem)] flex-col gap-2 overflow-y-auto border-l-2 border-[#cfd3ff] pl-3 pr-2 scroll-smooth">
      {headings.map((heading) => {
        const isActive = heading.id === activeId;

        return (
          <a
            key={heading.id}
            ref={(element) => {
              linkRefs.current[heading.id] = element;
            }}
            href={`#${heading.id}`}
            className={`rounded-r-md border-l-2 -ml-[14px] pl-3 pr-2 text-sm transition-[color,font-weight,border-color,background-color] duration-200 ease-out ${
              isActive
                ? 'border-[#4f46e5] bg-[#eef2ff] font-semibold text-ink'
                : 'border-transparent font-normal text-clay hover:text-ember'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            {heading.text}
          </a>
        );
      })}
    </nav>
  );
}
