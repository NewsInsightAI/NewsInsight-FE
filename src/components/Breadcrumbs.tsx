import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { useDarkMode } from "@/context/DarkModeContext";
import { TranslatedText } from "@/components/TranslatedText";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

const manropeFont = Manrope({ subsets: ["latin"] });

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const { isDark } = useDarkMode();

  return (
    <div className={`w-full ${className}`}>
      <nav
        className={`flex items-center ${manropeFont.className} overflow-x-auto no-scrollbar`}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2 whitespace-nowrap min-w-max">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <li className="flex items-center justify-center">
                  <Icon
                    icon="material-symbols:chevron-right"
                    className={`text-sm transition-colors ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </li>
              )}

              <li className="flex items-center">
                {item.isActive ? (
                  <div
                    className={`flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                      isDark ? "text-blue-300" : "text-blue-700"
                    }`}
                  >
                    {index === 0 && (
                      <Icon
                        icon="material-symbols:home-filled"
                        className="w-4 h-4 mr-2 flex-shrink-0"
                      />
                    )}{" "}
                    <span className="max-w-[200px] sm:max-w-[300px] md:max-w-[400px] truncate">
                      <TranslatedText>{item.label}</TranslatedText>
                    </span>
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 hover:scale-[1.02] group ${
                      isDark
                        ? "text-gray-400 hover:text-blue-300 hover:bg-gray-800/30"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/70"
                    }`}
                  >
                    {index === 0 && (
                      <Icon
                        icon="material-symbols:home-filled"
                        className="w-4 h-4 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                      />
                    )}{" "}
                    <span className="max-w-[150px] sm:max-w-[200px] md:max-w-[300px] truncate">
                      <TranslatedText>{item.label}</TranslatedText>
                    </span>
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
