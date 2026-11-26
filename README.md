# Item 13 — Gourmet Popcorn, Drinks & Artisanal Treats

> **"The Unexpected Essential"**  
> A modern, responsive, full-stack digital storefront and ordering platform for gourmet popcorn, craft refreshments, and curated combo drops. Built with React 19, Vite, and Node.js with embedded MTN MoMo payment collections.

---

## 🍿 Overview

**Item 13** delivers a premium culinary and digital ordering experience. The platform combines visual storytelling, dynamic micro-interactions, responsive design across mobile and desktop devices, seamless authentication, and local payment integration with MTN Mobile Money (MoMo).

Whether browsing weekend drop specials, personalizing a savory or sweet popcorn mix, checking past orders as a guest or authenticated customer, or checking out with direct phone-prompt mobile money collections, Item 13 provides an intuitive end-to-end e-commerce flow.

---

## ✨ Key Features

### 🎨 Visual Identity & Theming
- **Dual Theme Support**: Comprehensive **Dark Mode** and **Light Mode** styling with smooth CSS view transitions, glassmorphism card surfaces, and gold metallic accents.
- **Dynamic Micro-Interactions**:
  - Animated navbar action suite with choreographed sequential expansion and collapse for Theme and Menu controls.
  - Floating bag / cart indicator with reactive badge counts and subtle floating animations.
  - Interactive hero product showcases with responsive safe-area clearance on mobile.

### 🛍️ Storefront & Menus
- **Showcase Landing Page (`/`)**: Hero typography, curated drops, rotating customer favorites, and immediate access to the seasonal catalog.
- **Interactive Menu (`/menu`)**: Category filtering (Gourmet Popcorn, Craft Drinks, Combo Packs), real-time search, price indicators, dietary highlights, and instant bag updates.
- **Product Details (`/product/:id`)**: Rich product imagery, nutritional highlights, portion/flavor customization, and recommended pairings.

### 🔐 Authentication & Accounts
- **Fluid Auth Experience (`/login`, `/signup`)**:
  - Single-card toggle between Sign In and Account Creation with animated field transitions (sliding inputs, responsive height collapsing).
  - Descriptive, cycling typewriter placeholders providing helpful format hints.
  - Full guest checkout support with dedicated guest order lookup.
- **Customer Profiles (`/profile`)**: Manage personal details, saved shipping addresses (`/addresses`), and order history.

### 📦 Order Tracking & History
- **Dual-State Order History (`/orders`)**:
  - **Guest Mode**: Clean lookup card to track any order by Order ID and Phone Number without requiring account creation.
  - **User Mode**: Comprehensive historical orders view with status badges, itemized receipts, and re-order triggers.
- **Live Order Tracking (`/track/:orderId`)**: Step-by-step progress tracker from order placement and kitchen preparation to dispatch and delivery.

### 💳 MTN MoMo Collection Integration
- **Direct Collection `RequestToPay` Flow (`/payment`)**:
  - Server-mediated transactions via MTN's Collection API.
  - Validates Ghanaian phone formats (`024`, `054`, `055`, `059`, etc.) and account-holder activation.
  - Direct push authorization prompt sent straight to the customer's phone — **no PIN or OTP is ever collected on the website**.
  - Dual operation: Built-in safe **Demo Mode** for local testing, plus production sandbox/live gateway routing.
  - Background polling and webhook handlers with independent server-side status verification before marking orders as `PAID`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Lucide Icons, Canvas Confetti, Modern CSS Variables & Glassmorphism |
| **Backend / API** | Node.js, Express 5, Helmet, Express Rate Limit, CORS |
| **Database** | SQLite3 (`better-sqlite3`) for persistent order records, payments, and audit logs |
| **Payments** | MTN Mobile Money Collection API (`RequestToPay`), Webhooks, UUID transaction tracking |

---

## 📁 Project Architecture

