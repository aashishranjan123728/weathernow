import React from "react";
import Link from "next/link";
import { CloudSun, Github, Globe, Shield, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-md text-slate-400 text-sm mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">WeatherNow</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-fast, accurate live weather reporting dashboard powered by OpenWeatherMap and Open-Meteo with global satellite feeds, real-time geocoding, and Apple Weather inspired visual analytics.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Weather APIs Operational
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                  Interactive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/city/Tokyo" className="hover:text-blue-400 transition-colors">
                  Tokyo Live Weather
                </Link>
              </li>
              <li>
                <Link href="/city/London" className="hover:text-blue-400 transition-colors">
                  London Live Weather
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-400 transition-colors">
                  City Comparison Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Community */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Account</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition-colors">
                  Saved Favorite Cities
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-blue-400 transition-colors">
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About WeatherNow
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Architecture */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Tech Stack</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Crafted with Next.js 14 App Router, TypeScript, Tailwind CSS, Recharts, Framer Motion, MongoDB Atlas, and NextAuth.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-500">Production Ready v1.0.0</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} WeatherNow Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web standards and high precision weather data.
          </p>
        </div>
      </div>
    </footer>
  );
}

