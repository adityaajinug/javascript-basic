/*
    catalog.js : halaman katalog

    Alur besar :
      1. Ambil data semua Pokemon Kanto dari PokeAPI (sekali, lalu disimpan di localStorage)
      2. Pengguna mengubah search / filter  =>  hitung ulang daftar  =>  tampilkan
      3. Tombol "+ Keranjang" menyimpan ke localStorage["cart"]
      4. Klik kartu => ambil detail 1 Pokemon dari API => tampil di modal
*/

const PAGE_SIZE = 12;

// ---------- ELEMEN ----------

const grid = document.querySelector("#grid");
const typeList = document.querySelector("#type-list");
const searchInput = document.querySelector("#search");
const minInput = document.querySelector("#min-price");
const maxInput = document.querySelector("#max-price");
const availableInput = document.querySelector("#only-available");
const sortSelect = document.querySelector("#sort");
const countText = document.querySelector("#count-text");
const sortLabel = document.querySelector("#sort-label");
const activeCount = document.querySelector("#active-count");
const stateEmpty = document.querySelector("#state-empty");
const stateError = document.querySelector("#state-error");
const loadMoreWrap = document.querySelector("#load-more-wrap");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#filter-overlay");
const modal = document.querySelector("#detail-modal");
const detailBody = document.querySelector("#detail-body");

// ---------- STATE ----------

const DEFAULT_FILTERS = {
    search: "",
    types: [],            // contoh : ["fire", "water"]
    minPrice: "",
    maxPrice: "",
    onlyAvailable: false,
    sort: "id"
};

let catalog = [];         // semua Pokemon (151). Tidak pernah diubah, hanya dibaca
let filters = loadData("catalogFilters", DEFAULT_FILTERS, sessionStorage);
let visibleCount = PAGE_SIZE;

// ============================================
// 1. AMBIL DATA DARI POKEAPI
// ============================================

/*
    PokeAPI tidak punya satu alamat "semua Pokemon beserta tipenya".
    Caranya : minta daftar Pokemon untuk SETIAP tipe (18 permintaan sekaligus dengan Promise.all),
    lalu gabungkan. Pokemon yang muncul di dua tipe otomatis mendapat dua tipe.

    Bentuk jawaban GET /type/fire (disingkat) :
    { pokemon: [ { pokemon: { name: "charmander", url: ".../pokemon/4/" } }, ... ] }

    Nomor Pokemon diambil dari akhir url. Kanto = nomor 1 sampai 151.
*/

const getTypeData = async (type) => {
    const response = await fetch(`${BASE_URL}/type/${type}`);

    if (!response.ok) {
        throw new Error(`Gagal mengambil tipe ${type} (${response.status})`);
    }

    return response.json();
};

const buildCatalog = (results) => {
    const byId = {}; // { 25: { id: 25, name: "pikachu", types: ["electric"] }, ... }

    results.forEach((data, index) => {
        const type = TYPES[index];

        data.pokemon.forEach((entry) => {
            // "https://pokeapi.co/api/v2/pokemon/25/" => 25
            const id = Number(entry.pokemon.url.split("/").filter(Boolean).pop());
            if (id > 151) return;

            byId[id] ??= { id, name: entry.pokemon.name, types: [] }; // ??= : isi kalau belum ada
            byId[id].types.push(type);
        });
    });

    return Object.values(byId)
        .sort((a, b) => a.id - b.id)
        .map((pokemon) => ({ ...pokemon, price: makePrice(pokemon.id), stock: makeStock(pokemon.id) }));
};

// Data katalog jarang berubah, jadi disimpan di localStorage (sesi 7). Pembukaan berikutnya langsung cepat
const loadCatalog = async () => {
    const cached = loadData("catalogV1", null);
    if (cached) return cached;

    const results = await Promise.all(TYPES.map(getTypeData)); // 18 permintaan bersamaan
    const data = buildCatalog(results);

    saveData("catalogV1", data);
    return data;
};

// ============================================
// 2. SEARCH + FILTER + URUTKAN
// ============================================

