"use client";
import NewsTable from "@/components/ui/NewsTable";
import { newsData } from "@/utils/newsData";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

export default function News() {
  const { isDark } = useDarkMode();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  return (
    <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
      {" "}
      {/* Header Section */}
      <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-3 lg:gap-0">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/news_rounded.svg"
            alt="news"
            width={28}
            height={28}
            className="w-6 h-6 md:w-7 md:h-7"
          />
          <p className="text-lg md:text-xl lg:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
            Daftar Berita
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="flex items-center justify-center w-full sm:max-w-60 lg:max-w-52">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari berita..."
                className={`w-full px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base border rounded-full transition-colors duration-300 ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
                    : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"
                }`}
              />
              <Icon
                icon="material-symbols:search-rounded"
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 ${
                  isDark ? "text-gray-400" : "text-black"
                }`}
              />
            </div>
          </div>

          {/* Add Button */}
          <Link
            href="/dashboard/news/add"
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-full md:rounded-3xl px-4 md:px-5 py-2.5 text-sm md:text-base hover:opacity-80 transition duration-300 ease-in-out cursor-pointer whitespace-nowrap"
          >
            <Icon icon="basil:add-solid" className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Tambah Berita</span>
            <span className="sm:hidden">Tambah</span>{" "}
          </Link>
        </div>
      </div>{" "}
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-auto w-full">
        <NewsTable
          datas={newsData.map((news) => ({
            ...news,
            author: [...news.author],
          }))}
        />
      </div>
    </div>
  );
}
