// import { seedData } from "./seed.js"; //Kalo pake module system
const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APP";

// Variabel global untuk menyimpan ID buku yang sedang diedit
let currentEditId = null;


// ===== UTILITIES =====

// Fungsi untuk cek apakah localStorage tersedia di browser
function isStorageExist() {
    return typeof (Storage) !== "undefined";
}
// Fungsi untuk generate ID unik menggunakan crypto API
function generateId() {
    return crypto.randomUUID();
}

// Fungsi untuk mengenerate objek buku
function generateBookObject(id, title, author, year, isComplete) {
    return { id, title, author, year, isComplete };
}

// Fungsi untuk mencari buku berdasarkan ID untuk keperluan edit
function findBook(bookId) {
    return books.find(book => book.id === bookId);
}

// Fungsi untuk mencari index buku berdasarkan ID (untuk keperluan delete)
function findBookIndex(bookId) {
    return books.findIndex(book => book.id === bookId);
}



// ===== CORE LOGIC =====

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    if (isStorageExist()) {
        //  Simpan ke localStorage jika ada buku, jika tidak ada buku hapus data di localStorage
        if (books.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
        } 
        else {
            localStorage.removeItem(STORAGE_KEY);
        }
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

// Fungsi untuk load data dari localStorage saat aplikasi pertama kali dijalankan
function loadData() {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
        const data = JSON.parse(serialized);
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Fungsi untuk menampilkan toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
        }, 2000);
}

// Fungsi untuk render UI berdasarkan data yang sudah difilter (untuk search)
function renderFiltered(data) {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    for (const book of data) {
        const bookElement = makeBook(book);
        book.isComplete ? completeList.append(bookElement) : incompleteList.append(bookElement);
    }
}

// Fungsi untuk update statistik di dashboard
function updateStats() {
    const total = books.length;
    const complete = books.filter(book => book.isComplete).length;
    document.getElementById("totalBooks").innerText = total;
    document.getElementById("completeBooks").innerText = complete;
    document.getElementById("incompleteBooks").innerText = total - complete;
}


// ===== MODAL FUNCTIONS  =====

// Fungsi untuk membuka modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

// Fungsi untuk menutup modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Fungsi untuk membuka modal edit dengan data buku yang sudah terisi berdasarkan ID buku yang dipilih
function openEditModal(bookId) {
    const book = findBook(bookId);
    if (book) {
        document.getElementById("editTitle").value = book.title;
        document.getElementById("editAuthor").value = book.author;
        document.getElementById("editYear").value = book.year;
        
        // document.getElementById("editCover").value = book.cover;
        document.getElementById("editComplete").checked = book.isComplete;
        currentEditId = bookId;
        openModal("editBookModal");
    }
}

// ===== BOOK FUNCTIONS =====

// Fungsi untuk menambahkan buku baru
function addBook() {
    const id = generateId();
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);

    // const coverInput = document.getElementById("bookFormCover").value;
    // const cover = coverInput || "default.png"; // Gunakan default jika tidak ada input cover

    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const bookObject = generateBookObject(id, title, author, year, isComplete);
    
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Buku '${title}' berhasil ditambahkan`);
}

// Fungsi untuk status buku antara selesai atau belum selesai
function statusBook(bookId) {
    const book = findBook(bookId);
    book.isComplete = !book.isComplete;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    showToast(`Buku '${book.title}' dipindahkan ke rak ${book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"}`);
}

