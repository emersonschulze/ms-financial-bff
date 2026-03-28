# ms-financial-bff

## Stack

- **Runtime:** Node.js (via Next.js standalone output)
- **Framework:** Next.js ^15.0.0
- **Language:** TypeScript ^5.0.0
- **React:** ^19.0.0
- **Auth:** jose ^5.9.6 (JWKS-based JWT verification)
- **Docs:** openapi-types ^12.1.3, swagger-ui-react ^5.32.0
- **Testing:** vitest ^2.0.0, @vitest/coverage-v8 ^2.0.0
- **Linting:** eslint ^9.0.0, eslint-config-next ^15.0.0
- **Build output:** standalone (Next.js `output: 'standalone'`)

## Architecture

This service is the **BFF (Backend For Frontend)** layer for the financial domain. It sits between the frontend (SigfazWeb, port 3000) and the business logic layer (ms-financial-process, port 5006).

```
Frontend (port 3000) → ms-financial-bff (port 3004) → ms-financial-process (port 5006)
```

Responsibilities:
- Enforce JWT authentication via Keycloak JWKS on all protected routes
- Forward CRUD requests to ms-financial-process with no business logic of its own
- Adapt responses through pass-through adapters (frontend isolation layer)
- Serve OpenAPI documentation (Swagger UI at `/docs`, JSON spec at `/api/docs`)
- Apply CORS headers for the frontend origin

The BFF must never call another BFF and must never access a database directly.

## Project Structure

```
src/
├── middleware.ts                         — JWT guard applied to /api/* and /docs
├── app/
│   ├── layout.tsx                        — Root Next.js layout
│   ├── docs/
│   │   └── page.tsx                      — Swagger UI page
│   └── api/
│       ├── health/route.ts               — GET /api/health
│       ├── docs/route.ts                 — GET /api/docs (OpenAPI JSON)
│       └── v1/
│           ├── accounts/
│           │   ├── route.ts              — GET, POST /api/v1/accounts
│           │   └── [id]/route.ts         — GET, PUT, DELETE /api/v1/accounts/[id]
│           ├── categories/
│           │   ├── route.ts              — GET, POST /api/v1/categories
│           │   └── [id]/route.ts         — GET, PUT, DELETE /api/v1/categories/[id]
│           ├── transactions/
│           │   ├── route.ts              — GET, POST /api/v1/transactions
│           │   └── [id]/route.ts         — GET, PUT, DELETE /api/v1/transactions/[id]
│           ├── modules/
│           │   └── route.ts              — GET /api/v1/modules (public)
│           ├── type-expenses/
│           │   ├── route.ts              — GET, POST /api/v1/type-expenses
│           │   └── [id]/
│           │       ├── route.ts          — GET, PUT /api/v1/type-expenses/[id]
│           │       └── inactivate/route.ts — PATCH /api/v1/type-expenses/[id]/inactivate
│           ├── type-maintenances/
│           │   └── route.ts              — GET /api/v1/type-maintenances (public)
│           ├── product-categories/
│           │   ├── route.ts              — GET, POST /api/v1/product-categories (GET public)
│           │   └── [id]/route.ts         — GET, PUT, DELETE /api/v1/product-categories/[id]
│           ├── product-unit-of-measures/
│           │   └── route.ts              — GET /api/v1/product-unit-of-measures (public)
│           ├── products/
│           │   ├── route.ts              — GET, POST /api/v1/products
│           │   └── [id]/
│           │       ├── route.ts          — GET, PUT /api/v1/products/[id]
│           │       └── inactivate/route.ts — PATCH /api/v1/products/[id]/inactivate
│           ├── expenses/
│           │   ├── route.ts              — GET, POST /api/v1/expenses
│           │   └── [id]/
│           │       ├── route.ts          — GET, PUT, DELETE /api/v1/expenses/[id]
│           │       └── items/route.ts    — GET /api/v1/expenses/[id]/items
│           ├── item-expenses/
│           │   ├── route.ts              — POST /api/v1/item-expenses
│           │   └── [id]/route.ts         — GET, PUT, DELETE /api/v1/item-expenses/[id]
│           └── maintenance-services/
│               ├── route.ts              — GET, POST /api/v1/maintenance-services
│               └── [id]/
│                   ├── route.ts          — GET, PUT /api/v1/maintenance-services/[id]
│                   └── inactivate/route.ts — PATCH /api/v1/maintenance-services/[id]/inactivate
├── services/
│   ├── account.service.ts
│   ├── category.service.ts
│   ├── transaction.service.ts
│   ├── module.service.ts
│   ├── type-expense.service.ts
│   ├── type-maintenance.service.ts
│   ├── product-category.service.ts
│   ├── product-unit-of-measure.service.ts
│   ├── product.service.ts
│   ├── expense.service.ts
│   ├── item-expense.service.ts
│   └── maintenance-service.service.ts
├── adapters/
│   ├── account.adapter.ts
│   ├── category.adapter.ts
│   ├── transaction.adapter.ts
│   ├── module.adapter.ts
│   ├── type-expense.adapter.ts
│   ├── type-maintenance.adapter.ts
│   ├── product-category.adapter.ts
│   ├── product-unit-of-measure.adapter.ts
│   ├── product.adapter.ts
│   ├── expense.adapter.ts
│   ├── item-expense.adapter.ts
│   └── maintenance-service.adapter.ts
├── types/
│   └── financial.types.ts                — All domain TypeScript interfaces
└── lib/
    ├── http-client.ts                    — Typed fetch wrappers (httpGet/Post/Put/Delete/Patch) + HttpError
    ├── jwt.ts                            — Keycloak JWKS token verification (jose)
    ├── keycloak.ts                       — Keycloak URL builders (issuer + jwks endpoints)
    ├── logger.ts                         — Structured JSON logger (info/warn/error)
    └── openapi.ts                        — OpenAPI 3.0 spec definition (accounts, categories, transactions)
```

