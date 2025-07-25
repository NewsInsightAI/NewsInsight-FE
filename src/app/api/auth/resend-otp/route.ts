import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, email } = body;
  const filteredBody = { userId, email };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiRes = await fetch(`${apiUrl}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody),
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
}
