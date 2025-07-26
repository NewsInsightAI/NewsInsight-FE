import type { Metadata } from "next";
import "./globals.css";
import "../styles/mobile-responsive.css";
import { Navbar } from "../components/Navbar";
import { Inter } from "next/font/google";
import Footer from "../components/Footer";
import { ToastProvider } from "@/context/ToastProvider";
import NextAuthSessionProvider from "@/components/SessionProvider";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { FontAccessibilityProvider } from "@/context/FontAccessibilityContext";
import { DarkModeWrapper } from "@/components/DarkModeWrapper";
import { LanguageProvider } from "@/context/LanguageContext";
import ScrollbarStyles from "@/components/ScrollbarStyles";
import AccessibilityFloatingButton from "@/components/ui/AccessibilityFloatingButton";

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
        {" "}
        <NextAuthSessionProvider>
          <DarkModeProvider>
            <FontAccessibilityProvider>
              <DarkModeWrapper>
                <LanguageProvider>
                  <ToastProvider>
                    <Navbar />
                    <main className="flex-1 w-full">{children}</main>
                    <Footer />
                    <AccessibilityFloatingButton />
                    <ScrollbarStyles />
                  </ToastProvider>
                </LanguageProvider>
              </DarkModeWrapper>
            </FontAccessibilityProvider>
          </DarkModeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
