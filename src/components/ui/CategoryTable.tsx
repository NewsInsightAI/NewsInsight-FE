"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryForm from "../popup/AddEditCategory";
import { useDarkMode } from "@/context/DarkModeContext";

interface CategoryData {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  status: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalNews?: number; // Optional for now, can be added later
}

interface CategoryTableProps {
  datas: CategoryData[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
  onEdit?: (category: CategoryData) => void;
  onDelete?: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;
}

export default function CategoryTable({
  datas,
  loading = false,
  onRefresh,
  onEdit,
  onDelete,
  onBulkDelete,
}: CategoryTableProps) {
  const { isDark } = useDarkMode();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );

  const [showEditCategory, setShowEditCategory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryData | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // TODO: Implement loading state
  if (loading) {
    // Loading component can be added here
  } // TODO: Implement refresh functionality
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  // Use void to avoid lint error for unused variable
  void handleRefresh;

  // Handler functions for actions
  const handleEdit = (category: CategoryData) => {
    setSelectedCategory(category);
    setShowEditCategory(true);
    if (onEdit) {
      onEdit(category);
    }
  };

  const handleDelete = (category: CategoryData) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      setShowBulkDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(categoryToDelete.id);
      }
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedItems.length === 0 || isDeleting) return;

    setIsDeleting(true);
    try {
      const categoryIds = selectedItems.map((id) => parseInt(id));
      if (onBulkDelete) {
        await onBulkDelete(categoryIds);
      }
      setShowBulkDeleteConfirm(false);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error bulk deleting categories:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === datas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(datas.map((item) => item.id.toString()));
    }
  };

  return (
    <>
      <AnimatePresence>
        {showEditCategory && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="verify-email"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full inset-0 flex items-center justify-center"
            >
              <CategoryForm
                mode="edit"
                initialName={selectedCategory?.name || ""}
                initialDescription={selectedCategory?.description || ""}
                onClose={() => setShowEditCategory(false)}
                onSubmit={(data) => {
                  console.log(data);
                  setShowEditCategory(false);
                }}
              />{" "}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && categoryToDelete && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 mx-4 max-w-md w-full border ${
                isDark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <div className="text-center">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="mx-auto h-12 w-12 text-red-500 mb-4"
                />
                <h3
                  className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Hapus Kategori
                </h3>{" "}
                <p
                  className={`text-sm mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Apakah Anda yakin ingin menghapus kategori &quot;
                  {categoryToDelete.name}&quot;? Tindakan ini tidak dapat
                  dibatalkan.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Confirmation Modal */}
      <AnimatePresence>
        {showBulkDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
            <motion.div
              key="bulk-delete-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 mx-4 max-w-md w-full border ${
                isDark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <div className="text-center">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="mx-auto h-12 w-12 text-red-500 mb-4"
                />
                <h3
                  className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  Hapus Beberapa Kategori
                </h3>
                <p
                  className={`text-sm mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Apakah Anda yakin ingin menghapus {selectedItems.length}{" "}
                  kategori yang dipilih? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowBulkDeleteConfirm(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmBulkDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting
                      ? "Menghapus..."
                      : `Hapus ${selectedItems.length} Kategori`}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <div
          className={`mb-4 p-4 rounded-lg border ${
            isDark
              ? "bg-gray-800 border-gray-600"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {selectedItems.length} kategori dipilih
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems([])}
                className={`px-3 py-1 text-xs rounded-lg border ${
                  isDark
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Batalkan Pilihan
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Icon
                  icon="mingcute:delete-fill"
                  className="inline mr-1"
                  width={12}
                  height={12}
                />
                Hapus Terpilih
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View - Hidden on mobile */}
      <div
        className={`hidden md:block rounded-xl w-full transition-colors duration-300 border ${
          isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        {/* Horizontal scroll wrapper for mobile */}
        <div className="w-full overflow-x-auto">
          <table
            className={`w-full min-w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
          >
            <thead>
              <tr
                className={`border-b transition-colors duration-300 ${
                  isDark
                    ? "bg-blue-600/20 border-gray-600"
                    : "bg-[#367AF2]/12 border-gray-200"
                }`}
              >
                <th className="py-2 md:py-3 px-2 md:px-4 w-12">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                      checked={
                        selectedItems.length === datas.length &&
                        datas.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                    {selectedItems.length === datas.length && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-3 w-3 pointer-events-none"
                      />
                    )}
                  </div>
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[60px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  No
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[150px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Nama Kategori
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[200px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Deskripsi
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[120px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`py-2 md:py-3 px-2 md:px-4 text-left text-xs font-medium uppercase tracking-wider min-w-[100px] ${
                    isDark ? "text-gray-300" : "text-black"
                  }`}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y transition-colors duration-300 ${
                isDark ? "divide-gray-600" : "divide-gray-200"
              }`}
            >
              {datas.map((report, index) => (
                <tr
                  key={report.id}
                  className={`transition-colors duration-300 ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } ${index === datas.length - 1 ? "last:rounded-b-xl" : ""}`}
                >
                  <td className="py-2 md:py-4 px-2 md:px-4 w-12">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 md:h-5 md:w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                        checked={selectedItems.includes(report.id.toString())}
                        onChange={() => toggleSelectItem(report.id.toString())}
                      />
                      {selectedItems.includes(report.id.toString()) && (
                        <Icon
                          icon="mdi:check"
                          className="absolute text-white h-3 w-3 pointer-events-none"
                        />
                      )}
                    </div>
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {index + 1}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {report.name}
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    <div
                      className="max-w-xs truncate"
                      title={report.description || ""}
                    >
                      {report.description || "-"}
                    </div>
                  </td>
                  <td
                    className={`py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <Icon
                        icon={
                          report.status === "active"
                            ? "heroicons:check-circle"
                            : "heroicons:x-circle"
                        }
                        className="w-3 h-3 inline mr-1"
                      />
                      {report.status === "active" ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="py-2 md:py-4 px-2 md:px-4 text-xs md:text-sm">
                    <div className="flex flex-col md:flex-row gap-1 md:gap-2">
                      {" "}
                      <button
                        className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15 whitespace-nowrap"
                        onClick={() => handleEdit(report)}
                      >
                        <Icon
                          icon="mage:edit-fill"
                          className="inline mr-1"
                          width={12}
                          height={12}
                        />
                        <span className="hidden md:inline">Edit</span>
                      </button>
                      <button
                        className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm hover:opacity-80 hover:cursor-pointer whitespace-nowrap"
                        onClick={() => handleDelete(report)}
                      >
                        <Icon
                          icon="mingcute:delete-fill"
                          className="inline mr-1"
                          width={12}
                          height={12}
                        />
                        <span className="hidden md:inline">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Card View - Visible only on mobile */}
      <div className="md:hidden space-y-4">
        {datas.map((category, index) => (
          <div
            key={category.id}
            className={`rounded-xl p-4 transition-colors duration-300 border ${
              isDark
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Card Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                  checked={selectedItems.includes(category.id.toString())}
                  onChange={() => toggleSelectItem(category.id.toString())}
                />
                {selectedItems.includes(category.id.toString()) && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-2.5 w-2.5 pointer-events-none"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={`font-semibold text-base ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <span
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    #{index + 1}
                  </span>
                </div>
                <p
                  className={`text-sm leading-5 line-clamp-2 ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {category.description}
                </p>
              </div>{" "}
            </div>
            {/* Card Content */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <Icon
                    icon={
                      category.status === "active"
                        ? "heroicons:check-circle"
                        : "heroicons:x-circle"
                    }
                    className="w-3 h-3 inline mr-1"
                  />
                  {category.status === "active" ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Dibuat:
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}
                >
                  {new Date(category.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Diperbarui:
                </span>
                <span
                  className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}
                >
                  {new Date(category.updatedAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
            {/* Card Actions */}{" "}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                className="flex-1 border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => handleEdit(category)}
              >
                <Icon icon="mage:edit-fill" width={12} height={12} />
                <span>Edit</span>
              </button>
              <button
                className="flex-1 border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-xs hover:opacity-80 hover:cursor-pointer flex items-center justify-center gap-1"
                onClick={() => handleDelete(category)}
              >
                <Icon icon="mingcute:delete-fill" width={12} height={12} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
