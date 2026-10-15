// Materi https://bit.ly/sesi-1-javascript
// testing (debug)
// console.log(2)
// console.error("test")
// console.count("klik")
// console.warn("warning")

// variable / pendefinisian baik dalam bentuk angka maupun text
// const, let
const angka2 = 1
console.log(angka2)

let angka = 2

angka = 3
angka = 5
console.log(angka)

// Tipe data
// String / text
const firstName = "Aditya"
// number bisa bilangan bulat atau desimal contoh : 20 atau 20.5
const number = 20
// boolean dapat di isi benar atau salah contoh : true atau false
const boolean = true 
const object = [1, 2, 3, 4]
// undefined => tidak di definisikan
let x
// null => sengaja di kosongkan nilai yang di definisikan
let y = null

// pengecekan tipe data
console.log(typeof(firstName))
console.log(typeof(number))
console.log(typeof(boolean))
console.log(typeof(object))
console.log(typeof(x))
console.log(typeof(y))

// Operator => +, - , /, %, *, <, >, <=, >=, ==, != (tanda seru dulu setelah itu sama dengan / =)
const a = 10
const b = 3

console.log(`diketahui angka ${a} dan ${b}`)
console.log("a + b =", a+b)
console.log("a - b =", a-b)
console.log("a x b =", a*b)
console.log("a / b =", a/b)
console.log("a % b =", a%b)
console.log("a < b =", a<b)
console.log("a > b =", a>b)
console.log("a <= b =", a<=b)
console.log("a >= b =", a>=b)
console.log("a ==", a==b)
console.log("a !=", a!=b)

// Kondisi => kasus pengkondisian if / else if / else
if (a > b) {
    console.log('test')
} else if (a < b) {
    console.log('test 2')
} else {
    console.log('tidak sama sekali')
}

// DOM (Document Object Manipulation) => html manipulation
const title = document.getElementById("title")
const title2 = document.querySelector(".hello")
const data = document.getElementById("data")
