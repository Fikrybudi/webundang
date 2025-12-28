# 🎉 Undangan Khitanan Digital

Template undangan khitanan digital dengan desain mewah, elegan, dan bertema Islami. Dilengkapi dengan admin panel dan backend Node.js untuk pengelolaan data.

![Preview](https://img.shields.io/badge/Status-Ready-green) ![Version](https://img.shields.io/badge/Version-2.0.0-blue) ![Backend](https://img.shields.io/badge/Backend-Node.js-339933)

## ✨ Fitur Utama

### 📱 Halaman Undangan
- **Cover Page** - Tampilan pembuka dengan animasi geometris Islami
- **Hero Section** - Foto anak dengan countdown timer
- **Quote Section** - Ayat Al-Quran dengan terjemahan
- **Profil Anak** - Informasi lengkap anak dan orang tua
- **Detail Acara** - Info prosesi khitan dan syukuran dengan link Google Maps
- **Galeri Foto** - Grid foto dengan modal preview
- **RSVP Form** - Form konfirmasi kehadiran
- **Ucapan & Doa** - Kumpulan ucapan dari tamu
- **Amplop Digital** - Informasi rekening bank
- **Music Player** - Musik latar otomatis

### 🎨 Dekorasi Islami
- Animasi bintang-bintang Islami mengambang
- Lentera (lantern) yang berayun
- Ornamen geometris (Rub el Hizb)
- Bulan sabit dengan bintang
- Border dan divider arabesque
- Bismillah dalam huruf Arab

### ⚙️ Admin Panel
- Dashboard dengan statistik real-time
- Kelola data acara
- Upload foto profil dan galeri
- Manajemen daftar tamu
- Generate link personal
- Lihat RSVP dan ucapan
- Pengaturan musik
- Export data

### 🚀 Backend Node.js (NEW!)
- **Data Persistent** - Data tersimpan di server, tidak hilang
- **Sync antar Device** - Akses dari mana saja
- **REST API** - Endpoints untuk config, guests, wishes, gallery
- **JSON Database** - Simpan data di `data/database.json`

## 📁 Struktur Folder

```
WEBUNDANG/
├── index.html          # Halaman undangan utama
├── admin.html          # Admin panel
├── server.js           # Backend Node.js Express
├── package.json        # Dependencies
├── README.md           # Dokumentasi
├── USERGUIDE.md        # Panduan pengguna
├── css/
│   ├── style.css       # Styling undangan
│   └── admin.css       # Styling admin panel
├── js/
│   ├── api.js          # Centralized API module
│   ├── main.js         # Logic undangan
│   ├── rsvp.js         # Handle RSVP
│   └── admin.js        # Logic admin panel
├── data/
│   ├── config.json     # Konfigurasi default (static)
│   └── database.json   # Database JSON (dynamic)
└── assets/
    ├── images/         # Folder foto
    └── audio/          # Folder musik
```

## 🚀 Cara Menjalankan

### Development (Lokal)

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server
npm start

# 3. Buka browser
# Undangan: http://localhost:3000
# Admin: http://localhost:3000/admin.html
```

### Production (Deploy ke Hosting)

#### Untuk Hosting dengan Node.js Support (VPS, Vercel, Railway, dll)
1. Upload semua file ke server
2. Jalankan `npm install`
3. Jalankan `npm start` atau gunakan PM2: `pm2 start server.js`

#### Untuk Shared Hosting (tanpa Node.js)
1. Upload semua file ke `public_html`
2. Data akan tersimpan di localStorage browser (mode fallback)
3. Untuk data permanen, gunakan tombol "Download config.json" di admin

## 🔐 Login Admin

- **URL**: `/admin.html`
- **Password Default**: `admin123`

> ⚠️ **Penting**: Ganti password default setelah login pertama!

## 📡 API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/config` | Ambil konfigurasi |
| POST | `/api/config` | Simpan konfigurasi |
| GET | `/api/guests` | Ambil daftar tamu |
| POST | `/api/guests` | Tambah tamu |
| DELETE | `/api/guests/:id` | Hapus tamu |
| GET | `/api/wishes` | Ambil ucapan |
| POST | `/api/wishes` | Tambah ucapan |
| DELETE | `/api/wishes/:id` | Hapus ucapan |
| GET | `/api/gallery` | Ambil galeri |
| POST | `/api/gallery` | Tambah foto |
| DELETE | `/api/gallery/:id` | Hapus foto |

## 📖 Dokumentasi Lengkap

Lihat [USERGUIDE.md](USERGUIDE.md) untuk panduan lengkap penggunaan.

## 💡 Tips

1. **Foto Anak**: Gunakan foto dengan rasio 1:1 (persegi) untuk hasil terbaik
2. **Musik**: Upload file MP3 atau gunakan URL langsung
3. **Link Tamu**: Buat link personal untuk setiap tamu
4. **Backup**: Export data secara berkala dari admin panel

## 🛠️ Teknologi

- HTML5, CSS3, JavaScript (ES6+)
- Node.js + Express (Backend)
- JSON File Database
- No external database required

## 📱 Responsive

Template ini sudah responsive dan optimal untuk:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🎨 Tema Warna

| Warna | Kode | Kegunaan |
|-------|------|----------|
| Navy Blue | `#1e3a5f` | Primary |
| Gold | `#d4af37` | Secondary/Accent |
| Cream | `#faf8f5` | Background |

## 📝 Lisensi

Template ini bebas digunakan untuk keperluan pribadi.

---

Made with ❤️ & ☪️
