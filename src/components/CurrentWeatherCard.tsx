"use client";

import React, { useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  Heart,
  ArrowUp,
  ArrowDown,
  Clock,
  Check,
} from "lucide-react";
import { CurrentWeather } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";
import { useSession } from "next-auth/react";
import { formatWindSpeed } from "@/lib/utils";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  isFavorite?: boolean;
  onToggleFavorite?: (cityName: string) => void;
}

export default function CurrentWeatherCard({
  weather,
  isFavorite = false,
  onToggleFavorite,
}: CurrentWeatherCardProps) {
  const { formatTemperature } = useUnit();
  const { data: session } = useSession();
  const [favorite, setFavorite] = useState(isFavorite);
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);

  // Weather Icon Component based on condition ID
  const renderWeatherIcon = (conditionId: number, isDay: boolean = true) => {
    const iconClass = "w-20 h-20 filter drop-shadow-[0_8px_16px_rgba(59,130,246,0.3)]";
    if (conditionId >= 200 && conditionId < 300) {
      return <CloudLightning className={`${iconClass} text-amber-400 animate-pulse`} />;
    }
    if (conditionId >= 300 && conditionId < 400) {
      return <CloudDrizzle className={`${iconClass} text-sky-400`} />;
    }
    if (conditionId >= 500 && conditionId < 600) {
      return <CloudRain className={`${iconClass} text-blue-400`} />;
    }
    if (conditionId >= 600 && conditionId < 700) {
      return <CloudSnow className={`${iconClass} text-indigo-200 animate-bounce`} />;
    }
    if (conditionId >= 700 && conditionId < 800) {
      return <CloudFog className={`${iconClass} text-slate-300`} />;
    }
    if (conditionId === 800) {
      return isDay ? (
        <Sun className={`${iconClass} text-amber-400 animate-spin-slow`} />
      ) : (
        <div className="relative">
          <CloudSun className={`${iconClass} text-indigo-300`} />
        </div>
      );
    }
    return <Cloud className={`${iconClass} text-blue-300`} />;
  };

  const handleFavoriteClick = async () => {
    if (!session?.user) {
      // Local fallback for guest
      setFavorite(!favorite);
      if (onToggleFavorite) onToggleFavorite(weather.cityName);
      return;
    }

    setIsUpdatingFav(true);
    const newFavState = !favorite;
    setFavorite(newFavState);

    try {
      if (newFavState) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cityName: weather.cityName,
            country: weather.country,
            coordinates: weather.coordinates,
          }),
        });
      } else {
        await fetch(`/api/favorites?cityName=${encodeURIComponent(weather.cityName)}`, {
          method: "DELETE",
        });
      }
      if (onToggleFavorite) onToggleFavorite(weather.cityName);
    } catch (e) {
      console.error("Favorite toggle failed:", e);
      setFavorite(!newFavState); // Revert on error
    } finally {
      setIsUpdatingFav(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/80 via-indigo-950/40 to-slate-900/80 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl transition-all duration-300 group">
      {/* Decorative ambient lighting */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header: Location, Live indicator, and Favorite Button */}
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE REPORT
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated just now
            </span>
          </div>

          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            {weather.cityName}
            {weather.country && (
              <span className="text-sm sm:text-base font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                {weather.country}
              </span>
            )}
          </h2>
          <p className="text-sm font-medium text-blue-300 capitalize mt-0.5">
            {weather.condition.description}
          </p>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isUpdatingFav}
          title={favorite ? "Remove from favorite cities" : "Save to favorite cities"}
          className={`p-3 rounded-2xl border transition-all duration-200 ${
            favorite
              ? "bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-lg shadow-rose-500/20 scale-105"
              : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white"
          }`}
        >
          <Heart className={`w-5 h-5 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Center Section: Main Temperature and Big Icon */}
      <div className="relative my-6 sm:my-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-baseline">
          <span className="text-6xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
            {formatTemperature(weather.temperature)}
          </span>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          {renderWeatherIcon(weather.condition.id)}
          <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              <ArrowUp className="w-3 h-3 mr-0.5" /> H: {formatTemperature(weather.tempMax)}
            </span>
            <span className="flex items-center text-sky-400 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20">
              <ArrowDown className="w-3 h-3 mr-0.5" /> L: {formatTemperature(weather.tempMin)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Metrics Pill Grid */}
      <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
            <span>Humidity</span>
          </div>
          <div className="mt-1 text-lg font-bold text-white">{weather.humidity}%</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span>Wind</span>
          </div>
          <div className="mt-1 text-lg font-bold text-white">{formatWindSpeed(weather.windSpeed)}</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-purple-400" />
            <span>Pressure</span>
          </div>
          <div className="mt-1 text-lg font-bold text-white">{weather.pressure} hPa</div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Feels Like</span>
          </div>
          <div className="mt-1 text-lg font-bold text-white">{formatTemperature(weather.feelsLike)}</div>
        </div>
      </div>
    </div>
  );
}

function CloudSun(props: any) {
  return <Cloud {...props} />;
}

