import { books, RENDER_EVENT } from "./data.js";
import { saveData } from "./storage.js";
import { showToast } from "./utils.js";

export function findBook(bookId) {
  return books.find(book => book.id === bookId);
}

export function findBookIndex(bookId) {
  return books.findIndex(book => book.id === bookId);
}

export function toggleBook(bookId) {
  const book = findBook(bookId);

  book.isComplete = !book.isComplete;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  showToast(`Buku '${book.title}' dipindahkan`);
}

export function deleteBook(bookId) {
  const index = findBookIndex(bookId);

  if (index !== -1) {
    books.splice(index, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    showToast("Buku berhasil dihapus");
  }
}