import { getDateRangeSummary } from "@/lib/dbHelpers";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start') || new Date().toISOString().split("T")[0];
    const endDate = searchParams.get('end') || new Date().toISOString().split("T")[0];
    
    const summary = await getDateRangeSummary(startDate, endDate);
    
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch date range summary" },
      { status: 500 }
    );
  }
}