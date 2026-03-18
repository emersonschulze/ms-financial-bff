# ms-financial-bff

Next.js 15 BFF (Backend For Frontend) layer that routes Account, Category, and Transaction CRUD requests from the frontend to `ms-financial-process`. Contains no business logic — only routing, JWT authentication, and shape adaptation.

## Architecture

```
Frontend → ms-financial-bff (this service) → ms-financial-process → PostgreSQL
```

## Stack

- **Runtime:** Node.js 22
- **Framework:** Next.js 15 (App Router, standalone output)
- **Language:** TypeScript 5
- **Auth:** Keycloak JWT via `jose`
- **Docs:** Swagger UI + OpenAPI 3.0
- **Port:** 3004 (dev), 3000 (Docker)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable               | Description                       | Default                  |
|------------------------|-----------------------------------|--------------------------|
| `FINANCIAL_PROCESS_URL`| Base URL for ms-financial-process | `http://localhost:5006`  |
| `KEYCLOAK_URL`         | Keycloak server URL               | `http://localhost:8080`  |
| `KEYCLOAK_REALM`       | Keycloak realm name               | `sigfaz`                 |
| `KEYCLOAK_CLIENT_ID`   | Client ID registered in Keycloak  | `financial-bff`          |
| `FRONTEND_URL`         | Allowed CORS origin               | `http://localhost:3000`  |
| `NEXT_PUBLIC_APP_ENV`  | App environment label             | `development`            |

## Getting Started

```bash
cp .env.example .env.local
npm install
npm run dev
```

API available at `http://localhost:3004`
Swagger UI at `http://localhost:3004/docs`

## API Endpoints

| Method | Path                        | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| GET    | /api/health                 | No   | Health check             |
| GET    | /api/docs                   | No   | OpenAPI JSON spec        |
| GET    | /docs                       | No   | Swagger UI               |
| GET    | /api/v1/accounts            | JWT  | List all accounts        |
| POST   | /api/v1/accounts            | JWT  | Create account (201)     |
| GET    | /api/v1/accounts/{id}       | JWT  | Get account by ID        |
| PUT    | /api/v1/accounts/{id}       | JWT  | Update account           |
| DELETE | /api/v1/accounts/{id}       | JWT  | Delete account (204)     |
| GET    | /api/v1/categories          | JWT  | List all categories      |
| POST   | /api/v1/categories          | JWT  | Create category (201)    |
| GET    | /api/v1/categories/{id}     | JWT  | Get category by ID       |
| PUT    | /api/v1/categories/{id}     | JWT  | Update category          |
| DELETE | /api/v1/categories/{id}     | JWT  | Delete category (204)    |
| GET    | /api/v1/transactions        | JWT  | List all transactions    |
| POST   | /api/v1/transactions        | JWT  | Create transaction (201) |
| GET    | /api/v1/transactions/{id}   | JWT  | Get transaction by ID    |
| PUT    | /api/v1/transactions/{id}   | JWT  | Update transaction       |
| DELETE | /api/v1/transactions/{id}   | JWT  | Delete transaction (204) |

## Scripts

```bash
npm run dev          # Start dev server on port 3004
npm run build        # Build for production
npm run start        # Start production server on port 3004
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
npm run test         # Run tests (vitest)
npm run test:coverage # Run tests with coverage report
```

## Docker

```bash
docker build -t ms-financial-bff .
docker run -p 3004:3000 --env-file .env.local ms-financial-bff
```
