"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { formatNewsCount } from "@/utils/formatters";

interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug?: string;
  featured_image?: string;
  status?: string;
  published_at: string;
  created_at?: string;
  updated_at?: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  view_count?: number;
  hashed_id?: string;
  created_by_email?: string;
  created_by_name?: string;
  authors?: Array<{ author_name: string; location?: string }>;
  tags?: string[];
}

interface ArticleCardProps {
  article: NewsItem;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { isDark } = useDarkMode();
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Format tanggal
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleClick = () => {
    router.push(`/news/${article.slug || article.id}`);
  };

  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  return (
    <article
      onClick={handleClick}
      className={`group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isDark
          ? "border-gray-700 bg-gray-800 hover:border-blue-500"
          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg"
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
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
              <Icon
                icon="material-symbols:image"
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-xs">Gambar gagal dimuat</p>
            </div>
          </div>
        ) : (
          <Image
            src={article.featured_image || "/images/main_news.png"}
            alt={article.title}
            width={400}
            height={200}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            style={{ opacity: imageLoading ? 0 : 1 }}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className={`text-lg font-semibold mb-2 line-clamp-2 ${
            isDark ? "text-white" : "text-gray-900"
          } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}
        >
          {article.title}
        </h3>

        <p
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mb-4 line-clamp-3`}
        >
          {article.excerpt || article.content}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span
              className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              <Icon icon="material-symbols:visibility" />
              {formatNewsCount(article.view_count || 0)}
            </span>
            {article.authors && article.authors.length > 0 && (
              <span
                className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                <Icon icon="material-symbols:person" />
                {article.authors[0].author_name}
              </span>
            )}
            {article.tags && article.tags.length > 0 && (
              <span
                className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
              >
                <Icon icon="material-symbols:tag" />
                {article.tags.length}
              </span>
            )}
          </div>
        </div>

        <div
          className={`mt-3 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              {formatDate(article.published_at)}
            </span>
            <span
              className={`text-xs font-medium ${
                isDark
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              } transition-colors`}
            >
              <TranslatedText>Baca Selengkapnya</TranslatedText>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
