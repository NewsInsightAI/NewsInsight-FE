import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, code, method } = await request.json();

    if (!userId || !code || !method) {
      return NextResponse.json(
        {
          status: "error",
          message: "Data tidak lengkap",
          data: null,
          error: { code: "MISSING_REQUIRED_FIELDS" },
          metadata: null,
        },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(`${apiUrl}/mfa/verify-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        code,
        method,
      }),
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    console.error("MFA verify login API error:", error);
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
