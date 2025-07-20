/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import NewsCard from "@/components/NewsCard";
import { NewsItem } from "@/utils/listNews";
import { Vibrant } from "node-vibrant/browser";
import { Icon } from "@iconify/react/dist/iconify.js";
import CompactNewsCard from "@/components/CompactNewsCard";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";
import { useRouter } from "next/navigation";
import { generateNewsUrl } from "@/utils/newsUrlGenerator";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { motion } from "framer-motion";

interface ApiNewsItem {
  id: string;
  hashed_id: string;
  title: string;
  featured_image: string;
  published_at: string;
  created_at: string;
  category_name: string;
  authors?: { author_name: string }[];
}

export default function Home() {
  const { isDark } = useDarkMode();
  const router = useRouter();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [newsByCategory, setNewsByCategory] = useState<{
    [key: string]: NewsItem[];
  }>({});
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [sidebarSpacing, setSidebarSpacing] = useState("20px");

  // State untuk berita real dari database
  const [mainNews, setMainNews] = useState<NewsItem | null>(null);
  const [recommendedNews, setRecommendedNews] = useState<NewsItem[]>([]);
  const [newsFeedData, setNewsFeedData] = useState<NewsItem[]>([]);
  const [loadingMainNews, setLoadingMainNews] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [loadingNewsFeed, setLoadingNewsFeed] = useState(true);

  // Mapping dari news_interest user ke kategori yang sesuai
  const interestToCategoryMap = useMemo(
    () => ({
      teknologi: { slug: "teknologi", label: "Teknologi" },
      pendidikan: { slug: "pendidikan", label: "Pendidikan" },
      politik: { slug: "politik", label: "Politik" },
      "ekonomi-bisnis": { slug: "ekonomi", label: "Ekonomi & Bisnis" },
      "sains-kesehatan": { slug: "kesehatan", label: "Sains & Kesehatan" },
      "gaya-hidup": { slug: "lifestyle", label: "Gaya Hidup" },
      olahraga: { slug: "olahraga", label: "Olahraga" },
      hiburan: { slug: "hiburan", label: "Hiburan" },
      internasional: { slug: "internasional", label: "Internasional" },
    }),
    []
  );

  // Fetch profile user untuk mendapatkan minat berita
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/profile/me");

        if (response.ok) {
          const data = await response.json();
          const interests = data.data?.news_interest || [];

          // Fallback to default interests if empty (same as Profile component)
          const finalInterests =
            interests.length > 0 ? interests : ["teknologi"];

          setUserInterests(finalInterests);

          // Fetch news untuk setiap kategori minat user
          const newsData: { [key: string]: NewsItem[] } = {};

          for (const interest of finalInterests) {
            // Tampilkan semua minat user
            const categoryInfo =
              interestToCategoryMap[
                interest as keyof typeof interestToCategoryMap
              ];

            if (categoryInfo) {
              try {
                const newsResponse = await fetch(
                  `/api/news/category/${categoryInfo.slug}?limit=8&public=true`
                );

                if (newsResponse.ok) {
                  const newsResult = await newsResponse.json();

                  // Transform API data ke format NewsItem
                  const transformedNews = (newsResult.data?.news || []).map(
                    (news: ApiNewsItem) => ({
                      id: news.hashed_id || news.id,
                      source: news.authors?.[0]?.author_name || "NewsInsight",
                      title: news.title,
                      imageUrl: news.featured_image || "/images/main_news.png",
                      timestamp: news.published_at || news.created_at,
                      category: news.category_name || categoryInfo.label,
                      link: generateNewsUrl(
                        news.category_name || categoryInfo.label,
                        news.title,
                        news.published_at || news.created_at,
                        news.hashed_id || news.id
                      ),
                    })
                  );

                  newsData[interest] = transformedNews;
                } else {
                  newsData[interest] = []; // Tetap simpan array kosong
                }
              } catch (error) {
                console.error(`Error fetching news for ${interest}:`, error);
                newsData[interest] = [];
              }
            }
          }

          setNewsByCategory(newsData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback ke kategori default jika gagal fetch profile
        setUserInterests(["teknologi", "politik", "olahraga"]);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [interestToCategoryMap]);

  // Fetch main news (hero section)
  useEffect(() => {
    const fetchMainNews = async () => {
      try {
        const response = await fetch(
          "/api/news?limit=1&sort=latest&public=true"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.news && data.data.news.length > 0) {
            const newsItem = data.data.news[0];
            const transformedNews: NewsItem = {
              id: newsItem.hashed_id || newsItem.id,
              source: newsItem.authors?.[0]?.author_name || "NewsInsight",
              title: newsItem.title,
              imageUrl: newsItem.featured_image || "/images/main_news.png",
              timestamp: newsItem.published_at || newsItem.created_at,
              category: newsItem.category_name || "Berita",
              link: generateNewsUrl(
                newsItem.category_name || "Berita",
                newsItem.title,
                newsItem.published_at || newsItem.created_at,
                newsItem.hashed_id || newsItem.id
              ),
            };
            setMainNews(transformedNews);
          }
        }
      } catch (error) {
        console.error("Error fetching main news:", error);
      } finally {
        setLoadingMainNews(false);
      }
    };

    fetchMainNews();
  }, []);

  // Fetch recommended news
  useEffect(() => {
    const fetchRecommendedNews = async () => {
      try {
        const response = await fetch(
          "/api/news?limit=10&sort=trending&public=true"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.news) {
            const transformedNews = data.data.news.map((news: ApiNewsItem) => ({
              id: news.hashed_id || news.id,
              source: news.authors?.[0]?.author_name || "NewsInsight",
              title: news.title,
              imageUrl: news.featured_image || "/images/main_news.png",
              timestamp: news.published_at || news.created_at,
              category: news.category_name || "Berita",
              link: generateNewsUrl(
                news.category_name || "Berita",
                news.title,
                news.published_at || news.created_at,
                news.hashed_id || news.id
              ),
            }));
            setRecommendedNews(transformedNews);
          }
        }
      } catch (error) {
        console.error("Error fetching recommended news:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedNews();
  }, []);

  // Fetch news feed data
  useEffect(() => {
    const fetchNewsFeed = async () => {
      try {
        const response = await fetch(
          "/api/news?limit=12&sort=latest&public=true"
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.news) {
            const transformedNews = data.data.news.map((news: ApiNewsItem) => ({
              id: news.hashed_id || news.id,
              source: news.authors?.[0]?.author_name || "NewsInsight",
              title: news.title,
              imageUrl: news.featured_image || "/images/main_news.png",
              timestamp: news.published_at || news.created_at,
              category: news.category_name || "Berita",
              link: generateNewsUrl(
                news.category_name || "Berita",
                news.title,
                news.published_at || news.created_at,
                news.hashed_id || news.id
              ),
            }));
            setNewsFeedData(transformedNews);
          }
        }
      } catch (error) {
        console.error("Error fetching news feed:", error);
      } finally {
        setLoadingNewsFeed(false);
      }
    };

    fetchNewsFeed();
  }, []);

  // Fallback main news jika belum ada data
  const fallbackMainNews = {
    id: "main-news-001",
    category: "Teknologi",
    source: "Reuters",
    timestamp: "2025-04-28T00:00:00Z",
    title:
      "Penghargaan Teknologi Ban Internasional untuk Inovasi dan Keunggulan 2025 - pemenangnya diumumkan!",
    imageUrl: "/images/main_news.png",
    link: "#",
  };

  const currentMainNews = mainNews || fallbackMainNews;

  const newsCategory = currentMainNews.category;
  const newsAuthor = currentMainNews.source;
  const newsPublishDate = formatRelativeTime(currentMainNews.timestamp);
  const newsTitle = currentMainNews.title;
  const mainNewsUrl = currentMainNews.link;

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

  // Listen for search expansion events
  useEffect(() => {
    const updateSidebarSpacing = () => {
      const isDesktop = window.innerWidth >= 768;
      const basePadding = isDesktop ? 48 : 24; // md:px-12 vs px-6
      const sidebarWidth = 384; // w-96 = 384px

      setSidebarSpacing(
        isSearchExpanded
          ? `${sidebarWidth + basePadding}px`
          : `${basePadding}px`
      );
    };

    const handleSearchExpand = () => {
      setIsSearchExpanded(true);
      updateSidebarSpacing();
    };
    const handleSearchCollapse = () => {
      setIsSearchExpanded(false);
      updateSidebarSpacing();
    };

    const handleResize = () => {
      updateSidebarSpacing();
    };

    // Initial calculation
    updateSidebarSpacing();

    window.addEventListener("search-expanded", handleSearchExpand);
    window.addEventListener("search-collapsed", handleSearchCollapse);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("search-expanded", handleSearchExpand);
      window.removeEventListener("search-collapsed", handleSearchCollapse);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSearchExpanded]);

  const [gradient, setGradient] = useState(
    "linear-gradient(to top, transparent, transparent)"
  );
  const [vibrantColor, setVibrantColor] = useState<string>("#6B7280");

  const [newsImage] = useState<string | null>(currentMainNews.imageUrl);

  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = currentMainNews.imageUrl;

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRefTech = useRef<HTMLDivElement>(null);

  // Individual refs for each interest section
  const scrollRefTeknologi = useRef<HTMLDivElement>(null);
  const scrollRefPendidikan = useRef<HTMLDivElement>(null);
  const scrollRefPolitik = useRef<HTMLDivElement>(null);
  const scrollRefEkonomi = useRef<HTMLDivElement>(null);
  const scrollRefKesehatan = useRef<HTMLDivElement>(null);
  const scrollRefGayaHidup = useRef<HTMLDivElement>(null);
  const scrollRefOlahraga = useRef<HTMLDivElement>(null);
  const scrollRefHiburan = useRef<HTMLDivElement>(null);
  const scrollRefInternasional = useRef<HTMLDivElement>(null);

  const getScrollRef = (interest: string) => {
    switch (interest) {
      case "teknologi":
        return scrollRefTeknologi;
      case "pendidikan":
        return scrollRefPendidikan;
      case "politik":
        return scrollRefPolitik;
      case "ekonomi-bisnis":
        return scrollRefEkonomi;
      case "sains-kesehatan":
        return scrollRefKesehatan;
      case "gaya-hidup":
        return scrollRefGayaHidup;
      case "olahraga":
        return scrollRefOlahraga;
      case "hiburan":
        return scrollRefHiburan;
      case "internasional":
        return scrollRefInternasional;
      default:
        return scrollRef;
    }
  };

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
    <motion.div
      className={`${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"} min-h-screen w-full pl-6`}
      style={{
        paddingTop: navbarHeight + 24,
      }}
      animate={{
        paddingRight: sidebarSpacing,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      }}
    >
      <div className="w-full mx-auto">
        {" "}
        {/* Hero Section */}
        {loadingMainNews ? (
          // Loading skeleton untuk hero section
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[550px] rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="absolute inset-0 flex flex-col items-end justify-between p-4 sm:p-6 lg:p-8">
              <div className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="w-48 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : (
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
                    setGradient(
                      `linear-gradient(to top, ${hex}CC, transparent)`
                    );
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
        )}
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
            {loadingRecommended ? (
              // Loading skeleton untuk recommended news
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="w-72 sm:w-80 lg:w-96 flex-shrink-0"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 animate-pulse"></div>
                </div>
              ))
            ) : recommendedNews.length > 0 ? (
              recommendedNews.map((news, index) => (
                <div
                  key={news.id || index}
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
              ))
            ) : (
              // Fallback jika tidak ada data
              <div className="flex items-center justify-center w-full py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  <TranslatedText>Tidak ada berita tersedia</TranslatedText>
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Dynamic User Interest Sections */}
        {!loadingProfile && userInterests.length > 0 && (
          <>
            {userInterests.map((interest) => {
              const categoryInfo =
                interestToCategoryMap[
                  interest as keyof typeof interestToCategoryMap
                ];

              if (!categoryInfo || !newsByCategory[interest]?.length) {
                return null; // Skip jika tidak ada mapping kategori atau tidak ada berita
              }

              const currentScrollRef = getScrollRef(interest);

              return (
                <div key={interest} className="w-full pt-4 sm:pt-6">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <p
                      className={`font-semibold text-lg sm:text-xl lg:text-[22px] ${isDark ? "text-white" : ""}`}
                      style={{
                        textShadow: isDark
                          ? `0 0 10px ${vibrantColor}80`
                          : undefined,
                      }}
                    >
                      <TranslatedText>{categoryInfo.label}</TranslatedText>
                    </p>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => scroll("left", currentScrollRef.current)}
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
                        onClick={() =>
                          scroll("right", currentScrollRef.current)
                        }
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
                  </div>
                  <div
                    ref={currentScrollRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
                  >
                    {newsByCategory[interest].map((news, index) => (
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
              );
            })}
          </>
        )}
        {/* Fallback Teknologi Section untuk user yang belum login atau belum ada minat */}
        {(loadingProfile || userInterests.length === 0) && (
          <div className="w-full pt-4 sm:pt-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <p
                className={`font-semibold text-lg sm:text-xl lg:text-[22px] ${isDark ? "text-white" : ""}`}
                style={{
                  textShadow: isDark ? `0 0 10px ${vibrantColor}80` : undefined,
                }}
              >
                <TranslatedText>Teknologi</TranslatedText>
              </p>
              <div className="flex gap-1 sm:gap-2">
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
            </div>
            <div
              ref={scrollRefTech}
              className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
            >
              {loadingRecommended ? (
                // Loading skeleton untuk teknologi section
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={`tech-skeleton-${index}`}
                    className="w-72 sm:w-80 lg:w-96 flex-shrink-0"
                  >
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48 animate-pulse"></div>
                  </div>
                ))
              ) : recommendedNews.length > 0 ? (
                recommendedNews
                  .filter((news) =>
                    news.category.toLowerCase().includes("teknologi")
                  )
                  .slice(0, 8)
                  .map((news, index) => (
                    <div
                      key={news.id || index}
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
                  ))
              ) : (
                // Fallback jika tidak ada data teknologi
                <div className="flex items-center justify-center w-full py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    <TranslatedText>
                      Tidak ada berita teknologi tersedia
                    </TranslatedText>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
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
            {loadingNewsFeed ? (
              // Loading skeleton untuk news feed
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`newsfeed-skeleton-${index}`} className="w-full">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-40 animate-pulse"></div>
                </div>
              ))
            ) : newsFeedData.length > 0 ? (
              newsFeedData.slice(0, 8).map((news, index) => (
                <div key={news.id || index} className="w-full cursor-pointer">
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
              ))
            ) : (
              // Fallback jika tidak ada data
              <div className="col-span-full flex items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  <TranslatedText>Tidak ada berita tersedia</TranslatedText>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
