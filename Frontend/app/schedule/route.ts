// app/api/schedule/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

async function callFlaskAPI(uid: string) {
  try {
    const flaskResponse = await fetch("http://your-flask-server/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid }),
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask API error: ${flaskResponse.statusText}`);
    }

    const data = await flaskResponse.json();
    return data;
  } catch (error) {
    console.error(`Error calling Flask API for uid ${uid}:`, error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    // Verify the request is authorized (you should implement proper authentication)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all subscribed users
    const { data: users, error } = await supabase
      .from("user")
      .select("uid")
      .eq("Subscribed", true);

    if (error) {
      throw error;
    }

    // Process each user
    const results = await Promise.allSettled(
      users.map(async (user) => {
        try {
          const result = await callFlaskAPI(user.uid);
          return { uid: user.uid, success: true, result };
        } catch (error) {
          return { uid: user.uid, success: false, error };
        }
      }),
    );

    return NextResponse.json({
      message: "Schedule processed successfully",
      results,
    });
  } catch (error) {
    console.error("Schedule processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
