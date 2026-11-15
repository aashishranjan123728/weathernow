"use client";

import React, { useRef } from "react";
import { Clock, Droplets, ChevronLeft, ChevronRight, Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import { HourlyForecastItem } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  const { formatTemperature } = useUnit();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const getSmallIcon = (conditionId: number) => {
    if (conditionId >= 200 && conditionId < 300) return <CloudLightning className="w-5 h-5 text-amber-400" />;
    if (conditionId >= 500 && conditionId < 600) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (conditionId >= 600 && conditionId < 700) return <CloudSnow className="w-5 h-5 text-indigo-300" />;
    if (conditionId === 800) return <Sun className="w-5 h-5 text-amber-400" />;
    return <Cloud className="w-5 h-5 text-slate-300" />;
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Hourly Forecast (24 Hours)
          </h3>
        </div>

        {/* Scroll navigation arrows */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {hourly.map((item, idx) => (
          <div
            key={`hourly-${item.timestamp}-${idx}`}
            className="flex-shrink-0 w-20 py-3 px-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 flex flex-col items-center justify-between gap-2.5 text-center group"
          >
            <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">
              {idx === 0 ? "Now" : item.time}
            </span>

            <div className="my-1 group-hover:scale-110 transition-transform">
              {getSmallIcon(item.condition.id)}
            </div>

            <span className="text-sm font-bold text-white">
              {formatTemperature(item.temperature)}
            </span>

            {/* Precipitation probability pill */}
            {item.pop > 0 ? (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-400">
                <Droplets className="w-2.5 h-2.5" />
                {item.pop}%
              </span>
            ) : (
              <span className="text-[10px] text-transparent select-none">-</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

