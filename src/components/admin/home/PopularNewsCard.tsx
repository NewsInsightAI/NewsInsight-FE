"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";

interface Props {
  newsList: string[];
  category: string[];
}

export default function PopularNewsCard({ newsList, category }: Props) {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`col-span-4 flex flex-col flex-1 min-h-0 w-full gap-2.5 rounded-3xl p-7 border transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#2996b3] to-[#2555aa] border-gray-600"
          : "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] border-blue-300"
      }`}
    >
      <div className="flex items-center gap-2 text-white">
        <Icon icon="solar:graph-bold" className="text-3xl" />
        <p className="font-semibold text-xl">Berita Populer</p>
      </div>

      <div className="flex flex-col gap-5 flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 w-full flex-1 min-h-0 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
          {newsList.map((news, index) => (
            <div
              key={index}
              className="flex items-center justify-start gap-3 border border-white/30 rounded-2xl p-3 text-white hover:bg-white/10 transition"
            >
              <p className="text-base font-bold">#{index + 1}</p>
              <p className="text-sm">{news}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-start items-start text-white w-full gap-2.5">
          <div className="flex items-center gap-2">
            <Icon icon="solar:hashtag-square-bold" className="text-3xl" />
            <p className="font-semibold text-xl">Kategori Populer</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-white/20 text-white px-3 py-1 rounded-full border border-white/30 hover:bg-white/30 transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
