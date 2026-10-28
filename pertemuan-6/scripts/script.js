console.log("Meeting 6 : Async Await !")

// ============================================
// 1. SINKRON vs ASINKRON
// ============================================

/*
    Bayangkan kamu di warung makan.

    Sinkron   => kamu pesan, lalu berdiri di depan kasir sampai makanan jadi.
                 Antrean di belakang ikut menunggu. Baris kode berikutnya
                 harus menunggu baris sebelumnya selesai.

    Asinkron  => kamu pesan, dapat nomor, lalu duduk. Kasir tetap melayani orang lain.
                 Nanti nomor dipanggil saat makanan siap. Kode tidak berhenti menunggu,
                 hasilnya diurus belakangan.

    Kenapa penting? Mengambil data dari internet butuh waktu.
    Kalau program berdiri menunggu, halaman akan terasa macet.
*/

console.log("1. mulai");

setTimeout(() => {
    console.log("2. selesai nunggu 1 detik (asinkron)");
}, 1000);

console.log("3. baris ini jalan lebih dulu dari nomor 2");

// Urutan di console : 1, 3, 2
// NOTE: setTimeout = "tolong jalankan function ini 1 detik lagi".
//       Program tidak berhenti menunggu, langsung lanjut ke baris berikutnya.


// ============================================
// 2. PROMISE
// ============================================

/*
    Promise = nomor antrean tadi. Bukan makanannya, tapi janji bahwa makanan akan datang.
    Nanti nomor itu "ditukar" dengan salah satu dari dua hal :

      pending   => masih menunggu, nomor belum dipanggil
      fulfilled => berhasil, makanan datang   (dipicu oleh resolve(hasil))
      rejected  => gagal, dapur tutup         (dipicu oleh reject(error))

    Promise hanya berubah satu kali. Sudah berhasil, tidak bisa jadi gagal lagi.
*/

// Data JSON yang sudah disiapkan.
// NOTE: JSON itu TEKS biasa (seperti isi surat dari server).
//       Supaya bisa dipakai sebagai array / object, teksnya "dibaca" dulu dengan JSON.parse
const productsJson = `[
    { "name": "Iphone 14", "price": 20000000, "stock": 10, "category": "Smartphone" },
    { "name": "Samsung Galaxy S23", "price": 15000000, "stock": 5, "category": "Smartphone" },
    { "name": "Xiaomi 13", "price": 10000000, "stock": 0, "category": "Smartphone" },
    { "name": "Asus ROG Strix", "price": 12000000, "stock": 3, "category": "Laptop" },
    { "name": "Macbook Pro 2023", "price": 30000000, "stock": 2, "category": "Laptop" },
    { "name": "DAIKIN AC Split", "price": 5000000, "stock": 7, "category": "AC" },
    { "name": "Sharp AC Split", "price": 4000000, "stock": 4, "category": "AC" }
]`;

// Function ini MEMBERIKAN nomor antrean (Promise), bukan datanya langsung.
// Di dalamnya kita pura-pura jadi server yang butuh 1 detik untuk menjawab.
// shouldFail = true => pura-pura servernya rusak
const getProducts = (shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error("Server tidak bisa dihubungi")); // dapur tutup
                return;
            }
            resolve(JSON.parse(productsJson)); // makanan siap, kirim datanya
        }, 1000);
    });
};

// NOTE: kalau nanti pakai server sungguhan (Live Server), isi getProducts cukup diganti
//   const response = await fetch("data/products.json");
//   return response.json();
// fetch ke file lokal (double click index.html) diblokir browser demi keamanan,
// makanya sementara kita tiru dengan Promise


// ============================================
// 3. TAMPILKAN ke HTML
// ============================================

const statusText = document.querySelector("#status");
const productList = document.querySelector("#product .list");

// Cara menampilkan : susun HTML sebagai teks (template string), lalu masukkan lewat innerHTML
// map mengubah tiap produk menjadi 1 potong HTML <li>, join("") menyambung semuanya jadi satu teks
const renderProducts = (products) => {
    productList.innerHTML = products.map((product) => {
        // kalau stok 0, beri class "out-of-stock" (tampilannya dicoret lewat CSS)
        const className = product.stock === 0 ? "out-of-stock" : "";

        return `<li class="${className}">Nama : ${product.name} - Harga : ${product.price} - Stok : ${product.stock}</li>`;
    }).join("");
};

// NOTE: innerHTML aman dipakai di sini karena datanya dari kita sendiri / server tepercaya.
// Kalau datanya ketikan pengguna (komentar, nama, dll), pakai textContent.
// Alasannya, innerHTML menjalankan tag apa pun yang ikut masuk, termasuk tag berbahaya.

