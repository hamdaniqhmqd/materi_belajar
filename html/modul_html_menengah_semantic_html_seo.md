# HTML Menengah — Semantic HTML dan Dasar SEO

**Mata pelajaran:** Pemrograman Web — RPL  
**Sasaran:** Siswa SMK yang telah mempelajari HTML dasar  
**Alat:** VS Code atau editor teks, browser, dan DevTools (`F12`)  
**Prasyarat:** Mengenal elemen, atribut, tautan, gambar, daftar, tabel, dan form HTML

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan perbedaan elemen semantik dan elemen generik.
2. Menyusun halaman menggunakan elemen semantik HTML yang sesuai.
3. Memilih heading, tautan, gambar, dan metadata yang membantu pengguna dan mesin pencari memahami halaman.
4. Membuat dokumen HTML yang memiliki judul halaman, deskripsi, URL kanonis, dan struktur bahasa yang tepat.
5. Menghindari praktik SEO yang menyesatkan dan memeriksa halaman dengan browser.

---

## 2. Apa Itu Semantic HTML?

HTML bukan hanya alat untuk membuat sesuatu terlihat tebal, besar, atau berada di bagian tertentu. HTML juga memberi **makna dan struktur** pada isi halaman.

**Semantic HTML** adalah penggunaan elemen HTML yang menjelaskan fungsi atau arti kontennya. Struktur yang jelas membantu browser, teknologi bantu seperti screen reader, developer lain, dan mesin pencari memahami halaman.

| Elemen | Makna / penggunaan umum |
| --- | --- |
| `<header>` | Bagian pengantar untuk halaman atau suatu bagian |
| `<nav>` | Kumpulan tautan navigasi utama |
| `<main>` | Konten utama halaman; gunakan satu `<main>` yang terlihat per halaman |
| `<article>` | Konten mandiri yang bisa dipahami sendiri, seperti artikel atau berita |
| `<section>` | Kelompok konten dengan satu tema, biasanya memiliki judul |
| `<aside>` | Konten samping yang berkaitan, seperti daftar bacaan lanjutan |
| `<footer>` | Informasi penutup untuk halaman atau suatu bagian |
| `<figure>` | Konten ilustrasi mandiri, seperti gambar atau diagram |
| `<figcaption>` | Keterangan untuk konten `<figure>` |
| `<time>` | Tanggal atau waktu yang dapat dibaca mesin |
| `<strong>` | Bagian yang penting atau sangat penting |
| `<em>` | Penekanan pada sebuah kata atau frasa |

Elemen generik seperti `<div>` dan `<span>` tetap berguna ketika tidak ada elemen yang lebih tepat, terutama untuk pengelompokan atau styling. Jangan memilih elemen semantik hanya demi kata kunci.

### 2.1 Semantic HTML dan elemen generik

**Kurang bermakna:**

```html
<div class="header">
  <div class="menu">...</div>
</div>
<div class="konten">...</div>
<div class="footer">...</div>
```

**Lebih jelas maknanya:**

```html
<header>
  <nav aria-label="Navigasi utama">...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

`<div>` juga tidak otomatis salah. Gunakan jika pengelompokan tersebut hanya diperlukan untuk layout dan tidak memiliki makna konten tersendiri.

---

## 3. Menyusun Struktur Halaman

### 3.1 Bagian halaman

```text
┌──────────────────────────┐
│ header                   │  Identitas / pengantar
│  └── nav                 │  Tautan navigasi
├──────────────────────────┤
│ main                     │  Satu konten utama halaman
│  ├── article / section   │  Isi dengan topik yang jelas
│  └── aside (opsional)    │  Konten pendukung
├──────────────────────────┤
│ footer                   │  Informasi penutup
└──────────────────────────┘
```

`<header>` dan `<footer>` dapat digunakan untuk halaman maupun bagian seperti `<article>`. Jangan menaruh konten utama di elemen yang dipilih hanya karena nama atau tampilannya.

### 3.2 Contoh artikel

```html
<main>
  <article>
    <header>
      <h1>Panduan Memulai JavaScript untuk Pemula</h1>
      <p>
        Diperbarui
        <time datetime="2026-10-22">22 Oktober 2026</time>
      </p>
    </header>

    <section aria-labelledby="persiapan">
      <h2 id="persiapan">Persiapan Belajar</h2>
      <p>Siapkan browser dan editor kode untuk mencoba contoh.</p>
    </section>

    <section aria-labelledby="contoh">
      <h2 id="contoh">Contoh Pertama</h2>
      <p>Kita akan menampilkan pesan sederhana di halaman.</p>
    </section>
  </article>
