/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { getAvatarUrl } from "@/utils/avatarUtils";
import { shortenName } from "@/utils/nameUtils";
import { useDarkMode } from "@/context/DarkModeContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslatedText } from "@/components/TranslatedText";
import { useLanguage } from "@/context/LanguageContext";
import { CategoriesDropdown } from "@/components/CategoriesDropdown";
import { SearchSidebar } from "@/components/SearchSidebar";

interface ProfileData {
  id: number;
  user_id: number;
  full_name: string | null;
  username: string;
  email: string;
  avatar: string | null;
  headline: string | null;
  biography: string | null;
  news_interest: string[] | null;
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

export const Navbar = () => {
  const { isDark, toggleDark } = useDarkMode();
  const { currentLanguage } = useLanguage();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);

  // Search states
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // 1. Save search history first (only for authenticated users)
      if (isUserAuthenticated()) {
        await saveSearchHistory(query);
      }

      // 2. Then perform news search
      const response = await fetch(
        `/api/news/search?q=${encodeURIComponent(query)}&limit=6`
      );
      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSearchResults(result.data?.news || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Save search history
  const saveSearchHistory = async (query: string) => {
    // Only save search history if user is logged in
    if (!isUserAuthenticated()) {
      console.log("User not authenticated, skipping search history save");
      return;
    }

    try {
      // Call directly to backend since we made it public with optional auth
      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add auth header since user is logged in
      const sessionWithToken = session as { backendToken?: string };
      if (sessionWithToken?.backendToken) {
        headers.Authorization = `Bearer ${sessionWithToken.backendToken}`;
      }

      await fetch(`${backendUrl}/search/history`, {
        method: "POST",
        headers,
        body: JSON.stringify({ searchQuery: query.trim() }),
      });

      // Trigger refresh search sidebar data after saving history
      window.dispatchEvent(new CustomEvent("search-history-updated"));

      console.log("Search history saved successfully for authenticated user");
    } catch (error) {
      console.error("Error saving search history:", error);
      // Don't block the search if history saving fails
    }
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search - kurangi delay agar lebih responsif
    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 150); // Reduced from 300ms to 150ms

    return () => clearTimeout(timeoutId);
  };

  // Handle search focus
  const handleSearchFocus = () => {
    console.log("Search focus - dispatching search-expanded event");
    setIsSearchExpanded(true);
    window.dispatchEvent(new CustomEvent("search-expanded"));
  };

  // Handle search blur
  const handleSearchBlur = () => {
    console.log("Search blur - will dispatch search-collapsed event");
    // Delay blur to allow clicking on results
    setTimeout(() => {
      setIsSearchExpanded(false);
      window.dispatchEvent(new CustomEvent("search-collapsed"));
    }, 200);
  };
  const checkBackendConnection = React.useCallback(async () => {
    if (status === "authenticated") {
      try {
        setIsCheckingBackend(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("/api/profile/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const result = await response.json();
          if (result.status === "success") {
            setIsBackendConnected(true);
          } else {
            console.warn("Backend authentication failed:", result.message);
            setIsBackendConnected(false);

            if (
              result.message?.includes("token") ||
              result.message?.includes("unauthorized") ||
              result.message?.includes("invalid")
            ) {
              console.log("Clearing invalid session...");
              await signOut({ redirect: false });
            }
          }
        } else {
          console.warn("Backend not accessible, status:", response.status);
          setIsBackendConnected(false);

          if (response.status === 401 || response.status === 403) {
            console.log("Clearing unauthorized session...");
            await signOut({ redirect: false });
          }
        }
      } catch (error: unknown) {
        console.warn("Backend connection check failed:", error);
        setIsBackendConnected(false);

        if (error instanceof Error && error.name !== "AbortError") {
          console.warn("Non-timeout error:", error.message);
        }
      } finally {
        setIsCheckingBackend(false);
      }
    } else {
      setIsBackendConnected(false);
      setIsCheckingBackend(false);
    }
  }, [status]);

  useEffect(() => {
    checkBackendConnection();
  }, [checkBackendConnection]);

  useEffect(() => {
    const handleAuthStateChange = () => {
      console.log(
        "Auth state change detected, re-checking backend connection..."
      );
      checkBackendConnection();
    };

    window.addEventListener("auth-state-changed", handleAuthStateChange);
    window.addEventListener("login-success", handleAuthStateChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthStateChange);
      window.removeEventListener("login-success", handleAuthStateChange);
    };
  }, [checkBackendConnection]);

