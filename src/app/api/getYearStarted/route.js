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
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email }, { projection: { yearStarted: 1 } });

    if (!user || !user.yearStarted) {
      return NextResponse.json({ error: "Year started not found" }, { status: 404 });
    }

    return NextResponse.json({ yearStarted: user.yearStarted });
  } catch (err) {
    console.error("YearStarted Load Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}