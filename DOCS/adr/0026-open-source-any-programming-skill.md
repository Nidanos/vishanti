# ADR-0026: Source-available, and a home for learning any programming skill

- **Status:** Accepted, being built for the MP3 viva on 14 Nov (scope below)
- **Date:** 11 Nov 2026
- **Decided by:** Ashwani Kumar Puri, with the team (public and free to use; only Nidanos may make money from it; sponsors; a clean public repository; learners bring their own AI; curated courses first, AI-drafted paths too; programming languages first; the team builds the screens; a hosted site plus self-hosting)
- **Links:** ADR-0002 (languages), ADR-0003 (sandbox), ADR-0004 (grading), ADR-0005 (frozen content), ADR-0012 (placement), ADR-0016 (generation), ADR-0019 (lessons), ADR-0025 (the learner's own AI key)

## Context
AI-Tutor teaches two courses, C++ basics and DSA, in one language. All the AI ran on the platform's Gemini key, and that key never got working paid or free capacity: `hints:generate --free-tier` (10 Nov) was refused for every exercise. ADR-0025 moved the live tutor to the learner's own key. The team has now decided to open-source the project and grow it into the place to learn any programming skill.

Three things make that possible:
- **Most of the engine already doesn't depend on C++.** The skill graph, mastery, the recommender, fading help and sessions are all language-neutral. The sandbox contract (`sandbox-provider.ts`) takes files, a compile command and a run command.
- **C++ is wired in only in a few places:** `toolchains.ts`, the E2B template, the seed files, and the way exercises build their tests (`cpp-templates.ts`).
- **The content is TypeScript code** (`seed/*.ts`). That's fine for us but a barrier for contributors, and it's unsafe to run from a stranger's pull request.

## Decisions made
1. **Source-available, with a hosted site and self-hosting.** The team runs one public site where anyone signs up and adds their own AI key. Anyone can also run their own copy from the repository with Docker and their own E2B key, for free, for any non-commercial purpose (license below).
2. **No AI runs on a platform key.** This changes ADR-0025's decision 2.
   - Learners' keys run the live tutor and their own AI-drafted paths.
   - Content everyone shares (lessons, frozen hints, exercises) is written by people, or drafted by a maintainer with their own key on their own machine, then checked and committed as files in a course pack.
   - The hosted site needs no AI key or AI budget. Every self-hosted copy gets the same frozen hints and lessons. An operator may still set their own `GEMINI_API_KEY` for the generation tools, which never send learner data.
3. **Courses are packs of plain files** in `courses/<slug>/`, with no code we would run from a contributor. A checker proves every pack before it's served (the format is below).
4. **Curated packs first, AI-drafted paths too.** Packs are reviewed and checked, and they're what the catalogue shows. A learner can also have their own AI draft a path for a programming skill no pack covers. It's private to that learner and labelled "Drafted by your AI, not reviewed". Every drafted exercise still has to pass the sandbox before it's served (ADR-0016's checks).
5. **Programming languages first.** A skill is in scope when it's learned by writing code we can grade. The order is Python, then JavaScript/TypeScript, Java and Go. SQL comes later because it needs its own judge (comparing result sets). Non-coding tech skills are out of v1.
6. **The team builds the screens** (list below). We build the API, the shared types, the pack format, the checker and the docs, and help with the screens when asked.
7. **The code sandbox stays ours** on the hosted site (ADR-0025, decision 3). A self-hosted copy uses its operator's E2B key. Learners never need one.

## Course pack format
```
courses/<slug>/
  course.yaml                 slug, title, description, languages (first = default), placement: yes/no
  skills.yaml                 slug, name, description, type, difficulty, needs ("course/slug" across courses), further-reading links
  lessons/<skill>/<level>.md  new | building | strong; front matter holds the example's exact output and the quick check (ADR-0019)
  exercises/<skill>/<rung>-<n>/
    exercise.md               title, rung, limits, the task (Markdown)
    starter.<ext>             rung 1: the program to read; otherwise the editor's starting code
    reference.<ext>           passes every test
    tests.yaml                cases as calls in the language ("twice(3)") or stdin; the first is the sample; expected
                              outputs come from running the reference, never typed in
    brute.<ext>, gen.yaml     optional: a slow solution and seeded large tests (ADR-0020)
    hints.md                  levels 1–4 (level 5 is always the reference)
  placement/                  optional placement items (ADR-0012); without them learners start at the course's first skills
```
- **`pnpm course:check <slug>`** checks:
  - the files against their schemas;
  - the graph: no cycles, and every skill it needs exists;
  - every reference against its tests in the sandbox, and the brute force against the reference on medium tests;
  - the leak filter on every hint;
  - every lesson's example output.
- **`pnpm course:import`** loads checked packs into the database and is safe to re-run. Changed content gets a new `content_version`, never an edit (ADR-0005), so learners' past evidence keeps pointing at what they actually saw.
- **Per language, in code** (`languages/<code>/`):
  - a toolchain entry: compile and run commands, file extension, version;
  - the harness writer, which turns `tests.yaml` calls into a runnable test program in that language;
  - its E2B template;
  - the editor mode.
  Adding a language is one folder plus a `<language>-basics` pack.
- **Pull requests from forks:** CI runs the checker from `main` and reads the pack only as data. The pack's code runs only inside E2B. That way a stranger's pull request never runs on the CI machine, which holds the E2B key.

