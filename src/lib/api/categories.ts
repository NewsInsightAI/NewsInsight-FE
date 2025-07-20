import { getSession } from "next-auth/react";

const API_BASE_URL = "/api";

interface ApiError {
  code: string;
  message?: string;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  newsCount?: number;
}

interface CategoriesResponse {
  status: string;
  message: string;
  data: Category[];
  error: ApiError | null;
  metadata: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCategories: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface CategoryResponse {
  status: string;
  message: string;
  data: Category;
  error: ApiError | null;
  metadata: Record<string, unknown> | null;
}

interface CreateCategoryData {
  name: string;
  description?: string;
}

interface UpdateCategoryData {
  name: string;
  description?: string;
  isActive?: boolean;
}

interface GetCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: "active" | "inactive" | "";
}

class CategoriesAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const session = await getSession();
    console.log("Session:", session ? "Session exists" : "No session found");
    const token = session?.backendToken;
    console.log(
      "Token from session:",
      token ? "Token exists" : "No token found"
    );
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
      console.log(
        "Authorization header set:",
        `Bearer ${token.substring(0, 10)}...`
      );
    }

    const config: RequestInit = {
      headers: defaultHeaders,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unknown error occurred");
    }
  }

  async getAllCategories(
    params: GetCategoriesParams = {}
  ): Promise<CategoriesResponse> {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append("search", params.search);
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.status) searchParams.append("status", params.status);

    const endpoint = `/categories${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    return this.request<CategoriesResponse>(endpoint);
  }

  async getCategoryById(id: number): Promise<CategoryResponse> {
    return this.request<CategoryResponse>(`/categories/${id}`);
  }

  async createCategory(
    categoryData: CreateCategoryData
  ): Promise<CategoryResponse> {
    return this.request<CategoryResponse>("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(
    id: number,
    categoryData: UpdateCategoryData
  ): Promise<CategoryResponse> {
    return this.request<CategoryResponse>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(
    id: number
  ): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(
      `/categories/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async bulkDeleteCategories(categoryIds: number[]): Promise<{
    status: string;
    message: string;
    data: { deletedCount: number };
  }> {
    return this.request<{
      status: string;
      message: string;
      data: { deletedCount: number };
    }>("/categories", {
      method: "DELETE",
      body: JSON.stringify({ categoryIds }),
    });
  }
}

export const categoriesAPI = new CategoriesAPI();

export type {
  Category,
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryData,
  UpdateCategoryData,
  GetCategoriesParams,
  ApiError,
};
