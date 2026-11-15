"use client";

import React from "react";
import { Calendar, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import { DailyForecastItem } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";

interface DailyForecastProps {
  daily: DailyForecastItem[];
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  const { formatTemperature } = useUnit();

  if (!daily || daily.length === 0) return null;

  // Find the absolute min and max across all 7 days for the normalized temperature bar
  const allMins = daily.map((d) => d.tempMin);
  const allMaxs = daily.map((d) => d.tempMax);
  const minTempAll = Math.min(...allMins);
  const maxTempAll = Math.max(...allMaxs);
  const tempRange = Math.max(maxTempAll - minTempAll, 1);

  const getDayIcon = (conditionId: number) => {
    if (conditionId >= 200 && conditionId < 300) return <CloudLightning className="w-5 h-5 text-amber-400" />;
    if (conditionId >= 500 && conditionId < 600) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (conditionId >= 600 && conditionId < 700) return <CloudSnow className="w-5 h-5 text-indigo-300" />;
    if (conditionId === 800) return <Sun className="w-5 h-5 text-amber-400" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  return (
    <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          7-Day Weather Outlook
        </h3>
      </div>

      <div className="space-y-3">
        {daily.map((day, idx) => {
          // Calculate percentage offsets for Apple Weather style gradient bar
          const leftPercent = Math.max(0, ((day.tempMin - minTempAll) / tempRange) * 100);
          const rightPercent = Math.max(0, ((maxTempAll - day.tempMax) / tempRange) * 100);
          const widthPercent = Math.max(10, 100 - leftPercent - rightPercent);

          return (
            <div
              key={`daily-${day.date}-${idx}`}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors gap-3"
            >
              {/* Day Name */}
              <div className="w-24 font-medium text-sm text-white">
                {idx === 0 ? "Today" : day.dayName}
              </div>

              {/* Weather Icon & Rain % */}
              <div className="flex items-center gap-2 w-20">
                {getDayIcon(day.condition.id)}
                {day.pop > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-400">
                    <Droplets className="w-3 h-3" />
                    {day.pop}%
                  </span>
                )}
              </div>

              {/* Temperature Bar Comparison */}
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs font-medium text-slate-400 w-8 text-right">
                  {formatTemperature(day.tempMin)}
                </span>

                <div className="relative flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-500"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs font-bold text-white w-8">
                  {formatTemperature(day.tempMax)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

