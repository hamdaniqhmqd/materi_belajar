# Modul 7 — PHP & MySQL: Autentikasi Sederhana MVC Data Sekolah (Register, Login, Forgot Password)

**Prasyarat:** [Modul 6](modul_6_php_mysql_data_sekolah.md) selesai dan aplikasi CRUD `siswa`, `jurusan`, `mapel`, serta `nilai` berjalan melalui `public/index.php`.
**Proyek:** `crud_siswa` (lanjutan Modul 6), database `db_sekolah`.
**Lingkungan:** PHP 8.0+, PDO MySQL, MySQL/MariaDB dari XAMPP, Composer.
**Alokasi:** 3 pertemuan × 3 JP.
**Hasil:** aplikasi MVC Modul 6 yang hanya dapat dibuka setelah login. Aplikasi memiliki tabel `users`, fitur daftar akun (register), masuk/keluar (login/logout), dan lupa password (forgot password) sederhana.

> Modul ini **melanjutkan kode Modul 6 tanpa menulis ulang CRUD**. Model tetap hanya berisi metadata, sedangkan SQL tetap dijalankan di controller. Autentikasi dibuat **sederhana** untuk pembelajaran: register seperti insert data biasa, login memeriksa username dan password, dan forgot password berupa satu form untuk mengganti password. Kerjakan pada database latihan dan buat backup sebelum menambah tabel.

## 1. Tujuan pembelajaran

Setelah menyelesaikan modul, peserta mampu:

1. Menambahkan tabel `users` dengan constraint unik untuk username dan email.
2. Membuat model `User` dengan pola metadata yang sama seperti model Modul 6.
3. Menyimpan password memakai `password_hash()` dan memeriksanya dengan `password_verify()`.
4. Membuat alur register, login, logout, dan forgot password dengan pola controller–view Modul 6.
5. Menyimpan status login di session dan mengganti ID session saat login.
6. Mewajibkan login sebelum membuka route data sekolah.
7. Menguji skenario berhasil dan gagal pada setiap fitur autentikasi.

## 2. Kelanjutan Modul 6 dan rancangan alur

Pada Modul 6, siapa pun yang membuka `http://localhost/crud_siswa/public/` dapat menambah, mengubah, dan menghapus data sekolah. Modul 7 menambahkan **pemeriksaan login di `public/index.php`** sebelum request diteruskan ke controller CRUD. Controller `SiswaController`, `JurusanController`, `MapelController`, dan `NilaiController` tidak diubah.

| Lapisan | Tanggung jawab di Modul 7 |
|---|---|
| Model (`User`) | Metadata tabel `users`: nama tabel, primary key, field yang dapat diisi, dan cast. Tidak menjalankan query. |
| Controller (`AuthController`) | Membaca request, memverifikasi CSRF, memanggil validator, menjalankan SQL melalui `connection()` model, mengatur session, dan memilih view/redirect. |
| Support (`Validator`, `Http`, `Csrf`) | Helper tanpa akses database: validasi input, escape HTML, redirect, dan token formulir. |
| View (`auth/*`, layout) | Menampilkan form, pesan, dan menu pengguna. Tidak membaca database. |
| Front controller (`public/index.php`) | Mendaftarkan route `auth` dan mengarahkan tamu ke halaman login. |

### 2.1 Alur autentikasi

```text
Tamu ──► ?route=auth&action=register (POST) ──► AuthController ──► INSERT INTO users
Tamu ──► ?route=auth&action=login    (POST) ──► AuthController ──► password_verify ──► $_SESSION['user']
Tamu ──► ?route=auth&action=forgot   (POST) ──► AuthController ──► cek email + password lama ──► UPDATE users
User ──► ?route=siswa                       ──► index.php cek $_SESSION['user'] ──► SiswaController
User ──► ?route=auth&action=logout   (POST) ──► AuthController ──► hapus $_SESSION['user']
Tamu ──► ?route=siswa                       ──► index.php ──► redirect 303 ke halaman login
```

### 2.2 Daftar route autentikasi

| Route dan aksi | GET | POST | Akses |
|---|---|---|---|
| `?route=auth&action=register` | Tampilkan form daftar | Simpan akun baru | Tamu |
| `?route=auth&action=login` | Tampilkan form login | Periksa username dan password | Tamu |
| `?route=auth&action=forgot` | Tampilkan form ganti password | Periksa email + password lama, simpan password baru | Tamu dan pengguna login |
| `?route=auth&action=logout` | — (405) | Keluar | Pengguna login |
| `?route=auth&action=profile` | Tampilkan profil (bagian 14.1) | — (405) | Pengguna login |
| Route data sekolah (`siswa`, `jurusan`, `mapel`, `nilai`) | Sesuai Modul 6 | Sesuai Modul 6 | Wajib login |

Pengguna yang sudah login lalu membuka halaman login atau register diarahkan ke daftar siswa.

### 2.3 Struktur file

File bertanda `← baru` dibuat pada modul ini, sedangkan `← ubah` adalah file Modul 6 yang diperbarui. File lain tetap seperti Modul 6.

```text
crud_siswa\
├── app\
│   ├── Config\
│   │   └── Database.php
│   ├── Controllers\
│   │   ├── AuthController.php         ← baru
│   │   ├── Controller.php
│   │   ├── JurusanController.php
│   │   ├── MapelController.php
│   │   ├── NilaiController.php
│   │   └── SiswaController.php
│   ├── Models\
│   │   ├── Model.php
│   │   ├── Relation.php
│   │   ├── User.php                   ← baru
│   │   ├── Jurusan.php
│   │   ├── Mapel.php
│   │   ├── Nilai.php
│   │   └── Siswa.php
│   ├── Support\
│   │   ├── Csrf.php
│   │   ├── Http.php
│   │   └── Validator.php              ← ubah: aturan register/login/forgot
│   └── Views\
│       ├── auth\
│       │   ├── forgot.php             ← baru
│       │   ├── login.php              ← baru
│       │   ├── profile.php            ← baru (praktikum 14.1)
│       │   └── register.php           ← baru
│       ├── layouts\
│       │   └── main.php               ← ubah: menu pengguna dan logout
│       └── (folder view Modul 6 lainnya)
├── .env
├── composer.json
├── composer.lock
├── vendor\
└── public\
    └── index.php                      ← ubah: route auth dan wajib login
```

