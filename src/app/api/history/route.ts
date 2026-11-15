import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import WeatherHistory from "@/models/WeatherHistory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]);
    }

    const history = await WeatherHistory.find({ userId }).sort({ searchedAt: -1 }).limit(10);
    return NextResponse.json(history);
  } catch (err: any) {
    console.error("GET /api/history error:", err);
    return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Guest search not stored in DB" }, { status: 200 });
    }

    const userId = (session.user as any).id || session.user.email;
    const body = await req.json();
    const { cityName, temperature, weatherCondition, humidity, windSpeed } = body;

    if (!cityName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, message: "Logged locally" });
    }

    const item = await WeatherHistory.create({
      userId,
      cityName,
      temperature: temperature || 0,
      weatherCondition: weatherCondition || "Clear",
      humidity: humidity || 0,
      windSpeed: windSpeed || 0,
      searchedAt: new Date(),
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/history error:", err);
    return NextResponse.json({ error: "Failed to record history" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const conn = await connectToDatabase();
    if (conn) {
      await WeatherHistory.deleteMany({ userId });
    }

    return NextResponse.json({ success: true, message: "History cleared successfully" });
  } catch (err: any) {
    console.error("DELETE /api/history error:", err);
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
  }
}

