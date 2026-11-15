export interface WeatherCondition {
  id: number;
  main: string; // Rain, Clouds, Clear, Snow, Thunderstorm, Drizzle, Mist, etc.
  description: string;
  icon: string;
}

export interface CurrentWeather {
  cityName: string;
  country: string;
  state?: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  temperature: number; // in Celsius
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // m/s or km/h
  windDirection: number; // degrees
  windGust?: number;
  visibility: number; // in meters
  cloudPercentage: number; // %
  uvIndex?: number;
  pop?: number; // probability of precipitation (0-100)
  sunrise: number; // unix timestamp in seconds
  sunset: number; // unix timestamp in seconds
  condition: WeatherCondition;
  updatedAt: string;
  timezoneOffset?: number;
}

export interface HourlyForecastItem {
  time: string; // ISO or human readable
  timestamp: number;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pop: number; // precipitation probability %
  uvIndex?: number;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  timestamp: number;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  pressure: number;
  pop: number; // precipitation probability %
  uvIndex?: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts?: {
    event: string;
    description: string;
    start: number;
    end: number;
  }[];
}

export interface CitySearchResult {
  id?: string;
  name: string;
  country: string;
  admin1?: string; // State or region
  latitude: number;
  longitude: number;
}

export interface FavoriteCityItem {
  _id?: string;
  cityName: string;
  country: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  createdAt?: string;
}

export interface WeatherHistoryItem {
  _id?: string;
  cityName: string;
  temperature: number;
  weatherCondition: string;
  humidity: number;
  windSpeed: number;
  searchedAt: string;
}

