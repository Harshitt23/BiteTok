# 🍽️ BiteTok

A TikTok/Reels-style vertical video platform for food. Restaurants and home
cooks ("food partners") upload short food videos; users scroll an infinite feed
and like, save, and comment on the dishes they love.

[![CI](https://github.com/Harshitt23/BiteTok/actions/workflows/ci.yml/badge.svg)](../../actions)

---

## ✨ Features

**For users**
- 🎬 Vertical, scroll-snapped video feed with autoplay (IntersectionObserver)
- ❤️ Real likes, 🔖 saves, and 💬 comments (persisted, per-user)
- 🔐 Secure cookie-based authentication
- 🌙 Light/dark theme

**For food partners**
- 📹 Upload food videos (stored on ImageKit CDN)
- 📊 Dashboard to manage your own items
- 🗑️ Delete items (also cleans up likes/saves/comments and the CDN file)

---

## 🛠️ Tech stack

| Layer     | Tech                                                                 |
| --------- | ------------------------------------------------------------------- |
| Frontend  | React 18, Vite 7, React Router 6, Axios                             |
| Backend   | Node.js 18+, Express 4, Mongoose 8                                  |
| Database  | MongoDB                                                              |
| Auth      | JWT (httpOnly cookies) + bcrypt                                     |
| Media     | ImageKit (upload + CDN + thumbnails)                                |
| Security  | helmet, CORS allow-list, express-rate-limit, Zod validation        |
| Tests/CI  | Vitest + Supertest + mongodb-memory-server, GitHub Actions         |

---

## 📁 Project structure

```
BiteTok/
├── Backend/                     # Express API (deploys to Railway/Render)
│   ├── src/
│   │   ├── app.js               # Express app factory (used by server + tests)
│   │   ├── config/env.js        # Zod-validated environment (fail-fast)
│   │   ├── controllers/         # auth, food, comment
│   │   ├── middlewares/         # auth, validate, upload, error
│   │   ├── models/              # user, foodpartner, food, like, save, comment
│   │   ├── routes/              # auth.routes, food.routes
│   │   ├── services/            # storage.service (ImageKit)
│   │   ├── utils/               # ApiError, asyncHandler, token
│   │   └── validators/          # Zod schemas
│   ├── tests/                   # Vitest + Supertest integration tests
│   ├── server.js                # Entry point (connect DB + listen)
│   └── Dockerfile
├── frontend/                    # React + Vite SPA (deploys to Vercel/Netlify)
│   └── src/
│       ├── config/api.js        # Axios instance + endpoint map
│       ├── contexts/            # ThemeContext
│       ├── pages/               # auth, general (feed), food-partner
│       └── routes/AppRoutes.jsx
├── railway.json                 # Backend deploy config
└── .github/workflows/ci.yml
```

---

## 🚀 Local development

### Prerequisites
- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/))
- An [ImageKit](https://imagekit.io/) account (for uploads)

### 1. Install
```bash
npm run install:all      # installs root, Backend, and frontend
```

### 2. Configure environment
```bash
cp Backend/.env.example Backend/.env
cp frontend/.env.example frontend/.env
```
Fill in `Backend/.env` (see the table below). Generate a JWT secret with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

| Variable                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `NODE_ENV`              | `development` / `production`                      |
| `PORT`                  | API port (default 3000)                          |
| `CORS_ORIGIN`           | Comma-separated allowed frontend origins         |
| `MONGODB_URI`           | MongoDB connection string                        |
| `JWT_SECRET`            | Long random string                               |
| `JWT_EXPIRES_IN`        | e.g. `7d`                                         |
| `IMAGEKIT_PUBLIC_KEY`   | ImageKit public key                              |
| `IMAGEKIT_PRIVATE_KEY`  | ImageKit private key                             |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint                            |

### 3. Run
```bash
npm run dev              # runs backend + frontend together
```
- API → http://localhost:3000
- App → http://localhost:5173

---

## 🔌 API reference

Base URL: `/api`. Auth via httpOnly `token` cookie or `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint                              | Auth | Description              |
| ------ | ------------------------------------- | ---- | ------------------------ |
| POST   | `/auth/user/register`                 | —    | Register a user          |
| POST   | `/auth/user/login`                    | —    | User login               |
| POST   | `/auth/user/logout`                   | —    | Logout                   |
| POST   | `/auth/food-partner/register`         | —    | Register a food partner  |
| POST   | `/auth/food-partner/login`            | —    | Food partner login       |
| GET    | `/auth/food-partner/all`              | —    | List food partners       |
| GET    | `/auth/me`                            | ✅   | Current principal        |

### Food
| Method | Endpoint                  | Auth      | Description                         |
| ------ | ------------------------- | --------- | ----------------------------------- |
| GET    | `/food?page=&limit=&search=&city=&tag=` | optional | Public feed (paginated + filters) |
| GET    | `/food/:id`               | optional  | Single item                         |
| GET    | `/food/mine`              | partner   | The partner's own items             |
| GET    | `/food/saved`             | user      | The user's saved items              |
| POST   | `/food`                   | partner   | Create item (multipart `video`)     |
| DELETE | `/food/:id`               | partner   | Delete own item                     |
| POST   | `/food/:id/like`          | user      | Toggle like                         |
| POST   | `/food/:id/save`          | user      | Toggle save                         |
| GET    | `/food/:id/comments`      | —         | List comments (paginated)           |
| POST   | `/food/:id/comments`      | user      | Add comment                         |
| DELETE | `/food/comments/:id`      | user      | Delete own comment                  |

### Health
`GET /api/health` → `{ success, database }`

---

## 🧪 Testing

```bash
cd Backend && npm test       # Vitest + Supertest against in-memory MongoDB
cd Backend && npm run seed   # populate demo partners + food (idempotent)
```

CI (GitHub Actions) runs backend lint + tests and frontend lint + build on every
push and PR.

---

## ☁️ Deployment

**Backend → Railway / Render**
- Uses `railway.json` (Nixpacks). Set the env vars from the table above in the
  dashboard. Healthcheck: `/api/health`.
- Or build the included `Backend/Dockerfile`.

**Frontend → Vercel / Netlify**
- Root directory: `frontend`. Build: `npm run build`, output: `dist`.
- Set `VITE_API_URL` to the deployed backend URL.
- `frontend/vercel.json` handles SPA routing.

> Cross-site cookies: in production the API sets `SameSite=None; Secure` cookies,
> so the backend must be HTTPS and `CORS_ORIGIN` must list the exact frontend
> origin(s).

---

## 🔒 Security notes
- Secrets live only in `.env` (gitignored) — never commit them.
- Passwords are bcrypt-hashed and never serialized.
- JWTs expire; cookies are httpOnly.
- Inputs validated with Zod; rate limiting on all `/api` routes (stricter on auth).

---

## 📄 License
MIT
