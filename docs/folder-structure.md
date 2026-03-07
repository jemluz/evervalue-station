## Current Folder Tree

General project folder structure (as it exists now):

```text
.
├── .github/
│   └── ISSUE_TEMPLATE/
│   └── copilot-instructions.md         # Copilot agent entry point
├── .next/                              # Next.js build output (generated)
├── docs/                               # General documentation
│   ├── imgs/
│   └── reference/                      # Just reference
├── public/
└── src/
    ├── app/                            # Next.js App Router
    ├── config/                         # Constants and env validation
    ├── hooks/                          # React hooks logic
    ├── lib/                            # Backend core (APIs and ABIs integration)
    │   ├── api/                        # API Clients / HTTP (web2)
    │   ├── blockchain/                 # RCP/chain calls (web3)
    │   └── utils/                      # Utils for backend
    └── types/                          # Shared TypeScript types
```
