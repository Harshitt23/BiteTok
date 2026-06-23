# 🚀 Deploying BiteTok

Two pieces deploy separately:

- **Backend (Express API)** → Railway (or Render)
- **Frontend (React/Vite SPA)** → Vercel (or Netlify)

You'll need: a MongoDB Atlas database, an ImageKit account, and GitHub-connected
Railway + Vercel accounts.

---

## 1. MongoDB Atlas
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. **Database Access** → add a user with a strong password.
3. **Network Access** → allow `0.0.0.0/0` (or Railway's egress IPs).
4. Copy the connection string → this is `MONGODB_URI`
   (append a db name, e.g. `…mongodb.net/bitetok`).

## 2. ImageKit
1. Sign up at https://imagekit.io
2. **Developer options** → copy Public key, Private key, and URL endpoint.

---

## 3. Backend → Railway
1. https://railway.app → **New Project** → **Deploy from GitHub repo** → pick this repo.
2. Railway reads `railway.json` (builds & starts the `Backend/`).
3. **Variables** → add:
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://<your-frontend>.vercel.app
   MONGODB_URI=<your atlas uri>
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))">
   JWT_EXPIRES_IN=7d
   IMAGEKIT_PUBLIC_KEY=<...>
   IMAGEKIT_PRIVATE_KEY=<...>
   IMAGEKIT_URL_ENDPOINT=<...>
   ```
4. Deploy. Grab the public URL, e.g. `https://bitetok-api.up.railway.app`.
5. Verify: open `https://<railway-url>/api/health` → should return `{ success: true }`.

> Render alternative: New **Web Service**, root dir `Backend`, build
> `npm ci`, start `node server.js`, same env vars.

## 4. Frontend → Vercel
1. https://vercel.com → **Add New Project** → import this repo.
2. **Root Directory:** `frontend`  (Vercel auto-detects Vite; `frontend/vercel.json`
   handles SPA routing).
3. **Environment Variables:**
   ```
   VITE_API_URL=https://<your-railway-url>
   ```
4. Deploy → you get `https://<your-frontend>.vercel.app`.

## 5. Connect the two
- Set the backend's `CORS_ORIGIN` to the exact Vercel URL (no trailing slash) and
  redeploy the backend.
- Cross-site cookies require HTTPS on both (Railway + Vercel provide it) and the
  exact origin in `CORS_ORIGIN` — the API sets `SameSite=None; Secure` in prod.

## 6. Seed demo content (optional)
From your machine, with `Backend/.env` pointed at the production `MONGODB_URI`:
```bash
cd Backend
# Use absolute video URLs so they load from the deployed frontend:
ASSET_BASE_URL=https://<your-frontend>.vercel.app npm run seed
```
This adds 3 demo partners + 6 food items (login: `spice@seed.bitetok` / `password123`).

---

## Smoke test checklist
- [ ] `GET /api/health` returns ok
- [ ] Register a user on the live site → lands on the feed
- [ ] Register a partner → upload a video → it appears in the feed
- [ ] Like / save / comment persist after refresh
- [ ] Search and tag filters work
