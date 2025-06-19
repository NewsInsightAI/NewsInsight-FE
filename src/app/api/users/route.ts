import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(
      `${apiUrl}/users${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
      }
    );

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
        error: { code: "INTERNAL_ERROR" },
        metadata: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const body = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Create user API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
        error: { code: "INTERNAL_ERROR" },
        metadata: null,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

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

    const body = await request.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiRes = await fetch(`${apiUrl}/users/bulk-delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bulk delete users API error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
        data: null,
        error: { code: "INTERNAL_ERROR" },
        metadata: null,
      },
      { status: 500 }
    );
  }
}
