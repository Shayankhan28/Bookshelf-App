const BASE = "https://openlibrary.org";

export const fetchPopularBooks = async () => {
  const res = await fetch(`${BASE}/subjects/fiction.json?limit=20`);
  const data = await res.json();
  return data.works || [];
};

export const fetchBooksByQuery = async (query) => {
  const res = await fetch(
    `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=20`,
  );
  const data = await res.json();
  return data.docs || [];
};

export const getBookCover = (coverId) =>
  coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : "https://via.placeholder.com/128x180?text=No+Cover";
