import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import { ToastProvider } from "@/context/ToastProvider";
import NextAuthSessionProvider from "@/components/SessionProvider";
import { DarkModeProvider } from "@/context/DarkModeContext";

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
        className={`${interFont.className} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      >
        <NextAuthSessionProvider>
          <DarkModeProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </ToastProvider>
          </DarkModeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
