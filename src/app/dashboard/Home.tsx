"use client";
import React, { useState, useEffect } from "react";
import TodayVisitCard from "@/components/admin/home/TodayVisitCard";
import PopularNewsCard from "@/components/admin/home/PopularNewsCard";
import TopEditorsCard from "@/components/admin/home/TopEditorsCard";
import QuickInfoCard from "@/components/admin/home/QuickInfoCard";
import VisitChartCard from "@/components/admin/home/VisitChartCard";

const popularNews = [
  "Manus AI Bikin Heboh, Lebih Hebat dari DeepSeek dan ChatGPT?",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
  "Apple mengatakan beberapa peningkatan AI pada Siri ditunda hingga 2026",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
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
      className="flex flex-col gap-6 justify-start items-start bg-white text-black rounded-4xl w-full h-full p-6"
      style={{ height: `calc(100vh - ${navbarDashboardHeight}px)` }}
    >
      <div className="grid grid-cols-10 gap-6 w-full h-full">
        <TodayVisitCard visitCount={239} lastUpdated="16:00 WIB" />
        <PopularNewsCard newsList={popularNews} category={popularCategory} />
      </div>

      <div className="grid grid-cols-12 gap-6 w-full">
        <VisitChartCard />
        <TopEditorsCard editors={popularEditors} />
        <QuickInfoCard info={fastInfo} />
      </div>
    </div>
  );
}
