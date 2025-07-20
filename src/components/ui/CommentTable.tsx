"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { AnimatePresence, motion } from "framer-motion";
import CommentForm from "@/components/popup/AddEditComment";
import ConfirmationModal from "./ConfirmationModal";

interface CommentData {
  id: number;
  reader: {
    id: number;
    name: string;
  };
  comment: {
    id: number;
    content: string;
  };
  news: {
    id: number;
    title: string;
  };
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

interface CommentTableProps {
  datas: CommentData[];
  onApprove?: (commentId: number) => void;
  onReject?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  onBulkDelete?: (commentIds: number[]) => void;
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export default function CommentTable({
  datas,
  onApprove,
  onReject,
  onDelete,
  onBulkDelete,
  loading,
  pagination,
}: CommentTableProps) {
  const { isDark } = useDarkMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<CommentData | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === datas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(datas.map((item) => item.id.toString()));
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] text-xs md:text-sm font-medium w-fit">
            <Icon
              icon="ic:round-check-circle"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Aktif</span>
          </span>
        );
      case "waiting":
        return (
          <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15] text-xs md:text-sm font-medium w-fit">
            <Icon
              icon="mingcute:time-fill"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Menunggu</span>
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-[#EF4444] bg-[#EF4444]/15 text-[#EF4444] text-xs md:text-sm font-medium w-fit">
            <Icon
              icon="icon-park-solid:close-one"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-gray-400 bg-gray-200/30 text-gray-500 text-xs md:text-sm font-medium w-fit">
            <Icon
              icon="ic:round-remove-circle"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Tidak Aktif</span>
          </span>
        );
    }
  };

  const getCommentTypeBadge = (comment: CommentData) => {
    if (comment.parentId) {
      return (
        <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6] text-xs md:text-sm font-medium w-fit">
          <Icon
            icon="material-symbols:reply"
            className="w-3 h-3 md:w-4 md:h-4"
          />
          <span className="hidden sm:inline md:inline">Balasan</span>
        </span>
      );
    } else {
      return (
        <span className="flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-full border border-[#0EA5E9] bg-[#0EA5E9]/15 text-[#0EA5E9] text-xs md:text-sm font-medium w-fit">
          <Icon
            icon="material-symbols:comment"
            className="w-3 h-3 md:w-4 md:h-4"
          />
          <span className="hidden sm:inline md:inline">Induk</span>
        </span>
      );
    }
  };

  const getEngagementStats = (comment: CommentData) => {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:thumb-up"
              className="w-3 h-3 text-green-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {comment.likes || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:thumb-down"
              className="w-3 h-3 text-red-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {comment.dislikes || 0}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="material-symbols:flag-outline"
              className="w-3 h-3 text-orange-500"
            />
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {comment.reports || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteComment = (comment: CommentData) => {
    setCommentToDelete(comment);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteComment = async () => {
    if (!commentToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(commentToDelete.id);
      }
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
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
        const commentIds = selectedItems.map((id) => parseInt(id));
        await onBulkDelete(commentIds);
      }
      setSelectedItems([]);
      setShowBulkDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting comments:", error);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteComment}
        title="Hapus Komentar"
        message={
          commentToDelete ? (
            <p>
              Apakah Anda yakin ingin menghapus komentar dari &quot;
              {commentToDelete.reader.name}&quot;? Tindakan ini tidak dapat
              dibatalkan.
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
        title="Hapus Komentar Terpilih"
        message={
          <p>
            Apakah Anda yakin ingin menghapus {selectedItems.length} komentar
            yang dipilih? Tindakan ini tidak dapat dibatalkan.
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
                  {selectedItems.length} komentar dipilih
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedItems([])}
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
            icon="fluent:comment-28-regular"
            className="w-16 h-16 text-gray-400 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tidak ada komentar ditemukan
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Belum ada komentar yang tersedia dalam sistem
          </p>
        </div>
      )}

      <AnimatePresence>
        {showAddComment && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <CommentForm
                mode="edit"
                initialReaderName={selectedComment?.reader.name || ""}
                initialNewsTitle={selectedComment?.news.title || ""}
                initialComment={selectedComment?.comment.content || ""}
                initialDateTime={
                  selectedComment?.dateTime || new Date().toISOString()
                }
                onSubmit={(data) => {
                  console.log(data);
                  setShowAddComment(false);
                }}
                onClose={() => setShowAddComment(false)}
              />
            </motion.div>
          </div>
        )}{" "}
      </AnimatePresence>
      {/* Desktop Table View - Hidden on mobile */}
      <div
        className={`hidden md:block w-full overflow-x-auto rounded-xl transition-colors duration-300 border ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <table
          className={`w-full min-w-full rounded-xl overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}
        >
          <thead>
            <tr
              className={`border-b transition-colors duration-300 rounded-t-xl overflow-hidden ${
                isDark
                  ? "bg-blue-600/20 border-gray-600"
                  : "bg-[#367AF2]/12 border-gray-200"
              }`}
            >
              <th className="py-2 md:py-3 px-2 md:px-4 w-12">
                <div className="flex items-center justify-center">
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
                      className="absolute text-white h-3 w-3 pointer-events-none"
                    />
                  )}
                </div>
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[60px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                No
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Nama Pembaca
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Isi Komentar
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Tipe
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Engagement
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Judul Berita
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Tanggal & Waktu
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                  isDark ? "text-gray-300" : "text-black"
                }`}
              >
                Status
              </th>
              <th
                className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
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
                <td className="py-2 md:py-4 px-2 md:px-4 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                      checked={selectedItems.includes(report.id.toString())}
                      onChange={() => toggleSelectItem(report.id.toString())}
                    />
                    {selectedItems.includes(report.id.toString()) && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-3 w-3 pointer-events-none"
                      />
                    )}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {((pagination?.currentPage || 1) - 1) *
                    (pagination?.itemsPerPage || 10) +
                    index +
                    1}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {report.reader.name}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  <div
                    className="max-w-xs truncate"
                    title={report.comment.content}
                  >
                    {report.comment.content}
                  </div>
                  {report.parentId && report.parentComment && (
                    <div className="mt-1 text-xs text-gray-500 italic">
                      Membalas: &quot;
                      {report.parentComment.content.substring(0, 30)}...&quot;
                    </div>
                  )}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getCommentTypeBadge(report)}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getEngagementStats(report)}
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  <div className="max-w-xs truncate" title={report.news.title}>
                    {report.news.title}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  <div className="text-xs md:text-sm">
                    {getDateTimeWithTimezone(report.dateTime)}
                  </div>
                </td>
                <td
                  className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                    isDark ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {getStatusBadge(report.status)}
                </td>
                <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm">
                  <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                    {/* Moderation buttons for waiting status */}
                    {report.status === "waiting" && (
                      <>
                        <button
                          className="border bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
                          onClick={() => onApprove?.(report.id)}
                        >
                          <Icon
                            icon="ic:round-check-circle"
                            className="inline mr-1"
                            width={12}
                            height={12}
                          />
                          <span className="hidden md:inline">Setuju</span>
                        </button>
                        <button
                          className="border bg-[#FACC15]/15 border-[#FACC15] text-[#FACC15] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
                          onClick={() => onReject?.(report.id)}
                        >
                          <Icon
                            icon="icon-park-solid:close-one"
                            className="inline mr-1"
                            width={12}
                            height={12}
                          />
                          <span className="hidden md:inline">Tolak</span>
                        </button>
                      </>
                    )}
                    {/* Standard edit button - always available */}
                    <button
                      className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15 whitespace-nowrap"
                      onClick={() => {
                        setSelectedComment(report);
                        setShowAddComment(true);
                      }}
                    >
                      <Icon
                        icon="mage:edit-fill"
                        className="inline mr-1"
                        width={12}
                        height={12}
                      />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                    {/* Delete button - always available */}
                    <button
                      className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
                      onClick={() => handleDeleteComment(report)}
                    >
                      <Icon
                        icon="mingcute:delete-fill"
                        className="inline mr-1"
                        width={12}
                        height={12}
                      />{" "}
                      <span className="hidden md:inline">Hapus</span>
                    </button>{" "}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {datas.map((comment, index) => (
          <div
            key={comment.id}
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
                  checked={selectedItems.includes(comment.id.toString())}
                  onChange={() => toggleSelectItem(comment.id.toString())}
                />
                {selectedItems.includes(comment.id.toString()) && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-2.5 w-2.5 pointer-events-none"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold text-base ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {comment.reader.name}
                  </h3>
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    #
                    {((pagination?.currentPage || 1) - 1) *
                      (pagination?.itemsPerPage || 10) +
                      index +
                      1}
                  </span>
                </div>
                <p
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {comment.news.title}
                </p>
              </div>
            </div>

            {/* Comment Content */}
            <div className="mb-3">
              <p
                className={`text-sm leading-5 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                &ldquo;{comment.comment.content}&rdquo;
              </p>
              {comment.parentId && comment.parentComment && (
                <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Membalas komentar dari {comment.parentComment.reader.name}:
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic mt-1">
                    &quot;{comment.parentComment.content.substring(0, 50)}
                    ...&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Tipe:
                </span>
                <div>{getCommentTypeBadge(comment)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Engagement:
                </span>
                <div>{getEngagementStats(comment)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Status:
                </span>
                <div>{getStatusBadge(comment.status)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Tanggal:
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}
                >
                  {new Date(comment.dateTime).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              {/* Moderation buttons for waiting status */}
              {comment.status === "waiting" && (
                <>
                  <button
                    className="flex-1 min-w-0 border bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                    onClick={() => onApprove?.(comment.id)}
                  >
                    <Icon icon="ic:round-check-circle" width={12} height={12} />
                    <span>Setuju</span>
                  </button>
                  <button
                    className="flex-1 min-w-0 border bg-[#FACC15]/15 border-[#FACC15] text-[#FACC15] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                    onClick={() => onReject?.(comment.id)}
                  >
                    <Icon
                      icon="icon-park-solid:close-one"
                      width={12}
                      height={12}
                    />
                    <span>Tolak</span>
                  </button>
                </>
              )}

              {/* Standard edit button - always available */}
              <button
                className="flex-1 min-w-0 border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowAddComment(true);
                }}
              >
                <Icon icon="mage:edit-fill" width={12} height={12} />
                <span>Edit</span>
              </button>

              {/* Delete button - always available */}
              <button
                className="flex-1 min-w-0 border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => handleDeleteComment(comment)}
              >
                <Icon icon="mingcute:delete-fill" width={12} height={12} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
