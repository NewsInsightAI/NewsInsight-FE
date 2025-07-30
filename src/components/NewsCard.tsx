import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { formatMetricNumber, getMetricIcon } from "@/utils/formatMetrics";
import { Icon } from "@iconify/react";

interface NewsCard {
  id?: string;
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  category?: string;
  link: string;
  viewCount?: number;
  shareCount?: number;
  commentCount?: number;
  showMetrics?: boolean; // Add prop to control metrics visibility
}

export default function NewsCard({
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
  commentCount = 0,
  showMetrics = false, // Default to false (hide metrics)
}: NewsCard) {
  const { isDark } = useDarkMode();
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const relativeTime = formatRelativeTime(timestamp);

  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  return (
    <div onClick={() => router.push(link)} className="cursor-pointer w-full">
      <div
        className={`flex flex-col items-start justify-start w-full ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-[#E1E1E1]"} rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-md`}
      >
        <div className="relative w-full h-36 sm:h-44 lg:h-48 overflow-hidden rounded-xl sm:rounded-2xl">
          {/* Loading skeleton */}
          {imageLoading && (
            <div
              className={`absolute inset-0 ${isDark ? "bg-gray-700" : "bg-gray-200"} animate-pulse flex items-center justify-center`}
            >
              <div
                className={`w-8 h-8 border-2 ${isDark ? "border-gray-600 border-t-gray-400" : "border-gray-300 border-t-gray-500"} rounded-full animate-spin`}
              ></div>
            </div>
          )}

          {/* Error fallback */}
          {imageError ? (
            <div
              className={`w-full h-full ${isDark ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center`}
            >
              <div
                className={`text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs">Gambar gagal dimuat</p>
              </div>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-opacity duration-300"
              style={{ opacity: imageLoading ? 0 : 1 }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              quality={75}
              placeholder="blur"
              blurDataURL={blurDataURL}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
          )}
        </div>
        <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-2 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm font-bold bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text">
              <TranslatedText>{category || "Berita"}</TranslatedText>
            </p>
            <div
              className={`h-1 w-1 ${isDark ? "bg-gray-500" : "bg-gray-400"} rounded-full`}
            />
            <p
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              <TranslatedText>{relativeTime}</TranslatedText>
            </p>
          </div>

          {/* Metrics Row - Only show if showMetrics is true */}
          {showMetrics && (
            <div className="flex items-center gap-3 mt-1">
              {/* View Count */}
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

              {/* Share Count */}
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

              {/* Comment Count */}
              <div className="hidden sm:flex items-center gap-1">
                <Icon
                  icon={getMetricIcon("comments")}
                  className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                />
                <span
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  {formatMetricNumber(commentCount)}
                </span>
              </div>
            </div>
          )}

          <p
            className={`${isDark ? "text-white" : "text-black"} font-medium text-sm sm:text-base leading-tight mt-2`}
          >
            <TranslatedText>{title}</TranslatedText>
          </p>
        </div>
      </div>
    </div>
  );
}
