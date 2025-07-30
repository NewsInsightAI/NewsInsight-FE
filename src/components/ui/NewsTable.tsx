/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { motion } from "framer-motion";
import ConfirmationModal from "./ConfirmationModal";
import FactCheckButton from "./FactCheckButton";
import StatusChangeModal from "./StatusChangeModal";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";

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
  views?: number;
  comments?: number;
  shares?: number;
  bookmarks?: number;
}

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

interface NewsTableProps {
  datas: NewsData[];
  onEdit?: (newsId: number) => void;
  onDelete?: (newsId: number) => void;
  onBulkDelete?: (newsIds: number[]) => void;
  loading?: boolean;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function NewsTable({
  datas,
  onEdit,
  onDelete,
  onBulkDelete,
  loading,
  selectedItems: externalSelectedItems,
  onSelectionChange,
  pagination,
}: NewsTableProps) {
  const { isDark } = useDarkMode();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    externalSelectedItems || []
  );
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: string;
    image: string;
  } | null>(null);
  const [hoveredAuthor, setHoveredAuthor] = useState<{
    newsId: number;
    authorId: number;
    anchor: HTMLElement | null;
  } | null>(null);
  const [showAuthorsModal, setShowAuthorsModal] = useState<{
    authors: AuthorProps[];
    anchor: HTMLElement | null;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Status change modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalNews, setStatusModalNews] = useState<NewsData | null>(null);
  const [newsFactCheckStatus, setNewsFactCheckStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Sync external selection with internal state
  useEffect(() => {
    if (externalSelectedItems) {
      setSelectedItems(externalSelectedItems);
    }
  }, [externalSelectedItems]);

  // Check fact check status for all news items
  useEffect(() => {
    const checkFactCheckStatus = async () => {
      if (!session?.backendToken || datas.length === 0) return;

      const statusPromises = datas.map(async (news) => {
        try {
          const response = await fetch(`/api/fact-check/${news.id}/has-check`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.backendToken}`,
            },
          });

          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await response.json();
              return {
                newsId: news.id,
                hasFactCheck: data.data?.hasFactCheck || false,
              };
            } else {
              console.warn(
                `Non-JSON response for news ${news.id}:`,
                response.status
              );
              return { newsId: news.id, hasFactCheck: false };
            }
          } else {
            console.warn(
              `Failed to check fact check status for news ${news.id}:`,
              response.status
            );
            return { newsId: news.id, hasFactCheck: false };
          }
        } catch (error) {
          console.error(
            `Error checking fact check status for news ${news.id}:`,
            error
          );
          return { newsId: news.id, hasFactCheck: false };
        }
      });

      const results = await Promise.all(statusPromises);
      const statusMap: { [key: number]: boolean } = {};
      results.forEach(({ newsId, hasFactCheck }) => {
        statusMap[newsId] = hasFactCheck;
      });
      setNewsFactCheckStatus(statusMap);
    };

    checkFactCheckStatus();
  }, [datas, session?.backendToken]);

  const toggleSelectItem = (id: string) => {
    const newSelectedItems = selectedItems.includes(id)
      ? selectedItems.filter((item) => item !== id)
      : [...selectedItems, id];

    setSelectedItems(newSelectedItems);

    // Notify parent component about selection change
    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  };

  const toggleSelectAll = () => {
    const newSelectedItems =
      selectedItems.length === datas.length
        ? []
        : datas.map((item) => item.id.toString());

    setSelectedItems(newSelectedItems);

    // Notify parent component about selection change
    if (onSelectionChange) {
      onSelectionChange(newSelectedItems);
    }
  };
  const getStatusBadge = (level: string, news: NewsData) => {
    const baseClasses =
      "px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm cursor-pointer hover:opacity-80 transition-opacity duration-200";

    const handleClick = () => handleStatusClick(news);

    switch (level) {
      case "published":
        return (
          <span
            className={`bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] ${baseClasses}`}
            onClick={handleClick}
            title="Klik untuk mengubah status"
          >
            <Icon
              icon="ic:round-publish"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span>Terbit</span>
          </span>
        );
      case "draft":
        return (
          <span
            className={`bg-[#9CA3AF]/15 text-[#9CA3AF] border border-[#9CA3AF] ${baseClasses}`}
            onClick={handleClick}
            title="Klik untuk mengubah status"
          >
            <Icon
              icon="material-symbols:draft"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span>Draf</span>
          </span>
        );
      case "scheduled":
        return (
          <span
            className={`bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6] ${baseClasses}`}
            onClick={handleClick}
            title="Klik untuk mengubah status"
          >
            <Icon
              icon="solar:danger-triangle-bold"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span>Terjadwal</span>
          </span>
        );
      case "archived":
        return (
          <span
            className={`bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444] ${baseClasses}`}
            onClick={handleClick}
            title="Klik untuk mengubah status"
          >
            <Icon
              icon="material-symbols:archive-rounded"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span>Arsip</span>
          </span>
        );
      case "review":
        return (
          <span
            className={`bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15] ${baseClasses}`}
            onClick={handleClick}
            title="Klik untuk mengubah status"
          >
            <Icon
              icon="material-symbols:review"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span>Review</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getDateTimeWithTimezone = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("id-ID", options);
  };

  function getTenure(joinedAt?: string): string | null {
    if (!joinedAt) return null;
    const joined = new Date(joinedAt);
    const now = new Date();
    let years = now.getFullYear() - joined.getFullYear();
    let months = now.getMonth() - joined.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    if (years < 0) return null;
    if (years === 0 && months === 0) return null;
    const result = [];
    if (years > 0) result.push(`${years} tahun`);
    if (months > 0) result.push(`${months} bulan`);
    return result.join(" ");
  }

  const getEngagementStats = (news: NewsData) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:visibility"
              className="w-3 h-3 text-blue-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {news.views || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:comment"
              className="w-3 h-3 text-purple-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {news.comments || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:share"
              className="w-3 h-3 text-orange-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {news.shares || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:bookmark"
              className="w-3 h-3 text-pink-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {news.bookmarks || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleEdit = (news: NewsData) => {
    if (onEdit) {
      onEdit(news.id);
    }
  };

  const handleDelete = (news: NewsData) => {
    setNewsToDelete(news);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!newsToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(newsToDelete.id);
      }
      setShowDeleteConfirm(false);
      setNewsToDelete(null);
    } catch (error) {
      console.error("Error deleting news:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedItems.length === 0 || isBulkDeleting) return;

    setIsBulkDeleting(true);
    try {
      if (onBulkDelete) {
        const newsIds = selectedItems.map((id) => parseInt(id));
        await onBulkDelete(newsIds);
      }
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting news:", error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Handle status change
  const handleStatusClick = (news: NewsData) => {
    setStatusModalNews(news);
    setShowStatusModal(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!statusModalNews || !session?.backendToken) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/news/${statusModalNews.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.backendToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "FACT_CHECK_REQUIRED") {
          showToast(
            "Berita harus menjalankan fact check sebelum dapat dipublikasi",
            "error"
          );
        } else {
          showToast(data.error || "Gagal mengubah status berita", "error");
        }
        return;
      }

      showToast(
        `Status berita berhasil diubah menjadi ${newStatus}`,
        "success"
      );
      setShowStatusModal(false);
      setStatusModalNews(null);

      // Refresh data or update local state
      // You might want to call a refresh function here
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating news status:", error);
      showToast("Gagal mengubah status berita", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Hapus Berita"
        message={
          newsToDelete ? (
            <p>
              Apakah Anda yakin ingin menghapus berita &quot;
              {newsToDelete.title}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
          ) : (
            ""
          )
        }
        confirmText="Hapus"
        isLoading={isDeleting}
        loadingText="Menghapus..."
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={confirmBulkDelete}
        title="Hapus Berita Terpilih"
        message={
          <p>
            Apakah Anda yakin ingin menghapus {selectedItems.length} berita yang
            dipilih? Tindakan ini tidak dapat dibatalkan.
          </p>
        }
        confirmText="Hapus Semua"
        isLoading={isBulkDeleting}
        loadingText="Menghapus..."
      />

      {/* Enhanced Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-4 p-4 rounded-lg border transition-colors duration-300 ${
            isDark
              ? "bg-blue-900/20 border-blue-700 shadow-lg shadow-blue-900/20"
              : "bg-blue-50 border-blue-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  isDark
                    ? "bg-blue-700/50 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Icon icon="mdi:check-all" className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {selectedItems.length} berita dipilih
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedItems([]);
                  if (onSelectionChange) {
                    onSelectionChange([]);
                  }
                }}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isDark
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Icon icon="mingcute:delete-fill" className="w-4 h-4" />
                Hapus yang dipilih
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Memuat data...
          </span>
        </div>
      )}

      {/* Empty State */}
      {!loading && datas.length === 0 && (
        <div className="flex flex-col justify-center items-center py-12">
          <Icon
            icon="fluent:news-28-regular"
            className="w-16 h-16 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tidak ada berita ditemukan
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Belum ada berita yang tersedia dalam sistem
          </p>
        </div>
      )}

      {/* Desktop Table View - Hidden on mobile */}
      <div
        className={`hidden md:block w-full overflow-x-auto rounded-xl transition-colors duration-300 border ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <table
          className={`w-full min-w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
        >
          <thead>
            <tr
              className={`border-b transition-colors duration-300 ${
                isDark
                  ? "bg-blue-600/20 border-gray-600"
                  : "bg-[#367AF2]/12 border-gray-200"
              }`}
            >
              <th className="py-2 md:py-3 px-2 md:px-4 relative flex items-center justify-center min-w-[40px]">
                <input
                  type="checkbox"
                  className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                  checked={
                    selectedItems.length === datas.length && datas.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                {selectedItems.length === datas.length && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-2.5 w-2.5 md:h-3 md:w-3 pointer-events-none"
                  />
                )}
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[50px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                No
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[80px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Gambar
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[250px] md:min-w-[300px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Judul Berita
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Kategori
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] md:min-w-[150px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Penulis
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[180px] md:min-w-[200px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Tanggal Publikasi
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Status
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[140px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Engagement
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[160px] md:min-w-[180px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y transition-colors duration-300 ${
              isDark ? "divide-gray-600" : "divide-gray-200"
            }`}
          >
            {datas.map((report, index) => (
              <tr
                key={report.id}
                className={`transition-colors duration-300 ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                } ${index === datas.length - 1 ? "last:rounded-b-xl" : ""}`}
              >
                <td className="py-2 md:py-4 px-2 md:px-4">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                      checked={selectedItems.includes(report.id.toString())}
                      onChange={() => toggleSelectItem(report.id.toString())}
                    />
                    {selectedItems.includes(report.id.toString()) && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-2.5 w-2.5 md:h-3 md:w-3 pointer-events-none"
                      />
                    )}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {pagination
                    ? (pagination.currentPage - 1) *
                        (pagination.itemsPerPage || 10) +
                      index +
                      1
                    : index + 1}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {report.imageUrl && (
                    <div
                      className="h-8 w-12 md:h-10 md:w-16 bg-gray-200 rounded cursor-pointer"
                      onClick={() =>
                        setSelectedPhoto({
                          id: report.id.toString(),
                          image: report.imageUrl,
                        })
                      }
                    >
                      <img
                        src={report.imageUrl}
                        alt="Report"
                        className="h-8 w-12 md:h-10 md:w-16 rounded object-cover"
                      />
                    </div>
                  )}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  <div
                    className="max-w-[200px] md:max-w-xs truncate"
                    title={report.title}
                  >
                    {report.title}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  {report.category.name}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  <div className="flex flex-wrap gap-1 max-w-[100px] md:max-w-24">
                    {report.author.length > 0 ? (
                      <>
                        {report.author.slice(0, 2).map((a) => (
                          <span
                            key={a.id}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                              isDark
                                ? "bg-blue-600/20 text-blue-300 hover:bg-blue-700/40"
                                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            }`}
                            onMouseEnter={(e) =>
                              setHoveredAuthor({
                                newsId: report.id,
                                authorId: a.id,
                                anchor: e.currentTarget,
                              })
                            }
                            onMouseLeave={() => setHoveredAuthor(null)}
                          >
                            {a.name}
                          </span>
                        ))}
                        {report.author.length > 2 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer border border-blue-400 bg-white text-blue-600 hover:bg-blue-50`}
                            onClick={(e) =>
                              setShowAuthorsModal({
                                authors: report.author,
                                anchor: e.currentTarget,
                              })
                            }
                          >
                            +{report.author.length - 2}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">Tidak ada penulis</span>
                    )}
                  </div>
                  {/* Compact Profile Tooltip */}
                  {hoveredAuthor &&
                    hoveredAuthor.newsId === report.id &&
                    report.author.some(
                      (a) => a.id === hoveredAuthor.authorId
                    ) && (
                      <div
                        style={{
                          position: "fixed",
                          zIndex: 50,
                          left:
                            hoveredAuthor.anchor?.getBoundingClientRect()
                              .left ?? 0,
                          top:
                            (hoveredAuthor.anchor?.getBoundingClientRect()
                              .bottom ?? 0) + 6,
                        }}
                        className={`shadow-lg rounded-lg px-4 py-3 bg-white dark:bg-gray-800 border ${isDark ? "border-gray-600" : "border-gray-200"} min-w-[220px] flex gap-3 items-center`}
                        onMouseEnter={() => setHoveredAuthor(hoveredAuthor)}
                        onMouseLeave={() => setHoveredAuthor(null)}
                      >
                        {(() => {
                          const author = report.author.find(
                            (a) => a.id === hoveredAuthor.authorId
                          );
                          if (!author) return null;
                          return (
                            <>
                              <img
                                src={
                                  author.avatarUrl ||
                                  "/images/default_profile.png"
                                }
                                alt={author.name}
                                className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-sm text-blue-600 dark:text-blue-300 truncate">
                                  {author.name}
                                </span>
                                {author.email && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {author.email}
                                  </span>
                                )}
                                {author.joinedAt && (
                                  <span className="text-xs text-gray-400 mt-1">
                                    {getTenure(author.joinedAt)
                                      ? `Bergabung ${getTenure(author.joinedAt)} lalu`
                                      : null}
                                  </span>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  {/* Modal for all authors */}
                  {showAuthorsModal && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                      onClick={() => setShowAuthorsModal(null)}
                    >
                      <div
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xs w-full border ${isDark ? "border-gray-600" : "border-gray-200"}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="mb-3 font-semibold text-base text-blue-600 dark:text-blue-300">
                          Daftar Penulis
                        </div>
                        <div className="space-y-3">
                          {showAuthorsModal.authors.map((a) => (
                            <div key={a.id} className="flex items-center gap-3">
                              <img
                                src={
                                  a.avatarUrl || "/images/default_profile.png"
                                }
                                alt={a.name}
                                className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-sm text-blue-600 dark:text-blue-300 truncate">
                                  {a.name}
                                </span>
                                {a.email && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {a.email}
                                  </span>
                                )}
                                {a.joinedAt && (
                                  <span className="text-xs text-gray-400 mt-1">
                                    {getTenure(a.joinedAt)
                                      ? `Bergabung ${getTenure(a.joinedAt)} lalu`
                                      : null}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => setShowAuthorsModal(null)}
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  <div className="text-xs md:text-sm">
                    {getDateTimeWithTimezone(report.publishedAt)}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getStatusBadge(report.status, report)}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getEngagementStats(report)}
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm">
                  <div className="flex flex-row gap-1 sm:gap-2 justify-start">
                    <button
                      className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15 flex items-center justify-center min-w-0"
                      onClick={() => handleEdit(report)}
                    >
                      <Icon
                        icon="mage:edit-fill"
                        className="sm:mr-1"
                        width={12}
                        height={12}
                      />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    {/* Fact Check Button */}
                    <div className="flex items-center">
                      <FactCheckButton
                        newsId={report.id}
                        newsTitle={report.title}
                        size="sm"
                      />
                    </div>

                    <button
                      className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer flex items-center justify-center min-w-0"
                      onClick={() => handleDelete(report)}
                    >
                      <Icon
                        icon="mingcute:delete-fill"
                        className="sm:mr-1"
                        width={12}
                        height={12}
                      />
                      <span className="hidden sm:inline">Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {datas.map((report, index) => (
          <div
            key={report.id}
            className={`rounded-xl p-4 transition-colors duration-300 border ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                  checked={selectedItems.includes(report.id.toString())}
                  onChange={() => toggleSelectItem(report.id.toString())}
                />
                {selectedItems.includes(report.id.toString()) && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-2.5 w-2.5 pointer-events-none"
                  />
                )}
              </div>
              {report.imageUrl && (
                <div
                  className="h-16 w-20 bg-gray-200 rounded-lg cursor-pointer flex-shrink-0"
                  onClick={() =>
                    setSelectedPhoto({
                      id: report.id.toString(),
                      image: report.imageUrl,
                    })
                  }
                >
                  <img
                    src={report.imageUrl}
                    alt="Report"
                    className="h-16 w-20 rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium text-sm leading-5 line-clamp-2 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                  title={report.title}
                >
                  {report.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isDark
                        ? "bg-blue-600/20 text-blue-400"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {report.category.name}
                  </span>
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    #
                    {pagination
                      ? (pagination.currentPage - 1) *
                          (pagination.itemsPerPage || 10) +
                        index +
                        1
                      : index + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Penulis:
                </span>
                <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                  {report.author.length > 0 ? (
                    <>
                      {report.author.slice(0, 2).map((a) => (
                        <span
                          key={a.id}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors duration-150 ${
                            isDark
                              ? "bg-blue-600/20 text-blue-300 hover:bg-blue-700/40"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                          onClick={() => {
                            setShowAuthorsModal({ authors: [a], anchor: null });
                          }}
                        >
                          <span className="inline-block align-middle">
                            <img
                              src={a.avatarUrl || "/images/default_profile.png"}
                              alt={a.name}
                              className="w-5 h-5 rounded-full object-cover border border-gray-300 dark:border-gray-700 mr-1 inline-block align-middle"
                            />
                          </span>
                          <span className="align-middle">{a.name}</span>
                        </span>
                      ))}
                      {report.author.length > 2 && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer border border-blue-400 bg-white text-blue-600 hover:bg-blue-50`}
                          onClick={() =>
                            setShowAuthorsModal({
                              authors: report.author,
                              anchor: null,
                            })
                          }
                        >
                          +{report.author.length - 2}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">Tidak ada penulis</span>
                  )}
                </div>
              </div>
              {/* Modal for author(s) on mobile */}
              {showAuthorsModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                  onClick={() => setShowAuthorsModal(null)}
                >
                  <div
                    className={`bg-white dark:bg-gray-800 rounded-xl p-6 max-w-xs w-full border ${isDark ? "border-gray-600" : "border-gray-200"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-3 font-semibold text-base text-blue-600 dark:text-blue-300">
                      {showAuthorsModal.authors.length > 1
                        ? "Daftar Penulis"
                        : "Profil Penulis"}
                    </div>
                    <div className="space-y-3">
                      {showAuthorsModal.authors.map((a) => (
                        <div key={a.id} className="flex items-center gap-3">
                          <img
                            src={a.avatarUrl || "/images/default_profile.png"}
                            alt={a.name}
                            className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-sm text-blue-600 dark:text-blue-300 truncate">
                              {a.name}
                            </span>
                            {a.email && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {a.email}
                              </span>
                            )}
                            {a.joinedAt && (
                              <span className="text-xs text-gray-400 mt-1">
                                {getTenure(a.joinedAt)
                                  ? `Bergabung ${getTenure(a.joinedAt)} lalu`
                                  : null}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      className="mt-4 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setShowAuthorsModal(null)}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Status and Engagement */}
            <div className="space-y-2 mt-3">
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Status:
                </span>
                <div>{getStatusBadge(report.status, report)}</div>
              </div>
              <div className="flex justify-between items-start">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Engagement:
                </span>
                <div>{getEngagementStats(report)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Publikasi:
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {getDateTimeWithTimezone(report.publishedAt)}
                </span>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                className="flex-1 border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15 flex items-center justify-center gap-1"
                onClick={() => handleEdit(report)}
              >
                <Icon icon="mage:edit-fill" width={12} height={12} />
                <span>Edit</span>
              </button>

              {/* Fact Check Button for Mobile */}
              <div className="flex-1">
                <FactCheckButton
                  newsId={report.id}
                  newsTitle={report.title}
                  size="sm"
                  fullWidth={true}
                />
              </div>

              <button
                className="flex-1 border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => handleDelete(report)}
              >
                <Icon icon="mingcute:delete-fill" width={12} height={12} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className={`p-4 rounded-lg shadow-lg transition-colors duration-300 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <img
              src={selectedPhoto.image}
              alt="Selected"
              className="max-h-[80vh] max-w-[80vw] rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      <StatusChangeModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setStatusModalNews(null);
        }}
        onConfirm={handleStatusChange}
        currentStatus={statusModalNews?.status || ""}
        newsTitle={statusModalNews?.title || ""}
        hasFactCheck={
          statusModalNews
            ? newsFactCheckStatus[statusModalNews.id] || false
            : false
        }
        isLoading={isUpdatingStatus}
      />
    </>
  );
}
