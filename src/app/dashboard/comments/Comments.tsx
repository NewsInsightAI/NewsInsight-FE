"use client";
import CommentTable from "@/components/ui/CommentTable";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";
import { ClipLoader } from "react-spinners";

interface ReaderProps {
  id: number;
  name: string;
}

interface CommentProps {
  id: number;
  content: string;
}

interface NewsProps {
  id: number;
  title: string;
}

interface CommentData {
  id: number;
  reader: ReaderProps;
  comment: CommentProps;
  news: NewsProps;
  dateTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  dislikes?: number;
  reports?: number;
  parentId?: number | null;
  parentComment?: {
    id: number;
    content: string;
    reader: {
      name: string;
    };
  } | null;
}

export default function Comments() {
  const { isDark } = useDarkMode();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [commentsData, setCommentsData] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">(
    "newest"
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "waiting"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  const fetchCommentsData = useCallback(
    async (search = "") => {
      try {
        setLoading(true);
        const token = session?.backendToken;

        const searchParams = new URLSearchParams();
        if (search.trim()) {
          searchParams.append("search", search.trim());
        }
        if (filterStatus !== "all") {
          searchParams.append("status", filterStatus);
        }
        searchParams.append("sort", sortBy);

        const url = `/api/comments${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch comments data");
        }

        const data = await response.json();

        console.log("Comments API Response:", data);

        let transformedData: CommentData[] = data.data.comments.map(
          (comment: {
            id: number;
            reader_name: string;
            reader_email?: string;
            content: string;
            status: string;
            created_at: string;
            updated_at: string;
            published_at?: string;
            news_id: number;
            news_title: string;
            parent_id?: number;
            likes?: number;
            dislikes?: number;
            reports?: number;
            parent_content?: string;
            parent_reader_name?: string;
          }) => ({
            id: comment.id,
            reader: {
              id: comment.id,
              name: comment.reader_name,
            },
            comment: {
              id: comment.id,
              content: comment.content,
            },
            news: {
              id: comment.news_id,
              title: comment.news_title,
            },
            dateTime: comment.created_at,
            status: comment.status === "published" ? "published" : "waiting",
            createdAt: comment.created_at,
            updatedAt: comment.updated_at,
            likes: comment.likes || 0,
            dislikes: comment.dislikes || 0,
            reports: comment.reports || 0,
            parentId: comment.parent_id || null,
            parentComment:
              comment.parent_id && comment.parent_content
                ? {
                    id: comment.parent_id,
                    content: comment.parent_content,
                    reader: {
                      name: comment.parent_reader_name || "Unknown",
                    },
                  }
                : null,
          })
        );

        if (filterStatus !== "all") {
          transformedData = transformedData.filter(
            (comment) => comment.status === filterStatus
          );
        }

        transformedData.sort((a, b) => {
          switch (sortBy) {
            case "oldest":
              return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
              );
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "status":
              return a.status.localeCompare(b.status);
            default:
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
          }
        });

        setCommentsData(transformedData);

        // Handle pagination if available in response
        if (data.metadata?.pagination) {
          setPagination({
            currentPage: data.metadata.pagination.currentPage || 1,
            totalPages: data.metadata.pagination.totalPages || 1,
            totalItems:
              data.metadata.pagination.totalComments || transformedData.length,
            itemsPerPage: 10,
          });
        } else {
          // Default pagination for client-side pagination
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalItems: transformedData.length,
            itemsPerPage: 10,
          });
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        showToast("Gagal memuat data komentar", "error");
      } finally {
        setLoading(false);
      }
    },
    [session?.backendToken, showToast, filterStatus, sortBy]
  );

  useEffect(() => {
    if (session?.backendToken && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchCommentsData();
    }
  }, [session?.backendToken, fetchCommentsData]);

  useEffect(() => {
    if (!session?.backendToken || !searchTerm.trim()) return;

    const timeoutId = setTimeout(() => {
      fetchCommentsData(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchCommentsData, session?.backendToken]);

  useEffect(() => {
    if (session?.backendToken && hasFetchedRef.current) {
      fetchCommentsData(searchTerm);
    }
  }, [
    filterStatus,
    sortBy,
    fetchCommentsData,
    session?.backendToken,
    searchTerm,
  ]);

  const handleApproveComment = async (commentId: number) => {
    try {
      showToast("Menyetujui komentar...", "loading");

      const response = await fetch(`/api/comments/${commentId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(session?.backendToken && {
            Authorization: `Bearer ${session.backendToken}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve comment");
      }

      showToast("Komentar berhasil disetujui", "success");
      fetchCommentsData(searchTerm);
    } catch (error) {
      console.error("Error approving comment:", error);
      showToast("Gagal menyetujui komentar", "error");
    }
  };

  const handleRejectComment = async (commentId: number) => {
    try {
      showToast("Menolak komentar...", "loading");

      const response = await fetch(`/api/comments/${commentId}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(session?.backendToken && {
            Authorization: `Bearer ${session.backendToken}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject comment");
      }

      showToast("Komentar berhasil ditolak", "success");
      fetchCommentsData(searchTerm);
    } catch (error) {
      console.error("Error rejecting comment:", error);
      showToast("Gagal menolak komentar", "error");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      showToast("Menghapus komentar...", "loading");

      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(session?.backendToken && {
            Authorization: `Bearer ${session.backendToken}`,
          }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      showToast("Komentar berhasil dihapus", "success");
      fetchCommentsData(searchTerm);
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Gagal menghapus komentar", "error");
    }
  };

  const handleBulkDeleteComments = async (commentIds: number[]) => {
    try {
      showToast("Menghapus komentar yang dipilih...", "loading");

      // Delete comments in parallel
      const deletePromises = commentIds.map(async (commentId) => {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(session?.backendToken && {
              Authorization: `Bearer ${session.backendToken}`,
            }),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete comment ${commentId}`);
        }

        return commentId;
      });

      await Promise.all(deletePromises);

      // Clear selection after successful deletion
      setSelectedCommentIds([]);

      showToast(`${commentIds.length} komentar berhasil dihapus`, "success");
      fetchCommentsData(searchTerm);
    } catch (error) {
      console.error("Error deleting comments:", error);
      showToast("Gagal menghapus beberapa komentar", "error");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-3 lg:gap-0">
          {/* Title Section with AI Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/comment.svg"
                alt="news"
                width={28}
                height={28}
              />
              <p className="text-lg md:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
                Daftar Komentar
              </p>
            </div>
            <div
              className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-3 md:px-4 py-2 md:py-2.5 font-bold self-start"
              title="The results may be inaccurate, please check the moderation results before taking any action."
            >
              <Icon icon="mingcute:ai-fill" fontSize={16} />
              <p className="text-xs md:text-sm">AI-Moderation</p>
            </div>
          </div>

          {/* Search and Action Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="flex items-center justify-center w-full sm:max-w-52">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari komentar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 md:px-6 py-2.5 md:py-3 border rounded-full text-sm md:text-base transition-colors duration-300 ${
                    isDark
                      ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
                      : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"
                  }`}
                />
                <Icon
                  icon="material-symbols:search-rounded"
                  fontSize={20}
                  className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${
                    isDark ? "text-gray-400" : "text-black"
                  }`}
                />
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 rounded-full px-4 md:px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base whitespace-nowrap ${
                  showFilters
                    ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                    : isDark
                      ? "bg-gray-700 text-white border border-gray-600"
                      : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <Icon icon="mingcute:filter-2-fill" fontSize={16} />
                <span className="hidden sm:inline">Filter</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest" | "status")
                  }
                  className={`appearance-none rounded-full px-4 md:px-5 py-2.5 text-sm md:text-base cursor-pointer pr-8 ${
                    isDark
                      ? "bg-gray-700 text-white border border-gray-600"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="status">Status</option>
                </select>
                <Icon
                  icon="mingcute:down-fill"
                  fontSize={16}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Filter Panel - Conditionally shown */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full rounded-lg p-4 border ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <label
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status:
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as "all" | "published" | "waiting"
                    )
                  }
                  className={`rounded-lg px-3 py-2 text-sm border ${
                    isDark
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <option value="all">Semua Status</option>
                  <option value="published">Dipublikasikan</option>
                  <option value="waiting">Menunggu Moderasi</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFilterStatus("all");
                    setSortBy("newest");
                  }}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}{" "}
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
                  Memuat data komentar...
                </p>
              </div>
            </div>
          ) : commentsData.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <p
                  className={`text-lg mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {searchTerm
                    ? "Tidak ada komentar yang ditemukan"
                    : "Belum ada komentar"}
                </p>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {searchTerm
                    ? "Coba kata kunci yang berbeda"
                    : "Komentar akan muncul di sini"}
                </p>
              </div>
            </div>
          ) : (
            <CommentTable
              datas={commentsData}
              onApprove={handleApproveComment}
              onReject={handleRejectComment}
              onDelete={handleDeleteComment}
              onBulkDelete={handleBulkDeleteComments}
              selectedItems={selectedCommentIds}
              onSelectionChange={setSelectedCommentIds}
              pagination={pagination}
            />
          )}
        </div>
      </div>
    </>
  );
}
