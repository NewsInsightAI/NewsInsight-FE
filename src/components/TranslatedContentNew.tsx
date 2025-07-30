"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState, useCallback } from "react";

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
  const [translatedHtml, setTranslatedHtml] = useState<string>("");
  const [, setTranslatedPlainText] = useState<string>("");
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [lastLanguage, setLastLanguage] = useState<string>(
    currentLanguage.code
  );

  const translateHtmlContent = useCallback(
    async (html: string, targetLang: string): Promise<string> => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const textNodes: {
        element: Element;
        originalText: string;
        textContent: string;
      }[] = [];

      function walkTextNodes(node: Node) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text && text.length > 0 && node.parentElement) {
            textNodes.push({
              element: node.parentElement,
              originalText: text,
              textContent: text,
            });
          }
        } else {
          for (const child of Array.from(node.childNodes)) {
            walkTextNodes(child);
          }
        }
      }

      if (doc.body) {
        walkTextNodes(doc.body);
      }

      const textsToTranslate = [
        ...new Set(textNodes.map((node) => node.textContent)),
      ];

      if (textsToTranslate.length === 0) {
        return html;
      }

      const combinedText = textsToTranslate.join(" ||| ");
      const translatedCombined = await translateText(combinedText, targetLang);
      const translatedTexts = translatedCombined.split(" ||| ");

      const translationMap = new Map<string, string>();
      textsToTranslate.forEach((text, index) => {
        if (translatedTexts[index]) {
          translationMap.set(text, translatedTexts[index]);
        }
      });

      let translatedHtml = html;
      translationMap.forEach((translated, original) => {
        const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`>${escapedOriginal}<`, "g");
        translatedHtml = translatedHtml.replace(regex, `>${translated}<`);
      });

      return translatedHtml;
    },
    [translateText]
  );

  useEffect(() => {
    if (lastLanguage === currentLanguage.code) {
      return;
    }

    if (currentLanguage.code === "id") {
      setTranslatedHtml("");
      setTranslatedPlainText("");
      onTranslatedTextChange?.(plainTextContent);
      setLastLanguage(currentLanguage.code);
      return;
    }

    const translateContent = async () => {
      setIsTranslatingContent(true);
      try {
        if (htmlContent) {
          const translatedHtmlContent = await translateHtmlContent(
            htmlContent,
            currentLanguage.code
          );
          setTranslatedHtml(translatedHtmlContent);

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = translatedHtmlContent;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";
          setTranslatedPlainText(plainText);
          onTranslatedTextChange?.(plainText);
        } else {
          const translated = await translateText(
            plainTextContent,
            currentLanguage.code
          );
          setTranslatedPlainText(translated);
          onTranslatedTextChange?.(translated);
        }
      } catch (error) {
        console.error("Failed to translate content:", error);

        setTranslatedHtml("");
        setTranslatedPlainText("");
        onTranslatedTextChange?.(plainTextContent);
      } finally {
        setIsTranslatingContent(false);
        setLastLanguage(currentLanguage.code);
      }
    };

    translateContent();
  }, [
    currentLanguage.code,
    lastLanguage,
    htmlContent,
    onTranslatedTextChange,
    plainTextContent,
    translateHtmlContent,
    translateText,
  ]);

  const isLoading = isTranslating || isTranslatingContent;

  if (htmlContent) {
    const contentToShow =
      currentLanguage.code === "id"
        ? htmlContent
        : translatedHtml || htmlContent;

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
          dangerouslySetInnerHTML={{ __html: contentToShow }}
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Menerjemahkan...
          </div>
        </div>
      )}

      <div
        className={`quill-content prose max-w-none ${isDark ? "prose-invert" : ""} ${
          fontSize === "small"
            ? "prose-sm"
            : fontSize === "large"
              ? "prose-xl"
              : "prose-base"
        }`}
      >
        <p>
          Ini adalah konten demo untuk berita dengan judul &ldquo;
          {newsTitle}&rdquo;. Dalam implementasi sebenarnya, konten ini akan
          diambil dari database atau API yang menyediakan detail lengkap artikel
          berita.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum.
        </p>
        <h2>Informasi Lebih Lanjut</h2>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo.
        </p>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
          fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
          sequi nesciunt.
        </p>
        <h2>Contoh List</h2>
        <p>Berikut adalah contoh unordered list:</p>
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
        <p>Berikut adalah contoh ordered list:</p>
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
    </div>
  );
}
