"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
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

  useEffect(() => {
    let isMounted = true;

    async function loadInitialWeather() {
      try {
        const res = await fetch("/api/weather/forecast?city=New York");

        if (!res.ok) {
          throw new Error("Could not load initial live weather");
        }

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
    <main className="relative min-h-screen overflow-hidden">

      <DynamicWeatherBackground
        condition={weatherData?.current.condition.main || "Clear"}
        isDay={true}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-purple-950/40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-16">

        {/* HERO SECTION */}

        <section className="text-center max-w-4xl mx-auto space-y-7 pt-8">

          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-bold backdrop-blur-xl shadow-lg shadow-blue-500/10">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Next Generation Live Global Weather
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            Real-Time Weather.
            <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Hyper-Accurate.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore global weather forecasts, live temperature,
            precipitation updates and beautiful atmospheric
            weather analytics.
          </p>

          {/* SEARCH BAR */}

          <div className="pt-4 max-w-2xl mx-auto p-2 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/10 shadow-2xl backdrop-blur-xl">
            <WeatherSearch placeholder="Search any city, capital, or coordinate worldwide..." />
          </div>

          {/* TRENDING CITIES */}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-sm">

            <span className="font-bold text-cyan-300">
              Trending:
            </span>

            {["Tokyo", "Paris", "London", "San Francisco", "Sydney"].map((city) => (
              <Link
                key={city}
                href={`/city/${encodeURIComponent(city)}`}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-slate-200 hover:text-white border border-white/10 hover:border-blue-300/40 transition-all duration-300 hover:-translate-y-1"
              >
                {city}
              </Link>
            ))}

          </div>
        </section>

        {/* LIVE WEATHER SECTION */}

        <section className="space-y-7">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30">
                <Zap className="w-6 h-6 text-amber-300" />
              </span>
              Live Spotlight Weather
            </h2>

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-600 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>

          </div>

          {loading ? (
            <div className="rounded-3xl border border-blue-400/20 bg-slate-900/60 p-6 backdrop-blur-xl">
              <WeatherSkeleton />
            </div>
          ) : error ? (

            <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-950/70 to-slate-900 border border-rose-400/30 text-center space-y-4">

              <p className="text-rose-300 font-bold">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-bold transition-all"
              >
                Retry
              </button>

            </div>

          ) : weatherData ? (

            <div className="space-y-7">

              <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-blue-950/40 to-purple-950/40 p-2 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
                <CurrentWeatherCard weather={weatherData.current} />
              </div>

              <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 p-3 shadow-xl backdrop-blur-xl">
                <HourlyForecast hourly={weatherData.hourly} />
              </div>

            </div>

          ) : null}

        </section>

        {/* FEATURED CITIES */}

        <section className="space-y-6">

          <div className="text-center space-y-3">

            <h2 className="text-3xl font-black text-white">
              Explore the
              <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                {" "}World
              </span>
            </h2>

            <p className="text-slate-400">
              Discover weather conditions across popular global cities.
            </p>

          </div>

          <FeaturedCities />

        </section>

        {/* WHY WEATHER NOW */}

        <section className="rounded-3xl bg-gradient-to-br from-blue-950/80 via-indigo-950/70 to-purple-950/80 border border-white/10 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl">

          <div className="max-w-2xl mb-10">

            <div className="inline-flex items-center gap-2 text-cyan-300 text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              POWERFUL FEATURES
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Why WeatherNow?
            </h3>

            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Experience modern weather technology with
              powerful analytics, reliable forecasts and
              beautiful interactive dashboards.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* CARD 1 */}

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-400/20 hover:border-cyan-300/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-2">

              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-cyan-300" />
              </div>

              <h4 className="font-black text-white text-lg mb-3">
                Dual API Reliability
              </h4>

              <p className="text-sm text-slate-300 leading-relaxed">
                Seamless failover between OpenWeatherMap and
                Open-Meteo feeds for reliable weather information.
              </p>

            </div>

            {/* CARD 2 */}

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-400/20 hover:border-purple-300/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2">

              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-300" />
              </div>

              <h4 className="font-black text-white text-lg mb-3">
                Interactive Analytics
              </h4>

              <p className="text-sm text-slate-300 leading-relaxed">
                Explore temperature trends, precipitation
                probabilities and wind analytics.
              </p>

            </div>

            {/* CARD 3 */}

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/20 hover:border-pink-300/50 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-2">

              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6 text-pink-300" />
              </div>

              <h4 className="font-black text-white text-lg mb-3">
                Cloud Sync & Saved Hubs
              </h4>

              <p className="text-sm text-slate-300 leading-relaxed">
                Store favorite destinations, customize temperature
                units and manage your weather search history.
              </p>

            </div>

          </div>

        </section>

        {/* FOOTER MESSAGE */}

        <div className="text-center pt-4 pb-6">

          <p className="text-sm text-slate-400">
            Powered by WeatherNow
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Your World. Your Weather. Your Forecast.
          </p>

        </div>

      </div>
    </main>
  );
}
