"use client";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";
import { ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  icon?: string;
  iconClass?: string;
  isLoading?: boolean;
  loadingText?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  confirmButtonClass = "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700",
  icon = "heroicons:exclamation-triangle",
  iconClass = "mx-auto h-12 w-12 text-red-500 mb-4 dark:text-red-400",
  isLoading = false,
  loadingText = "Memproses...",
}: ConfirmationModalProps) {
  const { isDark } = useDarkMode();

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 backdrop-blur-[1px] flex items-center justify-center transition-colors duration-300 ${
            isDark ? "bg-black/40" : "bg-black/30"
          }`}
        >
          <motion.div
            key="confirmation-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-6 mx-4 max-w-md w-full border transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-center">
              <Icon icon={icon} className={iconClass} />
              <h3
                className={`text-lg font-medium mb-2 transition-colors duration-300 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {title}
              </h3>
              <div
                className={`text-sm mb-6 transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {typeof message === "string" ? <p>{message}</p> : message}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg border transition-colors duration-300 ${
                    isDark
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`${confirmButtonClass} transition-all duration-300 disabled:cursor-not-allowed`}
                >
                  {isLoading ? loadingText : confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
