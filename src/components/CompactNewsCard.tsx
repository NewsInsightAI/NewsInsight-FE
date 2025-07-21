/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { formatMetricNumber, getMetricIcon } from "@/utils/formatMetrics";
import { Icon } from "@iconify/react";

interface CompactNewsCard {
  id?: string;
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  category?: string;
  link: string;
  viewCount?: number;
  shareCount?: number;
}

export default function CompactNewsCard({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  source,
  title,
  imageUrl,
  timestamp,
  category,
  link,
  viewCount = 0,
  shareCount = 0,
}: CompactNewsCard) {
  const { isDark } = useDarkMode();
  const router = useRouter();

  const relativeTime = formatRelativeTime(timestamp);

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
              <TranslatedText>{category || "Berita"}</TranslatedText>
            </p>{" "}
            <div
              className={`h-1 w-1 ${isDark ? "bg-gray-500" : "bg-gray-400"} rounded-full`}
            />{" "}
            <p
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              <TranslatedText>{relativeTime}</TranslatedText>
            </p>
          </div>

          {/* Metrics Row - Compact version - Only show if there are metrics */}
          {(viewCount > 0 || shareCount > 0) && (
            <div className="flex items-center gap-2 mt-1">
              {viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Icon
                    icon={getMetricIcon("views")}
                    className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {formatMetricNumber(viewCount)}
                  </span>
                </div>
              )}
              {shareCount > 0 && (
                <div className="flex items-center gap-1">
                  <Icon
                    icon={getMetricIcon("shares")}
                    className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {formatMetricNumber(shareCount)}
                  </span>
                </div>
              )}
            </div>
          )}

          <p
            className={`${isDark ? "text-white" : "text-black"} font-medium text-sm sm:text-base line-clamp-2 sm:line-clamp-3 transition-colors duration-300 ${viewCount > 0 || shareCount > 0 ? "mt-2" : "mt-1"}`}
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
