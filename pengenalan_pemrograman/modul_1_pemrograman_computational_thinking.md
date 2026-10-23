# Modul 1 — Mengenal Pemrograman Komputer dan Computational Thinking

**Mata pelajaran:** Dasar-Dasar Pengembangan Perangkat Lunak — RPL
**Sasaran:** Kelas X SMK semester 1
**Alat:** Kertas, pensil, kartu angka (untuk aktivitas tanpa komputer), browser
**Prasyarat:** Tidak ada. Modul ini adalah titik awal belajar pemrograman.

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan cara kerja komputer dengan model **Input → Proses → Output**.
2. Menjelaskan arti program, pemrograman, dan bahasa pemrograman.
3. Membedakan bahasa tingkat rendah dan tingkat tinggi, serta compiler dan interpreter.
4. Menyebutkan bahasa pemrograman yang dipakai di jurusan RPL dan kegunaannya.
5. Menjelaskan empat pilar **Computational Thinking (CT)**.
6. Menerapkan CT untuk memecahkan masalah sehari-hari dan masalah di sekolah.

---

## 2. Peta Materi

```
                    MENGENAL PEMROGRAMAN
                            │
        ┌───────────────────┼────────────────────┐
        ▼                   ▼                    ▼
   Cara kerja          Program dan          Computational
    komputer         bahasa pemrograman        Thinking
        │                   │                    │
   Input-Proses-       Tingkat rendah/      ┌────┼────┬─────────┐
   Output              tinggi, compiler/    ▼    ▼    ▼         ▼
   Hardware-Software   interpreter        Deko- Pola Abstraksi Algoritma
                                          mposisi
```

---

## 3. Cara Kerja Komputer

### 3.1 Model Input → Proses → Output (IPO)

Semua komputer, dari HP sampai server, bekerja dengan pola yang sama:

```
 ┌──────────┐      ┌──────────────┐      ┌───────────┐
 │  INPUT   │ ───▶ │    PROSES    │ ───▶ │  OUTPUT   │
 │ (masukan)│      │ (pengolahan) │      │ (keluaran)│
 └──────────┘      └──────┬───────┘      └───────────┘
                          │
                   ┌──────▼───────┐
                   │   STORAGE    │
                   │ (penyimpanan)│
                   └──────────────┘
```

| Bagian  | Arti                        | Contoh perangkat        | Contoh pada kalkulator HP |
| ------- | --------------------------- | ----------------------- | ------------------------- |
| Input   | Data yang dimasukkan        | Keyboard, mouse, kamera | Menekan `7`, `+`, `5`     |
| Proses  | Data diolah sesuai perintah | CPU (prosesor)          | Menghitung 7 + 5          |
| Output  | Hasil pengolahan            | Layar, speaker, printer | Layar menampilkan `12`    |
| Storage | Tempat menyimpan data       | RAM, SSD, flashdisk     | Riwayat perhitungan       |

**Contoh lain di sekitar kita:**

| Kegiatan            | Input                | Proses                  | Output                |
| ------------------- | -------------------- | ----------------------- | --------------------- |
| Absen sidik jari    | Sidik jari           | Mencocokkan dengan data | "Terima kasih, Andi"  |
| Mesin ATM           | Kartu, PIN, nominal  | Cek PIN dan saldo       | Uang dan struk        |
| Aplikasi data siswa | Nama, email, jurusan | Simpan ke database      | Daftar siswa di layar |

### 3.2 Hardware dan Software

```
 ┌───────────────────────────────────────────┐
 │          PENGGUNA (kamu)                  │
 ├───────────────────────────────────────────┤
 │  APLIKASI: browser, game, VS Code, WA     │  ◀── software aplikasi
 ├───────────────────────────────────────────┤
 │  SISTEM OPERASI: Windows, Linux, Android  │  ◀── software sistem
 ├───────────────────────────────────────────┤
 │  HARDWARE: CPU, RAM, SSD, layar, keyboard │  ◀── perangkat keras
 └───────────────────────────────────────────┘
```

