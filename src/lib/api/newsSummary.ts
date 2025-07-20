// News Summary API Client - menggunakan backend endpoint yang sudah dibuat

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface NewsSummaryData {
  id: number;
  newsId: number;
  summaryText: string;
  keyPoints?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface NewsSummaryResponse {
  success: boolean;
  data: NewsSummaryData;
  message?: string;
}

/**
 * Generate news summary using backend API with Gemini AI
 */
export async function generateNewsSummary(
  newsId: number,
  authToken?: string
): Promise<NewsSummaryResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/news/${newsId}/summary`, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal membuat ringkasan");
    }

    return data;
  } catch (error) {
    console.error("Error generating summary:", error);

    throw error;
  }
}

/**
 * Get existing summary for a news article
 */
export async function getExistingSummary(
  newsId: number,
  authToken?: string
): Promise<NewsSummaryResponse> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/news/${newsId}/summary`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Gagal mengambil ringkasan");
    }

    return data;
  } catch (error) {
    console.error("Error getting existing summary:", error);
    throw error;
  }
}
