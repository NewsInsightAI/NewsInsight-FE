"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { AnimatePresence, motion } from "framer-motion";
import CommentForm from "@/components/popup/AddEditComment";

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
}

interface CommentTableProps {
  datas: CommentData[];
}

export default function CommentTable({ datas }: CommentTableProps) {
  const { isDark } = useDarkMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentData | null>(
    null
  );

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
  const getStatusBadge = (level: string) => {
    switch (level) {
      case "published":
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="ic:round-publish"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Terpublikasi</span>
          </span>
        );
      case "waiting":
        return (
          <span className="bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="mingcute:time-fill"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Menunggu</span>
          </span>
        );
      case "rejected":
        return (
          <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444] px-2 md:px-3 py-1 md:py-2 rounded-full flex items-center justify-center w-fit text-xs md:text-sm">
            <Icon
              icon="icon-park-solid:close-one"
              className="w-3 h-3 md:w-4 md:h-4 mr-1"
            />
            <span className="hidden sm:inline md:inline">Ditolak</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showAddComment && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
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
        className={`hidden md:block rounded-xl w-full transition-colors duration-300 border ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        {/* Horizontal scroll wrapper for mobile */}
        <div className="w-full overflow-x-auto">
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
                <th className="py-2 md:py-3 px-2 md:px-4 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                      checked={
                        selectedItems.length === datas.length &&
                        datas.length > 0
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
                  Aksi{" "}
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
                    {index + 1}
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
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    <div
                      className="max-w-xs truncate"
                      title={report.news.title}
                    >
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
                      <button className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap">
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
              ))}{" "}
            </tbody>
          </table>
        </div>
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
                    #{index + 1}
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
              {" "}
              <p
                className={`text-sm leading-5 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                &ldquo;{comment.comment.content}&rdquo;
              </p>
            </div>

            {/* Card Content */}
            <div className="space-y-2">
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
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              {" "}
              <button
                className="flex-1 border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => {
                  setSelectedComment(comment);
                  setShowAddComment(true);
                }}
              >
                <Icon icon="mage:edit-fill" width={12} height={12} />
                <span>Edit</span>
              </button>
              <button className="flex-1 border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1">
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
