# Contributing to Vishanti

Thank you for helping. This page covers how to set up, the rules every change follows, and how a pull request gets in.

## Before you start

- **Sign the CLA.** Every contribution needs the [contributor license agreement](CLA.md): you keep your copyright, and Nidanos may license your work, including commercially. Tick the box in the pull request template to agree.
- **Bigger changes start as an issue**: a new language, a new course, or a change to how grading, mastery or hints work. Decisions are recorded in [DOCS/adr](DOCS/adr/README.md); a change that alters one needs a new ADR.
- Set up as the [README](README.md#run-it-yourself) explains.

## Rules for every change

These are the project's own rules (also in `CLAUDE.md`):

- **Minimal.** If it can be done in 3 lines, don't write 30. No dead or "just in case" code.
- **DRY and KISS.** Share a helper only when the repetition is real. Prefer a plain function or a library feature to a clever abstraction.
- **Modular.** Small files with one job. API modules (`apps/api/src/modules/m1_…m13_`) talk through each other's services, never each other's tables.
- **Readable.** Clear names over comments; comment only the *why*.
- **Tested.** The API is built test-first. API tests are named `<module>-api.test.ts` and run against a real test database. Run the tests and `pnpm typecheck` before you push.
- **Migrations:** never edit one that has been applied; generate a new one (`pnpm --filter @ai-tutor/api db:generate`). Database columns are `snake_case`.
- **Commits:** `type: description`, where the type is `feat`, `fix`, `refactor`, `docs`, `test` or `chore`.

## Content: exercises, lessons and hints

Course content is licensed [CC BY-NC-SA 4.0](LICENSE-CONTENT.md), and it must be your own words and code. Link to outside material as further reading; never copy it in.

- Every exercise has a reference solution that passes all its tests. Hidden tests take their expected output from running the reference, never from typing it in.
- Run `pnpm --filter @ai-tutor/api exercises:verify` before opening the pull request: it runs each new exercise in the sandbox.
- Hints never give the solution away. Level 5 is always the reference, and a hint that copies its code is rejected by the leak filter.

Courses are moving to plain-file course packs (`courses/<slug>/`, [ADR-0026](DOCS/adr/0026-open-source-any-programming-skill.md)). Until that lands, content lives in `apps/api/src/infrastructure/database/seed/`.

## Pull requests

1. Fork, then branch from `main`.
2. Keep each pull request to one change, with tests.
3. Fill in the template, including the CLA box.
4. CI checks types, tests and the web build. A maintainer reviews, and may ask for changes.

## Code of conduct

Be kind and assume good faith: see [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
