# WeatherFinder — Pertemuan 10 Praktikum

Aplikasi cuaca real-time React Native + Expo yang mendemonstrasikan useEffect, debounce, integrasi API, serta implementasi animasi dan interaksi modern.

## Fitur
- **Level 1 (Core):** Cari cuaca berdasarkan nama kota dengan Debounce 500ms (hemat request).
- **4 Kondisi UI:** Menangani state Kosong (Hint) / Loading / Error / Sukses secara dinamis.
- **Level 2 (Pengembangan):** Indikator Siang/Malam (perubahan tema UI otomatis) dan komponen Riwayat Pencarian (5 kota terakhir).
- **Level 3 (Bonus):** Fitur *Pull-to-Refresh* untuk memperbarui data & Efek *Animasi Fade-in* saat kartu cuaca muncul.
- **Data Source:** Open-Meteo API (gratis, tanpa API key).

## Konsep yang Dipakai
- `useState` untuk manajemen state internal aplikasi.
- `useEffect` dengan dependency array `[searchInput]` untuk fetch data otomatis.
- Debounce menggunakan kombinasi `setTimeout` + `clearTimeout`.
- `AbortController` pada cleanup function untuk mencegah *race condition*.
- `Animated` API untuk menciptakan efek transisi visual yang halus.
- `RefreshControl` & `ScrollView` untuk menangani gestur tarik layar.

## Cara Menjalankan
1. Masuk ke folder project: `cd weather-finder`
2. Install dependencies: `npm install`
3. Jalankan aplikasi: `npx expo start`
4. Scan QR Code yang muncul di terminal menggunakan aplikasi **Expo Go** di HP.

## Link
- Expo Snack: [https://snack.expo.dev/@indriamalia31/6d8e56]

## Screenshot
![Kosong](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Kosong.jpeg)
![Loading](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Loading.jpeg)
![Sukses](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Sukses.jpeg)
![Error](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Error.jpeg)

## Author
[Indri Amalia] - [243303621204] - Universitas Prima Indonesia
