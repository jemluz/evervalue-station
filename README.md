# base-template

This template is focused mainly on documentation and project patterns, could be reused before define a stack.

## First of all! Check `config-files/` folder

The `config-files` folder only will work if you move them to root folder. They are grouped into a folder just to facilitate your initial orientation on this template (to avoid the risk of mixing files with same name when running a CLI command for example)

The template-files folder must die when you finished your environment preparation.

# To understand the project

Read `docs/` files.

## docs folder

The `docs/` folder explains the project's vision, architecture, conventions, and processes. Prefer concise pages that explain _why_ as well as _how_, and update documentation alongside code changes to keep it accurate and useful.

- Project purpose and scope (vision, goals, and audience).
- Architecture and domain concepts (high-level, stack-agnostic descriptions).
- Contributor and development guides (workflow, branching, PR requirements, code style).
- Decision records and RFCs (design trade-offs and rationale).
- UX/UI principles, API contracts, example usage, and how-to guides.

# To work in

Focus on: `docs/dev-workflow.md` to understand the dev workflow

## .github folder

The `.github` folder stores GitHub-specific configuration and workflow files that help standardize repository collaboration and automation. Common contents include:

- `ISSUE_TEMPLATE/` and `pull_request_template.md` to guide contributors when opening issues or PRs.
- `copilot-instructions.md` to give context to copilot agent.
