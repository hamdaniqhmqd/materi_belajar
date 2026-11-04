# Pembuatan PDF modul ADSI

Tabel istilah dan tabel simbol menggunakan gambar SVG lokal pada `../assets/simbol/`, sehingga bentuk tidak bergantung pada dukungan karakter simbol suatu font. Bentuk flowchart, ASME, serta perbandingan DFD mengikuti referensi `../2-3-4-5-6- MATERi Flowchart dan_ADSI_TERSTRUKTUR.pdf` (bagian simbol flowchart, flowchart proses, dan simbol DFD). Ilustrasi konsep seperti variabel, bottleneck, dan balancing bukan simbol standar tersendiri.

## Persyaratan

Node.js 22 atau lebih baru dan Microsoft Edge terpasang. Dari direktori ini:

```powershell
npm ci
npm run build
```

Build membaca kelima sumber Markdown dan menulis PDF ke `../pdf/`. Semua gambar dimasukkan langsung ke HTML sebagai data SVG; Mermaid dirender lokal, tanpa mengirim isi modul ke layanan luar. Build gagal jika diagram gagal dirender atau gambar tidak dapat dimuat. Tata letak menggunakan A4 dan nomor halaman.

Untuk mengubah bentuk gambar, edit `generate-symbols.mjs`, lalu jalankan:

```powershell
node generate-symbols.mjs
npm run build
```

Periksa kembali halaman tabel dan diagram pada PDF setelah mengubah materi, khususnya baris tabel yang panjang. Folder `node_modules` tidak disertakan dalam Git; versi dependensi dikunci oleh lockfile.
