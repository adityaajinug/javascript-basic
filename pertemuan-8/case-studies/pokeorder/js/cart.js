/*
    cart.js : halaman Keranjang + Checkout

    Alur :
      1. Baca keranjang dari localStorage
      2. Tampilkan item, ubah jumlah, hapus
      3. Isi form penerima, validasi sendiri
      4. Kalau valid : simpan "order" ke localStorage, pindah ke halaman pembayaran
*/

const cartItemsBox = document.querySelector("#cart-items");
const cartContent = document.querySelector("#cart-content");
const emptyCart = document.querySelector("#empty-cart");
const checkoutForm = document.querySelector("#checkout-form");

// STATE : isi keranjang, dibaca dari localStorage
let cart = getCart();

// ============================================
// 1. HITUNG TOTAL
// ============================================

const calcTotals = () => {
    // reduce : menjumlahkan semua (harga x jumlah)
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = cart.length > 0 ? SHIPPING_FEE : 0; // keranjang kosong => tidak ada ongkir
    const qty = cart.reduce((sum, item) => sum + item.qty, 0);

    return { subtotal, shipping, total: subtotal + shipping, qty };
};

// ============================================
// 2. TAMPILKAN
// ============================================

const cartItemTemplate = (item) => {
    const maxed = item.qty >= item.stock;

    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item__info">
                <div class="cart-item__thumb tint type-${item.types[0]}">
                    <small>${formatId(item.id)}</small>
                    <img src="${getSprite(item.id)}" alt="${item.name}">
                </div>
                <div>
                    <div class="cart-item__title">
                        <h3>${item.name}</h3>
                        ${item.types.map((type) => `<span class="badge type-${type}">${type}</span>`).join("")}
                    </div>
                    <p class="cart-item__price">${formatRupiah(item.price)} <small>/ ekor</small></p>
                </div>
            </div>

            <div class="cart-item__actions">
                <div>
                    <div class="stepper">
                        <button type="button" data-action="dec" aria-label="Kurangi ${item.name}">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                        <span>${item.qty}</span>
                        <button type="button" data-action="inc" aria-label="Tambah ${item.name}" ${maxed ? "disabled" : ""}>
                            <span class="material-symbols-outlined">add</span>
                        </button>
                    </div>
                    <p class="cart-item__stock ${maxed ? "cart-item__stock--max" : ""}">
                        ${maxed ? `Maks. ${item.stock} ekor` : `Tersisa ${item.stock - item.qty} ekor`}
                    </p>
                </div>

                <div class="cart-item__total">
                    <strong>${formatRupiah(item.price * item.qty)}</strong>
                    <button type="button" data-action="remove" class="cart-item__remove">
                        <span class="material-symbols-outlined">delete</span>Hapus
                    </button>
                </div>
            </div>
        </div>
    `;
};

const render = () => {
    const { subtotal, shipping, total, qty } = calcTotals();
    const isEmpty = cart.length === 0;

    // keranjang kosong => sembunyikan form dan ringkasan, tampilkan ajakan belanja
    cartContent.classList.toggle("hidden", isEmpty);
    emptyCart.classList.toggle("hidden", !isEmpty);

    cartItemsBox.innerHTML = cart.map(cartItemTemplate).join("");
    document.querySelector("#items-title").textContent = `Daftar Pokémon Pilihan (${cart.length} Jenis)`;

    document.querySelector("#summary-qty").textContent = `${qty} Item`;
    document.querySelector("#summary-subtotal-label").textContent = `Subtotal Produk (${qty} ekor)`;
    document.querySelector("#summary-subtotal").textContent = formatRupiah(subtotal);
    document.querySelector("#summary-shipping").textContent = formatRupiah(shipping);
    document.querySelector("#summary-total").textContent = formatRupiah(total);

    updateCartBadge();
};

// ============================================
// 3. UBAH JUMLAH dan HAPUS (satu listener untuk semua item)
// ============================================

cartItemsBox.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.closest("[data-id]").dataset.id);
    const item = cart.find((cartItem) => cartItem.id === id);

    if (button.dataset.action === "inc" && item.qty < item.stock) item.qty += 1;
    if (button.dataset.action === "dec") item.qty -= 1;
    if (button.dataset.action === "remove") item.qty = 0;

    // jumlah 0 => item dibuang dari keranjang
    cart = cart.filter((cartItem) => cartItem.qty > 0);

    saveCart(cart); // SIMPAN setiap berubah (sesi 7)
    render();
});

// ============================================
// 4. FORM : validasi
// ============================================

// Tiap aturan mengembalikan pesan error. Teks kosong "" artinya valid
const rules = {
    name: (value) => value.trim().length >= 3 ? "" : "Nama minimal 3 huruf",
    phone: (value) => /^08\d{8,11}$/.test(value.trim()) ? "" : "Nomor harus diawali 08 dan 10-13 digit",
    address: (value) => value.trim().length >= 10 ? "" : "Alamat minimal 10 karakter"
};

const showFieldError = (field, message) => {
    const input = checkoutForm.elements[field];
    const errorText = document.querySelector(`[data-error="${field}"]`);

    input.setAttribute("aria-invalid", message !== "");
    errorText.textContent = message;
    errorText.classList.toggle("hidden", message === "");
};

// Mengembalikan true kalau semua field valid
const validateForm = () => {
    let firstInvalid = null;

    Object.keys(rules).forEach((field) => {
        const message = rules[field](checkoutForm.elements[field].value);
        showFieldError(field, message);

        if (message && !firstInvalid) firstInvalid = checkoutForm.elements[field];
    });

    if (firstInvalid) firstInvalid.focus(); // pindahkan kursor ke kotak pertama yang salah
    return firstInvalid === null;
};

// Pesan error hilang begitu pengguna mulai memperbaiki, dan ketikan disimpan sebagai draft
checkoutForm.addEventListener("input", (e) => {
    if (rules[e.target.name]) showFieldError(e.target.name, "");

    saveData("checkoutDraft", {
        name: checkoutForm.elements.name.value,
        phone: checkoutForm.elements.phone.value,
        address: checkoutForm.elements.address.value,
        note: checkoutForm.elements.note.value
    }, sessionStorage);
});

// Pulihkan draft kalau halaman ter-refresh
const draft = loadData("checkoutDraft", {}, sessionStorage);
Object.keys(draft).forEach((field) => {
    checkoutForm.elements[field].value = draft[field];
});

// ============================================
// 5. KIRIM : simpan pesanan, pindah ke pembayaran
// ============================================

checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault(); // tahan reload halaman (sesi 5)

    if (cart.length === 0) return;
    if (!validateForm()) return;

    const { subtotal, shipping, total } = calcTotals();

    // Semua yang dibutuhkan halaman pembayaran dan hasil, dikemas jadi satu object
    const order = {
        id: `PK-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        customer: {
            name: checkoutForm.elements.name.value.trim(),
            phone: checkoutForm.elements.phone.value.trim(),
            address: checkoutForm.elements.address.value.trim(),
            note: checkoutForm.elements.note.value.trim()
        },
        items: cart,
        subtotal,
        shipping,
        total
    };

    saveData("order", order);
    location.href = "payment.html"; // pindah halaman
});

render();
