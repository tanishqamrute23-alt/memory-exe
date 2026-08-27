"use client";

import React, { useRef } from "react";
import { Song } from "@/data/songs";

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onTogglePlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRewind10: () => void;
  onForward10: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  playbackSpeed: number;
  onToggleSpeed: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  currentSong,
  isPlaying,
  onTogglePlayPause,
  onNext,
  onPrev,
  onRewind10,
  onForward10,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  playbackSpeed,
  onToggleSpeed,
}) => {
  const seekRef = useRef<HTMLDivElement>(null);

  const handleSeekPointerDown = (e: React.PointerEvent) => {
    if (!seekRef.current || !duration) return;
    const rect = seekRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const moveX = moveEvent.clientX - rect.left;
      const moveRatio = Math.max(0, Math.min(1, moveX / rect.width));
      onSeek(moveRatio * duration);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full win-bevel bg-[#c0c0c0] p-1.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-2 shadow-lg border-t-2 border-white select-none">
      {/* LED Display & Marquee Title */}
      <div className="flex items-center gap-2 min-w-0 w-full md:w-auto flex-1">
        {/* LED Timer */}
        <div className="font-led px-2.5 py-1 text-sm md:text-base font-bold rounded border border-[#003311] flex-shrink-0">
          {formatTime(currentTime)}
        </div>

        {/* Marquee Song Title */}
        <div className="win-bevel-inset bg-black px-2 py-1 flex-1 overflow-hidden h-8 flex items-center">
          {currentSong ? (
            <div className="animate-marquee whitespace-nowrap text-[#00ff66] font-mono text-xs md:text-sm font-semibold">
              🎵 {currentSong.title} — {currentSong.artist} ({currentSong.year})
            </div>
          ) : (
            <span className="text-[#808080] font-mono text-xs">No Track Loaded — Double Click Playlist</span>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={onPrev}
          className="win-button px-2 py-1 text-xs font-bold flex items-center gap-1 active:translate-y-0.5"
          title="Previous Track"
        >
          ⏮
        </button>
        <button
          onClick={onRewind10}
          className="win-button px-2 py-1 text-xs font-bold active:translate-y-0.5"
          title="Back 10 Seconds"
        >
          -10s
        </button>
        <button
          onClick={onTogglePlayPause}
          className="win-button px-3 py-1 text-xs md:text-sm font-bold bg-[#ece9d8] flex items-center gap-1 active:translate-y-0.5 min-w-[50px] justify-center"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={onForward10}
          className="win-button px-2 py-1 text-xs font-bold active:translate-y-0.5"
          title="Forward 10 Seconds"
        >
          +10s
        </button>
        <button
          onClick={onNext}
          className="win-button px-2 py-1 text-xs font-bold flex items-center gap-1 active:translate-y-0.5"
          title="Next Track"
        >
          ⏭
        </button>

        {/* Speed Toggle */}
        <button
          onClick={onToggleSpeed}
          className="win-button px-2 py-1 text-xs font-bold text-[#000080] active:translate-y-0.5"
          title="Playback Speed"
        >
          {playbackSpeed}x
        </button>
      </div>

      {/* Seek Bar & Volume & Equalizer */}
      <div className="flex items-center gap-2 w-full md:w-auto flex-shrink-0">
        {/* Seek Bar */}
        <div className="flex-1 md:w-36 flex flex-col gap-0.5">
          <div
            ref={seekRef}
            onPointerDown={handleSeekPointerDown}
            className="win-bevel-inset bg-[#333333] h-3.5 w-full cursor-pointer relative overflow-hidden"
            title="Seek track"
          >
            <div
              className="bg-gradient-to-r from-[#000080] to-[#1084d0] h-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-1 text-xs">
          <span>🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-14 md:w-16 accent-[#000080] cursor-pointer"
            title={`Volume: ${volume}%`}
          />
        </div>

        {/* Animated Equalizer Bars */}
        <div
          className={`win-bevel-inset bg-black p-1 h-6 w-10 flex items-end justify-between gap-0.5 ${
            !isPlaying ? "eq-paused" : ""
          }`}
          title="Equalizer Visualizer"
        >
          <div className="w-1.5 bg-[#00ff66] rounded-t eq-bar-1" />
          <div className="w-1.5 bg-[#00ffff] rounded-t eq-bar-2" />
          <div className="w-1.5 bg-[#ffcc00] rounded-t eq-bar-3" />
          <div className="w-1.5 bg-[#ff0055] rounded-t eq-bar-4" />
        </div>
      </div>
    </div>
  );
};
