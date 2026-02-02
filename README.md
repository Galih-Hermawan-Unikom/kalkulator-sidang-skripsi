# Kalkulator Nilai Sidang Skripsi (Versi HTML Statis)

Laman Web: [https://galih-hermawan-unikom.github.io/kalkulator-sidang-skripsi/](https://galih-hermawan-unikom.github.io/kalkulator-sidang-skripsi/)

Versi web ringan yang mereplikasi rumus dari template Excel `perhitungan nilai sidang-2025-08-13.xlsx`.

## Cara Pakai

- Buka file `index.html` langsung di browser (double-click). Tidak perlu server.
- Masukkan nilai 0–100 di semua kolom input. Hasil dihitung otomatis.
- Klik tombol **Tampilkan Preview** untuk melihat ringkasan yang meniru format Excel.
- Klik tombol **Simulasikan Nilai C** untuk mengisi contoh data (Ketua 70, Penguji 1 75, Penguji 2 70, Bimbingan 75, Seminar 60) yang menghasilkan nilai akhir sekitar 69.35 (Grade C).
- Bobot yang digunakan:
  - Ketua/Penguji 1: 20% Presentasi, 30% Penguasaan, 15% Penulisan, 35% Hasil Akhir
  - Penguji 2: 30% Cara, 30% Kecepatan, 40% Ketepatan
  - Komposisi Total Sidang: 42.5% Ketua, 42.5% Penguji 1, 15% Penguji 2
  - Nilai Akhir: 30% Seminar, 40% Sidang, 30% Bimbingan
- Grade: A (>=80), B (>=70), C (>=60), E (lainnya)

## Catatan

- Nilai Seminar diisi manual seperti pada Excel (sel H20 pada template).
- Tidak ada dependensi eksternal; semua murni HTML/CSS/JS.
