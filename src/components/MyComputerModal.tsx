"use client";

import React from "react";
import { RetroWindow } from "./RetroWindow";
import { MyComputerIcon } from "./Icons";

interface MyComputerModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const MyComputerModal: React.FC<MyComputerModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  return (
    <RetroWindow
      id="my-computer-window"
      title="My Computer"
      icon={<MyComputerIcon className="w-4 h-4" />}
      isOpen={isOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialX={150}
      initialY={120}
      initialWidth={450}
      initialHeight={300}
    >
      <div className="flex flex-col h-full text-xs font-sans">
        <div className="win-bevel-inset bg-white p-2 mb-2 text-[#555555]">
          System drives & devices
        </div>

        <div className="win-bevel-inset bg-white flex-1 p-4 grid grid-cols-2 gap-4">
          <div className="win-bevel p-2 flex items-center gap-3 bg-[#f8f8f8]">
            <span className="text-2xl">💽</span>
            <div>
              <div className="font-bold text-black">Local Disk (C:)</div>
              <div className="text-[10px] text-gray-500">NTFS — 14.2 GB free of 40.0 GB</div>
            </div>
          </div>

          <div className="win-bevel p-2 flex items-center gap-3 bg-[#f8f8f8]">
            <span className="text-2xl">📀</span>
            <div>
              <div className="font-bold text-black">CD Drive (D:) - Bollywood 2000s</div>
              <div className="text-[10px] text-gray-500">Audio CD — 18 Tracks</div>
            </div>
          </div>

          <div className="win-bevel p-2 flex items-center gap-3 bg-[#f8f8f8]">
            <span className="text-2xl">💾</span>
            <div>
              <div className="font-bold text-black">3½ Floppy (A:)</div>
              <div className="text-[10px] text-gray-500">1.44 MB</div>
            </div>
          </div>

          <div className="win-bevel p-2 flex items-center gap-3 bg-[#f8f8f8]">
            <span className="text-2xl">🌐</span>
            <div>
              <div className="font-bold text-black">Dial-up Network</div>
              <div className="text-[10px] text-gray-500">Connected 56kbps</div>
            </div>
          </div>
        </div>
      </div>
    </RetroWindow>
  );
};
