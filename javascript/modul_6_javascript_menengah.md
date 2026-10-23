# Modul 6 — JavaScript Menengah: Interaktivitas Aplikasi Data Siswa

**Mata pelajaran:** Pemrograman Web — RPL
**Alat:** XAMPP, VS Code, browser dengan DevTools (`F12` → tab **Console** dan **Network**)
**Studi kasus:** Proyek `crud_siswa` dari [Modul 4 — PHP & MySQL](../php/modul_4_php_mysql.md) yang sudah diberi gaya di [Modul 5 — CSS Menengah](../css/modul_5_css_menengah.md)
**Prasyarat:** JavaScript dasar (variabel, `if`, perulangan, fungsi, array), Modul 4 dan Modul 5 selesai

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan peran JavaScript di sisi **klien** dibandingkan PHP di sisi **server**.
2. Memilih elemen **DOM** dan mengubah isi, kelas, serta atributnya dengan aman.
3. Menangani **event** (`click`, `submit`, `input`) dengan `addEventListener` dan *event delegation*.
4. Membuat **validasi form** di browser yang selaras dengan `validasiSiswa()` di PHP.
5. Menyimpan preferensi pengguna dengan **`localStorage`** (tema gelap).
6. Mengambil data dari server memakai **`fetch`**, **`async/await`**, dan **JSON**.
7. Menerapkan **debounce**, pengurutan tabel, dan perhitungan ringkasan dengan **array method** (`map`, `filter`, `reduce`, `sort`).

---

## 2. Konsep Dasar

### 2.1 Siapa mengerjakan apa?

```
   BROWSER (klien)                                   SERVER (XAMPP)
 ┌──────────────────────────┐   1. request      ┌──────────────────────────┐
 │ HTML  → struktur         │ ────────────────▶ │ PHP   → logika, validasi │
 │ CSS   → tampilan         │                   │ MySQL → simpan data      │
 │ JS    → interaksi        │ ◀──────────────── │                          │
 │         (tanpa reload)   │   2. HTML / JSON  │                          │
 └──────────────────────────┘                   └──────────────────────────┘
          ▲                                                  ▲
          │ bisa dimatikan/diubah pengguna                   │ tidak bisa diubah pengguna
          └── validasi JS = KENYAMANAN                       └── validasi PHP = KEAMANAN
```

> **Aturan emas:** JavaScript membuat aplikasi lebih nyaman, tetapi **bukan pengaman**. Pengguna bisa mematikan JavaScript atau mengirim request langsung. Semua validasi di PHP (`validasiSiswa()`, prepared statement, `e()`) **tetap wajib**.

### 2.2 Istilah penting

| Istilah            | Arti singkat                                                       | Contoh                                       |
| ------------------ | ------------------------------------------------------------------ | -------------------------------------------- |
| DOM                | Struktur pohon halaman HTML yang bisa diakses JavaScript           | `document.querySelector('#nama')`            |
| Event              | Kejadian yang dialami elemen                                       | `click`, `submit`, `input`                   |
| Event listener     | Fungsi yang dijalankan ketika event terjadi                        | `form.addEventListener('submit', ...)`       |
| Event delegation   | Satu listener di induk untuk menangani banyak anak                 | Listener di `document` untuk semua tombol tutup |
| `localStorage`     | Penyimpanan kecil di browser yang tidak hilang saat ditutup        | `localStorage.setItem('tema', 'dark')`       |
| JSON               | Format teks untuk bertukar data                                    | `[{"id_siswa":1,"nama":"Andi"}]`             |
| `fetch`            | Fungsi untuk meminta data ke server tanpa reload                   | `fetch('api_siswa.php?q=an')`                |
| Promise            | "Janji" hasil yang datang belakangan                               | Hasil `fetch()`                              |
| `async/await`      | Cara menulis kode Promise agar terbaca seperti kode biasa          | `const res = await fetch(url);`              |
| Debounce           | Menunda aksi sampai pengguna berhenti mengetik sebentar            | Cari setelah 300 ms tanpa ketikan            |

### 2.3 Pohon DOM halaman `index.php`

```
 document
 └── html  (data-theme="dark")
     ├── head
     └── body
         ├── header.topbar
         │   └── nav.topbar__nav
         │       └── button#tombol-tema
         ├── main.container
         │   ├── h1
         │   ├── div.pesan.sukses          ← disembunyikan otomatis
         │   ├── div.toolbar
         │   ├── form.filters
         │   │   └── div.cari-wrap
         │   │       ├── input#q           ← pencarian langsung
         │   │       └── ul#saran-siswa    ← diisi dari fetch
         │   └── div.tabel-wrap
         │       └── table#tabel-siswa
         │           └── tbody > tr > td > form.form-hapus  ← konfirmasi dialog
         └── dialog#dialog-hapus
```

### 2.4 Memilih elemen

| Cara                                  | Hasil                             | Catatan                                |
| ------------------------------------- | --------------------------------- | -------------------------------------- |
| `document.querySelector('#nama')`     | Elemen **pertama** yang cocok     | Mengembalikan `null` jika tidak ada    |
| `document.querySelectorAll('.pesan')` | `NodeList` **semua** yang cocok   | Bisa di-`forEach`                      |
| `el.closest('form')`                  | Induk terdekat yang cocok         | Berguna di event delegation            |
| `el.dataset.nama`                     | Isi atribut `data-nama`           | `data-error-untuk` → `dataset.errorUntuk` |

### 2.5 Mengubah elemen

| Kebutuhan                   | Kode                                        | Aman dari XSS? |
| --------------------------- | ------------------------------------------- | -------------- |
| Mengubah teks               | `el.textContent = 'Halo';`                  | ✅ Ya          |
| Mengubah HTML               | `el.innerHTML = '<b>Halo</b>';`             | ⚠️ Tidak, jika berisi data pengguna |
| Menambah/menghapus kelas    | `el.classList.add('hilang')` / `.remove()` / `.toggle()` | ✅ |
| Mengubah atribut            | `el.setAttribute('aria-sort', 'ascending')` | ✅             |
| Membuat elemen baru         | `document.createElement('li')`              | ✅             |

