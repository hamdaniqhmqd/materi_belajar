# Modul 5 — CSS Menengah: Mempercantik Aplikasi Data Siswa

**Mata pelajaran:** Pemrograman Web — RPL
**Alat:** XAMPP, VS Code, browser (Chrome/Edge/Firefox) dengan DevTools (`F12`)
**Studi kasus:** Proyek `crud_siswa` dari [Modul 4 — PHP & MySQL](../php/modul_4_php_mysql.md)
**Prasyarat:** CSS dasar (selector, warna, `margin`, `padding`), proyek Modul 4 sudah berjalan

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan **cascade**, **specificity**, dan **inheritance** serta memakainya untuk menghindari CSS yang saling menimpa.
2. Menggunakan **CSS custom properties** (variabel) untuk warna, jarak, dan tema.
3. Menyusun tata letak dengan **Flexbox** (satu arah) dan **Grid** (dua arah).
4. Membuat tampilan **responsif** dengan *media query* dan pendekatan *mobile first*.
5. Memberi gaya pada **status form** (`:focus-visible`, `:invalid`, `.is-invalid`) dan komponen (badge, alert, dialog).
6. Menambahkan **transisi**, **tema gelap**, dan **gaya cetak** (`@media print`) untuk rapor.
7. Menamai kelas dengan pola **BEM sederhana** agar CSS mudah dirawat.

---

## 2. Konsep Dasar

| Konsep             | Arti singkat                                                     | Contoh                                  |
| ------------------ | ---------------------------------------------------------------- | --------------------------------------- |
| Cascade            | Aturan yang ditulis **belakangan** menang jika kekuatannya sama  | Dua aturan `.btn`, yang bawah dipakai   |
| Specificity        | "Kekuatan" selector menentukan aturan mana yang menang           | `#id` > `.kelas` > `tag`                |
| Inheritance        | Beberapa properti (warna, font) diwariskan ke elemen anak        | `body { color }` berlaku ke `p`         |
| Custom property    | Variabel CSS, diawali `--`, dibaca dengan `var()`                | `--warna-utama: #2563eb;`               |
| Box model          | Setiap elemen = konten + padding + border + margin               | `box-sizing: border-box`                |
| Flexbox            | Tata letak satu dimensi (baris **atau** kolom)                   | Topbar, tombol aksi                     |
| Grid               | Tata letak dua dimensi (baris **dan** kolom)                     | Form filter, form siswa                 |
| Media query        | CSS yang hanya berlaku pada kondisi tertentu                     | `@media (min-width: 768px)`             |
| Pseudo-class       | Keadaan elemen                                                   | `:hover`, `:focus-visible`, `:nth-child` |
| Pseudo-element     | Bagian "maya" dari elemen                                        | `::before`, `::backdrop`                |

### 2.1 Specificity (kekuatan selector)

```
  Kekuatan selector dihitung seperti skor (ID, KELAS, TAG)

  style="..."              ████████████████  paling kuat (hindari)
  #tombol-tema             ████████████      (1, 0, 0)
  .btn.btn-hapus           ████████          (0, 2, 0)
  .btn                     ████              (0, 1, 0)
  button                   ██                (0, 0, 1)
  *                        ▏                 (0, 0, 0)
```

| Selector                 | Skor (ID, kelas, tag) |
| ------------------------ | --------------------- |
| `td`                     | 0, 0, 1               |
| `.aksi`                  | 0, 1, 0               |
| `table td.aksi`          | 0, 1, 2               |
| `.filters label`         | 0, 1, 1               |
| `#q`                     | 1, 0, 0               |

> **Aturan praktis di proyek ini:** gunakan **kelas** untuk styling, jangan `#id` dan jangan `style="..."`. Dengan begitu semua aturan punya kekuatan setara dan mudah ditimpa dengan urutan penulisan.

### 2.2 Box model

```
 ┌──────────────────────── margin ────────────────────────┐
 │  ┌───────────────────── border ─────────────────────┐  │
 │  │  ┌────────────────── padding ─────────────────┐  │  │
 │  │  │                                            │  │  │
 │  │  │              KONTEN (width)                │  │  │
 │  │  │                                            │  │  │
 │  │  └────────────────────────────────────────────┘  │  │
 │  └──────────────────────────────────────────────────┘  │
 └────────────────────────────────────────────────────────┘

 box-sizing: content-box → width = konten saja (padding & border menambah lebar)
 box-sizing: border-box  → width = konten + padding + border (lebih mudah dihitung)
```

### 2.3 Flexbox vs Grid

```
 FLEXBOX (satu arah)                      GRID (dua arah)
 ┌──────────────────────────────┐         ┌─────────┬─────────┬─────────┐
 │ [Logo]        [Daftar][Tambah][🌙] │   │ Cari    │ JK      │ Jurusan │
 └──────────────────────────────┘         ├─────────┼─────────┼─────────┤
  justify-content: space-between          │ Dari    │ Sampai  │ Urut    │
                                          └─────────┴─────────┴─────────┘
  Cocok: topbar, deret tombol             Cocok: form, galeri, dashboard
```

---

## 3. Studi Kasus

Aplikasi `crud_siswa` dari Modul 4 sudah berfungsi, tetapi tampilannya masih sederhana:

