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

export const Navbar = () => {
  const { isDark, toggleDark } = useDarkMode();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);
  useEffect(() => {
    const checkBackendConnection = async () => {
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
    };

    checkBackendConnection();
  }, [status]);

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
  useEffect(() => {
    const fetchProfileData = async () => {
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
    };

    fetchProfileData();

    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [status, isBackendConnected]);

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
  };

  const isUserAuthenticated = () => {
    return (
      status === "authenticated" &&
      session &&
      isBackendConnected &&
      !isCheckingBackend
    );
  };
  return (
    <nav
      id="navbar"
      className={`flex flex-col md:flex-row justify-start gap-2 md:gap-4 items-center p-4 fixed top-0 w-full px-4 md:px-8 z-50 ${isDark ? "bg-[#1A1A1A] text-white shadow-2xl shadow-blue-500/10" : "bg-white text-black"} transition-all duration-300`}
    >
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-4 md:gap-10">
          {/* Logo + Hamburger (mobile) dalam satu div */}
          <div className="flex items-center gap-2 md:gap-0">
            {/* Hamburger menu for mobile, posisinya di samping logo */}
            <button
              className="md:hidden flex items-center px-2 py-1 ml-1"
              aria-label="Menu"
              onClick={() => setShowMobileMenu((v) => !v)}
            >
              <Icon icon="mingcute:menu-fill" className="text-2xl" />
            </button>
            <Link
              href="/"
              className={`text-lg font-bold md:px-6 py-2 rounded-full ${
                pathname === "/profile" ? "bg-white" : ""
              }`}
            >
              <Image
                src="/images/newsinsight-icon.png"
                alt="Logo"
                width={36}
                height={36}
                className="inline-block mr-2"
              />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
                NewsInsight
              </span>
            </Link>
          </div>
          {/* Desktop menu */}
          <ul className="hidden md:flex space-x-10">
            <li>
              <div className="hover:text-gray-400 flex items-center gap-2 cursor-pointer">
                <div>Kategori</div>
                <Icon icon="mingcute:down-line" className="inline-block" />
              </div>
            </li>
            <li>
              <a href="/about-us" className="hover:text-gray-400">
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          {/* Hide language and dark mode on mobile */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer hover:text-gray-400">
            <p>ID</p>
            <Icon icon="mingcute:down-line" className="inline-block" />
          </div>{" "}
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
          </button>{" "}
          {isUserAuthenticated() && session ? (
            <>
              {session.user?.role === "user" ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={getAvatarSource()}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
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
                      fontSize={16}
                      className={
                        showDropdown
                          ? "-rotate-180 transition-transform"
                          : "transition-transform"
                      }
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
                            <Icon icon="iconamoon:profile-fill" fontSize={18} />
                            Profil Saya
                          </Link>
                          <Link
                            href="/settings"
                            className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                          >
                            <Icon icon="solar:settings-bold" fontSize={18} />
                            Pengaturan
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
                            {isDark ? "Mode Terang" : "Mode Gelap"}
                          </button>{" "}
                          <button
                            onClick={handleLogout}
                            className={`px-5 py-2 ${isDark ? "hover:bg-red-900/50" : "hover:bg-red-100"} text-red-500 cursor-pointer flex items-center gap-2 w-full text-left`}
                          >
                            <Icon icon="solar:logout-2-bold" fontSize={18} />
                            Keluar
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
                    className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2 md:py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
                  >
                    <Icon icon="mynaui:home-solid" fontSize={20} />
                    <p>Dashboard</p>
                  </Link>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <img
                        src={getAvatarSource()}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
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
                        fontSize={16}
                        className={
                          showDropdown
                            ? "-rotate-180 transition-transform"
                            : "transition-transform"
                        }
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
                            <Link
                              href="/profile"
                              className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                            >
                              <Icon
                                icon="iconamoon:profile-fill"
                                fontSize={18}
                              />
                              Profil Saya
                            </Link>
                            <Link
                              href="/settings"
                              className={`px-5 py-2 ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} cursor-pointer flex items-center gap-2`}
                            >
                              <Icon icon="solar:settings-bold" fontSize={18} />
                              Pengaturan
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
                              {isDark ? "Mode Terang" : "Mode Gelap"}
                            </button>
                            <button
                              onClick={handleLogout}
                              className={`px-5 py-2 ${isDark ? "hover:bg-red-900/50" : "hover:bg-red-100"} text-red-500 cursor-pointer flex items-center gap-2 w-full text-left`}
                            >
                              <Icon icon="solar:logout-2-bold" fontSize={18} />
                              Keluar
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
                <div className="flex items-center justify-center w-20 h-10">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-500"></div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2 md:py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
                >
                  <p>Masuk</p>
                  <Icon
                    icon="majesticons:login"
                    fontSize={20}
                    className="inline-block"
                  />
                </Link>
              )}
            </div>
          )}
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
            className="fixed inset-0 top-[64px] z-40 bg-black/40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            {" "}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring", bounce: 0.2 }}
              className={`absolute left-0 right-0 top-0 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"} shadow-lg rounded-b-2xl flex flex-col gap-2 py-4 px-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href="/"
                className="py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Beranda
              </Link>
              <Link
                href="/about-us"
                className="py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Tentang Kami
              </Link>
              <div className="py-2 flex items-center gap-2">
                <span>Kategori</span>
                <Icon icon="mingcute:down-line" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search bar: mobile di bawah, desktop di tengah */}
      <div className="w-full md:w-[280px] mx-auto mt-2 md:mt-0 order-2 md:order-none">
        <div className="relative w-full">
          {" "}
          <input
            type="text"
            placeholder="Cari berita..."
            className={`w-full px-5 md:px-6 py-2.5 md:py-3 border ${isDark ? "border-gray-600 bg-[#1A1A1A] text-white placeholder:text-gray-400 shadow-lg shadow-blue-500/10" : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"} rounded-full focus:outline-[#367AF2] text-sm md:text-base transition-all duration-300`}
          />
          <Icon
            icon="material-symbols:search-rounded"
            fontSize={22}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? "text-gray-300" : "text-black"}`}
          />
        </div>
      </div>
    </nav>
  );
};
