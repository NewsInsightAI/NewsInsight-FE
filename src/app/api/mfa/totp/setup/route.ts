import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendToken) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
          data: null,
          error: { code: "UNAUTHORIZED" },
          metadata: null,
        },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(`${apiUrl}/mfa/totp/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
    });

    const responseText = await apiRes.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "Failed to parse API response as JSON:",
        responseText,
        parseError
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid response from server",
          data: null,
          error: { code: "INVALID_RESPONSE" },
          metadata: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    console.error("TOTP setup API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
        error: { code: "SERVER_ERROR" },
        metadata: null,
      },
      { status: 500 }
    );
  }
}