// Saat menunggu data, pengguna harus tahu apa yang terjadi. Selalu ada 3 keadaan :
// 1. loading (sedang menunggu)  2. sukses (data tampil)  3. error (gagal)
const showLoading = () => {
    statusText.classList.remove("error");
    statusText.textContent = "Memuat data...";
    productList.innerHTML = "";
};

const showError = (error) => {
    statusText.classList.add("error");
    statusText.textContent = `Gagal : ${error.message}`;
};


// ============================================
// 4. CARA 1 : .then / .catch / .finally
// ============================================

/*
    Cara membacanya seperti memberi pesan ke kasir :
      .then    => "kalau makanan SIAP, lakukan ini"
      .catch   => "kalau GAGAL, lakukan ini"
      .finally => "apa pun hasilnya, lakukan ini juga di akhir"
*/

const loadWithThen = (shouldFail = false) => {
    showLoading();

    // getProducts() memberi nomor antrean. Pesan kita dititipkan ke nomor itu.
    getProducts(shouldFail)
        .then((products) => {          // makanan siap
            renderProducts(products);
            statusText.textContent = `Berhasil memuat ${products.length} produk`;
        })
        .catch((error) => {            // dapur tutup
            showError(error);
        })
        .finally(() => {               // selalu jalan di akhir
            console.log("then : selesai");
        });

    // NOTE: baris ini jalan LEBIH DULU dari isi .then di atas.
    // Karena program tidak menunggu, pesannya hanya dititipkan.
    console.log("then : request dikirim, belum ada hasil");
};


// ============================================
// 5. CARA 2 : async / await (hasil sama, cara baca beda)
// ============================================

/*
    Hasilnya sama persis dengan .then, tapi ditulis seperti kode biasa dari atas ke bawah.

      async  => ditaruh di depan function. Artinya "function ini boleh menunggu".
      await  => "berhenti sebentar DI SINI sampai nomor antrean dipanggil, lalu ambil hasilnya".
                Hanya program di dalam function ini yang menunggu, halaman tetap lancar.
      try / catch / finally => pengganti .catch dan .finally
                try = "coba lakukan ini", catch = "kalau gagal, lakukan ini"
*/

const loadWithAwait = async (shouldFail = false) => {
    showLoading();

    try {
        const products = await getProducts(shouldFail); // menunggu di sini
        renderProducts(products);
        statusText.textContent = `Berhasil memuat ${products.length} produk`;
    } catch (error) {
        showError(error);
    } finally {
        console.log("await : selesai");
    }
};

/*
    PERBANDINGAN

    .then                              async / await
    -----------------------------      -----------------------------
    getProducts().then(hasil => ...)   const hasil = await getProducts()
    .catch(error => ...)               try { ... } catch (error) { ... }
    .finally(() => ...)                finally { ... }
    bertingkat kalau banyak langkah    dibaca dari atas ke bawah seperti biasa

    Keduanya sama-sama Promise, hanya beda cara menulis.
    Untuk kode baru disarankan async/await (lebih mudah dibaca),
    tapi .then tetap harus bisa dibaca karena banyak dipakai di kode lama.
*/


// ============================================
// 6. DENGAR : tombol
// ============================================

document.querySelector("#btn-then").addEventListener("click", () => loadWithThen());
document.querySelector("#btn-await").addEventListener("click", () => loadWithAwait());
document.querySelector("#btn-error").addEventListener("click", () => loadWithAwait(true));

// NOTE: addEventListener("click", loadWithAwait(true)) SALAH.
// Kurung membuat function langsung jalan saat halaman dibuka, bukan saat diklik.
// Bungkus dengan arrow function : () => loadWithAwait(true)


// ============================================
// 7. Beberapa Promise sekaligus (Promise.all)
// ============================================

/*
    Bayangkan memesan 3 menu yang dimasak di dapur berbeda.
    Satu per satu = menunggu menu 1 selesai, baru pesan menu 2, dst (lambat).
    Promise.all   = pesan ketiganya sekaligus, lalu tunggu sampai semuanya siap (lebih cepat).
*/
const loadTwice = async () => {
    console.time("all");
    const [first, second] = await Promise.all([getProducts(), getProducts()]);
    console.timeEnd("all"); // sekitar 1 detik, bukan 2 detik
    console.log(first.length, second.length);
};

// loadTwice(); // hapus tanda // di depan untuk mencoba

/*
    JEBAKAN
    1. await di luar async function            => error, function-nya harus diberi async
    2. lupa await                              => yang didapat nomor antrean (Promise { <pending> }), bukan datanya
    3. tidak ada try / catch                   => kalau gagal, halaman diam tanpa pesan apa pun
    4. await satu per satu untuk pekerjaan yang bebas => lambat, pakai Promise.all
    5. JSON masih berupa teks                  => JSON.parse(teks) atau response.json()
*/