> **Sama seperti `e()` di PHP**, gunakan `textContent` untuk menampilkan data dari pengguna/database. Jangan menyusun `innerHTML` dari data, karena nama seperti `<img src=x onerror=alert(1)>` akan dieksekusi.

---

## 3. Studi Kasus

Fitur yang akan ditambahkan ke `crud_siswa`:

| No | Fitur                              | Halaman             | Konsep JS                                |
| -- | ---------------------------------- | ------------------- | ---------------------------------------- |
| 1  | Tombol tema gelap/terang           | Semua               | `classList`, `dataset`, `localStorage`   |
| 2  | Pesan sukses hilang otomatis       | `index.php`         | `setTimeout`, transisi CSS               |
| 3  | Dialog konfirmasi hapus            | `index.php`         | Event `submit`, `preventDefault`, `<dialog>` |
| 4  | Validasi form + penghitung karakter| `tambah.php`, `edit.php` | Event `input`/`submit`, regex       |
| 5  | Validasi rentang filter            | `index.php`, `detail.php` | Perbandingan nilai               |
| 6  | Pencarian langsung (live search)   | `index.php`         | `fetch`, `async/await`, JSON, debounce   |
| 7  | Urutkan tabel rapor + ringkasan    | `detail.php`        | `Array.from`, `sort`, `reduce`           |

**Alur kerja keseluruhan:**

```
 Halaman dimuat
      │
      ▼
 app.js dijalankan ──▶ setiap fitur memeriksa: "apakah elemen saya ada di halaman ini?"
      │                         │ ya                         │ tidak
      │                         ▼                            ▼
      │                  pasang event listener          lewati (tidak error)
      ▼
 Menunggu aksi pengguna (klik, ketik, kirim form) ──▶ fungsi listener berjalan
```

---

## 4. Persiapan

1. Selesaikan perubahan HTML di **Modul 5** (topbar, `.form-siswa`, `data-label`, `.form-hapus`, `<dialog>`).
2. Buat file baru **`app.js`** di folder `crud_siswa`.
3. Pasang `app.js` di `footer.php` **sebelum** `</body>`:

```php
</main>

<dialog class="dialog" id="dialog-hapus" aria-labelledby="judul-dialog-hapus">
    <h2 id="judul-dialog-hapus">Hapus data siswa?</h2>
    <p>Data <strong data-dialog-nama></strong> dan seluruh nilainya akan dihapus permanen.</p>
    <div class="dialog__aksi">
        <button type="button" class="btn btn-abu" value="batal">Batal</button>
        <button type="button" class="btn btn-hapus" value="hapus">Ya, hapus</button>
    </div>
</dialog>

<script src="app.js"></script>
</body>
</html>
```

4. Tes bahwa file terhubung. Tulis di `app.js`:

```js
console.log('app.js berhasil dimuat');
```

Buka `http://localhost/crud_siswa/`, tekan `F12` → **Console**. Jika pesan muncul, lanjutkan. Hapus baris tersebut setelahnya.

> **Mengapa di akhir `body`?** Browser membaca HTML dari atas ke bawah. Jika script diletakkan di `<head>` tanpa `defer`, elemen seperti `#nama` belum ada saat script berjalan sehingga `querySelector` menghasilkan `null`.

**Struktur `app.js` yang akan dibuat:**

```
 app.js
 ├── 'use strict'
 ├── Utilitas kecil: $(), $$(), debounce()
 ├── 1. initTema()
 ├── 2. initPesan()
 ├── 3. initKonfirmasiHapus()
 ├── 4. initValidasiSiswa()
 ├── 5. initValidasiRentang()
 ├── 6. initPencarianLangsung()
 ├── 7. initTabelRapor()
 └── Pemanggilan semua init*()
```

---

## 5. Fondasi: Utilitas dan Pola `init`

```js
'use strict'; // mode ketat: kesalahan umum langsung dilaporkan sebagai error

// Singkatan agar kode lebih pendek
const $ = (selector, induk = document) => induk.querySelector(selector);
const $$ = (selector, induk = document) => Array.from(induk.querySelectorAll(selector));

// Menunda pemanggilan fn sampai tidak ada panggilan baru selama `jeda` milidetik
function debounce(fn, jeda = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), jeda);
    };
}
```

| Bagian                         | Penjelasan                                                                 |
| ------------------------------ | -------------------------------------------------------------------------- |
| `(selector, induk = document)` | Parameter dengan **nilai bawaan**; jika `induk` tidak diisi, dipakai `document` |
| Arrow function `=>`            | Cara singkat menulis fungsi                                                |
| `Array.from(...)`              | Mengubah `NodeList` menjadi array agar bisa `map`, `filter`, `sort`        |
| `...args`                      | *Rest/spread*: menampung dan meneruskan semua argumen                      |
| `return (...args) => {...}`    | Fungsi yang mengembalikan fungsi (memakai **closure** untuk mengingat `timer`) |

**Pola `init`:** setiap fitur dibungkus fungsi yang **berhenti lebih awal** jika elemennya tidak ada di halaman.

```js
function initContoh() {
    const form = $('#form-siswa');
    if (!form) return;          // halaman ini tidak punya form siswa → selesai
    // ... pasang listener
}
```

---

## 6. Fitur 1 — Tema Gelap dengan `localStorage`

### 6.1 Alur

```
 Klik 🌙
   │
   ▼
 tema sekarang = html.dataset.theme ('light' / 'dark')
   │
   ▼
 temaBaru = sekarang === 'dark' ? 'light' : 'dark'
   │
   ├──▶ html.dataset.theme = temaBaru   → CSS [data-theme="dark"] aktif
   ├──▶ localStorage.setItem('tema', temaBaru)  → diingat walau browser ditutup
   └──▶ ikon tombol diganti 🌙 / ☀️
```

