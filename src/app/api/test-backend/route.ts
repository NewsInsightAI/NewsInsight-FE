import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

    console.log("Testing backend connection to:", backendUrl);

    const response = await fetch(`${backendUrl}/auth/test-connection`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let responseData = null;
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }

    return NextResponse.json({
      status: "success",
      message: "Backend connection test",
      data: {
        backendUrl,
        backendStatus: response.status,
        backendOk: response.ok,
        responseData,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Backend test error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Backend connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        data: {
          backendUrl:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
        },
      },
      { status: 500 }
    );
  }
}
