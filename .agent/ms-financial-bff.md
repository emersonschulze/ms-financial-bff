# ms-financial-bff — Agent Context

## Project Type
BFF (Backend For Frontend) — Next.js 15 + TypeScript

## Purpose
Routes Account, Category, and Transaction CRUD requests from the frontend to ms-financial-process.
No business logic lives here — only routing, auth, and shape adaptation.

## Port
- Dev: 3004
- Docker: exposes 3000 (standalone Next.js)

## Architecture Layer
```
Frontend → ms-financial-bff (this service) → ms-financial-process
```

## Environment Variables
| Variable               | Description                             | Default                  |
|------------------------|-----------------------------------------|--------------------------|
| FINANCIAL_PROCESS_URL  | Base URL for ms-financial-process       | http://localhost:5006     |
| KEYCLOAK_URL           | Keycloak server URL                     | http://localhost:8080     |
| KEYCLOAK_REALM         | Keycloak realm name                     | sigfaz                   |
| KEYCLOAK_CLIENT_ID     | Client ID registered in Keycloak        | financial-bff            |
| FRONTEND_URL           | Allowed CORS origin                     | http://localhost:3000     |
| NEXT_PUBLIC_APP_ENV    | App environment label                   | development              |

## API Endpoints
| Method | Path                          | Auth | Description               |
|--------|-------------------------------|------|---------------------------|
| GET    | /api/health                   | No   | Health check              |
| GET    | /api/docs                     | No   | OpenAPI JSON spec         |
| GET    | /docs                         | No   | Swagger UI                |
| GET    | /api/v1/accounts              | JWT  | List all accounts         |
| POST   | /api/v1/accounts              | JWT  | Create account (201)      |
| GET    | /api/v1/accounts/{id}         | JWT  | Get account by ID         |
| PUT    | /api/v1/accounts/{id}         | JWT  | Update account            |
| DELETE | /api/v1/accounts/{id}         | JWT  | Delete account (204)      |
| GET    | /api/v1/categories            | JWT  | List all categories       |
| POST   | /api/v1/categories            | JWT  | Create category (201)     |
| GET    | /api/v1/categories/{id}       | JWT  | Get category by ID        |
| PUT    | /api/v1/categories/{id}       | JWT  | Update category           |
| DELETE | /api/v1/categories/{id}       | JWT  | Delete category (204)     |
| GET    | /api/v1/transactions          | JWT  | List all transactions     |
| POST   | /api/v1/transactions          | JWT  | Create transaction (201)  |
| GET    | /api/v1/transactions/{id}     | JWT  | Get transaction by ID     |
| PUT    | /api/v1/transactions/{id}     | JWT  | Update transaction        |
| DELETE | /api/v1/transactions/{id}     | JWT  | Delete transaction (204)  |

## Auth
JWT verification via Keycloak JWKS (jose library).
- Cookie `access_token` takes precedence over `Authorization: Bearer` header.
- Public routes: `/api/health`, `/api/docs`, `/docs`.

## Key Files
- `src/middleware.ts` — JWT guard for all `/api/*` and `/docs` routes
- `src/lib/http-client.ts` — Typed fetch wrappers (httpGet/Post/Put/Delete)
- `src/lib/jwt.ts` — Token verification against Keycloak JWKS
- `src/lib/keycloak.ts` — Keycloak URL builders
- `src/lib/logger.ts` — Structured JSON logger
- `src/lib/openapi.ts` — OpenAPI 3.0 spec definition
- `src/types/financial.types.ts` — All domain types (AccountModel, CategoryModel, TransactionModel, requests)
- `src/services/account.service.ts` — HTTP calls to ms-financial-process (account CRUD)
- `src/services/category.service.ts` — HTTP calls to ms-financial-process (category CRUD)
- `src/services/transaction.service.ts` — HTTP calls to ms-financial-process (transaction CRUD)
- `src/adapters/account.adapter.ts` — Pass-through adapter (frontend isolation)
- `src/adapters/category.adapter.ts` — Pass-through adapter (frontend isolation)
- `src/adapters/transaction.adapter.ts` — Pass-through adapter (frontend isolation)

## Coding Standards
- All code in English
- No business logic in BFF layer
- Routes log request received and completed with structured logger
- `handleError` helper in each route file for consistent error handling
- Next.js 15 dynamic params are Promises: `const { id } = await params`
- Test coverage minimum: 90%
