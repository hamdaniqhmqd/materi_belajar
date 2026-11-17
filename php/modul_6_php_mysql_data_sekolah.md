# Modul 6 — PHP & MySQL: MVC untuk Mengelola Data Sekolah

**Mata pelajaran:** Pemrograman Web dan Basis Data — RPL
**Alat:** XAMPP (Apache + MySQL/MariaDB + PHP), Composer, editor kode
**Studi kasus:** Aplikasi MVC data sekolah — proyek `crud_siswa`, database `db_sekolah`
**Prasyarat:** [Modul 4](modul_4_php_mysql.md), [Modul 5 PHP](modul_5_php_menengah_mahir.md), PHP OOP dasar, PDO, dan CRUD.
**Versi PHP:** PHP 8.0 atau lebih baru dengan ekstensi PDO MySQL.
**Alokasi:** 8 pertemuan × 3 JP.
**Hasil:** aplikasi MVC ber-namespace untuk CRUD `siswa`, `jurusan`, `mapel`, dan `nilai`; model mendefinisikan koneksi, struktur tabel, field, serta relasi, sedangkan controller mengelola query dan logika CRUD.

> **Catatan:** Contoh disusun mengikuti schema Modul DDL saat ini. Terapkan dahulu pada database latihan dan buat backup. Modul ini belum memasang autentikasi; jalankan hanya di komputer lokal. Modul 7 akan menambahkan autentikasi dan otorisasi.

---

## 1. Tujuan Pembelajaran

Setelah menyelesaikan modul, peserta mampu:

1. Memetakan alur Model–Controller–View pada aplikasi PHP.
2. Menggunakan Composer untuk memasang package dan autoload namespace PSR-4.
3. Mendefinisikan struktur dan relasi data di model, serta mengelola query dan logika CRUD di controller.
4. Mengelola seluruh tabel `db_sekolah` tanpa menerima nama tabel/kolom dari request.
5. Menggunakan prepared statement, validasi server, foreign key, POST, CSRF, dan Post/Redirect/Get.
6. Menjalankan aplikasi, menelusuri error, serta menguji CRUD setiap entitas.

---

## 2. Konsep dan Struktur Aplikasi

Gunakan proyek `crud_siswa` dari Modul 4 sebagai titik awal. Pada modul ini tidak ada folder repository. Model mendeskripsikan tabel, primary key, field yang dapat diisi, tipe data, serta relasi antartabel. Controller menggunakan koneksi PDO dari model untuk menjalankan query, mengatur validasi, dan memproses aksi CRUD. Halaman lama Modul 4 boleh disimpan sebagai perbandingan, tetapi aplikasi MVC baru hanya dijalankan melalui `public/index.php`.

Buat struktur berikut. File `.php` di bawah ini seluruhnya dikonfigurasi dalam modul; jangan menggabungkan kode beberapa file menjadi satu file.

```text
crud_siswa\
├── app\
│   ├── Config\
│   │   └── Database.php
│   ├── Controllers\
│   │   ├── Controller.php
│   │   ├── JurusanController.php
│   │   ├── MapelController.php
│   │   ├── NilaiController.php
│   │   └── SiswaController.php
│   ├── Models\
│   │   ├── Model.php
│   │   ├── Relation.php
│   │   ├── Jurusan.php
│   │   ├── Mapel.php
│   │   ├── Nilai.php
│   │   └── Siswa.php
│   ├── Support\
│   │   ├── Csrf.php
│   │   ├── Http.php
│   │   └── Validator.php
│   └── Views\
│       ├── layouts\
│       │   └── main.php
│       ├── shared\
│       │   ├── form.php
│       │   ├── index.php
│       │   └── show.php
│       ├── jurusan\
│       │   ├── form.php
│       │   ├── index.php
│       │   └── show.php
│       ├── mapel\
│       │   ├── form.php
│       │   ├── index.php
│       │   └── show.php
│       ├── nilai\
│       │   ├── batch.php
│       │   ├── form.php
│       │   ├── index.php
│       │   ├── laporan.php
│       │   └── show.php
│       └── siswa\
│           ├── form.php
│           ├── index.php
│           └── show.php
├── .env                    ← konfigurasi lokal/rahasia; jangan commit
├── .env.example            ← contoh tanpa rahasia; boleh disimpan di Git
├── .gitignore              ← mengabaikan .env dan vendor/
├── composer.json           ← dependency dan autoload PSR-4
├── composer.lock           ← versi dependency yang terkunci; simpan di Git
├── vendor\                 ← dibuat Composer; jangan diedit/commit
└── public\
    └── index.php
```

### 2.1 Istilah dan sintaks OOP PHP yang digunakan

Contoh-contoh modul memakai beberapa fitur OOP dan type declaration PHP. Pahami istilah berikut sebelum membaca class model dan controller:

| Sintaks | Arti | Contoh dalam modul |
|---|---|---|
| `class Nama` | Mendefinisikan cetak biru objek yang memiliki properti dan method. | `class Relation` |
| `abstract class` | Class dasar yang tidak boleh dibuat langsung dengan `new`. Class ini menjadi kerangka untuk class turunan dan dapat memiliki method berisi implementasi. | `abstract class Model` dan `abstract class Controller` |
| `final class` | Class yang tidak boleh diturunkan lagi dengan `extends`. Gunakan untuk class konkret yang memang tidak dirancang sebagai class dasar. | `final class Siswa extends Model` |
| `extends` | Menyatakan pewarisan; class anak memperoleh properti/method yang dapat diakses dari class induk. | `Siswa extends Model` |
| `interface` | Kontrak berisi deklarasi method yang wajib dipenuhi class implementasi. Interface tidak menyimpan implementasi state seperti class biasa. Modul ini memakai class `Relation`, bukan interface untuk mendeskripsikan tabel. | Tidak dipakai untuk model tabel pada rancangan ini |
| `public` | Dapat dipanggil dari mana pun selama objek/class tersedia. | `$model->connection()` |
| `protected` | Dapat diakses oleh class itu sendiri dan class turunannya, tetapi bukan pemanggil dari luar. | `$this->hasMany(...)` di model anak; `$this->searchRows(...)` di controller anak |
| `private` | Hanya dapat diakses dari dalam class yang mendeklarasikannya. | `$this->persist(...)` di `Controller` |
| `static` | Method/properti milik class, bukan instance tertentu; method dipanggil memakai `NamaClass::method()`. | `Database::connect()`, `Http::e()` |
| `namespace` | Memberi nama ruang bagi class agar nama class tidak mudah bertabrakan dan autoloader dapat menemukan file. | `namespace App\Models;` |
| `use Nama\Class;` | Mengimpor nama class/namespace agar dapat dipakai tanpa menulis nama lengkapnya berulang kali. | `use PDO;` |
| `NamaClass::class` | Menghasilkan nama class lengkap sebagai string, tanpa membuat objek. | `Siswa::class` dikirim sebagai metadata relasi |
| `__construct()` | Method khusus yang otomatis dipanggil ketika objek dibuat dengan `new`; biasanya dipakai menerima dependency. | `new Siswa($pdo)` memanggil constructor model |
| `parent::__construct(...)` | Memanggil constructor milik class induk dari constructor class anak. | Controller entitas meneruskan model dan konfigurasi ke `Controller` |
| `$this` | Referensi ke objek yang sedang menjalankan method. Dipakai untuk membaca properti atau memanggil method objek yang sama. | `$this->model`, `$this->hasMany(...)` |
| `: string`, `: array`, `: PDO` | Return type yang menyatakan tipe hasil method. PHP memeriksa bahwa nilai yang dikembalikan sesuai tipe tersebut. | `public function table(): string` |
| `: void` | Method tidak mengembalikan nilai. | `public function destroy(): void` |
| `?int` | Nullable type: nilainya boleh `int` atau `null`. | `saveRow(?int $id, ...)`; `null` berarti insert baru |
| `array|false` | Union type: hasil boleh berupa array atau boolean `false`. | `findRow()` memakai `false` jika baris tidak ditemukan |
| `mixed` | Nilai boleh bertipe apa pun. Biasanya dipakai pada batas input yang belum dipercaya, kemudian perlu diperiksa sebelum dipakai. | `Http::e(mixed $value)` |
| `private PDO $pdo` pada constructor | Constructor property promotion PHP 8: parameter constructor sekaligus dideklarasikan dan disimpan sebagai properti. | `public function __construct(protected PDO $pdo)` |
| `declare(strict_types=1);` | Mengaktifkan pemeriksaan tipe yang lebih ketat untuk pemanggilan fungsi dari file tersebut. Ini bukan pengganti validasi input. | Baris awal setiap file PHP contoh |

#### Perbedaan `abstract class`, `final class`, dan `interface`

`Model` dan `Controller` dibuat `abstract` karena keduanya menyediakan perilaku/kontrak dasar yang harus dilengkapi oleh class konkret. Kita tidak membuat objek dasar secara langsung:

```php
$model = new Model($pdo); // tidak boleh: Model adalah abstract
$siswa = new Siswa($pdo); // boleh: Siswa adalah class konkret
```

`Siswa`, `Jurusan`, dan controller entitas dibuat `final` karena modul tidak mengharapkan class lain mewarisi implementasi konkretnya. Keyword `final` tidak berarti objeknya konstan atau datanya tidak dapat diubah; ia hanya melarang pewarisan dari class tersebut.

`interface` berbeda dari `abstract class`: interface menjelaskan method apa yang harus tersedia tanpa menjadi tempat utama untuk menyimpan properti koneksi bersama. Rancangan modul ini sengaja memakai abstract class `Model` agar constructor PDO dan accessor metadata dapat diwariskan, lalu memakai `Relation` sebagai objek deskripsi relasi. Ini adalah pilihan desain sederhana untuk latihan, bukan aturan wajib semua aplikasi PHP.

#### Constructor property promotion dan pemanggilan method

Pada PHP 8, parameter constructor yang diawali visibility seperti `protected PDO $pdo` sekaligus membuat properti dan mengisi nilainya. Bentuk ringkas berikut:

```php
public function __construct(protected PDO $pdo)
{
}
```

setara secara konsep dengan bentuk lebih panjang:

```php
protected PDO $pdo;

public function __construct(PDO $pdo)
{
    $this->pdo = $pdo;
}
```

Operator `->` dipakai untuk mengakses properti/method objek, sedangkan `::` dipakai untuk anggota class seperti method static atau konstanta. Contohnya `$siswa->jurusan()` memanggil method pada objek, sedangkan `Database::connect()` memanggil method static pada class.

Jangan gunakan kembali `koneksi.php` sebagai titik masuk aplikasi baru. `Database` membuat koneksi PDO, lalu koneksi itu diberikan kepada model melalui constructor. Controller mengambil koneksi tersebut dari model untuk menjalankan operasi data.

| Lapisan | Tanggung jawab |
|---|---|
| `Models` | Memegang koneksi PDO dan mendeskripsikan nama tabel, primary key, field, tipe data, serta relasi |
| `Controllers` | Membaca request, menjalankan query CRUD melalui koneksi model, menerapkan logika aplikasi, lalu memilih view |
| `Views` | Merender data; tidak membaca PDO atau mengubah database |
| `Config` dan `Support` | Koneksi, validasi input request, respons HTTP, output aman, dan CSRF |

Alur request dimulai dari `public/index.php`, diteruskan ke controller. Controller memakai koneksi dan metadata model untuk membaca atau mengubah database, kemudian mengirim hasil ke view. Alur pemrosesan data yang terlihat adalah **Model → Controller → View**: model menyediakan definisi entitas/relasi, controller menjalankan logika, dan view menampilkan hasil. View tidak mengakses database.

`Controller.php` adalah controller dasar buatan kita dengan method aksi `index`, `show`, `create`, `store`, `edit`, `update`, dan `destroy`. Ia menangani alur CRUD memakai koneksi PDO dan metadata dari model, sementara keempat controller entitas menentukan pencarian, filter, query daftar, detail beserta relasinya, dan aksi tambahan bila dibutuhkan. Polanya terinspirasi Laravel, tetapi ini bukan Laravel: tidak memakai router, request/response, middleware, atau ORM Eloquent.

Tidak ada repository. Definisi tabel dan relasi berada di model; operasi SQL CRUD berada di controller. Nama tabel/kolom hanya berasal dari definisi kode yang tepercaya, tidak pernah dari request.

Namespace mengikuti folder relatif terhadap `app`: `App\Models\Siswa` berada di `app/Models/Siswa.php`. Nama file dan kelas harus sama persis, termasuk huruf besar-kecil.

---

## 3. Persiapan Schema Database

Schema awal dari Modul DDL:

| Tabel | Kolom | Aturan/relasi |
|---|---|---|
| `jurusan` | `id_jurusan`, `nama_jurusan` | Nama unik |
| `siswa` | `id_siswa`, `nama`, `email`, `jenis_kelamin`, `tanggal_lahir`, `id_jurusan`, `created_at` | Email unik; `id_jurusan` boleh NULL; FK jurusan `ON DELETE SET NULL` |
| `mapel` | `id_mapel`, `nama_mapel` | Nama unik |
| `nilai` | `id_nilai`, `id_siswa`, `id_mapel`, `nilai_angka`, `semester` | FK siswa dan mapel dengan `ON DELETE CASCADE` |

Kolom `nis`, `kelas`, dan `tahun_ajaran` **tidak** ada pada schema dasar. Jangan memakai query atau field untuk kolom tersebut sebelum ada migrasi schema.

Periksa schema yang benar-benar terpasang:

```sql
USE db_sekolah;
SHOW CREATE TABLE jurusan;
SHOW CREATE TABLE siswa;
SHOW CREATE TABLE mapel;
SHOW CREATE TABLE nilai;
```

Untuk praktik, aplikasi menerapkan kebijakan nilai 0–100 dengan maksimal dua desimal, semester 1–6, dan satu nilai akhir per siswa/mapel/semester. Schema dasar belum menjamin tiga aturan itu pada level database. Constraint unik opsional dapat ditambahkan setelah membuat backup dan memeriksa duplikasi lama:

```sql
ALTER TABLE nilai
ADD CONSTRAINT uq_nilai_siswa_mapel_semester
UNIQUE (id_siswa, id_mapel, semester);
```

Jangan menghapus duplikasi secara otomatis: operator harus menentukan catatan yang benar. `ALTER TABLE` dapat melakukan implicit commit di MySQL.

| Baris dihapus | Dampak FK |
|---|---|
| Jurusan | Siswa tetap ada; `id_jurusan` menjadi NULL |
| Siswa | Nilai milik siswa ikut terhapus |
| Mapel | Nilai pada mapel itu ikut terhapus |
| Nilai | Hanya baris nilai tersebut yang dihapus |

---

## 4. File Konfigurasi dan Pendukung

### 4.1 `composer.json` dan instalasi package

Modul 5 memperkenalkan autoload Composer secara opsional. Pada proyek MVC ini, gunakan Composer secara konsisten untuk autoload kelas `App\` dan memasang package [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv) agar pembacaan `.env` tidak ditulis sendiri.

Buat `crud_siswa/composer.json`:

```json
{
    "name": "sekolah/crud-siswa",
    "description": "Aplikasi MVC PHP untuk mengelola data sekolah",
    "type": "project",
    "require": {
        "php": "^8.0",
        "ext-pdo": "*",
        "ext-pdo_mysql": "*",
        "vlucas/phpdotenv": "^5.6"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        }
    }
}
```

Penjelasan konfigurasi:

- `name` adalah identitas package/proyek untuk Composer; formatnya `vendor/nama-proyek`.
- `description` membantu menjelaskan fungsi proyek.
- `type: project` menandakan ini aplikasi yang memasang dependency, bukan package/library untuk dibagikan.
- `require.php` membatasi versi PHP yang didukung mulai PHP 8.0.
- `ext-pdo` dan `ext-pdo_mysql` menyatakan bahwa aplikasi memerlukan PDO dan driver MySQL.
- `vlucas/phpdotenv` menyediakan class `Dotenv` untuk membaca `.env`; Composer mengunci versi yang kompatibel pada rentang 5.6.
- `autoload.psr-4` menghubungkan namespace `App\` ke direktori `app/`. Contohnya `App\Models\Siswa` dicari di `app/Models/Siswa.php`.
- `composer.lock` menyimpan versi dependency yang benar-benar terpasang, agar instalasi di komputer lain konsisten.

Jalankan perintah berikut dari folder proyek, bukan dari folder `app` atau `public`:

```powershell
cd C:\xampp\htdocs\crud_siswa
composer install
composer validate
composer dump-autoload
```

Arti perintah:

- `cd` berpindah ke root proyek sehingga Composer menemukan `composer.json`.
- `composer install` memasang dependency sesuai lockfile dan membuat `vendor/autoload.php`.
- `composer validate` memeriksa struktur/metadata manifest Composer.
- `composer dump-autoload` membangun ulang daftar autoload setelah konfigurasi namespace berubah; biasanya tidak perlu dijalankan terpisah setelah `composer install`.

`composer install` mengunduh dependency dan membuat `vendor/autoload.php` serta `composer.lock`. Simpan `composer.json` dan `composer.lock` di Git agar komputer lain memasang versi package yang sama. Folder `vendor/` dibuat ulang melalui Composer dan tidak perlu di-commit. Jika manifest `composer.json` berubah, jalankan `composer update` secara sengaja untuk memperbarui lockfile; pada komputer lain tetap gunakan `composer install`.

Buat `crud_siswa/.gitignore`:

```gitignore
.env
/vendor/
```

Baris `.env` mengabaikan file kredensial lokal. Baris `/vendor/` mengabaikan dependency hasil instalasi pada root proyek; folder itu dapat dibuat ulang dengan Composer.

Jangan abaikan `composer.lock` untuk aplikasi ini. `.env.example` bukan file rahasia dan boleh di-commit.

### 4.2 File `.env` dan `app/Config/Database.php`

PHP tidak membaca file `.env` secara otomatis. Package `vlucas/phpdotenv` akan memuat nilai dari `.env` di root proyek (`crud_siswa/.env`) dan tidak menimpa environment yang telah disediakan server.

Buat `crud_siswa/.env`:

```ini
DB_HOST=127.0.0.1
DB_NAME=db_sekolah
DB_USER=root
DB_PASS=""
```

`DB_HOST` menentukan host MySQL, `DB_NAME` nama database, `DB_USER` nama akun database, dan `DB_PASS` password akun. Tanda kutip pada nilai kosong membuat `DB_PASS` tetap terbaca sebagai string kosong oleh phpdotenv.

Sesuaikan host, nama database, username, dan password dengan instalasi MySQL setempat. `root` dengan password kosong hanya contoh bawaan XAMPP lokal. Untuk password dengan spasi atau karakter khusus, bungkus nilainya dengan tanda kutip:

```ini
DB_PASS="password lokal dengan karakter khusus"
```

Tanda kutip memastikan spasi dan tanda baca berada dalam satu nilai konfigurasi. Jangan mengetik tanda kutip tambahan di luar pasangan kutip, dan jangan memasukkan password sungguhan pada contoh `.env.example`.

Buat juga `crud_siswa/.env.example`:

```ini
DB_HOST=127.0.0.1
DB_NAME=db_sekolah
DB_USER=root
DB_PASS=""
```

`.env.example` mendokumentasikan nama konfigurasi yang dibutuhkan dan dapat disimpan di Git karena tidak berisi rahasia aktual. Salin file ini menjadi `.env` pada komputer masing-masing, lalu sesuaikan nilainya. Pastikan `.gitignore` proyek memuat aturan `.env` dan `/vendor/` seperti pada bagian 4.1.

Pastikan `.env` tidak dapat diunduh melalui Apache. Pilihan yang dianjurkan adalah mengatur document root VirtualHost ke folder `crud_siswa/public`, sehingga file konfigurasi di folder induk berada di luar document root. Jika menggunakan XAMPP dengan document root bawaan, tambahkan aturan Apache untuk menolak akses ke `.env` dan uji bahwa `http://localhost/crud_siswa/.env` mengembalikan 403 atau 404. Jangan meneruskan pengerjaan bila file tersebut dapat dibaca dari browser.

