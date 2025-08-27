
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const sessionCookie = cookie.split(";").find(c => c.trim().startsWith("session="));
    if (!sessionCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const token = sessionCookie.split("=")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in your environment variables");
    }

    const decoded = jwt.verify(token, secret);

    return NextResponse.json({ user: (decoded as any).user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
