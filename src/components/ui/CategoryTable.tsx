"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import CategoryForm from "../popup/AddEditCategory";

interface CategoryData {
  id: number;
  name: string;
  description: string;
  totalNews: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryTableProps {
  datas: CategoryData[];
}

export default function CategoryTable({ datas }: CategoryTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );

  const [showEditCategory, setShowEditCategory] = useState(false);

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
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="bg-white overflow-x-auto w-full">
        <table className="min-w-full bg-white">
          <thead className="rounded-xl">
            <tr className="bg-[#367AF2]/12 border-b border-gray-200">
              <th className="py-3 px-4 relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                  checked={
                    selectedItems.length === datas.length && datas.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                {selectedItems.length === datas.length && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-3 w-3 pointer-events-none"
                  />
                )}
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                No
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Nama Kategori
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Deskripsi Singkat
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Jumlah Berita
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {datas.map((report, index) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
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
                <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.description}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.totalNews}
                </td>
                <td className="py-4 px-4 text-sm space-x-2">
                  <button
                    className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15"
                    onClick={() => {
                      setSelectedCategory(report);
                      setShowEditCategory(true);
                    }}
                  >
                    <Icon
                      icon="mage:edit-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Edit
                  </button>
                  <button className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer">
                    <Icon
                      icon="mingcute:delete-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
