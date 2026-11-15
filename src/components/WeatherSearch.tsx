"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Navigation, History, X, Loader2 } from "lucide-react";
import { CitySearchResult } from "@/types/weather";

interface WeatherSearchProps {
  onSelect?: (result: { cityName: string; lat: number; lon: number }) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function WeatherSearch({
  onSelect,
  placeholder = "Search city, state, or country...",
  className = "",
  autoFocus = false,
}: WeatherSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("weathernow_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveRecentSearch = (cityName: string) => {
    const filtered = recentSearches.filter((item) => item.toLowerCase() !== cityName.toLowerCase());
    const updated = [cityName, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("weathernow_recent_searches", JSON.stringify(updated));
  };

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: CitySearchResult[] = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: CitySearchResult) => {
    saveRecentSearch(city.name);
    setQuery("");
    setIsOpen(false);
    if (onSelect) {
      onSelect({
        cityName: city.name,
        lat: city.latitude,
        lon: city.longitude,
      });
    } else {
      router.push(`/dashboard?city=${encodeURIComponent(city.name)}&lat=${city.latitude}&lon=${city.longitude}`);
    }
  };

  const handleSelectRecent = (cityName: string) => {
    setQuery("");
    setIsOpen(false);
    if (onSelect) {
      onSelect({ cityName, lat: 0, lon: 0 });
    } else {
      router.push(`/dashboard?city=${encodeURIComponent(cityName)}`);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        if (onSelect) {
          onSelect({
            cityName: "My Location",
            lat: latitude,
            lon: longitude,
          });
        } else {
          router.push(`/dashboard?lat=${latitude}&lon=${longitude}&city=${encodeURIComponent("My Location")}`);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn("Geolocation error:", error);
        setLocationError("Location permission denied or unavailable.");
      },
      { timeout: 10000 }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim().length > 0) {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      } else {
        saveRecentSearch(query.trim());
        if (onSelect) {
          onSelect({ cityName: query.trim(), lat: 0, lon: 0 });
        } else {
          router.push(`/dashboard?city=${encodeURIComponent(query.trim())}`);
        }
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-slate-900/70 border border-white/15 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 text-white placeholder-slate-400 text-sm shadow-xl backdrop-blur-xl outline-none transition-all duration-200"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}

          {/* Location button */}
          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            title="Use current location"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/20 transition-all duration-200"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {locationError && (
        <p className="mt-1 text-xs text-rose-400 pl-2">{locationError}</p>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-slate-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Searching worldwide cities...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-3.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Locations Found
              </div>
              {results.map((city, idx) => (
                <button
                  key={`${city.name}-${city.latitude}-${idx}`}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-slate-200 hover:text-white hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="font-medium text-white">{city.name}</span>
                      {city.admin1 && (
                        <span className="text-xs text-slate-400 ml-1.5">
                          {city.admin1}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                    {city.country}
                  </span>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-sm text-slate-400">
              No matching locations found. Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-xs">Enter</kbd> to search anyway.
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Recent Searches
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem("weathernow_recent_searches");
                  }}
                  className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((city, i) => (
                <button
                  key={`recent-${city}-${i}`}
                  onClick={() => handleSelectRecent(city)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              Type at least 2 characters to search global cities or use GPS.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