</main>
```

Gunakan `<section>` untuk mengelompokkan tema yang jelas, bukan sebagai pengganti `<div>` di setiap bagian. Gunakan `<article>` bila konten dapat berdiri sendiri.

### 3.3 Heading yang berurutan

Heading (`<h1>` sampai `<h6>`) menunjukkan hierarki topik, bukan sekadar ukuran huruf.

```text
h1  Judul utama halaman
├── h2  Topik utama
│   ├── h3  Subtopik
│   └── h3  Subtopik lain
└── h2  Topik utama berikutnya
```

- Pilih heading berdasarkan tingkat topik.
- Jangan melompati tingkat hanya demi ukuran teks. Gaya visual dapat diatur dengan CSS.
- Halaman umumnya memiliki satu judul utama `<h1>` yang jelas dan sesuai dengan konten.
- Heading yang ringkas membantu pembaca memindai halaman; jangan menjejalkan kata kunci.

---

## 4. Elemen HTML yang Sering Digunakan

### 4.1 Tautan yang jelas

```html
<a href="/panduan/git-dan-github">Baca panduan dasar Git dan GitHub</a>
```

Teks tautan sebaiknya menjelaskan tujuan tautan. Hindari teks seperti "klik di sini" jika tautan dapat dijelaskan dengan lebih spesifik. Tautan navigasi gunakan elemen `<a>` dengan alamat tujuan; untuk menjalankan tindakan pada halaman gunakan `<button>`.

### 4.2 Gambar dan teks alternatif

```html
<figure>
  <img
    src="/images/alur-belajar-git.png"
    alt="Diagram alur commit lokal yang dikirim ke repository GitHub"
    width="960"
    height="540"
  >
  <figcaption>Alur sederhana menyimpan dan mengirim perubahan dengan Git.</figcaption>
</figure>
```

- Tulis `alt` yang menggambarkan informasi atau fungsi gambar dalam konteksnya.
- Untuk gambar dekoratif yang tidak menambah informasi, gunakan `alt=""`.
- Jangan mengulang kata kunci atau menyalin seluruh caption ke `alt`.
- `width` dan `height` membantu browser menyediakan ruang sebelum gambar selesai dimuat.

### 4.3 Waktu yang dapat dipahami mesin

```html
<time datetime="2026-10-22">22 Oktober 2026</time>
```

Teks yang terlihat mudah dibaca manusia; nilai `datetime` menggunakan format tanggal/waktu yang sesuai agar program dapat mengolahnya.

---

## 5. SEO On-Page Dasar dengan HTML

**SEO (Search Engine Optimization)** adalah upaya membantu mesin pencari menemukan, memahami, dan menampilkan halaman yang relevan. HTML yang terstruktur baik adalah salah satu bagian dari SEO, tetapi tidak menjamin halaman akan mendapat peringkat tertentu.

### 5.1 Kerangka dokumen dan metadata

Elemen di dalam `<head>` memberi informasi tentang dokumen. Elemen tersebut umumnya tidak tampil sebagai konten utama halaman.

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Panduan Git dan GitHub untuk Pemula | Belajar RPL</title>
  <meta
    name="description"
    content="Pelajari repository, commit, branch, push, pull, dan Pull Request melalui panduan dasar Git dan GitHub."
  >
  <link rel="canonical" href="https://contoh.id/panduan/git-dan-github">
</head>
```

