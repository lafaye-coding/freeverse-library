import { authorNames, downloadLink, readLink } from "../lib/books";

export default function BookCard({ book, onOpen }) {
  const read = readLink(book.formats);
  const download = downloadLink(book.formats);

  return (
    <article className="book-card">
      {book.formats?.["image/jpeg"] ? (
        <img
          className="book-cover"
          src={book.formats["image/jpeg"]}
          alt={`Cover of ${book.title}`}
          loading="lazy"
        />
      ) : (
        <div className="book-cover cover-placeholder">
          No cover available
        </div>
      )}

      <div className="book-card-content">
        <h3>{book.title}</h3>
        <p className="book-author">{authorNames(book)}</p>
        <p className="book-meta">
          {book.download_count?.toLocaleString() || 0} downloads
        </p>

        <button className="secondary-button" onClick={() => onOpen(book)}>
          Book Details
        </button>

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
          <p className="unavailable-note">
            No online reading edition listed
          </p>
        )}

        {download && (
          <a
            className="download-link"
            href={download}
            target="_blank"
            rel="noreferrer"
          >
            Download Book
          </a>
        )}
      </div>
    </article>
  );
}
