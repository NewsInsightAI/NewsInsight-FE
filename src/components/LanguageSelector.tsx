"use client";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  Language,
} from "@/context/LanguageContext";
import { useDarkMode } from "@/context/DarkModeContext";
import { Toast } from "./Toast";

interface LanguageSelectorProps {
  className?: string;
  showFlag?: boolean;
  showFullName?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "",
  showFlag = true,
  showFullName = false,
}) => {
  const { currentLanguage, setLanguage, isChangingLanguage } = useLanguage();
  const { isDark } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLanguageSelect = async (language: Language) => {
    setIsOpen(false);
    await setLanguage(language);
  };

  const getDisplayText = () => {
    if (showFullName) {
      return showFlag
        ? `${currentLanguage.flag} ${currentLanguage.name}`
        : currentLanguage.name;
    }
    return showFlag
      ? `${currentLanguage.flag} ${currentLanguage.code.toUpperCase()}`
      : currentLanguage.code.toUpperCase();
  };
  return (
    <>
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Language selector button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChangingLanguage}
          className={`flex items-center gap-2 cursor-pointer hover:text-gray-400 transition-colors ${
            isChangingLanguage ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label="Select Language"
        >
          <span className="text-sm font-medium">{getDisplayText()}</span>
          {isChangingLanguage ? (
            <Icon icon="material-symbols:autorenew" className="animate-spin" />
          ) : (
            <Icon
              icon="mingcute:down-line"
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {/* Language dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`absolute right-0 mt-2 w-56 ${
                isDark
                  ? "bg-[#1A1A1A] border border-gray-700 shadow-2xl shadow-blue-500/20"
                  : "bg-white border border-gray-200 shadow-lg"
              } rounded-xl py-2 z-50 max-h-80 overflow-y-auto`}
            >
              <div
                className={`px-3 py-2 text-xs font-semibold ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                Pilih Bahasa
              </div>
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-3 ${
                    currentLanguage.code === language.code
                      ? isDark
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-50 text-blue-600"
                      : isDark
                        ? "text-white hover:bg-gray-700"
                        : "text-black hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.name}</span>
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {language.code.toUpperCase()}
                    </span>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Icon
                      icon="material-symbols:check"
                      className="ml-auto text-blue-500"
                      fontSize={16}
                    />
                  )}
                </button>
              ))}{" "}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <Toast
        isVisible={isChangingLanguage}
        message={`Mengubah bahasa ke ${currentLanguage.name}...`}
        type="loading"
      />
    </>
  );
};