```
Item13/
├── Frontend/
│   ├── public/                 # Static assets, branding logos, and product graphics
│   ├── server/                 # Express backend API & payment daemon
│   │   ├── config/             # Environment, rate-limiting & MTN endpoints
│   │   ├── db/                 # SQLite schema initialization and migrations
│   │   ├── routes/             # Payment, webhook, and order status routes
│   │   ├── services/           # MTN MoMo Collection client and signature services
│   │   └── index.js            # Express server entry point (port 3001)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets (Navbar, Footer, FloatingBag, ThemeToggle)
│   │   ├── context/            # React context providers (ThemeContext, etc.)
│   │   ├── pages/              # Application views:
│   │   │   ├── LandingShowcasePage.jsx # Hero showcase & curated highlights
│   │   │   ├── MenuPage.jsx            # Product catalog & filtering
│   │   │   ├── ProductDetailPage.jsx   # Single item details & customization
│   │   │   ├── CheckoutPage.jsx        # Bag review, delivery & payment dispatch
│   │   │   ├── MomoPaymentPage.jsx     # MTN Mobile Money prompt & live status
│   │   │   ├── OrderHistoryPage.tsx    # Customer dashboard & guest order lookup
│   │   │   ├── OrderTrackingPage.tsx   # Visual status tracker
│   │   │   ├── AuthPage.jsx            # Sign In / Create Account with fluid animations
│   │   │   ├── ProfilePage.jsx         # User account & preferences
│   │   │   ├── SavedAddressesPage.tsx  # Multi-address manager
│   │   │   ├── DeliveryPage.jsx        # Delivery zones, rates & policies
│   │   │   ├── ContactPage.jsx         # Customer support & inquiries
│   │   │   └── AboutEventsPage.jsx     # Brand story & event catering bookings
│   │   ├── styles/             # Modular CSS stylesheets (components, pages, themes)
│   │   ├── App.jsx             # Main routing, layout, and global modals
│   │   └── main.jsx            # React root mount
│   ├── .env.example            # Backend configuration template
│   ├── package.json            # Scripts & dependencies
│   └── vite.config.js          # Vite configuration & `/api` proxy
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/your-username/item13.git
   cd Item13/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   *(For local testing, the default `MOMO_DEMO_MODE=true` works out of the box without requiring real MTN credentials).*

### Running the Application

For full payment and API functionality, start both the backend server and frontend development server:

#### Terminal 1 — Backend API
```bash
npm run server
```
*Listens on `http://127.0.0.1:3001`.*

#### Terminal 2 — Frontend Client
```bash
npm run dev
```
*Vite will start the client on `http://localhost:5173/` and proxy `/api` calls to port 3001.*

### Production Build
To create an optimized production bundle:
```bash
npm run build
```
Preview the built bundle locally:
```bash
npm run preview
```

---

## 💳 Payment Gateway Configuration

The backend supports both a zero-credential **Demo Mode** and live/sandbox **MTN MoMo Collection API**.

```dotenv
# Environment Mode
PORT=3001
NODE_ENV=development

# MTN MoMo Settings
MOMO_DEMO_MODE=false
MOMO_TARGET_ENVIRONMENT=sandbox # or 'mtn-ghana' for production
MOMO_SUBSCRIPTION_KEY=your_collection_subscription_key
MOMO_API_USER=your_sandbox_api_user_uuid
MOMO_API_KEY=your_sandbox_api_key
MOMO_CALLBACK_URL=https://your-domain.com/api/webhooks/mtn
```

- In **Demo Mode** (`MOMO_DEMO_MODE=true`), transactions simulate realistic confirmation delays and automatically approve without moving real money or hitting MTN servers.
- In **Live / Sandbox Mode**, payment requests invoke the direct MTN `RequestToPay` service, dispatching a prompt to the customer's mobile device.

---

## 🔒 Security Best Practices

- **Zero Credential Exposure**: Mobile Money PINs, OTPs, and API secrets are never accepted or processed on the client side.
- **Idempotency & Auditing**: Every transaction is tracked via UUID references (`X-Reference-Id`) to prevent duplicate charges.
- **Verification on Fulfillment**: Orders are fulfilled exclusively when the backend server validates the `PAID` state with MTN's verification endpoint.
- **Input Sanitization & Headers**: Protected with `helmet` security headers, strict CORS, and rate limiting on sensitive checkout routes.

---

## 📄 License

This project is proprietary and confidential. All rights reserved by **Item 13**.