## Endpoints

### Public (no auth required)

| Method | Path                               | Proxies to (ms-financial-process)                  | Description                          |
|--------|------------------------------------|----------------------------------------------------|--------------------------------------|
| GET    | /api/health                        | —                                                  | Health check                         |
| GET    | /api/docs                          | —                                                  | OpenAPI JSON spec                    |
| GET    | /docs                              | —                                                  | Swagger UI                           |
| GET    | /api/v1/modules                    | GET /api/v1/modules                                | List all modules                     |
| GET    | /api/v1/type-maintenances          | GET /api/v1/type-maintenances                      | List all maintenance types           |
| GET    | /api/v1/product-categories         | GET /api/v1/product-categories                     | List all product categories          |
| GET    | /api/v1/product-unit-of-measures   | GET /api/v1/product-unit-of-measures               | List all units of measure            |

### Protected (JWT required)

#### Accounts
| Method | Path                          | Proxies to                              | Response |
|--------|-------------------------------|-----------------------------------------|----------|
| GET    | /api/v1/accounts              | GET /api/v1/accounts                    | 200      |
| POST   | /api/v1/accounts              | POST /api/v1/accounts                   | 201      |
| GET    | /api/v1/accounts/[id]         | GET /api/v1/accounts/{id}               | 200      |
| PUT    | /api/v1/accounts/[id]         | PUT /api/v1/accounts/{id}               | 200      |
| DELETE | /api/v1/accounts/[id]         | DELETE /api/v1/accounts/{id}            | 204      |

#### Categories
| Method | Path                          | Proxies to                              | Response |
|--------|-------------------------------|-----------------------------------------|----------|
| GET    | /api/v1/categories            | GET /api/v1/categories                  | 200      |
| POST   | /api/v1/categories            | POST /api/v1/categories                 | 201      |
| GET    | /api/v1/categories/[id]       | GET /api/v1/categories/{id}             | 200      |
| PUT    | /api/v1/categories/[id]       | PUT /api/v1/categories/{id}             | 200      |
| DELETE | /api/v1/categories/[id]       | DELETE /api/v1/categories/{id}          | 204      |

#### Transactions
| Method | Path                          | Proxies to                              | Response |
|--------|-------------------------------|-----------------------------------------|----------|
| GET    | /api/v1/transactions          | GET /api/v1/transactions                | 200      |
| POST   | /api/v1/transactions          | POST /api/v1/transactions               | 201      |
| GET    | /api/v1/transactions/[id]     | GET /api/v1/transactions/{id}           | 200      |
| PUT    | /api/v1/transactions/[id]     | PUT /api/v1/transactions/{id}           | 200      |
| DELETE | /api/v1/transactions/[id]     | DELETE /api/v1/transactions/{id}        | 204      |

#### Type Expenses
| Method | Path                                        | Proxies to                                       | Response |
|--------|---------------------------------------------|--------------------------------------------------|----------|
| GET    | /api/v1/type-expenses                       | GET /api/v1/type-expenses                        | 200      |
| POST   | /api/v1/type-expenses                       | POST /api/v1/type-expenses                       | 201      |
| GET    | /api/v1/type-expenses/[id]                  | GET /api/v1/type-expenses/{id}                   | 200      |
| PUT    | /api/v1/type-expenses/[id]                  | PUT /api/v1/type-expenses/{id}                   | 200      |
| PATCH  | /api/v1/type-expenses/[id]/inactivate       | PATCH /api/v1/type-expenses/{id}/inactivate      | 200      |

