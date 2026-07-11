# EVA Station — Structure Map

## Top-Level Snapshot

```text
.
├── docs/
├── onboarding/
├── public/
├── src/
├── .github/
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── next.config.ts
```

## Source Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   ├── about-eva/page.tsx
│   ├── about-us/page.tsx
│   └── health/
│       ├── page.tsx
│       ├── layout.tsx
│       └── constants.ts
├── components/
│   ├── common/
│   ├── conversor/
│   ├── health/
│   └── ui/
├── config/
│   └── env.ts
├── hooks/
│   ├── useConversorController.ts
│   ├── useConversorRates.ts
│   └── useHealthCheck.ts
├── lib/
│   ├── constants.ts
│   ├── conversor.ts
│   ├── utils.ts
│   └── utils/
└── types/
    ├── conversor.ts
    └── health.d.ts
```

## Observations

- Current code in `src/lib` does not yet contain dedicated `api/` or `blockchain/` folders referenced in documentation.
- Health route has its own layout and metadata, separate from root layout.
