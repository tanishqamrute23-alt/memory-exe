"use client";

import React from "react";
import { RetroWindow } from "./RetroWindow";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  return (
    <RetroWindow
      id="about-window"
      title="About Memory.exe"
      isOpen={isOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialX={200}
      initialY={150}
      initialWidth={400}
      initialHeight={260}
    >
      <div className="flex flex-col gap-3 p-2 text-xs font-sans">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#000080] to-[#1084d0] rounded flex items-center justify-center text-white text-xl font-bold font-mono">
            M
          </div>
          <div>
            <div className="text-base font-bold text-[#000080]">Memory.exe</div>
            <div className="text-gray-600">Version 2.0.0 (Build 2007)</div>
          </div>
        </div>

        <div className="win-bevel-inset bg-white p-3 leading-relaxed text-[#333333]">
          <p className="font-bold text-black mb-1">
            "Back when moments were saved, not posted."
          </p>
          <p className="text-[11px] text-gray-700">
            Memory.exe turns your browser into an early-2000s personal computer desktop, dedicated to classic Bollywood hits from 1990s and 2000s.
          </p>
          <p className="mt-2 text-[10px] text-gray-500 border-t border-gray-200 pt-1">
            Created with nostalgia. Designed for Next.js, Vercel & YouTube API.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="win-button px-4 py-1 font-bold text-xs"
          >
            OK
          </button>
        </div>
      </div>
    </RetroWindow>
  );
};
