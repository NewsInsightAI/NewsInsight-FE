"use client";

import NewsCard from "@/components/NewsCard";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSavedNews } from "@/hooks/useSavedNews";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { SavedNewsData } from "@/hooks/useSavedNews";
import { ReadingHistoryData } from "@/lib/api/readingHistory";
import { useProfileTab } from "@/context/ProfileTabContext";
import Pagination from "@/components/ui/Pagination";

export default function Profile() {
  const { isDark } = useDarkMode();
  const { status } = useSession();
  const router = useRouter();
  const { activeTab } = useProfileTab();
  const [pageLoading, setPageLoading] = useState(true);

  const {
    savedNews,
    loading: savedNewsLoading,
    error: savedNewsError,
    pagination: savedNewsPagination,
    goToPage: goToSavedNewsPage,
    refetch: refetchSavedNews,
  } = useSavedNews();

  const {
    history,
    loading: historyLoading,
    error: historyError,
    pagination: historyPagination,
    goToPage: goToHistoryPage,
    refetch: refetchHistory,
  } = useReadingHistory();

  // Redirect ke login jika belum login
  useEffect(() => {
    if (status === "loading") return; // Masih loading

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Jika belum login, tampilkan loading atau redirect
  if (status === "loading") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Akan redirect ke login
  }

  const formatNewsData = (item: SavedNewsData | ReadingHistoryData) => ({
    source: item.category_name || "NewsInsight",
    title: item.title,
    imageUrl: item.image_url,
    timestamp: item.published_at,
    link: `/news/${item.news_id}`,
    category: item.category_name || "Umum",
  });

  const currentData = activeTab === "bookmarks" ? savedNews : history;
  const currentLoading =
    activeTab === "bookmarks" ? savedNewsLoading : historyLoading;
  const currentError =
    activeTab === "bookmarks" ? savedNewsError : historyError;
  const currentPagination =
    activeTab === "bookmarks" ? savedNewsPagination : historyPagination;
  const currentGoToPage =
    activeTab === "bookmarks" ? goToSavedNewsPage : goToHistoryPage;

  if (pageLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Icon
            icon="line-md:loading-loop"
            className="text-4xl text-blue-500"
          />
          <p
            className={`transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Memuat profil dan konten...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* Loading State */}
      {currentLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {activeTab === "bookmarks"
                ? "Memuat simpanan..."
                : "Memuat riwayat..."}
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {currentError && !currentLoading && (
        <div
          className={`flex flex-col items-center justify-center py-12 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <Icon
            icon="mdi:alert-circle"
            className="w-12 h-12 text-red-500 mb-3"
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Terjadi Kesalahan
          </h3>
          <p
            className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {currentError}
          </p>
          <button
            onClick={() => {
              if (activeTab === "bookmarks") {
                refetchSavedNews();
              } else {
                refetchHistory();
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Empty State */}
      {!currentLoading && !currentError && currentData.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center py-16 rounded-lg ${
            isDark ? "bg-gray-800" : "bg-gray-50"
          }`}
        >
          <Icon
            icon={
              activeTab === "bookmarks"
                ? "mingcute:bookmark-line"
                : "iconamoon:history-duotone"
            }
            className={`w-16 h-16 mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          />
          <h3
            className={`text-lg font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {activeTab === "bookmarks"
              ? "Belum Ada Simpanan"
              : "Belum Ada Riwayat"}
          </h3>
          <p
            className={`text-sm text-center max-w-md ${
              isDark ? "text-gray-500" : "text-gray-600"
            }`}
          >
            {activeTab === "bookmarks"
              ? "Mulai simpan berita yang menarik untuk dibaca nanti."
              : "Riwayat bacaan Anda akan muncul di sini setelah Anda membaca berita."}
          </p>
        </div>
      )}

      {/* Content Grid */}
      {!currentLoading && !currentError && currentData.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto outline-none">
            {currentData.map((item, index) => (
              <NewsCard
                key={`${activeTab}-${item.news_id || item.id}-${index}`}
                {...formatNewsData(item)}
              />
            ))}
          </div>

          {/* Pagination */}
          {currentPagination.total_pages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPagination.current_page}
                totalPages={currentPagination.total_pages}
                onPageChange={currentGoToPage}
                totalItems={currentPagination.total_items}
                itemsPerPage={currentPagination.items_per_page}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
