"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";


export const SUPPORTED_LANGUAGES = [
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => Promise<void>;
  translateText: (text: string, targetLang?: string) => Promise<string>;
  isTranslating: boolean;
  isChangingLanguage: boolean;
  translationCache: Map<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0]
  );
  const [isTranslating] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [translationCache] = useState(new Map<string, string>());

  useEffect(() => {
    const savedLanguage = localStorage.getItem("newsinsight_language");
    if (savedLanguage) {
      try {
        const parsed = JSON.parse(savedLanguage);
        const found = SUPPORTED_LANGUAGES.find(
          (lang) => lang.code === parsed.code
        );
        if (found) {
          setCurrentLanguage(found);
        }
      } catch (error) {
        console.error("Error parsing saved language:", error);
      }
    }
  }, []);
  const setLanguage = async (language: Language) => {
    setIsChangingLanguage(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setCurrentLanguage(language);
    localStorage.setItem("newsinsight_language", JSON.stringify(language));

    setIsChangingLanguage(false);
  };
  const translateText = useCallback(
    async (text: string, targetLang?: string): Promise<string> => {
      if (!text.trim()) return text;

      const target = targetLang || currentLanguage.code;

      if (target === "id") return text;

      const cacheKey = `${text}_${target}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            from: "id",
            to: target,
          }),
        });

        const result = await response.json();

        if (result.success) {
          const translatedText = result.translatedText;
          translationCache.set(cacheKey, translatedText);
          return translatedText;
        } else {
          console.error("Translation failed:", result.error);
          return text;
        }
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    },
    [currentLanguage.code, translationCache]
  );
  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translateText,
    isTranslating,
    isChangingLanguage,
    translationCache,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
