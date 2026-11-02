# Catatan Pertemuan 8 : Project PokeOrder

Project akhir. Semua materi sesi 1 sampai 7 dipakai dalam satu toko online kecil dengan data dari PokeAPI.

## Alur aplikasi

```
catalog.html  ->  cart.html  ->  payment.html  ->  success.html
 (cari, filter,    (ubah jumlah,   (transfer manual,   atau failed.html
  tambah)          isi data)       unggah bukti)
```

| Halaman | JavaScript | Tugas utamanya |
|---|---|---|
| `catalog.html` | `js/catalog.js` | Ambil data API, search + filter + urutkan, tambah ke keranjang, modal detail |
| `cart.html` | `js/cart.js` | Daftar item, ubah jumlah, validasi form, simpan pesanan |
| `payment.html` | `js/payment.js` | Petunjuk transfer, validasi file, kirim (simulasi) |
| `success.html`, `failed.html` | `js/result.js` | Tampilkan hasil. Satu file untuk dua halaman |
| semua halaman | `js/common.js` | Fungsi bersama: storage, keranjang, format Rupiah, toast |
| semua halaman | `css/style.css` | Satu file CSS biasa (tanpa framework). Warna ada di variabel `:root`, warna tipe Pokémon di class `.type-fire` dst |

## Materi lama yang dipakai di mana

| Materi | Dipakai untuk |
|---|---|
| Array `filter`, `sort`, `map`, `find`, `reduce` | Filter katalog, daftar kartu, total belanja |
| DOM, `innerHTML` + template string | Semua kartu dan daftar |
| Event delegation (`closest`) | Tombol di kartu, keranjang, modal |
| `preventDefault`, validasi form | Form checkout |
| `async / await`, `fetch`, `response.ok` | Ambil data PokeAPI, kirim pembayaran (simulasi) |
| `Promise.all` | 18 permintaan tipe sekaligus |
| `try / catch / finally` | Loading, sukses, error di katalog, modal, dan pembayaran |
| `localStorage` | Katalog (cache), keranjang, pesanan, hasil |
| `sessionStorage` | Filter terakhir, draft form |

## Rundown (90 menit)

| Menit | Materi | File |
|---|---|---|
| 0-10 | Tunjukkan hasil jadi. Peta alur dan peran tiap file | `scripts/script.js` bagian 1 |
| 10-20 | Pemanasan pipeline search + filter + urutkan pada array | `index.html` + `scripts/script.js` |
| 20-45 | Katalog : ambil data API, filter, kartu, keranjang | `js/common.js`, `js/catalog.js` |
| 45-65 | Keranjang + checkout : hitung total, validasi form | `js/cart.js` |
| 65-80 | Pembayaran : unggah file, kirim, sukses / gagal | `js/payment.js`, `js/result.js` |
| 80-90 | Recap dan PR | |

Kalau waktu mepet, bagian yang aman dipotong : modal detail (`catalog.js` bagian 6), tarik-lepas file (`payment.js` bagian 3), dan halaman `failed.html`. Jangan potong pipeline filter dan alur baca-ubah-simpan.

## Cara menjalankan

1. Buka `case-studies/pokeorder/catalog.html` di browser (double click boleh), butuh internet.
2. Boleh juga pakai Live Server.
3. Data katalog disimpan di `localStorage["catalogV1"]`. Hapus di DevTools (Application) untuk mengambil ulang dari API.

## Poin yang perlu ditekankan

1. **Data asli tidak diubah.** `catalog` hanya dibaca. Setiap filter berubah, hasil dihitung ulang dengan `filter` (menghasilkan array baru).
2. **Alur tiga langkah** (sesi 7) : baca dari storage, ubah lewat event, simpan lalu render.
3. **Satu fungsi `render`** dipanggil dari mana saja. Jangan mengubah DOM di banyak tempat.
4. **Tiga keadaan** : loading (skeleton), sukses, error (dengan tombol coba lagi). Ditambah keadaan kosong.
5. **Validasi sendiri.** Form memakai `novalidate`, pesan error dari aturan di objek `rules`.
6. **Data dari pengguna** (nama, alamat, catatan) tidak boleh masuk lewat `innerHTML`. Dipakai `textContent` di halaman hasil.
7. **Pembayaran ini simulasi.** File tidak dikirim ke mana pun, hanya divalidasi dan namanya disimpan.

## Catatan teknis

- Harga dan stok tidak ada di PokeAPI, jadi dibuat dari nomor Pokemon dengan rumus tetap (`makePrice`, `makeStock`). Nomor kelipatan 8 selalu habis.
- Daftar Pokemon per tipe diambil dari `/type/{nama}` (18 permintaan), karena tidak ada satu alamat yang memberi semua Pokemon beserta tipenya. Pokemon yang muncul di dua tipe otomatis punya dua tipe.
- Tinggi (desimeter) dan berat (hektogram) dari API dibagi 10 supaya jadi meter dan kilogram.
- Gambar diambil dari repositori sprite PokeAPI berdasarkan nomor.
- Styling memakai CSS biasa di `css/style.css`. Warna dan ukuran utama disimpan sebagai variabel (`var(--primary)`), jadi ganti tema cukup ubah di `:root`. Nama class mengikuti pola BEM sederhana (`.card`, `.card__price`, `.card--soldout`).
- Menyimpan gambar bukti transfer ke `localStorage` tidak dilakukan (terlalu besar). Yang disimpan hanya nama file.
- `URL.createObjectURL` perlu dilepas dengan `URL.revokeObjectURL` supaya memori tidak menumpuk.

## Kesalahan umum

- Mengubah array `catalog` saat memfilter, lalu datanya hilang.
- Lupa `Number(...)` untuk `dataset.id` (selalu teks), sehingga `===` tidak cocok.
- Lupa `saveCart` setelah mengubah jumlah, jadi refresh kembali ke angka lama.
- Lupa `e.preventDefault()` pada submit form, halaman reload.
- Lupa `e.preventDefault()` pada `dragover`, sehingga `drop` tidak jalan.
- Tidak memeriksa `response.ok`, sehingga error 404 / 500 tidak ditangani.

## PR

1. Tombol favorit (hati) pada kartu, disimpan di `localStorage`, plus filter "Favorit saja".
2. Kode voucher sederhana di keranjang (misal `POKELAJAR` memotong Rp 10.000).
3. Hitung mundur batas waktu pembayaran dengan `setInterval`.
4. Filter generasi (Kanto, Johto) dengan mengubah batas nomor Pokemon.
5. Tantangan : halaman riwayat pesanan yang menyimpan semua pesanan sukses (array di `localStorage`).
