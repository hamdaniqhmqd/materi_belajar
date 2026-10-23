# Modul 2 — Algoritma dan Pemrograman Dasar

**Mata pelajaran:** Dasar-Dasar Pengembangan Perangkat Lunak — RPL
**Sasaran:** Kelas X SMK semester 1
**Alat:** Kertas/pensil, browser (Console DevTools `F12`), opsional XAMPP untuk contoh PHP
**Prasyarat:** [Modul 1 — Mengenal Pemrograman dan Computational Thinking](./modul_1_pemrograman_computational_thinking.md)

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan pengertian dan ciri-ciri algoritma yang baik.
2. Menuliskan algoritma dalam bentuk **narasi**, **pseudocode**, dan **flowchart**.
3. Menggunakan tiga struktur dasar: **runtunan**, **percabangan**, dan **perulangan**.
4. Memahami variabel, tipe data, dan operator.
5. Membuat program sederhana dengan JavaScript dan PHP dari algoritma yang dirancang.
6. Melakukan **tracing** (menelusuri jalannya program) dengan tabel.

---

## 2. Peta Materi

```
                       ALGORITMA & PEMROGRAMAN DASAR
                                   │
       ┌───────────────┬───────────┼──────────────┬────────────────┐
       ▼               ▼           ▼              ▼                ▼
   Algoritma       Cara menulis  Variabel &    Struktur          Array &
   (ciri-ciri)     algoritma     tipe data     kontrol           fungsi
                   │             operator      │
             ┌─────┼──────┐               ┌────┼──────────┐
             ▼     ▼      ▼               ▼    ▼          ▼
          Narasi Pseudo- Flowchart    Runtunan Percabangan Perulangan
                 code
```

---

## 3. Algoritma

### 3.1 Pengertian

**Algoritma** adalah urutan langkah logis, jelas, dan terbatas untuk menyelesaikan suatu masalah.

```
 ┌────────────┐      ┌──────────────────────┐      ┌──────────┐
 │  MASALAH   │ ───▶ │ ALGORITMA (langkah)  │ ───▶ │  SOLUSI  │
 └────────────┘      └──────────┬───────────┘      └──────────┘
                                │ ditulis dalam bahasa pemrograman
                                ▼
                         ┌─────────────┐
                         │   PROGRAM   │
                         └─────────────┘
```

> **Algoritma + bahasa pemrograman = program.** Algoritma adalah "rencana", program adalah "rencana yang sudah ditulis untuk komputer".

### 3.2 Ciri-ciri algoritma yang baik

| Ciri            | Arti                                    | Contoh salah → benar                          |
| --------------- | --------------------------------------- | --------------------------------------------- |
| **Input**       | Punya nol atau lebih masukan            | —                                             |
| **Output**      | Punya minimal satu hasil                | Menghitung tetapi tidak menampilkan hasil ✘   |
| **Jelas**       | Setiap langkah tidak bermakna ganda     | "Tambah sedikit gula" → "Tambah 1 sendok gula" |
| **Terbatas**    | Pasti berhenti                          | "Ulangi terus" → "Ulangi 10 kali"             |
| **Efektif**     | Langkahnya bisa dikerjakan              | "Hitung semua bilangan prima" ✘               |

---

## 4. Tiga Cara Menulis Algoritma

Masalah contoh: **menghitung luas persegi panjang.**

### 4.1 Narasi (bahasa sehari-hari)

```
1. Mulai.
2. Minta pengguna memasukkan panjang.
3. Minta pengguna memasukkan lebar.
4. Hitung luas = panjang × lebar.
5. Tampilkan luas.
6. Selesai.
```

### 4.2 Pseudocode (mirip kode, tidak terikat bahasa)

```
ALGORITMA LuasPersegiPanjang
DEKLARASI
    panjang, lebar, luas : bilangan
DESKRIPSI
    BACA panjang
    BACA lebar
    luas ← panjang * lebar
    TULIS luas
SELESAI
```

> Tanda `←` dibaca "diisi dengan". `luas ← panjang * lebar` artinya "isi variabel luas dengan hasil panjang kali lebar".

### 4.3 Flowchart (diagram alir)

**Simbol flowchart:**

