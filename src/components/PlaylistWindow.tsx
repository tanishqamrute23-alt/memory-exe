"use client";

import React from "react";
import { Song, songs } from "@/data/songs";
import { RetroWindow } from "./RetroWindow";
import { MusicFolderIcon } from "./Icons";

interface PlaylistWindowProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
}

export const PlaylistWindow: React.FC<PlaylistWindowProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
  currentSong,
  isPlaying,
  onSelectSong,
}) => {
  return (
    <RetroWindow
      id="playlist-window"
      title="Memory.exe - Master Playlist [Bollywood Hits 1990s - 2000s]"
      icon={<MusicFolderIcon className="w-4 h-4" />}
      isOpen={isOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialX={140}
      initialY={70}
      initialWidth={560}
      initialHeight={380}
    >
      <div className="flex flex-col h-full text-xs font-sans">
        {/* Top Info Bar */}
        <div className="win-bevel-inset bg-[#ece9d8] p-1.5 sm:p-2 mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-[#333333]">
          <div>
            <span className="font-bold text-[#000080]">Playlist:</span> {songs.length} Tracks loaded
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#666666]">
            Click any track to play
          </div>
        </div>

        {/* Songs List Table */}
        <div className="win-bevel-inset bg-white flex-1 overflow-x-auto overflow-y-auto max-h-[50vh] sm:max-h-[260px]">
          <table className="w-full text-left border-collapse min-w-[340px]">
            <thead className="sticky top-0 z-20 bg-[#c0c0c0]">
              <tr className="win-bevel bg-[#c0c0c0] text-black font-bold text-[10px] sm:text-[11px]">
                <th className="p-1 sm:p-1.5 border-r border-[#808080] w-6 sm:w-8 text-center bg-[#c0c0c0]">#</th>
                <th className="p-1 sm:p-1.5 border-r border-[#808080] bg-[#c0c0c0]">Song Title</th>
                <th className="p-1 sm:p-1.5 border-r border-[#808080] bg-[#c0c0c0]">Artist</th>
                <th className="p-1 sm:p-1.5 border-r border-[#808080] w-10 sm:w-14 text-center bg-[#c0c0c0]">Year</th>
                <th className="p-1 sm:p-1.5 w-12 sm:w-16 text-center bg-[#c0c0c0]">Duration</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => {
                const isSelected = currentSong?.id === song.id;
                return (
                  <tr
                    key={song.id}
                    onClick={() => onSelectSong(song)}
                    className={`cursor-pointer border-b border-[#f0f0f0] transition-colors ${
                      isSelected
                        ? "bg-[#000080] text-white font-semibold"
                        : index % 2 === 0
                        ? "bg-white text-black hover:bg-[#e8f2fe]"
                        : "bg-[#f9f9f9] text-black hover:bg-[#e8f2fe]"
                    }`}
                  >
                    <td className="p-1 sm:p-1.5 text-center font-mono text-[10px] sm:text-[11px]">
                      {isSelected && isPlaying ? (
                        <span className="text-[#00ff66] font-bold animate-pulse">▶</span>
                      ) : (
                        (index + 1).toString().padStart(2, "0")
                      )}
                    </td>
                    <td className="p-1 sm:p-1.5 font-medium truncate max-w-[110px] sm:max-w-[180px]">
                      {song.title}
                    </td>
                    <td className="p-1 sm:p-1.5 opacity-90 truncate max-w-[100px] sm:max-w-[180px]">
                      {song.artist}
                    </td>
                    <td className="p-1 sm:p-1.5 text-center opacity-80">{song.year}</td>
                    <td className="p-1 sm:p-1.5 text-center font-mono text-[10px] sm:text-[11px] opacity-80">
                      {song.duration || "--:--"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info status */}
        <div className="mt-1.5 text-[9px] sm:text-[11px] text-[#555555] flex flex-col sm:flex-row justify-between px-1 gap-0.5">
          <span>Source: Official YouTube Audio</span>
          <span>Quality: 320 kbps (Emulated)</span>
        </div>
      </div>
    </RetroWindow>
  );
};