| Elemen / atribut | Fungsi dan praktik yang disarankan |
| --- | --- |
| `<!doctype html>` | Meminta browser menggunakan mode standar HTML |
| `<html lang="id">` | Menandai bahasa utama halaman; gunakan kode bahasa yang sesuai |
| `<meta charset="utf-8">` | Menetapkan encoding agar karakter ditampilkan dengan benar |
| `<meta name="viewport">` | Membantu halaman menyesuaikan lebar layar perangkat |
| `<title>` | Memberi judul dokumen yang spesifik dan sesuai isi; biasanya tampil sebagai judul tab dan dapat dipakai sebagai judul hasil pencarian |
| `meta name="description"` | Menyediakan ringkasan halaman; mesin pencari dapat memilih cuplikan lain jika lebih sesuai |
| `rel="canonical"` | Menunjukkan URL pilihan ketika konten yang sama tersedia melalui beberapa URL; gunakan URL lengkap yang benar |

Berikan judul dan deskripsi yang unik serta jujur untuk tiap halaman penting. Tidak ada panjang karakter yang menjamin tampilan tertentu di hasil pencarian karena mesin pencari dapat memotong atau memilih cuplikan yang berbeda.

`canonical` bukan pengganti pengalihan, dan bukan mekanisme untuk menyembunyikan halaman. Jangan memasang URL contoh pada situs nyata; ganti dengan URL halaman sebenarnya. Untuk halaman yang tidak memiliki duplikat, canonical biasanya mengarah ke URL halaman itu sendiri.

### 5.2 Heading dan isi yang relevan

- Berikan judul halaman yang mencerminkan isi sebenarnya.
- Susun subtopik dengan heading yang logis.
- Tulis informasi yang bermanfaat untuk manusia, jelas, dan benar.
- Gunakan istilah yang relevan secara alami; tidak perlu mengulang kata kunci secara berlebihan.
- Pastikan konten penting tersedia dalam HTML halaman dan tidak hanya dalam gambar.

### 5.3 Tautan internal dan eksternal

Tautan membantu pengunjung berpindah halaman dan membantu mesin pencari menemukan halaman lain.

```html
<nav aria-label="Navigasi utama">
  <a href="/">Beranda</a>
  <a href="/materi/html-menengah">Materi HTML Menengah</a>
</nav>
```

- Pastikan tautan mengarah ke halaman yang benar dan dapat diakses.
- Gunakan teks tautan yang menjelaskan tujuan.
- Tautkan halaman terkait jika bermanfaat bagi pembaca.
- Jangan membuat tautan tersembunyi atau tautan hanya untuk memanipulasi peringkat.

### 5.4 Open Graph untuk pratinjau berbagi

Metadata Open Graph sering digunakan aplikasi sosial atau pesan saat membuat pratinjau tautan. Ini membantu tampilan berbagi, tetapi bukan pengganti struktur konten dan bukan jaminan peningkatan peringkat mesin pencari.

```html
<meta property="og:type" content="article">
<meta property="og:title" content="Panduan Git dan GitHub untuk Pemula">
<meta property="og:description" content="Pelajari dasar Git dan GitHub melalui contoh yang mudah dipraktikkan.">
<meta property="og:url" content="https://contoh.id/panduan/git-dan-github">
<meta property="og:image" content="https://contoh.id/images/pratinjau-git.jpg">
```

Gunakan gambar yang benar-benar tersedia, URL absolut, dan metadata yang sesuai isi halaman. Ganti semua URL contoh sebelum digunakan.

### 5.5 Structured data: pengantar

