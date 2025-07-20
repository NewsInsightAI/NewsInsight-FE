import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    if (!search || search.trim().length < 2) {
      return NextResponse.json(
        {
          status: "error",
          message: "Search query must be at least 2 characters long",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/cities/search?search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error searching cities:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

