import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newsItems } = body;

    if (!Array.isArray(newsItems) || newsItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "newsItems array is required" },
        { status: 400 }
      );
    }

    // Forward request to backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/fact-check/batch-check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ newsItems }),
      }
    );

    // Check if response is JSON
    const contentType = backendResponse.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await backendResponse.json();
    } else {
      // Handle non-JSON response (likely HTML error page)
      const text = await backendResponse.text();
      console.error("Non-JSON response received:", text.substring(0, 200));

      return NextResponse.json(
        {
          success: false,
          message: "Server mengalami masalah internal",
          error: {
            code: "INVALID_RESPONSE",
            details: `Expected JSON but received ${contentType || "unknown"} content`,
          },
        },
        { status: 500 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to perform batch fact check",
          details: data,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Batch fact check API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
