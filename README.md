# RANDERE — Circular Fashion & Creative Studio

> **FIND. REMAKE. WEAR.**  
> Curated secondhand fashion + garment restoration + upcycling + customization + wearable art + styling + creative community.  
> Originated in Nairobi, Kenya. Global contemporary streetwear & editorial aesthetic.

---

## 1. Project Overview

**RANDERE** is a digital-first circular fashion and creative studio that challenges the traditional secondhand clothing model. 

Conventional secondhand operations compete on volume (*Find → Sell cheap*). RANDERE creates value by applying creative and technical craftsmanship to overlooked garments:

```
SOURCE → GRADE → CLEAN → RESTORE → REMAKE → ART → STYLE → SELL → REUSE
```

The platform provides a complete digital flagship:
- **Curated Drops**: 1-of-1 reconstructed pieces, hand-painted wearable art, and curated vintage streetwear.
- **Interactive Metamorphosis**: Real-time Before/After sliders comparing raw thrift garments with studio reworks.
- **Kenya-First Commerce**: Pricing in Kenyan Shillings (KES), Lipa na M-PESA STK Push integration, Card authorization, and Nairobi same-day dispatch.
- **Custom Studio Commissions (`/custom`)**: "Bring us something ordinary" — customers submit their own garments for tailoring, painting, sashiko patchwork, and full redesigns.
- **Styling Service (`/style`)**: "Don't know what to wear? Get plugged." — bespoke occasion and wardrobe curation.
- **Editorial Journal (`/stories`)**: Dispatches on garment archaeology, pigment heat-fixation, and circular design philosophy.
- **Signature Transformations Gallery (`/transformations`)**: Documenting the complete breakdown from source garment to runway piece.
- **Operations Dashboard (`/admin`)**: Telemetry, inventory control, order fulfillment, custom requests, and editorial publication.

---

## 2. Technical Stack (PERN Architecture)

### Frontend
- **React 18 + TypeScript + Vite 6**
- **Tailwind CSS v3**: Bespoke brutalist/minimalist streetwear design system (Asphalt `#0A0A0B`, Chalk `#F4F4F2`, Acid Volt `#CCFF00`, International Orange `#FF4800`)
- **TanStack Query (React Query v5)**: Efficient caching and asynchronous state synchronization
- **React Hook Form + Zod**: Schema-validated forms for checkout, custom rework intake, and styling briefs
- **Lucide Icons**: High-contrast, minimal iconography
- **Custom Interactive Components**: Before/After drag comparison slider, bag slide-out drawer, global archive search modal

### Backend
- **Node.js + Express (TypeScript)**
- **PostgreSQL Database** (Embedded PGlite for zero-dependency execution + Prisma schema ready for cloud PostgreSQL migrations)
- **Layered Architecture**: Controllers → Services → Repositories → Validators → Middleware
- **Security & Auth**: Hashed passwords (`bcryptjs`), JWT authentication, Role-Based Access Control (`CUSTOMER`, `ADMIN`), Rate Limiting (`express-rate-limit`), Helmet security headers, CORS
- **Kenya Payment Layer Abstraction**:
  - `PaymentProvider` interface (`createPayment`, `verifyPayment`, `refundPayment`)
  - `MpesaPaymentProvider` (Safaricom Daraja STK Push Express)
  - `CardPaymentProvider` (3D Secure Card Processing)
  - `CashOnDeliveryProvider` (Studio Pickup / Pay on Delivery)
- **Object Storage Abstraction**: `StorageProvider` interface (`LocalStorageProvider`, `S3StorageProvider` for S3 / Cloudflare R2 / MinIO)

---

## 3. Directory Layout

