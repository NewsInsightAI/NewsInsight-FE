/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { listNews } from "@/utils/listNews";
import { Vibrant } from "node-vibrant/browser";

export default function Home() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) {
      setNavbarHeight(navbar.clientHeight);
    }

    const handleResize = () => {
      if (navbar) {
        setNavbarHeight(navbar.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [gradient, setGradient] = useState(
    "linear-gradient(to top, #367AF2CC, transparent)"
  );
  const [vibrantColor, setVibrantColor] = useState<string>("#bbc57b");

  const [newsImage] = useState<string | null>("/images/main_news.png");

  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = "/images/main_news.png";

  useEffect(() => {
    Vibrant.from(imageUrl)
      .getPalette()
      .then((palette) => {
        const hex = palette.Vibrant?.hex ?? "#bbc57b";
        setVibrantColor(hex);
        setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
      })
      .catch(() => {
        setVibrantColor("#367AF2");
        setGradient("linear-gradient(to top, #367AF2CC, transparent)");
      });

    return () => {
      if (newsImage) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl, newsImage]);

  // Dummy data untuk demo
  const newsCategory = "Teknologi";
  const newsAuthor = "Reuters";
  const newsPublishDate = "4 jam lalu";
  const newsTitle =
    "Penghargaan Teknologi Ban Internasional untuk Inovasi dan Keunggulan 2025 - pemenangnya diumumkan!";

  return (
    <div
      className="bg-white text-black min-h-screen p-6"
      style={{ paddingTop: navbarHeight + 24 }}
    >
      <div className="relative w-full h-[550px] rounded-3xl overflow-hidden">
        <img
          alt="Preview"
          src={imageUrl}
          ref={imgRef}
          onLoad={() => {
            Vibrant.from(imgRef.current as HTMLImageElement)
              .getPalette()
              .then((palette) => {
                const hex = palette.Vibrant?.hex ?? "#bbc57b";
                setGradient(`linear-gradient(to top, ${hex}CC, transparent)`);
              })
              .catch(() => {
                setGradient("linear-gradient(to top, #367AF2CC, transparent)");
              });
          }}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        <div
          className="absolute inset-0 flex flex-col items-end justify-between p-8"
          style={{ background: gradient }}
        >
          <div className="flex w-full justify-end">
            <p
              className="text-base font-bold px-4 py-2 bg-white rounded-full"
              style={{ color: vibrantColor }}
            >
              {newsCategory
                ? newsCategory.charAt(0).toUpperCase() + newsCategory.slice(1)
                : "Kategori Berita"}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <p className="text-white text-sm font-semibold">
              {newsAuthor || "Nama Penulis"} •{" "}
              <span className="font-normal">
                {newsPublishDate || "Tanggal Publikasi"}
              </span>
            </p>
            <p className="text-white text-[32px] font-semibold w-1/2">
              {newsTitle || "Judul Berita"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 overflow-y-auto outline-none">
        {listNews.map((news, index) => (
          <NewsCard
            key={index}
            source={news.source}
            title={news.title}
            imageUrl={news.imageUrl}
            timestamp={news.timestamp}
            link={news.link}
          />
        ))}
      </div>
    </div>
  );
}