| Masalah tampilan sekarang                          | Solusi di modul ini                               |
| -------------------------------------------------- | ------------------------------------------------- |
| Warna ditulis berulang (`#2563eb` di banyak tempat) | Custom properties di `:root`                      |
| Tidak ada navigasi                                 | Topbar dengan Flexbox                             |
| Tabel melebar keluar layar di HP                   | Pembungkus `overflow-x` + tampilan kartu di HP    |
| Fokus input kurang terlihat                        | `:focus-visible` dan `:invalid`                   |
| Jenis kelamin hanya teks                           | Badge berwarna                                    |
| Ada `style="margin-top:16px"` di `form_siswa.php`  | Kelas `.form-aksi`                                |
| Rapor ikut mencetak tombol dan filter              | `@media print`                                    |
| Mata cepat lelah malam hari                        | Tema gelap dengan `[data-theme="dark"]`           |

**Hasil akhir yang dituju (tampilan laptop):**

```
 ┌──────────────────────────────────────────────────────────────────┐
 │ 📚 Data Siswa                          Daftar   Tambah   [🌙]    │  ← topbar
 └──────────────────────────────────────────────────────────────────┘
   ┌──────────────────────────────────────────────────────────────┐
   │ Daftar Siswa                                                 │
   │ ✔ Data siswa berhasil ditambahkan.                      [×]  │
   │ [+ Tambah Siswa]                    Menampilkan 5 dari 12    │
   │ ┌──────────┬──────────┬──────────┬──────────┐                │
   │ │ Cari     │ JK       │ Jurusan  │ ...      │  ← grid filter │
   │ └──────────┴──────────┴──────────┴──────────┘                │
   │ No │ Nama │ Email │ JK [L] │ Tgl │ Jurusan │ Rapor Edit Hapus │
   │ ───┼──────┼───────┼────────┼─────┼─────────┼───────────────── │
   └──────────────────────────────────────────────────────────────┘
```

**Tampilan HP (< 640px): baris tabel berubah menjadi kartu**

```
 ┌─────────────────────────┐
 │ 📚 Data Siswa      [🌙] │
 ├─────────────────────────┤
 │ ┌─────────────────────┐ │
 │ │ Nama     Andi       │ │
 │ │ Email    andi@x.id  │ │
 │ │ JK       [L]        │ │
 │ │ Jurusan  RPL        │ │
 │ │ [Rapor][Edit][Hapus]│ │
 │ └─────────────────────┘ │
 │ ┌─────────────────────┐ │
 │ │ Nama     Siti ...   │ │
 └─────────────────────────┘
```

---

## 4. Persiapan

1. Pastikan Apache dan MySQL di XAMPP menyala dan `http://localhost/crud_siswa/` dapat dibuka.
2. **Cadangkan** `style.css` lama: salin menjadi `style_lama.css`.
3. Buka DevTools (`F12`) → tab **Elements** → panel **Styles** untuk melihat aturan mana yang menang dan dicoret.
4. Aktifkan **Toggle device toolbar** (`Ctrl + Shift + M`) untuk mencoba ukuran layar HP.

Struktur file yang akan diubah:

```
crud_siswa/
├── header.php        ← ditambah topbar + tombol tema
├── footer.php        ← </main> + dialog hapus (dipakai Modul 6)
├── index.php         ← toolbar, pembungkus tabel, badge, data-label
├── detail.php        ← pembungkus tabel rapor
├── form_siswa.php    ← .field, .form-aksi (hapus inline style)
└── style.css         ← DITULIS ULANG
```

---

## 5. Custom Properties dan Reset Ringan

Buka `style.css`, hapus seluruh isinya, lalu tulis bagian demi bagian mulai dari sini.

```css
/* ============ 1. VARIABEL ============ */
:root {
  /* warna */
  --warna-utama: #2563eb;
  --warna-utama-gelap: #1d4ed8;
  --warna-bahaya: #dc2626;
  --warna-abu: #6b7280;
  --warna-sukses-bg: #dcfce7;
  --warna-sukses-teks: #166534;
  --warna-gagal-bg: #fee2e2;
  --warna-gagal-teks: #991b1b;

  /* permukaan dan teks */
  --bg: #f1f5f9;
  --permukaan: #ffffff;
  --permukaan-2: #f8fafc;
  --garis: #e2e8f0;
  --teks: #0f172a;
  --teks-redup: #64748b;

  /* ukuran */
  --radius: 8px;
  --jarak-1: 4px;
  --jarak-2: 8px;
  --jarak-3: 12px;
  --jarak-4: 16px;
  --jarak-5: 24px;
  --bayangan: 0 1px 3px rgb(0 0 0 / 0.08), 0 4px 12px rgb(0 0 0 / 0.04);
  --transisi: 0.2s ease;
}

/* ============ 2. RESET RINGAN ============ */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: var(--teks);
  background: var(--bg);
}

h1 {
  margin: 0 0 var(--jarak-4);
  font-size: 1.6rem;
}

a {
  color: var(--warna-utama);
}
```

**Penjelasan:**

| Bagian                     | Fungsi                                                                 |
| -------------------------- | ---------------------------------------------------------------------- |
| `:root { --nama: nilai; }` | Mendaftarkan variabel global yang bisa dipakai di seluruh file         |
| `var(--warna-utama)`       | Membaca isi variabel                                                   |
| `*, *::before, *::after`   | `border-box` untuk **semua** elemen, sehingga lebar mudah dihitung     |
| `rgb(0 0 0 / 0.08)`        | Warna hitam dengan transparansi 8% (sintaks modern)                    |