Isi `app/Config/Database.php`:

```php
<?php
declare(strict_types=1);

namespace App\Config;

use PDO;
use Dotenv\Dotenv;

final class Database
{
    public static function connect(): PDO
    {
        $root = dirname(__DIR__, 2);
        $dotenv = Dotenv::createImmutable($root);
        $dotenv->safeLoad();
        $dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER'])->notEmpty();
        $dotenv->required('DB_PASS');

        $host = trim($_ENV['DB_HOST']);
        $name = trim($_ENV['DB_NAME']);
        $user = trim($_ENV['DB_USER']);
        $pass = $_ENV['DB_PASS'];

        $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";

        return new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
```

`DB_PASS=""` adalah nilai kosong yang sah untuk XAMPP lokal. `safeLoad()` mengizinkan konfigurasi berasal dari environment server tanpa file `.env`; `required()` tetap menolak variabel wajib yang tidak tersedia. Untuk produksi, gunakan akun database berhak minimum, rahasia dari environment server atau secret manager, dan letakkan `.env` di luar document root. Jangan commit `.env` atau menampilkan detail exception koneksi kepada browser.

Penjelasan fungsi `Database::connect()`:

1. `dirname(__DIR__, 2)` naik dari `app/Config` ke root proyek; `Dotenv::createImmutable()` membuat loader `.env` yang tidak menimpa variable environment server yang telah tersedia.
2. `safeLoad()` memuat `.env` jika tersedia. Ketiadaan file tidak langsung menjadi error karena deployment dapat menyediakan nilai melalui environment server.
3. `required([...])->notEmpty()` mewajibkan host, nama database, dan username tersedia serta tidak kosong. `required('DB_PASS')` memastikan password didefinisikan; nilai kosong tetap valid untuk XAMPP lokal.
4. Nilai dibaca melalui `$_ENV`, lalu disusun menjadi DSN MySQL dengan charset `utf8mb4`.
5. `new PDO(...)` membuka koneksi. `ERRMODE_EXCEPTION` melempar exception untuk kegagalan database, `FETCH_ASSOC` membuat hasil query berupa array dengan nama kolom sebagai key, dan `EMULATE_PREPARES=false` meminta prepared statement native bila driver mendukungnya.
6. Objek PDO dikembalikan agar front controller dapat menyuntikkannya ke setiap model.

Contoh pemanggilan method:

```php
use App\Config\Database;

$pdo = Database::connect();
```

`connect()` bersifat static, sehingga dipanggil melalui nama class tanpa membuat objek `Database`. Nilai kembalinya adalah objek `PDO` yang selanjutnya diberikan ke constructor model.

### 4.3 `app/Support/Http.php`

```php
<?php
declare(strict_types=1);

namespace App\Support;

use InvalidArgumentException;

final class Http
{
    public static function e(mixed $value): string
    {
        return htmlspecialchars(
            (string) $value,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );
    }

    public static function input(array $source, string $key): string
    {
        $value = $source[$key] ?? '';
        if (!is_string($value)) {
            throw new InvalidArgumentException('Bentuk input tidak valid.');
        }
        return trim($value);
    }

    public static function positiveId(string $value): int
    {
        $id = filter_var(
            $value,
            FILTER_VALIDATE_INT,
            ['options' => ['min_range' => 1]]
        );
        if ($id === false) {
            throw new InvalidArgumentException('ID harus bilangan bulat positif.');
        }
        return $id;
    }

    public static function redirect(string $url): void
    {
        header('Location: ' . $url, true, 303);
        exit;
    }
}
```

Penjelasan fungsi `Http`:

- `e()` mengubah nilai menjadi string lalu meng-escape karakter khusus HTML. Gunakan saat mencetak ke HTML; jangan gunakan untuk membersihkan SQL atau menyimpan data.
- `input()` mengambil satu kunci dari array request, memastikan nilainya benar-benar string, kemudian membuang spasi di awal/akhir. Nilai array yang dikirim untuk field teks ditolak, bukan dikonversi diam-diam.
- `positiveId()` memastikan teks dapat dibaca sebagai integer positif (`>= 1`) dan melempar `InvalidArgumentException` jika tidak valid.
- `redirect()` mengirim header `Location` dengan status 303, lalu `exit` agar tidak ada kode setelah redirect yang berjalan. Status 303 membuat browser mengambil tujuan menggunakan GET setelah POST.

Contoh pemanggilan setiap method `Http`:

```php
$safeName = Http::e('<Nama Siswa>');
$searchText = Http::input($_GET, 'q');
$studentId = Http::positiveId('12');
Http::redirect('/crud_siswa/public/?route=siswa');
```

`e()` dipanggil saat mencetak data ke HTML; `input()` menerima array request dan nama field; `positiveId()` mengubah teks ID menjadi integer positif. `redirect()` mengakhiri request, jadi letakkan di akhir alur sukses. Pemanggilan ini biasanya dilakukan controller atau view, bukan database model.

`htmlspecialchars()` dipakai saat output HTML, bukan sebelum menyimpan ke database. Prepared statement melindungi konteks SQL; escaping HTML melindungi konteks HTML.

### 4.4 `app/Support/Csrf.php`

```php
<?php
declare(strict_types=1);

namespace App\Support;

final class Csrf
{
    public static function token(): string
    {
        if (!isset($_SESSION['csrf_token']) || !is_string($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function verify(mixed $submitted): void
    {
        if (!is_string($submitted)
            || !isset($_SESSION['csrf_token'])
            || !is_string($_SESSION['csrf_token'])
            || !hash_equals($_SESSION['csrf_token'], $submitted)) {
            http_response_code(403);
            exit('Token formulir tidak valid. Muat ulang halaman.');
        }
    }
}
```

Penjelasan fungsi `Csrf`:

- `token()` membuat 32 byte acak melalui `random_bytes()`, mengubahnya menjadi 64 karakter heksadesimal, lalu menyimpannya dalam session. Token yang sudah ada digunakan ulang.
- `verify()` memastikan token kiriman berupa string, token session masih tersedia, lalu membandingkan dengan `hash_equals()`. Jika token hilang atau tidak cocok, request dihentikan dengan HTTP 403.

Contoh pemanggilan setiap method `Csrf`:

```php
$tokenForForm = Csrf::token(); // dipakai sebagai value hidden input form
Csrf::verify($_POST['csrf_token'] ?? null); // dipanggil sebelum aksi tulis
```

Kedua method bersifat static. `token()` dipanggil ketika view merender form; `verify()` dipanggil controller setelah request POST diterima dan sebelum query INSERT, UPDATE, atau DELETE.

Panggil `session_start()` sebelum membuat token. Setiap form perubahan menggunakan POST dan hidden input token. GET hanya membaca atau menampilkan form, tidak pernah menyimpan/menghapus.

---

## 5. Model Dasar dan Definisi Relasi

Model dasar menyimpan koneksi PDO dan menyediakan metadata tabel. Model entitas mengisi metadata seperti `$table`, `$primaryKey`, `$fillable`, dan `$casts`, lalu mendeklarasikan relasi. Sesuai alur yang dipelajari di sini, model tidak menyediakan method CRUD dan tidak menjalankan query aplikasi; controller menggunakan koneksi model untuk menjalankan query.

Istilah “definisi model” di sini berarti deklarasi class/properti dan method relasi; kita tidak membuat PHP `interface` untuk setiap tabel. Tidak seperti Eloquent, deklarasi relasi ini belum otomatis mengambil data terkait.

### 5.1 `app/Models/Relation.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class Relation
{
    public function __construct(
        public string $type,
        public string $relatedModel,
        public string $foreignKey,
        public string $relatedKey,
    ) {
    }
}
```

Objek `Relation` adalah metadata relasi, bukan ORM atau query builder. `type` bernilai `belongsTo` atau `hasMany`; `relatedModel` menyebut class model yang berelasi; `foreignKey` dan `relatedKey` menjelaskan pasangan kolom relasinya. Untuk `belongsTo`, `relatedKey` adalah key pada model induk; untuk `hasMany`, `relatedKey` adalah key pada model pemilik. Controller dapat memakai metadata ini untuk memahami JOIN atau pilihan form, tetapi contoh controller di modul menulis query SQL secara eksplisit agar prosesnya mudah dipelajari.

Contoh membuat objek relasi secara langsung:

```php
$relation = new Relation(
    'belongsTo',
    Jurusan::class,
    'id_jurusan', // foreign key pada tabel siswa
    'id_jurusan', // key tujuan pada tabel jurusan
);
```

Artinya setara dengan pemanggilan `belongsTo()` dari model `Siswa`. `Jurusan::class` adalah referensi class PHP yang benar, bukan sintaks `Model:Jurusan` atau deklarasi PHP `interface`. Pada aplikasi, lebih baik panggil method relasi model (`$siswa->jurusan()`) agar metadata relasi tetap terkumpul pada model.

Contoh pemanggilan helper relasi di dalam class model:

```php
return $this->belongsTo(Jurusan::class, 'id_jurusan', 'id_jurusan');
return $this->hasMany(Siswa::class, 'id_jurusan', 'id_jurusan');
```

Argumen kedua adalah foreign key pada tabel pemilik relasi. Argumen ketiga adalah key pasangan pada tabel model terkait. Baris pertama biasanya berada dalam method `jurusan()` milik `Siswa`; baris kedua berada dalam method `siswa()` milik `Jurusan`. Kedua helper bersifat protected dan tidak dipanggil langsung oleh controller.

### 5.2 `app/Models/Model.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

use PDO;

abstract class Model
{
    protected string $table;
    protected string $primaryKey = 'id';
    protected array $fillable = [];
    protected array $casts = [];

    public function __construct(protected PDO $pdo)
    {
    }

    public function connection(): PDO
    {
        return $this->pdo;
    }

    public function table(): string
    {
        return $this->table;
    }

    public function primaryKey(): string
    {
        return $this->primaryKey;
    }

    public function fillable(): array
    {
        return $this->fillable;
    }

    public function casts(): array
    {
        return $this->casts;
    }

    protected function belongsTo(
        string $relatedModel,
        string $foreignKey,
        string $ownerKey
    ): Relation {
        return new Relation('belongsTo', $relatedModel, $foreignKey, $ownerKey);
    }

    protected function hasMany(
        string $relatedModel,
        string $foreignKey,
        string $localKey
    ): Relation {
        return new Relation('hasMany', $relatedModel, $foreignKey, $localKey);
    }
}
```

Penjelasan `Model`:

- Properti `$table` dan `$primaryKey` mendeskripsikan tabel dan primary key entitas. Properti tersebut diisi oleh setiap model konkret.
- `$fillable` adalah allowlist kolom yang boleh disimpan dari hasil validasi; primary key dan kolom otomatis seperti `created_at` tidak dimasukkan.
- `$casts` mendokumentasikan bentuk tipe data yang diharapkan aplikasi. PHP native tidak menerapkannya otomatis seperti Eloquent; controller mengonversi nilai saat membaca/menyimpan bila diperlukan.
- Constructor menerima PDO dari `Database` melalui dependency injection. `connection()` memberikannya kepada controller tanpa membuat koneksi baru.
- `table()`, `primaryKey()`, `fillable()`, dan `casts()` mengekspos metadata model kepada controller.
- `belongsTo()` dan `hasMany()` membentuk deklarasi relasi bertipe. Keduanya tidak mengeksekusi query dan tidak melakukan lazy loading seperti Eloquent.

Contoh pemanggilan method `Model` melalui objek model konkret:

```php
$jurusan = new Jurusan($pdo);
$connection = $jurusan->connection();
$table = $jurusan->table();                 // "jurusan"
$primaryKey = $jurusan->primaryKey();       // "id_jurusan"
$fillable = $jurusan->fillable();           // ["nama_jurusan"]
$casts = $jurusan->casts();                 // ["id_jurusan" => "int"]
$relasiSiswa = $jurusan->siswa();           // metadata hasMany
```

`Model` bersifat abstract sehingga tidak dibuat langsung dengan `new Model(...)`. Method `connection()`, `table()`, `primaryKey()`, `fillable()`, dan `casts()` diwarisi oleh model konkret. Method `belongsTo()` dan `hasMany()` protected, sehingga contoh panggilannya berada di dalam method relasi entitas, bukan dipanggil langsung dari controller.

---

## 6. Model Entitas: Tabel, Field, dan Relasi

Semua model mewarisi constructor `Model`, sehingga PDO yang sama dapat diberikan melalui dependency injection. Kelas model tidak mengirim HTML, membaca `$_GET`/`$_POST`, atau menjalankan query CRUD. Definisi relasi berikut serupa dengan deklarasi relasi pada Eloquent, tetapi hasilnya hanya metadata relasi.

### 6.1 `app/Models/Jurusan.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class Jurusan extends Model
{
    protected string $table = 'jurusan';
    protected string $primaryKey = 'id_jurusan';
    protected array $fillable = ['nama_jurusan'];
    protected array $casts = ['id_jurusan' => 'int'];

    public function siswa(): Relation
    {
        return $this->hasMany(Siswa::class, 'id_jurusan', 'id_jurusan');
    }
}
```

Model `Jurusan` menetapkan tabel, primary key, kolom yang dapat diisi, dan tipe ID. Method `siswa()` mendeklarasikan relasi satu jurusan memiliki banyak siswa (`hasMany`), dengan `siswa.id_jurusan` mengacu pada `jurusan.id_jurusan`. Model ini tidak berisi query CRUD.

Contoh pemanggilan constructor dan method `siswa()`:

```php
$jurusan = new Jurusan($pdo);
$relasiSiswa = $jurusan->siswa();
// Setara metadata: Relation('hasMany', Siswa::class, 'id_jurusan', 'id_jurusan')
```

Pemanggilan `$jurusan->siswa()` menjalankan method `hasMany()` protected dari dalam class model. Hasilnya hanya deskripsi relasi; untuk mengambil siswa terkait, controller tetap menjalankan query SELECT/JOIN.

### 6.2 `app/Models/Mapel.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class Mapel extends Model
{
    protected string $table = 'mapel';
    protected string $primaryKey = 'id_mapel';
    protected array $fillable = ['nama_mapel'];
    protected array $casts = ['id_mapel' => 'int'];

    public function nilai(): Relation
    {
        return $this->hasMany(Nilai::class, 'id_mapel', 'id_mapel');
    }
}
```

Model `Mapel` mendeskripsikan tabel dan kolom yang dapat diisi. Method `nilai()` menyatakan relasi satu mata pelajaran memiliki banyak catatan nilai. Penghapusan mapel dan efek cascade tetap ditentukan oleh foreign key database, bukan method relasi PHP.

Contoh pemanggilan constructor dan method `nilai()`:

```php
$mapel = new Mapel($pdo);
$relasiNilai = $mapel->nilai();
// Setara metadata: Relation('hasMany', Nilai::class, 'id_mapel', 'id_mapel')
```

Controller dapat membaca metadata `$relasiNilai`, tetapi tidak akan otomatis memperoleh baris nilai sampai controller menjalankan query.

### 6.3 `app/Models/Siswa.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class Siswa extends Model
{
    protected string $table = 'siswa';
    protected string $primaryKey = 'id_siswa';
    protected array $fillable = [
        'nama', 'email', 'jenis_kelamin', 'tanggal_lahir', 'id_jurusan',
    ];
    protected array $casts = ['id_siswa' => 'int', 'id_jurusan' => 'int'];

    public function jurusan(): Relation
    {
        return $this->belongsTo(Jurusan::class, 'id_jurusan', 'id_jurusan');
    }

    public function nilai(): Relation
    {
        return $this->hasMany(Nilai::class, 'id_siswa', 'id_siswa');
    }
}
```

Model `Siswa` mendefinisikan field yang boleh disimpan serta tipe ID. `jurusan()` menyatakan relasi `belongsTo` melalui `siswa.id_jurusan`; relasi ini opsional karena kolom boleh `NULL`. `nilai()` menyatakan relasi satu siswa memiliki banyak nilai. Model hanya mendeskripsikan relasi; query JOIN untuk daftar dilakukan controller.

Contoh pemanggilan constructor dan kedua method relasi:

```php
$siswa = new Siswa($pdo);
$relasiJurusan = $siswa->jurusan();
// Setara: Relation('belongsTo', Jurusan::class, 'id_jurusan', 'id_jurusan')
$relasiNilai = $siswa->nilai();
// Setara: Relation('hasMany', Nilai::class, 'id_siswa', 'id_siswa')
```

Relasi jurusan menunjukkan foreign key berada di tabel siswa. Bila `id_jurusan` bernilai `NULL`, query relasi tidak akan memiliki baris jurusan yang cocok.

### 6.4 `app/Models/Nilai.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class Nilai extends Model
{
    protected string $table = 'nilai';
    protected string $primaryKey = 'id_nilai';
    protected array $fillable = ['id_siswa', 'id_mapel', 'nilai_angka', 'semester'];
    protected array $casts = [
        'id_nilai' => 'int',
        'id_siswa' => 'int',
        'id_mapel' => 'int',
        'semester' => 'int',
    ];

    public function siswa(): Relation
    {
        return $this->belongsTo(Siswa::class, 'id_siswa', 'id_siswa');
    }

    public function mapel(): Relation
    {
        return $this->belongsTo(Mapel::class, 'id_mapel', 'id_mapel');
    }
}
```

Model `Nilai` mengizinkan field foreign key dan data nilai saja. Method `siswa()` dan `mapel()` mendeklarasikan relasi `belongsTo`; masing-masing foreign key menunjuk primary key model terkait. Tipe `nilai_angka` sengaja tidak di-cast ke float agar representasi desimal database tetap terjaga.

Contoh pemanggilan constructor dan kedua method relasi:

```php
$nilai = new Nilai($pdo);
$relasiSiswa = $nilai->siswa();
// Setara: Relation('belongsTo', Siswa::class, 'id_siswa', 'id_siswa')
$relasiMapel = $nilai->mapel();
// Setara: Relation('belongsTo', Mapel::class, 'id_mapel', 'id_mapel')
```

Ini adalah preview definisi relasi; untuk menampilkan nama siswa/mapel, `NilaiController` menulis query JOIN eksplisit.

---

## 7. Validasi Input

Validasi bentuk request dilakukan oleh helper `Validator`, sedangkan operasi SQL berada di controller. Helper tidak menjadi lapisan penyimpanan dan tidak mengakses database. Data yang lolos validasi dikirim controller ke method penyimpanan controller; metadata `$fillable` pada model membatasi kolom yang dapat diubah.

Buat `app/Support/Validator.php`:

```php
<?php
declare(strict_types=1);

