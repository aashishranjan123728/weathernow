import {
  WeatherData,
  CurrentWeather,
  HourlyForecastItem,
  DailyForecastItem,
  CitySearchResult,
} from "@/types/weather";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// In-memory server-side cache to reduce API calls and prevent rate limiting
const cache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// WMO Weather code translator for Open-Meteo
function mapWmoToCondition(code: number, isDay: boolean = true) {
  switch (code) {
    case 0:
      return { id: 800, main: "Clear", description: isDay ? "Clear sky" : "Clear night", icon: isDay ? "01d" : "01n" };
    case 1:
      return { id: 801, main: "Clear", description: "Mainly clear", icon: isDay ? "02d" : "02n" };
    case 2:
      return { id: 802, main: "Clouds", description: "Partly cloudy", icon: isDay ? "03d" : "03n" };
    case 3:
      return { id: 803, main: "Clouds", description: "Overcast", icon: "04d" };
    case 45:
    case 48:
      return { id: 741, main: "Fog", description: "Foggy conditions", icon: "50d" };
    case 51:
    case 53:
    case 55:
      return { id: 300, main: "Drizzle", description: "Light drizzle", icon: "09d" };
    case 61:
      return { id: 500, main: "Rain", description: "Slight rain", icon: "10d" };
    case 63:
      return { id: 501, main: "Rain", description: "Moderate rain", icon: "10d" };
    case 65:
      return { id: 502, main: "Rain", description: "Heavy rain", icon: "10d" };
    case 71:
    case 73:
    case 75:
      return { id: 600, main: "Snow", description: "Snow fall", icon: "13d" };
    case 77:
      return { id: 611, main: "Snow", description: "Snow grains", icon: "13d" };
    case 80:
    case 81:
    case 82:
      return { id: 521, main: "Rain", description: "Rain showers", icon: "09d" };
    case 85:
    case 86:
      return { id: 621, main: "Snow", description: "Snow showers", icon: "13d" };
    case 95:
      return { id: 200, main: "Thunderstorm", description: "Thunderstorm", icon: "11d" };
    case 96:
    case 99:
      return { id: 211, main: "Thunderstorm", description: "Thunderstorm with hail", icon: "11d" };
    default:
      return { id: 800, main: "Clear", description: "Clear sky", icon: isDay ? "01d" : "01n" };
  }
}

/**
 * Geocode a city name or query into latitude and longitude
 */
export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();

  // Try OpenWeatherMap Geocoding if API key is configured
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 10) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cleanQuery
        )}&limit=6&appid=${OPENWEATHER_API_KEY}`
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item: any) => ({
            name: item.name,
            country: item.country,
            admin1: item.state || "",
            latitude: item.lat,
            longitude: item.lon,
          }));
        }
      }
    } catch (err) {
      console.warn("OpenWeatherMap Geocoding failed, falling back to Open-Meteo Geocoding:", err);
    }
  }

  // Open-Meteo Geocoding API (High accuracy, global, free, no key required)
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cleanQuery
      )}&count=6&language=en&format=json`
    );
    if (!res.ok) throw new Error("Geocoding service unavailable");
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country_code ? item.country_code.toUpperCase() : item.country || "",
      admin1: item.admin1 || "",
      latitude: item.latitude,
      longitude: item.longitude,
    }));
  } catch (err) {
    console.error("Geocoding search failed:", err);
    return [];
  }
}

/**
 * Fetch complete live weather data using Open-Meteo
 */
