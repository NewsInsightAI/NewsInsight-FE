/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface CompactNewsCard {
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  link: string;
}

export default function CompactNewsCard({
  source,
  title,
  imageUrl,
  timestamp,
  link,
}: CompactNewsCard) {
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
      <div className="flex flex-row gap-4 items-center justify-start w-full bg-white">
        <img
          src={imageUrl}
          alt={title}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text">
              {source}
            </p>
            <div className="h-1 w-1 bg-gray-400 rounded-full" />
            <p className="text-sm text-gray-500">{customFormattedTimestamp}</p>
          </div>
          <p
            className="text-black font-medium line-clamp-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}
