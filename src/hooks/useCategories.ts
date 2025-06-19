import { useState, useEffect, useCallback } from "react";
import {
  categoriesAPI,
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  GetCategoriesParams,
} from "@/lib/api/categories";

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: {
    status: string;
  };
  setFilters: (filters: { status: string }) => void;
  fetchCategories: (params?: GetCategoriesParams) => Promise<void>;
  createCategory: (categoryData: CreateCategoryData) => Promise<void>;
  updateCategory: (
    id: number,
    categoryData: UpdateCategoryData
  ) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  bulkDeleteCategories: (categoryIds: number[]) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ status: "" });

  const fetchCategories = useCallback(
    async (params: GetCategoriesParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const finalParams = {
          search: searchQuery,
          status: filters.status as "active" | "inactive" | "",
          page: 1,
          limit: 10,
          ...params,
        };

        const response = await categoriesAPI.getAllCategories(finalParams);

        if (response.status === "success") {
          setCategories(response.data);
          setPagination(response.metadata.pagination);
        } else {
          setError(response.error?.message || "Failed to fetch categories");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, filters.status]
  );

  const createCategory = useCallback(
    async (categoryData: CreateCategoryData) => {
      try {
        setError(null);
        await categoriesAPI.createCategory(categoryData);
        await fetchCategories(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create category"
        );
        throw err;
      }
    },
    [fetchCategories]
  );

  const updateCategory = useCallback(
    async (id: number, categoryData: UpdateCategoryData) => {
      try {
        setError(null);
        await categoriesAPI.updateCategory(id, categoryData);
        await fetchCategories(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update category"
        );
        throw err;
      }
    },
    [fetchCategories]
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      try {
        setError(null);
        await categoriesAPI.deleteCategory(id);
        await fetchCategories(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete category"
        );
        throw err;
      }
    },
    [fetchCategories]
  );

  const bulkDeleteCategories = useCallback(
    async (categoryIds: number[]) => {
      try {
        setError(null);
        await categoriesAPI.bulkDeleteCategories(categoryIds);
        await fetchCategories(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete categories"
        );
        throw err;
      }
    },
    [fetchCategories]
  );

  const refreshCategories = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);

  // Effect to fetch categories when search query or filters change
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    refreshCategories,
  };
}
