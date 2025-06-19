"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

interface Props {
  visitCount: number;
  lastUpdated: string;
}

export default function TodayVisitCard({ visitCount, lastUpdated }: Props) {
  const { isDark } = useDarkMode();
  return (    <div
      className={`flex flex-row justify-between items-center rounded-3xl p-4 md:p-6 lg:p-8 w-full h-full border transition-colors duration-300 min-h-[140px] md:min-h-[160px] lg:min-h-[280px] xl:min-h-[320px] ${
        isDark
          ? "bg-gradient-to-br from-[#2996b3] to-[#2555aa] border-gray-600"
          : "bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] border-blue-300"
      }`}
    >
      {/* Left side - Information */}
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col justify-center items-start text-white">
          {" "}          <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mb-1 md:mb-2 lg:mb-3">
            <Icon
              icon="fluent:people-12-filled"
              className="text-lg md:text-2xl lg:text-4xl xl:text-5xl"
            />
            <TranslatedText className="text-sm md:text-xl lg:text-3xl xl:text-4xl">
              Kunjungan Hari Ini
            </TranslatedText>
          </div>
          <b className="text-2xl md:text-4xl lg:text-7xl xl:text-8xl">{visitCount}</b>
        </div>{" "}
        <div className="flex items-center gap-2 lg:gap-3 text-white opacity-60 mt-2 md:mt-0">
          <Icon
            icon="icon-park-solid:time"
            className="text-xs md:text-sm lg:text-base"
          />
          <p className="text-xs md:text-sm lg:text-base">
            <TranslatedText>Diperbarui</TranslatedText> {lastUpdated}
          </p>
        </div>
      </div>{" "}
      {/* Right side - Image */}
      <div className="flex-shrink-0 h-full flex items-center">
        {" "}        <Image
          src="/images/undraw_online-articles.svg"
          alt="NewsInsight"
          width={100}
          height={100}
          className="object-contain w-[100px] h-[100px] md:w-[120px] md:h-[120px] lg:w-[240px] lg:h-[240px] xl:w-[280px] xl:h-[280px]"
        />
      </div>
    </div>
  );
}
