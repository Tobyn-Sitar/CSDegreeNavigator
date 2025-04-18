import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  await connectMongoDB();

  try {
    const { semesters } = await request.json();

    if (!Array.isArray(semesters)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    const db = mongoose.connection.db;
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Overwrite the user's 'taken' field with semester data
    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { taken: semesters } }
    );

    return NextResponse.json({ success: true, message: "Semester plan saved!" });

  } catch (err) {
    console.error("Save Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
