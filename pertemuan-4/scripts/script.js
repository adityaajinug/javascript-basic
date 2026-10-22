console.log("Meeting 4 : Array and Method !")

const techStack = ["JavaScript", "HTML", "CSS"];
// shift, unshift, pop, push

// menambahkan array di bagian akhir
techStack.push("React");
// menambahkan array di bagian awal
techStack.unshift("Node.js");
// menghapus array di bagian akhir
techStack.pop();
// menghapus array di bagian awal
techStack.shift();
console.log(techStack);

// menampilkan elemen sesuai dengan index dari data array
console.log(techStack[0], techStack[1], techStack[2], techStack[3]);

// forEach, map, filter, find, reduce

// forEach => mencetak value dari array tapi tidak butuh secara hasil
// Map => mencetak value dari array dan butuh secara hasil

techStack.forEach((value, index) => console.log(`index ke-${index} : ${value}`));

techStack.map((value, index) => {
    console.log(`index ke-${index} : ${value}`)
})

const list = document.querySelector("#tech-stack .list");
techStack.map((value, index) => {
    return list.innerHTML += `<li>index ke-${index} : ${value}</li>`
})

const products = [
    {
        name: "Iphone 14",
        price: 20000000,
        stock: 10,
        category: "Smartphone"
    },
    {
        name: "Samsung Galaxy S23",
        price: 15000000,
        stock: 5,
        category: "Smartphone"
    },
    {
        name: "Xiaomi 13",
        price: 10000000,
        stock: 0,
        category: "Smartphone"
    },
    {
        name: "Asus ROG Strix",
        price: 12000000,
        stock: 3,
        category: "Laptop"
    },
    {
        name: "Macbook Pro 2023",
        price: 30000000,
        stock: 2,
        category: "Laptop"
    },
    {
        name: "DAIKIN AC Split",
        price: 5000000,
        stock: 7,
        category: "AC"
    },
    {
        name: "Sharp AC Split",
        price: 4000000,
        stock: 4,
        category: "AC"
    }
]

const elementProduct = document.querySelector("#product .list");
products.map((item, index) => {
    let element = `<li key="${index}"> Nama : ${item.name} - Harga : ${item.price} - Stok : ${item.stock}</li>`;
    return elementProduct.innerHTML += element;
})

const matchProduct = (product) => {
    return product.category === "Smartphone" && product.stock > 0; 
}

// filter, find, some, every, reduce

const filteredProducts = products.filter(matchProduct);
console.log(filteredProducts);

const foundProduct = products.find(matchProduct);
console.log(foundProduct);


const filterProducts2 = products.filter((product) => {
    return product.category === "Laptop" && product.stock > 0;
});
console.log(filterProducts2);

const foundProduct2 = products.find((product) => {
    return product.category === "Smartphone" && product.stock < 5;
});
console.log(foundProduct2);

// Fungsi untuk mengecek beberapa data sesuai dengan kodnisi yang kita tentukan
const isSomeProduct = products.some((product) => {
    return product.category === "AC";
});
console.log(isSomeProduct);

// Fungsi untuk mengecek semua product yang kondisinya kita tentukan
const isEveryProduct = products.every((product) => {
    return product.category === "Smartphone";
});
console.log(isEveryProduct);


const carts = products.reduce((akumulator, product) => {
    return akumulator + (product.price * product.stock);
}, 0);
console.log(carts);

// Maximum and Minimum Price
const maxPrice = products.reduce((akumulator, product) => {
    return Math.max(akumulator, product.price);
}, 0);
console.log(maxPrice);

// Mengurutkan data dari harga terendah ke harga tertinggi dan sebaliknya
const sortedProductsLowestHighest = products.sort((a, b) => {
    return a.price - b.price;
}); 
console.log(sortedProductsLowestHighest);

const sortedProductsHighestLowest = products.sort((a, b) => {
    return b.price - a.price;
});
console.log(sortedProductsHighestLowest);