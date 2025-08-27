
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/admin-auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const { user } = await adminAuth.login(username, password);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in your environment variables");
    }

    const token = jwt.sign({ user }, secret, { expiresIn: "30m" });

    const response = NextResponse.json({ user });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60, // 30 minutes
      path: "/",
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