> **Kenapa variabel?** Jika sekolah ingin warna utama hijau, cukup ganti **satu baris** `--warna-utama`. Tanpa variabel, kamu harus mencari dan mengganti puluhan baris.

---

## 6. Layout Halaman: Topbar (Flexbox) dan Container

### 6.1 Ubah `header.php`

```php
<?php /* Variabel $judul diisi oleh halaman yang memanggil file ini */ ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($judul ?? 'Data Siswa') ?></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<header class="topbar">
    <div class="topbar__isi">
        <a class="topbar__brand" href="index.php">📚 Data Siswa</a>
        <nav class="topbar__nav" aria-label="Menu utama">
            <a class="topbar__link" href="index.php">Daftar</a>
            <a class="topbar__link" href="tambah.php">Tambah</a>
            <button type="button" class="btn btn-ghost" id="tombol-tema"
                    aria-label="Ganti tema terang/gelap">🌙</button>
        </nav>
    </div>
</header>
<main class="container">
    <h1><?= e($judul ?? 'Data Siswa') ?></h1>
```

### 6.2 Ubah `footer.php`

```php
</main>
</body>
</html>
```

> Tombol `#tombol-tema` belum berfungsi. Perilakunya dibuat dengan JavaScript di [Modul 6](../javascript/modul_6_javascript_menengah.md). CSS hanya menyiapkan tampilannya.

### 6.3 CSS layout

```css
/* ============ 3. LAYOUT ============ */
.topbar {
  position: sticky;          /* menempel di atas saat halaman digulir */
  top: 0;
  z-index: 10;
  background: var(--permukaan);
  border-bottom: 1px solid var(--garis);
}

.topbar__isi {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--jarak-3) var(--jarak-4);
  display: flex;
  align-items: center;
  justify-content: space-between;  /* brand di kiri, nav di kanan */
  gap: var(--jarak-4);
}

.topbar__brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--teks);
  text-decoration: none;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: var(--jarak-3);
}

.topbar__link {
  color: var(--teks-redup);
  text-decoration: none;
  font-weight: 500;
}

.topbar__link:hover {
  color: var(--warna-utama);
}

.container {
  max-width: 1000px;
  margin: var(--jarak-5) auto;
  padding: var(--jarak-5);
  background: var(--permukaan);
  border-radius: var(--radius);
  box-shadow: var(--bayangan);
}
```

**Visualisasi Flexbox pada topbar:**

```
 display:flex; justify-content:space-between; align-items:center
 ┌──────────────────────────────────────────────────────────────┐
 │ [📚 Data Siswa] ◀────── ruang kosong dibagi ──────▶ [nav....] │
 └──────────────────────────────────────────────────────────────┘
        ▲ item 1                                        ▲ item 2
                                     nav juga flex:  [Daftar] gap [Tambah] gap [🌙]
```

### 6.4 Penamaan BEM sederhana

**BEM** = **B**lock, **E**lement, **M**odifier.

| Bagian   | Penulisan          | Contoh di proyek    | Arti                              |
| -------- | ------------------ | ------------------- | --------------------------------- |
| Block    | `.blok`            | `.topbar`, `.badge` | Komponen mandiri                  |
| Element  | `.blok__elemen`    | `.topbar__brand`    | Bagian dari blok                  |
| Modifier | `.blok--variasi`   | `.badge--l`         | Variasi tampilan blok             |

> Kelas lama dari Modul 4 (`.btn-hapus`, `.btn-abu`) tetap dipakai agar file PHP lama tidak rusak. Kelas **baru** memakai pola BEM.

---

## 7. Tombol dan Pesan (Alert)

```css
/* ============ 4. TOMBOL ============ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--jarak-1);
  padding: 7px 14px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--warna-utama);
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--transisi), transform var(--transisi);
}

.btn:hover {
  background: var(--warna-utama-gelap);
}

.btn:active {
  transform: translateY(1px);  /* efek "ditekan" */
}

.btn:focus-visible {
  outline: 3px solid rgb(37 99 235 / 0.4);
  outline-offset: 2px;
}

.btn-hapus {
  background: var(--warna-bahaya);
}

.btn-hapus:hover {
  background: #b91c1c;
}

.btn-abu {
  background: var(--warna-abu);
}

.btn-abu:hover {
  background: #4b5563;
}

.btn-ghost {
  background: transparent;
  color: var(--teks);
  border-color: var(--garis);
}

.btn-ghost:hover {
  background: var(--permukaan-2);
}

/* ============ 5. PESAN ============ */
.pesan {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--jarak-3);
  padding: var(--jarak-3) var(--jarak-4);
  margin: var(--jarak-3) 0;
  border-radius: 6px;
  border-left: 4px solid currentColor;  /* garis kiri mengikuti warna teks */
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.pesan ul {
  margin: 0;
  padding-left: 18px;
}

.sukses {
  background: var(--warna-sukses-bg);
  color: var(--warna-sukses-teks);
}

.gagal {
  background: var(--warna-gagal-bg);
  color: var(--warna-gagal-teks);
}

.pesan.hilang {
  opacity: 0;
  transform: translateY(-6px);
}
```

