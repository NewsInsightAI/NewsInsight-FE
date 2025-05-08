"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

interface Props {
  visitCount: number;
  lastUpdated: string;
}

export default function TodayVisitCard({ visitCount, lastUpdated }: Props) {
  return (
    <div className="col-span-6 flex justify-between items-start bg-gradient-to-br from-[#2996b3] to-[#2555aa] rounded-3xl p-10 w-full">
      <div className="flex flex-col justify-between items-start h-full">
        <div className="flex flex-col justify-center items-start text-white">
          <div className="flex items-center gap-3">
            <Icon icon="fluent:people-12-filled" className="text-3xl" />
            <p className="text-2xl">Kunjungan Hari Ini</p>
          </div>
          <b className="text-[80px]">{visitCount}</b>
        </div>

        <div className="flex items-center gap-3 text-white opacity-60">
          <Icon icon="icon-park-solid:time" className="text-base" />
          <p className="text-base">Diperbarui {lastUpdated}</p>
        </div>
      </div>
      <Image
        src="/images/undraw_online-articles.png"
        alt="NewsInsight"
        width={300}
        height={300}
        className="object-contain"
      />
    </div>
  );
}
