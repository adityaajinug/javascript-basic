// Materi https://docs.google.com/presentation/d/1qifZ_R1U-wd_jR2pClxbw87dBpa83vQAgabyyXTFAsA/edit?slide=id.h6643c7d49bf0cc12_1_96#slide=id.h6643c7d49bf0cc12_1_96

console.log("Hello, World! This is the second meeting script.");

// Control Flow
// If Else condition, ternary, switch case, loops

// Pak Hendi mengajar di sebuah SMA di Semarang. Sore ini ia baru selesai memeriksa lembar ujian satu kelas, dan besok pagi nilainya harus sudah masuk rapor. Aturan sekolah untuk mengubah nilai angka menjadi predikat:

// Nilai 90 sampai 100 mendapat predikat A.
// Nilai 85 sampai 89 mendapat predikat AB.
// Nilai 70 sampai 84 mendapat predikat B.
// Nilai 60 sampai 69 mendapat predikat C.
// Nilai 55 sampai 59 mendapat predikat D.
// Nilai 0 sampai 54 mendapat predikat E.

// Semua nilai ujian berupa bilangan bulat dari 0 sampai 100. Kalau ada angka di luar itu, pasti Pak Hendi salah ketik, jadi rapor harus menampilkan tulisan Nilai tidak valid.

// Salah satu siswanya, Rina, mendapat nilai 76. Karena malas menghitung satu per satu, Pak Hendi minta tolong kamu membuat program JavaScript yang otomatis menentukan predikatnya.

let nilai = 76;
if(nilai >= 90 && nilai <= 100) {
    console.log("Predikat: A");
} else if(nilai >= 85 && nilai <= 89) {
    console.log("Predikat: AB");
} else if(nilai >= 70 && nilai <= 84) {
    console.log("Predikat: B");
} else if(nilai >= 60 && nilai <= 69) {
    console.log("Predikat: C");
} else if(nilai >= 55 && nilai <= 59) {
    console.log("Predikat: D");
} else if(nilai >= 0 && nilai <= 54) {
    console.log("Predikat: E");
} else {
    console.log("Nilai tidak valid");
}

// ternary operator
let predikat = (nilai >= 90) ? "A" : "E"   
console.log(`Predikat: ${predikat}`);

// switch case
const menu = 1;
switch (menu) {
    case 1:
        console.log("Mie Goreng"); 
        break;
    case 2:
        console.log("Nasi Goreng");
        break;
    default:
        console.log("Menu tidak tersedia");
}

// loops = perulangan for loop, do while, while,
const buah = [
    {
        nama: "Apel",
        warna: "Merah"
    },
    {
        nama: "Jeruk",
        warna: "orange"
    }
];

for (let i = 0; i < buah.length; i++) {
    console.log(`Nama buah: ${buah[i].nama}, Warna: ${buah[i].warna}`);
}

let i = 0;
do {
    console.log(`Nama buah: ${buah[i].nama}, Warna: ${buah[i].warna}`);
    i++;
} while (i < buah.length);

let j = 0;
while (j < buah.length) {
    console.log(`Nama buah: ${buah[j].nama}, Warna: ${buah[j].warna}`);
    j++;
}
// value
for (const item of buah) {
    console.log(`Nama buah: ${item.nama}, Warna: ${item.warna}`);
}
// key
for (const key in buah) {
    console.log(`Nama buah: ${buah[key].nama}, Warna: ${buah[key].warna}`);
}

// fizz buzz, kelipatan 3 = Fizz, kelipatan 5 = Buzz, kelipatan 3 dan 5 = FizzBuzz
for (let k = 1; k <= 20; k++) {
    if(k% 3 === 0 && k%5 === 0) {
        console.log("FizzBuzz");
    } else if(k%3 === 0) {
        console.log("Fizz");
    } else if(k%5 === 0) {
        console.log("Buzz");
    } else {
        console.log("Ga valid")
    }
}

const elementBuah = document.getElementById("buah");
for (const item of buah) {
    const el = `<div id="item">
            <h1>${item.nama}</h1>
            <p>${item.warna}</p>
        </div>
        `;

    elementBuah.innerHTML += el;
}