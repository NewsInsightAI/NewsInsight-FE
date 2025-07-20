import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const authHeader = request.headers.get("Authorization");

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const response = await fetch(`${backendUrl}/comments/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error rejecting comment:", error);
    return NextResponse.json(
      { error: "Failed to reject comment" },
      { status: 500 }
    );
  }
}
