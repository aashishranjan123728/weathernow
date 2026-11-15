"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Droplets,
  Wind,
  Gauge,
  Sunrise,
  Sunset,
  AlertCircle,
  Share2,
} from "lucide-react";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";
import WeatherHighlightsGrid from "@/components/WeatherHighlightsGrid";
import InteractiveWeatherCharts from "@/components/InteractiveWeatherCharts";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { WeatherData } from "@/types/weather";

export default function CityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cityName = decodeURIComponent((params?.cityName as string) || "London");

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCityWeather() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/weather/forecast?city=${encodeURIComponent(cityName)}`);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Unable to locate weather for ${cityName}`);
        }
        const data: WeatherData = await res.json();
        if (isMounted) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("City weather error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load city weather.");
          setLoading(false);
        }
      }
    }

    if (cityName) {
      loadCityWeather();
    }

    return () => {
      isMounted = false;
    };
  }, [cityName]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Weather in ${cityName} – WeatherNow`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen">
      <DynamicWeatherBackground
        condition={weatherData?.current.condition.main || "Clear"}
        isDay={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              {copied ? "Link Copied!" : "Share Report"}
            </button>
            <Link
              href={`/compare?cities=${encodeURIComponent(cityName)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-colors"
            >
              Compare with Other Cities
            </Link>
          </div>
        </div>

        {loading ? (
          <WeatherSkeleton />
        ) : error ? (
          <div className="rounded-3xl bg-slate-900/80 border border-rose-500/30 p-10 text-center space-y-4 backdrop-blur-xl">
            <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">City Not Found</h3>
            <p className="text-sm text-slate-400">{error}</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
            >
              Return to Search
            </Link>
          </div>
        ) : weatherData ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Current Weather Card */}
            <CurrentWeatherCard weather={weatherData.current} />

            {/* 24-Hour Forecast */}
            <HourlyForecast hourly={weatherData.hourly} />

            {/* Analytical Recharts Trends */}
            <InteractiveWeatherCharts hourly={weatherData.hourly} />

            {/* 7-Day Outlook + Highlights */}
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

