# Shorten.it — URL Shortener

Modern URL shortener built with Next.js 14 (App Router) + TypeScript, Prisma + SQLite, NextAuth (Credentials), Tailwind in a dark glass theme, shadcn-style UI, zod, nanoid, qrcode, and dayjs.

## Prerequisites

- Node.js 20+
- npm 9+ (or pnpm/yarn if you prefer)

## 1) Project Setup (npm)

1. Install dependencies

```
npm install
```

2. Create environment file

```
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

3. Edit `.env` (root of the project)

```
NEXTAUTH_SECRET=replace-with-strong-secret
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

4. Generate Prisma client, create DB, and apply migrations

```
npx prisma generate
npx prisma migrate dev --name init
```

5. Seed demo data (demo user + sample links)

```
npx prisma db seed
```

6. Run the dev server

```
npm run dev
```

Open http://localhost:3000

## Demo Credentials

- Email: `demo@example.com`
- Password: `password123`

## 2) Git & GitHub (push this project)

1. Initialize a repository

```
git init
```

2. Review `.gitignore`

- This repo includes `.gitignore` to exclude `node_modules`, `.env`, and the local SQLite DB (`prisma/dev.db`).

3. Create first commit

```
git add .
git commit -m "chore: initial commit"
```

4. Create a new GitHub repository

- Go to https://github.com/new and create an empty repo (no README/license).
- Copy the repo URL, e.g. `https://github.com/<your-user>/<repo>.git` or SSH `git@github.com:<your-user>/<repo>.git`.

5. Add remote and push

```
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

## Features

- Credentials auth (email + password, bcrypt hashing)
- Dashboard with link management: copy, open, edit (alias/title/expiry), toggle active, delete
- Shorten API with per-IP, in-memory rate limit (10/min)
- Public redirect `/r/[slug]` (301) with click tracking (timestamp, referer, user-agent)
- Optional page-title autofetch (2s timeout), optional expiration
- On-the-fly QR PNG per link
- Dark glassmorphism UI using Tailwind

## Smoke-test Checklist

- Sign up a new user (or use demo credentials)
- Sign in and open Dashboard
- Create a short link from the landing page; link copies to clipboard
- Visit `/r/[slug]` and confirm redirect
- Refresh dashboard and see clicks increment
- Edit alias/title; confirm short URL updates
- Toggle active/inactive; verify inactive shows pretty 404
- Delete a link; confirm it disappears
- Open QR for a link; PNG renders

## Troubleshooting

- “Environment variable not found: DATABASE_URL”
  - Ensure `.env` exists and contains `DATABASE_URL="file:./dev.db"`.
  - Re-run: `npx prisma generate`.

- “The table `main.User` does not exist”
  - Run migrations: `npx prisma migrate dev --name init` or reset: `npx prisma migrate reset`.

- Credentials signin fails
  - Verify you created a user (via `/signup` or seed), and that you restarted the dev server after auth changes.

## Notes & Limitations

- In-memory rate limiter resets on server restart
- SQLite is local; not designed for horizontal scaling
- Email verification and password reset are omitted
- All mutating API routes are protected by auth middleware (except `/api/auth/*`, `/api/signup`, and `/r/*`)

## Docker (optional)

Build and run with Docker (DB volume persists locally):

```
docker compose up --build
```
