"use client";
import { useAuth } from "@/hooks/useAuth";
import { useDarkMode } from "@/context/DarkModeContext";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface AdminOnlyGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminOnlyGuard({
  children,
  fallback,
}: AdminOnlyGuardProps) {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const { isDark } = useDarkMode();
  const router = useRouter();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  if (isLoading) {
    return (
      <div
        style={{
          height: navbarDashboardHeight
            ? `calc(100vh - ${navbarDashboardHeight}px)`
            : "100vh",
        }}
        className={`flex flex-col items-center justify-center w-full ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
      >
        <ClipLoader
          color={isDark ? "#3B82F6" : "#2563EB"}
          loading={true}
          size={48}
        />
        <p
          className={`text-sm mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          Memverifikasi akses admin...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div
        style={{
          height: navbarDashboardHeight
            ? `calc(100vh - ${navbarDashboardHeight}px)`
            : "100vh",
        }}
        className={`flex flex-col items-center justify-center w-full ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
      >
        <Icon
          icon="material-symbols:lock-outline"
          className={`w-16 h-16 mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
        />
        <h3
          className={`text-lg font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Akses Ditolak
        </h3>
        <p
          className={`text-sm text-center ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Anda harus login terlebih dahulu untuk mengakses halaman ini
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div
        style={{
          height: navbarDashboardHeight
            ? `calc(100vh - ${navbarDashboardHeight}px)`
            : "100vh",
        }}
        className={`flex flex-col items-center justify-center w-full p-6 ${
          isDark ? "bg-[#1A1A1A] text-white" : "bg-white text-black"
        }`}
      >
        <Icon
          icon="material-symbols:admin-panel-settings-outline"
          className="w-16 h-16 text-red-400 mb-4"
        />
        <h3 className="text-lg font-medium text-red-500 dark:text-red-400 mb-2">
          Akses Administrator Diperlukan
        </h3>
        <p
          className={`text-sm text-center max-w-md mb-6 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Halaman ini hanya dapat diakses oleh pengguna dengan role{" "}
          <span className="font-semibold">Administrator</span>.
          <br />
          Hubungi administrator sistem jika Anda memerlukan akses.
        </p>
        <div
          className={`p-4 border rounded-lg ${
            isDark
              ? "bg-yellow-900/20 border-yellow-800"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:info-outline"
              className={`w-5 h-5 ${
                isDark ? "text-yellow-400" : "text-yellow-600"
              }`}
            />
            <p
              className={`text-sm ${
                isDark ? "text-yellow-300" : "text-yellow-700"
              }`}
            >
              Role Anda saat ini:{" "}
              <span className="font-semibold capitalize">
                {user.role || "User"}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
