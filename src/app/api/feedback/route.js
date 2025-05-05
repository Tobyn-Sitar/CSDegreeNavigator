import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET: Return all feedback (anonymous access)
export async function GET() {
  await connectMongoDB();

  try {
    const db = mongoose.connection.db;
    const feedbacks = await db
      .collection("feedback")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    // wrap in an object with a known key
    return NextResponse.json({ feedbacks });
  } catch (err) {
    console.error("Load Feedback Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// POST: Submit feedback anonymously
export async function POST(request) {
  await connectMongoDB();

  try {
    const { message } = await request.json();

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;
    const result = await db.collection("feedback").insertOne({
      user: "Anonymous",
      message,
      createdAt: new Date(),
    });

    // return the new document under a known key
    const feedback = {
      _id: result.insertedId,
      user: "Anonymous",
      message,
      createdAt: new Date(),
    };

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("Submit Feedback Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
