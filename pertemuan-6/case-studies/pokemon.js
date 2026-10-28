/*
    Case study : PokeAPI  https://pokeapi.co
    API = "pintu layanan" yang disediakan sebuah server. Kita kirim permintaan, server membalas data.
    PokeAPI gratis, tanpa kunci (API key), dan datanya berbentuk JSON.

    2 alamat (endpoint) yang dipakai :
      GET https://pokeapi.co/api/v2/pokemon?limit=8   => daftar 8 pokemon { name, url }
      GET https://pokeapi.co/api/v2/pokemon/pikachu   => detail 1 pokemon

    Bentuk data detail (sebagian) :
      {
        id: 25,
        name: "pikachu",
        height: 4, weight: 60,
        types: [ { type: { name: "electric" } } ],
        sprites: { front_default: "https://....png" }
      }
*/

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

const statusText = document.querySelector("#status");
const list = document.querySelector("#list");
const result = document.querySelector("#result");
const form = document.querySelector("#form-search");

// ---------- FETCH ----------

/*
    fetch(url) = "tolong ambilkan data dari alamat ini". Hasilnya nomor antrean (Promise).
    Ada 2 kali menunggu :
      1. await fetch(...)      => menunggu server MEMBALAS (datang berupa Response)
      2. await response.json() => menunggu isi balasan selesai dibaca jadi object

    JEBAKAN : fetch hanya gagal kalau internet putus.
    Kalau server membalas "tidak ketemu" (404) atau "server rusak" (500), fetch tetap dianggap berhasil.
    Makanya kita cek sendiri dengan response.ok (true = sukses, false = ada masalah)
*/
const getPokemon = async (nameOrId) => {
    const response = await fetch(`${BASE_URL}/${nameOrId}`);

    if (!response.ok) {
        // throw = "lempar error", langsung loncat ke catch milik yang memanggil
        throw new Error(`Pokemon "${nameOrId}" tidak ditemukan (${response.status})`);
    }

    return response.json();
};

const getPokemonList = async (limit) => {
    const response = await fetch(`${BASE_URL}?limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Gagal mengambil daftar (${response.status})`);
    }

    const data = await response.json();
    return data.results; // [{ name, url }, ...]
};

/*
    Versi .then dari getPokemon (hasilnya sama) :

    const getPokemon = (nameOrId) => {
        return fetch(`${BASE_URL}/${nameOrId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Pokemon tidak ditemukan");
                return response.json();
            });
    };

    NOTE: return di dalam .then dipakai untuk menyambung ke .then berikutnya (disebut chaining),
    seperti estafet : hasil tahap pertama dioper ke tahap kedua
*/

// ---------- TAMPILKAN ----------

// Satu kartu = satu potong HTML (template string). Nilai dari data disisipkan dengan ${...}
// types berupa array, jadi map dulu untuk mengambil namanya saja, lalu join jadi satu teks
const renderCard = (pokemon) => {
    const types = pokemon.types.map((item) => item.type.name).join(", ");

    return `
        <li class="card">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <h3>#${pokemon.id} ${pokemon.name}</h3>
            <small>${types}</small>
            <small>${pokemon.height / 10} m, ${pokemon.weight / 10} kg</small>
        </li>
    `;
    // NOTE: API memberi tinggi dalam desimeter dan berat dalam hektogram, jadi dibagi 10
};

// Kumpulan kartu dijadikan satu teks lalu dimasukkan ke halaman sekali saja
const renderCards = (container, pokemons) => {
    container.innerHTML = pokemons.map(renderCard).join("");
};

// NOTE: data ini datang dari PokeAPI (tepercaya), jadi aman dimasukkan lewat innerHTML.
// Tapi teks yang diketik pengguna (misal hasil pencarian di bawah) hanya dipakai lewat textContent.

const setStatus = (text, isError = false) => {
    statusText.textContent = text;
    statusText.classList.toggle("error", isError);
};

// ---------- 1. Daftar 8 pokemon pertama ----------

const loadList = async () => {
    setStatus("Memuat daftar...");

    try {
        const items = await getPokemonList(8);

        // Detail tiap pokemon tidak saling bergantung, jadi dipesan SEKALIGUS dengan Promise.all
        // items.map(...) membuat 8 nomor antrean, Promise.all menunggu kedelapannya selesai
        const pokemons = await Promise.all(items.map((item) => getPokemon(item.name)));

        renderCards(list, pokemons);
        setStatus("");
    } catch (error) {
        setStatus(error.message, true);
    }
};

// ---------- 2. Cari pokemon ----------

// async di depan function bawaan event juga boleh, supaya di dalamnya bisa memakai await
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // tahan reload halaman (pertemuan 5)

    // API memakai huruf kecil semua, jadi samakan dulu
    const name = form.elements.name.value.trim().toLowerCase();
    if (name === "") {
        setStatus("Nama wajib diisi", true);
        return;
    }

    setStatus(`Mencari ${name}...`); // keadaan 1 : loading

    try {
        const pokemon = await getPokemon(name);
        renderCards(result, [pokemon]); // keadaan 2 : sukses
        setStatus("");
    } catch (error) {
        result.innerHTML = "";
        setStatus(error.message, true); // keadaan 3 : error. Coba ketik "abc" => 404
    }
});

loadList();

/*
    TUGAS
    1. Tambahkan tombol "Load more" yang memuat 8 pokemon berikutnya (tambah parameter offset=8)
    2. Tampilkan jumlah abilities pokemon (pokemon.abilities.length)
    3. Ubah getPokemonList menjadi versi .then
*/
