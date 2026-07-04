# Micro Frontend Marketplace

Proyek ini adalah implementasi **Micro Frontend (MFE)** untuk aplikasi E-Commerce sederhana yang menggabungkan 4 framework populer: React, Vue, Svelte, dan Angular. Komunikasi antar-MFE dilakukan melalui *shared state* (Vanilla JS), dan semuanya di-styling menggunakan **Tailwind CSS v4**.

## Arsitektur

Aplikasi dipecah menjadi 6 repositori/folder terpisah yang saling berkomunikasi menggunakan **Webpack Module Federation** (menggunakan Rspack & Webpack):

1. **`host` (React - Port 3000)**
   - Bertindak sebagai "Container" atau Shell untuk memuat aplikasi lain.
   - Menyediakan **Navbar (React)** dan routing utama (`react-router-dom`).
   - Menyediakan komponen generic `MicroFrontend` untuk *mount* aplikasi dari framework non-React (Vue, Svelte, Angular).

2. **`shared-store` (Vanilla JS - Port 3001)**
   - State manager global tanpa dependensi framework.
   - Menggunakan pola Pub/Sub. Memiliki store untuk `cartItems` dan `user`.
   - Di-share melalui Module Federation sehingga aplikasi Vue bisa menambah produk ke keranjang, dan React Navbar bisa langsung mendengarkan perubahannya.

3. **`remote-product` (React - Port 3002)**
   - Menampilkan halaman **List Product**.
   - Mengekspor langsung komponen React (`App.tsx`).

4. **`remote-detail-cart` (Vue 3 - Port 3003)**
   - Menampilkan halaman **Cart** (Keranjang).
   - Mengimpor fungsi `addToCart` dan `removeFromCart` dari `shared-store`.
   - Mengekspor fungsi `mount` generik yang dipanggil oleh Host React.

5. **`remote-checkout` (Svelte - Port 3004)**
   - Menampilkan halaman **Checkout**.
   - Mengekspor fungsi `mount` generik yang merender Svelte App ke dalam div HTML yang disediakan oleh Host.

6. **`remote-user` (Angular 17 - Port 3005)**
   - Menampilkan halaman **User Profile** / Login.
   - Mengekspor fungsi `mount` (menggunakan `bootstrapApplication` Angular API) untuk dirender di Host.

## Cara Menjalankan

Karena setiap Micro Frontend memiliki port sendiri, Anda harus menjalankan server development untuk semua repo.

1. Buka terminal di masing-masing folder (host, shared-store, remote-product, remote-detail-cart, remote-checkout, remote-user).
2. Jalankan perintah berikut di setiap folder:
   ```bash
   npm run start
   ```
3. Buka browser dan arahkan ke Host: **`http://localhost:3000`**

## Cara Komunikasi Antar Micro FE Berkerja

Meskipun menggunakan framework yang berbeda, state tetap sinkron berkat Vanilla JS Pub/Sub di `shared-store`.

1. **Host Navbar (React)** memanggil `cartStore.subscribe()` saat inisialisasi.
2. Ketika user berada di **Product List (React)** dan mengklik "Add to Cart", ia memanggil `addToCart(product)` yang berada di `shared-store`.
3. `shared-store` mengupdate state internalnya dan memberi tahu semua *subscriber* (termasuk Navbar di React dan halaman Cart di Vue).
4. Ketika user berpindah ke **Cart Page (Vue)**, Vue akan memanggil `cartStore.getState()` dan melakukan *subscribe* untuk mendapatkan *real-time updates*.

## Styling dengan Tailwind CSS v4

Setiap aplikasi menggunakan **Tailwind CSS v4** (`tailwindcss` dan `@tailwindcss/postcss`).
Karena Module Federation memuat file CSS dari jarak jauh, gaya disetel di dalam masing-masing Micro Frontend dan digabungkan secara dinamis. Sintaks Tailwind v4 yang modern (seperti `@import "tailwindcss";` di CSS utama) digunakan.

---
*Dibuat menggunakan create-mf-app, Rspack, Webpack, dan Angular Architects Module Federation.*
