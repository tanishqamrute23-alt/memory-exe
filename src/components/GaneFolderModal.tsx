"use client";

import React from "react";
import { RetroWindow } from "./RetroWindow";
import { GaneFolderIcon } from "./Icons";
import { songs, Song } from "@/data/songs";

interface GaneFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  onSelectSong: (song: Song) => void;
}

export const GaneFolderModal: React.FC<GaneFolderModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
  onSelectSong,
}) => {
  return (
    <RetroWindow
      id="gane-folder-window"
      title="C:\Documents\My Music\गाने"
      icon={<GaneFolderIcon className="w-4 h-4" />}
      isOpen={isOpen}
      onClose={onClose}
      zIndex={zIndex}
      onFocus={onFocus}
      initialX={100}
      initialY={150}
      initialWidth={500}
      initialHeight={340}
    >
      <div className="flex flex-col h-full text-xs font-sans">
        <div className="win-bevel-inset bg-[#ece9d8] p-2 mb-2 flex justify-between items-center text-[#444444]">
          <span className="font-bold text-[#000080]">Folder: गाने (90s & 2000s Hits)</span>
          <span className="text-[10px] text-[#666666]">{songs.length} audio shortcuts</span>
        </div>

        <div className="win-bevel-inset bg-white flex-1 p-3 overflow-y-auto max-h-[220px] grid grid-cols-2 md:grid-cols-3 gap-2">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="win-bevel p-2 bg-[#fdfdfd] hover:bg-[#000080] hover:text-white cursor-pointer rounded flex flex-col items-center text-center gap-1 group transition-colors"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">🎵</span>
              <span className="font-semibold text-xs truncate w-full">{song.title}</span>
              <span className="text-[10px] opacity-75 truncate w-full">{song.artist}</span>
            </div>
          ))}
        </div>
      </div>
    </RetroWindow>
  );
};
