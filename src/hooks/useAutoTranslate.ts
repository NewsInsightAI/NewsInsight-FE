"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContextSimple";


export const useAutoTranslate = (originalText: string) => {
  const { currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentLanguage.code === "id" || !originalText.trim()) {
      setTranslatedText(originalText);
      return;
    }

    const translateText = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: originalText,
            from: "id",
            to: currentLanguage.code,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setTranslatedText(result.translatedText);
        } else {
          console.error("Translation failed:", result.error);
          setTranslatedText(originalText);
        }
      } catch (error) {
        console.error("Translation error:", error);
        setTranslatedText(originalText);
      } finally {
        setIsLoading(false);
      }
    };

    translateText();
  }, [originalText, currentLanguage.code]);

  return { translatedText, isLoading };
};
