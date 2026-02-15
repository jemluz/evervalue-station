# Copilot Instructions – Project Template

## Purpose of This Repository

This repository is a **template for documentation and project standards**, intended to be used **before defining a technology stack**.

Its goal is to:

- Clarify vision, principles, and intent
- Define architectural thinking independent of tools
- Establish writing, structure, and collaboration standards
- Serve as a shared cognitive baseline for humans and AI agents

All technical choices are intentionally deferred.

---

## Architecture Overview (Agnostic)

This project is structured around **conceptual layers**, not implementation details.

### Conceptual Layers

- **Vision & Intent**  
  Why the project exists, what problem it addresses, and what values guide decisions.
- **Domain & Content**  
  Core concepts, rules, language, and mental models that are independent of technology.
- **Structure & Flow**  
  How information, features, or experiences are organized and related.
- **Interaction (Optional / Future)**  
  Any form of user, system, or collaborator interaction, if applicable.

These layers should remain valid regardless of framework, language, or platform.

---

## Repository Structure

This repository prioritizes **documentation-first design**.

- `docs/`  
  Contains markdown files describing:

  - Vision
  - Architecture (conceptual, not technical)
  - UI / UX principles
  - Writing and naming conventions
  - Decision records (if applicable)

- `.github/`  
  Defines collaboration standards:

  - Copilot / agent instructions
  - Issue templates
  - Pull request templates
  - Contribution guidelines

- Root configuration files  
  General formatting and hygiene rules (editor, ignores), intentionally minimal and stack-agnostic.

No source code structure is assumed.

---

## Developer & Contributor Workflow (Conceptual)

- Read documentation **before** proposing solutions
- Treat documentation as a **first-class artifact**
- Prefer clarifying intent over implementing features
- Update documentation when assumptions change
- Avoid premature technical decisions

This repository may later be extended with:

- A chosen stack
- Build or execution scripts
- Runtime configuration

Until then, all contributions should remain tool-independent.

---

## Conventions and Patterns

### Documentation

- Use clear, concise language
- Prefer simple sentences and explicit reasoning
- Avoid unnecessary jargon
- Explain _why_ before _how_

### Naming

- Names should reflect meaning, not implementation
- Favor conceptual clarity over technical precision
- Be consistent across documents

### Tone

- Clear and direct
- Reflective and intentional
- Accessible to both technical and non-technical readers
- Avoid intimidation or excessive formalism

---

## UI / Experience Principles (Abstract)

When applicable, interfaces or experiences should favor:

- Clarity over cleverness
- Simplicity over density
- Reading and understanding over decoration
- Purposeful constraints

Specific visual systems or libraries should be defined later, in context.

---

## Integration Points (Deferred)

- No frameworks, languages, or platforms are assumed
- No external services or APIs are defined
- No runtime behavior is specified

All integration decisions are intentionally postponed until:

- The problem space is well understood
- The documentation is stable
- The conceptual architecture is validated

---

## Source of Truth

- `README.md` → High-level overview
- `docs/` → Vision, principles, architecture, guidelines
- `.github/` → Collaboration and contribution standards

If documentation and implementation ever diverge, **documentation takes precedence**.
