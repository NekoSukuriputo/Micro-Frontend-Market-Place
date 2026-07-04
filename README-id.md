# Micro Frontend E-Commerce Marketplace

[![EN](https://img.shields.io/badge/Language-English-blue)](README.md)

Proyek ini adalah implementasi tingkat lanjut dari arsitektur **Micro Frontend (MFE)** untuk aplikasi E-Commerce. Proyek ini mendemonstrasikan integrasi yang mulus dari empat framework frontend yang sangat populer (**React, Vue, Svelte, dan Angular**) ke dalam satu antarmuka pengguna yang terpadu.

Komunikasi antar-aplikasi dan sinkronisasi *state* di berbagai framework yang berbeda ini ditangani melalui *shared store* **Vanilla JS Pub/Sub** kustom, yang sepenuhnya independen dari framework mana pun. Seluruh ekosistem di-styling menggunakan rilis terbaru **Tailwind CSS v4**.

---

## 🛠️ Teknologi yang Digunakan

### Frontend & Build
*   **Core Frameworks**: React 18, Vue 3, Svelte 4, dan Angular 17.
*   **Build Engines**: 
    *   **Rspack**: Digunakan untuk React, Vue, Svelte, dan Vanilla JS untuk kompilasi berbasis Rust yang super cepat.
    *   **Webpack**: Digunakan untuk Angular (via `@angular-architects/module-federation`) karena kebutuhan kompatibilitas ketat ekosistem Angular.
*   **Micro Frontend Integration**: **Module Federation** (kompatibel lintas Webpack dan Rspack) memungkinkan pemuatan dinamis aplikasi *remote* saat *runtime*.
*   **Styling**: **Tailwind CSS v4**, menggunakan sintaks modern `@tailwindcss/postcss` dan native CSS `@import "tailwindcss";`.
*   **State Management**: Vanilla JavaScript yang framework-agnostic (Pola Publisher/Subscriber).

### Infrastruktur & DevOps
*   **Containerization**: **Docker** menggunakan *multi-stage builds* (Node.js untuk kompilasi, Nginx untuk menyajikan aset statis).
*   **Web Server**: **Nginx** (Alpine) yang dikonfigurasi dengan routing SPA dan *header* `Cache-Control` yang ketat untuk titik masuk (entry points) MFE.
*   **Continuous Integration (CI)**: Pipeline **Jenkins** untuk melakukan proses *build*, *containerize*, dan *push image* secara otomatis ke Docker Registry privat.
*   **Continuous Deployment (CD)**: **ArgoCD** yang beroperasi berdasarkan prinsip-prinsip GitOps.
*   **Orchestration**: **Kubernetes** untuk penskalaan dan manajemen pod Nginx.
*   **CDN & Edge Cache**: Diproksi melalui **Cloudflare**.

---

## 🏗️ Rincian Arsitektur

Aplikasi dipecah menjadi 6 repositori/folder terpisah yang *decoupled*, berkomunikasi secara dinamis melalui jaringan:

1. **`host` (React - Port 3000)**
   *   Bertindak sebagai "App Shell" atau Container.
   *   Menyediakan Navigation Bar utama (React) dan menangani routing tingkat atas (`react-router-dom`).
   *   Memanfaatkan komponen *wrapper* generik `<MicroFrontend />` untuk melakukan *mount* aplikasi non-React (Vue, Svelte, Angular) dengan aman ke dalam DOM.

2. **`shared-store` (Vanilla JS - Port 3001)**
   *   Manajer *state* global yang tidak memiliki dependensi framework.
   *   Menyimpan *state* untuk `cartItems` dan `user`.
   *   Diekspos sebagai *remote module* sehingga Vue dapat menambahkan produk, dan React Navbar dapat langsung merespons perubahan.

3. **`remote-product` (React - Port 3002)**
   *   Merender halaman **Product List**.
   *   Mengekspor komponen React secara langsung (`App.tsx`).

4. **`remote-detail-cart` (Vue 3 - Port 3003)**
   *   Merender halaman **Shopping Cart**.
   *   Mengimpor fungsi `addToCart` dan `removeFromCart` dari `shared-store`.
   *   Mengekspor fungsi `mount()` generik yang dipanggil oleh React Host.

5. **`remote-checkout` (Svelte - Port 3004)**
   *   Merender halaman **Checkout**.
   *   Mengekspor fungsi `mount()` generik untuk mengkompilasi dan menempelkan aplikasi Svelte ke dalam HTML `div` yang disediakan oleh Host.

6. **`remote-user` (Angular 17 - Port 3005)**
   *   Merender halaman **User Profile & Login**.
   *   Mengekspor fungsi `mount()` menggunakan API `bootstrapApplication` dari Angular agar dapat dirender secara independen di dalam Host.

---

## 🔄 Alur Komunikasi Antar-Framework

Meskipun menggunakan empat mesin reaktivitas yang sama sekali berbeda, *state* tetap tersinkronisasi sempurna secara *real-time* di seluruh micro frontend. Hal ini dicapai melalui pola Vanilla JS Pub/Sub:

1. **Inisialisasi**: Navbar milik Host (React) memanggil `cartStore.subscribe(callback)` pada saat *mounting*.
2. **Aksi**: Ketika pengguna membuka **Product List (React)** dan mengklik "Add to Cart", aplikasi mengeksekusi `addToCart(product)` yang diimpor dari `shared-store`.
3. **Mutasi State**: `shared-store` memperbarui *array state* internalnya dan melakukan iterasi ke seluruh daftar *subscriber*, mengeksekusi *callback* mereka dengan *state* yang baru.
4. **Reaktivitas**: *Callback* milik React Navbar memicu `setState()`, secara instan memperbarui ikon penghitung keranjang.
5. **Hidrasi Lintas-Batas**: Ketika pengguna berpindah ke **Cart Page (Vue)**, Vue memanggil `cartStore.getState()` untuk merender daftar awal, dan juga melakukan *subscribe* untuk mendengarkan perubahan *real-time* selanjutnya.

---

## 🚀 Production Deployment

Karena setiap Micro Frontend memiliki `Dockerfile`-nya sendiri yang menggunakan *multi-stage build* teroptimasi (Node.js untuk kompilasi -> Nginx untuk *serving* statis), *deployment* untuk seluruh ekosistem ini sangatlah fleksibel.

### Opsi 1: Docker Compose (Direkomendasikan)
Anda dapat dengan mudah mengatur keenam layanan ini dengan membuat file `docker-compose.yml` di direktori utama (root) proyek:

```yaml
services:
  host:
    build: ./host
    ports: ["3000:80"]
  shared-store:
    build: ./shared-store
    ports: ["3001:80"]
  remote-product:
    build: ./remote-product
    ports: ["3002:80"]
  remote-detail-cart:
    build: ./remote-detail-cart
    ports: ["3003:80"]
  remote-checkout:
    build: ./remote-checkout
    ports: ["3004:80"]
  remote-user:
    build: ./remote-user
    ports: ["3005:80"]
```

Jalankan perintah berikut untuk membangun (*build*) dan men-deploy seluruh marketplace:
```bash
docker compose up -d --build
```

### Opsi 2: Docker Terpisah (Standalone)
Secara alternatif, Anda dapat melakukan *build* dan menjalankan setiap layanan secara independen:
```bash
# Build dan jalankan Host
cd host
docker build -t microfe-host .
docker run -p 3000:80 -d microfe-host

# Ulangi langkah di atas untuk shared-store dan remote lainnya pada port masing-masing (3001 hingga 3005)
```

*Catatan: Untuk lingkungan produksi terdistribusi penuh, container-container ini dapat dengan mulus di-deploy ke Kubernetes atau layanan cloud container modern lainnya.*

---

## 💻 Local Development

Karena setiap Micro Frontend berjalan secara independen, Anda harus menjalankan server pengembangan untuk semua repositori:

1. Buka tab terminal terpisah untuk setiap direktori (`host`, `shared-store`, `remote-product`, `remote-detail-cart`, `remote-checkout`, `remote-user`).
2. Jalankan perintah start di setiap direktori:
   ```bash
   npm run start
   ```
3. Buka browser Anda dan navigasikan ke Host: **`http://localhost:3000`**
