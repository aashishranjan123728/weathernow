import { NextResponse } from "next/server";
import { getWeatherData, searchCities } from "@/services/weatherService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const latParam = searchParams.get("lat");
    const lonParam = searchParams.get("lon");

    let lat: number;
    let lon: number;
    let cityName = city || "London";
    let country = "";

    if (latParam && lonParam) {
      lat = parseFloat(latParam);
      lon = parseFloat(lonParam);
      if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json({ error: "Invalid coordinates provided" }, { status: 400 });
      }
      cityName = city || "Local Forecast";
    } else if (city) {
      const results = await searchCities(city);
      if (!results || results.length === 0) {
        return NextResponse.json({ error: `City '${city}' not found.` }, { status: 404 });
      }
      lat = results[0].latitude;
      lon = results[0].longitude;
      cityName = results[0].name;
      country = results[0].country;
    } else {
      // Default to London
      lat = 51.5074;
      lon = -0.1278;
      cityName = "London";
      country = "GB";
    }

    const data = await getWeatherData(lat, lon, cityName, country);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("API /api/weather/forecast error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch weather forecast" },
      { status: 500 }
    );
  }
}