Tidak ada package Composer baru. Class baru di `app/` otomatis dikenali autoloader PSR-4 `App\` dari Modul 6.

## 3. Tabel `users`

Tabel dibuat seringkas mungkin: hanya identitas login dan waktu pencatatan.

| Kolom | Tipe | Aturan |
|---|---|---|
| `id_user` | `INT UNSIGNED` | Primary key, auto increment |
| `username` | `VARCHAR(50)` | Wajib, unik |
| `email` | `VARCHAR(150)` | Wajib, unik |
| `password` | `VARCHAR(255)` | Wajib; berisi **hasil `password_hash()`**, bukan password asli |
| `created_at` | `TIMESTAMP` | Diisi otomatis saat baris dibuat |
| `updated_at` | `TIMESTAMP NULL` | Diisi otomatis saat baris diubah |

Jalankan di phpMyAdmin (tab SQL) atau MySQL client:

```sql
USE db_sekolah;

CREATE TABLE users (
    id_user INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SHOW CREATE TABLE users;
```

Penjelasan tabel `users`:

- `id_user` mengikuti pola nama primary key Modul 6 (`id_siswa`, `id_jurusan`, …).
- `UNIQUE KEY` pada `username` dan `email` membuat database menolak akun ganda dengan error **1062**, walaupun dua request register dikirim hampir bersamaan.
- Kolom bernama `password`, tetapi **isinya selalu hash**. Hash dari `password_hash()` dengan `PASSWORD_DEFAULT` saat ini panjangnya 60 karakter; `VARCHAR(255)` disiapkan agar tetap cukup jika algoritma default PHP berubah.
- `created_at` terisi otomatis saat `INSERT`. `updated_at` awalnya `NULL` dan terisi otomatis ketika baris diubah, misalnya saat password diganti.
- Collation `utf8mb4_unicode_ci` tidak membedakan huruf besar/kecil, sehingga `Budi` dan `budi` dianggap username yang sama oleh constraint unik.

> Jangan pernah mengisi kolom `password` dengan teks biasa melalui phpMyAdmin. Login akan selalu gagal karena `password_verify()` mengharapkan hash, dan password asli akan terbaca oleh siapa pun yang membuka database.

## 4. Model `app/Models/User.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

final class User extends Model
{
    protected string $table = 'users';
    protected string $primaryKey = 'id_user';
    protected array $fillable = ['username', 'email', 'password'];
    protected array $casts = ['id_user' => 'int'];
}
```

Penjelasan model `User`:

- Model mewarisi `App\Models\Model` dari Modul 6 sehingga menerima PDO melalui constructor dan menyediakan `connection()`, `table()`, `primaryKey()`, `fillable()`, serta `casts()`.
- `$fillable` hanya berisi tiga kolom yang boleh diisi dari form. `id_user`, `created_at`, dan `updated_at` diisi database.
- Model `User` tidak memiliki relasi dan tidak menjalankan query, sama seperti model Modul 6.

Contoh pemanggilan model `User`:

```php
$user = new User($pdo);
$pdo = $user->connection();   // PDO yang dipakai controller untuk query
$table = $user->table();      // 'users'
$fields = $user->fillable();  // ['username', 'email', 'password']
```

## 5. Validasi input autentikasi

`Validator` Modul 6 tetap dipakai. Tambahkan dua helper private dan tiga entitas baru: `register`, `login`, dan `forgot`. Validator tetap **tidak mengakses database**; pengecekan username/email terdaftar dan password lama dilakukan controller.

### 5.1 Helper baru di `app/Support/Validator.php`

Letakkan method berikut di bawah method `name()` yang sudah ada:

```php
    private function secret(array $input, string $key, string $label): string
    {
        $value = $input[$key] ?? '';
        if (!is_string($value) || $value === '') {
            throw new InvalidArgumentException($label . ' wajib diisi.');
        }
        return $value;
    }

    private function newPassword(array $input, string $key, string $confirmKey): string
    {
        $password = $this->secret($input, $key, 'Password baru');
        $length = preg_match_all('/./us', $password);
        if ($length === false || $length < 8 || strlen($password) > 72) {
            throw new InvalidArgumentException(
                'Password minimal 8 karakter dan maksimal 72 byte.'
            );
        }
        if ($password !== ($input[$confirmKey] ?? null)) {
            throw new InvalidArgumentException('Konfirmasi password tidak sama.');
        }
        return $password;
    }
```

Penjelasan helper baru:

- `secret()` membaca password **tanpa `trim()`**. Berbeda dengan `text()`, spasi di awal/akhir password dianggap bagian dari password. Nilai berupa array atau kosong ditolak.
- `newPassword()` dipakai saat membuat atau mengganti password:
  - minimal 8 karakter, dihitung per karakter UTF-8 dengan `preg_match_all('/./us')`;
  - maksimal 72 **byte** karena algoritma bcrypt (default `PASSWORD_DEFAULT` saat ini) mengabaikan byte setelah ke-72;
  - nilai konfirmasi harus sama persis dengan password baru.

### 5.2 Entitas `register`, `login`, dan `forgot`

Tambahkan blok berikut di dalam `validate()`, **sebelum** baris `throw new InvalidArgumentException('Entitas tidak dikenal.');`:

```php
        if ($entity === 'register') {
            $username = $this->text($input, 'username');
            if (!preg_match('/^[A-Za-z0-9_]{3,50}$/D', $username)) {
                throw new InvalidArgumentException(
                    'Username 3–50 karakter: huruf, angka, atau garis bawah.'
                );
            }
            $email = strtolower($this->text($input, 'email'));
            if (strlen($email) > 150 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException('Email wajib diisi dengan format valid.');
            }
            return [
                'username' => $username,
                'email' => $email,
                'password' => $this->newPassword($input, 'password', 'password_confirmation'),
            ];
        }
        if ($entity === 'login') {
            $username = $this->text($input, 'username');
            if ($username === '') {
                throw new InvalidArgumentException('Username wajib diisi.');
            }
            return [
                'username' => $username,
                'password' => $this->secret($input, 'password', 'Password'),
            ];
        }
        if ($entity === 'forgot') {
            $email = strtolower($this->text($input, 'email'));
            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException('Email wajib diisi dengan format valid.');
            }
            $oldPassword = $this->secret($input, 'password_lama', 'Password lama');
            $newPassword = $this->newPassword($input, 'password_baru', 'password_baru_confirmation');
            if ($oldPassword === $newPassword) {
                throw new InvalidArgumentException('Password baru harus berbeda dari password lama.');
            }
            return [
                'email' => $email,
                'password_lama' => $oldPassword,
                'password_baru' => $newPassword,
            ];
        }
