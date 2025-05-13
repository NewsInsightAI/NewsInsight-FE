"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

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
  return (
    <div className="col-span-4 flex flex-col justify-center items-start border border-zinc-300 rounded-3xl p-5 w-full">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon="fluent:calendar-info-20-filled" className="text-2xl" />
        </div>
        <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
          Informasi Cepat
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
  return (
    <div className="flex items-center justify-between gap-3 border-t border-black/15 py-3 w-full">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon={icon} className="text-2xl" />
        </div>
        <p className="text-black font-medium text-base">{label}</p>
      </div>
      <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white font-bold">
        {value}
      </p>
    </div>
  );
}
