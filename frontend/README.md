# Saveur Frontend

Next.js frontend for the Saveur Restaurant System.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Auth

## Pages

- /: admin menu management
- /customer: customer menu view
- /login: role-aware login
- /register: customer registration
- /forgot-password: password recovery flow
- /reset-password: reset completion
- /cart, /checkout, /payment, /orders, /order-confirmation

## Run Frontend Locally

1. Open a terminal in this folder.
2. Install dependencies.

```powershell
npm install
```

3. Create or update .env.local.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the development server.

```powershell
npm run dev
```

5. Open:

- http://localhost:3000

## Production Build

Use these commands when you want to build and run the frontend in production mode.

```powershell
npm run build
npm run dev
```

## Related Files

- app/page.tsx: admin menu page
- app/customer/page.tsx: customer menu page
- app/login/page.tsx: login flow
- app/register/page.tsx: registration flow
- lib/api.ts: menu API wrapper
- lib/firebase.ts: Firebase setup