```

Penjelasan aturan setiap entitas:

- **`register`** memeriksa format username (hanya huruf, angka, garis bawah; 3–50 karakter), format dan panjang email, lalu password baru beserta konfirmasinya. Email diubah ke huruf kecil agar `Budi@Sekolah.test` dan `budi@sekolah.test` dianggap sama. Hasilnya berisi key kolom `users`, tetapi `password` **masih teks asli**; controller yang membuat hash.
- **`login`** hanya memastikan username dan password terisi. Format username tidak diperiksa ketat agar pesan gagal login tetap sama untuk semua kasus.
- **`forgot`** memeriksa email, password lama, password baru, dan konfirmasi password baru. Password baru juga harus berbeda dari password lama. Key `password_lama` dan `password_baru` bukan nama kolom; controller memakainya untuk verifikasi dan update.
- Semua kesalahan dilempar sebagai `InvalidArgumentException` dan ditangani controller sebagai HTTP 422 dengan form yang ditampilkan ulang.

Contoh pemanggilan validator untuk autentikasi:

```php
$validator = new Validator();

$dataRegister = $validator->validate('register', [
    'username' => 'operator_tu',
    'email' => 'Operator@Sekolah.test',
    'password' => 'rahasia123',
    'password_confirmation' => 'rahasia123',
]);
// ['username' => 'operator_tu', 'email' => 'operator@sekolah.test', 'password' => 'rahasia123']

$dataLogin = $validator->validate('login', [
    'username' => 'operator_tu',
    'password' => 'rahasia123',
]);

$dataForgot = $validator->validate('forgot', [
    'email' => 'operator@sekolah.test',
    'password_lama' => 'rahasia123',
    'password_baru' => 'rahasiaBaru456',
    'password_baru_confirmation' => 'rahasiaBaru456',
]);
```

## 6. Controller `app/Controllers/AuthController.php`

`AuthController` tidak mewarisi `Controller` Modul 6 karena alurnya bukan CRUD daftar/form/hapus. Polanya tetap sama: `dispatch()` dengan allowlist aksi dan metode, SQL melalui `$this->model->connection()`, CSRF pada setiap POST, flash message, redirect 303, serta `render()` yang membungkus view dengan layout.

```php
<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Models\User;
use App\Support\Csrf;
use App\Support\Http;
use App\Support\Validator;
use InvalidArgumentException;
use PDOException;
use Throwable;

final class AuthController
{
    private const HOME_URL = '/crud_siswa/public/?route=siswa';
    private const LOGIN_URL = '/crud_siswa/public/?route=auth&action=login';

    public function __construct(
        private User $model,
        private Validator $validator,
    ) {
    }

    public function dispatch(string $action, string $method): void
    {
        try {
            if ($action === 'login' && $method === 'GET') {
                $this->guestOnly();
                $this->render('login', 'Login');
                return;
            }
            if ($action === 'login' && $method === 'POST') {
                $this->guestOnly();
                $this->login();
                return;
            }
            if ($action === 'register' && $method === 'GET') {
                $this->guestOnly();
                $this->render('register', 'Daftar akun');
                return;
            }
            if ($action === 'register' && $method === 'POST') {
                $this->guestOnly();
                $this->register();
                return;
            }
            if ($action === 'forgot' && $method === 'GET') {
                $this->render('forgot', 'Lupa password');
                return;
            }
            if ($action === 'forgot' && $method === 'POST') {
                $this->forgot();
                return;
            }
            if ($action === 'logout' && $method === 'POST') {
                $this->logout();
                return;
            }

            header('Allow: GET, POST');
            http_response_code(405);
            exit('Metode atau aksi tidak tersedia.');
        } catch (PDOException $exception) {
            error_log('Autentikasi database gagal: ' . $exception->getMessage());
            http_response_code(500);
            exit('Data tidak dapat diproses. Periksa layanan database.');
        } catch (Throwable $exception) {
            error_log('Autentikasi gagal: ' . $exception->getMessage());
            http_response_code(500);
            exit('Terjadi kesalahan pada aplikasi.');
        }
    }

    private function register(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        try {
            $data = $this->validator->validate('register', $_POST);
            $statement = $this->model->connection()->prepare(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
            );
            $statement->execute([
                $data['username'],
                $data['email'],
                password_hash($data['password'], PASSWORD_DEFAULT),
            ]);
            $_SESSION['flash'] = 'Akun berhasil dibuat. Silakan login.';
            Http::redirect(self::LOGIN_URL);
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->render('register', 'Daftar akun', $exception->getMessage(), $_POST);
        } catch (PDOException $exception) {
            if ((int) ($exception->errorInfo[1] ?? 0) !== 1062) {
                throw $exception;
            }
            http_response_code(409);
            $this->render('register', 'Daftar akun', 'Username atau email sudah terdaftar.', $_POST);
        }
    }

