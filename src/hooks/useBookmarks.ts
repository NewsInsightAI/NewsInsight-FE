import { useState, useEffect } from "react";
import {
  bookmarksApi,
  BookmarkData,
  BookmarkResponse,
} from "@/lib/api/bookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
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

  const fetchBookmarks = async (page = 1, limit = 12) => {
    setLoading(true);
    setError(null);
    try {
      const response: BookmarkResponse = await bookmarksApi.getUserBookmarks(
        page,
        limit
      );
      setBookmarks(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch bookmarks"
      );
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (newsId: number) => {
    try {
      await bookmarksApi.addBookmark(newsId);

      await fetchBookmarks(pagination.current_page);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add bookmark";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeBookmark = async (newsId: number) => {
    try {
      await bookmarksApi.removeBookmark(newsId);

      await fetchBookmarks(pagination.current_page);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove bookmark";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const checkBookmark = async (newsId: number) => {
    try {
      const response = await bookmarksApi.checkBookmark(newsId);
      return response.is_bookmarked;
    } catch (err) {
      console.error("Failed to check bookmark status:", err);
      return false;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      fetchBookmarks(page);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return {
    bookmarks,
    loading,
    error,
    pagination,
    fetchBookmarks,
    addBookmark,
    removeBookmark,
    checkBookmark,
    goToPage,
    refetch: () => fetchBookmarks(pagination.current_page),
  };
};
