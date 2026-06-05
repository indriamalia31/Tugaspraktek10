# WeatherFinder — Pertemuan 10 Praktikum

Aplikasi cuaca real-time React Native + Expo yang
mendemonstrasikan useEffect, debounce, dan integrasi API.

## Fitur
- Cari cuaca berdasarkan nama kota
- Debounce 500ms (hemat request)
- 4 kondisi UI: kosong / loading / error / sukses
- Data dari Open-Meteo (gratis, tanpa API key)

## Konsep yang Dipakai
- useState (4 state), useEffect (dependency array)
- Debounce dengan setTimeout + clearTimeout
- AbortController untuk cleanup & anti race-condition
- Conditional rendering dengan operator &&

## Cara Menjalankan
1. npm install
2. npx expo start
3. Scan QR dengan Expo Go

## Link
- Expo Snack: [https://snack.expo.dev/@indriamalia31/6d8e56]

## Screenshot
![Kosong](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Kosong.jpeg)
![Loading](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Loading.jpeg)
![Sukses](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Sukses.jpeg)
![Error](https://github.com/indriamalia31/Tugaspraktek10/blob/main/assets/Error.jpeg)

## Author
[Indri Amalia] - [243303621204] - Universitas Prima Indonesia
