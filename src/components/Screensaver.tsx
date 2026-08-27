"use client";

import React, { useEffect, useState } from "react";

interface ScreensaverProps {
  onDismiss: () => void;
}

export const Screensaver: React.FC<ScreensaverProps> = ({ onDismiss }) => {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [vel, setVel] = useState({ dx: 2, dy: 2 });
  const [colorIndex, setColorIndex] = useState(0);

  const colors = [
    "#00ffff",
    "#ff00ff",
    "#ffff00",
    "#00ff66",
    "#ff5500",
    "#0099ff",
  ];

  useEffect(() => {
    const updatePosition = () => {
      setPos((prev) => {
        const width = typeof window !== "undefined" ? window.innerWidth : 800;
        const height = typeof window !== "undefined" ? window.innerHeight : 600;
        let newX = prev.x + vel.dx;
        let newY = prev.y + vel.dy;
        let newDx = vel.dx;
        let newDy = vel.dy;
        let bounced = false;

        if (newX <= 10 || newX >= width - 220) {
          newDx = -vel.dx;
          bounced = true;
        }
        if (newY <= 10 || newY >= height - 80) {
          newDy = -vel.dy;
          bounced = true;
        }

        if (bounced) {
          setVel({ dx: newDx, dy: newDy });
          setColorIndex((idx) => (idx + 1) % colors.length);
        }

        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, [vel, colors.length]);

  return (
    <div
      onClick={onDismiss}
      onMouseMove={onDismiss}
      onKeyDown={onDismiss}
      className="fixed inset-0 z-[999999] bg-black select-none cursor-pointer overflow-hidden"
    >
      <div
        style={{
          position: "absolute",
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          color: colors[colorIndex],
          textShadow: `0 0 15px ${colors[colorIndex]}`,
        }}
        className="font-mono font-bold text-2xl md:text-4xl tracking-wider transition-colors duration-200"
      >
        Memory.exe
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs animate-pulse">
        Press any key or move mouse to resume
      </div>
    </div>
  );
};