Structured data adalah data terstruktur yang menjelaskan informasi halaman dalam format yang dapat diproses mesin. Salah satu formatnya adalah JSON-LD. Penggunaannya harus menggambarkan konten yang benar-benar terlihat di halaman dan mengikuti kebijakan mesin pencari.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Panduan Git dan GitHub untuk Pemula",
  "inLanguage": "id"
}
</script>
```

Contoh ini hanya pengantar. Jangan menambahkan penilaian, ulasan, harga, penulis, atau tanggal yang tidak benar. Structured data yang valid tidak menjamin hasil kaya (rich result) atau peringkat tertentu. Pelajari jenis dan properti yang sesuai sebelum menerapkannya.

### 5.6 Yang tidak dilakukan oleh HTML saja

HTML tidak otomatis:

- Menjamin halaman terindeks atau muncul di posisi tertentu.
- Mempercepat situs jika gambar, CSS, JavaScript, server, atau jaringan lambat.
- Menggantikan konten yang berguna, navigasi baik, dan pengalaman pengguna yang layak.
- Menyembunyikan informasi rahasia. `noindex` bukan pengaman akses; gunakan autentikasi dan kontrol akses untuk konten privat.

Kinerja, aksesibilitas, kualitas konten, keamanan, dan pengaturan server juga penting. Gunakan Search Console atau alat audit resmi bila tersedia, tetapi tetap tinjau halaman secara langsung.

---

## 6. Contoh Halaman Semantik Siap Dikembangkan

Contoh berikut menggabungkan struktur semantik dan metadata. Ganti domain, judul, deskripsi, dan isi contoh dengan informasi halaman sebenarnya.

```html
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Panduan Belajar HTML Semantik | Belajar RPL</title>
  <meta
    name="description"
    content="Kenali elemen semantik HTML dan praktik dasar untuk membuat halaman lebih terstruktur."
  >
  <link rel="canonical" href="https://contoh.id/panduan/html-semantik">
</head>
<body>
  <header>
    <a href="/" aria-label="Belajar RPL, beranda">Belajar RPL</a>
    <nav aria-label="Navigasi utama">
      <a href="/materi">Materi</a>
      <a href="/tentang">Tentang</a>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h1>Panduan Belajar HTML Semantik</h1>
        <p>
          Materi untuk pemula, diperbarui
          <time datetime="2026-10-22">22 Oktober 2026</time>.
        </p>
      </header>

      <section aria-labelledby="pengertian">
        <h2 id="pengertian">Apa Itu HTML Semantik?</h2>
        <p>
          HTML semantik menggunakan elemen yang menjelaskan fungsi dan
          struktur konten halaman.
        </p>
      </section>

      <section aria-labelledby="contoh-elemen">
        <h2 id="contoh-elemen">Contoh Elemen Semantik</h2>
        <figure>
          <img
            src="/images/struktur-html.png"
            alt="Diagram hubungan header, navigasi, konten utama, dan footer"
            width="800"
            height="450"
          >
          <figcaption>Bagian umum pada struktur halaman web.</figcaption>
        </figure>
        <p>
          Baca juga
          <a href="/materi/css-dasar">materi CSS dasar</a>
          untuk mempelajari tampilan halaman.
        </p>
      </section>
    </article>
  </main>

  <footer>
    <p>&copy; 2026 Belajar RPL</p>
  </footer>
