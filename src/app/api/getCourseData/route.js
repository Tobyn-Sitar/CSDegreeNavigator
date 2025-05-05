import { connectMongoDB } from "@/lib/mongodb";
import Course from "@/models/courses"; // your existing model
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  const courses = await Course.find({
    startOn: { $gte: "2025-01-01" }, // Spring 2025 and Fall 2025 based on dates
    endOn: { $lte: "2025-12-31" },
  }).lean();

  return NextResponse.json(courses);
}