"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { TranslatedText } from "@/components/TranslatedText";
import { Toast } from "@/components/Toast";

interface TranslatedContentProps {
  htmlContent?: string;
  plainTextContent: string;
  fontSize: "small" | "medium" | "large";
  newsTitle?: string;
  onTranslatedTextChange?: (translatedText: string) => void;
}

export function TranslatedContent({
  htmlContent,
  plainTextContent,
  fontSize,
  newsTitle,
  onTranslatedTextChange,
}: TranslatedContentProps) {
  const { currentLanguage, translateText } = useLanguage();
  const { isDark } = useDarkMode();
  const [translatedHtml, setTranslatedHtml] = useState<string>("");
  const [, setTranslatedPlainForTTS] = useState<string>("");
  const [, setIsTranslatingContent] = useState(false);
  const [lastLanguage, setLastLanguage] = useState<string>("");
  const [showTranslationToast, setShowTranslationToast] = useState(false);
  const renderContentWithReactBlockquotes = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      `<div>${htmlContent}</div>`,
      "text/html"
    );
    const container = doc.body.firstChild as HTMLElement;

    if (!container) {
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }

    const blockquotes = Array.from(container.querySelectorAll("blockquote"));
    const blockquoteContents: string[] = [];

    blockquotes.forEach((blockquote, index) => {
      blockquoteContents.push(blockquote.innerHTML);
      blockquote.outerHTML = `__BLOCKQUOTE_MARKER_${index}__`;
    });

    const modifiedHtml = container.innerHTML;

    const parts = modifiedHtml.split(/__BLOCKQUOTE_MARKER_\d+__/);
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      if (part.trim()) {
        elements.push(
          <div
            key={`part-${index}`}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      }

      if (index < blockquoteContents.length) {
        elements.push(
          <blockquote
            key={`blockquote-${index}`}
            className={`
              relative border-none border-l-4 p-6 my-8 font-medium italic rounded-xl 
              transition-all duration-300 ease-in-out overflow-visible min-h-16
              transform hover:-translate-y-1
              ${
                isDark
                  ? "border-l-blue-400 bg-gradient-to-br from-slate-800 to-slate-700 text-slate-200 shadow-lg shadow-blue-500/15"
                  : "border-l-blue-500 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-lg shadow-blue-500/10"
              }
            `}
          >
            {/* Quote Icon */}
            <Icon
              icon="material-symbols:format-quote"
              className={`
                absolute text-4xl opacity-20 pointer-events-none z-10
                ${isDark ? "text-blue-400" : "text-blue-500"}
              `}
              style={{
                left: "1rem",
                top: "0.5rem",
              }}
            />

            {/* Content with proper spacing */}
            <div
              className="relative z-20 pl-8"
              dangerouslySetInnerHTML={{ __html: blockquoteContents[index] }}
            />

            {/* Decorative gradient overlay */}
            <div
              className={`
                absolute top-0 right-0 w-16 h-full rounded-r-xl pointer-events-none z-0
                ${
                  isDark
                    ? "bg-gradient-to-l from-blue-500/5 to-transparent"
                    : "bg-gradient-to-l from-blue-500/3 to-transparent"
                }
              `}
            />
          </blockquote>
        );
      }
    });

    return <div>{elements}</div>;
  };

  const translateHtmlContent = useCallback(
    async (html: string, targetLang: string): Promise<string> => {
      try {
        console.log("Original HTML:", html);

        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
        const container = doc.body.firstChild as HTMLElement;

        if (!container) {
          return html;
        }

        const textNodesToTranslate: { node: Text; originalText: string }[] = [];

        function collectTextNodes(node: Node) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text && text.length > 0) {
              textNodesToTranslate.push({
                node: node as Text,
                originalText: text,
              });
            }
          } else {
            for (const child of Array.from(node.childNodes)) {
              collectTextNodes(child);
            }
          }
        }

        collectTextNodes(container);

        if (textNodesToTranslate.length === 0) {
          return html;
        }

        console.log(
          "Text nodes to translate:",
          textNodesToTranslate.map((t) => t.originalText)
        );

        const textsToTranslate = textNodesToTranslate.map(
          (t) => t.originalText
        );
        const separator = "|||";
        const combinedText = textsToTranslate.join(` ${separator} `);
        const translatedCombined = await translateText(
          combinedText,
          targetLang
        );

        let translatedTexts = translatedCombined.split(` ${separator} `);
        if (translatedTexts.length !== textsToTranslate.length) {
          translatedTexts = [];
          for (const t of textsToTranslate) {
            const translated = await translateText(t, targetLang);
            translatedTexts.push(translated);
          }
        }

        console.log("Translated texts:", translatedTexts);
        textNodesToTranslate.forEach((textNodeInfo, index) => {
          if (translatedTexts[index]) {
            const originalFullText = textNodeInfo.node.textContent || "";
            let translatedText = translatedTexts[index];

            translatedText = translatedText.replaceAll(separator, "");

            const leadingWhitespace = originalFullText.match(/^\s*/)?.[0] || "";
            const trailingWhitespace =
              originalFullText.match(/\s*$/)?.[0] || "";

            textNodeInfo.node.textContent =
              leadingWhitespace + translatedText + trailingWhitespace;
          }
        });
        if (isDark) {
          const blockquotes = container.querySelectorAll("blockquote");
          blockquotes.forEach((blockquote) => {
            blockquote.classList.add("dark");
          });
        } else {
          const blockquotes = container.querySelectorAll("blockquote");
          blockquotes.forEach((blockquote) => {
            blockquote.classList.remove("dark");
          });
        }

        const translatedHtml = container.innerHTML;
        console.log("Final translated HTML:", translatedHtml);
        return translatedHtml;
      } catch (error) {
        console.error("Error in translateHtmlContent:", error);
        return html;
      }
    },
    [translateText, isDark]
  );
  
  useEffect(() => {
    if (lastLanguage === currentLanguage.code) {
      return;
    }

    console.log(
      "Language changed from",
      lastLanguage,
      "to",
      currentLanguage.code
    );

    if (currentLanguage.code === "id") {
      setTranslatedHtml("");
      setTranslatedPlainForTTS("");
      onTranslatedTextChange?.(plainTextContent);
      setLastLanguage(currentLanguage.code);
      return;
    }
    const translateContent = async () => {
      console.log("Starting translation...", {
        currentLanguage: currentLanguage.code,
        hasHtmlContent: !!htmlContent,
        htmlContentLength: htmlContent?.length,
      });

      setIsTranslatingContent(true);
      setShowTranslationToast(true);
      try {
        if (htmlContent) {
          console.log(
            "Translating HTML content:",
            htmlContent.substring(0, 100) + "..."
          );

          const translatedHtmlContent = await translateHtmlContent(
            htmlContent,
            currentLanguage.code
          );
          console.log(
            "Translation result:",
            translatedHtmlContent.substring(0, 100) + "..."
          );
          setTranslatedHtml(translatedHtmlContent);

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = translatedHtmlContent;
          const plainText = tempDiv.textContent || tempDiv.innerText || "";
          setTranslatedPlainForTTS(plainText);
          onTranslatedTextChange?.(plainText);
        } else {
          console.log(
            "Translating plain text:",
            plainTextContent.substring(0, 100) + "..."
          );

          const translated = await translateText(
            plainTextContent,
            currentLanguage.code
          );
          console.log(
            "Plain text translation result:",
            translated.substring(0, 100) + "..."
          );
          setTranslatedPlainForTTS(translated);
          onTranslatedTextChange?.(translated);
        }
      } catch (error) {
        console.error("Failed to translate content:", error);

        setTranslatedHtml("");
        setTranslatedPlainForTTS("");
        onTranslatedTextChange?.(plainTextContent);
      } finally {
        setIsTranslatingContent(false);
        setShowTranslationToast(false);
        setLastLanguage(currentLanguage.code);
      }
    };
    translateContent();
  }, [
    currentLanguage.code,
    htmlContent,
    plainTextContent,
    lastLanguage,
    onTranslatedTextChange,
    translateHtmlContent,
    translateText,
  ]);

  if (htmlContent) {
    let contentToShow =
      currentLanguage.code === "id"
        ? htmlContent
        : translatedHtml || htmlContent;

    if ((currentLanguage.code === "id" || !translatedHtml) && htmlContent) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const blockquotes = tempDiv.querySelectorAll("blockquote");
      blockquotes.forEach((blockquote) => {
        if (isDark) {
          blockquote.classList.add("dark-blockquote");
        } else {
          blockquote.classList.remove("dark-blockquote");
        }
      });
      contentToShow = tempDiv.innerHTML;
    }

    return (
      <>
        <Toast
          isVisible={showTranslationToast}
          message="Menerjemahkan konten..."
          type="loading"
          onClose={() => setShowTranslationToast(false)}
        />
        <div className="relative">
          <div
            className={`quill-content max-w-none ${
              fontSize === "small"
                ? "text-sm"
                : fontSize === "large"
                  ? "text-xl"
                  : "text-base"
            } ${isDark ? "dark" : ""}`}
          >
            {renderContentWithReactBlockquotes(contentToShow)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast
        isVisible={showTranslationToast}
        message="Menerjemahkan konten..."
        type="loading"
        onClose={() => setShowTranslationToast(false)}
      />
      <div className="relative">
        <div
          className={`quill-content max-w-none ${
            fontSize === "small"
              ? "text-sm"
              : fontSize === "large"
                ? "text-xl"
                : "text-base"
          } ${isDark ? "dark" : ""}`}
        >
          {" "}
          <p>
            <TranslatedText>
              Ini adalah konten demo untuk berita dengan judul
            </TranslatedText>{" "}
            &ldquo;{newsTitle || "Judul Berita"}&rdquo;.{" "}
            <TranslatedText>
              Dalam implementasi sebenarnya, konten ini akan diambil dari
              database atau API yang menyediakan detail lengkap artikel berita.
            </TranslatedText>
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
          <h2>Informasi Lebih Lanjut</h2>
          <p>
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
            </li>{" "}
          </ol>
          <h2>Contoh Blockquote</h2>
          <blockquote
            className={`
              relative border-none border-l-4 p-6 my-8 font-medium italic rounded-xl 
              transition-all duration-300 ease-in-out overflow-visible min-h-16
              transform hover:-translate-y-1
              ${
                isDark
                  ? "border-l-blue-400 bg-gradient-to-br from-slate-800 to-slate-700 text-slate-200 shadow-lg shadow-blue-500/15"
                  : "border-l-blue-500 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-700 shadow-lg shadow-blue-500/10"
              }
            `}
          >
            {/* Quote Icon */}
            <Icon
              icon="material-symbols:format-quote"
              className={`
                absolute text-4xl opacity-20 pointer-events-none z-10
                ${isDark ? "text-blue-400" : "text-blue-500"}
              `}
              style={{
                left: "1rem",
                top: "0.5rem",
              }}
            />

            {/* Content with proper spacing */}
            <div className="relative z-20 pl-8">
              {" "}
              <p className="mb-0">
                &ldquo;Pendidikan adalah senjata paling ampuh yang bisa kamu
                gunakan untuk mengubah dunia.&rdquo;
              </p>
              <cite className="block mt-4 text-sm opacity-70 not-italic">
                — Nelson Mandela
              </cite>
            </div>

            {/* Decorative gradient overlay */}
            <div
              className={`
                absolute top-0 right-0 w-16 h-full rounded-r-xl pointer-events-none z-0
                ${
                  isDark
                    ? "bg-gradient-to-l from-blue-500/5 to-transparent"
                    : "bg-gradient-to-l from-blue-500/3 to-transparent"
                }
              `}
            />
          </blockquote>
        </div>
      </div>
    </>
  );
}
