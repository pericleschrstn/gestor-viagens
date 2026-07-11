# ADR: React Query na Tela de Gastos

## Status

Aceito

## Contexto

A tela de gastos era placeholder. O dashboard carregava gastos via SSR no layout (`getTripSummary`) e usava `router.refresh()` após mutações — bloqueando interação e recarregando toda a árvore.

## Decisão

Usar **TanStack React Query** exclusivamente na feature `expenses`:

| Aspecto        | Configuração                                      |
|----------------|---------------------------------------------------|
| Query key      | `['expenses', tripId, filters]`                   |
| staleTime      | 30 segundos                                       |
| gcTime         | 5 minutos                                         |
| Mutations      | Invalidação seletiva de `['expenses', tripId]`    |
| Optimistic     | Delete com rollback em erro                       |
| SSR boundary   | `loading.tsx` / `error.tsx` no segmento         |

Server Actions continuam como caminho de mutação (Result Pattern); hooks invalidam cache após sucesso.

## Consequências

- `QueryClientProvider` no layout autenticado.
- Dashboard mantém SSR summary; lista completa de gastos é client-side.
- Formulário de novo gasto invalida cache de expenses (não `router.refresh()`).

## Alternativas rejeitadas

- **SWR**: menos controle sobre optimistic updates.
- **100% SSR**: UX menos responsiva em filtros/paginação.