- **Hardware** adalah bagian komputer yang bisa disentuh.
- **Software** adalah kumpulan perintah (program) yang menyuruh hardware bekerja.
- Hardware tanpa software seperti tubuh tanpa pikiran; software tanpa hardware tidak bisa dijalankan.

---

## 4. Program, Pemrograman, dan Bahasa Pemrograman

### 4.1 Pengertian

| Istilah                | Arti sederhana                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| **Program**            | Kumpulan perintah yang disusun berurutan agar komputer melakukan tugas |
| **Pemrograman**        | Kegiatan merancang, menulis, menguji, dan memperbaiki program          |
| **Bahasa pemrograman** | Bahasa khusus yang dipakai manusia untuk menulis perintah ke komputer  |
| **Programmer**         | Orang yang membuat program                                             |
| **Source code**        | Teks program yang ditulis programmer                                   |
| **Bug**                | Kesalahan dalam program                                                |
| **Debugging**          | Kegiatan mencari dan memperbaiki bug                                   |

**Analogi resep masakan:**

```
 RESEP NASI GORENG              PROGRAM KOMPUTER
 ─────────────────              ────────────────
 Bahan-bahan          ◀──────▶  Data / variabel
 Langkah memasak      ◀──────▶  Perintah (instruksi)
 Koki                 ◀──────▶  Komputer (CPU)
 Nasi goreng jadi     ◀──────▶  Output / hasil
 Penulis resep        ◀──────▶  Programmer
```

Komputer itu **sangat patuh tetapi tidak cerdas**: ia melakukan persis apa yang ditulis, tidak lebih dan tidak kurang. Jika resep berkata "masukkan garam" tanpa takaran, koki manusia bisa menebak; komputer tidak bisa.

### 4.2 Tingkatan bahasa pemrograman

```
 Mudah dibaca manusia
        ▲
        │  Bahasa tingkat tinggi   print("Halo")      JavaScript, PHP, Python
        │  ──────────────────────────────────────────────────────────────
        │  Bahasa assembly         MOV AX, 1          Singkatan bahasa mesin
        │  ──────────────────────────────────────────────────────────────
        │  Bahasa mesin            10110000 01100001  Hanya angka 0 dan 1
        ▼
 Mudah dibaca mesin
```

Komputer hanya memahami **0 dan 1** (biner). Bahasa tingkat tinggi harus **diterjemahkan** dulu.

### 4.3 Compiler dan interpreter

```
 COMPILER (seperti menerjemahkan seluruh buku dulu, baru dibaca)
 ┌─────────────┐  terjemahkan  ┌──────────────┐  jalankan  ┌────────┐
 │ source code │ ─── semua ──▶ │ file program │ ─────────▶ │ output │
 │  (.c, .go)  │               │ (.exe)       │            └────────┘
 └─────────────┘               └──────────────┘

 INTERPRETER (seperti penerjemah langsung, kalimat demi kalimat)
 ┌─────────────┐  terjemahkan baris 1 → jalankan
 │ source code │  terjemahkan baris 2 → jalankan   ─────────▶ output
 │ (.php, .js) │  terjemahkan baris 3 → jalankan
 └─────────────┘
```

| Pembeda         | Compiler                         | Interpreter                             |
| --------------- | -------------------------------- | --------------------------------------- |
| Cara kerja      | Menerjemahkan seluruh kode dulu  | Menerjemahkan dan menjalankan per baris |
| Hasil           | File yang bisa dijalankan (.exe) | Tidak menghasilkan file terpisah        |
| Kecepatan jalan | Umumnya lebih cepat              | Umumnya lebih lambat                    |
| Contoh bahasa   | C, C++, Go                       | PHP, JavaScript, Python                 |

### 4.4 Bahasa yang akan kamu pelajari di RPL

