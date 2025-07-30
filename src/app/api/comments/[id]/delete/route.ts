import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await context.params;
    const commentId = id;

    if (!commentId || isNaN(Number(commentId))) {
      return NextResponse.json(
        { success: false, error: "Invalid comment ID" },
        { status: 400 }
      );
    }

    // Get request body
    const body = await request.json();
    const { user_email } = body;

    console.log("Delete comment request:", { commentId, user_email });

    if (!user_email) {
      return NextResponse.json(
        { success: false, error: "User email is required" },
        { status: 400 }
      );
    }

    // Build backend URL
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/ccomments/${commentId}/delete`;
    console.log("Calling backend URL:", backendUrl);

    // Forward request to backend
    const backendResponse = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email }),
    });

    console.log("Backend response status:", backendResponse.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(backendResponse.headers.entries())
    );

    // Check if response is JSON
    const contentType = backendResponse.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await backendResponse.json();
    } else {
      // If not JSON, probably an error page
      const text = await backendResponse.text();
      console.error("Backend returned non-JSON response:", text);
      return NextResponse.json(
        {
          success: false,
          error: `Backend server error (status: ${backendResponse.status})`,
        },
        { status: backendResponse.status || 500 }
      );
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: responseData.error || "Failed to delete comment",
        },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData.data,
      message: responseData.message || "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
