import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hashedId: string; slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { hashedId, slug } = resolvedParams;

    console.log("Fetching news with hashedId:", hashedId, "and slug:", slug);

    const response = await fetch(`${API_BASE_URL}/news/${hashedId}/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Disable caching for fresh data
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      console.error(
        "Backend response not ok:",
        response.status,
        response.statusText
      );
      return NextResponse.json(
        {
          success: false,
          message: `News not found`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Backend data received:", data.success);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching news by hashedId and slug:", error);
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
