import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  await connectMongoDB();

  try {
    const db = mongoose.connection.db;
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const takenCourses = user.taken || [];

    return NextResponse.json(takenCourses);
  } catch (err) {
    console.error("Load Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
