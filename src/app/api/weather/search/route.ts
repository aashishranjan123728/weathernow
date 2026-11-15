import { NextResponse } from "next/server";
import { searchCities } from "@/services/weatherService";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json([]);
    }

    const cities = await searchCities(q.trim());
    return NextResponse.json(cities);
  } catch (err: any) {
    console.error("API /api/weather/search error:", err);
    return NextResponse.json([], { status: 200 }); // Return empty array on search failure
  }
}