| Simbol             | Bentuk                 | Nama            | Kegunaan                       |
| ------------------ | ---------------------- | --------------- | ------------------------------ |
| `( Mulai )`        | Oval / lonjong         | Terminator      | Awal dan akhir                 |
| `/ Input /`        | Jajar genjang          | Input/Output    | Membaca atau menampilkan data  |
| `[ Proses ]`       | Persegi panjang        | Proses          | Perhitungan, mengisi variabel  |
| `< Kondisi? >`     | Belah ketupat          | Decision        | Pertanyaan ya/tidak            |
| `──▶`              | Panah                  | Flow line       | Arah alur                      |
| `( A )`            | Lingkaran kecil        | Connector       | Penghubung antarbagian         |

**Flowchart luas persegi panjang:**

```
          ╭─────────╮
          │  Mulai  │
          ╰────┬────╯
               ▼
      ┌─────────────────┐
     ╱  Input panjang,  ╱
    ╱   lebar          ╱
   └────────┬────────┘
            ▼
   ┌──────────────────────┐
   │ luas = panjang*lebar │
   └──────────┬───────────┘
              ▼
      ┌──────────────┐
     ╱ Tampilkan    ╱
    ╱  luas        ╱
   └──────┬───────┘
          ▼
     ╭─────────╮
     │ Selesai │
     ╰─────────╯
```

### 4.4 Perbandingan tiga cara

| Cara       | Kelebihan                         | Kekurangan                         |
| ---------- | --------------------------------- | ---------------------------------- |
| Narasi     | Mudah dipahami siapa saja         | Bisa ambigu, panjang               |
| Pseudocode | Dekat dengan kode, ringkas        | Perlu belajar aturan penulisan     |
| Flowchart  | Visual, alur mudah dilihat        | Repot untuk algoritma yang panjang |

---

## 5. Variabel, Tipe Data, dan Operator

### 5.1 Variabel

**Variabel** adalah "kotak" bernama di memori untuk menyimpan data. Isinya bisa diganti.

```
   nama              umur            lulus
 ┌─────────┐      ┌───────┐       ┌────────┐
 │ "Andi"  │      │  16   │       │  true  │
 └─────────┘      └───────┘       └────────┘
  (teks)          (angka)         (benar/salah)
```

**Aturan penamaan variabel (berlaku di JS dan PHP):**

| Boleh ✔              | Tidak boleh ✘        | Alasan                         |
| -------------------- | -------------------- | ------------------------------ |
| `nilaiAkhir`         | `nilai akhir`        | Tidak boleh ada spasi          |
| `nilai_akhir`        | `1nilai`             | Tidak boleh diawali angka      |
| `totalHarga`         | `total-harga`        | `-` dibaca sebagai pengurangan |
| `umur`               | `x` (untuk umur)     | Boleh, tetapi tidak jelas maknanya |

### 5.2 Tipe data

| Tipe data         | Isi                     | Contoh JavaScript        | Contoh PHP                |
| ----------------- | ----------------------- | ------------------------ | ------------------------- |
| Integer           | Bilangan bulat          | `let umur = 16;`         | `$umur = 16;`             |
| Float             | Bilangan desimal        | `let ipk = 3.75;`        | `$ipk = 3.75;`            |
| String            | Teks (pakai tanda kutip) | `let nama = "Andi";`    | `$nama = "Andi";`         |
| Boolean           | `true` atau `false`     | `let lulus = true;`      | `$lulus = true;`          |
| Array             | Kumpulan data           | `let nilai = [80, 90];`  | `$nilai = [80, 90];`      |

> Perhatikan: `"16"` (string) berbeda dengan `16` (angka). `"5" + "5"` di JavaScript menghasilkan `"55"`, bukan `10`.

### 5.3 Operator

**Operator aritmatika**

| Operator | Arti           | Contoh   | Hasil |
| -------- | -------------- | -------- | ----- |
| `+`      | Tambah         | `7 + 3`  | 10    |
| `-`      | Kurang         | `7 - 3`  | 4     |
| `*`      | Kali           | `7 * 3`  | 21    |
| `/`      | Bagi           | `7 / 2`  | 3.5   |
| `%`      | Sisa bagi (modulus) | `7 % 3` | 1   |

