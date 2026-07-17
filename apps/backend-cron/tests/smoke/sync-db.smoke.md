# Smoke sync:database

1. Run: `npm run sync:prices -w @evast/backend-cron`
2. Verify `price` table updated.
3. Verify `status` table with `id=1` and `last_check` updated.
4. Register result on issue #67 comment.
