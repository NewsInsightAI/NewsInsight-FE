"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatNewsCount } from "@/utils/formatters";
import { useNavbarPadding } from "@/hooks/useNavbarHeight";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  news_count?: number;
}

export default function CategoriesPage() {
  const { isDark } = useDarkMode();
  const navbarPadding = useNavbarPadding();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch semua kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (response.ok) {
          const result = await response.json();
          if (result.status === "success" && result.data) {
            setCategories(result.data);
          } else {
            throw new Error(result.message || "Failed to fetch categories");
          }
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error instanceof Error ? error.message : "Unknown error");

        // Fallback data
        setCategories([
          {
            id: "1",
            name: "Teknologi",
            slug: "teknologi",
            description: "Berita teknologi terkini",
            news_count: 5,
          },
          {
            id: "2",
            name: "Olahraga",
            slug: "olahraga",
            description: "Berita olahraga terbaru",
            news_count: 3,
          },
          {
            id: "3",
            name: "Politik",
            slug: "politik",
            description: "Berita politik nasional",
            news_count: 8,
          },
          {
            id: "4",
            name: "Ekonomi",
            slug: "ekonomi",
            description: "Berita ekonomi dan bisnis",
            news_count: 6,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-screen ${isDark ? "bg-[#1A1A1A] text-white" : "bg-gray-50 text-black"} transition-colors duration-300`}
        style={navbarPadding.style}
      >
        <div className="flex flex-col items-center justify-center py-32">
          <Icon
            icon="eos-icons:loading"
            className={`text-4xl animate-spin mb-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
          />
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <TranslatedText>Memuat kategori...</TranslatedText>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#1A1A1A] text-white" : "bg-gray-50 text-black"} transition-colors duration-300`}
      style={navbarPadding.style}
    >
      {/* Header Section */}
      <div
        className={`${isDark ? "bg-gray-800" : "bg-white"} border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex justify-center mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-600"} transition-colors`}
                  >
                    <TranslatedText>Beranda</TranslatedText>
                  </Link>
                </li>
                <li className={isDark ? "text-gray-600" : "text-gray-400"}>
                  <Icon icon="mingcute:right-line" />
                </li>
                <li
                  className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  <TranslatedText>Kategori</TranslatedText>
                </li>
              </ol>
            </nav>

            {/* Page Title */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${
                  isDark ? "bg-blue-500/10" : "bg-blue-100"
                }`}
              >
                <Icon
                  icon="material-symbols:category"
                  className={`text-2xl ${isDark ? "text-blue-400" : "text-blue-600"}`}
                />
              </div>

              <h1
                className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>Kategori Berita</TranslatedText>
              </h1>

              <p
                className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto mb-6`}
              >
                <TranslatedText>
                  Jelajahi berita berdasarkan kategori yang Anda minati
                </TranslatedText>
              </p>

              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon icon="material-symbols:category" className="mr-2" />
                  {categories.length}{" "}
                  <span className="ml-1">
                    <TranslatedText>kategori</TranslatedText>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon
              icon="material-symbols:error"
              className={`text-4xl mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}
            />
            <p
              className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"} text-center mb-2`}
            >
              <TranslatedText>
                Terjadi kesalahan saat memuat kategori
              </TranslatedText>
            </p>
            <p
              className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"} mb-4`}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <TranslatedText>Coba Lagi</TranslatedText>
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon
              icon="material-symbols:category-outline"
              className={`text-6xl mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
            <p
              className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"} text-center mb-2`}
            >
              <TranslatedText>Belum ada kategori tersedia</TranslatedText>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`group block p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  isDark
                    ? "border-gray-700 bg-gray-800 hover:border-blue-500"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                      isDark ? "bg-blue-500/10" : "bg-blue-100"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    <span
                      className={`text-xl font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
                  >
                    <TranslatedText>{category.name}</TranslatedText>
                  </h3>

                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-4 line-clamp-2`}
                  >
                    {category.description || `Berita ${category.name} terkini`}
                  </p>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon icon="material-symbols:article" className="mr-1" />
                      {formatNewsCount(category.news_count || 0)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
