"use client";
import React, { useState, useEffect } from "react";
import TodayVisitCard from "@/components/admin/home/TodayVisitCard";
import PopularNewsCard from "@/components/admin/home/PopularNewsCard";
import TopEditorsCard from "@/components/admin/home/TopEditorsCard";
import QuickInfoCard from "@/components/admin/home/QuickInfoCard";
import VisitChartCard from "@/components/admin/home/VisitChartCard";
import { useDarkMode } from "@/context/DarkModeContext";

const popularNews = [
  "Manus AI Bikin Heboh, Lebih Hebat dari DeepSeek dan ChatGPT?",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
  "Apple mengatakan beberapa peningkatan AI pada Siri ditunda hingga 2026",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
  "Meta Luncurkan VR Headset Terbaru dengan Teknologi Eye Tracking",
];

const popularCategory = ["AI", "Teknologi", "Gaya Hidup", "Otomotif", "Gadget"];

const popularEditors = [
  {
    profile: "/images/profile.jpg",
    name: "Zane Nova",
    countArticles: 128,
  },
  {
    profile: "/images/profile.jpg",
    name: "Isla Pierce",
    countArticles: 80,
  },
  {
    profile: "/images/profile.jpg",
    name: "Jaxon Quill",
    countArticles: 70,
  },
];

const fastInfo = {
  totalPublishedArticles: 15,
  totalNewComments: 20,
  totalVisitors: 100,
  totalActiveUsers: 50,
};

export default function Home() {
  const { isDark } = useDarkMode();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");
    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  return (
    <div
      className={`${
        isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
      } rounded-none md:rounded-4xl w-full h-full transition-colors duration-300 overflow-auto`}
      style={{
        height: `calc(100vh - ${navbarDashboardHeight}px)`,
        minHeight: "600px",
      }}
    >
      <div className="flex flex-col gap-3 md:gap-5 justify-start items-start w-full p-4 md:p-6 pb-6">
        {/* First Row - Today's Visit and Popular News */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 md:gap-5 w-full h-auto">
          <div className="lg:col-span-6 h-full">
            <TodayVisitCard visitCount={239} lastUpdated="16:00 WIB" />
          </div>
          <div className="lg:col-span-4 h-full">
            <PopularNewsCard
              newsList={popularNews}
              category={popularCategory}
            />
          </div>
        </div>
        {/* Second Row - Chart, Editors, and Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 w-full">
          <div className="lg:col-span-1 h-full">
            <VisitChartCard />
          </div>
          <div className="lg:col-span-1 h-full">
            <TopEditorsCard editors={popularEditors} />
          </div>
          <div className="lg:col-span-1 h-full">
            <QuickInfoCard info={fastInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}
