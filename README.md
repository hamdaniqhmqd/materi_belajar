# Materi Belajar Pemrograman — RPL SMK

Kumpulan modul pembelajaran untuk siswa **Rekayasa Perangkat Lunak (RPL)**, dimulai dari dasar berpikir komputasional sampai membangun aplikasi web PHP & MySQL yang interaktif.

**Sasaran:** Siswa SMK kelas X (semester 1–2) RPL
**Bahasa pengantar:** Bahasa Indonesia
**Format:** Setiap modul tersedia dalam Markdown (`.md`) dan PDF

---

## Daftar Isi

1. [Daftar Modul yang Tersedia](#1-daftar-modul-yang-tersedia)
2. [Peta Jalur Belajar](#2-peta-jalur-belajar)
3. [Rekomendasi Silabus](#3-rekomendasi-silabus)
4. [Materi Mengulang (Review)](#4-materi-mengulang-review)
   - [4.1 Computational Thinking](#41-mengulang-computational-thinking)
   - [4.2 Algoritma dan Pemrograman Dasar](#42-mengulang-algoritma-dan-pemrograman-dasar)
   - [4.3 Git dan GitHub](#43-mengulang-git-dan-github)
5. [Ringkasan Materi Pendukung](#5-ringkasan-materi-pendukung)
6. [Cara Menggunakan Repository Ini](#6-cara-menggunakan-repository-ini)

---

## 1. Daftar Modul yang Tersedia

| Kelompok               | Modul                                                                                                   | Isi singkat                                                 | PDF |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --- |
| Pengenalan Pemrograman | [Modul 1 — Pemrograman & Computational Thinking](pengenalan_pemrograman/modul_1_pemrograman_computational_thinking.md) | Komputer, program, bahasa pemrograman, 4 pilar CT           | [PDF](pengenalan_pemrograman/pdf/modul_1_pemrograman_computational_thinking.pdf) |
| Pengenalan Pemrograman | [Modul 2 — Algoritma & Pemrograman Dasar](pengenalan_pemrograman/modul_2_algoritma_pemrograman_dasar.md) | Pseudocode, flowchart, variabel, percabangan, perulangan, array, fungsi | [PDF](pengenalan_pemrograman/pdf/modul_2_algoritma_pemrograman_dasar.pdf) |
| Pengenalan Pemrograman | [Modul 3 — Dasar Git dan GitHub](pengenalan_pemrograman/modul_3_git_dan_github_dasar.md) | Repository, commit, branch, remote, push/pull, kolaborasi, Pull Request | [PDF](pengenalan_pemrograman/pdf/modul_3_git_dan_github_dasar.pdf) |
| AI & Pemrograman       | [AI Basics — Prompting AI untuk Belajar Pemrograman](ai/modul_ai_basics_prompting_ai_untuk_belajar.md) | Tutor AI, prompt belajar, debugging, latihan, verifikasi, privasi | [PDF](ai/modul_ai_basics_prompting_ai_untuk_belajar.pdf) |
| Database               | [Modul 1 — DDL](mysql/modul_1_ddl.md)                                                                   | `CREATE`, `ALTER`, `DROP`, tipe data, relasi                | [PDF](mysql_pdf/modul_1_ddl.pdf) |
| Database               | [Modul 2 — DML](mysql/modul_2_dml.md)                                                                   | `INSERT`, `UPDATE`, `DELETE`                                | [PDF](mysql_pdf/modul_2_dml.pdf) |
| Database               | [Modul 3 — DQL](mysql/modul_3_dql.md)                                                                   | `SELECT`, `WHERE`, `JOIN`, agregasi                         | [PDF](mysql_pdf/modul_3_dql.pdf) |
| PHP & MySQL            | [Modul 4 — PHP & MySQL](php/modul_4_php_mysql.md)                                                       | Proyek CRUD `crud_siswa` dengan PDO dan OOP                 | [PDF](php/modul_4_php_mysql.pdf) |
| Front End Menengah     | [HTML Menengah — Semantic HTML dan Dasar SEO](html/modul_html_menengah_semantic_html_seo.md) | Elemen semantik, struktur heading, metadata, tautan, gambar, dan SEO on-page | [PDF](html/modul_html_menengah_semantic_html_seo.pdf) |
| Front End Menengah     | [Modul 5 — CSS Menengah](css/modul_5_css_menengah.md)                                                   | Variabel CSS, Flexbox, Grid, responsif, tema gelap, cetak   | [PDF](css/modul_5_css_menengah.pdf) |
| Front End Menengah     | [Modul 6 — JavaScript Menengah](javascript/modul_6_javascript_menengah.md)                              | DOM, event, validasi, `localStorage`, `fetch`, JSON         | [PDF](javascript/modul_6_javascript_menengah.pdf) |

> Modul 5 dan 6 **melanjutkan proyek `crud_siswa` dari Modul 4**. Kerjakan berurutan: Modul 4 → Modul 5 (tampilan) → Modul 6 (interaksi).

---

## 2. Peta Jalur Belajar

```
                         ┌───────────────────────────────┐
                         │   PENGENALAN PEMROGRAMAN      │
                         │ 1. Pemrograman & CT           │
                         │ 2. Algoritma & Pemrograman    │
                         │ 3. Text Editor                │
                         │ 4. Terminal / CMD             │
                         │ 5. Git & GitHub               │
                         └───────────────┬───────────────┘
                                         │
                 ┌───────────────────────┼────────────────────────┐
                 ▼                       ▼                        ▼
       ┌──────────────────┐   ┌────────────────────┐   ┌────────────────────┐
       │  UI/UX DASAR     │   │ FRONT END BASIC    │   │ AI BASICS /        │
       │ Riset, wireframe,│──▶│ HTML → CSS → JS    │   │ PROMPTING AI       │
       │ prototipe Figma  │   │                    │   │ (dipakai di semua  │
       └──────────────────┘   └─────────┬──────────┘   │  tahap sebagai     │
                                        │              │  asisten belajar)  │
                                        ▼              └────────────────────┘
                              ┌────────────────────┐
                              │ DATABASE BASIC     │
                              │ DDL → DML → DQL    │
                              └─────────┬──────────┘
                                        ▼
                              ┌────────────────────┐
                              │ PHP & MySQL        │
                              │ Modul 4: crud_siswa│
                              └─────────┬──────────┘
                                        ▼
                              ┌────────────────────┐
                              │ FRONT END MENENGAH │
                              │ Modul 5: CSS       │
                              │ Modul 6: JavaScript│
                              └─────────┬──────────┘
                                        ▼
                              ┌────────────────────┐
                              │ PROYEK AKHIR       │
                              │ Aplikasi web utuh  │
                              │ + dipublikasikan   │
                              │   di GitHub        │
                              └────────────────────┘
```

**Satu proyek, banyak keterampilan.** Proyek `crud_siswa` dipakai berulang agar siswa melihat hubungan antar materi:

```
 Algoritma (Modul 2) ──▶ logika validasi & perulangan data
 Database (DDL–DQL)  ──▶ tabel siswa, jurusan, nilai
 PHP (Modul 4)       ──▶ CRUD + rapor
 CSS (Modul 5)       ──▶ tampilan responsif + tema gelap
 JS  (Modul 6)       ──▶ validasi, pencarian langsung, dialog
 Git & GitHub        ──▶ menyimpan setiap tahap sebagai commit
```

---

## 3. Rekomendasi Silabus

Asumsi: **1 pertemuan = 4 JP × 45 menit**. Sesuaikan dengan kalender sekolah.

### 3.1 Pengenalan Pemrograman (± 10 pertemuan)

| No | Materi                                         | Pertemuan | Sub-topik utama                                                                 | Output siswa                                     |
| -- | ---------------------------------------------- | :-------: | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1  | Mengenal Pemrograman & Computational Thinking  | 2         | Komputer & IPO, program, bahasa pemrograman, compiler/interpreter, 4 pilar CT   | Lembar analisis CT untuk masalah sehari-hari     |
| 2  | Algoritma & Pemrograman Dasar                  | 3         | Narasi, pseudocode, flowchart, variabel, tipe data, operator, percabangan, perulangan, array, fungsi | Flowchart + program kasir kantin |
| 3  | Mahir Menggunakan Text Editor                  | 1         | Instalasi VS Code, explorer, ekstensi, shortcut, multi-cursor, format, Emmet    | Workspace rapi + daftar shortcut pribadi         |
| 4  | Terminal / CMD untuk Development               | 1         | Path, `cd`, `dir`/`ls`, `mkdir`, `copy`, `del`, terminal VS Code, `php -v`, `node -v` | Struktur folder proyek dibuat lewat terminal |
| 5  | Git & GitHub                                   | 3         | Konsep version control, `init`–`commit`, branch, merge, remote, push/pull, README, kolaborasi | Repository GitHub berisi tugas sebelumnya |

**Modul tersedia:** [Modul 1](pengenalan_pemrograman/modul_1_pemrograman_computational_thinking.md), [Modul 2](pengenalan_pemrograman/modul_2_algoritma_pemrograman_dasar.md), [Modul 3 — Git dan GitHub](pengenalan_pemrograman/modul_3_git_dan_github_dasar.md), [AI Basics — Prompting AI untuk Belajar Pemrograman](ai/modul_ai_basics_prompting_ai_untuk_belajar.md)

### 3.2 UI/UX Dasar (± 5 pertemuan)

| No | Materi                              | Pertemuan | Sub-topik utama                                                           | Output siswa                               |
| -- | ----------------------------------- | :-------: | ------------------------------------------------------------------------- | ------------------------------------------ |
| 1  | Pengantar UI vs UX                  | 1         | Perbedaan UI/UX, contoh aplikasi baik/buruk, peran UI/UX designer         | Analisis 2 aplikasi favorit                |
| 2  | Riset Pengguna & User Flow          | 1         | Persona, wawancara singkat, user journey, user flow                       | Persona + user flow aplikasi data siswa    |
| 3  | Prinsip Desain Visual               | 1         | Hierarki, kontras, perataan, jarak (whitespace), warna, tipografi, konsistensi | Moodboard dan palet warna              |
| 4  | Wireframe & Prototipe (Figma)       | 1         | Low-fi vs hi-fi, frame, auto layout, komponen, prototipe klik             | Wireframe halaman daftar & form siswa      |
| 5  | Usability Testing & Aksesibilitas   | 1         | Uji 5 pengguna, kontras warna, ukuran sentuh, label form                  | Laporan uji + revisi desain                |

### 3.3 Front End Basic (± 12 pertemuan)

| No | Materi                 | Pertemuan | Sub-topik utama                                                                                     | Output siswa                          |
| -- | ---------------------- | :-------: | --------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1  | Belajar Dasar HTML     | 4         | Struktur dokumen, heading, paragraf, link, gambar, list, tabel, form, elemen semantik, aksesibilitas | Halaman profil diri (multi-halaman)  |
| 2  | Belajar Dasar CSS      | 4         | Selector, warna & satuan, box model, display, position, Flexbox dasar, media query dasar            | Profil diri yang responsif           |
| 3  | Belajar JavaScript Basic | 4       | Variabel, tipe data, operator, kondisi, perulangan, fungsi, array, objek, DOM & event dasar         | Kalkulator nilai / kuis sederhana    |

**Materi front end menengah:** [HTML Semantik dan Dasar SEO](html/modul_html_menengah_semantic_html_seo.md), [Modul 5 — CSS Menengah](css/modul_5_css_menengah.md), dan [Modul 6 — JavaScript Menengah](javascript/modul_6_javascript_menengah.md). HTML memperkuat struktur dan metadata; CSS dan JavaScript melanjutkan proyek `crud_siswa` setelah PHP.

### 3.4 AI Basics / Prompting AI for Programming (± 4 pertemuan)

| No | Materi                              | Pertemuan | Sub-topik utama                                                                    | Output siswa                                  |
| -- | ----------------------------------- | :-------: | ---------------------------------------------------------------------------------- | --------------------------------------------- |
| 1  | Mengenal AI & LLM                   | 1         | Apa itu AI, machine learning, LLM; contoh asisten AI; kelebihan & keterbatasan (halusinasi) | Rangkuman: kapan AI membantu, kapan tidak |
| 2  | Menyusun Prompt yang Baik           | 1         | Struktur prompt (peran, konteks, tugas, batasan, format), iterasi prompt            | 5 prompt sebelum–sesudah perbaikan            |
| 3  | AI untuk Belajar Pemrograman        | 1         | Menjelaskan kode, mencari bug, membuat contoh, membuat soal latihan, code review   | Log belajar dengan AI pada tugas `crud_siswa` |
| 4  | Etika, Keamanan & Verifikasi        | 1         | Kejujuran akademik, data pribadi & password, lisensi, **menguji** kode dari AI     | Checklist verifikasi kode AI                  |

**Modul tersedia:** [AI Basics — Prompting AI untuk Belajar Pemrograman](ai/modul_ai_basics_prompting_ai_untuk_belajar.md) ([PDF](ai/modul_ai_basics_prompting_ai_untuk_belajar.pdf))

### 3.5 PHP & MySQL / Database Basic (± 14 pertemuan)

| No | Materi                     | Pertemuan | Sub-topik utama                                                        | Output siswa                        |
| -- | -------------------------- | :-------: | ---------------------------------------------------------------------- | ----------------------------------- |
| 1  | Konsep Database & DDL      | 3         | Tabel, kolom, tipe data, primary/foreign key, relasi, `CREATE`/`ALTER` | Database `db_sekolah`               |
| 2  | DML                        | 2         | `INSERT`, `UPDATE`, `DELETE`, integritas data                          | Data contoh siswa, jurusan, nilai   |
| 3  | DQL                        | 3         | `SELECT`, `WHERE`, `ORDER BY`, `JOIN`, `GROUP BY`, agregasi            | Kumpulan query laporan              |
| 4  | PHP & MySQL (CRUD)         | 6         | Dasar PHP, PDO, prepared statement, validasi, OOP repository, filter, pagination | Aplikasi `crud_siswa`     |

**Modul tersedia:** [DDL](mysql/modul_1_ddl.md), [DML](mysql/modul_2_dml.md), [DQL](mysql/modul_3_dql.md), [PHP & MySQL](php/modul_4_php_mysql.md)

---

## 4. Materi Mengulang (Review)

Bagian ini dipakai di awal pertemuan atau sebelum ulangan untuk **mengingat kembali** materi. Setiap bagian berisi peta konsep, ringkasan, aktivitas singkat, dan kuis.

### 4.1 Mengulang Computational Thinking

> Materi lengkap: [Modul 1 — Pemrograman & Computational Thinking](pengenalan_pemrograman/modul_1_pemrograman_computational_thinking.md)

**Peta konsep:**

```
                       COMPUTATIONAL THINKING
                  "Berpikir seperti ilmuwan komputer"
                                 │
     ┌───────────────┬───────────┴───────────┬──────────────────┐
     ▼               ▼                       ▼                  ▼
 DEKOMPOSISI     PENGENALAN POLA         ABSTRAKSI          ALGORITMA
 Pecah masalah   Cari kesamaan /         Ambil yang penting, Susun langkah
 besar → kecil   pengulangan             buang yang tidak    yang urut & jelas
     │               │                       │                  │
     ▼               ▼                       ▼                  ▼
 "Aplikasi data  "Tambah, ubah, hapus    "Siswa cukup: nama, "1. Ambil data
  siswa" →        siswa punya pola        email, JK, tgl      2. Validasi
  daftar, tambah, sama: form → validasi   lahir, jurusan.     3. Simpan
  edit, hapus,    → simpan"               Hobi & warna        4. Tampilkan
  rapor                                   favorit tidak perlu" pesan"
```

**Ringkasan satu baris:**

| Pilar            | Pertanyaan kunci                          | Kata kunci   |
| ---------------- | ----------------------------------------- | ------------ |
| Dekomposisi      | "Bisa dipecah jadi bagian apa saja?"      | Memecah      |
| Pengenalan pola  | "Apa yang mirip / berulang?"              | Kesamaan     |
| Abstraksi        | "Informasi apa yang benar-benar penting?" | Menyaring    |
| Algoritma        | "Apa langkah-langkahnya, urut dari awal?" | Langkah      |

**Aktivitas 15 menit — "Pesta Ulang Tahun Kelas":**

Kelompok 4 orang menganalisis rencana pesta ulang tahun teman sekelas dengan 4 pilar:

```
 ┌───────────────────────┬───────────────────────────────────────────┐
 │ Dekomposisi           │ ........................................  │
 ├───────────────────────┼───────────────────────────────────────────┤
 │ Pengenalan pola       │ ........................................  │
 ├───────────────────────┼───────────────────────────────────────────┤
 │ Abstraksi             │ ........................................  │
 ├───────────────────────┼───────────────────────────────────────────┤
 │ Algoritma (5 langkah) │ 1. ...  2. ...  3. ...  4. ...  5. ...    │
 └───────────────────────┴───────────────────────────────────────────┘
```

**Kuis kilat:**

1. Membagi tugas membuat website menjadi halaman beranda, profil, dan kontak adalah pilar ...
2. Menyadari bahwa menghitung rata-rata nilai Matematika dan IPA memakai cara yang sama adalah pilar ...
3. Peta jalur KRL yang tidak menampilkan jarak sebenarnya adalah contoh ...
4. Resep membuat mi instan adalah contoh ...
5. Sebutkan 3 komponen model IPO beserta contohnya pada mesin ATM.

<details>
<summary>Kunci jawaban</summary>

1. Dekomposisi
2. Pengenalan pola
3. Abstraksi
4. Algoritma
5. Input: kartu & PIN; Proses: memeriksa saldo & PIN; Output: uang & struk.

</details>

### 4.2 Mengulang Algoritma dan Pemrograman Dasar

> Materi lengkap: [Modul 2 — Algoritma & Pemrograman Dasar](pengenalan_pemrograman/modul_2_algoritma_pemrograman_dasar.md)

**Peta konsep:**

```
                         ALGORITMA
                             │
        ┌────────────────────┼─────────────────────┐
        ▼                    ▼                     ▼
   BENTUK PENULISAN     BAHAN DASAR           STRUKTUR KONTROL
   • Narasi             • Variabel            • Runtunan (sequence)
   • Pseudocode         • Tipe data           • Percabangan (if / switch)
   • Flowchart          • Operator            • Perulangan (for / while)
                        • Array
                        • Fungsi
```

**Simbol flowchart yang wajib hafal:**

```
  ( Mulai )     Terminator  : awal / akhir
  /  Input /    Input/Output: baca atau tampilkan data
  [ Proses ]    Proses      : perhitungan / penugasan
  < Kondisi >   Decision    : pilihan Ya / Tidak
     ──▶        Flow line   : arah alur
```

**Tiga struktur kontrol dalam satu gambar:**

```
   RUNTUNAN              PERCABANGAN                 PERULANGAN
   ┌─────┐               ┌──────────┐                ┌─────────────┐
   │  A  │               │ nilai≥75?│                │ i ← 1       │
   └──┬──┘               └──┬────┬──┘                └──────┬──────┘
      ▼                  Ya │    │ Tidak                    ▼
   ┌─────┐                  ▼    ▼                    ┌──────────┐ Tidak
   │  B  │            "Tuntas" "Remedial"       ┌───▶│ i ≤ 5 ?  │──────▶ selesai
   └──┬──┘                  │    │              │    └────┬─────┘
      ▼                     └──┬─┘              │         │ Ya
   ┌─────┐                     ▼                │    ┌────▼─────┐
   │  C  │                  lanjut              │    │ cetak i  │
   └─────┘                                      │    │ i ← i+1  │
                                                └────┴──────────┘
```

**Kartu contekan sintaks (pseudocode → JavaScript → PHP):**

| Konsep        | Pseudocode                    | JavaScript                         | PHP                                 |
| ------------- | ----------------------------- | ---------------------------------- | ----------------------------------- |
| Variabel      | `nilai ← 80`                  | `let nilai = 80;`                  | `$nilai = 80;`                      |
| Tampilkan     | `TAMPILKAN nilai`             | `console.log(nilai);`              | `echo $nilai;`                      |
| Percabangan   | `JIKA nilai ≥ 75 MAKA ...`    | `if (nilai >= 75) { ... }`         | `if ($nilai >= 75) { ... }`         |
| Perulangan    | `UNTUK i ← 1 SAMPAI 5`        | `for (let i = 1; i <= 5; i++)`     | `for ($i = 1; $i <= 5; $i++)`       |
| Array         | `nilai ← [80, 90, 75]`        | `const nilai = [80, 90, 75];`      | `$nilai = [80, 90, 75];`            |
| Fungsi        | `FUNGSI luas(p, l)`           | `function luas(p, l) { ... }`      | `function luas($p, $l) { ... }`     |

**Latihan tracing (isi tabel):**

```
 total ← 0
 UNTUK i ← 1 SAMPAI 4
     JIKA i MOD 2 = 0 MAKA
         total ← total + i
 TAMPILKAN total
```

| i | i MOD 2 = 0? | total |
| - | ------------ | ----- |
| 1 |              |       |
| 2 |              |       |
| 3 |              |       |
| 4 |              |       |

**Kuis kilat:**

1. Simbol flowchart berbentuk belah ketupat dipakai untuk ...
2. Apa perbedaan `while` dan `do-while`?
3. Indeks elemen pertama pada array adalah ...
4. Berapa hasil tracing di atas?
5. Buat pseudocode untuk menentukan bilangan terbesar dari 3 bilangan.

<details>
<summary>Kunci jawaban</summary>

1. Keputusan / kondisi (decision).
2. `while` memeriksa kondisi **sebelum** menjalankan isi (bisa 0 kali); `do-while` menjalankan isi dulu **minimal 1 kali** baru memeriksa kondisi.
3. `0`
4. `6` (2 + 4)
5. Contoh:
   ```
   BACA a, b, c
   terbesar ← a
   JIKA b > terbesar MAKA terbesar ← b
   JIKA c > terbesar MAKA terbesar ← c
   TAMPILKAN terbesar
   ```

</details>

### 4.3 Mengulang Git dan GitHub

**Mengapa Git?**

```
 TANPA GIT                                 DENGAN GIT
 tugas.php                                 tugas.php   + riwayat commit:
 tugas_revisi.php                            ● a1b2c3  "Tambah form siswa"
 tugas_revisi_FINAL.php                      ● d4e5f6  "Perbaiki validasi email"
 tugas_revisi_FINAL_banget.php               ● 7g8h9i  "Tambah tema gelap"
 tugas_FIX_jangan_dihapus.php            Bisa kembali ke versi mana saja.
```

| Istilah      | Arti                                                             |
| ------------ | ---------------------------------------------------------------- |
| Git          | Aplikasi **version control** di komputer: mencatat riwayat perubahan file |
| GitHub       | **Website** untuk menyimpan repository Git secara online & berkolaborasi |
| Repository   | Folder proyek yang dipantau Git                                  |
| Commit       | "Titik simpan" (snapshot) beserta pesan perubahan                |
| Branch       | Cabang jalur kerja agar fitur baru tidak mengganggu versi utama  |
| Merge        | Menggabungkan branch ke branch lain                              |
| Remote       | Alamat repository di server (misalnya GitHub), biasanya bernama `origin` |
| Clone        | Menyalin repository dari GitHub ke komputer                      |
| Push / Pull  | Mengirim commit ke GitHub / mengambil commit dari GitHub         |

**Alur kerja Git (wajib dipahami):**

```
  ┌────────────────┐   git add    ┌──────────────┐  git commit  ┌────────────────┐  git push   ┌──────────────┐
  │ WORKING        │ ───────────▶ │ STAGING AREA │ ───────────▶ │ LOCAL          │ ──────────▶ │ REMOTE       │
  │ DIRECTORY      │              │ (siap commit)│              │ REPOSITORY     │             │ (GitHub)     │
  │ file yang kamu │              │              │              │ (.git)         │ ◀────────── │              │
  │ edit           │              │              │              │                │  git pull   │              │
  └────────────────┘              └──────────────┘              └────────────────┘             └──────────────┘
         ▲                                                                                             │
         └────────────────────────────────────── git clone ────────────────────────────────────────────┘
```

**Analogi:** foto bersama kelas

| Git                | Analogi                                                      |
| ------------------ | ------------------------------------------------------------ |
| Working directory  | Semua siswa di kelas                                         |
| `git add`          | Memanggil siswa tertentu untuk berdiri di depan kamera       |
| `git commit`       | Klik! Foto diambil dan diberi keterangan                     |
| `git push`         | Mengunggah foto ke album online sekolah                      |

**Tabel perintah penting:**

| Perintah                                   | Fungsi                                              |
| ------------------------------------------ | --------------------------------------------------- |
| `git config --global user.name "Nama"`     | Mengatur nama penulis commit (sekali saja)          |
| `git config --global user.email "a@b.c"`   | Mengatur email penulis commit                       |
| `git init`                                 | Menjadikan folder sebagai repository Git            |
| `git status`                               | Melihat file yang berubah / sudah di-stage          |
| `git add nama_file` / `git add .`          | Memasukkan perubahan ke staging area                |
| `git commit -m "pesan"`                    | Menyimpan snapshot dengan pesan                     |
| `git log --oneline`                        | Melihat riwayat commit secara ringkas               |
| `git diff`                                 | Melihat perubahan yang belum di-stage               |
| `git branch nama`                          | Membuat branch baru                                 |
| `git switch nama` (atau `git checkout nama`) | Pindah ke branch lain                             |
| `git switch -c nama`                       | Membuat sekaligus pindah ke branch baru             |
| `git merge nama`                           | Menggabungkan branch `nama` ke branch saat ini      |
| `git remote add origin URL`                | Menghubungkan repository lokal dengan GitHub        |
| `git push -u origin main`                  | Mengirim commit pertama kali ke GitHub              |
| `git pull`                                 | Mengambil & menggabungkan perubahan dari GitHub     |
| `git clone URL`                            | Menyalin repository GitHub ke komputer              |

**Branch divisualkan:**

```
 main     ●───────●───────────────────────●  (merge)
                   \                     /
 fitur-tema         ●───────●───────────●
                  "CSS var" "dark"   "toggle JS"
```

**Praktik mini (30 menit) — menyimpan proyek `crud_siswa` ke GitHub:**

```bash
# 1. Masuk ke folder proyek
cd C:\xampp\htdocs\crud_siswa

# 2. Jadikan repository dan buat commit pertama
git init
git add .
git commit -m "Proyek CRUD siswa dari Modul 4"

# 3. Kerjakan Modul 5 di branch terpisah
git switch -c fitur-css
#    ... edit style.css, header.php, index.php ...
git add .
git commit -m "Tambah tampilan responsif dan tema gelap"

# 4. Gabungkan ke main
git switch main
git merge fitur-css

# 5. Buat repository kosong di github.com, lalu hubungkan
git remote add origin https://github.com/USERNAME/crud_siswa.git
git branch -M main
git push -u origin main
```

> **Jangan unggah rahasia.** Jika `koneksi.php` berisi password database sungguhan, buat file `.gitignore` berisi `koneksi.php` dan sediakan `koneksi.contoh.php` sebagai contoh.

**Pesan commit yang baik:**

| ❌ Kurang baik     | ✅ Baik                                         |
| ----------------- | ---------------------------------------------- |
| `update`          | `Tambah validasi email di form siswa`          |
| `fix`             | `Perbaiki filter tanggal yang terbalik`        |
| `asdf`            | `Tambah endpoint api_siswa.php untuk pencarian` |

**Kuis kilat:**

1. Apa perbedaan Git dan GitHub?
2. Urutkan: `git commit`, `git push`, `git add`.
3. Perintah untuk melihat riwayat commit secara ringkas adalah ...
4. Kamu ingin mencoba fitur baru tanpa merusak versi utama. Perintah apa yang dipakai?
5. Temanmu sudah push perubahan ke GitHub. Perintah apa agar laptopmu mendapat perubahan itu?

<details>
<summary>Kunci jawaban</summary>

1. Git adalah aplikasi version control di komputer; GitHub adalah layanan online untuk menyimpan dan berbagi repository Git.
2. `git add` → `git commit` → `git push`
3. `git log --oneline`
4. `git switch -c nama-fitur` (membuat branch baru)
5. `git pull`

</details>

---

## 5. Ringkasan Materi Pendukung

Garis besar untuk materi yang belum memiliki modul lengkap.

### 5.1 Mahir Menggunakan Text Editor (VS Code)

```
 ┌─────────────────────────────────────────────────────────────┐
 │ Menu                                                        │
 ├────┬───────────────┬────────────────────────────────────────┤
 │ 📁 │ EXPLORER      │  index.php ×   style.css ×              │
 │ 🔍 │ crud_siswa    │ ┌────────────────────────────────────┐ │
 │ ⑂  │ ├ index.php   │ │ 1 <?php                            │ │
 │ ▶  │ ├ style.css   │ │ 2 require __DIR__ . '/koneksi.php';│ │
 │ ⧉  │ └ app.js      │ │   ... EDITOR ...                   │ │
 │    │               │ └────────────────────────────────────┘ │
 │    │               │  TERMINAL  >  PS C:\xampp\htdocs\...    │
 ├────┴───────────────┴────────────────────────────────────────┤
 │ Status bar: baris, kolom, bahasa, encoding, branch Git      │
 └─────────────────────────────────────────────────────────────┘
  Activity bar   Side bar        Editor + Panel
```

| Shortcut               | Fungsi                              |
| ---------------------- | ----------------------------------- |
| `Ctrl + P`             | Buka file cepat                     |
| `Ctrl + Shift + P`     | Command Palette                     |
| `Ctrl + /`             | Komentar / hapus komentar           |
| `Alt + ↑/↓`            | Pindahkan baris                     |
| `Shift + Alt + ↓`      | Duplikat baris                      |
| `Ctrl + D`             | Pilih kata yang sama berikutnya (multi-cursor) |
| `Shift + Alt + F`      | Format dokumen                      |
| `` Ctrl + ` ``         | Buka/tutup terminal                 |

Ekstensi yang disarankan: **PHP Intelephense**, **Prettier**, **Live Server**, **GitLens**, **Indonesian Language Pack** (opsional).

### 5.2 Terminal / CMD untuk Development

| Tujuan                    | CMD (Windows)        | PowerShell / Git Bash   |
| ------------------------- | -------------------- | ----------------------- |
| Lihat folder saat ini     | `cd`                 | `pwd`                   |
| Lihat isi folder          | `dir`                | `ls`                    |
| Pindah folder             | `cd nama_folder`     | `cd nama_folder`        |
| Naik satu folder          | `cd ..`              | `cd ..`                 |
| Buat folder               | `mkdir nama`         | `mkdir nama`            |
| Buat file kosong          | `type nul > a.txt`   | `ni a.txt` / `touch a.txt` |
| Salin file                | `copy a.txt b.txt`   | `cp a.txt b.txt`        |
| Hapus file                | `del a.txt`          | `rm a.txt`              |
| Bersihkan layar           | `cls`                | `clear`                 |
| Cek versi PHP             | `php -v`             | `php -v`                |

```
 C:\                         ← root (akar)
 └── xampp
     └── htdocs              ← cd C:\xampp\htdocs
         └── crud_siswa      ← cd crud_siswa   (path relatif)
             └── app.js      ← C:\xampp\htdocs\crud_siswa\app.js (path absolut)
```

### 5.3 UI/UX Dasar

```
 Proses desain (Design Thinking)
 EMPATHIZE ─▶ DEFINE ─▶ IDEATE ─▶ PROTOTYPE ─▶ TEST
 kenali      rumuskan   cari ide   buat         uji ke
 pengguna    masalah    solusi     wireframe    pengguna
     ▲                                             │
     └──────────────── perbaiki ◀──────────────────┘
```

Prinsip yang langsung terlihat di Modul 5: **konsistensi** warna tombol, **hierarki** judul, **kontras** teks, **umpan balik** (pesan sukses/gagal), dan **aksesibilitas** (label form, fokus keyboard).

### 5.4 Front End Basic

```
 HTML  = kerangka rumah  (struktur: dinding, pintu, jendela)
 CSS   = cat & dekorasi  (warna, ukuran, tata letak)
 JS    = listrik         (lampu menyala saat saklar ditekan)
```

### 5.5 AI Basics / Prompting AI for Programming

**Struktur prompt yang baik (PKTBF):**

| Unsur        | Contoh                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| **P**eran    | "Kamu adalah guru pemrograman PHP untuk siswa SMK."                     |
| **K**onteks  | "Saya membuat aplikasi CRUD siswa dengan PHP PDO dan MySQL."            |
| **T**ugas    | "Bantu saya memahami kenapa kode berikut error."                         |
| **B**atasan  | "Jangan langsung beri solusi. Beri satu petunjuk agar saya mencoba."     |
| **F**ormat   | "Jelaskan singkat, lalu tanyakan apa yang akan saya periksa."            |

Modul lengkap berisi template prompt untuk memahami konsep, membaca kode, memperbaiki bug, latihan bertahap, dan menjaga privasi: [AI Basics — Prompting AI untuk Belajar Pemrograman](ai/modul_ai_basics_prompting_ai_untuk_belajar.md) ([PDF](ai/modul_ai_basics_prompting_ai_untuk_belajar.pdf)).

**Siklus aman memakai AI:**

```
 Tulis prompt ─▶ Baca jawaban ─▶ PAHAMI tiap baris ─▶ UJI di komputer ─▶ Perbaiki prompt
      ▲                                                       │
      └──────────────────────── belum benar ◀─────────────────┘
```

**Aturan wajib:**

1. Jangan menempelkan **password, data pribadi, atau data sekolah** ke AI.
2. AI bisa **salah dengan percaya diri** (halusinasi). Selalu uji kodenya.
3. Jangan menyalin kode yang tidak kamu pahami; minta AI menjelaskannya per baris.
4. Periksa keamanan: apakah query memakai prepared statement? Apakah output memakai `e()` / `textContent`?
5. Sebutkan bahwa kamu memakai AI jika diminta guru (kejujuran akademik).

---

## 6. Cara Menggunakan Repository Ini

**Untuk guru:**

1. Ikuti urutan pada [Peta Jalur Belajar](#2-peta-jalur-belajar).
2. Gunakan bagian [Materi Mengulang](#4-materi-mengulang-review) sebagai pembuka pertemuan (10–15 menit) atau persiapan ulangan.
3. Setiap modul memiliki bagian **Latihan** (Dasar, Menengah, Lanjutan) dan **Kesalahan Umum** yang bisa dijadikan bahan diskusi.

**Untuk siswa:**

1. Baca bagian **Tujuan** setiap modul terlebih dahulu.
2. Ketik ulang kode contoh, **jangan copy-paste**, agar terbiasa dengan sintaks.
3. Simpan setiap kemajuan proyek dengan `git commit`.
4. Jika error, baca pesan error dan cek tabel **Kesalahan Umum** sebelum bertanya.

**Struktur folder:**

```
materi/
├── README.md                    ← kamu di sini
├── ai/
│   ├── modul_ai_basics_prompting_ai_untuk_belajar.md
│   └── modul_ai_basics_prompting_ai_untuk_belajar.pdf
├── html/
│   ├── modul_html_menengah_semantic_html_seo.md
│   └── modul_html_menengah_semantic_html_seo.pdf
├── pengenalan_pemrograman/
│   ├── modul_1_pemrograman_computational_thinking.md
│   └── modul_2_algoritma_pemrograman_dasar.md
├── mysql/
│   ├── modul_1_ddl.md
│   ├── modul_2_dml.md
│   └── modul_3_dql.md
├── mysql_pdf/                   ← versi PDF modul database
├── php/
│   ├── modul_4_php_mysql.md
│   └── modul_4_php_mysql.pdf
├── css/
│   └── modul_5_css_menengah.md
└── javascript/
    └── modul_6_javascript_menengah.md
```
