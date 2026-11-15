import React from "react";
import Link from "next/link";
import {
  CloudSun,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
  Radio,
  ExternalLink,
  Code2,
  Sparkles,
} from "lucide-react";
import DynamicWeatherBackground from "@/components/DynamicWeatherBackground";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <DynamicWeatherBackground condition="Clear" isDay={true} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/25">
            <CloudSun className="w-8 h-8" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            About WeatherNow
          </h1>
          <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A state-of-the-art live meteorological reporting platform built for developers, analysts, and everyday travelers who value accuracy, visual clarity, and real-time responsiveness.
          </p>
        </div>

        {/* Data Architecture */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-10 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Meteorological Data Feeds</h2>
              <p className="text-xs text-slate-400">High-fidelity live observation & forecast pipeline</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            WeatherNow connects to top-tier satellite telemetry and global weather prediction models. Our backend features an automated dual-engine synchronization pipeline:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Engine A</span>
              <h4 className="font-bold text-white text-base">OpenWeatherMap API</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilized for direct city geocoding, current surface observations, barometric atmospheric pressures, and localized meteorological alerts worldwide.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Engine B</span>
              <h4 className="font-bold text-white text-base">Open-Meteo High-Resolution API</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-density WMO global weather models providing 24-hour hourly curves, UV indices, solar trajectories, and 7-day precipitation probability forecasts with zero throttling.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Full-Stack Technology Stack */}
        <div className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-10 backdrop-blur-xl shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Technology Stack</h2>
              <p className="text-xs text-slate-400">Built with modern enterprise-grade open source tooling</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <span className="text-xs font-bold text-blue-400 block mb-1">Frontend</span>
              <span className="font-extrabold text-white text-sm">Next.js 14 App Router</span>
              <span className="text-[11px] text-slate-400 block mt-1">React 18 & TypeScript</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <span className="text-xs font-bold text-teal-400 block mb-1">Styling</span>
              <span className="font-extrabold text-white text-sm">Tailwind CSS</span>
              <span className="text-[11px] text-slate-400 block mt-1">Glassmorphism UI</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <span className="text-xs font-bold text-purple-400 block mb-1">Database</span>
              <span className="font-extrabold text-white text-sm">MongoDB Atlas</span>
              <span className="text-[11px] text-slate-400 block mt-1">Mongoose ODM</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <span className="text-xs font-bold text-amber-400 block mb-1">Auth & Security</span>
              <span className="font-extrabold text-white text-sm">NextAuth.js</span>
              <span className="text-[11px] text-slate-400 block mt-1">Bcrypt Encryption</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all hover:scale-105"
          >
            Launch Live Dashboard <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

