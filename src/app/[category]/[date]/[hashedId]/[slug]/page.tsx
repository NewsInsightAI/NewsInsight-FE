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
} from "@/utils/newsUrlGenerator";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "@/components/TranslatedText";
import { TranslatedContent } from "@/components/TranslatedContent";
import Breadcrumbs from "@/components/Breadcrumbs";
import CommentsSection from "@/components/CommentsSection";
import { Vibrant } from "node-vibrant/browser";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatTimestamp } from "@/utils/formatTimestamp";

export default function NewsDetailPage() {
  const { isDark } = useDarkMode();
  const { currentLanguage } = useLanguage();
  const params = useParams();
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
  const [isSaved, setIsSaved] = useState(false);

  const [translatedContentForTTS, setTranslatedContentForTTS] =
    useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

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
      const contentToSpeak = translatedContentForTTS || getPlainTextContent();
      const textToSpeak = `${news?.title}. ${contentToSpeak}`;
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
      const foundNews = listNews.find((item) => {
        const itemHashedId = generateHashedId(item.id.toString());
        const itemSlug = generateSlug(item.title);
        const itemDate = formatDateForUrl(item.timestamp);

        const categoryStr = Array.isArray(category) ? category[0] : category;
        const matchesCategory =
          item.category.toLowerCase() === categoryStr.toLowerCase();
        const matchesDate = itemDate === date;
        const matchesHashedId = itemHashedId === hashedId;
        const matchesSlug = itemSlug === slug;

        return matchesCategory && matchesDate && matchesHashedId && matchesSlug;
      });

      if (foundNews) {
        setNews(foundNews);
      }
      setLoading(false);
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
                  href: `/${news.category}`,
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
                  <TranslatedText>
                    {news.title || "Judul Berita"}
                  </TranslatedText>
                </p>
              </div>{" "}
            </div>{" "}
          </div>{" "}
          {/* Action Buttons */}
          <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {/* Ringkas Berita - Urutan Pertama dengan flex-1 */}
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] hover:from-[#2DD4FF] hover:to-[#4F46E5] transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap">
                <Icon
                  icon="material-symbols:summarize"
                  className="w-4 h-4 mr-2"
                />
                <TranslatedText>Ringkas Berita</TranslatedText>
              </button>
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
              <button
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <Icon
                  icon="material-symbols:translate"
                  className="w-4 h-4 mr-2"
                />
                <TranslatedText>Terjemahan</TranslatedText>
              </button>
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
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isSaved
                    ? isDark
                      ? "bg-yellow-800 text-yellow-100 hover:bg-yellow-700"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {isSaved ? (
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
                  {isSaved ? "Tersimpan" : "Simpan"}
                </TranslatedText>
              </button>
              {/* Bagikan */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: news?.title,
                        text: `Baca berita: ${news?.title}`,
                        url: window.location.href,
                      })
                      .catch(console.error);
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link berhasil disalin!");
                  }
                }}
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
          </div>
          {/* Konten Artikel */}
          <div className="py-4">
            {" "}
            <TranslatedContent
              htmlContent={news.content}
              plainTextContent={getPlainTextContent()}
              fontSize={fontSize}
              newsTitle={news.title}
              onTranslatedTextChange={setTranslatedContentForTTS}
            />{" "}
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
              newsId={typeof news.id === "string" ? parseInt(news.id) : news.id}
            />
          </div>
        </div>

        {/* Area Kanan - Sidebar Rekomendasi (25%) */}
        <div className="lg:col-span-1 px-3 sm:px-6 lg:px-4">
          <div className="sticky" style={{ top: navbarHeight + 24 }}>
            {/* Berita Kategori Sama */}
            <div className="mb-8">
              {" "}
              <h3
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>Berita</TranslatedText> {news.category}{" "}
                <TranslatedText>Lainnya</TranslatedText>
              </h3>
              <div className="space-y-4">
                {listNews
                  .filter(
                    (item) =>
                      item.category === news.category && item.id !== news.id
                  )
                  .slice(0, 4)
                  .map((item) => (
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
                          </h4>{" "}
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
            </div>{" "}
            {/* Berita Trending */}
            <div>
              <h3
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                <TranslatedText>Berita Trending</TranslatedText>
              </h3>
              <div className="space-y-4">
                {listNews
                  .filter((item) => item.id !== news.id)
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime()
                  )
                  .slice(0, 5)
                  .map((item, index) => (
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
                        </div>{" "}
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
                          </h4>{" "}
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
          </div>
        </div>
      </div>
    </div>
  );
}