> `%` sangat berguna: `angka % 2 == 0` berarti angka **genap**.

**Operator perbandingan** (hasilnya selalu `true`/`false`)

| Operator | Arti                      | Contoh      | Hasil   |
| -------- | ------------------------- | ----------- | ------- |
| `==`     | Sama nilai                | `5 == "5"`  | true    |
| `===`    | Sama nilai **dan** tipe   | `5 === "5"` | false   |
| `!=`     | Tidak sama                | `5 != 3`    | true    |
| `>` `<`  | Lebih besar / lebih kecil | `8 > 3`     | true    |
| `>=` `<=`| Lebih besar/kecil sama dengan | `75 >= 75` | true |

**Operator logika**

| Operator | Arti | Benar jika...           | Contoh                         |
| -------- | ---- | ----------------------- | ------------------------------ |
| `&&`     | DAN  | **semua** syarat benar  | `nilai >= 75 && hadir >= 80`   |
| `\|\|`   | ATAU | **salah satu** benar    | `hari == "Sabtu" \|\| hari == "Minggu"` |
| `!`      | TIDAK | membalik nilai         | `!lulus`                       |

**Tabel kebenaran `&&` dan `||`:**

| A     | B     | A && B | A \|\| B |
| ----- | ----- | ------ | -------- |
| true  | true  | true   | true     |
| true  | false | false  | true     |
| false | true  | false  | true     |
| false | false | false  | false    |

---

## 6. Struktur Dasar Algoritma

Semua program, sebesar apa pun, hanya tersusun dari tiga struktur ini:

```
   RUNTUNAN            PERCABANGAN              PERULANGAN
   (sequence)          (selection)              (looping)

   ┌───────┐              ╱╲                    ┌───────┐
   │ Lang 1│             ╱  ╲                   │ Mulai │
   └───┬───┘       ya   ╱ ?  ╲  tidak           └───┬───┘
       ▼          ┌────╲    ╱────┐                  ▼
   ┌───────┐      ▼     ╲  ╱     ▼              ╱╲
   │ Lang 2│   ┌─────┐   ╲╱   ┌─────┐     ┌──▶ ╱ ? ╲ ── tidak ──▶ keluar
   └───┬───┘   │  A  │        │  B  │     │    ╲   ╱
       ▼       └──┬──┘        └──┬──┘     │     ╲╱
   ┌───────┐      └──────┬───────┘        │      │ ya
   │ Lang 3│             ▼                │   ┌──▼───┐
   └───────┘          lanjut              └───┤ Ulang│
                                              └──────┘
```

### 6.1 Runtunan (sequence)

Langkah dijalankan **berurutan dari atas ke bawah**, satu per satu. Urutan sangat penting.

**Contoh: menukar isi dua gelas (tukar nilai variabel)**

```
 Gelas A berisi teh, gelas B berisi kopi. Tukar isinya!

 Langkah 1: C ← A        Langkah 2: A ← B        Langkah 3: B ← C
 ┌───┐ ┌───┐ ┌───┐       ┌───┐ ┌───┐ ┌───┐       ┌───┐ ┌───┐ ┌───┐
 │teh│ │kop│ │   │  ──▶  │teh│ │kop│ │teh│  ──▶  │kop│ │kop│ │teh│  ──▶ ...
 └───┘ └───┘ └───┘       └───┘ └───┘ └───┘       └───┘ └───┘ └───┘
   A     B     C           A     B     C           A     B     C
                                                 hasil akhir: A=kopi, B=teh
```

**Pseudocode:**

```
a ← 5
b ← 9
c ← a
a ← b
b ← c
TULIS a, b      { hasil: 9, 5 }
```

**JavaScript** (coba di Console browser: tekan `F12` → tab **Console**):

```javascript
let a = 5;
let b = 9;
let c = a;  // simpan a di gelas kosong
a = b;
b = c;
console.log(a, b); // 9 5
```

**PHP:**

```php
<?php
$a = 5;
$b = 9;
$c = $a;
$a = $b;
$b = $c;
echo "$a $b"; // 9 5
```

**Tabel tracing:**

