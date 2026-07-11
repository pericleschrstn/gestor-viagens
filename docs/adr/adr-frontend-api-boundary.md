# ADR: Fronteira Domínio / Transporte

## Status

Aceito

## Contexto

O frontend importava tipos de `lib/api/types.ts` diretamente nos componentes, acoplando UI ao formato JSON da API NestJS/TypeORM.

## Decisão

Adotar abordagem **híbrida**:

1. **OpenAPI** (`docs/openapi.json`) como fonte de verdade do contrato HTTP.
2. **Camada infra** isola tipos de transporte (DTOs JSON).
3. **Zod** valida e mapeia `ApiDTO → DomainModel` na fronteira.
4. **UI** consome apenas modelos de domínio e capabilities.

## Consequências

- Mudanças na API exigem atualizar OpenAPI + mappers Zod.
- Componentes ficam testáveis com dados de domínio mockados.
- ESLint impede imports de `features/*/infra` a partir de `features/*/ui`.

## Alternativas rejeitadas

- **OpenAPI-only no front**: UI ainda acoplada a nomes/campos da API.
- **Zod-only sem OpenAPI**: contrato duplicado manualmente.