### 6.2 Kode

```js
// ===== 1. TEMA GELAP =====
function initTema() {
    const tombol = $('#tombol-tema');
    if (!tombol) return;

    const html = document.documentElement; // elemen <html>

    const terapkan = (tema) => {
        html.dataset.theme = tema;                       // menjadi atribut data-theme="..."
        tombol.textContent = tema === 'dark' ? '☀️' : '🌙';
        tombol.setAttribute('aria-pressed', String(tema === 'dark'));
    };

    // Saat halaman dibuka: pakai pilihan tersimpan, jika tidak ada ikuti sistem operasi
    const tersimpan = localStorage.getItem('tema');
    const sistemGelap = window.matchMedia('(prefers-color-scheme: dark)').matches;
    terapkan(tersimpan ?? (sistemGelap ? 'dark' : 'light'));

    tombol.addEventListener('click', () => {
        const baru = html.dataset.theme === 'dark' ? 'light' : 'dark';
        terapkan(baru);
        localStorage.setItem('tema', baru);
    });
}
```

| Kode                          | Arti                                                              |
| ----------------------------- | ----------------------------------------------------------------- |
| `document.documentElement`    | Elemen `<html>`                                                   |
| `html.dataset.theme = 'dark'` | Sama dengan `<html data-theme="dark">`                            |
| `a ?? b`                      | Pakai `a`, kecuali `a` bernilai `null`/`undefined`, maka pakai `b` |
| `matchMedia(...).matches`     | `true` jika sistem operasi memakai mode gelap                     |

### 6.3 Mencegah "kedipan putih"

Karena `app.js` dijalankan di akhir halaman, halaman sempat tampil terang sesaat sebelum menjadi gelap. Tambahkan script kecil di `<head>` pada `header.php`, **sebelum** `<link rel="stylesheet">`:

```html
<script>
    // Dijalankan sebelum halaman digambar agar tidak berkedip
    document.documentElement.dataset.theme = localStorage.getItem('tema') ?? 'light';
</script>
```

**Cek di DevTools:** tab **Application** → **Local Storage** → `http://localhost`. Kamu akan melihat kunci `tema`.

---

## 7. Fitur 2 — Pesan Sukses Hilang Otomatis

```js
// ===== 2. PESAN (ALERT) =====
function initPesan() {
    const daftarPesan = $$('.pesan');
    if (daftarPesan.length === 0) return;

    const sembunyikan = (pesan) => {
        pesan.classList.add('hilang');                        // CSS menjalankan transisi opacity
        pesan.addEventListener('transitionend', () => pesan.remove(), { once: true });
    };

    daftarPesan.forEach((pesan) => {
        // Tambahkan tombol × pada setiap pesan
        const tutup = document.createElement('button');
        tutup.type = 'button';
        tutup.className = 'tutup-pesan';
        tutup.setAttribute('aria-label', 'Tutup pesan');
        tutup.textContent = '×';
        pesan.append(tutup);

        // Hanya pesan sukses yang hilang sendiri; pesan gagal harus dibaca pengguna
        if (pesan.classList.contains('sukses')) {
            setTimeout(() => sembunyikan(pesan), 4000);
        }
    });

    // Event delegation: satu listener untuk semua tombol ×
    document.addEventListener('click', (event) => {
        const tombol = event.target.closest('.tutup-pesan');
        if (tombol) sembunyikan(tombol.closest('.pesan'));
    });

    // Bersihkan ?status=... dari URL agar pesan tidak muncul lagi saat halaman di-refresh
    const url = new URL(location.href);
    if (url.searchParams.has('status')) {
        url.searchParams.delete('status');
        history.replaceState(null, '', url);
    }
}
```

**Garis waktu:**

```
 0 s          4 s              4,4 s
 │────────────│────────────────│
 pesan tampil  .hilang dipasang  transitionend → elemen dihapus dari DOM
               (opacity 1 → 0)
```

**Event delegation** divisualkan:

```
 document  ◀── 1 listener 'click' dipasang di sini
   └── main
        ├── div.pesan ── button.tutup-pesan   ┐
        └── div.pesan ── button.tutup-pesan   ┘ klik "naik" (bubbling) ke document
                                                 event.target.closest('.tutup-pesan') menemukan tombolnya
```

---

## 8. Fitur 3 — Dialog Konfirmasi Hapus

Di Modul 4, konfirmasi memakai `onsubmit="return confirm(...)"` yang tampilannya tidak bisa diatur dan bercampur di HTML. Sekarang logika dipindah ke `app.js`.

### 8.1 Alur

```
 Klik [Hapus] pada baris "Andi"
        │
        ▼
 event 'submit' pada form.form-hapus
        │
        ▼
 event.preventDefault()  ── form TIDAK langsung terkirim
        │
        ▼
 isi nama "Andi" ke dialog → dialog.showModal()
        │
        ├── klik [Batal]      → dialog.close()  → selesai, data aman
        └── klik [Ya, hapus]  → dialog.close()  → form.submit() → POST ke hapus.php
```

### 8.2 Kode

```js
// ===== 3. KONFIRMASI HAPUS =====
function initKonfirmasiHapus() {
    const daftarForm = $$('.form-hapus');
    if (daftarForm.length === 0) return;

    const dialog = $('#dialog-hapus');
    const bisaDialog = dialog && typeof dialog.showModal === 'function';
    let formMenunggu = null; // form yang sedang menunggu jawaban

    daftarForm.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();               // tahan pengiriman form
            const nama = form.dataset.nama ?? 'siswa ini';

            if (!bisaDialog) {
                // Cadangan untuk browser lama
                if (confirm(`Yakin hapus ${nama}?`)) form.submit();
                return;
            }

            formMenunggu = form;
            $('[data-dialog-nama]', dialog).textContent = nama; // textContent: aman dari XSS
            dialog.showModal();
        });
    });

    if (!bisaDialog) return;

    dialog.addEventListener('click', (event) => {
        const tombol = event.target.closest('button');
        if (!tombol) return;

        dialog.close();
        if (tombol.value === 'hapus' && formMenunggu) {
            formMenunggu.submit(); // submit() tidak memicu event 'submit' lagi, jadi tidak berulang
        }
        formMenunggu = null;
    });
}
```

