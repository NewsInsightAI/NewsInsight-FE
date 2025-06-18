/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatTimestamp } from "@/utils/formatTimestamp";

interface CompactNewsCard {
  id?: string;
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  category?: string;
  link: string;
}

export default function CompactNewsCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  source,
  title,
  imageUrl,
  timestamp,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  category,
  link,
}: CompactNewsCard) {
  const { isDark } = useDarkMode();
  const { currentLanguage } = useLanguage();
  const router = useRouter();

  const formattedTimestamp = formatTimestamp(timestamp, currentLanguage.code);

  return (
    <div onClick={() => router.push(link)} className="cursor-pointer w-full">
      <div
        className={`flex flex-col sm:flex-row gap-3 sm:gap-4 items-start rounded-xl sm:items-center justify-start w-full ${isDark ? "bg-gray-800" : "bg-white"} transition-colors duration-300`}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full sm:w-16 md:w-20 h-32 sm:h-16 md:h-20 object-cover rounded-xl flex-shrink-0"
        />
        <div className="flex flex-col gap-1 sm:gap-2 w-full min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm font-bold bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text">
              {source}
            </p>{" "}
            <div
              className={`h-1 w-1 ${isDark ? "bg-gray-500" : "bg-gray-400"} rounded-full`}
            />{" "}
            <p
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {formattedTimestamp}
            </p>
          </div>
          <p
            className={`${isDark ? "text-white" : "text-black"} font-medium text-sm sm:text-base line-clamp-2 sm:line-clamp-3 transition-colors duration-300`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <TranslatedText>{title}</TranslatedText>
          </p>
        </div>
      </div>
    </div>
  );
}
