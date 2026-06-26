# Essential Setup
- `npm install` to pull in Prisma 7 and TypeScript 5 deps.
- Create `.env` from `.env.example` and set `DATABASE_URL` and `JWT_SECRET`.
- Initialize database: `npx prisma migrate dev --name init`.

## Development
- Start dev: `npm run dev` (Next.js 16).
- Build: `npm run build` (runs `prisma generate` first).
- Lint: `npm run lint` (ESLint).

## Project Layout
- API routes: `app/api/*` (auth, jobs).
- Dashboard UI: `app/dashboard/page.tsx`.
- Prisma schema: `prisma/schema.prisma`.

## Runners
- SQL migrations are run via Prisma CLI.
- Prisma client types generated into `app/generated/prisma` (run `prisma generate`).

## Auth Flow
- Token helper in `lib/prisma.ts`; token stored in `localStorage`.
- All API routes guard by checking `Authorization: Bearer <token>`.

## Common Pitfalls
- Forgetting `prisma generate` after schema changes.
- Not adding `DATABASE_URL` before `npm run dev`.
- Using wrong Prisma client path (use `app/generated/prisma/client`).

# CI & Testing
- No tests in repo; focus is on lint and linting only.