| Langkah   | a | b | c |
| --------- | - | - | - |
| `a ← 5`   | 5 | - | - |
| `b ← 9`   | 5 | 9 | - |
| `c ← a`   | 5 | 9 | 5 |
| `a ← b`   | 9 | 9 | 5 |
| `b ← c`   | 9 | 5 | 5 |

> **Tracing** adalah menjalankan algoritma "di kepala" atau di kertas, mencatat isi setiap variabel setelah setiap langkah. Ini keterampilan terpenting untuk mencari bug.

### 6.2 Percabangan (selection)

Program memilih jalan berdasarkan **kondisi** benar (`true`) atau salah (`false`).

#### a. IF (satu pilihan)

```
            ╱──────────╲
           ╱ nilai>=75? ╲ ── tidak ──┐
           ╲            ╱            │
            ╲────┬─────╱             │
                 │ ya                │
                 ▼                   │
         ┌───────────────┐           │
         │ Tampil "Lulus"│           │
         └───────┬───────┘           │
                 ▼                   │
               lanjut ◀──────────────┘
```

#### b. IF–ELSE (dua pilihan)

**Masalah:** tentukan siswa lulus atau remedial (KKM 75).

```
            ╭───────╮
            │ Mulai │
            ╰───┬───╯
                ▼
          ┌──────────┐
         ╱ Input    ╱
        ╱  nilai   ╱
       └────┬─────┘
            ▼
       ╱──────────╲
      ╱ nilai>=75? ╲
      ╲            ╱
       ╲──┬────┬──╱
     ya   │    │   tidak
          ▼    ▼
 ┌────────────┐ ┌───────────────┐
 │Tampil      │ │Tampil         │
 │"Lulus"     │ │"Remedial"     │
 └─────┬──────┘ └──────┬────────┘
       └───────┬───────┘
               ▼
          ╭─────────╮
          │ Selesai │
          ╰─────────╯
```

**Pseudocode:**

```
BACA nilai
JIKA nilai >= 75 MAKA
    TULIS "Lulus"
SELAIN ITU
    TULIS "Remedial"
AKHIR JIKA
```

**JavaScript:**

```javascript
let nilai = 80;

if (nilai >= 75) {
  console.log("Lulus");
} else {
  console.log("Remedial");
}
```

**PHP:**

```php
<?php
$nilai = 80;

if ($nilai >= 75) {
    echo "Lulus";
} else {
    echo "Remedial";
}
```

#### c. IF–ELSE IF (banyak pilihan)

**Masalah:** ubah nilai angka menjadi predikat.

| Nilai    | Predikat |
| -------- | -------- |
| 90 – 100 | A        |
| 80 – 89  | B        |
| 75 – 79  | C        |
| < 75     | D        |

```
  ╱─────────╲  ya
 ╱ nilai>=90 ╲ ───▶ [ predikat = "A" ] ──────────────┐
 ╲           ╱                                       │
  ╲────┬────╱                                        │
       │ tidak                                       │
  ╱─────────╲  ya                                    │
 ╱ nilai>=80 ╲ ───▶ [ predikat = "B" ] ──────────────┤
 ╲           ╱                                       │
  ╲────┬────╱                                        │
       │ tidak                                       │
  ╱─────────╲  ya                                    │
 ╱ nilai>=75 ╲ ───▶ [ predikat = "C" ] ──────────────┤
 ╲           ╱                                       │
  ╲────┬────╱                                        │
       │ tidak                                       │
       ▼                                             │
 [ predikat = "D" ] ─────────────────────────────────┤
                                                     ▼
                                          / Tampil predikat /
```

**JavaScript:**

```javascript
let nilai = 84;
let predikat;

if (nilai >= 90) {
  predikat = "A";
} else if (nilai >= 80) {
  predikat = "B";
} else if (nilai >= 75) {
  predikat = "C";
} else {
  predikat = "D";
}

console.log("Predikat: " + predikat); // Predikat: B
```

**PHP:**

```php
<?php
$nilai = 84;

if ($nilai >= 90) {
    $predikat = "A";
} elseif ($nilai >= 80) {
    $predikat = "B";
} elseif ($nilai >= 75) {
    $predikat = "C";
} else {
    $predikat = "D";
}

echo "Predikat: $predikat";
```

> **Urutan kondisi penting!** Jika `nilai >= 75` dicek paling awal, nilai 95 akan mendapat "C" karena kondisi pertama yang benar langsung dipakai.

