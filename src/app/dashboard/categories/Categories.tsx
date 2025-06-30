"use client";
import CategoryForm from "@/components/popup/AddEditCategory";
import CategoryTable from "@/components/ui/CategoryTable";
import Pagination from "@/components/ui/Pagination";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { useCategories } from "@/hooks/useCategories";
import { CreateCategoryData, Category } from "@/lib/api/categories";
import { ClipLoader } from "react-spinners";
import { useToast } from "@/context/ToastProvider";

export default function Categories() {
  const { isDark } = useDarkMode();
  const { promise } = useToast();
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategory] = useState<Category | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const {
    categories,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    createCategory,
    updateCategory,
    deleteCategory,
    bulkDeleteCategories,
    refreshCategories,
    fetchCategories,
  } = useCategories();

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);

  const handleCreateCategory = async (data: {
    name: string;
    description: string;
  }) => {
    await promise(
      (async () => {
        const createCategoryData: CreateCategoryData = {
          name: data.name,
          description: data.description,
        };

        await createCategory(createCategoryData);
        setShowAddCategory(false);
      })(),
      {
        loading: "Menambahkan kategori...",
        success: "Kategori berhasil ditambahkan!",
        error: "Gagal menambahkan kategori. Silakan coba lagi.",
      }
    );
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    fetchCategories({ page });
  };

  const sortedCategories = React.useMemo(() => {
    const sorted = [...categories];

    sorted.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    return sorted;
  }, [categories, sortOrder]);
  const handleEditCategory = async (categoryData: {
    id: number;
    name: string;
    description: string | null;
  }) => {
    await promise(
      (async () => {
        await updateCategory(categoryData.id, {
          name: categoryData.name,
          description: categoryData.description || "",
        });
        await refreshCategories();
      })(),
      {
        loading: "Memperbarui kategori...",
        success: "Kategori berhasil diperbarui!",
        error: "Gagal memperbarui kategori. Silakan coba lagi.",
      }
    );
  };

  const handleDeleteCategory = async (id: number) => {
    await promise(
      (async () => {
        await deleteCategory(id);
        await refreshCategories();
      })(),
      {
        loading: "Menghapus kategori...",
        success: "Kategori berhasil dihapus!",
        error: "Gagal menghapus kategori. Silakan coba lagi.",
      }
    );
  };

  const handleBulkDeleteCategories = async (ids: number[]) => {
    await promise(
      (async () => {
        await bulkDeleteCategories(ids);
        await refreshCategories();
      })(),
      {
        loading: `Menghapus ${ids.length} kategori...`,
        success: `${ids.length} kategori berhasil dihapus!`,
        error: "Gagal menghapus kategori. Silakan coba lagi.",
      }
    );
  };
  return (
    <>
      <AnimatePresence>
        {showAddCategory && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              {" "}
              <CategoryForm
                mode="add"
                initialName={selectedCategory?.name || ""}
                initialDescription={selectedCategory?.description || ""}
                onClose={() => setShowAddCategory(false)}
                onSubmit={handleCreateCategory}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>{" "}
      <div className="flex flex-col justify-start items-start gap-3 md:gap-4 h-full w-full p-2 md:p-0 overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div className="flex-shrink-0 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-3 lg:gap-0">
          {/* Title Section */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/category_fill.svg"
              alt="news"
              width={28}
              height={28}
            />
            <p className="text-lg md:text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
              Daftar Kategori
            </p>
          </div>

          {/* Search and Action Section - Responsive */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-64">
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-full px-4 md:px-6 py-2.5 md:py-3 border rounded-full text-sm md:text-base transition-colors duration-300 ${
                  isDark
                    ? "border-gray-600 bg-gray-800 text-white placeholder:text-gray-400"
                    : "border-[#E2E2E2] bg-white text-black placeholder:text-[#818181]"
                }`}
              />
              <Icon
                icon="material-symbols:search-rounded"
                fontSize={20}
                className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-400" : "text-black"
                }`}
              />
            </div>
            {/* Add Button */}
            <button
              onClick={() => {
                setShowAddCategory(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-4 md:px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer text-sm md:text-base whitespace-nowrap"
            >
              <Icon icon="basil:add-solid" fontSize={18} />
              <span className="hidden sm:inline">Tambah Kategori</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <ClipLoader
                  color={isDark ? "#3B82F6" : "#2563EB"}
                  loading={true}
                  size={48}
                />
                <p
                  className={`text-sm mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Memuat data kategori...
                </p>
              </div>
            </div>
          ) : sortedCategories.length === 0 && !error ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <p
                  className={`text-lg mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  {searchQuery
                    ? "Tidak ada kategori yang ditemukan"
                    : "Belum ada kategori"}
                </p>
                <p
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {searchQuery
                    ? "Coba kata kunci yang berbeda"
                    : "Mulai tambahkan kategori pertama Anda"}
                </p>
              </div>
            </div>
          ) : (
            <CategoryTable
              datas={sortedCategories}
              loading={loading}
              onRefresh={refreshCategories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onBulkDelete={handleBulkDeleteCategories}
              onSort={handleSortChange}
              sortOrder={sortOrder}
            />
          )}

          {/* Pagination */}
          {!loading && sortedCategories.length > 0 && pagination && (
            <div className="mt-4">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalCategories}
                itemsPerPage={10}
                onPageChange={handlePageChange}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