    private function login(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        try {
            $data = $this->validator->validate('login', $_POST);
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->render('login', 'Login', $exception->getMessage(), $_POST);
            return;
        }

        $statement = $this->model->connection()->prepare(
            'SELECT id_user, username, password FROM users WHERE username = ? LIMIT 1'
        );
        $statement->execute([$data['username']]);
        $user = $statement->fetch();

        if ($user === false || !password_verify($data['password'], $user['password'])) {
            http_response_code(401);
            $this->render('login', 'Login', 'Username atau password salah.', $_POST);
            return;
        }

        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id_user' => (int) $user['id_user'],
            'username' => $user['username'],
        ];
        $_SESSION['flash'] = 'Selamat datang, ' . $user['username'] . '.';
        Http::redirect(self::HOME_URL);
    }

    private function forgot(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        try {
            $data = $this->validator->validate('forgot', $_POST);
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->render('forgot', 'Lupa password', $exception->getMessage(), $_POST);
            return;
        }

        $pdo = $this->model->connection();
        $statement = $pdo->prepare('SELECT id_user, password FROM users WHERE email = ? LIMIT 1');
        $statement->execute([$data['email']]);
        $user = $statement->fetch();

        if ($user === false || !password_verify($data['password_lama'], $user['password'])) {
            http_response_code(422);
            $this->render('forgot', 'Lupa password', 'Email atau password lama salah.', $_POST);
            return;
        }

        $update = $pdo->prepare('UPDATE users SET password = ? WHERE id_user = ?');
        $update->execute([
            password_hash($data['password_baru'], PASSWORD_DEFAULT),
            $user['id_user'],
        ]);

        unset($_SESSION['user']);
        session_regenerate_id(true);
        $_SESSION['flash'] = 'Password berhasil diganti. Silakan login dengan password baru.';
        Http::redirect(self::LOGIN_URL);
    }

    private function logout(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);
        unset($_SESSION['user']);
        session_regenerate_id(true);
        $_SESSION['flash'] = 'Anda telah keluar.';
        Http::redirect(self::LOGIN_URL);
    }

    private function guestOnly(): void
    {
        if (isset($_SESSION['user'])) {
            Http::redirect(self::HOME_URL);
        }
    }

    private function render(string $view, string $pageTitle, string $error = '', array $old = []): void
    {
        $flash = $_SESSION['flash'] ?? '';
        unset($_SESSION['flash']);

        ob_start();
        require dirname(__DIR__) . '/Views/auth/' . $view . '.php';
        $content = (string) ob_get_clean();
        require dirname(__DIR__) . '/Views/layouts/main.php';
    }
}
```

Penjelasan properti dan method `AuthController`:

- `HOME_URL` dan `LOGIN_URL` menyimpan tujuan redirect. Path `/crud_siswa/public/` sama dengan Modul 6; sesuaikan jika folder instalasi berbeda.
- Constructor menerima model `User` dan `Validator`. Koneksi PDO diambil melalui `$this->model->connection()`, sama seperti controller Modul 6.
- `dispatch()` adalah allowlist aksi: `login`, `register`, dan `forgot` menerima GET (tampilkan form) dan POST (proses form); `logout` hanya POST. Kombinasi lain mendapat **405**. `PDOException` dan `Throwable` dicatat ke log dan dibalas pesan umum **500**.
- `register()` memverifikasi CSRF, memvalidasi input, lalu menjalankan `INSERT` biasa. Satu-satunya perbedaan dengan insert data Modul 6 adalah password disimpan sebagai `password_hash($password, PASSWORD_DEFAULT)`. Error 1062 dari constraint unik ditampilkan sebagai **409** "Username atau email sudah terdaftar"; error database lain dilempar ulang ke `dispatch()`.
- `login()` mencari baris berdasarkan username dengan prepared statement, lalu memeriksa password dengan `password_verify()`. Username tidak ditemukan dan password salah sengaja diberi **pesan yang sama** (HTTP 401) agar orang lain tidak dapat menebak username mana yang terdaftar. Jika berhasil:
  - `session_regenerate_id(true)` mengganti ID session untuk mencegah *session fixation*;
  - `$_SESSION['user']` hanya menyimpan `id_user` dan `username`, **tidak pernah hash password**.
- `forgot()` mencari user berdasarkan email, memeriksa password lama dengan `password_verify()`, lalu menjalankan `UPDATE users SET password = ?` dengan hash password baru. Kolom `updated_at` terisi otomatis oleh MySQL. Setelah berhasil, session login dihapus agar pengguna masuk ulang dengan password baru.
- `logout()` hanya POST + CSRF agar link/gambar dari situs lain tidak dapat memaksa pengguna keluar. Data `user` dihapus dari session dan ID session diganti; token CSRF tetap ada sehingga form login langsung dapat dipakai.
- `guestOnly()` mengarahkan pengguna yang sudah login keluar dari halaman login/register.
- `render()` mengambil flash message satu kali, merender `Views/auth/{view}.php` ke `$content`, lalu memuat layout Modul 6. Variabel `$pageTitle`, `$error`, `$old`, dan `$flash` dapat dipakai di view. Nama view hanya berasal dari string tetap di controller, bukan dari URL.

Contoh pemanggilan `AuthController`:

```php
$auth = new AuthController(new User($pdo), new Validator());

// Biasanya dipanggil oleh public/index.php:
$auth->dispatch('login', 'GET');      // tampilkan form login
$auth->dispatch('login', 'POST');     // proses $_POST['username'] dan $_POST['password']
$auth->dispatch('logout', 'GET');     // HTTP 405: logout wajib POST
```

Ringkasan kode status yang dipakai:

| Kondisi | Status |
|---|---|
| Berhasil register/login/forgot/logout | 303 redirect |
| Input tidak lengkap/format salah, email atau password lama salah | 422 |
| Username atau password login salah | 401 |
| Username/email sudah terdaftar | 409 |
| Token CSRF salah | 403 (dari `Csrf::verify()`) |
| Aksi/metode tidak tersedia | 405 |
| Database bermasalah | 500 dengan pesan umum |

> **Catatan desain forgot password.** Fitur ini sengaja dibuat sederhana sesuai kebutuhan latihan: pengguna harus mengingat **password lama**. Secara fungsi, ini adalah "ganti password". Pada aplikasi sungguhan, pengguna yang benar-benar lupa password biasanya menerima tautan reset bertoken melalui email. Lihat bagian 12.

## 7. View autentikasi

Ketiga view berada di `app/Views/auth/`. Semua form memakai POST, hidden input CSRF, dan `Http::e()` untuk setiap nilai yang dicetak. Field password **tidak pernah** diisi ulang dari `$old`.

### 7.1 `app/Views/auth/login.php`

```php
<?php
use App\Support\Csrf;
use App\Support\Http;
?>
<h1>Login</h1>
<?php if ($flash !== ''): ?>
    <p class="message" role="status"><?= Http::e($flash) ?></p>
<?php endif; ?>
<?php if ($error !== ''): ?>
    <p class="error" role="alert"><?= Http::e($error) ?></p>
<?php endif; ?>
<form method="post" action="/crud_siswa/public/?route=auth&amp;action=login">
    <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
    <label>Username
        <input name="username" required maxlength="50" autocomplete="username"
               value="<?= Http::e($old['username'] ?? '') ?>">
    </label>
    <label>Password
        <input type="password" name="password" required autocomplete="current-password">
    </label>
    <button type="submit">Masuk</button>
</form>
<p>
    Belum punya akun? <a href="/crud_siswa/public/?route=auth&amp;action=register">Daftar</a> ·
    <a href="/crud_siswa/public/?route=auth&amp;action=forgot">Lupa password</a>
</p>
```

Penjelasan view login:

- Flash message (misalnya "Akun berhasil dibuat") dan pesan error dicetak melalui `Http::e()`.
- Hidden input `csrf_token` dibaca oleh `Csrf::verify()` di controller.
- Username diisi ulang dari `$old` setelah gagal, sedangkan password dikosongkan.
- Atribut `autocomplete` membantu password manager browser mengenali form.

### 7.2 `app/Views/auth/register.php`

```php
<?php
use App\Support\Csrf;
use App\Support\Http;
?>
<h1>Daftar akun</h1>
<?php if ($error !== ''): ?>
    <p class="error" role="alert"><?= Http::e($error) ?></p>
<?php endif; ?>
<form method="post" action="/crud_siswa/public/?route=auth&amp;action=register">
    <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
    <label>Username
        <input name="username" required minlength="3" maxlength="50"
               pattern="[A-Za-z0-9_]+" autocomplete="username"
               value="<?= Http::e($old['username'] ?? '') ?>">
    </label>
    <label>Email
        <input type="email" name="email" required maxlength="150" autocomplete="email"
               value="<?= Http::e($old['email'] ?? '') ?>">
    </label>
    <label>Password
        <input type="password" name="password" required minlength="8" autocomplete="new-password">
    </label>
    <label>Konfirmasi password
        <input type="password" name="password_confirmation" required minlength="8"
               autocomplete="new-password">
    </label>
    <button type="submit">Daftar</button>
