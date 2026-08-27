"use client";

import React, { useState, useRef, useEffect } from "react";

interface RetroWindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  zIndex: number;
  onFocus: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
  children: React.ReactNode;
  canClose?: boolean;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  id,
  title,
  icon,
  isOpen,
  onClose,
  onMinimize,
  zIndex,
  onFocus,
  initialX = 130,
  initialY = 70,
  initialWidth = 480,
  initialHeight = 360,
  children,
  canClose = true,
}) => {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight });
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: initialX, y: initialY });
  const [prevSize, setPrevSize] = useState({ w: initialWidth, h: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  // Responsive boundary safety and mobile auto-fit on mount & resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 640;
        const targetWidth = isMobile
          ? Math.min(initialWidth, window.innerWidth - 16)
          : initialWidth;
        const maxX = Math.max(8, window.innerWidth - targetWidth - 8);
        const maxY = Math.max(8, window.innerHeight - initialHeight - 55);
        const safeX = isMobile
          ? Math.max(8, Math.floor((window.innerWidth - targetWidth) / 2))
          : Math.min(initialX, maxX);
        const safeY = isMobile ? 50 : Math.min(initialY, maxY);
        setPos({ x: safeX, y: safeY });
        setSize({ w: targetWidth, h: initialHeight });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialX, initialY, initialWidth, initialHeight]);

  if (!isOpen) return null;

  const handlePointerDownHeader = (e: React.PointerEvent) => {
    if (isMaximized) return; // Prevent drag when maximized
    e.stopPropagation();
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveHeader = (e: React.PointerEvent) => {
    if (!isDragging || isMaximized) return;
    const maxX = Math.max(0, window.innerWidth - size.w);
    const newX = Math.max(0, Math.min(maxX, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 55, e.clientY - dragOffset.y));
    setPos({ x: newX, y: newY });
  };

  const handlePointerUpHeader = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  const handleToggleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined") return;
    if (isMaximized) {
      setPos(prevPos);
      setSize(prevSize);
      setIsMaximized(false);
    } else {
      setPrevPos(pos);
      setPrevSize(size);
      setPos({ x: 5, y: 5 });
      setSize({
        w: Math.max(300, window.innerWidth - 10),
        h: Math.max(250, window.innerHeight - 55),
      });
      setIsMaximized(true);
    }
  };

  const handleMinimizeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMinimize) {
      onMinimize();
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={windowRef}
      onClick={onFocus}
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size.w}px`,
        height: isMaximized ? `${size.h}px` : "auto",
        zIndex: zIndex,
        maxWidth: isMaximized ? "100vw" : "calc(100vw - 16px)",
      }}
      className="win-bevel p-[3px] shadow-2xl flex flex-col font-sans select-none"
    >
      {/* Title bar */}
      <div
        onPointerDown={handlePointerDownHeader}
        onPointerMove={handlePointerMoveHeader}
        onPointerUp={handlePointerUpHeader}
        className="win-titlebar px-2 py-1 flex items-center justify-between cursor-move text-xs md:text-sm select-none"
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate font-bold tracking-wide">{title}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          {/* Minimize _ */}
          <button
            onClick={handleMinimizeClick}
            className="w-4 h-4 md:w-5 md:h-5 win-button text-black font-bold flex items-center justify-center text-[10px] md:text-xs leading-none"
            title="Minimize"
          >
            _
          </button>
          {/* Maximize / Restore □ */}
          <button
            onClick={handleToggleMaximize}
            className="w-4 h-4 md:w-5 md:h-5 win-button text-black font-bold flex items-center justify-center text-[10px] md:text-xs leading-none"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? "🗗" : "□"}
          </button>
          {/* Close ✕ */}
          {canClose && (
            <button
              onClick={onClose}
              className="w-4 h-4 md:w-5 md:h-5 win-button text-black font-bold flex items-center justify-center text-xs leading-none hover:bg-red-500 hover:text-white"
              title="Close"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div
        className={`p-2 bg-[#d4d0c8] flex-1 overflow-auto ${
          isMaximized ? "h-[calc(100%-30px)] max-h-none" : "max-h-[70vh]"
        }`}
      >
        {children}
      </div>
    </div>
  );
};
