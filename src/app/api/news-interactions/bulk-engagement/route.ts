import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newsIds } = body;

    console.log("Received bulk engagement request for newsIds:", newsIds);

    if (!newsIds || !Array.isArray(newsIds)) {
      return NextResponse.json(
        { success: false, message: "newsIds array is required" },
        { status: 400 }
      );
    }

    const backendUrl = `${BACKEND_URL}/news-interactions/news/bulk-engagement`;
    console.log("Making request to backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newsIds }),
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response headers:", response.headers);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Backend returned non-JSON response:", text);
      return NextResponse.json(
        { success: false, message: "Backend returned invalid response format" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Backend response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to fetch engagement metrics",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bulk engagement metrics:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
