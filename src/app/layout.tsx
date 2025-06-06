import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import { ToastProvider } from "@/context/ToastProvider";
import NextAuthSessionProvider from "@/components/SessionProvider";

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
      <body
        className={`${interFont.className} antialiased bg-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        <NextAuthSessionProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 w-full bg-white">{children}</main>
            <Footer />
          </ToastProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
