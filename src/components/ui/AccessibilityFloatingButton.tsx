"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";
import { useFontAccessibility } from "@/context/FontAccessibilityContext";

export default function AccessibilityFloatingButton() {
  const { isDark } = useDarkMode();
  const {
    isOpenDyslexicEnabled,
    toggleOpenDyslexic,
    isHighContrastEnabled,
    toggleHighContrast,
    isLoading,
  } = useFontAccessibility();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Backdrop untuk menutup menu ketika diklik di luar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30"
            onClick={() => setIsMenuOpen(false)}
            style={{ zIndex: -1 }}
          />
        )}
      </AnimatePresence>

      {/* Menu Accessibility */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`absolute bottom-16 right-0 w-72 md:w-80 p-4 rounded-2xl shadow-2xl border ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            } max-w-[calc(100vw-2rem)]`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:accessibility-new"
                  className="text-xl text-blue-500"
                />
                <h3
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Aksesibilitas
                </h3>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className={`p-1 rounded-full transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100 text-gray-500"
                }`}
              >
                <Icon icon="mdi:close" className="text-lg" />
              </button>
            </div>

            {/* OpenDyslexic Toggle */}
            <div className="space-y-3">
              <div
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isDark ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      isOpenDyslexicEnabled
                        ? "bg-blue-500 text-white"
                        : isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon icon="mdi:format-font" className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Font Disleksia
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      OpenDyslexic untuk kemudahan membaca
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                ) : (
                  <button
                    onClick={toggleOpenDyslexic}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-3 ${
                      isOpenDyslexicEnabled
                        ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2]"
                        : isDark
                          ? "bg-gray-600"
                          : "bg-gray-300"
                    } ${isDark ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
                    aria-label={`${isOpenDyslexicEnabled ? "Nonaktifkan" : "Aktifkan"} font OpenDyslexic`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        isOpenDyslexicEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* High Contrast Toggle */}
              <div
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                  isDark ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      isHighContrastEnabled
                        ? "bg-yellow-500 text-black"
                        : isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon icon="mdi:contrast" className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      Mode Kontras Tinggi
                    </p>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Meningkatkan kontras untuk visibilitas lebih baik
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ml-3 ${
                    isHighContrastEnabled
                      ? "bg-yellow-500"
                      : isDark
                        ? "bg-gray-600"
                        : "bg-gray-300"
                  } ${isDark ? "focus:ring-offset-gray-800" : "focus:ring-offset-white"}`}
                  aria-label={`${isHighContrastEnabled ? "Nonaktifkan" : "Aktifkan"} mode kontras tinggi`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ${
                      isHighContrastEnabled
                        ? "translate-x-6 bg-black"
                        : "translate-x-1 bg-white"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer Info */}
            <div
              className={`mt-4 pt-3 border-t ${isDark ? "border-gray-600" : "border-gray-200"}`}
            >
              <p
                className={`text-xs text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Pengaturan disimpan di perangkat & akun (jika login)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl transition-all duration-300 ${
          isMenuOpen
            ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] text-white rotate-180 shadow-blue-500/30"
            : isDark
              ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] text-white hover:shadow-blue-500/40 shadow-blue-500/20"
              : "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] text-white hover:shadow-blue-500/40 shadow-blue-500/20"
        }`}
        aria-label="Menu Aksesibilitas"
      >
        <Icon
          icon={isMenuOpen ? "mdi:close" : "material-symbols:accessibility-new"}
          className="text-xl md:text-2xl drop-shadow-sm"
        />
      </motion.button>

      {/* Badge notifikasi jika ada fitur aksesibilitas yang aktif */}
      {(isOpenDyslexicEnabled || isHighContrastEnabled) && !isMenuOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute -top-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white ${
            isHighContrastEnabled ? "bg-yellow-500" : "bg-green-500"
          }`}
        />
      )}
    </div>
  );
}
