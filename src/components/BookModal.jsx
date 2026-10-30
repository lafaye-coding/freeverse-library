import { authorNames, readLink } from "../lib/books";

export default function BookModal({
  book,
  isFavorite,
  onToggleFavorite,
  onClose,
}) {
  const read = readLink(book.formats);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="book-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close book details"
        >
          ×
        </button>

        {book.formats?.["image/jpeg"] && (
          <img
            className="modal-cover"
            src={book.formats["image/jpeg"]}
            alt={`Cover of ${book.title}`}
          />
        )}

        <h2 id="modal-title">{book.title}</h2>
        <p>By {authorNames(book)}</p>
        <p>
          Topics:{" "}
          {book.subjects?.slice(0, 5).join(", ") || "No topics listed"}
        </p>
        <p>Language: {book.languages?.join(", ") || "Unknown"}</p>
        <p>Project Gutenberg ID: {book.id}</p>

        {read ? (
          <a
            className="primary-button"
            href={read}
            target="_blank"
            rel="noreferrer"
          >
            Read Online
          </a>
        ) : (
          <p>No online reading edition is listed for this book.</p>
        )}

        <button
          className="secondary-button"
          onClick={() => onToggleFavorite(book)}
        >
          {isFavorite ? "Remove from Bookshelf" : "Add to Bookshelf"}
        </button>
      </section>
    </div>
  );
}
