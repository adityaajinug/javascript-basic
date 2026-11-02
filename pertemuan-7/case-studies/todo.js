/*
    Case study : Todo List dengan Web Storage

    Dua jenis data, dua lemari :
      localStorage   => daftar todo (harus awet, jangan hilang)
      sessionStorage => filter yang dipilih dan teks yang belum dikirim (cukup sementara)

    Contoh isi localStorage["todos"] :
      [
        { "id": 1, "title": "Belajar localStorage", "done": true },
        { "id": 2, "title": "Kerjakan PR",           "done": false },
        { "id": 3, "title": "Review pertemuan 6",    "done": false }
      ]
*/

const TODOS_KEY = "todos";
const FILTER_KEY = "todoFilter";
const DRAFT_KEY = "todoDraft";

const form = document.querySelector("#form-todo");
const list = document.querySelector("#todo-list");
const statusText = document.querySelector("#status");
const filterButtons = document.querySelectorAll(".filters button");

// ---------- SIMPAN dan BACA ----------

const saveData = (key, value, storage = localStorage) => {
    storage.setItem(key, JSON.stringify(value));
};

const loadData = (key, fallback, storage = localStorage) => {
    const text = storage.getItem(key);
    if (text === null) return fallback;

    try {
        return JSON.parse(text);
    } catch (error) {
        return fallback; // teks rusak => pakai nilai bawaan
    }
};

// ---------- STATE ----------

// Pertama kali dibuka (storage masih kosong), isi dengan contoh supaya tidak kosong
let todos = loadData(TODOS_KEY, [
    { id: 1, title: "Belajar localStorage", done: true },
    { id: 2, title: "Kerjakan PR", done: false },
    { id: 3, title: "Review pertemuan 6", done: false }
]);
let filter = loadData(FILTER_KEY, "all", sessionStorage);

// ---------- TAMPILKAN ----------

/*
    Teks todo diketik oleh PENGGUNA. Kalau langsung dimasukkan lewat innerHTML,
    pengguna bisa mengetik tag HTML (misal <img onerror=...>) dan tag itu ikut JALAN. Ini disebut XSS.
    Jadi teksnya "dibersihkan" dulu : karakter < > & diganti menjadi kode aman.
*/
const escapeHtml = (text) => {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
};

const getVisibleTodos = () => {
    if (filter === "active") return todos.filter((todo) => !todo.done);
    if (filter === "done") return todos.filter((todo) => todo.done);
    return todos;
};

const renderTodos = () => {
    list.innerHTML = getVisibleTodos().map((todo) => `
        <li class="${todo.done ? "done" : ""}" data-id="${todo.id}">
            <input type="checkbox" ${todo.done ? "checked" : ""}>
            <span>${escapeHtml(todo.title)}</span>
            <button type="button" data-action="delete">Hapus</button>
        </li>
    `).join("");

    const remaining = todos.filter((todo) => !todo.done).length;
    statusText.textContent = `${remaining} tugas belum selesai dari ${todos.length}`;

    filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === filter);
    });
};

// Setiap kali todos berubah : simpan, lalu tampilkan ulang
const commit = () => {
    saveData(TODOS_KEY, todos);
    renderTodos();
};

// ---------- 1. TAMBAH ----------

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = form.elements.title.value.trim();
    if (title === "") {
        statusText.textContent = "Tugas wajib diisi";
        return;
    }

    // id baru = id terbesar + 1 (jangan pakai panjang array, id bisa bentrok setelah ada yang dihapus)
    const newId = todos.length ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

    todos = [...todos, { id: newId, title, done: false }];
    commit();

    form.reset();
    sessionStorage.removeItem(DRAFT_KEY); // draft sudah terkirim, buang
});

// Draft : ketikan yang belum dikirim tidak hilang kalau halaman ter-refresh
form.elements.title.value = loadData(DRAFT_KEY, "", sessionStorage);
form.elements.title.addEventListener("input", (e) => {
    saveData(DRAFT_KEY, e.target.value, sessionStorage);
});

// ---------- 2. CENTANG dan HAPUS (satu listener untuk semua baris) ----------

list.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item) return;
    const id = Number(item.dataset.id);

    if (e.target.matches("input[type=checkbox]")) {
        todos = todos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo);
        commit();
    }

    if (e.target.dataset.action === "delete") {
        todos = todos.filter((todo) => todo.id !== id);
        commit();
    }
});

// ---------- 3. FILTER ----------

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filter = button.dataset.filter;
        saveData(FILTER_KEY, filter, sessionStorage);
        renderTodos();
    });
});

document.querySelector("#btn-clear-done").addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.done);
    commit();
});

renderTodos();

/*
    TUGAS
    1. Tambahkan tombol "Reset" yang mengosongkan semua todo (localStorage.removeItem)
    2. Tambahkan tanggal dibuat (new Date().toLocaleDateString()) pada tiap todo
    3. Simpan pilihan tema terang / gelap di localStorage
*/
