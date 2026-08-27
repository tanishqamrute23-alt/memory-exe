"use client";

import React, { useEffect, useState } from "react";
import { Song } from "@/data/songs";
import { StartGlyphIcon } from "./Icons";

export interface TaskbarWindowItem {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isActive?: boolean;
}

interface TaskbarProps {
  isStartOpen: boolean;
  onToggleStart: () => void;
  windows: TaskbarWindowItem[];
  listenerCount: number;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isStartOpen,
  onToggleStart,
  windows,
  listenerCount,
}) => {
  const [istTime, setIstTime] = useState("");
  const [showColon, setShowColon] = useState(true);

  // Live IST Clock with Blinking Colon
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Convert to IST (UTC + 5:30)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const timeString = new Intl.DateTimeFormat("en-IN", options).format(now);
      setIstTime(timeString);
    };

    updateTime();
    const timer = setInterval(() => {
      updateTime();
      setShowColon((prev) => !prev);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with blinking colon
  const formattedIstTime = istTime
    ? istTime.replace(":", showColon ? ":" : " ")
    : "12:00 PM";

  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <div className="w-full h-10 win-bevel bg-[#c0c0c0] flex items-center justify-between px-1 z-[1000] select-none font-sans text-xs">
      {/* Left section: Start button + Dynamic Open Window buttons */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-x-auto">
        {/* Start Button */}
        <button
          onClick={onToggleStart}
          className={`win-button px-2.5 py-1 font-bold flex items-center gap-1.5 min-w-[75px] text-xs flex-shrink-0 ${
            isStartOpen ? "win-bevel-inset bg-[#dfdfdf]" : "bg-[#ece9d8]"
          }`}
        >
          <StartGlyphIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-black font-extrabold tracking-wide">start</span>
        </button>

        <div className="h-5 w-[2px] bg-[#808080] border-r border-white mx-0.5 flex-shrink-0" />

        {/* Dynamic Taskbar Window Buttons */}
        {openWindows.map((win) => (
          <button
            key={win.id}
            onClick={win.onToggle}
            className={`win-button px-2 py-1 max-w-[150px] md:max-w-[220px] truncate flex items-center gap-1.5 text-xs flex-shrink-0 ${
              win.isActive
                ? "win-bevel-inset bg-[#dfdfdf] font-bold text-[#000080]"
                : "bg-[#ece9d8] text-black hover:bg-[#f0ede0]"
            }`}
            title={win.title}
          >
            {win.icon && <span className="flex-shrink-0 text-xs">{win.icon}</span>}
            <span className="truncate">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Right section: System Tray */}
      <div className="win-bevel-inset bg-[#c0c0c0] px-2 py-0.5 flex items-center gap-2.5 flex-shrink-0 text-xs font-medium">
        {/* Weather Indicator */}
        <span className="hidden sm:inline-block text-[#333333] text-[11px]" title="Local Weather">
          🌤️ Delhi 32°C
        </span>

        {/* Active Listener Count Badge */}
        <div className="flex items-center gap-1 bg-[#e0e0e0] px-1.5 py-0.5 rounded border border-[#a0a0a0]" title="Active listeners online right now">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="font-bold text-[#000080] text-[11px]">{listenerCount} online</span>
        </div>

        {/* Live IST Clock with Blinking Colon */}
        <div className="font-mono text-xs font-bold text-black min-w-[65px] text-center tracking-wider">
          {formattedIstTime}
        </div>
      </div>
    </div>
  );
};
