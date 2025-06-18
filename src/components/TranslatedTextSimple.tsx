"use client";
import React from "react";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

interface TranslatedTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

export const TranslatedText: React.FC<TranslatedTextProps> = ({
  children,
  className = "",
  as: Component = "span",
}) => {
  const { translatedText, isLoading } = useAutoTranslate(children);

  return React.createElement(
    Component,
    {
      className: `${className} ${isLoading ? "opacity-75" : ""}`,
    },
    translatedText
  );
};
