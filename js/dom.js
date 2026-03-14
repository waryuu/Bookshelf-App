import { books, RENDER_EVENT, saveData, findBook, findBookIndex } from './data.js';

export function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 2000);
}

export function updateStats() {
    const total = books.length;
    const complete = books.filter(book => book.isComplete).length;
    document.getElementById("totalBooks").innerText = total;
    document.getElementById("completeBooks").innerText = complete;
    document.getElementById("incompleteBooks").innerText = total - complete;
}

export function makeBook(bookObject) {
    const container = document.createElement("article");
    container.classList.add("book");
    container.setAttribute("data-bookid", bookObject.id);
    container.setAttribute("data-testid", "bookItem");

    // Menu ⋮ dan Dropdown
    container.innerHTML = `
        <button class="menu-button">⋮</button>
        <div class="book-menu">
            <button class="btn-edit">✏️ Edit Buku</button>
            <button class="btn-delete" data-testid="bookItemDeleteButton">🗑 Hapus</button>
        </div>
        <img src="${bookObject.cover || 'https://picsum.photos/120/160'}" alt="${bookObject.title}">
        <button class="toggle-btn ${bookObject.isComplete ? 'complete' : 'incomplete'}" 
                data-tooltip="${bookObject.isComplete ? 'Pindahkan ke Belum selesai' : 'Tandai sebagai Selesai'}">
            ✔
        </button>
        <h3 data-testid="bookItemTitle">${bookObject.title}</h3>
        <p>Penulis: ${bookObject.author}</p>
        <p>Tahun: ${bookObject.year}</p>
    `;

    // Event: Toggle Menu Dropdown
    const menuBtn = container.querySelector(".menu-button");
    const menu = container.querySelector(".book-menu");
    menuBtn.onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll(".book-menu").forEach(m => m !== menu && m.classList.remove("show"));
        menu.classList.toggle("show");
    };

    // Event: Tombol Edit
    container.querySelector(".btn-edit").onclick = () => {
        window.openEditModal(bookObject.id);
    };

    // Event: Tombol Hapus
    container.querySelector(".btn-delete").onclick = () => {
        if (confirm(`Yakin ingin menghapus buku "${bookObject.title}"?`)) {
            const index = findBookIndex(bookObject.id);
            books.splice(index, 1);
            saveData();
            document.dispatchEvent(new Event(RENDER_EVENT));
            showToast("Buku berhasil dihapus");
        }
    };

    // Event: Tombol Toggle Rak (✔)
    container.querySelector(".toggle-btn").onclick = () => {
        const book = findBook(bookObject.id);
        book.isComplete = !book.isComplete;
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
        showToast(`Buku dipindahkan ke rak ${book.isComplete ? "Selesai" : "Belum Selesai"}`);
    };

    return container;
}