// Test file untuk generateNewsUrl
function generateHashedId(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).substring(0, 8);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

function formatDateForUrl(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

function generateNewsUrl(category, title, publishDate, id) {
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

// Test dengan data real dari database
const url1 = generateNewsUrl(
  "Teknologi",
  "Inovasi Transportasi Hijau: Bus Listrik Mulai Beroperasi di Jakarta",
  "2025-07-20T11:43:42.890Z",
  "64e88869bd6fccd0506f5e50aa0262e7" // hashedId real dari database
);

// Test dengan data dummy
const url2 = generateNewsUrl(
  "Teknologi",
  "Test News Title",
  "2025-07-20T11:43:42.890Z",
  "news-001" // id dummy pendek
);

console.log("URL dengan hashedId real (32 char):", url1);
console.log("URL dengan id dummy (pendek):", url2);
console.log();
console.log("Expected URL yang benar:");
console.log(
  "/teknologi/2025-07-20/64e88869bd6fccd0506f5e50aa0262e7/inovasi-transportasi-hijau-bus-listrik-mulai-beroperasi-di-jakarta"
);
