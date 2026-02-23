# Wanna Be Millionaire API

A secure idea management REST API built with Express, TypeScript, and Prisma.

## Tech Stack

- **Runtime** — Node.js + Express 5
- **Language** — TypeScript
- **Database** — SQLite (dev) / PostgreSQL (prod)
- **ORM** — Prisma 7
- **Auth** — JWT in httpOnly cookies
- **Validation** — Zod v4
- **Logging** — Pino
- **Security** — Helmet + CORS

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/adityamishra3/wanna-be-millionaire
cd wanna-be-millionaire
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Database Setup

```bash
npm run migrate     # run migrations
npm run generate    # generate Prisma client
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## API Endpoints

### Health

| Method | Endpoint  | Auth | Description        |
|--------|-----------|------|--------------------|
| GET    | /health   | ❌   | Check server health |

### Auth

| Method | Endpoint        | Auth | Description              |
|--------|-----------------|------|--------------------------|
| POST   | /auth/register  | ❌   | Register a new user      |
| POST   | /auth/login     | ❌   | Login and receive cookie |

#### POST /auth/register
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### POST /auth/login
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
or
```json
{
  "username": "johndoe",
  "password": "secret123"
}
```

### Users

| Method | Endpoint  | Auth  | Role  | Description      |
|--------|-----------|-------|-------|------------------|
| GET    | /users    | ✅    | ADMIN | Get all users    |
| POST   | /users    | ❌    | -     | Create a user    |

### Ideas

| Method | Endpoint    | Auth | Role  | Description               |
|--------|-------------|------|-------|---------------------------|
| GET    | /idea/me    | ✅   | USER  | Get logged in user's ideas |
| POST   | /idea       | ✅   | USER  | Create a new idea          |
| GET    | /idea/all   | ✅   | ADMIN | Get all ideas              |

---

## Auth Flow

Authentication uses JWT stored in an `httpOnly` cookie.

1. Register or login via `/auth/register` or `/auth/login`
2. Cookie is automatically set in the browser
3. All protected routes read the cookie automatically
4. No need to manually set Authorization headers

---

## Roles

| Role  | Permissions                        |
|-------|------------------------------------|
| USER  | Manage own ideas                   |
| ADMIN | Access all users and all ideas     |

---

## Project Structure

```
src/
  controllers/     — HTTP request/response handling
  services/        — Business logic and DB calls
  routes/          — Route definitions
  middlewares/     — Auth, role, error middleware
  types/           — TypeScript types and interfaces
  utils/           — Logger, JWT, hashing, errors
  validations/     — Zod schemas
config/
  prisma.ts        — Prisma singleton
prisma/
  schema.prisma    — Database schema
generated/
  prisma/          — Auto-generated Prisma client
```

---

## Error Handling

All errors are handled by a global error middleware. Custom error classes with HTTP status codes:

| Error Class        | Status Code |
|--------------------|-------------|
| NotFoundError      | 404         |
| UnauthorizedError  | 401         |
| ForbiddenError     | 403         |
| AppError           | custom      |

---

## Scripts

```bash
npm run dev       # start dev server with nodemon
npm run build     # compile TypeScript
npm run start     # run compiled JS
npm run migrate   # run Prisma migrations
npm run studio    # open Prisma Studio
npm run generate  # regenerate Prisma client
npm run format    # format Prisma schema
```