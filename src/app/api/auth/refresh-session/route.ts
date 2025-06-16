import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendToken) {
      return NextResponse.json(
        { error: "No valid session found" },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/user-info`;
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    const result = await response.json();

    if (result.status === "success" && result.data) {
      return NextResponse.json({
        status: "success",
        data: {
          user: result.data,
          shouldRefresh: true,
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid response from backend" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error refreshing session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
