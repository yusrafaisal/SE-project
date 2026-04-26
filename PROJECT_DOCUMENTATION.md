# Saveur Restaurant System - Complete Project Documentation

Last updated: 2026-04-25

This document is designed for both humans and AI coding assistants (Claude, GPT, etc.).
It explains the current codebase, important files, API and UI contracts, known mismatches, and safe change workflows.

## 1. Project Summary

Saveur is a restaurant management system split into two apps:

- `restaurant-backend` (FastAPI + MySQL)
- `restaurant-frontend` (Next.js App Router + TypeScript + Tailwind + Firebase Auth)

Current implemented scope:

- Menu management (CRUD)
- Hybrid login flow (Firebase for customers, backend for role-aware session profile)
- Order placement and inventory deduction (backend)

## 2. High-Level Architecture

### 2.1 Runtime topology

1. Frontend runs on `http://localhost:3000`.
2. Backend runs on `http://localhost:8000`.
3. Frontend sends REST requests to backend using `NEXT_PUBLIC_API_URL`.
4. Backend uses MySQL database `restaurant_db`.
5. Firebase Auth is used in frontend for customer-facing email/password and Google OAuth auth flows.

### 2.2 Main data flow

1. User action in Next.js page/component.
2. Request via `restaurant-frontend/lib/api.ts` or direct `fetch`.
3. FastAPI endpoint in `restaurant-backend/main.py`.
4. SQL query through `restaurant-backend/database.py` connection.
5. Response returned to UI and rendered in components.

## 3. Folder Structure

```text
SE project/
|-- PROJECT_DOCUMENTATION.md
|-- restaurant-backend/
|   |-- .gitignore
|   |-- database.py
|   |-- database_setup.sql
|   |-- main.py
|   |-- models.py
|   |-- README.md
|   |-- requirements.txt
|   |-- seed_menu.py
|   `-- serviceAccountKey.json
`-- restaurant-frontend/
    |-- .env.local
    |-- .gitignore
    |-- next-env.d.ts
    |-- next.config.js
    |-- package-lock.json
    |-- package.json
    |-- postcss.config.js
    |-- README.md
    |-- tailwind.config.js
    |-- tsconfig.json
    |-- app/
    |   |-- globals.css
    |   |-- layout.tsx
    |   |-- page.tsx
    |   |-- customer/
    |   |   `-- page.tsx
    |   |-- forgot-password/
    |   |   `-- page.tsx
    |   |-- login/
    |   |   `-- page.tsx
    |   |-- register/
    |   |   `-- page.tsx
    |   `-- reset-password/
    |       `-- page.tsx
    |-- components/
    |   |-- DeleteDialog.tsx
    |   |-- Hero.tsx
    |   |-- MenuCard.tsx
    |   |-- MenuModal.tsx
    |   |-- Navbar.tsx
    |   |-- SkeletonCard.tsx
    |   `-- Toast.tsx
    `-- lib/
        |-- api.ts
        `-- firebase.ts