#### d. SWITCH (memilih berdasarkan nilai tertentu)

```javascript
let hari = 3;
let namaHari;

switch (hari) {
  case 1: namaHari = "Senin"; break;
  case 2: namaHari = "Selasa"; break;
  case 3: namaHari = "Rabu"; break;
  default: namaHari = "Tidak dikenal";
}

console.log(namaHari); // Rabu
```

> Jangan lupa `break`. Tanpa `break`, program akan "jatuh" dan menjalankan `case` berikutnya juga.

### 6.3 Perulangan (looping)

Perulangan menjalankan langkah yang **sama berkali-kali**. Ini wujud nyata **pengenalan pola** di Modul 1.

```
 Tanpa perulangan               Dengan perulangan
 ────────────────               ─────────────────
 TULIS 1                        UNTUK i DARI 1 SAMPAI 5
 TULIS 2                            TULIS i
 TULIS 3                        AKHIR UNTUK
 TULIS 4
 TULIS 5                        (bagaimana kalau sampai 1000?)
```

**Tiga bagian penting setiap perulangan:**

```
   ┌────────────────┐
   │ 1. NILAI AWAL  │   i = 1
   └───────┬────────┘
           ▼
     ╱────────────╲
    ╱ 2. KONDISI   ╲ ── false ──▶ selesai
    ╲   i <= 5 ?   ╱
     ╲─────┬──────╱
           │ true
           ▼
   ┌────────────────┐
   │    Kerjakan    │   tampilkan i
   └───────┬────────┘
           ▼
   ┌────────────────┐
   │ 3. PERUBAHAN   │   i = i + 1
   └───────┬────────┘
           │
           └──────▶ (kembali ke KONDISI)
```

> Jika bagian **perubahan** lupa ditulis, kondisi selalu benar dan program tidak pernah berhenti: **infinite loop**.

#### a. FOR (jumlah perulangan sudah diketahui)

**JavaScript:**

```javascript
for (let i = 1; i <= 5; i++) {
  console.log("Perulangan ke-" + i);
}
```

**PHP:**

```php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Perulangan ke-$i<br>";
}
```

**Contoh: menjumlahkan 1 sampai 5**

```javascript
let total = 0;
for (let i = 1; i <= 5; i++) {
  total = total + i;
}
console.log(total); // 15
```

**Tabel tracing:**

| i | Kondisi `i <= 5` | total sebelum | total sesudah |
| - | ---------------- | ------------- | ------------- |
| 1 | true             | 0             | 1             |
| 2 | true             | 1             | 3             |
| 3 | true             | 3             | 6             |
| 4 | true             | 6             | 10            |
| 5 | true             | 10            | 15            |
| 6 | **false** → berhenti | 15        | 15            |

#### b. WHILE (diulang selama kondisi benar)

Cocok bila jumlah perulangan **belum diketahui**.

**Masalah:** menabung Rp10.000 per minggu, berapa minggu sampai tabungan mencapai Rp75.000?

```javascript
let tabungan = 0;
let minggu = 0;

while (tabungan < 75000) {
  tabungan = tabungan + 10000;
  minggu++;
}

console.log("Butuh " + minggu + " minggu"); // Butuh 8 minggu
```

#### c. DO–WHILE (minimal dijalankan sekali)

```javascript
let pin;
do {
  pin = prompt("Masukkan PIN:");
} while (pin !== "1234");

console.log("PIN benar");
```

#### d. Perbandingan

| Jenis     | Cek kondisi    | Minimal jalan | Cocok untuk                              |
| --------- | -------------- | ------------- | ---------------------------------------- |
| `for`     | Di awal        | 0 kali        | Jumlah ulangan diketahui (1 sampai 10)   |
| `while`   | Di awal        | 0 kali        | Ulang selama syarat terpenuhi            |
| `do-while`| Di akhir       | 1 kali        | Minta input sampai benar                 |

---

## 7. Array (Larik)

**Array** adalah satu variabel yang menyimpan **banyak data** dengan nomor urut (**indeks**) yang dimulai dari **0**.

