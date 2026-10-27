console.log("Meeting 5 : Document Object Manipulation !")

/*
    DOM = Document Object Model
    Browser membaca file HTML lalu membuat "pohon" objek di memori.
    JavaScript tidak mengubah file HTML, tapi mengubah pohon di memori itu.
    Kalau halaman di-refresh, semua perubahan dari JavaScript hilang.

    3 kata kerja hari ini : CARI -> UBAH -> DENGAR
*/


// ============================================
// 1. CARI element
// ============================================

// getElementById => cari 1 element berdasarkan id (tanpa tanda #)
const title = document.getElementById("title");

// querySelector => ambil 1 element PERTAMA yang cocok (pakai selector CSS)
// #id, .class, tag, #parent .child
const techList = document.querySelector("#tech-stack .list");
const productList = document.querySelector("#product .list");

// querySelectorAll => ambil SEMUA yang cocok (hasilnya NodeList)
const filterButtons = document.querySelectorAll(".filters button");
console.log(filterButtons.length); // 4

// NOTE: kalau tidak ketemu
//   querySelector     => null
//   querySelectorAll  => NodeList kosong (length 0)
console.log(document.querySelector(".tidak-ada")); // null

// NOTE: NodeList punya forEach, tapi TIDAK punya map / filter
// ubah dulu jadi array dengan spread, baru boleh pakai method array pertemuan 4
const buttonNames = [...filterButtons].map((button) => button.textContent);
console.log(buttonNames); // ["All", "Smartphone", "Laptop", "AC"]


// ============================================
// 2. UBAH element
// ============================================

// textContent => ganti teks (aman, tag HTML dianggap teks biasa)
title.textContent = "Pertemuan 5 : DOM";

// innerHTML => ganti isi dengan HTML (tag diproses)
// NOTE: jangan dipakai untuk data dari pengguna (celah XSS), pakai textContent
document.querySelector("#message").innerHTML = "Belajar <b>DOM</b> hari ini";

// classList => pasang / lepas class, tampilannya diatur di CSS
// title.classList.add("active");
// title.classList.remove("active");
// title.classList.toggle("active");        // ada -> dilepas, belum ada -> dipasang
// title.classList.toggle("active", true);  // true -> pasang, false -> lepas

// style => ubah gaya langsung (pakai untuk nilai yang dihitung saja)
title.style.color = "steelblue";

// atribut
// title.setAttribute("title", "Halo");
// title.dataset.id = 1;    // => data-id="1"


// ============================================
// 3. BUAT element dari array (render)
// ============================================

const techStack = ["JavaScript", "HTML", "CSS"];

// createElement => buat element baru, append => pasang ke halaman
// forEach dipakai karena tugasnya efek ke halaman, bukan menghasilkan array baru
techStack.forEach((value, index) => {
    const li = document.createElement("li");
    li.textContent = `index ke-${index} : ${value}`;
    techList.append(li);
});

const products = [
    {
        name: "Iphone 14",
        price: 20000000,
        stock: 10,
        category: "Smartphone"
    },
    {
        name: "Samsung Galaxy S23",
        price: 15000000,
        stock: 5,
        category: "Smartphone"
    },
    {
        name: "Xiaomi 13",
        price: 10000000,
        stock: 0,
        category: "Smartphone"
    },
    {
        name: "Asus ROG Strix",
        price: 12000000,
        stock: 3,
        category: "Laptop"
    },
    {
        name: "Macbook Pro 2023",
        price: 30000000,
        stock: 2,
        category: "Laptop"
    },
    {
        name: "DAIKIN AC Split",
        price: 5000000,
        stock: 7,
        category: "AC"
    },
    {
        name: "Sharp AC Split",
        price: 4000000,
        stock: 4,
        category: "AC"
    }
];

// state: data yang menentukan apa yang tampil
let selectedCategory = "all";
let keyword = "";

// Alur render : ubah data (array / state) -> panggil renderProducts() -> halaman ikut berubah
// Halaman hanyalah cerminan dari data
const getVisibleProducts = () => {
    return products
        .filter((product) => selectedCategory === "all" || product.category === selectedCategory)
        .filter((product) => product.name.toLowerCase().includes(keyword.toLowerCase()));
};