// Seperti pemanasan di pertemuan-8/index.html : data asli disaring bertahap, hasilnya array BARU
const applyFilters = () => {
    const keyword = filters.search.trim().toLowerCase().replace("#", "");
    const min = Number(filters.minPrice) || 0;
    const max = Number(filters.maxPrice) || Infinity;

    const result = catalog
        .filter((pokemon) => pokemon.name.includes(keyword) || String(pokemon.id) === keyword)
        .filter((pokemon) => filters.types.length === 0 || filters.types.some((type) => pokemon.types.includes(type)))
        .filter((pokemon) => pokemon.price >= min && pokemon.price <= max)
        .filter((pokemon) => !filters.onlyAvailable || pokemon.stock > 0);

    if (filters.sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (filters.sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    // sort "id" : urutan asli katalog sudah berdasarkan nomor, jadi tidak perlu apa-apa

    return result;
};

// ============================================
// 3. TAMPILKAN
// ============================================

const cardTemplate = (pokemon) => {
    const soldOut = pokemon.stock === 0;
    const lowStock = pokemon.stock > 0 && pokemon.stock <= 2;

    return `
        <li class="card ${soldOut ? "card--soldout" : ""}" data-id="${pokemon.id}">
            ${soldOut ? `<span class="card__ribbon">Habis Terjual</span>` : ""}

            <button type="button" data-action="detail" aria-label="Lihat detail ${pokemon.name}" class="card__media tint type-${pokemon.types[0]}">
                <span class="card__id">${formatId(pokemon.id)}</span>
                <img class="card__img" src="${getSprite(pokemon.id)}" alt="${pokemon.name}" loading="lazy">
                ${soldOut ? "" : `<span class="card__stock ${lowStock ? "card__stock--low" : ""}">Stok: ${pokemon.stock}</span>`}
            </button>

            <div class="card__body">
                <div>
                    <div class="card__badges">
                        ${pokemon.types.map((type) => `<span class="badge type-${type}">${type}</span>`).join("")}
                    </div>
                    <h3 class="card__name">${pokemon.name}</h3>
                </div>

                <div>
                    <div class="card__price-row">
                        <small>Harga</small>
                        <span class="card__price">${formatRupiah(pokemon.price)}</span>
                    </div>
                    <button type="button" data-action="add" class="btn ${soldOut ? "" : "btn--primary"}" ${soldOut ? "disabled" : ""}>
                        <span class="material-symbols-outlined">${soldOut ? "block" : "add_shopping_cart"}</span>
                        ${soldOut ? "Stok Habis" : "+ Keranjang"}
                    </button>
                </div>
            </div>
        </li>
    `;
};

// Kartu kerangka saat menunggu data (loading)
const skeletonTemplate = () => `
    <li class="skeleton">
        <div class="skeleton__media"></div>
        <div class="skeleton__body">
            <div class="skeleton__line" style="width: 40%"></div>
            <div class="skeleton__line" style="width: 70%"></div>
            <div class="skeleton__line"></div>
        </div>
    </li>
`;

const SORT_LABELS = {
    "id": "ID Pokedex",
    "price-asc": "Harga Termurah",
    "price-desc": "Harga Termahal",
    "name": "Nama A-Z"
};

const render = () => {
    const result = applyFilters();
    const shown = result.slice(0, visibleCount);

    // map : tiap Pokemon jadi satu potong HTML. join("") : sambung jadi satu teks
    grid.innerHTML = shown.map(cardTemplate).join("");

    countText.textContent = `Menampilkan ${shown.length} dari ${result.length} Pokémon`;
    sortLabel.textContent = SORT_LABELS[filters.sort];

    // 3 keadaan : ada hasil, kosong, tombol "muat lebih" hanya kalau masih ada sisa
    stateEmpty.classList.toggle("hidden", result.length > 0);
    loadMoreWrap.classList.toggle("hidden", shown.length >= result.length);

    // penanda jumlah filter aktif
    const total = filters.types.length
        + (filters.minPrice !== "" ? 1 : 0)
        + (filters.maxPrice !== "" ? 1 : 0)
        + (filters.onlyAvailable ? 1 : 0);
    activeCount.classList.toggle("hidden", total === 0);
    activeCount.firstElementChild.textContent = `${total} Filter Aktif`;
};

const showLoading = () => {
    stateError.classList.add("hidden");
    stateEmpty.classList.add("hidden");
    loadMoreWrap.classList.add("hidden");
    countText.textContent = "Memuat data dari PokeAPI...";
    grid.innerHTML = Array(8).fill(skeletonTemplate()).join("");
};

const showError = (error) => {
    grid.innerHTML = "";
    loadMoreWrap.classList.add("hidden");
    document.querySelector("#error-message").textContent = error.message;
    stateError.classList.remove("hidden");
    countText.textContent = "Data belum berhasil dimuat";
};

// ============================================
// 4. FILTER : baca dari form, simpan, tampilkan
// ============================================

// Kotak centang tipe dibuat dari array TYPES (tidak ditulis satu-satu)
typeList.innerHTML = TYPES.map((type) => `
    <label class="type-option">
        <input type="checkbox" value="${type}">
        <span class="dot type-${type}"></span>
        ${type}
    </label>
`).join("");

// Form => object filters
const readFilters = () => ({
    search: searchInput.value,
    types: [...typeList.querySelectorAll("input:checked")].map((input) => input.value),
    minPrice: minInput.value,
    maxPrice: maxInput.value,
    onlyAvailable: availableInput.checked,
    sort: sortSelect.value
});

// Object filters => form (dipakai saat halaman dibuka dan saat reset)
const writeFilters = () => {
    searchInput.value = filters.search;
    typeList.querySelectorAll("input").forEach((input) => {
        input.checked = filters.types.includes(input.value);
    });
    minInput.value = filters.minPrice;
    maxInput.value = filters.maxPrice;
    availableInput.checked = filters.onlyAvailable;
    sortSelect.value = filters.sort;
};

const onFilterChange = () => {
    filters = readFilters();
    saveData("catalogFilters", filters, sessionStorage); // diingat selama tab terbuka
    visibleCount = PAGE_SIZE;                            // filter berubah => mulai dari halaman pertama
    render();
};

const resetFilters = () => {
    filters = { ...DEFAULT_FILTERS, types: [] };
    saveData("catalogFilters", filters, sessionStorage);
    writeFilters();
    visibleCount = PAGE_SIZE;
    render();
};

// Event "input" mencakup mengetik, mencentang, dan memilih
searchInput.addEventListener("input", onFilterChange);
sidebar.addEventListener("input", onFilterChange);
document.querySelector("#btn-reset").addEventListener("click", resetFilters);

document.querySelector("#btn-load-more").addEventListener("click", () => {
    visibleCount += PAGE_SIZE;
    render();
});

// ---------- drawer filter di HP ----------

const openDrawer = () => {
    sidebar.classList.add("is-open");
    overlay.classList.add("is-open");
};

const closeDrawer = () => {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
};

document.querySelector("#btn-open-filter").addEventListener("click", openDrawer);
document.querySelector("#btn-close-filter").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// ============================================
// 5. KARTU : tambah ke keranjang dan buka detail
// ============================================

const findProduct = (id) => catalog.find((pokemon) => pokemon.id === id);

// Satu listener di <ul> untuk semua kartu (event delegation, sesi 5)
grid.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.closest("li").dataset.id);

    if (button.dataset.action === "add") {
        const product = findProduct(id);
        const added = addToCart(product);
        showToast(added ? `${capitalize(product.name)} masuk keranjang` : "Jumlah sudah mentok di batas stok");
    }

    if (button.dataset.action === "detail") openDetail(id);
});