</form>
<p>Sudah punya akun? <a href="/crud_siswa/public/?route=auth&amp;action=login">Login</a></p>
```

Penjelasan view register:

- Nama field sama dengan key yang dibaca `Validator` entitas `register`: `username`, `email`, `password`, dan `password_confirmation`.
- Atribut `required`, `minlength`, `pattern`, dan `type="email"` hanya membantu pengguna di browser. Aturan sebenarnya tetap diperiksa ulang di server karena atribut HTML mudah dilewati.

### 7.3 `app/Views/auth/forgot.php`

```php
<?php
use App\Support\Csrf;
use App\Support\Http;
?>
<h1>Lupa password</h1>
<p>Masukkan email akun, password lama, dan password baru.</p>
<?php if ($error !== ''): ?>
    <p class="error" role="alert"><?= Http::e($error) ?></p>
<?php endif; ?>
<form method="post" action="/crud_siswa/public/?route=auth&amp;action=forgot">
    <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
    <label>Email
        <input type="email" name="email" required maxlength="150" autocomplete="email"
               value="<?= Http::e($old['email'] ?? '') ?>">
    </label>
    <label>Password lama
        <input type="password" name="password_lama" required autocomplete="current-password">
    </label>
    <label>Password baru
        <input type="password" name="password_baru" required minlength="8"
               autocomplete="new-password">
    </label>
    <label>Konfirmasi password baru
        <input type="password" name="password_baru_confirmation" required minlength="8"
               autocomplete="new-password">
    </label>
    <button type="submit">Simpan password baru</button>
</form>
<p><a href="/crud_siswa/public/?route=auth&amp;action=login">Kembali ke login</a></p>
```

Penjelasan view forgot:

- Form berisi empat field sesuai kebutuhan: email, password lama, password baru, dan konfirmasi password baru.
- Hanya email yang diisi ulang setelah error; ketiga field password selalu kosong.
- Pesan error "Email atau password lama salah" sengaja tidak membedakan email tidak terdaftar dengan password lama salah.

## 8. Layout `app/Views/layouts/main.php`

Layout Modul 6 diubah pada bagian navigasi. Menu data sekolah dan tombol **Keluar** hanya tampil jika pengguna sudah login; tamu melihat link Login dan Daftar.

```php
<?php
use App\Support\Csrf;
use App\Support\Http;

