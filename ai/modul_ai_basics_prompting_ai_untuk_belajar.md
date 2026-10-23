# Modul — AI Basics dan Prompting AI untuk Belajar Pemrograman

**Mata pelajaran:** Dasar-Dasar Pengembangan Perangkat Lunak — RPL  
**Sasaran:** Siswa SMK yang sedang belajar pemrograman  
**Alat:** Komputer, editor kode, browser, dan layanan AI yang diizinkan guru  
**Prasyarat:** Pernah membaca atau menulis kode sederhana  
**Catatan:** Nama menu dan fitur berbeda-beda pada setiap layanan AI. Ikuti aturan penggunaan AI di sekolah.

---

## 1. Tujuan Pembelajaran

Setelah mempelajari modul ini, kamu mampu:

1. Menjelaskan secara sederhana apa itu AI generatif dan model bahasa besar (LLM).
2. Menulis prompt yang memberi AI konteks dan meminta bantuan sesuai kebutuhan belajar.
3. Menggunakan AI sebagai tutor untuk memahami konsep, membaca kode, memperbaiki bug, dan berlatih.
4. Mengajukan pertanyaan lanjutan untuk menguji pemahaman sendiri.
5. Memeriksa kebenaran dan keamanan jawaban AI sebelum memakai kode.
6. Menjaga privasi, kejujuran akademik, dan kemandirian belajar saat menggunakan AI.

---

## 2. Mengenal AI Generatif

**Kecerdasan buatan (AI)** adalah istilah luas untuk sistem komputer yang melakukan tugas tertentu yang biasanya membutuhkan kemampuan manusia, seperti mengenali pola atau memahami bahasa.

**AI generatif** dapat menghasilkan konten baru, misalnya teks, gambar, atau kode, berdasarkan masukan yang diberikan. **Model bahasa besar (LLM)** adalah salah satu jenis model AI yang dilatih untuk mengenali pola dalam bahasa dan menghasilkan teks yang sesuai dengan konteks.

Saat kamu bertanya tentang kode, AI menghasilkan jawaban berdasarkan pola yang dipelajarinya. AI bukan guru yang selalu benar dan tidak selalu memahami proyek atau kondisi komputermu.

| Kemampuan yang bisa membantu | Hal yang perlu diwaspadai |
| --- | --- |
| Menjelaskan istilah dengan bahasa sederhana | Penjelasan bisa keliru atau kurang tepat |
| Memberi contoh kode dan latihan | Contoh bisa tidak cocok dengan versi atau proyekmu |
| Membantu membaca pesan error | AI belum tentu tahu seluruh konteks yang tidak kamu kirim |
| Menyarankan langkah mencari bug | Jawaban yang terdengar yakin belum tentu benar |
| Mengubah penjelasan sesuai tingkat pemahaman | AI tidak menggantikan latihan dan penilaianmu sendiri |

**Prinsip utama:** gunakan AI sebagai teman belajar yang bisa diajak berdiskusi, bukan sebagai sumber kebenaran yang harus selalu diikuti.

---

## 3. Cara Belajar dengan AI

Siklus belajar yang disarankan:

```text
TENTUKAN YANG BELUM DIPAHAMI
          │
          ▼
MINTA PENJELASAN ATAU PETUNJUK
          │
          ▼
BACA, BERTANYA LANJUTAN, DAN COBA SENDIRI
          │
          ▼
JELASKAN KEMBALI DENGAN KATA-KATAMU
          │
          ▼
UJI KODE DAN PERIKSA HASILNYA
          │
          └──────────▶ Jika belum paham, lanjut bertanya
```

Sebelum membuat prompt, tuliskan untuk dirimu sendiri:

- **Tujuan:** hal apa yang ingin saya pelajari?
- **Pengetahuan awal:** apa yang sudah saya ketahui atau coba?
- **Kebingungan:** bagian mana yang belum saya mengerti?
- **Bentuk bantuan:** penjelasan, pertanyaan pemandu, contoh kecil, atau latihan?

---

## 4. Menulis Prompt yang Membantu Belajar

Prompt adalah instruksi atau pertanyaan yang kita berikan kepada AI. Prompt tidak harus panjang. Yang penting, AI mendapat konteks yang cukup dan tahu cara membantu yang kamu inginkan.

### 4.1 Kerangka belajar: PKTBF

Gunakan kerangka berikut sebagai pengingat. Tidak semua bagian harus selalu ditulis; pilih yang membantu.