// Fungsi untuk menghapus buku berdasarkan ID
function deleteBook(bookId) {
    // const confirmDelete = confirm("Yakin ingin menghapus buku?");
    // if (!confirmDelete) return;
    
    const index = findBookIndex(bookId);
    if (index === -1) return;

    books.splice(index, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
    showToast(`Buku berhasil dihapus`);
}

// Fungsi untuk membuat elemen buku di DOM berdasarkan objek buku
function makeBook(bookObject) {
    const container = document.createElement("div");
    const book_title = document.createElement("h3");
    book_title.innerText = bookObject.title;
    book_title.setAttribute("title", bookObject.title);

    container.classList.add("book");
    container.setAttribute("data-bookid", bookObject.id);
    container.setAttribute("data-testid", "bookItem");

    const title = document.createElement("h3");
    title.innerText = bookObject.title;
    title.setAttribute("data-testid", "bookItemTitle");

    // const cover = document.createElement("img");
    // cover.src = bookObject.cover || "default.png";

    const author = document.createElement("p");
    author.innerText = "Penulis: " + bookObject.author;
    author.setAttribute("data-testid", "bookItemAuthor");

    const year = document.createElement("p");
    year.innerText = "Tahun: " + bookObject.year;
    year.setAttribute("data-testid", "bookItemYear");
    
    const isCompleteButton = document.createElement("button");
    isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    isCompleteButton.classList.add("status-btn");
    isCompleteButton.innerHTML = bookObject.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
    isCompleteButton.classList.add(bookObject.isComplete ? "complete" : "incomplete");
    isCompleteButton.setAttribute("data-tooltip", bookObject.isComplete ? "Pindahkan ke Belum selesai" : "Tandai sebagai Selesai");
    
    isCompleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        statusBook(bookObject.id);
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");
   
    const del = document.createElement("button");
    del.innerText = "🗑 Hapus Buku";
    del.setAttribute("data-testid", "bookItemDeleteButton");
    del.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteBook(bookObject.id);
    });

    const edit = document.createElement("button");
    edit.innerText = "✏️ Edit Buku";
    edit.setAttribute("data-testid", "bookItemEditButton");
    edit.addEventListener("click", (e) => {
        e.stopPropagation();
        openEditModal(bookObject.id);
    });

    actionContainer.append(isCompleteButton, del, edit);

    container.append(title, author, year, actionContainer);
    return container;
}

// --- EVENT LISTENERS ---
// DOM Loaded
document.addEventListener("DOMContentLoaded", function () {

    // Load data dari localStorage saat aplikasi pertama kali dijalankan
    if (isStorageExist()) loadData();

    // Open Modal menambahkan buku baru
    document.getElementById("openAddModal").addEventListener("click", () => openModal("addBookModal"));

    // Closing lewat tombol batal di modals
    document.querySelectorAll(".btn-cancel").forEach(btn => {
        btn.addEventListener("click", function() {
            const modal = this.closest(".modal");
            closeModal(modal.id);
        });
    });

    // Handle Closing lewat click diluar modals
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            closeModal(e.target.id);
        }
    });

    // Book Form action ketika Submit
    document.getElementById("bookForm").addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
        // closeModal("addBookModal"); // <-- Opsional: tetap buka modal untuk input cepat
        bookForm.reset();
    });

    // Import Data Dummy button
    document.getElementById('btnImport').addEventListener('click', () => {
        if (confirm("Import 20 data dummy?")) {
            // Ambil data dari array seedData dari seed.js yg sudah di import di atas
            seedData.forEach(data => {
                const bookWithId = {
                    id: generateId(),
                    ...data
                };
                books.push(bookWithId);
            showToast("20 buku berhasil di-import");
        });
            // Hide import setelah dipakai
            saveData();
            document.dispatchEvent(new Event(RENDER_EVENT));
            btnImport.style.display = 'none';
        }
    });

    // Search Action
    document.getElementById("searchSubmit").addEventListener("click", function (e) {
        e.preventDefault();
        const keyword = document.getElementById("searchBookTitle").value.toLowerCase();
        const filtered = books.filter(book => book.title.toLowerCase().includes(keyword));

        renderFiltered(filtered);
    });

    // Reset Books button untuk menghapus semua buku
    document.getElementById("resetBooks").addEventListener("click", () => {
        if (confirm("Yakin ingin menghapus semua buku yang ada?")) {
            books.length = 0;
            localStorage.removeItem(STORAGE_KEY);
            document.dispatchEvent(new Event(RENDER_EVENT));
            showToast("Semua buku berhasil dihapus");
            btnImport.style.display = 'flex'; // Tampilkan kembali import jika ingin mengisi ulang data
        }
    });

    // Clear Rak Complete atau Selesai dibaca
    document.getElementById("clearComplete").addEventListener("click", function() {
    if (confirm("Hapus semua buku yang sudah selesai dibaca?")) {
            const remainingBooks = books.filter(book => !book.isComplete);
            books.length = 0; // Clear original array
            books.push(...remainingBooks);
            
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast("Rak 'Selesai dibaca' dikosongkan");
        }
    });

    // Clear Rak Incomplete atau Belum selesai dibaca
    document.getElementById("clearIncomplete").addEventListener("click", function() {
    if (confirm("Hapus semua buku yang belum selesai dibaca?")) {
            const remainingBooks = books.filter(book => book.isComplete);
            books.length = 0;
            books.push(...remainingBooks);
            
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast("Rak 'Belum selesai dibaca' dikosongkan");
        }
    });

     // Mark All Complete / Selesai dibaca
    document.getElementById("markAllComplete").addEventListener("click", function() {
        const incompleteBooks = books.filter(book => !book.isComplete);
    
        if (incompleteBooks.length > 0) {
            incompleteBooks.forEach(book => {
                book.isComplete = true;
            });
            
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast("Semua buku ditandai sebagai selesai");
        }
    });

    // Mark All Incomplete / Belum selesai dibaca
    document.getElementById("markAllIncomplete").addEventListener("click", function() {
        const completeBooks = books.filter(book => book.isComplete);
        if (completeBooks.length > 0) {
            completeBooks.forEach(book => {
                book.isComplete = false;
            });
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast("Semua buku dipindahkan ke belum selesai");
        }
    });

    // Save Edit Action
    document.getElementById("saveEdit").addEventListener("click", function () {
        const book = findBook(currentEditId);
        if (book) {
            book.title = document.getElementById("editTitle").value;
            book.author = document.getElementById("editAuthor").value;
            book.year = Number(document.getElementById("editYear").value);
            book.isComplete = document.getElementById("editComplete").checked;
            // book.cover = document.getElementById("editCover").value;

            closeModal("editBookModal");
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            showToast(`Buku '${book.title}' berhasil diperbarui`);
        }
    });    
});