**Tabel pseudo-class pada tombol:**

| Pseudo-class     | Kapan aktif                                         |
| ---------------- | --------------------------------------------------- |
| `:hover`         | Kursor mouse berada di atas tombol                  |
| `:active`        | Tombol sedang ditekan                               |
| `:focus-visible` | Tombol difokus dengan **keyboard** (`Tab`)          |

> `:focus-visible` lebih baik daripada `:focus` karena garis fokus hanya muncul saat memakai keyboard, tidak saat diklik mouse. Jangan pernah menulis `outline: none` tanpa pengganti; pengguna keyboard jadi tidak tahu posisinya.

> Kelas `.hilang` dipakai JavaScript di Modul 6 untuk menyembunyikan pesan secara halus. `transition` membuat perubahan `opacity` berlangsung 0,4 detik, bukan langsung.

---

## 8. Toolbar, Filter (Grid), dan Form

### 8.1 Toolbar di `index.php`

Ganti baris `<a class="btn" href="tambah.php">+ Tambah Siswa</a>` dan paragraf "Menampilkan ..." menjadi satu toolbar:

```php
<div class="toolbar">
    <a class="btn" href="tambah.php">+ Tambah Siswa</a>
    <p class="toolbar__info">
        Menampilkan <?= count($daftarSiswa) ?> dari <?= $jumlahSiswa ?> siswa yang cocok.
    </p>
</div>
```

> Pindahkan toolbar ini ke **atas** form filter, lalu hapus paragraf "Menampilkan ..." yang lama di bawah form.

### 8.2 CSS toolbar, filter, dan field

```css
/* ============ 6. TOOLBAR & FILTER ============ */
.toolbar {
  display: flex;
  flex-wrap: wrap;            /* turun ke baris baru jika tidak muat */
  justify-content: space-between;
  align-items: center;
  gap: var(--jarak-3);
}

.toolbar__info {
  margin: 0;
  color: var(--teks-redup);
  font-size: 14px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--jarak-3);
  margin: var(--jarak-4) 0;
  padding: var(--jarak-4);
  background: var(--permukaan-2);
  border: 1px solid var(--garis);
  border-radius: var(--radius);
}

/* div terakhir (berisi tombol) dibuat selebar seluruh kolom */
.filters > div:last-child {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--jarak-2);
  justify-content: flex-end;
}

/* ============ 7. FORM ============ */
label {
  display: block;
  margin-bottom: var(--jarak-1);
  font-weight: 600;
  font-size: 14px;
}

input[type="text"],
input[type="email"],
input[type="date"],
input[type="number"],
select {
  width: 100%;
  padding: 8px 10px;
  font: inherit;
  color: var(--teks);
  background: var(--permukaan);
  border: 1px solid var(--garis);
  border-radius: 6px;
  transition: border-color var(--transisi), box-shadow var(--transisi);
}

input:focus-visible,
select:focus-visible {
  outline: none;
  border-color: var(--warna-utama);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.2);  /* pengganti outline */
}

/* :user-invalid hanya aktif setelah pengguna berinteraksi dengan input */
input:user-invalid,
.is-invalid {
  border-color: var(--warna-bahaya);
  box-shadow: 0 0 0 3px rgb(220 38 38 / 0.15);
}

.field {
  margin-bottom: var(--jarak-4);
}

.field__bantuan {
  display: flex;
  justify-content: space-between;
  margin-top: var(--jarak-1);
  font-size: 13px;
  color: var(--teks-redup);
}

.field__error {
  color: var(--warna-bahaya);
}

form.inline {
  display: inline;
}

.form-siswa {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: var(--jarak-5);
}

.form-aksi {
  grid-column: 1 / -1;
  display: flex;
  gap: var(--jarak-2);
  margin-top: var(--jarak-2);
}

@media (min-width: 768px) {
  .form-siswa {
    grid-template-columns: 1fr 1fr;  /* dua kolom di layar lebar */
  }
}
```

**Visualisasi `repeat(auto-fit, minmax(180px, 1fr))`:**

```
 Layar lebar (900px) → muat 4 kolom
 ┌────────┬────────┬────────┬────────┐
 │ Cari   │ JK     │Jurusan │ Dari   │
 ├────────┼────────┼────────┼────────┤
 │ Sampai │ Urut   │ Arah   │        │
 ├────────┴────────┴────────┴────────┤
 │                  [Cari] [Atur ulang]│ ← grid-column: 1 / -1
 └───────────────────────────────────┘

 Layar HP (360px) → hanya muat 1 kolom
 ┌──────────────┐
 │ Cari         │
 │ JK           │
 │ ...          │
 │ [Cari][Atur] │
 └──────────────┘
 Tidak perlu media query! Grid menghitung sendiri jumlah kolom.
```

| Nilai                | Arti                                                       |
| -------------------- | ---------------------------------------------------------- |
| `minmax(180px, 1fr)` | Setiap kolom minimal 180px, maksimal 1 bagian ruang sisa   |
| `auto-fit`           | Buat kolom sebanyak yang muat                              |
| `grid-column: 1 / -1`| Membentang dari garis kolom pertama sampai garis terakhir  |

### 8.3 Ubah `form_siswa.php`

Bungkus setiap pasangan label–input dengan `.field` dan ganti `<p style="margin-top:16px">` dengan `.form-aksi`:

