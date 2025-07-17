"use client";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "./TranslatedText";
import { useCategoriesForNavigation } from "@/hooks/useCategoriesForNavigation";
import { formatNewsCount } from "@/utils/formatters";

interface CategoriesDropdownProps {
  isMobile?: boolean;
  onCategoryClick?: () => void;
}

export const CategoriesDropdown: React.FC<CategoriesDropdownProps> = ({
  isMobile = false,
  onCategoryClick,
}) => {
  const { isDark } = useDarkMode();
  const { categories, loading } = useCategoriesForNavigation();
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

  const handleCategoryClick = () => {
    setIsOpen(false);
    onCategoryClick?.();
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <TranslatedText>Kategori</TranslatedText>
            {loading && (
              <Icon icon="eos-icons:loading" className="text-sm animate-spin" />
            )}
          </div>
          <Icon
            icon="mingcute:down-line"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Icon
                    icon="eos-icons:loading"
                    className="text-lg animate-spin"
                  />
                  <span className="ml-2 text-sm">
                    <TranslatedText>Memuat kategori...</TranslatedText>
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2 pl-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={handleCategoryClick}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-md ${
                            isDark ? "bg-blue-500" : "bg-blue-500"
                          } text-white text-xs font-bold flex items-center justify-center`}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="text-sm">
                          <TranslatedText>{category.name}</TranslatedText>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-gray-400 flex items-center gap-2 cursor-pointer"
      >
        <TranslatedText>Kategori</TranslatedText>
        {loading && (
          <Icon icon="eos-icons:loading" className="text-sm animate-spin" />
        )}
        <Icon
          icon="mingcute:down-line"
          className={`inline-block transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 mt-2 w-[600px] ${
              isDark
                ? "bg-[#1A1A1A] border border-gray-700 shadow-2xl shadow-blue-500/20"
                : "bg-white border border-gray-200 shadow-xl"
            } rounded-xl p-6 z-50`}
          >
            {/* Header */}
            <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>Kategori Berita</TranslatedText>
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                <TranslatedText>Pilih kategori yang Anda minati</TranslatedText>
              </p>
            </div>

            {/* Categories Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Icon
                  icon="eos-icons:loading"
                  className="text-2xl animate-spin mb-2"
                />
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  <TranslatedText>Memuat kategori...</TranslatedText>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    onClick={handleCategoryClick}
                    className={`group p-3 rounded-lg border transition-all duration-200 ${
                      isDark
                        ? "border-gray-700 hover:border-blue-500 hover:bg-gray-800/50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-md ${
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        } group-hover:bg-blue-500 transition-colors flex items-center justify-center`}
                      >
                        <span
                          className={`text-sm font-bold ${
                            isDark ? "text-blue-400" : "text-blue-600"
                          } group-hover:text-white transition-colors`}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm ${
                            isDark ? "text-white" : "text-gray-900"
                          } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
                        >
                          <TranslatedText>{category.name}</TranslatedText>
                        </h4>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } mt-1 line-clamp-2`}
                        >
                          {category.description}
                        </p>
                        {category.newsCount && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                              isDark
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {formatNewsCount(category.newsCount)}{" "}
                            <span className="ml-1">
                              <TranslatedText>berita</TranslatedText>
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/categories"
                onClick={handleCategoryClick}
                className={`inline-flex items-center gap-2 text-sm font-medium ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-700"
                } transition-colors`}
              >
                <TranslatedText>Lihat semua kategori</TranslatedText>
                <Icon
                  icon="material-symbols:arrow-forward"
                  className="text-sm"
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
