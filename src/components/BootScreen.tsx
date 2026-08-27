"use client";

import React, { useEffect, useState } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-[99999] bg-black text-[#00ff66] font-mono p-6 flex flex-col justify-between select-none cursor-pointer"
    >
      <div className="flex flex-col gap-2 text-xs md:text-sm leading-relaxed">
        <div className="text-white font-bold text-base md:text-lg">
          MEMORY.EXE BIOS v2.00 (C) 2000-2007 Memory Systems Inc.
        </div>
        <div>CPU: Nostalgia Pentium III @ 800 MHz</div>
        <div>Memory Test: 524288K OK</div>
        <div className="text-gray-400">Detecting Primary Audio Device... OK (Sound Blaster 16)</div>
        <div className="text-gray-400">Loading Bollywood Memories Kernel... OK</div>
        <div className="mt-4 text-yellow-300">
          Mounting wallpaper landscape/portrait assets...
        </div>
        <div className="text-cyan-400">Initializing YouTube Audio Pipeline...</div>
      </div>

      {/* Center Logo & Progress */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="glow-title text-4xl md:text-6xl font-bold tracking-widest mb-4">
          Memory.exe
        </div>
        <div className="text-gray-300 text-xs md:text-sm mb-6 text-center">
          Back when moments were saved, not posted.
        </div>

        {/* Loading Bar */}
        <div className="w-64 md:w-96 h-5 border-2 border-[#00ff66] p-0.5 relative bg-[#001100]">
          <div
            className="h-full bg-gradient-to-r from-[#00aa44] to-[#00ff66] transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs mt-2 text-gray-400">
          Starting Windows... {progress}%
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs animate-pulse">
        [ Click anywhere to skip boot sequence ]
      </div>
    </div>
  );
};
