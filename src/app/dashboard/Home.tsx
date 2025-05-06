/* eslint-disable @next/next/no-img-element */
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const popularNews = [
  "Manus AI Bikin Heboh, Lebih Hebat dari DeepSeek dan ChatGPT?",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
  "Apple mengatakan beberapa peningkatan AI pada Siri ditunda hingga 2026",
  "Alibaba Rilis Model AI QwQ-32B, Diklaim Ungguli OpenAI dan DeepSeek",
  "TSMC tawarkan usaha patungan Intel ke Nvidia, AMD dan Broadcom",
];

const popularTags = ["AI", "Teknologi", "Gaya Hidup", "Otomotif", "Gadget"];

const popularEditors = [
  {
    profile: "/images/profile.jpg",
    name: "Zane Nova",
    countArticles: 128,
  },
  {
    profile: "/images/profile.jpg",
    name: "Isla Pierce",
    countArticles: 80,
  },
  {
    profile: "/images/profile.jpg",
    name: "Jaxon Quill",
    countArticles: 70,
  },
];

const fastInfo = [
  {
    totalPublishedArticles: 15,
    totalNewComments: 20,
    totalVisitors: 100,
    totalActiveUsers: 50,
  },
];

export default function Home() {
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
    <div
      className="flex flex-col gap-6 justify-center items-start bg-white text-black rounded-4xl w-full p-6"
      style={{ height: `calc(100vh - ${navbarDashboardHeight}px)` }}
    >
      <div className="grid grid-cols-10 gap-6 w-full h-full">
        <div className="col-span-6 flex justify-between items-start bg-gradient-to-br from-[#2996b3] to-[#2555aa] rounded-3xl p-10 w-full">
          <div className="flex flex-col justify-between items-start h-full">
            <div className="flex flex-col justify-center items-start text-white">
              <div className="flex items-center gap-3">
                <Icon icon="fluent:people-12-filled" className="text-3xl" />
                <p className="text-2xl">Kunjungan Hari Ini</p>
              </div>
              <b className="text-[80px]">239</b>
            </div>

            <div className="flex items-center gap-3 text-white opacity-60">
              <Icon icon="icon-park-solid:time" className="text-base" />
              <p className="text-base">Diperbarui 16:00 WIB</p>
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

        <div className="col-span-4 flex flex-col gap-5 justify-between items-start bg-gradient-to-br from-[#2996b3] to-[#2555aa] rounded-3xl p-7 w-full h-full">
          <div className="flex flex-col justify-center items-start w-full h-full gap-3">
            <div className="flex items-center gap-2 text-white">
              <Icon icon="solar:graph-bold" className="text-3xl" />
              <p className="font-semibold text-xl">Kunjungan Hari Ini</p>
            </div>
            <div className="flex flex-col justify-center items-start text-white w-full h-full gap-3">
              {popularNews.map((news, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 mb-2 border border-white/30 rounded-2xl p-3 w-full"
                >
                  <p className="text-base font-bold">#{index + 1}</p>
                  <p className="text-sm">{news}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 w-full">
        <div className="col-span-6 flex flex-col justify-center items-start border border-black/30 rounded-3xl p-3 w-full">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
              <Icon icon="icon-park-outline:editor" className="text-2xl" />
            </div>
            <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
              Editor Teratas
            </p>
          </div>
          <div className="flex flex-col justify-start items-center w-full h-full mt-5">
            {popularEditors.map((editor, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 border-t border-black/15 p-4 w-full"
              >
                <div className="flex items-center gap-3 h-full">
                  <img
                    src={editor.profile}
                    alt="NewsInsight"
                    className="rounded-full object-cover h-12 w-12"
                  />
                  <div className="flex flex-col justify-center items-start">
                    <p className="text-base font-bold">{editor.name}</p>
                  </div>
                </div>
                <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
                  {editor.countArticles} Artikel
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-6 flex flex-col justify-center items-start border border-black/30 rounded-3xl p-3 w-full">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
              <Icon
                icon="fluent:calendar-info-20-filled"
                className="text-2xl"
              />
            </div>
            <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
              Informasi Cepat
            </p>
          </div>
          <div className="flex flex-col justify-start items-center w-full h-full mt-5">
            <div className="flex items-center justify-between gap-3 border-t border-black/15 p-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
                  <Icon icon="ooui:articles-ltr" className="text-2xl" />
                </div>
                <p className="text-black font-medium text-base">
                  Total artikel yang sudah dipublikasi
                </p>
              </div>
              <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
                {fastInfo[0].totalPublishedArticles}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-black/15 p-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
                  <Icon
                    icon="fluent:comment-badge-16-filled"
                    className="text-2xl"
                  />
                </div>
                <p className="text-black font-medium text-base">
                  Jumlah komentar baru
                </p>
              </div>
              <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
                {fastInfo[0].totalNewComments}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-black/15 p-4 w-full">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
                  <Icon icon="mingcute:eye-fill" className="text-2xl" />
                </div>
                <p className="text-black font-medium text-base">
                  Total pengunjung bulan ini
                </p>
              </div>
              <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
                {fastInfo[0].totalVisitors}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
