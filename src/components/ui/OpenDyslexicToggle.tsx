"use client";
import { Icon } from "@iconify/react";
import { useFontAccessibility } from "@/context/FontAccessibilityContext";
import { useDarkMode } from "@/context/DarkModeContext";

interface OpenDyslexicToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function OpenDyslexicToggle({
  className = "",
  showLabel = true,
}: OpenDyslexicToggleProps) {
  const { isOpenDyslexicEnabled, toggleOpenDyslexic, isLoading } =
    useFontAccessibility();
  const { isDark } = useDarkMode();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {showLabel && (
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Font untuk Disleksia
            </span>
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Memuat...
            </span>
          </div>
        )}
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      {showLabel && (
        <div className="flex flex-col">
          <span
            className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Font untuk Disleksia
          </span>
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Gunakan font OpenDyslexic untuk kemudahan membaca
          </span>
        </div>
      )}

      <button
        onClick={toggleOpenDyslexic}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isOpenDyslexicEnabled
            ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2]"
            : isDark
              ? "bg-gray-600"
              : "bg-gray-200"
        } ${isDark ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
        aria-label={`${isOpenDyslexicEnabled ? "Nonaktifkan" : "Aktifkan"} font OpenDyslexic`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isOpenDyslexicEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>

      {!showLabel && (
        <Icon
          icon="material-symbols:accessibility-new"
          className={`text-lg ${
            isOpenDyslexicEnabled
              ? "text-blue-500"
              : isDark
                ? "text-gray-400"
                : "text-gray-500"
          }`}
        />
      )}
    </div>
  );
}
