/*
    result.js : dipakai oleh DUA halaman, success.html dan failed.html.
    Halaman mana yang aktif dibaca dari atribut <body data-page="success"> atau "failed".

    Sumber datanya beda :
      success => localStorage["lastOrder"]    (disimpan halaman pembayaran saat berhasil)
      failed  => localStorage["order"]        (pesanan yang belum dibayar, masih ada)
                 localStorage["lastFailure"]  (alasan gagal)
*/

const page = document.body.dataset.page; // "success" atau "failed"

const order = page === "success" ? loadData("lastOrder", null) : loadData("order", null);
const failure = loadData("lastFailure", null);

const setText = (selector, text) => {
    document.querySelector(selector).textContent = text; // textContent : data pengguna jadi teks biasa, bukan HTML
};

const renderResult = () => {
    setText("#order-number", `#${order.id}`);

    document.querySelector("#items").innerHTML = order.items.map(orderItemTemplate).join("");

    const qty = order.items.reduce((sum, item) => sum + item.qty, 0);
    setText("#subtotal-label", `Subtotal Produk (${qty} ekor)`);
    setText("#subtotal", formatRupiah(order.subtotal));
    setText("#shipping", formatRupiah(order.shipping));
    setText("#total", formatRupiah(order.total));

    // Data penerima diketik pengguna => hanya boleh lewat textContent
    setText("#customer-name", order.customer.name);
    setText("#customer-phone", order.customer.phone);
    setText("#customer-address", order.customer.address);

    if (order.customer.note) {
        setText("#customer-note", `Catatan: ${order.customer.note}`);
        document.querySelector("#customer-note").classList.remove("hidden");
    }

    if (page === "success") {
        setText("#proof-name", order.proofName);
    } else {
        setText("#failure-reason", failure ? failure.reason : "Terjadi kendala saat memproses pembayaran.");
    }
};

if (order === null) {
    document.querySelector("#result-content").classList.add("hidden");
    document.querySelector("#no-data").classList.remove("hidden");
} else {
    renderResult();
}

// ---------- tombol di halaman sukses ----------

if (page === "success") {
    document.querySelector("#btn-copy").addEventListener("click", () => {
        copyText(order.id);
    });

    document.querySelector("#btn-print").addEventListener("click", () => window.print());
}
