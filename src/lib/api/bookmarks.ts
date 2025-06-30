export interface BookmarkData {
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
    id: number;
    name: string;
    avatar_url?: string;
  }>;
}

export interface BookmarkResponse {
  success: boolean;
  data: BookmarkData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export const bookmarksApi = {
  getUserBookmarks: async (page = 1, limit = 12): Promise<BookmarkResponse> => {
    const response = await fetch(`/api/bookmarks?page=${page}&limit=${limit}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bookmarks");
    }

    return response.json();
  },

  addBookmark: async (
    newsId: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ news_id: newsId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add bookmark");
    }

    return response.json();
  },

  removeBookmark: async (
    newsId: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`/api/bookmarks/${newsId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove bookmark");
    }

    return response.json();
  },

  checkBookmark: async (
    newsId: number
  ): Promise<{ success: boolean; is_bookmarked: boolean }> => {
    const response = await fetch(`/api/bookmarks/check/${newsId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to check bookmark status");
    }

    return response.json();
  },
};
