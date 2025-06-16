/* eslint-disable @next/next/no-img-element */
"use client";
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
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Vibrant } from "node-vibrant/browser";

export default function NewsDetailPage() {
  const { isDark } = useDarkMode();
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
  const [isReading, setIsReading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Fungsi untuk menghitung reading time
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  // Mock content untuk demo - dalam implementasi nyata ambil dari API
  const articleContent = `
    Ini adalah konten demo untuk berita dengan judul "${news?.title}". Dalam implementasi sebenarnya, konten ini akan diambil dari database atau API yang menyediakan detail lengkap artikel berita.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
  `;

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

  // useEffect untuk vibrant color ketika news sudah dimuat
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
  // CSS untuk styling konten React Quill
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
          <p>Memuat berita...</p>
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
          <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  const formattedTimestamp = formatDistanceToNow(new Date(news.timestamp), {
    addSuffix: true,
    locale: idLocale,
  })
    .replace("sekitar ", "")
    .replace("dalam waktu ", "")
    .replace("dulu", "lalu");

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
          {/* Breadcrumbs */}
          <nav className="flex mb-6 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link
                  href="/"
                  className={`${
                    isDark
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  } transition-colors`}
                >
                  Beranda
                </Link>
              </li>
              <li className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <span> / </span>
              </li>
              <li>
                <span
                  className={`${
                    isDark ? "text-blue-400" : "text-blue-600"
                  } capitalize`}
                >
                  {news.category}
                </span>
              </li>
              <li className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <span> / </span>
              </li>
              <li
                className={`${
                  isDark ? "text-gray-400" : "text-gray-500"
                } truncate max-w-xs`}
              >
                {news.title}
              </li>
            </ol>
          </nav>
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
                  {news.category
                    ? news.category.charAt(0).toUpperCase() +
                      news.category.slice(1)
                    : "Kategori Berita"}
                </p>
              </div>

              <div className="flex flex-col gap-1 sm:gap-2 w-full">
                <p className="text-white text-xs sm:text-sm font-semibold">
                  {news.source || "Nama Penulis"} •{" "}
                  <span className="font-normal">
                    {formattedTimestamp || "Tanggal Publikasi"}
                  </span>
                </p>
                <p className="text-white text-lg sm:text-2xl lg:text-[32px] font-semibold w-full sm:w-3/4 lg:w-1/2 leading-tight">
                  {news.title || "Judul Berita"}
                </p>
              </div>
            </div>{" "}
          </div>
          {/* Action Buttons */}
          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-3">
              {/* Ringkas Berita */}
              <button className="inline-flex items-center px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ringkas Berita
              </button>

              {/* Reading Time */}
              <div
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                  isDark
                    ? "bg-gray-800 text-gray-300 border border-gray-700"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingTime} Menit
              </div>

              {/* Bacakan */}
              <button
                onClick={() => setIsReading(!isReading)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isReading
                    ? isDark
                      ? "bg-green-800 text-green-100 hover:bg-green-700"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                    : isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {isReading ? (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-3-4-3z"
                    />
                  </svg>
                )}
                {isReading ? "Berhenti" : "Bacakan"}
              </button>

              {/* Terjemahan */}
              <button
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Terjemahan
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
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Font (
                {fontSize === "small" ? "S" : fontSize === "medium" ? "M" : "L"}
                )
              </button>

              {/* Simpan */}
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
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
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 01-2-2h10a2 2 0 012 2v16z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-5-7 5V5z"
                    />
                  </svg>
                )}
                {isSaved ? "Tersimpan" : "Simpan"}
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
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Bagikan
              </button>

              {/* Laporkan */}
              <button
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Laporkan
              </button>
            </div>
          </div>{" "}
          {/* Konten Artikel */}
          <div className="py-4">
            <div
              className={`prose max-w-none ${isDark ? "prose-invert" : ""} ${
                fontSize === "small"
                  ? "prose-sm"
                  : fontSize === "large"
                    ? "prose-xl"
                    : "prose-lg"
              }`}
            >
              {news.content ? (
                // Render HTML content from React Quill
                <div
                  dangerouslySetInnerHTML={{ __html: news.content }}
                  className={`quill-content ${
                    fontSize === "small"
                      ? "text-sm"
                      : fontSize === "large"
                        ? "text-xl"
                        : "text-base"
                  }`}
                />
              ) : (
                // Fallback content untuk demo
                <>
                  <p
                    className={`leading-relaxed mb-6 ${
                      fontSize === "small"
                        ? "text-base"
                        : fontSize === "large"
                          ? "text-xl"
                          : "text-lg"
                    }`}
                  >
                    Ini adalah konten demo untuk berita dengan judul &ldquo;
                    {news.title}&rdquo;. Dalam implementasi sebenarnya, konten
                    ini akan diambil dari database atau API yang menyediakan
                    detail lengkap artikel berita.
                  </p>
                  <p className="mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </p>
                  <h2
                    className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} ${
                      fontSize === "small"
                        ? "text-xl"
                        : fontSize === "large"
                          ? "text-3xl"
                          : "text-2xl"
                    }`}
                  >
                    Informasi Lebih Lanjut
                  </h2>
                  <p className="mb-6">
                    Sed ut perspiciatis unde omnis iste natus error sit
                    voluptatem accusantium doloremque laudantium, totam rem
                    aperiam, eaque ipsa quae ab illo inventore veritatis et
                    quasi architecto beatae vitae dicta sunt explicabo.
                  </p>{" "}
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                    odit aut fugit, sed quia consequuntur magni dolores eos qui
                    ratione voluptatem sequi nesciunt.
                  </p>
                  <h2
                    className={`font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"} ${
                      fontSize === "small"
                        ? "text-xl"
                        : fontSize === "large"
                          ? "text-3xl"
                          : "text-2xl"
                    }`}
                  >
                    Contoh List
                  </h2>
                  <p className="mb-4">Berikut adalah contoh unordered list:</p>
                  <ul>
                    <li>Item pertama dalam list</li>
                    <li>Item kedua dalam list</li>
                    <li>
                      Item ketiga dalam list
                      <ul>
                        <li>Sub-item pertama</li>
                        <li>Sub-item kedua</li>
                      </ul>
                    </li>
                  </ul>
                  <p className="mb-4 mt-6">
                    Berikut adalah contoh ordered list:
                  </p>
                  <ol>
                    <li>Langkah pertama</li>
                    <li>Langkah kedua</li>
                    <li>
                      Langkah ketiga
                      <ol>
                        <li>Sub-langkah pertama</li>
                        <li>Sub-langkah kedua</li>
                      </ol>
                    </li>
                  </ol>
                </>
              )}
            </div>

            {/* Tombol Kembali */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => window.history.back()}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali
              </button>
            </div>
          </div>
        </div>

        {/* Area Kanan - Sidebar Rekomendasi (25%) */}
        <div className="lg:col-span-1 px-3 sm:px-6 lg:px-4">
          <div className="mb-8 sticky" style={{ top: navbarHeight + 24 }}>
            {/* Berita Kategori Sama */}
            <div className="mb-8">
              <h3
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Berita {news.category} Lainnya
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
                            {item.title}
                          </h4>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.source} •{" "}
                            {formatDistanceToNow(new Date(item.timestamp), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Berita Trending */}
            <div>
              <h3
                className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Berita Trending
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
                            {item.title}
                          </h4>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {item.source} •{" "}
                            {formatDistanceToNow(new Date(item.timestamp), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
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
