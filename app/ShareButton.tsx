"use client";

import React, { useMemo } from "react";
import { RWebShare } from "react-web-share";
import { Share2 } from "lucide-react";

export interface ShareButtonProps {
  url: string | number;
}

const ShareButton: React.FC<ShareButtonProps> = ({url }) => {
  // window access safe way
  const jobUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${url}`;
  }, [url]);

  return (
    <RWebShare
      data={{
        url: jobUrl,
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation(); // parent card click prevent
      }}
    >
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="md:text-sm text-xs md:px-6 px-4 py-1.5 font-bold cursor-pointer rounded-md border border-[#006b6a] bg-[#006b6a] text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150 ease-in-out"
      >
Share
      </button>
    </RWebShare>
  );
};

export default ShareButton;
