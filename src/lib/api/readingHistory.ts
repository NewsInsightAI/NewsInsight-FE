export interface ReadingHistoryData {
  id: number;
  read_at: string;
  read_duration: number;
  read_percentage: number;
  news_id: number;
  hashed_id: string;
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

export interface ReadingHistoryResponse {
  success: boolean;
  data: ReadingHistoryData[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface ReadingStatsData {
  total_articles_read: number;
  total_reading_time: number;
  avg_read_percentage: number;
  total_reading_sessions: number;
  read_date: string;
  articles_per_day: number;
}

export const readingHistoryApi = {
  getUserReadingHistory: async (
    page = 1,
    limit = 12
  ): Promise<ReadingHistoryResponse> => {
    const response = await fetch(
      `/api/reading-history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reading history");
    }

    return response.json();
  },

  addReadingHistory: async (
    newsId: number,
    readDuration = 0,
    readPercentage = 0.0
  ): Promise<{
    success: boolean;
    message: string;
    data: ReadingHistoryData;
  }> => {
    const response = await fetch("/api/reading-history", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        news_id: newsId,
        read_duration: readDuration,
        read_percentage: readPercentage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add reading history");
    }

    return response.json();
  },

  clearReadingHistory: async (
    newsId?: number
  ): Promise<{ success: boolean; message: string; cleared_count: number }> => {
    const response = await fetch("/api/reading-history", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsId ? { news_id: newsId } : {}),
    });

    if (!response.ok) {
      throw new Error("Failed to clear reading history");
    }

    return response.json();
  },

  // New function to track news views (public, no auth required)
  trackNewsView: async (
    newsId: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await fetch("/api/news/track-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        news_id: newsId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to track news view");
    }

    return response.json();
  },

  getReadingStats: async (): Promise<{
    success: boolean;
    data: ReadingStatsData[];
  }> => {
    const response = await fetch("/api/reading-history/stats", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reading statistics");
    }

    return response.json();
  },
};
