# Catatan Pertemuan 6 : Async Await

| Konsep | Satu kalimat |
|---|---|
| Asinkron | Pekerjaan yang butuh waktu dititipkan, baris berikutnya tidak menunggu |
| Promise | Janji hasil yang belum ada. Status: pending, fulfilled, rejected |
| `.then / .catch / .finally` | Cara lama menangani Promise, disambung berantai |
| `async / await` | Cara baru, dibaca dari atas ke bawah. `await` hanya di dalam `async` function |
| `try / catch / finally` | Pengganti `.catch / .finally` pada async/await |
| `fetch(url)` | Mengembalikan Promise. `response.json()` juga Promise |
| `Promise.all([...])` | Beberapa pekerjaan bebas dijalankan bersamaan |
| `innerHTML` + template string | Susun HTML sebagai teks dengan `map(...).join("")`, lalu masukkan sekali. Hanya untuk data tepercaya |

## Rundown (90 menit)

| Menit | Materi | File |
|---|---|---|
| 0-10 | Sinkron vs asinkron (demo `setTimeout`, tebak urutan console) | `scripts/script.js` bagian 1 |
| 10-25 | Promise: resolve, reject, JSON.parse | bagian 2 |
| 25-40 | Render + loading / sukses / error, cara `.then` | bagian 3 dan 4 |
| 40-55 | Cara `async/await`, bandingkan dengan `.then` | bagian 5 |
| 55-60 | Promise.all | bagian 7 |
| 60-90 | Case study PokeAPI | `case-studies/pokemon.*` |

## Analogi untuk menjelaskan

Warung makan: Promise = nomor antrean, `await` = duduk menunggu nomor dipanggil, `Promise.all` = memesan beberapa menu sekaligus, `response.ok` = memeriksa makanannya benar-benar siap atau dapur bilang "habis".

## Poin yang perlu ditekankan

1. Urutan console di bagian 1 adalah 1, 3, 2. Minta peserta menebak dulu.
2. `.then` dan `await` itu Promise yang sama, hanya cara baca yang beda.
3. Lupa `await` => yang didapat `Promise { <pending> }`, bukan datanya.
4. `fetch` tidak error pada 404 / 500. Selalu cek `response.ok`.
5. Selalu tampilkan 3 keadaan: loading, sukses, error.
6. `addEventListener("click", fungsi(true))` salah. Bungkus: `() => fungsi(true)`.

## Catatan teknis

- Render memakai `innerHTML` dengan template string (`map(...).join("")`). Aman untuk data dari kita atau server tepercaya. Untuk ketikan pengguna tetap `textContent`, karena `innerHTML` menjalankan tag apa pun yang ikut masuk (XSS).
- Membuka `index.html` dengan double click (file://) membuat `fetch("data/...json")` ke file lokal diblokir browser. Karena itu data JSON pada script.js dibuat sebagai teks lalu ditiru dengan Promise. Dengan Live Server, ganti isi `getProducts` memakai `fetch`.
- `fetch` ke PokeAPI tetap bisa dari file:// karena servernya mengizinkan akses dari mana saja (CORS). Butuh internet.

## Kesalahan yang sering muncul

| Gejala | Penyebab |
|---|---|
| `await is only valid in async functions` | Lupa `async` di function |
| Data `undefined` / `Promise { <pending> }` | Lupa `await`, atau memakai hasil di luar `.then` |
| `Unexpected token < in JSON` | Server mengirim HTML (URL salah), bukan JSON |
| Halaman diam, tidak ada pesan | Tidak ada `try / catch` |
| Status "Memuat" tidak hilang | Lupa mengosongkan status di `finally` atau saat sukses |

## Latihan / PR

1. Tombol "Load more" pada PokeAPI (`offset`).
2. Kolom cari: tampilkan pesan "Memuat..." dan matikan tombol Cari selama menunggu (`button.disabled`), nyalakan lagi di `finally`.
3. Ubah `loadWithThen` di script.js menjadi mengambil dua data sekaligus dengan `Promise.all([...]).then(...)`.