| Bahasa     | Jenis                  | Dipakai untuk                       | Contoh di proyek kita             |
| ---------- | ---------------------- | ----------------------------------- | --------------------------------- |
| HTML       | Bahasa markah (markup) | Struktur halaman web                | Tabel daftar siswa, form          |
| CSS        | Bahasa gaya (style)    | Tampilan: warna, ukuran, tata letak | Tombol biru, tabel rapi           |
| JavaScript | Bahasa pemrograman     | Interaksi di browser                | Konfirmasi hapus, pencarian cepat |
| PHP        | Bahasa pemrograman     | Logika di server                    | Menyimpan data siswa              |
| SQL        | Bahasa kueri (query)   | Mengelola database                  | `SELECT * FROM siswa`             |

> HTML dan CSS **bukan** bahasa pemrograman karena tidak punya logika seperti percabangan dan perulangan. Keduanya tetap wajib dikuasai untuk membuat web.

### 4.5 Profesi di bidang RPL

```
                       ┌───────────────┐
                       │  Lulusan RPL  │
                       └───────┬───────┘
   ┌────────────┬──────────────┼─────────────┬──────────────┐
   ▼            ▼              ▼             ▼              ▼
 Front-end    Back-end       Mobile        UI/UX         Software
 Developer    Developer      Developer     Designer      Tester (QA)
 (HTML, CSS,  (PHP, SQL)     (Android)     (Figma)       (uji aplikasi)
  JS)
```

---

## 5. Computational Thinking (Berpikir Komputasional)

### 5.1 Pengertian

**Computational Thinking (CT)** adalah cara berpikir untuk memecahkan masalah secara terstruktur, sehingga solusinya bisa dijalankan oleh manusia maupun komputer.

CT **bukan** berpikir seperti komputer. CT adalah cara manusia berpikir agar bisa **menyuruh** komputer dengan jelas.

### 5.2 Empat pilar CT

```
                   ┌──────────────────────┐
                   │    MASALAH BESAR     │
                   └──────────┬───────────┘
                              ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ 1. DEKOMPOSISI       Pecah masalah besar jadi bagian kecil  │
 └────────────────────────────┬────────────────────────────────┘
                              ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ 2. PENGENALAN POLA   Cari kesamaan / pengulangan            │
 └────────────────────────────┬────────────────────────────────┘
                              ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ 3. ABSTRAKSI         Ambil yang penting, buang yang tidak   │
 └────────────────────────────┬────────────────────────────────┘
                              ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ 4. ALGORITMA         Susun langkah-langkah penyelesaian     │
 └────────────────────────────┬────────────────────────────────┘
                              ▼
                   ┌──────────────────────┐
                   │        SOLUSI        │
                   └──────────────────────┘
```

| Pilar           | Pertanyaan kunci                            | Analogi                                                |
| --------------- | ------------------------------------------- | ------------------------------------------------------ |
| Dekomposisi     | "Masalah ini terdiri dari bagian apa saja?" | Membongkar LEGO menjadi kepingan                       |
| Pengenalan pola | "Bagian mana yang mirip atau berulang?"     | Menyadari semua roda mobil LEGO bentuknya sama         |
| Abstraksi       | "Informasi apa yang benar-benar penting?"   | Peta KRL hanya menampilkan stasiun, bukan setiap rumah |
| Algoritma       | "Apa langkah-langkahnya, berurutan?"        | Buku petunjuk merakit LEGO                             |

### 5.3 Pilar 1 — Dekomposisi

**Dekomposisi** adalah memecah masalah besar menjadi masalah-masalah kecil yang lebih mudah diselesaikan.

**Contoh: menyiapkan pentas seni kelas**

```
                    PENTAS SENI KELAS
                           │
     ┌───────────┬─────────┼─────────┬─────────────┐
     ▼           ▼         ▼         ▼             ▼
   Acara     Dekorasi   Konsumsi    Dana      Dokumentasi
   ├ MC      ├ Balon    ├ Snack     ├ Iuran   ├ Foto
   └ Urutan  └ Banner   └ Minum     └ Sponsor └ Video
```

Setiap bagian kecil bisa dikerjakan oleh orang yang berbeda dan dicek satu per satu.

