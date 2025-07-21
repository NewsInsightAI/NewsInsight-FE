import { useState, useEffect } from "react";
import {
  readingHistoryApi,
  ReadingHistoryData,
  ReadingHistoryResponse,
  ReadingStatsData,
} from "@/lib/api/readingHistory";

export const useReadingHistory = () => {
  const [history, setHistory] = useState<ReadingHistoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 12,
    has_next: false,
    has_prev: false,
  });

  const fetchReadingHistory = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    try {
      const response: ReadingHistoryResponse =
        await readingHistoryApi.getUserReadingHistory(page, limit);
      setHistory(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch reading history"
      );
    } finally {
      setLoading(false);
    }
  };

  const addReadingHistory = async (
    newsId: number,
    readDuration = 0,
    readPercentage = 0.0
  ) => {
    try {
      await readingHistoryApi.addReadingHistory(
        newsId,
        readDuration,
        readPercentage
      );
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add reading history";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearReadingHistory = async (newsId?: number) => {
    try {
      await readingHistoryApi.clearReadingHistory(newsId);

      await fetchReadingHistory(pagination.current_page);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to clear reading history";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchReadingHistory(page);
    }
  };

  const trackNewsView = async (newsId: number) => {
    try {
      await readingHistoryApi.trackNewsView(newsId);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to track news view";
      console.error("Error tracking news view:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchReadingHistory();
  }, []);

  return {
    history,
    loading,
    error,
    pagination,
    fetchReadingHistory,
    addReadingHistory,
    clearReadingHistory,
    trackNewsView,
    goToPage,
    refetch: () => fetchReadingHistory(pagination.current_page),
  };
};

export const useReadingStats = () => {
  const [stats, setStats] = useState<ReadingStatsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadingStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await readingHistoryApi.getReadingStats();
      setStats(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch reading statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadingStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchReadingStats,
    refetch: fetchReadingStats,
  };
};
