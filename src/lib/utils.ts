import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function formatTemp(celsius: number, unit: "C" | "F" = "C"): string {
  if (isNaN(celsius)) return "--°";
  const value = unit === "F" ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${value}°${unit}`;
}

export function formatWindSpeed(speedMs: number, unit: "metric" | "imperial" = "metric"): string {
  if (unit === "imperial") {
    const mph = Math.round(speedMs * 2.237);
    return `${mph} mph`;
  }
  const kmh = Math.round(speedMs * 3.6);
  return `${kmh} km/h`;
}

export function getWindDirection(deg: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5);
  return directions[index % 16];
}

export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
}

export function formatPressure(hPa: number): string {
  return `${hPa} hPa`;
}

export function formatSunTime(unixTimestamp: number, timezoneOffset: number = 0): string {
  if (!unixTimestamp) return "--:--";
  // Convert UTC timestamp adjusted by timezone offset
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22);
}

export function getWeatherConditionTheme(condition: string, isDay: boolean = true): {
  bgGradient: string;
  accentColor: string;
  cardBg: string;
  textLight: string;
} {
  const cond = condition.toLowerCase();
  
  if (cond.includes("thunder") || cond.includes("storm")) {
    return {
      bgGradient: "from-slate-950 via-purple-950 to-indigo-950",
      accentColor: "text-amber-400",
      cardBg: "bg-slate-900/60 border-purple-500/20",
      textLight: "text-purple-200",
    };
  }
  if (cond.includes("rain") || cond.includes("drizzle")) {
    return {
      bgGradient: "from-slate-900 via-blue-950 to-cyan-950",
      accentColor: "text-blue-400",
      cardBg: "bg-slate-900/60 border-blue-500/20",
      textLight: "text-blue-200",
    };
  }
  if (cond.includes("snow")) {
    return {
      bgGradient: "from-slate-900 via-sky-950 to-indigo-950",
      accentColor: "text-sky-300",
      cardBg: "bg-slate-900/60 border-sky-400/20",
      textLight: "text-sky-200",
    };
  }
  if (cond.includes("cloud")) {
    return {
      bgGradient: isDay 
        ? "from-slate-900 via-blue-950 to-slate-900"
        : "from-slate-950 via-gray-900 to-black",
      accentColor: "text-cyan-400",
      cardBg: "bg-slate-900/60 border-slate-700/30",
      textLight: "text-slate-300",
    };
  }
  if (cond.includes("fog") || cond.includes("mist") || cond.includes("haze")) {
    return {
      bgGradient: "from-zinc-950 via-slate-900 to-zinc-900",
      accentColor: "text-zinc-400",
      cardBg: "bg-zinc-900/60 border-zinc-700/30",
      textLight: "text-zinc-300",
    };
  }
  
  // Clear or Default
  if (!isDay) {
    return {
      bgGradient: "from-slate-950 via-indigo-950 to-purple-950",
      accentColor: "text-indigo-300",
      cardBg: "bg-slate-900/60 border-indigo-500/20",
      textLight: "text-indigo-200",
    };
  }

  return {
    bgGradient: "from-blue-900 via-indigo-950 to-purple-950",
    accentColor: "text-amber-400",
    cardBg: "bg-slate-900/60 border-blue-500/20",
    textLight: "text-blue-200",
  };
}

