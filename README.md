# Dusun Maliyan – Portal Informasi Warga (Cloudflare Pages)

Struktur (semua harus ada di **akar** repo, bukan di dalam folder lain):

```
index.html            halaman publik
admin/index.html      halaman login & pengelola admin  → /admin
style.css
app.js
maliyan.webp           foto utama di Beranda
functions/api/[[path]].js   API (login, simpan data, unggah foto/video)
```

## 1. GitHub
1. Buat repo baru (mis. `dusun-maliyan`).
2. Unggah semua berkas di atas dengan struktur yang sama (Add file → Upload files, seret folder).

## 2. Cloudflare Pages
1. Workers & Pages → Create → Pages → **Connect to Git** → pilih repo.
2. Framework preset: **None**. Build command: **kosongkan**. Build output directory: **/** (atau kosongkan).
3. Deploy. Setiap `git push` ke repo akan otomatis men-deploy ulang.

## 3. Penyimpanan data (KV) – wajib
1. Storage & Databases → KV → **Create a namespace** (mis. `dusun-maliyan`).
2. Project Pages → Settings → **Bindings** → Add → **KV namespace** → Variable name **`DATA`** (huruf besar, persis) → pilih namespace tadi.

## 4. Kata sandi admin – wajib
Project Pages → Settings → **Variables and secrets** → Add:
- `ADMIN_PASSWORD` (tipe Secret) = kata sandi admin Anda (pakai yang panjang).
- (opsional) `SESSION_SECRET` = teks acak panjang.

Setelah langkah 3–4, lakukan **deploy ulang** (Deployments → ⋯ → Retry deployment, atau push commit baru). Binding dan variabel baru hanya terbaca setelah deploy ulang.

## Cara pakai
- Warga membuka `https://NAMA-PROYEK.pages.dev` (hanya melihat).
- Admin membuka `https://NAMA-PROYEK.pages.dev/admin`, masuk dengan kata sandi, lalu bisa mencatat/ubah laporan serta unggah/hapus foto dan video. Perubahan tersimpan otomatis ke KV.
- Data lama bisa dimasukkan lewat Admin → Cadangan → Impor JSON.

## Batas paket gratis (KV)
100.000 baca/hari, 1.000 tulis/hari, 1 GB. Satu unggahan = 2 tulis. Maks 20 MB per berkas. Perubahan bisa butuh hingga ±1 menit untuk tampil di perangkat lain.

## Bila bermasalah
- "Binding KV bernama DATA belum dipasang" → ulangi langkah 3 lalu deploy ulang.
- "ADMIN_PASSWORD belum diatur" → ulangi langkah 4 lalu deploy ulang.
- 404 di halaman utama → pastikan `index.html` ada di akar repo dan Build output directory `/`.