namespace App\Support;

use DateTimeImmutable;
use InvalidArgumentException;

final class Validator
{
    private function text(array $input, string $key): string
    {
        return Http::input($input, $key);
    }

    private function name(array $input, string $key, string $label): string
    {
        $value = $this->text($input, $key);
        $length = preg_match_all('/./us', $value);
        if ($value === '' || $length === false || $length > 100) {
            throw new InvalidArgumentException(
                $label . ' wajib diisi dan maksimal 100 karakter.'
            );
        }
        return $value;
    }

    public function validate(string $entity, array $input): array
    {
        if ($entity === 'jurusan') {
            return ['nama_jurusan' => $this->name($input, 'nama_jurusan', 'Nama jurusan')];
        }
        if ($entity === 'mapel') {
            return ['nama_mapel' => $this->name($input, 'nama_mapel', 'Nama mapel')];
        }
        if ($entity === 'siswa') {
            $email = $this->text($input, 'email');
            if ($email !== '' && (strlen($email) > 150
                || filter_var($email, FILTER_VALIDATE_EMAIL) === false)) {
                throw new InvalidArgumentException('Email tidak valid atau terlalu panjang.');
            }
            $gender = $this->text($input, 'jenis_kelamin');
            if (!in_array($gender, ['L', 'P'], true)) {
                throw new InvalidArgumentException('Pilih jenis kelamin yang tersedia.');
            }
            $birthDate = $this->text($input, 'tanggal_lahir');
            if ($birthDate !== '') {
                $date = DateTimeImmutable::createFromFormat('!Y-m-d', $birthDate);
                if (!$date || $date->format('Y-m-d') !== $birthDate
                    || $birthDate < '1000-01-01' || $birthDate > date('Y-m-d')) {
                    throw new InvalidArgumentException('Tanggal lahir tidak valid.');
                }
            }
            $jurusanText = $this->text($input, 'id_jurusan');
            return [
                'nama' => $this->name($input, 'nama', 'Nama siswa'),
                'email' => $email === '' ? null : $email,
                'jenis_kelamin' => $gender,
                'tanggal_lahir' => $birthDate === '' ? null : $birthDate,
                'id_jurusan' => $jurusanText === '' ? null : Http::positiveId($jurusanText),
            ];
        }
        if ($entity === 'nilai') {
            $score = $this->text($input, 'nilai_angka');
            if (!preg_match('/^\d{1,3}(?:\.\d{1,2})?$/D', $score)
                || (float) $score > 100) {
                throw new InvalidArgumentException(
                    'Nilai harus 0–100, maksimal dua desimal dengan titik.'
                );
            }
            $semester = filter_var(
                $this->text($input, 'semester'),
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 1, 'max_range' => 6]]
            );
            if ($semester === false) {
                throw new InvalidArgumentException('Semester harus bilangan bulat 1–6.');
            }
            return [
                'id_siswa' => Http::positiveId($this->text($input, 'id_siswa')),
                'id_mapel' => Http::positiveId($this->text($input, 'id_mapel')),
                'nilai_angka' => $score,
                'semester' => $semester,
            ];
        }
        throw new InvalidArgumentException('Entitas tidak dikenal.');
    }
}
```

`text()` memeriksa input agar field teks benar-benar berupa string, sementara `name()` juga menolak nama kosong atau lebih dari 100 karakter Unicode. `validate()` memilih aturan berdasarkan entitas yang telah ditentukan di controller, lalu mengembalikan array dengan key kolom database; ia tidak membentuk nama tabel atau menjalankan query. Aturan siswa menangani email, jenis kelamin, tanggal lahir, dan jurusan opsional; aturan nilai menangani format/rentang desimal, semester, dan ID relasi. `InvalidArgumentException` ditangani controller sebagai kesalahan input 422. Foreign key dan unique constraint di database tetap menjadi penjaga terakhir.

Contoh pemanggilan method validator:

```php
$validator = new Validator();

$dataJurusan = $validator->validate('jurusan', [
    'nama_jurusan' => 'Rekayasa Perangkat Lunak',
]);

$dataSiswa = $validator->validate('siswa', [
    'nama' => 'Alya Putri',
    'email' => 'alya@example.test',
    'jenis_kelamin' => 'P',
    'tanggal_lahir' => '2008-05-10',
    'id_jurusan' => '2',
]);
```

`validate()` adalah method public yang dipanggil controller sebelum query simpan. Ia sendiri memanggil helper private `$this->text($input, $key)` dan `$this->name($input, $key, $label)`; helper private tidak dipanggil dari luar class. Contoh di atas hanya menunjukkan sebagian field untuk dua entitas; `mapel` dan `nilai` menggunakan pola yang sama dengan key sesuai kolomnya.

Pemanggilan helper private di dalam `validate()` memiliki bentuk seperti berikut:

```php
$email = $this->text($input, 'email');
$nama = $this->name($input, 'nama', 'Nama siswa');
```

`text()` dan `name()` adalah method private, jadi contoh tersebut menjelaskan pemanggilan internalnya; pemanggilan dari aplikasi tetap melalui `$validator->validate($entity, $input)`.

---

## 8. Controller Bersama dan Controller Entitas

### 8.1 `app/Controllers/Controller.php`

Controller dasar berikut menangani aksi HTTP dan operasi CRUD umum menggunakan PDO serta metadata model. Controller konkret menerima model, menentukan aturan validasi/form, dan dapat menimpa query daftar, filter, detail, serta relasi. Method publik `index`, `show`, `create`, `store`, `edit`, `update`, dan `destroy` mengikuti pola resource controller yang familier dari Laravel, tetapi routing, request, dan response di sini tetap PHP native. Aksi di luar tujuh aksi tersebut (misalnya laporan dan batch nilai) ditambahkan melalui hook `extraAction()`.

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Model;
use App\Support\Csrf;
use App\Support\Http;
use App\Support\Validator;
use InvalidArgumentException;
use LogicException;
use PDO;
use PDOException;
use Throwable;

abstract class Controller
{
    protected array $searchFields = [];

    public function __construct(
        protected Model $model,
        protected Validator $validator,
        protected string $entity,
        protected string $label,
        protected string $primaryKey,
        protected array $listFields,
        protected array $formFields,
    ) {
    }

    protected function options(): array
    {
        return [];
    }

    protected function filters(): array
    {
        return [];
    }

    protected function extraAction(string $action, string $method): bool
    {
        return false;
    }

    public function dispatch(string $action, string $method): void
    {
        try {
            if ($action === 'index' && $method === 'GET') {
                $this->index();
                return;
            }
            if ($action === 'show' && $method === 'GET') {
                $this->show();
                return;
            }
            if ($action === 'create' && $method === 'GET') {
                $this->create();
                return;
            }
            if ($action === 'edit' && $method === 'GET') {
                $this->edit();
                return;
            }
            if ($action === 'store' && $method === 'POST') {
                $this->store();
                return;
            }
            if ($action === 'update' && $method === 'POST') {
                $this->update();
                return;
            }
            if ($action === 'destroy' && $method === 'POST') {
                $this->destroy();
                return;
            }
            if ($this->extraAction($action, $method)) {
                return;
            }

            header('Allow: GET, POST');
            http_response_code(405);
            exit('Metode atau aksi tidak tersedia.');
        } catch (InvalidArgumentException $exception) {
            http_response_code(400);
            exit(Http::e($exception->getMessage()));
        } catch (PDOException $exception) {
            error_log('CRUD database gagal: ' . $exception->getMessage());
            http_response_code(500);
            exit('Data tidak dapat diproses. Periksa layanan database.');
        } catch (Throwable $exception) {
            error_log('CRUD gagal: ' . $exception->getMessage());
            http_response_code(500);
            exit('Terjadi kesalahan pada aplikasi.');
        }
    }

    public function index(): void
    {
        $query = Http::input($_GET, 'q');
        $filterOptions = $this->filters();
        $filters = $this->selectedFilters($filterOptions);
        $pageText = Http::input($_GET, 'halaman');
        $page = $pageText === '' ? 1 : Http::positiveId($pageText);
        $perPage = 10;
        $total = $this->countRows($query, $filters);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $rows = $this->searchRows($query, $perPage, ($page - 1) * $perPage, $filters);
        $flash = $_SESSION['flash'] ?? '';
        unset($_SESSION['flash']);

        $this->render('index', [
            'rows' => $rows,
            'query' => $query,
            'filters' => $filters,
            'filterOptions' => $filterOptions,
            'page' => $page,
            'lastPage' => $lastPage,
            'total' => $total,
            'flash' => $flash,
        ]);
    }

    public function show(): void
    {
        $id = Http::positiveId(Http::input($_GET, 'id'));
        $row = $this->findDetail($id);
        if ($row === false) {
            http_response_code(404);
            exit('Data tidak ditemukan.');
        }

        $this->render('show', [
            'row' => $row,
            'detailFields' => $this->detailFields(),
            'relations' => $this->detailRelations($row),
        ]);
    }

    public function create(): void
    {
        $this->form(null, []);
    }

    public function edit(): void
    {
        $id = Http::positiveId(Http::input($_GET, 'id'));
        $row = $this->findRow($id);
        if ($row === false) {
            http_response_code(404);
            exit('Data tidak ditemukan.');
        }
        $this->form($id, $row);
    }

    public function store(): void
    {
        $this->persist(null);
    }

    public function update(): void
    {
        $id = Http::positiveId(Http::input($_POST, 'id'));
        $this->persist($id);
    }

    public function destroy(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        $id = Http::positiveId(Http::input($_POST, 'id'));
        if ($this->findRow($id) === false) {
            http_response_code(404);
            exit('Data tidak ditemukan.');
        }
        $this->deleteRow($id);
        $_SESSION['flash'] = 'Data berhasil dihapus.';
        Http::redirect($this->url());
    }

    private function form(?int $id, array $row, string $error = '', array $old = []): void
    {
        $this->render('form', [
            'id' => $id,
            'row' => $row,
            'old' => $old,
            'error' => $error,
            'options' => $this->options(),
        ]);
    }

    private function persist(?int $id): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        if ($id !== null && $this->findRow($id) === false) {
            http_response_code(404);
            exit('Data tidak ditemukan.');
        }

        try {
            $data = $this->validator->validate($this->entity, $_POST);
            $this->saveRow($id, $data);
            $_SESSION['flash'] = 'Data berhasil disimpan.';
            Http::redirect($this->url());
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->form($id, [], $exception->getMessage(), $_POST);
        } catch (PDOException $exception) {
            $this->form($id, [], $this->databaseMessage($exception), $_POST);
        }
    }

    protected function databaseMessage(PDOException $exception): string
    {
        $code = (int) ($exception->errorInfo[1] ?? 0);
        if ($code === 1062) {
            http_response_code(409);
            return 'Data duplikat. Periksa nama, email, atau kombinasi nilai.';
        }
        if ($code === 1452) {
            http_response_code(409);
            return 'Data relasi tidak tersedia. Muat ulang form dan pilih kembali.';
        }
        error_log('Simpan data gagal: ' . $exception->getMessage());
        http_response_code(500);
        return 'Data tidak dapat disimpan. Hubungi pengelola aplikasi.';
    }

    private function selectedFilters(array $filterOptions): array
    {
        $selected = [];
        foreach ($filterOptions as $name => $filter) {
            $value = Http::input($_GET, $name);
            if ($value === '') {
                continue;
            }
            if (!array_key_exists($value, $filter['options'])) {
                throw new InvalidArgumentException('Pilihan filter tidak valid.');
            }
            $selected[$name] = $value;
        }
        return $selected;
    }

    protected function findRow(int $id): array|false
    {
        $table = $this->identifier($this->model->table());
        $key = $this->identifier($this->model->primaryKey());
        $stmt = $this->model->connection()->prepare(
            "SELECT * FROM {$table} WHERE {$key} = :id"
        );
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    protected function findDetail(int $id): array|false
    {
        return $this->findRow($id);
    }

    protected function detailFields(): array
    {
        return $this->listFields;
    }

    protected function detailRelations(array $row): array
    {
        return [];
    }

    protected function countRows(string $query, array $filters = []): int
    {
        [$where, $parameters] = $this->searchCondition($query);
        $table = $this->identifier($this->model->table());
        $stmt = $this->model->connection()->prepare(
            "SELECT COUNT(*) FROM {$table}{$where}"
        );
        $stmt->execute($parameters);
        return (int) $stmt->fetchColumn();
    }

    protected function searchRows(string $query, int $limit, int $offset, array $filters = []): array
    {
        [$where, $parameters] = $this->searchCondition($query);
        $table = $this->identifier($this->model->table());
        $key = $this->identifier($this->model->primaryKey());
        $stmt = $this->model->connection()->prepare(
            "SELECT * FROM {$table}{$where} ORDER BY {$key} DESC
             LIMIT :limit OFFSET :offset"
        );
        foreach ($parameters as $name => $value) {
            $stmt->bindValue(':' . $name, $value, PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    protected function fetchPage(string $sql, array $parameters, int $limit, int $offset): array
    {
        $stmt = $this->model->connection()->prepare($sql . ' LIMIT :limit OFFSET :offset');
        foreach ($parameters as $name => $value) {
            $stmt->bindValue(':' . $name, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    protected function fetchAllRows(string $sql, array $parameters): array
    {
        $stmt = $this->model->connection()->prepare($sql);
        $stmt->execute($parameters);
        return $stmt->fetchAll();
    }

    protected function saveRow(?int $id, array $data): void
    {
        $fillable = $this->model->fillable();
        $data = array_intersect_key($data, array_flip($fillable));
        if ($data === []) {
            throw new InvalidArgumentException('Tidak ada field yang dapat disimpan.');
        }

        $table = $this->identifier($this->model->table());
        $columns = array_map(fn (string $column): string => $this->identifier($column), array_keys($data));
        $pdo = $this->model->connection();

        if ($id === null) {
            $placeholders = [];
            $parameters = [];
            foreach (array_values($data) as $index => $value) {
                $placeholders[] = ':value_' . $index;
                $parameters['value_' . $index] = $value;
            }
            $sql = sprintf(
                'INSERT INTO %s (%s) VALUES (%s)',
                $table,
                implode(', ', $columns),
                implode(', ', $placeholders)
            );
            $pdo->prepare($sql)->execute($parameters);
            return;
        }

        $sets = [];
        $parameters = ['id' => $id];
        foreach (array_keys($data) as $index => $column) {
            $placeholder = 'value_' . $index;
            $sets[] = $this->identifier($column) . ' = :' . $placeholder;
            $parameters[$placeholder] = $data[$column];
        }
        $key = $this->identifier($this->model->primaryKey());
        $sql = sprintf(
            'UPDATE %s SET %s WHERE %s = :id',
            $table,
            implode(', ', $sets),
            $key
        );
        $pdo->prepare($sql)->execute($parameters);
    }

    protected function deleteRow(int $id): void
    {
        $table = $this->identifier($this->model->table());
        $key = $this->identifier($this->model->primaryKey());
        $stmt = $this->model->connection()->prepare(
            "DELETE FROM {$table} WHERE {$key} = :id"
        );
        $stmt->execute(['id' => $id]);
    }

    protected function searchCondition(string $query): array
    {
        if ($query === '' || $this->searchFields === []) {
            return ['', []];
        }

        $conditions = [];
        $parameters = [];
        foreach ($this->searchFields as $index => $field) {
            $placeholder = 'search_' . $index;
            $conditions[] = $this->identifier($field) . ' LIKE :' . $placeholder;
            $parameters[$placeholder] = '%' . $query . '%';
        }
        return [' WHERE ' . implode(' OR ', $conditions), $parameters];
    }

    private function identifier(string $identifier): string
    {
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/D', $identifier)) {
            throw new LogicException('Identifier model tidak valid.');
        }
        return '`' . $identifier . '`';
    }

    protected function url(?string $action = null, ?int $id = null): string
    {
        $query = ['route' => $this->entity];
        if ($action !== null) {
            $query['action'] = $action;
        }
        if ($id !== null) {
            $query['id'] = (string) $id;
        }
        return '/crud_siswa/public/?' . http_build_query($query);
    }

    protected function render(string $view, array $variables): void
    {
        $pageTitle = $this->label;
        $entity = $this->entity;
        $label = $this->label;
        $primaryKey = $this->primaryKey;
        $listFields = $this->listFields;
        $formFields = $this->formFields;
        $url = $this->url();
        extract($variables, EXTR_SKIP);

        ob_start();
        require dirname(__DIR__) . '/Views/' . $entity . '/' . $view . '.php';
        $content = (string) ob_get_clean();
        require dirname(__DIR__) . '/Views/layouts/main.php';
    }
}
```

