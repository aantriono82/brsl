# Kalkulator Bangun Ruang Sisi Lengkung

Aplikasi web statis berbahasa Indonesia untuk menghitung volume, luas selimut, luas permukaan, jari-jari, tinggi, dan garis pelukis tabung, kerucut, serta bola.

## Menjalankan aplikasi

Tidak ada dependensi atau proses build. Buka `index.html` langsung di browser, atau jalankan server lokal dari folder proyek:

```bash
python3 -m http.server 8000
```

Kemudian buka `http://localhost:8000`.

## Berkas utama

- `index.html` — markup halaman, metadata SEO, form, dan tombol berbagi.
- `style.css` — gaya visual dan layout responsif.
- `script.js` — validasi, perhitungan, langkah penyelesaian, dan fitur berbagi.
- `og-image.svg` / `twitter-image.svg` — gambar pratinjau saat tautan dibagikan.

## Catatan teknis

Semua perhitungan dilakukan di browser menggunakan `Math.PI`. Hasil ditampilkan dengan dua angka desimal. Perhitungan balik kerucut menggunakan bentuk aljabar langsung agar tidak bergantung pada iterasi numerik.
