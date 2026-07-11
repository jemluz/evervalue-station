# Monorepo migration plan

1. Create workspace root config (`pnpm-workspace.yaml`, `tsconfig.base.json`).
2. Move current web app to `apps/web`.
3. Create `apps/backend-cron` with worker structure.
4. Extract shared types/schemas to `packages/shared`.
5. Add `.github/workflows/sync-prices.yml`.
