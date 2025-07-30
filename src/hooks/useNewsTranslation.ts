import { useState, useCallback } from "react";

export interface TranslationLanguage {
  code: string;
  name: string;
  flag: string;
}

export const TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ms", name: "Bahasa Malaysia", flag: "🇲🇾" },
];

interface TranslatedContent {
  title: string;
  content: string;
}

interface UseNewsTranslationReturn {
  currentLanguage: TranslationLanguage;
  translatedContent: TranslatedContent | null;
  isTranslating: boolean;
  isTranslated: boolean;
  translateNews: (
    newsTitle: string,
    newsContent: string,
    targetLanguage: TranslationLanguage
  ) => Promise<void>;
  resetTranslation: () => void;
}

export function useNewsTranslation(): UseNewsTranslationReturn {
  const [currentLanguage, setCurrentLanguage] = useState<TranslationLanguage>(
    TRANSLATION_LANGUAGES[0] // Default to Indonesian
  );
  const [translatedContent, setTranslatedContent] =
    useState<TranslatedContent | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const translateNews = useCallback(
    async (
      newsTitle: string,
      newsContent: string,
      targetLanguage: TranslationLanguage
    ) => {
      if (targetLanguage.code === "id") {
        // If target is Indonesian (original), reset translation
        setCurrentLanguage(targetLanguage);
        setTranslatedContent(null);
        return;
      }

      setIsTranslating(true);

      try {
        console.log("🔄 Starting news translation to:", targetLanguage.name);

        // Translate title
        const titleResponse = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newsTitle,
            targetLang: targetLanguage.code,
          }),
        });

        if (!titleResponse.ok) {
          throw new Error(`Translation failed: ${titleResponse.status}`);
        }

        const titleResult = await titleResponse.json();

        // Translate content (strip HTML tags for translation)
        const plainContent = newsContent
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const contentResponse = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: plainContent,
            targetLang: targetLanguage.code,
          }),
        });

        if (!contentResponse.ok) {
          throw new Error(
            `Content translation failed: ${contentResponse.status}`
          );
        }

        const contentResult = await contentResponse.json();

        // Update state
        setCurrentLanguage(targetLanguage);
        setTranslatedContent({
          title: titleResult.translatedText,
          content: contentResult.translatedText,
        });

        console.log("✅ News translation completed successfully");
      } catch (error) {
        console.error("❌ News translation failed:", error);
        throw error;
      } finally {
        setIsTranslating(false);
      }
    },
    []
  );

  const resetTranslation = useCallback(() => {
    setCurrentLanguage(TRANSLATION_LANGUAGES[0]);
    setTranslatedContent(null);
  }, []);

  return {
    currentLanguage,
    translatedContent,
    isTranslating,
    isTranslated: translatedContent !== null,
    translateNews,
    resetTranslation,
  };
}