#### Product Categories
| Method | Path                                | Proxies to                                    | Response |
|--------|-------------------------------------|-----------------------------------------------|----------|
| POST   | /api/v1/product-categories          | POST /api/v1/product-categories               | 201      |
| GET    | /api/v1/product-categories/[id]     | GET /api/v1/product-categories/{id}           | 200      |
| PUT    | /api/v1/product-categories/[id]     | PUT /api/v1/product-categories/{id}           | 200      |
| DELETE | /api/v1/product-categories/[id]     | DELETE /api/v1/product-categories/{id}        | 204      |

#### Products
| Method | Path                                  | Proxies to                                  | Response |
|--------|---------------------------------------|---------------------------------------------|----------|
| GET    | /api/v1/products                      | GET /api/v1/products                        | 200      |
| POST   | /api/v1/products                      | POST /api/v1/products                       | 201      |
| GET    | /api/v1/products/[id]                 | GET /api/v1/products/{id}                   | 200      |
| PUT    | /api/v1/products/[id]                 | PUT /api/v1/products/{id}                   | 200      |
| PATCH  | /api/v1/products/[id]/inactivate      | PATCH /api/v1/products/{id}/inactivate      | 200      |

#### Expenses
| Method | Path                              | Proxies to                              | Response |
|--------|-----------------------------------|-----------------------------------------|----------|
| GET    | /api/v1/expenses                  | GET /api/v1/expenses                    | 200      |
| POST   | /api/v1/expenses                  | POST /api/v1/expenses                   | 201      |
| GET    | /api/v1/expenses/[id]             | GET /api/v1/expenses/{id}               | 200      |
| PUT    | /api/v1/expenses/[id]             | PUT /api/v1/expenses/{id}               | 200      |
| DELETE | /api/v1/expenses/[id]             | DELETE /api/v1/expenses/{id}            | 204      |
| GET    | /api/v1/expenses/[id]/items       | GET /api/v1/expenses/{id}/items         | 200      |

#### Item Expenses
| Method | Path                          | Proxies to                                | Response |
|--------|-------------------------------|-------------------------------------------|----------|
| POST   | /api/v1/item-expenses         | POST /api/v1/item-expenses                | 201      |
| GET    | /api/v1/item-expenses/[id]    | GET /api/v1/item-expenses/{id}            | 200      |
| PUT    | /api/v1/item-expenses/[id]    | PUT /api/v1/item-expenses/{id}            | 200      |
| DELETE | /api/v1/item-expenses/[id]    | DELETE /api/v1/item-expenses/{id}         | 204      |

#### Maintenance Services
| Method | Path                                              | Proxies to                                                 | Response |
|--------|---------------------------------------------------|------------------------------------------------------------|----------|
| GET    | /api/v1/maintenance-services                      | GET /api/v1/maintenance-services                           | 200      |
| POST   | /api/v1/maintenance-services                      | POST /api/v1/maintenance-services                          | 201      |
| GET    | /api/v1/maintenance-services/[id]                 | GET /api/v1/maintenance-services/{id}                      | 200      |
| PUT    | /api/v1/maintenance-services/[id]                 | PUT /api/v1/maintenance-services/{id}                      | 200      |
| PATCH  | /api/v1/maintenance-services/[id]/inactivate      | PATCH /api/v1/maintenance-services/{id}/inactivate         | 200      |

## Types

All types are defined in `src/types/financial.types.ts`.

### Models

```ts
interface AccountModel {
  id: string;                  // UUID
  name: string;
  type: number;                // 1=Checking, 2=Savings, 3=Cash, 4=Credit
  balance: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CategoryModel {
  id: number;
  name: string;
  type: number;                // 1=Income, 2=Expense
  description: string | null;
  createdAt: string;
}

interface TransactionModel {
  id: string;                  // UUID
  accountId: string;
  accountName: string | null;
  categoryId: number;
  categoryName: string | null;
  description: string;
  amount: number;
  type: number;                // 1=Income, 2=Expense
  date: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ModuleModel { id: number; description: string; }

interface TypeExpenseModel {
  id: number;
  description: string;
  moduleId: number;
  moduleDescription: string;
  isActive: boolean;
}

interface TypeMaintenanceModel { id: number; description: string; }

interface ProductUnitOfMeasureModel { id: number; description: string; symbol: string; }

interface ProductCategoryModel { id: number; description: string; }

interface ProductModel {
  id: number;
  description: string;
  productCategoryId: number;
  productCategoryDescription: string;
  productUnitOfMeasureId: number;
  productUnitOfMeasureDescription: string;
  productUnitOfMeasureSymbol: string;
  isActive: boolean;
}

interface ExpenseModel {
  id: number;
  codeExpense: string;
  description: string;
  typeExpenseId: number;
  typeExpenseDescription: string;
  farmId: string;
  purchaseDate: string;
  dueDate: string;
}

interface ItemExpenseModel {
  id: number;
  expenseId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: number;
  productDescription: string;
}

interface MaintenanceServiceModel {
  id: number;
  description: string;
  typeMaintenanceId: number;
  typeMaintenanceDescription: string;
  isActive: boolean;
}
```

