# Folder structure

## Target monorepo structure

```text
.
├─ apps/
│  ├─ web/                      # current Next.js app
│  └─ backend-cron/
│     ├─ src/
│     │  ├─ main.ts             # synchronization entrypoint
│     │  ├─ config/
│     │  │  └─ env.ts
│     │  ├─ http/
│     │  │  └─ coingecko.client.ts
│     │  ├─ validation/
│     │  │  └─ coingecko.schema.ts
│     │  ├─ db/
│     │  │  ├─ kysely.ts
│     │  │  └─ types.ts
│     │  ├─ repositories/
│     │  │  ├─ price.repository.ts
│     │  │  └─ status.repository.ts
│     │  ├─ services/
│     │  │  └─ sync-prices.service.ts
│     │  └─ jobs/
│     │     └─ run-sync-prices.ts
│     ├─ package.json
│     └─ tsconfig.json
├─ packages/
│  ├─ shared/
│  │  ├─ src/
│  │  │  ├─ constants/
│  │  │  ├─ types/
│  │  │  └─ schemas/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ database/
│     ├─ migrations/
│     ├─ sql/
│     ├─ package.json
│     └─ tsconfig.json
├─ .github/
│  └─ workflows/
│     └─ sync-prices.yml
├─ package.json                 # workspace root
├─ pnpm-workspace.yaml
└─ tsconfig.base.json
```

## Why monorepo ?

- Single source of truth for shared types, schemas, and constants used by Web, Backend I, and Backend II.
- Easier contract evolution: API and domain changes are versioned together in one PR.
- Independent deploys with shared code: each app keeps its own runtime while reusing common packages.
- Better long-term fit for planned on-chain expansion, avoiding duplicated logic across repositories.
