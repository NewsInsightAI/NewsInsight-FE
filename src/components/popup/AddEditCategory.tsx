import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";

interface CategoryFormProps {
  mode: "add" | "edit";
  initialName?: string;
  initialDescription?: string;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export default function CategoryForm({
  mode,
  initialName = "",
  initialDescription = "",
  onClose,
  onSubmit,
}: CategoryFormProps) {
  const [categoryName, setCategoryName] = useState(initialName);
  const [categoryDescription, setCategoryDescription] =
    useState(initialDescription);
  const popUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popUpRef.current &&
        !popUpRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ name: categoryName, description: categoryDescription });
    setCategoryName("");
    setCategoryDescription("");
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 text-black`}
      style={{ zIndex: 1000 }}
    >
      <div
        ref={popUpRef}
        className="flex flex-col items-start gap-3 bg-white rounded-2xl shadow-xl p-5 max-w-[95%]"
        style={{ width: `calc(40%)` }}
      >
        <div className="flex items-center gap-4 pb-4 border-b border-[#E2E2E2] w-full">
          <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
            <Icon
              icon="iconamoon:category-fill"
              className="text-4xl text-white"
            />
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold">
              {mode === "add" ? "Tambah Kategori" : "Edit Kategori"}
            </h2>
            <p className="opacity-50 text-sm">
              {mode === "add"
                ? "Masukkan informasi kategori yang ingin ditambahkan"
                : "Perbarui isi informasi kategori"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <Input
            id="name"
            type="text"
            icon="mingcute:text-fill"
            label="Nama Kategori"
            placeholder="Masukkan nama kategori..."
            value={categoryName}
            onChangeValue={setCategoryName}
            required
          />
          <Input
            id="description"
            type="text"
            icon="pajamas:text-description"
            label="Deskripsi Singkat"
            placeholder="Masukkan deskripsi singkat..."
            value={categoryDescription}
            onChangeValue={setCategoryDescription}
            required
          />

          <div className="flex items-center w-full gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-[#E2E2E2] text-[#5D6383] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!categoryName || !categoryDescription}
              className="w-full enabled:bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 enabled:hover:opacity-90 transition cursor-pointer disabled:bg-[#DEDEDE] disabled:cursor-not-allowed disabled:text-[#A2A2A2]"
            >
              Simpan
              <Icon
                icon="material-symbols:save-rounded"
                className="text-base"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
