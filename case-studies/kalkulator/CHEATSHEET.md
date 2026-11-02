# Tutorial: Membuat Kalkulator dengan JavaScript

Di tutorial ini kita membuat kalkulator yang bisa menjumlah, mengurang, mengali, membagi,
menghapus, dan menampilkan riwayat. HTML dan CSS-nya sudah jadi. Tugas kita hanya
menulis `script.js`.

Kita mengerjakannya **sedikit demi sedikit**. Setelah tiap langkah, kamu bisa langsung
mencoba hasilnya di browser. Kalau ada yang macet, lihat `cheatsheet.js` sebagai contoh
jadinya.

**Materi yang dipakai:** variabel dan `if / else` (pertemuan 1-2), function dan arrow
function (3), DOM dan event (5).

---

## Sebelum mulai

1. Buka `index.html` di browser, lalu tekan `F12` untuk membuka Console.
2. Buka `script.js` di editor. Semua kode di bawah kita tulis di file ini.
3. Setiap selesai satu langkah, simpan file dan refresh browser.

### Cara berpikir kalkulator

Kalkulator sebenarnya hanya **mengingat beberapa hal**: angka di layar, angka
sebelumnya, dan operator yang dipilih. Setiap tombol hanya mengubah ingatan itu, lalu
layar digambar ulang.

```
klik tombol  ->  ubah ingatan (variabel)  ->  gambar ulang layar
```

### Kenalan dengan tombolnya

Setiap tombol di HTML punya dua label tersembunyi:

```html
<button data-type="number" data-value="7">7</button>
<button data-type="operator" data-value="/">÷</button>
<button data-type="action" data-value="equal">=</button>
```

- `data-type`: jenis tombol (`number`, `operator`, atau `action`).
- `data-value`: nilai yang dipakai logika. Tombol `÷` bernilai `"/"`.

| Tombol  | data-type  | data-value              |
| ------- | ---------- | ----------------------- |
| 0-9     | `number`   | `"0"` ... `"9"`         |
| ÷ × − + | `operator` | `"/"` `"*"` `"-"` `"+"` |
| Ac      | `action`   | `"clear"`               |
| ⌫       | `action`   | `"delete"`              |
| .       | `action`   | `"dot"`                 |
| =       | `action`   | `"equal"`               |

---

## Langkah 1: Mengambil elemen halaman

Sebelum bisa mengubah layar, kita perlu "memegang" elemennya dulu.

```js
const screen = document.querySelector("#screen");
const history = document.querySelector("#history");
const buttons = document.querySelector("#buttons");
```

- `screen` adalah angka besar di layar.
- `history` adalah teks kecil di atasnya (misalnya `7 + 8 =`).
- `buttons` adalah kotak yang membungkus semua tombol.

**Coba:** tambahkan `console.log(screen)`. Di Console harus muncul elemen `<output>`.
Setelah itu hapus `console.log`-nya.

---

## Langkah 2: Menyiapkan "ingatan" kalkulator

Sekarang kita buat variabel untuk menyimpan semua yang perlu diingat.

```js
let current = "0";     // teks di layar besar
let previous = null;   // angka pertama, disimpan saat operator ditekan
let operator = null;   // "+", "-", "*", "/" atau null
let startNew = false;  // true = angka berikutnya MENGGANTI layar, bukan menempel
let expression = "";   // riwayat di atas layar, terus bertambah, hanya dihapus oleh Ac

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };
```

Dua hal yang perlu dipahami:

- **`current` berupa teks (`"0"`), bukan angka (`0`).** Alasannya, angka `5.` (titik
  belum diikuti angka) tidak bisa disimpan sebagai angka. Dengan teks, `"5."` aman.
- **`startNew` itu apa?** Bayangkan kamu menghitung `7 + 8`. Setelah menekan `+`,
  ketikan berikutnya (`8`) harus *mengganti* layar, bukan menjadi `78`. Variabel ini
  menandai hal itu.

- **`expression`** menyimpan riwayat yang tampil di atas layar (misalnya `7 + 8 =`).
  Isinya hanya ditambah, dan baru dikosongkan saat tombol `Ac` ditekan.

`symbols` dipakai nanti untuk riwayat, supaya `"/"` tampil sebagai `÷`.

---

## Langkah 3: Menggambar layar

Kita buat satu function yang tugasnya hanya menampilkan isi `current` ke layar.

```js
const render = () => {
    screen.textContent = current;
    history.textContent = expression;
};

render();
```

Baris `render();` di bawah dipanggil sekali supaya layar langsung menampilkan `0`.
Riwayat (`expression`) ikut digambar di sini, jadi nanti kita cukup mengubah variabelnya.