stateEmpty.addEventListener("click", (e) => {
    if (e.target.dataset.action === "reset") resetFilters();
});

stateError.addEventListener("click", (e) => {
    if (e.target.dataset.action === "retry") start();
});

// ============================================
// 6. MODAL DETAIL (ambil data 1 Pokemon dari API)
// ============================================

const detailCache = {}; // { 25: {...}, 4: {...} } supaya Pokemon yang sama tidak diminta dua kali

const getPokemonDetail = async (id) => {
    if (detailCache[id]) return detailCache[id];

    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) throw new Error(`Detail tidak ditemukan (${response.status})`);

    detailCache[id] = await response.json();
    return detailCache[id];
};

let detailQty = 1;
let detailId = null;

const statBar = (label, detail, statName) => {
    const value = detail.stats.find((item) => item.stat.name === statName).base_stat;
    const percent = Math.min(100, Math.round((value / 160) * 100)); // 160 dianggap "hampir penuh"

    return `
        <div class="stat">
            <span class="stat__label">${label}</span>
            <span class="stat__value">${value}</span>
            <div class="stat__bar"><i style="width: ${percent}%"></i></div>
        </div>
    `;
};

const detailTemplate = (product, detail) => {
    const soldOut = product.stock === 0;
    const abilities = detail.abilities
        .map((item) => item.ability.name + (item.is_hidden ? " (Hidden)" : ""))
        .join(" • ");

    return `
        <div class="detail">
            <div class="detail__left tint type-${product.types[0]}">
                <div>
                    <div class="detail__top">
                        <small>POKÉDEX ${formatId(product.id)}</small>
                        <span>${product.types.map((type) => `<span class="badge type-${type}">${type}</span>`).join(" ")}</span>
                    </div>
                    <img class="detail__img" src="${getSprite(product.id)}" alt="${product.name}">
                </div>
                <div class="detail__ability">
                    <small>Ability:</small>
                    <span>${abilities}</span>
                </div>
            </div>

            <div class="detail__right">
                <div>
                    <h2>${product.name}</h2>
                    <p class="muted">Kanto Generation I</p>

                    <!-- tinggi dan berat dari API dalam desimeter dan hektogram, jadi dibagi 10 -->
                    <div class="specs">
                        <div><small>Tinggi</small><strong>${detail.height / 10} m</strong></div>
                        <div><small>Berat</small><strong>${detail.weight / 10} kg</strong></div>
                        <div><small>Base Exp</small><strong>${detail.base_experience ?? "-"}</strong></div>
                    </div>

                    <div>
                        ${statBar("HP", detail, "hp")}
                        ${statBar("Attack", detail, "attack")}
                        ${statBar("Speed", detail, "speed")}
                    </div>
                </div>

                <div class="detail__buy">
                    <div class="detail__price-row">
                        <div>
                            <small>Harga Satuan</small>
                            <strong>${formatRupiah(product.price)}</strong>
                        </div>
                        ${soldOut
                            ? `<span class="tag-soldout">Habis Terjual</span>`
                            : `<div class="stepper">
                                <button type="button" data-action="qty-dec" aria-label="Kurangi">-</button>
                                <span id="detail-qty">${detailQty}</span>
                                <button type="button" data-action="qty-inc" aria-label="Tambah">+</button>
                            </div>`}
                    </div>
                    <p class="muted">Stok tersedia : ${product.stock}</p>

                    <div class="detail__actions">
                        <button type="button" data-action="modal-add" class="btn btn--outline" ${soldOut ? "disabled" : ""}>+ Keranjang</button>
                        <button type="button" data-action="modal-buy" class="btn btn--primary" ${soldOut ? "disabled" : ""}>Beli Sekarang</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const openDetail = async (id) => {
    detailId = id;
    detailQty = 1;
    modal.classList.remove("hidden");
    detailBody.innerHTML = `<div class="modal__loading">Memuat detail...</div>`;

    try {
        const detail = await getPokemonDetail(id);
        if (detailId !== id) return; // pengguna sudah menutup / membuka yang lain
        detailBody.innerHTML = detailTemplate(findProduct(id), detail);
    } catch (error) {
        detailBody.innerHTML = `
            <div class="modal__error">
                <span class="material-symbols-outlined">error</span>
                <p>${error.message}</p>
                <button type="button" data-action="modal-retry" class="btn btn--primary">Coba lagi</button>
            </div>
        `;
    }
};

const closeDetail = () => {
    detailId = null;
    modal.classList.add("hidden");
};

modal.addEventListener("click", (e) => {
    // klik di area gelap (bukan di kotak putih) => tutup
    if (e.target === modal) return closeDetail();

    const button = e.target.closest("[data-action]");
    if (!button) return;

    const product = findProduct(detailId);
    const action = button.dataset.action;

    if (action === "close-modal") closeDetail();
    if (action === "modal-retry") openDetail(detailId);

    if (action === "qty-inc") detailQty = Math.min(product.stock, detailQty + 1);
    if (action === "qty-dec") detailQty = Math.max(1, detailQty - 1);
    if (action.startsWith("qty")) document.querySelector("#detail-qty").textContent = detailQty;

    if (action === "modal-add" || action === "modal-buy") {
        const added = addToCart(product, detailQty);

        if (action === "modal-buy" && added > 0) {
            location.href = "cart.html"; // beli sekarang => langsung ke keranjang
            return;
        }

        showToast(added ? `${added} ${capitalize(product.name)} masuk keranjang` : "Jumlah sudah mentok di batas stok");
        closeDetail();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeDetail();
        closeDrawer();
    }
});

// ============================================
// 7. MULAI
// ============================================

const start = async () => {
    showLoading();

    try {
        catalog = await loadCatalog();
        writeFilters();
        render();
    } catch (error) {
        showError(error);
    }
};

start();
