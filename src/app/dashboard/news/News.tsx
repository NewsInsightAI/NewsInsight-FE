"use client";
import NewsTable from "@/components/ui/NewsTable";
import Pagination from "@/components/ui/Pagination";
import BatchFactCheckButton from "@/components/ui/BatchFactCheckButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";
import { ClipLoader } from "react-spinners";

interface AuthorProps {
  id: number;
  name: string;
  avatarUrl?: string;
  email?: string;
  joinedAt?: string;
}

interface CategoryProps {
  id: number;
  name: string;
}

interface NewsData {
  id: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  title: string;
  category: CategoryProps;
  author: AuthorProps[];
  publishedAt: string;
  status: string;
}

export default function News() {
  const { isDark } = useDarkMode();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasInitialFetch, setHasInitialFetch] = useState(false);
  const [selectedNewsIds, setSelectedNewsIds] = useState<number[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  const fetchNewsData = useCallback(
    async (search = "", page = 1) => {
      try {
        setLoading(true);
        const token = session?.backendToken;

        const searchParams = new URLSearchParams();
        if (search.trim()) {
          searchParams.append("search", search.trim());
        }
        searchParams.append("page", page.toString());
        searchParams.append("limit", "10");

        const url = `/api/news${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }

        const data = await response.json();

        if (data.data?.pagination) {
          setPagination({
            currentPage: data.data.pagination.currentPage || page,
            totalPages: data.data.pagination.totalPages || 1,
            totalItems:
              data.data.pagination.totalCount || data.data.news?.length || 0,
          });
        } else {
          setPagination({
            currentPage: page,
            totalPages: 1,
            totalItems: data.data.news?.length || 0,
          });
        }

        const transformedData: NewsData[] = data.data.news.map(
          (news: {
            id: number;
            title: string;
            category_id?: number;
            category_name?: string;
            status: string;
            created_at: string;
            updated_at: string;
            published_at?: string;
            featured_image?: string;
            authors?: { author_name: string; name?: string }[] | string;
            created_by_name?: string;
          }) => {
            console.log("Processing news item:", news);

            let authors: AuthorProps[] = [];
            if (news.authors && Array.isArray(news.authors)) {
              authors = news.authors.map(
                (
                  author: { author_name?: string; name?: string },
                  index: number
                ) => ({
                  id: index + 1,
                  name: author.author_name || author.name || "Tidak Diketahui",
                  avatarUrl: "/images/default_profile.png",
                })
              );
            } else if (news.authors && typeof news.authors === "string") {
              authors = news.authors
                .split(", ")
                .map((authorName: string, index: number) => ({
                  id: index + 1,
                  name: authorName,
                  avatarUrl: "/images/default_profile.png",
                }));
            } else if (news.created_by_name) {
              authors = [
                {
                  id: 1,
                  name: news.created_by_name,
                  avatarUrl: "/images/default_profile.png",
                },
              ];
            } else {
              authors = [
                {
                  id: 1,
                  name: "Tidak Diketahui",
                  avatarUrl: "/images/default_profile.png",
                },
              ];
            }

            return {
              id: news.id,
              title: news.title,
              category: {
                id: news.category_id || 0,
                name: news.category_name || "Tanpa Kategori",
              },
              status: news.status,
              createdAt: news.created_at,
              updatedAt: news.updated_at,
              publishedAt: news.published_at || news.created_at,
              imageUrl: news.featured_image || "/images/main_news.png",
              author: authors,
            };
          }
        );

        setNewsData(transformedData);
      } catch (error) {
        console.error("Error fetching news:", error);
        showToast("Gagal memuat data berita", "error");
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, showToast]
  );

  useEffect(() => {
    // Only fetch if we have a valid session token
    if (!session?.backendToken) return;

    // For search terms, always fetch with debounce
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        fetchNewsData(searchTerm, 1);
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    // For initial load, only fetch once
    if (!hasInitialFetch) {
      fetchNewsData("", 1);
      setHasInitialFetch(true);
    }
  }, [searchTerm, session, fetchNewsData, hasInitialFetch]);

  const handlePageChange = (page: number) => {
    fetchNewsData(searchTerm, page);
  };

  const handleEditNews = (newsId: number) => {
    router.push(`/dashboard/news/edit/${newsId}`);
  };

  const handleDeleteNews = async (newsId: number) => {
    try {
      showToast("Menghapus berita...", "loading");
      const token = session?.backendToken;

      const response = await fetch(`/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete news");
      }

      showToast("Berita berhasil dihapus", "success");

      // Remove deleted news from selected items
      setSelectedNewsIds((prev) => prev.filter((id) => id !== newsId));

      fetchNewsData(searchTerm, pagination.currentPage);
    } catch (error) {
      console.error("Error deleting news:", error);
      showToast("Gagal menghapus berita", "error");
    }
  };

  const handleBulkDeleteNews = async (newsIds: number[]) => {
    try {
      showToast("Menghapus berita terpilih...", "loading");
      const token = session?.backendToken;

      // Delete each news item
      const deletePromises = newsIds.map(async (newsId) => {
        const response = await fetch(`/api/news/${newsId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete news ${newsId}`);
        }
        return newsId;
      });

      await Promise.all(deletePromises);

      showToast(`${newsIds.length} berita berhasil dihapus`, "success");

      // Remove deleted news from selected items
      setSelectedNewsIds((prev) => prev.filter((id) => !newsIds.includes(id)));

      fetchNewsData(searchTerm, pagination.currentPage);
    } catch (error) {
      console.error("Error bulk deleting news:", error);
      showToast("Gagal menghapus berita terpilih", "error");
    }
  };

  return (
    <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
      {" "}
      {/* Header Section */}
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-3 lg:gap-0">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/news_rounded.svg"
            alt="news"
            width={28}
            height={28}
            className="w-6 h-6 md:w-7 md:h-7"
          />
          <p className="text-lg md:text-xl lg:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
            Daftar Berita
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="flex items-center justify-center w-full sm:max-w-60 lg:max-w-52">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border rounded-full transition-colors duration-300 ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
                    : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"
                }`}
              />
              <Icon
                icon="material-symbols:search-rounded"
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 ${
                  isDark ? "text-gray-400" : "text-black"
                }`}
              />
            </div>
          </div>

          {/* Add Button */}
          <Link
            href="/dashboard/news/add"
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-full md:rounded-3xl px-4 md:px-5 py-2.5 text-sm md:text-base hover:opacity-80 transition duration-300 ease-in-out cursor-pointer whitespace-nowrap"
          >
            <Icon icon="basil:add-solid" className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Tambah Berita</span>
            <span className="sm:hidden">Tambah</span>
          </Link>

          {/* Batch Fact Check Button */}
          <BatchFactCheckButton
            selectedNewsIds={selectedNewsIds}
            newsData={newsData.map((news) => ({
              id: news.id,
              title: news.title,
              content: news.title, // You can add more content here if available
            }))}
            onFactCheckComplete={(results) => {
              console.log("Batch fact check results:", results);
              // You can add additional handling here
            }}
          />
        </div>
      </div>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <ClipLoader
                color={isDark ? "#3B82F6" : "#2563EB"}
                loading={true}
                size={48}
              />
              <p
                className={`text-sm mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Memuat data berita...
              </p>
            </div>
          </div>
        ) : newsData.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <p
                className={`text-lg mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {searchTerm
                  ? "Tidak ada berita yang ditemukan"
                  : "Belum ada berita"}
              </p>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {searchTerm
                  ? "Coba kata kunci yang berbeda"
                  : "Mulai tambahkan berita pertama Anda"}
              </p>
            </div>
          </div>
        ) : (
          <NewsTable
            datas={newsData.map((news) => ({
              ...news,
              author: [...news.author],
            }))}
            onEdit={handleEditNews}
            onDelete={handleDeleteNews}
            onBulkDelete={handleBulkDeleteNews}
            selectedItems={selectedNewsIds.map((id) => id.toString())}
            onSelectionChange={(selectedIds) => {
              setSelectedNewsIds(selectedIds.map((id) => parseInt(id)));
            }}
            pagination={{
              currentPage: pagination.currentPage,
              totalPages: pagination.totalPages,
              totalItems: pagination.totalItems,
              itemsPerPage: 10,
            }}
          />
        )}

        {/* Pagination */}
        {!loading && newsData.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={10}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
