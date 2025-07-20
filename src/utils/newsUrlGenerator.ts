export function generateHashedId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 8);
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

export function formatDateForUrl(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

export function generateNewsUrl(
  category: string,
  title: string,
  publishDate: string,
  id?: string
): string {
  const formattedDate = formatDateForUrl(publishDate);
  // Jika id sudah ada (dari database), gunakan langsung sebagai hashedId
  // Jika tidak ada, generate hashedId baru (untuk data dummy)
  const hashedId =
    id && id.length > 8
      ? id
      : generateHashedId(id || `${title}-${publishDate}`);
  const slug = generateSlug(title);
  const categorySlug = generateSlug(category);

  return `/${categorySlug}/${formattedDate}/${hashedId}/${slug}`;
}
