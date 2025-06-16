/* eslint-disable @next/next/no-img-element */
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/context/DarkModeContext";

interface NewsInterest {
  label: string;
}

interface ProfileCardProps {
  name: string;
  role: string;
  email: string;
  shortBio: string;
  profilePicture: string;
  newsInterests: NewsInterest[];
  joinedDate?: string;
}

export default function ProfileCard({
  name,
  role,
  email,
  shortBio,
  profilePicture,
  newsInterests,
  joinedDate,
}: ProfileCardProps) {
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { isDark } = useDarkMode();

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return "Bergabung sejak 19 Maret 2025";

    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `Bergabung sejak ${day} ${month} ${year}`;
  };

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
      checkIsMobile();
    };

    checkIsMobile();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (isMobile) {
    return (
      <div
        className={`w-full rounded-2xl shadow-lg border-2 overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-[#E1E1E1]"
        }`}
      >
        <div
          className="w-full h-20 relative"
          style={{
            background:
              "url('/images/pattern.png'), linear-gradient(to bottom right, #2FAACC, #2B62C2)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {" "}
          <div className="absolute -bottom-8 left-6">
            <img
              src={profilePicture}
              alt="Profile"
              className={`w-16 h-16 rounded-full border-4 shadow-lg ${
                isDark ? "border-gray-700" : "border-white"
              }`}
            />
          </div>
        </div>

        <div className="px-6 pt-10 pb-6">
          <div className="mb-4">
            {" "}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2
                  className={`text-lg font-bold mb-1 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {name}
                </h2>
                <p
                  className={`text-sm mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {email}
                </p>
              </div>

              <div className="ml-4">
                {role == "reader" ? (
                  <div className="flex items-center gap-1.5 bg-[#367AF2]/15 border border-[#367AF2] rounded-full px-3 py-1.5">
                    <Icon
                      icon="fa-solid:book-reader"
                      fontSize={16}
                      color="#367AF2"
                    />
                    <p className="text-xs font-semibold text-[#367AF2]">
                      Pembaca
                    </p>
                  </div>
                ) : role == "contributor" ? (
                  <div className="flex items-center gap-1.5 bg-[#F97316]/15 border border-[#F97316] rounded-full px-3 py-1.5">
                    <Icon
                      icon="mingcute:pen-fill"
                      fontSize={16}
                      color="#F97316"
                    />
                    <p className="text-xs font-semibold text-[#F97316]">
                      Kontributor
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-[#FF0000]/15 border border-[#FF0000] rounded-full px-3 py-1.5">
                    <Icon
                      icon="material-symbols:admin-panel-settings-rounded"
                      fontSize={16}
                      color="#FF0000"
                    />
                    <p className="text-xs font-semibold text-[#FF0000]">
                      Admin
                    </p>
                  </div>
                )}
              </div>
            </div>{" "}
            <p
              className={`text-sm leading-relaxed mb-3 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {shortBio}
            </p>
            <p
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-400"
              }`}
            >
              {formatJoinedDate(joinedDate)}
            </p>
          </div>{" "}
          <div className="w-full">
            <h3
              className={`text-sm font-semibold mb-2 ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Minat Berita
            </h3>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {newsInterests.map((interest, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#3BD5FF] to-[#367AF2] text-white text-xs font-medium"
                >
                  {interest.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`flex flex-col items-center justify-between w-80 rounded-3xl shadow-lg border-2 text-black relative z-10 overflow-hidden ${
          isDark
            ? "bg-gray-800 border-gray-600 text-white"
            : "bg-white border-[#E1E1E1] text-black"
        }`}
        style={{ height: `calc(100vh - ${navbarHeight}px - 40px)` }}
      >
        <div
          className="w-full h-32 absolute top-0 left-0 z-0"
          style={{
            background:
              "url('/images/pattern.png'), linear-gradient(to bottom right, #2FAACC, #2B62C2)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />{" "}
        <div className="flex flex-col items-center relative z-10 pt-16 px-8">
          <img
            src={profilePicture}
            alt="Profile"
            className={`w-24 h-24 rounded-full border-4 shadow-lg ${
              isDark ? "border-gray-700" : "border-white"
            }`}
          />
          <h2
            className={`text-2xl text-center font-bold mt-4 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {name}
          </h2>
          <p
            className={`text-base text-center opacity-40 ${
              isDark ? "text-gray-300" : "text-black"
            }`}
          >
            {email}
          </p>
          {role == "reader" ? (
            <div className="flex items-center gap-2 bg-[#367AF2]/15 border border-[#367AF2] rounded-full px-4 py-2 my-2.5">
              <Icon icon="fa-solid:book-reader" fontSize={20} color="#367AF2" />
              <p className="text-sm font-semibold text-[#367AF2]">Pembaca</p>
            </div>
          ) : role == "contributor" ? (
            <div className="flex items-center gap-2 bg-[#F97316]/15 border border-[#F97316] rounded-full px-4 py-2 my-2.5">
              <Icon icon="mingcute:pen-fill" fontSize={20} color="#F97316" />
              <p className="text-sm font-semibold text-[#F97316]">
                Kontributor
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#FF0000]/15 border border-[#FF0000] rounded-full px-4 py-2 my-2.5">
              <Icon
                icon="material-symbols:admin-panel-settings-rounded"
                fontSize={20}
                color="#FF0000"
              />
              <p className="text-sm font-semibold text-[#FF0000]">Admin</p>
            </div>
          )}{" "}
          <p
            className={`text-base font-light opacity-40 mt-2 text-center ${
              isDark ? "text-gray-300" : "text-black"
            }`}
          >
            {shortBio}
          </p>
          <div className="mt-4 w-full">
            <div className="grid grid-cols-2 gap-2 mt-2 w-full">
              {newsInterests.map((interest, index) => (
                <div
                  key={index}
                  title={interest.label}
                  className="flex items-center justify-center text-sm px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                >
                  <p className="truncate">{interest.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>{" "}
        <p
          className={`opacity-30 text-sm pb-8 text-center ${
            isDark ? "text-gray-300" : "text-black"
          }`}
        >
          {formatJoinedDate(joinedDate)}
        </p>
      </div>
    </div>
  );
}
