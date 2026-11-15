"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WeatherSearch from "@/components/WeatherSearch";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherHighlightsGrid from "@/components/WeatherHighlightsGrid";
import InteractiveWeatherCharts from "@/components/InteractiveWeatherCharts";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { WeatherData } from "@/types/weather";
import { LayoutDashboard, AlertCircle, RefreshCw } from "lucide-react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cityParam = searchParams.get("city");
  const latParam = searchParams.get("lat");
  const lonParam = searchParams.get("lon");

  const fetchWeather = async (city?: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);

    let url = "/api/weather/forecast?";
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
      if (city) url += `&city=${encodeURIComponent(city)}`;
    } else if (city) {
      url += `city=${encodeURIComponent(city)}`;
    } else {
      url += `city=London`;
    }

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to fetch weather (status ${res.status})`);
      }
      const data: WeatherData = await res.json();
      setWeatherData(data);

      // Save to search history asynchronously
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityName: data.current.cityName,
          temperature: data.current.temperature,
          weatherCondition: data.current.condition.main,
          humidity: data.current.humidity,
          windSpeed: data.current.windSpeed,
        }),
      }).catch((e) => console.log("History logging skipped", e));
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load weather data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latParam && lonParam) {
      fetchWeather(cityParam || undefined, parseFloat(latParam), parseFloat(lonParam));
    } else if (cityParam) {
      fetchWeather(cityParam);
    } else {
      fetchWeather("London");
    }
  }, [cityParam, latParam, lonParam]);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic ambient backdrop */}
      <DynamicWeatherBackground
        condition={weatherData?.current.condition.main || "Clear"}
        isDay={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header with Title and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <LayoutDashboard className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Meteorological Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 pl-10">
              Live telemetry, hourly projections, 7-day synoptic outlook, and atmospheric indicators.
            </p>
          </div>

          <div className="w-full md:w-96">
            <WeatherSearch
              onSelect={({ cityName, lat, lon }) => {
                if (lat && lon) {
                  fetchWeather(cityName, lat, lon);
                } else {
                  fetchWeather(cityName);
                }
              }}
              placeholder="Search city, state, or GPS..."
            />
          </div>
        </div>

        {/* Dashboard Main Content */}
        {loading ? (
          <WeatherSkeleton />
        ) : error ? (
          <div className="rounded-3xl bg-slate-900/80 border border-rose-500/30 p-10 text-center space-y-4 backdrop-blur-xl">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Weather Data Unavailable</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => fetchWeather(cityParam || "London")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top: Current Weather Hero Card */}
            <CurrentWeatherCard weather={weatherData.current} />

            {/* Hourly 24-hour horizontal scroll bar */}
            <HourlyForecast hourly={weatherData.hourly} />

            {/* Interactive Charts: Temperature, Rain probability, Wind */}
            <InteractiveWeatherCharts hourly={weatherData.hourly} />

            {/* Split Grid: 7-Day Outlook (1 col) + Highlights (2 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <DailyForecast daily={weatherData.daily} />
              </div>
              <div className="lg:col-span-2">
                <WeatherHighlightsGrid weather={weatherData.current} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<WeatherSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

