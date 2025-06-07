/* eslint-disable @next/next/no-img-element */
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
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

const basePath = "/dashboard";

const listMenu = [
  { label: "Dasbor", href: `${basePath}`, icon: "mynaui:home-solid" },
  { label: "Berita", href: `${basePath}/news`, icon: "ph:newspaper" },
  {
    label: "Kategori",
    href: `${basePath}/categories`,
    icon: "iconamoon:category",
  },
  {
    label: "Komentar",
    href: `${basePath}/comments`,
    icon: "fluent:chat-24-regular",
  },
  {
    label: "Pengguna",
    href: `${basePath}/users`,
    icon: "solar:user-outline",
  },
];

export default function NavbarDashboard() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [profileAvatar, setProfileAvatar] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  
  
  const getAvatarSource = () => {
    if (profileAvatar) {
      console.log("Using profile avatar");
      return getAvatarUrl(profileAvatar, session?.user?.image || "/images/default_profile.png");
    }
    if (session?.user?.image) {
      console.log("Using Google session avatar");
      return session.user.image;
    }
    console.log("Using default avatar");
    return "/images/default_profile.png";
  };

  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/profile/me");
          const result = await response.json();
          
          console.log("Profile API response:", result); 
          
          if (response.ok && result.status === "success") {
            setProfileData(result.data);
            if (result.data?.avatar) {
              console.log("Setting profile avatar:", result.data.avatar.substring(0, 50) + "..."); 
              setProfileAvatar(result.data.avatar);
            } else {
              console.log("No avatar in profile data, using fallback"); 
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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <div className="flex items-center gap-1 bg-[#6366F1] text-white border border-[#6366F1] px-3 py-1 rounded-full">
            <Icon icon="eos-icons:admin" fontSize={14} />
            <p className="text-xs">Admin</p>
          </div>
        );
      case "editor":
        return (
          <div className="flex items-center gap-1 bg-[#22C55E] text-white border border-[#22C55E] px-3 py-1 rounded-full">
            <Icon icon="ic:round-person" fontSize={14} />
            <p className="text-xs">Editor</p>
          </div>
        );
      case "contributor":
        return (
          <div className="flex items-center gap-1 bg-[#F97316] text-white border border-[#F97316] px-3 py-1 rounded-full">
            <Icon icon="mingcute:pen-fill" fontSize={14} />
            <p className="text-xs">Kontributor</p>
          </div>
        );
      case "user":
        return (
          <div className="flex items-center gap-1 bg-[#64748B] text-white border border-[#64748B] px-3 py-1 rounded-full">
            <Icon icon="solar:user-outline" fontSize={14} />
            <p className="text-xs">User</p>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-[#64748B] text-white border border-[#64748B] px-3 py-1 rounded-full">
            <Icon icon="solar:user-outline" fontSize={14} />
            <p className="text-xs">User</p>
          </div>
        );
    }
  };
  const handleLogout = async () => {
    // Get the current origin for callback URL
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://newsinsight.space';
    const callbackUrl = `${currentOrigin}/login`;
    
    await signOut({
      redirect: true,
      callbackUrl: callbackUrl,
    });
    });
  };

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

  return (
    <nav
      id="navbar-dashboard"
      className={`flex justify-between items-center p-4 fixed top-0 w-full px-8 z-50 bg-[#1A1A1A] text-white`}
    >
      <Link href="/" className={`text-lg font-bold px-6 py-2 rounded-full`}>
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
      <div className="flex items-center gap-4">
        <ul className="flex space-x-2">
          {listMenu.map((menu) => {
            const isDashboard = menu.href === basePath;
            const isActive = isDashboard
              ? pathname === basePath
              : pathname.startsWith(menu.href);

            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  className={`flex items-center gap-2 text-white px-5 py-3 rounded-full ${
                    isActive
                      ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] font-bold"
                      : "bg-[#2C2C2C] hover:bg-[#3A3A3A] transition duration-300 ease-in-out"
                  }`}
                >
                  <Icon icon={menu.icon} fontSize={20} />
                  <p className="text-sm">{menu.label}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img
            src={getAvatarSource()}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              console.log("Image load error, falling back to default");
              const target = e.target as HTMLImageElement;
              target.src = "/images/default_profile.png";
            }}
          />
          <div className="flex flex-col items-start gap-1.5">
            <p className="text-sm font-semibold">
              {shortenName(profileData?.full_name || profileData?.username || session?.user?.name || session?.user?.email || "User")}
            </p>
            {getRoleBadge(session?.user?.role || "user")}
          </div>
          <Icon
            icon="majesticons:chevron-down-line"
            fontSize={16}
            color="white"
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
                  href="/dashboard/settings/profile"
                  className="px-5 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                >
                  <Icon
                    icon="material-symbols:settings-rounded"
                    fontSize={18}
                  />
                  Pengaturan Akun
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
    </nav>
  );
}