**Coba:** layar harus tampil `0`. Ubah `current` jadi `"123"`, refresh, layar ikut
berubah. Kembalikan ke `"0"`.

> Ini ide terpenting tutorial ini: **layar hanyalah cerminan dari variabel.** Kita tidak
> pernah mengubah layar langsung. Kita ubah variabelnya, lalu panggil `render()`.

---

## Langkah 4: Mendengar klik tombol

Ada 20 tombol. Daripada memasang pendengar di tiap tombol, kita pasang **satu** di
kotak pembungkusnya (`buttons`). Teknik ini disebut *event delegation*.

```js
buttons.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const { type, value } = button.dataset;
    console.log("type", type, "value", value);

    render();
});
```

Baris per baris:

- `e.target` adalah elemen yang diklik. `closest("button")` mencari tombol terdekat dari
  situ. Kalau yang diklik ternyata celah di antara tombol, hasilnya `null`.
- `if (!button) return;`: kalau bukan tombol, berhenti.
- `button.dataset` membaca `data-type` dan `data-value` dari HTML.
- `render()` di akhir: setiap selesai klik, layar digambar ulang.

**Coba:** klik beberapa tombol. Di Console harus muncul `type number value 7` dan
seterusnya.

Mulai langkah berikutnya, setiap tombol punya "cabang" sendiri di dalam listener ini,
ditulis di antara `console.log` dan `render()`:

```js
if (type === "number") {
    ...
} else if (value === "clear") {
    ...
}
```

Tiap langkah di bawah menambah satu cabang. Biarkan `console.log` selama belajar,
hapus nanti kalau sudah selesai.

---

## Langkah 5: Tombol angka

Saat angka ditekan, ada dua kemungkinan: **mengganti** layar atau **menempel** di
belakangnya.

```js
if (type === "number") {
    if (startNew || current === "0") {
        current = value;
        startNew = false;
    } else {
        current += value;
    }
}
```

- Layar masih `"0"`: ganti. Kalau tidak, mengetik `0` lalu `7` menghasilkan `07`.
- `startNew` aktif: ganti. Ini angka pertama setelah operator.
- Selain itu: tempel. `"1" + "2"` menjadi `"12"` (karena teks, bukan dijumlah).

**Coba:** tekan `1 2 3`, layar jadi `123`. Refresh, lalu tekan `0 7`, layar harus `7`.

---

## Langkah 6: Tombol Ac (clear)

Tombol Ac mengembalikan semuanya ke keadaan awal. Tambahkan cabang baru:

```js
} else if (value === "clear") {
    current = "0"; previous = null; operator = null; startNew = false;
    expression = "";
}
```

Isinya sama persis dengan nilai awal di Langkah 2. Hanya tombol inilah (selain reset
setelah Error di Langkah 14) yang mengosongkan riwayat.

**Coba:** ketik `123`, tekan `Ac`, layar kembali `0`.

---

## Langkah 7: Tombol ⌫ (hapus satu angka)

```js
} else if (value === "delete") {
    if (startNew) return;
    current = current.slice(0, -1);
    if (current === "" || current === "-") current = "0";
}
```

- `slice(0, -1)` mengambil teks dari awal sampai satu karakter sebelum akhir. Artinya
  membuang karakter terakhir.
- Kalau hasilnya kosong, kembali ke `"0"`.
- `if (startNew) return;`: kalau yang tampil adalah hasil hitungan (bukan ketikan kita),
  tombol hapus tidak melakukan apa-apa.

**Coba:** ketik `123`, tekan `⌫` dua kali jadi `1`, sekali lagi jadi `0`.

---

## Langkah 8: Tombol titik

```js
} else if (value === "dot") {
    if (startNew) {
        current = "0.";
        startNew = false;
    } else if (!current.includes(".")) {
        current += ".";
    }
}
```

- Satu angka hanya boleh punya satu titik. `current.includes(".")` mengecek apakah sudah
  ada. Tanda `!` di depannya berarti "kalau belum ada".
- Kalau titik ditekan tepat setelah operator, angka baru dimulai dari `"0."`.

**Coba:** tekan `. . 5`, layar harus `0.5` (titik kedua diabaikan).

---

## Langkah 9: Function untuk menghitung

Sekarang masuk ke bagian hitung-menghitung. Letakkan function ini **di atas**
listener (misalnya setelah `symbols`).

```js
const calculate = (a, b, op) => {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? null : a / b;
};
```

Function ini murni: dikasih dua angka dan satu operator, dia mengembalikan hasilnya. Dia
tidak menyentuh layar sama sekali. Untuk pembagian dengan nol, dia mengembalikan `null`
sebagai tanda "gagal".