| Bagian | Pertanyaan yang dijawab | Contoh |
| --- | --- | --- |
| **P — Peran** | AI diminta membantu sebagai siapa? | "Bertindaklah sebagai tutor JavaScript untuk pemula." |
| **K — Konteks** | Apa yang sedang saya pelajari atau coba? | "Saya belajar perulangan `for` dan sudah mencoba mencetak angka 1 sampai 5." |
| **T — Tugas** | Bantuan apa yang saya butuhkan? | "Jelaskan mengapa perulangan saya berjalan enam kali." |
| **B — Batasan** | Apa yang sebaiknya dilakukan atau dihindari? | "Jangan langsung memberikan kode final. Tanyakan satu pertanyaan pemandu terlebih dahulu." |
| **F — Format** | Seperti apa bentuk jawabannya? | "Gunakan bahasa sederhana, lalu beri satu latihan tanpa kunci jawaban." |

### 4.2 Perbandingan prompt

**Terlalu umum:**

```text
Ajari saya JavaScript.
```

**Lebih membantu untuk belajar:**

```text
Saya siswa SMK yang sedang belajar JavaScript dan baru memahami variabel
serta if/else. Jelaskan perulangan for menggunakan analogi sederhana.
Tanyakan satu pertanyaan untuk mengecek pemahaman saya sebelum memberi
latihan. Jangan berikan jawaban latihan sampai saya mencoba.
```

Prompt kedua memberi tahu tingkat belajar, topik, cara menjelaskan, dan bagaimana menjaga siswa tetap aktif.

### 4.3 Minta bantuan bertahap

Jika tujuanmu adalah belajar, jelaskan bahwa kamu ingin mencoba sendiri:

```text
Jangan langsung menulis solusi lengkap. Mulai dengan:
1. Menjelaskan konsep yang perlu saya gunakan.
2. Memberi satu petunjuk kecil.
3. Menunggu saya mencoba.
Jika saya masih bingung, berikan petunjuk berikutnya.
```

Kamu juga bisa meminta AI memakai metode **Socratic**, yaitu membantu dengan pertanyaan pemandu, bukan langsung memberikan solusi. Tetap periksa apakah metode itu sesuai tugas dan arahan guru.

---

## 5. Contoh Prompt untuk Belajar Pemrograman

Ganti teks di dalam tanda kurung siku dengan informasi proyekmu. Jangan menyertakan kata sandi, token, atau data pribadi.

### 5.1 Memahami konsep baru

```text
Saya sedang belajar [topik] dengan [bahasa pemrograman].
Pengetahuan saya saat ini adalah [konsep yang sudah dipahami].
Jelaskan [topik] untuk pemula dengan bahasa sederhana dan satu analogi.
Setelah itu, tanyakan satu pertanyaan singkat untuk mengecek pemahaman.
Jangan berikan kode solusi sebelum saya mencoba menjawab.
```

### 5.2 Memahami kode baris demi baris

```text
Saya sedang belajar [bahasa/topik]. Tolong bantu saya memahami kode berikut,
bukan menggantikannya dengan kode baru.

[tempel potongan kode pendek yang tidak berisi rahasia]

Jelaskan fungsi setiap bagian dalam poin-poin. Tandai istilah yang perlu
saya cari tahu, lalu tanyakan bagian mana yang ingin saya bahas lebih lanjut.
```

### 5.3 Mendapatkan petunjuk untuk menyelesaikan latihan

```text
Saya mengerjakan latihan berikut: [jelaskan tujuan latihan].
Saya sudah mencoba [jelaskan langkah atau logika yang dicoba], tetapi belum
memahami [bagian yang membingungkan].

Jangan tulis jawaban akhir. Berikan satu petunjuk yang bisa saya gunakan,
lalu ajukan satu pertanyaan agar saya dapat melanjutkan sendiri.
```

### 5.4 Belajar memperbaiki bug

```text
Saya pemula di [bahasa pemrograman] dan sedang mencoba [tujuan program].

Hasil yang saya harapkan: [hasil].
Hasil yang terjadi: [hasil atau pesan error].

Ini potongan kode terkait:
[tempel kode minimum yang menunjukkan masalah; hapus informasi rahasia]

Jangan langsung menulis ulang seluruh program. Tunjukkan kemungkinan bagian
yang perlu saya periksa, jelaskan cara mengujinya, dan berikan satu petunjuk
terlebih dahulu.
```

### 5.5 Meminta latihan tambahan

