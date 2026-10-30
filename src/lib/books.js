export const API = "https://gutendex.com/books/";

export const GENRES = [
  "All Books",
  "Romance",
  "Mystery",
  "Fantasy",
  "Adventure",
  "Horror",
  "Science Fiction",
  "History",
];

const FAVORITES_KEY = "freeverse-favorites";

const READ_FORMATS = [
  "text/html",
  "text/html; charset=utf-8",
  "text/plain; charset=utf-8",
  "text/plain",
];

const DOWNLOAD_FORMATS = [
  "application/epub+zip",
  "application/pdf",
  "text/plain; charset=utf-8",
  "text/plain",
];

function findFormat(formats = {}, keys) {
  return keys.map((key) => formats[key]).find(Boolean) || null;
}

export function readLink(formats) {
  return findFormat(formats, READ_FORMATS);
}

export function downloadLink(formats) {
  return findFormat(formats, DOWNLOAD_FORMATS);
}

export function authorNames(book) {
  return (
    book.authors?.map((person) => person.name).join(", ") || "Unknown author"
  );
}

export function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    // Storage can be unavailable (private mode, quota); the shelf still works for the session.
  }
}

export function matchesFilters(book, search, genre) {
  const text = `${book.title} ${authorNames(book)}`.toLowerCase();
  if (search && !text.includes(search)) return false;
  if (genre === "All Books") return true;

  const topics = [...(book.bookshelves || []), ...(book.subjects || [])];
  return topics.some((topic) =>
    topic.toLowerCase().includes(genre.toLowerCase())
  );
}
