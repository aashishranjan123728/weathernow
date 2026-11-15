"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Heart,
  History,
  Trash2,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  LogOut,
  Settings,
  AlertCircle,
  Loader2,
  CloudSun,
} from "lucide-react";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";
import { FavoriteCityItem, WeatherHistoryItem } from "@/types/weather";
import { useUnit } from "@/context/UnitContext";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { unit, toggleUnit, formatTemperature } = useUnit();

  const [favorites, setFavorites] = useState<FavoriteCityItem[]>([]);
  const [history, setHistory] = useState<WeatherHistoryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
      return;
    }

    if (status === "authenticated") {
      loadUserData();
    }
  }, [status, router]);

  const loadUserData = async () => {
    setLoadingData(true);
    try {
      const [favRes, histRes] = await Promise.all([
        fetch("/api/favorites"),
        fetch("/api/history"),
      ]);

      if (favRes.ok) {
        const favs = await favRes.json();
        setFavorites(Array.isArray(favs) ? favs : []);
      }

      if (histRes.ok) {
        const hists = await histRes.json();
        setHistory(Array.isArray(hists) ? hists : []);
      }
    } catch (e) {
      console.error("Failed to load user profile data:", e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRemoveFavorite = async (id?: string, cityName?: string) => {
    try {
      const url = id ? `/api/favorites?id=${id}` : `/api/favorites?cityName=${encodeURIComponent(cityName || "")}`;
      await fetch(url, { method: "DELETE" });
      setFavorites(favorites.filter((f) => (id ? f._id !== id : f.cityName !== cityName)));
    } catch (e) {
      console.error("Error removing favorite:", e);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch("/api/history", { method: "DELETE" });
      setHistory([]);
    } catch (e) {
      console.error("Error clearing history:", e);
    }
  };

  if (status === "loading" || (status === "authenticated" && loadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <DynamicWeatherBackground condition="Clear" isDay={true} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* User Profile Card Header */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/25">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{session.user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{session.user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleUnit}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-blue-400" />
              Units: °{unit}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Saved Favorites Section */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Favorite Hubs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Quick access to destinations you track regularly
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              {favorites.length} Saved
            </span>
          </div>

          {favorites.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 text-center space-y-3">
              <CloudSun className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No favorite cities saved yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Search for any location on the Home or Dashboard page and click the heart icon to save it here.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Explore Weather Dashboard
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav._id || fav.cityName}
                  className="group relative rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 p-4 transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">
                        {fav.cityName}
                      </h4>
                      <span className="text-xs text-slate-400">{fav.country || "Global"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/city/${encodeURIComponent(fav.cityName)}`}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                      title="Open City Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleRemoveFavorite(fav._id, fav.cityName)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search History Section */}
        <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" /> Recent Search History
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically logged meteorological queries across your sessions
              </p>
            </div>

            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
              No recent search history found. As you search cities, your trail will be recorded here.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {history.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="py-3 flex items-center justify-between hover:bg-white/5 px-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <Link
                        href={`/city/${encodeURIComponent(item.cityName)}`}
                        className="font-medium text-sm text-white hover:text-blue-300 transition-colors"
                      >
                        {item.cityName}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span>{item.weatherCondition}</span>
                        <span>•</span>
                        <span>Humidity: {item.humidity}%</span>
                        <span>•</span>
                        <span>Wind: {Math.round(item.windSpeed * 3.6)} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-white">
                      {formatTemperature(item.temperature)}
                    </span>
                    <Link
                      href={`/city/${encodeURIComponent(item.cityName)}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