**Coba di Console** (setelah refresh): ketik `calculate(6, 2, "/")` hasilnya `3`, dan
`calculate(6, 0, "/")` hasilnya `null`.

---

## Langkah 10: Mengubah hasil jadi teks yang rapi

Di bawah `calculate`, tambahkan:

```js
const getResult = () => {
    const result = calculate(Number(previous), Number(current), operator);
    return result === null ? "Error" : String(Number(result.toFixed(10)));
};
```

Ada tiga masalah kecil yang diselesaikan di sini:

1. **`Number(previous)`**: `previous` dan `current` itu teks, jadi diubah ke angka dulu.
   Kalau tidak, `"7" + "8"` jadi `"78"`.
2. **`result.toFixed(10)` lalu `Number(...)`**: komputer menghitung `0.1 + 0.2` sebagai
   `0.30000000000000004`. `toFixed(10)` membulatkan ke 10 desimal, `Number()` membuang
   nol di belakang. Hasilnya `0.3`.
3. **`String(...)`**: hasil dikembalikan ke teks supaya cocok dengan `current`.

Kalau `calculate` mengembalikan `null`, hasilnya teks `"Error"`.

---

## Langkah 11: Tombol operator

Waktu operator ditekan, kalkulator harus **mengingat** angka yang sedang tampil dan
operator mana yang dipilih.

```js
} else if (type === "operator") {
    previous = current;
    operator = value;
    startNew = true;
}
```

- `previous = current`: angka pertama disimpan.
- `operator = value`: ingat operatornya.
- `startNew = true`: angka berikutnya akan mengganti layar.

**Coba:** tekan `7 +`. Di Console ketik `previous` (hasilnya `"7"`) dan `operator`
(hasilnya `"+"`). Tekan `8`, layar jadi `8`.

---

## Langkah 12: Tombol =

Akhirnya, tombol yang menjalankan perhitungan.

```js
} else if (value === "equal") {
    if (operator === null || startNew) return;

    current = getResult();
    operator = null;
    startNew = true;
}
```

- `if (operator === null || startNew) return;`: kalau belum memilih operator, atau angka
  kedua belum diketik (misalnya `7 + =`), tidak ada yang bisa dihitung. Berhenti.
- `current = getResult()`: hitung, tampilkan hasilnya.
- `operator = null`: perhitungan ini selesai.
- `startNew = true`: ketikan berikutnya memulai hitungan baru.

**Coba:**
- `7 + 8 =` hasilnya `15`.
- `0.1 + 0.2 =` hasilnya `0.3`.
- `6 ÷ 0 =` hasilnya `Error`.

---

## Langkah 13: Operator berantai

Coba `2 + 3 × 4 =`. Sekarang hasilnya salah, karena ketika `×` ditekan, kalkulator
melupakan `2 + 3`. Kita perbaiki cabang operator dari Langkah 11, tambahkan **dua
baris** paling atas:

```js
} else if (type === "operator") {
    if (operator !== null && !startNew) {
        current = getResult();
    }
    previous = current;
    operator = value;
    startNew = true;
}
```

Artinya: "kalau sudah ada operator dan angka kedua sudah diketik, hitung dulu hasilnya".
Pada `2 + 3 ×`, saat `×` ditekan, `2 + 3` dihitung jadi `5`, lalu `5` menjadi angka
pertama untuk `×`.

**Coba:** `2 + 3 × 4 =` hasilnya `20`. Kalkulator ini menghitung berurutan dari kiri,
seperti kalkulator saku. Mengikuti urutan matematika (hasil `14`) perlu teknik lain.

---

## Langkah 14: Memulai ulang setelah Error

Setelah `6 ÷ 0 =`, layar menampilkan teks `Error`. Kalau lanjut menekan operator,
kalkulator mencoba menghitung `Number("Error")`, yaitu `NaN`. Kita cegah dengan
menambah blok ini **sebelum** rangkaian `if (type === "number")`:

```js
if (current === "Error") {
    current = "0"; previous = null; operator = null; startNew = false;
    expression = "";
}
```

Artinya: setelah Error, tombol apa pun menghapus semuanya dulu, baru diproses seperti
biasa.

**Coba:** `6 ÷ 0 =` lalu tekan `5`. Layar harus `5`.

---

## Langkah 15: Riwayat di atas layar

Terakhir, kita isi teks kecil di atas layar. Aturannya: **riwayat hanya bertambah,
tidak pernah diganti, dan baru hilang kalau menekan `Ac`.** Jadi `7 + 8 =` tidak
terhapus ketika kita lanjut menekan `+`, tapi terus memanjang.

