# CashyBank — AGENTS.md

## Commands

```bash
pnpm dev            # dev server (tsx --env-file .env --watch)
pnpm build          # tsup → build/
pnpm test           # vitest run --project unit
pnpm test:e2e       # dotenv -e .env.test -- vitest run --project e2e
pnpm test:coverage  # dotenv -e .env.test -- vitest run --coverage
pnpm db:migrate     # prisma migrate dev
pnpm db:migrate:deploy  # prisma migrate deploy (CI)
pnpm db:seed        # tsx prisma/seed.ts
pnpm db:generate    # prisma generate
pnpm db:studio      # prisma studio
pnpm db:status      # prisma migrate status
pnpm db:test:migrate    # migrate test DB (.env.test)
pnpm db:test:migrate:deploy  # deploy test migrations
pnpm db:test:seed   # seed test DB
pnpm db:test:studio # studio on test DB
```

## Test quirks

- **Unit tests** live in `src/use-cases/*.test.ts`. Run with `pnpm test`.
- **E2e tests** live in `src/http/controllers/**/*.test.ts`. Run with `pnpm test:e2e`.
- E2e tests require a running PostgreSQL with `DATABASE_URL` from `.env.test`. The custom vitest environment (`prisma/vitest-environment-prisma/`) truncates tables before each run.
- File parallelism is disabled in vitest config.

## Architecture

```
src/
├── app.ts              # Fastify app factory (plugins + routes)
├── server.ts           # Entry point
├── env/index.ts        # Zod-validated env vars
├── dtos/               # Data transfer interfaces (User, Transaction)
├── http/
│   ├── controllers/    # Route handlers by domain (users/, transactions/)
│   ├── middlewares/     # verify-jwt (uses @fastify/jwt)
│   ├── plugins/        # Fastify plugins (cors, jwt, swagger, error-handler)
│   └── schemas/        # Zod schemas for request/response validation
├── repositories/       # Interfaces + implementations (Prisma, InMemory for tests)
└── use-cases/          # Business logic, factories, errors, unit tests
```

## Patterns & conventions

- **ESM**: `type: "module"` in package.json. All imports use `.js` extension (tsx resolves them).
- **Path alias**: `@/*` → `./src/*` (configured in tsconfig paths).
- **Biome** handles both formatting and linting. No ESLint/Prettier. Config: `biome.json` (single quotes, no semicolons, organize imports on save).
- **Prisma client** is generated to `src/generated/prisma/`.
- **UUID v7** for all entity IDs (generated via `uuidv7` package in repositories).
- **Soft delete** on transactions (`deleted_at` column, filtered in queries).

## Auth

- `@fastify/jwt` with HS256, 365d expiry.
- Token is sent as `Authorization: Bearer <token>`.
- JWT payload: `{ sub: string, email: string }`.
- Verify middleware at `src/http/middlewares/verify-jwt.ts`.

## Database

- PostgreSQL via docker-compose (`bitnami/postgresql` image).
- `docker compose up -d` to start.
- Test DB name: `cashybank_test` (created via `docker/setup.sql`).
- Seed data: 2 transaction types (Entrada/Saída) and 8 categories (Casa, Academia, etc.).

## Branch strategy

- All development on `dev` branch.
- `main` receives changes only via pull requests.

## Conventional commits

Required format: `type: description` in English. User must approve before commit.
