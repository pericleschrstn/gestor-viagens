# ADR: RBAC por Viagem

## Status

Aceito

## Contexto

Autorização era binária: apenas o dono (`trips.owner_id`) acessava a viagem. Colaboradores com `user_id` em `trip_members` não tinham acesso autenticado.

## Decisão

Introduzir papéis por viagem:

| Papel   | Descrição                                      |
|---------|------------------------------------------------|
| OWNER   | Dono da viagem (implícito via `owner_id`)      |
| EDITOR  | Pode ler e modificar gastos e orçamento        |
| VIEWER  | Somente leitura                                |

Implementação:

- Enum `TripMemberRole` em `trip_members.role` (nullable para membros sem login).
- `TripRbacService` centraliza resolução de papel e permissões.
- `TripRbacGuard` substitui checagem exclusiva de ownership.
- Endpoint `GET /trips/:id/access` expõe `{ role, permissions }` para o frontend.

## Consequências

- Serviços usam `userId` + `TripPermission` em vez de `ownerId`.
- Frontend deriva capabilities da resposta de access, não de lógica duplicada.
- Migração adiciona coluna `role` sem quebrar dados existentes.

## Alternativas rejeitadas

- Papéis globais (`ADMIN/USER`): não atende colaboração por viagem.
- RBAC apenas no frontend: inseguro.
