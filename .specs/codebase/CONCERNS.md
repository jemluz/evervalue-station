# EVA Station — Concerns Map

## Priority Concerns

1. **Documentation drift**
   - Docs describe API/blockchain client folders and live integrations that are not present in runtime code.
   - README stack versions differ from installed package versions.

2. **Prototype data in production paths**
   - Converter rates and health data are mocked.
   - SWR usage is documented/commented, but not active.

3. **Testing gap**
   - No automated tests for critical converter math and formatting.
   - Lint is the only automated quality gate.

4. **Metadata and scaffold leftovers**
   - App metadata still contains default "Create Next App" values in layouts.

5. **Design system consistency risks**
   - Most styling uses tokens/utilities, but there are isolated hardcoded values (e.g., specific hex color in header).

## Architectural Risks

- Health route defines a separate HTML/body layout, which can diverge from root-level behavior over time.
- No clear adapter boundary yet for moving from mock rates to live API clients.

## Recommended Sequence to Reduce Risk

1. Align docs and metadata with current implementation.
2. Introduce real data adapter interfaces behind existing hooks.
3. Add unit tests for conversion and formatting logic before switching to live APIs.
4. Activate SWR-based fetch/revalidation progressively with fallback handling.
