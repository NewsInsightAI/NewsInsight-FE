"use client";

import { useDarkMode } from "@/context/DarkModeContext";

export default function ScrollbarStyles() {
  const { isDark } = useDarkMode();
  const scrollbarStyle = `
    ::-webkit-scrollbar {
      width: 8px;
      background-color: ${isDark ? "#374151" : "#F3F4F6"};
      border-radius: 6px;
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: ${isDark ? "#6B7280" : "#9CA3AF"};
      border-radius: 6px;
      border: 1px solid ${isDark ? "#4B5563" : "#E5E7EB"};
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: ${isDark ? "#9CA3AF" : "#6B7280"};
    }

    ::-webkit-scrollbar-track {
      background-color: ${isDark ? "#1F2937" : "#FFFFFF"};
      border-radius: 6px;
    }

    /* Firefox scrollbar styling */
    * {
      scrollbar-width: thin;
      scrollbar-color: ${isDark ? "#6B7280 #374151" : "#9CA3AF #F3F4F6"};
    }
  `;

  return <style>{scrollbarStyle}</style>;
}