async function fetchFromOpenMeteo(
  lat: number,
  lon: number,
  cityName: string,
  country: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API returned status ${res.status}`);
  }

  const raw = await res.json();
  const currentRaw = raw.current;
  const hourlyRaw = raw.hourly;
  const dailyRaw = raw.daily;

  const isDay = currentRaw.is_day === 1;
  const condition = mapWmoToCondition(currentRaw.weather_code, isDay);

  // Sunrise and Sunset for today
  const todaySunriseIso = dailyRaw.sunrise?.[0];
  const todaySunsetIso = dailyRaw.sunset?.[0];
  const sunriseUnix = todaySunriseIso ? Math.floor(new Date(todaySunriseIso).getTime() / 1000) : 0;
  const sunsetUnix = todaySunsetIso ? Math.floor(new Date(todaySunsetIso).getTime() / 1000) : 0;

  // Build current weather
  const current: CurrentWeather = {
    cityName,
    country,
    coordinates: { lat, lon },
    temperature: currentRaw.temperature_2m,
    feelsLike: currentRaw.apparent_temperature,
    tempMin: dailyRaw.temperature_2m_min?.[0] ?? currentRaw.temperature_2m,
    tempMax: dailyRaw.temperature_2m_max?.[0] ?? currentRaw.temperature_2m,
    humidity: currentRaw.relative_humidity_2m,
    pressure: Math.round(currentRaw.pressure_msl || currentRaw.surface_pressure || 1013),
    windSpeed: currentRaw.wind_speed_10m / 3.6, // convert km/h to m/s
    windDirection: currentRaw.wind_direction_10m,
    windGust: currentRaw.wind_gusts_10m ? currentRaw.wind_gusts_10m / 3.6 : undefined,
    visibility: 10000, // Standard 10km when clear
    cloudPercentage: currentRaw.cloud_cover ?? 20,
    uvIndex: dailyRaw.uv_index_max?.[0] ?? 4,
    pop: dailyRaw.precipitation_probability_max?.[0] ?? 0,
    sunrise: sunriseUnix,
    sunset: sunsetUnix,
    condition,
    updatedAt: new Date().toISOString(),
    timezoneOffset: raw.utc_offset_seconds || 0,
  };

  // Build hourly forecast (next 24-36 hours starting from current time)
  const hourly: HourlyForecastItem[] = [];
  const nowMs = Date.now();
  const currentHourIndex = hourlyRaw.time.findIndex((t: string) => new Date(t).getTime() >= nowMs - 3600000);
  const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
  const endIndex = Math.min(startIndex + 24, hourlyRaw.time.length);

  for (let i = startIndex; i < endIndex; i++) {
    const timeIso = hourlyRaw.time[i];
    const timestamp = Math.floor(new Date(timeIso).getTime() / 1000);
    const hourDate = new Date(timeIso);
    const hour = hourDate.getHours();
    const isHourDay = hour >= 6 && hour < 19;
    const cond = mapWmoToCondition(hourlyRaw.weather_code[i], isHourDay);

    hourly.push({
      time: hourDate.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      timestamp,
      temperature: hourlyRaw.temperature_2m[i],
      feelsLike: hourlyRaw.apparent_temperature[i],
      condition: cond,
      humidity: hourlyRaw.relative_humidity_2m[i],
      windSpeed: hourlyRaw.wind_speed_10m[i] / 3.6,
      pop: hourlyRaw.precipitation_probability[i] || 0,
      uvIndex: hourlyRaw.uv_index?.[i] ?? 0,
    });
  }

  // Build 7-day daily forecast
  const daily: DailyForecastItem[] = [];
  const daysCount = Math.min(dailyRaw.time.length, 7);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  for (let i = 0; i < daysCount; i++) {
    const dateStr = dailyRaw.time[i];
    const d = new Date(dateStr);
    const dayName = i === 0 ? "Today" : dayNames[d.getDay()];
    const cond = mapWmoToCondition(dailyRaw.weather_code[i], true);
    const sRise = dailyRaw.sunrise?.[i] ? Math.floor(new Date(dailyRaw.sunrise[i]).getTime() / 1000) : 0;
    const sSet = dailyRaw.sunset?.[i] ? Math.floor(new Date(dailyRaw.sunset[i]).getTime() / 1000) : 0;

    daily.push({
      date: dateStr,
      dayName,
      timestamp: Math.floor(d.getTime() / 1000),
      tempMin: dailyRaw.temperature_2m_min[i],
      tempMax: dailyRaw.temperature_2m_max[i],
      condition: cond,
      humidity: currentRaw.relative_humidity_2m,
      windSpeed: (dailyRaw.wind_speed_10m_max?.[i] ?? 10) / 3.6,
      pressure: current.pressure,
      pop: dailyRaw.precipitation_probability_max?.[i] || 0,
      uvIndex: dailyRaw.uv_index_max?.[i] ?? 5,
      sunrise: sRise,
      sunset: sSet,
    });
  }

  return { current, hourly, daily };
}

/**
 * Fetch weather from OpenWeatherMap API
 */
async function fetchFromOpenWeatherMap(
  lat: number,
  lon: number,
  cityName: string,
  country: string
): Promise<WeatherData> {
  const [currentRes, forecastRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
    ),
  ]);

  if (!currentRes.ok || !forecastRes.ok) {
    throw new Error(`OpenWeather API returned status: current=${currentRes.status}, forecast=${forecastRes.status}`);
  }

  const curData = await currentRes.json();
  const fData = await forecastRes.json();

  const condition = {
    id: curData.weather[0]?.id || 800,
    main: curData.weather[0]?.main || "Clear",
    description: curData.weather[0]?.description || "Clear sky",
    icon: curData.weather[0]?.icon || "01d",
  };

  const current: CurrentWeather = {
    cityName: curData.name || cityName,
    country: curData.sys?.country || country,
    coordinates: { lat, lon },
    temperature: curData.main.temp,
    feelsLike: curData.main.feels_like,
    tempMin: curData.main.temp_min,
    tempMax: curData.main.temp_max,
    humidity: curData.main.humidity,
    pressure: curData.main.pressure,
    windSpeed: curData.wind.speed,
    windDirection: curData.wind.deg || 0,
    windGust: curData.wind.gust,
    visibility: curData.visibility || 10000,
    cloudPercentage: curData.clouds?.all || 0,
    uvIndex: 5,
    pop: Math.round((fData.list?.[0]?.pop || 0) * 100),
    sunrise: curData.sys?.sunrise || 0,
    sunset: curData.sys?.sunset || 0,
    condition,
    updatedAt: new Date().toISOString(),
    timezoneOffset: curData.timezone || 0,
  };

  // Build hourly from 3-hourly forecast
  const hourly: HourlyForecastItem[] = (fData.list || []).slice(0, 10).map((item: any) => {
    const itemDate = new Date(item.dt * 1000);
    return {
      time: itemDate.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
      timestamp: item.dt,
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      condition: {
        id: item.weather[0]?.id || 800,
        main: item.weather[0]?.main || "Clear",
        description: item.weather[0]?.description || "Clear sky",
        icon: item.weather[0]?.icon || "01d",
      },
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      pop: Math.round((item.pop || 0) * 100),
    };
  });

  // Group 3-hour forecasts into daily items
  const dailyMap = new Map<string, any[]>();
  for (const item of fData.list || []) {
    const dayKey = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(dayKey)) dailyMap.set(dayKey, []);
    dailyMap.get(dayKey)!.push(item);
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const daily: DailyForecastItem[] = [];
  let dayIndex = 0;

  for (const [dateStr, items] of Array.from(dailyMap.entries())) {
    if (dayIndex >= 7) break;
    const temps = items.map((i) => i.main.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const midItem = items[Math.floor(items.length / 2)] || items[0];
    const d = new Date(dateStr);
    const dayName = dayIndex === 0 ? "Today" : dayNames[d.getDay()];

    daily.push({
      date: dateStr,
      dayName,
      timestamp: Math.floor(d.getTime() / 1000),
      tempMin: minTemp,
      tempMax: maxTemp,
      condition: {
        id: midItem.weather[0]?.id || 800,
        main: midItem.weather[0]?.main || "Clear",
        description: midItem.weather[0]?.description || "Clear sky",
        icon: midItem.weather[0]?.icon || "01d",
      },
      humidity: midItem.main.humidity,
      windSpeed: midItem.wind.speed,
      pressure: midItem.main.pressure,
      pop: Math.round(Math.max(...items.map((i) => i.pop || 0)) * 100),
      sunrise: current.sunrise,
      sunset: current.sunset,
    });
    dayIndex++;
  }

  return { current, hourly, daily };
}

/**
 * Get complete weather data for coordinates or city name
 */
export async function getWeatherData(
  lat: number,
  lon: number,
  cityName: string = "Unknown Location",
  country: string = ""
): Promise<WeatherData> {
  const cacheKey = `${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const now = Date.now();

  const cached = cache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let weatherData: WeatherData;

  // Try OpenWeatherMap first if key exists
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY.length > 10) {
    try {
      weatherData = await fetchFromOpenWeatherMap(lat, lon, cityName, country);
      cache.set(cacheKey, { data: weatherData, timestamp: now });
      return weatherData;
    } catch (err) {
      console.warn("OpenWeatherMap fetch failed, falling back to Open-Meteo:", err);
    }
  }

  // Live real data via Open-Meteo
  weatherData = await fetchFromOpenMeteo(lat, lon, cityName, country);
  cache.set(cacheKey, { data: weatherData, timestamp: now });
  return weatherData;
}

