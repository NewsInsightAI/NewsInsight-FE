"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";

interface ToastProps {
  isVisible: boolean;
  message: string;
  type?: "success" | "loading" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const { isDark } = useDarkMode();

  React.useEffect(() => {
    if (isVisible && type !== "loading" && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "material-symbols:check-circle";
      case "loading":
        return "material-symbols:autorenew";
      case "error":
        return "material-symbols:error";
      default:
        return "material-symbols:info";
    }
  };

  const getColors = () => {
    const baseClasses = isDark
      ? "bg-gray-800 border border-gray-600 text-white"
      : "bg-white border border-gray-200 text-gray-900";

    switch (type) {
      case "success":
        return `${baseClasses} border-green-500`;
      case "loading":
        return `${baseClasses} border-blue-500`;
      case "error":
        return `${baseClasses} border-red-500`;
      default:
        return `${baseClasses} border-gray-300`;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] max-w-sm"
        >
          <div
            className={`rounded-lg p-4 shadow-lg backdrop-blur-sm ${getColors()}`}
          >
            <div className="flex items-center gap-3">
              <Icon
                icon={getIcon()}
                className={`w-5 h-5 flex-shrink-0 ${
                  type === "loading" ? "animate-spin" : ""
                } ${
                  type === "success"
                    ? "text-green-500"
                    : type === "error"
                      ? "text-red-500"
                      : type === "loading"
                        ? "text-blue-500"
                        : "text-gray-500"
                }`}
              />
              <span className="text-sm font-medium">{message}</span>
              {type !== "loading" && onClose && (
                <button
                  onClick={onClose}
                  className={`ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <Icon icon="material-symbols:close" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
