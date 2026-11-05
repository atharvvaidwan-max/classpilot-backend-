# ClassPilot AI Backend

Backend API foundation for the ClassPilot AI coaching management SaaS.

## Technology
- Node.js 20+
- Express
- PostgreSQL (Supabase)
- Prisma ORM 6

## Current status
- Express API server and health endpoints
- Prisma ORM dependency and PostgreSQL schema
- Organization, user, membership, and session data models
- Database readiness endpoint
- GitHub Actions syntax and Prisma schema validation

Authentication routes, session issuance, authorization middleware, and coaching business APIs are **not implemented yet**. The database schema is only the foundation; do not treat the API as production-ready.

## Setup
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set a private PostgreSQL connection string as `DATABASE_URL`.
5. Run `npm run db:generate`.
6. Run `npm run db:migrate -- --name init`.
7. Run `npm run dev`.

Never commit `.env` or share database passwords, session secrets, or access tokens in chat.

## Health endpoints
- `GET /` — service welcome response
- `GET /api/health` — process liveness
- `GET /api/health/ready` — database readiness (503 until the database is configured and reachable)

## Planned modules
1. Database and migrations
2. Authentication and secure sessions
3. Organizations and role-based access
4. Courses and batches
5. Enquiries and leads
6. Admissions
7. Fees and payments
8. Demo appointments
9. Follow-ups
10. Staff management
11. Dashboard analytics
