"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Globe, ArrowRight, Sun, Cloud, CloudRain, Droplets, Wind, Sparkles } from "lucide-react";
import { useUnit } from "@/context/UnitContext";

interface FeaturedCityWeather {
  name: string;
  country: string;
  temp: number;
  condition: string;
  conditionId: number;
  humidity: number;
  windSpeed: number;
}

const FEATURED_CITIES = [
  { name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "New York", country: "US", lat: 40.7128, lon: -74.006 },
  { name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
];

export default function FeaturedCities() {
  const { formatTemperature } = useUnit();
  const [citiesData, setCitiesData] = useState<FeaturedCityWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const promises = FEATURED_CITIES.map(async (city) => {
          const res = await fetch(`/api/weather/current?lat=${city.lat}&lon=${city.lon}&city=${encodeURIComponent(city.name)}`);
          if (res.ok) {
            const data = await res.json();
            return {
              name: city.name,
              country: city.country,
              temp: data.temperature,
              condition: data.condition.main,
              conditionId: data.condition.id,
              humidity: data.humidity,
              windSpeed: data.windSpeed,
            };
          }
          return null;
        });

        const results = await Promise.all(promises);
        if (isMounted) {
          setCitiesData(results.filter((c) => c !== null) as FeaturedCityWeather[]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load featured cities:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  const getCityIcon = (conditionId: number) => {
    if (conditionId >= 500 && conditionId < 600) return <CloudRain className="w-6 h-6 text-blue-400" />;
    if (conditionId === 800) return <Sun className="w-6 h-6 text-amber-400" />;
    return <Cloud className="w-6 h-6 text-slate-300" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" /> Major World Hubs
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time conditions across premier international metropolitan centers
          </p>
        </div>

        <Link
          href="/compare"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
        >
          Compare All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-city-${i}`}
                className="h-32 rounded-3xl bg-slate-900/50 border border-white/5 animate-pulse p-5"
              />
            ))
          : citiesData.map((city) => (
              <Link
                key={city.name}
                href={`/city/${encodeURIComponent(city.name)}`}
                className="group relative overflow-hidden rounded-3xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/10 hover:border-blue-500/30 p-5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                        {city.name}
                      </span>
                      <span className="text-xs font-medium text-slate-400 px-1.5 py-0.2 rounded bg-white/5 border border-white/10">
                        {city.country}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 mt-0.5 block">
                      {city.condition}
                    </span>
                  </div>

                  <div className="p-2 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                    {getCityIcon(city.conditionId)}
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div className="text-3xl font-black text-white">
                    {formatTemperature(city.temp)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      {city.humidity}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-teal-400" />
                      {Math.round(city.windSpeed * 3.6)} km/h
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}