**Contoh RPL: aplikasi data siswa (Modul 4 PHP & MySQL)**

```
               APLIKASI DATA SISWA
                       │
   ┌─────────┬─────────┼─────────┬──────────┐
   ▼         ▼         ▼         ▼          ▼
 Koneksi   Tampil    Tambah     Ubah      Hapus
 database  daftar    siswa      siswa     siswa
             │
     ┌───────┼──────────┐
     ▼       ▼          ▼
   Cari    Filter    Halaman
   nama    jurusan   (pagination)
```

### 5.4 Pilar 2 — Pengenalan Pola

**Pengenalan pola** adalah menemukan kesamaan, keteraturan, atau pengulangan. Jika pola ditemukan, satu solusi bisa dipakai berkali-kali.

**Contoh 1 — deret angka**

```
 2,   4,   6,   8,   ?,   ?
   +2   +2   +2           →  polanya "tambah 2"  →  jawaban: 10, 12
```

**Contoh 2 — form tambah dan form edit siswa**

| Form tambah siswa | Form edit siswa   |
| ----------------- | ----------------- |
| Isian nama        | Isian nama        |
| Isian email       | Isian email       |
| Pilihan jurusan   | Pilihan jurusan   |
| Tombol "Simpan"   | Tombol "Perbarui" |

Polanya: isiannya **sama**, hanya tombol dan data awalnya yang beda. Karena itu di Modul 4 kita membuat **satu** file `form_siswa.php` yang dipakai bersama.

**Contoh 3 — menghitung nilai rata-rata 36 siswa**

Langkah untuk setiap siswa selalu sama: "ambil nilai → tambahkan ke total". Pola berulang seperti ini nantinya ditulis sebagai **perulangan** (loop).

### 5.5 Pilar 3 — Abstraksi

**Abstraksi** adalah memilih informasi yang penting dan mengabaikan detail yang tidak dibutuhkan untuk tujuan tertentu.

**Contoh: data siswa untuk aplikasi absensi**

```
 Seluruh informasi tentang Andi       Yang dibutuhkan aplikasi absensi
 ──────────────────────────────       ────────────────────────────────
 ✔ Nama: Andi                         ✔ Nama
 ✔ NIS: 2301                    ───▶  ✔ NIS
 ✔ Kelas: X RPL 1                     ✔ Kelas
 ✘ Warna favorit: biru
 ✘ Hobi: main bola
 ✘ Nomor sepatu: 41
```

Abstraksi tergantung **tujuan**. Untuk aplikasi absensi, nomor sepatu tidak penting, tetapi untuk aplikasi pemesanan seragam olahraga, nomor sepatu justru penting.

**Abstraksi dalam pemrograman:** saat kamu memakai `echo "Halo"`, kamu tidak perlu tahu bagaimana huruf digambar di layar piksel demi piksel. Detail itu sudah "disembunyikan".

### 5.6 Pilar 4 — Algoritma

**Algoritma** adalah langkah-langkah logis dan berurutan untuk menyelesaikan masalah. Algoritma dibahas lengkap di [Modul 2](./modul_2_algoritma_pemrograman_dasar.md).

**Contoh: algoritma menyeberang jalan**

```
 ┌───────────────────────────┐
 │ 1. Berhenti di tepi jalan │
 └─────────────┬─────────────┘
               ▼
 ┌───────────────────────────┐ ◀────────────────────┐
 │ 2. Lihat kanan, kiri,     │                      │
 │    kanan lagi             │                      │
 └─────────────┬─────────────┘                      │
               ▼                                    │
        ╱──────────────╲    ya    ┌──────────────────┴┐
       ╱ Ada kendaraan  ╲ ──────▶ │ Tunggu sebentar   │
       ╲    dekat?      ╱         └───────────────────┘
        ╲──────┬───────╱
               │ tidak
               ▼
 ┌───────────────────────────┐
 │ 3. Menyeberang lurus      │
 └───────────────────────────┘
```

