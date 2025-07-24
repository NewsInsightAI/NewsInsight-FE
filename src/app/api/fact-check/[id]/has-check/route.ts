import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = id;

    // Get auth token from request headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          status: "error",
          message: "Token tidak ditemukan",
          data: null,
          error: { code: "MISSING_TOKEN" },
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    // Forward request to backend
    const response = await fetch(
      `${BACKEND_URL}/fact-check/${newsId}/has-check`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking fact check status:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Gagal memeriksa status fact check",
        data: null,
        error: { code: "INTERNAL_ERROR" },
      },
      { status: 500 }
    );
  }
}
