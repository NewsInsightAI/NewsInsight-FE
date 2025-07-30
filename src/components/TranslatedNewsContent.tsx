import React from "react";

interface TranslatedNewsContentProps {
  originalTitle: string;
  originalContent: string;
  translatedTitle?: string;
  translatedContent?: string;
  isTranslated: boolean;
  fontSize: "small" | "medium" | "large";
  isDark: boolean;
}

export function TranslatedNewsContent({
  originalTitle,
  originalContent,
  translatedContent,
  isTranslated,
  fontSize,
  isDark,
}: TranslatedNewsContentProps) {
  const getFontSizeClass = () => {
    switch (fontSize) {
      case "small":
        return "text-sm";
      case "large":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  const displayContent =
    isTranslated && translatedContent ? translatedContent : originalContent;

  return (
    <div className="space-y-6">
      {/* Content - No title since it's already shown in hero section */}
      <div
        className={`prose max-w-none ${isDark ? "prose-invert" : ""} ${getFontSizeClass()}`}
        style={{
          color: isDark ? "#e5e7eb" : "#374151",
          lineHeight: "1.8",
        }}
      >
        {isTranslated ? (
          // Show translated plain text content
          <div className="whitespace-pre-wrap">{displayContent}</div>
        ) : (
          // Show original HTML content
          <div
            className="quill-content"
            dangerouslySetInnerHTML={{
              __html:
                originalContent ||
                `
                <p>Ini adalah konten demo untuk berita dengan judul "${originalTitle}". Dalam implementasi sebenarnya, konten ini akan diambil dari database atau API yang menyediakan detail lengkap artikel berita.</p>
                
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
              `,
            }}
          />
        )}
      </div>

      {/* Translation indicator */}
      {isTranslated && (
        <div
          className={`text-xs italic ${
            isDark ? "text-gray-400" : "text-gray-500"
          } border-t pt-4`}
        >
          * Konten ini telah diterjemahkan dari bahasa Indonesia
        </div>
      )}
    </div>
  );
}
