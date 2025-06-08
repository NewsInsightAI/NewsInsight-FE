import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(`${apiUrl}/mfa/send-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });
  } catch (error) {
    console.error("Send MFA code API error:", error);
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
