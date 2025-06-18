"use client";
import React, { useState } from "react";
import { TranslatedText } from "@/components/TranslatedTextSimple";
import { TranslatedContent } from "@/components/TranslatedContent";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useDarkMode } from "@/context/DarkModeContext";

export default function TranslateTestPage() {
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
      {/* API Test Button */}
      <div className="text-center">
        <button
          onClick={testTranslateAPI}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Test API Directly
        </button>
      </div>{" "}
      {/* Blockquote Styling Test */}
      <div className="bg-purple-50 dark:bg-purple-900 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Blockquote Styling Test:</h2>
          <button
            onClick={toggleDark}
            className={`px-4 py-2 rounded transition-colors ${
              isDark
                ? "bg-yellow-500 text-black hover:bg-yellow-400"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <TranslatedContent
          htmlContent={sampleHtmlContent}
          plainTextContent="Sample plain text content for testing."
          fontSize="medium"
          newsTitle="Test Article with Blockquotes"
        />
      </div>
      {/* Example Texts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold mb-2">Menu Items:</h3>
          <ul className="space-y-1">
            <li>
              <TranslatedText>Kategori</TranslatedText>
            </li>
            <li>
              <TranslatedText>Tentang Kami</TranslatedText>
            </li>
            <li>
              <TranslatedText>Beranda</TranslatedText>
            </li>
            <li>
              <TranslatedText>Profil Saya</TranslatedText>
            </li>
            <li>
              <TranslatedText>Pengaturan</TranslatedText>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold mb-2">Actions:</h3>
          <ul className="space-y-1">
            <li>
              <TranslatedText>Masuk</TranslatedText>
            </li>
            <li>
              <TranslatedText>Keluar</TranslatedText>
            </li>
            <li>
              <TranslatedText>Mode Terang</TranslatedText>
            </li>
            <li>
              <TranslatedText>Mode Gelap</TranslatedText>
            </li>
            <li>
              <TranslatedText>Dashboard</TranslatedText>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
