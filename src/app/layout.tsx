import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";

const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NewsInsight - Your News, Your Way",
  description: "Stay updated with personalized news with AI and Accessibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interFont.className} antialiased`}>
        <Navbar />
        <div className="bg-white min-h-screen">
          <main className="flex flex-col items-center justify-center h-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