```text
Saya baru belajar [topik] di [bahasa pemrograman].
Buat tiga latihan bertahap: dasar, menengah, dan tantangan.
Jangan tampilkan jawabannya dulu. Untuk setiap latihan, jelaskan tujuan
belajarnya dan kriteria untuk mengecek hasil.
Setelah saya mengirim percobaan, berikan umpan balik dengan menunjukkan
apa yang sudah benar dan satu hal yang perlu diperbaiki.
```

### 5.6 Meminta umpan balik atas kode

```text
Tolong jadilah tutor yang memberi umpan balik pada kode saya.
Tujuan program: [tujuan].
Aturan dari guru/tugas: [aturan yang harus diikuti].

[tempel potongan kode tanpa informasi rahasia]

Jangan menulis ulang seluruh kode. Sebutkan:
1. Satu hal yang sudah benar.
2. Bagian pertama yang perlu saya periksa.
3. Pertanyaan yang membantu saya menemukan perbaikannya sendiri.
```

### 5.7 Contoh sesi dialog

**Siswa:**

```text
Saya belajar array JavaScript. Jangan langsung memberikan kode.
Tanyakan satu pertanyaan yang membantu saya memahami cara mengambil elemen
pertama dari array ["apel", "mangga", "jeruk"].
```

**Setelah mencoba menjawab**, siswa dapat melanjutkan:

```text
Saya menduga indeksnya 1 karena itu elemen pertama. Apakah penalaran saya
benar? Jelaskan cara memeriksanya dan beri saya satu latihan baru.
```

Dengan mencoba dahulu lalu meminta penjelasan, kamu melatih pemahaman alih-alih hanya menyalin jawaban.

---

## 6. Memeriksa Jawaban dan Kode dari AI

AI dapat memberikan jawaban yang salah, usang, tidak lengkap, atau tidak cocok dengan tugas. Lakukan pemeriksaan sebelum menggunakan jawabannya.

### 6.1 Periksa penjelasan

1. Apakah jawaban menjawab pertanyaan yang kamu ajukan?
2. Apakah istilahnya sesuai materi dan versi bahasa pemrograman yang digunakan?
3. Apakah contoh yang diberikan dapat kamu jelaskan kembali dengan kata-katamu?
4. Jika ragu, tanyakan alasan di balik jawaban atau bandingkan dengan dokumentasi dan materi kelas.

### 6.2 Periksa kode

1. Pahami setiap bagian kode sebelum menjalankannya.
2. Jalankan pada proyek latihan atau lingkungan yang aman, bukan langsung pada data penting.
3. Uji masukan normal, masukan kosong, dan beberapa kasus batas yang relevan.
4. Perhatikan pesan error dan pastikan hasilnya sesuai kebutuhan.
5. Periksa apakah saran AI mengikuti instruksi guru dan menggunakan praktik yang aman.
6. Jika kode berhubungan dengan database, cek parameter query dan jangan masukkan kredensial ke dalam kode yang dibagikan.

Untuk tugas yang belum meminta implementasi, jangan meminta atau menyalin solusi final. Gunakan petunjuk, pertanyaan pemandu, dan latihan agar kamu tetap mengerjakan proses belajarnya.

---

## 7. Privasi, Keamanan, dan Kejujuran

### 7.1 Jaga informasi

Jangan masukkan hal-hal berikut ke layanan AI:

- Kata sandi, access token, private key, atau isi file `.env`.
- Data pribadi diri sendiri, teman, guru, atau pengguna.
- Data sekolah atau proyek yang tidak memiliki izin untuk dibagikan.
- Isi tugas, dokumen, atau kode yang oleh guru atau pemiliknya dinyatakan rahasia.

Jika membutuhkan bantuan tentang kode, bagikan **potongan terkecil yang diperlukan** dan ganti nama, alamat, password, serta data nyata dengan contoh fiktif.

### 7.2 Gunakan kode dengan aman

- Jangan menjalankan perintah terminal atau script yang belum kamu pahami.
- Hindari menguji kode AI pada database atau file penting.
- Jangan memasang paket atau memberikan akses perangkat berdasarkan saran AI tanpa memahami alasannya.
- Minta guru atau orang yang paham untuk memeriksa tindakan yang dapat menghapus data atau mengubah konfigurasi.

### 7.3 Bersikap jujur

- Ikuti aturan guru dan sekolah mengenai bantuan AI.
- Jika penggunaan AI harus dicatat, tulis layanan yang digunakan dan bagian bantuan yang kamu manfaatkan.
- Jangan mengaku membuat sendiri jawaban yang seluruhnya dibuatkan AI.
- Pastikan kamu mampu menjelaskan dan mempertanggungjawabkan kode yang dikumpulkan.

