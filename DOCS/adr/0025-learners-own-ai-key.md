# ADR-0025: The live tutor runs on the learner's own AI key

- **Status:** Accepted. API built 11 Nov (parts 1–5); the Account-page card is the team's (part 6)
- **Date:** 10 Nov 2026
- **Decided by:** Ashwani Kumar Puri (learners bring their own AI key; the code sandbox stays ours)
- **Links:** ADR-0026 (open source; no platform AI key), ADR-0003 (sandbox), ADR-0004 (grading), ADR-0010 (LLM), ADR-0015 (hints), ADR-0018 (data rights), ADR-0019 (lessons); changes ADR-0015's "Safety switch" for live calls

## Context
The live tutor (live hints, ADR-0015, and lesson notes, ADR-0019) sends learner data to the AI provider: the learner's code, the last run's result, and for notes their scores. The privacy policy (§5) allows that only on paid, no-training terms, so live calls wait for Gemini billing (`GEMINI_PAID`), and billing couldn't be set up. Until then every learner gets frozen hints or a general nudge, and no lesson notes.

Ashwani's original idea was "build your own teacher": AI-Tutor gives the skill path, the exercises, the grading and the harness around the model (system prompts, hint levels, the leak filter, caps). The learner brings the AI.

## Decisions made
1. **Learners bring their own AI key for the live tutor.** Live hints and lesson notes run on that key, on the learner's quota and under the learner's own terms with that provider. It's optional: without a key, the learner gets today's app, with frozen hints, a general nudge when there's none, and no notes.
2. **The live tutor runs only on learners' keys.** Live hints and notes never use a platform key, and the ₹500 monthly budget no longer applies to them. ADR-0026 (11 Nov) adds that shared content (frozen hints, lessons, exercises) lives as reviewed course files. `GEMINI_API_KEY` stays only as an operator's optional key for content tools (exercise and lesson generation), which never carry learner data; `GEMINI_PAID` still guards those.
3. **The code sandbox stays ours (E2B).** Grading runs the hidden tests inside the sandbox. If the sandbox were in the learner's own E2B account, they could read the hidden tests and the evidence behind mastery would mean nothing (ADR-0004). A run costs a few seconds of sandbox time, so this isn't where the cost is. Learners never need an E2B account.
4. **The harness stays on our server, whatever the model.** It covers the system prompts, the five hint levels, the hint ceiling from the fade stage, the leak filter (`solution-filter.ts`), level 5 as the stored answer, and the frozen fallback. The model only writes the text. A weak model gives weaker hints, but it can't give away more than the filter lets through.
5. **v1 providers: Google Gemini, OpenAI and OpenRouter.**
   - Each provider is a preset with a fixed base URL.
   - There's no custom URL: the server would fetch whatever address a learner typed (SSRF).
   - Two adapters cover the three presets: Gemini's own API, and one OpenAI-compatible adapter for OpenAI and OpenRouter.
   - Each preset has a default model (small and cheap, chosen when building, from the provider's current list). The learner may name another model of the same provider.
   - Live calls use plain text only, so no adapter needs JSON-schema output.
6. **One key per learner, encrypted at rest.**
   - Keys are stored with AES-256-GCM under a master key in the environment (`AI_KEY_SECRET`, 32 bytes). The learner's id is the associated data, so a key can't be moved to another account.
   - A key is decrypted only for a call. It's never sent back to the browser, never logged, and never in the data export.
   - The API shows the provider, the model, the key's last 4 characters and its status.
7. **A key is checked before it's stored.** Saving makes one tiny call to the provider. If it fails, the API answers `422 AI_KEY_INVALID` with the provider's reason (with the key itself removed from it), and nothing is stored.
8. **Failures fall back to the frozen hint, as today.**
   - If the provider refuses the key (401 or 403), the key is marked invalid and isn't called again until the learner saves a new one.
   - Any other failure (quota, overload, timeout) is recorded as the key's last error, and that request gets the frozen hint.
   - The account page shows the key's status and the last error.
9. **Caps.** The 20 live calls per learner per day (ADR-0015) stay: they protect the learner's own quota and our server. The ₹500 monthly budget is for the platform's spending, so calls on a learner's key don't count towards it. `llm_calls` records who paid for each call (`paid_by`: `platform` or `learner`) and logs a learner's calls at ₹0.
10. **Adults only.** Key entry is for learners 18 or older. Some providers' terms require that, and the pilot is adults only anyway. Under-18 learners keep frozen hints.

## Privacy and terms
- **Privacy policy §5:** the "AI model provider" row becomes "the AI provider you connect, with your own key, under your own account's terms with them". It gets the same note as the key form: a free key (for example Gemini's free tier) may let the provider use prompts to improve its products. Learners can see in their provider's terms whether that applies.
- **Providers page** (`packages/types/providers.json`): the Gemini row becomes "the AI provider you connect (optional)", with the same data column.
- **Data rights (ADR-0018):**
  - the export lists the provider, the model and when the key was added, never the key;
  - deleting the account deletes the key row;
  - the learner can remove the key at any time.
- **Terms of service §6** (AI content can be wrong) stays as it is. Add one line: the learner is responsible for their own provider account and its charges.

## Consequences
- Live hints and notes can start without Gemini billing. Each learner pays their provider, often nothing on a free key.
- Learners who don't add a key see no change, so the pilot doesn't depend on this.
- Hint quality now depends on the learner's model. Research numbers that compare live and frozen hints should record the provider and model (already in `llm_calls`).
- Storing learners' keys makes us responsible for them: the master key goes in Render's secrets, and if it leaks, every stored key has to be treated as exposed (`breach-response-plan.md`).
- Not in v1: a custom base URL (local models, other OpenAI-compatible hosts), more than one key per learner, Anthropic's own API, and an MCP server that lets a learner's own AI client be the tutor.

## Build plan
Small parts, each tested before the next. API parts follow test-first, as the rest of the API does.

| Part | What | Where | Checked by |
|---|---|---|---|
| 1 | **Key storage.** Table `ai_keys`: `user_id` (primary key, cascades on delete), `provider`, `model`, `key_ciphertext`, `key_iv`, `key_tag`, `key_last4`, `status` (`ok`/`invalid`), `last_error`, `last_used_at`, `created_at`. A new migration adds `llm_calls.paid_by`. `AI_KEY_SECRET` is added to `env.ts`, optional, so the live tutor stays off without it. Encrypt and decrypt helpers in `shared/crypto/secret-box.ts` | `schema/identity.ts`, `schema/analytics.ts`, new migration, `config/env.ts` | Round trip; wrong learner id fails; tampered ciphertext fails |
| 2 | **Adapters.** `geminiProvider` gets a key-taking form (`geminiWith(key)`). `openai-compatible-provider.ts` covers the OpenAI and OpenRouter presets. Both log to `llm_calls` with `paid_by` and remove the key from any error text | `infrastructure/llm/` | Mocked `fetch`: request shape per preset, text out, 401 seen as "invalid key", key never in logs or errors |
| 3 | **Key API** in M1 (the learner's own setting). `GET /me/ai-key` returns provider, model, last 4, status and last error. `PUT /me/ai-key` takes `{ provider, model?, apiKey }`, checks the key, then stores it. `DELETE /me/ai-key` removes it. `PUT` is rate-limited (5 an hour) and needs age 18 or over | `m1_auth` routes, controller, schema, service, repository; `rate-limit.ts` | API tests: valid key stored, invalid key `422` and nothing stored, under-18 `403`, `GET` never returns the key, `DELETE` removes it |
| 4 | **Wire the live tutor.** An M1 service `liveTutorFor(userId)` returns the learner's provider and model, or nothing. `requestHint` and `lessonNote` use it instead of the platform Gemini key and `geminiReady()`. A 401/403 marks the key invalid, any other failure sets `last_error`, and either way the frozen hint is served. Learner-paid calls are left out of `spentThisMonthInr` | `m8_socratic/services/hints.service.ts`, `lesson-note.service.ts`, `llm-log.ts` | Existing hint and note tests still pass. New: no key gives frozen; a key gives live through the fake provider; a refused key gives frozen and the key marked invalid; the daily cap still applies |
| 5 | **Privacy, data rights, docs.** The export includes the key's metadata and erasure removes it. Update policy §5, `providers.json`, terms §6 and the ADR index. ADR-0015's "Safety switch" points here | `data-export.service.ts`, `erasure.service.ts`, `DOCS/legal/`, `packages/types/providers.json`, `DOCS/adr/README.md` | Export test (no key in it), erasure test |
| 6 | **Web.** Contract types in `packages/types` and client calls in `features/account/api.ts`. The "Your AI key" card on the Account page is the team's screen: they build it in their design, and we help if they want. It shows the provider picker, the model, the key field, the free-key note with a link to get a key, status, last 4, last error and Remove | `packages/types`, `apps/web/src/features/account/` | Playwright: add a key on a local test account, see the status, remove it |
| 7 | **Ship.** Generate `AI_KEY_SECRET` (`openssl rand -base64 32`) and add it to Render's secrets. Run the migration. Then a real end-to-end check on a local `@test.dev` account with a free Gemini key: live hint, lesson note, key removed | Render, Supabase | Manual run, `llm_calls` rows with `paid_by = learner` |

## Open (Ashwani's to decide; v1 uses the value shown)
| Question | v1 |
|---|---|
| Daily live-call cap for a learner's own key | 20, as now |
| Prompt learners to add a key, and where | A line on the hint panel when a frozen hint is served: "Add your AI key for hints about your own code" |