### Request types (key ones)

- `CreateAccountRequest` / `UpdateAccountRequest`
- `CreateCategoryRequest` / `UpdateCategoryRequest`
- `CreateTransactionRequest` / `UpdateTransactionRequest`
- `CreateTypeExpenseRequest` / `UpdateTypeExpenseRequest`
- `CreateProductCategoryRequest` / `UpdateProductCategoryRequest`
- `CreateProductRequest` / `UpdateProductRequest`
- `CreateExpenseRequest` / `UpdateExpenseRequest`
- `CreateItemExpenseRequest` / `UpdateItemExpenseRequest`
- `CreateMaintenanceServiceRequest` / `UpdateMaintenanceServiceRequest`

## Environment Variables

| Variable                | Description                                                         | Default                   |
|-------------------------|---------------------------------------------------------------------|---------------------------|
| `FINANCIAL_PROCESS_URL` | Base URL for ms-financial-process (used by all service classes)     | http://localhost:5006      |
| `KEYCLOAK_URL`          | Keycloak public URL (used for JWT `iss` claim validation)           | http://localhost:8080      |
| `KEYCLOAK_INTERNAL_URL` | Keycloak internal URL for Docker (used to fetch JWKS server-side)   | falls back to KEYCLOAK_URL |
| `KEYCLOAK_REALM`        | Keycloak realm name                                                 | sigfaz                    |
| `KEYCLOAK_CLIENT_ID`    | Client ID registered in Keycloak                                    | financial-bff              |
| `FRONTEND_URL`          | Allowed CORS origin (applied via next.config.ts headers)            | http://localhost:3000      |
| `NEXT_PUBLIC_APP_ENV`   | App environment label (public, accessible in browser)               | development               |

Note: `KEYCLOAK_CLIENT_ID` is listed in `.env.example` but is not referenced in the current source code — it may be reserved for future use or OAuth flows.

## Commands

```bash
# Start development server on port 3004
npm run dev

# Build for production (standalone output)
npm run build

# Start production server on port 3004
npm run start

# Run ESLint
npm run lint

# TypeScript type check (no emit)
npm run type-check

# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Patterns & Rules

### Auth Flow
- Middleware (`src/middleware.ts`) matches all `/api/:path*` and `/docs` routes
- Public routes bypass auth: `/api/health`, `/api/docs`, `/docs`, `/api/v1/modules`, `/api/v1/type-maintenances`, `/api/v1/product-categories`, `/api/v1/product-unit-of-measures`
- Cookie `access_token` takes precedence over `Authorization: Bearer` header
- JWKS is fetched lazily on first request via `createRemoteJWKSet` (jose) using `KEYCLOAK_INTERNAL_URL` (for Docker compatibility)
- The JWT `iss` claim is validated against the public `KEYCLOAK_URL` to match what Keycloak embeds in the token
- OPTIONS preflight requests always pass through; CORS headers are applied by `next.config.ts`

### Service Pattern
- Each domain has a dedicated service class (e.g., `ExpenseService`, `ProductService`)
- All services read `FINANCIAL_PROCESS_URL` from `process.env` at module level
- HTTP calls use typed wrappers: `httpGet<T>`, `httpPost<T>`, `httpPut<T>`, `httpPatch<T>`, `httpDelete`
- `HttpError` is thrown by all http-client functions when `response.ok` is false, carrying `status`, `body`, and `url`

### Adapter Pattern
- Every service call result passes through a pass-through adapter before being returned to the frontend
- Adapters are identity functions today (e.g., `adaptExpense(data) => data`) — they exist to isolate the frontend from future shape changes

### Error Handling
- Every route file has a local `handleError(error, context)` function
- `HttpError` is forwarded with the original upstream status and body
- All other errors return `{ error: 'Internal server error' }` with status 500
- Errors are logged via the structured logger before responding

### Logging
- Structured JSON logger writes to stdout via `console.info/warn/error`
- Each log entry contains `level`, `message`, `timestamp`, and optional context fields
- Route handlers log `request received` and `completed` events with relevant IDs

### Next.js 15 Dynamic Params
- Dynamic segment params are typed as `Promise<{ id: string }>` and must be awaited: `const { id } = await params`

### Naming Conventions
- Route files follow the Next.js App Router convention: `src/app/api/v1/[resource]/route.ts`
- Services are named `[Domain]Service` (e.g., `MaintenanceServiceService`)
- Adapters are named `adapt[Domain]` and `adapt[Domain]List`
- All code is written in English

### CORS
- Configured in `next.config.ts` via the `headers()` function
- Applies to all `/api/:path*` routes
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Allowed headers: `Content-Type, Authorization`
- Origin controlled by `FRONTEND_URL` env var
