/*
    payment.js : halaman Pembayaran manual

    Alur :
      1. Baca "order" dari localStorage (disimpan oleh halaman keranjang)
      2. Tampilkan total, ringkasan, dan petunjuk transfer
      3. Pengguna memilih file bukti transfer. Kita cek jenis dan ukurannya
      4. Klik kirim => (pura-pura) mengirim ke server => halaman sukses atau gagal

    Ini SIMULASI. File tidak dikirim ke mana-mana. Server sungguhan baru ada di materi lanjutan.
*/

const dropzone = document.querySelector("#dropzone");
const proofInput = document.querySelector("#proof-input");
const fileCard = document.querySelector("#file-card");
const fileError = document.querySelector("#file-error");
const submitButton = document.querySelector("#btn-submit");
const submitText = document.querySelector("#btn-submit-text");

// STATE
const order = loadData("order", null);
let proofFile = null;       // file yang sudah lolos pengecekan, atau null
let previewUrl = null;      // alamat sementara untuk menampilkan gambar pratinjau

// ============================================
// 1. TAMPILKAN PESANAN
// ============================================

const renderOrder = () => {
    document.querySelector("#order-id").textContent = `#${order.id}`;
    document.querySelector("#order-items").innerHTML = order.items.map(orderItemTemplate).join("");
    document.querySelector("#order-subtotal").textContent = formatRupiah(order.subtotal);
    document.querySelector("#order-shipping").textContent = formatRupiah(order.shipping);
    document.querySelector("#order-total").textContent = formatRupiah(order.total);
    document.querySelector("#transfer-amount").textContent = formatRupiah(order.total);
};

// ============================================
// 2. SALIN (nomor rekening dan nominal)
// ============================================

document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", () => copyText(button.dataset.copy));
});

document.querySelector("#btn-copy-amount").addEventListener("click", () => {
    copyText(String(order.total)); // angka polos tanpa "Rp", siap ditempel di aplikasi bank
});

// ============================================
// 3. UNGGAH BUKTI TRANSFER
// ============================================

// Mengembalikan pesan error, atau "" kalau file valid
const validateFile = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
        return "Format berkas harus JPG atau PNG.";
    }
    if (file.size > MAX_PROOF_SIZE) {
        return `Ukuran berkas ${formatSize(file.size)}, melebihi batas 2 MB.`;
    }
    return "";
};

const clearFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl); // lepaskan alamat sementara supaya tidak menumpuk di memori
    previewUrl = null;
    proofFile = null;
    proofInput.value = "";
    fileCard.classList.add("hidden");
    submitButton.disabled = true; // tombol kirim aktif hanya kalau ada file valid
};

const handleFile = (file) => {
    clearFile();
    fileError.classList.add("hidden");
    if (!file) return;

    const message = validateFile(file);

    if (message) {
        document.querySelector("#file-error-text").textContent = message;
        fileError.classList.remove("hidden");
        return;
    }

    proofFile = file;
    previewUrl = URL.createObjectURL(file);
    document.querySelector("#file-preview").src = previewUrl;
    document.querySelector("#file-name").textContent = file.name; // textContent : aman, nama file bisa berisi apa saja
    document.querySelector("#file-size").textContent = `${formatSize(file.size)} • Berkas valid terpilih`;
    fileCard.classList.remove("hidden");
    submitButton.disabled = false;
};

proofInput.addEventListener("change", () => handleFile(proofInput.files[0]));
document.querySelector("#btn-remove-file").addEventListener("click", () => {
    clearFile();
    fileError.classList.add("hidden");
});

// Tarik dan lepas file ke area putus-putus
dropzone.addEventListener("dragover", (e) => {
    e.preventDefault(); // tanpa ini, browser akan membuka filenya dan "drop" tidak jalan
    dropzone.classList.add("is-over");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("is-over"));
dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-over");
    handleFile(e.dataTransfer.files[0]);
});

// ============================================
// 4. KIRIM (async await, sesi 6)
// ============================================

// Meniru server : butuh 1,5 detik, lalu menjawab sukses atau gagal
const sendPayment = async (shouldFail) => {
    await wait(1500);

    if (shouldFail) {
        throw new Error("Bukti pembayaran tidak terbaca oleh sistem. Pastikan foto jelas dan nominal terlihat.");
    }

    return { status: "waiting-verification" };
};

const setLoading = (isLoading) => {
    submitButton.disabled = isLoading || !proofFile;
    submitText.textContent = isLoading ? "Mengirim bukti..." : "Kirim Bukti Pembayaran";
};

submitButton.addEventListener("click", async () => {
    const shouldFail = document.querySelector("#simulate-fail").checked;

    setLoading(true); // keadaan 1 : loading

    try {
        const result = await sendPayment(shouldFail);

        // keadaan 2 : sukses. Simpan hasilnya, kosongkan keranjang dan pesanan
        saveData("lastOrder", { ...order, proofName: proofFile.name, status: result.status });
        localStorage.removeItem("cart");
        localStorage.removeItem("order");
        sessionStorage.removeItem("checkoutDraft");

        location.href = "success.html";
    } catch (error) {
        // keadaan 3 : gagal. Pesanan dan keranjang TETAP ada supaya bisa dicoba lagi
        saveData("lastFailure", { orderId: order.id, reason: error.message });
        location.href = "failed.html";
    } finally {
        setLoading(false);
    }
});

// ============================================
// 5. MULAI
// ============================================

if (order === null) {
    // Tidak ada pesanan (misal halaman dibuka langsung) => arahkan kembali
    document.querySelector("#payment-content").classList.add("hidden");
    document.querySelector("#no-order").classList.remove("hidden");
} else {
    renderOrder();
}
