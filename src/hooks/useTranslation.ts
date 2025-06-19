"use client";
import { useState, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

export const useTranslation = () => {
  const { currentLanguage, translateText, isTranslating } = useLanguage();
  const [translations, setTranslations] = useState<
    Map<string, TranslationResult>
  >(new Map());

  const translate = useCallback(
    async (
      text: string,
      options?: {
        targetLang?: string;
        forceRefresh?: boolean;
      }
    ): Promise<string> => {
      if (!text?.trim()) return text;

      const targetLang = options?.targetLang || currentLanguage.code;
      const cacheKey = `${text}_${targetLang}`;

      
      if (!options?.forceRefresh && translations.has(cacheKey)) {
        const cached = translations.get(cacheKey);
        if (cached && !cached.isLoading && !cached.error) {
          return cached.translatedText;
        }
      }

      setTranslations(
        (prev) =>
          new Map(
            prev.set(cacheKey, {
              originalText: text,
              translatedText: text,
              isLoading: true,
              error: null,
            })
          )
      );

      try {
        const result = await translateText(text, targetLang);

        setTranslations(
          (prev) =>
            new Map(
              prev.set(cacheKey, {
                originalText: text,
                translatedText: result,
                isLoading: false,
                error: null,
              })
            )
        );

        return result;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Translation failed";

        setTranslations(
          (prev) =>
            new Map(
              prev.set(cacheKey, {
                originalText: text,
                translatedText: text,
                isLoading: false,
                error: errorMessage,
              })
            )
        );

        console.error("Translation error:", error);
        return text;
      }
    },
    [currentLanguage.code, translateText, translations]
  );

  const getTranslationState = useCallback(
    (text: string, targetLang?: string): TranslationResult | null => {
      const lang = targetLang || currentLanguage.code;
      const cacheKey = `${text}_${lang}`;
      return translations.get(cacheKey) || null;
    },
    [currentLanguage.code, translations]
  );

  const clearTranslations = useCallback(() => {
    setTranslations(new Map());
  }, []);

  return {
    translate,
    getTranslationState,
    clearTranslations,
    isTranslating,
    currentLanguage,
  };
};