Penjelasan properti dan method `Controller`:

- Constructor menerima dependency model dan validator, kemudian menyimpan metadata halaman: nama route, label tampilan, primary key untuk view, kolom daftar, dan definisi field form. Koneksi PDO diakses melalui model.
- `options()` secara default mengembalikan array kosong. Controller siswa/nilai menimpanya dan menjalankan query pilihan dropdown form melalui koneksi model terkait.
- `filters()` mendefinisikan dropdown filter pada halaman daftar dengan format `['nama_parameter' => ['label' => ..., 'options' => [nilai => teks]]]`. Default-nya kosong; controller siswa dan nilai menimpanya.
- `extraAction()` adalah hook untuk aksi tambahan. `dispatch()` memanggilnya setelah tujuh aksi standar tidak cocok; jika hook mengembalikan `true`, aksi dianggap sudah ditangani. Dengan cara ini `NilaiController` dapat menambah `laporan`, `batch`, dan `storeBatch` tanpa mengubah controller dasar.
- `dispatch()` adalah pemilih aksi HTTP. Aksi baca (`index`, `show`, `create`, `edit`) menerima GET, aksi perubahan (`store`, `update`, `destroy`) menerima POST. Aksi/metode yang tidak cocok mendapat 405.
- `catch InvalidArgumentException` mengirim 400 untuk bentuk request/parameter yang tidak valid. `catch PDOException` mencatat detail ke log dan memberi respons umum 500. `catch Throwable` menjadi batas terakhir untuk kegagalan tak terduga, juga tanpa membocorkan detail internal ke browser.
- `index()` membaca teks pencarian, nilai filter, dan halaman, meminta total data dengan kondisi yang sama, membatasi nomor halaman pada rentang yang tersedia, menjalankan query daftar/pagination, lalu mengirim variabel ke view.
- `selectedFilters()` hanya menerima nilai filter yang ada pada daftar opsi (allowlist). Nilai di luar daftar ditolak dengan 400, sehingga query tidak pernah menerima filter yang tidak dikenal.
- `show()` memvalidasi ID, mengambil baris lengkap melalui `findDetail()`, mengirim 404 jika baris tidak ada, lalu merender view `show` beserta `detailFields()` dan `detailRelations()`.
- `findDetail()`, `detailFields()`, dan `detailRelations()` adalah titik kustomisasi halaman detail. Default-nya memakai `findRow()`, kolom daftar, dan tanpa relasi. Setiap relasi dikembalikan sebagai array berisi `title`, `route`, `key`, `fields`, dan `rows`, sehingga satu view dapat menampilkan tabel relasi apa pun.
- `edit()` memvalidasi ID, mengambil baris melalui query controller, lalu mengirim 404 jika baris tidak ada.
- `form()` menyatukan proses render form tambah dan edit. Ia meneruskan ID/baris, nilai lama setelah error, error validasi, serta pilihan dropdown.
- `store()` dan `update()` adalah method aksi publik untuk create/update. Keduanya memanggil helper internal `persist()`, yang memeriksa CSRF, memvalidasi input, lalu menjalankan INSERT/UPDATE melalui PDO. Kolom diizinkan dibatasi oleh `$fillable` pada model. Sukses memakai flash message dan redirect 303; error validasi/constraint menampilkan ulang form dengan nilai sebelumnya.
- `databaseMessage()` menerjemahkan kode error MySQL menjadi pesan umum dan status HTTP: 1062 (duplikat) dan 1452 (relasi tidak ada) menjadi 409, selain itu dicatat ke log dan menjadi 500. Method ini protected agar dapat dipakai ulang oleh aksi batch nilai.
- `destroy()` memeriksa CSRF dan ID, memastikan baris benar-benar ada, menjalankan DELETE melalui PDO, lalu redirect 303.
- `findRow()`, `countRows()`, `searchRows()`, `saveRow()`, dan `deleteRow()` adalah helper query di lapisan controller. Nama tabel/kolom berasal dari metadata model dan diperiksa sebelum dipakai sebagai identifier; nilai request tetap memakai prepared statement. Parameter `$filters` pada `countRows()`/`searchRows()` diabaikan oleh versi dasar dan dipakai oleh controller yang menimpanya.
- `fetchPage()` menjalankan SQL daftar milik controller turunan dengan `LIMIT`/`OFFSET`. Nilai integer di-bind sebagai `PARAM_INT` dan lainnya sebagai `PARAM_STR`. `fetchAllRows()` menjalankan query relasi/laporan tanpa pagination. Keduanya mencegah pengulangan kode `prepare`/`bindValue` di setiap controller entitas.
- `searchCondition()` membangun filter hanya dari daftar field pencarian yang didefinisikan controller. Controller entitas menimpa query daftar/hitung agar dapat memakai JOIN dan filter.
- `url()` menyusun route, aksi opsional, dan ID dengan `http_build_query()` agar nilai URL di-encode. Prefix path harus disesuaikan saat aplikasi dipasang di lokasi berbeda.
- `render()` menyiapkan metadata view, meng-include view entitas dalam output buffer, kemudian menyisipkan hasilnya ke layout utama. `EXTR_SKIP` menghindari variabel dari array view menimpa variabel lokal penting. `url()` dan `render()` bersifat protected agar aksi tambahan di controller turunan dapat membuat redirect dan menampilkan view sendiri.

Contoh pemanggilan method controller:

```php
// Normalnya front controller memanggil dispatch(), bukan memanggil aksi satu per satu.
$controller->dispatch('index', 'GET');      // dapat membawa ?q=..., filter, dan halaman
$controller->dispatch('show', 'GET');       // sediakan ?id=... pada request
$controller->dispatch('create', 'GET');
$controller->dispatch('edit', 'GET');       // sediakan ?id=... pada request
$controller->dispatch('store', 'POST');      // POST harus berisi CSRF dan field
$controller->dispatch('update', 'POST');     // POST harus berisi id, CSRF, dan field
$controller->dispatch('destroy', 'POST');    // POST harus berisi id dan CSRF
$controller->dispatch('laporan', 'GET');     // hanya dikenali NilaiController melalui extraAction()
```

Pemetaan method dan aksi internal:

| Method | Contoh pemanggilan | Catatan |
|---|---|---|
| `__construct()` | `$controller = new JurusanController($jurusan, $validator);` | Biasanya dibuat di `public/index.php`; argumennya model dan helper yang dibutuhkan. |
| `options()` | `$this->options()` | Protected; dipanggil oleh `form()` saat menyiapkan opsi dropdown. Controller jurusan/mapel mengembalikan array kosong. |
| `filters()` | `$this->filters()` | Protected; dipanggil `index()` untuk membentuk dropdown filter dan allowlist nilainya. |
| `extraAction($action, $method)` | `$this->extraAction('laporan', 'GET')` | Protected; dipanggil `dispatch()` untuk aksi di luar tujuh aksi standar. |
| `dispatch($action, $method)` | `$controller->dispatch('index', 'GET');` | Public entry untuk aksi. Memanggil method aksi yang cocok dengan HTTP method. |
| `index()` | `$this->index()` dari cabang `dispatch('index', 'GET')` | Mengambil filter, daftar, jumlah, dan halaman, lalu memanggil `render()`. |
| `show()` | `$this->show()` dari cabang `dispatch('show', 'GET')` | Membaca `id`, memanggil `findDetail()` dan `detailRelations()`, lalu merender `show`. |
| `create()` | `$this->create()` dari cabang `dispatch('create', 'GET')` | Menampilkan form kosong melalui `$this->form(null, [])`. |
| `edit()` | `$this->edit()` dari cabang `dispatch('edit', 'GET')` | Membaca `id` dari `$_GET`, lalu memanggil `$this->findRow($id)`. |
| `store()` | `$this->store()` dari cabang `dispatch('store', 'POST')` | Meneruskan pembuatan data ke `$this->persist(null)`. |
| `update()` | `$this->update()` dari cabang `dispatch('update', 'POST')` | Membaca ID lalu meneruskan ke `$this->persist($id)`. |
| `destroy()` | `$this->destroy()` dari cabang `dispatch('destroy', 'POST')` | Memeriksa CSRF lalu memanggil `$this->findRow($id)`, `$this->deleteRow($id)`, dan redirect. |
| `form($id, $row, ...)` | `$this->form($id, $row)` | Private; dipanggil oleh `create()`, `edit()`, dan saat validasi gagal. |
| `persist($id)` | `$this->persist(null)` / `$this->persist($id)` | Private; dipanggil oleh `store()` atau `update()`, lalu menjalankan validasi dan `$this->saveRow(...)`. |
| `databaseMessage($exception)` | `$this->databaseMessage($exception)` | Protected; mengubah error 1062/1452/lainnya menjadi pesan dan status HTTP. |
| `selectedFilters($filterOptions)` | `$this->selectedFilters($this->filters())` | Private; memvalidasi nilai filter GET terhadap allowlist opsi. |
| `findRow($id)` | `$this->findRow(12)` | Protected; mengambil satu baris berdasarkan ID menggunakan tabel/key model. |
| `findDetail($id)` | `$this->findDetail(12)` | Protected; default memanggil `findRow()`, ditimpa controller entitas untuk menambahkan JOIN. |
| `detailFields()` | `$this->detailFields()` | Protected; daftar kolom yang ditampilkan pada halaman detail. |
| `detailRelations($row)` | `$this->detailRelations($row)` | Protected; daftar tabel relasi pada halaman detail. |
| `countRows($query, $filters)` | `$this->countRows('RPL', [])` | Protected; dipanggil `index()` untuk menghitung halaman. |
| `searchRows($query, $limit, $offset, $filters)` | `$this->searchRows('RPL', 10, 0, [])` | Protected; dipanggil `index()` untuk mengambil satu halaman. |
| `fetchPage($sql, $parameters, $limit, $offset)` | `$this->fetchPage($sql, $parameters, 10, 0)` | Protected; helper eksekusi query daftar milik controller turunan. |
| `fetchAllRows($sql, $parameters)` | `$this->fetchAllRows($sql, ['id' => 3])` | Protected; helper eksekusi query relasi/laporan. |
| `saveRow($id, $data)` | `$this->saveRow(null, $data)` / `$this->saveRow(12, $data)` | Protected; internal INSERT saat ID `null`, UPDATE saat ID terisi. |
| `deleteRow($id)` | `$this->deleteRow(12)` | Protected; dipanggil `destroy()` setelah ID dan CSRF valid. |
| `searchCondition($query)` | `$this->searchCondition('RPL')` | Protected; dipakai `countRows()` dan `searchRows()` versi dasar untuk membuat kondisi WHERE. |
| `identifier($name)` | `$this->identifier($this->model->table())` | Private; memeriksa identifier tepercaya sebelum query; tidak boleh dipanggil dari luar. |
| `url($action, $id)` | `$this->url('show', 12)` | Protected; dipakai renderer, redirect, dan aksi tambahan untuk membentuk URL route. |
| `render($view, $variables)` | `$this->render('index', $variables)` | Protected; dipanggil aksi controller untuk menampilkan view. |

Pemanggilan bertanda `$this->...` adalah pemanggilan dari dalam class/pewaris. Method `private` dan `protected` memang tidak dapat dipanggil langsung dari front controller; gunakan `dispatch()` sebagai pintu masuk request.

### 8.2 Controller siswa: `app/Controllers/SiswaController.php`

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Jurusan;
use App\Models\Siswa;
use App\Support\Validator;

final class SiswaController extends Controller
{
    protected array $searchFields = ['nama', 'email'];
    private Jurusan $jurusan;

    public function __construct(
        Siswa $model,
        Validator $validator,
        Jurusan $jurusan,
    ) {
        parent::__construct(
            $model,
            $validator,
            'siswa',
            'Siswa',
            'id_siswa',
            [
                'nama' => 'Nama',
                'email' => 'Email',
                'jenis_kelamin' => 'Jenis kelamin',
                'tanggal_lahir' => 'Tanggal lahir',
                'nama_jurusan' => 'Jurusan',
            ],
            [
                'nama' => ['label' => 'Nama', 'type' => 'text', 'required' => true],
                'email' => ['label' => 'Email', 'type' => 'email', 'required' => false],
                'jenis_kelamin' => [
                    'label' => 'Jenis kelamin', 'type' => 'gender', 'required' => true,
                ],
                'tanggal_lahir' => [
                    'label' => 'Tanggal lahir', 'type' => 'date', 'required' => false,
                ],
                'id_jurusan' => [
                    'label' => 'Jurusan', 'type' => 'select_jurusan', 'required' => false,
                ],
            ],
        );
        $this->jurusan = $jurusan;
    }

    protected function options(): array
    {
        $stmt = $this->jurusan->connection()->query(
            'SELECT id_jurusan AS id, nama_jurusan AS nama
             FROM jurusan ORDER BY nama_jurusan'
        );
        return ['id_jurusan' => $stmt->fetchAll()];
    }

    protected function filters(): array
    {
        $options = ['kosong' => '— Tanpa jurusan —'];
        foreach ($this->options()['id_jurusan'] as $item) {
            $options[(string) $item['id']] = $item['nama'];
        }
        return [
            'id_jurusan' => ['label' => 'Jurusan', 'options' => $options],
        ];
    }

    protected function searchRows(string $query, int $limit, int $offset, array $filters = []): array
    {
        [$where, $parameters] = $this->condition($query, $filters);
        return $this->fetchPage(
            'SELECT s.id_siswa, s.nama, s.email, s.jenis_kelamin,
                    s.tanggal_lahir, s.id_jurusan, j.nama_jurusan
             FROM siswa s
             LEFT JOIN jurusan j ON j.id_jurusan = s.id_jurusan'
            . $where . ' ORDER BY s.id_siswa DESC',
            $parameters,
            $limit,
            $offset
        );
    }

    protected function countRows(string $query, array $filters = []): int
    {
        [$where, $parameters] = $this->condition($query, $filters);
        $stmt = $this->model->connection()->prepare('SELECT COUNT(*) FROM siswa s' . $where);
        $stmt->execute($parameters);
        return (int) $stmt->fetchColumn();
    }

    protected function findDetail(int $id): array|false
    {
        return $this->fetchAllRows(
            'SELECT s.id_siswa, s.nama, s.email, s.jenis_kelamin, s.tanggal_lahir,
                    s.id_jurusan, j.nama_jurusan, s.created_at
             FROM siswa s
             LEFT JOIN jurusan j ON j.id_jurusan = s.id_jurusan
             WHERE s.id_siswa = :id',
            ['id' => $id]
        )[0] ?? false;
    }

    protected function detailFields(): array
    {
        return $this->listFields + ['created_at' => 'Terdaftar sejak'];
    }

    protected function detailRelations(array $row): array
    {
        return [
            [
                'title' => 'Nilai siswa',
                'route' => 'nilai',
                'key' => 'id_nilai',
                'fields' => [
                    'semester' => 'Semester',
                    'nama_mapel' => 'Mata pelajaran',
                    'nilai_angka' => 'Nilai',
                ],
                'rows' => $this->fetchAllRows(
                    'SELECT n.id_nilai, n.semester, m.nama_mapel, n.nilai_angka
                     FROM nilai n
                     JOIN mapel m ON m.id_mapel = n.id_mapel
                     WHERE n.id_siswa = :id
                     ORDER BY n.semester, m.nama_mapel',
                    ['id' => $row['id_siswa']]
                ),
            ],
        ];
    }

