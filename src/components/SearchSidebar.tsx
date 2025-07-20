"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

interface SearchSidebarProps {
  isVisible: boolean;
  searchQuery?: string;
  searchResults?: SearchResult[];
  isSearching?: boolean;
  onSearchClick: (query: string) => void;
  isUserLoggedIn?: boolean; // Add this to know if user is logged in
}

interface SearchResult {
  id: string;
  hashed_id: string;
  title: string;
  featured_image: string;
  published_at: string;
  category_name: string;
  authors?: { author_name: string }[];
}

interface PopularNewsItem {
  id: number;
  title: string;
  hashed_id?: string;
  featured_image?: string;
  category_name?: string;
  authors?: { author_name: string }[];
}

interface TrendingSearchItem {
  search_query: string; // Changed from search_term to search_query
  search_count: number;
}

interface PopularTagItem {
  tag_name: string;
  usage_count: number;
}

interface SearchHistoryItem {
  search_query: string;
  search_count: number;
  last_searched_at: string;
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({
  isVisible,
  searchQuery = "",
  searchResults = [],
  isSearching = false,
  onSearchClick,
  isUserLoggedIn = false,
}) => {
  const { isDark } = useDarkMode();

  // State untuk data API
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [userSearchHistory, setUserSearchHistory] = useState<string[]>([]);
  const [popularNews, setPopularNews] = useState<PopularNewsItem[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingHistory(true);

        // Fetch trending searches (global)
        const trendingResponse = await fetch("/api/search/trending?limit=5");
        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          console.log("Trending searches data:", trendingData);
          setTrendingSearches(
            trendingData.data?.trendingSearches?.map(
              (item: TrendingSearchItem) => item.search_query
            ) || []
          );
        } else {
          console.error(
            "Failed to fetch trending searches:",
            trendingResponse.status
          );
        }

        // Fetch user's personal search history (if logged in)
        if (isUserLoggedIn) {
          try {
            const historyResponse = await fetch("/api/search/history?limit=5");
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              setUserSearchHistory(
                historyData.data?.searchHistory?.map(
                  (item: SearchHistoryItem) => item.search_query
                ) || []
              );
            }
          } catch (error) {
            console.error("Error fetching user search history:", error);
            // Use trending searches as fallback for history section
            setUserSearchHistory([]);
          }
        } else {
          // For non-logged users, show trending searches as "recent"
          setUserSearchHistory([]);
        }

