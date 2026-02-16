# Copilot Instructions – EVA Station

## Overview

See [README.md](../README.md) for the project overview, goals, target user, and out-of-scope items.

---

## AI Brief

Short context for AI agents. For full details, use the canonical docs linked below.

### Project Summary

- Product: EVA Station, on-chain analysis dashboard for EVA (Arbitrum).
- Goal: real-time conversion and pricing with phased metrics expansion.
- Stack: Next.js 14, TypeScript, Tailwind, Ethers/Viem.

### Developer Context

- Frontend: React/Next/TypeScript experience.
- Backend/Web3: needs guidance and step-by-step explanations.

### Guidance for Suggestions

- Prefer TypeScript and custom hooks for reusable logic.
- Keep API calls in clients; UI components should not fetch.
- Include error handling and loading states.

---

## Decision Tree (Docs)

```mermaid
flowchart TD
  A[Start here] --> B{What are you changing?}
  B -->|Vision or scope| C[docs/vision.md]
  B -->|Feature scope| D[docs/features.md]
  B -->|Architecture or concepts| E[docs/architecture.md]
  B -->|Integrations or APIs| F[docs/api-integration.md]
  B -->|Workflow or contribution| G[docs/dev-workflow.md]
  B -->|Frontend roadmap| H[docs/roadmap-frontend.md]
  B -->|Backend roadmap| I[docs/roadmap-backend.md]
  B -->|Folder structure| J[docs/folder-structure.md]
  B -->|Data structure| K[docs/data-structure.md]
  B -->|Main components| L[docs/main-components.md]
  B -->|Performance| M[docs/performance.md]
  B -->|Security or env| N[docs/security.md]
```

Quick links by decision level:

- Vision and scope: [docs/vision.md](../docs/vision.md)
- Feature scope: [docs/features.md](../docs/features.md)
- Architecture and concepts: [docs/architecture.md](../docs/architecture.md)
- Integrations and APIs: [docs/api-integration.md](../docs/api-integration.md)
- Workflow and contribution: [docs/dev-workflow.md](../docs/dev-workflow.md)
- Folder structure: [docs/folder-structure.md](../docs/folder-structure.md)
- Data structure: [docs/data-structure.md](../docs/data-structure.md)
- Main components: [docs/main-components.md](../docs/main-components.md)
- Performance: [docs/performance.md](../docs/performance.md)
- Security and env: [docs/security.md](../docs/security.md)

- Frontend roadmap: [docs/roadmap-frontend.md](../docs/roadmap-frontend.md)
- Backend roadmap: [docs/roadmap-backend.md](../docs/roadmap-backend.md)