Variabel `expression` sudah kita buat di Langkah 2 dan `render()` sudah
menampilkannya. Sekarang kita tinggal menambah isinya.

**Di cabang operator**, ganti isinya dengan versi ini (menggantikan Langkah 11 dan 13):

```js
} else if (type === "operator") {
    if (operator !== null && startNew) {
        // operator ditekan dua kali berturut-turut: ganti operator terakhir saja
        expression = expression.slice(0, -1) + symbols[value];
    } else {
        // tambahkan angka di layar + operator ke riwayat
        expression += (expression ? " " : "") + `${current} ${symbols[value]}`;

        // 2 + 3 lalu x : hitung dulu 2 + 3, hasilnya jadi angka pertama
        if (operator !== null) {
            current = getResult();
        }
    }
    previous = current;
    operator = value;
    startNew = true;
}
```

**Di cabang equal**, tepat sebelum `current = getResult();`:

```js
expression += ` ${current} =`;
```

Penjelasan:

- `expression += ...` artinya **menambah** di belakang riwayat, bukan menimpa. Itu yang
  membuat riwayat tidak terhapus.
- Template string (backtick) menyisipkan variabel dengan `${...}`. `symbols["/"]`
  menghasilkan `÷`.
- `(expression ? " " : "")` menambahkan spasi pemisah, kecuali riwayat masih kosong.
- Riwayat ditulis **sebelum** `current` diganti hasil hitungan. Kalau urutannya
  terbalik, yang masuk riwayat adalah hasilnya, bukan angka yang kita ketik. Itu
  sebabnya `expression += ...` ada di atas `current = getResult()`.
- Kalau operator ditekan dua kali (`7 + ×`), kita ganti karakter terakhir saja dengan
  `slice(0, -1)`, supaya riwayat tidak jadi `7 + ×`.

**Coba:**

| Tekan            | Riwayat di atas layar     | Layar |
| ---------------- | ------------------------- | ----- |
| `7 + 8 =`        | `7 + 8 =`                 | `15`  |
| lanjut `+ 2 =`   | `7 + 8 = 15 + 2 =`        | `17`  |
| `2 + 3 × 4 =`    | `2 + 3 × 4 =`             | `20`  |
| `7 + × 2 =`      | `7 × 2 =`                 | `14`  |
| `Ac`             | (kosong)                  | `0`   |

Riwayat tetap ada sampai `Ac` ditekan. Kalau mau riwayat dikosongkan otomatis setiap
mulai hitungan baru, tambahkan `expression = ""` di cabang angka saat `startNew` aktif
dan `operator === null`.

---

## Selesai! Cek semuanya

| Tekan            | Harus tampil                         |
| ---------------- | ------------------------------------ |
| `1 2 3`          | `123`                                |
| `0 7`            | `7`                                  |
| `1 2 3 ⌫`        | `12`                                 |
| `. . 5`          | `0.5`                                |
| `7 + 8 =`        | `15`, riwayat `7 + 8 =`              |
| lanjut `+ 2 =`   | `17`, riwayat `7 + 8 = 15 + 2 =`     |
| `0.1 + 0.2 =`    | `0.3`                                |
| `2 + 3 × 4 =`    | `20`                                 |
| `6 ÷ 0 =`        | `Error`, lalu `5` jadi `5`           |
| `7 + =`          | tidak berubah                        |
| `Ac`             | `0`, riwayat kosong                  |

Kalau semua cocok, hapus `console.log` yang tersisa. Kalkulatormu sudah jadi.

---

## Kalau ada yang tidak jalan

| Masalah                            | Penyebab dan solusi                                   |
| ---------------------------------- | ----------------------------------------------------- |
| Tidak ada tombol yang bereaksi     | Buka Console, cari tulisan merah. Cek juga `script.js` sudah terhubung di HTML |
| Muncul `53`, bukan `8`             | Menjumlah teks. Ubah dengan `Number()` dulu           |
| Layar `07`                         | Lupa mengecek `current === "0"` (Langkah 5)           |
| Titik muncul dua kali              | Lupa `includes(".")` (Langkah 8)                      |
| Muncul `0.30000000000000004`       | Lupa `toFixed(10)` (Langkah 10)                       |
| Muncul `NaN`                       | Operator ditekan setelah Error (Langkah 14)           |
| `=` tidak bereaksi setelah `7 +`   | Memang disengaja, angka kedua belum diketik           |

## Tantangan lanjutan

- Tambah tombol `%` (bagi layar dengan 100) dan `±` (tukar tanda).
- Tambah dukungan keyboard dengan `document.addEventListener("keydown", ...)`.
- Buat `2 + 3 × 4` menghasilkan `14` (ikuti urutan operasi matematika).
