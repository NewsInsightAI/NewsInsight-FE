import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface SavedNewsResponse {
  success: boolean;
  saved: boolean;
  message?: string;
}

interface ShareTrackingData {
  shareType: "link_copy" | "native_share" | "social_media";
  platform?: string;
}

interface ReportData {
  reason: string;
  description?: string;
}

interface SummaryData {
  id: number;
  newsId: number;
  summaryText: string;
  keyPoints: string[];
  createdAt: string;
}

interface SummaryResponse {
  success: boolean;
  data: SummaryData;
}

interface NewsInteractionAPI {
  // Save/Bookmark functionality
  toggleSaveNews: (newsId: number) => Promise<SavedNewsResponse>;
  checkSavedStatus: (newsId: number) => Promise<SavedNewsResponse>;

  // Share functionality
  trackShare: (
    newsId: number,
    data: ShareTrackingData
  ) => Promise<{ success: boolean }>;

  // Report functionality
  reportNews: (
    newsId: number,
    data: ReportData
  ) => Promise<{ success: boolean; message: string }>;

  // Summary functionality
  generateSummary: (newsId: number) => Promise<SummaryResponse>;
  getSummary: (newsId: number) => Promise<SummaryResponse>;
}

export const useNewsInteractions = (): NewsInteractionAPI => {
  const { data: session } = useSession();

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (session?.backendToken) {
      headers.Authorization = `Bearer ${session.backendToken}`;
    }

    return headers;
  };

  const toggleSaveNews = async (newsId: number): Promise<SavedNewsResponse> => {
    try {
      const response = await fetch(`/api/news/${newsId}/save`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle save status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling save news:", error);
      throw error;
    }
  };

  const checkSavedStatus = async (
    newsId: number
  ): Promise<SavedNewsResponse> => {
    try {
      const response = await fetch(`/api/news/${newsId}/saved-status`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to check saved status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error checking saved status:", error);
      throw error;
    }
  };

  const trackShare = async (newsId: number, data: ShareTrackingData) => {
    try {
      const response = await fetch(`/api/news/${newsId}/share`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to track share");
      }

      return await response.json();
    } catch (error) {
      console.error("Error tracking share:", error);
      throw error;
    }
  };

  const reportNews = async (newsId: number, data: ReportData) => {
    try {
      const response = await fetch(`/api/news/${newsId}/report`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to report news");
      }

      return await response.json();
    } catch (error) {
      console.error("Error reporting news:", error);
      throw error;
    }
  };

  const generateSummary = async (newsId: number): Promise<SummaryResponse> => {
    try {
      const response = await fetch(`/api/news/${newsId}/summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error generating summary:", error);
      throw error;
    }
  };

  const getSummary = async (newsId: number): Promise<SummaryResponse> => {
    try {
      const response = await fetch(`/api/news/${newsId}/summary`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get summary");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting summary:", error);
      throw error;
    }
  };

  return {
    toggleSaveNews,
    checkSavedStatus,
    trackShare,
    reportNews,
    generateSummary,
    getSummary,
  };
};

// Hook untuk mengelola state saved news
export const useSavedNews = (newsId: number) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const checkStatus = useCallback(async () => {
    if (!session?.backendToken) return;

    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      };

      const response = await fetch(`/api/news/${newsId}/saved-status`, {
        headers,
      });

      if (response.ok) {
        const result = await response.json();
        setIsSaved(result.saved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
    } finally {
      setLoading(false);
    }
  }, [newsId, session?.backendToken]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const toggleSave = async () => {
    if (!session?.backendToken) throw new Error("User not authenticated");

    try {
      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.backendToken}`,
      };

      const response = await fetch(`/api/news/${newsId}/save`, {
        method: "POST",
        headers,
      });

      if (response.ok) {
        const result = await response.json();
        setIsSaved(result.saved);
        return result;
      } else {
        throw new Error("Failed to toggle save status");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { isSaved, loading, toggleSave };
};

// Hook untuk news summary
export const useNewsSummary = (newsId: number) => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const newsInteractions = useNewsInteractions();

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      // First try to get existing summary
      try {
        const existingSummary = await newsInteractions.getSummary(newsId);
        setSummary(existingSummary.data);
        return existingSummary.data;
      } catch {
        // If no existing summary, generate new one
        const newSummary = await newsInteractions.generateSummary(newsId);
        setSummary(newSummary.data);
        return newSummary.data;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load summary";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { summary, loading, error, loadSummary };
};