| Kode                       | Arti                                                                   |
| -------------------------- | ---------------------------------------------------------------------- |
| `event.preventDefault()`   | Membatalkan aksi bawaan (di sini: mengirim form)                       |
| `` `Yakin hapus ${nama}?` `` | *Template literal*: menyisipkan variabel ke dalam teks               |
| `dialog.showModal()`       | Menampilkan dialog; halaman di belakangnya tidak bisa diklik           |
| `form.submit()`            | Mengirim form secara langsung lewat JavaScript                         |

> Tombol `Esc` otomatis menutup dialog modal. Pengiriman tetap memakai **POST** ke `hapus.php`, jadi keamanan dari Modul 4 tidak berubah.

---

## 9. Fitur 4 — Validasi Form Siswa dan Penghitung Karakter

### 9.1 Menyamakan aturan dengan PHP

| Kolom           | Aturan di `validasiSiswa()` (PHP)             | Aturan di JS                          |
| --------------- | --------------------------------------------- | ------------------------------------- |
| `nama`          | Wajib, maksimal 100 karakter                  | Sama                                  |
| `email`         | Opsional, format valid, maksimal 150 karakter | Sama (regex sederhana)                |
| `jenis_kelamin` | Harus `L` atau `P`                            | Sama                                  |
| `tanggal_lahir` | Opsional, format `YYYY-MM-DD` yang valid      | Sama + **tidak boleh di masa depan** (tambahan kenyamanan) |

```
 Pengguna mengetik ──▶ JS memeriksa (langsung, tanpa reload)
                           │ salah → pesan merah di bawah kolom, form tidak dikirim
                           │ benar
                           ▼
                     Form dikirim ──▶ PHP memeriksa LAGI (wajib, sumber kebenaran)
                                          │ salah → .pesan.gagal
                                          ▼ benar
                                        INSERT / UPDATE
```

### 9.2 Kode

```js
// ===== 4. VALIDASI FORM SISWA =====
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Menghitung karakter seperti mb_strlen() di PHP (emoji dihitung 1)
const panjang = (teks) => [...teks].length;

// Mengembalikan objek { namaKolom: 'pesan error' }; objek kosong berarti valid
function validasiSiswa(data) {
    const errors = {};

    if (data.nama === '') {
        errors.nama = 'Nama wajib diisi.';
    } else if (panjang(data.nama) > 100) {
        errors.nama = 'Nama maksimal 100 karakter.';
    }

    if (data.email !== '') {
        if (!POLA_EMAIL.test(data.email)) {
            errors.email = 'Format email tidak valid.';
        } else if (panjang(data.email) > 150) {
            errors.email = 'Email maksimal 150 karakter.';
        }
    }

    if (!['L', 'P'].includes(data.jenis_kelamin)) {
        errors.jenis_kelamin = 'Jenis kelamin harus L atau P.';
    }

    if (data.tanggal_lahir !== '') {
        // Tanggal lokal format 'YYYY-MM-DD' (toISOString() memakai UTC sehingga bisa mundur 1 hari di WIB)
        const hariIni = new Date().toLocaleDateString('sv-SE');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_lahir)) {
            errors.tanggal_lahir = 'Tanggal lahir tidak valid (format YYYY-MM-DD).';
        } else if (data.tanggal_lahir > hariIni) {
            errors.tanggal_lahir = 'Tanggal lahir tidak boleh di masa depan.';
        }
    }

    return errors;
}

function initValidasiSiswa() {
    const form = $('#form-siswa');
    if (!form) return;

    const ambilData = () => ({
        nama: form.nama.value.trim(),
        email: form.email.value.trim(),
        jenis_kelamin: form.jenis_kelamin.value,
        tanggal_lahir: form.tanggal_lahir.value,
    });

    const tampilkanError = (kolom, pesan) => {
        const input = form.elements[kolom];
        const wadah = $(`[data-error-untuk="${kolom}"]`, form);
        input.classList.toggle('is-invalid', Boolean(pesan));
        input.setAttribute('aria-invalid', pesan ? 'true' : 'false');
        if (wadah) wadah.textContent = pesan ?? '';
    };

    const periksa = (hanyaKolom = null) => {
        const errors = validasiSiswa(ambilData());
        const kolomDiperiksa = hanyaKolom ? [hanyaKolom] : ['nama', 'email', 'jenis_kelamin', 'tanggal_lahir'];
        kolomDiperiksa.forEach((k) => tampilkanError(k, errors[k]));
        return errors;
    };

    // Periksa satu kolom ketika pengguna selesai mengisinya
    ['nama', 'email', 'jenis_kelamin', 'tanggal_lahir'].forEach((kolom) => {
        form.elements[kolom].addEventListener('blur', () => periksa(kolom));
    });

    // Periksa semua kolom saat form dikirim
    form.addEventListener('submit', (event) => {
        const errors = periksa();
        const kolomSalah = Object.keys(errors);
        if (kolomSalah.length > 0) {
            event.preventDefault();             // jangan kirim ke server
            form.elements[kolomSalah[0]].focus(); // arahkan ke kolom salah pertama
        }
    });

    // Penghitung karakter nama
    const nama = form.nama;
    const counter = $('[data-counter-untuk="nama"]', form);
    if (counter) {
        const perbarui = () => {
            const n = panjang(nama.value);
            counter.textContent = `${n}/100`;
            counter.style.color = n > 90 ? 'var(--warna-bahaya)' : '';
        };
        nama.addEventListener('input', perbarui);
        perbarui(); // tampilkan saat halaman edit dibuka
    }
}
```

