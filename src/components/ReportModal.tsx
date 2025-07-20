"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "./TranslatedText";
import { motion, AnimatePresence } from "framer-motion";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ReportModalProps) {
  const { isDark } = useDarkMode();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const predefinedReasons = [
    { id: "spam", label: "Spam" },
    { id: "inappropriate", label: "Konten tidak pantas" },
    { id: "hate_speech", label: "Ujaran kebencian" },
    { id: "misinformation", label: "Informasi palsu" },
    { id: "harassment", label: "Pelecehan atau intimidasi" },
    { id: "other", label: "Lainnya" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let reason = "";
    if (selectedReason === "other") {
      reason = customReason.trim();
    } else {
      const selectedOption = predefinedReasons.find(
        (r) => r.id === selectedReason
      );
      reason = selectedOption?.label || "";
    }

    if (!reason) {
      return;
    }

    onSubmit(reason);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason("");
      setCustomReason("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className={`relative w-full max-w-md mx-4 p-6 rounded-lg shadow-xl ${
              isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                <TranslatedText>Laporkan Komentar</TranslatedText>
              </h3>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className={`p-1 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-600"
                } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <Icon icon="material-symbols:close" className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <p
                  className={`text-sm mb-3 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <TranslatedText>
                    Mengapa Anda melaporkan komentar ini?
                  </TranslatedText>
                </p>

                {/* Predefined reasons */}
                <div className="space-y-2">
                  {predefinedReasons.map((reason) => (
                    <label
                      key={reason.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedReason === reason.id
                          ? isDark
                            ? "bg-blue-900/30 border-blue-500"
                            : "bg-blue-50 border-blue-500"
                          : isDark
                            ? "border-gray-600 hover:bg-gray-700"
                            : "border-gray-300 hover:bg-gray-50"
                      } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason.id}
                        checked={selectedReason === reason.id}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        disabled={isSubmitting}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-sm">
                        <TranslatedText>{reason.label}</TranslatedText>
                      </span>
                    </label>
                  ))}
                </div>

                {/* Custom reason input */}
                {selectedReason === "other" && (
                  <div className="mt-3">
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Jelaskan alasan Anda..."
                      disabled={isSubmitting}
                      className={`w-full p-3 rounded-lg border resize-none ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isSubmitting ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex justify-end mt-1">
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {customReason.length}/500
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-700"
                  } ${isSubmitting ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <TranslatedText>Batal</TranslatedText>
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !selectedReason ||
                    (selectedReason === "other" && !customReason.trim())
                  }
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                    isSubmitting ||
                    !selectedReason ||
                    (selectedReason === "other" && !customReason.trim())
                      ? isDark
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Icon icon="eos-icons:loading" className="w-4 h-4" />
                      <TranslatedText>Melaporkan...</TranslatedText>
                    </div>
                  ) : (
                    <TranslatedText>Laporkan</TranslatedText>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
