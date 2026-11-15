"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { HourlyForecastItem } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";
import { TrendingUp, Droplets, Wind } from "lucide-react";
import { celsiusToFahrenheit } from "@/lib/utils";

interface InteractiveWeatherChartsProps {
  hourly: HourlyForecastItem[];
}

export default function InteractiveWeatherCharts({ hourly }: InteractiveWeatherChartsProps) {
  const { unit } = useUnit();
  const [activeTab, setActiveTab] = useState<"temp" | "pop" | "wind">("temp");

  if (!hourly || hourly.length === 0) return null;

  // Format chart data with active unit
  const chartData = hourly.slice(0, 16).map((item) => ({
    time: item.time,
    temperature: unit === "F" ? celsiusToFahrenheit(item.temperature) : Math.round(item.temperature),
    feelsLike: unit === "F" ? celsiusToFahrenheit(item.feelsLike) : Math.round(item.feelsLike),
    pop: item.pop,
    humidity: item.humidity,
    windSpeed: Math.round(item.windSpeed * 3.6), // km/h
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-slate-900/95 border border-white/15 p-3 shadow-2xl backdrop-blur-md text-xs space-y-1">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }} className="flex items-center gap-1.5 font-medium">
              <span>{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.value}
                {entry.name.includes("Temp") ? `°${unit}` : entry.name.includes("Precip") || entry.name.includes("Humidity") ? "%" : " km/h"}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-5 sm:p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Hourly Forecast Visualizer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive analytical trends for the next 16 hours
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("temp")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "temp"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setActiveTab("pop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "pop"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            Rain Chance
          </button>
          <button
            onClick={() => setActiveTab("wind")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "wind"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Wind & Humidity
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === "temp" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="feelsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit={`°`} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#38BDF8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name="Feels Like"
                stroke="#A855F7"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#feelsGradient)"
              />
            </AreaChart>
          ) : activeTab === "pop" ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="pop"
                name="Precipitation Probability"
                fill="#3B82F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                name="Wind Speed"
                stroke="#14B8A6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#windGradient)"
              />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#60A5FA"
                strokeWidth={2}
                fillOpacity={0}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

