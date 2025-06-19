"use client";
import React, { useState } from "react";
import { TranslatedText } from "@/components/TranslatedTextSimple";
import { TranslatedContent } from "@/components/TranslatedContent";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useDarkMode } from "@/context/DarkModeContext";

export default function TranslateTestComponent() {
  const [testText, setTestText] = useState("Selamat datang di NewsInsight");
  const { isDark, toggleDark } = useDarkMode();

  const sampleHtmlContent = `
    <h2>Contoh Artikel dengan Kutipan</h2>
    <p>Ini adalah contoh artikel yang mengandung kutipan penting dari berbagai sumber.</p>
    
    <blockquote>
      <p>"Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia."</p>
      <cite>Nelson Mandela</cite>
    </blockquote>
    
    <p>Kutipan di atas menunjukkan betapa pentingnya pendidikan dalam kehidupan manusia. Pendidikan tidak hanya membentuk karakter, tetapi juga membuka wawasan yang luas.</p>
    
    <blockquote>
      <p>"Investasi terbaik adalah investasi pada diri sendiri melalui pendidikan dan pembelajaran berkelanjutan."</p>
    </blockquote>
    
    <h3>Manfaat Pendidikan</h3>
    <ul>
      <li>Meningkatkan kualitas hidup</li>
      <li>Membuka peluang karir yang lebih baik</li>
      <li>Mengembangkan kemampuan berpikir kritis</li>
    </ul>
    
    <blockquote>
      <p>"Belajar tanpa berpikir adalah sia-sia, berpikir tanpa belajar adalah berbahaya."</p>
      <cite>Konfusius</cite>
    </blockquote>
  `;

  const testTranslateAPI = async () => {
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "Kategori",
          from: "id",
          to: "en",
        }),
      });

      const result = await response.json();
      console.log("API Test Result:", result);
      alert(
        `API Test: ${result.success ? "SUCCESS" : "FAILED"}\nResult: ${JSON.stringify(result, null, 2)}`
      );
    } catch (error) {
      console.error("API Test Error:", error);
      alert(`API Test Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        Language Translation Test
      </h1>
      {/* Language Selector */}
      <div className="text-center">
        <h2 className="text-xl mb-4">Select Language:</h2>
        <LanguageSelector showFullName />
      </div>
      {/* Translation Test */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl mb-4">Translation Test:</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Original Text (Indonesian):
            </label>
            <input
              type="text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Translated Text:
            </label>
            <div className="w-full p-2 border rounded bg-white">
              <TranslatedText>{testText}</TranslatedText>
            </div>
          </div>
        </div>
      </div>

      {/* HTML Content Translation Test */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl mb-4">HTML Content Translation Test:</h2>{" "}
        <div className="bg-white p-4 border rounded">
          <TranslatedContent
            htmlContent={sampleHtmlContent}
            plainTextContent="Ini adalah contoh artikel dengan kutipan"
            fontSize="medium"
          />
        </div>
      </div>

      {/* API Test Button */}
      <div className="text-center">
        <button
          onClick={testTranslateAPI}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Translation API
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="text-center">
        <button
          onClick={toggleDark}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Toggle Theme (Currently: {isDark ? "Dark" : "Light"})
        </button>
      </div>

      {/* Multiple Translated Texts */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl mb-4">Multiple Translations:</h2>
        <div className="space-y-4">
          <div className="p-4 bg-white rounded border">
            <h3 className="font-semibold mb-2">Menu Items:</h3>
            <ul className="space-y-2">
              <li>
                <TranslatedText>Beranda</TranslatedText>
              </li>
              <li>
                <TranslatedText>Kategori</TranslatedText>
              </li>
              <li>
                <TranslatedText>Profil</TranslatedText>
              </li>
              <li>
                <TranslatedText>Pengaturan</TranslatedText>
              </li>
              <li>
                <TranslatedText>Keluar</TranslatedText>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-semibold mb-2">Common Phrases:</h3>
            <ul className="space-y-2">
              <li>
                <strong>Welcome: </strong>
                <TranslatedText>Selamat datang</TranslatedText>
              </li>
              <li>
                <strong>Thank you: </strong>
                <TranslatedText>Terima kasih</TranslatedText>
              </li>
              <li>
                <strong>Please: </strong>
                <TranslatedText>Silakan</TranslatedText>
              </li>
              <li>
                <strong>Good morning: </strong>
                <TranslatedText>Selamat pagi</TranslatedText>
              </li>
              <li>
                <strong>Good night: </strong>
                <TranslatedText>Selamat malam</TranslatedText>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded border">
            <h3 className="font-semibold mb-2">News Related:</h3>
            <ul className="space-y-2">
              <li>
                <strong>Latest News: </strong>
                <TranslatedText>Berita Terbaru</TranslatedText>
              </li>
              <li>
                <strong>Breaking News: </strong>
                <TranslatedText>Berita Utama</TranslatedText>
              </li>
              <li>
                <strong>Sports: </strong>
                <TranslatedText>Olahraga</TranslatedText>
              </li>
              <li>
                <strong>Technology: </strong>
                <TranslatedText>Teknologi</TranslatedText>
              </li>
              <li>
                <strong>Politics: </strong>
                <TranslatedText>Politik</TranslatedText>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