**Penjelasan bagian penting:**

| Kode                                 | Arti                                                                  |
| ------------------------------------ | --------------------------------------------------------------------- |
| `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`       | Regex: "teks tanpa spasi" `@` "teks" `.` "teks"                       |
| `form.nama`                          | Akses input berdasarkan atribut `name="nama"` di dalam form           |
| `[...teks].length`                   | Memecah teks per karakter Unicode, mirip `mb_strlen()`                |
| `classList.toggle('is-invalid', x)`  | Tambah kelas jika `x` true, hapus jika false                          |
| `Object.keys(errors)`                | Daftar nama kolom yang salah                                          |
| Event `blur`                         | Terjadi ketika input kehilangan fokus (pindah ke kolom lain)          |
| Event `input`                        | Terjadi setiap kali isi input berubah                                 |

**Tracing contoh:** pengguna mengisi `nama = ""`, `email = "andi@"`, `jenis_kelamin = "L"`.

| Langkah                      | `errors`                                                           |
| ---------------------------- | ------------------------------------------------------------------ |
| Cek nama (`''`)              | `{ nama: 'Nama wajib diisi.' }`                                    |
| Cek email (`'andi@'`)        | `{ nama: ..., email: 'Format email tidak valid.' }`                |
| Cek JK (`'L'`)               | tidak berubah                                                      |
| `Object.keys(errors)`        | `['nama', 'email']` → submit dibatalkan, fokus ke `nama`           |

> **Uji keamanan:** di DevTools, hapus atribut `id="form-siswa"` lalu kirim form kosong. JavaScript tidak berjalan, tetapi PHP tetap menolak dengan `.pesan.gagal`. Inilah bukti validasi server tetap wajib.

---

## 10. Fitur 5 — Validasi Rentang Filter

`index.php` punya rentang **tanggal lahir**, sedangkan `detail.php` punya rentang **nilai**. Keduanya memakai logika yang sama: nilai "dari" tidak boleh lebih besar daripada "sampai". Kita buat **satu fungsi** yang dipakai ulang (prinsip *Don't Repeat Yourself*).

```js
// ===== 5. VALIDASI RENTANG FILTER =====
function pasangRentang(idDari, idSampai, pesan, ubahNilai = (v) => v) {
    const dari = $(`#${idDari}`);
    const sampai = $(`#${idSampai}`);
    if (!dari || !sampai) return;

    const cek = () => {
        const a = dari.value;
        const b = sampai.value;
        const salah = a !== '' && b !== '' && ubahNilai(a) > ubahNilai(b);
        sampai.setCustomValidity(salah ? pesan : ''); // '' berarti valid
    };

    dari.addEventListener('input', cek);
    sampai.addEventListener('input', cek);

    dari.form.addEventListener('submit', (event) => {
        cek();
        if (!sampai.form.checkValidity()) {
            event.preventDefault();
            sampai.reportValidity(); // tampilkan balon pesan bawaan browser
        }
    });
}

function initValidasiRentang() {
    // Tanggal format YYYY-MM-DD bisa dibandingkan sebagai teks
    pasangRentang('tanggal_dari', 'tanggal_sampai', 'Tanggal akhir harus setelah tanggal awal.');
    // Nilai harus diubah ke angka; jika tidak, '9' > '10' bernilai true
    pasangRentang('nilai_dari', 'nilai_sampai', 'Nilai maksimum harus ≥ nilai minimum.', Number);
}
```

**Perhatikan jebakan perbandingan teks:**

| Ekspresi               | Hasil   | Alasan                                       |
| ---------------------- | ------- | -------------------------------------------- |
| `'9' > '10'`           | `true`  | Teks dibandingkan per huruf: `'9'` > `'1'`   |
| `Number('9') > Number('10')` | `false` | Dibandingkan sebagai angka            |
| `'2008-05-01' > '2007-12-31'` | `true` | Format tanggal ISO aman dibandingkan sebagai teks |

> `ubahNilai = (v) => v` adalah **parameter fungsi** dengan nilai bawaan "kembalikan apa adanya". Untuk nilai rapor kita mengirim `Number` sebagai fungsi pengubah.

---

## 11. Fitur 6 — Pencarian Langsung dengan `fetch`

### 11.1 Endpoint JSON di PHP: `api_siswa.php`

Buat file baru `api_siswa.php`. File ini **tidak** menghasilkan HTML, tetapi **JSON**. Ia memakai ulang `SiswaRepository::cari()` dari Modul 4.

```php
<?php
require __DIR__ . '/koneksi.php';
require __DIR__ . '/SiswaRepository.php';

header('Content-Type: application/json; charset=utf-8'); // beri tahu browser: isinya JSON

$q = $_GET['q'] ?? '';
$q = is_string($q) ? trim($q) : '';

// Minimal 2 karakter agar tidak mengambil seluruh tabel
if (mb_strlen($q) < 2) {
    echo json_encode([]);
    exit;
}

$repo = new SiswaRepository($pdo);
$hasil = array_slice($repo->cari(mb_substr($q, 0, 100)), 0, 8); // maksimal 8 saran

echo json_encode($hasil, JSON_UNESCAPED_UNICODE);
```

**Uji langsung di browser:** buka `http://localhost/crud_siswa/api_siswa.php?q=an`. Hasilnya kira-kira:

```json
[
  { "id_siswa": 1, "nama": "Andi Saputra", "email": "andi@sekolah.id" },
  { "id_siswa": 4, "nama": "Dewi Anggraini", "email": null }
]
```

### 11.2 Tambahkan wadah saran di `index.php`

