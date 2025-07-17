"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatNewsCount } from "@/utils/formatters";
import { useNavbarPadding } from "@/hooks/useNavbarHeight";
import ArticleCard from "@/components/ArticleCard";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  featured_image?: string;
  status?: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  view_count?: number;
  hashed_id?: string;
  created_by_email?: string;
  created_by_name?: string;
  authors?: Array<{ author_name: string; location?: string }>;
  tags?: string[];
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { isDark } = useDarkMode();
  const navbarPadding = useNavbarPadding();
  const resolvedParams = React.use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { slug } = resolvedParams;

  // Fetch data kategori
  const fetchCategory = useCallback(async () => {
    try {
      const response = await fetch(`/api/categories/${slug}`);
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setCategory(result.data);
        } else {
          throw new Error(result.message || "Category not found");
        }
      } else {
        throw new Error("Failed to fetch category");
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      // Fallback data jika API tidak tersedia
      setCategory({
        id: "fallback",
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug: slug,
        description: `Berita ${slug} terkini dan terpercaya`,
        is_active: true,
      });
    }
  }, [slug]);

  // Fetch berita berdasarkan kategori
  const fetchNews = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        setError(null);

        const response = await fetch(
          `/api/news/category/${slug}?page=${pageNum}&limit=12`
        );
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.news) {
            const newNews = result.data.news;

            if (append) {
              setNews((prev) => [...prev, ...newNews]);
            } else {
              setNews(newNews);
            }

            // Check if there are more pages
            setHasMore(result.data.pagination?.hasNextPage || false);
          } else {
            throw new Error(result.message || "Failed to fetch news");
          }
        } else {
          throw new Error("Failed to fetch news");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error instanceof Error ? error.message : "Unknown error");

        // Fallback mock data
        if (pageNum === 1) {
          setNews([
            {
              id: "1",
              title: `Berita ${category?.name || slug} Terbaru Hari Ini`,
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
              excerpt: "Ringkasan berita terbaru dari kategori ini",
              featured_image: "/images/main_news.png",
              published_at: new Date().toISOString(),
              category_id: category?.id || "1",
              view_count: 150,
              status: "published",
              slug: "berita-terbaru",
            },
          ]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [slug, category?.name, category?.id]
  );

  // Load more news
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNews(nextPage, true);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCategory();
      fetchNews();
    }
  }, [slug, fetchCategory, fetchNews]);

  if (loading && !category) {
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
                <li>
                  <Link
                    href="/categories"
                    className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-600"} transition-colors`}
                  >
                    <TranslatedText>Kategori</TranslatedText>
                  </Link>
                </li>
                <li className={isDark ? "text-gray-600" : "text-gray-400"}>
                  <Icon icon="mingcute:right-line" />
                </li>
                <li
                  className={`font-medium ${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  <TranslatedText>{category?.name || slug}</TranslatedText>
                </li>
              </ol>
            </nav>

            {/* Category Info */}
            <div className="flex flex-col items-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${
                  isDark ? "bg-blue-500/10" : "bg-blue-100"
                }`}
              >
                <span
                  className={`text-2xl font-bold ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {(category?.name || slug).charAt(0).toUpperCase()}
                </span>
              </div>

              <h1
                className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>{category?.name || slug}</TranslatedText>
              </h1>

              <p
                className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto mb-6`}
              >
                {category?.description ||
                  `Berita ${category?.name || slug} terkini dan terpercaya`}
              </p>

              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon icon="material-symbols:article" className="mr-2" />
                  {formatNewsCount(news.length)}{" "}
                  <span className="ml-1">
                    <TranslatedText>berita</TranslatedText>
                  </span>
                </span>

                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    isDark
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Icon icon="material-symbols:schedule" className="mr-2" />
                  <TranslatedText>Diperbarui hari ini</TranslatedText>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon
              icon="eos-icons:loading"
              className={`text-4xl animate-spin mb-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <p
              className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              <TranslatedText>Memuat berita...</TranslatedText>
            </p>
          </div>
        ) : error && news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon
              icon="material-symbols:error"
              className={`text-4xl mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}
            />
            <p
              className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"} text-center mb-2`}
            >
              <TranslatedText>
                Terjadi kesalahan saat memuat berita
              </TranslatedText>
            </p>
            <p
              className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"} mb-4`}
            >
              {error}
            </p>
            <button
              onClick={() => fetchNews()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <TranslatedText>Coba Lagi</TranslatedText>
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Icon
              icon="material-symbols:article-outline"
              className={`text-6xl mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            />
            <p
              className={`text-xl ${isDark ? "text-gray-400" : "text-gray-600"} text-center mb-2`}
            >
              <TranslatedText>Belum ada berita di kategori ini</TranslatedText>
            </p>
            <p
              className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"} mb-6`}
            >
              <TranslatedText>
                Silakan kembali lagi nanti atau coba kategori lain
              </TranslatedText>
            </p>
            <Link
              href="/categories"
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <TranslatedText>Lihat Kategori Lain</TranslatedText>
            </Link>
          </div>
        ) : (
          <>
            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {news.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isDark
                      ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] hover:from-[#2DD4FF] hover:to-[#4F46E5] text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                  }`}
                >
                  {loadingMore ? (
                    <>
                      <Icon
                        icon="eos-icons:loading"
                        className="text-lg animate-spin"
                      />
                      <TranslatedText>Memuat...</TranslatedText>
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="material-symbols:expand-more"
                        className="text-lg"
                      />
                      <TranslatedText>Muat Lebih Banyak</TranslatedText>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