    private function condition(string $query, array $filters): array
    {
        $conditions = [];
        $parameters = [];
        if ($query !== '') {
            $conditions[] = '(s.nama LIKE :q_nama OR s.email LIKE :q_email)';
            $pattern = '%' . $query . '%';
            $parameters['q_nama'] = $pattern;
            $parameters['q_email'] = $pattern;
        }

        $jurusan = $filters['id_jurusan'] ?? '';
        if ($jurusan === 'kosong') {
            $conditions[] = 's.id_jurusan IS NULL';
        } elseif ($jurusan !== '') {
            $conditions[] = 's.id_jurusan = :f_jurusan';
            $parameters['f_jurusan'] = (int) $jurusan;
        }

        $where = $conditions === [] ? '' : ' WHERE ' . implode(' AND ', $conditions);
        return [$where, $parameters];
    }
}
```

Penjelasan `SiswaController`:

- Constructor menerima model `Siswa`, helper validasi, dan model `Jurusan`, lalu meneruskan metadata halaman ke controller dasar.
- `listFields` menentukan kolom yang ditampilkan di daftar. `nama_jurusan` ditambahkan melalui JOIN yang dijalankan `SiswaController`.
- `formFields` menentukan nama, jenis input, label, dan kewajiban field pada form siswa.
- `options()` menjalankan query pilihan jurusan melalui koneksi model `Jurusan` untuk dropdown form.
- `filters()` memakai ulang hasil `options()` untuk membuat dropdown filter jurusan, ditambah pilihan khusus `kosong` untuk siswa yang belum memiliki jurusan. Daftar ini sekaligus menjadi allowlist yang diperiksa controller dasar.
- `condition()` membangun satu kondisi WHERE dari kata pencarian dan filter jurusan. `searchRows()` dan `countRows()` memanggil method yang sama sehingga jumlah data, jumlah halaman, dan isi daftar selalu konsisten.
- Filter `kosong` diterjemahkan menjadi `IS NULL`, bukan `= NULL`, karena perbandingan `= NULL` di SQL tidak pernah bernilai benar.
- `findDetail()` mengambil satu siswa beserta nama jurusannya (`LEFT JOIN`, karena jurusan boleh kosong) dan `created_at`.
- `detailFields()` menambahkan kolom tanggal pendaftaran pada halaman detail tanpa mengubah kolom daftar.
- `detailRelations()` mengambil seluruh nilai milik siswa beserta nama mapel (relasi `hasMany` siswa → nilai, lalu `belongsTo` nilai → mapel).

Contoh pemanggilan method `SiswaController`:

```php
$siswaController = new SiswaController($siswaModel, $validator, $jurusanModel);
$siswaController->dispatch('index', 'GET');   // ?route=siswa&q=alya&id_jurusan=2
$siswaController->dispatch('show', 'GET');    // ?route=siswa&action=show&id=5
```

Constructor menerima model utama `Siswa`, validator, dan model relasi `Jurusan`. Method `options()`, `filters()`, `searchRows()`, `countRows()`, `findDetail()`, `detailFields()`, dan `detailRelations()` bersifat protected, sehingga dipanggil controller dasar melalui `dispatch()`; `condition()` bersifat private dan hanya dipakai di dalam `SiswaController`.

### 8.3 Controller jurusan: `app/Controllers/JurusanController.php`

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Jurusan;
use App\Support\Validator;

final class JurusanController extends Controller
{
    protected array $searchFields = ['nama_jurusan'];

    public function __construct(Jurusan $model, Validator $validator)
    {
        parent::__construct(
            $model,
            $validator,
            'jurusan',
            'Jurusan',
            'id_jurusan',
            [
                'nama_jurusan' => 'Nama jurusan',
                'jumlah_siswa' => 'Jumlah siswa',
            ],
            [
                'nama_jurusan' => [
                    'label' => 'Nama jurusan', 'type' => 'text', 'required' => true,
                ],
            ],
        );
    }

    protected function filters(): array
    {
        return [
            'status' => [
                'label' => 'Status',
                'options' => [
                    'ada' => 'Memiliki siswa',
                    'kosong' => 'Belum memiliki siswa',
                ],
            ],
        ];
    }

    protected function searchRows(string $query, int $limit, int $offset, array $filters = []): array
    {
        [$where, $parameters] = $this->condition($query, $filters);
        return $this->fetchPage(
            'SELECT j.id_jurusan, j.nama_jurusan, COUNT(s.id_siswa) AS jumlah_siswa
             FROM jurusan j
             LEFT JOIN siswa s ON s.id_jurusan = j.id_jurusan'
            . $where . '
             GROUP BY j.id_jurusan, j.nama_jurusan
             ORDER BY j.id_jurusan DESC',
            $parameters,
            $limit,
            $offset
        );
    }

    protected function countRows(string $query, array $filters = []): int
    {
        [$where, $parameters] = $this->condition($query, $filters);
        $stmt = $this->model->connection()->prepare('SELECT COUNT(*) FROM jurusan j' . $where);
        $stmt->execute($parameters);
        return (int) $stmt->fetchColumn();
    }

    protected function findDetail(int $id): array|false
    {
        return $this->fetchAllRows(
            'SELECT j.id_jurusan, j.nama_jurusan, COUNT(s.id_siswa) AS jumlah_siswa
             FROM jurusan j
             LEFT JOIN siswa s ON s.id_jurusan = j.id_jurusan
             WHERE j.id_jurusan = :id
             GROUP BY j.id_jurusan, j.nama_jurusan',
            ['id' => $id]
        )[0] ?? false;
    }

    protected function detailRelations(array $row): array
    {
        return [
            [
                'title' => 'Siswa pada jurusan ini',
                'route' => 'siswa',
                'key' => 'id_siswa',
                'fields' => [
                    'nama' => 'Nama',
                    'email' => 'Email',
                    'jenis_kelamin' => 'Jenis kelamin',
                ],
                'rows' => $this->fetchAllRows(
                    'SELECT id_siswa, nama, email, jenis_kelamin
                     FROM siswa
                     WHERE id_jurusan = :id
                     ORDER BY nama',
                    ['id' => $row['id_jurusan']]
                ),
            ],
        ];
    }

    private function condition(string $query, array $filters): array
    {
        $conditions = [];
        $parameters = [];
        if ($query !== '') {
            $conditions[] = 'j.nama_jurusan LIKE :q_nama';
            $parameters['q_nama'] = '%' . $query . '%';
        }

        $exists = 'EXISTS (SELECT 1 FROM siswa sx WHERE sx.id_jurusan = j.id_jurusan)';
        if (($filters['status'] ?? '') === 'ada') {
            $conditions[] = $exists;
        } elseif (($filters['status'] ?? '') === 'kosong') {
            $conditions[] = 'NOT ' . $exists;
        }

        $where = $conditions === [] ? '' : ' WHERE ' . implode(' AND ', $conditions);
        return [$where, $parameters];
    }
}
```

Penjelasan `JurusanController`:

- Constructor menyuntikkan model `Jurusan`, menetapkan route `jurusan`, primary key `id_jurusan`, kolom daftar, dan satu field form. `jumlah_siswa` hanya tampil di daftar/detail, tidak ada di form.
- `options()` tidak ditimpa karena form jurusan tidak memiliki field relasi; versi dasar mengembalikan array kosong.
- `filters()` menyediakan filter `status` dengan dua nilai tetap: jurusan yang sudah memiliki siswa dan yang belum.
- `condition()` menerjemahkan filter `status` menjadi `EXISTS`/`NOT EXISTS`. Subquery dipakai (bukan `HAVING`) agar kondisi yang sama dapat digunakan oleh query daftar ber-`GROUP BY` dan query hitung tanpa `GROUP BY`.
- `searchRows()` memakai `LEFT JOIN siswa` dan `COUNT(s.id_siswa)` sehingga jurusan tanpa siswa tetap tampil dengan jumlah 0. `countRows()` menghitung baris jurusan, bukan baris hasil JOIN.
- `findDetail()` mengambil satu jurusan beserta jumlah siswanya; `detailRelations()` menampilkan daftar siswa pada jurusan tersebut (relasi `hasMany` jurusan → siswa).

Contoh pemanggilan method `JurusanController`:

```php
$jurusanController = new JurusanController($jurusanModel, $validator);
$jurusanController->dispatch('index', 'GET');   // ?route=jurusan&status=kosong
$jurusanController->dispatch('show', 'GET');    // ?route=jurusan&action=show&id=2
```

Aksi `create`, `store`, `edit`, `update`, dan `destroy` tetap diwarisi dari `Controller` tanpa perubahan, karena penyimpanan jurusan hanya memakai satu tabel.

### 8.4 Controller mapel: `app/Controllers/MapelController.php`

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Mapel;
use App\Support\Validator;

final class MapelController extends Controller
{
    protected array $searchFields = ['nama_mapel'];

    public function __construct(Mapel $model, Validator $validator)
    {
        parent::__construct(
            $model,
            $validator,
            'mapel',
            'Mata pelajaran',
            'id_mapel',
            [
                'nama_mapel' => 'Nama mata pelajaran',
                'jumlah_nilai' => 'Jumlah nilai',
                'rata_rata' => 'Rata-rata',
            ],
            [
                'nama_mapel' => [
                    'label' => 'Nama mata pelajaran', 'type' => 'text', 'required' => true,
                ],
            ],
        );
    }

    protected function filters(): array
    {
        return [
            'status' => [
                'label' => 'Status',
                'options' => [
                    'ada' => 'Sudah memiliki nilai',
                    'kosong' => 'Belum memiliki nilai',
                ],
            ],
        ];
    }

    protected function searchRows(string $query, int $limit, int $offset, array $filters = []): array
    {
        [$where, $parameters] = $this->condition($query, $filters);
        return $this->fetchPage(
            'SELECT m.id_mapel, m.nama_mapel,
                    COUNT(n.id_nilai) AS jumlah_nilai,
                    ROUND(AVG(n.nilai_angka), 2) AS rata_rata
             FROM mapel m
             LEFT JOIN nilai n ON n.id_mapel = m.id_mapel'
            . $where . '
             GROUP BY m.id_mapel, m.nama_mapel
             ORDER BY m.id_mapel DESC',
            $parameters,
            $limit,
            $offset
        );
    }

    protected function countRows(string $query, array $filters = []): int
    {
        [$where, $parameters] = $this->condition($query, $filters);
        $stmt = $this->model->connection()->prepare('SELECT COUNT(*) FROM mapel m' . $where);
        $stmt->execute($parameters);
        return (int) $stmt->fetchColumn();
    }

    protected function findDetail(int $id): array|false
    {
        return $this->fetchAllRows(
            'SELECT m.id_mapel, m.nama_mapel,
                    COUNT(n.id_nilai) AS jumlah_nilai,
                    ROUND(AVG(n.nilai_angka), 2) AS rata_rata
             FROM mapel m
             LEFT JOIN nilai n ON n.id_mapel = m.id_mapel
             WHERE m.id_mapel = :id
             GROUP BY m.id_mapel, m.nama_mapel',
            ['id' => $id]
        )[0] ?? false;
    }

    protected function detailRelations(array $row): array
    {
        return [
            [
                'title' => 'Nilai pada mata pelajaran ini',
                'route' => 'nilai',
                'key' => 'id_nilai',
                'fields' => [
                    'nama_siswa' => 'Siswa',
                    'semester' => 'Semester',
                    'nilai_angka' => 'Nilai',
                ],
                'rows' => $this->fetchAllRows(
                    'SELECT n.id_nilai, s.nama AS nama_siswa, n.semester, n.nilai_angka
                     FROM nilai n
                     JOIN siswa s ON s.id_siswa = n.id_siswa
                     WHERE n.id_mapel = :id
                     ORDER BY n.semester, s.nama',
                    ['id' => $row['id_mapel']]
                ),
            ],
        ];
    }

