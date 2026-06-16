# NexShop - Fullstack Premium E-Commerce Application

NexShop is a production-ready, premium MERN (MongoDB, Express, React, Node) stack e-commerce web application. It features a modern user interface, secure role-based access, comprehensive shopping cart/wishlist databases, checkout capabilities, SSLCommerz payment gateway integration, and a premium administrative analytics dashboard.

---

## Technical Stack

*   **Frontend Client:** React, Vite, Tailwind CSS, React Router v6, Axios, Recharts (Graphs), Lucide (Icons)
*   **Backend Server:** Node.js, Express.js, JWT (Authentication), bcryptjs (Hashing), Helmet (Security), Morgan (HTTP Logging)
*   **Database:** MongoDB via Mongoose ODM

---

## Core Features

1.  **Authentication & Security:** Register, login, logout, password hashing with bcrypt, persistent login, and protected routes for general users and administration roles.
2.  **Product Management:** CRUD APIs on the backend, automatic catalog seeding, product search queries, category filters, and price range filters.
3.  **Shopping Cart & Wishlist:** Real-time database sync for cart quantities, wishlist heart triggers, subtotal calculations, VAT tax estimations, and shipping charges.
4.  **Checkout & Payments:** Address details forms, same-address toggles, and full SSLCommerz sandbox payment redirect + callbacks (success, cancel, fail) order state updates.
5.  **Admin Dashboard:** Interactive metrics (Revenue, Users, Orders, Products count), monthly revenue Area chart, category sales share Pie chart, products editing modals, orders delivery selector, and users administration control.

---

## Folder Architecture

```text
E-Commerce/
├── client/                 # Frontend Vite React App
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ProductCard, Toast notifications
│   │   ├── context/        # Auth, Cart, Wishlist, Toast Global states
│   │   ├── pages/          # Catalog, Detail, Auth, Checkout, Success, Admin Dashboard
│   │   └── services/       # Axios API client configurations
│   ├── tailwind.config.js  # Tailwind Styles configuration
│   └── vite.config.js      # Vite project bundler settings
│
├── server/                 # Backend Node/Express API
│   ├── src/
│   │   ├── config/         # MongoDB setup, seed catalogues
│   │   ├── controllers/    # API Request Handlers (Auth, Cart, Orders, Admin)
│   │   ├── middleware/     # Auth token verification, global error catchers
│   │   ├── models/         # Mongoose Schemas (User, Product, Order, Cart, Wishlist)
│   │   └── routes/         # Express endpoint routing
│   └── test-api.js         # Automated backend endpoint test suite
│
├── package.json            # Root configuration for running both apps concurrently
├── DEPLOYMENT.md           # Production cloud hosting guides
└── README.md               # Project overview documentation
```

---

## Running Locally

### Step 1: Clone & Configure Environments
1.  Ensure you have Node.js and MongoDB installed locally.
2.  Create configurations for server (`server/.env`) and client (`client/.env`) using their respective `.env.example` templates.

### Step 2: Install dependencies
Run the following command in the workspace root directory:
```bash
npm install
npm run install-all
```

### Step 3: Run the application
Start the database server locally on your machine, then run:
```bash
npm run dev
```
This boots both the **Express Server (port 5000)** and the **Vite React Client (port 5173)** concurrently.

---

## Running Automated Integration Tests
Verify endpoint security, models, and payment flows:
```bash
cd server
node test-api.js
```
The test suite initiates an in-process mock server, runs tests, prints results, cleans up database entries, and gracefully exits.

---

## Production Deployment
Refer to [DEPLOYMENT.md](file:///c:/Users/Abu%20Sayeed/Desktop/E-Commerce/DEPLOYMENT.md) for details on deploying the backend to **Render**, the database to **MongoDB Atlas**, and the frontend to **Cloudflare Pages**.