## Build plan
Each phase ships on its own, and the site works after every one.

| Phase | What | Done when |
|---|---|---|
| 0 Open-source ready | Decide the license (below) and get Aman's and Aditi's written agreement. Run `gitleaks` over the full history. Start the public repository from a clean snapshot, with private docs kept in the private one. Add a contributor README, `CONTRIBUTING.md` (with the course pack guide), `CODE_OF_CONDUCT.md`, `SECURITY.md`, issue templates, a complete `.env.example`, and a `docker compose up` self-host guide | A stranger can clone, run and log in from the README alone |
| 1 The learner's own AI key | ADR-0025's seven parts, with decision 2 as changed here: live hints and notes run only on the learner's key; `GEMINI_API_KEY` stays only as an operator's optional key for content tools | Live hint and lesson note on a free Gemini key, end to end |
| 2 Course packs | Pack schemas, `course:check`, `course:import`, the CI check. A one-off exporter rewrites C++ basics and DSA from `seed/*.ts` into packs. A test proves the import gives the same rows as today's seed, then the TS seeds are deleted | Both courses served from packs; CI checks a changed pack |
| 3 Python | `languages/python/`: toolchain (CPython 3.13), E2B template, harness writer, editor mode. A `python-basics` pack (20 skills, like C++ basics). DSA offered in Python once its references are ported | A learner picks Python, takes its placement test and practises with graded runs |
| 4 AI-drafted paths | A learner names a programming skill. Their AI drafts a small skill graph, checked as a DAG within size limits and in a language we support. Lessons and exercises are drafted per skill as the learner reaches it, each exercise verified in the sandbox first (ADR-0016). Stored as a private course owned by the learner, labelled unchecked. The hosted site caps sandbox time per learner per day, since that's our cost | A path drafted, practised and graded on a learner's own key |
| 5 More languages and contributors | JavaScript/TypeScript, Java and Go, each a language folder plus a basics pack. Contributor docs from real pull requests. "Submit my drafted path for review" turns a drafted path into a pack pull request. SQL with its own judge | Packs in four or more languages, at least one from an outside contributor |

## Screens for the team (contracts come from us, phase by phase)
| Phase | Screen |
|---|---|
| 0 | The open-source landing: what it is, "Bring your own AI key", GitHub link, how to contribute or self-host |
| 1 | "Your AI key" card on the Account page (ADR-0025, part 6). The hint panel line: "Add your AI key for hints about your own code" |
| 2 | Course catalogue: every pack, filter by language, a skill count, and checked status |
| 3 | A language picker for a course offered in several languages; the code editor in each language |
| 4 | "Draft a path with your AI": name a skill, pick a language, watch the draft; an "Unchecked" badge everywhere a drafted course shows |

## Consequences
- The hosted site runs with no AI bill. Its costs are hosting, the database and sandbox time.
- Content quality rests on review and the checker, not on a model. The same rule already holds for C++ basics and DSA.
- More languages mean more E2B templates to build and keep current. Each toolchain version is part of `content_version`, so upgrading one means re-checking that language's packs (ADR-0002).
- Mastery numbers from AI-drafted paths are weaker evidence than from checked packs. Research reports should keep them apart.
- `feat/free-tier-hints` is superseded: frozen hints become `hints.md` files in packs. Its timeout and retry code can move into the drafting tool when that's built.
- Not in v1: non-coding skills, paid plans, organisations' private packs (`courses.org_id` exists for later), and an MCP server for learners' own AI clients.

## License, sponsors and the public repository (decided 11 Nov)
- **Code: PolyForm Noncommercial 1.0.0** (already `LICENSE.md`). Anyone may use, change and share it for free for any non-commercial purpose, including individuals, schools and research. Only Nidanos may use it commercially, or sell a commercial license. It isn't "open source" by the OSI definition, so the project calls itself **source-available, free for non-commercial use**.
- **Course packs: CC BY-NC-SA 4.0**, the same terms for content: free to use and share with credit, non-commercial, with changes shared alike.
- **Contributions need a contributor license agreement** (`CLA.md`). A contributor keeps their copyright and grants Nidanos the right to license their work commercially too. Without it, a commercial license couldn't include outside contributions.
- **Sponsors:** GitHub Sponsors through `.github/FUNDING.yml`, plus a line in the README.
- **Public repository: a clean snapshot without history.** The history holds private documents (the founders' agreement, the college NOC letter, reports). `scripts/public-snapshot.sh` copies the tree without the private folders, and `gitleaks` scans the result before it goes public. The private repository stays as the archive.

## Scope for the MP3 viva (14 Nov)
| Day | Build |
|---|---|
| 11 Nov | Phase 1 (ADR-0025 parts 1–5, the API). Phase 0's license, CLA, sponsors, README, CONTRIBUTING and the snapshot script |
| 12 Nov | Phase 3 cut down: Python's toolchain, sandbox template and harness, and a small `python-basics` course of about 5 skills, seeded like today's courses |
| 13 Nov | Spare time, deploy, the viva script and PPT notes |
| After 14 Nov | Phase 2 (packs, moving C++ basics and DSA), phase 4, phase 5, the full `python-basics` |

## Open
| Question | Recommendation |
|---|---|
| Who writes the full `python-basics` pack | Me, as with the C++ lessons (ADR-0019), reviewed by the team |
| Sandbox cap per learner on the hosted site for drafted paths | 100 runs a day |
| Project name and domain for the public site | Open |