    private function condition(string $query, array $filters): array
    {
        $conditions = [];
        $parameters = [];
        if ($query !== '') {
            $conditions[] = 'm.nama_mapel LIKE :q_nama';
            $parameters['q_nama'] = '%' . $query . '%';
        }

        $exists = 'EXISTS (SELECT 1 FROM nilai nx WHERE nx.id_mapel = m.id_mapel)';
        if (($filters['status'] ?? '') === 'ada') {
            $conditions[] = $exists;
        } elseif (($filters['status'] ?? '') === 'kosong') {
            $conditions[] = 'NOT ' . $exists;
        }

        $where = $conditions === [] ? '' : ' WHERE ' . implode(' AND ', $conditions);
        return [$where, $parameters];
    }
}
```

Penjelasan `MapelController`:

- Constructor menghubungkan model `Mapel`, route `mapel`, primary key `id_mapel`, dan field `nama_mapel`. Kolom `jumlah_nilai` dan `rata_rata` adalah hasil agregasi, bukan kolom tabel.
- `filters()` dan `condition()` mengikuti pola jurusan: filter `status` diterjemahkan menjadi `EXISTS`/`NOT EXISTS` terhadap tabel `nilai`, dipakai bersama oleh query daftar dan hitung.
- `searchRows()` memakai `LEFT JOIN nilai`, `COUNT()`, dan `ROUND(AVG(), 2)`. Mapel tanpa nilai tetap tampil dengan jumlah 0 dan rata-rata `NULL` (view menampilkannya sebagai `—`).
- `findDetail()` mengambil satu mapel beserta statistik nilainya; `detailRelations()` menampilkan seluruh nilai pada mapel tersebut beserta nama siswa (relasi `hasMany` mapel → nilai, lalu `belongsTo` nilai → siswa).

Contoh pemanggilan method `MapelController`:

```php
$mapelController = new MapelController($mapelModel, $validator);
$mapelController->dispatch('index', 'GET');   // ?route=mapel&q=mat&status=ada
$mapelController->dispatch('show', 'GET');    // ?route=mapel&action=show&id=1
```

Seperti jurusan, aksi penyimpanan dan penghapusan diwarisi dari `Controller`; yang ditimpa hanya query baca (daftar, hitung, detail, relasi) dan definisi filter.

### 8.5 Controller nilai: `app/Controllers/NilaiController.php`

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\Mapel;
use App\Models\Nilai;
use App\Models\Siswa;
use App\Support\Csrf;
use App\Support\Http;
use App\Support\Validator;
use InvalidArgumentException;
use PDOException;

final class NilaiController extends Controller
{
    private const BATCH_ROWS = 5;

    protected array $searchFields = ['nilai_angka', 'semester'];
    private Siswa $siswa;
    private Mapel $mapel;

    public function __construct(
        Nilai $model,
        Validator $validator,
        Siswa $siswa,
        Mapel $mapel,
    ) {
        parent::__construct(
            $model,
            $validator,
            'nilai',
            'Nilai',
            'id_nilai',
            [
                'nama_siswa' => 'Siswa',
                'nama_mapel' => 'Mata pelajaran',
                'nilai_angka' => 'Nilai',
                'semester' => 'Semester',
            ],
            [
                'id_siswa' => ['label' => 'Siswa', 'type' => 'select_siswa', 'required' => true],
                'id_mapel' => [
                    'label' => 'Mata pelajaran', 'type' => 'select_mapel', 'required' => true,
                ],
                'nilai_angka' => [
                    'label' => 'Nilai (0–100)', 'type' => 'number', 'required' => true,
                    'min' => '0', 'max' => '100', 'step' => '0.01',
                ],
                'semester' => [
                    'label' => 'Semester (1–6)', 'type' => 'number', 'required' => true,
                    'min' => '1', 'max' => '6', 'step' => '1',
                ],
            ],
        );
        $this->siswa = $siswa;
        $this->mapel = $mapel;
    }

    protected function options(): array
    {
        $siswa = $this->siswa->connection()->query(
            'SELECT id_siswa AS id, nama FROM siswa ORDER BY nama'
        )->fetchAll();
        $mapel = $this->mapel->connection()->query(
            'SELECT id_mapel AS id, nama_mapel AS nama FROM mapel ORDER BY nama_mapel'
        )->fetchAll();
        return [
            'id_siswa' => $siswa,
            'id_mapel' => $mapel,
        ];
    }

    protected function filters(): array
    {
        $semester = [];
        for ($i = 1; $i <= 6; $i++) {
            $semester[(string) $i] = 'Semester ' . $i;
        }
        $mapel = [];
        foreach ($this->options()['id_mapel'] as $item) {
            $mapel[(string) $item['id']] = $item['nama'];
        }
        return [
            'semester' => ['label' => 'Semester', 'options' => $semester],
            'id_mapel' => ['label' => 'Mata pelajaran', 'options' => $mapel],
        ];
    }

    protected function extraAction(string $action, string $method): bool
    {
        if ($action === 'laporan' && $method === 'GET') {
            $this->laporan();
            return true;
        }
        if ($action === 'batch' && $method === 'GET') {
            $this->batch();
            return true;
        }
        if ($action === 'storeBatch' && $method === 'POST') {
            $this->storeBatch();
            return true;
        }
        return false;
    }

    protected function searchRows(string $query, int $limit, int $offset, array $filters = []): array
    {
        [$where, $parameters] = $this->condition($query, $filters);
        return $this->fetchPage(
            'SELECT n.id_nilai, n.id_siswa, n.id_mapel, n.nilai_angka,
                    n.semester, s.nama AS nama_siswa, m.nama_mapel
             FROM nilai n
             JOIN siswa s ON s.id_siswa = n.id_siswa
             JOIN mapel m ON m.id_mapel = n.id_mapel'
            . $where . ' ORDER BY n.id_nilai DESC',
            $parameters,
            $limit,
            $offset
        );
    }

    protected function countRows(string $query, array $filters = []): int
    {
        [$where, $parameters] = $this->condition($query, $filters);
        $stmt = $this->model->connection()->prepare(
            'SELECT COUNT(*)
             FROM nilai n
             JOIN siswa s ON s.id_siswa = n.id_siswa
             JOIN mapel m ON m.id_mapel = n.id_mapel' . $where
        );
        $stmt->execute($parameters);
        return (int) $stmt->fetchColumn();
    }

    protected function findDetail(int $id): array|false
    {
        return $this->fetchAllRows(
            'SELECT n.id_nilai, n.id_siswa, n.id_mapel, n.nilai_angka, n.semester,
                    s.nama AS nama_siswa, s.email, j.nama_jurusan, m.nama_mapel
             FROM nilai n
             JOIN siswa s ON s.id_siswa = n.id_siswa
             LEFT JOIN jurusan j ON j.id_jurusan = s.id_jurusan
             JOIN mapel m ON m.id_mapel = n.id_mapel
             WHERE n.id_nilai = :id',
            ['id' => $id]
        )[0] ?? false;
    }

    protected function detailFields(): array
    {
        return [
            'nama_siswa' => 'Siswa',
            'email' => 'Email siswa',
            'nama_jurusan' => 'Jurusan',
            'nama_mapel' => 'Mata pelajaran',
            'semester' => 'Semester',
            'nilai_angka' => 'Nilai',
        ];
    }

    protected function detailRelations(array $row): array
    {
        return [
            [
                'title' => 'Nilai lain siswa ini pada semester yang sama',
                'route' => 'nilai',
                'key' => 'id_nilai',
                'fields' => [
                    'nama_mapel' => 'Mata pelajaran',
                    'nilai_angka' => 'Nilai',
                ],
                'rows' => $this->fetchAllRows(
                    'SELECT n.id_nilai, m.nama_mapel, n.nilai_angka
                     FROM nilai n
                     JOIN mapel m ON m.id_mapel = n.id_mapel
                     WHERE n.id_siswa = :id_siswa
                       AND n.semester = :semester
                       AND n.id_nilai <> :id_nilai
                     ORDER BY m.nama_mapel',
                    [
                        'id_siswa' => $row['id_siswa'],
                        'semester' => $row['semester'],
                        'id_nilai' => $row['id_nilai'],
                    ]
                ),
            ],
        ];
    }

    private function laporan(): void
    {
        $semesterText = Http::input($_GET, 'semester');
        $semester = $semesterText === '' ? 1 : Http::positiveId($semesterText);
        if ($semester > 6) {
            throw new InvalidArgumentException('Semester harus 1–6.');
        }

        $rows = $this->fetchAllRows(
            'SELECT s.id_siswa, s.nama, j.nama_jurusan,
                    COUNT(n.id_nilai) AS jumlah_mapel,
                    ROUND(AVG(n.nilai_angka), 2) AS rata_rata
             FROM siswa s
             LEFT JOIN jurusan j ON j.id_jurusan = s.id_jurusan
             LEFT JOIN nilai n
                 ON n.id_siswa = s.id_siswa AND n.semester = :semester
             GROUP BY s.id_siswa, s.nama, j.nama_jurusan
             ORDER BY rata_rata IS NULL, rata_rata DESC, s.nama',
            ['semester' => $semester]
        );

        $this->render('laporan', ['rows' => $rows, 'semester' => $semester]);
    }

    private function batch(string $error = '', array $old = []): void
    {
        $this->render('batch', [
            'error' => $error,
            'old' => $old,
            'options' => $this->options(),
            'jumlahBaris' => self::BATCH_ROWS,
        ]);
    }

    private function storeBatch(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);

        try {
            $dataList = $this->validateBatch();
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->batch($exception->getMessage(), $_POST);
            return;
        }

        $pdo = $this->model->connection();
        $pdo->beginTransaction();
        try {
            foreach ($dataList as $data) {
                $this->saveRow(null, $data);
            }
            $pdo->commit();
        } catch (PDOException $exception) {
            $pdo->rollBack();
            $message = $this->databaseMessage($exception);
            $this->batch($message . ' Semua baris dibatalkan.', $_POST);
            return;
        }

        $_SESSION['flash'] = count($dataList) . ' nilai berhasil disimpan dalam satu transaksi.';
        Http::redirect($this->url());
    }

    private function validateBatch(): array
    {
        $semester = Http::input($_POST, 'semester');
        $rows = $_POST['baris'] ?? [];
        if (!is_array($rows) || count($rows) > self::BATCH_ROWS) {
            throw new InvalidArgumentException('Bentuk data batch tidak valid.');
        }

        $dataList = [];
        foreach (array_values($rows) as $index => $input) {
            if (!is_array($input)) {
                throw new InvalidArgumentException('Bentuk data batch tidak valid.');
            }
            $isEmpty = Http::input($input, 'id_siswa') === ''
                && Http::input($input, 'id_mapel') === ''
                && Http::input($input, 'nilai_angka') === '';
            if ($isEmpty) {
                continue;
            }
            try {
                $dataList[] = $this->validator->validate(
                    'nilai',
                    array_merge($input, ['semester' => $semester])
                );
            } catch (InvalidArgumentException $exception) {
                throw new InvalidArgumentException(
                    'Baris ' . ($index + 1) . ': ' . $exception->getMessage()
                );
            }
        }

        if ($dataList === []) {
            throw new InvalidArgumentException('Isi minimal satu baris nilai.');
        }
        return $dataList;
    }

    private function condition(string $query, array $filters): array
    {
        $conditions = [];
        $parameters = [];
        if ($query !== '') {
            $conditions[] = '(s.nama LIKE :q_siswa
                              OR m.nama_mapel LIKE :q_mapel
                              OR CAST(n.semester AS CHAR) LIKE :q_semester)';
            $pattern = '%' . $query . '%';
            $parameters['q_siswa'] = $pattern;
            $parameters['q_mapel'] = $pattern;
            $parameters['q_semester'] = $pattern;
        }
        if (isset($filters['semester'])) {
            $conditions[] = 'n.semester = :f_semester';
            $parameters['f_semester'] = (int) $filters['semester'];
        }
        if (isset($filters['id_mapel'])) {
            $conditions[] = 'n.id_mapel = :f_mapel';
            $parameters['f_mapel'] = (int) $filters['id_mapel'];
        }

        $where = $conditions === [] ? '' : ' WHERE ' . implode(' AND ', $conditions);
        return [$where, $parameters];
    }
}
```

Penjelasan `NilaiController`:

- Constructor menerima model `Nilai` untuk metadata tabel/relasi serta model `Siswa` dan `Mapel` untuk mengambil pilihan dropdown. Konstanta `BATCH_ROWS` membatasi jumlah baris pada form batch.
- `listFields` menyebut alias nama siswa/mapel dari JOIN, beserta angka dan semester. `formFields` menetapkan dua dropdown wajib, input angka 0–100 dengan step 0.01, dan semester integer 1–6.
- `options()` menjalankan query pilihan siswa dan mapel melalui koneksi dari model masing-masing.
- `filters()` menyediakan filter semester (1–6) dan mata pelajaran. Nilai yang dikirim di luar daftar ini ditolak oleh controller dasar sebelum query dijalankan.
- `condition()` menggabungkan pencarian teks (dibungkus tanda kurung agar `OR` tidak "bocor") dengan filter semester dan mapel memakai `AND`. `searchRows()` dan `countRows()` memakai kondisi yang sama agar pagination akurat.
- `findDetail()` mengambil satu nilai beserta data siswa, jurusan siswa (`LEFT JOIN`, karena boleh kosong), dan mapel. `detailFields()` menentukan urutan kolom detail; `detailRelations()` menampilkan nilai lain milik siswa yang sama pada semester yang sama.
- `extraAction()` mendaftarkan tiga aksi tambahan: `laporan` (GET), `batch` (GET), dan `storeBatch` (POST). Kombinasi aksi/metode lain tetap jatuh ke respons 405 di `dispatch()`.
- `laporan()` memvalidasi semester 1–6 lalu menghitung rata-rata per siswa. `LEFT JOIN nilai` dengan filter semester di klausa `ON` membuat siswa tanpa nilai tetap muncul dengan rata-rata `NULL`; jika filter diletakkan di `WHERE`, siswa tersebut akan hilang. `ORDER BY rata_rata IS NULL` menaruh siswa tanpa nilai di urutan terakhir.
- `batch()` menampilkan form beberapa baris nilai sekaligus, termasuk saat validasi atau penyimpanan gagal (nilai lama dikirim ulang ke view).
- `storeBatch()` memeriksa CSRF, memvalidasi **seluruh** baris terlebih dahulu melalui `validateBatch()`, baru kemudian memulai transaksi. Setiap baris disimpan dengan `saveRow()`; bila semua berhasil, `commit()`. Bila satu baris gagal di database (duplikat atau relasi tidak ada), `rollBack()` membatalkan baris-baris yang sudah sempat di-INSERT, lalu form ditampilkan ulang dengan pesan dari `databaseMessage()`.
- `validateBatch()` menolak bentuk input yang bukan array, melewati baris yang dikosongkan seluruhnya, menambahkan semester bersama ke setiap baris, lalu memakai aturan validator `nilai` yang sama dengan form tunggal. Pesan error diberi nomor baris agar mudah diperbaiki.

Contoh pemanggilan method `NilaiController`:

```php
$nilaiController = new NilaiController(
    $nilaiModel,
    $validator,
    $siswaModel,
    $mapelModel
);
$nilaiController->dispatch('index', 'GET');       // ?route=nilai&semester=1&id_mapel=2
$nilaiController->dispatch('show', 'GET');        // ?route=nilai&action=show&id=7
$nilaiController->dispatch('laporan', 'GET');     // ?route=nilai&action=laporan&semester=1
$nilaiController->dispatch('batch', 'GET');       // ?route=nilai&action=batch
$nilaiController->dispatch('storeBatch', 'POST'); // POST berisi CSRF, semester, dan baris[]
```

Aksi `laporan`, `batch`, dan `storeBatch` tidak ada di controller lain; jika dipanggil pada route `siswa`, misalnya, `extraAction()` versi dasar mengembalikan `false` dan request mendapat 405. Seluruh SQL laporan dan transaksi tetap berada di controller, sedangkan view hanya menampilkan hasilnya.

---

## 9. View

Setiap direktori entitas memiliki tiga file view: `index.php` (daftar), `form.php` (tambah/edit), dan `show.php` (detail beserta relasi). Direktori `nilai` memiliki dua file tambahan, `laporan.php` dan `batch.php`. File view entitas memakai partial bersama agar tampilan konsisten. Controller menentukan data; view tidak memanggil model atau mengakses database.

### 9.1 Layout: `app/Views/layouts/main.php`

```php
<?php
use App\Support\Http;
?>
<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= Http::e($pageTitle) ?> — Data Sekolah</title>
    <style>
        body { font: 16px system-ui, sans-serif; max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
        nav a { margin-right: 1rem; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #bbb; padding: .5rem; text-align: left; }
        label { display: block; margin: .8rem 0; }
        input, select, button { font: inherit; padding: .4rem; }
        .message { color: #075c20; } .error { color: #a00000; }
        .scroll { overflow-x: auto; } .inline { display: inline; }
    </style>
</head>
<body>
<nav aria-label="Data sekolah">
    <a href="/crud_siswa/public/?route=siswa">Siswa</a>
    <a href="/crud_siswa/public/?route=jurusan">Jurusan</a>
    <a href="/crud_siswa/public/?route=mapel">Mata pelajaran</a>
    <a href="/crud_siswa/public/?route=nilai">Nilai</a>
</nav>
<main>
    <?= $content ?>
</main>
</body>
</html>
```

Penjelasan file layout:

- `use App\Support\Http` mengimpor helper escape HTML.
- `<title>` menggunakan `$pageTitle` yang disiapkan controller dan di-escape sebelum masuk ke HTML.
- Blok `<style>` hanya memberi tampilan dasar, tidak mengandung aturan bisnis atau query.
- Navigasi mengarahkan ke route empat entitas yang telah di-allowlist oleh front controller.
- `$content` adalah HTML hasil view spesifik entitas yang sudah dirender controller; layout membungkusnya dengan struktur HTML bersama.

Path `/crud_siswa/public/` mengikuti alamat instalasi tutorial. Jika nama folder atau document root berbeda, sesuaikan link pada layout dan method `url()` di controller dasar.

### 9.2 Daftar bersama: `app/Views/shared/index.php`

```php
<?php
use App\Support\Csrf;
use App\Support\Http;

$pageQuery = static function (int $target) use ($query, $filters): string {
    return http_build_query(['q' => $query] + $filters + ['halaman' => $target]);
};
?>
<h1>Kelola <?= Http::e($label) ?></h1>
<?php if ($flash !== ''): ?>
    <p class="message" role="status"><?= Http::e($flash) ?></p>
<?php endif; ?>
<p>
    <a href="<?= Http::e($url . '&action=create') ?>">Tambah <?= Http::e($label) ?></a>
    <?php if ($entity === 'nilai'): ?>
        | <a href="<?= Http::e($url . '&action=batch') ?>">Input nilai batch</a>
        | <a href="<?= Http::e($url . '&action=laporan') ?>">Laporan per semester</a>
    <?php endif; ?>
</p>
<form method="get" action="/crud_siswa/public/">
    <input type="hidden" name="route" value="<?= Http::e($entity) ?>">
    <label>Cari
        <input name="q" value="<?= Http::e($query) ?>">
    </label>
    <?php foreach ($filterOptions as $name => $filter): ?>
        <label><?= Http::e($filter['label']) ?>
            <select name="<?= Http::e($name) ?>">
                <option value="">— Semua —</option>
                <?php foreach ($filter['options'] as $value => $text): ?>
                    <option value="<?= Http::e($value) ?>"
                        <?= ($filters[$name] ?? '') === (string) $value ? 'selected' : '' ?>>
                        <?= Http::e($text) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </label>
    <?php endforeach; ?>
    <button type="submit">Terapkan</button>
    <a href="<?= Http::e($url) ?>">Reset</a>
</form>
<p><?= Http::e($total) ?> data. Halaman <?= Http::e($page) ?> dari <?= Http::e($lastPage) ?>.</p>
<?php if ($entity === 'siswa' || $entity === 'mapel'): ?>
    <p>Penghapusan siswa atau mata pelajaran juga menghapus nilai terkait sesuai foreign key.</p>
<?php elseif ($entity === 'jurusan'): ?>
    <p>Penghapusan jurusan mengosongkan jurusan siswa, tetapi tidak menghapus siswanya.</p>
<?php endif; ?>
<div class="scroll">
<table>
    <thead><tr>
        <th>ID</th>
        <?php foreach ($listFields as $heading): ?>
            <th><?= Http::e($heading) ?></th>
        <?php endforeach; ?>
        <th>Aksi</th>
    </tr></thead>
    <tbody>
    <?php foreach ($rows as $row): ?>
        <tr>
            <td><?= Http::e($row[$primaryKey]) ?></td>
            <?php foreach ($listFields as $field => $heading): ?>
                <td><?= Http::e($row[$field] ?? '—') ?></td>
            <?php endforeach; ?>
            <td>
                <a href="<?= Http::e($url . '&action=show&id=' . $row[$primaryKey]) ?>">Detail</a>
                <a href="<?= Http::e($url . '&action=edit&id=' . $row[$primaryKey]) ?>">Edit</a>
                <form class="inline" method="post" action="<?= Http::e($url . '&action=destroy') ?>"
                    onsubmit="return confirm('Hapus data ini beserta dampak relasinya?')">
                    <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
                    <input type="hidden" name="id" value="<?= Http::e($row[$primaryKey]) ?>">
                    <button type="submit">Hapus</button>
                </form>
            </td>
        </tr>
    <?php endforeach; ?>
    <?php if ($rows === []): ?>
        <tr><td colspan="<?= count($listFields) + 2 ?>">Data tidak ditemukan.</td></tr>
    <?php endif; ?>
    </tbody>
</table>
</div>
<nav aria-label="Halaman daftar">
    <?php if ($page > 1): ?>
        <a href="<?= Http::e($url . '&' . $pageQuery($page - 1)) ?>">Sebelumnya</a>
    <?php endif; ?>
    <?php if ($page < $lastPage): ?>
        <a href="<?= Http::e($url . '&' . $pageQuery($page + 1)) ?>">Berikutnya</a>
    <?php endif; ?>
</nav>
```

Penjelasan file daftar bersama:

- `$pageQuery()` menyusun query string pagination dari kata pencarian, filter aktif, dan nomor halaman tujuan, sehingga berpindah halaman tidak menghilangkan filter.
- Judul dan flash message berasal dari controller; semua nilai dinamis ditampilkan melalui `Http::e()`.
- Link tambah membawa route entitas dan aksi `create`. Khusus route `nilai`, ditambahkan link ke aksi `batch` dan `laporan` yang ditangani `NilaiController::extraAction()`.
- Form pencarian memakai GET karena hanya membaca data. Setiap entri dari `$filterOptions` dirender menjadi `<select>`; pilihan aktif ditandai `selected`. Daftar pilihan ini sama dengan allowlist yang diperiksa controller, jadi view tidak perlu memvalidasi sendiri.
- Link "Reset" kembali ke daftar tanpa pencarian dan filter.
- Informasi jumlah data/halaman memberi konteks pagination; peringatan penghapusan berubah sesuai entitas untuk menjelaskan dampak foreign key.
- Header tabel berasal dari metadata `listFields`, sedangkan isi tiap baris memakai key kolom yang sama. Nilai `NULL` (misalnya rata-rata mapel tanpa nilai) ditampilkan sebagai `—`.
- Link "Detail" membuka aksi `show`, link "Edit" membuka form melalui GET. Form hapus adalah POST, menyertakan token CSRF dan ID pada hidden input; `confirm()` hanya konfirmasi UX.
- Jika hasil kosong, satu baris penjelas menggantikan daftar kosong.

