"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

interface FastInfo {
  totalPublishedArticles: number;
  totalNewComments: number;
  totalVisitors: number;
  totalActiveUsers: number;
}

interface Props {
  info: FastInfo;
}

export default function QuickInfoCard({ info }: Props) {
  const { isDark } = useDarkMode();
  return (
    <div
      className={`flex flex-col justify-start items-start border rounded-3xl p-4 md:p-5 lg:p-8 w-full h-full transition-colors duration-300 min-h-[240px] md:min-h-[280px] lg:min-h-[380px] xl:min-h-[420px] ${
        isDark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon="fluent:calendar-info-20-filled" className="text-2xl" />
        </div>{" "}
        <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
          <TranslatedText>Informasi Cepat</TranslatedText>
        </p>
      </div>
      <div className="flex flex-col justify-start items-center w-full h-full mt-3">
        <InfoRow
          icon="ooui:articles-ltr"
          label="Total artikel yang sudah dipublikasi"
          value={info.totalPublishedArticles}
        />
        <InfoRow
          icon="fluent:comment-badge-16-filled"
          label="Jumlah komentar baru"
          value={info.totalNewComments}
        />
        <InfoRow
          icon="mingcute:eye-fill"
          label="Total pengunjung bulan ini"
          value={info.totalVisitors}
        />
        <InfoRow
          icon="tdesign:user-time-filled"
          label="Jumlah pengunjung aktif sekarang"
          value={info.totalActiveUsers}
        />
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  const { isDark } = useDarkMode();

  return (
    <div
      className={`flex items-center justify-between gap-3 border-t py-3 w-full ${
        isDark ? "border-gray-600" : "border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon={icon} className="text-2xl" />
        </div>{" "}
        <p
          className={`font-medium text-base ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          <TranslatedText>{label}</TranslatedText>
        </p>
      </div>
      <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white font-bold">
        {value}
      </p>
    </div>
  );
}
