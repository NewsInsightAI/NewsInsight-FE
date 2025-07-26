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

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Handle non-JSON response (likely HTML error page)
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));

      return NextResponse.json(
        {
          status: "error",
          message: "Server mengalami masalah internal",
          data: null,
          error: {
            code: "INVALID_RESPONSE",
            details: `Expected JSON but received ${contentType || "unknown"} content`,
          },
        },
        { status: 500 }
      );
    }

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
