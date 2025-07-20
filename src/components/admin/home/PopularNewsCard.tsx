"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

interface NewsItem {
  id: number;
  title: string;
  hashed_id: string;
  featured_image: string;
  category_name: string;
  view_count: number;
}

interface Props {
  newsList: NewsItem[];
  category: string[];
}

export default function PopularNewsCard({ newsList, category }: Props) {
  const { isDark } = useDarkMode();
  return (
    <div
      className={`flex flex-col w-full h-full gap-2.5 rounded-3xl p-4 md:p-6 lg:p-8 border transition-colors duration-300 min-h-[240px] md:min-h-[280px] lg:min-h-[380px] xl:min-h-[420px] ${
        isDark
          ? "bg-gradient-to-br from-[#2996b3] to-[#2555aa] border-gray-600"
          : "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] border-blue-300"
      }`}
    >
      {" "}
      <div className="flex items-center gap-2 text-white">
        <Icon icon="solar:graph-bold" className="text-3xl" />
        <p className="font-semibold text-xl">
          <TranslatedText>Berita Populer</TranslatedText>
        </p>
      </div>{" "}
      <div className="flex flex-col gap-3 flex-1 min-h-0 w-full">
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 w-full flex-1 min-h-[100px] scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
          {newsList.map((news, index) => (
            <div
              key={news.id || index}
              className="flex items-center justify-start gap-2 border border-white/30 rounded-xl p-2 text-white hover:bg-white/10 transition"
            >
              <p className="text-sm font-bold text-white/80 flex-shrink-0">
                #{index + 1}
              </p>
              <p className="text-xs">
                <TranslatedText>{news.title}</TranslatedText>
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-start items-start text-white w-full gap-2.5">
          {" "}
          <div className="flex items-center gap-2">
            <Icon icon="solar:hashtag-square-bold" className="text-3xl" />
            <p className="font-semibold text-xl">
              <TranslatedText>Kategori Populer</TranslatedText>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.map((tag, index) => (
              <span
                key={index}
                className="text-sm bg-white/20 text-white px-3 py-1 rounded-full border border-white/30 hover:bg-white/30 transition"
              >
                <TranslatedText>{tag}</TranslatedText>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
