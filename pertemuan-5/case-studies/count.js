/*
    Case study : Counter
    CARI   : getElementById (3 element)
    DENGAR : addEventListener("click", ...) di 2 tombol
    UBAH   : textContent pada <span id="count">

    NOTE:
    Cara 1 => angka dibaca dari halaman (textContent adalah TEKS, jadi diubah dulu dengan parseInt)
    Cara 2 => angka disimpan di variabel (state), halaman hanya menampilkan
    Cara 2 lebih disarankan: data jadi sumber kebenaran, halaman cuma cerminan
*/
const btnAdd = document.getElementById("add")
const elNumber = document.getElementById("count");
const btnLessCount = document.getElementById("minus")

// Cara 1 

// const tobeNumber = () => {
//     return parseInt(elNumber.textContent, 10)
// }

// btnAdd.addEventListener("click", () => {
    
//     elNumber.textContent = tobeNumber(elNumber) + 1
    
// })


// btnLessCount.addEventListener("click", () => {
    
//     if(tobeNumber(elNumber) <= 0) {
//         elNumber.textContent = 0
//     } else {
//         elNumber.textContent = tobeNumber(elNumber) - 1;
//     }
// }) 

// Cara 2
let number = 0
btnAdd.addEventListener("click", () => {
    number = number + 1
    elNumber.textContent = number
})

btnLessCount.addEventListener("click", () => {
    if(number > 0) {
        number = number - 1
        elNumber.textContent = number
    }
})