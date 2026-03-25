import { mangaSeedData } from './seed.js';
import { 
    books, RENDER_EVENT, loadData, saveData, generateId, 
    findBook, generateBookObject, isStorageExist, STORAGE_KEY 
} from './data.js';
import { makeBook, showToast, updateStats } from './dom.js';

let currentEditId = null;

/**
 * Logika Modal (Dibuat lokal di sini)
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "flex";
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
}

/**
 * Menempelkan fungsi Edit ke objek 'window' agar bisa dipanggil 
 * oleh tombol edit yang dibuat di dom.js
 */
window.openEditModal = (bookId) => {
    const book = findBook(bookId);
    if (book) {
        document.getElementById("editTitle").value = book.title;
        document.getElementById("editAuthor").value = book.author;
        document.getElementById("editYear").value = book.year;
        document.getElementById("cover").value = book.cover;
        document.getElementById("editComplete").checked = book.isComplete;
        currentEditId = bookId;
        openModal("editModal");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Jalankan Load Data
    if (isStorageExist()) loadData();

    // --- 1. EVENT MODAL ---
    const btnOpenAdd = document.getElementById("openAddModal");
    if (btnOpenAdd) {
        btnOpenAdd.addEventListener("click", () => openModal("addBookModal"));
    }

    // Tombol Batal/Close di semua modal
    document.querySelectorAll(".btn-cancel, .close-modal").forEach(btn => {
        btn.addEventListener("click", function() {
            const modal = this.closest(".modal");
            closeModal(modal.id);
        });
    });

    // --- 2. EVENT FORM TAMBAH ---
    const bookForm = document.getElementById("bookForm");
    bookForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = document.getElementById("bookFormYear").value;
        const cover = document.getElementById("bookFormCover").value;
        const isComplete = document.getElementById("bookFormIsComplete").checked;

        const newBook = generateBookObject(generateId(), title, author, year, isComplete, cover);
        books.push(newBook);
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
        
        this.reset();
        closeModal("addBookModal");
        showToast(`Buku "${title}" berhasil ditambah`);
    });

    // --- 3. EVENT SIMPAN EDIT ---
    document.getElementById("editBookForm").addEventListener("submit", function (e) {
        const book = findBook(currentEditId);
        e.preventDefault();
        if (book) {
            book.title = document.getElementById("editTitle").value;
            book.author = document.getElementById("editAuthor").value;
            book.year = Number(document.getElementById("editYear").value);
            book.cover = document.getElementById("cover").value;
            book.isComplete = document.getElementById("editComplete").checked;
            
            closeModal("editModal");
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast(`Buku '${book.title}' berhasil diperbarui`);
        }
    });

    // --- 4. EVENT IMPORT DUMMY ---
   document.getElementById("btnImport").addEventListener("click", () => {
    if (confirm("Import 20 data manga populer?")) {
        mangaSeedData.forEach(m => {
            const bookWithId = {
                ...m, // mengambil title, author, year, dll
                id: generateId() // kasih ID di sini
            };
            books.push(bookWithId);
        });
        
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
        showToast("20 Manga berhasil di-import");
    }
});

    // --- 5. EVENT SEARCH ---
    document.getElementById("searchBookTitle").addEventListener("input", function() {
        const keyword = this.value.toLowerCase();
        const filtered = books.filter(b => b.title.toLowerCase().includes(keyword));
        renderUI(filtered);
    });

    // --- 6. EVENT RAK ACTIONS (Reset, Clear, Mark All) ---
    document.getElementById("resetBooks").onclick = () => {
        if (confirm("Hapus semua buku?")) {
            books.length = 0;
            localStorage.removeItem(STORAGE_KEY);
            document.dispatchEvent(new Event(RENDER_EVENT));
        }
    };

    document.getElementById("markAllComplete").onclick = () => {
        books.forEach(b => b.isComplete = true);
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
    };

    document.getElementById("markAllIncomplete").onclick = () => {
        books.forEach(b => b.isComplete = false);
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
    };
    
    // Logika Clear Per Rak
    document.getElementById("clearComplete").onclick = () => {
        if(confirm("Hapus semua buku selesai?")) {
            const filtered = books.filter(b => !b.isComplete);
            books.length = 0; books.push(...filtered);
            saveData(); document.dispatchEvent(new Event(RENDER_EVENT));
        }
    };
    
    document.getElementById("clearIncomplete").onclick = () => {
        if(confirm("Hapus semua buku belum selesai?")) {
            const filtered = books.filter(b => b.isComplete);
            books.length = 0; books.push(...filtered);
            saveData(); document.dispatchEvent(new Event(RENDER_EVENT));
        }
    };
});

/**
 * Fungsi Render Utama
 */
function renderUI(dataToRender = books) {
    const incList = document.getElementById("incompleteBookList");
    const comList = document.getElementById("completeBookList");
    
    incList.innerHTML = "";
    comList.innerHTML = "";

    const incomplete = dataToRender.filter(b => !b.isComplete);
    const complete = dataToRender.filter(b => b.isComplete);

    if (incomplete.length === 0) {
        incList.innerHTML = `<div class="empty-state"><p>Belum ada buku di rak ini.</p></div>`;
    } else {
        incomplete.forEach(b => incList.append(makeBook(b)));
    }

    if (complete.length === 0) {
        comList.innerHTML = `<div class="empty-state"><p>Belum ada buku di rak ini.</p></div>`;
    } else {
        complete.forEach(b => comList.append(makeBook(b)));
    }

    // Update Statistik & Button Visibility
    updateStats();
    document.getElementById("btnImport").style.display = books.length === 0 ? "inline-block" : "none";
}

// Jalankan render setiap ada perubahan data
document.addEventListener(RENDER_EVENT, () => renderUI());