```
  nilai = [ 80,   75,   92,   68,   88 ]
           ┌────┬────┬────┬────┬────┐
           │ 80 │ 75 │ 92 │ 68 │ 88 │
           └────┴────┴────┴────┴────┘
 indeks:     0    1    2    3    4        panjang (length) = 5
```

| Operasi          | JavaScript              | PHP                       |
| ---------------- | ----------------------- | ------------------------- |
| Membuat array    | `let n = [80, 75, 92];` | `$n = [80, 75, 92];`      |
| Ambil data ke-1  | `n[0]` → 80             | `$n[0]` → 80              |
| Ubah data        | `n[1] = 77;`            | `$n[1] = 77;`             |
| Tambah di akhir  | `n.push(90);`           | `$n[] = 90;`              |
| Jumlah elemen    | `n.length`              | `count($n)`               |

### 7.1 Array + perulangan = sangat kuat

**Masalah:** hitung rata-rata, nilai tertinggi, dan jumlah siswa lulus.

**Pseudocode:**

```
nilai ← [80, 75, 92, 68, 88]
total ← 0
tertinggi ← nilai[0]
lulus ← 0

UNTUK i DARI 0 SAMPAI panjang(nilai) - 1
    total ← total + nilai[i]
    JIKA nilai[i] > tertinggi MAKA tertinggi ← nilai[i]
    JIKA nilai[i] >= 75 MAKA lulus ← lulus + 1
AKHIR UNTUK

rata ← total / panjang(nilai)
TULIS rata, tertinggi, lulus
```

**JavaScript:**

```javascript
const nilai = [80, 75, 92, 68, 88];
let total = 0;
let tertinggi = nilai[0];
let lulus = 0;

for (let i = 0; i < nilai.length; i++) {
  total += nilai[i];
  if (nilai[i] > tertinggi) tertinggi = nilai[i];
  if (nilai[i] >= 75) lulus++;
}

const rata = total / nilai.length;
console.log("Rata-rata:", rata);     // 80.6
console.log("Tertinggi:", tertinggi); // 92
console.log("Lulus:", lulus);         // 4
```

**PHP** (dengan `foreach`, cara yang dipakai di Modul 4 untuk menampilkan data siswa):

```php
<?php
$nilai = [80, 75, 92, 68, 88];
$total = 0;
$tertinggi = $nilai[0];
$lulus = 0;

foreach ($nilai as $n) {
    $total += $n;
    if ($n > $tertinggi) {
        $tertinggi = $n;
    }
    if ($n >= 75) {
        $lulus++;
    }
}

$rata = $total / count($nilai);
echo "Rata-rata: $rata, Tertinggi: $tertinggi, Lulus: $lulus";
```

**Tabel tracing:**

| i | nilai[i] | total | tertinggi | lulus |
| - | -------- | ----- | --------- | ----- |
| awal | -     | 0     | 80        | 0     |
| 0 | 80       | 80    | 80        | 1     |
| 1 | 75       | 155   | 80        | 2     |
| 2 | 92       | 247   | 92        | 3     |
| 3 | 68       | 315   | 92        | 3     |
| 4 | 88       | 403   | 92        | 4     |

Rata-rata = 403 ÷ 5 = **80.6**

---

## 8. Fungsi (Subprogram)

**Fungsi** adalah kumpulan perintah yang diberi nama sehingga bisa **dipanggil berulang kali**. Fungsi adalah wujud **abstraksi**: cukup tahu nama dan kegunaannya, tidak perlu memikirkan isinya setiap kali.

```
            parameter (input)
                  │
                  ▼
        ┌───────────────────┐
        │  fungsi predikat  │   ← "mesin" yang mengubah input jadi output
        │  (nilai)          │
        └─────────┬─────────┘
                  ▼
           return (output)

    predikat(95) → "A"     predikat(82) → "B"     predikat(60) → "D"
```

**JavaScript:**

```javascript
function predikat(nilai) {
  if (nilai >= 90) return "A";
  if (nilai >= 80) return "B";
  if (nilai >= 75) return "C";
  return "D";
}

console.log(predikat(95)); // A
console.log(predikat(82)); // B
```

**PHP:**

```php
<?php
function predikat(int $nilai): string
{
    if ($nilai >= 90) return "A";
    if ($nilai >= 80) return "B";
    if ($nilai >= 75) return "C";
    return "D";
}

echo predikat(95); // A
```