```php
<form method="post" class="form-siswa" id="form-siswa" novalidate>
    <div class="field">
        <label for="nama">Nama</label>
        <input type="text" id="nama" name="nama" maxlength="100" required
               value="<?= e($data['nama']) ?>">
        <div class="field__bantuan">
            <span class="field__error" data-error-untuk="nama"></span>
            <span data-counter-untuk="nama"></span>
        </div>
    </div>

    <div class="field">
        <label for="email">Email (opsional)</label>
        <input type="email" id="email" name="email" maxlength="150"
               value="<?= e($data['email']) ?>">
        <div class="field__bantuan">
            <span class="field__error" data-error-untuk="email"></span>
        </div>
    </div>

    <div class="field">
        <label for="jenis_kelamin">Jenis Kelamin</label>
        <select id="jenis_kelamin" name="jenis_kelamin" required>
            <option value="">-- Pilih --</option>
            <option value="L" <?= $data['jenis_kelamin'] === 'L' ? 'selected' : '' ?>>Laki-laki</option>
            <option value="P" <?= $data['jenis_kelamin'] === 'P' ? 'selected' : '' ?>>Perempuan</option>
        </select>
        <div class="field__bantuan">
            <span class="field__error" data-error-untuk="jenis_kelamin"></span>
        </div>
    </div>

    <div class="field">
        <label for="tanggal_lahir">Tanggal Lahir (opsional)</label>
        <input type="date" id="tanggal_lahir" name="tanggal_lahir"
               value="<?= e($data['tanggal_lahir']) ?>">
        <div class="field__bantuan">
            <span class="field__error" data-error-untuk="tanggal_lahir"></span>
        </div>
    </div>

    <div class="field">
        <label for="id_jurusan">Jurusan (opsional)</label>
        <select id="id_jurusan" name="id_jurusan">
            <option value="">-- Belum ada jurusan --</option>
            <?php foreach ($daftarJurusan as $j): ?>
                <option value="<?= (int) $j['id_jurusan'] ?>"
                    <?= (string) $data['id_jurusan'] === (string) $j['id_jurusan'] ? 'selected' : '' ?>>
                    <?= e($j['nama_jurusan']) ?>
                </option>
            <?php endforeach; ?>
        </select>
    </div>

    <div class="form-aksi">
        <button type="submit" class="btn"><?= e($labelTombol) ?></button>
        <a class="btn btn-abu" href="index.php">Batal</a>
    </div>
</form>
```

> Atribut `data-error-untuk`, `data-counter-untuk`, `id="form-siswa"`, dan `novalidate` disiapkan untuk validasi JavaScript di Modul 6. Untuk sekarang, wadah tersebut masih kosong dan tidak terlihat.

> **Penting:** `novalidate` mematikan pesan validasi bawaan browser. Jika belum mengerjakan Modul 6, hapus dulu `novalidate` agar `required` tetap bekerja. Validasi server di `validasiSiswa()` **tetap berjalan** apa pun yang terjadi di browser.

---

## 9. Tabel Responsif dan Badge

### 9.1 Ubah tabel di `index.php`

```php
<div class="tabel-wrap">
<table class="tabel" id="tabel-siswa">
    <thead>
        <tr>
            <th>No</th><th>Nama</th><th>Email</th><th>JK</th>
            <th>Tanggal Lahir</th><th>Jurusan</th><th>Rapor / Aksi</th>
        </tr>
    </thead>
    <tbody>
    <?php if ($jumlahSiswa === 0): ?>
        <tr><td colspan="7" class="tabel__kosong">Belum ada siswa yang cocok dengan pencarian atau filter.</td></tr>
    <?php endif; ?>

    <?php foreach ($daftarSiswa as $no => $row): ?>
        <tr>
            <td data-label="No"><?= ($halaman - 1) * $perHalaman + $no + 1 ?></td>
            <td data-label="Nama"><?= e($row['nama']) ?></td>
            <td data-label="Email"><?= e($row['email'] ?? '-') ?></td>
            <td data-label="JK">
                <?php if ($row['jenis_kelamin'] === 'L'): ?>
                    <span class="badge badge--l">Laki-laki</span>
                <?php else: ?>
                    <span class="badge badge--p">Perempuan</span>
                <?php endif; ?>
            </td>
            <td data-label="Tanggal Lahir"><?= e($row['tanggal_lahir'] ?? '-') ?></td>
            <td data-label="Jurusan"><?= e($row['nama_jurusan'] ?? 'Belum ada jurusan') ?></td>
            <td data-label="Aksi" class="aksi">
                <a class="btn" href="detail.php?id=<?= (int) $row['id_siswa'] ?>">Rapor</a>
                <a class="btn btn-ghost" href="edit.php?id=<?= (int) $row['id_siswa'] ?>">Edit</a>

                <form class="inline form-hapus" action="hapus.php" method="post"
                      data-nama="<?= e($row['nama']) ?>">
                    <input type="hidden" name="id_siswa" value="<?= (int) $row['id_siswa'] ?>">
                    <button type="submit" class="btn btn-hapus">Hapus</button>
                </form>
            </td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
</div>
```

