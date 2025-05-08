/* eslint-disable @next/next/no-img-element */
"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface Editor {
  profile: string;
  name: string;
  countArticles: number;
}

interface Props {
  editors: Editor[];
}

export default function TopEditorsCard({ editors }: Props) {
  return (
    <div className="col-span-4 flex flex-col justify-center items-start border border-zinc-300 rounded-3xl p-5 w-full">
      <div className="flex items-center gap-3">
        <div className="flex justify-center items-center bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-white rounded-2xl p-2.5">
          <Icon icon="icon-park-outline:editor" className="text-2xl" />
        </div>
        <p className="bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] text-transparent bg-clip-text font-semibold text-xl">
          Editor Teratas
        </p>
      </div>
      <div className="flex flex-col justify-start items-center w-full h-full mt-5">
        {editors.map((editor, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 border-t border-black/15 py-4 w-full"
          >
            <div className="flex items-center gap-3 h-full">
              <img
                src={editor.profile}
                alt="Editor"
                className="rounded-full object-cover h-12 w-12"
              />
              <div className="flex flex-col justify-center items-start">
                <p className="text-base font-bold">{editor.name}</p>
              </div>
            </div>
            <p className="text-sm bg-gradient-to-br from-[#3BD5FF] to-[#367AF2] rounded-full px-3 py-1 text-white">
              {editor.countArticles} Artikel
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
