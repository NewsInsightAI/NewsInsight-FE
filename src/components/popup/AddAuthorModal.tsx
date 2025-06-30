"use client";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/context/DarkModeContext";

interface AddAuthorModalProps {
  onClose: () => void;
  onSave: (newAuthors: string[]) => void;
  existingAuthors: string[];
}

const suggestedAuthors = [
  "Rigel Ramadhani W.",
  "Andi Pratama",
  "Sari Wijaya",
  "Budi Santoso",
  "Maya Putri",
  "Dian Kusuma",
  "Reza Hakim",
  "Fitri Amaliya",
  "Hendra Gunawan",
  "Nina Sari",
];

export default function AddAuthorModal({
  onClose,
  onSave,
  existingAuthors,
}: AddAuthorModalProps) {
  const { isDark } = useDarkMode();
  const [searchAuthor, setSearchAuthor] = useState<string>("");
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const handleToggleAuthor = (author: string) => {
    if (selectedAuthors.includes(author)) {
      setSelectedAuthors(selectedAuthors.filter((item) => item !== author));
    } else {
      setSelectedAuthors([author, ...selectedAuthors]);
    }
  };

  const handleSave = () => {
    onSave(selectedAuthors);
    onClose();
  };

  const filteredAuthors = suggestedAuthors.filter(
    (author) =>
      author.toLowerCase().includes(searchAuthor.toLowerCase()) &&
      !existingAuthors.includes(author)
  );

  const isSelected = (author: string) => selectedAuthors.includes(author);

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
            Tambah Penulis
          </h2>
          <p
            className={`text-sm transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Pilih penulis yang ingin ditambahkan
          </p>
        </div>

        {/* Search Section */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari penulis..."
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
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

        {/* List of suggested authors with grid layout */}
        <div className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <AnimatePresence>
              {filteredAuthors.map((author) => (
                <motion.div
                  key={author}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleAuthor(author)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm border transition cursor-pointer w-full ${
                      isSelected(author)
                        ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white"
                        : isDark
                          ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                          : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Icon icon="fluent:person-28-filled" className="w-4 h-4" />
                    {author}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredAuthors.length === 0 && searchAuthor !== "" && (
            <p
              className={`text-center py-4 text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tidak ada penulis yang ditemukan
            </p>
          )}
        </div>

        <div className="flex flex-col items-center mt-4 gap-2.5 w-full">
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
              disabled={selectedAuthors.length === 0}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition flex-1 cursor-pointer ${
                selectedAuthors.length > 0
                  ? "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] hover:opacity-80"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <p>Tambah Penulis</p>
              <Icon icon="mingcute:add-line" fontSize={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