> Atribut `onsubmit="return confirm(...)"` **dihapus** dan diganti kelas `form-hapus` + `data-nama`. Konfirmasinya akan dibuat ulang dengan JavaScript yang lebih rapi di Modul 6. Jika belum sampai Modul 6, biarkan `onsubmit` lama tetap ada.

Lakukan hal yang sama di `detail.php`: bungkus tabel rapor dengan `<div class="tabel-wrap">`, beri `class="tabel" id="tabel-rapor"`, dan tambahkan `data-label` (`Semester`, `Mata Pelajaran`, `Nilai`) pada setiap `<td>`.

### 9.2 CSS tabel dan badge

```css
/* ============ 8. TABEL ============ */
.tabel-wrap {
  overflow-x: auto;        /* tabel bisa digeser ke samping, halaman tidak ikut melebar */
  border: 1px solid var(--garis);
  border-radius: var(--radius);
  margin-top: var(--jarak-4);
}

.tabel {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

.tabel th,
.tabel td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--garis);
  vertical-align: middle;
}

.tabel th {
  position: sticky;
  top: 0;
  background: var(--permukaan-2);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--teks-redup);
}

.tabel tbody tr:nth-child(even) {
  background: var(--permukaan-2);   /* zebra: baris genap sedikit lebih gelap */
}

.tabel tbody tr:hover {
  background: rgb(37 99 235 / 0.06);
}

.tabel tbody tr:last-child td {
  border-bottom: 0;
}

.tabel__kosong {
  text-align: center;
  color: var(--teks-redup);
  padding: var(--jarak-5);
}

.aksi {
  white-space: nowrap;
}

/* ============ 9. BADGE ============ */
.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;   /* sudut sangat bulat = bentuk pil */
  font-size: 12px;
  font-weight: 600;
}

.badge--l {
  background: #dbeafe;
  color: #1e40af;
}

.badge--p {
  background: #fce7f3;
  color: #9d174d;
}

/* ============ 10. PAGINATION ============ */
.pagination {
  display: flex;
  gap: var(--jarak-2);
  align-items: center;
  justify-content: center;
  margin: var(--jarak-4) 0 0;
}

.pagination .nonaktif {
  opacity: 0.5;
  pointer-events: none;
}
```

### 9.3 Tabel menjadi kartu di HP (mobile)

```css
/* ============ 11. RESPONSIF ============ */
@media (max-width: 640px) {
  .container {
    margin: 0;
    padding: var(--jarak-4);
    border-radius: 0;
  }

  .topbar__link {
    display: none;            /* sisakan brand dan tombol tema di HP */
  }

  .tabel-wrap {
    border: 0;
    overflow: visible;
  }

  .tabel {
    min-width: 0;
  }

  .tabel thead {
    display: none;            /* judul kolom diganti data-label */
  }

  .tabel,
  .tabel tbody,
  .tabel tr,
  .tabel td {
    display: block;
    width: 100%;
  }

  .tabel tr {
    margin-bottom: var(--jarak-3);
    padding: var(--jarak-2) var(--jarak-3);
    border: 1px solid var(--garis);
    border-radius: var(--radius);
    background: var(--permukaan);
  }

  .tabel tbody tr:nth-child(even) {
    background: var(--permukaan);
  }

  .tabel td {
    display: flex;
    justify-content: space-between;
    gap: var(--jarak-3);
    border: 0;
    padding: 6px 0;
  }

  /* tampilkan isi data-label sebagai judul di kiri */
  .tabel td[data-label]::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--teks-redup);
  }

  .tabel td.aksi {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-top: var(--jarak-2);
  }

  .tabel td.aksi::before {
    display: none;
  }
}
```

**Cara kerja `content: attr(data-label)`:**

```
 HTML:  <td data-label="Email">andi@x.id</td>

 Layar lebar:          Layar HP (::before menampilkan atribut):
 ┌───────────┐         ┌──────────────────────────┐
 │ andi@x.id │         │ Email          andi@x.id │
 └───────────┘         └──────────────────────────┘
                         ▲ ::before       ▲ isi asli
```

> **Mobile first vs desktop first.** Modul ini memakai `max-width` (desktop dulu, lalu disesuaikan untuk HP) agar mudah dibandingkan dengan CSS lama. Pada proyek baru, biasakan **mobile first**: tulis gaya HP sebagai dasar, lalu tambahkan `@media (min-width: ...)` untuk layar besar seperti pada `.form-siswa`.

---

## 10. Tema Gelap

Variabel membuat tema gelap sangat mudah: cukup **ganti nilai variabel**, semua komponen ikut berubah.

```css
/* ============ 12. TEMA GELAP ============ */
[data-theme="dark"] {
  --bg: #0b1120;
  --permukaan: #111827;
  --permukaan-2: #1f2937;
  --garis: #334155;
  --teks: #e5e7eb;
  --teks-redup: #94a3b8;
  --warna-sukses-bg: #14532d;
  --warna-sukses-teks: #bbf7d0;
  --warna-gagal-bg: #7f1d1d;
  --warna-gagal-teks: #fecaca;
  --bayangan: none;
  color-scheme: dark;   /* input date, scrollbar ikut gelap */
}

[data-theme="dark"] .badge--l {
  background: #1e3a8a;
  color: #bfdbfe;
}

[data-theme="dark"] .badge--p {
  background: #831843;
  color: #fbcfe8;
}
```

