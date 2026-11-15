import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_BASE_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const result = NextResponse.json({
      user: data.user,
    });

    result.cookies.set({
      name: "learnwise_access_token",
      value: data.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: data.expires_in,
    });

    return result;
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the authentication service." },
      { status: 500 },
    );
  }
}