        // Fetch popular news
        const newsResponse = await fetch("/api/search/popular-news?limit=5");
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          setPopularNews(newsData.data?.popularNews || []);
        }

        // Fetch popular tags
        const tagsResponse = await fetch("/api/search/popular-tags?limit=5");
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setPopularTags(
            tagsData.data?.popularTags?.map(
              (item: PopularTagItem) => `#${item.tag_name}`
            ) || []
          );
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        // Fallback ke mock data jika API gagal
        setTrendingSearches([
          "AI Deep Fake",
          "Model QwQ-32B",
          "Apple Siri",
          "Teknologi Ban 2025",
          "Microsoft AI",
        ]);
        setPopularNews([
          {
            id: 1,
            title:
              "Manus AI Bikin Heboh, Lebih Hebat dari DeepSeek dan ChatGPT?",
          },
          {
            id: 2,
            title:
              "Alibaba Rilis Model AI QwQ-32B, Diklam Ungguli OpenAI dan DeepSeek",
          },
          {
            id: 3,
            title:
              "Apple mengatakan beberapa peningkatan AI pada Siri ditunda hingga 2026",
          },
          {
            id: 4,
            title:
              "Alibaba Rilis Model AI QwQ-32B, Diklam Ungguli OpenAI dan DeepSeek",
          },
          {
            id: 5,
            title:
              "Alibaba Rilis Model AI QwQ-32B, Diklam Ungguli OpenAI dan DeepSeek",
          },
        ]);
        setPopularTags([
          "#AI",
          "#DeepSeek",
          "#ChatGPT",
          "#Teknologi2025",
          "#AppleSiri",
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (isVisible) {
      fetchData();
    }
  }, [isVisible, isUserLoggedIn]);

  // Listen for search history updates
  useEffect(() => {
    const handleSearchHistoryUpdate = () => {
      if (isVisible) {
        // Delay sedikit untuk memastikan data sudah tersimpan di backend
        setTimeout(() => {
          // Re-fetch data to get updated search history
          const fetchData = async () => {
            try {
              // Fetch trending searches (global)
              const trendingResponse = await fetch(
                "/api/search/trending?limit=5"
              );
              if (trendingResponse.ok) {
                const trendingData = await trendingResponse.json();
                console.log("Trending searches refresh data:", trendingData);
                setTrendingSearches(
                  trendingData.data?.trendingSearches?.map(
                    (item: TrendingSearchItem) => item.search_query
                  ) || []
                );
              }

              // Fetch user's personal search history (if logged in)
              if (isUserLoggedIn) {
                try {
                  const historyResponse = await fetch(
                    "/api/search/history?limit=5"
                  );
                  if (historyResponse.ok) {
                    const historyData = await historyResponse.json();
                    setUserSearchHistory(
                      historyData.data?.searchHistory?.map(
                        (item: SearchHistoryItem) => item.search_query
                      ) || []
                    );
                  }
                } catch (error) {
                  console.error(
                    "Error fetching updated user search history:",
                    error
                  );
                }
              }
            } catch (error) {
              console.error("Error refreshing search data:", error);
            }
          };

          fetchData();
        }, 500); // Delay 500ms to ensure backend has saved the data
      }
    };

    window.addEventListener(
      "search-history-updated",
      handleSearchHistoryUpdate
    );

    return () => {
      window.removeEventListener(
        "search-history-updated",
        handleSearchHistoryUpdate
      );
    };
  }, [isVisible, isUserLoggedIn]);

  if (!isVisible) return null;

  console.log(
    "SearchSidebar rendering, isVisible:",
    isVisible,
    "searchQuery:",
    searchQuery
  );

  return (
    <div
      className={`fixed right-0 w-96 ${isDark ? "bg-[#1A1A1A]" : "bg-white"} shadow-xl z-40 overflow-y-auto`}
      style={{
        top: "80px",
        height: "calc(100vh - 80px)",
      }}
    >
      <div className="p-6 space-y-6">
        {/* Search Results Section - Show when searching or have results */}
        {(searchQuery || searchResults.length > 0 || isSearching) && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Icon
                icon="material-symbols:search"
                fontSize={20}
                className={`${isDark ? "text-blue-400" : "text-blue-500"}`}
              />
              <h3
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {searchQuery ? (
                  <>
                    <TranslatedText>Hasil untuk</TranslatedText> &quot;
                    {searchQuery}&quot;
                  </>
                ) : (
                  <TranslatedText>Hasil Pencarian</TranslatedText>
                )}
              </h3>
            </div>

            <div className="space-y-3">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((news) => (
                  <div
                    key={news.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}
                    onClick={() => {
                      // Navigate to news article
                      window.location.href = `/news/${news.hashed_id || news.id}`;
                    }}
                  >
                    <div className="flex gap-3">
                      <Image
                        src={news.featured_image || "/images/main_news.png"}
                        alt={news.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-sm font-medium line-clamp-2 ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          {news.title}
                        </h4>
                        <p
                          className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {news.category_name} •{" "}
                          {news.authors?.[0]?.author_name || "NewsInsight"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8">
                  <Icon
                    icon="material-symbols:search-off"
                    fontSize={48}
                    className={`mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                  />
                  <p
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <TranslatedText>Tidak ada hasil ditemukan</TranslatedText>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Show default content only when not searching */}
        {!searchQuery && !isSearching && searchResults.length === 0 && (
          <>
            {/* Riwayat Pencarian / Pencarian Populer */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon={
                    isUserLoggedIn
                      ? "material-symbols:history"
                      : "material-symbols:trending-up"
                  }
                  fontSize={20}
                  className={`${isDark ? "text-blue-400" : "text-blue-500"}`}
                />
                <h3
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>
                    {isUserLoggedIn ? "Riwayat Pencarian" : "Pencarian Populer"}
                  </TranslatedText>
                </h3>
              </div>
              <div className="space-y-2">
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (isUserLoggedIn ? userSearchHistory : trendingSearches)
                    .length > 0 ? (
                  (isUserLoggedIn ? userSearchHistory : trendingSearches).map(
                    (search, index) => (
                      <button
                        key={index}
                        onClick={() => onSearchClick(search)}
                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors group ${isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm flex-1">{search}</span>
                        {isUserLoggedIn && (
                          <Icon
                            icon="material-symbols:close"
                            fontSize={16}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? "text-gray-500" : "text-gray-400"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement delete search history
                              console.log("Delete search history:", search);
                            }}
                          />
                        )}
                      </button>
                    )
                  )
                ) : (
                  <div className="text-center py-4">
                    <Icon
                      icon={
                        isUserLoggedIn
                          ? "material-symbols:history"
                          : "material-symbols:trending-up"
                      }
                      fontSize={32}
                      className={`mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <TranslatedText>
                        {isUserLoggedIn
                          ? "Belum ada riwayat pencarian"
                          : "Belum ada pencarian populer"}
                      </TranslatedText>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Trending Searches - Hanya untuk user yang login */}
            {isUserLoggedIn && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon
                    icon="material-symbols:trending-up"
                    fontSize={20}
                    className={`${isDark ? "text-blue-400" : "text-blue-500"}`}
                  />
                  <h3
                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <TranslatedText>Pencarian Trending</TranslatedText>
                  </h3>
                </div>
                <div className="space-y-2">
                  {trendingSearches.length > 0 ? (
                    trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => onSearchClick(search)}
                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left transition-colors ${isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        <span
                          className={`text-sm font-bold flex-shrink-0 ${index < 3 ? "text-red-500" : isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          #{index + 1}
                        </span>
                        <span className="text-sm flex-1">{search}</span>
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Icon
                        icon="material-symbols:trending-up"
                        fontSize={32}
                        className={`mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                      />
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        <TranslatedText>
                          Belum ada pencarian trending
                        </TranslatedText>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Berita Terpopuler */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="material-symbols:trending-up"
                  fontSize={20}
                  className={`${isDark ? "text-blue-400" : "text-blue-500"}`}
                />
                <h3
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>Berita Terpopuler</TranslatedText>
                </h3>
              </div>
              <div className="space-y-3">
                {popularNews.length > 0 ? (
                  popularNews.map((news, index) => (
                    <button
                      key={news.id}
                      onClick={() => {
                        if (news.hashed_id) {
                          window.location.href = `/news/${news.hashed_id}`;
                        } else {
                          onSearchClick(news.title);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`text-lg font-bold flex-shrink-0 ${index < 3 ? "text-blue-500" : isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <p
                            className={`text-sm line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {news.title}
                          </p>
                          {news.category_name && (
                            <p
                              className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                            >
                              {news.category_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Icon
                      icon="material-symbols:trending-up"
                      fontSize={32}
                      className={`mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <TranslatedText>Belum ada berita populer</TranslatedText>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tagar Popular */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="material-symbols:tag"
                  fontSize={20}
                  className={`${isDark ? "text-blue-400" : "text-blue-500"}`}
                />
                <h3
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>Tagar Populer</TranslatedText>
                </h3>
              </div>
              <div className="space-y-2">
                {popularTags.length > 0 ? (
                  popularTags.map((tag, index) => (
                    <button
                      key={index}
                      onClick={() => onSearchClick(tag.replace("#", ""))}
                      className={`flex items-center justify-between w-full p-2 rounded-lg text-left transition-colors ${isDark ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-50 text-gray-700"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-lg font-bold flex-shrink-0 ${index < 3 ? "text-blue-500" : isDark ? "text-gray-500" : "text-gray-400"}`}
                        >
                          #{index + 1}
                        </span>
                        <span className="text-sm">{tag}</span>
                      </div>
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Icon
                      icon="material-symbols:tag"
                      fontSize={32}
                      className={`mx-auto mb-2 ${isDark ? "text-gray-600" : "text-gray-400"}`}
                    />
                    <p
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      <TranslatedText>Belum ada tagar populer</TranslatedText>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
