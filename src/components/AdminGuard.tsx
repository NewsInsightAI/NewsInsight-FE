"use client";
import { useAuth } from "@/hooks/useAuth";
import { useDarkMode } from "@/context/DarkModeContext";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const { isDark } = useDarkMode();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <ClipLoader
          color={isDark ? "#3B82F6" : "#2563EB"}
          loading={true}
          size={40}
        />
        <p
          className={`text-sm mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          Memverifikasi akses...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Icon
          icon="material-symbols:lock-outline"
          className="w-16 h-16 text-gray-400 mb-4"
        />
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
          Akses Ditolak
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
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
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
        <Icon
          icon="material-symbols:admin-panel-settings-outline"
          className="w-16 h-16 text-red-400 mb-4"
        />
        <h3 className="text-lg font-medium text-red-500 dark:text-red-400 mb-2">
          Akses Admin Diperlukan
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-md">
          Halaman ini hanya dapat diakses oleh pengguna dengan role
          Administrator.
          <br />
          Hubungi administrator sistem jika Anda memerlukan akses.
        </p>
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon
              icon="material-symbols:info-outline"
              className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
            />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Role Anda saat ini:{" "}
              <span className="font-semibold">{user.role || "User"}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
