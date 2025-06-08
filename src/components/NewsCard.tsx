/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface NewsCard {
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  link: string;
}

export default function NewsCard({
  source,
  title,
  imageUrl,
  timestamp,
  link,
}: NewsCard) {
  const formattedTimestamp = formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
    locale: id,
  });
  const router = useRouter();

  const customFormattedTimestamp = formattedTimestamp
    .replace("sekitar ", "")
    .replace("dalam waktu ", "")
    .replace("dulu", "lalu");

  return (
    <div onClick={() => router.push(link)} className="cursor-pointer w-full">
      <div className="flex flex-col items-start justify-start w-full bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E1E1E1] transition-shadow hover:shadow-md">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-36 sm:h-44 lg:h-48 object-cover rounded-xl sm:rounded-2xl"
        />
        <div className="p-3 sm:p-4 flex flex-col gap-1 sm:gap-2 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm font-bold bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text">
              {source}
            </p>
            <div className="h-1 w-1 bg-gray-400 rounded-full" />
            <p className="text-xs sm:text-sm text-gray-500">
              {customFormattedTimestamp}
            </p>
          </div>
          <p className="text-black font-medium text-sm sm:text-base leading-tight">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
