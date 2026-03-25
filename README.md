# Bookshelf App 📚

Bookshelf App adalah aplikasi pengelolaan data buku berbasis web yang memungkinkan pengguna untuk mencatat buku yang sedang dibaca maupun yang sudah selesai dibaca. Proyek ini dibuat untuk memenuhi kriteria submission pada kelas **Belajar Membuat Front-End Web untuk Pemula** di Dicoding dengan sedikit modifikasi untuk keperluan pribadi.

## 🚀 Fitur Utama
Aplikasi ini memiliki fitur **CRUD (Create, Read, Update, Delete)** dasar dengan manajemen data sebagai berikut:

- **Tambah Buku Baru**: Menyimpan judul, penulis, tahun terbit, dan status baca.
- **Dua Rak Buku**: Memisahkan buku ke dalam kategori "Belum Selesai Dibaca" dan "Selesai Dibaca".
- **Pindah Rak**: Memindahkan buku antar rak dengan satu klik.
- **Hapus Buku**: Menghapus data buku dari daftar dengan konfirmasi keamanan.
- **Web Storage (localStorage)**: Data buku tetap tersimpan secara permanen meskipun browser ditutup atau di-refresh.

## 🛠️ Teknologi yang Digunakan
- **HTML5**: Menyusun struktur elemen aplikasi.
- **CSS3**: Memberikan gaya tampilan (layouting, coloring, dan responsivitas).
- **Vanilla JS**: Menangani logika aplikasi, manipulasi DOM, dan penyimpanan data ke `localStorage`.

## 📂 Struktur Proyek
- `index.html`: File utama untuk tampilan web.
- `style.css`: Berisi semua aturan styling aplikasi.
- `js/main.js`: Berisi logika utama aplikasi (Event listener, DOM manipulation).
- `js/`: Folder tambahan jika terdapat pemisahan file script (seperti `storage.js` atau `dom.js`).

## 💻 Cara Menjalankan Secara Lokal
Karena proyek ini menggunakan **JavaScript Modules (`type="module"`)**, Anda tidak bisa membukanya langsung dengan klik ganda file `index.html`. Anda perlu menjalankannya menggunakan **Local Server**.

### Opsi 1: Menggunakan VS Code (Rekomendasi)
1. Buka folder proyek di **VS Code**.
2. Instal ekstensi **Live Server**.
3. Klik kanan pada `index.html` dan pilih **"Open with Live Server"**.

### Opsi 2: Menggunakan Node.js (npx)
Jika Anda memiliki Node.js terinstal, jalankan perintah berikut di terminal:
```bash
npx serve .
```
Lalu buka alamat yang muncul

### Opsi 3: Menggunakan Python
```bash
python -m http.server
```
Lalu buka http://localhost:8000