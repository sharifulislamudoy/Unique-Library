import { getYearlySummary } from "@/lib/dbHelpers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    
    const summary = await getYearlySummary(year);
    
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch yearly summary" },
      { status: 500 }
    );
  }
}