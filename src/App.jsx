import { useEffect, useState } from "react";
import "./App.css";
import BookCard from "./components/BookCard";
import BookModal from "./components/BookModal";
import useBooks from "./hooks/useBooks";
import {
  GENRES,
  loadFavorites,
  matchesFilters,
  saveFavorites,
} from "./lib/books";

export default function App() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All Books");
  const [favorites, setFavorites] = useState(loadFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const { books, nextPage, loading, loadingMore, error, loadMore } = useBooks(
    query,
    genre
  );

  useEffect(() => saveFavorites(favorites), [favorites]);

  function toggleFavorite(book) {
    setFavorites((current) =>
      current.some((item) => item.id === book.id)
        ? current.filter((item) => item.id !== book.id)
        : [...current, book]
    );
  }

  function browse() {
    setShowFavorites(false);
    setSelectedBook(null);
  }

  function openShelf() {
    setShowFavorites(true);
    setSelectedBook(null);
  }

  const isFavorite = (book) => favorites.some((item) => item.id === book.id);
  const displayedBooks = showFavorites
    ? favorites.filter((book) =>
        matchesFilters(book, query.toLowerCase().trim(), genre)
      )
    : books;

  return (
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#home" onClick={browse}>
          FreeVerse Library
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <button onClick={browse}>Explore</button>
          <button onClick={openShelf}>
            My Bookshelf ({favorites.length})
          </button>
        </nav>
      </header>

      <main id="home">
        <section className="welcome-section">
          <p className="eyebrow">YOUR FREE ONLINE LIBRARY</p>
          <h1>
            {showFavorites
              ? "Your Bookshelf"
              : "Find your next favorite book."}
          </h1>
          <p>
            Discover classic stories and explore books from Project Gutenberg.
          </p>

          <form
            className="search-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or author..."
              aria-label="Search books"
            />
            <button type="submit">Search</button>
          </form>
        </section>

        {!showFavorites && (
          <section className="genre-section">
            <h2>Browse by topic</h2>
            <div className="genre-list">
              {GENRES.map((item) => (
                <button
                  key={item}
                  className={genre === item ? "genre active" : "genre"}
                  onClick={() => setGenre(item)}
                  aria-pressed={genre === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="catalog-section">
          <div className="section-heading">
            <h2>
              {showFavorites
                ? "Saved Books"
                : genre === "All Books"
                  ? "Explore Books"
                  : genre}
            </h2>
            <span>{displayedBooks.length} shown</span>
          </div>

          {loading && !showFavorites && (
            <p className="status-message">Loading books...</p>
          )}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && displayedBooks.length === 0 && (
            <div className="empty-state">
              <h3>No books found</h3>
              <p>
                Try another search, select a different topic, or explore more
                books.
              </p>
              {showFavorites && (
                <button className="secondary-button" onClick={browse}>
                  Explore Books
                </button>
              )}
            </div>
          )}

          <div className="book-grid">
            {displayedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={setSelectedBook}
              />
            ))}
          </div>

          {!showFavorites && nextPage && (
            <button
              className="load-more-button"
              onClick={loadMore}
              disabled={loadingMore || loading}
            >
              {loadingMore ? "Loading..." : "Load More Books"}
            </button>
          )}
        </section>

        {selectedBook && (
          <BookModal
            book={selectedBook}
            isFavorite={isFavorite(selectedBook)}
            onToggleFavorite={toggleFavorite}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </main>

      <footer className="site-footer">
        <p>Book catalog provided by Gutendex and Project Gutenberg.</p>
        <a
          href="https://www.gutenberg.org/"
          target="_blank"
          rel="noreferrer"
        >
          Visit Project Gutenberg
        </a>
      </footer>
    </div>
  );
}
