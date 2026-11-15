"use client";

import React from "react";

interface DynamicWeatherBackgroundProps {
  condition?: string;
  isDay?: boolean;
}

export default function DynamicWeatherBackground({
  condition = "Clear",
  isDay = true,
}: DynamicWeatherBackgroundProps) {
  const cond = condition.toLowerCase();

  // Determine dynamic ambient color gradients based on condition
  let bgGradient = "from-slate-950 via-slate-900 to-indigo-950";
  let orb1 = "bg-blue-600/15";
  let orb2 = "bg-purple-600/15";
  let orb3 = "bg-indigo-600/15";

  if (cond.includes("thunder") || cond.includes("storm")) {
    bgGradient = "from-slate-950 via-purple-950/60 to-slate-950";
    orb1 = "bg-purple-600/25";
    orb2 = "bg-indigo-500/20";
    orb3 = "bg-amber-500/15";
  } else if (cond.includes("rain") || cond.includes("drizzle")) {
    bgGradient = "from-slate-950 via-blue-950/60 to-slate-950";
    orb1 = "bg-blue-600/25";
    orb2 = "bg-cyan-600/20";
    orb3 = "bg-sky-500/15";
  } else if (cond.includes("snow")) {
    bgGradient = "from-slate-950 via-sky-950/40 to-slate-950";
    orb1 = "bg-sky-400/20";
    orb2 = "bg-indigo-400/15";
    orb3 = "bg-blue-300/10";
  } else if (cond.includes("cloud")) {
    bgGradient = isDay
      ? "from-slate-950 via-slate-900 to-slate-950"
      : "from-black via-slate-950 to-slate-900";
    orb1 = "bg-slate-600/20";
    orb2 = "bg-blue-800/15";
    orb3 = "bg-indigo-900/15";
  } else if (cond.includes("fog") || cond.includes("mist")) {
    bgGradient = "from-slate-950 via-zinc-900 to-slate-950";
    orb1 = "bg-zinc-600/15";
    orb2 = "bg-slate-700/15";
    orb3 = "bg-slate-800/20";
  } else {
    // Clear / Sunny
    if (isDay) {
      bgGradient = "from-slate-950 via-blue-950/50 to-slate-950";
      orb1 = "bg-blue-500/20";
      orb2 = "bg-amber-500/15";
      orb3 = "bg-indigo-500/20";
    } else {
      bgGradient = "from-black via-indigo-950/50 to-slate-950";
      orb1 = "bg-indigo-600/20";
      orb2 = "bg-purple-600/15";
      orb3 = "bg-blue-700/15";
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Base Canvas Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient} transition-colors duration-1000`} />

      {/* Floating Animated Ambient Glow Orbs */}
      <div
        className={`absolute -top-32 left-1/4 w-[500px] h-[500px] ${orb1} rounded-full blur-[140px] animate-pulse-slow transition-colors duration-1000`}
      />
      <div
        className={`absolute top-1/3 -right-32 w-[600px] h-[600px] ${orb2} rounded-full blur-[160px] animate-float transition-colors duration-1000`}
      />
      <div
        className={`absolute -bottom-32 left-10 w-[550px] h-[550px] ${orb3} rounded-full blur-[140px] transition-colors duration-1000`}
      />

      {/* Subtle Grid Overlay Texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}

