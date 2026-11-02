# Catatan Pertemuan 7 : localStorage dan sessionStorage

| Konsep | Satu kalimat |
|---|---|
| Web Storage | Lemari kecil milik browser. Data tetap ada walau halaman di-refresh |
| `localStorage` | Awet sampai dihapus sendiri. Dibagi ke semua tab website yang sama |
| `sessionStorage` | Hilang saat tab ditutup. Tiap tab punya sendiri |
| `setItem / getItem / removeItem / clear` | Simpan, baca, hapus satu, hapus semua |
| Hanya string | Angka, array, object dipaksa jadi teks. Pakai `JSON.stringify` dan `JSON.parse` |
| `saveData / loadData` | Pembungkus sekali tulis, dengan nilai bawaan dan `try / catch` |
| Alur | BACA saat halaman dibuka, UBAH lewat event, SIMPAN lalu render |

## Rundown (90 menit)

| Menit | Materi | File |
|---|---|---|
| 0-10 | Masalah: refresh menghapus data. Demo variable biasa | `scripts/script.js` bagian 1 |
| 10-25 | Empat perintah dasar + DevTools Application | bagian 2 |
| 25-40 | Hanya string, `JSON.stringify` / `JSON.parse` | bagian 3 dan 4 |
| 40-50 | `saveData` / `loadData`, local vs session | bagian 5 dan 6 |
| 50-60 | Praktik favorit produk | bagian 7 dan `index.html` |
| 60-90 | Case study Todo List | `case-studies/todo.*` |

## Analogi untuk menjelaskan

Lemari berlaci. `localStorage` = lemari di rumah (tetap ada sampai dibuang). `sessionStorage` = loker sementara (kosong lagi saat tab ditutup). `key` = label laci, `value` = isi laci. `JSON.stringify` = memasukkan barang ke kardus sebelum disimpan, `JSON.parse` = membongkar kardusnya.

## Poin yang perlu ditekankan

1. Tunjukkan variable biasa kembali ke awal setelah refresh, baru perkenalkan storage.
2. Buka DevTools => Application => Local Storage, supaya peserta melihat isinya.
3. Yang tersimpan selalu string: `"10"` bukan `10`. `typeof` membuktikannya.
4. Array / object tanpa `JSON.stringify` jadi `"[object Object]"` (isinya hilang).
5. Alur tiga langkah: baca, ubah, simpan + render.
6. Jangan simpan password atau token. Batas sekitar 5 MB.
7. Teks dari pengguna yang masuk lewat `innerHTML` harus dibersihkan (`escapeHtml`), atau pakai `textContent`.

## Catatan teknis

- Data terikat pada origin (protokol + domain + port). Website lain tidak bisa membacanya.
- Storage bersifat sinkron dan hanya menyimpan string. Untuk data besar atau kompleks ada IndexedDB (bukan materi dasar).
- `file://` biasanya tetap bisa memakai storage, tetapi sebagian browser membagi satu penyimpanan untuk semua file lokal. Kalau data tampak "bocor" ke halaman lain, gunakan nama key yang unik atau Live Server.
- Di mode private, storage bisa diblokir atau dihapus saat jendela ditutup. Karena itu `loadData` memakai nilai bawaan.
- Event `storage` bisa dipakai untuk mendengar perubahan dari tab lain (opsional).

## Kesalahan umum

- Lupa `JSON.parse`: `getItem` mengembalikan teks, lalu `.map` / `.length` salah.
- Lupa `JSON.stringify`: `"[object Object]"`.
- Membandingkan angka dengan teks: `"1" === 1` bernilai false. Ubah dengan `Number(...)`.
- Lupa menyimpan setelah mengubah state (tampilan berubah, refresh kembali ke awal).
- Memakai `innerHTML` untuk ketikan pengguna tanpa dibersihkan.

## PR

1. Pada `index.html`, simpan juga jumlah klik tombol favorit di `localStorage`.
2. Pada Todo, tambahkan tombol tema terang / gelap yang diingat browser.
3. Tantangan: simpan hasil `fetch` PokeAPI ke storage supaya tidak meminta ulang (cache).
