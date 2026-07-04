# Micro Frontend E-Commerce Marketplace

[![ID](https://img.shields.io/badge/Language-Indonesian-red)](README-id.md) 

This project is an advanced implementation of a **Micro Frontend (MFE)** architecture for an E-Commerce application. It demonstrates the seamless integration of four highly popular frontend frameworks (**React, Vue, Svelte, and Angular**) within a single unified user interface. 

Inter-application communication and state synchronization across these disparate frameworks are handled via a custom **Vanilla JS Pub/Sub shared store**, completely decoupled from any specific framework. The entire ecosystem is styled using the newly released **Tailwind CSS v4**.

---

## 🛠️ Technologies Used

### Frontend & Build
*   **Core Frameworks**: React 18, Vue 3, Svelte 4, and Angular 17.
*   **Build Engines**: 
    *   **Rspack**: Used for React, Vue, Svelte, and Vanilla JS for blazing-fast Rust-based compilation.
    *   **Webpack**: Used for Angular (via `@angular-architects/module-federation`) due to strict Angular ecosystem compatibility requirements.
*   **Micro Frontend Integration**: **Module Federation** (compatible across both Webpack and Rspack) allows dynamic loading of remote applications at runtime.
*   **Styling**: **Tailwind CSS v4**, utilizing the modern `@tailwindcss/postcss` and native CSS `@import "tailwindcss";` syntax.
*   **State Management**: Framework-agnostic Vanilla JavaScript (Publisher/Subscriber pattern).

### Infrastructure & DevOps
*   **Containerization**: **Docker** utilizing multi-stage builds (Node.js for compilation, Nginx for serving static assets).
*   **Web Server**: **Nginx** (Alpine) configured with SPA routing and strict `Cache-Control` headers for MFE entry points.
*   **Continuous Integration (CI)**: **Jenkins** pipelines to automatically build, containerize, and push images to a private Docker registry.
*   **Continuous Deployment (CD)**: **ArgoCD** operating on GitOps principles.
*   **Orchestration**: **Kubernetes** for scaling and managing the Nginx pods.
*   **CDN & Edge Cache**: Proxied through **Cloudflare**.

---

## 🏗️ Architecture Breakdown

The application is decomposed into 6 decoupled repositories/folders, communicating dynamically over the network:

1. **`host` (React - Port 3000)**
   *   Acts as the "App Shell" or Container.
   *   Provides the main Navigation Bar (React) and handles top-level routing (`react-router-dom`).
   *   Utilizes a generic `<MicroFrontend />` wrapper component to mount non-React applications (Vue, Svelte, Angular) safely into the DOM.

2. **`shared-store` (Vanilla JS - Port 3001)**
   *   The global state manager that contains no framework dependencies.
   *   Holds the state for `cartItems` and `user`.
   *   Exposed as a remote module so Vue can add products, and the React Navbar can instantly react to changes.

3. **`remote-product` (React - Port 3002)**
   *   Renders the **Product List** page.
   *   Directly exports a React component (`App.tsx`).

4. **`remote-detail-cart` (Vue 3 - Port 3003)**
   *   Renders the **Shopping Cart** page.
   *   Imports `addToCart` and `removeFromCart` functions from the `shared-store`.
   *   Exports a generic `mount()` function called by the React Host.

5. **`remote-checkout` (Svelte - Port 3004)**
   *   Renders the **Checkout** page.
   *   Exports a generic `mount()` function to compile and attach the Svelte app into an HTML `div` provided by the Host.

6. **`remote-user` (Angular 17 - Port 3005)**
   *   Renders the **User Profile & Login** page.
   *   Exports a generic `mount()` function utilizing Angular's `bootstrapApplication` API to render independently within the Host.

---

## 🔄 Cross-Framework Communication Flow

Despite utilizing four entirely different reactivity engines, state remains perfectly synchronized in real-time across all micro frontends. This is achieved through the Vanilla JS Pub/Sub pattern:

1. **Initialization**: The Host's Navbar (React) calls `cartStore.subscribe(callback)` upon mounting.
2. **Action**: When a user navigates to the **Product List (React)** and clicks "Add to Cart", it executes `addToCart(product)` imported from `shared-store`.
3. **State Mutation**: `shared-store` updates its internal state array and iterates through its list of subscribers, executing their callbacks with the new state.
4. **Reactivity**: The React Navbar's callback triggers a `setState()`, instantly updating the cart counter icon.
5. **Cross-Boundary Hydration**: When the user navigates to the **Cart Page (Vue)**, Vue invokes `cartStore.getState()` to render the initial list, and also subscribes to listen for any further real-time modifications.

---

## 🚀 Production Deployment

Since each Micro Frontend contains its own `Dockerfile` utilizing an optimized multi-stage build (Node.js for compilation -> Nginx for serving), deploying the entire ecosystem is highly flexible.

### Option 1: Docker Compose (Recommended)
You can easily orchestrate all 6 services by creating a `docker-compose.yml` at the root of the project:

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

Run the following command to build and deploy the entire marketplace:
```bash
docker compose up -d --build
```

### Option 2: Standalone Docker
Alternatively, you can build and run each service independently:
```bash
# Build and run the Host
cd host
docker build -t microfe-host .
docker run -p 3000:80 -d microfe-host

# Repeat for shared-store and remotes on their respective ports (3001 to 3005)
```

*Note: For a fully distributed production environment, these containers can be seamlessly deployed to Kubernetes or any modern cloud container service.*

---

## 💻 Local Development

Since each Micro Frontend runs independently, you must start the development server for all repositories:

1. Open separate terminal tabs for each directory (`host`, `shared-store`, `remote-product`, `remote-detail-cart`, `remote-checkout`, `remote-user`).
2. Run the start command in every directory:
   ```bash
   npm run start
   ```
3. Open your browser and navigate to the Host: **`http://localhost:3000`**
