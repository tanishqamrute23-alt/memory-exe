"use client";

import React, { useEffect, useRef, useState } from "react";
import { Song } from "@/data/songs";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

interface NowPlayingWindowProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isVisible: boolean;
  onClose: () => void;
  onStateChange: (playing: boolean) => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onTrackEnded: () => void;
  onError: () => void;
  volume: number; // 0 to 100
  playbackSpeed: number; // 0.75, 1, 1.25, 1.5
  seekTarget: number | null; // time in seconds to seek to
  zIndex?: number;
  onFocus?: () => void;
}

export const NowPlayingWindow: React.FC<NowPlayingWindowProps> = ({
  currentSong,
  isPlaying,
  isVisible,
  onClose,
  onStateChange,
  onTimeUpdate,
  onTrackEnded,
  onError,
  volume,
  playbackSpeed,
  seekTarget,
  zIndex = 999,
  onFocus,
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [apiReady, setApiReady] = useState(false);
  const [pos, setPos] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const timeIntervalRef = useRef<any>(null);

  // VU Meter animation state
  const [vuLeft, setVuLeft] = useState(40);
  const [vuRight, setVuRight] = useState(55);

  const loadingSongRef = useRef(false);

  // Position on screen mount & window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 640;
        const targetX = isMobile
          ? Math.max(8, Math.floor((window.innerWidth - 310) / 2))
          : Math.max(10, window.innerWidth - 330);
        const targetY = isMobile ? 65 : 100;
        setPos({ x: targetX, y: targetY });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bring player window to front whenever it becomes visible or song changes
  useEffect(() => {
    if (isVisible && onFocus) {
      onFocus();
    }
  }, [isVisible, currentSong?.id]);

  // VU Meter simulated audio animation when playing
  useEffect(() => {
    if (!isPlaying) {
      setVuLeft(5);
      setVuRight(5);
      return;
    }
    const vuInterval = setInterval(() => {
      setVuLeft(Math.floor(Math.random() * 65) + 30);
      setVuRight(Math.floor(Math.random() * 65) + 30);
    }, 120);
    return () => clearInterval(vuInterval);
  }, [isPlaying]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };
  }, []);

  // Initialize YT Player when apiReady and currentSong exist
  useEffect(() => {
    if (!apiReady || !currentSong) return;

    if (!playerRef.current) {
      loadingSongRef.current = true;
      playerRef.current = new window.YT.Player("youtube-player-hidden", {
        height: "100",
        width: "100",
        videoId: currentSong.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            event.target.setPlaybackRate(playbackSpeed);
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              loadingSongRef.current = false;
              onStateChange(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              if (!loadingSongRef.current) {
                onStateChange(false);
              }
            } else if (event.data === window.YT.PlayerState.ENDED) {
              loadingSongRef.current = false;
              onStateChange(false);
              onTrackEnded();
            }
          },
          onError: (err: any) => {
            console.warn("YouTube video load error (Code " + err.data + "), skipping to next track...");
            loadingSongRef.current = false;
            onError();
          },
        },
      });
    } else {
      try {
        loadingSongRef.current = true;
        playerRef.current.loadVideoById(currentSong.videoId);
        if (typeof playerRef.current.playVideo === "function") {
          playerRef.current.playVideo();
        }
      } catch (err) {
        console.error("Error loading video ID:", err);
      }
    }
  }, [apiReady, currentSong?.videoId]);

  // Handle Play/Pause sync
  useEffect(() => {
    if (!playerRef.current || typeof playerRef.current.playVideo !== "function") return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else if (!loadingSongRef.current) {
        playerRef.current.pauseVideo();
      }
    } catch (_) {}
  }, [isPlaying]);

  // Handle Volume change
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === "function") {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Handle Playback Speed change
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === "function") {
      playerRef.current.setPlaybackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Handle Seek Target
  useEffect(() => {
    if (seekTarget !== null && playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(seekTarget, true);
    }
  }, [seekTarget]);

  // Time update polling loop
  useEffect(() => {
    timeIntervalRef.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const cur = playerRef.current.getCurrentTime() || 0;
          const dur = playerRef.current.getDuration() || 0;
          onTimeUpdate(cur, dur);
        } catch (_) {}
      }
    }, 500);

    return () => clearInterval(timeIntervalRef.current);
  }, [onTimeUpdate]);

  // Dragging handlers for 2004 Music Player window
  const handlePointerDownHeader = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveHeader = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 240, e.clientY - dragOffset.y));
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

  if (!currentSong) return null;

  return (
    <>
      {/* 2004 Music Player Skin Window (Visible when isVisible is true) */}
      {isVisible && (
        <div
          ref={containerRef}
          onClick={onFocus}
          style={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            zIndex: zIndex,
          }}
          className="win-bevel p-[3px] w-[310px] shadow-2xl bg-gradient-to-b from-[#404040] via-[#c0c0c0] to-[#808080] rounded select-none font-sans"
        >
          {/* 2004 Desktop Music Player Window Header */}
          <div
            onPointerDown={handlePointerDownHeader}
            onPointerMove={handlePointerMoveHeader}
            onPointerUp={handlePointerUpHeader}
            className="win-titlebar px-2 py-1 flex items-center justify-between cursor-move text-xs"
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-cyan-300 font-bold text-sm">📻</span>
              <span className="truncate text-white font-bold tracking-wider">
                MemoryPlayer 2004 v2.4
              </span>
            </div>

            {/* Right Header Buttons: STEREO indicator + Close Button ✕ */}
            <div className="flex items-center gap-2" onPointerDown={(e) => e.stopPropagation()}>
              <span className="text-[10px] text-cyan-200 font-mono">STEREO</span>
              <button
                onClick={onClose}
                className="w-4 h-4 win-button text-black font-bold flex items-center justify-center text-[10px] leading-none hover:bg-red-500 hover:text-white transition-colors"
                title="Close Music Player Window"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 2004 Music Player Skin Interface Body */}
          <div className="p-2 bg-[#1a1a1a] text-white flex flex-col gap-2 rounded-b border border-[#404040]">
            {/* LCD Screen Display */}
            <div className="bg-black border-2 border-[#333333] rounded p-2 flex flex-col gap-1.5 relative overflow-hidden shadow-inner">
              {/* Top Info Bar */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#00ffff] border-b border-[#00ffff]/20 pb-1">
                <span className="truncate max-w-[170px]">TRACK 0{currentSong.id}</span>
                <span className="text-[#00ff66]">320 KBPS</span>
              </div>

              {/* Center Graphic: Spinning CD Album Disc & Track Info */}
              <div className="flex items-center gap-3 py-1">
                {/* Spinning CD Disc */}
                <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-tr from-[#333] via-[#888] to-[#eee] border border-[#fff] flex items-center justify-center shadow-lg ${
                      isPlaying ? "animate-spin" : ""
                    }`}
                    style={{ animationDuration: "3s" }}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#111] border border-[#00ffff] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                    </div>
                  </div>
                </div>

                {/* Track Info */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#00ff66] truncate tracking-wide font-mono">
                    {currentSong.title}
                  </div>
                  <div className="text-[11px] text-gray-300 truncate font-mono">
                    {currentSong.artist}
                  </div>
                  <div className="text-[10px] text-[#00ffff] font-mono mt-0.5">
                    YEAR: {currentSong.year}
                  </div>
                </div>
              </div>

              {/* Stereo VU Level Meters */}
              <div className="flex flex-col gap-1 pt-1 border-t border-[#333333]">
                <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400">
                  <span className="w-3 text-[#00ffff]">L</span>
                  <div className="flex-1 bg-[#111] h-1.5 rounded overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ff66] via-[#ffff00] to-[#ff0055] transition-all duration-75"
                      style={{ width: `${vuLeft}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-gray-400">
                  <span className="w-3 text-[#00ffff]">R</span>
                  <div className="flex-1 bg-[#111] h-1.5 rounded overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#00ff66] via-[#ffff00] to-[#ff0055] transition-all duration-75"
                      style={{ width: `${vuRight}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Player Status Footer */}
            <div className="flex items-center justify-between px-1 text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-[#00ff66] animate-pulse" : "bg-red-500"}`} />
                <span>{isPlaying ? "PLAYING AUDIO" : "PAUSED"}</span>
              </div>
              <span>44.1 kHz STEREO</span>
            </div>
          </div>
        </div>
      )}

      {/* Hidden YouTube Iframe Container in DOM for seamless continuous audio streaming */}
      <div className="w-1 h-1 opacity-0 pointer-events-none overflow-hidden absolute -z-50 left-0 top-0">
        <div id="youtube-player-hidden" />
      </div>
    </>
  );
};
