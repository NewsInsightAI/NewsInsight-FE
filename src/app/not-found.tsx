import { Sora } from "next/font/google";
import Link from "next/link";
const SoraFont = Sora({ subsets: ["latin"] });
export default function NotFound() {
  return (
    <div
      className={`bg-white flex flex-col items-center justify-center min-h-screen text-center p-10 ${SoraFont.className}`}
    >
      <img
        src="/images/404.svg"
        alt="404 Illustration"
        className="w-64 h-auto mb-6"
      />

      <p className="text-lg text-gray-600 mb-6">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link
        href="/"
        className="bg-[#38A7F8] text-white px-4 py-2 rounded-xl hover:bg-[#38A7F8] transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
