/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { listNews } from "@/utils/listNews";
import { Vibrant } from "node-vibrant/browser";
import { Icon } from "@iconify/react/dist/iconify.js";
import CompactNewsCard from "@/components/CompactNewsCard";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/TranslatedText";
import { useRouter } from "next/navigation";
import { generateNewsUrl } from "@/utils/newsUrlGenerator";
import { formatTimestamp } from "@/utils/formatTimestamp";

export default function Home() {
  const { isDark } = useDarkMode();
  const { currentLanguage } = useLanguage();
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);

  const mainNews = {
    id: "main-news-001",
    category: "Teknologi",
    author: "Reuters",
    publishDate: "2025-04-28T00:00:00Z",
    title:
      "Penghargaan Teknologi Ban Internasional untuk Inovasi dan Keunggulan 2025 - pemenangnya diumumkan!",
  };

  const mainNewsUrl = generateNewsUrl(
    mainNews.category,
    mainNews.title,
    mainNews.publishDate,
    mainNews.id
  );

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [gradient, setGradient] = useState(
    "linear-gradient(to top, transparent, transparent)"
  );
  const [vibrantColor, setVibrantColor] = useState<string>("#6B7280");

  const [newsImage] = useState<string | null>("/images/main_news.png");

  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = "/images/main_news.png";

  useEffect(() => {
    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        const hex = palette.Vibrant?.hex ?? "#bbc57b";
        setVibrantColor(hex);
        setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
      })
      .catch(() => {
        setVibrantColor("#6B7280");
        setGradient("linear-gradient(to top, #6B7280CC, transparent)");
      });

    return () => {
      if (newsImage) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl, newsImage]);
  const newsCategory = mainNews.category;
  const newsAuthor = mainNews.author;

  const newsPublishDate = formatTimestamp(
    mainNews.publishDate,
    currentLanguage.code
  );
  const newsTitle = mainNews.title;

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefTech = useRef<HTMLDivElement>(null);

  const scroll = (
    direction: "left" | "right",
    scrollElement: HTMLDivElement | null
  ) => {
    if (scrollElement) {
      scrollElement.scrollBy({
        left: direction === "right" ? 300 : -300,
        behavior: "smooth",
      });
    }
  };
  return (
    <div
      className={`${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"} min-h-screen w-full px-3 sm:px-6 transition-colors duration-300`}
      style={{ paddingTop: navbarHeight + 24 }}
    >
      <div className="w-full mx-auto">
        {" "}
        {/* Hero Section */}
        <div
          className={`relative w-full h-[300px] sm:h-[400px] lg:h-[550px] rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer ${isDark ? "shadow-2xl news-glow-pulse" : ""}`}
          style={{
            boxShadow: isDark
              ? `0 25px 50px -12px ${vibrantColor}33`
              : undefined,
          }}
          onClick={() => router.push(mainNewsUrl)}
        >
          <img
            alt="Preview"
            src={imageUrl}
            ref={imgRef}
            onLoad={() => {
              Vibrant.from(imgRef.current as HTMLImageElement)
                .getPalette()
                .then((palette) => {
                  const hex = palette.Vibrant?.hex ?? "#bbc57b";
                  setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
                })
                .catch(() => {
                  setGradient(
                    "linear-gradient(to top, #6B7280CC, transparent)"
                  );
                });
            }}
            className="w-full h-full object-cover news-image-float group-hover:scale-105 transition-all duration-700 ease-out"
            crossOrigin="anonymous"
          />

          <div
            className="absolute inset-0 flex flex-col items-end justify-between p-4 sm:p-6 lg:p-8"
            style={{ background: gradient }}
          >
            <div className="flex w-full justify-end">
              {" "}
              <p
                className="text-xs sm:text-sm lg:text-base font-bold px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-white rounded-full"
                style={{ color: vibrantColor }}
              >
                <TranslatedText>
                  {newsCategory
                    ? newsCategory.charAt(0).toUpperCase() +
                      newsCategory.slice(1)
                    : "Kategori Berita"}
                </TranslatedText>
              </p>
            </div>

            <div className="flex flex-col gap-1 sm:gap-2 w-full">
              <p className="text-white text-xs sm:text-sm font-semibold">
                {newsAuthor || "Nama Penulis"} •{" "}
                <span className="font-normal">
                  {newsPublishDate || "Tanggal Publikasi"}
                </span>
              </p>
              <p className="text-white text-lg sm:text-2xl lg:text-[32px] font-semibold w-full sm:w-3/4 lg:w-1/2 leading-tight">
                <TranslatedText>{newsTitle || "Judul Berita"}</TranslatedText>
              </p>
            </div>
          </div>
        </div>
        {/* Rekomendasi untuk Anda */}
        <div className="w-full pt-4 sm:pt-6">
          {" "}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            {" "}
            <p
              className={`font-semibold text-lg sm:text-xl lg:text-[22px] ${isDark ? "text-white" : ""}`}
              style={{
                textShadow: isDark ? `0 0 10px ${vibrantColor}80` : undefined,
              }}
            >
              <TranslatedText>Rekomendasi untuk Anda</TranslatedText>
            </p>
            <div className="flex gap-1 sm:gap-2">
              {" "}
              <button
                onClick={() => scroll("left", scrollRef.current)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? "bg-gray-600/20 hover:bg-gray-600/60" : "bg-gray-500/15 hover:bg-gray-500/60"} hover:text-white cursor-pointer transition-all duration-300`}
                style={{
                  boxShadow: isDark
                    ? `0 4px 15px ${vibrantColor}33`
                    : undefined,
                }}
              >
                <Icon
                  icon="material-symbols:chevron-left"
                  fontSize={20}
                  className="sm:text-2xl"
                />
              </button>
              <button
                onClick={() => scroll("right", scrollRef.current)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? "bg-gray-600/20 hover:bg-gray-600/60" : "bg-gray-500/15 hover:bg-gray-500/60"} hover:text-white cursor-pointer transition-all duration-300`}
                style={{
                  boxShadow: isDark
                    ? `0 4px 15px ${vibrantColor}33`
                    : undefined,
                }}
              >
                <Icon
                  icon="material-symbols:chevron-right"
                  fontSize={20}
                  className="sm:text-2xl"
                />
              </button>
            </div>
          </div>{" "}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {listNews.map((news, index) => (
              <div
                key={index}
                className="w-72 sm:w-80 lg:w-96 flex-shrink-0 cursor-pointer"
              >
                <NewsCard
                  id={news.id}
                  source={news.source}
                  title={news.title}
                  imageUrl={news.imageUrl}
                  timestamp={news.timestamp}
                  category={news.category}
                  link={news.link}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Teknologi Section */}
        <div className="w-full pt-4 sm:pt-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            {" "}
            <p
              className={`font-semibold text-lg sm:text-xl lg:text-[22px] ${isDark ? "text-white" : ""}`}
              style={{
                textShadow: isDark ? `0 0 10px ${vibrantColor}80` : undefined,
              }}
            >
              <TranslatedText>Teknologi</TranslatedText>
            </p>
            <div className="flex gap-1 sm:gap-2">
              {" "}
              <button
                onClick={() => scroll("left", scrollRefTech.current)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? "bg-gray-600/20 hover:bg-gray-600/60" : "bg-gray-500/15 hover:bg-gray-500/60"} hover:text-white cursor-pointer transition-all duration-300`}
                style={{
                  boxShadow: isDark
                    ? `0 4px 15px ${vibrantColor}33`
                    : undefined,
                }}
              >
                <Icon
                  icon="material-symbols:chevron-left"
                  fontSize={20}
                  className="sm:text-2xl"
                />
              </button>
              <button
                onClick={() => scroll("right", scrollRefTech.current)}
                className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${isDark ? "bg-gray-600/20 hover:bg-gray-600/60" : "bg-gray-500/15 hover:bg-gray-500/60"} hover:text-white cursor-pointer transition-all duration-300`}
                style={{
                  boxShadow: isDark
                    ? `0 4px 15px ${vibrantColor}33`
                    : undefined,
                }}
              >
                <Icon
                  icon="material-symbols:chevron-right"
                  fontSize={20}
                  className="sm:text-2xl"
                />
              </button>
            </div>
          </div>{" "}
          <div
            ref={scrollRefTech}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {listNews.map((news, index) => (
              <div
                key={index}
                className="w-72 sm:w-80 lg:w-96 flex-shrink-0 cursor-pointer"
              >
                <NewsCard
                  id={news.id}
                  source={news.source}
                  title={news.title}
                  imageUrl={news.imageUrl}
                  timestamp={news.timestamp}
                  category={news.category}
                  link={news.link}
                />
              </div>
            ))}
          </div>
        </div>
        {/* News Feed */}
        <div className="flex flex-col w-full pt-4 sm:pt-6 pb-6">
          {" "}
          <p
            className={`font-semibold text-lg sm:text-xl lg:text-[22px] mb-3 sm:mb-4 ${isDark ? "text-white" : ""}`}
            style={{
              textShadow: isDark ? `0 0 10px ${vibrantColor}80` : undefined,
            }}
          >
            <TranslatedText>News Feed</TranslatedText>
          </p>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {listNews.slice(0, 8).map((news, index) => (
              <div key={index} className="w-full cursor-pointer">
                <CompactNewsCard
                  id={news.id}
                  source={news.source}
                  title={news.title}
                  imageUrl={news.imageUrl}
                  timestamp={news.timestamp}
                  category={news.category}
                  link={news.link}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
