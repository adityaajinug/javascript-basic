console.log("Meeting 7 : Web Storage !")

// ============================================
// 1. MASALAH : DATA HILANG SAAT REFRESH
// ============================================

/*
    Semua variable di JavaScript hidup di memori halaman.
    Refresh atau tutup tab => memori dikosongkan => datanya hilang.

    Web Storage = "lemari kecil" milik browser untuk menyimpan data.
    Isinya tetap ada walaupun halaman di-refresh.

    Ada dua lemari :
      localStorage   => lemari di rumah. Tetap ada sampai kita sendiri yang menghapus.
      sessionStorage => loker sementara. Hilang saat TAB ditutup.
*/

let counter = 0;
counter++;
console.log("counter biasa :", counter); // selalu 1 setiap halaman dibuka, karena mulai dari 0 lagi


// ============================================
// 2. EMPAT PERINTAH DASAR
// ============================================

/*
    Bayangkan lemari berlaci. Tiap laci punya LABEL (key) dan ISI (value).

      setItem(key, value)  => simpan (taruh isi di laci berlabel key)
      getItem(key)         => baca   (buka laci, ambil isinya)
      removeItem(key)      => hapus satu laci
      clear()              => kosongkan semua laci
*/

localStorage.setItem("username", "Adit");

const username = localStorage.getItem("username");
console.log(username); // "Adit"

localStorage.removeItem("username");
console.log(localStorage.getItem("username")); // null (laci tidak ada)

// NOTE: getItem untuk key yang tidak ada hasilnya null, bukan error.
// NOTE: lihat isinya di DevTools => tab Application => Local Storage


// ============================================
// 3. JEBAKAN : YANG DISIMPAN HANYA TEKS (STRING)
// ============================================

/*
    Lemari ini hanya mau menerima TEKS.
    Angka, boolean, array, atau object akan dipaksa menjadi teks dulu.
*/

localStorage.setItem("score", 10);
console.log(localStorage.getItem("score"));         // "10" (teks, bukan angka)
console.log(typeof localStorage.getItem("score"));  // "string"

console.log(Number(localStorage.getItem("score")) + 5); // 15 (ubah dulu ke angka)

// Array dan object lebih parah :
const favoriteNames = ["Iphone 14", "Asus ROG Strix"];
localStorage.setItem("wrong", favoriteNames);
console.log(localStorage.getItem("wrong")); // "Iphone 14,Asus ROG Strix" (jadi satu teks panjang)

localStorage.setItem("wrong", { name: "Iphone 14" });
console.log(localStorage.getItem("wrong")); // "[object Object]" (isinya hilang)


// ============================================
// 4. SOLUSI : JSON.stringify dan JSON.parse
// ============================================

/*
    Seperti sesi 6, JSON adalah teks yang bentuknya seperti array / object.

      JSON.stringify(data)  => data jadi teks   (dipakai SEBELUM menyimpan)
      JSON.parse(teks)      => teks jadi data   (dipakai SETELAH membaca)

    Seperti memasukkan barang ke kardus sebelum disimpan (stringify),
    lalu membongkar kardusnya saat dipakai lagi (parse).
*/

localStorage.setItem("favorites", JSON.stringify(favoriteNames));

const textFromStorage = localStorage.getItem("favorites");
console.log(textFromStorage);        // '["Iphone 14","Asus ROG Strix"]' (masih teks)

const favorites = JSON.parse(textFromStorage);
console.log(favorites[0]);           // "Iphone 14" (sudah jadi array lagi)


// ============================================
// 5. FUNCTION PEMBANTU : saveData dan loadData
// ============================================

/*
    Menulis stringify / parse berulang-ulang melelahkan, dan mudah lupa.
    Jadi dibungkus sekali dalam dua function. Setelah itu kita tinggal pakai.

    loadData butuh 2 pengaman :
    1. Kalau key belum ada, getItem memberi null. Kita kembalikan nilai bawaan (fallback).
    2. Kalau teksnya rusak (misal diedit manual), JSON.parse melempar error.
       Makanya dibungkus try / catch supaya halaman tidak mati.
*/

const saveData = (key, value, storage = localStorage) => {
    storage.setItem(key, JSON.stringify(value));
};

const loadData = (key, fallback, storage = localStorage) => {
    const text = storage.getItem(key);
    if (text === null) return fallback;

    try {
        return JSON.parse(text);
    } catch (error) {
        return fallback;
    }
};

// Contoh pakai
saveData("settings", { theme: "dark", fontSize: 16 });
console.log(loadData("settings", {}).theme);   // "dark"
console.log(loadData("belum-ada", []));        // [] (nilai bawaan)

