
import clientPromise from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("uniqueDB");

  const today = new Date().toISOString().split("T")[0];

  const data = await db
    .collection("computerSells")
    .find({ date: today })
    .toArray();

  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db("uniqueDB");

  const today = new Date().toISOString().split("T")[0];

  const doc = {
    amount: Number(body.amount),
    note: body.note || "",
    date: today,
    createdAt: new Date()
  };

  await db.collection("computerSells").insertOne(doc);

  return NextResponse.json({ success: true });
}
