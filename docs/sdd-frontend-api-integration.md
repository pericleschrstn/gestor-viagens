# SDD: Integração Front-end ↔ API

> Spec-Driven Development — documento de referência para evolução da integração entre `apps/web` e `apps/api`.

## Contexto

O Gestor de Viagens é um monorepo com:

- **API** (`apps/api`): NestJS + TypeORM + JWT
- **Web** (`apps/web`): Next.js 16 App Router + React 19

Hoje o frontend consome payloads da API diretamente via `lib/api/types.ts`, acoplando UI ao contrato de transporte. A tela de gastos (`/trips/[tripId]/expenses`) ainda é placeholder.

## Metas

1. Frontend **não conhece** payloads da API — apenas modelos de domínio validados.
2. Contrato HTTP versionado em OpenAPI (`docs/openapi.json`).
3. Arquitetura **Feature-Based** com Service Layer + Repository Pattern.
4. **Zod** na fronteira API → Domínio.
5. **Result Pattern** em Server Actions (`{ ok: true, data } | { ok: false, error }`).
6. **RBAC** por viagem: `OWNER`, `EDITOR`, `VIEWER`.
7. **React Query** na tela de gastos para responsividade.
8. **Composition Pattern** em componentes grandes.
9. Boundaries Next.js (`loading.tsx`, `error.tsx`) em rotas críticas.

## Não-metas (escopo atual)

- Geração automática de client OpenAPI no CI (fase futura).
- Colaboração multi-usuário com convites por e-mail.
- Offline-first / PWA.
- Testes E2E completos.

## Arquitetura alvo

```
apps/web/features/
├── shared/
│   ├── domain/       # Result, DomainError, Capabilities
│   └── infra/        # HttpClient (wrapper serverFetch), access.mapper
├── expenses/
│   ├── domain/       # Models, Zod schemas, Repository interface
│   ├── application/  # ExpensesService (use cases)
│   ├── infra/        # Api DTOs, mappers, Repository impl
│   ├── actions/      # Server Actions (Result Pattern)
│   └── ui/           # Compound components + React Query hooks
├── budget/           # Orçamento — summary (leitura) + updateBudget (mutação)
│   ├── domain/ application/ infra/ actions/ ui/
├── members/          # Integrantes — listagem + CRUD (gate canManageMembers)
│   ├── domain/ application/ infra/ actions/ ui/
└── settlements/      # Divisão — balances + suggested (leitura) + settle (mutação)
    ├── domain/ application/ infra/ actions/ ui/
```

As features `budget` e `settlements` seguem o mesmo padrão de `expenses`
(fatia vertical, mapper Zod na fronteira, Result Pattern, server-gate na page,
React Query na UI). São telas majoritariamente de leitura (SSR alimenta o
`initialData` do React Query), com uma mutação cada.

### Regras de dependência

| Camada        | Pode importar              | Não pode importar        |
|---------------|----------------------------|--------------------------|
| `ui/`         | `domain/`, `application/`  | `infra/`, tipos OpenAPI  |
| `application/`| `domain/`                  | `ui/`                    |
| `infra/`      | `domain/`, HTTP client     | `ui/`                    |
| `actions/`    | `application/`, `domain/`  | `ui/`                    |

### Fluxo de dados

```
OpenAPI (docs/openapi.json)
    → Infra Repository (fetch + parse)
    → Zod Mapper (ApiDTO → DomainModel)
    → Application Service
    → Server Action / React Query Hook
    → UI (compound components)
```

## RBAC por viagem

| Papel   | Leitura | Escrita gastos | Orçamento | Membros | Excluir viagem |
|---------|---------|----------------|-----------|---------|----------------|
| OWNER   | ✓       | ✓              | ✓         | ✓       | ✓              |
| EDITOR  | ✓       | ✓              | ✓         | ✗       | ✗              |
| VIEWER  | ✓       | ✗              | ✗         | ✗       | ✗              |

- Dono da viagem (`trips.owner_id`) recebe papel `OWNER` implicitamente.
- Membros com `user_id` vinculado possuem `role` em `trip_members`.
- UI bloqueia ações via **capabilities** derivadas do papel, não por endpoint.
- Capabilities expostas: `canRead`, `canWrite`, `canManageMembers`,
  `canManageBudget`, `canManageSettlements`, `canDeleteTrip`.
- Mutações com gate: `PUT /trips/:id/budget` (`canManageBudget`, "Editar
  orçamento") e `POST /trips/:id/settlements/settle` (`canManageSettlements`,
  "Marcar como quitado").

## Result Pattern

```typescript
type Result<T, E = DomainError> =
  | { ok: true; data: T }
  | { ok: false; error: E }
```

Server Actions retornam `Result` — nunca lançam exceção para o client.

## React Query

- Gastos — query key `['expenses', tripId, filters]`; `staleTime` 30s, `gcTime`
  5min; optimistic update controlado em delete.
- Orçamento — query key `['budget', tripId]`; `initialData` vem do SSR da page;
  `updateBudget` faz **invalidação seletiva** dessa key.
- Divisão — query keys `['settlements', tripId, 'balances']` e
  `['settlements', tripId, 'suggested']`; `settle` invalida `['settlements',
  tripId]`.
- **Invalidação seletiva é o padrão** — nunca `router.refresh()`. Dados SSR de
  outra rota (ex.: summary do dashboard no layout) podem ficar stale até
  re-navegação; tradeoff aceito.

## Milestones

1. ✅ Contrato OpenAPI + SDD em `/docs`
2. ✅ RBAC backend + endpoint `/trips/:id/access`
3. ✅ Foundation feature `expenses`
4. ✅ Tela de gastos + React Query + boundaries
5. ✅ Expansão: budget, division, trips e members (settings + mutações)
6. ✅ Testes de contrato + lint de fronteiras

## Referências

- [ADR: Fronteira domínio/transporte](./adr/adr-frontend-api-boundary.md)
- [ADR: RBAC por viagem](./adr/adr-rbac-trip-roles.md)
- [ADR: React Query na tela de gastos](./adr/adr-react-query-expenses.md)
- [OpenAPI](./openapi.json)