Contoh catatan penggunaan:

```text
AI digunakan untuk meminta penjelasan konsep array dan membuat latihan.
Kode akhir saya tulis dan uji sendiri.
```

---

## 8. Aktivitas: Belajar Perulangan dengan Tutor AI

**Waktu:** 30–45 menit  
**Tujuan:** Memahami cara kerja `for` tanpa menyalin solusi.

1. Buat program kecil yang menampilkan angka 1 sampai 5 menggunakan bahasa pemrograman yang sedang dipelajari.
2. Coba sendiri dahulu. Catat bagian yang belum dipahami.
3. Kirim prompt belajar bertahap dari bagian 4.3. Minta AI memberi **satu petunjuk saja**.
4. Perbaiki program berdasarkan pemahamanmu, lalu jalankan dan periksa hasilnya.
5. Jika belum berhasil, catat pesan error dan minta petunjuk berikutnya.
6. Minta AI membuat satu latihan baru tanpa jawaban.
7. Setelah selesai, jelaskan kepada teman atau guru cara kerja programmu tanpa membaca jawaban AI.

### Lembar refleksi

| Pertanyaan | Catatan saya |
| --- | --- |
| Apa yang awalnya belum saya pahami? | |
| Petunjuk apa yang membantu? | |
| Apa perubahan yang saya buat sendiri? | |
| Bagaimana saya menguji program? | |
| Bagian mana dari jawaban AI yang saya verifikasi? | |

---

## 9. Aktivitas: Meningkatkan Prompt

Perbaiki prompt yang masih umum berikut agar AI menjadi tutor, bukan pemberi jawaban langsung:

```text
Buatkan program PHP untuk tambah data siswa.
```

Prompt yang lebih baik seharusnya menyebutkan tujuan belajarmu, pengetahuan awal, batasan bantuan, konteks latihan yang aman, dan bentuk jawaban yang diinginkan.

**Contoh:**

```text
Saya sedang belajar PHP dan sudah memahami variabel serta form HTML.
Untuk latihan lokal tanpa database sungguhan, bantu saya merancang langkah
validasi input nama siswa sebelum data ditampilkan.
Jangan tulis program lengkap. Jelaskan konsep yang perlu digunakan, beri
satu petunjuk, lalu tanyakan apa yang akan saya coba.
```

Kemudian, periksa apakah prompt itu:

- Meminta bantuan yang spesifik.
- Memberi informasi yang cukup tanpa membagikan data rahasia.
- Membuat kamu tetap aktif mencoba sendiri.
- Menjelaskan bentuk bantuan yang diharapkan.

---

## 10. Kuis dan Refleksi

1. Mengapa jawaban AI yang terdengar yakin tetap perlu diperiksa?
2. Apa bedanya prompt "buatkan kode" dengan prompt yang meminta satu petunjuk?
3. Sebutkan tiga jenis informasi yang tidak boleh dikirim ke AI.
4. Sebelum menjalankan kode dari AI, apa saja yang sebaiknya kamu lakukan?
5. Bagaimana kamu menunjukkan kejujuran saat menggunakan bantuan AI untuk belajar?

<details>
<summary>Kunci jawaban</summary>

1. AI bisa salah, mengarang detail, atau memberi jawaban yang tidak cocok dengan versi, konteks proyek, atau tugas.
2. "Buatkan kode" meminta hasil jadi; meminta satu petunjuk membantu kita memahami dan menyelesaikan masalah sendiri.
3. Contohnya kata sandi/token/private key, data pribadi, serta data sekolah atau proyek rahasia tanpa izin.
4. Pahami kode, periksa kesesuaiannya, uji di lingkungan aman, dan jangan jalankan perintah yang belum dimengerti.
5. Ikuti aturan guru, catat atau sebutkan bantuan AI jika diminta, dan pastikan dapat menjelaskan pekerjaan sendiri.

</details>

---

## 11. Ringkasan

- AI generatif dapat membantu menjelaskan konsep, membaca kode, memberi petunjuk, dan membuat latihan, tetapi jawabannya bisa salah.
- Prompt belajar yang baik memberi konteks, tujuan, batasan, dan format bantuan.
- Minta penjelasan bertahap, satu petunjuk, atau pertanyaan pemandu jika ingin tetap berlatih mandiri.
- Pahami, verifikasi, dan uji kode sebelum menggunakannya.
- Jangan bagikan rahasia atau data pribadi. Ikuti aturan sekolah dan jujur tentang bantuan AI.
