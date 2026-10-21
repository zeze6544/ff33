# Catalog inventory

Parts live in `src/data/parts.ts`. The build page configures them via the workshop docket
(`src/builder/build-board.tsx`) — not a 3D scene.

Statuses below are catalog completeness, not mesh fidelity.

| Area | Source |
|---|---|
| CPUs, coolers, boards, RAM, GPUs | `parts.ts` catalog |
| Storage, PSU, cases, fans | `parts.ts` catalog |
| Fitment / clash / scores | `issues`, `clash`, `score`, `drawOf` |
| UI | `pages/build.tsx` + `builder/build-board.tsx` |
