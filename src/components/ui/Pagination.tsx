"use client";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false,
}: PaginationProps) {
  const { isDark } = useDarkMode();

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 rounded-lg border transition-colors duration-300 ${
        isDark
          ? "bg-gray-800 border-gray-600 text-gray-300"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      {/* Info - Mobile: Top, Desktop: Left */}
      <div className="text-sm order-2 sm:order-1">
        <span className="font-medium">
          Menampilkan {startItem}-{endItem}
        </span>{" "}
        dari{" "}
        <span className="font-medium">
          {totalItems.toLocaleString("id-ID")}
        </span>{" "}
        data
      </div>

      {/* Pagination Controls - Mobile: Bottom, Desktop: Right */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={`flex items-center justify-center min-w-[32px] h-8 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors duration-200 ${
            currentPage === 1 || loading
              ? isDark
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-400 cursor-not-allowed"
              : isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Prev</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span
                  className={`flex items-center justify-center min-w-[32px] h-8 px-2 text-xs sm:text-sm ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`flex items-center justify-center min-w-[32px] h-8 px-2 text-xs sm:text-sm rounded-md transition-colors duration-200 ${
                    currentPage === page
                      ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white font-medium"
                      : loading
                        ? isDark
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-400 cursor-not-allowed"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={`flex items-center justify-center min-w-[32px] h-8 px-2 sm:px-3 text-xs sm:text-sm rounded-md transition-colors duration-200 ${
            currentPage === totalPages || loading
              ? isDark
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-400 cursor-not-allowed"
              : isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