---

## 6. Studi Kasus: Menerapkan Empat Pilar

### Masalah

Wali kelas ingin tahu **siapa siswa dengan nilai rata-rata tertinggi** di kelas X RPL 1 dari 5 mata pelajaran.

### Langkah 1 — Dekomposisi

```
          CARI SISWA DENGAN RATA-RATA TERTINGGI
                          │
      ┌───────────────────┼───────────────────┐
      ▼                   ▼                   ▼
 Kumpulkan nilai    Hitung rata-rata    Bandingkan semua
 setiap siswa       setiap siswa        rata-rata
```

### Langkah 2 — Pengenalan pola

Menghitung rata-rata **selalu sama** untuk setiap siswa:

```
 rata-rata = (nilai1 + nilai2 + nilai3 + nilai4 + nilai5) ÷ 5
```

Jadi cukup membuat satu cara hitung, lalu diulang untuk semua siswa.

### Langkah 3 — Abstraksi

| Dipakai                | Diabaikan               |
| ---------------------- | ----------------------- |
| Nama siswa             | Alamat rumah            |
| Nilai 5 mata pelajaran | Nomor HP, tanggal lahir |

### Langkah 4 — Algoritma

```
1. Siapkan "rata-rata tertinggi" = 0 dan "nama terbaik" = kosong.
2. Untuk setiap siswa:
   a. Jumlahkan 5 nilainya.
   b. Bagi jumlahnya dengan 5.
   c. Jika hasilnya lebih besar dari "rata-rata tertinggi":
      simpan hasilnya sebagai "rata-rata tertinggi"
      dan simpan namanya sebagai "nama terbaik".
3. Tampilkan "nama terbaik" dan "rata-rata tertinggi".
```

### Uji dengan data (tracing)

| Siswa | Nilai          | Rata-rata | Tertinggi sementara |
| ----- | -------------- | --------- | ------------------- |
| Andi  | 80 85 90 75 70 | 80        | Andi (80)           |
| Siti  | 90 88 92 85 95 | 90        | Siti (90)           |
| Budi  | 70 75 80 85 90 | 80        | Siti (90)           |

**Hasil:** Siti, rata-rata 90.

---

## 7. Aktivitas Tanpa Komputer (Unplugged)

### 7.1 "Robot Manusia"

1. Bentuk kelompok 3 orang: **programmer**, **robot**, **pengamat**.
2. Programmer menulis perintah di kertas agar robot berjalan dari pintu ke meja guru.
3. Perintah hanya boleh: `MAJU n langkah`, `BELOK KANAN`, `BELOK KIRI`.
4. Robot menjalankan perintah **persis** seperti tertulis, tanpa menebak.
5. Pengamat mencatat perintah yang salah (bug), lalu programmer memperbaikinya (debugging).

**Refleksi:** Apa yang terjadi kalau satu perintah tertukar urutannya?

### 7.2 Mengurutkan Kartu

1. Setiap kelompok mendapat 8 kartu angka acak.
2. Tugas: urutkan dari kecil ke besar, tetapi **hanya boleh membandingkan dua kartu** dalam satu waktu dan menukarnya.
3. Tuliskan langkah-langkah yang kalian pakai. Itulah algoritma pengurutan buatan kalian.

---

## 8. Rangkuman

```
 ┌───────────────────────────────────────────────────────────────┐
 │ Komputer = Input → Proses → Output (+ Storage)                │
 │ Program  = Kumpulan perintah berurutan                        │
 │ Bahasa   = Tingkat tinggi (mudah dibaca) → diterjemahkan oleh │
 │            compiler / interpreter → bahasa mesin (0 dan 1)    │
 │ CT       = Dekomposisi → Pola → Abstraksi → Algoritma         │
 └───────────────────────────────────────────────────────────────┘
```

