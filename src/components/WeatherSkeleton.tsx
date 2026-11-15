import React from "react";

export default function WeatherSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top search & hero card skeleton */}
      <div className="h-64 rounded-3xl bg-slate-900/60 border border-white/5 p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="w-28 h-5 rounded-full bg-slate-800" />
            <div className="w-48 h-8 rounded-lg bg-slate-800" />
            <div className="w-32 h-4 rounded bg-slate-800/80" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-800" />
        </div>

        <div className="flex justify-between items-end">
          <div className="w-36 h-16 rounded-xl bg-slate-800" />
          <div className="w-20 h-20 rounded-full bg-slate-800" />
        </div>

        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/5">
          <div className="h-12 rounded-xl bg-slate-800/50" />
          <div className="h-12 rounded-xl bg-slate-800/50" />
          <div className="h-12 rounded-xl bg-slate-800/50" />
          <div className="h-12 rounded-xl bg-slate-800/50" />
        </div>
      </div>

      {/* Hourly forecast skeleton */}
      <div className="h-36 rounded-3xl bg-slate-900/60 border border-white/5 p-5">
        <div className="w-36 h-4 rounded bg-slate-800 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-800/60" />
          ))}
        </div>
      </div>

      {/* Grid: 7-day outlook + Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-80 rounded-3xl bg-slate-900/60 border border-white/5 p-6 space-y-4">
          <div className="w-40 h-5 rounded bg-slate-800" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-slate-800/50" />
          ))}
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-3xl bg-slate-900/60 border border-white/5 p-5" />
          ))}
        </div>
      </div>
    </div>
  );
}

