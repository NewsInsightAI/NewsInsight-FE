"use client";
import React, { useEffect, useState } from "react";
import AddEditNews from "../../add/AddEditNews";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface NewsData {
  id: string;
  title: string;
  content: string;
  categoryId: number;
  category_name: string;
  category_slug: string;
  featuredImage?: string;
  featured_image?: string;
  status: string;
  published_at: string;
  authors: { author_name: string; location: string }[];
  tags: string[];
}

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedNews, setHasFetchedNews] = useState(false);

  const newsId = params.id as string;

  useEffect(() => {
    // Only fetch if we have a valid session token and haven't fetched yet
    if (!session?.backendToken || hasFetchedNews) return;
    if (!newsId) return;

    const fetchNewsData = async () => {
      try {
        setLoading(true);
        const token = session?.backendToken;

        const response = await fetch(`/api/news/${newsId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch news data");
        }

        const data = await response.json();
        console.log("🔍 Raw API Response:", data);
        console.log("📰 News Data:", data.data);
        console.log("🖼️ Featured Image from API:", data.data?.featuredImage);
        console.log("🖼️ featured_image from API:", data.data?.featured_image);
        console.log("📋 All available fields:", Object.keys(data.data || {}));
        setNewsData(data.data);
        setHasFetchedNews(true); // Mark as fetched
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Gagal memuat data berita");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [newsId, session?.backendToken, hasFetchedNews]);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Anda harus login untuk mengakses halaman ini</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/dashboard/news")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>Berita tidak ditemukan</p>
        <button
          onClick={() => router.push("/dashboard/news")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kembali ke Daftar Berita
        </button>
      </div>
    );
  }

  const initialData = {
    title: newsData.title,
    category: newsData.category_slug,
    status: newsData.status,
    publishDate: newsData.published_at,
    featured_image: newsData.featuredImage || newsData.featured_image || null,
    author: "",
    content: newsData.content,
    tags: newsData.tags.join(", "),
  };

  console.log("📋 Initial Data being passed to AddEditNews:", initialData);
  console.log("🖼️ Featured Image in initialData:", initialData.featured_image);
  console.log("🔧 newsData.featuredImage:", newsData.featuredImage);
  console.log("🔧 newsData.featured_image:", newsData.featured_image);

  const initialAuthors = newsData.authors.map((author) => ({
    name: author.author_name,
    location: author.location || "",
  }));

  return (
    <AddEditNews
      mode="edit"
      newsId={newsId}
      initialData={initialData}
      initialAuthors={initialAuthors}
    />
  );
}
