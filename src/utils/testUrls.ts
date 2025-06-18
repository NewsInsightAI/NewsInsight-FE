import { listNews } from "./listNews";

console.log("Generated URLs for news articles:");
console.log("=====================================");

listNews.forEach((news, index) => {
  console.log(`${index + 1}. ${news.title}`);
  console.log(`   URL: ${news.link}`);
  console.log(`   Category: ${news.category}`);
  console.log("---");
});

export {};
