import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(
      `${backendUrl}/search/popular-news?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching popular news:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch popular news",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
