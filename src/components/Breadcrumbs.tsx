import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Manrope } from "next/font/google";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isActive?: boolean;
};

const manropeFont = Manrope({ subsets: ["latin"] });

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav
      className={`flex items-center space-x-2 ${manropeFont.className} flex-wrap`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon icon="mdi:chevron-right" className="text-gray-500" />
          )}

          {item.isActive ? (
            <span className="text-[#2FAACC] font-bold">{item.label}</span>
          ) : (
            <Link
              href={item.href || "#"}
              className="text-gray-500 hover:text-[#2FAACC]"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