```
RandereStore/
├── client/                     # Frontend Vite + React + Tailwind
│   ├── src/
│   │   ├── components/         # Navbar, BagDrawer, BeforeAfterSlider, TreatmentFlow, ProductCard, SearchModal
│   │   ├── pages/              # Home, Shop, ProductDetail, Cart, Checkout, OrderConfirmation, Custom, Style, Stories, About, Account, Admin
│   │   ├── layouts/            # RootLayout (Storefront), AdminLayout (Ops)
│   │   ├── hooks/              # useAuth, useCart, useAnalytics
│   │   ├── lib/                # api client, formatting utils (KES currency, dates)
│   │   ├── types/              # Domain TypeScript interfaces
│   │   └── routes/             # AppRoutes configuration
├── server/                     # Backend API Node.js + Express + TypeScript
│   ├── prisma/
│   │   └── schema.prisma       # Prisma ORM schema with enums & relations
│   ├── src/
│   │   ├── config/             # Environment, PostgreSQL database connection
│   │   ├── controllers/        # Auth, Products, Orders, Cart, Custom, Styling, Stories, Admin
│   │   ├── middleware/         # Auth, Zod validation, Error handler, Rate limiters
│   │   ├── repositories/       # Data access objects with raw SQL queries & atomic operations
│   │   ├── services/           # Business logic, atomic stock decrement, payment registry, storage
│   │   ├── validators/         # Zod schemas for all endpoints
│   │   ├── utils/              # JWT, slugify, logger, AppError hierarchy
│   │   ├── types/              # Server-side TypeScript records & enums
│   │   ├── seed.ts             # Realistic RANDERE archive drop seed data
│   │   ├── app.ts              # Express application assembly
│   │   └── server.ts           # Server bootstrap (listens on 0.0.0.0:5000)
│   └── __tests__/              # Automated test suite (Vitest + Supertest)
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

Clone and install dependencies:
```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Variables
Configure `server/.env` (see `server/.env.example`):
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secure-secret-key-2026
DATABASE_PATH=data/randere.db
SHIPPING_BASE_FEE=350
FREE_SHIPPING_THRESHOLD=10000
```

### Database Seeding
Initialize the database with 8 authentic Kenyan streetwear drops, 2 detailed transformation case studies, 3 editorial essays, and demo accounts:
```bash
npm --prefix server run seed
```

### Development Servers
Run the backend and frontend dev servers concurrently:

```bash
# Terminal 1: Backend API (port 5000)
npm run dev:server

# Terminal 2: Frontend Client (port 3000, proxies /api -> http://127.0.0.1:5000)
npm run dev:client
```

Preview at: `http://localhost:3000`

---

## 5. Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **ADMIN** | `admin@randere.studio` | `randere2026` | Full Studio Ops (`/admin`), Metrics, Orders, Catalog |
| **CUSTOMER** | `kevo@randere.studio` | `randere2026` | Customer Portal (`/account`), Custom Reworks, Saved Bag |
| **CUSTOMER** | `shiko@randere.studio` | `randere2026` | Styling Briefs, Order History |

---

## 6. Automated Testing Suite

The project includes an end-to-end integration and security test suite verifying all 8 critical scenarios outlined in the specification:
1. Cannot purchase sold-out product
2. Atomic one-of-one item cannot be oversold or purchased twice
3. Customer cannot access another customer's order (403 Forbidden)
4. Non-admin cannot access admin endpoints (403 Forbidden)
5. Product prices cannot be manipulated from the client (Server-side recalculation)
6. Invalid custom requests are rejected (Zod validation error)
7. JWT authentication and credentials verification
8. Bag item consistency and quantity synchronization

Run tests:
```bash
npm --prefix server test
```

---

## 7. API Reference Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/products` | Filterable drop archive (category, size, sort, search) | Public |
| `GET` | `/api/products/featured` | Curated drop highlights for homepage | Public |
| `GET` | `/api/products/:slug` | Full product spec sheet, measurements & story | Public |
| `POST` | `/api/products` | Create new garment release | **Admin** |
| `PATCH` | `/api/products/:id` | Update product, price, or mark sold | **Admin** |
| `POST` | `/api/auth/register` | Create customer account | Public |
| `POST` | `/api/auth/login` | Authenticate customer/admin | Public |
| `GET` | `/api/auth/me` | Current authenticated session | User |
| `GET` | `/api/cart` | Retrieve persistent bag | Public / User |
| `POST` | `/api/cart/items` | Add garment to bag | Public / User |
| `POST` | `/api/orders` | Place order with server price validation | Public / Guest |
| `GET` | `/api/orders/my` | View personal order history | User |
| `GET` | `/api/orders/track/:orderNumber` | Public tracking lookup by order ID | Public |
| `POST` | `/api/custom-requests` | Submit garment for reconstruction | Public / User |
| `POST` | `/api/styling-requests` | Submit personal styling brief ("Get Plugged") | Public / User |
| `GET` | `/api/stories` | Read editorial essays and dispatches | Public |
| `GET` | `/api/transformations` | Retrieve before/after transformation docs | Public |
| `GET` | `/api/admin/metrics` | Real-time sales, order counts, and stats | **Admin** |

---

## 8. Deployment Architecture

- **Backend**: Can be deployed to any Node.js container service (Railway, Render, AWS ECS, Fly.io) connecting to managed PostgreSQL.
- **Frontend**: Pre-compiled with `npm run build:client` and deployed to Vercel, Netlify, or Cloudflare Pages with API rewrite proxying to backend.
- **Object Storage**: Toggle `S3StorageProvider` with AWS S3, Cloudflare R2, or Supabase Storage for unlimited image asset hosting.

---

© 2026 RANDERE STUDIO. NAIROBI, KENYA.