```
 <html data-theme="dark">                          :root (terang)
           │                                            │
           ▼                                            ▼
  --bg: #0b1120  ──┐                          --bg: #f1f5f9 ──┐
  --teks: #e5e7eb ─┤                          --teks: #0f172a ─┤
                   ▼                                           ▼
     body { background: var(--bg); color: var(--teks); }   ← aturan yang SAMA
```

**Coba sekarang:** di DevTools tab Elements, klik kanan `<html>` → **Add attribute** → ketik `data-theme="dark"`. Seluruh halaman berubah gelap. Di Modul 6, tombol 🌙 akan melakukan ini secara otomatis dan menyimpannya di `localStorage`.

> Bonus: untuk mengikuti pengaturan sistem operasi tanpa JavaScript, gunakan `@media (prefers-color-scheme: dark) { :root { ... } }`.

---

## 11. Komponen Pendukung Modul 6

Bagian ini menyiapkan gaya untuk fitur JavaScript di Modul 6 (dialog hapus, saran pencarian, header tabel yang bisa diurutkan, dan ringkasan rapor).

```css
/* ============ 13. KOMPONEN UNTUK JAVASCRIPT ============ */
.tutup-pesan {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

/* dialog konfirmasi hapus */
.dialog {
  width: min(400px, 90vw);   /* 400px, tetapi tidak lebih dari 90% lebar layar */
  padding: var(--jarak-5);
  border: 0;
  border-radius: var(--radius);
  background: var(--permukaan);
  color: var(--teks);
  box-shadow: 0 20px 50px rgb(0 0 0 / 0.3);
}

.dialog::backdrop {
  background: rgb(15 23 42 / 0.5);  /* latar gelap di belakang dialog */
  backdrop-filter: blur(2px);
}

.dialog h2 {
  margin: 0 0 var(--jarak-2);
  font-size: 1.2rem;
}

.dialog__aksi {
  display: flex;
  justify-content: flex-end;
  gap: var(--jarak-2);
  margin-top: var(--jarak-5);
}

/* daftar saran pencarian langsung */
.cari-wrap {
  position: relative;        /* patokan posisi untuk .saran */
}

.saran {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 5;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  background: var(--permukaan);
  border: 1px solid var(--garis);
  border-radius: 6px;
  box-shadow: var(--bayangan);
  max-height: 240px;
  overflow-y: auto;
}

.saran:empty {
  display: none;             /* sembunyikan jika belum ada isi */
}

.saran a {
  display: block;
  padding: 8px 10px;
  color: var(--teks);
  text-decoration: none;
}

.saran a:hover,
.saran a:focus-visible {
  background: var(--permukaan-2);
  outline: none;
}

.saran small {
  color: var(--teks-redup);
}

/* header tabel yang bisa diklik untuk mengurutkan */
.bisa-urut {
  cursor: pointer;
  user-select: none;
}

.bisa-urut::after {
  content: " ↕";
  opacity: 0.4;
}

.bisa-urut[aria-sort="ascending"]::after {
  content: " ▲";
  opacity: 1;
}

.bisa-urut[aria-sort="descending"]::after {
  content: " ▼";
  opacity: 1;
}

/* kartu ringkasan rapor */
.ringkasan {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--jarak-3);
  margin-top: var(--jarak-4);
}

.ringkasan__item {
  padding: var(--jarak-3) var(--jarak-4);
  background: var(--permukaan-2);
  border: 1px solid var(--garis);
  border-radius: var(--radius);
}

.ringkasan__angka {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.ringkasan__label {
  font-size: 13px;
  color: var(--teks-redup);
}
```

Tambahkan dialog berikut di `footer.php`, tepat **setelah** `</main>`:

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

</body>
</html>
```

> Elemen `<dialog>` tersembunyi secara bawaan. Ia baru tampil ketika JavaScript memanggil `showModal()`.

---

## 12. Gaya Cetak Rapor (`@media print`)

Wali kelas sering perlu mencetak rapor dari `detail.php` (`Ctrl + P`). Tombol, filter, dan topbar tidak perlu ikut dicetak.

```css
/* ============ 14. CETAK ============ */
@media print {
  .topbar,
  .filters,
  .btn,
  .pagination,
  .pesan,
  .dialog {
    display: none !important;
  }

  body {
    background: #fff;
    color: #000;
    font-size: 12pt;
  }

  .container {
    max-width: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
  }

  .tabel-wrap {
    border: 0;
    overflow: visible;
  }

  .tabel {
    min-width: 0;
  }

  .tabel th,
  .tabel td {
    border: 1px solid #000;
    color: #000;
    background: #fff !important;
  }

  .tabel tr {
    break-inside: avoid;   /* satu baris tidak terpotong di dua halaman */
  }
}
```

| Properti                 | Fungsi saat dicetak                                           |
| ------------------------ | ------------------------------------------------------------- |
| `display: none`          | Menyembunyikan elemen yang hanya berguna di layar             |
| `!important`             | Memaksa aturan menang; di sini wajar karena khusus mode cetak |
| `break-inside: avoid`    | Mencegah baris/elemen terbelah ke halaman berikutnya          |

**Uji:** buka rapor seorang siswa → `Ctrl + P` → lihat pratinjau. Atau di DevTools: `Ctrl + Shift + P` → ketik **Emulate CSS print media type**.

---

## 13. Urutan Akhir `style.css`

```
 style.css
 ├── 1. Variabel (:root)
 ├── 2. Reset ringan
 ├── 3. Layout (topbar, container)
 ├── 4. Tombol
 ├── 5. Pesan
 ├── 6. Toolbar & filter
 ├── 7. Form
 ├── 8. Tabel
 ├── 9. Badge
 ├── 10. Pagination
 ├── 11. Responsif  (@media max-width: 640px)
 ├── 12. Tema gelap ([data-theme="dark"])
 ├── 13. Komponen untuk JavaScript
 └── 14. Cetak      (@media print)
