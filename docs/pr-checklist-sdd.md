# Checklist de PR — SDD Frontend/API

- [ ] OpenAPI atualizado em `docs/openapi.json` (se endpoints mudaram)
- [ ] Mappers Zod cobrem novos campos de resposta
- [ ] Server Actions retornam `Result<T>` tipado
- [ ] UI não importa de `features/*/infra` ou tipos de transporte
- [ ] RBAC: permissões verificadas no backend e capabilities no frontend
- [ ] Rotas com dados assíncronos possuem `loading.tsx` e `error.tsx`
- [ ] Testes de mapper/RBAC incluídos quando aplicável
