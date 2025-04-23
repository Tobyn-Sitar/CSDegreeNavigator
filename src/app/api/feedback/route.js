import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET: Return all feedback (anonymous access)
export async function GET() {
  await connectMongoDB();

  try {
    const db = mongoose.connection.db;
    const feedback = await db.collection("feedback").find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json(feedback);
  } catch (err) {
    console.error("Load Feedback Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Submit feedback anonymously
export async function POST(request) {
  await connectMongoDB();

  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const db = mongoose.connection.db;
    const result = await db.collection("feedback").insertOne({
      user: "Anonymous",
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({
      _id: result.insertedId,
      user: "Anonymous",
      message,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Submit Feedback Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
