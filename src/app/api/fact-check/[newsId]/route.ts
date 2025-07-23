import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, languageCode = "id" } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Query text is required for fact checking" },
        { status: 400 }
      );
    }

    const { newsId } = await params;

    // Forward request to backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/fact-check/${newsId}/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ query, languageCode }),
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to perform fact check",
          details: data,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fact check API error:", error);
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ newsId: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const { newsId } = await params;

    // Forward request to backend to get fact check history
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/v1/fact-check/${newsId}/history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
      }
    );

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to get fact check history",
          details: data,
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get fact check history API error:", error);
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
