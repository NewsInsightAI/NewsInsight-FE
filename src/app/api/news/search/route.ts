import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy") || "published_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";

    if (!query) {
      return NextResponse.json(
        {
          status: "error",
          message: "Search query parameter 'q' is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Construct backend URL
    const backendUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_URL}/news/search`
    );
    backendUrl.searchParams.set("q", query);
    backendUrl.searchParams.set("page", page);
    backendUrl.searchParams.set("limit", limit);
    backendUrl.searchParams.set("sortBy", sortBy);
    backendUrl.searchParams.set("sortOrder", sortOrder);

    // Forward request to backend
    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: data.message || "Failed to search news",
          data: null,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in news search API route:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}
