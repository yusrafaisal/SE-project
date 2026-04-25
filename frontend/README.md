# Saveur — Restaurant Frontend

Next.js 14 frontend for the Restaurant Management System (Menu Module).

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS**
- **TypeScript**
- **Lucide React** (icons)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API URL
Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Make sure the backend is running
```bash
# In the backend folder:
uvicorn main:app --reload
```

### 4. Run the frontend
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features
- 🍽️ **Menu Grid** — beautiful card layout with food images
- ➕ **Add / Edit Items** — modal form with image preview & validation
- 🗑️ **Delete** — confirmation dialog before removing
- 🔍 **Search** — live search across name & description
- 🏷️ **Category Tabs** — filter by Desi, Italian, Chinese, etc.
- ✅ **Availability Filter** — show available / unavailable only
- 📊 **Stats Banner** — total items, available count, categories, avg price
- 🟢 **API Status** — live indicator in navbar
- 🔔 **Toasts** — success/error notifications
- 💀 **Skeletons** — loading placeholders

## Project Structure
```
app/
  page.tsx          — Main page (all state management)
  layout.tsx        — Root layout
  globals.css       — Global styles & Tailwind

components/
  Navbar.tsx        — Sticky nav with API status
  Hero.tsx          — Dark hero banner with stats
  MenuCard.tsx      — Individual menu item card
  MenuModal.tsx     — Add/Edit modal
  DeleteDialog.tsx  — Delete confirmation
  SkeletonCard.tsx  — Loading placeholder
  Toast.tsx         — Toast notifications

lib/
  api.ts            — API client (fetch wrapper)
```