  React.useEffect(() => {
    console.log("Navbar session check:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
      backendUser: session?.backendUser,
      isBackendConnected,
    });
  }, [session, isBackendConnected]);

  const getAvatarSource = () => {
    if (profileAvatar) {
      return getAvatarUrl(
        profileAvatar,
        session?.user?.image || "/images/default_profile.png"
      );
    }
    if (session?.user?.image) {
      return session.user.image;
    }
    return "/images/default_profile.png";
  };
  const fetchProfileData = React.useCallback(async () => {
    if (status === "authenticated" && isBackendConnected) {
      try {
        const response = await fetch("/api/profile/me");
        const result = await response.json();

        if (response.ok && result.status === "success") {
          setProfileData(result.data);
          if (result.data?.avatar) {
            setProfileAvatar(result.data.avatar);
          } else {
            setProfileAvatar("");
          }
        } else {
          console.error("Failed to fetch profile:", result.message);
          setProfileData(null);
          setProfileAvatar("");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileData(null);
        setProfileAvatar("");
      }
    }
  }, [status, isBackendConnected]);

  useEffect(() => {
    fetchProfileData();

    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    const handleAuthChange = () => {
      fetchProfileData();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    window.addEventListener("login-success", handleAuthChange);
    window.addEventListener("auth-state-changed", handleAuthChange);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
      window.removeEventListener("login-success", handleAuthChange);
      window.removeEventListener("auth-state-changed", handleAuthChange);
    };
  }, [fetchProfileData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleLogout = async () => {
    setIsBackendConnected(false);
    setProfileData(null);
    setProfileAvatar("");
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });

    window.dispatchEvent(new CustomEvent("auth-state-changed"));
  };
  const searchPlaceholder = (() => {
    switch (currentLanguage.code) {
      case "en":
        return "Search news...";
      case "es":
        return "Buscar noticias...";
      case "fr":
        return "Rechercher des nouvelles...";
      case "de":
        return "Nachrichten suchen...";
      case "pt":
        return "Pesquisar notícias...";
      case "it":
        return "Cerca notizie...";
      case "ru":
        return "Поиск новостей...";
      case "ja":
        return "ニュースを検索...";
      case "ko":
        return "뉴스 검색...";
      case "zh":
        return "搜索新闻...";
      case "ar":
        return "البحث عن الأخبار...";
      case "hi":
        return "समाचार खोजें...";
      case "id":
      default:
        return "Cari berita...";
    }
  })();
  const isUserAuthenticated = () => {
    return (
      status === "authenticated" &&
      session &&
      isBackendConnected &&
      !isCheckingBackend
    );
  };

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav
      id="navbar"
      data-navbar="true"
      className={`navbar-container safe-area-navbar flex flex-col md:flex-row md:justify-between items-center p-3 md:p-4 fixed top-0 w-full z-50 ${isDark ? "bg-[#1A1A1A] text-white shadow-2xl shadow-blue-500/10" : "bg-white text-black"} transition-all duration-300 responsive-transition`}
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile hamburger menu */}
          <button
            className="md:hidden p-1 hover:text-gray-400 transition-colors touch-target mobile-tap-highlight"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Icon
              icon={
                showMobileMenu
                  ? "material-symbols:close"
                  : "material-symbols:menu"
              }
              className="text-2xl"
            />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={`text-base md:text-lg font-bold md:px-6 py-2 rounded-full ${
              pathname === "/profile" ? "bg-white" : ""
            }`}
          >
            <Image
              src="/images/newsinsight-icon.png"
              alt="Logo"
              width={28}
              height={28}
              className="inline-block mr-1 md:mr-2 md:w-9 md:h-9"
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
              NewsInsight
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-10">
            <li>
              <CategoriesDropdown />
            </li>
            <li>
              <Link href="/about-us" className="hover:text-gray-400">
                <TranslatedText>Tentang Kami</TranslatedText>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Hide language and dark mode on mobile */}
          <LanguageSelector className="hidden md:flex" />
          <button
            className="hidden md:block hover:text-gray-400 transition-colors"
            onClick={toggleDark}
          >
            <Icon
              icon={
                isDark
                  ? "material-symbols:light-mode-rounded"
                  : "material-symbols:dark-mode-rounded"
              }
              className="text-2xl"
            />
          </button>

          {isUserAuthenticated() && session ? (
            <>
              {session.user?.role === "user" ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center gap-1.5 md:gap-2 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={getAvatarSource()}
                      alt="Profile"
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default_profile.png";
                      }}
                    />
                    <div className="hidden md:flex flex-col items-start">
                      <p className="text-sm font-semibold">
                        {shortenName(
                          profileData?.full_name ||
                            profileData?.username ||
                            session?.user?.name ||
                            session?.user?.email ||
                            "User"
                        )}
                      </p>
                    </div>
                    <Icon
                      icon="majesticons:chevron-down-line"
                      fontSize={14}
                      className={`${
                        showDropdown
                          ? "-rotate-180 transition-transform"
                          : "transition-transform"
                      } md:text-base`}
                    />
                  </div>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        key="profile-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-3 w-56 ${isDark ? "bg-[#1A1A1A] shadow-2xl shadow-blue-500/20" : "bg-white"} rounded-xl shadow-xl py-3 z-50`}
                      >
                        {" "}
                        <ul
                          className={`text-sm ${isDark ? "text-white" : "text-black"} flex flex-col`}
                        >
                          {" "}
                          <Link
                            href="/profile"
                            className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                          >
                            {" "}
                            <Icon icon="iconamoon:profile-fill" fontSize={18} />
                            <TranslatedText>Profil Saya</TranslatedText>
                          </Link>
                          <Link
                            href="/settings"
                            className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                          >
                            <Icon icon="solar:settings-bold" fontSize={18} />
                            <TranslatedText>Pengaturan</TranslatedText>
                          </Link>
                          <button
                            onClick={toggleDark}
                            className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2 w-full text-left`}
                          >
                            <Icon
                              icon={
                                isDark
                                  ? "material-symbols:light-mode-rounded"
                                  : "ic:round-dark-mode"
                              }
                              fontSize={18}
                            />
                            <TranslatedText>
                              {isDark ? "Mode Terang" : "Mode Gelap"}
                            </TranslatedText>
                          </button>
                          <button
                            onClick={handleLogout}
                            className={`px-5 py-2 ${isDark ? "hover:bg-red-900/50" : "hover:bg-red-100"} text-red-500 cursor-pointer flex items-center gap-2 w-full text-left`}
                          >
                            <Icon icon="solar:logout-2-bold" fontSize={18} />
                            <TranslatedText>Keluar</TranslatedText>
                          </button>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="mobile-btn flex items-center gap-1.5 md:gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl md:rounded-3xl px-3 md:px-5 py-1.5 md:py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-xs md:text-base touch-target mobile-tap-highlight"
                  >
                    <Icon
                      icon="mynaui:home-solid"
                      fontSize={16}
                      className="md:text-xl"
                    />
                    <TranslatedText>Dasbor</TranslatedText>
                  </Link>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center gap-1.5 md:gap-2 cursor-pointer"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <img
                        src={getAvatarSource()}
                        alt="Profile"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default_profile.png";
                        }}
                      />
                      <div className="hidden md:flex flex-col items-start">
                        <p className="text-sm font-semibold">
                          {shortenName(
                            profileData?.full_name ||
                              profileData?.username ||
                              session?.user?.name ||
                              session?.user?.email ||
                              "User"
                          )}
                        </p>
                      </div>
                      <Icon
                        icon="majesticons:chevron-down-line"
                        fontSize={14}
                        className={`${
                          showDropdown
                            ? "-rotate-180 transition-transform"
                            : "transition-transform"
                        } md:text-base`}
                      />
                    </div>

                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          key="admin-profile-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute right-0 mt-3 w-56 ${isDark ? "bg-[#1A1A1A] shadow-2xl shadow-blue-500/20" : "bg-white"} rounded-xl shadow-xl py-3 z-50`}
                        >
                          <ul
                            className={`text-sm ${isDark ? "text-white" : "text-black"} flex flex-col`}
                          >
                            {" "}
                            <Link
                              href="/profile"
                              className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                            >
                              {" "}
                              <Icon
                                icon="iconamoon:profile-fill"
                                fontSize={18}
                              />
                              <TranslatedText>Profil Saya</TranslatedText>
                            </Link>
                            <Link
                              href="/settings"
                              className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                            >
                              <Icon icon="solar:settings-bold" fontSize={18} />
                              <TranslatedText>Pengaturan Akun</TranslatedText>
                            </Link>
                            <button
                              onClick={toggleDark}
                              className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2 w-full text-left`}
                            >
                              <Icon
                                icon={
                                  isDark
                                    ? "material-symbols:light-mode-rounded"
                                    : "ic:round-dark-mode"
                                }
                                fontSize={18}
                              />
                              <TranslatedText>
                                {isDark ? "Tema Terang" : "Tema Gelap"}
                              </TranslatedText>
                            </button>{" "}
                            <button
                              onClick={handleLogout}
                              className={`px-5 py-2 ${isDark ? "hover:bg-red-900/50" : "hover:bg-red-100"} text-red-500 cursor-pointer flex items-center gap-2 w-full text-left`}
                            >
                              <Icon icon="solar:logout-2-bold" fontSize={18} />
                              <TranslatedText>Keluar</TranslatedText>
                            </button>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}{" "}
            </>
          ) : (
            <div className="flex items-center">
              {isCheckingBackend ? (
                <div className="flex items-center justify-center w-16 md:w-20 h-8 md:h-10">
                  <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mobile-btn flex items-center gap-1.5 md:gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl md:rounded-3xl px-3 md:px-5 py-1.5 md:py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-xs md:text-base touch-target mobile-tap-highlight"
                >
                  <TranslatedText>Masuk</TranslatedText>
                  <Icon
                    icon="majesticons:login"
                    fontSize={16}
                    className="inline-block md:text-xl"
                  />
                </Link>
              )}
            </div>
          )}

          {/* Desktop Search Bar */}
          <div className="hidden md:block w-[280px]">
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                placeholder={searchPlaceholder}
                className={`w-full px-6 py-3 border ${isDark ? "border-gray-600 bg-[#1A1A1A] text-white placeholder:text-gray-400 shadow-lg shadow-blue-500/10" : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"} rounded-full focus:outline-[#367AF2] text-base transition-all duration-300 ${isSearchExpanded ? "z-50" : ""}`}
              />
              <Icon
                icon="material-symbols:search"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-300" : "text-black"} text-xl`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay with framer-motion animation */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu-overlay fixed inset-0 top-[100px] z-40 bg-black/40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring", bounce: 0.2 }}
              className={`absolute left-4 right-4 top-4 bottom-4 ${isDark ? "bg-[#1A1A1A]/95 text-white" : "bg-white/95 text-black"} shadow-xl rounded-2xl flex flex-col overflow-hidden mobile-menu-scroll`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1">
                {/* Main Navigation */}
                <Link
                  href="/"
                  className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon
                    icon="material-symbols:home-rounded"
                    fontSize={20}
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                  />
                  <span className="font-medium">
                    <TranslatedText>Beranda</TranslatedText>
                  </span>
                </Link>

                <Link
                  href="/about-us"
                  className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Icon
                    icon="material-symbols:info-rounded"
                    fontSize={20}
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                  />
                  <span className="font-medium">
                    <TranslatedText>Tentang Kami</TranslatedText>
                  </span>
                </Link>

                {/* Categories */}
                <div
                  className={`mt-4 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div className="px-3 mb-2">
                    <Link
                      href="/categories"
                      className={`text-xs ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"} font-medium`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <TranslatedText>Lihat Semua Kategori</TranslatedText>
                    </Link>
                  </div>
                  <div className="px-3">
                    <CategoriesDropdown
                      isMobile={true}
                      onCategoryClick={() => setShowMobileMenu(false)}
                    />
                  </div>
                </div>

                {/* Settings */}
                <div
                  className={`mt-4 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                >
                  <div
                    className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg`}
                  >
                    <Icon
                      icon="material-symbols:language"
                      fontSize={20}
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    />
                    <div className="flex-1">
                      <span className="font-medium text-sm">
                        <TranslatedText>Bahasa</TranslatedText>
                      </span>
                      <div className="mt-1">
                        <LanguageSelector showFullName />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      toggleDark();
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                  >
                    <Icon
                      icon={
                        isDark
                          ? "material-symbols:light-mode-rounded"
                          : "material-symbols:dark-mode-rounded"
                      }
                      fontSize={20}
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    />
                    <span className="font-medium">
                      <TranslatedText>
                        {isDark ? "Mode Terang" : "Mode Gelap"}
                      </TranslatedText>
                    </span>
                  </button>
                </div>

                {/* User Section */}
                {isUserAuthenticated() && session && (
                  <div
                    className={`mt-4 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div
                      className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-lg mb-2`}
                    >
                      <img
                        src={getAvatarSource()}
                        alt="Profile"
                        className="w-8 h-8 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/default_profile.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {shortenName(
                            profileData?.full_name ||
                              profileData?.username ||
                              session?.user?.name ||
                              session?.user?.email ||
                              "User"
                          )}
                        </p>
                        <p
                          className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>

                    {session?.user?.role === "admin" && (
                      <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon
                          icon="material-symbols:dashboard-rounded"
                          fontSize={20}
                          className={isDark ? "text-gray-300" : "text-gray-600"}
                        />
                        <span className="font-medium">
                          <TranslatedText>Dashboard</TranslatedText>
                        </span>
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon
                        icon="material-symbols:person-rounded"
                        fontSize={20}
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      />
                      <span className="font-medium">
                        <TranslatedText>Profil</TranslatedText>
                      </span>
                    </Link>

                    <Link
                      href="/settings"
                      className={`flex items-center gap-3 px-3 py-2.5 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} rounded-lg transition-colors`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon
                        icon="material-symbols:settings-rounded"
                        fontSize={20}
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                      />
                      <span className="font-medium">
                        <TranslatedText>Pengaturan</TranslatedText>
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-500 ${isDark ? "hover:bg-red-900/20" : "hover:bg-red-50"} rounded-lg transition-colors`}
                    >
                      <Icon
                        icon="material-symbols:logout-rounded"
                        fontSize={20}
                      />
                      <span className="font-medium">
                        <TranslatedText>Keluar</TranslatedText>
                      </span>
                    </button>
                  </div>
                )}

                {/* Login Button for Non-authenticated Users */}
                {!isUserAuthenticated() && (
                  <div
                    className={`mt-4 pt-3 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Icon
                        icon="material-symbols:login-rounded"
                        fontSize={18}
                      />
                      <TranslatedText>Masuk ke Akun</TranslatedText>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Bar */}
      <div className="w-full md:hidden px-4 mt-2">
        <div className="relative w-full">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder={searchPlaceholder}
            className={`search-input-mobile w-full px-4 py-2 border ${isDark ? "border-gray-600 bg-[#1A1A1A] text-white placeholder:text-gray-400 shadow-lg shadow-blue-500/10" : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"} rounded-full focus:outline-[#367AF2] text-sm transition-all duration-300 ${isSearchExpanded ? "z-50" : ""} responsive-transition`}
          />
          <Icon
            icon="material-symbols:search"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-300" : "text-black"}`}
          />
        </div>
      </div>

      {/* Search Sidebar */}
      <SearchSidebar
        isVisible={isSearchExpanded}
        searchQuery={searchQuery}
        searchResults={searchResults}
        isSearching={isSearching}
        isUserLoggedIn={isUserAuthenticated()}
        onSearchClick={(query) => {
          setSearchQuery(query);
          performSearch(query);
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }}
      />
    </nav>
  );
};
