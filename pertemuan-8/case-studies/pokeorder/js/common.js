/*
    common.js : kode yang dipakai bersama oleh semua halaman.
    Setiap HTML memanggil file ini LEBIH DULU, jadi function di sini bisa dipakai file lain.
    (Cara yang lebih modern adalah import / export, tapi untuk pemula cukup begini)
*/

// ============================================
// 1. KONSTANTA
// ============================================

const BASE_URL = "https://pokeapi.co/api/v2";
const SHIPPING_FEE = 20000;
const MAX_PROOF_SIZE = 2 * 1024 * 1024; // 2 MB

// 18 tipe Pokemon. Dipakai untuk filter dan untuk mengambil data katalog
const TYPES = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
    "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

// Warna tiap tipe ada di css/style.css (class .type-fire, .type-water, dst)

// ============================================
// 2. PEMBANTU UMUM
// ============================================

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Angka => "Rp 150.000"
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(number);
};

// 25 => "#025"
const formatId = (id) => `#${String(id).padStart(3, "0")}`;

// "pikachu" => "Pikachu"
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// 1258291 => "1.2 MB"
const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Gambar kecil Pokemon dari PokeAPI, dibuat dari nomornya
const getSprite = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

// Teks dari PENGGUNA harus "dibersihkan" sebelum masuk lewat innerHTML (cegah XSS, sesi 5 dan 7)
const escapeHtml = (text) => {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
};

// ============================================
// 3. STORAGE (sesi 7)
// ============================================

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

// ============================================
// 4. HARGA DAN STOK
// ============================================

/*
    PokeAPI tidak punya harga dan stok, jadi kita buat sendiri dari nomor Pokemon.
    Rumusnya tetap (bukan acak), jadi setiap dibuka angkanya sama.
      harga : Rp 50.000 sampai Rp 245.000, kelipatan 5.000
      stok  : 0 sampai 7. Nomor kelipatan 8 selalu habis (stok 0)
*/
const makePrice = (id) => 50000 + ((id * 37) % 40) * 5000;
const makeStock = (id) => (id * 5) % 8;

// ============================================
// 5. KERANJANG
// ============================================

/*
    Bentuk isi keranjang di localStorage["cart"] :
    [
        { id: 25, name: "pikachu", types: ["electric"], price: 150000, stock: 5, qty: 2 },
        { id: 7,  name: "squirtle", types: ["water"],    price: 175000, stock: 3, qty: 1 }
    ]
    Data produk disalin ke dalam keranjang (nama, harga, dll), jadi halaman keranjang
    tidak perlu mengambil data dari API lagi.
*/

const getCart = () => loadData("cart", []);

const countCartItems = () => {
    return getCart().reduce((total, item) => total + item.qty, 0);
};

const updateCartBadge = () => {
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
        badge.textContent = countCartItems();
    });
};

const saveCart = (cart) => {
    saveData("cart", cart);
    updateCartBadge();
};

// Menambah ke keranjang, tapi tidak boleh melebihi stok.
// Mengembalikan jumlah yang BERHASIL ditambahkan (bisa kurang dari qty, bisa 0)
const addToCart = (product, qty = 1) => {
    const cart = getCart();
    const item = cart.find((cartItem) => cartItem.id === product.id);

    const currentQty = item ? item.qty : 0;
    const added = Math.max(0, Math.min(qty, product.stock - currentQty));
    if (added === 0) return 0;

    if (item) {
        item.qty += added;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            types: product.types,
            price: product.price,
            stock: product.stock,
            qty: added
        });
    }

    saveCart(cart);
    return added;
};

// ============================================
// 6. NOTIFIKASI KECIL
// ============================================

let toastTimer;
const showToast = (message) => {
    let toast = document.querySelector("#toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.setAttribute("role", "status");
        toast.className = "toast";
        document.body.append(toast);
    }

    toast.textContent = message; // textContent : aman untuk teks apa pun
    toast.classList.add("is-visible");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

// Salin teks ke clipboard. Kalau browser tidak mengizinkan, beri tahu pengguna
const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`"${text}" berhasil disalin`);
    } catch (error) {
        showToast("Tidak bisa menyalin otomatis, salin manual ya");
    }
};

// ============================================
// 7. TEMPLATE YANG DIPAKAI BERSAMA
// ============================================

// Satu baris pesanan (dipakai di halaman pembayaran, sukses, dan gagal)
const orderItemTemplate = (item) => {
    return `
        <div class="order-item">
            <div class="order-item__thumb tint type-${item.types[0]}">
                <small>${formatId(item.id)}</small>
                <img src="${getSprite(item.id)}" alt="${item.name}">
            </div>
            <div class="order-item__info">
                <div class="order-item__row">
                    <h4>${capitalize(item.name)}</h4>
                    <strong>${formatRupiah(item.price * item.qty)}</strong>
                </div>
                <div class="order-item__meta">
                    ${item.types.map((type) => `<span class="badge type-${type}">${type}</span>`).join("")}
                    <span>${item.qty}x @ ${formatRupiah(item.price)}</span>
                </div>
            </div>
        </div>
    `;
};

updateCartBadge();
