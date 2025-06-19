import { NextRequest, NextResponse } from "next/server";
import { TRANSLATION_MAP } from "@/utils/translationMap";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const translate = require("translate-google");

export async function POST(request: NextRequest) {
  try {
    const { text, from = "auto", to = "en" } = await request.json();

    console.log("Translation request:", { text, from, to });

    if (!text || typeof text !== "string") {
      console.log("Error: Text validation failed", { text, type: typeof text });
      return NextResponse.json(
        { success: false, error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    if (!to || typeof to !== "string") {
      console.log("Error: Target language validation failed", {
        to,
        type: typeof to,
      });
      return NextResponse.json(
        { success: false, error: "Target language (to) is required" },
        { status: 400 }
      );
    }

    if (from === to) {
      return NextResponse.json({
        success: true,
        translatedText: text,
        sourceLanguage: from,
        targetLanguage: to,
      });
    }
    console.log("Calling translate-google with:", { text, from, to });

    try {
      const translatedText = await translate(text, { from, to });
      console.log("Google Translate result:", translatedText);

      return NextResponse.json({
        success: true,
        translatedText: translatedText,
        sourceLanguage: from,
        targetLanguage: to,
        originalText: text,
        method: "google-translate",
      });
    } catch (translateError) {
      console.log("Google Translate failed, trying fallback mapping...");

      const fallbackTranslation = TRANSLATION_MAP[to]?.[text];
      if (fallbackTranslation) {
        console.log("Using fallback translation:", fallbackTranslation);
        return NextResponse.json({
          success: true,
          translatedText: fallbackTranslation,
          sourceLanguage: from,
          targetLanguage: to,
          originalText: text,
          method: "fallback-mapping",
        });
      }

      throw translateError;
    }
  } catch (error: unknown) {
    console.error("Translation error details:", error);

    const errorObj = error as { code?: string; message?: string };

    if (errorObj.code === "BAD_REQUEST") {
      return NextResponse.json(
        { success: false, error: "Invalid translation request" },
        { status: 400 }
      );
    }

    if (errorObj.code === "BAD_NETWORK") {
      return NextResponse.json(
        { success: false, error: "Network error occurred" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Translation failed",
        details:
          process.env.NODE_ENV === "development" ? errorObj.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Method not allowed. Use POST to translate text.",
    },
    { status: 405 }
  );
}
