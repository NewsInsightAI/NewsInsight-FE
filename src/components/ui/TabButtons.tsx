"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { useProfileTab } from "@/context/ProfileTabContext";

interface TabButtonsProps {
  navbarHeight: number;
}

export default function TabButtons({ navbarHeight }: TabButtonsProps) {
  const { isDark } = useDarkMode();
  const { activeTab, setActiveTab } = useProfileTab();

  return (
    <div
      id="buttons"
      className={`flex flex-row items-center w-full gap-3 sm:gap-4 h-fit sticky py-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
      style={{ top: navbarHeight }}
    >
      <button
        onClick={() => setActiveTab("bookmarks")}
        className={`flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3 w-full rounded-xl font-medium transition-all duration-300 ${
          activeTab === "bookmarks"
            ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
            : isDark
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 lg:hover:bg-white/50 text-gray-700"
        }`}
      >
        <Icon icon="mingcute:bookmark-fill" fontSize={20} />
        <span className="text-sm sm:text-base">Tersimpan</span>
      </button>
      <button
        onClick={() => setActiveTab("history")}
        className={`flex items-center justify-center gap-2.5 px-4 sm:px-6 py-3 w-full rounded-xl cursor-pointer transition-all duration-300 ease-in-out font-medium ${
          activeTab === "history"
            ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
            : isDark
              ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
              : "bg-gray-100 hover:bg-gray-200 lg:hover:bg-white/50 text-gray-700"
        }`}
      >
        <Icon icon="iconamoon:history-duotone" fontSize={20} />
        <span className="text-sm sm:text-base">Riwayat</span>
      </button>
    </div>
  );
}