// Render ulang UI setiap kali ada perubahan data
document.addEventListener(RENDER_EVENT, function () {
    const incompleteList = document.getElementById("incompleteBookList");
    const completeList = document.getElementById("completeBookList");
    // Clear dulu sebelum render ulang
    incompleteList.innerHTML = "";
    completeList.innerHTML = "";
    
    // Filter buku berdasarkan status selesai atau belum selesai
    const incompleteBooks=books.filter(book=>!book.isComplete);
    const completeBooks=books.filter(book=>book.isComplete);

    // Conditional rendering untuk empty state
    // Jika Rak incomplete kosong, tampilkan pesan "Belum ada buku di rak ini"
    if (incompleteBooks.length === 0) {
        incompleteList.innerHTML = 
            `<div class="empty-state">
                <p>Belum ada buku di rak ini.</p>
            </div>`;
    } 
    // Render buku yang belum selesai dibaca
    else {
        for (const book of incompleteBooks) {
            incompleteList.append(makeBook(book));
        }
    }

    // Jika Rak complete kosong, tampilkan pesan "Belum ada buku di rak ini"
    if (completeBooks.length === 0) {
        completeList.innerHTML = `
            <div class="empty-state">
                <p>Belum ada buku di rak ini.</p>
            </div>`;
    } 
    // Render buku yang sudah selesai dibaca
    else {
        for (const book of completeBooks) {
            completeList.append(makeBook(book));
        }
    }
    // Update visibility untuk tombol Mark All Complete / Incomplete
    document.getElementById("markAllComplete").style.display = incompleteBooks.length === 0 ? "none" : "inline-block";
    document.getElementById("markAllIncomplete").style.display = completeBooks.length === 0 ? "none" : "inline-block";
    
    // Update visibility untuk tombol Clear Rak
    document.getElementById("clearComplete").style.display = completeBooks.length === 0 ? "none" : "inline-block";
    document.getElementById("clearIncomplete").style.display = incompleteBooks.length === 0 ? "none" : "inline-block";
    
     // Update visibility untuk tombol Import jika tidak ada buku sama sekali
    const btnImport = document.getElementById("btnImport");
    if (btnImport) {
        btnImport.style.display = books.length === 0 ? "inline-block" : "none";
    }
    // Update Statistik
    updateStats();
});

