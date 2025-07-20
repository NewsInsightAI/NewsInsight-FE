import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("newsId");
    const user_email = searchParams.get("user_email");
    const sort = searchParams.get("sort");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";

    // Get authorization header from request
    const authorization = request.headers.get("authorization");

    let url = `${BACKEND_URL}/comments`;

    // If newsId is provided, get comments for specific news (public use)
    if (newsId) {
      url = `${BACKEND_URL}/comments/news/${newsId}`;
      if (user_email) {
        url += `?user_email=${encodeURIComponent(user_email)}`;
      }
    } else {
      // For admin dashboard - get all comments with pagination and filters
      const params = new URLSearchParams();
      if (sort) params.append("sort", sort);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (search) params.append("search", search);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch comments" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { news_id, content, reader_name, reader_email } = body;

    console.log("API Route received:", {
      news_id,
      content,
      reader_name,
      reader_email,
    });

    if (!news_id || !content || !reader_name) {
      console.log("Validation failed:", {
        hasNewsId: !!news_id,
        hasContent: !!content,
        hasReaderName: !!reader_name,
      });
      return NextResponse.json(
        { error: "News ID, content, and reader name are required" },
        { status: 400 }
      );
    }

    // Get authorization header from request
    const authorization = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(`${BACKEND_URL}/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        news_id: news_id,
        content: content,
        reader_name: reader_name,
        reader_email: reader_email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create comment" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, action } = body; // action: 'approve' or 'reject'

    if (!commentId || !action) {
      return NextResponse.json(
        { error: "Comment ID and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get authorization header from request
    const authorization = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(
      `${BACKEND_URL}/comments/${commentId}/${action}`,
      {
        method: "PATCH",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || `Failed to ${action} comment` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Get authorization header from request
    const authorization = request.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    if (authorization) {
      headers.Authorization = authorization;
    }

    const response = await fetch(`${BACKEND_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to delete comment" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
