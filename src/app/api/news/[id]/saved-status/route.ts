import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// GET /api/news/[id]/saved-status - Check if news is saved
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    console.log("=== checkSavedStatus called ===");
    console.log("Params:", resolvedParams);

    // Validate newsId
    if (!id || id === "undefined" || id === "null") {
      console.log("Invalid newsId:", id);
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid news ID",
          data: null,
          error: { code: "INVALID_NEWS_ID" },
          metadata: null,
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    console.log("User:", session?.user);

    if (!session?.backendToken) {
      return NextResponse.json(
        {
          status: "error",
          message: "Unauthorized",
          data: null,
          error: { code: "UNAUTHORIZED" },
          metadata: null,
        },
        { status: 401 }
      );
    }

    console.log("Checking saved status for:", {
      userEmail: session.user?.email,
      newsId: id,
    });

    const response = await fetch(`${BACKEND_URL}/news/${id}/saved-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "Failed to parse API response as JSON:",
        responseText,
        parseError
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid response from server",
          data: null,
          error: { code: "INVALID_RESPONSE" },
          metadata: null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Saved status API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
        error: { code: "SERVER_ERROR" },
        metadata: null,
      },
      { status: 500 }
    );
  }
}
