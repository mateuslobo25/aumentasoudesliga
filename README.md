# Aumentas ou Desligas

Projeto separado em frontend e backend.

## Estrutura

- `frontend/` — React/Vite, páginas, componentes, estilos e área administrativa.
- `backend/` — Express, tRPC, autenticação, uploads, regras administrativas e base de dados.
- `backend/database/` — schema Drizzle e relações.
- `backend/database/migrations/` — migrações e metadados gerados pelo Drizzle.
- `shared/` — tipos e constantes partilhados.

## Instalação

```bash
pnpm install --frozen-lockfile
```

Configure as variáveis de ambiente necessárias num ficheiro `.env` local. Não inclua esse ficheiro no Git.

## Desenvolvimento

```bash
pnpm dev
```

## Validação

```bash
pnpm check
pnpm test
pnpm build
```

## Área administrativa

Aceda a `/admin`. O painel inclui gestão de músicas, uploads de áudio e capas, notícias, artistas, categorias, utilizadores, comentários, analytics e definições.

O acesso administrativo deve ser configurado de forma segura no ambiente de execução e protegido por credenciais próprias da aplicação.

Copyright: © 2026 WPAY Solution e Aumentas ou Desligas.
