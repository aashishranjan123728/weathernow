"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CloudSun,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Gauge,
  Compass,
  TrendingUp,
} from "lucide-react";
import WeatherSearch from "@/components/WeatherSearch";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HourlyForecast from "@/components/HourlyForecast";
import FeaturedCities from "@/components/FeaturedCities";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { WeatherData } from "@/types/weather";

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load default initial weather (e.g. New York or user's detected location)
  useEffect(() => {
    let isMounted = true;

    async function loadInitialWeather() {
      try {
        const res = await fetch("/api/weather/forecast?city=New York");
        if (!res.ok) throw new Error("Could not load initial live weather");
        const data: WeatherData = await res.json();
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Initial weather fetch error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load live weather.");
          setLoading(false);
        }
      }
    }

    loadInitialWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic atmospheric background */}
      <DynamicWeatherBackground
        condition={weatherData?.current.condition.main || "Clear"}
        isDay={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next-Generation Live Global Weather Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Real-Time Weather.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Hyper-Accurate.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant global forecasts, minute-by-minute satellite precipitation, Apple Weather-inspired analytical dashboards, and atmospheric indicators.
          </p>

          {/* Search Bar in Hero */}
          <div className="pt-2 max-w-xl mx-auto">
            <WeatherSearch placeholder="Search any city, capital, or coordinate worldwide..." />
          </div>

          {/* Quick Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-400">
            <span className="font-semibold text-slate-500">Trending:</span>
            {["Tokyo", "Paris", "London", "San Francisco", "Sydney"].map((city) => (
              <Link
                key={city}
                href={`/city/${encodeURIComponent(city)}`}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Live Weather Spotlight Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Live Spotlight Weather
            </h2>
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-colors"
            >
              Open Full Dashboard{" "}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <WeatherSkeleton />
          ) : error ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-rose-500/20 text-center space-y-3">
              <p className="text-rose-400 font-semibold">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Retry
              </button>
            </div>
          ) : weatherData ? (
            <div className="space-y-6">
              <CurrentWeatherCard weather={weatherData.current} />
              <HourlyForecast hourly={weatherData.hourly} />
            </div>
          ) : null}
        </div>

        {/* Featured Global Cities */}
        <FeaturedCities />

        {/* Why WeatherNow Highlights */}
        <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-8 sm:p-10 backdrop-blur-xl">
          <div className="max-w-2xl mb-8">
            <h3 className="text-2xl font-black text-white">Why WeatherNow?</h3>
            <p className="text-sm text-slate-400 mt-1">
              Engineered with modern full-stack web standards for lightning-fast speeds and reliable meteorological accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Dual API Reliability</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamless failover between OpenWeatherMap and high-precision Open-Meteo feeds ensures 100% live uptime worldwide.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Interactive Recharts Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore temperature arcs, precipitation probabilities, and wind gust envelopes with interactive vector charts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">Cloud Sync & Saved Hubs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Securely store favorite destinations, customize temperature units (°C/°F), and track your search trail in MongoDB Atlas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

