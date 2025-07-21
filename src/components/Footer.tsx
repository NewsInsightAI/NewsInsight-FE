"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Manrope } from "next/font/google";
import { usePathname } from "next/navigation";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

const manropeFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const menuItems = [
  {
    section: "KATEGORI",
    items: [
      "Nasional",
      "Internasional",
      "Politik",
      "Ekonomi",
      "Teknologi",
      "Gaya Hidup",
      "Hiburan",
      "Olahraga",
    ],
  },
  {
    section: "INFORMASI HUKUM",
    items: ["Syarat dan Ketentuan", "Kebijakan Privasi", "Hak Cipta"],
  },
  {
    section: "TENTANG KAMI",
    items: [
      "Profil Redaksi",
      "Pedoman Media Siber",
      "Kode Etik Jurnalistik",
      "Disclaimer",
      "Karier / Bergabung dengan Kami",
    ],
  },
];

export default function Footer() {
  const { isDark } = useDarkMode();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/profile/me");
        setIsLoggedIn(response.ok);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, []);

  const hideFooterRoutes = [
    "/dashboard",
    "/dashboard/news",
    "/dashboard/news/add",
    "/dashboard/news/edit",
    "/dashboard/categories",
    "/dashboard/users",
    "/dashboard/comments",
    "/login",
    "/register",
    "/profile",
    "/login/complete-profile",
    "/reset-password",
    "/settings/profile",
    "/settings/personal-data",
    "/settings/account-security",
  ];

  const isShowFooter =
    !hideFooterRoutes.includes(pathname) &&
    !pathname.startsWith("/dashboard/news/edit/");

  if (!isShowFooter) return null;
  return (
    <footer
      className={`flex flex-col gap-4 md:gap-6 p-4 md:p-6 ${isDark ? "bg-[#1A1A1A]" : "bg-white"} transition-colors duration-300`}
    >
      {/* DAFTAR SEKARANG - Only show when not logged in */}
      {!isLoggedIn && (
        <div className="relative text-white px-6 md:px-12 py-6 md:py-8 rounded-2xl md:rounded-3xl font-normal overflow-hidden flex justify-center items-center gap-4 md:gap-10 min-h-[200px] md:h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] z-0" />{" "}
          <Image
            src="/images/newsinsight-fullwhite.png"
            alt="News"
            width={50}
            height={50}
            className="object-cover opacity-50 absolute -bottom-2 md:-bottom-4 -left-1 md:-left-2 w-[50px] md:w-[70px] h-[50px] md:h-[70px] footer-logo-bounce hover:scale-125 transition-all duration-300 cursor-pointer"
            style={
              {
                "--rotation": "-13deg",
              } as React.CSSProperties
            }
          />
          <div className="relative z-20 flex flex-col md:flex-row justify-between items-center w-full gap-6 md:gap-0">
            <div className="relative text-center md:text-left">
              {" "}
              <Image
                src="/images/newsinsight-fullwhite.png"
                alt="News"
                width={50}
                height={50}
                className="object-cover opacity-50 absolute -top-2 md:-top-4 -right-8 md:-right-20 w-[50px] md:w-[70px] h-[50px] md:h-[70px] hidden md:block footer-logo-wiggle hover:scale-125 transition-all duration-300 cursor-pointer"
                style={
                  {
                    animationDelay: "2s",
                    "--rotation": "22deg",
                  } as React.CSSProperties
                }
              />{" "}
              <p className="font-bold text-xl md:text-[32px] w-full md:w-[420px] leading-tight md:leading-12">
                <TranslatedText>
                  Ingin terus update dengan berita terbaik kami?
                </TranslatedText>
              </p>
            </div>{" "}
            <button className="px-6 md:px-7 py-3 md:py-4 rounded-full border-2 border-white/60 text-white font-medium text-sm md:text-base hover:bg-white/30 hover:scale-105 hover:border-white transition-all duration-300 ease-in-out cursor-pointer whitespace-nowrap transform hover:shadow-lg hover:shadow-white/20">
              <TranslatedText>DAFTAR SEKARANG</TranslatedText>
            </button>
          </div>
        </div>
      )}

      <div className="relative text-white px-6 md:px-12 py-6 md:py-8 rounded-2xl md:rounded-3xl font-normal overflow-hidden flex flex-col gap-6 md:gap-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] z-0" />
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 flex flex-col lg:flex-row justify-between items-start w-full gap-8 lg:gap-0">
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 w-full lg:w-auto">
            {" "}
            {menuItems.map((menu, index) => (
              <div key={index} className="flex flex-col gap-3 w-full md:w-40">
                <p className="font-bold text-sm md:text-base">
                  <TranslatedText>{menu.section}</TranslatedText>
                </p>
                <hr className="border-white/60" />
                <ul
                  className={`flex flex-col gap-2 md:gap-3 font-medium ${manropeFont.className}`}
                >
                  {menu.items.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm md:text-base cursor-pointer hover:underline"
                    >
                      <TranslatedText>{item}</TranslatedText>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 w-full lg:w-fit">
            <p className="font-bold text-sm md:text-base">
              <TranslatedText>HUBUNGI KAMI</TranslatedText>
            </p>
            <hr className="border-white/60" />
            <ul
              className={`flex flex-col gap-2 md:gap-3 items-start font-medium ${manropeFont.className}`}
            >
              <li className="flex items-center gap-3 md:gap-4 text-sm md:text-base cursor-pointer hover:underline">
                <Icon
                  icon="ic:round-email"
                  className="text-xl md:text-2xl flex-shrink-0"
                />
                <p className="break-all md:break-normal">
                  helpdesk@newsinsight.id
                </p>
              </li>
              <li className="flex items-center gap-3 md:gap-4 text-sm md:text-base cursor-pointer hover:underline">
                <Icon
                  icon="ic:round-phone"
                  className="text-xl md:text-2xl flex-shrink-0"
                />
                <p>+62 81234567890</p>
              </li>
              <li className="flex items-start gap-3 md:gap-4 text-sm md:text-base cursor-pointer hover:underline">
                <Icon
                  icon="ph:map-pin-fill"
                  className="text-xl md:text-2xl flex-shrink-0 mt-0.5"
                />
                <p>Jl. Contoh No. 88, Jakarta Pusat</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center pt-4 border-t border-white/60">
          <div className="flex items-center justify-center md:justify-start gap-2 order-2 md:order-1">
            <Image
              src="/images/newsinsight-fullwhite.png"
              alt="Logo"
              width={20}
              height={20}
            />
            <p className="font-bold text-sm md:text-base">NewsInsight</p>
          </div>

          <p className="text-xs md:text-sm order-1 md:order-2">
            &copy; {new Date().getFullYear()} NewsInsight. All rights reserved.
          </p>

          <div className="flex justify-center md:justify-end items-center gap-3 md:gap-4 order-3">
            <Icon
              icon="ri:twitter-x-fill"
              className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform"
            />
            <Icon
              icon="ri:instagram-fill"
              className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform"
            />
            <Icon
              icon="ri:linkedin-fill"
              className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform"
            />
            <Icon
              icon="ri:youtube-fill"
              className="text-xl md:text-2xl cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