> Di Modul 4 kamu memakai banyak fungsi seperti ini, misalnya `e()` untuk mengamankan teks dan `validasiSiswa()` untuk memeriksa isian form.

---

## 9. Studi Kasus Lengkap: Kasir Kantin Sekolah

### Masalah

Kantin memberi diskon **10%** jika total belanja **≥ Rp50.000**. Hitung total bayar dari beberapa item.

### Dekomposisi

```
               KASIR KANTIN
                    │
     ┌──────────────┼───────────────┐
     ▼              ▼               ▼
 Hitung total   Cek diskon      Tampilkan
 (perulangan)   (percabangan)   hasil (runtunan)
```

### Flowchart

```
            ╭───────╮
            │ Mulai │
            ╰───┬───╯
                ▼
   ┌──────────────────────────┐
   │ harga = [15000, 20000,   │
   │          18000]          │
   │ total = 0, i = 0         │
   └────────────┬─────────────┘
                ▼
          ╱───────────╲   tidak
  ┌────▶ ╱ i < jumlah  ╲ ──────────────┐
  │      ╲   item ?    ╱               │
  │       ╲─────┬─────╱                │
  │             │ ya                   │
  │             ▼                      │
  │  ┌───────────────────────┐         │
  │  │ total = total+harga[i]│         │
  │  │ i = i + 1             │         │
  │  └──────────┬────────────┘         │
  └─────────────┘                      ▼
                                ╱────────────╲
                               ╱ total>=50000?╲
                               ╲              ╱
                                ╲──┬──────┬──╱
                              ya   │      │  tidak
                                   ▼      ▼
                     ┌──────────────┐  ┌────────────┐
                     │diskon =      │  │ diskon = 0 │
                     │total * 10%   │  └─────┬──────┘
                     └──────┬───────┘        │
                            └──────┬─────────┘
                                   ▼
                     ┌───────────────────────┐
                     │ bayar = total - diskon│
                     └───────────┬───────────┘
                                 ▼
                       ┌───────────────────┐
                      ╱ Tampil total,      ╱
                     ╱  diskon, bayar     ╱
                    └─────────┬──────────┘
                              ▼
                         ╭─────────╮
                         │ Selesai │
                         ╰─────────╯
```

### Program JavaScript

```javascript
const harga = [15000, 20000, 18000];
let total = 0;

for (let i = 0; i < harga.length; i++) {
  total += harga[i];
}

let diskon = 0;
if (total >= 50000) {
  diskon = total * 0.1;
}

const bayar = total - diskon;

console.log("Total  : Rp" + total);  // Rp53000
console.log("Diskon : Rp" + diskon); // Rp5300
console.log("Bayar  : Rp" + bayar);  // Rp47700
```

### Program PHP

```php
<?php
$harga = [15000, 20000, 18000];
$total = 0;

foreach ($harga as $h) {
    $total += $h;
}

$diskon = $total >= 50000 ? $total * 0.1 : 0;
$bayar = $total - $diskon;

echo "Total: Rp" . number_format($total, 0, ',', '.') . "<br>";
echo "Diskon: Rp" . number_format($diskon, 0, ',', '.') . "<br>";
echo "Bayar: Rp" . number_format($bayar, 0, ',', '.');
```

---

## 10. Dari Algoritma ke Program: Alur Kerja Programmer

```
 ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
 │ 1.Pahami │──▶│2.Rancang │──▶│ 3.Tulis  │──▶│ 4.Uji /  │──▶│ 5.Perbaiki│
 │  masalah │   │algoritma │   │   kode   │   │ tracing  │   │  (debug) │
 │  (CT)    │   │pseudo/FC │   │ JS / PHP │   │          │   │          │
 └──────────┘   └──────────┘   └──────────┘   └────┬─────┘   └────┬─────┘
                                                   │   ada bug    │
                                                   └──────◀───────┘
```

---

## 11. Rangkuman

