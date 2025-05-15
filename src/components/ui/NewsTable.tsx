/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";

interface NewsData {
  id: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  title: string;
  category: CategoryProps;
  author: AuthorProps[];
  publishedAt: string;
  status: string;
}

interface AuthorProps {
  id: number;
  name: string;
}

interface CategoryProps {
  id: number;
  name: string;
}

interface NewsTableProps {
  datas: NewsData[];
}

export default function NewsTable({ datas }: NewsTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    id: string;
    image: string;
  } | null>(null);

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === datas.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(datas.map((item) => item.id.toString()));
    }
  };

  const getStatusBadge = (level: string) => {
    switch (level) {
      case "published":
        return (
          <span className="bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="ic:round-publish" className="w-4 h-4 mr-1" />
            Terbit
          </span>
        );
      case "draft":
        return (
          <span className="bg-[#9CA3AF]/15 text-[#9CA3AF] border border-[#9CA3AF] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="material-symbols:draft" className="w-4 h-4 mr-1" />
            Draf
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="solar:danger-triangle-bold" className="w-4 h-4 mr-1" />
            Terjadwal
          </span>
        );
      case "archived":
        return (
          <span className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon
              icon="material-symbols:archive-rounded"
              className="w-4 h-4 mr-1"
            />
            Arsip
          </span>
        );
      case "review":
        return (
          <span className="bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15] px-3 py-2 rounded-full flex items-center justify-center w-fit">
            <Icon icon="material-symbols:review" className="w-4 h-4 mr-1" />
            Review
          </span>
        );
      default:
        return null;
    }
  };

  const getDateTimeWithTimezone = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    return date.toLocaleString("id-ID", options);
  };

  const formatAuthorNames = (authors: AuthorProps[]): string => {
    if (!authors || authors.length === 0) {
      return "";
    }
    if (authors.length === 1) {
      return authors[0].name;
    }
    if (authors.length === 2) {
      return `${authors[0].name} dan ${authors[1].name}`;
    }

    const namesExceptLast = authors
      .slice(0, -1)
      .map((a) => a.name)
      .join(", ");
    const lastName = authors[authors.length - 1].name;
    return `${namesExceptLast} dan ${lastName}`;
  };

  return (
    <>
      <div className="bg-white overflow-x-auto w-full">
        <table className="min-w-full bg-white">
          <thead className="rounded-xl">
            <tr className="bg-[#367AF2]/12 border-b border-gray-200">
              <th className="py-3 px-4 relative flex items-center justify-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none hover:cursor-pointer hover:bg-[#367AF2]/10"
                  checked={
                    selectedItems.length === datas.length && datas.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                {selectedItems.length === datas.length && (
                  <Icon
                    icon="mdi:check"
                    className="absolute text-white h-3 w-3 pointer-events-none"
                  />
                )}
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                No
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Gambar
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Judul Berita
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Kategori
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Penulis
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Tanggal Publikasi
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-black uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {datas.map((report, index) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 appearance-none checked:bg-blue-600 checked:border-transparent ring-1 ring-[#367AF2] focus:outline-none"
                      checked={selectedItems.includes(report.id.toString())}
                      onChange={() => toggleSelectItem(report.id.toString())}
                    />
                    {selectedItems.includes(report.id.toString()) && (
                      <Icon
                        icon="mdi:check"
                        className="absolute text-white h-3 w-3 pointer-events-none"
                      />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{index + 1}</td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.imageUrl && (
                    <div
                      className="h-10 w-16 bg-gray-200 rounded cursor-pointer"
                      onClick={() =>
                        setSelectedPhoto({
                          id: report.id.toString(),
                          image: report.imageUrl,
                        })
                      }
                    >
                      <img
                        src={report.imageUrl}
                        alt="Report"
                        className="h-10 w-16 rounded object-cover"
                      />
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.title}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.category.name}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {report.author.length > 0
                    ? formatAuthorNames(report.author)
                    : "Tidak ada penulis"}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {getDateTimeWithTimezone(report.publishedAt)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {getStatusBadge(report.status)}
                </td>
                <td className="py-4 px-4 text-sm space-x-2">
                  <button
                    className="border bg-[#3B82F6]/15 border-[#3B82F6] text-[#3B82F6] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer disabled:border-[#DFDFDF] disabled:text-[#DFDFDF] disabled:bg-[#F5F5F5]/15"
                    onClick={() => console.log(`Edit report ${report.id}`)}
                  >
                    <Icon
                      icon="mage:edit-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Edit
                  </button>
                  <button className="border bg-[#EF4444]/15 border-[#EF4444] text-[#EF4444] rounded-full px-3 py-2 text-sm hover:opacity-80 hover:cursor-pointer">
                    <Icon
                      icon="mingcute:delete-fill"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedPhoto && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={selectedPhoto.image}
              alt="Selected"
              className="max-h-[80vh] max-w-[80vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
