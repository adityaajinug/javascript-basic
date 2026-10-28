# Belajar JavaScript Dasar

Repositori catatan belajar JavaScript dasar dari Teching Academy. Saat ini mencakup **Pertemuan 1 sampai 6**.

## Struktur Folder

```
javascript-basic/
├── pertemuan-1/
├── pertemuan-2/
├── pertemuan-3/
├── pertemuan-4/
├── pertemuan-5/
│   ├── index.html
│   ├── scripts/
│   └── case-studies/
│       ├── count.html
│       ├── count.js
│       └── kalkulator/
└── pertemuan-6/
    ├── index.html
    ├── catatan.md
    ├── scripts/
    └── case-studies/
        ├── pokemon.html
        └── pokemon.js
```

Setiap folder berisi file HTML dan folder `scripts` untuk kode JavaScript-nya. Pertemuan 5 dan 6 juga punya folder `case-studies` untuk latihan studi kasus (pertemuan 5: counter dan kalkulator, pertemuan 6: PokeAPI). Pertemuan 6 punya `catatan.md` berisi rundown dan catatan pengajar.

## Cara Menjalankan

Buka file HTML pertemuan di browser, lalu tekan `F12` untuk melihat hasilnya di Console. Untuk pertemuan 5 dan 6, hasilnya juga tampil langsung di halaman. Studi kasus PokeAPI di pertemuan 6 membutuhkan koneksi internet.

## Ringkasan Materi

| Pertemuan | Deskripsi |
|---|---|
| 1 | Pengenalan dasar JavaScript: variabel (`const` dan `let`), tipe data, operator, kondisi `if / else`, dan pengenalan DOM. |
| 2 | Alur program (*control flow*): ternary, `switch case`, dan perulangan (`for`, `while`, `do...while`, `for...of`, `for...in`), serta menampilkan data ke halaman HTML. |
| 3 | Function dan scope: function biasa, arrow function, parameter default, dan `export` untuk memakai function di file lain. |
| 4 | Array dan method: `push`, `unshift`, `pop`, `shift`, `forEach`, `map`, `filter`, `find`, `some`, `every`, `reduce`, dan `sort`, serta menampilkan data array ke halaman HTML. |
| 5 | DOM (*Document Object Model*): mencari element (`getElementById`, `querySelector`, `querySelectorAll`), mengubah element (`textContent`, `innerHTML`, `classList`, `style`, `dataset`), membuat element (`createElement`, `append`), event (`addEventListener`, *event delegation*, `input`, `keydown`, `submit`, `preventDefault`), serta render data dari array dengan filter, pencarian, tambah, dan hapus produk. Studi kasus: counter dan kalkulator. |
| 6 | Async await: sinkron vs asinkron (`setTimeout`), `Promise` (`resolve`, `reject`, status *pending / fulfilled / rejected*), `.then / .catch / .finally`, `async / await` dengan `try / catch / finally`, `fetch` dan pengecekan `response.ok`, `Promise.all`, serta menampilkan keadaan *loading*, sukses, dan error. Render data dengan `innerHTML` dan template string. Studi kasus: PokeAPI (daftar dan pencarian pokemon). |
