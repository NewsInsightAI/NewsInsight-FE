"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";

interface Category {
  label: string;
  value: string;
}

interface ListNewsCategoryProps {
  onClose: () => void;
  onSave: (selectedCategories: Category[]) => void;
}

const categories: Category[] = [
  { label: "Teknologi", value: "teknologi" },
  { label: "Pendidikan", value: "pendidikan" },
  { label: "Politik", value: "politik" },
  { label: "Ekonomi & Bisnis", value: "ekonomi-bisnis" },
  { label: "Sains & Kesehatan", value: "sains-kesehatan" },
  { label: "Olahraga", value: "olahraga" },
  { label: "Hiburan & Selebriti", value: "hiburan-selebriti" },
  { label: "Gaya Hidup", value: "gaya-hidup" },
];

export default function ListNewsCategory({
  onClose,
  onSave,
}: ListNewsCategoryProps) {
  const { isDark } = useDarkMode();
  const [findCategory, setFindCategory] = useState<string>("");
  const [selected, setSelected] = useState<Category[]>([]);

  const maxSelect = 5;

  const handleToggleCategory = (category: Category) => {
    if (selected.find((item) => item.value === category.value)) {
      setSelected(selected.filter((item) => item.value !== category.value));
    } else {
      if (selected.length < maxSelect) {
        setSelected([category, ...selected]);
      }
    }
  };

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(findCategory.toLowerCase())
  );

  const isSelected = (category: Category) =>
    selected.find((item) => item.value === category.value);
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-6 transition-colors duration-300 ${
        isDark ? "text-white" : "text-black"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div
        className={`relative rounded-2xl shadow-xl p-8 w-full max-w-[95%] lg:max-w-[800px] text-center space-y-6 transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {" "}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-2 rounded-full transition cursor-pointer ${
            isDark
              ? "hover:bg-gray-700 text-gray-400"
              : "hover:bg-gray-100 text-gray-500"
          }`}
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>
        <div className="space-y-2">
          <h2
            className={`text-2xl font-bold transition-colors duration-300 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Daftar Kategori Berita
          </h2>
          <p
            className={`text-sm transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Silahkan pilih kategori yang prioritas untuk ditampilkan
          </p>
        </div>{" "}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kategori..."
            value={findCategory}
            onChange={(e) => setFindCategory(e.target.value)}
            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm transition-colors duration-300 ${
              isDark
                ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400"
                : "border-gray-300 bg-white text-black placeholder:text-gray-500"
            }`}
          />
          <Icon
            icon="mdi:magnify"
            className={`absolute right-4 top-1/2 -translate-y-1/2 ${
              isDark ? "text-gray-400" : "text-gray-400"
            }`}
          />
        </div>
        {/* List of categories with animations */}
        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {" "}
                <button
                  type="button"
                  onClick={() => handleToggleCategory(cat)}
                  disabled={selected.length >= maxSelect && !isSelected(cat)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm border transition cursor-pointer w-full ${
                    isSelected(cat)
                      ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                      : isDark
                        ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                  } ${
                    selected.length >= maxSelect && !isSelected(cat)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {cat.label}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>{" "}
        <div className="flex flex-col items-center mt-4 gap-2.5 w-full">
          <div
            className={`text-base font-medium bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] bg-clip-text text-transparent rounded-xl px-5 py-2.5 mt-4 border border-[#367AF2] w-full transition-colors duration-300 ${
              isDark ? "border-blue-500" : "border-[#367AF2]"
            }`}
          >
            {selected.length} kategori dipilih dari {maxSelect}
          </div>

          <div className="flex gap-2.5 w-full">
            <button
              onClick={onClose}
              className={`flex-1 py-3 rounded-xl border transition ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={selected.length === 0}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition flex-1 cursor-pointer ${
                selected.length > 0
                  ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] hover:opacity-80"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <p>Simpan Perubahan</p>
              <Icon icon="material-symbols:save-rounded" fontSize={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
