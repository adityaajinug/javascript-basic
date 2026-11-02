console.log("Meeting 8 : Project PokeOrder !")

// ============================================
// 1. PETA PROJECT
// ============================================

/*
    Hari ini kita menyusun semua materi sesi 1 sampai 7 menjadi satu toko online kecil.

    Alurnya (3 halaman) :
      Katalog  =>  Keranjang + Checkout  =>  Pembayaran + Hasil

    Materi yang dipakai di tiap bagian :
      Array (map, filter, find, reduce)   => cari, filter, urutkan, hitung total
      DOM + event                         => tombol, form, klik pada kartu
      fetch + async await                 => ambil data Pokemon dari PokeAPI
      localStorage                        => isi keranjang dan data pesanan
      sessionStorage                      => filter terakhir dan draft form

    Sebelum ke project, kita latihan inti katalognya dulu di halaman ini :
    SEARCH + FILTER + URUTKAN pada array.
*/


// ============================================
// 2. DATA CONTOH (array lengkap)
// ============================================

const products = [
    { id: 1, name: "Iphone 14", price: 20000000, stock: 10, category: "Smartphone" },
    { id: 2, name: "Samsung Galaxy S23", price: 15000000, stock: 5, category: "Smartphone" },
    { id: 3, name: "Xiaomi 13", price: 10000000, stock: 0, category: "Smartphone" },
    { id: 4, name: "Asus ROG Strix", price: 12000000, stock: 3, category: "Laptop" },
    { id: 5, name: "Macbook Pro 2023", price: 30000000, stock: 2, category: "Laptop" },
    { id: 6, name: "DAIKIN AC Split", price: 5000000, stock: 7, category: "AC" },
    { id: 7, name: "Sharp AC Split", price: 4000000, stock: 4, category: "AC" }
];


// ============================================
// 3. PIPELINE : data asli -> disaring bertahap -> hasil
// ============================================

/*
    Bayangkan saringan bertingkat. Data asli masuk dari atas, tiap saringan
    membuang yang tidak cocok, yang tersisa turun ke saringan berikutnya.

      search  =>  kategori  =>  stok  =>  urutkan

    ATURAN PENTING : jangan mengubah array asli (products).
    Setiap filter berubah, hitung ulang dari products. Kalau array asli rusak,
    data yang sudah dibuang tidak bisa kembali.
*/

const applyFilters = (filters) => {
    const keyword = filters.search.trim().toLowerCase();

    const result = products
        // 1. search : nama mengandung kata yang diketik (huruf besar kecil disamakan)
        .filter((product) => product.name.toLowerCase().includes(keyword))
        // 2. kategori : "all" berarti semua lolos
        .filter((product) => filters.category === "all" || product.category === filters.category)
        // 3. stok : kalau dicentang, hanya yang stoknya lebih dari 0
        .filter((product) => !filters.onlyAvailable || product.stock > 0);

    // 4. urutkan. filter() sudah menghasilkan array BARU, jadi aman di-sort
    if (filters.sort === "cheap") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "expensive") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
};

// NOTE: sort((a, b) => a.price - b.price)
//   hasil negatif => a di depan, positif => b di depan. Untuk angka, kurangkan.
//   Untuk teks, pakai localeCompare.


// ============================================
// 4. FORMAT RUPIAH
// ============================================

// Intl.NumberFormat = alat bawaan JavaScript untuk menulis angka sesuai kebiasaan suatu negara
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
};

console.log(formatRupiah(20000000)); // "Rp 20.000.000" (spasi di sini spasi khusus)


// ============================================
// 5. TAMPILKAN + INGAT FILTER TERAKHIR
// ============================================

const productList = document.querySelector(".list");
const countText = document.querySelector("#count");
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");
const availableCheckbox = document.querySelector("#only-available");

// Filter terakhir diingat di sessionStorage (sesi 7). Kalau belum ada, pakai nilai awal
const savedFilters = JSON.parse(sessionStorage.getItem("warmupFilters")) ?? {
    search: "",
    category: "all",
    sort: "name",
    onlyAvailable: false
};

const render = () => {
    // Baca nilai dari form => jadi satu object "filters"
    const filters = {
        search: searchInput.value,
        category: categorySelect.value,
        sort: sortSelect.value,
        onlyAvailable: availableCheckbox.checked
    };

    sessionStorage.setItem("warmupFilters", JSON.stringify(filters));

    const result = applyFilters(filters);

    // map : tiap produk jadi satu potong <li>. join("") : sambung jadi satu teks
    productList.innerHTML = result.map((product) => `
        <li class="${product.stock === 0 ? "out-of-stock" : ""}">
            ${product.name} - ${formatRupiah(product.price)} - Stok : ${product.stock}
        </li>
    `).join("");

    countText.textContent = `Menampilkan ${result.length} dari ${products.length} produk`;

    // Hasil kosong harus ada pesannya, jangan dibiarkan layar kosong
    if (result.length === 0) {
        productList.innerHTML = "<li>Produk tidak ditemukan</li>";
    }
};

// Pulihkan nilai form dari filter yang tersimpan
searchInput.value = savedFilters.search;
categorySelect.value = savedFilters.category;
sortSelect.value = savedFilters.sort;
availableCheckbox.checked = savedFilters.onlyAvailable;

// Satu fungsi render untuk semua kontrol. Event "input" mencakup ketik, pilih, dan centang
[searchInput, categorySelect, sortSelect, availableCheckbox].forEach((element) => {
    element.addEventListener("input", render);
});

render();

/*
    POLA YANG AKAN DIPAKAI DI PROJECT
    1. Data asli (products / katalog) tidak pernah diubah.
    2. Filter disimpan sebagai satu object (state).
    3. Setiap ada perubahan : ubah state => applyFilters => render ulang.

    TUGAS
    1. Tambahkan input harga minimum dan maksimum
    2. Tambahkan filter kategori lebih dari satu (checkbox), cocokkan dengan array.includes
    3. Tampilkan pesan khusus kalau search dan filter menghasilkan 0 produk
*/
