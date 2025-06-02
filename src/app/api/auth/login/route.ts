import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { identifier, password } = body;
  const filteredBody = { identifier, password };
  const apiRes = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredBody),
  });

  const data = await apiRes.json();

  return NextResponse.json(data, { status: apiRes.status });
}
