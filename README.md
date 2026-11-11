# Vishanti

Learn programming by writing real code, with a tutor that helps you less as you get better.

*Formerly AI Tutor: the code and its packages (`@ai-tutor/*`) still use that name.*

Vishanti maps a course into a graph of skills. It measures what you can read and write from your graded runs, picks the next exercise for you, and gives hints only when you ask: five levels, from a nudge to the answer. As a skill sinks in, the help fades, until you write solutions from a blank page.

**Bring your own AI.** Add a key from Google Gemini, OpenAI or OpenRouter and the live tutor writes hints about *your* code, on your own account. Without a key you still get every lesson, exercise, graded run and ready-made hint. Your code is always graded in our sandbox, so you never need anything but a browser.

- **Courses today:** C++ basics (20 skills) and data structures & algorithms (49 skills), with Python coming next ([ADR-0026](DOCS/adr/0026-open-source-any-programming-skill.md)).
- **Every exercise is proven** in the sandbox before anyone sees it, hidden tests included.
- **Free for non-commercial use**, source-available ([license](#license)).

If Vishanti helps you, please [sponsor the project](https://github.com/sponsors/Nidanos).

## How it's built

```text
apps/
  api/        Node.js 22 + Express 5 + TypeScript: modules M1–M13 (auth, skills, mastery, recommender, hints…)
  web/        Next.js: the learner's app
packages/
  types/      The API contracts both apps share (@ai-tutor/types)
DOCS/         Design (phase-2/MP3-System-Design.md), decisions (adr/), API (api/, spec/), legal
deploy/       Hosting guides: the hosted site, and running your own copy
```

PostgreSQL (Drizzle), Redis + BullMQ, E2B for running learners' code with our own judge, and your own AI key for the live tutor. The decisions behind each choice are in [DOCS/adr](DOCS/adr/README.md).

## Run it yourself

You need Node.js 22+, `pnpm`, Docker Desktop and an [E2B](https://e2b.dev) API key (it runs learners' code). An AI key is optional.

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env   # set the passwords, E2B_API_KEY, and AI_KEY_SECRET (openssl rand -base64 32)
pnpm install
pnpm db:up                                # Postgres and Redis in Docker
pnpm --filter @ai-tutor/api db:migrate
pnpm --filter @ai-tutor/api db:seed
pnpm --filter @ai-tutor/api exercises:verify   # runs every seeded exercise in the sandbox
pnpm --filter @ai-tutor/api lessons:seed
pnpm dev                                  # API on :3001, web on :3000
```

Sign up, then add your own AI key on the Account page for live hints. To run it on a server, see [deploy/README.md](deploy/README.md).

## Tests

```bash
pnpm --filter @ai-tutor/api test         # the API, against a test database next to the dev one
pnpm --filter @ai-tutor/web e2e          # Playwright, through every learner screen
pnpm typecheck
```

## Contributing

Bug fixes, new exercises and lessons, and new languages are all welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first: every contribution needs the [contributor license agreement](CLA.md). Report security problems privately, as [SECURITY.md](SECURITY.md) explains.

## License

**Source-available, free for non-commercial use.** It isn't "open source" in the OSI sense.

- **Code:** [PolyForm Noncommercial License 1.0.0](LICENSE.md). Anyone may use, change and share it for free for any non-commercial purpose, including personal study, teaching, schools and research.
- **Course content** (lessons, exercises, hints, skill maps): [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).
- **Commercial use**, or use for gain, needs a commercial license from Nidanos: write to hello@nidanos.com.

Copyright © 2026 Ashwani Kumar Puri, Aman Dogra and Aditi Tanwar (Nidanos).
