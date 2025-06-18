"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

interface TranslatedContentProps {
  htmlContent?: string;
  plainTextContent: string;
  fontSize: "small" | "medium" | "large";
  isDark: boolean;
  newsTitle?: string;
  onTranslatedTextChange?: (translatedText: string) => void;
}

export function TranslatedContent({
  htmlContent,
  plainTextContent,
  fontSize,
  isDark,
  newsTitle,
  onTranslatedTextChange,
}: TranslatedContentProps) {
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [lastLanguage, setLastLanguage] = useState<string>(
    currentLanguage.code
  );

  useEffect(() => {
    if (lastLanguage === currentLanguage.code) {
      return;
    }

    if (currentLanguage.code === "id") {
      setTranslatedText("");
      onTranslatedTextChange?.(plainTextContent);
      setLastLanguage(currentLanguage.code);
      return;
    }

    const translateContent = async () => {
      setIsTranslatingContent(true);
      try {
        let textToTranslate = plainTextContent;

        if (htmlContent) {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = htmlContent;
          textToTranslate = tempDiv.textContent || tempDiv.innerText || "";
        }

        if (textToTranslate.trim()) {
          const translated = await translateText(
            textToTranslate,
            currentLanguage.code
          );
          setTranslatedText(translated);
          onTranslatedTextChange?.(translated);
        }
      } catch (error) {
        console.error("Failed to translate content:", error);

        setTranslatedText("");
        onTranslatedTextChange?.(plainTextContent);
      } finally {
        setIsTranslatingContent(false);
        setLastLanguage(currentLanguage.code);
      }
    };

    translateContent();
  }, [
    currentLanguage.code,
    htmlContent,
    lastLanguage,
    onTranslatedTextChange,
    plainTextContent,
    translateText,
  ]);

  const isLoading = isTranslating || isTranslatingContent;

  const contentToShow =
    currentLanguage.code === "id"
      ? htmlContent || plainTextContent
      : translatedText || plainTextContent;

  if (htmlContent && currentLanguage.code === "id") {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute top-0 right-0 z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <svg
                className="animate-spin -ml-1 mr-2 h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menerjemahkan...
            </div>
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className={`quill-content prose max-w-none ${isDark ? "prose-invert" : ""} ${
            fontSize === "small"
              ? "prose-sm"
              : fontSize === "large"
                ? "prose-xl"
                : "prose-base"
          }`}
        />
      </div>
    );
  }

  const contentParagraphs = contentToShow
    .split("\n")
    .map((paragraph: string) => paragraph.trim())
    .filter((paragraph: string) => paragraph.length > 0);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute top-0 right-0 z-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <svg
              className="animate-spin -ml-1 mr-2 h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Menerjemahkan...
          </div>
        </div>
      )}

      {htmlContent && currentLanguage.code !== "id" ? (
        <div
          className={`prose max-w-none ${isDark ? "prose-invert" : ""} ${
            fontSize === "small"
              ? "prose-sm"
              : fontSize === "large"
                ? "prose-xl"
                : "prose-base"
          }`}
        >
          {contentParagraphs.map((paragraph: string, index: number) => {
            if (
              paragraph.length < 100 &&
              (paragraph.includes("Detail") ||
                paragraph.includes("Syarat") ||
                paragraph.includes("Terms") ||
                paragraph.includes("Program") ||
                paragraph.includes("Requirements"))
            ) {
              return (
                <h2
                  key={index}
                  className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} ${
                    fontSize === "small"
                      ? "text-xl"
                      : fontSize === "large"
                        ? "text-3xl"
                        : "text-2xl"
                  }`}
                >
                  {paragraph}
                </h2>
              );
            }

            if (paragraph.includes('"') && paragraph.includes('"')) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-gray-300 pl-4 italic my-4"
                >
                  <p
                    className={`leading-relaxed mb-6 ${
                      fontSize === "small"
                        ? "text-base"
                        : fontSize === "large"
                          ? "text-xl"
                          : "text-lg"
                    }`}
                  >
                    {paragraph}
                  </p>
                </blockquote>
              );
            }

            return (
              <p
                key={index}
                className={`leading-relaxed mb-6 ${
                  fontSize === "small"
                    ? "text-base"
                    : fontSize === "large"
                      ? "text-xl"
                      : "text-lg"
                }`}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      ) : (
        <div>
          <p
            className={`leading-relaxed mb-6 ${
              fontSize === "small"
                ? "text-base"
                : fontSize === "large"
                  ? "text-xl"
                  : "text-lg"
            }`}
          >
            Ini adalah konten demo untuk berita dengan judul &ldquo;
            {newsTitle}&rdquo;. Dalam implementasi sebenarnya, konten ini akan
            diambil dari database atau API yang menyediakan detail lengkap
            artikel berita.
          </p>
          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="mb-6">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <h2
            className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} ${
              fontSize === "small"
                ? "text-xl"
                : fontSize === "large"
                  ? "text-3xl"
                  : "text-2xl"
            }`}
          >
            Informasi Lebih Lanjut
          </h2>
          <p className="mb-6">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </p>
          <h2
            className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} ${
              fontSize === "small"
                ? "text-xl"
                : fontSize === "large"
                  ? "text-3xl"
                  : "text-2xl"
            }`}
          >
            Contoh List
          </h2>
          <p className="mb-4">Berikut adalah contoh unordered list:</p>
          <ul>
            <li>Item pertama dalam list</li>
            <li>Item kedua dalam list</li>
            <li>
              Item ketiga dalam list
              <ul>
                <li>Sub-item pertama</li>
                <li>Sub-item kedua</li>
              </ul>
            </li>
          </ul>
          <p className="mb-4 mt-6">Berikut adalah contoh ordered list:</p>
          <ol>
            <li>Langkah pertama</li>
            <li>Langkah kedua</li>
            <li>
              Langkah ketiga
              <ol>
                <li>Sub-langkah pertama</li>
                <li>Sub-langkah kedua</li>
              </ol>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
