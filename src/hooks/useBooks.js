import { useEffect, useState } from "react";
import { API } from "../lib/books";

export default function useBooks(query, genre) {
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoading(true);
      setError("");
      setBooks([]);
      setNextPage(null);

      const params = new URLSearchParams();
      const searchText = query.trim();
      if (searchText) params.set("search", searchText);
      if (genre !== "All Books") params.set("topic", genre.toLowerCase());

      try {
        const response = await fetch(`${API}?${params}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("The catalog could not be loaded.");

        const data = await response.json();
        setBooks(data.results || []);
        setNextPage(data.next || null);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(
          "We couldn't load the books. Check your internet connection and try again."
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadBooks();
    return () => controller.abort();
  }, [query, genre]);

  async function loadMore() {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const response = await fetch(nextPage);
      if (!response.ok) throw new Error("Unable to load more books.");

      const data = await response.json();
      setBooks((current) => {
        const existing = new Set(current.map((book) => book.id));
        const fresh = (data.results || []).filter(
          (book) => !existing.has(book.id)
        );
        return [...current, ...fresh];
      });
      setNextPage(data.next || null);
    } catch {
      setError("Couldn't load more books. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }

  return { books, nextPage, loading, loadingMore, error, loadMore };
}
