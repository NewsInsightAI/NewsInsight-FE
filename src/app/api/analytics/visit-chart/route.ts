import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ExtendedSession {
  user?: {
    role?: string;
  };
  backendToken?: string;
}

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = (await getServerSession(authOptions)) as ExtendedSession;

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const days = searchParams.get("days") || "7";

    // Make request to backend
    const response = await fetch(
      `${API_BASE_URL}/analytics/visit-chart?days=${days}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Visit chart API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch visit chart data" },
      { status: 500 }
    );
  }
}

