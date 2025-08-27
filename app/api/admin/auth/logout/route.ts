
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.json({ message: "Logout successful" });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // Expire the cookie immediately
    path: "/",
  });
  return response;
}
