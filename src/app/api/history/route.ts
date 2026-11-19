import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const supabase = createSupabaseServerClient();

    const { data: history, error } = await supabase
      .from("weather_history")
      .select("*")
      .eq("user_id", userId)
      .order("searched_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("GET /api/history error:", error);
      return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 });
    }

    return NextResponse.json(history ?? []);
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

    const supabase = createSupabaseServerClient();

    const { data: item, error } = await supabase
      .from("weather_history")
      .insert({
        user_id: userId,
        city_name: cityName,
        temperature: temperature ?? 0,
        weather_condition: weatherCondition ?? "Clear",
        humidity: humidity ?? 0,
        wind_speed: windSpeed ?? 0,
        searched_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/history error:", error);
      return NextResponse.json({ error: "Failed to record history" }, { status: 500 });
    }

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
    const supabase = createSupabaseServerClient();

    await supabase
      .from("weather_history")
      .delete()
      .eq("user_id", userId);

    return NextResponse.json({ success: true, message: "History cleared successfully" });
  } catch (err: any) {
    console.error("DELETE /api/history error:", err);
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 });
  }
}