Ganti blok input `q` pada form filter:

```php
<div class="cari-wrap">
    <label for="q">Cari nama atau email</label>
    <input type="text" id="q" name="q" maxlength="100" value="<?= e($kata) ?>"
           autocomplete="off" aria-controls="saran-siswa">
    <ul class="saran" id="saran-siswa" role="listbox"></ul>
</div>
```

### 11.3 Alur `fetch` dan debounce

```
 Pengguna mengetik "a" "n" "d" "i" dengan cepat
   │    │    │    │
   ▼    ▼    ▼    ▼
  ┌──┐ ┌──┐ ┌──┐ ┌──────────── 300 ms hening ───────────┐
  │✗ │ │✗ │ │✗ │ │                                      ▼
  └──┘ └──┘ └──┘ └──────────────────────────────▶ fetch('api_siswa.php?q=andi')
  timer lama dibatalkan setiap ada ketikan baru            │
                                                           ▼
  Tanpa debounce: 4 request.  Dengan debounce: 1 request.  JSON → array objek
                                                           │
                                                           ▼
                                                  buat <li><a> untuk tiap siswa
```

```
  BROWSER                                   SERVER
  fetch(url) ─────── GET api_siswa.php?q=andi ──────▶ SiswaRepository::cari()
     │                                                     │
     │ (menunggu, halaman tetap bisa dipakai)              ▼
     ◀──────────────── [{"id_siswa":1,...}] ─────────── json_encode()
  await res.json()  → array JavaScript
```

### 11.4 Kode

```js
// ===== 6. PENCARIAN LANGSUNG =====
async function ambilSaran(kata, signal) {
    const url = `api_siswa.php?q=${encodeURIComponent(kata)}`;
    const res = await fetch(url, { signal });         // tunggu jawaban server
    if (!res.ok) throw new Error(`HTTP ${res.status}`); // 404/500 tidak otomatis dianggap error
    return res.json();                                 // ubah teks JSON menjadi array
}

function tampilkanSaran(ul, daftar) {
    ul.replaceChildren(); // kosongkan isi lama

    daftar.forEach((siswa) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `detail.php?id=${encodeURIComponent(siswa.id_siswa)}`;
        a.textContent = siswa.nama;                    // aman: tidak ditafsirkan sebagai HTML

        if (siswa.email) {
            const kecil = document.createElement('small');
            kecil.textContent = ` — ${siswa.email}`;
            a.append(kecil);
        }

        li.append(a);
        ul.append(li);
    });
}

function initPencarianLangsung() {
    const input = $('#q');
    const ul = $('#saran-siswa');
    if (!input || !ul) return;

    let pengendali = null; // AbortController untuk membatalkan request lama

    const cari = debounce(async () => {
        const kata = input.value.trim();
        if (kata.length < 2) {
            ul.replaceChildren();
            return;
        }

        pengendali?.abort();                 // batalkan request sebelumnya jika masih berjalan
        pengendali = new AbortController();

        try {
            const daftar = await ambilSaran(kata, pengendali.signal);
            tampilkanSaran(ul, daftar);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Gagal memuat saran:', err);
                ul.replaceChildren();
            }
        }
    }, 300);

    input.addEventListener('input', cari);

    // Tutup daftar saran dengan Esc atau ketika klik di luar
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') ul.replaceChildren();
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.cari-wrap')) ul.replaceChildren();
    });
}
```

| Kode                         | Arti                                                                        |
| ---------------------------- | --------------------------------------------------------------------------- |
| `async function`             | Fungsi yang boleh memakai `await` dan selalu mengembalikan Promise          |
| `await fetch(url)`           | Tunggu sampai server menjawab, tanpa membekukan halaman                     |
| `res.ok`                     | `true` jika status HTTP 200–299                                             |
| `res.json()`                 | Membaca isi jawaban dan mengubah JSON menjadi objek/array JavaScript       |
| `encodeURIComponent(kata)`   | Mengamankan karakter khusus (`&`, spasi, `#`) di URL                        |
| `try { } catch (err) { }`    | Menangkap error (server mati, JSON rusak) agar aplikasi tidak berhenti     |
| `AbortController`            | Membatalkan request lama agar jawaban lambat tidak menimpa jawaban baru    |
| `pengendali?.abort()`        | *Optional chaining*: panggil `abort()` hanya jika `pengendali` tidak `null` |

**Cek di DevTools → tab Network:** ketik "andi" dengan cepat. Hanya satu request `api_siswa.php?q=andi` yang muncul. Klik request tersebut → tab **Response** untuk melihat JSON-nya.

> Tombol **Cari / Terapkan filter** tetap berfungsi seperti di Modul 4. Saran hanyalah jalan pintas menuju halaman rapor siswa.

---

## 12. Fitur 7 — Urutkan Tabel Rapor dan Ringkasan Nilai

Di `detail.php`, pengurutan oleh server (`urut`/`arah`) membutuhkan reload. Untuk data yang **sudah tampil**, kita bisa mengurutkan langsung di browser dan menghitung ringkasan.

> Pastikan tabel rapor sudah diberi `id="tabel-rapor"`, `class="tabel"`, dan `data-label` pada setiap `<td>` (Modul 5 bagian 9.1).

### 12.1 Array method yang dipakai

| Method                  | Fungsi                                   | Contoh                                       |
| ----------------------- | ---------------------------------------- | -------------------------------------------- |
| `map(fn)`               | Mengubah setiap elemen → array baru      | `[80, 90].map(n => n + 5)` → `[85, 95]`      |
| `filter(fn)`            | Menyaring elemen yang memenuhi syarat    | `[60, 90].filter(n => n >= 75)` → `[90]`     |
| `reduce(fn, awal)`      | Menggabungkan semua elemen jadi satu nilai | `[80, 90].reduce((t, n) => t + n, 0)` → `170` |
| `sort(fn)`              | Mengurutkan (mengubah array asli)        | `[3, 1, 2].sort((a, b) => a - b)` → `[1, 2, 3]` |
| `Math.max(...arr)`      | Nilai terbesar                           | `Math.max(...[80, 95])` → `95`               |

