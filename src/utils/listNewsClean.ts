import { generateNewsUrl } from "./newsUrlGenerator";

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  category: string;
  link: string;
}

const newsData = [
  {
    id: "news-001",
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-28T00:00:00Z",
    category: "Teknologi",
  },
  {
    id: "news-002",
    source: "Reuters",
    title: "Meta Rilis Fitur AI Baru untuk Instagram dan WhatsApp",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-27T00:00:00Z",
    category: "Teknologi",
  },
  {
    id: "news-003",
    source: "Kompas",
    title: "Pemerintah Umumkan Kebijakan Baru Sektor Energi Terbarukan",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-26T00:00:00Z",
    category: "Politik",
  },
  {
    id: "news-004",
    source: "Tempo",
    title: "Timnas Indonesia Lolos ke Final Piala Asia 2025",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-25T00:00:00Z",
    category: "Olahraga",
  },
  {
    id: "news-005",
    source: "Detik",
    title: "Penemuan Baru dalam Dunia Kedokteran: Terapi Gen untuk Kanker",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-24T00:00:00Z",
    category: "Kesehatan",
  },
  {
    id: "news-006",
    source: "CNN Indonesia",
    title: "Startup Indonesia Raih Funding Series A $10 Juta",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-23T00:00:00Z",
    category: "Bisnis",
  },
  {
    id: "news-007",
    source: "BBC Indonesia",
    title: "Festival Musik Internasional di Jakarta Sukses Digelar",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-22T00:00:00Z",
    category: "Hiburan",
  },
  {
    id: "news-008",
    source: "Antara",
    title: "Program Beasiswa Pemerintah untuk Mahasiswa Berprestasi",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-21T00:00:00Z",
    category: "Pendidikan",
  },
];

// Generate list berita dengan URL yang sesuai format
export const listNews: NewsItem[] = newsData.map((news) => ({
  ...news,
  link: generateNewsUrl(news.category, news.title, news.timestamp, news.id),
}));
