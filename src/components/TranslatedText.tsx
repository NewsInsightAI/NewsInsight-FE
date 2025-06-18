"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Icon } from "@iconify/react";

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
  showLoadingIndicator?: boolean;
  fallbackToOriginal?: boolean;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  className = "",
  as: Component = "span",
  showLoadingIndicator = false,
  fallbackToOriginal = true,
}) => {
  const { currentLanguage, translateText } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performTranslation = useCallback(
    async (text: string, langCode: string) => {
      if (langCode === "id" || !text.trim()) {
        setTranslatedText(text);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await translateText(text, langCode);
        setTranslatedText(result);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Translation failed";
        setError(errorMessage);

        if (fallbackToOriginal) {
          setTranslatedText(text);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [translateText, fallbackToOriginal]
  );

  const stableText = useMemo(() => children, [children]);
  const stableLanguageCode = useMemo(
    () => currentLanguage.code,
    [currentLanguage.code]
  );

  useEffect(() => {
    performTranslation(stableText, stableLanguageCode);
  }, [performTranslation, stableText, stableLanguageCode]);

  const content = useMemo(() => {
    if (isLoading && showLoadingIndicator) {
      return (
        <span className="inline-flex items-center gap-1">
          {translatedText}
          <Icon
            icon="line-md:loading-twotone-loop"
            className="text-blue-500 animate-spin"
            fontSize={12}
          />
        </span>
      );
    }

    if (error && !fallbackToOriginal) {
      return (
        <span className="text-red-500 inline-flex items-center gap-1">
          Translation Error
          <Icon icon="material-symbols:error" fontSize={12} />
        </span>
      );
    }

    return translatedText;
  }, [
    translatedText,
    isLoading,
    error,
    showLoadingIndicator,
    fallbackToOriginal,
  ]);

  return React.createElement(Component, { className }, content);
};