### 9.3 Form bersama: `app/Views/shared/form.php`

```php
<?php
use App\Support\Http;

$valueFor = static function (string $name) use ($old, $row): string {
    $value = $old[$name] ?? $row[$name] ?? '';
    return is_scalar($value) ? (string) $value : '';
};
?>
<h1><?= $id === null ? 'Tambah' : 'Edit' ?> <?= Http::e($label) ?></h1>
<?php if ($error !== ''): ?>
    <p class="error" role="alert"><?= Http::e($error) ?></p>
<?php endif; ?>
<form method="post" action="<?= Http::e($url . '&action=' . ($id === null ? 'store' : 'update')) ?>">
    <input type="hidden" name="csrf_token" value="<?= Http::e(\App\Support\Csrf::token()) ?>">
    <input type="hidden" name="id" value="<?= Http::e($id ?? '') ?>">
    <?php foreach ($formFields as $name => $field): ?>
        <label><?= Http::e($field['label']) ?>
        <?php if ($field['type'] === 'gender'): ?>
            <select name="<?= Http::e($name) ?>" required>
                <option value="">Pilih</option>
                <option value="L" <?= $valueFor($name) === 'L' ? 'selected' : '' ?>>Laki-laki</option>
                <option value="P" <?= $valueFor($name) === 'P' ? 'selected' : '' ?>>Perempuan</option>
            </select>
        <?php elseif (str_starts_with($field['type'], 'select_')): ?>
            <?php
            $optionKey = $name;
            $items = $options[$optionKey] ?? [];
            $nullable = !$field['required'];
            ?>
            <select name="<?= Http::e($name) ?>" <?= $field['required'] ? 'required' : '' ?>>
                <option value=""><?= $nullable ? '— Tidak dipilih —' : '— Pilih —' ?></option>
                <?php foreach ($items as $option): ?>
                    <option value="<?= Http::e($option['id']) ?>"
                        <?= $valueFor($name) === (string) $option['id'] ? 'selected' : '' ?>>
                        <?= Http::e($option['nama']) ?>
                    </option>
                <?php endforeach; ?>
            </select>
        <?php else: ?>
            <input
                name="<?= Http::e($name) ?>"
                type="<?= Http::e($field['type']) ?>"
                value="<?= Http::e($valueFor($name)) ?>"
                <?= $field['required'] ? 'required' : '' ?>
                <?php foreach (['min', 'max', 'step'] as $attribute): ?>
                    <?php if (isset($field[$attribute])): ?>
                        <?= Http::e($attribute) ?>="<?= Http::e($field[$attribute]) ?>"
                    <?php endif; ?>
                <?php endforeach; ?>
                <?php if (in_array($name, ['nama', 'nama_jurusan', 'nama_mapel'], true)): ?>
                    maxlength="100"
                <?php elseif ($name === 'email'): ?>
                    maxlength="150"
                <?php endif; ?>
            >
        <?php endif; ?>
        </label>
    <?php endforeach; ?>
    <button type="submit">Simpan</button>
    <a href="<?= Http::e($url) ?>">Batal</a>
</form>
```

Penjelasan file form bersama:

- `$valueFor()` mengambil nilai lama hasil POST jika validasi gagal; bila tidak ada, ia memakai nilai dari baris saat edit. Hanya scalar yang ditampilkan sebagai string.
- Judul membedakan form tambah dan edit berdasarkan `$id`.
- Pesan error di-escape dan diberi `role="alert"` agar terlihat oleh teknologi bantu.
- Form dikirim dengan POST ke aksi `store` saat membuat data atau `update` saat mengedit, dan selalu menyertakan token CSRF serta ID (kosong untuk create).
- Perulangan `formFields` merender field sesuai metadata dari controller, sehingga label/jenis field tidak dicampur ke model data.
- Tipe `gender` dibuat sebagai select `L`/`P`; tipe `select_*` dibuat dari opsi siswa/jurusan/mapel yang controller sediakan.
- Input lain memakai tipe HTML yang sesuai. Atribut `required`, `min`, `max`, `step`, dan `maxlength` membantu browser, tetapi validasi server tetap yang menentukan.
- Tombol simpan mengirim POST; tautan batal kembali ke daftar melalui GET.

### 9.4 Detail bersama: `app/Views/shared/show.php`

```php
<?php
use App\Support\Http;
?>
<h1>Detail <?= Http::e($label) ?></h1>
<table>
    <tbody>
    <tr><th scope="row">ID</th><td><?= Http::e($row[$primaryKey]) ?></td></tr>
    <?php foreach ($detailFields as $field => $heading): ?>
        <tr>
            <th scope="row"><?= Http::e($heading) ?></th>
            <td><?= Http::e($row[$field] ?? '—') ?></td>
        </tr>
    <?php endforeach; ?>
    </tbody>
</table>
<p>
    <a href="<?= Http::e($url . '&action=edit&id=' . $row[$primaryKey]) ?>">Edit</a>
    | <a href="<?= Http::e($url) ?>">Kembali ke daftar</a>
</p>

<?php foreach ($relations as $relation): ?>
    <h2><?= Http::e($relation['title']) ?> (<?= count($relation['rows']) ?>)</h2>
    <?php if ($relation['rows'] === []): ?>
        <p>Belum ada data.</p>
    <?php else: ?>
        <div class="scroll">
        <table>
            <thead><tr>
                <?php foreach ($relation['fields'] as $heading): ?>
                    <th><?= Http::e($heading) ?></th>
                <?php endforeach; ?>
                <th>Aksi</th>
            </tr></thead>
            <tbody>
            <?php foreach ($relation['rows'] as $item): ?>
                <tr>
                    <?php foreach ($relation['fields'] as $field => $heading): ?>
                        <td><?= Http::e($item[$field] ?? '—') ?></td>
                    <?php endforeach; ?>
                    <td>
                        <a href="<?= Http::e('/crud_siswa/public/?' . http_build_query([
                            'route' => $relation['route'],
                            'action' => 'show',
                            'id' => $item[$relation['key']],
                        ])) ?>">Detail</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        </div>
    <?php endif; ?>
<?php endforeach; ?>
```

Penjelasan file detail bersama:

- Tabel pertama menampilkan ID dan setiap kolom dari `$detailFields`. Daftar kolom ini ditentukan controller melalui `detailFields()`, sehingga siswa dapat menampilkan tanggal terdaftar dan nilai dapat menampilkan jurusan siswa tanpa mengubah view.
- Link "Edit" membuka form untuk baris yang sama; link "Kembali" menuju daftar entitas.
- `$relations` berisi nol atau lebih relasi dari `detailRelations()`. Setiap relasi dirender sebagai subjudul dengan jumlah baris, lalu tabel kolom `fields`.
- Link "Detail" pada tabel relasi dibangun dari `route` dan `key` yang ditetapkan controller, sehingga pengguna dapat berpindah dari jurusan → siswa → nilai → mapel. `http_build_query()` menyusun parameter dengan encoding yang benar.
- Relasi tanpa data menampilkan "Belum ada data." alih-alih tabel kosong. Semua nilai tetap di-escape dengan `Http::e()`.

### 9.5 Laporan nilai: `app/Views/nilai/laporan.php`

```php
<?php
use App\Support\Http;
?>
<h1>Laporan rata-rata nilai semester <?= Http::e($semester) ?></h1>
<form method="get" action="/crud_siswa/public/">
    <input type="hidden" name="route" value="nilai">
    <input type="hidden" name="action" value="laporan">
    <label>Semester
        <select name="semester">
            <?php for ($i = 1; $i <= 6; $i++): ?>
                <option value="<?= $i ?>" <?= $i === $semester ? 'selected' : '' ?>><?= $i ?></option>
            <?php endfor; ?>
        </select>
    </label>
    <button type="submit">Tampilkan</button>
    <a href="<?= Http::e($url) ?>">Kembali ke daftar nilai</a>
</form>
<div class="scroll">
<table>
    <thead><tr>
        <th>No</th><th>Siswa</th><th>Jurusan</th><th>Jumlah mapel</th><th>Rata-rata</th>
    </tr></thead>
    <tbody>
    <?php foreach ($rows as $index => $item): ?>
        <tr>
            <td><?= $index + 1 ?></td>
            <td>
                <a href="<?= Http::e('/crud_siswa/public/?route=siswa&action=show&id=' . $item['id_siswa']) ?>">
                    <?= Http::e($item['nama']) ?>
                </a>
            </td>
            <td><?= Http::e($item['nama_jurusan'] ?? '—') ?></td>
            <td><?= Http::e($item['jumlah_mapel']) ?></td>
            <td><?= Http::e($item['rata_rata'] ?? 'Belum ada nilai') ?></td>
        </tr>
    <?php endforeach; ?>
    <?php if ($rows === []): ?>
        <tr><td colspan="5">Belum ada data siswa.</td></tr>
    <?php endif; ?>
    </tbody>
</table>
</div>
```

Penjelasan file laporan nilai:

- Form GET mengirim `route=nilai`, `action=laporan`, dan semester pilihan. Controller tetap memvalidasi semester 1–6 walaupun dropdown sudah membatasi pilihan.
- Tabel menampilkan hasil query agregasi dari `NilaiController::laporan()`: nama siswa, jurusan, jumlah mapel yang sudah dinilai, dan rata-rata.
- Nama siswa ditautkan ke halaman detail siswa. Siswa yang belum memiliki nilai pada semester tersebut tetap tampil dengan teks "Belum ada nilai" karena query memakai `LEFT JOIN`.

### 9.6 Input batch nilai: `app/Views/nilai/batch.php`

```php
<?php
use App\Support\Csrf;
use App\Support\Http;

$oldRows = isset($old['baris']) && is_array($old['baris']) ? $old['baris'] : [];
$oldValue = static function (int $index, string $name) use ($oldRows): string {
    $value = $oldRows[$index][$name] ?? '';
    return is_string($value) ? $value : '';
};
$oldSemester = isset($old['semester']) && is_string($old['semester']) ? $old['semester'] : '';
?>
<h1>Input nilai batch</h1>
<p>Semua baris disimpan dalam satu transaksi. Jika satu baris gagal, tidak ada baris yang tersimpan.
   Baris yang dikosongkan seluruhnya akan dilewati.</p>
<?php if ($error !== ''): ?>
    <p class="error" role="alert"><?= Http::e($error) ?></p>
<?php endif; ?>
<form method="post" action="<?= Http::e($url . '&action=storeBatch') ?>">
    <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
    <label>Semester (berlaku untuk semua baris)
        <input name="semester" type="number" min="1" max="6" step="1" required
            value="<?= Http::e($oldSemester) ?>">
    </label>
    <div class="scroll">
    <table>
        <thead><tr><th>No</th><th>Siswa</th><th>Mata pelajaran</th><th>Nilai</th></tr></thead>
        <tbody>
        <?php for ($i = 0; $i < $jumlahBaris; $i++): ?>
            <tr>
                <td><?= $i + 1 ?></td>
                <?php foreach (['id_siswa', 'id_mapel'] as $name): ?>
                    <td>
                        <select name="baris[<?= $i ?>][<?= $name ?>]">
                            <option value="">— Pilih —</option>
                            <?php foreach ($options[$name] as $option): ?>
                                <option value="<?= Http::e($option['id']) ?>"
                                    <?= $oldValue($i, $name) === (string) $option['id'] ? 'selected' : '' ?>>
                                    <?= Http::e($option['nama']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                <?php endforeach; ?>
                <td>
                    <input name="baris[<?= $i ?>][nilai_angka]" type="number"
                        min="0" max="100" step="0.01"
                        value="<?= Http::e($oldValue($i, 'nilai_angka')) ?>">
                </td>
            </tr>
        <?php endfor; ?>
        </tbody>
    </table>
    </div>
    <button type="submit">Simpan semua</button>
    <a href="<?= Http::e($url) ?>">Batal</a>
</form>
```

Penjelasan file input batch:

- `$oldRows`, `$oldValue()`, dan `$oldSemester` mengambil kembali input POST ketika validasi atau transaksi gagal, sehingga pengguna tidak perlu mengetik ulang. Hanya nilai string yang ditampilkan.
- Semester diisi sekali dan berlaku untuk semua baris; controller menggabungkannya ke setiap baris sebelum validasi.
- Nama field berbentuk `baris[0][id_siswa]`, `baris[0][id_mapel]`, dan `baris[0][nilai_angka]`, sehingga PHP menerimanya sebagai array bertingkat di `$_POST['baris']`.
- Dropdown memakai `$options` dari `NilaiController::options()`, sama seperti form nilai tunggal. Jumlah baris berasal dari konstanta `BATCH_ROWS` di controller.
- Form dikirim dengan POST ke aksi `storeBatch` dan menyertakan token CSRF.

### 9.7 File view per entitas

Buat isi file berikut. Pemisahan direktori memudahkan pengembangan tampilan per entitas; markup bersama tetap digunakan oleh partial `shared`.

`app/Views/siswa/index.php`:

```php
<?php require dirname(__DIR__) . '/shared/index.php'; ?>
```

File view daftar siswa mendelegasikan markup umum ke partial daftar. `dirname(__DIR__)` dari `Views/siswa` menunjuk ke `Views`, lalu path `shared/index.php` dimuat. File ini memungkinkan tampilan siswa dikustomisasi kelak tanpa memindahkan query ke view.

`app/Views/siswa/form.php`:

```php
<?php require dirname(__DIR__) . '/shared/form.php'; ?>
```

File view form siswa memuat partial form bersama, yang membaca konfigurasi field khusus siswa dari `SiswaController`.

`app/Views/siswa/show.php`:

```php
<?php require dirname(__DIR__) . '/shared/show.php'; ?>
```

File view detail siswa memuat partial detail; relasi nilai siswa disiapkan oleh `SiswaController::detailRelations()`.

`app/Views/jurusan/index.php`:

```php
<?php require dirname(__DIR__) . '/shared/index.php'; ?>
```

File view daftar jurusan memakai partial bersama untuk judul, pencarian, tabel, aksi, dan pagination.

`app/Views/jurusan/form.php`:

```php
<?php require dirname(__DIR__) . '/shared/form.php'; ?>
```

File view form jurusan memakai partial yang sama; daftar field hanya berisi nama jurusan sesuai metadata `JurusanController`.

`app/Views/jurusan/show.php`:

```php
<?php require dirname(__DIR__) . '/shared/show.php'; ?>
```

File view detail jurusan menampilkan nama jurusan, jumlah siswa, dan daftar siswa jurusan tersebut.

`app/Views/mapel/index.php`:

```php
<?php require dirname(__DIR__) . '/shared/index.php'; ?>
```

File view daftar mapel memuat markup daftar bersama. Penghapusan mapel dapat mempengaruhi nilai terkait sesuai FK.

`app/Views/mapel/form.php`:

```php
<?php require dirname(__DIR__) . '/shared/form.php'; ?>
```

File view form mapel memakai partial form bersama dan menerima satu field nama mapel dari controller.

`app/Views/mapel/show.php`:

```php
<?php require dirname(__DIR__) . '/shared/show.php'; ?>
```

File view detail mapel menampilkan jumlah nilai, rata-rata, dan daftar nilai pada mata pelajaran tersebut.

`app/Views/nilai/index.php`:

```php
<?php require dirname(__DIR__) . '/shared/index.php'; ?>
```

File view daftar nilai memakai partial bersama; data nama siswa/mapel sudah disiapkan melalui JOIN oleh `NilaiController`.

`app/Views/nilai/form.php`:

```php
<?php require dirname(__DIR__) . '/shared/form.php'; ?>
```

File view form nilai memuat dropdown siswa/mapel serta field angka/semester yang ditentukan `NilaiController`. View hanya menampilkan data opsi; tidak menjalankan query sendiri.

`app/Views/nilai/show.php`:

```php
<?php require dirname(__DIR__) . '/shared/show.php'; ?>
```

File view detail nilai menampilkan siswa, jurusan, mapel, serta nilai lain milik siswa yang sama pada semester yang sama.

---

## 10. Front Controller dan Autoload Composer

Buat `public/index.php`. File ini menjadi satu-satunya entry point aplikasi baru. Autoload class `App\` dan class package dotenv disediakan oleh Composer; jangan menambahkan `spl_autoload_register()` manual.

```php
<?php
declare(strict_types=1);

use App\Config\Database;
use App\Controllers\JurusanController;
use App\Controllers\MapelController;
use App\Controllers\NilaiController;
use App\Controllers\SiswaController;
use App\Models\Jurusan;
use App\Models\Mapel;
use App\Models\Nilai;
use App\Models\Siswa;
use App\Support\Validator;

require dirname(__DIR__) . '/vendor/autoload.php';

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
session_start();

try {
    $pdo = Database::connect();
} catch (Throwable $exception) {
    error_log('Bootstrap aplikasi gagal: ' . $exception->getMessage());
    http_response_code(500);
    exit('Aplikasi tidak dapat dijalankan. Periksa konfigurasi dan log server.');
}

$validator = new Validator();
$jurusan = new Jurusan($pdo);
$mapel = new Mapel($pdo);
$siswa = new Siswa($pdo);
$nilai = new Nilai($pdo);

$controllers = [
    'siswa' => new SiswaController($siswa, $validator, $jurusan),
    'jurusan' => new JurusanController($jurusan, $validator),
    'mapel' => new MapelController($mapel, $validator),
    'nilai' => new NilaiController(
        $nilai,
        $validator,
        $siswa,
        $mapel
    ),
];

