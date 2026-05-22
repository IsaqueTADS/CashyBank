# CashyBank

API de controle financeiro pessoal para gerenciamento de transações (receitas e despesas), com autenticação JWT, categorização, paginação e filtros.

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js 24.x |
| Linguagem | TypeScript 5.9 |
| Framework | Fastify 5.8 |
| Validação | Zod 4 + fastify-type-provider-zod |
| ORM | Prisma 7 |
| Banco | PostgreSQL |
| Autenticação | @fastify/jwt (HS256) |
| Hash de senha | argon2 |
| Logger | pino-pretty |
| Linter / Formatter | Biome |
| Testes | Vitest + supertest |
| Build | tsup |
| IDs | UUID v7 (ordenável) |
| Documentação | Scalar (@scalar/fastify-api-reference) |

## Funcionalidades

- **Cadastro de usuário** — nome, email e senha com hash argon2
- **Autenticação** — login com geração de token JWT (validade de 365 dias)
- **CRUD de transações** — criação, listagem, atualização e exclusão lógica (soft delete)
- **Tipos de transação** — Entrada / Saída (seeds)
- **Categorias** — Casa, Academia, Saúde, Aluguel, Trabalho, Freelance, Emergência, Reforma (seeds)
- **Paginação e filtros** — por data, tipo, categoria, texto de busca e ordenação
- **Totais** — cálculo de receita, despesa e saldo total

## Pré-requisitos

- Node.js 24.x
- pnpm
- Docker (para o banco PostgreSQL)

## Como executar

### 1. Clone e instale dependências

```bash
pnpm install
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/cashybank?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
API_URL="http://localhost:3333"
PORT=3333
```

### 3. Suba o PostgreSQL com Docker

```bash
docker compose up -d
```

### 4. Execute as migrações e seed

```bash
pnpm db:migrate
pnpm db:seed
```

### 5. Inicie o servidor

```bash
pnpm dev
```

A API estará disponível em `http://localhost:3333`.

## Documentação das rotas

Acesse `http://localhost:3333/docs` para explorar a documentação interativa (Scalar).

### Rotas públicas

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastro de usuário |
| POST | `/auth/login` | Autenticação |

### Rotas autenticadas (Bearer token)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/transaction/categories` | Listar tipos e categorias |
| GET | `/transaction` | Listar transações (com paginação e filtros) |
| POST | `/transaction` | Criar transação |
| PUT | `/transaction` | Atualizar transação |
| DELETE | `/transaction/:id` | Excluir transação (soft delete) |

### Parâmetros de query (GET /transaction)

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `page` | number | Número da página (default: 1) |
| `perPage` | number | Itens por página (default: 10, max: 100) |
| `from` | string (ISO) | Filtro data inicial |
| `to` | string (ISO) | Filtro data final |
| `typeId` | UUID | Filtro por tipo |
| `categoryIds` | string | IDs separados por vírgula |
| `searchText` | string | Busca por valor ou descrição |
| `sortId` | ASC / DESC | Ordenação |

## Testes

### Testes unitários

```bash
pnpm test
```

### Testes e2e

```bash
pnpm test:e2e
```

### Testes com coverage

```bash
pnpm test:coverage
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Inicia servidor em modo desenvolvimento (hot reload) |
| `pnpm build` | Compila com tsup para produção |
| `pnpm start` | Inicia servidor em produção |
| `pnpm db:migrate` | Executa migrações do Prisma |
| `pnpm db:seed` | Popula tipos e categorias |
| `pnpm db:studio` | Abre Prisma Studio para visualizar dados |
| `pnpm test` | Executa testes unitários |
| `pnpm test:e2e` | Executa testes end-to-end |

## Estrutura do projeto

```
src/
├── @types/              # Extensão de tipos do Fastify JWT
├── app.ts               # Configuração do servidor Fastify
├── server.ts            # Entry point
├── env/                 # Validação de variáveis de ambiente (Zod)
├── lib/prisma.ts        # Instância do Prisma Client
├── dtos/                # Interfaces dos dados (User, Transaction)
├── http/
│   ├── controllers/     # Rotas e controllers (users, transactions)
│   ├── middlewares/      # verify-jwt
│   ├── plugins/         # cors, jwt, swagger, error-handler
│   └── schemas/         # Schemas Zod de validação
├── repositories/        # Interfaces e implementações (Prisma + InMemory)
└── use-cases/           # Casos de uso + factories + testes
```
