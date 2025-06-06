"use client";

import NewsCard from "@/components/NewsCard";
import React from "react";

const listNews = [
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
  {
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjExO3WNgwV0W7T8jDC3xoVkEmYwIcvJp1ggkD5xM0b_wGToHvomCj4IqcETxeYBxd_8i4-ulsN4l8yJj1mb_EhFJpO3BwfoBgZSmk0l9jiHhXeU4sdpvOI0UOwl_dpuAoxy63UsfMNevxyjF0HsSPw0i_B8_JJd7sUW_X9vqnbed8079byk-StGkbWK9_5/s16000/gemini.png.webp",
    timestamp: "2025-04-28T00:00:00Z",
    link: "https://www.youtube.com/",
  },
];

export default function Profile() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4 overflow-y-auto outline-none">
      {listNews.map((news, index) => (
        <NewsCard
          key={index}
          source={news.source}
          title={news.title}
          imageUrl={news.imageUrl}
          timestamp={news.timestamp}
          link={news.link}
        />
      ))}
    </div>
  );
}