$route = $_GET['route'] ?? 'siswa';
$action = $_GET['action'] ?? 'index';
if (!is_string($route) || !isset($controllers[$route]) || !is_string($action)) {
    http_response_code(404);
    exit('Halaman tidak ditemukan.');
}

$controllers[$route]->dispatch($action, $_SERVER['REQUEST_METHOD']);
```

Penjelasan bagian `public/index.php`:

- Baris `use` mengimpor class controller, model, helper validasi, dan koneksi agar dapat dipakai dengan nama pendek.
- `require vendor/autoload.php` mendaftarkan autoloader Composer. File itulah yang memetakan namespace `App\` ke `app/` sesuai `composer.json` dan memuat dependency phpdotenv.
- Pengaturan session dijalankan sebelum output agar cookie dapat dikirim dan CSRF dapat menyimpan token pada session.
- Blok `try/catch` memanggil `Database::connect()`. Bila konfigurasi atau koneksi gagal, detail dicatat di log, pengguna menerima pesan umum, dan aplikasi berhenti dengan status 500.
- `$validator` dibuat satu kali dan dipakai oleh semua controller untuk memvalidasi input form.
- Setiap model menerima objek PDO yang sama dan mendeskripsikan tabel/relasinya. Model tersebut disuntikkan ke controller yang sesuai; controller mengambil koneksi melalui `connection()` untuk menjalankan CRUD, JOIN, dan query pilihan dropdown.
- `$controllers` adalah allowlist route. Tidak ada class atau nama tabel yang dibentuk dari teks URL.
- `$route` dan `$action` membaca parameter URL, lalu tipe dan keberadaan route diperiksa sebelum dispatch. Route tidak dikenal menghasilkan 404.
- `dispatch()` menerima action dan metode HTTP untuk menjalankan alur daftar/detail/form/simpan/hapus, serta aksi tambahan seperti `laporan` dan `batch` pada route `nilai`.

`session_start()` dijalankan sebelum token CSRF dipakai dan sebelum view mengirim output. Jika akan mengubah path instalasi, lakukan juga pada link layout dan method `url()` controller.

---

## 11. Menjalankan Aplikasi

1. Pastikan Apache dan MySQL hidup di XAMPP.
2. Buat database/tabel sesuai Modul DDL dan periksa dengan `SHOW CREATE TABLE`.
3. Simpan seluruh file sesuai struktur direktori di bagian 2, lalu buat `.env` dari `.env.example`.
4. Pastikan Composer memakai PHP dari XAMPP dan ekstensi `pdo_mysql` aktif. Periksa `php --ini` atau konfigurasi PHP XAMPP jika muncul `could not find driver`.
5. Dari root proyek, jalankan `composer install`; pastikan file `vendor/autoload.php` telah dibuat.
6. Buka halaman berikut:

```text
http://localhost/crud_siswa/public/
```

Route langsung dapat dicoba dengan alamat seperti:

```text
http://localhost/crud_siswa/public/?route=siswa
http://localhost/crud_siswa/public/?route=jurusan
http://localhost/crud_siswa/public/?route=mapel
http://localhost/crud_siswa/public/?route=nilai
```

Detail, filter, laporan, dan input batch dapat dicoba dengan alamat berikut (sesuaikan ID dengan data Anda):

```text
http://localhost/crud_siswa/public/?route=siswa&action=show&id=1
http://localhost/crud_siswa/public/?route=jurusan&action=show&id=1
http://localhost/crud_siswa/public/?route=siswa&id_jurusan=1
http://localhost/crud_siswa/public/?route=siswa&id_jurusan=kosong
http://localhost/crud_siswa/public/?route=jurusan&status=kosong
http://localhost/crud_siswa/public/?route=mapel&status=ada
http://localhost/crud_siswa/public/?route=nilai&semester=1&id_mapel=2
http://localhost/crud_siswa/public/?route=nilai&action=laporan&semester=1
http://localhost/crud_siswa/public/?route=nilai&action=batch
```

Jika proyek dipasang pada path lain, ubah path `/crud_siswa/public/` pada `Controller::url()` dan `Views/layouts/main.php`. Jangan mengubah allowlist nama route.

### 11.1 Alur satu request tambah data

1. Browser GET `?route=siswa&action=create`; controller menyiapkan data form dan daftar jurusan.
2. View menampilkan form beserta token CSRF.
3. Browser POST `?route=siswa&action=store`.
4. Controller memverifikasi CSRF, membaca ID, dan memanggil validator.
5. Validator membentuk array dengan field yang diizinkan; controller menjalankan SQL untuk tabel `siswa` menggunakan koneksi dan metadata model `Siswa`.
6. Setelah berhasil, controller mengarahkan browser dengan status 303 ke daftar.
7. Refresh daftar tidak mengirim ulang POST.

### 11.2 Alur edit dan hapus

- Edit hanya membaca melalui GET dan memerlukan ID positif yang tersedia.
- Update mengirim POST dengan ID dan token; validasi serta query update dilakukan ulang di server.
- Hapus hanya POST + CSRF. Dialog konfirmasi browser bukan perlindungan server.
- Penghapusan siswa/mapel akan menghapus nilai terkait sesuai FK; penghapusan jurusan menjadikan FK siswa NULL.

### 11.3 Alur detail, filter, laporan, dan batch

- **Detail**: GET `action=show&id=…` memanggil `findDetail()` (data utama dengan JOIN) dan `detailRelations()` (daftar data turunan). ID yang tidak ada menghasilkan 404.
- **Filter**: parameter filter dibaca oleh `selectedFilters()` dan hanya diterima bila nilainya ada di `filters()`. Kondisi yang sama dipakai oleh `countRows()` dan `searchRows()`, sehingga total data dan isi halaman selalu konsisten.
- **Laporan**: GET `route=nilai&action=laporan&semester=N` diteruskan `dispatch()` ke `NilaiController::extraAction()`, lalu `laporan()` menjalankan query agregasi dan merender `nilai/laporan.php`.
- **Batch**: GET `action=batch` menampilkan form; POST `action=storeBatch` memverifikasi CSRF, memvalidasi semua baris, lalu menyimpan semuanya dalam satu transaksi. Berhasil → redirect 303 ke daftar nilai; gagal → `rollBack()` dan form tampil ulang dengan input lama.

---

## 12. Pengujian Penerimaan

Gunakan data latihan dan catat hasil aktual.

| Kasus | Hasil yang diharapkan |
|---|---|
| Daftar, tambah, edit, hapus pada empat route | Operasi ditangani controller dan model entitasnya |
| Parameter `route=namatabelbebas` | HTTP 404; tidak ada query dinamis |
| Input ID berupa array, teks, nol, atau negatif | Ditolak sebelum query perubahan |
| GET ke `action=destroy` atau `action=store` | HTTP 405; data tidak berubah |
| Token CSRF kosong/salah | HTTP 403; data tidak berubah |
| Field wajib kosong atau format nilai salah | HTTP 422 dan pesan validasi |
| Nama/email duplikat | Pesan konflik, tidak ada duplikasi |
| ID siswa/mapel/jurusan tidak ada | Ditolak oleh foreign key dengan pesan umum |
| Input `<script>` ditampilkan | Tampil sebagai teks, bukan markup aktif |
| Hapus siswa atau mapel | Nilai terkait mengikuti FK CASCADE |
| Hapus jurusan | Siswa tetap ada dengan jurusan NULL |
| Pencarian tanpa hasil | Tampil pesan data tidak ditemukan |
| Nomor halaman melebihi halaman terakhir | Diklem ke halaman terakhir |
| Database berhenti | HTTP 500 dengan pesan umum; detail hanya di log |
| Detail dengan ID yang tidak ada | HTTP 404 "Data tidak ditemukan." |
| Detail jurusan/mapel/siswa/nilai | Data utama dan tabel relasi tampil; link relasi membuka detail entitas terkait |
| Filter jurusan/semester/mapel/status | Total data dan isi tabel sama-sama terfilter; pagination mempertahankan filter |
| Nilai filter di luar pilihan (misalnya `semester=9`) | HTTP 400; tidak ada query daftar |
| Laporan dengan `semester=7` atau teks | HTTP 400 |
| `action=laporan` pada `route=siswa` | HTTP 405 |
| Batch dengan satu baris duplikat | HTTP 409, semua baris dibatalkan (rollback), tidak ada baris tersimpan |

---

## 13. Laporan Nilai dan Transaksi Batch

Kedua fitur ini sudah diimplementasikan di `NilaiController` (bagian 8.5) dan view `nilai/laporan.php` serta `nilai/batch.php` (bagian 9.5–9.6). Bagian ini menjelaskan alasan desain query dan transaksinya.

**Query laporan.** Method `laporan()` menjalankan query berikut:

```sql
SELECT s.id_siswa, s.nama, j.nama_jurusan,
       COUNT(n.id_nilai) AS jumlah_mapel,
       ROUND(AVG(n.nilai_angka), 2) AS rata_rata
FROM siswa s
LEFT JOIN jurusan j ON j.id_jurusan = s.id_jurusan
LEFT JOIN nilai n
    ON n.id_siswa = s.id_siswa AND n.semester = :semester
GROUP BY s.id_siswa, s.nama, j.nama_jurusan
ORDER BY rata_rata IS NULL, rata_rata DESC, s.nama;
```

- `LEFT JOIN nilai` membuat siswa tanpa nilai tetap tampil dengan `jumlah_mapel = 0` dan `rata_rata = NULL`.
- Filter semester diletakkan di klausa `ON`, bukan `WHERE`. Jika diletakkan di `WHERE`, baris siswa tanpa nilai (kolom `n.semester` bernilai NULL) akan tersaring dan `LEFT JOIN` berperilaku seperti `INNER JOIN`.
- `COUNT(n.id_nilai)` menghitung baris nilai yang benar-benar ada; `COUNT(*)` akan menghitung 1 untuk siswa tanpa nilai.
- `ORDER BY rata_rata IS NULL` menaruh siswa tanpa nilai di urutan paling bawah.

**Transaksi batch.** Method `storeBatch()` mengikuti urutan berikut:

1. Verifikasi token CSRF.
2. Validasi **seluruh** baris melalui `validateBatch()` sebelum menyentuh database. Jika satu baris tidak valid, tidak ada transaksi yang dimulai dan form tampil ulang dengan status 422.
3. `beginTransaction()`, lalu simpan baris satu per satu dengan `saveRow()`.
4. Jika semua berhasil, `commit()` dan redirect 303 ke daftar nilai.
5. Jika satu `INSERT` gagal (misalnya duplikat 1062 atau FK 1452), `rollBack()` membatalkan baris yang sudah sempat disimpan, lalu form tampil ulang dengan pesan dari `databaseMessage()`.

Validasi dilakukan di luar transaksi agar transaksi sesingkat mungkin. Jangan memanggil `beginTransaction()` lagi di dalam transaksi yang masih aktif; PDO akan melempar exception.

---

## 14. Uji Langsung Fitur Pengembangan

Fitur pengembangan berikut sudah menjadi bagian dari kode modul ini. Uji setiap fitur langsung di browser dan cocokkan hasilnya.

| Fitur | Lokasi kode | Cara uji |
|---|---|---|
| Detail + relasi empat entitas | `Controller::show()`, `findDetail()`, `detailRelations()`, `shared/show.php` | Klik "Detail" pada setiap daftar; telusuri jurusan → siswa → nilai → detail nilai |
| Filter jurusan pada siswa | `SiswaController::filters()` dan `condition()` | Pilih jurusan; total data dan isi tabel harus sama-sama berubah. Pilih "Tanpa jurusan" untuk siswa dengan `id_jurusan` NULL |
| Filter status jurusan/mapel | `JurusanController` dan `MapelController` (`EXISTS`/`NOT EXISTS`) | Pilih "Belum memiliki…" lalu pastikan jumlah siswa/nilai bernilai 0 |
| Filter semester dan mapel pada nilai | `NilaiController::filters()` dan `condition()` | Pilih semester 1 lalu pindah halaman; filter tetap terbawa di link pagination |
| Laporan rata-rata per semester | `NilaiController::laporan()`, `nilai/laporan.php` | Buka "Laporan per semester"; siswa tanpa nilai tampil "Belum ada nilai" |
| Input batch dengan transaksi | `NilaiController::storeBatch()`, `nilai/batch.php` | Isi 2–3 baris valid lalu simpan; semua baris muncul di daftar |

**Membuktikan rollback batch:**

1. Pastikan constraint `uq_nilai_siswa_mapel_semester` dari bagian 3 sudah dipasang.
2. Catat jumlah data di `?route=nilai`.
3. Buka `?route=nilai&action=batch`. Isi baris 1 dan 2 dengan kombinasi siswa–mapel baru, lalu isi baris 3 dengan kombinasi siswa–mapel–semester yang **sudah ada** di database.
4. Simpan. Hasil yang diharapkan: HTTP 409, pesan "Data duplikat… Semua baris dibatalkan.", dan input lama tetap terisi di form.
5. Kembali ke daftar nilai. Jumlah data harus **sama** dengan catatan langkah 2; baris 1 dan 2 tidak ikut tersimpan.
6. Ganti baris 3 dengan kombinasi baru, simpan ulang, dan pastikan ketiga baris tersimpan.

---

## 15. Rangkuman

| Konsep | Ringkasan |
| --- | --- |
| Composer dan PSR-4 | `composer.json` memetakan namespace `App\` ke `app/`; `vendor/autoload.php` dimuat oleh `public/index.php` |
| Konfigurasi | Nilai koneksi dibaca dari `.env`; `Database::connect()` membuat objek PDO |
| Model | Mendeskripsikan tabel, primary key, field yang dapat diisi, tipe data, dan relasi (`Relation`) |
| Controller | Menjalankan query PDO, validasi, CRUD, filter, pagination, serta detail beserta relasinya |
| View | Layout dan view bersama (`shared/index.php`, `form.php`, `show.php`); teks ditampilkan melalui `Http::e()` |
| Front controller | `public/index.php` memakai allowlist `$controllers`; route tidak dikenal menghasilkan 404 |
| Keamanan data | Prepared statement, CSRF pada POST, Post/Redirect/Get dengan status 303, dan foreign key |
| Transaksi | `storeBatch()` memakai `beginTransaction()`, `commit()`, dan `rollBack()` |

| Fitur | Route | Penerapan |
| --- | --- | --- |
| CRUD dan detail | `siswa`, `jurusan`, `mapel`, `nilai` | Controller entitas + view bersama |
| Filter jurusan | `siswa` | Kondisi yang sama untuk query hitung dan query daftar |
| Filter status | `jurusan`, `mapel` | `EXISTS` / `NOT EXISTS` |
| Filter semester dan mapel | `nilai` | Filter tetap terbawa di link pagination |
| Laporan per semester | `nilai&action=laporan` | `LEFT JOIN` dengan filter semester di klausa `ON` |
| Input batch | `nilai&action=batch` | Validasi seluruh baris, lalu satu transaksi |

**Alur satu request:** browser → `public/index.php` → controller sesuai route → model dan PDO → view → browser.

---

## 16. Kesalahan Umum

| Masalah | Yang Diperiksa / Solusi |
|---|---|
| `Class not found` | Namespace, ejaan path/file, dan autoloader |
| `could not find driver` | Ekstensi `pdo_mysql` pada PHP XAMPP |
| Table/column not found | Bandingkan dengan `SHOW CREATE TABLE` |
| Error 1062 | Email/nama duplikat atau constraint unik nilai |
| Error 1452 | ID relasi tidak tersedia |
| Redirect gagal / `headers already sent` | Tidak ada output sebelum controller/redirect/session |
| CSRF gagal | Session aktif dan token berada pada request POST |
| Dropdown kosong | Isi tabel induk jurusan/siswa/mapel |
| Nilai `75,5` ditolak | Format yang digunakan titik desimal: `75.5` |
| Pencarian lambat | `LIKE '%kata%'` biasanya tidak memakai indeks B-tree; ukur sebelum mengoptimalkan |

---

## 17. Daftar Periksa Akhir

Tandai setelah berhasil:

- [ ] `composer install` berhasil dan `vendor/autoload.php` tersedia.
- [ ] `.env` dibuat dari `.env.example` dan aplikasi terhubung ke `db_sekolah`.
- [ ] Daftar, tambah, edit, hapus, dan detail berjalan pada route `siswa`, `jurusan`, `mapel`, dan `nilai`.
- [ ] Route tidak dikenal menghasilkan 404, GET ke `action=store`/`destroy` menghasilkan 405, dan token CSRF salah menghasilkan 403.
- [ ] Input tidak valid menghasilkan 422 dan data duplikat ditolak dengan pesan konflik.
- [ ] Filter, pencarian, dan pagination memberi total data dan isi tabel yang konsisten.
- [ ] Laporan per semester tetap menampilkan siswa yang belum memiliki nilai.
- [ ] Batch dengan satu baris duplikat dibatalkan seluruhnya (rollback).
- [ ] Input `<script>` tampil sebagai teks, bukan markup aktif.
- [ ] Kamu bisa menjelaskan pembagian tugas model, controller, dan view pada aplikasi ini.

Lanjutkan ke [Modul 7](modul_7_sistem_autentikasi_mini_project.md) untuk menambahkan autentikasi pada seluruh route tanpa memindahkan SQL keluar dari controller.

---

## 18. Referensi

- [PHP namespaces](https://www.php.net/manual/en/language.namespaces.php)
- [PHP PDO](https://www.php.net/manual/en/book.pdo.php)
- [PDO prepared statements](https://www.php.net/manual/en/pdo.prepared-statements.php)
- [PDO transactions](https://www.php.net/manual/en/pdo.transactions.php)
- [MySQL foreign keys](https://dev.mysql.com/doc/refman/8.4/en/create-table-foreign-keys.html)
