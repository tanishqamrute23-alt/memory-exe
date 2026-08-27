"use client";

import React, { useEffect, useState } from "react";
import { Song, songs } from "@/data/songs";
import { StartGlyphIcon } from "./Icons";

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  onSelectSong: (song: Song) => void;
  onOpenAbout: () => void;
  onTriggerShutdown: () => void;
}

interface WeatherData {
  temp: number;
  condition: string;
  locationName: string;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  isOpen,
  onClose,
  currentSong,
  onSelectSong,
  onOpenAbout,
  onTriggerShutdown,
}) => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 32,
    condition: "Sunny / Clear",
    locationName: "Delhi (Fallback)",
  });
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Fetch Weather from Open-Meteo API
  useEffect(() => {
    if (!isOpen) return;

    const fetchWeatherForCoords = async (lat: number, lon: number, name: string) => {
      try {
        setLoadingWeather(true);
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await res.json();
        if (data && data.current_weather) {
          const tempC = Math.round(data.current_weather.temperature);
          const code = data.current_weather.weathercode;
          let cond = "Clear Sky";
          if (code >= 1 && code <= 3) cond = "Partly Cloudy";
          else if (code >= 45 && code <= 48) cond = "Foggy";
          else if (code >= 51 && code <= 67) cond = "Rainy";
          else if (code >= 80 && code <= 82) cond = "Showers";

          setWeather({
            temp: tempC,
            condition: cond,
            locationName: name,
          });
        }
      } catch (err) {
        console.warn("Open-Meteo fetch failed, using fallback:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    // Default Delhi coordinates: Lat 28.6139, Lon 77.2090
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherForCoords(
            pos.coords.latitude,
            pos.coords.longitude,
            "Local Location"
          );
        },
        () => {
          // Permission denied or error fallback to Delhi
          fetchWeatherForCoords(28.6139, 77.209, "Delhi, IN");
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeatherForCoords(28.6139, 77.209, "Delhi, IN");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Up next song calculation
  const currentIndex = currentSong ? songs.findIndex((s) => s.id === currentSong.id) : 0;
  const nextSong = songs[(currentIndex + 1) % songs.length];

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute bottom-11 left-0 z-[1000] w-72 md:w-80 win-bevel bg-[#d4d0c8] p-1 shadow-2xl flex flex-col font-sans select-none text-xs"
    >
      {/* Side banner */}
      <div className="flex">
        <div className="win-titlebar w-7 flex items-end justify-center py-3 px-1 rounded-l">
          <span className="writing-mode-vertical transform -rotate-90 text-white font-bold tracking-widest text-sm whitespace-nowrap">
            Memory.exe OS
          </span>
        </div>

        {/* Content panel */}
        <div className="flex-1 p-2 flex flex-col gap-2">
          {/* Header user identity */}
          <div className="win-bevel-inset bg-white p-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#000080] flex items-center justify-center text-white font-bold text-sm">
              ME
            </div>
            <div>
              <div className="font-bold text-black text-sm">Memory.exe Desktop</div>
              <div className="text-[10px] text-[#666666]">{todayDate}</div>
            </div>
          </div>

          {/* Now Playing & Up Next Widget */}
          <div className="win-bevel bg-[#ece9d8] p-2 flex flex-col gap-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#000080]">
              ▶ Now Playing
            </div>
            <div className="font-bold truncate text-black">
              {currentSong ? currentSong.title : "None Selected"}
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider text-[#555555] mt-1">
              ⏭ Up Next
            </div>
            <div
              onClick={() => onSelectSong(nextSong)}
              className="text-xs truncate text-[#000080] hover:underline cursor-pointer font-medium"
            >
              {nextSong.title} — {nextSong.artist}
            </div>
          </div>

          {/* Local Weather Widget */}
          <div className="win-bevel-inset bg-[#f8f8f8] p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌤️</span>
              <div>
                <div className="font-bold text-black">
                  {weather.temp}°C {weather.condition}
                </div>
                <div className="text-[10px] text-[#666666]">
                  {loadingWeather ? "Updating weather..." : weather.locationName}
                </div>
              </div>
            </div>
            <span className="text-[9px] bg-[#e0e0e0] px-1 py-0.5 rounded text-[#555555]">
              Open-Meteo
            </span>
          </div>

          <hr className="border-t border-[#808080] my-1" />

          {/* Menu Options */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                onClose();
                onOpenAbout();
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded flex items-center gap-2 font-medium"
            >
              <span>ℹ️</span> About Memory.exe
            </button>

            <button
              onClick={() => {
                onClose();
                onTriggerShutdown();
              }}
              className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded flex items-center gap-2 font-semibold text-red-700 hover:text-white"
            >
              <span>⭕</span> Shut Down...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
