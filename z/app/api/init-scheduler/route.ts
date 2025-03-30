// app/api/init-scheduler/route.ts
import { NextResponse } from "next/server";
import { initializeScheduler } from "@/services/initScheduler";

let isInitialized = false;

export async function GET(request: Request) {
  try {
    if (!isInitialized) {
      initializeScheduler();
      isInitialized = true;
      return NextResponse.json({
        message: "Scheduler initialized successfully",
      });
    }
    return NextResponse.json({ message: "Scheduler already running" });
  } catch (error) {
    console.error("Error initializing scheduler:", error);
    return NextResponse.json(
      { error: "Failed to initialize scheduler" },
      { status: 500 },
    );
  }
}
