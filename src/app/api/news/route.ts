import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const author = searchParams.get("author") || "";
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = searchParams.get("sortOrder") || "DESC";
    const isPublic = searchParams.get("public") === "true";

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status", status);
    if (category) params.append("category", category);
    if (author) params.append("author", author);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);

    const endpoint = isPublic ? "/news/public" : "/news";
    const token = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (!isPublic && token) {
      headers.Authorization = token;
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}?${params.toString()}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch news" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to create news" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create news API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token is required" },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/news`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to delete news" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete news API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
