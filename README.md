# ⚡ ByteForge - Premium Hardware Store & Service Booking

ByteForge is a premium, high-performance web application designed for a computer hardware shop. It allows customers to purchase top-tier computer components, book diagnostic and repair services, and design their dream rig using an interactive custom PC builder.

---

## 🛠️ Tech Stack & Structure

*   **Frontend (`frontend/`)**: 
    *   **Next.js 16 (App Router)** & **TypeScript**
    *   **Vanilla CSS Variables** (for futuristic dark-slate aesthetic, neon accents, and smooth hover state animations)
    *   **Cart Context Provider** for instant client-side cart updates, calculations, and local persistence.
*   **Backend (`backend/`)**: 
    *   **Node.js** & **Express**
    *   **In-Memory Database** containing CPUs, GPUs, RAM, Storage, and Power Supplies with specs tags and rates.
    *   **Compatibility engine endpoint** checking socket matching (LGA1700, AM5) and calculating power wattage margins.

---

## 🚀 Getting Started

To run this repository locally:

### 1. Setup & Start the Express Backend
Navigate to the `backend` folder, install requirements, and boot up the server:
```bash
cd backend
npm install
npm run start
```
The backend server runs at **`http://localhost:5000`**.

### 2. Setup & Start the Next.js Frontend
Open a new terminal, navigate to the `frontend` folder, install requirements, and launch the development server:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the application.

*Note: If the backend is running, the frontend fetches products, services, and handles bookings/orders dynamically via endpoints. If the backend is stopped, the frontend falls back gracefully to a fully functional static catalog mode.*

---

## 💻 Key Features Walkthrough

### 🛠️ Interactive Custom PC Builder (`/pc-builder`)
*   Add parts to a build slot (CPU, Motherboard, GPU, RAM, Storage, Power Supply).
*   Monitors **estimated power draw (wattage)**.
*   Computes and displays compatibility warnings dynamically (e.g. socket mismatches or insufficient wattage).
*   Add all selected components to the cart at once.

### 🔬 Workshop Service Booking (`/services`)
*   Select diagnostic evaluations, custom assembly, or hardware upgrades.
*   Form submission books repair/troubleshooting sessions directly onto the backend.

### 🛒 E-Commerce Cart & Shop (`/shop`, `/cart`)
*   Keyword search and category filtering for hardware items.
*   Modify item quantities, calculate taxes/shipping in the shopping cart.
*   Complete orders via a simulated billing checkout form.
