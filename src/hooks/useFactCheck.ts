import { useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";

interface FactCheckClaim {
  text: string;
  claimant: string;
  claimDate: string | null;
  reviewPublisher: string;
  reviewTitle: string;
  reviewUrl: string;
  rating: string;
  languageCode: string;
}

interface FactCheckResult {
  query: string;
  totalClaims: number;
  claims: FactCheckClaim[];
  trustScore: number | null;
  isVerified: boolean;
  checkedAt: string;
}

interface SingleFactCheckResponse {
  success: boolean;
  data?: {
    newsId: number;
    factCheck: FactCheckResult;
  };
  message?: string;
}

interface BatchFactCheckItem {
  id: number;
  query: string;
  languageCode?: string;
}

interface BatchFactCheckResult {
  newsId: number;
  success: boolean;
  factCheck?: FactCheckResult;
  error?: string;
}

interface BatchFactCheckResponse {
  success: boolean;
  data?: {
    totalChecked: number;
    results: BatchFactCheckResult[];
  };
  message?: string;
}

export const useFactCheck = () => {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const checkSingleNews = async (
    newsId: number,
    query: string,
    languageCode = "id"
  ): Promise<SingleFactCheckResponse | null> => {
    try {
      setLoading(true);
      const token = session?.backendToken;

      if (!token) {
        showToast("Token otentikasi tidak tersedia", "error");
        return null;
      }

      const response = await fetch(`/api/fact-check/${newsId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, languageCode }),
      });

      const data: SingleFactCheckResponse = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal melakukan fact check", "error");
        return data;
      }

      showToast("Fact check berhasil dilakukan", "success");
      return data;
    } catch (error) {
      console.error("Error during fact check:", error);
      showToast("Terjadi kesalahan saat melakukan fact check", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkBatchNews = async (
    newsItems: BatchFactCheckItem[]
  ): Promise<BatchFactCheckResponse | null> => {
    try {
      setLoading(true);
      const token = session?.backendToken;

      if (!token) {
        showToast("Token otentikasi tidak tersedia", "error");
        return null;
      }

      if (newsItems.length === 0) {
        showToast("Tidak ada berita yang dipilih untuk dicek", "info");
        return null;
      }

      if (newsItems.length > 10) {
        showToast("Maksimal 10 berita dapat dicek sekaligus", "info");
        return null;
      }

      const response = await fetch("/api/fact-check/batch-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsItems }),
      });

      const data: BatchFactCheckResponse = await response.json();

      if (!response.ok) {
        showToast(data.message || "Gagal melakukan batch fact check", "error");
        return data;
      }

      const successCount =
        data.data?.results.filter((r) => r.success).length || 0;
      const totalCount = data.data?.totalChecked || 0;

      showToast(
        `Fact check selesai: ${successCount}/${totalCount} berita berhasil dicek`,
        successCount === totalCount ? "success" : "info"
      );

      return data;
    } catch (error) {
      console.error("Error during batch fact check:", error);
      showToast("Terjadi kesalahan saat melakukan batch fact check", "error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFactCheckHistory = async (newsId: number) => {
    try {
      const token = session?.backendToken;

      if (!token) {
        showToast("Token otentikasi tidak tersedia", "error");
        return null;
      }

      const response = await fetch(`/api/fact-check/${newsId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Gagal mengambil riwayat fact check",
          "error"
        );
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error getting fact check history:", error);
      showToast("Terjadi kesalahan saat mengambil riwayat fact check", "error");
      return null;
    }
  };

  const getTrustScoreColor = (trustScore: number | null): string => {
    if (trustScore === null) return "text-gray-500";
    if (trustScore >= 80) return "text-green-600";
    if (trustScore >= 60) return "text-yellow-600";
    if (trustScore >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getTrustScoreLabel = (trustScore: number | null): string => {
    if (trustScore === null) return "Tidak ada data";
    if (trustScore >= 80) return "Sangat Terpercaya";
    if (trustScore >= 60) return "Terpercaya";
    if (trustScore >= 40) return "Kurang Terpercaya";
    return "Tidak Terpercaya";
  };

  const getFactCheckStatus = (
    result: FactCheckResult
  ): {
    status: "verified" | "suspicious" | "false" | "unknown";
    label: string;
    color: string;
  } => {
    if (!result.isVerified) {
      return {
        status: "unknown",
        label: "Belum Diverifikasi",
        color: "text-gray-500",
      };
    }

    if (result.trustScore === null) {
      return {
        status: "unknown",
        label: "Tidak Dapat Dinilai",
        color: "text-gray-500",
      };
    }

    if (result.trustScore >= 70) {
      return {
        status: "verified",
        label: "Terverifikasi",
        color: "text-green-600",
      };
    }

    if (result.trustScore >= 40) {
      return {
        status: "suspicious",
        label: "Perlu Dicek Ulang",
        color: "text-yellow-600",
      };
    }

    return {
      status: "false",
      label: "Kemungkinan Hoax",
      color: "text-red-600",
    };
  };

  return {
    loading,
    checkSingleNews,
    checkBatchNews,
    getFactCheckHistory,
    getTrustScoreColor,
    getTrustScoreLabel,
    getFactCheckStatus,
  };
};
