import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Received signup body:", body); // Add this

    const { name, email, password, yearStarted } = body;

    if (!name || !email || !password || !yearStarted) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      yearStarted,
    });

    return NextResponse.json({ message: "User registered." }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error); // This will help
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

