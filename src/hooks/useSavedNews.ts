import { useState, useEffect } from "react";

export interface SavedNewsData {
  id: number;
  bookmarked_at: string;
  news_id: number;
  title: string;
  image_url: string;
  published_at: string;
  status: string;
  category_name: string;
  category_id: number;
  authors: Array<{
    name: string;
    location?: string;
  }>;
}

export interface SavedNewsResponse {
  success: boolean;
  data: SavedNewsData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const useSavedNews = () => {
  const [savedNews, setSavedNews] = useState<SavedNewsData[]>([]);
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

  const fetchSavedNews = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    console.log("=== fetchSavedNews called ===");
    console.log("Page:", page, "Limit:", limit);

    try {
      const response = await fetch(
        `/api/saved-news?page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch saved news");
      }

      const result: SavedNewsResponse = await response.json();
      console.log("Response data:", result);
      setSavedNews(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch saved news"
      );
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchSavedNews(page);
    }
  };

  useEffect(() => {
    fetchSavedNews();
  }, []);

  return {
    savedNews,
    loading,
    error,
    pagination,
    fetchSavedNews,
    goToPage,
    refetch: () => fetchSavedNews(pagination.current_page),
  };
};
