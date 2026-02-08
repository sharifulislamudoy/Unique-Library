import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET → শুধু আজকের data দিবে
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("uniqueDB");

    // আজকের তারিখ (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    const data = await db
      .collection("dokanKhoroch")
      .find({ date: today })
      .sort({ createdAt: -1 }) // latest first (optional)
      .toArray();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dokan sells" },
      { status: 500 }
    );
  }
}

/**
 * POST → আজকের date সহ data insert করবে
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("uniqueDB");

    const today = new Date().toISOString().split("T")[0];

    if (!body.amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const doc = {
      amount: Number(body.amount),
      note: body.note || "",
      date: today,
      createdAt: new Date()
    };

    await db.collection("dokanKhoroch").insertOne(doc);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add dokan sell" },
      { status: 500 }
    );
  }
}
