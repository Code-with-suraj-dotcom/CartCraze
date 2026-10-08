# Ecommerce

A full-stack e-commerce app: browse products, manage a wishlist and cart, and pay with Razorpay.

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB (Atlas in production)
- **Auth:** JWT stored in an httpOnly cookie
- **Payments:** Razorpay

## Features

- Register, login and logout
- Product listing with filters, and product details
- Wishlist and cart
- Checkout with Razorpay, order history and order details

## Project structure

```
Ecommerce/
├── backend/    Express API (routes, controllers, models)
└── frontend/   React app (Vite)
```

## Local setup

Requirements: Node.js 20+, and a MongoDB instance (local or Atlas).

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The API runs on `http://localhost:8000` (or the `PORT` you set). Default products are seeded on startup. `GET /health` returns `{ "status": "ok" }`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
| --- | --- |
| `PORT` | Server port (defaults to 8000) |
| `NODE_ENV` | Set to `production` when deployed |
| `FRONTEND_URL` | Exact frontend origin for CORS, no trailing slash (defaults to `http://localhost:5173`) |
| `dbURL` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign JWTs |
| `ACCESS_TOKEN_EXPIRY` | JWT lifetime, e.g. `7d` |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

### Frontend (`frontend/.env`)

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API |

Never commit real `.env` files. Only the `.env.example` templates are tracked.

## Deployment

### Database: MongoDB Atlas

1. Create a database user with read/write access.
2. Under **Network Access**, allow only your backend's static outbound IP(s).
3. Copy the connection string, include the database name, and use it as `dbURL`.

### Backend: Railway

1. Import the repo and set the **Root Directory** to `backend`.
2. Start command: `npm start`.
3. Set all backend environment variables, with `NODE_ENV=production` and `FRONTEND_URL` set to the Vercel URL.
4. Enable **Static Outbound IPs** and add them to the Atlas allowlist.

### Frontend: Vercel

1. Import the repo and set the **Root Directory** to `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set `VITE_API_URL` to the Railway backend URL, then redeploy. Vite reads it at build time.
4. `frontend/vercel.json` rewrites all routes to `index.html` so React Router works on refresh.

### Cookies across domains

In production the auth cookie is set with `SameSite=None; Secure`, so both the frontend and backend must be served over HTTPS.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | Start with nodemon |
| backend | `npm start` | Start for production |
| frontend | `npm run dev` | Start the Vite dev server |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | Run ESLint |