</body>
</html>
```

---

## 7. Praktik Mandiri — Halaman Artikel Materi

Buat satu halaman artikel bertema teknologi atau pemrograman. Gunakan topik yang boleh dipublikasikan dan sumber informasi yang dapat diperiksa.

### Persyaratan

1. Gunakan `<!doctype html>`, `lang`, `charset`, dan `viewport`.
2. Buat `<header>`, `<nav>`, satu `<main>`, konten `<article>`, beberapa `<section>`, dan `<footer>`.
3. Buat judul `<title>`, satu `<h1>`, heading subtopik yang berurutan, dan deskripsi yang sesuai.
4. Tambahkan minimal satu tautan internal dengan teks yang menjelaskan tujuannya.
5. Tambahkan satu gambar dengan `alt` yang sesuai atau `alt=""` jika dekoratif.
6. Gunakan `<time datetime="...">` untuk tanggal bila ada tanggal publikasi.
7. Tambahkan canonical hanya jika kamu mengetahui URL final yang benar; jangan membiarkan URL contoh di situs nyata.
8. Pastikan isi, judul, gambar, dan metadata menyampaikan informasi yang sama dan benar.

### Pemeriksaan

- Buka halaman di browser dan pastikan elemen terlihat serta tautan bekerja.
- Gunakan **View Page Source** untuk memeriksa `<title>` dan metadata.
- Periksa heading dari `<h1>` sampai subtopik: apakah urutannya menggambarkan struktur?
- Tinjau halaman tanpa CSS: apakah isi dan urutannya tetap masuk akal?
- Jalankan validator HTML seperti [Nu HTML Checker](https://validator.w3.org/nu/) bila tersedia.
- Perbaiki error validasi yang kamu pahami, lalu uji ulang.

### Kriteria keberhasilan

| Kriteria | Ya / Belum |
| --- | --- |
| Elemen semantik sesuai dengan fungsi konten | |
| Judul dan deskripsi halaman spesifik serta akurat | |
| Heading menggambarkan hierarki isi | |
| Gambar memiliki teks alternatif yang tepat | |
| Tautan memiliki tujuan dan teks yang jelas | |
| HTML terbuka tanpa error penting pada validator | |
| Tidak ada URL contoh atau klaim yang tidak benar | |

---

## 8. Kesalahan Umum

| Kesalahan | Mengapa bermasalah | Perbaikan |
| --- | --- | --- |
| Memakai `<section>` untuk semua wadah | Tidak semua kelompok konten merupakan bagian bertema | Gunakan `<div>` untuk kelompok tanpa makna khusus |
| Heading dipilih berdasarkan ukuran | Struktur dokumen menjadi tidak logis | Pilih level menurut hierarki; atur ukuran dengan CSS |
| Semua halaman memakai judul dan deskripsi yang sama | Ringkasan tidak mencerminkan isi setiap halaman | Tulis metadata yang unik dan akurat |
| `alt="gambar"` pada semua gambar | Tidak menjelaskan informasi yang disampaikan gambar | Deskripsikan fungsi/konteks, atau gunakan `alt=""` untuk dekoratif |
| Mengulang kata kunci berkali-kali | Mengganggu pembaca dan dapat dianggap manipulatif | Tulis alami untuk menjawab kebutuhan pembaca |
| Menambahkan banyak `<h1>` untuk SEO | Kuantitas heading tidak menggantikan struktur yang jelas | Buat satu judul utama yang tepat untuk halaman |
| Menganggap `noindex` melindungi halaman privat | Instruksi indeks bukan kontrol akses | Gunakan login dan izin akses yang benar |
| Membiarkan domain contoh pada canonical/OG | Dapat mengarahkan mesin pencari atau aplikasi berbagi ke URL yang salah | Ganti dengan URL halaman yang benar atau jangan terbitkan contoh |

---

## 9. Ringkasan

- Semantic HTML memberi makna pada struktur konten; pilih elemen berdasarkan fungsinya.
- Heading, tautan deskriptif, gambar dengan teks alternatif, dan tanggal yang ditandai dengan tepat membantu pengguna dan mesin memahami halaman.
- Judul, deskripsi, bahasa halaman, viewport, dan canonical adalah bagian metadata yang perlu diisi secara tepat.
- Open Graph membantu pratinjau berbagi. Structured data harus benar-benar sesuai dengan konten yang terlihat.
- Praktik HTML/SEO yang baik membantu pemahaman dan penemuan halaman, tetapi tidak menjamin peringkat atau pengindeksan.
- Selalu validasi HTML dan tinjau halaman untuk manusia, bukan hanya untuk mesin pencari.
