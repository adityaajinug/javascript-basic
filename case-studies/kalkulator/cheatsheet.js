// =====================================================
// CONTEKAN: Kalkulator versi sederhana
// Hanya referensi. Tulis sendiri versi kamu di script.js.
//
// Ide intinya: layar hanyalah cerminan dari 4 variabel (state).
//   klik tombol -> ubah state -> render()
// =====================================================


// ---------- 1. CARI ELEMEN (pertemuan 5) ----------
const screen = document.querySelector("#screen");
const history = document.querySelector("#history");
const buttons = document.querySelector("#buttons");


// ---------- 2. STATE (pertemuan 1) ----------
// Layar disimpan sebagai TEKS supaya "5." dan "0." bisa disimpan.
let current = "0";     // teks di layar besar
let previous = null;   // angka pertama, disimpan saat operator ditekan
let operator = null;   // "+", "-", "*", "/" atau null
let startNew = false;  // true = angka berikutnya MENGGANTI layar, bukan menempel
let expression = "";   // riwayat di atas layar, terus bertambah, hanya dihapus oleh Ac

// Tampilan operator beda dari nilainya: "/" ditampilkan sebagai "÷"
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };


// ---------- 3. HITUNG (pertemuan 3) ----------
// Function murni: hanya menghitung, tidak menyentuh halaman.
// Mengembalikan null kalau dibagi 0.
const calculate = (a, b, op) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? null : a / b;
};

// Hitung previous <operator> current, hasilnya berupa teks.
// toFixed(10) + Number() => 0.1 + 0.2 jadi 0.3, bukan 0.30000000000000004
const getResult = () => {
    const result = calculate(Number(previous), Number(current), operator);
    return result === null ? "Error" : String(Number(result.toFixed(10)));
};


// ---------- 4. TAMPILKAN ----------
// Satu-satunya tempat yang menyentuh halaman.
const render = () => {
    screen.textContent = current;
    history.textContent = expression;
};


// ---------- 5. DENGAR KLIK (pertemuan 5) ----------
// Event delegation: satu listener di induk untuk semua tombol.
buttons.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    console.log(button)
    if (!button) return;

    const { type, value } = button.dataset; // data-type dan data-value

    console.log("type", type, "value", value)

    // setelah Error, mulai dari awal
    if (current === "Error") {
        current = "0"; previous = null; operator = null; startNew = false;
        expression = "";
    }

    if (type === "number") {
        // angka: ganti layar atau tempel di belakang
        if (startNew || current === "0") {
            current = value;
            startNew = false;
        } else {
            current += value;
        }

    } else if (type === "operator") {
        if (operator !== null && startNew) {
            // operator ditekan dua kali berturut-turut: ganti operator terakhir saja
            expression = expression.slice(0, -1) + symbols[value];
        } else {
            // tambahkan angka di layar + operator ke riwayat (riwayat tidak dihapus)
            expression += (expression ? " " : "") + `${current} ${symbols[value]}`;

            // 2 + 3 lalu x : hitung dulu 2 + 3, hasilnya jadi angka pertama
            if (operator !== null) {
                current = getResult();
            }
        }
        previous = current;
        operator = value;
        startNew = true;

    } else if (value === "equal") {
        // belum ada operator, atau angka kedua belum diketik: abaikan
        if (operator === null || startNew) return;

        expression += ` ${current} =`;
        current = getResult();
        operator = null;
        startNew = true;

    } else if (value === "clear") {
        current = "0"; previous = null; operator = null; startNew = false;
        expression = "";

    } else if (value === "delete") {
        // yang tampil adalah hasil, bukan ketikan: jangan dihapus
        if (startNew) return;
        current = current.slice(0, -1);
        if (current === "" || current === "-") current = "0";

    } else if (value === "dot") {
        if (startNew) {
            current = "0.";
            startNew = false;
        } else if (!current.includes(".")) {
            current += ".";
        }
    }

    render();
});

// Gambar layar pertama kali
render();
