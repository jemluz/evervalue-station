# EVA Station — Stack Map

## Runtime and Language

- TypeScript (`strict: true`)
- Node.js runtime via Next.js scripts
- React 19.2.3
- Next.js 16.2.1 (App Router)

## Frontend and UI

- Tailwind CSS v4 (`@tailwindcss/postcss`)
- `tw-animate-css`
- `class-variance-authority`, `clsx`, `tailwind-merge`
- shadcn setup (`components.json`, radix-vega style)
- Icons: `lucide-react`

## Data and Web3 Libraries

- `ethers` 6.16.0
- `swr` 2.4.1 (installed, currently not active in hooks)
- `zod` 4.3.6 for env validation
- `date-fns` (installed)

## Tooling

- ESLint 10 with `eslint-config-next` (`core-web-vitals` + TypeScript)
- Prettier 3.8.1
- TypeScript 5
- npm scripts:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run lint`
  - `npm run lint:check`
  - `npm run lint:fix`

## Current Stack Notes

- README stack section references Next.js 14 + React 18, but package versions are Next.js 16 + React 19.
- `viem` is referenced in docs as an option, but not currently installed.
