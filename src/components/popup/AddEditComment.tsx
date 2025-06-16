import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Input from "../ui/Input";
import { useDarkMode } from "@/context/DarkModeContext";

interface CommentFormProps {
  mode: "add" | "edit";
  initialReaderName?: string;
  initialNewsTitle?: string;
  initialComment?: string;
  initialDateTime?: string;
  initalSafety?: string;
  onClose: () => void;
  onSubmit: (data: {
    readerName: string;
    newsTitle: string;
    comment: string;
    dateTime: string;
  }) => void;
}

export default function CommentForm({
  mode,
  initialReaderName = "",
  initialNewsTitle = "",
  initialComment = "",
  initialDateTime = "",

  onClose,
  onSubmit,
}: CommentFormProps) {
  const { isDark } = useDarkMode();
  const [readerName, setReaderName] = useState(initialReaderName);
  const [newsTitle, setNewsTitle] = useState(initialNewsTitle);
  const [comment, setComment] = useState(initialComment);
  const [dateTime, setDateTime] = useState<Date | null>(
    initialDateTime ? new Date(initialDateTime) : null
  );
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
    if (!dateTime || isNaN(dateTime.getTime())) {
      return;
    }
    onSubmit({
      readerName,
      newsTitle,
      comment,
      dateTime: dateTime.toISOString(),
    });

    setReaderName("");
    setNewsTitle("");
    setComment("");
    setDateTime(null);
  };

  const getSafetyLevel = (level: string) => {
    switch (level) {
      case "safe":
        return (
          <div className="flex gap-2 items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white">
            <Icon icon="iconamoon:shield-yes-fill" fontSize={20} />
            <p>Aman</p>
          </div>
        );
      case "unsafe":
        return (
          <div className="flex gap-2 items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#FF9799] to-[#EB0C0F] text-white">
            <Icon icon="mdi:shield-alert" fontSize={20} />
            <p>Berbahaya</p>
          </div>
        );
    }
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? "text-white" : "text-black"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div
        ref={popUpRef}
        className={`flex flex-col items-start gap-3 rounded-2xl shadow-xl p-5 max-w-[95%] transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
        style={{ width: `calc(40%)` }}
      >
        <div
          className={`flex items-center gap-4 pb-4 border-b w-full transition-colors duration-300 ${
            isDark ? "border-gray-600" : "border-[#E2E2E2]"
          }`}
        >
          <div className="flex items-center justify-center p-2.5 rounded-[30%] bg-gradient-to-br from-[#3BD5FF] to-[#367AF2]">
            <Icon
              icon="fluent:chat-24-filled"
              className="text-4xl text-white"
            />
          </div>{" "}
          <div className="flex flex-col items-start">
            <h2
              className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {mode === "add" ? "Tambah Komentar" : "Edit Komentar"}
            </h2>
            <p
              className={`text-sm transition-colors duration-300 ${
                isDark ? "text-gray-400" : "text-black/50"
              }`}
            >
              {mode === "add"
                ? "Masukkan komentar secara manual. Komentar akan diperiksa otomatis oleh AI sebelum dipublikasikan"
                : "Perbarui isi komentar. Sistem akan mengevaluasi ulang status dengan AI saat perubahan disimpan."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <Input
            id="readerName"
            type="text"
            icon="fluent:person-28-filled"
            label="Nama Pembaca"
            placeholder="Masukkan nama pembaca..."
            value={readerName}
            onChangeValue={setReaderName}
            required
          />
          <Input
            id="newsTitle"
            type="text"
            icon="mingcute:text-fill"
            label="Judul Berita"
            placeholder="Masukkan judul berita..."
            value={newsTitle}
            onChangeValue={setNewsTitle}
            required
          />
          <div className="flex items-end gap-2">
            <Input
              id="comment"
              type="text"
              icon="pajamas:text-description"
              label="Komentar"
              placeholder="Masukkan komentar..."
              value={comment}
              onChangeValue={setComment}
              required
            />
            {getSafetyLevel("safe")}
          </div>
          <Input
            id="dateTime"
            type="datetime"
            icon="lets-icons:date-today"
            label="Tanggal dan Waktu"
            placeholder="HH/BB/TTTT HH:MM:SS"
            value={dateTime}
            onDateChange={setDateTime}
            required
            disabled
          />{" "}
          <div className="flex items-center w-full gap-2 mt-5">
            <button
              type="button"
              onClick={onClose}
              className={`w-full border py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition cursor-pointer ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-[#E2E2E2] text-[#5D6383] hover:bg-gray-50"
              }`}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!readerName || !newsTitle || !comment || !dateTime}
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