| Konsep       | Inti                                                       | JS                         | PHP                         |
| ------------ | ---------------------------------------------------------- | -------------------------- | --------------------------- |
| Variabel     | Kotak penyimpan data                                       | `let x = 5;`               | `$x = 5;`                   |
| Runtunan     | Dijalankan berurutan                                       | baris demi baris           | baris demi baris            |
| Percabangan  | Memilih jalan berdasar kondisi                             | `if / else if / else`      | `if / elseif / else`        |
| Perulangan   | Mengulang langkah                                          | `for`, `while`             | `for`, `while`, `foreach`   |
| Array        | Banyak data dalam satu variabel, indeks mulai 0            | `[1, 2, 3]`, `.length`     | `[1, 2, 3]`, `count()`      |
| Fungsi       | Kumpulan perintah bernama yang bisa dipanggil ulang        | `function f(a) {}`         | `function f($a) {}`         |
| Tracing      | Mencatat isi variabel setiap langkah untuk mencari bug     | tabel di kertas            | tabel di kertas             |

---

## 12. Latihan

**Dasar**

1. Buat narasi, pseudocode, dan flowchart untuk menghitung **luas dan keliling lingkaran** (π = 3.14).
2. Buat algoritma untuk menentukan apakah sebuah bilangan **genap atau ganjil** (petunjuk: gunakan `%`).
3. Lakukan tracing untuk kode berikut dan tentukan output akhirnya:

   ```javascript
   let x = 3;
   let y = x * 2;
   x = y + 1;
   y = x - y;
   console.log(x, y);
   ```

**Menengah**

4. Buat program yang menampilkan bilangan **1 sampai 20**, tetapi kelipatan 3 diganti tulisan `"Fizz"`.
5. Buat program **tabel perkalian** 1–10 untuk angka yang dimasukkan pengguna.
6. Diketahui array `suhu = [30, 32, 28, 35, 31, 29, 33]`. Tampilkan suhu terendah, tertinggi, dan rata-rata.

**Lanjutan**

7. Buat fungsi `hitungBayar(totalBelanja, member)`: diskon 10% jika total ≥ 50.000, **tambahan** 5% jika `member` bernilai `true`. Uji dengan 3 data berbeda dan buat tabel tracing-nya.
8. Gambarkan flowchart untuk algoritma login: pengguna diberi **3 kesempatan** memasukkan password; jika gagal 3 kali, tampilkan "Akun diblokir".

**Diskusi**

- Mengapa urutan kondisi pada `if–else if` berpengaruh pada hasil?
- Kapan lebih tepat memakai `while` daripada `for`?

---

## 13. Kuis Singkat

1. Simbol flowchart untuk kondisi/keputusan berbentuk: (a) oval (b) jajar genjang (c) belah ketupat (d) persegi panjang
2. Hasil `17 % 5` adalah: (a) 3 (b) 2 (c) 3.4 (d) 12
3. Indeks pertama sebuah array adalah: (a) 1 (b) 0 (c) -1
4. Perulangan yang **pasti dijalankan minimal sekali**: (a) for (b) while (c) do-while
5. `true && false` menghasilkan: (a) true (b) false

**Kunci jawaban:** 1-c, 2-b, 3-b, 4-c, 5-b

---

## 14. Kesalahan Umum

| Kesalahan                                   | Akibat                                 | Perbaikan                                        |
| ------------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| Memakai `=` untuk membandingkan: `if (x = 5)` | Variabel diisi, kondisi selalu benar | Gunakan `==` atau `===`                          |
| Lupa `i++` di perulangan                    | Infinite loop, browser hang            | Pastikan ada bagian perubahan                    |
| `for (i = 0; i <= arr.length; i++)`         | Mengakses indeks di luar array (`undefined`) | Gunakan `i < arr.length`                   |
| Menjumlahkan string `"5" + "5"`             | Hasil `"55"`                           | Ubah ke angka dulu: `Number("5")`                |
| Urutan `else if` terbalik                   | Predikat salah                         | Cek kondisi dari yang paling ketat               |
| Lupa `$` pada variabel PHP                  | Error "Undefined constant"             | Semua variabel PHP diawali `$`                   |
| Lupa `break` di `switch`                    | Beberapa `case` ikut dijalankan        | Tambahkan `break` di akhir setiap `case`         |

**Sebelumnya:** [Modul 1 — Mengenal Pemrograman dan Computational Thinking](./modul_1_pemrograman_computational_thinking.md)