| Konsep          | Satu kalimat                                            |
| --------------- | ------------------------------------------------------- |
| Dekomposisi     | Memecah masalah besar menjadi bagian kecil              |
| Pengenalan pola | Menemukan kesamaan agar solusi bisa dipakai ulang       |
| Abstraksi       | Fokus pada informasi penting sesuai tujuan              |
| Algoritma       | Langkah berurutan dan jelas untuk menyelesaikan masalah |

---

## 9. Latihan

**Dasar**

1. Tentukan Input, Proses, dan Output dari: mesin fotokopi, aplikasi ojek online, dan kalkulator.
2. Sebutkan 3 contoh hardware dan 3 contoh software di laboratorium komputer sekolahmu.
3. Jelaskan perbedaan compiler dan interpreter dengan analogi milikmu sendiri.

**Menengah**

4. Lakukan dekomposisi untuk masalah "membuat website profil kelas". Gambarkan dalam bentuk pohon.
5. Temukan pola deret berikut lalu lanjutkan dua angka berikutnya: `3, 6, 12, 24, ...` dan `1, 1, 2, 3, 5, 8, ...`.
6. Kamu diminta membuat aplikasi perpustakaan sekolah. Data buku apa saja yang **penting** dan mana yang **tidak penting**? (abstraksi)

**Tantangan**

7. Terapkan keempat pilar CT untuk masalah: "Menentukan jadwal piket kelas untuk 30 siswa selama 5 hari agar adil."

**Diskusi**

- Mengapa komputer tidak bisa "menebak" maksud kita seperti manusia?
- Pilar CT mana yang paling sering kamu pakai tanpa sadar dalam kehidupan sehari-hari?

---

## 10. Kuis Singkat

1. Perangkat berikut termasuk input, **kecuali**: (a) keyboard (b) scanner (c) printer (d) mikrofon
2. Bahasa yang hanya terdiri dari 0 dan 1 disebut: (a) assembly (b) bahasa mesin (c) PHP (d) HTML
3. PHP dan JavaScript umumnya dijalankan dengan: (a) compiler (b) interpreter
4. Membuang informasi yang tidak dibutuhkan termasuk pilar: (a) dekomposisi (b) pola (c) abstraksi (d) algoritma
5. Menyadari bahwa form tambah dan edit isinya sama termasuk pilar: (a) dekomposisi (b) pengenalan pola (c) abstraksi (d) algoritma

**Kunci jawaban:** 1-c, 2-b, 3-b, 4-c, 5-b

---

## 11. Kesalahan Umum

| Kesalahan                                         | Yang benar                                                     |
| ------------------------------------------------- | -------------------------------------------------------------- |
| "Computational thinking = berpikir seperti robot" | CT adalah cara manusia menyusun solusi agar bisa dijalankan komputer |
| "HTML adalah bahasa pemrograman"                  | HTML adalah bahasa markah; tidak punya logika percabangan/perulangan |
| Langsung menulis kode tanpa memahami masalah      | Lakukan dekomposisi dan abstraksi dulu, baru susun algoritma   |
| Menganggap abstraksi = menghapus semua detail     | Abstraksi memilih detail sesuai **tujuan**                     |
| Langkah algoritma ambigu ("masak sampai enak")    | Langkah harus jelas dan terukur ("masak 5 menit")              |

---

## 12. Glosarium

| Istilah     | Arti                                                   |
| ----------- | ------------------------------------------------------ |
| CPU         | Otak komputer yang menjalankan perintah                |
| RAM         | Memori sementara; isinya hilang saat komputer mati     |
| Biner       | Sistem bilangan yang hanya memakai 0 dan 1             |
| Source code | Teks program yang ditulis manusia                      |
| Compiler    | Penerjemah seluruh kode sekaligus menjadi program jadi |
| Interpreter | Penerjemah yang menjalankan kode baris demi baris      |
| Bug         | Kesalahan pada program                                 |
| Debugging   | Mencari dan memperbaiki kesalahan                      |

**Lanjut ke:** [Modul 2 — Algoritma dan Pemrograman Dasar](./modul_2_algoritma_pemrograman_dasar.md)
