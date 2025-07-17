"use client";
import { useState, useEffect, useCallback } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  isActive?: boolean;
  newsCount?: number;
  created_at?: string;
  updated_at?: string;
}


interface CategoryWithNewsCount extends Category {
  newsCount?: number;
}

export const useCategoriesForNavigation = () => {
  const [categories, setCategories] = useState<CategoryWithNewsCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();

        if (result.status === "success" && result.data) {
          // Transform API data dengan news count yang sudah tersedia dari backend
          const transformedCategories: CategoryWithNewsCount[] =
            result.data.map((category: Category) => ({
              ...category,
              newsCount: category.newsCount || 0, // Gunakan data real dari backend
              description:
                category.description ||
                `Berita ${category.name.toLowerCase()} terkini`,
            }));

          setCategories(transformedCategories);
          console.log("✅ Categories with real news count loaded successfully");
        } else {
          throw new Error(result.message || "Failed to fetch categories");
        }
      } else {
        // Jika API tidak tersedia, gunakan fallback data
        console.warn("Categories API not available, using fallback data");
        setCategories(getFallbackCategories());
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error instanceof Error ? error.message : "Unknown error");

      // Gunakan fallback data jika ada error
      setCategories(getFallbackCategories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fallback categories jika API tidak tersedia
  const getFallbackCategories = (): CategoryWithNewsCount[] => [
    {
      id: "1",
      name: "Politik",
      slug: "politik",
      description: "Berita politik terkini",
      newsCount: 125,
      is_active: true,
    },
    {
      id: "2",
      name: "Ekonomi",
      slug: "ekonomi",
      description: "Ekonomi dan bisnis",
      newsCount: 89,
      is_active: true,
    },
    {
      id: "3",
      name: "Teknologi",
      slug: "teknologi",
      description: "Teknologi dan inovasi",
      newsCount: 156,
      is_active: true,
    },
    {
      id: "4",
      name: "Olahraga",
      slug: "olahraga",
      description: "Berita olahraga",
      newsCount: 78,
      is_active: true,
    },
    {
      id: "5",
      name: "Kesehatan",
      slug: "kesehatan",
      description: "Kesehatan dan medis",
      newsCount: 64,
      is_active: true,
    },
    {
      id: "6",
      name: "Pendidikan",
      slug: "pendidikan",
      description: "Dunia pendidikan",
      newsCount: 45,
      is_active: true,
    },
    {
      id: "7",
      name: "Hiburan",
      slug: "hiburan",
      description: "Entertainment dan selebriti",
      newsCount: 92,
      is_active: true,
    },
    {
      id: "8",
      name: "Internasional",
      slug: "internasional",
      description: "Berita dunia",
      newsCount: 134,
      is_active: true,
    },
  ];

  return {
    categories: categories.filter((cat) => cat.is_active !== false), // Hanya tampilkan kategori aktif
    loading,
    error,
    refetch: fetchCategories,
  };
};
