import { generateNewsUrl } from "./newsUrlGenerator";

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  imageUrl: string;
  timestamp: string;
  category: string;
  link: string;
  content?: string;
  reporters?: string[];
  editors?: string[];
  tags?: string[];
}

const newsData = [
  {
    id: "news-001",
    source: "Reuters",
    title: "Google gratiskan Gemini Advanced untuk pelajar, tapi cuma di AS",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-28T00:00:00Z",
    category: "Teknologi",
    reporters: [
      "Alexandra Alper di Washington",
      "David Shepardson di Washington",
      "Harshita Meenaktshi di Bengaluru",
    ],
    editors: ["Mark Porter"],
    tags: ["Google", "Gemini Advanced", "AI", "Pendidikan", "Amerika Serikat"],
    content: `
      <p>Google mengumumkan bahwa mereka akan memberikan akses gratis ke <strong>Gemini Advanced</strong> untuk para pelajar di Amerika Serikat. Program ini merupakan bagian dari inisiatif perusahaan untuk mendukung pendidikan dan teknologi AI.</p>
      
      <h2>Detail Program</h2>
      <p>Pelajar yang memenuhi syarat akan mendapatkan:</p>
      <ul>
        <li>Akses penuh ke Gemini Advanced selama masa studi</li>
        <li>Dukungan teknis khusus untuk proyek akademik</li>
        <li>Workshop gratis tentang penggunaan AI dalam pendidikan</li>
      </ul>
      
      <blockquote>
        <p>"Kami percaya bahwa teknologi AI harus dapat diakses oleh semua kalangan, terutama generasi muda yang akan membentuk masa depan," kata CEO Google dalam konferensi pers.</p>
      </blockquote>
      
      <h2>Syarat dan Ketentuan</h2>
      <p>Program ini terbatas untuk:</p>
      <ol>
        <li>Mahasiswa aktif di universitas terakreditasi AS</li>
        <li>Pelajar SMA yang terdaftar dalam program STEM</li>
        <li>Peserta program coding bootcamp yang diakui</li>
      </ol>
      
      <p>Pendaftaran dibuka mulai bulan depan melalui platform resmi Google for Education.</p>
    `,
  },
  {
    id: "news-002",
    source: "Reuters",
    title: "Meta Rilis Fitur AI Baru untuk Instagram dan WhatsApp",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-27T00:00:00Z",
    category: "Teknologi",
    reporters: ["Sarah Mitchell di San Francisco", "Ahmad Rahman di Jakarta"],
    editors: ["Jennifer Smith", "Michael Johnson"],
    tags: [
      "Meta",
      "Instagram",
      "WhatsApp",
      "Artificial Intelligence",
      "Social Media",
    ],
  },
  {
    id: "news-003",
    source: "Kompas",
    title: "Pemerintah Umumkan Kebijakan Baru Sektor Energi Terbarukan",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-26T00:00:00Z",
    category: "Politik",
    tags: ["Pemerintah", "Energi Terbarukan", "Kebijakan", "Lingkungan"],
  },
  {
    id: "news-004",
    source: "Tempo",
    title: "Timnas Indonesia Lolos ke Final Piala Asia 2025",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-25T00:00:00Z",
    category: "Olahraga",
    tags: ["Timnas Indonesia", "Piala Asia", "Final", "Sepak Bola"],
  },
  {
    id: "news-005",
    source: "Detik",
    title: "Penemuan Baru dalam Dunia Kedokteran: Terapi Gen untuk Kanker",
    imageUrl: "/images/main_news.png",
    timestamp: "2025-04-24T00:00:00Z",
    category: "Kesehatan",
    tags: ["Kedokteran", "Terapi Gen", "Kanker", "Penelitian"],
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


export const listNews: NewsItem[] = newsData.map((news) => ({
  ...news,
  link: generateNewsUrl(news.category, news.title, news.timestamp, news.id),
}));
