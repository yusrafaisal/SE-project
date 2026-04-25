# Saveur Restaurant System

Saveur is a full-stack restaurant management project with a FastAPI backend and a Next.js frontend.

## Project Structure

- backend: FastAPI API, MySQL integration, menu and order logic
- frontend: Next.js app with Firebase auth and customer/admin flows
- PROJECT_DOCUMENTATION.md: detailed architecture, contracts, and change notes

## Current Implemented Scope

- Menu management (create, read, update, delete)
- Role-aware login flow (customer, admin, rider)
- Google login integration for customer flow
- Order placement with inventory deduction
- Inventory listing

## Tech Stack

- Backend: Python, FastAPI, MySQL
- Frontend: Next.js 15, TypeScript, Tailwind CSS, Firebase Auth

## How To Run The Project

## 1. Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8+

## 2. Start Backend

Open a terminal in backend and run:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python setupdb.py
uvicorn main:app --reload
```

Optional seed:

```powershell
python seed_menu.py
python seed_users.py
```

Backend URLs:

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## 3. Start Frontend

Open a second terminal in frontend and run:

```powershell
cd frontend
npm install
```

Create frontend/.env.local with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Then run:

```powershell
npm run dev
```

For a production build:

```powershell
npm run build
npm run dev
```

Frontend URL:

- App: http://localhost:3000

## 4. Quick Verification Checklist

- Backend server runs without import errors
- Frontend starts and loads at localhost:3000
- Frontend can fetch menu from backend
- Login and register pages load successfully

## Important Notes

- Update backend/database.py with your local MySQL credentials.
- Ensure database restaurant_db exists before running setupdb.py.
- Keep secrets out of source control for production use.
- Some frontend auth flows expect endpoints that may not yet be implemented in backend. Check PROJECT_DOCUMENTATION.md before adding features.
