/* eslint-disable @next/next/no-img-element */
"use client";
import RichTextEditor from "@/components/RichTextEditor";
import Input from "@/components/ui/Input";
import { newsStatusOptions } from "@/utils/newsStatus";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";
import AddAuthorModal from "@/components/popup/AddAuthorModal";
import { useSession } from "next-auth/react";
import { useToast } from "@/context/ToastProvider";

interface CategoryOption {
  value: string;
  label: string;
  id: number;
}

interface SectionProps {
  title: string;
  description: string;
  icon: string;
  status: string;
  children: React.ReactNode;
}

const Section = ({
  title,
  description,
  icon,
  status,
  children,
}: SectionProps) => {
  const { isDark } = useDarkMode();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_filling":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`${
              isDark ? "bg-gray-600" : "bg-zinc-400"
            } text-white rounded-full px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs whitespace-nowrap`}
          >
            Dalam Pengisian
          </motion.div>
        );
      case "filled":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-full px-2 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs whitespace-nowrap"
          >
            Sudah Lengkap
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col md:flex-row items-start justify-start gap-2.5 w-full`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-8 w-8 md:h-10 md:w-10 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-2xl flex items-center justify-center p-2 flex-shrink-0"
      >
        <Icon icon={icon} fontSize={24} className="text-white md:text-[32px]" />
      </motion.div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 w-full">
          <div className="flex flex-col w-full">
            <p
              className={`text-sm md:text-base font-bold ${
                isDark ? "text-white" : "text-[#3A3A3A]"
              }`}
            >
              {title}
            </p>
            <p
              className={`text-xs md:text-sm opacity-50 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {description}
            </p>
          </div>
          <div className="flex items-center justify-start md:justify-end gap-2 w-full md:w-auto">
            {getStatusBadge(status)}
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

interface AddEditNewsProps {
  mode?: "add" | "edit";
  newsId?: string;
  initialData?: {
    title?: string;
    category?: string;
    status?: string;
    publishDate?: Date | string;
    image?: File | string | null;
    author?: string;
    content?: string | null;
    tags?: string | null;
  };
  initialAuthors?: { name: string; location?: string }[];
  onSubmit?: (data: {
    title: string;
    category: string;
    status: string;
    publishDate: Date | string;
    image: File | string | null;
    author: string;
    content: string | null;
    tags: string | null;
  }) => void;
}

export default function AddEditNews({
  mode = "add",
  newsId,
  initialData,
  initialAuthors,
  onSubmit,
}: AddEditNewsProps) {
  const router = useRouter();
  const { isDark } = useDarkMode();
  const [newsTitle, setNewsTitle] = useState<string>(initialData?.title || "");
  const [newsCategory, setNewsCategory] = useState<string>(
    initialData?.category || ""
  );
  const [newsStatus, setNewsStatus] = useState<string>(
    initialData?.status || ""
  );
  const [newsPublishDate, setNewsPublishDate] = useState<Date | string>(
    initialData?.publishDate || "15 Maret 2025, 15:20 WIB"
  );
  const [newsImage, setNewsImage] = useState<File | string | null>(
    initialData?.image &&
      typeof initialData.image === "string" &&
      initialData.image.trim() !== ""
      ? initialData.image
      : null
  );
  const [newsAuthors, setNewsAuthors] = useState<
    { name: string; location?: string }[]
  >(
    initialAuthors ||
      (initialData?.author
        ? [{ name: initialData.author, location: "" }]
        : [{ name: "Rigel Ramadhani W.", location: "Jakarta" }])
  );
  const [showAuthorModal, setShowAuthorModal] = useState<boolean>(false);
  const [newsContent, setNewsContent] = useState<string | null>(
    initialData?.content || null
  );
  const [newsTags, setNewsTags] = useState<string[]>(
    initialData?.tags ? initialData.tags.split(", ") : []
  );

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);

  const { data: session } = useSession();
  const { promise, showToast } = useToast();

  const [gradient, setGradient] = useState(
    "linear-gradient(to top, #367AF2CC, transparent)"
  );

  const [vibrantColor, setVibrantColor] = useState<string>("#bbc57b");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(
    "https://placehold.co/400x200"
  );

  const imgRef = useRef<HTMLImageElement>(null);
  const previousImageRef = useRef<File | string | null>(null);

  useEffect(() => {
    let newImageUrl = "https://placehold.co/400x200";

    if (newsImage) {
      if (typeof newsImage === "string" && newsImage.trim() !== "") {
        newImageUrl = newsImage;
      } else if (newsImage instanceof File) {
        newImageUrl = URL.createObjectURL(newsImage);
      }
    }

    if (previousImageRef.current !== newsImage) {
      if (
        previousImageRef.current &&
        typeof previousImageRef.current !== "string" &&
        currentImageUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(currentImageUrl);
      }

      setCurrentImageUrl(newImageUrl);
      previousImageRef.current = newsImage;

      Vibrant.from(newImageUrl)
        .getPalette()
        .then((palette) => {
          const hex = palette.Vibrant?.hex ?? "#bbc57b";
          setVibrantColor(hex);
          setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
        })
        .catch(() => {
          setVibrantColor("#367AF2");
          setGradient("linear-gradient(to top, #367AF2CC, transparent)");
        });
    }

    return () => {
      if (
        newsImage &&
        typeof newsImage !== "string" &&
        newImageUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(newImageUrl);
      }
    };
  }, [newsImage]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        const categoryOptions: CategoryOption[] = data.data.map(
          (cat: { id: number; name: string; slug: string }) => ({
            id: cat.id,
            value: cat.slug,
            label: cat.name,
          })
        );

        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast("Gagal memuat kategori berita", "error");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, [showToast]);

  const isEdit = mode === "edit";

  const isAllFieldsFilled =
    newsTitle.trim() !== "" &&
    newsCategory !== "" &&
    newsImage !== null &&
    newsAuthors.length > 0 &&
    newsContent &&
    newsContent.trim() !== "" &&
    newsContent.trim() !== "<p></p>" &&
    newsContent.trim() !== "<p><br></p>" &&
    newsTags.length > 0;

  const isAnyFieldFilled =
    newsTitle.trim() !== "" ||
    newsCategory !== "" ||
    newsImage !== null ||
    (newsContent &&
      newsContent.trim() !== "" &&
      newsContent.trim() !== "<p></p>" &&
      newsContent.trim() !== "<p><br></p>") ||
    newsTags.length > 0;

  const addAuthorsFromModal = (newAuthors: string[]) => {
    const uniqueNewAuthors = newAuthors
      .filter(
        (author) => !newsAuthors.some((existing) => existing.name === author)
      )
      .map((author) => ({ name: author, location: "" }));
    if (uniqueNewAuthors.length > 0) {
      setNewsAuthors([...newsAuthors, ...uniqueNewAuthors]);
    }
  };

  const removeAuthor = (authorToRemove: {
    name: string;
    location?: string;
  }) => {
    if (
      authorToRemove.name !== "Rigel Ramadhani W." ||
      newsAuthors.length > 1
    ) {
      setNewsAuthors(
        newsAuthors.filter((author) => author.name !== authorToRemove.name)
      );
    }
  };

  const updateAuthorLocation = (authorName: string, newLocation: string) => {
    setNewsAuthors(
      newsAuthors.map((author) =>
        author.name === authorName
          ? { ...author, location: newLocation }
          : author
      )
    );
  };

  const addTag = (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (trimmedTag !== "" && !newsTags.includes(trimmedTag)) {
      setNewsTags([...newsTags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewsTags(newsTags.filter((tag) => tag !== tagToRemove));
  };

  const formatAuthorsForSubmission = () => {
    const authorsWithLocation = newsAuthors.map((author) => {
      if (author.location && author.location.trim() !== "") {
        return `${author.name} di ${author.location}`;
      }
      return author.name;
    });
    return authorsWithLocation.join(", ");
  };

  const openAuthorModal = () => {
    setShowAuthorModal(true);
  };

  const closeAuthorModal = () => {
    setShowAuthorModal(false);
  };

  const uploadImageToServer = async (
    imageFile: File
  ): Promise<string | null> => {
    try {
      const maxSize = 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        throw new Error("Ukuran file gambar tidak boleh lebih dari 5MB");
      }

      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.data?.url || data.url || data.data?.filename;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const getCategoryId = async (
    categorySlug: string
  ): Promise<number | null> => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      const category = data.data.find(
        (cat: { slug: string; id: number }) => cat.slug === categorySlug
      );
      return category ? category.id : null;
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  };

  const handleSubmitNews = async (isDraft: boolean = false) => {
    if (!session?.user) {
      showToast("Anda harus login untuk melakukan aksi ini", "error");
      return;
    }

    try {
      await promise(
        (async () => {
          let imageUrl: string | null = null;
          if (newsImage) {
            if (typeof newsImage === "string") {
              imageUrl = newsImage;
            } else {
              imageUrl = await uploadImageToServer(newsImage);
              if (!imageUrl) {
                throw new Error("Gagal mengunggah gambar");
              }
            }
          }

          const categoryId = await getCategoryId(newsCategory);
          if (!categoryId) {
            throw new Error("Kategori tidak valid");
          }

          const newsData = {
            title: newsTitle,
            content: newsContent,
            categoryId,
            featuredImage: imageUrl,
            status: isDraft ? "draft" : "published",
            authors: newsAuthors.map((author) => ({
              name: author.name,
              location: author.location || null,
            })),
            tags: newsTags,
          };

          const token = session?.backendToken;
          const response = await fetch("/api/news", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(newsData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Gagal menyimpan berita");
          }

          await response.json();

          setTimeout(() => {
            router.push("/dashboard/news");
          }, 1500);

          return { isDraft };
        })(),
        {
          loading: isDraft ? "Menyimpan draft..." : "Menerbitkan berita...",
          success: (result) =>
            result.isDraft
              ? "Berita berhasil disimpan sebagai draft"
              : "Berita berhasil dipublikasikan",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat menyimpan berita",
        }
      );
    } catch (error) {
      console.error("Error submitting news:", error);
    }
  };

  const handleUpdateNews = async (newsId: string, isDraft: boolean = false) => {
    if (!session?.user) {
      showToast("Anda harus login untuk melakukan aksi ini", "error");
      return;
    }

    try {
      await promise(
        (async () => {
          let imageUrl: string | null = null;
          if (newsImage) {
            if (typeof newsImage === "string") {
              imageUrl = newsImage;
            } else {
              imageUrl = await uploadImageToServer(newsImage);
              if (!imageUrl) {
                throw new Error("Gagal mengunggah gambar");
              }
            }
          }

          const categoryId = await getCategoryId(newsCategory);
          if (!categoryId) {
            throw new Error("Kategori tidak valid");
          }

          const newsData = {
            title: newsTitle,
            content: newsContent,
            categoryId,
            featuredImage: imageUrl,
            status: isDraft ? "draft" : "published",
            authors: newsAuthors.map((author) => ({
              name: author.name,
              location: author.location || null,
            })),
            tags: newsTags,
          };

          const token = session?.backendToken;
          const response = await fetch(`/api/news/${newsId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(newsData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Gagal mengupdate berita");
          }

          await response.json();

          setTimeout(() => {
            router.push("/dashboard/news");
          }, 1500);

          return { isDraft };
        })(),
        {
          loading: isDraft ? "Menyimpan draft..." : "Mengupdate berita...",
          success: (result) =>
            result.isDraft
              ? "Berita berhasil disimpan sebagai draft"
              : "Berita berhasil diupdate",
          error: (err) =>
            err instanceof Error
              ? err.message
              : "Terjadi kesalahan saat mengupdate berita",
        }
      );
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  return (
    <div className={`flex flex-col w-full h-full gap-4 md:gap-6`}>
      <div
        className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full pb-2.5 border-b gap-4 md:gap-0 ${
          isDark ? "border-gray-700" : "border-[#E2E2E2]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon
            onClick={() => router.push("/dashboard/news")}
            icon="mingcute:arrow-left-circle-fill"
            className="cursor-pointer"
            fontSize={28}
            color="#367AF2"
          />
          <p className="text-lg md:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
            {isEdit ? "Edit Berita" : "Tambah Berita Baru"}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            className={`flex items-center gap-2 rounded-3xl px-4 md:px-5 py-2.5 md:py-3 transition duration-300 ease-in-out border text-sm md:text-base ${
              isDark
                ? "text-gray-500 border-gray-700"
                : "text-[#CFCFCF] border-[#CFCFCF]"
            } ${
              !isAnyFieldFilled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "hover:opacity-80 cursor-pointer"
            }`}
            type="button"
            disabled={!isAnyFieldFilled}
            onClick={() => {
              if (isAnyFieldFilled) {
                if (onSubmit) {
                  onSubmit({
                    title: newsTitle,
                    category: newsCategory,
                    status: newsStatus,
                    publishDate: newsPublishDate,
                    image: newsImage,
                    author: formatAuthorsForSubmission(),
                    content: newsContent,
                    tags: newsTags.join(", "),
                  });
                } else {
                  if (isEdit && newsId) {
                    handleUpdateNews(newsId, true);
                  } else {
                    handleSubmitNews(true);
                  }
                }
              }
            }}
          >
            <Icon icon="material-symbols:draft" fontSize={20} />
            <p>{isEdit ? "Simpan Draf" : "Draf"}</p>
          </button>
          <button
            className={`flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2.5 md:py-3 transition duration-300 ease-in-out text-sm md:text-base ${
              !isAllFieldsFilled
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "hover:opacity-80 cursor-pointer"
            }`}
            type="button"
            disabled={!isAllFieldsFilled}
            onClick={() => {
              if (isAllFieldsFilled) {
                if (onSubmit) {
                  onSubmit({
                    title: newsTitle,
                    category: newsCategory,
                    status: newsStatus,
                    publishDate: newsPublishDate,
                    image: newsImage,
                    author: formatAuthorsForSubmission(),
                    content: newsContent,
                    tags: newsTags.join(", "),
                  });
                } else {
                  if (isEdit && newsId) {
                    handleUpdateNews(newsId, false);
                  } else {
                    handleSubmitNews(false);
                  }
                }
              }
            }}
          >
            <Icon icon="ic:round-publish" fontSize={20} />
            <p>{isEdit ? "Update" : "Terbitkan"}</p>
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col lg:flex-row items-start justify-between w-full h-fit gap-4 lg:gap-6 overflow-y-auto`}
      >
        <div className="flex flex-col gap-4 w-full lg:w-1/2 items-start justify-start lg:sticky lg:top-0">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-xl px-4 py-2.5 font-semibold w-full text-sm md:text-base">
            <Icon icon="fluent:content-view-28-filled" fontSize={20} />
            <p>Preview Berita</p>
          </div>
          <div
            className={`flex flex-col gap-4 w-full border rounded-2xl p-4 md:p-5 ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-[#CFCFCF] bg-white"
            }`}
          >
            <div
              className={`relative w-full h-[200px] md:h-[300px] lg:h-[400px] rounded-2xl overflow-hidden border ${
                isDark ? "border-gray-700" : "border-[#CFCFCF]"
              }`}
            >
              <img
                alt="Preview"
                src={currentImageUrl || "https://placehold.co/400x200"}
                ref={imgRef}
                onLoad={() => {
                  if (imgRef.current) {
                    Vibrant.from(imgRef.current as HTMLImageElement)
                      .getPalette()
                      .then((palette) => {
                        const hex = palette.Vibrant?.hex ?? "#bbc57b";
                        setVibrantColor(hex);
                        setGradient(
                          `linear-gradient(to top, ${hex}CC, transparent)`
                        );
                      })
                      .catch(() => {
                        setVibrantColor("#367AF2");
                        setGradient(
                          "linear-gradient(to top, #367AF2CC, transparent)"
                        );
                      });
                  }
                }}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />

              <div
                className="absolute inset-0 flex flex-col items-end justify-between p-6"
                style={{ background: gradient }}
              >
                <div className="flex w-full justify-end">
                  <p
                    className={`text-sm md:text-base font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-full ${
                      isDark ? "bg-gray-900" : "bg-white"
                    }`}
                    style={{ color: vibrantColor }}
                  >
                    {newsCategory
                      ? newsCategory.charAt(0).toUpperCase() +
                        newsCategory.slice(1)
                      : "Kategori Berita"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <p className="text-white text-xs md:text-sm">
                    {typeof newsPublishDate === "string"
                      ? newsPublishDate
                      : newsPublishDate?.toLocaleString() ||
                        "Tanggal Publikasi"}
                  </p>
                  <p className="text-white text-lg md:text-xl lg:text-2xl font-semibold line-clamp-2">
                    {newsTitle || "Judul Berita"}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`news-preview w-full h-fit text-justify text-sm md:text-base ${
                isDark ? "text-gray-200" : "text-gray-900"
              }`}
              dangerouslySetInnerHTML={{
                __html: newsContent || "<p>Konten berita muncul di sini</p>",
              }}
            ></div>

            {/* Author Information */}
            {newsAuthors.length > 0 && (
              <div
                className={`flex justify-center items-center rounded-2xl py-4 px-5 mt-8 ${
                  isDark
                    ? "bg-gray-800 border border-gray-600"
                    : "bg-[#F2F2F2] border border-black/30"
                }`}
              >
                <div
                  className={`text-sm flex items-center gap-3 ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  <Icon icon="oui:reporter" className="w-6 h-6 flex-shrink-0" />
                  <span className="leading-relaxed">
                    {" "}
                    {newsAuthors && newsAuthors.length > 0 && (
                      <>
                        Pelaporan oleh{" "}
                        {(() => {
                          const reportersByLocation: {
                            [key: string]: string[];
                          } = {};

                          newsAuthors.forEach((author) => {
                            const location =
                              author.location?.trim() || "no-location";
                            if (!reportersByLocation[location]) {
                              reportersByLocation[location] = [];
                            }
                            reportersByLocation[location].push(
                              author.name.trim()
                            );
                          });

                          const locationGroups =
                            Object.keys(reportersByLocation);
                          const formattedGroups: React.ReactNode[] = [];

                          locationGroups.forEach((location, groupIndex) => {
                            const names = reportersByLocation[location];

                            if (groupIndex > 0) {
                              formattedGroups.push(", ");
                            }

                            if (location === "no-location") {
                              if (names.length === 1) {
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {names[0]}
                                  </span>
                                );
                              } else if (names.length === 2) {
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {names[0]} dan {names[1]}
                                  </span>
                                );
                              } else {
                                const allButLast = names.slice(0, -1);
                                const lastName = names[names.length - 1];
                                formattedGroups.push(
                                  <span
                                    key={`reporter-group-${groupIndex}`}
                                    className="font-semibold"
                                  >
                                    {allButLast.join(", ")} dan {lastName}
                                  </span>
                                );
                              }
                            } else {
                              if (names.length === 1) {
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {names[0]}
                                    </span>{" "}
                                    di{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              } else if (names.length === 2) {
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {names[0]} dan {names[1]}
                                    </span>{" "}
                                    di{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              } else {
                                const allButLast = names.slice(0, -1);
                                const lastName = names[names.length - 1];
                                formattedGroups.push(
                                  <React.Fragment
                                    key={`reporter-group-${groupIndex}`}
                                  >
                                    <span className="font-semibold">
                                      {allButLast.join(", ")} dan {lastName}
                                    </span>{" "}
                                    di{" "}
                                    <span className="font-semibold">
                                      {location}
                                    </span>
                                  </React.Fragment>
                                );
                              }
                            }
                          });

                          return formattedGroups;
                        })()}
                      </>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-1/2 items-start justify-start">
          <Section
            title="Informasi Utama"
            description="Masukkan data dasar informasi berita"
            icon="solar:info-square-bold"
            status={
              newsTitle.trim() !== "" &&
              newsCategory !== "" &&
              newsImage !== null &&
              newsAuthors.length > 0
                ? "filled"
                : "in_filling"
            }
          >
            <div
              className={`flex flex-col gap-4 w-full border rounded-2xl p-4 md:p-5 ${
                isDark
                  ? "border-gray-700 bg-gray-800"
                  : "border-[#CFCFCF] bg-white"
              }`}
            >
              <form className="flex flex-col gap-4 w-full">
                <Input
                  label="Judul Berita"
                  placeholder="Masukkan judul berita..."
                  type="text"
                  icon="mingcute:text-fill"
                  value={newsTitle}
                  onChangeValue={setNewsTitle}
                  required
                />
                <Input
                  label="Kategori"
                  placeholder={
                    categoriesLoading
                      ? "Memuat kategori..."
                      : "Pilih kategori berita..."
                  }
                  type="select"
                  selectOptions={categories}
                  icon="iconamoon:category-fill"
                  value={
                    categories.find(
                      (option) => option.value === newsCategory
                    ) || null
                  }
                  onSelectChange={(option) =>
                    setNewsCategory(
                      Array.isArray(option) ? "" : option?.value || ""
                    )
                  }
                  disabled={categoriesLoading}
                  required
                />
                {isEdit && (
                  <Input
                    label="Status"
                    placeholder="Pilih status berita"
                    type="select"
                    disabled
                    selectOptions={[...newsStatusOptions]}
                    icon="fluent:status-24-filled"
                    value={
                      newsStatusOptions.find(
                        (option) => option.value === newsStatus
                      ) || null
                    }
                    onSelectChange={(option) =>
                      setNewsStatus(
                        Array.isArray(option) ? "" : option?.value || ""
                      )
                    }
                    required
                  />
                )}
                {isEdit && (
                  <Input
                    label="Tanggal Publikasi"
                    placeholder="HH/BB/TTTT"
                    type="text"
                    icon="lets-icons:date-today"
                    value={newsPublishDate}
                    onChangeValue={(value) => {
                      setNewsPublishDate(value);
                    }}
                    disabled
                  />
                )}
                <Input
                  label="Gambar Berita"
                  placeholder="Pilih gambar berita..."
                  type="file"
                  accept="image/*"
                  onFileChange={(files) => {
                    if (files && files.length > 0) {
                      const file = files[0];
                      const maxSize = 5 * 1024 * 1024;

                      if (file.size > maxSize) {
                        showToast(
                          "Ukuran file gambar tidak boleh lebih dari 5MB",
                          "error"
                        );
                        return;
                      }

                      setNewsImage(file);
                    }
                  }}
                  required
                />
                <p
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mt-1`}
                >
                  Format yang didukung: JPG, PNG, GIF. Maksimal 5MB.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <label
                    className={`font-medium ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Penulis
                  </label>

                  {/* Author Chips Display */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {newsAuthors.map((author, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm max-w-full ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-gray-200"
                            : "bg-gray-100 border-gray-300 text-gray-700"
                        }`}
                      >
                        <Icon
                          icon="fluent:person-28-filled"
                          className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                        />
                        <div className="flex items-center gap-1 flex-wrap min-w-0">
                          <span className="truncate max-w-[80px] sm:max-w-none">
                            {author.name}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-xs text-gray-500">di</span>
                            <input
                              type="text"
                              placeholder="lokasi"
                              value={author.location || ""}
                              onChange={(e) =>
                                updateAuthorLocation(
                                  author.name,
                                  e.target.value
                                )
                              }
                              className={`text-xs px-1.5 sm:px-2 py-1 rounded border focus:outline-none min-w-0 w-12 sm:w-16 ${
                                isDark
                                  ? "bg-gray-600 border-gray-500 text-gray-200 placeholder-gray-400"
                                  : "bg-gray-200 border-gray-300 text-gray-700 placeholder-gray-500"
                              }`}
                            />
                          </div>
                        </div>
                        {/* Only show close button if not the default author and has more than 1 author */}
                        {author.name !== "Rigel Ramadhani W." &&
                          newsAuthors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAuthor(author)}
                              className={`hover:opacity-70 transition-opacity ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <Icon
                                icon="mingcute:close-line"
                                className="w-4 h-4"
                              />
                            </button>
                          )}
                      </div>
                    ))}

                    {/* Add Author Button as a Chip */}
                    <button
                      type="button"
                      onClick={openAuthorModal}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-dashed border-2 text-sm transition-all hover:opacity-80 ${
                        isDark
                          ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                          : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <Icon icon="mingcute:add-line" className="w-4 h-4" />
                      <span>Tambah Penulis</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </Section>

          <Section
            title="Konten Berita"
            description="Masukkan konten utama berita dan tagar pendukung"
            icon="fluent:content-view-16-filled"
            status={
              newsContent &&
              newsContent.trim() !== "" &&
              newsContent.trim() !== "<p></p>" &&
              newsContent.trim() !== "<p><br></p>" &&
              newsTags.length > 0
                ? "filled"
                : "in_filling"
            }
          >
            <div
              className={`flex flex-col gap-4 w-full border rounded-2xl p-4 md:p-5 min-h-fit ${
                isDark
                  ? "border-gray-700 bg-gray-800"
                  : "border-[#CFCFCF] bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 w-full min-h-fit">
                <div className="flex flex-col gap-2 w-full">
                  <label
                    className={`font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Konten Berita
                  </label>
                  <RichTextEditor
                    value={newsContent ?? ""}
                    onChange={setNewsContent}
                  />
                </div>

                {/* Tags Section */}
                <div className="flex flex-col gap-2 w-full">
                  <label
                    className={`font-medium ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    Tagar Berita
                  </label>

                  {/* Tag Input */}
                  <div className="flex flex-col gap-2 w-full">
                    <div
                      className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg min-h-[44px] ${
                        isDark
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <Icon
                        icon="tabler:tag-filled"
                        className="w-4 h-4 text-gray-500 flex-shrink-0"
                      />
                      <input
                        type="text"
                        placeholder="Tambah tagar..."
                        className={`flex-1 bg-transparent border-none outline-none text-sm w-full min-w-0 ${
                          isDark
                            ? "text-gray-200 placeholder-gray-400"
                            : "text-gray-900 placeholder-gray-500"
                        }`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const value = input.value.trim();
                            if (value) {
                              addTag(value);
                              input.value = "";
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Tag Chips Display */}
                    {newsTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
                        {newsTags.map((tag, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm max-w-full ${
                              isDark
                                ? "bg-blue-900/30 border-blue-600/50 text-blue-200"
                                : "bg-blue-50 border-blue-300 text-blue-700"
                            }`}
                          >
                            <Icon
                              icon="tabler:tag-filled"
                              className="w-3 h-3 flex-shrink-0"
                            />
                            <span className="truncate max-w-[120px] sm:max-w-none">
                              {tag}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className={`hover:opacity-70 transition-opacity flex-shrink-0 ${
                                isDark ? "text-blue-400" : "text-blue-500"
                              }`}
                            >
                              <Icon
                                icon="mingcute:close-line"
                                className="w-3 h-3"
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      <AnimatePresence>
        {showAuthorModal && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <motion.div
              key="add-author-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <AddAuthorModal
                onClose={closeAuthorModal}
                onSave={addAuthorsFromModal}
                existingAuthors={newsAuthors.map((author) => author.name)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
