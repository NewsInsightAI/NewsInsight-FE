import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    const filePath = join(process.cwd(), '..', 'server', 'uploads', 'cv', filename);

    try {
      const fileBuffer = readFileSync(filePath);
      
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=3600', 
        },
      });
    } catch (fileError) {
      console.error("File read error:", fileError);
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("CV file access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
