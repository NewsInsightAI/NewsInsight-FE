import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ categorySlug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const params = await context.params;
    const { categorySlug } = params;

    const urlParams = new URLSearchParams();
    if (page) urlParams.append("page", page);
    if (limit) urlParams.append("limit", limit);

    const response = await fetch(
      `${API_BASE_URL}/news/category/${categorySlug}?${urlParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch news by category" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("News by category API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
