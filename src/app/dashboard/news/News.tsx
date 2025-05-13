"use client";
import NewsTable from "@/components/ui/NewsTable";
import { newsData } from "@/utils/newsData";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function News() {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  return (
    <div className="flex flex-col justify-start items-start gap-3 h-full w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Image
            src="/images/news_rounded.svg"
            alt="news"
            width={28}
            height={28}
          />
          <p className="text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
            Daftar Berita
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center max-w-52 mx-auto">
            <div className={`relative w-full `}>
              <input
                type="text"
                placeholder="Cari berita..."
                className={`w-full px-6 py-3 border border-[#E2E2E2] rounded-full placeholder:text-[#818181] bg-white`}
              />
              <Icon
                icon="material-symbols:search-rounded"
                fontSize={24}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black"
              />
            </div>
          </div>
          <Link
            href="/dashboard/news/add"
            className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-5 py-2.5 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer"
          >
            <Icon icon="basil:add-solid" fontSize={20} />
            <p>Tambah Berita</p>
          </Link>
        </div>
      </div>
      <NewsTable
        datas={newsData.map((news) => ({
          ...news,
          author: [...news.author],
        }))}
      />
    </div>
  );
}
