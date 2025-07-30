"use client";
import React, { useState, useEffect, useCallback } from "react";
import TodayVisitCard from "@/components/admin/home/TodayVisitCard";
import PopularNewsCard from "@/components/admin/home/PopularNewsCard";
import TopEditorsCard from "@/components/admin/home/TopEditorsCard";
import QuickInfoCard from "@/components/admin/home/QuickInfoCard";
import VisitChartCard from "@/components/admin/home/VisitChartCard";
import { useDarkMode } from "@/context/DarkModeContext";
import { useSession } from "next-auth/react";

interface NewsItem {
  id: number;
  title: string;
  hashed_id: string;
  featured_image: string;
  category_name: string;
  view_count: number;
}

interface DashboardStats {
  quickInfo: {
    totalPublishedArticles: number;
    totalNewComments: number;
    totalVisitors: number;
    totalActiveUsers: number;
  };
  todayVisits: {
    count: number;
    lastUpdated: string;
  };
  popularNews: NewsItem[];
  topEditors: {
    id: number;
    name: string;
    avatar: string | null;
    countArticles: number;
  }[];
}

export default function Home() {
  const { isDark } = useDarkMode();
  const { data: session } = useSession();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await fetch("/api/dashboard/stats");
      if (!statsResponse.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const statsData = await statsResponse.json();

      if (statsData.status === "success") {
        setDashboardStats(statsData.data);
      } else {
        throw new Error(statsData.message || "Failed to fetch dashboard stats");
      }

      // Fetch popular categories
      const categoriesResponse = await fetch(
        "/api/dashboard/popular-categories"
      );

      if (categoriesResponse.ok) {
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.status === "success") {
          setPopularCategories(categoriesResult.data.popularCategories);
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");
    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  useEffect(() => {
    if (session?.backendToken) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, session?.backendToken]);

  // Show loading state
  if (loading) {
    return (
      <div
        className={`${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        } rounded-none md:rounded-4xl w-full h-full transition-colors duration-300 overflow-auto flex items-center justify-center`}
        style={{
          height: `calc(100vh - ${navbarDashboardHeight}px)`,
          minHeight: "600px",
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Memuat data dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        } rounded-none md:rounded-4xl w-full h-full transition-colors duration-300 overflow-auto flex items-center justify-center`}
        style={{
          height: `calc(100vh - ${navbarDashboardHeight}px)`,
          minHeight: "600px",
        }}
      >
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p
            className={`text-lg mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            Gagal memuat data dashboard
          </p>
          <p
            className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {error}
          </p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Transform top editors data to match expected interface
  const transformedEditors =
    dashboardStats?.topEditors?.map((editor) => ({
      profile: editor.avatar || "/images/default_profile.png",
      name: editor.name,
      countArticles: editor.countArticles,
    })) || [];

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
            <TodayVisitCard
              visitCount={dashboardStats?.todayVisits.count || 0}
              lastUpdated={
                dashboardStats?.todayVisits.lastUpdated || "Loading..."
              }
            />
          </div>
          <div className="lg:col-span-4 h-full">
            <PopularNewsCard
              newsList={dashboardStats?.popularNews || []}
              category={popularCategories}
            />
          </div>
        </div>
        {/* Second Row - Chart, Editors, and Quick Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 w-full">
          <div className="lg:col-span-1 h-full">
            <VisitChartCard />
          </div>
          <div className="lg:col-span-1 h-full">
            <TopEditorsCard editors={transformedEditors} />
          </div>
          <div className="lg:col-span-1 h-full">
            <QuickInfoCard
              info={
                dashboardStats?.quickInfo || {
                  totalPublishedArticles: 0,
                  totalNewComments: 0,
                  totalVisitors: 0,
                  totalActiveUsers: 0,
                }
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
