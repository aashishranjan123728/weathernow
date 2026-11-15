import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import FavoriteCity from "@/models/FavoriteCity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json([]); // Return empty list if DB offline
    }

    const favorites = await FavoriteCity.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(favorites);
  } catch (err: any) {
    console.error("GET /api/favorites error:", err);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const body = await req.json();
    const { cityName, country, coordinates } = body;

    if (!cityName) {
      return NextResponse.json({ error: "City name is required" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Database unavailable. Saved locally." },
        { status: 503 }
      );
    }

    // Check if already favorited
    const existing = await FavoriteCity.findOne({
      userId,
      cityName: { $regex: new RegExp(`^${cityName.trim()}$`, "i") },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const newFav = await FavoriteCity.create({
      userId,
      cityName: cityName.trim(),
      country: country || "",
      coordinates,
    });

    return NextResponse.json(newFav, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/favorites error:", err);
    return NextResponse.json({ error: "Failed to save favorite city" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const cityName = searchParams.get("cityName");

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true });
    }

    if (id) {
      await FavoriteCity.findOneAndDelete({ _id: id, userId });
    } else if (cityName) {
      await FavoriteCity.findOneAndDelete({
        userId,
        cityName: { $regex: new RegExp(`^${cityName.trim()}$`, "i") },
      });
    } else {
      return NextResponse.json({ error: "Missing favorite ID or city name" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Removed from favorites" });
  } catch (err: any) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Failed to remove favorite city" }, { status: 500 });
  }
}

