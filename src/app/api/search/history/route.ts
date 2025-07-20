import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ExtendedSession {
  backendToken?: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession;

    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(
      `${backendUrl}/search/history?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching search history:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch search history",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as ExtendedSession;

    if (!session) {
      return NextResponse.json(
        {
          status: "error",
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { searchQuery } = body;

    if (!searchQuery || searchQuery.trim() === "") {
      return NextResponse.json(
        {
          status: "error",
          message: "Search query is required",
        },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(`${backendUrl}/search/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify({ searchQuery }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error saving search history:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to save search history",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