**Cara kerja fungsi pembanding `sort`:**

```
 (a, b) => a - b
   hasil < 0  → a di depan b
   hasil > 0  → b di depan a
   hasil = 0  → urutan tetap

 Urut nilai menaik: [85, 70, 92]
   bandingkan 85 & 70 → 15 (>0) → tukar → [70, 85, 92]
   bandingkan 85 & 92 → -7 (<0) → tetap → [70, 85, 92] ✔
```

### 12.2 Kode

```js
// ===== 7. TABEL RAPOR =====
function initTabelRapor() {
    const tabel = $('#tabel-rapor');
    if (!tabel) return;

    const tbody = tabel.tBodies[0];
    // Abaikan baris "Tidak ada nilai..." yang hanya punya 1 sel
    const baris = $$('tr', tbody).filter((tr) => tr.cells.length === 3);
    if (baris.length === 0) return;

    // --- Ringkasan nilai ---
    const nilai = baris.map((tr) => Number(tr.cells[2].textContent));
    const total = nilai.reduce((jumlah, n) => jumlah + n, 0);
    const ringkasan = [
        ['Rata-rata', (total / nilai.length).toFixed(2)],
        ['Tertinggi', Math.max(...nilai)],
        ['Terendah', Math.min(...nilai)],
        ['Tuntas (≥ 75)', `${nilai.filter((n) => n >= 75).length} dari ${nilai.length}`],
    ];

    const kotak = document.createElement('div');
    kotak.className = 'ringkasan';
    ringkasan.forEach(([label, angka]) => {        // destructuring array [label, angka]
        const item = document.createElement('div');
        item.className = 'ringkasan__item';
        const besar = document.createElement('span');
        besar.className = 'ringkasan__angka';
        besar.textContent = angka;
        const kecil = document.createElement('span');
        kecil.className = 'ringkasan__label';
        kecil.textContent = label;
        item.append(besar, kecil);
        kotak.append(item);
    });
    tabel.closest('.tabel-wrap').before(kotak);   // sisipkan di atas tabel

    // --- Urutkan saat judul kolom diklik ---
    const judul = $$('th', tabel.tHead);
    const kolomAngka = [true, false, true]; // Semester, Mata Pelajaran, Nilai

    judul.forEach((th, indeks) => {
        th.classList.add('bisa-urut');
        th.tabIndex = 0; // bisa difokus dengan keyboard

        const urutkan = () => {
            const naik = th.getAttribute('aria-sort') !== 'ascending';
            const ambil = (tr) => tr.cells[indeks].textContent.trim();

            baris.sort((a, b) => {
                const hasil = kolomAngka[indeks]
                    ? Number(ambil(a)) - Number(ambil(b))
                    : ambil(a).localeCompare(ambil(b), 'id');
                return naik ? hasil : -hasil;
            });

            judul.forEach((h) => h.removeAttribute('aria-sort'));
            th.setAttribute('aria-sort', naik ? 'ascending' : 'descending');
            tbody.append(...baris); // memindahkan baris yang sudah ada sesuai urutan baru
        };

        th.addEventListener('click', urutkan);
        th.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                urutkan();
            }
        });
    });
}
```

**Visualisasi hasil di `detail.php`:**

```
 ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────┐
 │  84.25    │ │  95       │ │  70       │ │  3 dari 4    │   ← .ringkasan (grid)
 │ Rata-rata │ │ Tertinggi │ │ Terendah  │ │ Tuntas (≥75) │
 └───────────┘ └───────────┘ └───────────┘ └──────────────┘
 ┌────────────┬──────────────────┬─────────┐
 │ SEMESTER ↕ │ MATA PELAJARAN ↕ │ NILAI ▼ │  ← klik judul: ▲ naik, ▼ turun
 ├────────────┼──────────────────┼─────────┤
 │ 1          │ Pemrograman Web  │ 95      │
 │ 1          │ Basis Data       │ 88      │
 └────────────┴──────────────────┴─────────┘
```

> `tbody.append(...baris)` **tidak** menggandakan baris. Jika elemen yang di-`append` sudah ada di DOM, elemen tersebut **dipindahkan**.

> Ringkasan dihitung dari baris yang **sedang tampil** (setelah filter nilai). Jika filter `nilai_dari = 80` dipakai, rata-rata hanya dari nilai ≥ 80.

---

## 13. Menjalankan Semua Fitur

Tambahkan di **paling bawah** `app.js`:

```js
// ===== JALANKAN =====
initTema();
initPesan();
initKonfirmasiHapus();
initValidasiSiswa();
initValidasiRentang();
initPencarianLangsung();
initTabelRapor();
```

Karena `<script src="app.js">` diletakkan di akhir `<body>`, seluruh elemen sudah tersedia saat fungsi-fungsi ini dipanggil. Jika suatu saat script dipindah ke `<head>`, gunakan `<script src="app.js" defer></script>` atau bungkus pemanggilan dengan `document.addEventListener('DOMContentLoaded', () => { ... })`.

### 13.1 Daftar uji (checklist)

