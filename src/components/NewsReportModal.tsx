"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { useNewsInteractions } from "@/hooks/useNewsInteractions";

interface NewsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsId: number;
  newsTitle: string;
}

const NewsReportModal: React.FC<NewsReportModalProps> = ({
  isOpen,
  onClose,
  newsId,
  newsTitle,
}) => {
  const { isDark } = useDarkMode();
  const newsInteractions = useNewsInteractions();
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    { id: "spam", label: "Spam atau konten tidak relevan" },
    { id: "misinformation", label: "Informasi yang menyesatkan" },
    { id: "hate_speech", label: "Ujaran kebencian" },
    { id: "inappropriate", label: "Konten tidak pantas" },
    { id: "copyright", label: "Pelanggaran hak cipta" },
    { id: "violence", label: "Kekerasan atau konten berbahaya" },
    { id: "privacy", label: "Pelanggaran privasi" },
    { id: "other", label: "Lainnya" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) return;

    try {
      setIsSubmitting(true);
      await newsInteractions.reportNews(newsId, {
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset form after modal closes
        setTimeout(() => {
          setSubmitted(false);
          setSelectedReason("");
          setDescription("");
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    // Reset form
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason("");
      setDescription("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              // Success State
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full"
                >
                  <Icon
                    icon="material-symbols:check-circle"
                    className="w-8 h-8 text-green-600"
                  />
                </motion.div>
                <h3
                  className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>Laporan Terkirim</TranslatedText>
                </h3>
                <p
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <TranslatedText>
                    Terima kasih atas laporan Anda. Tim kami akan meninjau
                    konten ini segera.
                  </TranslatedText>
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div
                  className={`flex items-center justify-between p-4 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <h2
                    className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <TranslatedText>Laporkan Berita</TranslatedText>
                  </h2>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Icon icon="material-symbols:close" className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[calc(90vh-120px)] overflow-y-auto">
                  {/* News Info */}
                  <div
                    className={`p-3 rounded-lg mb-4 ${
                      isDark ? "bg-gray-700" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      <TranslatedText>Berita yang dilaporkan:</TranslatedText>
                    </p>
                    <p
                      className={`text-sm mt-1 ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {newsTitle.length > 80
                        ? `${newsTitle.substring(0, 80)}...`
                        : newsTitle}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Reason Selection */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <TranslatedText>Pilih alasan laporan:</TranslatedText>
                      </label>
                      <div className="space-y-2">
                        {reportReasons.map((reason) => (
                          <label
                            key={reason.id}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedReason === reason.id
                                ? isDark
                                  ? "bg-blue-900/50 border-blue-500"
                                  : "bg-blue-50 border-blue-500"
                                : isDark
                                  ? "hover:bg-gray-700 border-gray-600"
                                  : "hover:bg-gray-50 border-gray-200"
                            } border`}
                          >
                            <input
                              type="radio"
                              name="reason"
                              value={reason.id}
                              checked={selectedReason === reason.id}
                              onChange={(e) =>
                                setSelectedReason(e.target.value)
                              }
                              className="sr-only"
                            />
                            <div
                              className={`flex-shrink-0 w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                selectedReason === reason.id
                                  ? "border-blue-500 bg-blue-500"
                                  : isDark
                                    ? "border-gray-500"
                                    : "border-gray-300"
                              }`}
                            >
                              {selectedReason === reason.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              <TranslatedText>{reason.label}</TranslatedText>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <TranslatedText>
                          Deskripsi tambahan (opsional):
                        </TranslatedText>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        maxLength={500}
                        placeholder="Jelaskan lebih detail tentang masalah yang Anda laporkan..."
                        className={`w-full px-3 py-2 rounded-lg border resize-none text-sm ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                        } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      />
                      <p
                        className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {description.length}/500 karakter
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                          isDark
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <TranslatedText>Batal</TranslatedText>
                      </button>
                      <button
                        type="submit"
                        disabled={!selectedReason || isSubmitting}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                          !selectedReason || isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            <TranslatedText>Mengirim...</TranslatedText>
                          </div>
                        ) : (
                          <TranslatedText>Kirim Laporan</TranslatedText>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsReportModal;
