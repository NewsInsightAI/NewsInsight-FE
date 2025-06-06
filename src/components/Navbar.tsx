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
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  
  React.useEffect(() => {
    console.log("Navbar session check:", {
      hasSession: !!session,
      userEmail: session?.user?.email,
      userRole: session?.user?.role,
      backendUser: session?.backendUser
    });
  }, [session]);

  
  const getAvatarSource = () => {
    if (profileAvatar) {
      return getAvatarUrl(profileAvatar, session?.user?.image || "/images/default_profile.png");
    }
    if (session?.user?.image) {
      return session.user.image;
    }
    return "/images/default_profile.png";
  };

  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "authenticated") {
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
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };

    fetchProfileData();

    
    const handleProfileUpdate = () => {
      fetchProfileData();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [status]);

  
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
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  let bgColor = "white text-black";
  if (pathname === "/profile") {
    bgColor = "transparent text-white";
  } else {
    bgColor = "bg-white text-black shadow-md";
  }

  return (
    <nav
      id="navbar"
      className={`flex flex-col md:flex-row justify-start gap-2 md:gap-4 items-center p-4 fixed top-0 w-full px-4 md:px-8 z-50 ${bgColor}`}
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
          </div>
          <button className="hidden md:block">
            <Icon
              icon="material-symbols:dark-mode-rounded"
              className="text-2xl"
            />
          </button>

          {session ? (
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
                        {shortenName(profileData?.full_name || profileData?.username || session?.user?.name || session?.user?.email || "User")}
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
                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-3 z-50"
                      >
                        <ul className="text-sm text-black flex flex-col">
                          <Link
                            href="/profile"
                            className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            <Icon icon="iconamoon:profile-fill" fontSize={18} />
                            Profil Saya
                          </Link>
                          <Link
                            href="/dashboard"
                            className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            <Icon icon="mynaui:home-solid" fontSize={18} />
                            Dashboard
                          </Link>
                          <Link
                            href="#"
                            className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            <Icon icon="ic:round-dark-mode" fontSize={18} />
                            Mode Gelap
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="px-5 py-2 hover:bg-red-100 text-red-500 cursor-pointer flex items-center gap-2 w-full text-left"
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
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 rounded-3xl px-4 md:px-5 py-2 md:py-2.5 hover:bg-gray-50 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base"
                  >
                    <Icon icon="solar:logout-2-bold" fontSize={20} />
                    <p>Keluar</p>
                  </button>
                </div>
              )}
            </>
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
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25, type: "spring", bounce: 0.2 }}
              className="absolute left-0 right-0 top-0 bg-white text-black shadow-lg rounded-b-2xl flex flex-col gap-2 py-4 px-6"
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
              
              {/* Mobile menu buttons - conditional based on session and role */}
              {session ? (
                <>
                  {session.user?.role === "user" ? (
                    
                    <>
                      <Link
                        href="/profile"
                        className="py-2 flex items-center gap-2"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon icon="iconamoon:profile-fill" fontSize={20} />
                        <span>Profil Saya</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        className="py-2 flex items-center gap-2"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon icon="mynaui:home-solid" fontSize={20} />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          handleLogout();
                        }}
                        className="py-2 flex items-center gap-2 text-left"
                      >
                        <Icon icon="solar:logout-2-bold" fontSize={20} />
                        <span>Keluar</span>
                      </button>
                    </>
                  ) : (
                    
                    <>
                      <Link
                        href="/dashboard"
                        className="py-2 flex items-center gap-2"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon icon="mynaui:home-solid" fontSize={20} />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          handleLogout();
                        }}
                        className="py-2 flex items-center gap-2 text-left"
                      >
                        <Icon icon="solar:logout-2-bold" fontSize={20} />
                        <span>Keluar</span>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Masuk
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search bar: mobile di bawah, desktop di tengah */}
      <div className="w-full md:w-[280px] mx-auto mt-2 md:mt-0 order-2 md:order-none">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Cari berita..."
            className={`w-full px-5 md:px-6 py-2.5 md:py-3 border border-[#E2E2E2] rounded-full placeholder:text-[#818181] focus:outline-[#367AF2] text-sm md:text-base ${
              pathname === "/profile" ? "bg-white" : ""
            }`}
          />
          <Icon
            icon="material-symbols:search-rounded"
            fontSize={22}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
          />
        </div>
      </div>
    </nav>
  );
};