$currentUser = $_SESSION['user'] ?? null;
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
        nav { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #bbb; padding: .5rem; text-align: left; }
        label { display: block; margin: .8rem 0; }
        input, select, button { font: inherit; padding: .4rem; }
        .message { color: #075c20; } .error { color: #a00000; }
        .scroll { overflow-x: auto; } .inline { display: inline; }
    </style>
</head>
<body>
<nav aria-label="Navigasi utama">
    <?php if ($currentUser !== null): ?>
        <div>
            <a href="/crud_siswa/public/?route=siswa">Siswa</a>
            <a href="/crud_siswa/public/?route=jurusan">Jurusan</a>
            <a href="/crud_siswa/public/?route=mapel">Mata pelajaran</a>
            <a href="/crud_siswa/public/?route=nilai">Nilai</a>
        </div>
        <div>
            Masuk sebagai <strong><?= Http::e($currentUser['username']) ?></strong>
            <form class="inline" method="post"
                  action="/crud_siswa/public/?route=auth&amp;action=logout">
                <input type="hidden" name="csrf_token" value="<?= Http::e(Csrf::token()) ?>">
                <button type="submit">Keluar</button>
            </form>
        </div>
    <?php else: ?>
        <div>
            <a href="/crud_siswa/public/?route=auth&amp;action=login">Login</a>
            <a href="/crud_siswa/public/?route=auth&amp;action=register">Daftar</a>
        </div>
    <?php endif; ?>
</nav>
<main>
    <?= $content ?>
</main>
</body>
</html>
```

Penjelasan perubahan layout:

- `$currentUser` dibaca dari session yang diisi `AuthController::login()`. Layout hanya membaca session, tidak menjalankan query.
- Username dicetak dengan `Http::e()` walaupun formatnya sudah dibatasi validator.
- Tombol **Keluar** berupa form POST dengan token CSRF, bukan link GET.
- Style tambahan untuk `nav` hanya menata menu kiri dan menu pengguna di kanan. Variabel `$pageTitle` dan `$content` tetap sama dengan Modul 6, sehingga view CRUD tidak perlu diubah.

## 9. Front controller `public/index.php`

Tambahkan model `User`, `AuthController`, dan pemeriksaan login. Bagian yang diubah ditandai komentar `Modul 7`.

```php
<?php
declare(strict_types=1);

use App\Config\Database;
use App\Controllers\AuthController;
use App\Controllers\JurusanController;
use App\Controllers\MapelController;
use App\Controllers\NilaiController;
use App\Controllers\SiswaController;
use App\Models\Jurusan;
use App\Models\Mapel;
use App\Models\Nilai;
use App\Models\Siswa;
use App\Models\User;
use App\Support\Http;
use App\Support\Validator;

require dirname(__DIR__) . '/vendor/autoload.php';

ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.cookie_httponly', '1'); // Modul 7
ini_set('session.cookie_samesite', 'Lax'); // Modul 7
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
$user = new User($pdo); // Modul 7

$controllers = [
    'auth' => new AuthController($user, $validator), // Modul 7
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

// Modul 7: semua route selain auth wajib login.
if ($route !== 'auth' && !isset($_SESSION['user'])) {
    $_SESSION['flash'] = 'Silakan login terlebih dahulu.';
    Http::redirect('/crud_siswa/public/?route=auth&action=login');
}

$controllers[$route]->dispatch($action, $_SERVER['REQUEST_METHOD']);
```

Penjelasan perubahan `public/index.php`:

- `session.cookie_httponly` membuat cookie session tidak dapat dibaca JavaScript. `session.cookie_samesite=Lax` membuat browser tidak mengirim cookie session pada sebagian besar request lintas situs. Keduanya diatur **sebelum** `session_start()`.
- `$user` dibuat dari PDO yang sama dengan model lain, lalu disuntikkan ke `AuthController`.
- Route `auth` ditambahkan ke allowlist `$controllers`. Route tidak dikenal tetap menghasilkan 404.
- Pemeriksaan login diletakkan **setelah** validasi route dan **sebelum** `dispatch()`. Jika `$_SESSION['user']` belum ada, request ke `siswa`, `jurusan`, `mapel`, atau `nilai` diarahkan ke login dengan status 303. Karena `Http::redirect()` memanggil `exit`, controller CRUD tidak pernah berjalan untuk tamu.
- Default route tetap `siswa`; tamu yang membuka `http://localhost/crud_siswa/public/` otomatis diarahkan ke halaman login.

## 10. Menjalankan aplikasi

1. Pastikan Apache dan MySQL hidup di XAMPP.
2. Jalankan SQL bagian 3 dan periksa hasil `SHOW CREATE TABLE users`.
3. Simpan file baru/ubah sesuai struktur bagian 2.3.
4. Periksa sintaks file PHP yang baru dibuat:

```powershell
cd C:\xampp\htdocs\crud_siswa
php -l app\Models\User.php
php -l app\Controllers\AuthController.php
php -l app\Support\Validator.php
php -l public\index.php
```

5. Buka halaman berikut. Tamu akan diarahkan ke login:

```text
http://localhost/crud_siswa/public/
```

6. Daftar akun, login, lalu buka kembali menu data sekolah Modul 6.

Route autentikasi dapat dibuka langsung:

```text
http://localhost/crud_siswa/public/?route=auth&action=register
http://localhost/crud_siswa/public/?route=auth&action=login
http://localhost/crud_siswa/public/?route=auth&action=forgot
```

Periksa isi tabel setelah register. Kolom `password` harus berisi hash yang diawali `$2y$`, bukan password asli:

```sql
SELECT id_user, username, email, LEFT(password, 7) AS awal_hash, created_at, updated_at
FROM users;
```

### 10.1 Alur satu request login

1. Browser GET `?route=auth&action=login`; `index.php` melewatkan pemeriksaan login karena route `auth`.
2. `AuthController::render()` menampilkan form login beserta token CSRF.
3. Browser POST `?route=auth&action=login`.
4. Controller memverifikasi CSRF dan memanggil validator `login`.
5. Controller menjalankan `SELECT … WHERE username = ?`, lalu `password_verify()`.
6. Jika cocok, ID session diganti, `$_SESSION['user']` diisi, dan browser diarahkan (303) ke daftar siswa.
7. Request berikutnya ke `?route=siswa` lolos pemeriksaan login di `index.php` dan diteruskan ke `SiswaController` Modul 6.

## 11. Pengujian penerimaan

Gunakan data latihan dan catat hasil aktual.

| Kasus | Hasil yang diharapkan |
|---|---|
| Tamu membuka `?route=siswa` atau `?route=nilai&action=create` | Redirect 303 ke login dengan pesan "Silakan login terlebih dahulu" |
| Register dengan data valid | Baris baru di `users`; kolom `password` berisi hash `$2y$…`; redirect ke login |
| Register dengan username/email yang sudah ada | HTTP 409 "Username atau email sudah terdaftar"; tidak ada baris ganda |
| Register dengan username `ab`, `budi santoso`, atau email salah format | HTTP 422 dengan pesan validasi |
| Register dengan password < 8 karakter atau konfirmasi berbeda | HTTP 422 dengan pesan validasi |
| Login dengan username dan password benar | Redirect ke daftar siswa; nama pengguna dan tombol Keluar tampil |
| Login dengan password salah / username tidak terdaftar | HTTP 401 dengan pesan yang **sama**: "Username atau password salah" |
| Pengguna login membuka halaman login atau register | Diarahkan ke daftar siswa |
| Forgot dengan email dan password lama benar | `password` dan `updated_at` berubah; redirect ke login; password lama tidak bisa dipakai lagi |
| Forgot dengan email tidak terdaftar atau password lama salah | HTTP 422 "Email atau password lama salah"; data tidak berubah |
| Forgot dengan password baru sama dengan password lama | HTTP 422 dengan pesan validasi |
| GET ke `?route=auth&action=logout` | HTTP 405; tetap login |
| Klik tombol Keluar | Redirect ke login; menu data sekolah tidak dapat dibuka lagi |
| POST login/register/forgot dengan token CSRF kosong/salah | HTTP 403 |
| `?route=auth&action=hapus` | HTTP 405 |
| Username berisi `<script>` saat register | Ditolak validator (HTTP 422) |
| Database berhenti saat login | HTTP 500 dengan pesan umum; detail hanya di log |

## 12. Catatan keamanan dan batas modul

Modul ini sudah menerapkan dasar penting: password di-hash, query memakai prepared statement, form memakai CSRF, output di-escape, ID session diganti saat login, dan logout memakai POST. Namun, autentikasi ini **sengaja disederhanakan** untuk pembelajaran. Sebelum dipakai di server publik, pertimbangkan:

- **Forgot password sungguhan** memakai tautan reset bertoken sekali pakai yang dikirim ke email, karena pengguna yang lupa password tidak mengetahui password lamanya.
- **Pembatasan percobaan login yang tidak bergantung pada session.** Praktikum 14.4 menyimpan penghitung di session sehingga dapat dihindari dengan menghapus cookie. Server publik sebaiknya menyimpan penghitung per username/IP di database atau memakai pembatasan di web server.
- **HTTPS** dan pengaturan `session.cookie_secure=1`, agar cookie session tidak terkirim melalui koneksi tanpa enkripsi.
- **Batas waktu session** (logout otomatis setelah tidak aktif).
- **Hak akses (role)** jika tidak semua pengguna boleh mengubah atau menghapus data.

> Jangan membagikan screenshot isi tabel `users` ke grup terbuka. Walaupun berupa hash, email dan username tetap data pribadi.

## 13. Troubleshooting

| Gejala | Pemeriksaan |
|---|---|
| `Class "App\Controllers\AuthController" not found` | Nama file, namespace, dan huruf besar/kecil path sesuai PSR-4 |
| `Table 'db_sekolah.users' doesn't exist` | SQL bagian 3 sudah dijalankan di database yang sama dengan `.env` |
| Login selalu gagal walaupun password benar | Kolom `password` berisi hash `$2y$…` (bukan teks biasa) dan panjang kolom `VARCHAR(255)` |
| Register selalu 409 | Username/email sudah ada; periksa dengan `SELECT username, email FROM users` |
| Setelah login kembali ke halaman login | `session_start()` berjalan sebelum output; cookie browser tidak diblokir; path aplikasi sama |
| Token formulir tidak valid (403) | Session aktif, hidden input `csrf_token` ada pada form, dan halaman tidak dibuka terlalu lama setelah session dihapus |
| `headers already sent` | Tidak ada spasi/HTML sebelum `<?php` di file yang dimuat sebelum redirect |
| Menu data sekolah tidak tampil setelah login | Layout membaca `$_SESSION['user']` dan login benar-benar mengisi key tersebut |
| `updated_at` tidak berubah setelah forgot | Definisi kolom memakai `ON UPDATE CURRENT_TIMESTAMP` dan password baru benar-benar berbeda |

## 14. Praktikum langsung

Bagian ini langsung menambahkan empat fitur ke kode bagian 4–9. Kerjakan berurutan, lalu uji dengan tabel di bagian 14.5. Semua fitur tetap memakai tabel `users` yang sama; tidak ada tabel atau package baru.

| No. | Fitur | File yang diubah |
|---|---|---|
| 14.1 | Halaman profil pengguna login | `AuthController.php`, `auth/profile.php` (baru), `layouts/main.php` |
| 14.2 | Perbarui hash password otomatis saat login | `AuthController.php` |
| 14.3 | Kembali ke halaman yang diminta setelah login | `public/index.php`, `AuthController.php` |
| 14.4 | Batasi percobaan login gagal | `AuthController.php` |

### 14.1 Halaman profil

**Langkah 1.** Tambahkan aksi `profile` di `dispatch()`, tepat sebelum blok `logout`:

```php
            if ($action === 'profile' && $method === 'GET') {
                $this->authOnly();
                $this->profile();
                return;
            }
```

**Langkah 2.** Tambahkan dua method berikut di `AuthController`, di bawah method `guestOnly()`:

```php
    private function authOnly(): void
    {
        if (!isset($_SESSION['user'])) {
            $_SESSION['flash'] = 'Silakan login terlebih dahulu.';
            Http::redirect(self::LOGIN_URL);
        }
    }

    private function profile(): void
    {
        $statement = $this->model->connection()->prepare(
            'SELECT username, email, created_at FROM users WHERE id_user = ? LIMIT 1'
        );
        $statement->execute([$_SESSION['user']['id_user']]);
        $profile = $statement->fetch();

        if ($profile === false) {
            unset($_SESSION['user']);
            session_regenerate_id(true);
            $_SESSION['flash'] = 'Akun tidak ditemukan. Silakan login kembali.';
            Http::redirect(self::LOGIN_URL);
        }

        $this->render('profile', 'Profil', '', [], $profile);
    }
```

**Langkah 3.** Tambahkan parameter `$data` pada `render()` agar view dapat menerima hasil query:

```php
    private function render(
        string $view,
        string $pageTitle,
        string $error = '',
        array $old = [],
        array $data = [],
    ): void {
        $flash = $_SESSION['flash'] ?? '';
        unset($_SESSION['flash']);

        ob_start();
        require dirname(__DIR__) . '/Views/auth/' . $view . '.php';
        $content = (string) ob_get_clean();
        require dirname(__DIR__) . '/Views/layouts/main.php';
    }
```

**Langkah 4.** Buat view `app/Views/auth/profile.php`:

```php
<?php
use App\Support\Http;
?>
<h1>Profil</h1>
<?php if ($flash !== ''): ?>
    <p class="message" role="status"><?= Http::e($flash) ?></p>
<?php endif; ?>
<table>
    <tr><th>Username</th><td><?= Http::e($data['username']) ?></td></tr>
    <tr><th>Email</th><td><?= Http::e($data['email']) ?></td></tr>
    <tr><th>Terdaftar sejak</th><td><?= Http::e($data['created_at']) ?></td></tr>
</table>
<p><a href="/crud_siswa/public/?route=auth&amp;action=forgot">Ganti password</a></p>
```

**Langkah 5.** Di `layouts/main.php`, ubah teks "Masuk sebagai" menjadi link ke profil:

```php
            Masuk sebagai
            <a href="/crud_siswa/public/?route=auth&amp;action=profile">
                <strong><?= Http::e($currentUser['username']) ?></strong>
            </a>
```

Penjelasan halaman profil:

- Route `auth` dilewatkan dari pemeriksaan login di `index.php`, sehingga aksi `profile` perlu `authOnly()` sendiri.
- Query hanya memakai `id_user` dari session, **bukan** dari URL. Pengguna tidak dapat melihat profil orang lain dengan mengganti parameter.
- Kolom `password` tidak dipilih karena tidak dibutuhkan view.
- Jika akun sudah dihapus dari database saat pengguna masih login, session dibersihkan dan pengguna diarahkan ke login.

### 14.2 Perbarui hash password saat login

`password_hash()` dengan `PASSWORD_DEFAULT` dapat berubah algoritma atau *cost*-nya pada versi PHP berikutnya. `password_needs_rehash()` memeriksa apakah hash lama masih sesuai pengaturan saat ini. Pemeriksaan dilakukan **setelah** `password_verify()` berhasil, karena hanya saat itu password asli tersedia untuk dibuat hash baru.

```php
        if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
            $rehash = $pdo->prepare('UPDATE users SET password = ? WHERE id_user = ?');
            $rehash->execute([
                password_hash($data['password'], PASSWORD_DEFAULT),
                $user['id_user'],
            ]);
        }
```

Letak kode ini ditunjukkan pada kode lengkap `login()` di bagian 14.4. Karena baris diubah, kolom `updated_at` ikut terisi.

### 14.3 Kembali ke halaman yang diminta

**Langkah 1.** Di `public/index.php`, simpan URL yang diminta tamu sebelum diarahkan ke login. Ganti blok pemeriksaan login bagian 9 dengan:

```php
// Modul 7: semua route selain auth wajib login.
if ($route !== 'auth' && !isset($_SESSION['user'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $_SESSION['intended_url'] = $_SERVER['REQUEST_URI'];
    }
    $_SESSION['flash'] = 'Silakan login terlebih dahulu.';
    Http::redirect('/crud_siswa/public/?route=auth&action=login');
}
```

**Langkah 2.** Tambahkan method berikut di `AuthController`:

```php
    private function intendedUrl(): string
    {
        $url = $_SESSION['intended_url'] ?? '';
        unset($_SESSION['intended_url']);

        if (!is_string($url)
            || !str_starts_with($url, '/crud_siswa/public/')
            || str_contains($url, '\\')
        ) {
            return self::HOME_URL;
        }
        return $url;
    }
```

Penjelasan pengalihan setelah login:

- Hanya request **GET** yang disimpan. POST dari form tidak boleh diulang otomatis setelah login.
- `REQUEST_URI` berisi path dan query string, misalnya `/crud_siswa/public/?route=nilai&action=create`.
- `intendedUrl()` hanya menerima URL yang diawali `/crud_siswa/public/`. URL seperti `https://situs-lain.test` atau `//situs-lain.test` ditolak sehingga tidak terjadi *open redirect*. Backslash juga ditolak karena sebagian browser menganggapnya sama dengan `/`.
- Nilai dihapus dari session setelah dibaca, sehingga hanya berlaku untuk satu kali login.
- `session_regenerate_id(true)` tetap mempertahankan isi `$_SESSION`, jadi `intended_url` masih tersedia setelah ID session diganti.

### 14.4 Batasi percobaan login gagal

Setelah **5 kali** login gagal dalam satu session, percobaan berikutnya ditolak selama **60 detik** dengan HTTP 429.

**Langkah 1.** Tambahkan konstanta di bawah `LOGIN_URL`:

```php
    private const MAX_LOGIN_ATTEMPTS = 5;
    private const LOCK_SECONDS = 60;
```

**Langkah 2.** Tambahkan method pencatat kegagalan:

```php
    private function recordFailedLogin(): void
    {
        $failures = (int) ($_SESSION['login_failures'] ?? 0) + 1;
        if ($failures >= self::MAX_LOGIN_ATTEMPTS) {
            $_SESSION['login_locked_until'] = time() + self::LOCK_SECONDS;
            $failures = 0;
        }
        $_SESSION['login_failures'] = $failures;
    }
```

**Langkah 3.** Ganti seluruh method `login()` bagian 6 dengan kode lengkap berikut. Kode ini menggabungkan bagian 14.2, 14.3, dan 14.4:

```php
    private function login(): void
    {
        Csrf::verify($_POST['csrf_token'] ?? null);

        $wait = (int) ($_SESSION['login_locked_until'] ?? 0) - time();
        if ($wait > 0) {
            http_response_code(429);
            header('Retry-After: ' . $wait);
            $this->render(
                'login',
                'Login',
                'Terlalu banyak percobaan gagal. Coba lagi dalam ' . $wait . ' detik.',
                $_POST
            );
            return;
        }

        try {
            $data = $this->validator->validate('login', $_POST);
        } catch (InvalidArgumentException $exception) {
            http_response_code(422);
            $this->render('login', 'Login', $exception->getMessage(), $_POST);
            return;
        }

        $pdo = $this->model->connection();
        $statement = $pdo->prepare(
            'SELECT id_user, username, password FROM users WHERE username = ? LIMIT 1'
        );
        $statement->execute([$data['username']]);
        $user = $statement->fetch();

        if ($user === false || !password_verify($data['password'], $user['password'])) {
            $this->recordFailedLogin();
            http_response_code(401);
            $this->render('login', 'Login', 'Username atau password salah.', $_POST);
            return;
        }

        if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
            $rehash = $pdo->prepare('UPDATE users SET password = ? WHERE id_user = ?');
            $rehash->execute([
                password_hash($data['password'], PASSWORD_DEFAULT),
                $user['id_user'],
            ]);
        }

        unset($_SESSION['login_failures'], $_SESSION['login_locked_until']);
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id_user' => (int) $user['id_user'],
            'username' => $user['username'],
        ];
        $_SESSION['flash'] = 'Selamat datang, ' . $user['username'] . '.';
        Http::redirect($this->intendedUrl());
    }
```

Penjelasan pembatasan login:

- Pemeriksaan kunci dilakukan **sebelum** query, sehingga selama masa tunggu database tidak disentuh.
- Yang dihitung hanya kegagalan username/password (401). Input kosong (422) tidak dihitung.
- Header `Retry-After` memberi tahu klien berapa detik harus menunggu.
- Setelah login berhasil, penghitung dan kunci dihapus.
- **Batasan:** penghitung disimpan di session, sehingga penyerang dapat menghindarinya dengan menghapus cookie. Untuk server publik, simpan penghitung di database atau gunakan pembatasan di web server (lihat bagian 12).

**Langkah 4.** Periksa sintaks setelah semua perubahan:

```powershell
cd C:\xampp\htdocs\crud_siswa
php -l app\Controllers\AuthController.php
php -l app\Views\auth\profile.php
php -l app\Views\layouts\main.php
php -l public\index.php
```

### 14.5 Pengujian praktikum

Untuk menguji 14.2, buat hash dengan *cost* rendah lalu pasang ke akun latihan:

```powershell
php -r "echo password_hash('rahasia123', PASSWORD_BCRYPT, ['cost' => 4]), PHP_EOL;"
```

```sql
UPDATE users SET password = '<hash dari perintah di atas>' WHERE username = 'operator_tu';
SELECT LEFT(password, 7) AS awal_hash FROM users WHERE username = 'operator_tu';
```

| Kasus | Hasil yang diharapkan |
|---|---|
| Pengguna login membuka `?route=auth&action=profile` | Username, email, dan tanggal daftar tampil; password tidak tampil |
| Tamu membuka `?route=auth&action=profile` | Redirect 303 ke login |
| Klik nama pengguna di menu | Halaman profil terbuka |
| Login dengan akun ber-hash `$2y$04$` (cost 4) | Login berhasil; `awal_hash` berubah menjadi `$2y$10$` atau `$2y$12$` sesuai default PHP; `updated_at` terisi |
| Login kedua dengan akun yang sama | Tidak ada update hash; `updated_at` tidak berubah |
| Tamu membuka `?route=nilai&action=create`, lalu login | Setelah login langsung kembali ke form tambah nilai |
| Tamu membuka halaman login langsung, lalu login | Diarahkan ke daftar siswa (`HOME_URL`) |
| Isi `$_SESSION['intended_url']` dengan `https://situs-lain.test` (uji sementara di kode) | Diarahkan ke daftar siswa, bukan ke situs lain |
| Login gagal 5 kali berturut-turut | Percobaan 1–5 mendapat 401 |
| Percobaan ke-6 dalam 60 detik, walaupun password benar | HTTP 429 "Terlalu banyak percobaan gagal"; ada header `Retry-After` |
| Login benar setelah 60 detik | Berhasil; penghitung kegagalan direset |

## 15. Rubrik penilaian

| Aspek | Bobot | Kriteria |
|---|---|---|
| Tabel `users` | 10% | Enam kolom sesuai spesifikasi; username dan email unik |
| Model dan validator | 15% | Model hanya metadata; aturan `register`, `login`, `forgot` sesuai dan tidak mengakses database |
| Register | 15% | Insert berhasil, password tersimpan sebagai hash, duplikat ditangani 409 |
| Login dan logout | 20% | `password_verify`, pesan gagal seragam, `session_regenerate_id`, logout POST + CSRF |
| Forgot password | 15% | Verifikasi email + password lama, konfirmasi, update hash dan `updated_at` |
| Proteksi route | 15% | Semua route data sekolah wajib login; route tidak dikenal 404; aksi salah 405 |
| Pengujian dan dokumentasi | 10% | Tabel pengujian bagian 11 dan 14.5 diisi dengan hasil aktual |

## 16. Referensi

- [PHP `password_hash()`](https://www.php.net/manual/en/function.password-hash.php)
- [PHP `password_verify()`](https://www.php.net/manual/en/function.password-verify.php)
- [PHP `password_needs_rehash()`](https://www.php.net/manual/en/function.password-needs-rehash.php)
- [PHP `session_regenerate_id()`](https://www.php.net/manual/en/function.session-regenerate-id.php)
- [PHP session security](https://www.php.net/manual/en/session.security.php)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [MySQL `CREATE TABLE`](https://dev.mysql.com/doc/refman/8.4/en/create-table.html)