```

> Urutan ini penting karena **cascade**: aturan umum di atas, aturan khusus (media query, tema, cetak) di bawah agar bisa menimpa aturan umum dengan specificity yang sama.

---

## 14. Rangkuman

| Teknik                   | Dipakai untuk                         | Contoh                                    |
| ------------------------ | ------------------------------------- | ----------------------------------------- |
| Custom properties        | Satu sumber warna/jarak, tema gelap   | `--warna-utama`, `var(--bg)`              |
| `box-sizing: border-box` | Lebar elemen mudah dihitung           | `*, *::before, *::after`                  |
| Flexbox                  | Topbar, toolbar, tombol aksi          | `justify-content: space-between`          |
| Grid                     | Filter, form dua kolom, ringkasan     | `repeat(auto-fit, minmax(180px, 1fr))`    |
| Media query              | Tabel kartu di HP, form dua kolom     | `@media (max-width: 640px)`               |
| Pseudo-class             | Interaksi dan status                  | `:hover`, `:focus-visible`, `:nth-child`  |
| Pseudo-element           | Label kartu, panah urut, backdrop     | `::before`, `::after`, `::backdrop`       |
| `attr()`                 | Mengambil nilai atribut HTML          | `content: attr(data-label)`               |
| Transition               | Perubahan halus                       | `transition: opacity .4s ease`            |
| `@media print`           | Rapor rapi saat dicetak               | Sembunyikan `.btn`, `.filters`            |
| BEM                      | Nama kelas teratur                    | `.topbar__brand`, `.badge--l`             |

---

## 15. Latihan

**Dasar**

1. Ubah `--warna-utama` menjadi hijau (`#16a34a`) dan `--warna-utama-gelap` menjadi `#15803d`. Amati komponen apa saja yang ikut berubah.
2. Hitung specificity selector berikut dan urutkan dari terkuat: `.filters label`, `#q`, `label`, `.tabel td.aksi`.
3. Tambahkan gaya `:hover` pada `.topbar__brand` yang mengubah warnanya menjadi `--warna-utama`.

**Menengah**

4. Buat badge untuk kolom **Jurusan**: siswa tanpa jurusan diberi badge abu-abu dengan kelas `.badge--kosong`.
5. Di `detail.php`, beri warna sel nilai: `< 75` merah, `>= 90` hijau. Buat kelas `.nilai--rendah` dan `.nilai--tinggi`, lalu pasang kelasnya dari PHP.
6. Ubah media query tabel kartu menjadi pendekatan **mobile first** (`min-width`).

**Lanjutan**

7. Tambahkan `@media (prefers-color-scheme: dark)` sehingga tema gelap otomatis aktif jika sistem operasi memakai mode gelap, kecuali pengguna memilih `data-theme="light"`.
8. Buat kop rapor yang **hanya muncul saat dicetak** (nama sekolah, logo, tanggal cetak) dengan kelas `.hanya-cetak`.

**Diskusi**

- Mengapa memakai `style="..."` di HTML menyulitkan pembuatan tema gelap?
- Kapan lebih tepat memakai Flexbox dan kapan Grid?

---

## 16. Kesalahan Umum

| Kesalahan                                         | Akibat                                          | Perbaikan                                                    |
| ------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| CSS tidak berubah setelah disimpan                | Browser memakai cache lama                      | `Ctrl + F5` (hard reload) atau centang **Disable cache** di DevTools |
| Menulis `var(warna-utama)`                        | Nilai tidak terbaca                             | Tulis lengkap dengan dua strip: `var(--warna-utama)`         |
| Lupa `<meta name="viewport">`                     | Media query tidak bekerja di HP                 | Pastikan meta viewport ada di `header.php`                   |
| Memakai `#id` untuk styling                       | Aturan sulit ditimpa                            | Gunakan kelas                                                |
| `outline: none` tanpa pengganti                   | Pengguna keyboard kehilangan petunjuk fokus     | Ganti dengan `box-shadow` atau `outline` lain                |
| Tabel melebar keluar layar                        | Seluruh halaman bisa digeser ke samping         | Bungkus dengan `.tabel-wrap { overflow-x: auto; }`           |
| Media query ditulis **di atas** aturan umum       | Aturan media query tertimpa                     | Letakkan media query di bagian bawah file                    |
| `position: absolute` pada `.saran` lari ke pojok  | Induknya belum punya `position`                 | Beri `position: relative` pada `.cari-wrap`                  |
| `data-label` tidak tampil di HP                   | Lupa menambahkan atribut pada `<td>`            | Setiap `<td>` harus punya `data-label`                       |

**Lanjut ke:** [Modul 6 — JavaScript Menengah](../javascript/modul_6_javascript_menengah.md)
