"use client";

import React from "react";
import {
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Cloud,
  Compass,
  Umbrella,
} from "lucide-react";
import { CurrentWeather } from "@/types/weather";
import {
  formatSunTime,
  formatVisibility,
  formatPressure,
  formatWindSpeed,
  getWindDirection,
} from "@/lib/utils";

interface WeatherHighlightsProps {
  weather: CurrentWeather;
}

export default function WeatherHighlightsGrid({ weather }: WeatherHighlightsProps) {
  // UV Index description & badge color
  const uv = weather.uvIndex ?? 4;
  let uvLevel = "Low";
  let uvColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (uv >= 3 && uv < 6) {
    uvLevel = "Moderate";
    uvColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  } else if (uv >= 6 && uv < 8) {
    uvLevel = "High";
    uvColor = "text-orange-400 bg-orange-500/10 border-orange-500/20";
  } else if (uv >= 8) {
    uvLevel = "Very High";
    uvColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
  }

  // Humidity rating
  let humidityDesc = "Comfortable";
  if (weather.humidity < 30) humidityDesc = "Dry environment";
  else if (weather.humidity > 70) humidityDesc = "High moisture / humid";

  // Visibility rating
  let visibilityDesc = "Clear view";
  if (weather.visibility < 4000) visibilityDesc = "Low visibility / fog";
  else if (weather.visibility < 9000) visibilityDesc = "Moderate visibility";

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-400" /> Today's Highlights & Atmosphere
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. UV Index */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Sun className="w-4 h-4 text-amber-400" /> UV Index
            </span>
            <span className={`px-2 py-0.5 rounded-full font-semibold text-[11px] border ${uvColor}`}>
              {uvLevel}
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">{uv}</div>
            <p className="text-xs text-slate-400 mt-1">
              {uv >= 6 ? "Sun protection required. Seek shade midday." : "Low to moderate sun intensity."}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
              style={{ width: `${Math.min((uv / 11) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Wind Status */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Wind className="w-4 h-4 text-teal-400" /> Wind & Direction
            </span>
            <span className="font-semibold text-slate-300">
              {getWindDirection(weather.windDirection)}
            </span>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-white">
                {formatWindSpeed(weather.windSpeed)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direction: {weather.windDirection}° ({getWindDirection(weather.windDirection)})
              </p>
            </div>
            {/* Direction Compass Arrow */}
            <div
              className="w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner"
              style={{ transform: `rotate(${weather.windDirection}deg)` }}
            >
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            {weather.windGust ? `Gusts up to ${formatWindSpeed(weather.windGust)}` : "Steady breeze"}
          </div>
        </div>

        {/* 3. Sunrise & Sunset */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Sunrise className="w-4 h-4 text-amber-400" /> Sun Cycle
            </span>
            <span className="text-slate-400 text-[11px]">Local Horizon</span>
          </div>
          <div className="my-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sunrise className="w-4 h-4 text-amber-400" /> Sunrise
              </div>
              <span className="text-sm font-bold text-white">
                {formatSunTime(weather.sunrise, weather.timezoneOffset)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Sunset className="w-4 h-4 text-orange-400" /> Sunset
              </div>
              <span className="text-sm font-bold text-white">
                {formatSunTime(weather.sunset, weather.timezoneOffset)}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Solar progression tracked
          </div>
        </div>

        {/* 4. Humidity & Moisture */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplets className="w-4 h-4 text-blue-400" /> Humidity
            </span>
            <span className="text-[11px] text-blue-400">{humidityDesc}</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">{weather.humidity}%</div>
            <p className="text-xs text-slate-400 mt-1">
              Relative atmospheric moisture level.
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              style={{ width: `${weather.humidity}%` }}
            />
          </div>
        </div>

        {/* 5. Visibility */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="w-4 h-4 text-sky-400" /> Visibility
            </span>
            <span className="text-[11px] text-sky-400">{visibilityDesc}</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">
              {formatVisibility(weather.visibility)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Horizontal clarity distance.
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Standard visual threshold
          </div>
        </div>

        {/* 6. Atmospheric Pressure */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Gauge className="w-4 h-4 text-purple-400" /> Pressure
            </span>
            <span className="text-[11px] text-purple-400">Barometric</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">
              {formatPressure(weather.pressure)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {weather.pressure > 1013 ? "High pressure system (fair weather)" : "Low pressure system"}
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Standard: 1013.25 hPa
          </div>
        </div>

        {/* 7. Cloud Cover */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Cloud className="w-4 h-4 text-slate-400" /> Cloud Cover
            </span>
            <span className="text-[11px] text-slate-300">{weather.cloudPercentage}% sky</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">
              {weather.cloudPercentage}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {weather.cloudPercentage > 75 ? "Overcast skies" : weather.cloudPercentage > 30 ? "Partly cloudy" : "Clear skies"}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-400 rounded-full"
              style={{ width: `${weather.cloudPercentage}%` }}
            />
          </div>
        </div>

        {/* 8. Rain / Precipitation Probability */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Umbrella className="w-4 h-4 text-blue-400" /> Precipitation
            </span>
            <span className="text-[11px] text-blue-400">Probability</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-white">
              {weather.pop ?? 0}%
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {(weather.pop ?? 0) > 40 ? "Precipitation likely today." : "No imminent rain anticipated."}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${weather.pop ?? 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

