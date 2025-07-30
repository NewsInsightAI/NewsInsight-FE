/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { listNews, NewsItem } from "@/utils/listNews";
import {
  generateHashedId,
  generateSlug,
  formatDateForUrl,
  generateNewsUrl,
} from "@/utils/newsUrlGenerator";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/TranslatedText";
import { TranslatedNewsContent } from "@/components/TranslatedNewsContent";
import {
  useNewsTranslation,
  TRANSLATION_LANGUAGES,
} from "@/hooks/useNewsTranslation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommentsSection from "@/components/CommentsSection";
import NewsReportModal from "@/components/NewsReportModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Vibrant } from "node-vibrant/browser";
import { formatTimestamp } from "@/utils/formatTimestamp";
import {
  useSavedNews,
  useNewsSummary,
  useNewsInteractions,
} from "@/hooks/useNewsInteractions";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useToast } from "@/context/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

export default function NewsDetailPage() {
  const { isDark } = useDarkMode();
  const { currentLanguage } = useLanguage(); // Only for UI translations
  const { data: session } = useSession();
  const params = useParams();

  // News translation hook - separate from UI language
  const {
    currentLanguage: newsLanguage,
    translatedContent,
    isTranslating,
    isTranslated,
    translateNews,
    resetTranslation,
  } = useNewsTranslation();

  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [gradient, setGradient] = useState(
    "linear-gradient(to top, transparent, transparent)"
  );
  const [vibrantColor, setVibrantColor] = useState<string>("#6B7280");
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [showTranslationMenu, setShowTranslationMenu] = useState(false);
  const translationButtonRef = useRef<HTMLButtonElement>(null);

  // Debug useEffect for showTranslationMenu state changes
  useEffect(() => {
    console.log("=== TRANSLATION MENU STATE CHANGED ===");
    console.log("showTranslationMenu is now:", showTranslationMenu);
  }, [showTranslationMenu]);

  const trackingRef = useRef<boolean>(false);
  const lastTrackedNewsId = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Custom hooks for news interactions
  const newsId =
    typeof news?.id === "number"
      ? news.id
      : typeof news?.id === "string" && !news.id.startsWith("news-")
        ? parseInt(news.id) || 1
        : 1;

  // Don't initialize hooks if news is not loaded yet
  const shouldInitializeHooks = news !== null;

  const {
    isSaved,
    loading: saveLoading,
    toggleSave,
  } = useSavedNews(shouldInitializeHooks ? newsId : 0);
  const {
    summary,
    loading: summaryLoading,
    loadSummary,
  } = useNewsSummary(shouldInitializeHooks ? newsId : 0);
  const newsInteractions = useNewsInteractions();
  const { addReadingHistory, trackNewsView } = useReadingHistory();
  const { showToast } = useToast();

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      const languageMap: Record<string, string> = {
        id: "id-ID",
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        ja: "ja-JP",
        ko: "ko-KR",
        zh: "zh-CN",
        ar: "ar-SA",
        pt: "pt-BR",
        ru: "ru-RU",
        hi: "hi-IN",
      };

      utterance.lang = languageMap[currentLanguage.code] || "id-ID";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error("Speech error:", event);
        setIsSpeaking(false);

        if (event.error !== "canceled" && event.error !== "interrupted") {
          alert("Terjadi kesalahan saat memutar audio.");
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser Anda tidak mendukung Text-to-Speech.");
    }
  };
  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        console.log("Speech already stopped or cancelled");
      } finally {
        setIsSpeaking(false);
      }
    }
  };
  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      // Use translated content if available, otherwise use original
      const contentToSpeak =
        isTranslated && translatedContent?.content
          ? translatedContent.content
          : getPlainTextContent();
      const titleToSpeak =
        isTranslated && translatedContent?.title
          ? translatedContent.title
          : news?.title;
      const textToSpeak = `${titleToSpeak}. ${contentToSpeak}`;
      speakText(textToSpeak);
    }
  };

  const getPlainTextContent = () => {
    if (news?.content) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = news.content;
      return tempDiv.textContent || tempDiv.innerText || "";
    }

    return `Ini adalah konten demo untuk berita dengan judul "${news?.title}". Dalam implementasi sebenarnya, konten ini akan diambil dari database atau API yang menyediakan detail lengkap artikel berita.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;
  };

  const articleContent = getPlainTextContent();
  const readingTime = calculateReadingTime(articleContent);

  // Handler functions for news interactions
  const handleSummaryClick = async () => {
    try {
      // Check if this is a dummy news item (from listNews)
      if (
        news?.id &&
        typeof news.id === "string" &&
        news.id.startsWith("news-")
      ) {
        showToast(
          "Fitur ringkasan hanya tersedia untuk berita dari database",
          "info"
        );
        return;
      }

      await loadSummary();
      setShowSummary(true);
    } catch (error) {
      console.error("Error loading summary:", error);
      if (error instanceof Error && error.message.includes("401")) {
        showToast("Sesi Anda telah berakhir. Silakan login kembali", "error");
      } else if (error instanceof Error && error.message.includes("404")) {
        showToast("Ringkasan tidak tersedia untuk berita ini", "error");
      } else {
        showToast("Terjadi kesalahan saat memuat ringkasan berita", "error");
      }
    }
  };

  const handleSaveClick = async () => {
    if (!session?.backendToken) {
      showToast(
        "Silakan login terlebih dahulu untuk menyimpan berita",
        "error"
      );
      return;
    }

    try {
      const result = await toggleSave();

      if (result.saved) {
        showToast("Berita berhasil disimpan", "success");
      } else {
        showToast("Berita berhasil dihapus dari simpanan", "success");
      }
    } catch (error) {
      console.error("Error saving news:", error);

      // Check if it's an authentication error
      if (error instanceof Error && error.message.includes("401")) {
        showToast("Sesi Anda telah berakhir. Silakan login kembali", "error");
        // Optionally redirect to login or refresh token
      } else {
        showToast("Terjadi kesalahan saat menyimpan berita", "error");
      }
    }
  };

  const handleShareClick = async () => {
    try {
      // Track the share action
      if (navigator.share) {
        await navigator.share({
          title: news?.title,
          text: `Baca berita: ${news?.title}`,
          url: window.location.href,
        });

        // Track native share
        await newsInteractions.trackShare(newsId, {
          shareType: "native_share",
        });

        showToast("Berita berhasil dibagikan", "success");
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link berhasil disalin!", "success");

        // Track clipboard copy
        await newsInteractions.trackShare(newsId, {
          shareType: "link_copy",
        });
      }
    } catch (error) {
      console.error("Error sharing news:", error);
      // Fallback if both methods fail
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link berhasil disalin!", "success");
        await newsInteractions.trackShare(newsId, {
          shareType: "link_copy",
        });
      } catch (clipboardError) {
        console.error("Clipboard also failed:", clipboardError);
        // Manual copy fallback
        try {
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          showToast("Link berhasil disalin!", "success");
        } catch {
          showToast(
            "Gagal menyalin link. Silakan salin manual dari address bar",
            "error"
          );
        }
      }
    }
  };

  const handleTranslationClick = () => {
    console.log("=== TRANSLATION BUTTON CLICKED ===");
    console.log("Current showTranslationMenu:", showTranslationMenu);
    console.log("Current isTranslating:", isTranslating);
    console.log("About to toggle translation menu...");
    setShowTranslationMenu(!showTranslationMenu);
    console.log("Translation menu toggle completed");
  };

  const handleLanguageSelect = async (language: {
    code: string;
    name: string;
    flag: string;
  }) => {
    if (language.code === newsLanguage.code) {
      setShowTranslationMenu(false);
      return;
    }

    try {
      const newsTitle = news?.title || "";
      const newsContent = news?.content || getPlainTextContent();

      await translateNews(newsTitle, newsContent, language);
      setShowTranslationMenu(false);
      showToast(`Berita diterjemahkan ke ${language.name}`, "success");
    } catch (error) {
      console.error("Error translating news:", error);
      showToast("Gagal menerjemahkan berita", "error");
    }
  };

  // Close translation menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const translationContainer = target.closest("[data-translation-menu]");
      const translationMenu = target.closest(".translation-menu");

      if (!translationContainer && !translationMenu && showTranslationMenu) {
        console.log("Clicking outside translation menu, closing it");
        setShowTranslationMenu(false);
      }
    };

    if (showTranslationMenu) {
      // Add delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTranslationMenu]);
  useEffect(() => {
    const navbar = document.querySelector("#navbar");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      const navbar = document.querySelector("#navbar");
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    let observer: ResizeObserver | null = null;
    if (navbar && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => {
        setNavbarHeight(navbar.clientHeight);
      });
      observer.observe(navbar);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    const { category, date, hashedId, slug } = params;

    if (category && date && hashedId && slug) {
      const fetchNewsFromAPI = async () => {
        try {
          // Coba ambil data dari API backend terlebih dahulu menggunakan hashedId dan slug
          const response = await fetch(`/api/news/by-slug/${hashedId}/${slug}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              const newsItem = data.data;

              // Transform data API ke format NewsItem
              const transformedNews: NewsItem = {
                id: newsItem.id, // Use numeric ID for interactions
                source: newsItem.authors?.[0]?.author_name || "NewsInsight",
                title: newsItem.title,
                imageUrl: newsItem.featured_image || "/images/main_news.png",
                timestamp: newsItem.published_at || newsItem.created_at,
                category: newsItem.category_name || "Berita",
                content: newsItem.content || null, // Konten lengkap dari database
                link: window.location.pathname, // Current path
                // Extract reporters and editors from authors data
                reporters:
                  newsItem.authors?.map(
                    (author: { author_name: string; location?: string }) =>
                      author.location
                        ? `${author.author_name} di ${author.location}`
                        : author.author_name
                  ) || [],
                editors: [], // Backend belum provide data editors, bisa ditambah nanti
                tags: newsItem.tags || [], // Include tags from API
              };

              setNews(transformedNews);
              setLoading(false);
              return;
            }
          }

          // Fallback ke data dummy jika tidak ditemukan di API
          const foundNews = listNews.find((item) => {
            const itemHashedId = generateHashedId(item.id.toString());
            const itemSlug = generateSlug(item.title);
            const itemDate = formatDateForUrl(item.timestamp);

            const categoryStr = Array.isArray(category)
              ? category[0]
              : category;
            const matchesCategory =
              item.category.toLowerCase() === categoryStr.toLowerCase();
            const matchesDate = itemDate === date;
            const matchesHashedId = itemHashedId === hashedId;
            const matchesSlug = itemSlug === slug;

            return (
              matchesCategory && matchesDate && matchesHashedId && matchesSlug
            );
          });

          if (foundNews) {
            setNews(foundNews);
          }
        } catch (error) {
          console.error("Error fetching news:", error);

          // Fallback ke data dummy jika terjadi error
          const foundNews = listNews.find((item) => {
            const itemHashedId = generateHashedId(item.id.toString());
            const itemSlug = generateSlug(item.title);
            const itemDate = formatDateForUrl(item.timestamp);

            const categoryStr = Array.isArray(category)
              ? category[0]
              : category;
            const matchesCategory =
              item.category.toLowerCase() === categoryStr.toLowerCase();
            const matchesDate = itemDate === date;
            const matchesHashedId = itemHashedId === hashedId;
            const matchesSlug = itemSlug === slug;

            return (
              matchesCategory && matchesDate && matchesHashedId && matchesSlug
            );
          });

          if (foundNews) {
            setNews(foundNews);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchNewsFromAPI();
    }
  }, [params]);

  useEffect(() => {
    if (news && news.imageUrl) {
      Vibrant.from(news.imageUrl)
        .getPalette()
        .then((palette) => {
          const hex = palette.Vibrant?.hex ?? "#6B7280";
          setVibrantColor(hex);
          setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
        })
        .catch(() => {
          setVibrantColor("#6B7280");
          setGradient("linear-gradient(to top, #6B7280CC, transparent)");
        });
    }
  }, [news]);

  // Fetch related news and trending news from backend
  useEffect(() => {
    const fetchSidebarNews = async () => {
      if (!news || !news.category) return;

      try {
        // Fetch related news (same category, exclude current news)
        const relatedResponse = await fetch(
          `/api/news/category/${news.category.toLowerCase()}?limit=6&public=true`
        );

        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          if (relatedData.data?.news) {
            const transformedRelated = relatedData.data.news
              .filter((item: { id: number }) => item.id !== newsId) // Exclude current news
              .slice(0, 4)
              .map(
                (newsItem: {
                  id: number;
                  hashed_id?: string;
                  title: string;
                  featured_image?: string;
                  published_at?: string;
                  created_at: string;
                  category_name?: string;
                  authors?: Array<{ author_name: string }>;
                }) => ({
                  id: newsItem.hashed_id || newsItem.id,
                  source: newsItem.authors?.[0]?.author_name || "NewsInsight",
                  title: newsItem.title,
                  imageUrl: newsItem.featured_image || "/images/main_news.png",
                  timestamp: newsItem.published_at || newsItem.created_at,
                  category: newsItem.category_name || news.category,
                  link: generateNewsUrl(
                    newsItem.category_name || news.category,
                    newsItem.title,
                    newsItem.published_at || newsItem.created_at,
                    newsItem.hashed_id || newsItem.id.toString()
                  ),
                })
              );
            setRelatedNews(transformedRelated);
          }
        }
      } catch (error) {
        console.error("Error fetching related news:", error);
      } finally {
        setLoadingRelated(false);
      }

      try {
        // Fetch trending news
        const trendingResponse = await fetch(
          "/api/news?limit=6&sort=trending&public=true"
        );

        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json();
          if (trendingData.data?.news) {
            const transformedTrending = trendingData.data.news
              .filter((item: { id: number }) => item.id !== newsId) // Exclude current news
              .slice(0, 5)
              .map(
                (newsItem: {
                  id: number;
                  hashed_id?: string;
                  title: string;
                  featured_image?: string;
                  published_at?: string;
                  created_at: string;
                  category_name?: string;
                  authors?: Array<{ author_name: string }>;
                }) => ({
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
                    newsItem.hashed_id || newsItem.id.toString()
                  ),
                })
              );
            setTrendingNews(transformedTrending);
          }
        }
      } catch (error) {
        console.error("Error fetching trending news:", error);
      } finally {
        setLoadingTrending(false);
      }
    };

    fetchSidebarNews();
  }, [news, newsId]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .quill-content {
        line-height: 1.8;
      }
      .quill-content h1, .quill-content h2, .quill-content h3 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-weight: 700;
      }
      .quill-content h1 { font-size: 2rem; }
      .quill-content h2 { font-size: 1.5rem; }
      .quill-content h3 { font-size: 1.25rem; }
      .quill-content p {
        margin-bottom: 1rem;
      }
      .quill-content ul, .quill-content ol {
        margin: 1rem 0;
        padding-left: 2rem;
      }
      .quill-content ul {
        list-style-type: disc;
      }
      .quill-content ol {
        list-style-type: decimal;
      }
      .quill-content ul ul {
        list-style-type: circle;
      }
      .quill-content ol ol {
        list-style-type: lower-alpha;
      }
      .quill-content ul ol {
        list-style-type: decimal;
      }
      .quill-content ol ul {
        list-style-type: disc;
      }
      .quill-content li {
        margin-bottom: 0.5rem;
        display: list-item;
      }
      .quill-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1.5rem 0;
        font-style: italic;
        background: ${
          isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)"
        };
        padding: 1rem;
        border-radius: 0.5rem;
      }
      .quill-content strong {
        font-weight: 600;
      }
      .quill-content em {
        font-style: italic;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isDark]);

  // Track reading history and news views when news is loaded
  useEffect(() => {
    console.log("=== TRACKING USEEFFECT DEBUG ===");
    console.log("news:", news);
    console.log("news?.id:", news?.id);
    console.log("typeof news?.id:", typeof news?.id);
    console.log("newsId:", newsId);
    console.log("trackingRef.current:", trackingRef.current);
    console.log("lastTrackedNewsId.current:", lastTrackedNewsId.current);
    console.log("session:", session);
    console.log("session?.backendToken:", session?.backendToken);

    // Only track if we have news and haven't tracked this specific newsId yet
    if (
      news &&
      typeof news.id === "number" &&
      newsId !== 1 &&
      lastTrackedNewsId.current !== newsId
    ) {
      console.log("🔄 New news detected, preparing to track:", newsId);
      lastTrackedNewsId.current = newsId;
      trackingRef.current = false; // Reset for new news

      // Track immediately for testing (reduced delay)
      const trackView = async () => {
        try {
          // Prevent duplicate tracking
          if (trackingRef.current) {
            console.log("⚠️ Tracking already in progress, skipping");
            return;
          }

          trackingRef.current = true;
          console.log("🔥 EXECUTING TRACKING for newsId:", newsId);

          const readDuration = 5000; // 5 seconds for testing
          const readPercentage = 0.1;

          console.log("📊 ATTEMPTING TO TRACK:", {
            newsId,
            readDuration,
            readPercentage,
            hasUser: !!session?.backendToken,
          });

          if (session?.backendToken) {
            console.log("👤 Tracking for logged-in user...");
            console.log("About to call addReadingHistory with:", {
              newsId,
              readDuration,
              readPercentage,
            });
            const result = await addReadingHistory(
              newsId,
              readDuration,
              readPercentage
            );
            console.log("✅ Reading history result:", result);
          } else {
            console.log("👥 Tracking for anonymous user...");
            console.log("About to call trackNewsView with:", { newsId });
            const result = await trackNewsView(newsId);
            console.log("✅ News view tracking result:", result);
          }
        } catch (error) {
          console.error("❌ Failed to track news view/reading history:", error);
          trackingRef.current = false; // Reset on error so it can retry
        }
      };

      // Track after 1 second (reduced delay for testing)
      console.log("⏱️ Setting timer for 1 second...");
      setTimeout(trackView, 1000);
      console.log("✅ Timer set successfully, will execute in 1 second");
    } else {
      console.log("❌ Tracking conditions not met or already tracked");
      console.log("Conditions:", {
        hasNews: !!news,
        isNumberType: typeof news?.id === "number",
        notDefaultId: newsId !== 1,
        notAlreadyTracked: lastTrackedNewsId.current !== newsId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news, newsId]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
        style={{ paddingTop: navbarHeight + 24 }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current mx-auto mb-4"></div>
          <p>
            <TranslatedText>Memuat berita...</TranslatedText>
          </p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
        style={{ paddingTop: navbarHeight + 24 }}
      >
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-bold mb-4">
            <TranslatedText>Berita tidak ditemukan</TranslatedText>
          </h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            <TranslatedText>Kembali ke beranda</TranslatedText>
          </Link>
        </div>
      </div>
    );
  }

  const formattedTimestamp = formatTimestamp(
    news.timestamp,
    currentLanguage.code
  );

  return (
    <div
      className={`${
        isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
      } min-h-screen w-full transition-colors duration-300`}
      style={{ paddingTop: navbarHeight + 24 }}
    >
      {/* Container untuk split layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Area Kiri - Konten Utama (75%) */}
        <div className="lg:col-span-3 px-3 sm:px-6">
          {" "}
          {/* Breadcrumbs */}
          {news && (
            <Breadcrumbs
              items={[
                {
                  label: "Beranda",
                  href: "/",
                },
                {
                  label:
                    news.category.charAt(0).toUpperCase() +
                    news.category.slice(1),
                  href: `/categories/${news.category.toLowerCase()}`,
                },
                {
                  label: news.title,
                  isActive: true,
                },
              ]}
              className="mb-6"
            />
          )}
          {/* Hero Section */}
          <div
            className={`relative w-full h-[300px] sm:h-[400px] lg:h-[550px] rounded-2xl sm:rounded-3xl overflow-hidden mb-8 ${
              isDark ? "shadow-2xl news-glow-pulse" : ""
            }`}
            style={{
              boxShadow: isDark
                ? `0 25px 50px -12px ${vibrantColor}33`
                : undefined,
            }}
          >
            <img
              alt={news.title}
              src={news.imageUrl}
              ref={imgRef}
              onLoad={() => {
                Vibrant.from(imgRef.current as HTMLImageElement)
                  .getPalette()
                  .then((palette) => {
                    const hex = palette.Vibrant?.hex ?? "#6B7280";
                    setGradient(
                      `linear-gradient(to top, ${hex}CC, transparent)`
                    );
                    setVibrantColor(hex);
                  })
                  .catch(() => {
                    setGradient(
                      "linear-gradient(to top, #6B7280CC, transparent)"
                    );
                  });
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/main_news.png";
              }}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div
              className="absolute inset-0 flex flex-col items-end justify-between p-4 sm:p-6 lg:p-8"
              style={{ background: gradient }}
            >
              <div className="flex w-full justify-end">
                <p
                  className="text-xs sm:text-sm lg:text-base font-bold px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 bg-white rounded-full"
                  style={{ color: vibrantColor }}
                >
                  <TranslatedText>
                    {news.category
                      ? news.category.charAt(0).toUpperCase() +
                        news.category.slice(1)
                      : "Kategori Berita"}
                  </TranslatedText>
                </p>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2 w-full">
                {" "}
                <p className="text-white text-xs sm:text-sm font-semibold">
                  {news.source || <TranslatedText>Nama Penulis</TranslatedText>}{" "}
                  •{" "}
                  <span className="font-normal">
                    {formattedTimestamp || (
                      <TranslatedText>Tanggal Publikasi</TranslatedText>
                    )}
                  </span>
                </p>
                <p className="text-white text-lg sm:text-2xl lg:text-[32px] font-semibold w-full sm:w-3/4 lg:w-1/2 leading-tight">
                  {isTranslated && translatedContent?.title ? (
                    translatedContent.title
                  ) : (
                    <TranslatedText>
                      {news.title || "Judul Berita"}
                    </TranslatedText>
                  )}
                </p>
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Action Buttons */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700 relative">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {/* Ringkas Berita - Expandable */}
              {!showSummary ? (
                <button
                  onClick={handleSummaryClick}
                  disabled={
                    summaryLoading ||
                    Boolean(
                      news?.id &&
                        typeof news.id === "string" &&
                        news.id.startsWith("news-")
                    )
                  }
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap ${
                    news?.id &&
                    typeof news.id === "string" &&
                    news.id.startsWith("news-")
                      ? "bg-gray-500 cursor-not-allowed opacity-50"
                      : summaryLoading
                        ? "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] opacity-50 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] hover:from-[#2DD4FF] hover:to-[#4F46E5]"
                  }`}
                >
                  {summaryLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Icon
                      icon="material-symbols:summarize"
                      className="w-4 h-4 mr-2"
                    />
                  )}
                  <TranslatedText>
                    {summaryLoading
                      ? "Memuat..."
                      : news?.id &&
                          typeof news.id === "string" &&
                          news.id.startsWith("news-")
                        ? "Tidak Tersedia"
                        : "Ringkas Berita"}
                  </TranslatedText>
                </button>
              ) : null}

              {/* Reading Time */}
              <div
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  isDark
                    ? "bg-gray-800 text-gray-300 border border-gray-700"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                <Icon
                  icon="material-symbols:schedule"
                  className="w-4 h-4 mr-2"
                />
                <TranslatedText>{`${readingTime} Menit`}</TranslatedText>
              </div>
              {/* Bacakan */}
              <button
                onClick={handleSpeechToggle}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isSpeaking
                    ? isDark
                      ? "bg-green-800 text-green-100 hover:bg-green-700"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                    : isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {isSpeaking ? (
                  <Icon
                    icon="material-symbols:pause-circle"
                    className="w-4 h-4 mr-2"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:play-circle"
                    className="w-4 h-4 mr-2"
                  />
                )}
                <TranslatedText>
                  {isSpeaking ? "Berhenti" : "Bacakan"}
                </TranslatedText>
              </button>
              {/* Terjemahan */}
              <div className="relative" data-translation-menu>
                <button
                  ref={translationButtonRef}
                  onClick={handleTranslationClick}
                  disabled={isTranslating}
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    newsLanguage.code !== "id"
                      ? isDark
                        ? "bg-blue-800 text-blue-100 hover:bg-blue-700"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      : isDark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isTranslating ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Icon
                      icon="material-symbols:translate"
                      className="w-4 h-4 mr-2"
                    />
                  )}
                  <TranslatedText>
                    {isTranslating ? "Menerjemahkan..." : "Terjemahan"}
                  </TranslatedText>
                  {newsLanguage.code !== "id" && (
                    <span className="ml-2 text-xs">({newsLanguage.flag})</span>
                  )}
                </button>

                {/* Reset Translation Button - only show when translated */}
                {isTranslated && (
                  <button
                    onClick={resetTranslation}
                    className={`ml-2 inline-flex items-center px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    title="Reset ke bahasa asli"
                  >
                    <Icon icon="material-symbols:refresh" className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Ubah Font */}
              <button
                onClick={() => {
                  const sizes: Array<"small" | "medium" | "large"> = [
                    "small",
                    "medium",
                    "large",
                  ];
                  const currentIndex = sizes.indexOf(fontSize);
                  const nextIndex = (currentIndex + 1) % sizes.length;
                  setFontSize(sizes[nextIndex]);
                }}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Icon
                  icon="material-symbols:format-size"
                  className="w-4 h-4 mr-2"
                />
                <TranslatedText>Font</TranslatedText> (
                {fontSize === "small" ? "S" : fontSize === "medium" ? "M" : "L"}
                )
              </button>
              {/* Simpan */}
              <button
                onClick={handleSaveClick}
                disabled={saveLoading}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isSaved
                    ? isDark
                      ? "bg-yellow-800 text-yellow-100 hover:bg-yellow-700"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } ${saveLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {saveLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : isSaved ? (
                  <Icon
                    icon="material-symbols:bookmark"
                    className="w-4 h-4 mr-2"
                  />
                ) : (
                  <Icon
                    icon="material-symbols:bookmark-outline"
                    className="w-4 h-4 mr-2"
                  />
                )}
                <TranslatedText>
                  {saveLoading ? "..." : isSaved ? "Tersimpan" : "Simpan"}
                </TranslatedText>
              </button>
              {/* Bagikan */}
              <button
                onClick={handleShareClick}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Icon icon="material-symbols:share" className="w-4 h-4 mr-2" />
                <TranslatedText>Bagikan</TranslatedText>
              </button>
              {/* Laporkan */}
              <button
                onClick={() => setShowReportModal(true)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Icon icon="material-symbols:report" className="w-4 h-4 mr-2" />
                <TranslatedText>Laporkan</TranslatedText>
              </button>
            </div>

            {/* Translation Menu - Outside scroll container */}
            {showTranslationMenu && (
              <div
                className={`fixed w-64 rounded-lg border shadow-xl z-[9999] translation-menu ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
                style={{
                  position: "fixed",
                  top: translationButtonRef.current
                    ? translationButtonRef.current.getBoundingClientRect()
                        .bottom +
                      window.scrollY +
                      8
                    : "auto",
                  left: translationButtonRef.current
                    ? translationButtonRef.current.getBoundingClientRect()
                        .left + window.scrollX
                    : "auto",
                  zIndex: 9999,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div
                    className={`px-3 py-2 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    <TranslatedText>Pilih Bahasa:</TranslatedText>
                  </div>
                  {TRANSLATION_LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language)}
                      disabled={isTranslating}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        language.code === newsLanguage.code
                          ? isDark
                            ? "bg-blue-900 text-blue-100"
                            : "bg-blue-100 text-blue-900"
                          : isDark
                            ? "hover:bg-gray-700 text-gray-200"
                            : "hover:bg-gray-100 text-gray-900"
                      } ${isTranslating ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span className="flex items-center">
                        <span className="mr-2">{language.flag}</span>
                        {language.name}
                      </span>
                      {language.code === newsLanguage.code && (
                        <Icon
                          icon="material-symbols:check"
                          className="w-4 h-4"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Expandable Section */}
            <AnimatePresence>
              {showSummary && summary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`mt-4 rounded-2xl overflow-hidden ${
                    isDark
                      ? "bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30"
                      : "bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className={`text-lg font-bold flex items-center ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        <Icon
                          icon="material-symbols:summarize"
                          className="w-5 h-5 mr-2 text-blue-500"
                        />
                        <TranslatedText>Ringkasan Berita</TranslatedText>
                      </h3>
                      <button
                        onClick={() => setShowSummary(false)}
                        className={`p-2 rounded-full transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                            : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Icon
                          icon="material-symbols:close"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>

                    <div
                      className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}
                    >
                      <p
                        className={`text-sm leading-relaxed mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {summary.summaryText}
                      </p>

                      {summary.keyPoints && summary.keyPoints.length > 0 && (
                        <div>
                          <h4
                            className={`text-sm font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}
                          >
                            <TranslatedText>Poin-poin Penting:</TranslatedText>
                          </h4>
                          <ul className="space-y-2">
                            {summary.keyPoints.map(
                              (point: string, index: number) => (
                                <li
                                  key={index}
                                  className={`flex items-start text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Konten Artikel */}
          <div className="py-4">
            {" "}
            <TranslatedNewsContent
              originalTitle={news.title || ""}
              originalContent={news.content || ""}
              translatedTitle={translatedContent?.title}
              translatedContent={translatedContent?.content}
              isTranslated={isTranslated}
              fontSize={fontSize}
              isDark={isDark}
            />{" "}
            {/* Tags Section */}
            {news.tags && news.tags.length > 0 && (
              <div className="mt-6 mb-4">
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer hover:scale-105 ${
                        isDark
                          ? "bg-blue-900/30 border border-blue-600/50 text-blue-200 hover:bg-blue-900/50"
                          : "bg-blue-50 border border-blue-300 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <Icon
                        icon="tabler:tag-filled"
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span>
                        <TranslatedText>{tag}</TranslatedText>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Informasi Pelaporan */}
            {(news.reporters || news.editors) && (
              <div
                className={`flex justify-center items-center rounded-2xl py-4 px-5 mt-8 ${
                  isDark
                    ? "bg-gray-800 border border-gray-600"
                    : "bg-[#F2F2F2] border border-black/30"
                }`}
              >
                <div
                  className={`text-sm flex items-center gap-3 ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  <Icon icon="oui:reporter" className="w-6 h-6 flex-shrink-0" />
                  <span className="leading-relaxed">
                    {" "}
                    {news.reporters && news.reporters.length > 0 && (
                      <>
                        <TranslatedText>Pelaporan oleh</TranslatedText>{" "}
                        {(() => {
                          const reportersByLocation: {
                            [key: string]: string[];
                          } = {};

                          news.reporters.forEach((reporter) => {
                            const parts = reporter.split(" di ");
                            if (parts.length === 2) {
                              const [name, location] = parts;
                              if (!reportersByLocation[location]) {
                                reportersByLocation[location] = [];
                              }
                              reportersByLocation[location].push(name.trim());
                            } else {
                              if (!reportersByLocation["no-location"]) {
                                reportersByLocation["no-location"] = [];
                              }
                              reportersByLocation["no-location"].push(
                                reporter.trim()
                              );
                            }
                          });

                          const locationGroups =
                            Object.keys(reportersByLocation);
                          const formattedGroups: React.ReactNode[] = [];

                          locationGroups.forEach((location, groupIndex) => {
                            const names = reportersByLocation[location];

                            if (groupIndex > 0) {
                              formattedGroups.push(", ");
                            }

                            if (location === "no-location") {
                              if (names.length === 1) {
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {names[0]}
                                  </span>
                                );
                              } else if (names.length === 2) {
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {names[0]}{" "}
                                    <TranslatedText>dan</TranslatedText>{" "}
                                    {names[1]}
                                  </span>
                                );
                              } else {
                                const allButLast = names.slice(0, -1);
                                const lastName = names[names.length - 1];
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {allButLast.join(", ")}{" "}
                                    <TranslatedText>dan</TranslatedText>{" "}
                                    {lastName}
                                  </span>
                                );
                              }
                            } else {
                              if (names.length === 1) {
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {names[0]}
                                    </span>{" "}
                                    <TranslatedText>di</TranslatedText>{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              } else if (names.length === 2) {
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {names[0]}{" "}
                                      <TranslatedText>dan</TranslatedText>{" "}
                                      {names[1]}
                                    </span>{" "}
                                    <TranslatedText>di</TranslatedText>{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              } else {
                                const allButLast = names.slice(0, -1);
                                const lastName = names[names.length - 1];
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {allButLast.join(", ")}{" "}
                                      <TranslatedText>dan</TranslatedText>{" "}
                                      {lastName}
                                    </span>{" "}
                                    <TranslatedText>di</TranslatedText>{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              }
                            }
                          });

                          return formattedGroups;
                        })()}
                      </>
                    )}
                    {news.reporters &&
                      news.reporters.length > 0 &&
                      news.editors &&
                      news.editors.length > 0 &&
                      " • "}{" "}
                    {news.editors && news.editors.length > 0 && (
                      <>
                        <TranslatedText>Penyuntingan oleh</TranslatedText>{" "}
                        {(() => {
                          if (news.editors.length === 1) {
                            return (
                              <span className="font-semibold">
                                {news.editors[0]}
                              </span>
                            );
                          } else if (news.editors.length === 2) {
                            return (
                              <span className="font-semibold">
                                {news.editors[0]}{" "}
                                <TranslatedText>dan</TranslatedText>{" "}
                                {news.editors[1]}
                              </span>
                            );
                          } else {
                            const allButLast = news.editors.slice(0, -1);
                            const lastName =
                              news.editors[news.editors.length - 1];
                            return (
                              <span className="font-semibold">
                                {allButLast.join(", ")}{" "}
                                <TranslatedText>dan</TranslatedText> {lastName}
                              </span>
                            );
                          }
                        })()}
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Comments Section */}
          <div className="mt-8">
            <CommentsSection
              newsId={
                typeof news.id === "string"
                  ? parseInt(news.id.replace(/[^0-9]/g, "")) || 1
                  : news.id
              }
            />
          </div>
        </div>

        {/* Area Kanan - Sidebar Rekomendasi (25%) */}
        <div className="lg:col-span-1 px-3 sm:px-6 lg:px-4">
          <div className="sticky" style={{ top: navbarHeight + 24 }}>
            {/* Berita Kategori Sama - Only show if there are related news */}
            {!loadingRelated && relatedNews.length > 0 && (
              <div className="mb-8">
                <h3
                  className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>Berita</TranslatedText> {news.category}{" "}
                  <TranslatedText>Lainnya</TranslatedText>
                </h3>
                <div className="space-y-4">
                  {relatedNews.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className={`block p-4 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/main_news.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-semibold mb-1 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <TranslatedText>{item.title}</TranslatedText>
                          </h4>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.source} •{" "}
                            {formatTimestamp(
                              item.timestamp,
                              currentLanguage.code
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state for related news */}
            {loadingRelated && (
              <div className="mb-8">
                <h3
                  className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  <TranslatedText>Berita</TranslatedText> {news.category}{" "}
                  <TranslatedText>Lainnya</TranslatedText>
                </h3>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`related-skeleton-${index}`}
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-16 h-16 rounded-lg animate-pulse ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        />
                        <div className="flex-1 space-y-2">
                          <div
                            className={`h-4 rounded animate-pulse ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          />
                          <div
                            className={`h-3 w-2/3 rounded animate-pulse ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Berita Trending */}
            <div>
              <h3
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>Berita Trending</TranslatedText>
              </h3>
              <div className="space-y-4">
                {loadingTrending ? (
                  // Loading skeleton for trending news
                  Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={`trending-skeleton-${index}`}
                      className={`p-3 rounded-lg ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-8 h-8 rounded-full animate-pulse ${
                            isDark ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        />
                        <div className="flex-1 space-y-2">
                          <div
                            className={`h-4 rounded animate-pulse ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          />
                          <div
                            className={`h-3 w-2/3 rounded animate-pulse ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : trendingNews.length > 0 ? (
                  trendingNews.map((item, index) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      className={`block p-3 rounded-lg transition-colors ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isDark
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-semibold mb-1 ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <TranslatedText>{item.title}</TranslatedText>
                          </h4>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.source} •{" "}
                            {formatTimestamp(
                              item.timestamp,
                              currentLanguage.code
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  // No trending news fallback
                  <div
                    className={`p-4 text-center ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <TranslatedText>
                      Tidak ada berita trending tersedia
                    </TranslatedText>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {news && (
        <NewsReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          newsId={newsId}
          newsTitle={news.title}
        />
      )}
    </div>
  );
}
