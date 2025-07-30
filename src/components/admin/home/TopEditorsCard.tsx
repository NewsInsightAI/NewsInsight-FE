/* eslint-disable @next/next/no-img-element */
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

interface Editor {
  profile: string;
  name: string;
  countArticles: number;
}

interface Props {
  editors: Editor[];
}

export default function TopEditorsCard({ editors }: Props) {
  const { isDark } = useDarkMode();
  return (
    <div
      className={`flex flex-col justify-start items-start border rounded-3xl p-4 md:p-5 lg:p-8 w-full h-full transition-colors duration-300 min-h-[240px] md:min-h-[280px] lg:min-h-[380px] xl:min-h-[420px] ${
        isDark ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon="icon-park-outline:editor" className="text-2xl" />
        </div>{" "}
        <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
          <TranslatedText>Editor Teratas</TranslatedText>
        </p>
      </div>
      <div className="flex flex-col justify-start items-center w-full h-full mt-3">
        {editors.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full py-8">
            <div className="mb-4 opacity-50">
              <Icon
                icon="mdi:account-edit-outline"
                className="text-6xl text-gray-400"
              />
            </div>
            <p
              className={`text-center text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <TranslatedText>Belum ada data editor tersedia</TranslatedText>
            </p>
            <p
              className={`text-center text-xs mt-2 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <TranslatedText>
                Data akan muncul setelah editor mempublikasi artikel
              </TranslatedText>
            </p>
          </div>
        ) : (
          editors.map((editor, index) => (
            <div
              key={index}
              className={`flex items-center justify-between gap-3 border-t py-4 w-full ${
                isDark ? "border-gray-600" : "border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 h-full">
                <img
                  src={editor.profile || "/images/default_profile.png"}
                  alt="Editor"
                  className="rounded-full object-cover h-12 w-12"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/default_profile.png";
                  }}
                />
                <div className="flex flex-col justify-center items-start">
                  <p
                    className={`text-base font-bold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {editor.name}
                  </p>
                </div>
              </div>{" "}
              <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
                {editor.countArticles} <TranslatedText>Artikel</TranslatedText>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