const renderProducts = () => {
    productList.innerHTML = ""; // kosongkan dulu supaya tidak dobel

    getVisibleProducts().forEach((product) => {
        const li = document.createElement("li");
        li.textContent = `Nama : ${product.name} - Harga : ${product.price} - Stok : ${product.stock}`;
        li.classList.toggle("out-of-stock", product.stock === 0);

        // tombol hapus, dataset.name dibaca lagi saat diklik (lihat bagian 4)
        const btnDelete = document.createElement("button");
        btnDelete.type = "button";
        btnDelete.textContent = "Hapus";
        btnDelete.dataset.name = product.name;

        li.append(" ", btnDelete);
        productList.append(li);
    });

    // NOTE: kalau tidak ada yang cocok, tampilkan pesan
    if (productList.children.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Produk tidak ditemukan";
        productList.append(li);
    }
};

renderProducts();


// ============================================
// 4. DENGAR event (addEventListener)
// ============================================

/*
    addEventListener("nama-event", function)
    Function yang dititipkan = callback (sama seperti di map / filter)
    Ditulis TANPA kurung : addEventListener("click", sapa)  bukan sapa()
    Browser mengirim object event (e) : e.type, e.target, e.key, e.preventDefault()
*/

// click pada title (contoh paling sederhana)
title.addEventListener("click", () => {
    title.classList.toggle("active");
});

// EVENT DELEGATION
// Pasang SATU listener di element induk, bukan di setiap tombol
// Tombol yang dibuat belakangan (hasil render) ikut bekerja
const filters = document.querySelector(".filters");

filters.addEventListener("click", (e) => {
    // closest => naik ke induk terdekat yang cocok (kalau yang diklik elemen di dalam button)
    const button = e.target.closest("button");
    if (!button) return; // yang diklik celah di antara tombol

    selectedCategory = button.dataset.category;

    filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
    });
    renderProducts();
});

// hapus produk : delegation di productList
productList.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const index = products.findIndex((product) => product.name === button.dataset.name);
    products.splice(index, 1); // buang 1 data dari array asli
    renderProducts();
});

// input => menyala di SETIAP ketikan (cocok untuk pencarian langsung)
// change => menyala setelah selesai (pindah kolom / pilih dropdown)
const search = document.querySelector("#search");

search.addEventListener("input", (e) => {
    keyword = e.target.value;
    renderProducts();
});

// keydown => tombol keyboard, e.key berisi nama tombol
search.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        search.value = "";
        keyword = "";
        renderProducts();
    }
});


// ============================================
// 5. FORM : event submit
// ============================================

const form = document.querySelector("#form-product");
const message = document.querySelector("#message");

// NOTE: dengar "submit" di <form>, bukan "click" di tombolnya
// supaya menekan Enter di dalam kolom juga bekerja
form.addEventListener("submit", (e) => {
    // perilaku bawaan form = kirim data lalu reload halaman (semua data di memori hilang)
    e.preventDefault();

    // form.elements.NAME => ambil kolom berdasarkan atribut name
    const name = form.elements.name.value.trim();
    const price = Number(form.elements.price.value);
    const category = form.elements.category.value;

    if (name === "" || price <= 0) {
        message.textContent = "Nama dan harga wajib diisi";
        return;
    }

    products.push({ name, price, stock: 1, category });
    message.textContent = `${name} berhasil ditambahkan`;
    form.reset();
    renderProducts();
});


// ============================================
// 6. Event lain (catatan)
// ============================================

/*
    focus / blur            => kolom mulai / selesai diisi
    mouseover / mouseout    => kursor masuk / keluar element
    keyup                   => tombol keyboard dilepas
    scroll / resize         => dipasang di window
    DOMContentLoaded        => HTML selesai dibaca, dipasang di document

    document.addEventListener("DOMContentLoaded", () => {
        // kode di sini aman mencari element, walaupun <script> ada di <head>
    });

    JEBAKAN
    1. null / "Cannot read properties of null" => selector salah, atau script jalan sebelum HTML
    2. addEventListener("click", sapa())       => function langsung jalan, harusnya sapa
    3. innerHTML + input pengguna              => celah XSS, pakai textContent
    4. listener dipasang di tiap tombol        => tombol baru tidak ikut, pakai delegation
*/
