"use client";

import React, { useState } from "react";
import { RetroWindow } from "./RetroWindow";
import { NewFolderIcon } from "./Icons";

interface NostalgiaFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
}

export const PHOTO_FILES = [
  "pic001.jpg",
  "pic002.jpg",
  "pic003.jpg",
  "pic004.jpg",
  "pic005.jpg",
  "pic006.jpg",
  "pic007.jpg",
  "pic008.jpg",
  "pic009.jpg",
  "pic010.jpg",
  "pic011.jpg",
  "pic012.jpg",
  "pic013.jpg",
  "pic014.jpg",
  "pic015.jpg",
  "pic016.jpg",
  "pic017.jpg",
  "pic018.jpg",
  "pic019.jpg",
  "pico20.jpg",
  "pic021.jpg",
  "pic022.jpg",
  "pic023.jpg",
  "pic024.jpg",
  "pic025.jpg",
  "pic026.jpg",
  "pic027.jpg",
  "pic028.jpg",
  "pic029.jpg",
  "pic030.jpg",
  "pic031.jpg",
  "pic032.jpg",
  "pic033.jpg",
  "pic034.jpg",
  "pic035.jpg",
  "pic036.jpg",
];

export const NewFolderModal: React.FC<NostalgiaFolderModalProps> = ({
  isOpen,
  onClose,
  zIndex,
  onFocus,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === 0 ? PHOTO_FILES.length - 1 : (prev ?? 0) - 1
      );
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === PHOTO_FILES.length - 1 ? 0 : (prev ?? 0) + 1
      );
    }
  };

  const currentPhoto = selectedPhotoIndex !== null ? PHOTO_FILES[selectedPhotoIndex] : null;

  return (
    <>
      <RetroWindow
        id="nostalgia-folder-window"
        title="nostalgia"
        icon={<NewFolderIcon className="w-4 h-4" />}
        isOpen={isOpen}
        onClose={onClose}
        zIndex={zIndex}
        onFocus={onFocus}
        initialX={180}
        initialY={90}
        initialWidth={560}
        initialHeight={420}
      >
        <div className="flex flex-col h-full text-xs font-sans">
          {/* Header Info */}
          <div className="win-bevel-inset bg-[#ece9d8] p-2 mb-2 flex items-center justify-between text-[#333333]">
            <div>
              <span className="font-bold text-[#000080]">Folder:</span> nostalgia ({PHOTO_FILES.length} items)
            </div>
            <div className="text-[11px] text-[#666666]">
              Click any photo to view
            </div>
          </div>

          {/* Photos Grid Container */}
          <div className="win-bevel-inset bg-white flex-1 p-3 overflow-y-auto max-h-[300px] sm:max-h-[320px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {PHOTO_FILES.map((fileName, index) => (
                <div
                  key={fileName}
                  onClick={() => setSelectedPhotoIndex(index)}
                  onDoubleClick={() => setSelectedPhotoIndex(index)}
                  className="flex flex-col items-center gap-1.5 p-1.5 rounded hover:bg-[#000080] hover:text-white cursor-pointer group text-center border border-transparent hover:border-[#000080] transition-all select-none"
                  title={fileName}
                >
                  <div className="w-14 h-14 bg-[#ece9d8] border border-[#808080] flex items-center justify-center overflow-hidden p-0.5 shadow-sm group-hover:scale-105 transition-transform">
                    {/* Thumbnail preview */}
                    <img
                      src={`/Photos/${fileName}`}
                      alt={fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="truncate w-full text-[11px] font-mono">
                    {fileName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-2 text-[11px] text-[#555555] flex justify-between px-1">
            <span>36 JPG Image(s)</span>
            <span>Location: C:\Desktop\nostalgia</span>
          </div>
        </div>
      </RetroWindow>

      {/* Windows Picture and Fax Viewer Modal */}
      {selectedPhotoIndex !== null && currentPhoto !== null && (
        <RetroWindow
          id="picture-viewer"
          title={`${currentPhoto} - Windows Picture and Fax Viewer`}
          icon={<span className="text-xs">🖼️</span>}
          isOpen={selectedPhotoIndex !== null}
          onClose={() => setSelectedPhotoIndex(null)}
          zIndex={zIndex + 20}
          onFocus={onFocus}
          initialX={140}
          initialY={60}
          initialWidth={580}
          initialHeight={460}
        >
          <div className="flex flex-col h-full bg-[#808080] p-1 text-xs select-none">
            {/* Picture Display Canvas Area */}
            <div className="win-bevel-inset bg-[#333333] flex-1 flex items-center justify-center overflow-auto p-2 min-h-[280px] relative">
              <img
                src={`/Photos/${currentPhoto}`}
                alt={currentPhoto}
                className={`max-h-[280px] sm:max-h-[320px] w-auto object-contain transition-transform duration-200 ${
                  isZoomed ? "scale-125" : "scale-100"
                }`}
              />
            </div>

            {/* Retro Toolbar Controls */}
            <div className="win-bevel bg-[#c0c0c0] p-1.5 mt-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPhoto}
                  className="win-button px-2.5 py-1 font-bold text-xs active:translate-y-0.5"
                  title="Previous Image (Left Arrow)"
                >
                  ⏮ Prev
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="win-button px-2.5 py-1 font-bold text-xs active:translate-y-0.5"
                  title="Next Image (Right Arrow)"
                >
                  Next ⏭
                </button>
                <button
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className="win-button px-2 py-1 text-xs active:translate-y-0.5"
                  title="Toggle Zoom"
                >
                  🔍 {isZoomed ? "100%" : "Zoom"}
                </button>
              </div>

              <div className="font-mono text-[11px] font-bold text-[#000080] bg-[#e0e0e0] px-2 py-0.5 rounded border border-[#a0a0a0]">
                Photo {selectedPhotoIndex + 1} of {PHOTO_FILES.length} ({currentPhoto})
              </div>
            </div>
          </div>
        </RetroWindow>
      )}
    </>
  );
};
