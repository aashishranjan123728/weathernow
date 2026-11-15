import { NextResponse } from "next/server";
import { getWeatherData, searchCities } from "@/services/weatherService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const citiesParam = searchParams.get("cities");

    if (!citiesParam) {
      return NextResponse.json({ error: "Missing 'cities' query parameter" }, { status: 400 });
    }

    const cityNames = citiesParam
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
      .slice(0, 4); // Max 4 cities to compare at once

    const results = await Promise.all(
      cityNames.map(async (name) => {
        try {
          const search = await searchCities(name);
          if (!search || search.length === 0) return null;
          const { latitude, longitude, country, name: resolvedName } = search[0];
          const data = await getWeatherData(latitude, longitude, resolvedName, country);
          return data;
        } catch (e) {
          console.error(`Comparison fetch failed for ${name}:`, e);
          return null;
        }
      })
    );

    const validData = results.filter((r) => r !== null);
    return NextResponse.json(validData);
  } catch (err: any) {
    console.error("API /api/weather/compare error:", err);
    return NextResponse.json({ error: "Failed to compare weather" }, { status: 500 });
  }
}