// NOTE: "storage = localStorage" artinya : kalau tidak diberi, pakai localStorage.
// Bisa diganti sessionStorage tanpa mengubah isi function.


// ============================================
// 6. localStorage vs sessionStorage
// ============================================

/*
                      localStorage            sessionStorage
    -----------------------------------------------------------------
    Umur data         sampai dihapus          sampai TAB ditutup
    Refresh           tetap ada               tetap ada
    Tab lain          dibagi                  terpisah (tiap tab punya sendiri)
    Cocok untuk       favorit, tema, keranjang, draft form, filter / langkah sementara
                      todo list

    Cara pakainya SAMA PERSIS, hanya beda nama.
*/

sessionStorage.setItem("lastCategory", "Laptop");
console.log(sessionStorage.getItem("lastCategory")); // "Laptop"

/*
    JANGAN SIMPAN
    - password atau token login. Siapa pun yang membuka DevTools bisa membacanya,
      dan script berbahaya di halaman juga bisa mengambilnya.
    - data besar. Batasnya sekitar 5 MB per website.
    Web Storage itu untuk kenyamanan pengguna, bukan tempat rahasia.
*/


// ============================================
// 7. PRAKTIK : FAVORIT PRODUK
// ============================================

// Data yang sama seperti sesi sebelumnya
const products = [
    { id: 1, name: "Iphone 14", price: 20000000, stock: 10, category: "Smartphone" },
    { id: 2, name: "Samsung Galaxy S23", price: 15000000, stock: 5, category: "Smartphone" },
    { id: 3, name: "Xiaomi 13", price: 10000000, stock: 0, category: "Smartphone" },
    { id: 4, name: "Asus ROG Strix", price: 12000000, stock: 3, category: "Laptop" },
    { id: 5, name: "Macbook Pro 2023", price: 30000000, stock: 2, category: "Laptop" },
    { id: 6, name: "DAIKIN AC Split", price: 5000000, stock: 7, category: "AC" },
    { id: 7, name: "Sharp AC Split", price: 4000000, stock: 4, category: "AC" }
];

const productList = document.querySelector("#product .list");
const filterSelect = document.querySelector("#filter-category");
const statusText = document.querySelector("#status");

// STATE (data yang menentukan tampilan), dibaca dari storage saat halaman dibuka
// favoriteIds = array berisi id produk favorit, misal [1, 4]
let favoriteIds = loadData("favoriteIds", []);
let category = loadData("category", "all", sessionStorage);

// Render : map mengubah tiap produk menjadi 1 potong HTML <li>, join("") menyambungnya
const renderProducts = () => {
    const visible = category === "all"
        ? products
        : products.filter((product) => product.category === category);

    productList.innerHTML = visible.map((product) => {
        const isFavorite = favoriteIds.includes(product.id);
        const className = [
            product.stock === 0 ? "out-of-stock" : "",
            isFavorite ? "favorite" : ""
        ].join(" ");

        return `
            <li class="${className}">
                ${product.name} - Rp${product.price} - Stok : ${product.stock}
                <button type="button" data-id="${product.id}">${isFavorite ? "Hapus favorit" : "Favorit"}</button>
            </li>
        `;
    }).join("");

    statusText.textContent = `Favorit : ${favoriteIds.length} produk`;
};

// Satu listener di <ul> untuk semua tombol (event delegation, sesi 5)
productList.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id); // dataset selalu teks, ubah ke angka

    favoriteIds = favoriteIds.includes(id)
        ? favoriteIds.filter((favoriteId) => favoriteId !== id) // sudah ada => buang
        : [...favoriteIds, id];                                  // belum ada => tambah

    saveData("favoriteIds", favoriteIds); // SIMPAN setiap kali berubah
    renderProducts();
});

filterSelect.addEventListener("change", () => {
    category = filterSelect.value;
    saveData("category", category, sessionStorage);
    renderProducts();
});

document.querySelector("#btn-clear").addEventListener("click", () => {
    favoriteIds = [];
    localStorage.removeItem("favoriteIds");
    renderProducts();
});

// Pulihkan pilihan terakhir ke <select>, lalu tampilkan
filterSelect.value = category;
renderProducts();

/*
    ALUR YANG HARUS DIINGAT (tiga langkah, selalu sama)
    1. BACA   : state = loadData(...)       saat halaman dibuka
    2. UBAH   : state diubah oleh event     (klik, submit, change)
    3. SIMPAN : saveData(...) lalu render   setiap kali berubah

    Coba : klik beberapa favorit, pilih kategori Laptop, lalu refresh.
    Favorit tetap ada (localStorage). Kategori Laptop juga tetap ada selama tab yang sama.
    Buka tab baru : favorit ada, kategori kembali ke Semua (sessionStorage).
*/
