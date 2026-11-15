"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Trash2,
  Droplets,
  Wind,
  Gauge,
  Sun,
  Umbrella,
  Loader2,
  AlertCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";
import WeatherSearch from "@/components/WeatherSearch";
import { WeatherData } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";
import { formatWindSpeed, formatPressure } from "@/lib/utils";

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCities = searchParams.get("cities")
    ? searchParams.get("cities")!.split(",").map((c) => c.trim())
    : ["Tokyo", "London", "New York"];

  const [cities, setCities] = useState<string[]>(initialCities);
  const [comparisonData, setComparisonData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { formatTemperature } = useUnit();

  const loadComparison = async (cityList: string[]) => {
    if (cityList.length === 0) {
      setComparisonData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/weather/compare?cities=${encodeURIComponent(cityList.join(","))}`);
      if (!res.ok) throw new Error("Failed to load comparison data");
      const data: WeatherData[] = await res.json();
      setComparisonData(data);
    } catch (err: any) {
      console.error("Comparison load error:", err);
      setError(err.message || "Failed to compare weather.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(cities);
  }, [cities]);

  const handleAddCity = (cityName: string) => {
    if (cities.some((c) => c.toLowerCase() === cityName.toLowerCase())) return;
    if (cities.length >= 4) return;
    const updated = [...cities, cityName];
    setCities(updated);
    setIsAdding(false);
  };

  const handleRemoveCity = (cityName: string) => {
    const updated = cities.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
    setCities(updated);
  };

  return (
    <div className="relative min-h-screen">
      <DynamicWeatherBackground condition="Clear" isDay={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                City Weather Comparison
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
              Side-by-side comparative atmospheric metrics across up to 4 global hubs.
            </p>
          </div>

          {cities.length < 4 && !isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Add City to Compare
            </button>
          )}
        </div>

        {/* Add City Modal/Drawer */}
        {isAdding && (
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30 backdrop-blur-xl shadow-xl space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Select City to Compare (Max 4)
              </span>
              <button
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
            <WeatherSearch
              onSelect={({ cityName }) => handleAddCity(cityName)}
              placeholder="Search city to add..."
              autoFocus
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="text-sm">Fetching and aligning comparative metrics...</span>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-rose-500/30 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-rose-300 text-sm">{error}</p>
          </div>
        ) : comparisonData.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/10 text-center space-y-4">
            <p className="text-sm text-slate-300">No cities selected for comparison.</p>
            <button
              onClick={() => setCities(["Tokyo", "London", "New York"])}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
            >
              Load Default Cities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comparisonData.map((data, idx) => {
              const cur = data.current;
              return (
                <div
                  key={`compare-${cur.cityName}-${idx}`}
                  className="rounded-3xl bg-slate-900/80 border border-white/10 p-6 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-extrabold text-xl text-white group-hover:text-blue-300 transition-colors">
                          {cur.cityName}
                        </h3>
                        <span className="text-xs text-slate-400">{cur.country}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveCity(cur.cityName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove city from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-4xl font-black text-white">
                        {formatTemperature(cur.temperature)}
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 capitalize">
                        {cur.condition.main}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">
                      Feels like {formatTemperature(cur.feelsLike)}
                    </p>
                  </div>

                  {/* Comparative Metrics Table */}
                  <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
                      </span>
                      <span className="font-bold text-white">{cur.humidity}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Wind className="w-3.5 h-3.5 text-teal-400" /> Wind
                      </span>
                      <span className="font-bold text-white">{formatWindSpeed(cur.windSpeed)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Sun className="w-3.5 h-3.5 text-amber-400" /> UV Index
                      </span>
                      <span className="font-bold text-white">{cur.uvIndex ?? 4}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Gauge className="w-3.5 h-3.5 text-purple-400" /> Pressure
                      </span>
                      <span className="font-bold text-white">{formatPressure(cur.pressure)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Umbrella className="w-3.5 h-3.5 text-blue-400" /> Precipitation
                      </span>
                      <span className="font-bold text-white">{cur.pop ?? 0}%</span>
                    </div>
                  </div>

                  {/* Link to City Details */}
                  <button
                    onClick={() => router.push(`/city/${encodeURIComponent(cur.cityName)}`)}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    View City Analytics <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-400" /></div>}>
      <CompareContent />
    </Suspense>
  );
}

