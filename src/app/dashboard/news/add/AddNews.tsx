/* eslint-disable @next/next/no-img-element */
"use client";
import RichTextEditor from "@/components/RichTextEditor";
import Input from "@/components/ui/Input";
import { newsCategoryOptions } from "@/utils/newsCategory";
import { newsStatusOptions } from "@/utils/newsStatus";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useRef, useState } from "react";
import { Vibrant } from "node-vibrant/browser";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  description: string;
  icon: string;
  status: string;
  children: React.ReactNode;
}

const Section = ({
  title,
  description,
  icon,
  status,
  children,
}: SectionProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_filling":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-400 text-white rounded-full px-3 py-1.5 text-xs"
          >
            Dalam Pengisian
          </motion.div>
        );
      case "filled":
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-full px-3 py-1.5 text-xs"
          >
            Sudah Lengkap
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-row items-start justify-start gap-2.5 w-full"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="h-10 w-10 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-2xl flex items-center justify-center p-2"
      >
        <Icon icon={icon} fontSize={32} className="text-white" />
      </motion.div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex flex-col w-full">
            <p className="text-base text-[#3A3A3A] font-bold">{title}</p>
            <p className="text-sm opacity-50">{description}</p>
          </div>
          <div className="flex items-center justify-end gap-2 w-full">
            {getStatusBadge(status)}
            <Icon icon="icon-park-solid:down-c" fontSize={28} />
          </div>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export default function AddNews() {
  const router = useRouter();
  const [newsTitle, setNewsTitle] = useState<string>("");
  const [newsCategory, setNewsCategory] = useState<string>("");
  const [newsStatus, setNewsStatus] = useState<string>("");
  const [newsPublishDate, setNewsPublishDate] = useState<Date | string>(
    "15 Maret 2025, 15:20 WIB"
  );
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [newsAuthor, setNewsAuthor] = useState<string>("Rigel Ramadhani W.");
  const [newsContent, setNewsContent] = useState<string | null>(null);
  const [newsTags, setNewsTags] = useState<string | null>(null);

  const [gradient, setGradient] = useState(
    "linear-gradient(to top, #367AF2CC, transparent)"
  );

  const [vibrantColor, setVibrantColor] = useState<string>("#bbc57b");

  const imgRef = useRef<HTMLImageElement>(null);

  const imageUrl = newsImage
    ? URL.createObjectURL(newsImage)
    : "https://placehold.co/400x200";

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

  // useEffect(() => {
  //   console.log("Konten berubah:", newsContent);
  // }, [newsContent]);

  return (
    <div className="flex flex-col w-full h-full gap-6">
      <div className="flex items-center justify-between w-full pb-2.5 border-b border-[#E2E2E2]">
        <div className="flex items-center gap-2">
          <Icon
            onClick={() => router.push("/dashboard/news")}
            icon="mingcute:arrow-left-circle-fill"
            className="cursor-pointer"
            fontSize={28}
            color="#367AF2"
          />
          <p className="text-xl bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-bold">
            Tambah Berita Baru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-[#CFCFCF] rounded-3xl px-5 py-3 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer border border-[#CFCFCF]">
            <Icon icon="material-symbols:draft" fontSize={20} />
            <p>Draf</p>
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-3xl px-5 py-3 hover:opacity-80 transition duration-300 ease-in-out cursor-pointer">
            <Icon icon="ic:round-publish" fontSize={20} />
            <p>Terbitkan</p>
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between w-full h-fit gap-6">
        <div className="flex flex-col gap-4 w-full items-start justify-start">
          <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-xl px-4 py-2.5 font-semibold w-full">
            <Icon icon="fluent:content-view-28-filled" fontSize={20} />
            <p className="text-sm">Preview Berita</p>
          </div>
          <div className="flex flex-col gap-4 w-full border rounded-2xl border-[#CFCFCF] p-5">
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
              {/* use <img> so Vibrant can read it */}
              <img
                alt="Preview"
                src={imageUrl}
                ref={imgRef}
                onLoad={() => {
                  Vibrant.from(imgRef.current as HTMLImageElement)
                    .getPalette()
                    .then((palette) => {
                      const hex = palette.Vibrant?.hex ?? "#bbc57b";
                      setGradient(
                        `linear-gradient(to top, ${hex}CC, transparent)`
                      );
                    })
                    .catch(() => {
                      setGradient(
                        "linear-gradient(to top, #367AF2CC, transparent)"
                      );
                    });
                }}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />

              {/* overlay gradient */}
              <div
                className="absolute inset-0 flex flex-col items-end justify-between p-6"
                style={{ background: gradient }}
              >
                <div className="flex w-full justify-end">
                  <p
                    className="text-base font-bold px-4 py-2 bg-white rounded-full"
                    style={{ color: vibrantColor }}
                  >
                    {newsCategory
                      ? newsCategory.charAt(0).toUpperCase() +
                        newsCategory.slice(1)
                      : "Kategori Berita"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <p className="text-white text-sm font-semibold">
                    {newsAuthor || "Nama Penulis"} •{" "}
                    <span className="font-normal">
                      {typeof newsPublishDate === "string"
                        ? newsPublishDate
                        : newsPublishDate?.toLocaleString() ||
                          "Tanggal Publikasi"}
                    </span>
                  </p>
                  <p className="text-white text-2xl font-semibold">
                    {newsTitle || "Judul Berita"}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="news-preview w-full h-full text-justify"
              dangerouslySetInnerHTML={{
                __html: newsContent || "<p>Konten berita muncul di sini</p>",
              }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full items-start justify-start">
          <Section
            title="Informasi Utama"
            description="Masukkan data dasar informasi berita"
            icon="solar:info-square-bold"
            status="in_filling"
          >
            <div className="flex flex-col gap-4 w-full border rounded-2xl border-[#CFCFCF] p-5">
              <form className="flex flex-col gap-4 w-full">
                <Input
                  label="Judul Berita"
                  placeholder="Masukkan judul berita..."
                  type="text"
                  icon="mingcute:text-fill"
                  value={newsTitle}
                  onChangeValue={setNewsTitle}
                  required
                />
                <Input
                  label="Kategori"
                  placeholder="Pilih kategori berita..."
                  type="select"
                  selectOptions={[...newsCategoryOptions]}
                  icon="iconamoon:category-fill"
                  value={
                    newsCategoryOptions.find(
                      (option) => option.value === newsCategory
                    ) || null
                  }
                  onSelectChange={(option) =>
                    setNewsCategory(
                      Array.isArray(option) ? "" : option?.value || ""
                    )
                  }
                  required
                />
                <Input
                  label="Status"
                  placeholder="Pilih status berita"
                  type="select"
                  disabled
                  selectOptions={[...newsStatusOptions]}
                  icon="fluent:status-24-filled"
                  value={
                    newsStatusOptions.find(
                      (option) => option.value === newsStatus
                    ) || null
                  }
                  onSelectChange={(option) =>
                    setNewsStatus(
                      Array.isArray(option) ? "" : option?.value || ""
                    )
                  }
                  required
                />
                <Input
                  label="Tanggal Publikasi"
                  placeholder="HH/BB/TTTT"
                  type="text"
                  icon="lets-icons:date-today"
                  value={newsPublishDate}
                  onChangeValue={(value) => {
                    setNewsPublishDate(value);
                  }}
                  disabled
                />
                <Input
                  label="Gambar Berita"
                  placeholder="Pilih gambar berita..."
                  type="file"
                  accept="image/*"
                  onFileChange={(files) => {
                    if (files && files.length > 0) {
                      setNewsImage(files[0]);
                    }
                  }}
                  required
                />
                <Input
                  label="Penulis"
                  placeholder="Masukkan nama penulis..."
                  type="text"
                  icon="fluent:person-28-filled"
                  value={newsAuthor}
                  onChangeValue={setNewsAuthor}
                  disabled
                />
              </form>
            </div>
          </Section>

          <Section
            title="Konten Berita"
            description="Masukkan konten utama berita dan tagar pendukung"
            icon="fluent:content-view-16-filled"
            status={
              (newsContent ?? "").length > 0 && (newsTags ?? "").length > 0
                ? "filled"
                : "in_filling"
            }
          >
            <div className="flex flex-col gap-4 w-full border rounded-2xl border-[#CFCFCF] p-5">
              <div className="flex flex-col gap-4 w-full">
                <RichTextEditor
                  value={newsContent ?? ""}
                  onChange={setNewsContent}
                />
                <Input
                  label="Tagar Berita"
                  placeholder="Masukkan tagar berita..."
                  type="text"
                  icon="tabler:tag-filled"
                  value={newsTags}
                  onChangeValue={setNewsTags}
                  required
                />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