| No | Uji                                                                 | Hasil yang diharapkan                          |
| -- | ------------------------------------------------------------------- | ---------------------------------------------- |
| 1  | Klik 🌙, lalu refresh halaman                                       | Tema gelap tetap aktif                          |
| 2  | Tambah siswa baru                                                   | Pesan hijau hilang setelah ±4 detik; URL tanpa `?status=` |
| 3  | Klik **Hapus** → **Batal**                                          | Data tidak terhapus                             |
| 4  | Klik **Hapus** → **Ya, hapus**                                      | Data terhapus, pesan "berhasil dihapus"         |
| 5  | Kirim form tambah dengan nama kosong dan email `andi@`              | Dua pesan merah, form tidak terkirim            |
| 6  | Ketik nama 95 karakter                                              | Penghitung `95/100` berwarna merah              |
| 7  | Filter tanggal: dari `2010-01-01`, sampai `2008-01-01`              | Balon peringatan, form tidak terkirim           |
| 8  | Ketik `an` di kolom cari                                            | Muncul daftar saran; tab Network hanya 1 request |
| 9  | Klik judul **Nilai** di rapor dua kali                              | Urutan naik (▲) lalu turun (▼)                  |
| 10 | Matikan JavaScript (DevTools → `Ctrl+Shift+P` → *Disable JavaScript*) | Aplikasi tetap berjalan seperti Modul 4; validasi PHP tetap aktif |

---

## 14. Rangkuman

| Konsep                    | Dipakai di fitur                    | Kode kunci                                      |
| ------------------------- | ----------------------------------- | ----------------------------------------------- |
| Memilih elemen            | Semua                               | `querySelector`, `querySelectorAll`, `closest`  |
| Mengubah DOM dengan aman  | Saran, ringkasan, dialog            | `textContent`, `createElement`, `append`        |
| Event & listener          | Semua                               | `addEventListener('click' / 'submit' / 'input')` |
| Membatalkan aksi bawaan   | Hapus, validasi                     | `event.preventDefault()`                        |
| Event delegation          | Tombol tutup pesan                  | `event.target.closest(...)`                     |
| `dataset` / atribut data  | Tema, nama siswa di dialog          | `html.dataset.theme`, `form.dataset.nama`       |
| `localStorage`            | Tema                                | `getItem`, `setItem`                            |
| Timer                     | Pesan, debounce                     | `setTimeout`, `clearTimeout`                    |
| Validasi + regex          | Form siswa                          | `POLA_EMAIL.test(...)`, `setCustomValidity`     |
| `fetch` + `async/await`   | Pencarian langsung                  | `await fetch(url)`, `await res.json()`          |
| JSON di PHP               | `api_siswa.php`                     | `header('Content-Type: application/json')`, `json_encode` |
| Array method              | Tabel rapor                         | `map`, `filter`, `reduce`, `sort`               |

---

## 15. Latihan

**Dasar**

1. Ubah lama tampil pesan sukses dari 4 detik menjadi 6 detik.
2. Tambahkan `console.log` di awal setiap fungsi `init*` lalu buka setiap halaman. Fungsi mana yang berhenti lebih awal di `index.php`? Di `detail.php`?
3. Buat penghitung karakter untuk kolom `email` (maksimal 150).

**Menengah**

4. Pada `index.php`, buat select `jk` dan `jurusan` mengirim form **otomatis** ketika pilihannya berubah (event `change` + `form.requestSubmit()`).
5. Pada pencarian langsung, beri **sorotan** (tebal) pada bagian nama yang cocok dengan kata kunci. Gunakan `createElement('mark')`, **bukan** `innerHTML`.
6. Navigasikan daftar saran dengan tombol panah ↑/↓ dan buka dengan `Enter`.

**Lanjutan**

7. Buat `api_hapus.php` yang mengembalikan JSON `{ "ok": true }`, lalu hapus baris tabel **tanpa reload** memakai `fetch` metode `POST` dan `FormData`. Pastikan tetap memakai prepared statement di PHP.
8. Pecah `app.js` menjadi beberapa **ES module** (`tema.js`, `validasi.js`, `pencarian.js`) dan muat dengan `<script type="module" src="main.js">`.

**Diskusi**

- Jika validasi JavaScript sudah lengkap, mengapa `validasiSiswa()` di PHP tidak boleh dihapus?
- Apa risikonya jika `tampilkanSaran()` memakai `ul.innerHTML += '<li>' + siswa.nama + '</li>'`?

---

## 16. Kesalahan Umum

| Kesalahan                                              | Akibat                                                 | Perbaikan                                                       |
| ------------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------- |
| Script dimuat di `<head>` tanpa `defer`                | `querySelector` menghasilkan `null`                    | Letakkan di akhir `<body>` atau tambahkan `defer`               |
| `Cannot read properties of null (reading 'addEventListener')` | Elemen tidak ada di halaman itu                 | Tambahkan `if (!el) return;` (pola `init`)                      |
| Lupa `event.preventDefault()`                          | Form tetap terkirim walau ada error                    | Panggil di awal listener `submit` jika data salah               |
| Menampilkan data dengan `innerHTML`                    | Celah XSS                                              | Gunakan `textContent` dan `createElement`                       |
| Membandingkan angka dari input sebagai teks            | `'9' > '10'` bernilai `true`                           | Ubah dengan `Number(...)`                                       |
| Lupa `await` sebelum `fetch` / `res.json()`            | Mendapat `Promise`, bukan data                         | Tambahkan `await` di dalam fungsi `async`                       |
| Menganggap `fetch` gagal saat status 404/500           | Error server tidak terdeteksi                          | Periksa `res.ok`                                                |
| PHP mencetak spasi/HTML sebelum JSON                   | `res.json()` error "Unexpected token"                  | Pastikan `api_siswa.php` hanya `echo json_encode(...)`          |
| Request dikirim setiap ketikan                         | Server terbebani, hasil bisa tertukar                  | Gunakan `debounce` dan `AbortController`                        |
| Menghapus validasi PHP karena "sudah ada di JS"        | Data salah tetap bisa masuk lewat request langsung     | Validasi JS = kenyamanan, validasi PHP = keamanan               |
| `app.js` tidak berubah setelah diedit                  | Cache browser                                          | `Ctrl + F5` atau centang **Disable cache** di tab Network       |

**Kembali ke:** [Modul 5 — CSS Menengah](../css/modul_5_css_menengah.md) · [README](../README.md)
