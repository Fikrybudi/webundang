# 📖 Panduan Pengguna - Undangan Khitanan Digital

Panduan lengkap cara menggunakan template undangan khitanan digital dengan backend Node.js.

---

## 📋 Daftar Isi

1. [Memulai](#-memulai)
2. [Login Admin](#-login-admin)
3. [Mengatur Data Acara](#-mengatur-data-acara)
4. [Upload Foto](#-upload-foto)
5. [Mengelola Tamu](#-mengelola-tamu)
6. [Melihat RSVP](#-melihat-rsvp)
7. [Pengaturan Lainnya](#-pengaturan-lainnya)
8. [Deploy ke Hosting](#-deploy-ke-hosting)

---

## 🚀 Memulai

### Menjalankan dengan Node.js Backend (Recommended)

1. **Install Node.js** jika belum ada (download dari nodejs.org)
2. **Buka terminal** di folder project
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Jalankan server**:
   ```bash
   npm start
   ```
5. **Buka browser**:
   - Undangan: `http://localhost:3000`
   - Admin Panel: `http://localhost:3000/admin.html`

### Menjalankan Tanpa Backend (Static Mode)

Jika tidak ingin menggunakan Node.js:

```bash
# Menggunakan Python
python -m http.server 3000

# Atau menggunakan npx serve
npx serve -p 3000
```

> ⚠️ Mode static akan menyimpan data di localStorage browser saja (tidak persistent).

---

## 🔐 Login Admin

1. Buka `http://localhost:3000/admin.html`
2. Masukkan password: `admin123`
3. Klik **Masuk**

> 💡 Password dapat diubah di menu **Pengaturan**

### Indikator Data Source
- Jika server berjalan: data disimpan di `data/database.json`
- Jika server mati: data fallback ke localStorage

---

## 📝 Mengatur Data Acara

### Menu: Data Acara

#### 1. Data Anak
- **Nama Lengkap**: Nama lengkap anak yang dikhitan
- **Nama Panggilan**: Nama panggilan/keseharian
- **Nama Ayah**: Contoh: "Bapak Ahmad"
- **Nama Ibu**: Contoh: "Ibu Fatimah"

#### 2. Foto Profil Anak (Hero)
Foto ini akan muncul di:
- Cover undangan
- Hero section
- Profil anak

**Cara upload:**
1. Klik area upload
2. Pilih foto dari komputer
3. Atau masukkan URL gambar

> 📌 **Tips**: Gunakan foto persegi (1:1) ukuran minimal 500x500 pixel

#### 3. Ayat/Doa Pembuka
- **Ayat Arab**: Teks Arab (akan ditampilkan dari kanan ke kiri)
- **Terjemahan**: Arti dalam bahasa Indonesia

#### 4. Prosesi Khitan
- **Tanggal**: Pilih tanggal acara
- **Waktu Mulai**: Jam mulai prosesi
- **Waktu Selesai**: Jam selesai
- **Nama Tempat**: Contoh: "Rumah Keluarga"
- **Alamat Lengkap**: Alamat detail
- **Link Google Maps**: URL dari Google Maps

#### 5. Syukuran
Isi dengan format yang sama seperti Prosesi Khitan.

#### 6. Simpan
Klik tombol **Simpan Data Acara** di bagian bawah.
- ✅ Data tersimpan otomatis ke server (jika backend aktif)

---

## 📸 Upload Foto

### Foto Profil vs Galeri

| Jenis | Lokasi | Fungsi |
|-------|--------|--------|
| Foto Profil | Data Acara | Foto utama di hero & profil |
| Galeri | Menu Galeri Foto | Kumpulan foto di section galeri |

### Menu: Galeri Foto

#### Upload Multiple Foto
1. Klik area upload
2. Pilih beberapa foto sekaligus (Ctrl + klik)
3. Foto akan otomatis muncul di grid
4. Data tersimpan otomatis ke server

#### Menggunakan URL
1. Masukkan URL gambar di field
2. Klik **Tambah Gambar**

#### Hapus Foto
- Hover foto yang ingin dihapus
- Klik tombol **×** merah

---

## 👥 Mengelola Tamu

### Menu: Daftar Tamu

#### Menambah Tamu
1. Klik tombol **Tambah Tamu**
2. Masukkan nama tamu (contoh: "Bapak Ahmad")
3. Klik **Simpan**
4. ✅ Tamu tersimpan di database server

#### Generate Link Personal
Setiap tamu akan mendapat link unik:
```
https://domain.com/?name=Bapak%20Ahmad
```

Link ini akan menampilkan nama tamu di cover undangan.

#### Copy Link
1. Klik tombol 📋 di samping link
2. Link otomatis tersalin
3. Bagikan via WhatsApp/Email

#### Hapus Tamu
Klik tombol 🗑️ di kolom Aksi.

### Quick Link Generator (Dashboard)
1. Buka menu **Dashboard**
2. Masukkan nama tamu di field
3. Klik **Generate Link**
4. Copy dan bagikan

---

## ✅ Melihat RSVP

### Menu: RSVP & Ucapan

Halaman ini menampilkan data langsung dari server:
- **Nama** tamu yang mengisi RSVP
- **Kehadiran**: Hadir / Tidak Hadir
- **Jumlah** tamu yang akan datang
- **Ucapan** dan doa
- **Waktu** pengisian

#### Statistik (Dashboard)
- **Total Tamu**: Jumlah tamu di daftar
- **Akan Hadir**: Konfirmasi hadir
- **Tidak Hadir**: Konfirmasi tidak hadir
- **Ucapan Masuk**: Total ucapan

#### Hapus Data
- Klik 🗑️ untuk hapus satu ucapan
- Klik **Hapus Semua** untuk reset

---

## ⚙️ Pengaturan Lainnya

### Menu: Amplop Digital
1. Isi **Nama Bank** (contoh: "Bank BCA")
2. Isi **Nomor Rekening**
3. Isi **Atas Nama**
4. Klik **Simpan Data Amplop**

### Menu: Pengaturan

#### Ubah Password
1. Masukkan password baru
2. Konfirmasi password
3. Klik **Ubah Password**

#### Musik Background
1. Masukkan URL file MP3
2. Centang **Autoplay** jika ingin musik otomatis diputar
3. Klik **Simpan Pengaturan Musik**

> 💡 Untuk upload file musik, taruh di folder `assets/audio/` dan gunakan path relatif

#### Export Data
- **Download config.json**: Untuk deploy ke hosting tanpa Node.js
- **Export Semua Data**: Backup lengkap termasuk tamu & ucapan

---

## 🌐 Deploy ke Hosting

### Opsi 1: VPS / Cloud dengan Node.js (Recommended)

#### A. VPS (DigitalOcean, Vultr, dll)
1. SSH ke server
2. Clone/upload project
3. Install dependencies: `npm install`
4. Jalankan dengan PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "webundang"
   pm2 save
   pm2 startup
   ```

#### B. Platform Cloud (Railway, Render, Vercel)
1. Push ke GitHub
2. Connect repository
3. Deploy otomatis

### Opsi 2: Shared Hosting (tanpa Node.js)

1. **Siapkan data di lokal**
   - Isi semua data via admin panel
   - Klik "Download config.json" di Pengaturan
   
2. **Upload via File Manager**
   - Upload semua file ke `public_html`
   - Upload `config.json` ke folder `data/`
   
3. **Batasan mode static**
   - Data RSVP hanya tersimpan di browser pengunjung
   - Tidak bisa sync antar device

### Setelah Deploy
1. Akses `https://domain.com` - Halaman undangan
2. Akses `https://domain.com/admin.html` - Admin panel

---

## ❓ FAQ

### Data tidak sync antar device?
Pastikan backend Node.js berjalan. Cek di browser console (F12) apakah ada error "API not available".

### Bagaimana cara tahu backend aktif?
Buka `http://localhost:3000/api/config` - jika muncul JSON, backend aktif.

### Gambar tidak muncul?
1. Pastikan file ada di folder `assets/images/`
2. Cek nama file (case-sensitive)
3. Atau gunakan URL gambar online

### Musik tidak autoplay?
Browser modern memblokir autoplay. Musik akan diputar setelah user klik tombol **Buka Undangan**.

### Countdown menunjukkan 0?
Pastikan tanggal acara di menu **Data Acara** diset ke tanggal masa depan.

---

## 📞 Bantuan

Jika menemui kendala:
1. Cek console browser (F12 → Console)
2. Pastikan server berjalan (`npm start`)
3. Clear cache browser (Ctrl + Shift + R)

---

Selamat menggunakan! 🎉