```

## 4. Important Files (Brief Explanation)

## 4.1 Backend files

- `restaurant-backend/main.py`
  - Core FastAPI app.
  - Defines CORS config and all API endpoints for auth, menu, orders, inventory.
  - Contains large commented legacy blocks plus active implementation.

- `restaurant-backend/models.py`
  - Pydantic request models used by endpoints.
  - Models include menu payloads, auth payloads, and order payloads.

- `restaurant-backend/database.py`
  - MySQL connection helper (`get_connection`).
  - Currently contains hardcoded DB credentials.

- `restaurant-backend/database_setup.sql`
  - SQL schema creation script for `menu_items`, `orders`, `order_items`, `inventory`, `delivery_addresses`.
  - Inserts initial inventory quantities from menu items.
  - Assumes `users` table already exists (foreign key references it).

- `restaurant-backend/seed_menu.py`
  - Data seeding utility.
  - Truncates `menu_items` and inserts sample items with image URLs.

- `restaurant-backend/requirements.txt`
  - Python dependencies file.
  - File encoding appears non-standard (UTF-16-like content); verify before pip install.

- `restaurant-backend/serviceAccountKey.json`
  - Firebase service account file present in repo.
  - Sensitive credential material; should not be committed for production.

- `restaurant-backend/README.md`
  - Basic local setup guide for backend.

## 4.2 Frontend files

- `restaurant-frontend/app/layout.tsx`
  - Root layout and page metadata.

- `restaurant-frontend/app/globals.css`
  - Global CSS and reusable Tailwind component classes.
  - Defines design tokens style direction (cream/ember/forest palette).

- `restaurant-frontend/app/page.tsx`
  - Admin menu page.
  - Handles menu fetch, create/edit/delete dialogs, filtering, and toasts.
  - Some UI modules are intentionally commented out (hero, tabs, etc.).

- `restaurant-frontend/app/customer/page.tsx`
  - Customer menu page (read-only cards).
  - Similar filtering and fetch flow as admin page, with admin actions disabled.

- `restaurant-frontend/app/login/page.tsx`
  - Login UI for roles: customer, rider, admin.
  - Customer path uses Firebase auth then backend profile login.
  - Includes Google login flow.

- `restaurant-frontend/app/register/page.tsx`
  - Customer registration form.
  - Calls backend register API and creates Firebase email/password account.
  - Collects phone in UI and sends it to backend payload.

- `restaurant-frontend/app/forgot-password/page.tsx`
  - OTP-style forgot password flow (send OTP, verify OTP, reset password by OTP).
  - Calls backend OTP endpoints (see mismatch section below).

- `restaurant-frontend/app/reset-password/page.tsx`
  - Firebase reset-link completion page (`oobCode` flow).
  - Also POSTs to backend reset endpoint to sync admin/rider passwords.

- `restaurant-frontend/components/Navbar.tsx`
  - Top bar with API online/offline status and mode label (admin/customer).

- `restaurant-frontend/components/Hero.tsx`
  - Dashboard-like hero for summary stats and trend chart.
  - Imported but currently commented out in page usage.

- `restaurant-frontend/components/MenuCard.tsx`
  - Menu item card with image fallback and optional edit/delete buttons.

- `restaurant-frontend/components/MenuModal.tsx`
  - Add/Edit modal form and validation.

- `restaurant-frontend/components/DeleteDialog.tsx`
  - Confirm-before-delete dialog.

- `restaurant-frontend/components/SkeletonCard.tsx`
  - Loading placeholder for menu cards.

- `restaurant-frontend/components/Toast.tsx`
  - Toast notification system with auto-dismiss.

- `restaurant-frontend/lib/api.ts`
  - Centralized menu API wrapper for GET/POST/PUT/DELETE.

- `restaurant-frontend/lib/firebase.ts`
  - Firebase initialization and auth instance export.

- `restaurant-frontend/next.config.js`
  - Allows remote images from all HTTP/HTTPS hosts.

- `restaurant-frontend/tailwind.config.js`
  - Tailwind theme extension (colors, fonts, animations).

- `restaurant-frontend/tsconfig.json`
  - TypeScript settings, strict mode, and `@/*` path alias.

- `restaurant-frontend/package.json`
  - Frontend dependencies and scripts (`dev`, `build`, `start`).

- `restaurant-frontend/README.md`
  - Basic setup and feature overview for frontend.

## 5. Backend API Contract (Current)

Base URL: `http://localhost:8000`

### 5.1 Auth endpoints

- `POST /auth/register`
  - Body: `{ name, email, password }`
  - Behavior: creates customer account in `users` with bcrypt hash.

- `POST /auth/login`
  - Body: `{ email, password, role }`
  - Behavior: verifies user by email+role; if password equals `__firebase_verified__`, bcrypt check is skipped.

- `POST /auth/google-login`
  - Body: `{ name, email, uid }`
  - Behavior: creates new customer if email not found, otherwise returns existing account.

- `POST /auth/reset-password`
  - Body: `{ email, new_password }`
  - Behavior: updates password only for `admin` and `rider` roles.

### 5.2 Menu endpoints

- `GET /menu` -> list all menu items
- `POST /menu` -> add a menu item
- `PUT /menu/{item_id}` -> update partial item fields
- `DELETE /menu/{item_id}` -> delete item

### 5.3 Order endpoints

- `POST /orders`
  - Body includes `user_id`, `cart[]`, address/payment fields.
  - Checks inventory, calculates total, writes order + order items, deducts stock.

- `GET /orders/{user_id}`
  - Returns user order list.

- `GET /orders/detail/{order_id}`
  - Returns order plus joined order item details (`name`, `image_url`).

### 5.4 Inventory endpoint

- `GET /inventory`
  - Returns inventory rows joined with menu item name/category.

## 6. Frontend Route Contract (Current)

- `/` -> Role-aware login screen (customer/admin/rider).
- `/customer` -> Customer read-only menu page.
- `/admin` -> Admin menu management page.
- `/register` -> Customer registration.
- `/forgot-password` -> OTP-based recovery flow UI.
- `/reset-password` -> Firebase reset-link completion page.

## 7. Data Model Overview

Tables used by current code:

- `menu_items`
  - Fields: id, name, description, price, category, is_available, image_url, created_at.

- `orders`
  - Fields: id, user_id, delivery_address, payment_method, special_instructions, status, total_price, created_at.

- `order_items`
  - Fields: id, order_id, menu_item_id, quantity, price_at_order.

- `inventory`
  - Fields: id, menu_item_id, quantity, low_stock_threshold.

- `delivery_addresses`
  - Fields: id, user_id, label, address, created_at.

Referenced but not created in shown SQL:

- `users` (must exist for auth and foreign keys)

## 8. Setup and Run Guide

## 8.1 Backend

1. Open terminal in `restaurant-backend`.
2. Create venv:
   - `python -m venv venv`
   - `venv\Scripts\activate`
3. Install deps: `pip install -r requirements.txt`
4. Create DB/schema using `database_setup.sql`.
5. Ensure DB credentials in `database.py` are correct.
6. Run server: `uvicorn main:app --reload`
7. Seed menu: `python seed_menu.py`

## 8.2 Frontend

1. Open terminal in `restaurant-frontend`.
2. Install deps: `npm install`
3. Ensure `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. Run: `npm run dev`
5. Open `http://localhost:3000`

## 9. Environment and Secrets

### 9.1 Frontend env

- `NEXT_PUBLIC_API_URL` (required for API base URL)

### 9.2 Hardcoded values currently in repo

- DB credentials in `restaurant-backend/database.py`
- Firebase config in `restaurant-frontend/lib/firebase.ts`
- Service account JSON in `restaurant-backend/serviceAccountKey.json`

Recommended future change:

- Move all secrets to environment variables.
- Remove service account key from version control.

## 10. Known Mismatches and Gaps (Important for Future Changes)

These are critical for any AI assistant continuing this project:

1. Frontend expects auth-by-phone support in login/register payloads, but backend models/endpoints currently only support email fields.
2. Frontend forgot-password OTP flow calls endpoints not implemented in backend:
   - `/auth/send-otp`
   - `/auth/verify-otp`
   - `/auth/reset-password-otp`
3. Frontend login also calls `/auth/lookup-by-phone`, which is not implemented in backend.
4. `database_setup.sql` assumes `users` table exists but does not create it in visible script section.
5. API has no authentication/authorization guard on sensitive CRUD/order routes.

## 11. AI Change Playbook (For Claude/GPT/Future Agents)

Use this section as an operational contract before modifying code.

### 11.1 If changing menu CRUD

1. Backend update points:
   - `restaurant-backend/main.py` menu endpoints
   - `restaurant-backend/models.py` menu models
2. Frontend update points:
   - `restaurant-frontend/lib/api.ts`
   - `restaurant-frontend/app/page.tsx`
   - `restaurant-frontend/components/MenuModal.tsx`
   - `restaurant-frontend/components/MenuCard.tsx`
3. Preserve payload naming: `is_available`, `image_url`, `category`.

### 11.2 If changing auth flow

1. Keep frontend Firebase logic and backend profile logic aligned.
2. If phone auth is required, add/extend backend models and DB schema first.
3. Ensure frontend endpoints and backend implemented endpoints match exactly.
4. Update both:
   - `restaurant-frontend/app/login/page.tsx`
   - `restaurant-frontend/app/register/page.tsx`
   - `restaurant-frontend/app/forgot-password/page.tsx`
   - `restaurant-backend/main.py`
   - `restaurant-backend/models.py`

### 11.3 If changing order/inventory logic

1. Update endpoint logic in `restaurant-backend/main.py`.
2. Keep DB schema aligned in `restaurant-backend/database_setup.sql`.
3. Re-check inventory deduction behavior and error payload structure.
4. Ensure frontend (future order UI) expects the same response shape.

### 11.4 If changing styling or UI language

1. Keep design tokens in sync with:
   - `restaurant-frontend/app/globals.css`
   - `restaurant-frontend/tailwind.config.js`
2. Reuse existing class patterns (`btn-primary`, `input-field`, `card`) to avoid design drift.

### 11.5 Before opening a PR, run this checklist

1. Backend starts without import/runtime errors.
2. Frontend starts and can fetch menu from backend.
3. Login/register/reset pages compile and route correctly.
4. API routes used by frontend exist in backend.
5. Any schema changes are reflected in SQL setup docs.

## 12. Suggested Near-Term Improvements

1. Add missing backend endpoints required by frontend auth/OTP flow.
2. Move DB/Firebase secrets to environment variables.
3. Add users table migration script if not already present elsewhere.
4. Add auth middleware (JWT/session) for protected endpoints.
5. Remove stale commented blocks to reduce maintenance confusion.

## 13. Quick File-to-Responsibility Index

- Backend API entrypoint: `restaurant-backend/main.py`
- Backend DB connection: `restaurant-backend/database.py`
- Backend request models: `restaurant-backend/models.py`
- Backend schema: `restaurant-backend/database_setup.sql`
- Backend seed data: `restaurant-backend/seed_menu.py`
- Frontend API wrapper: `restaurant-frontend/lib/api.ts`
- Frontend auth config: `restaurant-frontend/lib/firebase.ts`
- Frontend admin menu screen: `restaurant-frontend/app/page.tsx`
- Frontend customer menu screen: `restaurant-frontend/app/customer/page.tsx`
- Frontend login screen: `restaurant-frontend/app/login/page.tsx`
- Frontend registration screen: `restaurant-frontend/app/register/page.tsx`
- Frontend OTP reset screen: `restaurant-frontend/app/forgot-password/page.tsx`
- Frontend reset-link screen: `restaurant-frontend/app/reset-password/page.tsx`

---

If you hand this file to another AI agent, instruct it to:

1. Read this document first.
2. Validate endpoint parity before coding.
3. Keep frontend-backend payload contracts synchronized.
4. Avoid introducing new secrets into source files.
