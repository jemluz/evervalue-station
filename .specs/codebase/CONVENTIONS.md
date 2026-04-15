# EVA Station — Conventions Map

## Language and Typing

- TypeScript-first codebase with `strict: true`
- Shared domain types in `src/types`
- Hook return contracts are explicitly typed

## Imports and Module Resolution

- Path alias `@/*` mapped to `src/*`
- Common import style: grouped external imports first, then internal aliases

## Component and Hook Patterns

- Feature foldering by domain (`components/conversor`, `components/health`)
- Context + custom hook pattern for feature state (`ConversorContext`)
- Business logic sits in hooks; components are mostly presentational/compositional

## Styling and UI System

- Tailwind CSS utility classes
- shadcn-compatible setup in `components.json`
- Shared class merge utility (`cn`) in `src/lib/utils.ts`
- Tokens and CSS variables centralized in `src/app/globals.css`

## Lint and Formatting

- ESLint with Next.js core-web-vitals and TS presets
- Prettier integrated in npm scripts
- Expected commands:
  - `npm run lint`
  - `npm run lint:check`
  - `npm run lint:fix`

## Git/Workflow (Documented)

- Repo docs define EVAST issue/branch naming and squash-merge strategy
- Commit convention references semantic commit style with issue/sub-issue codes
