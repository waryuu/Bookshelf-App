// js/data.js

// Array utama untuk menampung semua data buku
export let books = [];

// Konstanta identitas untuk LocalStorage dan Event Custom
export const STORAGE_KEY = "BOOKSHELF_APP";
export const RENDER_EVENT = "render-book";
export const SAVED_EVENT = "saved-book"; // Bisa kamu pakai untuk trigger animasi simpan

/**
 * Cek apakah browser mendukung LocalStorage
 */
export function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

/**
 * Menyimpan array 'books' ke LocalStorage dalam bentuk string
 */
export function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

/**
 * Mengambil data dari LocalStorage dan memasukkannya ke array 'books'
 */
export function loadData() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        // Kita kosongkan array dulu, lalu isi dengan data dari storage
        books.length = 0;
        books.push(...data);
    }

    // Trigger render agar tampilan update
    document.dispatchEvent(new Event(RENDER_EVENT));
}

/**
 * Helper untuk membuat ID unik menggunakan UUID
 */
export function generateId() {
    return crypto.randomUUID();
}

/**
 * Mencari objek buku berdasarkan ID
 */
export function findBook(bookId) {
    return books.find(book => book.id === bookId);
}

/**
 * Mencari posisi (index) buku di dalam array
 */
export function findBookIndex(bookId) {
    return books.findIndex(book => book.id === bookId);
}

/**
 * Helper untuk menyusun objek buku baru
 */
export function generateBookObject(id, title, author, year, isComplete, cover) {
    return {
        id,
        title,
        author,
        year: Number(year), // Pastikan tahun adalah angka
        isComplete,
        cover: cover || "default.png" // Fallback jika cover kosong
    };
}