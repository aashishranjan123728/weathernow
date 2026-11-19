import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const supabase = createSupabaseServerClient();

    const { data: favorites, error } = await supabase
      .from("favorite_cities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/favorites error:", error);
      return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
    }

    return NextResponse.json(favorites ?? []);
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

    const supabase = createSupabaseServerClient();

    // Check if already favorited (case-insensitive)
    const { data: existing } = await supabase
      .from("favorite_cities")
      .select("*")
      .eq("user_id", userId)
      .ilike("city_name", cityName.trim())
      .maybeSingle();

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const { data: newFav, error } = await supabase
      .from("favorite_cities")
      .insert({
        user_id: userId,
        city_name: cityName.trim(),
        country: country || "",
        lat: coordinates?.lat ?? null,
        lon: coordinates?.lon ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/favorites error:", error);
      return NextResponse.json({ error: "Failed to save favorite city" }, { status: 500 });
    }

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

    const supabase = createSupabaseServerClient();

    if (id) {
      await supabase
        .from("favorite_cities")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
    } else if (cityName) {
      await supabase
        .from("favorite_cities")
        .delete()
        .eq("user_id", userId)
        .ilike("city_name", cityName.trim());
    } else {
      return NextResponse.json({ error: "Missing favorite ID or city name" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Removed from favorites" });
  } catch (err: any) {
    console.error("DELETE /api/favorites error:", err);
    return NextResponse.json({ error: "Failed to remove favorite city" }, { status: 500 });
  }
}
