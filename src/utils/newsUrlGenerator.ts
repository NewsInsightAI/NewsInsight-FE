// Fungsi untuk membuat hash ID dari string (client-safe)
export function generateHashedId(input: string): string {
  // Simple hash function for client-side (untuk demo)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 8);
}

// Fungsi untuk membuat slug dari judul berita
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus kecuali spasi dan dash
    .replace(/\s+/g, "-") // Ganti spasi dengan dash
    .replace(/-+/g, "-") // Hapus multiple dash
    .trim()
    .replace(/^-+|-+$/g, ""); // Hapus dash di awal dan akhir
}

// Fungsi untuk format tanggal ke yyyy-mm-dd
export function formatDateForUrl(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

// Fungsi untuk membuat URL berita lengkap
export function generateNewsUrl(
  category: string,
  title: string,
  publishDate: string,
  id?: string
): string {
  const formattedDate = formatDateForUrl(publishDate);
  const hashedId = generateHashedId(id || `${title}-${publishDate}`);
  const slug = generateSlug(title);
  const categorySlug = generateSlug(category);

  return `/${categorySlug}/${formattedDate}/${hashedId}/${slug}`;
}
