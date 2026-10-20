console.log("Hello, Meeting 3 With Javascript!");

// Functions and scope
function sapa(nama) {
    return "Hello, " + nama + "!";
}

console.log(sapa("Adit"));

const sapa2 = (nama) => {
    return "Hello, " + nama + "!";
}

const sapa3 = (nama) => "Hello, " + nama + "!";

const sapa4 = (firstName, lastName) => {
    return `Hello, ${firstName} ${lastName}!`;
};

console.log(sapa4("Adit", "Nugro"));

const add = (a, b = 6) => {
    return a + b;
}

console.log(add(4, 1))

let totalKeseluruhan;

const penjumlahan = (a, b) => {
    let total;
    total = a + b;
    return total;
}

const pengurangan = (a, b) => {
    let total;
    total = a - b;
    return total;
}
const pembagian = (a, b) => {
    let total;
    if (a == 0) {
        total = null;
    } else {
        total = a / b;
    }
    return total;
}

const perhitungan = (a, b, c) => {
    let total;
    if(a == 0) {
        total = null
    } else {
        total = penjumlahan(a, b) / c;
    }

    return total;
}

totalKeseluruhan = penjumlahan(5, 3) + pengurangan(10, 4);
console.log(totalKeseluruhan);

console.log(pembagian(4, 2));

console.log(perhitungan(5, 3, 2));