"use client";

import React, { useEffect, useState, useRef } from "react";
import { songs, Song } from "@/data/songs";
import {
  MyComputerIcon,
  RecycleBinIcon,
  MusicFolderIcon,
  NewFolderIcon,
  GaneFolderIcon,
} from "./Icons";
import { RetroWindow } from "./RetroWindow";
import { PlaylistWindow } from "./PlaylistWindow";
import { NowPlayingWindow } from "./NowPlayingWindow";
import { PlayerBar } from "./PlayerBar";
import { Taskbar, TaskbarWindowItem } from "./Taskbar";
import { StartMenu } from "./StartMenu";
import { BootScreen } from "./BootScreen";
import { Screensaver } from "./Screensaver";
import { RecycleBinModal } from "./RecycleBinModal";
import { AboutModal } from "./AboutModal";
import { MyComputerModal } from "./MyComputerModal";
import { GaneFolderModal } from "./GaneFolderModal";
import { NewFolderModal } from "./NewFolderModal";

export const Desktop: React.FC = () => {
  // Session & Boot state
  const [showBoot, setShowBoot] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [isScreensaver, setIsScreensaver] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [wallpaperShimmer, setWallpaperShimmer] = useState(false);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  // Music Player State
  const [currentSong, setCurrentSong] = useState<Song | null>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerWindowVisible, setIsPlayerWindowVisible] = useState(false);
  const [hasStartedMusic, setHasStartedMusic] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [seekTarget, setSeekTarget] = useState<number | null>(null);

  // Windows Open & Z-Index Management
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false); // Closed by default
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);
  const [isMyComputerOpen, setIsMyComputerOpen] = useState(false);
  const [isGaneFolderOpen, setIsGaneFolderOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStartOpen, setIsStartOpen] = useState(false);

  // Top Z-Index focus tracker
  const [zIndices, setZIndices] = useState<Record<string, number>>({
    playlist: 100,
    player: 100,
    recycle: 50,
    mycomputer: 50,
    ganefolder: 50,
    newfolder: 50,
    about: 50,
  });

  // Listener Presence Counter State
  const [listenerCount, setListenerCount] = useState(1);
  const clientIdRef = useRef<string>("");

  const bringToFront = (windowId: string) => {
    setZIndices((prev) => {
      const maxZ = Math.max(...Object.values(prev), 50);
      return { ...prev, [windowId]: maxZ + 1 };
    });
  };

  // Check Boot Screen session storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const booted = sessionStorage.getItem("memory_exe_booted");
      if (!booted) {
        setShowBoot(true);
      }
    }
  }, []);

  const handleBootComplete = () => {
    setShowBoot(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("memory_exe_booted", "true");
    }
  };

  // Screen Aspect Ratio Orientation Detector (wide landscape vs tall portrait)
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth >= window.innerHeight);
    };
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  // Idle Screensaver timer (90 seconds of stillness)
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdleTimer = () => {
      if (isScreensaver) setIsScreensaver(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsScreensaver(true);
      }, 90000); // 90 seconds
    };

    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer));
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [isScreensaver]);

  // Presence Heartbeat API (Pings every 15 seconds with persistent session clientId)
  useEffect(() => {
    if (typeof window !== "undefined") {
      let savedId = sessionStorage.getItem("memory_presence_client_id");
      if (!savedId) {
        savedId = `client_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("memory_presence_client_id", savedId);
      }
      clientIdRef.current = savedId;
    }

    const sendHeartbeat = async () => {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: clientIdRef.current }),
        });
        const data = await res.json();
        if (data && typeof data.count === "number") {
          setListenerCount(Math.max(1, data.count));
        }
      } catch (err) {
        fetch("/api/presence")
          .then((r) => r.json())
          .then((d) => setListenerCount(Math.max(1, d.count || 1)))
          .catch(() => {});
      }
    };

    const handleUnload = () => {
      if (clientIdRef.current && navigator.sendBeacon) {
        const blob = new Blob(
          [JSON.stringify({ clientId: clientIdRef.current, disconnect: true })],
          { type: "application/json" }
        );
        navigator.sendBeacon("/api/presence", blob);
      }
    };

    sendHeartbeat();
    const presenceInterval = setInterval(sendHeartbeat, 15000);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(presenceInterval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Music Player Action Handlers
  const handleSelectSong = (song: Song) => {
    setCurrentSong(song);
    setHasStartedMusic(true);
    setIsPlaying(true);
    setIsPlayerWindowVisible(true);
    bringToFront("player");
  };

  const handleTogglePlayPause = () => {
    if (!currentSong) {
      setCurrentSong(songs[0]);
      setHasStartedMusic(true);
      setIsPlaying(true);
      setIsPlayerWindowVisible(true);
      bringToFront("player");
    } else {
      const willPlay = !isPlaying;
      setIsPlaying(willPlay);
      if (willPlay) {
        setHasStartedMusic(true);
        setIsPlayerWindowVisible(true);
        bringToFront("player");
      }
    }
  };

  const handleNextTrack = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setHasStartedMusic(true);
    setIsPlaying(true);
    setIsPlayerWindowVisible(true);
    bringToFront("player");
  };

  const handlePrevTrack = () => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setHasStartedMusic(true);
    setIsPlaying(true);
    setIsPlayerWindowVisible(true);
    bringToFront("player");
  };

  const getTopWindowId = (): string | null => {
    const openEntries = Object.entries(zIndices).filter(([id]) => {
      if (id === "playlist") return isPlaylistOpen;
      if (id === "player") return isPlayerWindowVisible;
      if (id === "mycomputer") return isMyComputerOpen;
      if (id === "recycle") return isRecycleBinOpen;
      if (id === "ganefolder") return isGaneFolderOpen;
      if (id === "newfolder") return isNewFolderOpen;
      if (id === "about") return isAboutOpen;
      return false;
    });
    if (openEntries.length === 0) return null;
    openEntries.sort((a, b) => b[1] - a[1]);
    return openEntries[0][0];
  };

  const taskbarWindows: TaskbarWindowItem[] = [
    {
      id: "playlist",
      title: "Master Playlist",
      icon: <MusicFolderIcon className="w-3.5 h-3.5" />,
      isOpen: isPlaylistOpen,
      onToggle: () => {
        if (isPlaylistOpen) {
          if (getTopWindowId() === "playlist") {
            setIsPlaylistOpen(false);
          } else {
            bringToFront("playlist");
          }
        } else {
          setIsPlaylistOpen(true);
          bringToFront("playlist");
        }
      },
      isActive: isPlaylistOpen && getTopWindowId() === "playlist",
    },
    {
      id: "player",
      title: currentSong ? `🎵 ${currentSong.title}` : "MemoryPlayer 2004",
      icon: <span className="text-xs">📻</span>,
      isOpen: isPlayerWindowVisible,
      onToggle: () => {
        if (isPlayerWindowVisible) {
          if (getTopWindowId() === "player") {
            setIsPlayerWindowVisible(false);
          } else {
            bringToFront("player");
          }
        } else {
          setIsPlayerWindowVisible(true);
          bringToFront("player");
        }
      },
      isActive: isPlayerWindowVisible && getTopWindowId() === "player",
    },
    {
      id: "mycomputer",
      title: "My Computer",
      icon: <MyComputerIcon className="w-3.5 h-3.5" />,
      isOpen: isMyComputerOpen,
      onToggle: () => {
        if (isMyComputerOpen) {
          if (getTopWindowId() === "mycomputer") setIsMyComputerOpen(false);
          else bringToFront("mycomputer");
        } else {
          setIsMyComputerOpen(true);
          bringToFront("mycomputer");
        }
      },
      isActive: isMyComputerOpen && getTopWindowId() === "mycomputer",
    },
    {
      id: "recycle",
      title: "Recycle Bin",
      icon: <RecycleBinIcon className="w-3.5 h-3.5" />,
      isOpen: isRecycleBinOpen,
      onToggle: () => {
        if (isRecycleBinOpen) {
          if (getTopWindowId() === "recycle") setIsRecycleBinOpen(false);
          else bringToFront("recycle");
        } else {
          setIsRecycleBinOpen(true);
          bringToFront("recycle");
        }
      },
      isActive: isRecycleBinOpen && getTopWindowId() === "recycle",
    },
    {
      id: "ganefolder",
      title: "Folder: गाने",
      icon: <GaneFolderIcon className="w-3.5 h-3.5" />,
      isOpen: isGaneFolderOpen,
      onToggle: () => {
        if (isGaneFolderOpen) {
          if (getTopWindowId() === "ganefolder") setIsGaneFolderOpen(false);
          else bringToFront("ganefolder");
        } else {
          setIsGaneFolderOpen(true);
          bringToFront("ganefolder");
        }
      },
      isActive: isGaneFolderOpen && getTopWindowId() === "ganefolder",
    },
    {
      id: "newfolder",
      title: "Folder: nostalgia",
      icon: <NewFolderIcon className="w-3.5 h-3.5" />,
      isOpen: isNewFolderOpen,
      onToggle: () => {
        if (isNewFolderOpen) {
          if (getTopWindowId() === "newfolder") setIsNewFolderOpen(false);
          else bringToFront("newfolder");
        } else {
          setIsNewFolderOpen(true);
          bringToFront("newfolder");
        }
      },
      isActive: isNewFolderOpen && getTopWindowId() === "newfolder",
    },
    {
      id: "about",
      title: "About Memory.exe",
      icon: <span className="text-xs">ℹ️</span>,
      isOpen: isAboutOpen,
      onToggle: () => {
        if (isAboutOpen) {
          if (getTopWindowId() === "about") setIsAboutOpen(false);
          else bringToFront("about");
        } else {
          setIsAboutOpen(true);
          bringToFront("about");
        }
      },
      isActive: isAboutOpen && getTopWindowId() === "about",
    },
  ];

  const handleRewind10 = () => {
    if (currentTime > 0) {
      setSeekTarget(Math.max(0, currentTime - 10));
      setTimeout(() => setSeekTarget(null), 100);
    }
  };

  const handleForward10 = () => {
    if (duration > 0) {
      setSeekTarget(Math.min(duration, currentTime + 10));
      setTimeout(() => setSeekTarget(null), 100);
    }
  };

  const handleSeek = (time: number) => {
    setSeekTarget(time);
    setTimeout(() => setSeekTarget(null), 100);
  };

  const handleToggleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  // Right-click context menu & Refresh Wallpaper Shimmer
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleRefreshWallpaper = () => {
    setContextMenu(null);
    setWallpaperShimmer(true);
    setTimeout(() => setWallpaperShimmer(false), 700);
  };

  // Close context menu on any click
  const handleDesktopClick = () => {
    if (contextMenu) setContextMenu(null);
    if (isStartOpen) setIsStartOpen(false);
  };

  return (
    <>
      {/* Pretend Boot Screen */}
      {showBoot && <BootScreen onComplete={handleBootComplete} />}

      {/* Screensaver */}
      {isScreensaver && <Screensaver onDismiss={() => setIsScreensaver(false)} />}

      {/* Shutdown Fade Screen */}
      {isShutDown && (
        <div
          onClick={() => setIsShutDown(false)}
          className="fixed inset-0 z-[9999999] bg-black text-[#00ff66] font-mono flex flex-col items-center justify-center p-6 cursor-pointer select-none"
        >
          <div className="text-xl md:text-3xl text-center font-bold mb-4 tracking-wide text-white">
            It is now safe to close this tab.
          </div>
          <div className="text-xs md:text-sm text-gray-500 animate-pulse">
            [ Click anywhere to turn Memory.exe back on ]
          </div>
        </div>
      )}

      {/* Main Desktop Scene Container */}
      <div className="relative w-screen h-screen overflow-hidden bg-[#008080] select-none">
        {/* Desktop Wallpaper */}
        <div
          onClick={handleDesktopClick}
          onContextMenu={handleContextMenu}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
            wallpaperShimmer ? "shimmer-active" : ""
          }`}
          style={{
            backgroundImage: isLandscape
              ? "url('/bg/wallpaperwide.png')"
              : "url('/bg/wallpapertall.png')",
          }}
        >
          {/* Scanlines effect for retro CRT feel */}
          <div className="crt-overlay absolute inset-0" />

              {/* Upper Screen Glowing Header & Tagline */}
              <div className="absolute top-2 sm:top-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-center pointer-events-none z-10 px-2 sm:px-4 w-full">
                <h1 className="glow-title text-2xl sm:text-5xl md:text-7xl font-extrabold tracking-widest uppercase">
                  Memory.exe
                </h1>
                <p className="text-white text-[10px] sm:text-xs md:text-base font-mono mt-0.5 sm:mt-1 font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Back when moments were saved, not posted.
                </p>
              </div>

              {/* Top-Right Corner Live Listener Count Badge */}
              <div className="absolute top-4 right-4 z-20 win-bevel bg-[#d4d0c8] px-3 py-1 flex items-center gap-2 shadow-lg rounded">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-pulse" />
                <span className="font-bold text-xs text-[#000080]">
                  {listenerCount} online
                </span>
              </div>

              {/* Left-Side Clickable Desktop Icons */}
              <div className="absolute top-16 left-4 z-[2] flex flex-col gap-6 select-none">
                {/* My Computer */}
                <div
                  onClick={() => {
                    setIsMyComputerOpen(true);
                    bringToFront("mycomputer");
                  }}
                  onDoubleClick={() => {
                    setIsMyComputerOpen(true);
                    bringToFront("mycomputer");
                  }}
                  className="flex flex-col items-center gap-1 w-20 p-1.5 rounded hover:bg-[#000080]/40 cursor-pointer group"
                >
                  <MyComputerIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    My Computer
                  </span>
                </div>

                {/* Recycle Bin */}
                <div
                  onClick={() => {
                    setIsRecycleBinOpen(true);
                    bringToFront("recycle");
                  }}
                  onDoubleClick={() => {
                    setIsRecycleBinOpen(true);
                    bringToFront("recycle");
                  }}
                  className="flex flex-col items-center gap-1 w-20 p-1.5 rounded hover:bg-[#000080]/40 cursor-pointer group"
                >
                  <RecycleBinIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    Recycle Bin
                  </span>
                </div>

                {/* Music */}
                <div
                  onClick={() => {
                    setIsPlaylistOpen(true);
                    bringToFront("playlist");
                  }}
                  onDoubleClick={() => {
                    setIsPlaylistOpen(true);
                    bringToFront("playlist");
                  }}
                  className="flex flex-col items-center gap-1 w-20 p-1.5 rounded hover:bg-[#000080]/40 cursor-pointer group"
                >
                  <MusicFolderIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    Music
                  </span>
                </div>

                {/* New Folder (3) */}
                <div
                  onClick={() => {
                    setIsNewFolderOpen(true);
                    bringToFront("newfolder");
                  }}
                  onDoubleClick={() => {
                    setIsNewFolderOpen(true);
                    bringToFront("newfolder");
                  }}
                  className="flex flex-col items-center gap-1 w-20 p-1.5 rounded hover:bg-[#000080]/40 cursor-pointer group"
                >
                  <NewFolderIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    nostalgia
                  </span>
                </div>

                {/* Folder named गाने */}
                <div
                  onClick={() => {
                    setIsGaneFolderOpen(true);
                    bringToFront("ganefolder");
                  }}
                  onDoubleClick={() => {
                    setIsGaneFolderOpen(true);
                    bringToFront("ganefolder");
                  }}
                  className="flex flex-col items-center gap-1 w-20 p-1.5 rounded hover:bg-[#000080]/40 cursor-pointer group"
                >
                  <GaneFolderIcon className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  <span className="text-white font-medium text-xs text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    गाने
                  </span>
                </div>
              </div>

              {/* Master Playlist Window */}
              <PlaylistWindow
                isOpen={isPlaylistOpen}
                onClose={() => setIsPlaylistOpen(false)}
                zIndex={zIndices.playlist}
                onFocus={() => bringToFront("playlist")}
                currentSong={currentSong}
                isPlaying={isPlaying}
                onSelectSong={handleSelectSong}
              />

              {/* Recycle Bin Window (Contains first_crush.txt) */}
              <RecycleBinModal
                isOpen={isRecycleBinOpen}
                onClose={() => setIsRecycleBinOpen(false)}
                zIndex={zIndices.recycle}
                onFocus={() => bringToFront("recycle")}
              />

              {/* My Computer Window */}
              <MyComputerModal
                isOpen={isMyComputerOpen}
                onClose={() => setIsMyComputerOpen(false)}
                zIndex={zIndices.mycomputer}
                onFocus={() => bringToFront("mycomputer")}
              />

              {/* Folder named गाने Modal */}
              <GaneFolderModal
                isOpen={isGaneFolderOpen}
                onClose={() => setIsGaneFolderOpen(false)}
                zIndex={zIndices.ganefolder}
                onFocus={() => bringToFront("ganefolder")}
                onSelectSong={handleSelectSong}
              />

              {/* New Folder (3) Modal */}
              <NewFolderModal
                isOpen={isNewFolderOpen}
                onClose={() => setIsNewFolderOpen(false)}
                zIndex={zIndices.newfolder}
                onFocus={() => bringToFront("newfolder")}
              />

              {/* About Window */}
              <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
                zIndex={zIndices.about}
                onFocus={() => bringToFront("about")}
              />

              {/* 2004 Music Player Window (Automatically comes up when playing, closes via ✕ or on stop) */}
              <NowPlayingWindow
                currentSong={currentSong}
                isPlaying={isPlaying}
                isVisible={isPlayerWindowVisible}
                onClose={() => setIsPlayerWindowVisible(false)}
                onStateChange={(playing) => {
                  setIsPlaying(playing);
                  if (playing) {
                    setHasStartedMusic(true);
                    setIsPlayerWindowVisible(true);
                  }
                }}
                onTimeUpdate={(cur, dur) => {
                  setCurrentTime(cur);
                  setDuration(dur);
                }}
                onTrackEnded={handleNextTrack}
                onError={handleNextTrack}
                volume={volume}
                playbackSpeed={playbackSpeed}
                seekTarget={seekTarget}
                zIndex={zIndices.player}
                onFocus={() => bringToFront("player")}
              />

              {/* Start Menu Overlay */}
              <StartMenu
                isOpen={isStartOpen}
                onClose={() => setIsStartOpen(false)}
                currentSong={currentSong}
                onSelectSong={handleSelectSong}
                onOpenAbout={() => {
                  setIsAboutOpen(true);
                  bringToFront("about");
                }}
                onTriggerShutdown={() => setIsShutDown(true)}
              />

              {/* Right-Click Desktop Context Menu */}
              {contextMenu && (
                <div
                  style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
                  className="absolute z-[99999] win-bevel bg-[#d4d0c8] py-1 px-1 w-48 shadow-2xl font-sans text-xs flex flex-col gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleRefreshWallpaper}
                    className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white rounded flex items-center justify-between"
                  >
                    <span>Refresh</span>
                    <span className="text-[10px] text-gray-500">F5</span>
                  </button>
                  <hr className="border-t border-[#808080] my-0.5" />
                  <button
                    onClick={() => {
                      setContextMenu(null);
                      setIsPlayerWindowVisible(true);
                      bringToFront("player");
                    }}
                    className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white rounded"
                  >
                    Show 2004 Music Player
                  </button>
                  <button
                    onClick={() => {
                      setContextMenu(null);
                      setIsPlaylistOpen(true);
                      bringToFront("playlist");
                    }}
                    className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white rounded"
                  >
                    Open Master Playlist
                  </button>
                  <button
                    onClick={() => {
                      setContextMenu(null);
                      setIsMyComputerOpen(true);
                      bringToFront("mycomputer");
                    }}
                    className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white rounded"
                  >
                    System Properties
                  </button>
                  <hr className="border-t border-[#808080] my-0.5" />
                  <button
                    onClick={() => {
                      setContextMenu(null);
                      setIsAboutOpen(true);
                      bringToFront("about");
                    }}
                    className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white rounded"
                  >
                    About Memory.exe
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Docked Player Control Bar - appears only after music starts */}
            {hasStartedMusic && (
              <div className="absolute bottom-10 left-0 right-0 z-[500]">
                <PlayerBar
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onTogglePlayPause={handleTogglePlayPause}
                  onNext={handleNextTrack}
                  onPrev={handlePrevTrack}
                  onRewind10={handleRewind10}
                  onForward10={handleForward10}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                  volume={volume}
                  onVolumeChange={(v) => setVolume(v)}
                  playbackSpeed={playbackSpeed}
                  onToggleSpeed={handleToggleSpeed}
                />
              </div>
            )}

            {/* Bottom Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 z-[1000]">
              <Taskbar
                isStartOpen={isStartOpen}
                onToggleStart={() => setIsStartOpen((prev) => !prev)}
                windows={taskbarWindows}
                listenerCount={listenerCount}
              />
            </div>
          </div>
      </>
    );
  };
